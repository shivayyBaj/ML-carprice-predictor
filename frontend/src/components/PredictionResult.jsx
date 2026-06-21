import { motion } from 'framer-motion';
import { FiDownload, FiTrendingUp, FiShield, FiInfo } from 'react-icons/fi';
import { useCountUp } from '../hooks/useApp';
import { generatePDF } from '../utils/pdfReport';

export default function PredictionResult({ result }) {
  const animatedPrice = useCountUp(result.predicted_price, 2000);

  const formatAnimated = (num) => {
    const s = Math.floor(num).toString();
    if (s.length <= 3) return `₹ ${s}`;
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    const parts = [];
    let r = rest;
    while (r.length > 2) {
      parts.unshift(r.slice(-2));
      r = r.slice(0, -2);
    }
    if (r) parts.unshift(r);
    return `₹ ${parts.join(',')},${last3}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="mt-8 glass-strong p-8 border-l-4 border-l-accent"
    >
      <div className="text-center">
        <p className="section-label mb-2">Estimated Market Value</p>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-4xl md:text-5xl font-semibold text-white mb-8 tracking-tight"
        >
          {formatAnimated(animatedPrice)}
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass p-4 rounded-lg text-left">
            <FiShield className="w-4 h-4 text-accent mb-2" />
            <p className="text-xs text-gray-500 mb-1">Confidence</p>
            <p className="text-lg font-semibold">{result.confidence_score}%</p>
          </div>

          <div className="glass p-4 rounded-lg text-left">
            <FiTrendingUp className="w-4 h-4 text-accent mb-2" />
            <p className="text-xs text-gray-500 mb-1">Model</p>
            <p className="text-sm font-medium">{result.model_used}</p>
          </div>

          <div className="glass p-4 rounded-lg text-left">
            <FiInfo className="w-4 h-4 text-accent mb-2" />
            <p className="text-xs text-gray-500 mb-1">Insight</p>
            <p className="text-xs text-gray-400 leading-relaxed">{result.insight}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400">
          <span className="px-3 py-1 rounded-md bg-dark-600 border border-surface-border">{result.company}</span>
          <span className="px-3 py-1 rounded-md bg-dark-600 border border-surface-border">{result.model}</span>
          <span className="px-3 py-1 rounded-md bg-dark-600 border border-surface-border">{result.year}</span>
          <span className="px-3 py-1 rounded-md bg-dark-600 border border-surface-border">{result.fuel_type}</span>
          <span className="px-3 py-1 rounded-md bg-dark-600 border border-surface-border">{result.kms_driven?.toLocaleString()} km</span>
        </div>

        <button
          onClick={() => generatePDF(result)}
          className="btn-secondary mt-6 inline-flex items-center gap-2 text-sm"
        >
          <FiDownload className="w-4 h-4" /> Download Report
        </button>
      </div>
    </motion.div>
  );
}
