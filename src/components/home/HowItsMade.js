import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Cold-processed',
    desc: 'No heat shortcut. The oils and butters keep what heat would otherwise destroy.',
  },
  {
    num: '02',
    title: 'Cut by hand',
    desc: 'Every bar is cut and trimmed by someone, not stamped out by a machine.',
  },
  {
    num: '03',
    title: 'Cured for weeks',
    desc: "A cured bar lasts longer in your bathroom. It's also why we sell out.",
  },
  {
    num: '04',
    title: 'Small batches',
    desc: 'Made in Maharashtra, in runs small enough that someone checks each one.',
  },
];

function HowItsMade() {
  return (
    <section className="bg-[#EFE4D5] border-t border-[#E3D6C4]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <div className="max-w-[620px] mb-12 sm:mb-14">
          <div className="text-[12.5px] tracking-[0.22em] uppercase font-semibold text-[#6B4F35] mb-5">
            How it&apos;s made
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-[1.14] tracking-[-0.018em] text-[#3B2314]">
            The slow way, on purpose.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.num}>
              <div className="text-xs sm:text-[13px] tracking-[0.18em] font-semibold text-[#A0845C] mb-4">
                {step.num}
              </div>
              <h3 className="font-serif text-lg sm:text-[20px] font-semibold text-[#3B2314] mb-2.5">
                {step.title}
              </h3>
              <p className="font-serif text-sm sm:text-[15.5px] leading-[1.6] text-[#4E3626]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItsMade;
