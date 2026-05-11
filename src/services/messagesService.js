import { supabase } from './supabase';

export const messagesService = {
  // Récupérer toutes les conversations d'un utilisateur
  async getConversations(userId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        annonces(titre, categorie),
        sender:profiles!messages_sender_id_fkey(nom, prenom),
        receiver:profiles!messages_receiver_id_fkey(nom, prenom)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Grouper par annonce
    const conversations = {};
    data.forEach((msg) => {
      const key = `${msg.annonce_id}_${
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id
      }`;
      if (!conversations[key]) {
        conversations[key] = {
          annonce: msg.annonces,
          annonce_id: msg.annonce_id,
          other_user:
            msg.sender_id === userId ? msg.receiver : msg.sender,
          other_user_id:
            msg.sender_id === userId ? msg.receiver_id : msg.sender_id,
          last_message: msg,
          unread: 0,
        };
      }
      if (!msg.lu && msg.receiver_id === userId) {
        conversations[key].unread++;
      }
    });

    return Object.values(conversations);
  },

  // Récupérer les messages d'une conversation
  async getMessages(annonceId, userId, otherId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(nom, prenom)
      `)
      .eq('annonce_id', annonceId)
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Envoyer un message
  async sendMessage({ annonce_id, sender_id, receiver_id, contenu }) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ annonce_id, sender_id, receiver_id, contenu }])
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(nom, prenom)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Marquer les messages comme lus
  async markAsRead(annonceId, senderId, receiverId) {
    const { error } = await supabase
      .from('messages')
      .update({ lu: true })
      .eq('annonce_id', annonceId)
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('lu', false);

    if (error) throw error;
  },

  // Écouter les nouveaux messages en temps réel
  subscribeToMessages(annonceId, userId, otherId, callback) {
    return supabase
      .channel(`messages_${annonceId}_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `annonce_id=eq.${annonceId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  },
};