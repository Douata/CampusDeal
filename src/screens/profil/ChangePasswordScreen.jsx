import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { profileService } from '../../services/profileService';
import { useSelector } from 'react-redux';
import { COLORS } from '../../constants/colors';

export default function ChangePasswordScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    if (form.newPassword.length < 6) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (form.oldPassword === form.newPassword) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    try {
      setLoading(true);

      // Vérifier l'ancien mot de passe en se reconnectant
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: form.oldPassword,
      });

      if (signInError) {
        Alert.alert('Erreur', 'L\'ancien mot de passe est incorrect');
        return;
      }

      // Changer le mot de passe
      await profileService.updatePassword(form.newPassword);

      Alert.alert('Succès !', 'Mot de passe modifié avec succès', [
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
          <Text style={styles.title}>Changer le mot de passe</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          {/* Info */}
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Pour ta sécurité, entre d'abord ton ancien mot de passe avant d'en définir un nouveau.
            </Text>
          </View>

          {/* Ancien mot de passe */}
          <Text style={styles.label}>Ancien mot de passe</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={form.oldPassword}
              onChangeText={(v) => setForm({ ...form, oldPassword: v })}
              placeholder="Ton ancien mot de passe"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showOld}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowOld(!showOld)}
            >
              <Ionicons
                name={showOld ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Nouveau mot de passe */}
          <Text style={styles.label}>Nouveau mot de passe</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-open-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={form.newPassword}
              onChangeText={(v) => setForm({ ...form, newPassword: v })}
              placeholder="Minimum 6 caractères"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showNew}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNew(!showNew)}
            >
              <Ionicons
                name={showNew ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Confirmer mot de passe */}
          <Text style={styles.label}>Confirmer le nouveau mot de passe</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-open-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
              placeholder="Répète le nouveau mot de passe"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirm(!showConfirm)}
            >
              <Ionicons
                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Bouton */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleChange}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.white} />
                <Text style={styles.buttonText}>Modifier le mot de passe</Text>
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
    marginTop: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 16,
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.black,
  },
  eyeIcon: {
    paddingHorizontal: 14,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
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
  },
});