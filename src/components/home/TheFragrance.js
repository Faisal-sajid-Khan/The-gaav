import React from 'react';

const FRAGRANCES = [
  {
    title: 'उटणं',
    subTitle: 'Utanē',
    accent: '#B5651D',
    desc: 'Warm, dark and sweet. An oud-like resin with a soft sweetness sitting behind it — closer to an attar than to a soap.',
  },
  {
    title: 'निखार',
    subTitle: 'Nikhār',
    accent: '#A63A1E',
    desc: 'Bright and fruity when you first open it, then a warm resin note underneath. Freshness from the first whiff, and it stays.',
  },
  {
    title: 'निर्मळ',
    subTitle: 'Nirmaḷ',
    accent: '#2D6A4F',
    desc: 'Deep, woody, clean. Wet earth after the first rain. A breeze of vetiver, with honey somewhere beneath it.',
  },
  {
    title: 'कांती',
    subTitle: 'Kānti',
    accent: '#8DA0AE',
    desc: 'Soft, creamy coconut up front, then something cool and mineral underneath. Rain on a stone floor.',
  },
];

function TheFragrance() {
  return (
    <section className="bg-[#2E1B0F] text-[#F5EDE0]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16 sm:py-24">
        <div className="max-w-[640px] mb-12 sm:mb-16">
          <div className="text-[12.5px] tracking-[0.22em] uppercase font-semibold text-[#BFA98D] mb-5">
            The fragrance
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-[1.14] tracking-[-0.018em] text-[#F5EDE0]">
            You can&apos;t photograph a smell.
          </h2>
          <p className="mt-5 font-serif text-base sm:text-lg leading-[1.62] text-[#DBCBB4]">
            So we&apos;ll describe them properly instead. No &ldquo;fresh,&rdquo; no &ldquo;floral,&rdquo; no words a marketing team would reach for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-11">
          {FRAGRANCES.map((item) => (
            <div
              key={item.title}
              className="pt-6 border-t-[3px]"
              style={{ borderTopColor: item.accent }}
            >
              <div className="flex items-baseline gap-3 mb-3.5">
                <span className="font-sans text-2xl sm:text-[27px] font-bold text-[#F5EDE0]">
                  {item.title}
                </span>
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#BFA98D]">
                  {item.subTitle}
                </span>
              </div>
              <p className="font-serif text-base sm:text-[19px] leading-[1.6] text-[#E8DDD0]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TheFragrance;
