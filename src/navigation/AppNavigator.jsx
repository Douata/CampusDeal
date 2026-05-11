import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setSession } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnnonceDetailScreen from '../screens/annonces/AnnonceDetailScreen';
import ConversationScreen from '../screens/messages/ConversationScreen';
import EditProfilScreen from '../screens/profil/EditProfilScreen';
import ChangePasswordScreen from '../screens/profil/ChangePasswordScreen';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import MesAnnoncesScreen from '../screens/profil/MesAnnoncesScreen';
import FavorisScreen from '../screens/profil/FavorisScreen';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="AnnonceDetail" component={AnnonceDetailScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
      <Stack.Screen name="EditProfil" component={EditProfilScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="MesAnnonces" component={MesAnnoncesScreen} />
      <Stack.Screen name="Favoris" component={FavorisScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    authService.getSession().then((session) => {
      if (session) {
        dispatch(setSession(session));
        dispatch(setUser(session.user));
      }
    });

    const { data: listener } = authService.onAuthStateChange(
      (event, session) => {
        if (session) {
          dispatch(setSession(session));
          dispatch(setUser(session.user));
        } else {
          dispatch(setUser(null));
          dispatch(setSession(null));
        }
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}