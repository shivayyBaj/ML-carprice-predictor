import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiTrash2, FiClock } from 'react-icons/fi';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { usePredictionHistory } from '../hooks/useApp';

export default function PredictionHistory() {
  const { history, clearHistory } = usePredictionHistory();
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  const companies = useMemo(
    () => [...new Set(history.map((h) => h.company))].sort(),
    [history]
  );

  const filtered = useMemo(() => {
    return history.filter((h) => {
      const matchSearch = !search ||
        h.company?.toLowerCase().includes(search.toLowerCase()) ||
        h.model?.toLowerCase().includes(search.toLowerCase());
      const matchCompany = !filterCompany || h.company === filterCompany;
      return matchSearch && matchCompany;
    });
  }, [history, search, filterCompany]);

  return (
    <section id="history" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.p variants={fadeInUp} className="section-label mb-3">
            History
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-display text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
            Recent Valuations
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-base">
            Your recent car price predictions
          </motion.p>
        </motion.div>

        {history.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search by company or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="select-field sm:w-48"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <motion.button
              onClick={clearHistory}
              className="btn-secondary flex items-center gap-2 justify-center text-sm text-red-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiTrash2 /> Clear
            </motion.button>
          </div>
        )}

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 text-center"
          >
            <FiClock className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-gray-500">No valuations yet. Run your first estimate above.</p>
          </motion.div>
        ) : (
          <div className="glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase tracking-wide">Date</th>
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase tracking-wide">Company</th>
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase tracking-wide">Model</th>
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase tracking-wide hidden md:table-cell">Year</th>
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase tracking-wide hidden md:table-cell">Fuel</th>
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase tracking-wide hidden lg:table-cell">KM</th>
                    <th className="text-right p-4 text-gray-500 font-medium text-xs uppercase tracking-wide">Price</th>
                    <th className="text-right p-4 text-gray-500 font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((item, i) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 text-gray-400">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium">{item.company}</td>
                        <td className="p-4">{item.model}</td>
                        <td className="p-4 hidden md:table-cell">{item.year}</td>
                        <td className="p-4 hidden md:table-cell">{item.fuel_type}</td>
                        <td className="p-4 hidden lg:table-cell">{item.kms_driven?.toLocaleString()}</td>
                        <td className="p-4 text-right font-semibold text-white">{item.formatted_price}</td>
                        <td className="p-4 text-right hidden sm:table-cell text-gray-400">{item.confidence_score}%</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
