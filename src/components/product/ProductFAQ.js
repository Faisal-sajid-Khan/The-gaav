import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: 'Can I pay cash on delivery?',
    answer:
      "Yes, anywhere in India. Choose it at checkout. If you'd rather pay now, UPI, card and netbanking all work.",
  },
  {
    question: 'Which three bars should I pick?',
    answer:
      'Honestly, start with all four. Fragrance is personal and nobody chooses well from a screen. Once you know your one, build your three around it — and you can pick two of the same bar.',
  },
  {
    question: 'Is it safe for sensitive skin?',
    answer:
      "Our bars are cold-processed with a goat milk base and no SLS or parabens, which most people with sensitive skin get on well with. Every ingredient is listed, so if you have a known allergy you can check before ordering. If you have a skin condition, ask your doctor first — we're a soap company, not a clinic.",
  },
  {
    question: 'How long does a bar last?',
    answer:
      "Longer than you'd expect, because it's cured. Lather it in your hands rather than rubbing it on skin, and keep it on a draining dish — a cold-processed bar sitting in water will soften.",
  },
  {
    question: 'Can I return it?',
    answer:
      "If a bar arrives damaged or you've been sent the wrong one, message us within 7 days with a photo and we'll replace it or refund you — no argument. For hygiene reasons we can't take back a bar that's been used, which is the same rule every soap brand follows.",
  },
  {
    question: 'Why does it say "out of stock" so often?',
    answer:
      "Because every bar is cold-processed and cured by hand, and a batch takes weeks. We'd rather tell you honestly than take your money and ship late. Leave your number on the product page and you'll be the first to know.",
  },
  {
    question: 'Do you test on animals?',
    answer:
      "No. Never have. The bars do contain goat milk and honey, so they aren't vegan — we'd rather say that plainly than let you find out later.",
  },
  {
    question: 'Can I order on WhatsApp instead?',
    answer:
      'Yes. Our full catalogue is on WhatsApp and a real person answers — usually within a few hours. Some people prefer it, especially for a first order.',
  },
];

function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="my-16 sm:my-24 pt-8 border-t border-[#E3D6C4]/60">
      <div className="max-w-[780px] mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-3xl sm:text-[42px] font-semibold text-[#3B2314] tracking-[-0.015em]">
            FAQ
          </h2>
          <p className="text-xs sm:text-[13px] tracking-[0.2em] uppercase font-bold text-[#6B4F35] mt-2">
            Questions people actually ask
          </p>
        </div>

        {/* Accordion Pills List */}
        <div className="flex flex-col gap-3 sm:gap-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`border transition-all duration-300 bg-[#FBF6EE] ${
                  isOpen
                    ? 'border-[#3B2314]/70 rounded-[20px] sm:rounded-[24px] shadow-sm'
                    : 'border-[#DECDBB] hover:border-[#3B2314]/40 rounded-[22px] sm:rounded-full'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 sm:px-8 py-4 sm:py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-[15.5px] sm:text-[17px] font-semibold text-[#3B2314] leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#3B2314] transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    <Plus size={18} strokeWidth={2.2} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-5 sm:pb-6 pt-1 border-t border-[#EADFCE]/70">
                        <p className="font-serif text-sm sm:text-[15px] text-[#4E3626] leading-[1.68]">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="mt-10 sm:mt-14 bg-[#3B2314] text-[#F5EDE0] rounded-[2px] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-5 border border-[#2E1B0F]">
          <div className="flex-1 min-w-[240px]">
            <h3 className="font-serif text-xl sm:text-[22px] font-semibold text-[#F5EDE0] mb-1">
              Still need an answer?
            </h3>
            <p className="font-serif text-xs sm:text-[13.5px] text-[#DBCBB4] leading-relaxed">
              Message us on WhatsApp. A real person answers, usually within a few hours.
            </p>
          </div>
          <a
            href="https://wa.me/919834222363?text=Hi%20The%20Gaav%2C%20I%20have%20a%20question%20about%20your%20bars"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#F5EDE0] text-[#3B2314] px-6 py-3 text-xs sm:text-[12.5px] font-bold tracking-[0.14em] uppercase rounded-[2px] hover:bg-white active:scale-[0.99] transition-all shrink-0"
          >
            Message Us
          </a>
        </div>
      </div>
    </section>
  );
}

export default ProductFAQ;
