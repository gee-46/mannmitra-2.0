import { useEffect, useRef } from 'react';

interface AntigravityOptions {
    intensity?: number; // Movement range in pixels
    tiltIntensity?: number; // Rotation range in degrees
    smoothness?: number; // Lerp factor (0.01 - 1.0)
}

export const useAntigravity = (
    ref: React.RefObject<HTMLElement>,
    options: AntigravityOptions = {}
) => {
    const {
        intensity = 20,
        tiltIntensity = 10,
        smoothness = 0.1,
    } = options;

    // Store target (mouse) and current (interpolated) values
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });
    const requestRef = useRef<number>();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            // Normalize mouse position from -1 to 1
            const x = (e.clientX / innerWidth) * 2 - 1;
            const y = (e.clientY / innerHeight) * 2 - 1;

            target.current = { x, y };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            // Linear Interpolation (Lerp)
            current.current.x += (target.current.x - current.current.x) * smoothness;
            current.current.y += (target.current.y - current.current.y) * smoothness;

            if (ref.current) {
                const x = current.current.x * intensity;
                const y = current.current.y * intensity;

                // Calculate tilt (rotateX is based on Y movement, rotateY on X movement)
                const rotateX = -current.current.y * tiltIntensity;
                const rotateY = current.current.x * tiltIntensity;

                ref.current.style.transform = `
          translate3d(${x}px, ${y}px, 0)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [intensity, tiltIntensity, smoothness, ref]);
};
