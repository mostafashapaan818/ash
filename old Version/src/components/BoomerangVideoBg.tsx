import React, { useEffect, useRef, useState } from 'react';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4';

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: DOMHighResTimeStamp, metadata: unknown) => void
  ) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export const BoomerangVideoBg: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLCanvasElement[]>([]);
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current as VideoWithRVFC | null;
    if (!video) return;

    let isCancelled = false;
    let isCapturing = false;
    let rafId: number | null = null;
    let rvfcId: number | null = null;
    let lastCapturedTime = -1;
    const capturedFrames: HTMLCanvasElement[] = [];

    const captureFrame = () => {
      if (isCancelled || !video || video.readyState < 2) return;
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      const currentTime = video.currentTime;
      if (currentTime === lastCapturedTime) return;
      lastCapturedTime = currentTime;

      const width = Math.min(video.videoWidth, 960);
      const height = Math.round((video.videoHeight / video.videoWidth) * width);

      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;

      const ctx = offscreen.getContext('2d');
      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, width, height);
          capturedFrames.push(offscreen);
        } catch {
          // Ignore transient draw error
        }
      }
    };

    const scheduleCapture = () => {
      if (isCancelled || !isCapturing) return;

      if (typeof video.requestVideoFrameCallback === 'function') {
        rvfcId = video.requestVideoFrameCallback(() => {
          captureFrame();
          scheduleCapture();
        });
      } else {
        rafId = requestAnimationFrame(() => {
          captureFrame();
          scheduleCapture();
        });
      }
    };

    const stopCapture = () => {
      isCapturing = false;
      if (
        rvfcId !== null &&
        typeof video.cancelVideoFrameCallback === 'function'
      ) {
        video.cancelVideoFrameCallback(rvfcId);
        rvfcId = null;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const handleLoaded = () => {
      if (isCancelled || isCapturing || framesRef.current.length > 0) return;
      isCapturing = true;
      video.muted = true;
      scheduleCapture();
      video.play().catch(() => {
        // Autoplay fallback
      });
    };

    const handleEnded = () => {
      captureFrame();
      stopCapture();

      if (!isCancelled && capturedFrames.length > 0) {
        framesRef.current = capturedFrames;
        setFramesReady(true);
      }
    };

    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('canplay', handleLoaded);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 2) {
      handleLoaded();
    }

    return () => {
      isCancelled = true;
      stopCapture();
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('canplay', handleLoaded);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!framesReady) return;

    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length === 0) return;

    canvas.width = frames[0].width;
    canvas.height = frames[0].height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameIndex = 0;
    let direction = 1;
    let rafId: number;
    let lastTime = performance.now();
    const interval = 1000 / 30;

    ctx.drawImage(frames[frameIndex], 0, 0, canvas.width, canvas.height);

    const animate = (now: number) => {
      if (now - lastTime >= interval) {
        lastTime = now - ((now - lastTime) % interval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frames[frameIndex], 0, 0, canvas.width, canvas.height);

        if (frames.length > 1) {
          frameIndex += direction;
          if (frameIndex >= frames.length - 1) {
            frameIndex = frames.length - 1;
            direction = -1;
          } else if (frameIndex <= 0) {
            frameIndex = 0;
            direction = 1;
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [framesReady]);

  return (
    <div className="absolute inset-0 z-0 scale-[1.15] origin-top overflow-hidden">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className="w-full h-full object-cover object-top"
        style={{ display: framesReady ? 'none' : 'block' }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover object-top"
        style={{ display: framesReady ? 'block' : 'none' }}
      />
    </div>
  );
};

export default BoomerangVideoBg;

