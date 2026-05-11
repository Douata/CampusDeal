import { supabase } from './supabase';

export const favorisService = {
  // Vérifier si une annonce est en favori
  async isFavori(userId, annonceId) {
    const { data, error } = await supabase
      .from('favoris')
      .select('id')
      .eq('user_id', userId)
      .eq('annonce_id', annonceId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return !!data;
  },

  // Ajouter aux favoris
  async addFavori(userId, annonceId) {
    const { data, error } = await supabase
      .from('favoris')
      .insert([{ user_id: userId, annonce_id: annonceId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Supprimer des favoris
  async removeFavori(userId, annonceId) {
    const { error } = await supabase
      .from('favoris')
      .delete()
      .eq('user_id', userId)
      .eq('annonce_id', annonceId);
    if (error) throw error;
  },

  // Récupérer tous les favoris d'un utilisateur
  async getFavoris(userId) {
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
    return data.map(item => ({
      ...item.annonces,
      favori_id: item.id
    }));
  },
};


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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 28,
  },
  infos: {
    flex: 1,
    gap: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  titre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  prix: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  gratuit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  vendeur: {
    fontSize: 12,
    color: COLORS.gray,
  },
  heartButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});