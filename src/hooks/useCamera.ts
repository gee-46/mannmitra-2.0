import { useEffect, useRef, useState } from 'react';
import { cameraManager, CameraConfig } from '../lib/camera';

export interface UseCamera {
  videoRef: React.RefObject<HTMLVideoElement>;
  isReady: boolean;
  error: string | null;
  stream: MediaStream | null;
  stop: () => void;
  restart: () => Promise<void>;
}

/**
 * React hook for camera management
 * Handles initialization, error recovery, and cleanup
 */
export const useCamera = (config?: CameraConfig): UseCamera => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const initCamera = async () => {
    try {
      setError(null);
      console.log('🎥 Starting camera initialization...');

      const result = await cameraManager.initializeCamera(config);
      setStream(result.stream);

      if (videoRef.current) {
        videoRef.current.srcObject = result.stream;
        // Set ready state when video is actually playing
        videoRef.current.onplay = () => {
          console.log('✓ Camera stream ready');
          setIsReady(true);
        };
      }
    } catch (err: any) {
      const userMessage = err.userMessage || err.message || 'Camera initialization failed';
      console.error('Camera error:', userMessage);
      setError(userMessage);
      setIsReady(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      cameraManager.stopCamera(stream);
      setStream(null);
      setIsReady(false);
    }
  };

  const restartCamera = async () => {
    stopCamera();
    await new Promise(resolve => setTimeout(resolve, 500));
    await initCamera();
  };

  useEffect(() => {
    initCamera();

    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    isReady,
    error,
    stream,
    stop: stopCamera,
    restart: restartCamera
  };
};

export default useCamera;
