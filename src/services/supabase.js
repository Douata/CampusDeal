import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Storage qui gère les grandes valeurs en les découpant
const LargeSecureStore = {
  async getItem(key) {
    try {
      const hasChunks = await SecureStore.getItemAsync(`${key}_chunked`);
      if (hasChunks === 'true') {
        const count = parseInt(await SecureStore.getItemAsync(`${key}_count`) || '0');
        let value = '';
        for (let i = 0; i < count; i++) {
          value += (await SecureStore.getItemAsync(`${key}_${i}`)) || '';
        }
        return value;
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async setItem(key, value) {
    try {
      if (value.length <= 1800) {
        await SecureStore.setItemAsync(`${key}_chunked`, 'false');
        await SecureStore.setItemAsync(key, value);
      } else {
        const chunks = [];
        for (let i = 0; i < value.length; i += 1800) {
          chunks.push(value.slice(i, i + 1800));
        }
        await SecureStore.setItemAsync(`${key}_chunked`, 'true');
        await SecureStore.setItemAsync(`${key}_count`, String(chunks.length));
        for (let i = 0; i < chunks.length; i++) {
          await SecureStore.setItemAsync(`${key}_${i}`, chunks[i]);
        }
      }
    } catch (e) {
      console.warn('SecureStore setItem error:', e);
    }
  },

  async removeItem(key) {
    try {
      const hasChunks = await SecureStore.getItemAsync(`${key}_chunked`);
      if (hasChunks === 'true') {
        const count = parseInt(await SecureStore.getItemAsync(`${key}_count`) || '0');
        for (let i = 0; i < count; i++) {
          await SecureStore.deleteItemAsync(`${key}_${i}`);
        }
        await SecureStore.deleteItemAsync(`${key}_count`);
        await SecureStore.deleteItemAsync(`${key}_chunked`);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      console.warn('SecureStore removeItem error:', e);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: LargeSecureStore,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});