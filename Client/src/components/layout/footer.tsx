import "../../assets/styles/footer.css"

import { 
  MapPin, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook,
//   MessageCircle
} from 'lucide-react';

export const Footer = () => {
  
  const categories = [
    { id: 'alimentos', name: 'Alimentos', path: '/alimentos' },
    { id: 'accesorios', name: 'Accesorios', path: '/accesorios' },
    { id: 'indumentaria', name: 'Indumentaria', path: '/indumentaria' },
    // { id: 'articulos', name: 'Artículos', path: '/articulos' },
    { id: 'contacto', name: 'Contacto', path: '/contacto' },
    { id: 'ubicacion', name: '¿Cómo llegar?', path: '/ubicacion' }
  ];

  const contacts = [
    { 
      icon: <Phone size={18} />, 
      text: '(299) 4707701', 
      link: 'https://wa.me/542994707701' 
    },
    { 
      icon: <MapPin size={18} />, 
      text: 'Belgrano 321 - Cipolletti', 
      link: '/ubicacion' 
    },
    { 
      icon: <Mail size={18} />, 
      text: 'bambinapetshop@hotmail.com', 
      link: '/contacto' 
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
        
        <div className="box">
          <h3>Categorías</h3>
          <div className="Categorias">
            <ul>
              {categories.map((category) => (
                <li 
                  key={category.id} 
                  id={`contenedor-productos-${category.id}`}
                >
                  <a href={category.path}>{category.name}</a>
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
                  <a href={contact.link} target={contact.link.startsWith('http') ? '_blank' : '_self'}>
                    {contact.text}
                  </a>
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


      {/* <div className="btn-wsp">
        <a
          href="https://wa.me/542994707701"
          className="btn-wsp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      </div> */}

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