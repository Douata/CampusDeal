import { supabase } from './supabase';

export const authService = {
  // Inscription
  async register({ email, password, nom, prenom, filiere }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom, prenom, filiere },
      },
    });
    if (error) throw error;
    return data;
  },

  // Connexion
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Déconnexion
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Session actuelle
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Écouter les changements d'auth
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};