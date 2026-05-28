// src/components/layout/contacto.tsx
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import "../../assets/styles/contact.css";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '../../config/index';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    reason: string;
}

export const Contacto = () => {
    const location = useLocation();
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        reason: 'consulta'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    // Limpiar toast después de 5 segundos
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            alert('❌ Por favor, ingresa tu nombre completo');
            return false;
        }
        if (!formData.email.trim()) {
            alert('❌ Por favor, ingresa tu email');
            return false;
        }
        const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
            alert('❌ Por favor, ingresa un email válido');
            return false;
        }
        if (!formData.phone.trim()) {
            alert('❌ Por favor, ingresa tu teléfono');
            return false;
        }
        if (!formData.message.trim()) {
            alert('❌ Por favor, ingresa tu mensaje');
            return false;
        }
        if (formData.message.trim().length < 10) {
            alert('❌ El mensaje debe tener al menos 10 caracteres');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        
        try {
            // Usar la ruta /auth/send-email
            const response = await fetch(`${config.Api}/auth/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    reason: formData.reason
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setToast({ message: '✅ ¡Mensaje enviado con éxito! Te responderemos a la brevedad.', type: 'success' });
                // Resetear formulario
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    reason: 'consulta'
                });
            } else {
                setToast({ message: data.error || '❌ Error al enviar el mensaje. Intenta nuevamente.', type: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            setToast({ message: '❌ Error de conexión. Verifica tu internet e intenta nuevamente.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="contact-container">
            {/* Toast Notification */}
            {toast && (
                <div className={`toast-notification ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <div className="contact-header">
                <h2>Contactanos</h2>
                <p className="contact-subtitle">Si tenés alguna consulta, no dudes en contactarnos</p>
            </div>

            <div className="contact-content">
                {/* Información de contacto */}
                <div className="contact-info">
                    <div className="info-item">
                        <div className="info-icon">
                            <MapPin size={18} />
                        </div>
                        <div className="info-text">
                            <h3>Dirección</h3>
                            <p>Belgrano 321, Cipolletti</p>
                            <a
                                href="https://www.google.com/maps/place/Belgrano+321,+R8324+Cipolletti,+R%C3%ADo+Negro/@-38.9372322,-68.0010057,17z"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="map-link"
                            >
                                Ver en Google Maps →
                            </a>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">
                            <Phone size={18} />
                        </div>
                        <div className="info-text">
                            <h3>Teléfono</h3>
                            <a href="tel:2994707701">299 470 7701</a>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">
                            <Mail size={18} />
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
                            style={{ border: 0, borderRadius: '0.875rem' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación Bambina Petshop"
                        />
                    </div>
                </div>

                {/* Formulario */}
                <div className="contact-form-wrapper">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre completo *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Tu nombre"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Teléfono *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="299 123 4567"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reason">Motivo de consulta</label>
                            <select
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            >
                                <option value="consulta">📝 Consulta general</option>
                                <option value="sugerencia">💡 Sugerencia</option>
                                <option value="queja">⚠️ Queja / Reclamo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Mensaje *</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder="Escribe tu consulta aquí..."
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" className="submit-button" disabled={isLoading}>
                            <Send size={16} />
                            {isLoading ? 'Enviando...' : 'Enviar mensaje'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};