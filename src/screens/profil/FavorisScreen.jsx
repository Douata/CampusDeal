import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
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
    if (!user?.id) return;
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
      await favorisService.removeFavori(user.id, favori.annonce_id);
      setFavoris((prev) => prev.filter((f) => f.id !== favori.id));
    } catch (error) {
      console.error(error);
    }
  };

  const renderFavori = ({ item }) => {
    const annonce = item.annonces;
    const category = CATEGORIES.find((c) => c.id === annonce?.categorie);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AnnonceDetail', { annonce })}
        activeOpacity={0.85}
      >
        <View style={styles.cardContent}>
          <View style={[styles.categoryIcon, { backgroundColor: category?.color + '22' }]}>
            <Text style={styles.categoryEmoji}>{category?.icon || '📦'}</Text>
          </View>

          <View style={styles.infos}>
            <View style={[styles.badge, { backgroundColor: category?.color + '22' }]}>
              <Text style={[styles.badgeText, { color: category?.color }]}>
                {category?.label}
              </Text>
            </View>
            <Text style={styles.titre} numberOfLines={2}>
              {annonce?.titre}
            </Text>
            {annonce?.prix ? (
              <Text style={styles.prix}>{annonce.prix} FCFA</Text>
            ) : (
              <Text style={styles.gratuit}>Gratuit</Text>
            )}
            <Text style={styles.vendeur}>
              👤 {annonce?.profiles?.prenom} {annonce?.profiles?.nom}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => handleRemove(item)}
          >
            <Ionicons name="heart" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes favoris</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 40 }}
        />
      ) : favoris.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={70} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
          <Text style={styles.emptySubText}>
            Appuie sur ❤️ sur une annonce pour la sauvegarder
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Annonces')}
          >
            <Text style={styles.emptyButtonText}>Explorer les annonces</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoris}
          keyExtractor={(item) => item.id}
          renderItem={renderFavori}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 28,
  },
  infos: {
    flex: 1,
    gap: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  titre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  prix: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  gratuit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  vendeur: {
    fontSize: 12,
    color: COLORS.gray,
  },
  heartButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});