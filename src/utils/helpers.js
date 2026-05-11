export const formatPrice = (prix) => {
  if (!prix) return 'Gratuit';
  return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Hier';
  if (diff < 7) return `Il y a ${diff} jours`;
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  });
};

export const getInitials = (prenom, nom) => {
  return `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase();
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};