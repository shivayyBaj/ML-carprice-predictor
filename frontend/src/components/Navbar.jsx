import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../hooks/useApp';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-40 bg-dark-900/80 backdrop-blur-md border-b border-surface-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.button
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => scrollTo('hero')}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-bold">V</span>
          </div>
          <span className="font-display font-semibold text-base text-white tracking-tight">
            ValuAuto
          </span>
        </motion.button>

        <div className="hidden md:flex items-center gap-8">
          {['Predict', 'Analytics', 'Insights', 'History'].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-surface-border text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => scrollTo('predict')}
            className="btn-primary text-sm hidden sm:block"
          >
            Get Valuation
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
