import React, { useEffect, useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../constants/colors';
import { supabase } from '../services/supabase';

import HomeScreen from '../screens/home/HomeScreen';
import AnnoncesScreen from '../screens/annonces/AnnoncesScreen';
import CreateAnnonceScreen from '../screens/annonces/CreateAnnonceScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import ProfilScreen from '../screens/profil/ProfilScreen';

const Tab = createBottomTabNavigator();

function BadgeIcon({ name, color, size, count }) {
  return (
    <View>
      <Ionicons name={name} size={size} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabNavigator() {
  const { user } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef(null);

  const fetchUnread = async () => {
    if (!user?.id) return;
    try {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('lu', false);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchUnread();

    // Nettoyer l'ancien channel s'il existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Créer un nouveau channel
    const channel = supabase
      .channel(`unread_msgs_${user.id}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => fetchUnread()
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        () => fetchUnread()
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          height: 62,
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Annonces') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Publier') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Messages') {
            return (
              <BadgeIcon
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                color={color}
                size={size}
                count={unreadCount}
              />
            );
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Annonces" component={AnnoncesScreen} options={{ title: 'Annonces' }} />
      <Tab.Screen
        name="Publier"
        component={CreateAnnonceScreen}
        options={{
          title: 'Publier',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.publishButton,
              { backgroundColor: focused ? COLORS.primary : COLORS.secondary }
            ]}>
              <Ionicons name="add" size={28} color={COLORS.white} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages' }} />
      <Tab.Screen name="Profil" component={ProfilScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  publishButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});