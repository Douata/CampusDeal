import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setAnnonces, setSelectedCategory } from '../../store/slices/annoncesSlice';
import { annoncesService } from '../../services/annoncesService';
import { CATEGORIES } from '../../constants/categories';
import { COLORS } from '../../constants/colors';
import AnnonceCard from '../../components/annonces/AnnonceCard';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { filteredAnnonces, loading, selectedCategory } = useSelector(
    (state) => state.annonces
  );
  const { user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnnonces = async () => {
    try {
      const data = await annoncesService.getAll();
      dispatch(setAnnonces(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnonces();
    setRefreshing(false);
  };

  const handleCategoryPress = (categoryId) => {
    if (selectedCategory === categoryId) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(categoryId));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour 👋</Text>
          <Text style={styles.title}>CampusDeal</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}
          onPress={() => navigation.navigate('Annonces')}
        >
          <Ionicons name="search" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>🎓 Le marché de l'INPHB</Text>
          <Text style={styles.bannerSubText}>
            Achète, vends, échange avec tes camarades
          </Text>
        </View>

        {/* Catégories */}
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                { borderColor: cat.color },
                selectedCategory === cat.id && {
                  backgroundColor: cat.color,
                },
              ]}
              onPress={() => handleCategoryPress(cat.id)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === cat.id && { color: COLORS.white },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Annonces récentes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? CATEGORIES.find((c) => c.id === selectedCategory)?.label
              : 'Annonces récentes'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Annonces')}>
            <Text style={styles.voirTout}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : filteredAnnonces.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Aucune annonce pour le moment</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Publier')}
            >
              <Text style={styles.emptyButtonText}>Publier une annonce</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredAnnonces}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <AnnonceCard
                annonce={item}
                onPress={() =>
                  navigation.navigate('AnnonceDetail', { annonce: item })
                }
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.annoncesList}
          />
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  searchButton: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  banner: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  bannerText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  voirTout: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 8,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    borderWidth: 2,
    minWidth: 90,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
  },
  annoncesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});