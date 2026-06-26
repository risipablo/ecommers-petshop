import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Facebook } from 'lucide-react';
import "../../assets/styles/footer.css";

export const Footer = () => {
  const categories = [
    { name: 'Alimentos', path: '/alimentos' },
    { name: 'Accesorios', path: '/accesorios' },
    { name: 'Indumentaria', path: '/indumentaria' },
    { name: 'Artículos', path: '/articulos' },
    { name: 'Contacto', path: '/contacto' },
    { name: '¿Cómo llegar?', path: '/ubicacion' }
  ];

  const contacts = [
    { 
      icon: <Phone size={18} />, 
      text: '(299) 4707701', 
      link: 'https://wa.me/542994707701',
      external: true
    },
    { 
      icon: <MapPin size={18} />, 
      text: 'Belgrano 321 - Cipolletti', 
      link: '/ubicacion',
      external: false
    },
    { 
      icon: <Mail size={18} />, 
      text: 'bambinapetshop@hotmail.com', 
      link: '/contacto',
      external: false
    }
  ];

  const socialLinks = [
    { 
      icon: <Instagram size={24} />, 
      link: 'https://www.instagram.com/bambinapetshop', 
      className: 'btn-insta',
      label: 'Instagram'
    },
    { 
      icon: <Facebook size={24} />, 
      link: 'https://www.facebook.com/Bambina.alimentosyaccesorios', 
      className: 'btn-face',
      label: 'Facebook'
    }
  ];

  return (
    <footer id="pie-pagina" className="pie-pagina">
      <div className="grupo-1">
        {/* Categorías */}
        <div className="box">
          <h3>Categorías</h3>
          <div className="Categorias">
            <ul>
              {categories.map((category) => (
                <li key={category.path}>
                  <Link to={category.path}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contactos */}
        <div className="box">
          <h3>Contactos</h3>
          <div className="contacto">
            <ul>
              {contacts.map((contact, index) => (
                <li key={index}>
                  <span className="contact-icon">{contact.icon}</span>
                  {contact.external ? (
                    <a href={contact.link} target="_blank" rel="noopener noreferrer">
                      {contact.text}
                    </a>
                  ) : (
                    <Link to={contact.link}>
                      {contact.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="box">
          <h3>Síguenos en nuestras redes</h3>
          <div className="red-social">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                className={social.className}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="grupo-2">
        <small>
          &copy; {new Date().getFullYear()} BAMBINA Petshop{' '}
          <b>Todos los derechos reservados</b>
        </small>
      </div>
    </footer>
  );
};

export default Footer;