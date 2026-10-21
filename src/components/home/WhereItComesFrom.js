import React from 'react';
import { Link } from 'react-router-dom';

const REGIONS = [
  {
    devanagari: 'कोकण',
    english: 'Konkan coast',
    description: 'Rich kokum butter, virgin coconut oil & coastal botanicals',
  },
  {
    devanagari: 'दख्खन',
    english: 'The Deccan',
    description: 'Black soil herbs, native turmeric & wild harvested roots',
  },
  {
    devanagari: 'कातळशिल्प',
    english: 'Village edge',
    description: 'Sun-dried forest bark, healing neem & traditional decoctions',
  },
  {
    devanagari: 'गाव',
    english: 'The Gaav',
    description: 'Generational recipes, slow handcrafting & clean wellness',
  },
];

function WhereItComesFrom() {
  return (
    <section className="py-12 sm:py-16 bg-[#fcf9f8] border-t border-[#e8dfd5]/60">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#8c7462] uppercase">
            WHERE IT COMES FROM
          </p>
        </div>

        {/* 2x2 Grid on Mobile and Desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
          {REGIONS.map((region, idx) => (
            <Link
              key={idx}
              to="/about"
              className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#f7f4ef] border border-[#e8dfd5] hover:border-[#4a2e10]/60 hover:bg-[#f3ede4] transition-all duration-300 text-center"
            >
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#4a2e10] mb-0.5 group-hover:text-[#38220b] transition-colors">
                {region.devanagari}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#7a6452] font-medium tracking-wide">
                {region.english}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhereItComesFrom;
