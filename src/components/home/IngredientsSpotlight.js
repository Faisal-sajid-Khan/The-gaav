import React from 'react';

function IngredientsSpotlight() {
  return (
    <section className="relative py-16 sm:py-24 bg-[#4a2e10] text-[#fcf9f8] overflow-hidden">
      {/* Background Mandala / Floral Pattern Overlay */}
      <div className="absolute -bottom-16 -right-16 w-80 h-80 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-200">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M100 20 V180 M20 100 H180" stroke="currentColor" strokeWidth="1.5" />
          <path d="M43.4 43.4 L156.6 156.6 M43.4 156.6 L156.6 43.4" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f3e9dc] font-bold mb-2">
            Ingredients Spotlight
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#d4c4b7]">
            Ancient wisdom meets botanical science.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-10 sm:space-y-12">
          {/* Aloe Vera Item */}
          <div className="flex items-center gap-5 sm:gap-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-2 border-[#d4c4b7]/40 shadow-lg relative">
              <img 
                src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&h=400&fit=crop" 
                alt="Aloe Vera" 
                className="w-full h-full object-cover" 
                loading="lazy" 
              />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#f3e9dc] font-bold mb-1">
                Aloe Vera
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#d4c4b7] leading-relaxed max-w-sm">
                Intense hydration sourced from the highlands.
              </p>
            </div>
          </div>

          {/* Turmeric Item - Right Aligned / Reversed */}
          <div className="flex items-center justify-end gap-5 sm:gap-8 text-right">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#f3e9dc] font-bold mb-1">
                Turmeric
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#d4c4b7] leading-relaxed max-w-sm">
                The golden secret for a natural, luminous glow.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-2 border-[#d4c4b7]/40 shadow-lg relative">
              <img 
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop" 
                alt="Turmeric" 
                className="w-full h-full object-cover" 
                loading="lazy" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IngredientsSpotlight;
