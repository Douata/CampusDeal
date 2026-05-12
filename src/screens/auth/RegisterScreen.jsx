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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { COLORS } from '../../constants/colors';
import Logo from '../../components/common/Logo';

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
  const [showPassword, setShowPassword] = useState(false);
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
      Alert.alert('Inscription réussie ! 🎉', 'Bienvenue sur CampusDeal !', [
        { text: 'OK' },
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Logo size={70} showText={false} />
        <Text style={styles.appName}>CampusDeal</Text>
        <Text style={styles.appTagline}>Crée ton compte étudiant</Text>
      </View>

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Inscription</Text>
          <Text style={styles.formSubtitle}>
            Rejoins la communauté INPHB
          </Text>

          {/* Prénom */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}>
              <Ionicons name="person-outline" size={20} color={COLORS.gray} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor={COLORS.gray}
              value={form.prenom}
              onChangeText={(v) => updateForm('prenom', v)}
            />
          </View>

          {/* Nom */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}>
              <Ionicons name="person-outline" size={20} color={COLORS.gray} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor={COLORS.gray}
              value={form.nom}
              onChangeText={(v) => updateForm('nom', v)}
            />
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Adresse email"
              placeholderTextColor={COLORS.gray}
              value={form.email}
              onChangeText={(v) => updateForm('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Mot de passe */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe (min. 6 caractères)"
              placeholderTextColor={COLORS.gray}
              value={form.password}
              onChangeText={(v) => updateForm('password', v)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.inputIconRight}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Filière */}
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowFilieres(!showFilieres)}
          >
            <View style={styles.inputIcon}>
              <Ionicons name="school-outline" size={20} color={COLORS.gray} />
            </View>
            <Text style={[
              styles.input,
              { paddingVertical: 16, color: form.filiere ? COLORS.black : COLORS.gray }
            ]}>
              {form.filiere || 'Sélectionne ta filière'}
            </Text>
            <View style={styles.inputIconRight}>
              <Ionicons
                name={showFilieres ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.gray}
              />
            </View>
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
                  {form.filiere === f && (
                    <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Bouton inscription */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Créer mon compte</Text>
            )}
          </TouchableOpacity>

          {/* Lien connexion */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  headerSection: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    padding: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  formSection: {
    padding: 24,
    marginTop: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 14,
  },
  inputIconRight: {
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: COLORS.black,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 14,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderRadius: 14,
    padding: 17,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});