import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-surface-border bg-dark-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">V</span>
            </div>
            <span className="font-medium text-sm text-gray-300">ValuAuto</span>
          </div>
          <p className="text-gray-500 text-sm">
            React · FastAPI · Scikit-Learn
          </p>
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} ValuAuto
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
