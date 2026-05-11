import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import { profileService } from '../../services/profileService';
import { COLORS } from '../../constants/colors';

const FILIERES = [
  'Informatique', 'Génie Civil', 'Génie Électrique',
  'Génie Mécanique', 'Agriculture', 'Commerce', 'Autre'
];

export default function EditProfilScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showFilieres, setShowFilieres] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    filiere: '',
    telephone: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await profileService.getProfile(user.id);
      setForm({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        filiere: profile.filiere || '',
        telephone: profile.telephone || '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const handleSave = async () => {
    if (!form.nom || !form.prenom) {
      Alert.alert('Erreur', 'Le nom et prénom sont obligatoires');
      return;
    }
    try {
      setLoading(true);
      await profileService.updateProfile(user.id, {
        nom: form.nom,
        prenom: form.prenom,
        filiere: form.filiere,
        telephone: form.telephone,
      });
      Alert.alert('Succès', 'Profil mis à jour !', [
        { text: 'OK', onPress: () => navigation.goBack() },
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
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Modifier le profil</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          {/* Nom */}
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={form.nom}
            onChangeText={(v) => updateForm('nom', v)}
            placeholder="Ton nom"
            placeholderTextColor={COLORS.gray}
          />

          {/* Prénom */}
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={form.prenom}
            onChangeText={(v) => updateForm('prenom', v)}
            placeholder="Ton prénom"
            placeholderTextColor={COLORS.gray}
          />

          {/* Téléphone */}
          <Text style={styles.label}>Téléphone (WhatsApp)</Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.phonePrefix}>🇨🇮 +225</Text>
            <TextInput
              style={styles.phoneInput}
              value={form.telephone}
              onChangeText={(v) => updateForm('telephone', v)}
              placeholder="07 00 00 00 00"
              placeholderTextColor={COLORS.gray}
              keyboardType="phone-pad"
            />
          </View>
          <Text style={styles.hint}>
            Ce numéro sera visible sur tes annonces
          </Text>

          {/* Filière */}
          <Text style={styles.label}>Filière</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowFilieres(!showFilieres)}
          >
            <Text style={{ color: form.filiere ? COLORS.black : COLORS.gray }}>
              {form.filiere || 'Sélectionne ta filière'}
            </Text>
          </TouchableOpacity>

          {showFilieres && (
            <View style={styles.dropdown}>
              {FILIERES.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={styles.dropdownItem}
                  onPress={() => {
                    updateForm('filiere', f);
                    setShowFilieres(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Bouton sauvegarder */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
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
  form: {
    padding: 20,
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
    justifyContent: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  phonePrefix: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.black,
    borderRightWidth: 1,
    borderRightColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
  },
  phoneInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: COLORS.black,
  },
  hint: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 6,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dropdownText: {
    fontSize: 15,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});