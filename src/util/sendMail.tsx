import { Linking } from 'react-native';

const sendMail = (destinatario: any, assunto: any, mensagem: any) => {
  const mailtoLink = `mailto:${destinatario}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;

  Linking.openURL(mailtoLink);
};

export default sendMail;