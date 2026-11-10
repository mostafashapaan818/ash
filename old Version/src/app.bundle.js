import React, { useEffect, useRef, useState } from 'https://esm.sh/react@18.3.1';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
import { ArrowRight } from 'https://esm.sh/lucide-react@0.460.0?deps=react@18.3.1';

const h = React.createElement;

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4';

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Company', href: '#company' },
];

const FEATURE_ROWS = [
  { num: '01', label: 'Conversational' },
  { num: '02', label: 'Connected' },
  { num: '03', label: 'Compliant' },
];

export function BoomerangVideoBg() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isCancelled = false;
    let isCapturing = false;
    let rafId = null;
    let rvfcId = null;
    let lastCapturedTime = -1;
    const capturedFrames = [];

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
      if (rvfcId !== null && typeof video.cancelVideoFrameCallback === 'function') {
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
      video.play().catch(() => {});
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
    let rafId;
    let lastTime = performance.now();
    const interval = 1000 / 30;

    ctx.drawImage(frames[frameIndex], 0, 0, canvas.width, canvas.height);

    const animate = (now) => {
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

  return h(
    'div',
    { className: 'absolute inset-0 z-0 scale-[1.15] origin-top overflow-hidden' },
    h('video', {
      ref: videoRef,
      src: VIDEO_SRC,
      muted: true,
      playsInline: true,
      preload: 'auto',
      crossOrigin: 'anonymous',
      className: 'w-full h-full object-cover object-top',
      style: { display: framesReady ? 'none' : 'block' },
    }),
    h('canvas', {
      ref: canvasRef,
      className: 'w-full h-full object-cover object-top',
      style: { display: framesReady ? 'block' : 'none' },
    })
  );
}

export function App() {
  return h(
    'div',
    { className: 'min-h-screen bg-white overflow-x-hidden' },
    // Fixed Navbar
    h(
      'nav',
      {
        className:
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 md:px-14 py-4 sm:py-5',
      },
      // Logo left
      h(
        'a',
        { href: '#', className: 'flex items-center gap-2.5' },
        h(
          'svg',
          {
            viewBox: '0 0 256 256',
            fill: 'currentColor',
            className: 'w-6 h-6 text-[#191919]',
            'aria-hidden': 'true',
          },
          h('path', { d: 'M 144 256 L 27.598 256 L 144 139.598 Z' }),
          h('path', { d: 'M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z' }),
          h('path', { d: 'M 0 204.402 L 0 112 L 92.402 112 Z' })
        ),
        h(
          'span',
          { className: 'font-semibold text-base tracking-tight text-[#191919]' },
          'Boomerang'
        )
      ),
      // Center links
      h(
        'div',
        { className: 'hidden md:flex items-center gap-8' },
        NAV_LINKS.map((link) =>
          h(
            'a',
            {
              key: link.label,
              href: link.href,
              className:
                'text-sm text-[#191919]/70 hover:text-[#191919] transition-colors duration-200',
            },
            link.label
          )
        )
      ),
      // Right CTA
      h(
        'button',
        {
          type: 'button',
          className:
            'px-5 py-2.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200',
        },
        'Book A Demo'
      )
    ),
    // Hero Section
    h(
      'section',
      { className: 'relative flex flex-col items-center overflow-hidden h-screen' },
      h(BoomerangVideoBg),
      // Hero copy block
      h(
        'div',
        {
          className:
            'relative z-10 flex flex-col items-center text-center pt-24 sm:pt-26 md:pt-32 px-4 sm:px-6',
        },
        h(
          'h1',
          {
            className:
              'font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter text-[#191919] font-normal',
          },
          'Build lasting',
          h('br'),
          'relationships.'
        ),
        h(
          'p',
          {
            className:
              'max-w-sm sm:max-w-md mt-5 sm:mt-6 md:mt-8 text-sm md:text-base text-[#191919]/70 leading-relaxed',
          },
          'Conversational AI platform for modern financial institutions — agents that handle the full borrower lifecycle across email, SMS, and voice.'
        ),
        h(
          'button',
          {
            type: 'button',
            className:
              'mt-6 sm:mt-8 md:mt-10 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200',
          },
          'Book A Demo'
        )
      ),
      // Bottom info panel
      h(
        'div',
        { className: 'relative z-10 mt-auto w-full max-w-5xl px-4 sm:px-6' },
        h(
          'div',
          {
            className:
              'bg-white/90 backdrop-blur-sm border border-gray-200 border-b-0 pt-8 sm:pt-12 md:pt-16 px-5 sm:px-8 md:px-12 pb-0 shadow-sm',
          },
          // Row 1
          h(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16' },
            h(
              'div',
              null,
              h(
                'p',
                {
                  className:
                    'text-[11px] uppercase tracking-[0.2em] text-[#191919]/50 font-medium',
                },
                'WHAT DO WE DO?'
              ),
              h(
                'h2',
                {
                  className:
                    'mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-tight tracking-tight text-[#191919]',
                },
                'Conversations that ',
                h('br', { className: 'hidden sm:block' }),
                'build momentum'
              )
            ),
            h(
              'div',
              { className: 'flex items-end' },
              h(
                'p',
                { className: 'text-sm md:text-[15px] text-[#191919]/70 leading-relaxed' },
                'Conversational AI built for regulated financial institutions. Agents that hold a real conversation, plug into the systems you run, and show their work.'
              )
            )
          ),
          // Hairline divider
          h('div', { className: 'mt-6 sm:mt-8 md:mt-10 h-px bg-gray-200 w-full' }),
          // Row 2: 3 interactive rows
          h(
            'div',
            { className: 'mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3' },
            FEATURE_ROWS.map((item) =>
              h(
                'div',
                {
                  key: item.num,
                  className:
                    'group bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between',
                },
                h(
                  'div',
                  { className: 'text-sm text-[#191919]' },
                  h('span', { className: 'text-[#191919]/40' }, item.num),
                  h('span', { className: 'mx-2 text-[#191919]/30' }, '/'),
                  h('span', { className: 'font-medium' }, item.label)
                ),
                h(ArrowRight, {
                  className:
                    'w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200',
                })
              )
            )
          )
        )
      )
    )
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(h(React.StrictMode, null, h(App)));
}

