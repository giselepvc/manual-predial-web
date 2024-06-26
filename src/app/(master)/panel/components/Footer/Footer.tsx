import { FaEnvelope, FaWhatsapp } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';

import { Header, LogoImage } from './styles';

const Footer = () => {
  return (
    <Header>
      <LogoImage src="/img/logo_dark.svg" alt="Logo" />
      <div>PARA ATUALIZAR SEU MANUAL ENTRE EM CONTATO</div>
      <div>
        <span style={{ textDecoration: 'underline' }}>
          <FaEnvelope /> contato@manualpredial.com
        </span>
        <span>
          <FaPhoneAlt />
          <FaWhatsapp size={20} />
          BH (31) 98820-0701
        </span>
      </div>
    </Header>
  );
};

export default Footer;
