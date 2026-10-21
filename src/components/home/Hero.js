import React from 'react';
import { ArrowRight } from 'lucide-react';
import heroBg from '../../assets/hero-bg.jpg';

function Hero() {
  const scrollToShop = (e) => {
    e.preventDefault();
    const el = document.getElementById('shop');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  const scrollToStory = (e) => {
    e.preventDefault();
    const el = document.getElementById('story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center bg-cover bg-center text-white overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      {/* Dark overlay for rich contrast and readability matching Image 1 */}
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/35 via-black/45 to-black/60" />

      {/* Hero Content in White matching Image 1 */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
        {/* Brand Kicker */}
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <span className="font-sans text-lg sm:text-xl font-bold text-[#F5EDE0]">गाव</span>
          <span className="w-6 h-[1px] bg-[#F5EDE0]/60" />
          <span className="text-[12px] sm:text-[13px] tracking-[0.22em] uppercase font-semibold text-[#F5EDE0]/90">
            Handmade in Maharashtra
          </span>
        </div>

        {/* Headline in Pure White Serif */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-bold leading-[1.08] tracking-[-0.02em] text-white drop-shadow-md mb-6">
          This is not what<br />soap smells like.
        </h1>

        {/* Subtitle in Light Cream */}
        <p className="font-serif text-base sm:text-lg lg:text-[19px] leading-[1.62] text-[#F5EDE0]/95 max-w-xl mx-auto mb-8 sm:mb-10 drop-shadow-sm">
          Four handcrafted bars from rural Maharashtra. Goat milk, kokum butter, neem and turmeric, cold-processed in small batches — built around a fragrance you&apos;ll still notice after the shower.
        </p>

        {/* CTAs matching Image 1 styling */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-12">
          <button
            type="button"
            onClick={scrollToShop}
            className="inline-flex items-center gap-2.5 bg-[#3B2314] text-[#F5EDE0] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.14em] uppercase rounded-xl hover:bg-[#4a2e10] active:scale-[0.98] transition-all shadow-lg"
          >
            <span>Shop the four</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={scrollToStory}
            className="inline-flex items-center gap-2 bg-[#E8DDD0]/90 text-[#3B2314] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.14em] uppercase rounded-xl hover:bg-[#E8DDD0] active:scale-[0.98] transition-all shadow-md backdrop-blur-sm"
          >
            <span>Read our story</span>
          </button>
        </div>

        {/* Feature Badges in White/Cream */}
        <div className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-[13.5px] text-[#F5EDE0]/90 font-medium">
          <span>Cold-processed</span>
          <span className="text-[#F5EDE0]/50">·</span>
          <span>Goat milk base</span>
          <span className="text-[#F5EDE0]/50">·</span>
          <span>Small batches</span>
          <span className="text-[#F5EDE0]/50">·</span>
          <span>No mystery ingredients</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
