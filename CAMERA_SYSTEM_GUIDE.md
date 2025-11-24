# Camera System Usage Guide

## Overview

MannMitra now has a robust, reusable camera system with:
- ✅ Intelligent fallback constraints
- ✅ Permission checking
- ✅ Error recovery with user-friendly messages
- ✅ Stream management
- ✅ Camera capability detection
- ✅ React hooks integration

---

## Quick Start

### Option 1: Use React Hook (Recommended for Components)

```typescript
import { useCamera } from '@/hooks/useCamera';

export function MyComponent() {
  const { videoRef, isReady, error, stop, restart } = useCamera({
    width: 320,
    height: 240,
    frameRate: 30
  });

  if (error) {
    return <div>Camera Error: {error}</div>;
  }

  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline />
      {isReady && <p>Camera Ready! ✓</p>}
      <button onClick={restart}>Restart</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### Option 2: Use Camera Manager Directly

```typescript
import { cameraManager } from '@/lib/camera';

// Initialize
const result = await cameraManager.initializeCamera({
  width: 640,
  height: 480
});

// Use stream
const { stream, video, stop } = result;

// Cleanup
stop();
```

### Option 3: Helper Functions

```typescript
import { 
  initializeCamera, 
  stopCamera, 
  checkCameraPermissions, 
  testCamera 
} from '@/lib/camera';

// Check permissions first
const permitted = await checkCameraPermissions();

// Test camera availability
const canUseCamera = await testCamera();

// Initialize
const result = await initializeCamera();

// Stop
stopCamera(result.stream);
```

---

## API Reference

### `useCamera(config?)` - React Hook

**Parameters:**
```typescript
interface CameraConfig {
  width?: number;        // Default: 320
  height?: number;       // Default: 240
  frameRate?: number;    // Default: 30
  facingMode?: 'user' | 'environment';  // Default: 'user'
}
```

**Returns:**
```typescript
{
  videoRef: React.RefObject<HTMLVideoElement>;
  isReady: boolean;        // Camera is streaming
  error: string | null;    // Error message if any
  stream: MediaStream | null;
  stop: () => void;        // Stop camera
  restart: () => Promise<void>;  // Restart camera
}
```

**Example:**
```typescript
const { videoRef, isReady, error, restart } = useCamera({
  width: 640,
  height: 480,
  frameRate: 60
});

return (
  <>
    <video ref={videoRef} autoPlay muted playsInline />
    {error && <Alert>{error}</Alert>}
    {isReady && <span>Ready</span>}
    <button onClick={restart}>Retry</button>
  </>
);
```

---

### `cameraManager.initializeCamera(config?)` - Direct Method

**Parameters:** Same as `CameraConfig`

**Returns:**
```typescript
interface CameraResult {
  stream: MediaStream;
  video: HTMLVideoElement;
  stop: () => void;
  constraints: MediaStreamConstraints;
}
```

**Throws:** Custom error object with:
- `name`: Error name (NotAllowedError, NotFoundError, etc.)
- `message`: Technical error message
- `userMessage`: User-friendly message
- `originalError`: Original error object

**Example:**
```typescript
try {
  const { stream, video, stop } = await cameraManager.initializeCamera();
  document.body.appendChild(video);
  
  // Use stream...
  
  // Cleanup
  stop();
} catch (err) {
  console.error(err.userMessage);
}
```

---

### Helper Functions

#### `checkCameraPermissions(): Promise<boolean>`
Check if camera permissions are already granted.

```typescript
if (await checkCameraPermissions()) {
  // User has granted permission
}
```

#### `testCamera(timeoutMs?: number): Promise<boolean>`
Test if camera is working by briefly accessing it.

```typescript
if (await testCamera()) {
  console.log('Camera works!');
}
```

#### `getCameraSettings(stream): object`
Get detailed camera settings and capabilities.

```typescript
const settings = cameraManager.getCameraSettings(stream);
console.log('Resolution:', settings.settings.width, 'x', settings.settings.height);
console.log('FPS:', settings.settings.frameRate);
```

---

## Error Handling

The camera system provides intelligent error messages:

| Error | Cause | Solution |
|-------|-------|----------|
| `NotAllowedError` | Permission denied | Grant camera access in browser settings |
| `NotFoundError` | No camera connected | Connect a camera device |
| `OverconstrainedError` | Device doesn't support constraints | System auto-downgrades constraints |
| `TypeError` | API not supported | Use a supported browser |
| `timeout` | Camera in use | Close other apps using camera |

---

## Usage in Snake Game

The hand tracking hook now uses the camera system:

```typescript
// In useHandTracking.ts
const { videoRef, isReady, error } = useCamera({
  width: 320,
  height: 240
});

// Use videoRef for hand pose detection
```

---

## Best Practices

### 1. Check Permissions First
```typescript
const permitted = await checkCameraPermissions();
if (!permitted) {
  showPermissionDialog();
}
```

### 2. Handle Errors Gracefully
```typescript
const { error } = useCamera();

if (error) {
  return <div>Can't use camera: {error}</div>;
}
```

### 3. Provide Fallback Options
```typescript
// If camera fails, use keyboard input
const { error } = useCamera();
const [inputMode, setInputMode] = useState(
  error ? 'keyboard' : 'hand'
);
```

### 4. Clean Up Resources
```typescript
useEffect(() => {
  const { stop } = useCamera();
  
  return () => {
    stop();  // Important: Stop camera on unmount
  };
}, []);
```

### 5. Test Before Critical Features
```typescript
// On app startup
if (await testCamera()) {
  enableHandTracking();
} else {
  showKeyboardModeOnly();
}
```

---

## Common Patterns

### Pattern 1: Camera with Processing
```typescript
export function HandDetectionComponent() {
  const { videoRef, isReady, error } = useCamera();
  const [hands, setHands] = useState(null);

  useEffect(() => {
    if (!isReady || !videoRef.current) return;

    const detect = async () => {
      const hands = await detector.estimateHands(videoRef.current);
      setHands(hands);
      requestAnimationFrame(detect);
    };

    detect();
  }, [isReady]);

  return error ? <Error>{error}</Error> : <VideoPreview ref={videoRef} />;
}
```

### Pattern 2: Camera with Fallback
```typescript
export function CameraWithFallback() {
  const { videoRef, isReady, error, restart } = useCamera();
  const [useKeyboard, setUseKeyboard] = useState(false);

  useEffect(() => {
    if (error) {
      setUseKeyboard(true);
    }
  }, [error]);

  return (
    <div>
      {useKeyboard ? (
        <KeyboardControls />
      ) : (
        <>
          <video ref={videoRef} hidden />
          <HandDisplay isReady={isReady} />
          {error && (
            <button onClick={restart}>Retry Camera</button>
          )}
        </>
      )}
    </div>
  );
}
```

### Pattern 3: Multi-Camera Selection
```typescript
export function CameraSelector() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    cameraManager.getAvailableCameras().then(setDevices);
  }, []);

  return (
    <select onChange={e => restartWithDevice(e.target.value)}>
      {devices.map(device => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label}
        </option>
      ))}
    </select>
  );
}
```

---

## Troubleshooting

### Camera Not Working?

1. **Check permissions:**
   ```typescript
   const permitted = await checkCameraPermissions();
   console.log('Permission:', permitted);
   ```

2. **Check browser console:**
   Look for `✓` or `✗` logs showing what succeeded/failed

3. **Test camera directly:**
   ```typescript
   const works = await testCamera();
   console.log('Camera works:', works);
   ```

4. **Check browser console for detailed errors**

5. **Try keyboard mode as fallback**

---

## File Locations

- **Camera Manager:** `src/lib/camera.ts`
- **Camera Hook:** `src/hooks/useCamera.ts`
- **Hand Tracking Hook:** `src/hooks/useHandTracking.ts` (uses camera system)

---

## Migration Guide

If updating existing code to use the new camera system:

### Before:
```typescript
const videoRef = useRef<HTMLVideoElement | null>(null);
// Manual getUserMedia call
const stream = await navigator.mediaDevices.getUserMedia(constraints);
videoRef.current.srcObject = stream;
```

### After:
```typescript
const { videoRef } = useCamera(config);
// That's it! All error handling, constraints, and cleanup are done automatically
```

---

## Next Steps

The camera system is ready to use across the app:
- ✅ Snake game hand tracking
- ✅ Video chat features
- ✅ AR filters
- ✅ Face detection
- ✅ Document scanning

Any component can now import and use the camera system reliably!
