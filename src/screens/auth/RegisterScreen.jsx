import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { authService } from '../../services/authService';
import { COLORS } from '../../constants/colors';

const FILIERES = [
  'Informatique', 'Génie Civil', 'Génie Électrique',
  'Génie Mécanique', 'Agriculture', 'Commerce', 'Autre'
];

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    filiere: '',
  });
  const [loading, setLoading] = useState(false);
  const [showFilieres, setShowFilieres] = useState(false);

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    if (!form.nom || !form.prenom || !form.email || !form.password || !form.filiere) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    try {
      setLoading(true);
      await authService.register(form);
      // Nouveau code
      Alert.alert(
        'Inscription réussie ! 🎉',
        'Bienvenue sur CampusDeal !',
        [{ text: 'OK' }]
      );
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoins CampusDeal</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Ton nom"
            placeholderTextColor={COLORS.gray}
            value={form.nom}
            onChangeText={(v) => updateForm('nom', v)}
          />

          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Ton prénom"
            placeholderTextColor={COLORS.gray}
            value={form.prenom}
            onChangeText={(v) => updateForm('prenom', v)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="ton.email@inphb.ci"
            placeholderTextColor={COLORS.gray}
            value={form.email}
            onChangeText={(v) => updateForm('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimum 6 caractères"
            placeholderTextColor={COLORS.gray}
            value={form.password}
            onChangeText={(v) => updateForm('password', v)}
            secureTextEntry
          />

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

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              Déjà un compte ?{' '}
              <Text style={styles.linkBold}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    marginTop: 4,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 16,
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
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});