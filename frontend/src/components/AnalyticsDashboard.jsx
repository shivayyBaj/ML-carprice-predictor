import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { getAnalytics, getMetrics } from '../services/api';
import { ChartSkeleton, CardSkeleton } from './Skeleton';

const COLORS = ['#3b82f6', '#64748b', '#475569', '#94a3b8', '#2563eb', '#1e40af', '#334155', '#6b7280'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 text-sm">
      <p className="text-gray-500">{label || payload[0]?.payload?.year}</p>
      <p className="font-semibold text-white">
        {typeof payload[0].value === 'number'
          ? payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })
          : payload[0].value}
      </p>
    </div>
  );
};

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getMetrics()])
      .then(([analyticsRes, metricsRes]) => {
        setAnalytics(analyticsRes.data);
        setMetrics(metricsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="analytics" className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </section>
    );
  }

  if (!analytics) return null;

  const fuelData = Object.entries(analytics.fuel_distribution || {}).map(([name, value]) => ({ name, value }));
  const companyData = Object.entries(analytics.company_distribution || {}).map(([name, value]) => ({ name, value }));
  const avgPriceData = Object.entries(analytics.avg_price_by_company || {}).map(([name, avg_price]) => ({ name, avg_price }));
  const modelMetrics = metrics?.models
    ? Object.entries(metrics.models).map(([name, m]) => ({ name, ...m }))
    : [];

  return (
    <section id="analytics" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="section-label mb-3">
            Data
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-display text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
            Analytics Dashboard
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-base">
            Data-driven insights from {analytics.total_records?.toLocaleString()} vehicle records
          </motion.p>
        </motion.div>

        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <span className="glass px-4 py-2 rounded-lg text-sm text-gray-400">
              Best model: <strong className="text-white font-medium">{metrics.best_model}</strong>
            </span>
          </motion.div>
        )}

        {modelMetrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
          >
            {modelMetrics.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass p-4 text-center ${m.name === metrics?.best_model ? 'ring-1 ring-accent border-accent/50' : ''}`}
              >
                <p className="text-xs text-gray-500 mb-2 truncate">{m.name}</p>
                <p className="text-lg font-semibold text-white">R² {m.r2}</p>
                <p className="text-xs text-gray-500 mt-1">MAE: ₹{m.mae?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">RMSE: ₹{m.rmse?.toLocaleString()}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-6"
          >
            <h3 className="font-display text-lg font-semibold mb-4">Year vs Price Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.year_vs_price}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="avg_price" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-6"
          >
            <h3 className="font-display text-lg font-semibold mb-4">KM Driven vs Price</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="kms_driven" name="KM" stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="price" name="Price" stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={analytics.kms_vs_price} fill="#64748b" fillOpacity={0.5} />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-6"
          >
            <h3 className="font-display text-lg font-semibold mb-4">Fuel Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={fuelData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {fuelData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-6"
          >
            <h3 className="font-display text-lg font-semibold mb-4">Company Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#64748b" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-6 lg:col-span-2"
          >
            <h3 className="font-display text-lg font-semibold mb-4">Average Price by Company</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} angle={-30} textAnchor="end" height={70} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg_price" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
