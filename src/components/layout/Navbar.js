import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingBag, ChevronDown, ArrowRight, Sparkles, Tag, Gift, Truck, User } from 'lucide-react';
import { getAllCollections } from '../../lib/shopify';
import {
  toggleCartDrawer,
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearch,
  closeSearch,
} from '../../store/uiSlice';
import logoImg from '../../assets/Asset 1.png';

/* ─────────────────────────────────────────────
   STATIC NAV LINKS (non-shop items)
───────────────────────────────────────────── */
const OTHER_NAV = [
  { label: 'About',     href: '#about'  },
  { label: 'Our Story', href: '#story'  },
  { label: 'Blog',      href: '#blog'   },
];

const ANNOUNCEMENTS = [
  { icon: Truck,    text: 'Free shipping on orders above ₹999' },
  { icon: Sparkles, text: 'Handcrafted with love — every stitch tells a story' },
  { icon: Gift,     text: 'Gift wrapping available on all orders' },
  { icon: Tag,      text: 'New collection just dropped — explore now' },
];

/* ─────────────────────────────────────────────
   ANNOUNCEMENT BAR
───────────────────────────────────────────── */
function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 3500);
    return () => clearInterval(t);
  }, []);
  const item = ANNOUNCEMENTS[index];
  return (
    <div className="relative overflow-hidden bg-primary text-on-primary h-9 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="absolute flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase"
        >
          <item.icon size={13} strokeWidth={2} className="text-gold opacity-80 shrink-0" />
          {item.text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MEGA MENU  (dynamic collections)
───────────────────────────────────────────── */
function MegaMenu({ collections, isOpen }) {
  // Split collections into two equal columns
  const mid   = Math.ceil(collections.length / 2);
  const colA  = collections.slice(0, mid);
  const colB  = collections.slice(mid);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[580px] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30"
          style={{ background: 'rgba(252,249,248,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <div className="grid grid-cols-3 gap-0">
            {/* Featured promo panel */}
            <div className="col-span-1 bg-primary p-6 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-gold/20 text-gold text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full mb-3">Just In</span>
                <h4 className="font-serif text-on-primary text-xl leading-snug mb-1">New Arrivals</h4>
                <p className="text-on-primary/60 text-xs mt-1">Hand-crafted for the season</p>
              </div>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase text-on-primary/80 hover:text-on-primary transition-colors group"
              >
                View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Dynamic collection columns */}
            <div className="col-span-2 p-6 grid grid-cols-2 gap-6">
              {/* Column A */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-outline mb-3">Collections</p>
                <ul className="flex flex-col gap-2.5">
                  {colA.map((col) => (
                    <li key={col.id}>
                      <Link
                        to={`/collection/${col.handle}`}
                        className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                      >
                        {col.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column B — only if we have enough collections */}
              {colB.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-outline mb-3">More</p>
                  <ul className="flex flex-col gap-2.5">
                    {colB.map((col) => (
                      <li key={col.id}>
                        <Link
                          to={`/collection/${col.handle}`}
                          className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                        >
                          {col.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   SEARCH OVERLAY  (fully functional)
───────────────────────────────────────────── */
function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef  = useRef(null);
  const navigate  = useNavigate();

  /* Auto-focus on open */
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  /* Escape key closes */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSearch = (term) => {
    const q = (term ?? query).trim();
    if (!q) return;
    onClose();
    navigate(`/shop?q=${encodeURIComponent(q)}`);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const QUICK_TERMS = ['Kurtis', 'Block Print', 'Festive', 'Natural Dye', 'Serum', 'New Arrivals'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col items-center pt-28"
          style={{ background: 'rgba(252,249,248,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ delay: 0.05, duration: 0.25 }}
            className="w-full max-w-2xl px-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="relative flex items-center border-b-2 border-primary pb-3">
              <Search size={20} className="text-outline mr-4 shrink-0" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search products…"
                className="flex-1 bg-transparent text-xl font-sans text-on-surface placeholder:text-outline/50 outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="mr-2 p-1 text-outline hover:text-primary transition-colors">
                  <X size={16} strokeWidth={2} />
                </button>
              )}
              <button
                onClick={() => handleSearch()}
                className="ml-2 px-4 py-1.5 bg-primary text-on-primary text-xs font-bold tracking-wide rounded-lg hover:bg-[#4a2e10] transition-colors"
              >
                Search
              </button>
            </div>

            {/* Quick search terms */}
            <div className="mt-5">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_TERMS.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-surface-container text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   MOBILE SIDEBAR
───────────────────────────────────────────── */
function MobileSidebar({ isOpen, onClose, cartCount, onCartOpen, collections }) {
  const staticLinks = [
    { label: 'About',        href: '#about'   },
    { label: 'Our Story',    href: '#story'   },
    { label: 'Blog',         href: '#blog'    },
    { label: 'Contact',      href: '#contact' },
  ];

  // Merge dynamic collections + static links
  const allLinks = [
    ...collections.map((c) => ({ label: c.title, href: `/collection/${c.handle}` })),
    ...staticLinks,
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] bg-inverse-surface/40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 35 }}
        className="fixed top-0 left-0 h-full w-80 max-w-[85vw] z-[70] flex flex-col bg-surface border-r border-outline-variant/40 shadow-2xl"
      >
        <div className="flex items-center justify-between px-7 py-6 border-b border-outline-variant/40">
          <Link to="/" onClick={onClose} className="flex items-center group shrink-0">
            <img src={logoImg} alt="THEGAAV" className="h-9 w-auto object-contain" />
          </Link>
          <button onClick={onClose} className="p-1.5 text-on-surface-variant hover:text-primary transition-colors">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-7 py-8">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-outline mb-5">Navigate</p>
          <ul className="flex flex-col gap-1">
            {allLinks.map((link, i) => (
              <motion.li
                key={link.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0 }}
                transition={{ delay: isOpen ? 0.06 + i * 0.04 : 0, duration: 0.3 }}
              >
                <Link
                  to={link.href} onClick={onClose}
                  className="group flex items-center justify-between py-3 text-sm font-bold tracking-[0.12em] uppercase text-on-surface-variant hover:text-primary transition-colors border-b border-outline-variant/30"
                >
                  {link.label}
                  <ArrowRight size={13} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.li>
            ))}
          </ul>

          <button
            onClick={() => { onClose(); onCartOpen(); }}
            className="mt-8 w-full flex items-center justify-between bg-primary text-on-primary px-5 py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-[#4a2e10] transition-colors shadow-md"
          >
            <span className="flex items-center gap-2"><ShoppingBag size={16} strokeWidth={2} /> View Cart</span>
            {cartCount > 0 && (
              <span className="bg-gold text-primary text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </nav>

        <div className="px-7 py-6 border-t border-outline-variant/40">
          <p className="text-[11px] text-outline tracking-wide">© 2025 THEGAAV · Crafted with ❤️</p>
        </div>
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const dispatch       = useDispatch();
  const location       = useLocation();
  const itemCount      = useSelector((state) => state.cart.itemCount);
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const searchOpen     = useSelector((state) => state.ui.searchOpen);

  const [scrolled, setScrolled]     = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [collections, setCollections] = useState([]);   // ← dynamic Shopify collections
  const menuTimeout = useRef(null);

  /* Fetch collections once on mount */
  useEffect(() => {
    getAllCollections(20)
      .then((res) => {
        const cols = res.data?.collections?.edges?.map((e) => e.node) || [];
        setCollections(cols);
      })
      .catch(() => {}); // silent fail — navbar still works without collections
  }, []);

  useEffect(() => { dispatch(closeMobileMenu()); }, [location, dispatch]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMenuEnter = (label) => { clearTimeout(menuTimeout.current); setActiveMenu(label); };
  const handleMenuLeave = () => { menuTimeout.current = setTimeout(() => setActiveMenu(null), 120); };

  return (
    <>
      <AnnouncementBar />
      <SearchOverlay isOpen={searchOpen} onClose={() => dispatch(closeSearch())} />

      <motion.header
        initial={false}
        animate={scrolled
          ? { backgroundColor: 'rgba(252,249,248,0.97)', borderBottomColor: 'rgba(212,196,183,0.5)' }
          : { backgroundColor: 'rgba(252,249,248,0.0)', borderBottomColor: 'rgba(212,196,183,0)' }
        }
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="sticky top-0 z-50 w-full border-b"
        style={{ backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)', WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)' }}
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-4">
            <button onClick={() => dispatch(toggleMobileMenu())} className="lg:hidden flex flex-col gap-[5px] p-2 group" aria-label="Open menu">
              <span className="block w-5 h-[1.5px] bg-primary rounded-full transition-all duration-300 group-hover:w-6" />
              <span className="block w-5 h-[1.5px] bg-primary rounded-full transition-all duration-300 group-hover:w-4" />
            </button>
            <Link to="/" className="flex items-center group shrink-0 py-1">
              <img src={logoImg} alt="THEGAAV" className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </Link>
          </div>

          {/* Centre: desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 relative">
            {/* Shop — with dynamic mega menu */}
            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter('Shop')}
              onMouseLeave={handleMenuLeave}
            >
              <Link
                to="/shop"
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                  location.pathname === '/shop' ? 'text-primary bg-primary/8' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Shop
                <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform duration-200 ${activeMenu === 'Shop' ? 'rotate-180' : ''}`} />
              </Link>
              <MegaMenu collections={collections} isOpen={activeMenu === 'Shop'} />
            </div>

            {/* Other static links */}
            {OTHER_NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="px-4 py-2 rounded-lg text-sm font-semibold tracking-wide text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: search + account + cart + CTA */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => dispatch(toggleSearch())} className="p-2.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/account" className="flex p-2.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" aria-label="Account">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button onClick={() => dispatch(toggleCartDrawer())} className="relative flex items-center gap-2 p-2.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all group" aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-primary text-on-primary text-[10px] font-black rounded-full flex items-center justify-center shadow"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link to="/shop" className="hidden md:flex ml-1 items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-bold tracking-[0.12em] uppercase hover:bg-primary/85 transition-all group">
              Shop Now <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.header>

      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => dispatch(closeMobileMenu())}
        cartCount={itemCount}
        onCartOpen={() => dispatch(toggleCartDrawer())}
        collections={collections}
      />
    </>
  );
}

export default Navbar;
