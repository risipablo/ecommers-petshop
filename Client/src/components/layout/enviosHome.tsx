// components/layout/enviosHome.tsx

import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  CreditCard, 
  Store, 
  
  MapPin,
  Clock,
  ArrowBigRight
} from 'lucide-react';
import '../../assets/styles/enviosHome.css';

export const EnviosHome = () => {
  // Variants para animaciones - CORREGIDO
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const, // <-- AÑADIR "as const"
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: {
        type: "spring" as const, // <-- AÑADIR "as const"
        stiffness: 300,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      rotate: -3
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -3,
      boxShadow: "0 8px 25px rgba(37, 211, 102, 0.35)",
      transition: {
        type: "spring" as const, // <-- AÑADIR "as const"
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.95,
      y: 0
    }
  };

  const connectorVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut" as const, // <-- AÑADIR "as const"
        delay: 0.4
      }
    }
  };

  return (
    <motion.section 
      className="shipping-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="shipping-container">
        {/* Header */}
        <motion.div 
          className="shipping-header"
          variants={itemVariants}
        >
          <h1 className="shipping-headline">
            ¿Cómo comprar?
          </h1>
          <p className="shipping-subheadline">
            3 pasos simples para tener lo mejor para tu mascota
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          className="shipping-steps"
          variants={containerVariants}
        >
          {/* Paso 1 */}
          <motion.div 
            className="shipping-step"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="shipping-icon cart"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ShoppingCart size={48} strokeWidth={1.5} />
            </motion.div>
            <div className="step-number">1</div>
            <h3 className="shipping-title">Armá tu pedido</h3>
            <p className="shipping-description">
              Consultanos por WhatsApp y elegí los productos que necesitas
            </p>
          </motion.div>

          {/* Conector 1 */}
          <motion.div 
            className="shipping-connector"
            variants={connectorVariants}
          >
            <motion.span 
              className="connector-arrow"
              animate={{ y: [0, 5, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" as const
              }}
            >
              ↓
            </motion.span>
          </motion.div>

          {/* Paso 2 */}
          <motion.div 
            className="shipping-step"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="shipping-icon payment"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <CreditCard size={48} strokeWidth={1.5} />
            </motion.div>
            <div className="step-number">2</div>
            <h3 className="shipping-title">Pagá tu compra</h3>
            <p className="shipping-description">
              Por transferencia bancaria o directamente en nuestro local
            </p>
          </motion.div>

          {/* Conector 2 */}
          <motion.div 
            className="shipping-connector"
            variants={connectorVariants}
          >
            <motion.span 
              className="connector-arrow"
              animate={{ y: [0, 5, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay: 0.5
              }}
            >
              ↓
            </motion.span>
          </motion.div>

          {/* Paso 3 */}
          <motion.div 
            className="shipping-step"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="shipping-icon store"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Store size={48} strokeWidth={1.5} />
            </motion.div>
            <div className="step-number">3</div>
            <h3 className="shipping-title">Retirá tu pedido</h3>
            <p className="shipping-description">
              Presentá tu orden de compra y retiralo por nuestro local
            </p>
          </motion.div>
        </motion.div>

        {/* Botón CTA */}
        <motion.button 
          className="shipping-button"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <ArrowBigRight size={20} strokeWidth={2} />
          Armar Pedido
        </motion.button>

        {/* Footer con info del local */}
        <motion.div 
          className="shipping-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span>
            <MapPin size={14} strokeWidth={2} />
            Belgrano 321, Cipolletti
          </span>
          <span>
            <Clock size={14} strokeWidth={2} />
            Lun a Sáb 9:00 - 13:00 hs / 17::00 - 20:30 hs
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
};