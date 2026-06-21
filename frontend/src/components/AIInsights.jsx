import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingDown, FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { getAnalytics } from '../services/api';
import { CardSkeleton } from './Skeleton';

export default function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setInsights(res.data.insights))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="insights" className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (!insights) return null;

  const cards = [
    {
      icon: FiDollarSign,
      title: 'Best Value Brands',
      items: insights.best_value_brands?.map((b) => `${b.company} — ₹${b.avg_price.toLocaleString()}`),
    },
    {
      icon: FiTrendingUp,
      title: 'Most Expensive Brands',
      items: insights.most_expensive_brands?.map((b) => `${b.company} — ₹${b.avg_price.toLocaleString()}`),
    },
    {
      icon: FiActivity,
      title: 'Fuel Type Trends',
      items: insights.fuel_type_trends?.map((f) => `${f.fuel_type} — ₹${f.avg_price.toLocaleString()} avg`),
    },
    {
      icon: FiTrendingDown,
      title: 'Price Depreciation',
      items: [`Overall rate: ${insights.depreciation_rate}%`, 'Newer cars retain higher resale value'],
    },
    {
      icon: FiActivity,
      title: 'Mileage Impact',
      items: [
        `Correlation: ${insights.mileage_price_correlation}`,
        insights.mileage_impact,
      ],
    },
    {
      icon: FiDollarSign,
      title: 'Market Summary',
      items: [
        'Models trained on real Quikr car listings',
        'Prices reflect Indian used car market trends',
        'Estimates account for brand, age, fuel & mileage',
      ],
    },
  ];

  return (
    <section id="insights" className="py-24 px-4 border-t border-surface-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.p variants={fadeInUp} className="section-label mb-3">
            Insights
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-display text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
            Market Observations
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-base">
            Key trends derived from the dataset
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 hover:border-gray-600 transition-colors"
            >
              <card.icon className="w-5 h-5 text-accent mb-3" />
              <h3 className="font-medium text-white mb-3">{card.title}</h3>
              <ul className="space-y-2">
                {card.items?.map((item, j) => (
                  <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-gray-600 mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
