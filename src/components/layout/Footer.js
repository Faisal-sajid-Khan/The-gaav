import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Leaf, Flower2, ArrowUp } from 'lucide-react';
import logoImg from '../../assets/Asset 2.png';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#eae5dd] text-[#4a2e10] pt-14 pb-8 border-t border-[#d4c4b7]">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Brand Section */}
        <div className="mb-8">
          <Link to="/" className="inline-block mb-4">
            <img src={logoImg} alt="THEGAAV" className="h-36 sm:h-44 w-auto object-contain" />
          </Link>
          <p className="font-sans text-xs sm:text-sm text-[#7a6452] leading-relaxed max-w-sm">
            Bringing you the essence of ancient Indian heritage, refined for the modern world.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-[#d4c4b7]/60">
          <div>
            <h4 className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8c7462] mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/shop" className="text-[#4a2e10] hover:text-[#8c6239] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#4a2e10] hover:text-[#8c6239] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#4a2e10] hover:text-[#8c6239] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#4a2e10] hover:text-[#8c6239] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8c7462] mb-4">
              LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/privacy-policy" className="text-[#4a2e10] hover:text-[#8c6239] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-[#4a2e10] hover:text-[#8c6239] transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-[#4a2e10] hover:text-[#8c6239] transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Social Icons & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full border border-[#d4c4b7] flex items-center justify-center text-[#4a2e10] hover:bg-[#d4c4b7]/30 transition-colors">
              <Globe size={15} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-[#d4c4b7] flex items-center justify-center text-[#4a2e10] hover:bg-[#d4c4b7]/30 transition-colors">
              <Leaf size={15} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-[#d4c4b7] flex items-center justify-center text-[#4a2e10] hover:bg-[#d4c4b7]/30 transition-colors">
              <Flower2 size={15} />
            </a>
          </div>

          <p className="font-sans text-[10px] sm:text-xs text-[#8c7462] text-center">
            © 2024 THEGAAV. Rooted in Heritage, Crafted for You.
          </p>

          {/* Back to Top Button */}
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#4a2e10] text-[#fcf9f8] flex items-center justify-center hover:bg-[#38220b] transition-all shadow-md shrink-0 sm:static absolute right-0 bottom-0"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
