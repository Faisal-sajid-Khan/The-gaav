import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function OriginStoryQuote() {
  return (
    <section className="py-12 sm:py-16 bg-[#fcf9f8] border-t border-[#e8dfd5]/60">
      <div className="max-w-xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Devanagari Poetic Origin Story */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#4a2e10] font-bold leading-relaxed mb-3">
          ती रात्र, घर परंपरेचं<br />
          रहावं म्हणून.
        </h2>

        {/* Origin story subtitle */}
        <p className="font-sans text-xs sm:text-sm text-[#7a6452] tracking-wide mb-5 font-medium">
          Three lines of the origin story.
        </p>

        {/* Read our story Link */}
        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wider text-[#4a2e10] hover:text-[#8c6239] transition-colors group underline-offset-4 hover:underline"
        >
          <span>Read our story</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

export default OriginStoryQuote;
