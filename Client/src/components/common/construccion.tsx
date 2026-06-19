// components/common/UnderConstruction.tsx

import { motion } from 'framer-motion';
import { 
  Construction, 
  Hammer, 
  HardHat, 
  Wrench,
  TrendingUp,
  ArrowRight,
  Clock 
} from 'lucide-react';
import '../../assets/styles/underConstruction.css';
import { useEffect } from 'react';

interface UnderConstructionProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const UnderConstruction = ({ 
  title = "🚧 En construcción",
  message = "Estamos trabajando para mejorarlo. Te invitamos a que sigas con nosotros en este viaje.",
  icon
}: UnderConstructionProps) => {

    useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, [location.pathname]);
        
  return (
    <motion.section 
      className="under-construction"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="construction-container">
        {/* Icono animado */}
        <motion.div 
          className="construction-icon-wrapper"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {icon || <Construction size={64} strokeWidth={1.5} />}
        </motion.div>

        {/* Herramientas decorativas */}
        <div className="construction-tools">
          <motion.div 
            className="tool hammer"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          >
            <Hammer size={24} />
          </motion.div>
          <motion.div 
            className="tool wrench"
            animate={{ 
              y: [0, 8, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Wrench size={24} />
          </motion.div>
          <motion.div 
            className="tool hardhat"
            animate={{ 
              y: [0, -6, 0],
              rotate: [0, 8, -8, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }}
          >
            <HardHat size={24} />
          </motion.div>
        </div>

        {/* Texto */}
        <div className="construction-content">
          <motion.h2 
            className="construction-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {title}
          </motion.h2>

          <motion.p 
            className="construction-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {message}
          </motion.p>

          {/* Indicador de progreso */}
          <motion.div 
            className="construction-progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="progress-bar">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ 
                  delay: 0.8, 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </div>
            <span className="progress-label">Progreso: 65%</span>
          </motion.div>

          {/* Botón de acción */}
          <motion.button 
            className="construction-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/'}
          >
            <TrendingUp size={18} />
            Volver al inicio
            <ArrowRight size={18} />
          </motion.button>

          {/* Texto adicional */}
          <motion.p 
            className="construction-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Clock size={14} />
            Muy pronto estará disponible
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};