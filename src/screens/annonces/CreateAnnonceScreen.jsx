import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { addAnnonce } from '../../store/slices/annoncesSlice';
import { annoncesService } from '../../services/annoncesService';
import { CATEGORIES } from '../../constants/categories';
import { COLORS } from '../../constants/colors';

export default function CreateAnnonceScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie: '',
  });

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert('Maximum', '3 photos maximum par annonce');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.titre || !form.description || !form.categorie) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    try {
      setLoading(true);

      // Upload des images
      let imageUrls = [];
      for (const uri of images) {
        const url = await annoncesService.uploadImage(uri, user.id);
        imageUrls.push(url);
      }

      // Créer l'annonce
      const newAnnonce = await annoncesService.create({
      titre: form.titre,
      description: form.description,
      prix: form.prix ? parseInt(form.prix) : null,
      categorie: form.categorie,
      images: imageUrls,
    });

      dispatch(addAnnonce(newAnnonce));
      setForm({ titre: '', description: '', prix: '', categorie: '' });
      setImages([]);
      Alert.alert('Succès !', 'Ton annonce a été publiée', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Publier une annonce</Text>
        </View>

        <View style={styles.form}>
          {/* Photos */}
          <Text style={styles.label}>Photos (max 3)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imagesRow}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImage}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={22} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 3 && (
                <TouchableOpacity style={styles.addImage} onPress={pickImage}>
                  <Ionicons name="camera-outline" size={28} color={COLORS.gray} />
                  <Text style={styles.addImageText}>Ajouter</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Catégorie */}
          <Text style={styles.label}>Catégorie *</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryOption,
                  form.categorie === cat.id && {
                    backgroundColor: cat.color,
                    borderColor: cat.color,
                  },
                ]}
                onPress={() => updateForm('categorie', cat.id)}
              >
                <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryOptionText,
                    form.categorie === cat.id && { color: COLORS.white },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Titre */}
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Livre de Mathématiques L2"
            placeholderTextColor={COLORS.gray}
            value={form.titre}
            onChangeText={(v) => updateForm('titre', v)}
            maxLength={80}
          />

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Décris ton annonce en détail..."
            placeholderTextColor={COLORS.gray}
            value={form.description}
            onChangeText={(v) => updateForm('description', v)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Prix */}
          <Text style={styles.label}>Prix (FCFA) — laisser vide si gratuit</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 5000"
            placeholderTextColor={COLORS.gray}
            value={form.prix}
            onChangeText={(v) => updateForm('prix', v)}
            keyboardType="numeric"
          />

          {/* Bouton publier */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="paper-plane-outline" size={20} color={COLORS.white} />
                <Text style={styles.submitButtonText}>Publier l'annonce</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 11,
  },
  addImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  addImageText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  categoryOptionIcon: {
    fontSize: 18,
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 40,
    gap: 8,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});