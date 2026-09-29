import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/hero-bg.jpg';

function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Gradient Overlay for high text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-[#fcf9f8]/40" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-xl mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center">
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FCF9F8] font-bold leading-[1.15] mb-4 drop-shadow-md">
          Rooted in Nature,<br />Crafted for Your Skin
        </h1>
        
        <p className="font-sans text-xs sm:text-base text-[#FCF9F8]/95 max-w-md mx-auto mb-8 leading-relaxed font-medium drop-shadow-sm">
          Discover authentic skincare inspired by nature and traditional wisdom.
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-xs sm:max-w-md justify-center">
          <Link 
            to="/shop" 
            className="w-full sm:w-auto px-8 py-3.5 bg-[#4a2e10] text-[#fcf9f8] font-bold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-lg hover:bg-[#38220b] transition-all shadow-md shadow-[#4a2e10]/15"
          >
            Shop Now
          </Link>
          <Link 
            to="/shop" 
            className="w-full sm:w-auto px-8 py-3.5 bg-[#eae5dd]/90 backdrop-blur-sm border border-[#d4c4b7] text-[#4a2e10] font-bold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-lg hover:bg-[#eae5dd] hover:border-[#4a2e10] transition-all"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
