import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BoomerangVideoBg } from './components/BoomerangVideoBg';

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

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 md:px-14 py-4 sm:py-5">
        {/* Left: Brand Logo + Wordmark */}
        <a href="#" className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 256 256"
            fill="currentColor"
            className="w-6 h-6 text-[#191919]"
            aria-hidden="true"
          >
            <path d="M 144 256 L 27.598 256 L 144 139.598 Z" />
            <path d="M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z" />
            <path d="M 0 204.402 L 0 112 L 92.402 112 Z" />
          </svg>
          <span className="font-semibold text-base tracking-tight text-[#191919]">
            Boomerang
          </span>
        </a>

        {/* Center: Navigation Links (hidden below md) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#191919]/70 hover:text-[#191919] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: CTA Button */}
        <button
          type="button"
          className="px-5 py-2.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200"
        >
          Book A Demo
        </button>
      </nav>

      {/* Hero Section (Full First Viewport) */}
      <section className="relative flex flex-col items-center overflow-hidden h-screen">
        {/* Full-bleed Boomerang Video Background at z-0 */}
        <BoomerangVideoBg />

        {/* Centered Hero Copy Block at z-10 */}
        <div className="relative z-10 flex flex-col items-center text-center pt-24 sm:pt-26 md:pt-32 px-4 sm:px-6">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter text-[#191919] font-normal">
            Build lasting
            <br />
            relationships.
          </h1>

          <p className="max-w-sm sm:max-w-md mt-5 sm:mt-6 md:mt-8 text-sm md:text-base text-[#191919]/70 leading-relaxed">
            Conversational AI platform for modern financial institutions — agents
            that handle the full borrower lifecycle across email, SMS, and voice.
          </p>

          <button
            type="button"
            className="mt-6 sm:mt-8 md:mt-10 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200"
          >
            Book A Demo
          </button>
        </div>

        {/* Bottom Info Panel (anchored to bottom of viewport) */}
        <div className="relative z-10 mt-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 border-b-0 pt-8 sm:pt-12 md:pt-16 px-5 sm:px-8 md:px-12 pb-0 shadow-sm">
            {/* Row 1: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16">
              {/* Left Column */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/50 font-medium">
                  WHAT DO WE DO?
                </p>
                <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-tight tracking-tight text-[#191919]">
                  Conversations that <br className="hidden sm:block" />
                  build momentum
                </h2>
              </div>

              {/* Right Column (bottom-aligned) */}
              <div className="flex items-end">
                <p className="text-sm md:text-[15px] text-[#191919]/70 leading-relaxed">
                  Conversational AI built for regulated financial institutions.
                  Agents that hold a real conversation, plug into the systems you
                  run, and show their work.
                </p>
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="mt-6 sm:mt-8 md:mt-10 h-px bg-gray-200 w-full" />

            {/* Row 2: 3 Interactive Feature Rows */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {FEATURE_ROWS.map((item) => (
                <div
                  key={item.num}
                  className="group bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between"
                >
                  <div className="text-sm text-[#191919]">
                    <span className="text-[#191919]/40">{item.num}</span>
                    <span className="mx-2 text-[#191919]/30">/</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;

