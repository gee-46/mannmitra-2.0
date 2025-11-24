# Hand Detection Troubleshooting Guide

## Common Issues & Solutions

### ❌ "Failed to initialize hand detection" Error

This error can have multiple causes. Follow these steps:

---

## 1️⃣ Check Browser Console for Detailed Error

**Steps:**
1. Open DevTools: Press **F12** in browser
2. Go to **Console** tab
3. Look for error messages starting with `Hand tracking setup error:`
4. Screenshot or note the exact error message

**Common errors you might see:**
- `TypeError: Cannot read property 'createDetector'` → Model loading issue
- `NotAllowedError: Permission denied` → Camera permission not granted
- `NotFoundError: Requested device not found` → No camera connected
- `WebGL is not supported` → Browser doesn't support WebGL

---

## 2️⃣ Grant Camera Permissions

**Chrome/Edge:**
1. Click the lock icon 🔒 in address bar
2. Find "Camera" setting
3. Select "Allow"
4. Refresh page

**Firefox:**
1. Click lock icon 🔒 in address bar
2. Set Camera to "Allow for this site"
3. Refresh page

**Safari:**
1. Settings → Privacy → Camera
2. Find website and allow
3. Refresh page

---

## 3️⃣ Check WebGL Support

Run this in browser console (F12 → Console):

```javascript
// Check WebGL support
const canvas = document.createElement('canvas');
const webgl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
console.log('WebGL supported:', !!webgl);

// Check TensorFlow
console.log('TensorFlow:', typeof tf);
```

**Expected output:**
```
WebGL supported: true
TensorFlow: object
```

If WebGL is `false`, try a different browser or enable WebGL in settings.

---

## 4️⃣ Verify Camera is Working

**Windows:**
1. Open **Camera** app (built-in)
2. Test if camera works
3. Close Camera app before using browser
4. Refresh browser page

**Reason:** Only one app can use the camera at a time

---

## 5️⃣ Check for HTTPS/Localhost

Camera access requires:
- ✅ HTTPS (secure connection)
- ✅ Localhost (127.0.0.1)
- ❌ Plain HTTP (http://, not https://)

**Check your URL:**
- ✅ http://localhost:5173 → OK
- ✅ https://yourdomain.com → OK
- ❌ http://192.168.x.x:5173 → NOT allowed

---

## 6️⃣ Try Keyboard Mode as Fallback

If hand detection fails:
1. Click **Keyboard** button on Snake Game page
2. Use **Arrow Keys** to control snake
3. Works perfectly as alternative

---

## 7️⃣ Advanced: Check Network Issues

If error mentions `@mediapipe` or `cdn.jsdelivr.net`:

Run in console:
```javascript
fetch('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1/wasm')
  .then(r => r.ok ? console.log('✓ CDN accessible') : console.log('✗ CDN error:', r.status))
  .catch(e => console.log('✗ Network error:', e.message));
```

**If error:**
- Check internet connection
- Try different WiFi/network
- Corporate firewall might block CDN

---

## 8️⃣ Browser Compatibility

| Browser | WebGL | Camera | Status |
|---------|-------|--------|--------|
| Chrome | ✅ | ✅ | Fully supported |
| Edge | ✅ | ✅ | Fully supported |
| Firefox | ✅ | ✅ | Fully supported |
| Safari | ⚠️ | ✅ | Limited WebGL |
| Opera | ✅ | ✅ | Fully supported |

**If Safari:** May need to enable WebGL in Develop menu

---

## 9️⃣ Testing Hand Tracking

Once initialized successfully:

1. **Good lighting** - well-lit room is important
2. **Clear background** - plain background works best
3. **Hand fully visible** - palm facing camera
4. **Steady movement** - slow, deliberate gestures
5. **Minimum distance** - index finger must point ~2 inches from wrist

**Hand positions:**
- 👆 Point UP = Snake moves UP
- 👉 Point RIGHT = Snake moves RIGHT
- 👇 Point DOWN = Snake moves DOWN
- 👈 Point LEFT = Snake moves LEFT

---

## 🔟 Still Having Issues? Try This:

1. **Hard refresh page:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache:** DevTools → Application → Clear Storage
3. **Try different browser:** Chrome if using Firefox, etc.
4. **Restart computer:** Sometimes system needs restart
5. **Use keyboard mode:** Works perfectly as fallback ✅

---

## 📋 Debug Checklist

Before asking for help, verify:
- [ ] Camera permissions granted
- [ ] Camera not in use by other app
- [ ] Using localhost or HTTPS
- [ ] Browser console shows debug logs (check for `✓` marks)
- [ ] WebGL is supported
- [ ] Tried keyboard mode (works?)
- [ ] Hard refresh page (Ctrl+Shift+R)
- [ ] Using supported browser (Chrome/Edge/Firefox)

---

## 💡 Quick Test Code

Paste in browser console (F12 → Console) to debug:

```javascript
// Test 1: Check all APIs
console.log('--- API Check ---');
console.log('getUserMedia:', !!navigator.mediaDevices?.getUserMedia);
console.log('TensorFlow:', typeof tf !== 'undefined');
console.log('WebGL:', !!document.createElement('canvas').getContext('webgl'));

// Test 2: Request camera with logs
console.log('--- Requesting camera ---');
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log('✓ Camera access granted');
    stream.getTracks().forEach(t => t.stop());
  })
  .catch(err => console.log('✗ Camera error:', err.name, err.message));

// Test 3: Check MediaPipe availability
console.log('--- MediaPipe Check ---');
console.log('MediaPipe Hands:', typeof handPoseDetection !== 'undefined');
```

---

## 🎮 Using Keyboard as Permanent Solution

If hand tracking never works on your device:

1. Always use **Keyboard Mode**
2. Arrow keys control snake perfectly
3. No camera needed
4. Better for privacy anyway!

---

## Need More Help?

Check browser console for exact error message and share:
1. Error message (copy from console)
2. Browser type and version
3. Operating system
4. Whether camera works in other apps
5. Whether you granted permissions
