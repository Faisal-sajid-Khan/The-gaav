import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import trioWrapped from '../assets/trio-wrapped.jpg';

function StoryPage() {
  useEffect(() => {
    document.title = 'Our Story — The Gaav';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#F5EDE0] text-[#3B2314] font-serif">
      {/* 1. Opening Section */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-[760px]">
          <div className="font-sans text-xl sm:text-2xl font-bold text-[#6B4F35] mb-5 sm:mb-6">
            गाव
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] font-semibold leading-[1.12] sm:leading-[1.1] tracking-[-0.022em] text-[#3B2314]">
            The woman of the house<br className="hidden sm:inline" /> knew this already.
          </h1>
        </div>
      </section>

      {/* 2. Body Story Section with 2-column layout */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-10 pb-20 sm:pb-28 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Column: Narrative Content */}
        <div className="flex-1 min-w-0 max-w-[680px]">
          <p className="font-serif text-lg sm:text-[21px] leading-[1.66] text-[#3B2314] mb-6">
            She made ubtan from what was already in the kitchen. Besan, haldi, a little oil, whatever the season had given. She knew which leaf was for which thing, and she never once called any of it skincare.
          </p>

          <p className="font-serif text-base sm:text-[18.5px] leading-[1.7] text-[#4E3626] mb-6">
            She did it before weddings and before festivals, and on ordinary Thursdays too. She did it for her children, for her husband, for her mother-in-law, and last of all — if there was time — for herself.
          </p>

          <p className="font-serif text-base sm:text-[18.5px] leading-[1.7] text-[#4E3626] mb-6">
            Somewhere between her and us, that knowledge quietly disappeared. It was replaced by a shelf of bottles nobody can pronounce, sold by people who have never met her, at prices that assume you won&apos;t ask what&apos;s inside.
          </p>

          <p className="font-serif text-base sm:text-[18.5px] leading-[1.7] text-[#4E3626] mb-6">
            The strange part is that she was right. Kokum really does moisturise better than most of what&apos;s on that shelf. Neem really does what she said it did. Turmeric was never a trend.
          </p>

          {/* Pull Quote */}
          <div className="my-10 sm:my-12 py-8 sm:py-9 border-y border-[#E3D6C4]">
            <p className="font-serif text-xl sm:text-[26px] leading-[1.5] text-[#3B2314] italic">
              &ldquo;The Gaav isn&apos;t nostalgia. It&apos;s the same knowledge, made properly, and made to smell like somewhere worth returning to.&rdquo;
            </p>
          </div>

          <p className="font-serif text-base sm:text-[18.5px] leading-[1.7] text-[#4E3626] mb-6">
            We work with a small manufacturer in Maharashtra who still cold-processes and cures by hand. It takes weeks longer than the alternative. It is also the only way the oils survive intact and the bar lasts in your bathroom.
          </p>

          <p className="font-serif text-base sm:text-[18.5px] leading-[1.7] text-[#4E3626] mb-6">
            And we spent longer on the fragrance than on anything else — because a village doesn&apos;t smell like a laboratory&apos;s idea of &ldquo;fresh.&rdquo; It smells like wet earth after rain, like wood, like something burning somewhere far off. That&apos;s what we were trying to bottle.
          </p>

          <p className="font-serif text-base sm:text-[18.5px] leading-[1.7] text-[#4E3626]">
            If one bar reminds someone of a house they grew up in, we&apos;ve done the job.
          </p>
        </div>

        {/* Right Column: Visual Accent Cards */}
        <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col gap-6">
          <div className="bg-[#E8DDD0] rounded-sm aspect-[3/4] flex items-end p-8 sm:p-10 border border-[#DECDBB] shadow-sm">
            <span className="font-sans text-5xl sm:text-6xl font-bold text-[#D3C0A6]">
              गाव
            </span>
          </div>

          <div className="bg-[#E8DDD0] rounded-sm aspect-square overflow-hidden border border-[#DECDBB] shadow-sm group">
            <img
              src={trioWrapped}
              alt="Handcrafted Gaav Bars"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 3. Who Makes It Section */}
      <section className="bg-[#EFE4D5] border-t border-[#E3D6C4]">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
          <div className="max-w-[620px] mb-12 sm:mb-14">
            <div className="text-[12.5px] tracking-[0.22em] uppercase font-semibold text-[#6B4F35] mb-4 sm:mb-5">
              Who makes it
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold leading-[1.16] tracking-[-0.016em] text-[#3B2314]">
              A small company, honestly run.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-11">
            <div>
              <h3 className="font-serif text-lg sm:text-[20px] font-semibold text-[#3B2314] mb-3">
                The company
              </h3>
              <p className="font-serif text-[15.5px] leading-[1.64] text-[#4E3626]">
                The Gaav is a brand of FN Ayurnidhi Life Science Company, registered in India. One brand, four products, no investors to answer to yet.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg sm:text-[20px] font-semibold text-[#3B2314] mb-3">
                Where it&apos;s made
              </h3>
              <p className="font-serif text-[15.5px] leading-[1.64] text-[#4E3626]">
                Maharashtra, in small cold-processed batches with a manufacturing partner who cures every bar by hand before it&apos;s cut.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg sm:text-[20px] font-semibold text-[#3B2314] mb-3">
                What we promise
              </h3>
              <p className="font-serif text-[15.5px] leading-[1.64] text-[#4E3626]">
                Every ingredient named on the box. No claims we can&apos;t stand behind. And we&apos;ll tell you when we&apos;re out of stock rather than quietly shipping late.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Call to Action Section */}
      <section className="bg-[#3B2314] text-[#F5EDE0]">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16 sm:py-20 text-center flex flex-col items-center">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-semibold leading-[1.25] max-w-[620px] text-[#F5EDE0] mb-7 sm:mb-8">
            Start with all four. Find the one that&apos;s yours.
          </h2>

          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-[#F5EDE0] text-[#3B2314] px-8 sm:px-10 py-4 sm:py-4.5 text-xs sm:text-sm font-bold tracking-[0.14em] uppercase rounded-[2px] hover:bg-white active:scale-[0.98] transition-all shadow-md"
          >
            <span>Shop the four — ₹499</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default StoryPage;
