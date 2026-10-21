import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';
import logoImg from '../../assets/Asset 2.png';

function Footer() {
  return (
    <footer className="bg-[#3B2314] text-[#DBCBB4] border-t border-[#5C4332]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 pt-16 pb-8">
        {/* Main Footer Links & Brand Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 sm:gap-12 mb-14">
          {/* Brand & Mission Statement Column */}
          <div className="lg:col-span-3 max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <img
                src={logoImg}
                alt="The Gaav"
                className="h-10 sm:h-12 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="font-serif text-sm sm:text-[15px] leading-[1.62] text-[#BFA98D]">
              Handcrafted Ayurvedic personal care from rural Maharashtra. Cold-processed in small batches with goat milk, kokum, neem and turmeric.
            </p>
          </div>

          {/* Column 1: Shop */}
          <div className="lg:col-span-1">
            <div className="text-[11.5px] tracking-[0.2em] uppercase font-bold text-[#8F7A61] mb-5">
              Shop
            </div>
            <ul className="flex flex-col gap-3 font-serif text-sm sm:text-[15px]">
              <li>
                <Link to="/shop" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  All four bars
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  Build your three
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  Single bars
                </Link>
              </li>
              <li>
                <a href="#ingredients" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  Ingredients
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: The Gaav */}
          <div className="lg:col-span-1">
            <div className="text-[11.5px] tracking-[0.2em] uppercase font-bold text-[#8F7A61] mb-5">
              The Gaav
            </div>
            <ul className="flex flex-col gap-3 font-serif text-sm sm:text-[15px]">
              <li>
                <Link to="/about" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  Our story
                </Link>
              </li>
              <li>
                <a href="#top" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  How it&apos;s made
                </a>
              </li>
              <li>
                <a href="tel:+919452720268" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="lg:col-span-1">
            <div className="text-[11.5px] tracking-[0.2em] uppercase font-bold text-[#8F7A61] mb-5">
              Help
            </div>
            <ul className="flex flex-col gap-3 font-serif text-sm sm:text-[15px]">
              <li>
                <Link to="/shipping-policy" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  Shipping &amp; returns
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-[#DBCBB4] hover:text-[#F5EDE0] transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Social Bar */}
        <div className="border-t border-[#5C4332] pt-7 flex flex-wrap items-center justify-between gap-5">
          <span className="font-serif text-xs sm:text-[13.5px] text-[#8F7A61]">
            © 2026 FN Ayurnidhi Life Science Company · Made in Maharashtra, India
          </span>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/thegaav/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The Gaav on Instagram"
              className="w-10 h-10 rounded-full border border-[#5C4332] flex items-center justify-center text-[#DBCBB4] hover:text-[#F5EDE0] hover:border-[#8F7A61] transition-all"
            >
              <Instagram size={18} />
            </a>

            <a
              href="https://wa.me/919452720268"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              className="w-10 h-10 rounded-full border border-[#5C4332] flex items-center justify-center text-[#DBCBB4] hover:text-[#F5EDE0] hover:border-[#8F7A61] transition-all"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
