import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiChevronDown } from 'react-icons/fi';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { getCompanies, getModels, predictPrice } from '../services/api';
import { DrivingCarLoader } from './AnimatedCar';
import PredictionResult from './PredictionResult';

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'LPG', 'Electric'];

export default function Predictor({ onPrediction }) {
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    company: '',
    model: '',
    fuel_type: 'Petrol',
    year: new Date().getFullYear() - 3,
    kms_driven: 50000,
  });

  useEffect(() => {
    getCompanies()
      .then((res) => setCompanies(res.data.companies))
      .catch(() => toast.error('Failed to load companies'));
  }, []);

  useEffect(() => {
    if (!form.company) {
      setModels([]);
      return;
    }
    setLoadingModels(true);
    getModels(form.company)
      .then((res) => setModels(res.data.models))
      .catch(() => toast.error('Failed to load models'))
      .finally(() => setLoadingModels(false));
  }, [form.company]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'company' ? { model: '' } : {}),
    }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.model) {
      toast.error('Please select company and model');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await predictPrice(form);
      setResult({ ...res.data, ...form });
      onPrediction?.({ ...res.data, ...form });
      toast.success('Price predicted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="predict" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.p variants={fadeInUp} className="section-label mb-3">
            Valuation
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-display text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
            Estimate Your Car&apos;s Value
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-base">
            Enter vehicle details to receive a data-driven price estimate
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong p-8 md:p-10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Company</label>
              <div className="relative">
                <select
                  value={form.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="select-field pr-10"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Car Model</label>
              <div className="relative">
                <select
                  value={form.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="select-field pr-10"
                  required
                  disabled={!form.company || loadingModels}
                >
                  <option value="">{loadingModels ? 'Loading...' : 'Select Model'}</option>
                  {models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Fuel Type</label>
              <div className="relative">
                <select
                  value={form.fuel_type}
                  onChange={(e) => handleChange('fuel_type', e.target.value)}
                  className="select-field pr-10"
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium">Manufacturing Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                min={1990}
                max={new Date().getFullYear() + 1}
                className="input-field"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400 font-medium">
                Kilometers Driven: {form.kms_driven.toLocaleString()} km
              </label>
              <input
                type="range"
                value={form.kms_driven}
                onChange={(e) => handleChange('kms_driven', parseInt(e.target.value))}
                min={0}
                max={300000}
                step={1000}
                className="w-full h-1.5 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 km</span>
                <span>300,000 km</span>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-8"
            whileTap={{ scale: 0.98 }}
          >
            Calculate Price
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {loading && <DrivingCarLoader />}
        </AnimatePresence>

        <AnimatePresence>
          {result && <PredictionResult result={result} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
