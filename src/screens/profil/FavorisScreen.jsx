import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { favorisService } from '../../services/favorisService';
import { COLORS } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';

export default function FavorisScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavoris = async () => {
    try {
      const data = await favorisService.getFavoris(user.id);
      setFavoris(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoris();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavoris();
    setRefreshing(false);
  };

  const handleRemove = async (favori) => {
    try {
      await favorisService.removeFavori(user.id, favori.id);
      setFavoris((prev) => prev.filter((f) => f.favori_id !== favori.favori_id));
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderFavori = ({ item }) => {
    const category = CATEGORIES.find((c) => c.id === item.categorie);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AnnonceDetail', { annonce: item })}
        activeOpacity={0.85}
      >
        {/* Badge catégorie */}
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: category?.color + '22' }]}>
            <Text style={[styles.badgeText, { color: category?.color }]}>
              {category?.icon} {category?.label}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleRemove(item)}
          >
            <Ionicons name="heart" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        {/* Image */}
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageContainer}>
            <Text style={styles.imagePlaceholder}>{category?.icon || '📦'}</Text>
          </View>
        )}

        {/* Contenu */}
        <View style={styles.content}>
          <Text style={styles.titre} numberOfLines={2}>
            {item.titre}
          </Text>
          {item.prix ? (
            <Text style={styles.prix}>{item.prix} FCFA</Text>
          ) : (
            <Text style={styles.gratuit}>Gratuit</Text>
          )}
          <Text style={styles.date}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement des favoris...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes favoris</Text>
      </View>

      {favoris.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
          <Text style={styles.emptySubtext}>
            Ajoutez des annonces à vos favoris pour les retrouver ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoris}
          renderItem={renderFavori}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
  },
  image: {
    width: '100%',
    height: 120,
  },
  imageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray + '22',
  },
  imagePlaceholder: {
    fontSize: 32,
  },
  content: {
    padding: 12,
  },
  titre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  prix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  gratuit: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
  },
});