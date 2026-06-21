import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../animations/variants';
import AnimatedCar from './AnimatedCar';

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden border-b border-surface-border">
      <div className="absolute inset-0 bg-hero-gradient" />

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.p variants={fadeInUp} className="section-label mb-4">
            Machine Learning Valuation Platform
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl md:text-6xl font-semibold leading-tight mb-6 tracking-tight"
          >
            Used Car Price
            <br />
            <span className="accent-text">Predictor</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Estimate market value instantly with data-driven models trained on real Indian used-car listings.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <motion.button
              onClick={() => scrollTo('predict')}
              className="btn-primary text-base"
              whileTap={{ scale: 0.98 }}
            >
              Get Valuation
            </motion.button>
            <motion.button
              onClick={() => scrollTo('analytics')}
              className="btn-secondary text-base"
              whileTap={{ scale: 0.98 }}
            >
              View Analytics
            </motion.button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-14 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 pt-8 border-t border-surface-border"
          >
            {[
              { value: '5', label: 'ML Models' },
              { value: '723', label: 'Records' },
              { value: '0.52', label: 'R² Score' },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-2xl font-semibold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-strong p-10 rounded-2xl">
            <AnimatedCar className="w-full max-w-md mx-auto" />
            <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
              <span>Real-time estimates</span>
              <span className="text-surface-border">|</span>
              <span>723+ vehicles analyzed</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
