import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import ImageViewing from 'react-native-image-viewing';
import { removeAnnonce } from '../../store/slices/annoncesSlice';
import { annoncesService } from '../../services/annoncesService';
import { profileService } from '../../services/profileService';
import { favorisService } from '../../services/favorisService';
import { CATEGORIES } from '../../constants/categories';
import { COLORS } from '../../constants/colors';

export default function AnnonceDetailScreen({ route, navigation }) {
  const { annonce } = route.params;
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [vendeurProfile, setVendeurProfile] = useState(null);
  const [isFavori, setIsFavori] = useState(false);
  const [favoriLoading, setFavoriLoading] = useState(false);
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [imageViewIndex, setImageViewIndex] = useState(0);

  const category = CATEGORIES.find((c) => c.id === annonce.categorie);
  const isOwner = user?.id === annonce.user_id;

  useEffect(() => {
    loadVendeurProfile();
    checkFavori();
  }, []);

  const loadVendeurProfile = async () => {
    try {
      const profile = await profileService.getProfile(annonce.user_id);
      setVendeurProfile(profile);
    } catch (error) {
      console.error(error);
    }
  };

  const checkFavori = async () => {
    if (!user?.id || !annonce?.id) return;
    const result = await favorisService.isFavori(user.id, annonce.id);
    setIsFavori(result);
  };

  const handleFavori = async () => {
    if (!user?.id || !annonce?.id) return;
    try {
      setFavoriLoading(true);
      if (isFavori) {
        await favorisService.removeFavori(user.id, annonce.id);
        setIsFavori(false);
      } else {
        await favorisService.addFavori(user.id, annonce.id);
        setIsFavori(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFavoriLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎓 CampusDeal — ${annonce.titre}\n💰 ${annonce.prix ? annonce.prix + ' FCFA' : 'Gratuit'}\n📝 ${annonce.description}\n\nRetrouve cette annonce sur CampusDeal !`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const heure = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return `Aujourd'hui à ${heure}`;
    if (diff === 1) return `Hier à ${heure}`;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) + ` à ${heure}`;
  };

  const handleCall = () => {
    if (!vendeurProfile?.telephone) {
      Alert.alert('Info', "Ce vendeur n'a pas renseigné de numéro");
      return;
    }
    const phone = `+225${vendeurProfile.telephone.replace(/\s/g, '')}`;
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = () => {
    if (!vendeurProfile?.telephone) {
      Alert.alert('Info', "Ce vendeur n'a pas renseigné de numéro");
      return;
    }
    const phone = `225${vendeurProfile.telephone.replace(/\s/g, '')}`;
    const message = `Bonjour, je suis intéressé par ton annonce : "${annonce.titre}"`;
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', "WhatsApp n'est pas installé sur ce téléphone");
    });
  };

  const handleMessage = () => {
    navigation.navigate('Conversation', {
      annonce: { titre: annonce.titre, categorie: annonce.categorie },
      annonce_id: annonce.id,
      other_user: vendeurProfile,
      other_user_id: annonce.user_id,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'annonce",
      'Es-tu sûr de vouloir supprimer cette annonce ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await annoncesService.delete(annonce.id);
              dispatch(removeAnnonce(annonce.id));
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erreur', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Bouton partager */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={22} color={COLORS.black} />
          </TouchableOpacity>

          {/* Bouton favori */}
          {!isOwner && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleFavori}
              disabled={favoriLoading}
            >
              <Ionicons
                name={isFavori ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavori ? COLORS.error : COLORS.black}
              />
            </TouchableOpacity>
          )}

          {/* Bouton supprimer */}
          {isOwner && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.error} />
              ) : (
                <Ionicons name="trash-outline" size={22} color={COLORS.error} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Images */}
        {annonce.images && annonce.images.length > 0 ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                setImageViewIndex(currentImage);
                setImageViewVisible(true);
              }}
              activeOpacity={0.95}
            >
              <Image
                source={{ uri: annonce.images[currentImage] }}
                style={styles.image}
              />
              <View style={styles.zoomIndicator}>
                <Ionicons name="expand-outline" size={14} color={COLORS.white} />
                <Text style={styles.zoomText}>Appuyer pour agrandir</Text>
              </View>
            </TouchableOpacity>

            {annonce.images.length > 1 && (
              <View style={styles.imageDots}>
                {annonce.images.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImage(index)}
                    style={[
                      styles.dot,
                      currentImage === index && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Visionneuse plein écran */}
            <ImageViewing
              images={annonce.images.map((uri) => ({ uri }))}
              imageIndex={imageViewIndex}
              visible={imageViewVisible}
              onRequestClose={() => setImageViewVisible(false)}
              swipeToCloseEnabled={true}
              doubleTapToZoomEnabled={true}
            />
          </View>
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: category?.color + '22' },
            ]}
          >
            <Text style={styles.placeholderIcon}>{category?.icon || '📦'}</Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: category?.color + '22' }]}>
            <Text style={[styles.badgeText, { color: category?.color }]}>
              {category?.icon} {category?.label}
            </Text>
          </View>

          {/* Titre & Prix */}
          <Text style={styles.titre}>{annonce.titre}</Text>
          {annonce.prix ? (
            <Text style={styles.prix}>{annonce.prix} FCFA</Text>
          ) : (
            <Text style={styles.gratuit}>Gratuit</Text>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{annonce.description}</Text>
          </View>

          {/* Infos vendeur */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publié par</Text>
            <View style={styles.vendeurCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {vendeurProfile?.prenom?.[0]}
                  {vendeurProfile?.nom?.[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vendeurNom}>
                  {vendeurProfile?.prenom} {vendeurProfile?.nom}
                </Text>
                <Text style={styles.vendeurFiliere}>
                  {vendeurProfile?.filiere}
                </Text>
                {vendeurProfile?.telephone && (
                  <Text style={styles.vendeurPhone}>
                    📞 +225 {vendeurProfile.telephone}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <Text style={styles.dateText}>
            🕐 {formatDate(annonce.created_at)}
          </Text>

          {/* Boutons contact */}
          {!isOwner && (
            <View style={styles.contactButtons}>
              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: COLORS.success }]}
                onPress={handleCall}
              >
                <Ionicons name="call" size={20} color={COLORS.white} />
                <Text style={styles.contactBtnText}>Appeler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: '#25D366' }]}
                onPress={handleWhatsApp}
              >
                <Ionicons name="logo-whatsapp" size={20} color={COLORS.white} />
                <Text style={styles.contactBtnText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: COLORS.primary }]}
                onPress={handleMessage}
              >
                <Ionicons name="chatbubble" size={20} color={COLORS.white} />
                <Text style={styles.contactBtnText}>Message</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  placeholderIcon: {
    fontSize: 60,
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zoomText: {
    color: COLORS.white,
    fontSize: 11,
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  content: {
    padding: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  titre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  prix: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  gratuit: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: COLORS.gray,
    lineHeight: 22,
  },
  vendeurCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  vendeurNom: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  vendeurFiliere: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  vendeurPhone: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 20,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  contactBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
});