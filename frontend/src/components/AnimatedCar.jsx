import { motion } from 'framer-motion';

export default function AnimatedCar({ className = '' }) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="50%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="carHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        <ellipse cx="200" cy="108" rx="140" ry="5" fill="rgba(0,0,0,0.3)" />

        <path
          d="M60 75 L90 45 L140 35 L260 35 L310 45 L340 75 L340 85 L60 85 Z"
          fill="url(#carBody)"
        />
        <path
          d="M60 75 L90 45 L140 35 L260 35 L310 45 L340 75 L340 85 L60 85 Z"
          fill="url(#carHighlight)"
        />
        <path d="M100 45 L130 45 L125 65 L95 65 Z" fill="rgba(255,255,255,0.08)" />
        <path d="M150 40 L250 40 L245 65 L155 65 Z" fill="rgba(255,255,255,0.05)" />
        <path d="M260 45 L290 45 L285 65 L255 65 Z" fill="rgba(255,255,255,0.08)" />

        <rect x="130" y="38" width="120" height="2" rx="1" fill="rgba(59,130,246,0.5)" />

        <circle cx="110" cy="85" r="20" fill="#1c2128" stroke="#4b5563" strokeWidth="2" />
        <circle cx="110" cy="85" r="10" fill="#374151" />
        <circle cx="290" cy="85" r="20" fill="#1c2128" stroke="#4b5563" strokeWidth="2" />
        <circle cx="290" cy="85" r="10" fill="#374151" />

        <rect x="345" y="72" width="18" height="3" rx="1.5" fill="#ef4444" opacity="0.8" />
        <circle cx="55" cy="78" r="3" fill="#fbbf24" opacity="0.7" />
      </svg>
    </motion.div>
  );
}

export function DrivingCarLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-900/95 backdrop-blur-sm">
      <div className="relative w-full overflow-hidden mb-8 h-24">
        <motion.div
          className="absolute left-0 w-40"
          animate={{ x: ['-160px', 'calc(100vw + 160px)'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        >
          <AnimatedCar />
        </motion.div>
      </div>
      <p className="text-sm font-medium text-gray-300 tracking-wide">
        Calculating market value...
      </p>
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
