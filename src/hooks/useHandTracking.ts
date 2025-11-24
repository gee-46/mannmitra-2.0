import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

export type HandDirection = 'up' | 'down' | 'left' | 'right' | 'center';

interface Keypoint {
  x: number;
  y: number;
  name?: string;
  score?: number;
}

export const useHandTracking = () => {
  const [detector, setDetector] = useState<handPoseDetection.HandDetector | null>(null);
  const [direction, setDirection] = useState<HandDirection>('center');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const requestRef = useRef<number>();
  const retryCountRef = useRef(0);
  const lastDirectionRef = useRef<HandDirection>('center');
  const stabilityCountRef = useRef(0);
  const MAX_RETRIES = 2;
  const STABILITY_THRESHOLD = 2;

  // Initialize hand tracking only when explicitly enabled
  const initializeHandTracking = async () => {
    if (detector) return; // Already initialized
    
    setIsLoading(true);
    retryCountRef.current = 0;
    
    const attemptInit = async () => {
      try {
        console.log('Initializing hand tracking...');
        
        // Initialize TensorFlow
        try {
          await tf.setBackend('webgl');
          await tf.ready();
        } catch {
          await tf.setBackend('cpu');
          await tf.ready();
        }

        // Load model with timeout
        const modelPromise = (async () => {
          const model = handPoseDetection.SupportedModels.MediaPipeHands;
          const config: any = {
            runtime: 'mediapipe',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1/wasm',
            modelType: 'lite'
          };
          return handPoseDetection.createDetector(model, config);
        })();

        const detector = await Promise.race([
          modelPromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Model load timeout')), 8000)
          )
        ]) as handPoseDetection.HandDetector;

        setDetector(detector);

        // Get camera
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' }
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        }

        if (!videoRef.current) throw new Error('Video element missing');
        videoRef.current.srcObject = stream;

        // Wait for video
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Video timeout')), 5000);
          const handler = () => {
            clearTimeout(timeout);
            videoRef.current?.removeEventListener('loadedmetadata', handler);
            resolve();
          };
          videoRef.current?.addEventListener('loadedmetadata', handler);
          videoRef.current?.play().catch(() => {});
        });

        setIsLoading(false);
        setError(null);
        console.log('✓ Hand tracking ready');
      } catch (err: any) {
        const msg = err?.message || String(err);
        console.error('Hand tracking error:', msg);
        
        retryCountRef.current += 1;
        if (retryCountRef.current < MAX_RETRIES) {
          console.log(`Retrying (${retryCountRef.current}/${MAX_RETRIES})...`);
          setTimeout(attemptInit, 1500);
        } else {
          setError('Hand tracking failed. Use Keyboard Mode instead.');
          setIsLoading(false);
        }
      }
    };

    attemptInit();
  };

  // Cleanup
  const shutdown = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setDetector(null);
    setDirection('center');
  };

  const calculateHandDirection = (keypoints: Keypoint[]): HandDirection => {
    const wrist = keypoints[0];
    const indexTip = keypoints[8];
    if (!wrist || !indexTip) return 'center';

    if ((wrist.score && wrist.score < 0.5) || (indexTip.score && indexTip.score < 0.5)) {
      return 'center';
    }

    const dx = indexTip.x - wrist.x;
    const dy = indexTip.y - wrist.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) return 'center';

    const angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    const norm = (angle + 360) % 360;

    if (norm < 45 || norm >= 315) return 'up';
    if (norm < 135) return 'right';
    if (norm < 225) return 'down';
    if (norm < 315) return 'left';
    return 'center';
  };

  const detectHands = async () => {
    if (detector && videoRef.current?.readyState === 4) {
      try {
        const hands = await detector.estimateHands(videoRef.current, { flipHorizontal: true });
        if (hands.length > 0) {
          const dir = calculateHandDirection(hands[0].keypoints as Keypoint[]);
          if (dir === lastDirectionRef.current) {
            stabilityCountRef.current += 1;
            if (stabilityCountRef.current >= STABILITY_THRESHOLD) setDirection(dir);
          } else {
            lastDirectionRef.current = dir;
            stabilityCountRef.current = 0;
          }
        } else {
          setDirection('center');
          lastDirectionRef.current = 'center';
          stabilityCountRef.current = 0;
        }
      } catch (err) {
        console.error('Detection:', err);
        setDirection('center');
      }
    }
    requestRef.current = requestAnimationFrame(detectHands);
  };

  useEffect(() => {
    if (detector) {
      requestRef.current = requestAnimationFrame(detectHands);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [detector]);

  return { 
    videoRef, 
    direction, 
    isLoading, 
    error, 
    initializeHandTracking,
    shutdown,
    isReady: !!detector
  };
};
