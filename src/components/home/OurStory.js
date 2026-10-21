import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function OurStory() {
  return (
    <section id="story" className="bg-[#F5EDE0]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="flex-1 min-w-0 max-w-xl">
          <div className="text-[12.5px] tracking-[0.22em] uppercase font-semibold text-[#6B4F35] mb-5">
            Our story
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-[1.16] tracking-[-0.018em] text-[#3B2314] mb-6">
            The woman of the house<br />knew this already.
          </h2>
          <p className="font-serif text-base sm:text-[18.5px] leading-[1.66] text-[#4E3626] mb-4">
            She made ubtan from what was in the kitchen. She knew which leaf was for which thing, and she never called any of it skincare.
          </p>
          <p className="font-serif text-base sm:text-[18.5px] leading-[1.66] text-[#4E3626] mb-8">
            Somewhere between her and us, that knowledge got replaced by a shelf of bottles nobody can pronounce. The Gaav is an attempt to bring it back — made properly, and made to smell like somewhere worth returning to.
          </p>
          <div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2.5 font-serif text-base text-[#3B2314] border-b border-[#C2AE95] pb-0.5 hover:text-[#6B4F35] transition-colors group"
            >
              <span>Read the whole story</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Box */}
        <div className="flex-1 min-w-0 w-full flex justify-center">
          <div className="w-full max-w-[480px] aspect-[4/5] bg-[#E8DDD0] rounded-sm p-8 sm:p-10 flex items-end shadow-sm border border-[#DECDBB]">
            <span className="font-sans text-5xl sm:text-6xl font-bold text-[#D3C0A6]">
              गाव
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStory;
