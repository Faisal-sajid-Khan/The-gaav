import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import logoImg from '../../assets/Asset 2.png';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-container text-on-surface-variant pt-14 pb-8 border-t border-outline-variant/50">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-12">
          
          {/* Brand & Identity */}
          <div className="lg:w-1/3">
            <Link to="/" className="inline-block mb-6">
              <img src={logoImg} alt="THEGAAV" className="h-32 sm:h-40 w-auto object-contain" />
            </Link>
            <p className="font-serif text-sm text-on-surface-variant leading-relaxed italic">
              Village Wisdom / Modern Care
            </p>
          </div>

          {/* Legal and Contact Block (From PDF) */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-[11px] text-on-surface-variant leading-relaxed">
            <div>
              <p className="mb-4">
                <strong>Manufactured by:</strong><br />
                Ketaki Industries, 553 Dhamangaon,<br />
                Saphale, Palghar 401102, Maharashtra<br />
                Mfg. Lic. No.: MH/105462 | GMP & ISO 9001:2015
              </p>
              <p>
                <strong>Marketed by:</strong><br />
                FN Ayurnidhi Lifescience Company<br />
                Apt. No. 503 B, ANP Retreat,<br />
                Bhumkar Chowk, Pune 411057, Maharashtra
              </p>
            </div>
            
            <div>
              <p className="mb-6">
                <strong>For feedback and enquiries:</strong><br />
                Customer Care: +91 94527 28268<br />
                Email: fnayurnidhilsc@gmail.com<br />
                Instagram: <a href="https://www.instagram.com/thegaav/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-outline-variant underline-offset-2">@thegaav</a>
              </p>
              
              {/* Quick Links */}
              <div className="flex gap-6 text-xs font-sans font-semibold tracking-wide">
                <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
                <Link to="/about" className="hover:text-primary transition-colors">About</Link>
                <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
                <Link to="/shipping-policy" className="hover:text-primary transition-colors">Shipping</Link>
                <Link to="/refund-policy" className="hover:text-primary transition-colors">Returns</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between relative">
          <p className="font-sans text-[10px] sm:text-xs text-outline tracking-wider uppercase">
            Made with Love in India
          </p>

          {/* Back to Top Button */}
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-all shadow-md shrink-0 absolute right-0 -top-5 sm:-top-5"
            aria-label="Back to top"
          >
            <ArrowUp size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
