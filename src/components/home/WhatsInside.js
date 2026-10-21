import React from 'react';
import { Link } from 'react-router-dom';

const INGREDIENTS = [
  {
    name: 'Kokum butter',
    desc: "One of the richest natural moisturisers there is. It's why our bars don't leave skin tight.",
  },
  {
    name: 'Goat milk',
    desc: 'The base of every bar. Gentle, creamy, and the reason the lather looks nothing like commercial foam.',
  },
  {
    name: 'Neem',
    desc: 'Purifying, and the one ingredient every Indian grandmother already trusts without being told.',
  },
  {
    name: 'Turmeric',
    desc: 'Calming, and traditionally used for evenness of tone. In three of our four bars.',
  },
  {
    name: 'Kacholam',
    desc: 'A traditional clarifying root, ground fine. Most people have never seen it in a soap.',
  },
  {
    name: 'Niacinamide',
    desc: "In कांती. Supports the skin's barrier and helps with evenness and texture over time.",
  },
];

function WhatsInside() {
  return (
    <section id="ingredients" className="bg-[#F5EDE0]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16 sm:py-24">
        <div className="max-w-[620px] mb-12 sm:mb-14">
          <div className="text-[12.5px] tracking-[0.22em] uppercase font-semibold text-[#6B4F35] mb-5">
            What&apos;s inside
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-[1.14] tracking-[-0.018em] text-[#3B2314]">
            No mystery ingredients.
          </h2>
          <p className="mt-5 font-serif text-base sm:text-lg leading-[1.62] text-[#4E3626]">
            Every ingredient is printed on the box, in full, with nothing hidden behind the word <em className="italic">fragrance</em>. Here&apos;s what the village always used, and what each one actually does.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#E3D6C4] border border-[#E3D6C4] rounded-sm overflow-hidden">
          {INGREDIENTS.map((item) => (
            <div key={item.name} className="bg-[#F5EDE0] p-7 sm:p-8">
              <h3 className="font-serif text-lg sm:text-[21px] font-semibold text-[#3B2314] mb-3">
                {item.name}
              </h3>
              <p className="font-serif text-sm sm:text-[15.5px] leading-[1.6] text-[#4E3626]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/shop"
            className="font-serif text-sm sm:text-[15.5px] text-[#4E3626] border-b border-[#C2AE95] pb-0.5 hover:text-[#3B2314] transition-colors"
          >
            See every ingredient, bar by bar
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhatsInside;
