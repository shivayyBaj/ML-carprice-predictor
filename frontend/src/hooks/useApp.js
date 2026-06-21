import { useState, useEffect } from 'react';

export function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!end || end <= 0) return;
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (end - start) * eased));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

export function usePredictionHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    } catch {
      return [];
    }
  });

  const addPrediction = (prediction) => {
    const entry = { ...prediction, id: Date.now(), timestamp: new Date().toISOString() };
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 50);
      localStorage.setItem('predictionHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('predictionHistory');
  };

  return { history, addPrediction, clearHistory };
}
