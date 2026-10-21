import React from 'react';
import { Instagram } from 'lucide-react';

const INSTA_POSTS = [
  {
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
    alt: 'Handcrafted soap curing in the open air',
  },
  {
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop',
    alt: 'Botanical ingredients from Maharashtra farms',
  },
  {
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop',
    alt: 'Traditional cold-pressed village wisdom',
  },
];

function InstagramFeed() {
  return (
    <section className="py-10 sm:py-14 bg-[#fcf9f8] border-t border-[#e8dfd5]/60">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching wireframe: @THEGAAV */}
        <div className="text-center mb-5 sm:mb-6">
          <a
            href="https://www.instagram.com/thegaav/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs sm:text-sm font-bold tracking-[0.2em] text-[#7a6452] hover:text-[#4a2e10] uppercase transition-colors"
          >
            @THEGAAV
          </a>
        </div>

        {/* 3 Cards Side-by-Side matching wireframe */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
          {INSTA_POSTS.map((post, i) => (
            <a
              key={i}
              href="https://www.instagram.com/thegaav/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-[#eee7df] border border-[#e8dfd5] block shadow-xs"
            >
              <img
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#4a2e10]/0 group-hover:bg-[#4a2e10]/25 transition-colors flex items-center justify-center">
                <Instagram size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InstagramFeed;
