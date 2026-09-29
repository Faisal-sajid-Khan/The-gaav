import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    quote: 'My skin has never felt more alive. The Saffron Glow Elixir is a miracle in a bottle. It feels like a ritual every morning.',
    author: 'AARAV SHARMA',
    location: 'Mumbai, India',
    initial: 'A',
  },
  {
    id: 2,
    quote: 'The texture is so luxurious. My skin has not looked this radiant in years. A truly heritage product.',
    author: 'AARYA VERMA',
    location: 'Delhi, India',
    initial: 'A',
  },
  {
    id: 3,
    quote: 'Authentic ingredients and fast delivery. The Kumkumadi serum gave me an instant healthy glow!',
    author: 'PRIYA MEHTA',
    location: 'Bengaluru, India',
    initial: 'P',
  },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % REVIEWS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);

  const item = REVIEWS[current];

  return (
    <section className="py-12 sm:py-16 bg-[#fcf9f8]">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-4xl text-[#4a2e10] font-bold mb-3">
            The Experience
          </h2>
          <div className="flex items-center justify-center gap-1 text-[#d49e35]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" stroke="none" />
            ))}
          </div>
        </div>

        {/* Review Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-[#f7f4ef] rounded-2xl border border-[#e8dfd5] p-6 sm:p-10 shadow-sm relative">
            <p className="font-serif italic text-base sm:text-lg text-[#4a2e10] leading-relaxed text-center mb-8">
              "{item.quote}"
            </p>

            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#d4c4b7] text-[#4a2e10] font-bold text-xs flex items-center justify-center">
                {item.initial}
              </div>
              <div className="text-left">
                <p className="font-sans text-xs font-bold tracking-[0.15em] text-[#4a2e10] uppercase">
                  {item.author}
                </p>
                <p className="font-sans text-[11px] text-[#7a6452]">
                  {item.location}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button 
              onClick={prev} 
              className="w-9 h-9 rounded-full border border-[#d4c4b7] flex items-center justify-center text-[#4a2e10] hover:bg-[#f3ede4] transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {REVIEWS.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrent(i)} 
                  className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-[#4a2e10]' : 'w-1.5 bg-[#d4c4b7]'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={next} 
              className="w-9 h-9 rounded-full border border-[#d4c4b7] flex items-center justify-center text-[#4a2e10] hover:bg-[#f3ede4] transition-colors"
              aria-label="Next review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
