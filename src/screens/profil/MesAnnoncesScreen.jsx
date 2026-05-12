import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { removeAnnonce } from '../../store/slices/annoncesSlice';
import { annoncesService } from '../../services/annoncesService';
import { COLORS } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';
import EmptyState from '../../components/common/EmptyState';

export default function MesAnnoncesScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMesAnnonces = async () => {
    if (!user?.id) return;
    try {
      const data = await annoncesService.getMesAnnonces(user.id);
      setAnnonces(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMesAnnonces();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMesAnnonces();
    setRefreshing(false);
  };

  const handleDelete = (annonce) => {
    Alert.alert(
      'Supprimer',
      `Supprimer "${annonce.titre}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await annoncesService.delete(annonce.id);
              dispatch(removeAnnonce(annonce.id));
              setAnnonces((prev) => prev.filter((a) => a.id !== annonce.id));
            } catch (error) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderAnnonce = ({ item }) => {
    const category = CATEGORIES.find((c) => c.id === item.categorie);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AnnonceDetail', { annonce: item })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: category?.color + '22' }]}>
            <Text style={[styles.badgeText, { color: category?.color }]}>
              {category?.icon} {category?.label}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.titre} numberOfLines={2}>{item.titre}</Text>

        {item.prix ? (
          <Text style={styles.prix}>{item.prix} FCFA</Text>
        ) : (
          <Text style={styles.gratuit}>Gratuit</Text>
        )}

        <View style={styles.cardFooter}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.is_active ? COLORS.success + '22' : COLORS.error + '22' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.is_active ? COLORS.success : COLORS.error }
            ]}>
              {item.is_active ? '✅ Active' : '❌ Inactive'}
            </Text>
          </View>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
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
        <Text style={styles.title}>Mes annonces</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Tabs', { screen: 'Publier' })}
        >
          <Ionicons name="add-circle-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 40 }}
        />
      ) : annonces.length === 0 ? (
        <EmptyState
          emoji="📭"
          title="Tu n'as pas encore d'annonces"
          subtitle="Publie ta première annonce et touche toute la communauté INPHB !"
          buttonText="Publier une annonce"
          onButtonPress={() => navigation.navigate('Tabs', { screen: 'Publier' })}
        />
      ) : (
        <FlatList
          data={annonces}
          keyExtractor={(item) => item.id}
          renderItem={renderAnnonce}
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
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  titre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 6,
  },
  prix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  gratuit: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
  },
});