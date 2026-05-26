// components/layout/enviosHome.tsx

import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import '../../assets/styles/enviosHome.css';

export const EnviosHome = () => {
  return (
    <section className="shipping-section">
      <div className="shipping-container">
        <div className="shipping-steps">
          {/* Paso 1 - Contacto */}
          <div className="shipping-step">
            <div className="shipping-icon whatsapp">
              <WhatsAppIcon sx={{ fontSize: 48 }} />
            </div>
            <h3 className="shipping-title">Escribinos</h3>
            <p className="shipping-description">Consultanos por WhatsApp sobre productos y disponibilidad</p>
          </div>

          {/* Conector */}
          <div className="shipping-connector"></div>

          {/* Paso 2 - Armado de pedido */}
          <div className="shipping-step">
            <div className="shipping-icon cart">
              <ShoppingCartOutlinedIcon sx={{ fontSize: 48 }} />
            </div>
            <h3 className="shipping-title">Armá tu pedido</h3>
            <p className="shipping-description">Te ayudamos a elegir los mejores productos para tu mascota</p>
          </div>

          {/* Conector */}
          <div className="shipping-connector"></div>

          {/* Paso 3 - Pago con Mercado Pago */}
          <div className="shipping-step">
            <div className="shipping-icon payment">
              <PaymentOutlinedIcon sx={{ fontSize: 48 }} />
            </div>
            <h3 className="shipping-title">Pagalo con Mercado Pago</h3>
            <p className="shipping-description">Pago seguro, rápido y con múltiples opciones de financiación</p>
          </div>
        </div>

        {/* Botón de acción principal */}
        <button className="shipping-button">
          <WhatsAppIcon sx={{ fontSize: 20 }} />
          Consultar por WhatsApp
        </button>
      </div>
    </section>
  );
};