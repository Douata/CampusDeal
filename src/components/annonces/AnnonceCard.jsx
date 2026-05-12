import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';

export default function AnnonceCard({ annonce, onPress }) {
  const category = CATEGORIES.find((c) => c.id === annonce.categorie);

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  const heure = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (diff === 0) return `Aujourd'hui à ${heure}`;
  if (diff === 1) return `Hier à ${heure}`;
  if (diff < 7) return `Il y a ${diff} jours à ${heure}`;
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  }) + ` à ${heure}`;
};

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Image */}
      {annonce.images && annonce.images.length > 0 ? (
        <Image source={{ uri: annonce.images[0] }} style={styles.image} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: category?.color + '22' }]}>
          <Text style={styles.placeholderIcon}>{category?.icon || '📦'}</Text>
        </View>
      )}

      {/* Contenu */}
      <View style={styles.content}>
        {/* Badge catégorie */}
        <View style={[styles.badge, { backgroundColor: category?.color + '22' }]}>
          <Text style={[styles.badgeText, { color: category?.color }]}>
            {category?.icon} {category?.label}
          </Text>
        </View>

        <Text style={styles.titre} numberOfLines={2}>
          {annonce.titre}
        </Text>

        {annonce.prix ? (
          <Text style={styles.prix}>{annonce.prix} FCFA</Text>
        ) : (
          <Text style={styles.gratuit}>Gratuit</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.auteur}>
            👤 {annonce.profiles?.prenom} {annonce.profiles?.nom}
          </Text>
          <Text style={styles.date}>{formatDate(annonce.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  content: {
    padding: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  titre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 6,
  },
  prix: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  gratuit: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auteur: {
    fontSize: 12,
    color: COLORS.gray,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
  },
});