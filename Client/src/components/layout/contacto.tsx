
// Contacto.tsx
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import "../../assets/styles/contact.css";


export const Contacto = () => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
    
        // Lógica de envío de formulario
        alert('Formulario enviado correctamente');
    };

    return(
        <div className="contact-container">
            <div className="contact-header">
                <h2>Contacto</h2>
                <p className="contact-subtitle">Si tienes alguna consulta, no dudes en contactarnos</p>
            </div>

            <div className="contact-content">
                {/* Información de contacto */}
                <div className="contact-info">
                    <div className="info-item">
                        <div className="info-icon">
                            <MapPin size={20} />
                        </div>
                        <div className="info-text">
                            <h3>Dirección</h3>
                            <p>Belgrano 321, Cipolletti</p>
                            <a 
                                href="https://www.google.com/maps/place/Belgrano+321,+R8324+Cipolletti,+R%C3%ADo+Negro/@-38.9372322,-68.0010057,17z/data=!3m1!4b1!4m6!3m5!1s0x960a30fd36425051:0x565f08b8b736b5d5!8m2!3d-38.9372364!4d-67.9984308!16s%2Fg%2F11svhq5k9n?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="map-link"
                            >
                                Ver en Google Maps
                            </a>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">
                            <Phone size={20} />
                        </div>
                        <div className="info-text">
                            <h3>Teléfono</h3>
                            <a href="tel:2994707701">299 4707701</a>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">
                            <Mail size={20} />
                        </div>
                        <div className="info-text">
                            <h3>Email</h3>
                            <a href="mailto:bambinapetshop86@gmail.com">bambinapetshop86@gmail.com</a>
                        </div>
                    </div>

                    {/* Mapa */}
                    <div className="map-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3102.6589938856!2d-68.00100572346145!3d-38.93723227180991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x960a30fd36425051%3A0x565f08b8b736b5d5!2sBelgrano%20321%2C%20R8324%20Cipolletti%2C%20R%C3%ADo%20Negro!5e0!3m2!1ses!2sar!4v1702920000000!5m2!1ses!2sar"
                            width="100%" 
                            height="250" 
                            style={{ border: 0, borderRadius: '0.75rem' }}
                            allowFullScreen
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación Bambina Petshop"
                        ></iframe>
                    </div>
                </div>

                {/* Formulario */}
                <div className="contact-form-wrapper">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre completo</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Tu nombre"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Teléfono</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                placeholder="299 123 4567"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Mensaje</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                rows={5}
                                placeholder="Escribe tu consulta aquí..."
                                required
                            ></textarea>
                        </div>


                        <button type="submit" className="submit-button">
                            <Send size={20} />
                            Enviar mensaje
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}