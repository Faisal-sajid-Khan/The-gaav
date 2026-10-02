import React from 'react';
import { Instagram } from 'lucide-react';

const INSTA_IMAGES = [
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
];

function InstagramFeed() {
  return (
    <section className="py-12 sm:py-16 bg-[#fcf9f8]">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-6 sm:mb-8">
          <a 
            href="https://www.instagram.com/thegaav/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-sans text-xs sm:text-sm font-bold tracking-[0.2em] text-[#7a6452] hover:text-[#4a2e10] uppercase transition-colors"
          >
            FOLLOW OUR JOURNEY @THEGAAV
          </a>
        </div>

        {/* 3x2 Grid on Mobile and Desktop */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto">
          {INSTA_IMAGES.map((img, i) => (
            <a 
              key={i} 
              href="https://www.instagram.com/thegaav/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative aspect-square overflow-hidden rounded-xl bg-[#eee7df]"
            >
              <img 
                src={img} 
                alt={`Instagram ${i + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-[#4a2e10]/0 group-hover:bg-[#4a2e10]/30 transition-colors flex items-center justify-center">
                <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InstagramFeed;
