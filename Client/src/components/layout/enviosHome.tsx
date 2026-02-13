
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import '../../assets/styles/enviosHome.css';

export const EnviosHome = () => {
  return (
    <section className="shipping-section">
      <div className="shipping-container">
        <div className="shipping-steps">
          {/* Paso 1 */}
          <div className="shipping-step">
            <div className="shipping-icon">
              <CreateOutlinedIcon sx={{ fontSize: 48 }} />
            </div>
            <h3 className="shipping-title">Escribinos</h3>
            <p className="shipping-description">Contactanos por WhatsApp o llamada</p>
          </div>

          {/* Conector */}
          <div className="shipping-connector"></div>

          {/* Paso 2 */}
          <div className="shipping-step">
            <div className="shipping-icon">
              <LocalShippingOutlinedIcon sx={{ fontSize: 48 }} />
            </div>
            <h3 className="shipping-title">Armá tu pedido</h3>
            <p className="shipping-description">Te ayudamos a elegir lo mejor</p>
          </div>

          {/* Conector */}
          <div className="shipping-connector"></div>

          {/* Paso 3 */}
          <div className="shipping-step">
            <div className="shipping-icon">
              <HomeOutlinedIcon sx={{ fontSize: 48 }} />
            </div>
            <h3 className="shipping-title">Te lo llevamos</h3>
            <p className="shipping-description">Envío rápido a tu domicilio</p>
          </div>
        </div>

        {/* <button className="shipping-button">Conocer más</button> */}
      </div>
    </section>
  );
};