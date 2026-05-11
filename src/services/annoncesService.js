import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';

export const annoncesService = {
  // Récupérer toutes les annonces
  async getAll() {
    const { data, error } = await supabase
      .from('annonces')
      .select(`*, profiles(nom, prenom, filiere)`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Récupérer par catégorie
  async getByCategorie(categorie) {
    const { data, error } = await supabase
      .from('annonces')
      .select(`*, profiles(nom, prenom, filiere)`)
      .eq('categorie', categorie)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Créer une annonce
  async create(annonce) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('annonces')
      .insert([{ ...annonce, user_id: user.id }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Supprimer une annonce
  async delete(id) {
    const { error } = await supabase
      .from('annonces')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Upload image
  // Upload image
// Upload image
async uploadImage(uri, userId) {
  try {
    const fileName = `${userId}/${Date.now()}.jpg`;

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const { data, error } = await supabase.storage
      .from('annonces-images')
      .upload(fileName, byteArray, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('annonces-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    throw error;
  }
},
// Récupérer mes annonces
async getMesAnnonces(userId) {
  const { data, error } = await supabase
    .from('annonces')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}, 
};