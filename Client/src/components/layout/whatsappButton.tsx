import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { IconButton } from '@mui/material';
import { animateScroll as scroll } from 'react-scroll';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';

const WhatsAppButton = styled(IconButton)({
  position: 'fixed',
  bottom: '20px',
  right: '18px',
  backgroundColor: '#25D366',
  color: '#ffffff',
  borderRadius: '50%',
  width: '55px',
  height: '55px',
  '&:hover': {
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    color: '#25D366',

  },
});



export function Whatsapp() {
  
  const [visible, setVisible] = useState(false)

  const onClickUp = () => {
      scroll.scrollToTop();
   }

   const toggleVisibility = () => {
      if (window.pageYOffset > window.innerHeight / 2) {
          setVisible(true)
      } else {
          setVisible(false)
      }
   }

   useEffect(() => {
      window.addEventListener('scroll', toggleVisibility);
      return() => {
          window.removeEventListener('scroll',toggleVisibility)
      }
   },[])

  return (
    <a
      href="https://wa.me/2994707701"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      
      style={{ textDecoration: 'none' }}
    >
      <WhatsAppButton style={{ display: visible ? 'block' : 'none' }} onClick={onClickUp}>
        <WhatsAppIcon style={{ fontSize: 35 }} />
      </WhatsAppButton>
    </a>
  );
}