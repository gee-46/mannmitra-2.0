/**
 * Camera Utility Module
 * Provides robust camera initialization, permission handling, and stream management
 */

export interface CameraConfig {
  width?: number;
  height?: number;
  frameRate?: number;
  facingMode?: 'user' | 'environment';
}

export interface CameraResult {
  stream: MediaStream;
  video: HTMLVideoElement;
  stop: () => void;
  constraints: MediaStreamConstraints;
}

class CameraManager {
  private activeStream: MediaStream | null = null;
  private permissionStatus: PermissionStatus | null = null;

  /**
   * Check if camera permissions are granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      if (!navigator.permissions?.query) {
        console.log('Permissions API not supported');
        return true; // Assume allowed if API not available
      }

      const permission = await navigator.permissions.query({ name: 'camera' as any });
      this.permissionStatus = permission;

      permission.onchange = () => {
        console.log('Camera permission status changed:', permission.state);
      };

      return permission.state === 'granted';
    } catch (err) {
      console.warn('Could not check permissions:', err);
      return true; // Assume allowed on error
    }
  }

  /**
   * Get available camera devices
   */
  async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (err) {
      console.error('Failed to enumerate devices:', err);
      return [];
    }
  }

  /**
   * Initialize camera with intelligent fallback
   */
  async initializeCamera(config: CameraConfig = {}): Promise<CameraResult> {
    const {
      width = 320,
      height = 240,
      frameRate = 30,
      facingMode = 'user'
    } = config;

    try {
      console.log('🎥 Initializing camera with config:', config);

      // Build constraints with fallbacks
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          width: { ideal: width },
          height: { ideal: height },
          frameRate: { ideal: frameRate },
          facingMode
        }
      };

      // Request camera access
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✓ Camera access granted');
      } catch (err: any) {
        console.warn('Initial camera request failed:', err.name, err.message);

        // Fallback 1: Try without frameRate constraint
        if (err.name === 'OverconstrainedError') {
          console.log('Trying without frameRate constraint...');
          const videoConstraints = constraints.video as any;
          if (videoConstraints && videoConstraints.frameRate) {
            delete videoConstraints.frameRate;
          }
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        }
        // Fallback 2: Try basic video-only
        else {
          console.log('Trying basic video-only constraint...');
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          });
        }
      }

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('muted', 'true');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('controls', 'false');

      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video stream timeout - camera may be blocked or unavailable'));
        }, 5000);

        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          video.play().catch(err => {
            console.warn('Auto-play failed:', err);
            // Video element created, user can click to play manually
          });
          resolve();
        };

        video.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Video element error'));
        };
      });

      this.activeStream = stream;

      console.log(
        `✓ Camera initialized: ${video.videoWidth}x${video.videoHeight}`,
        stream.getVideoTracks()[0]?.getSettings()
      );

      // Return result with cleanup function
      return {
        stream,
        video,
        constraints,
        stop: () => this.stopCamera(stream)
      };
    } catch (err: any) {
      const errorName = err.name || 'Unknown';
      const errorMsg = err.message || String(err);

      console.error('❌ Camera initialization failed:', {
        name: errorName,
        message: errorMsg,
        cause: err.cause
      });

      // Provide user-friendly error messages
      let userMessage = 'Camera initialization failed';
      if (errorName === 'NotAllowedError') {
        userMessage = 'Camera permission denied. Please grant camera access in browser settings.';
      } else if (errorName === 'NotFoundError') {
        userMessage = 'No camera found. Please check if camera is connected.';
      } else if (errorName === 'OverconstrainedError') {
        userMessage = 'Camera constraints not supported. Try with basic settings.';
      } else if (errorName === 'TypeError') {
        userMessage = 'Camera API not available. Your browser may not support this.';
      } else if (errorMsg.includes('timeout')) {
        userMessage = 'Camera access timeout. The camera may be in use by another app.';
      }

      throw {
        name: errorName,
        message: errorMsg,
        userMessage,
        originalError: err
      };
    }
  }

  /**
   * Stop camera stream
   */
  stopCamera(stream?: MediaStream): void {
    const targetStream = stream || this.activeStream;
    if (!targetStream) return;

    targetStream.getTracks().forEach(track => {
      track.stop();
      console.log(`✓ Stopped ${track.kind} track`);
    });

    if (!stream) {
      this.activeStream = null;
    }
  }

  /**
   * Get camera settings/capabilities
   */
  getCameraSettings(stream: MediaStream): any {
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return null;

    return {
      settings: videoTrack.getSettings?.(),
      capabilities: videoTrack.getCapabilities?.(),
      label: videoTrack.label,
      state: videoTrack.readyState
    };
  }

  /**
   * Test if camera is working
   */
  async testCamera(timeoutMs: number = 2000): Promise<boolean> {
    try {
      const result = await this.initializeCamera();
      await new Promise(resolve => setTimeout(resolve, timeoutMs));
      result.stop();
      return true;
    } catch (err) {
      console.error('Camera test failed:', err);
      return false;
    }
  }

  /**
   * Get all active streams
   */
  getActiveStream(): MediaStream | null {
    return this.activeStream;
  }

  /**
   * Cleanup all resources
   */
  cleanup(): void {
    if (this.activeStream) {
      this.stopCamera();
    }
    if (this.permissionStatus) {
      this.permissionStatus.onchange = null;
    }
  }
}

// Export singleton instance
export const cameraManager = new CameraManager();

/**
 * Helper function for simple one-off camera initialization
 */
export async function initializeCamera(config?: CameraConfig): Promise<CameraResult> {
  return cameraManager.initializeCamera(config);
}

/**
 * Helper function to stop camera
 */
export function stopCamera(stream?: MediaStream): void {
  cameraManager.stopCamera(stream);
}

/**
 * Helper function to check permissions
 */
export async function checkCameraPermissions(): Promise<boolean> {
  return cameraManager.checkPermissions();
}

/**
 * Helper function to test camera availability
 */
export async function testCamera(): Promise<boolean> {
  return cameraManager.testCamera();
}

export default cameraManager;
