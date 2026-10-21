import React from 'react';

function Reviews() {
  const scrollToShop = (e) => {
    e.preventDefault();
    const el = document.getElementById('shop');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#EFE4D5] border-t border-[#E3D6C4]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16 sm:py-20 text-center">
        <h2 className="font-serif text-2xl sm:text-4xl font-semibold leading-[1.2] tracking-[-0.014em] text-[#3B2314] max-w-[620px] mx-auto mb-5">
          We&apos;re new. You&apos;d be among the first.
        </h2>
        <p className="font-serif text-base sm:text-[17.5px] leading-[1.62] text-[#4E3626] max-w-[580px] mx-auto mb-8">
          Our first batch sold through word of mouth alone. If you try a bar, tell us honestly what you think — we&apos;d rather have ten real reviews than a hundred bought ones.
        </p>
        <div>
          <button
            type="button"
            onClick={scrollToShop}
            className="inline-flex items-center justify-center bg-[#3B2314] text-[#F5EDE0] px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-[15.5px] font-semibold tracking-[0.13em] uppercase rounded-sm hover:bg-[#4E3626] transition-colors"
          >
            Shop the four
          </button>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
