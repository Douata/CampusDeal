import { supabase } from './supabase';

export const favorisService = {
  // Vérifier si une annonce est en favori
  async isFavori(userId, annonceId) {
    if (!userId || !annonceId) return false;
    const { data, error } = await supabase
      .from('favoris')
      .select('id')
      .eq('user_id', userId)
      .eq('annonce_id', annonceId)
      .single();
    if (error) return false;
    return !!data;
  },

  // Ajouter aux favoris
  async addFavori(userId, annonceId) {
    if (!userId || !annonceId) throw new Error('Paramètres manquants');
    const { data, error } = await supabase
      .from('favoris')
      .upsert(
        [{ user_id: userId, annonce_id: annonceId }],
        { onConflict: 'user_id,annonce_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Supprimer des favoris
  async removeFavori(userId, annonceId) {
    if (!userId || !annonceId) throw new Error('Paramètres manquants');
    const { error } = await supabase
      .from('favoris')
      .delete()
      .eq('user_id', userId)
      .eq('annonce_id', annonceId);
    if (error) throw error;
  },

  // Récupérer tous les favoris
  async getFavoris(userId) {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('favoris')
      .select(`
        id,
        annonce_id,
        annonces (
          id,
          titre,
          prix,
          categorie,
          images,
          created_at,
          user_id,
          profiles(nom, prenom, filiere)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};