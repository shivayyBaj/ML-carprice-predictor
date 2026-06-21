import { useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Predictor from '../components/Predictor';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AIInsights from '../components/AIInsights';
import PredictionHistory from '../components/PredictionHistory';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { usePredictionHistory } from '../hooks/useApp';

export default function HomePage() {
  const { addPrediction } = usePredictionHistory();

  const handlePrediction = useCallback((result) => {
    addPrediction(result);
  }, [addPrediction]);

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Predictor onPrediction={handlePrediction} />
        <AnalyticsDashboard />
        <AIInsights />
        <PredictionHistory />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1c2128',
            color: '#e5e7eb',
            border: '1px solid #30363d',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
