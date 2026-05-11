import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  annonces: [],
  filteredAnnonces: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const annoncesSlice = createSlice({
  name: 'annonces',
  initialState,
  reducers: {
    setAnnonces: (state, action) => {
      state.annonces = action.payload;
      state.filteredAnnonces = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      if (action.payload === null) {
        state.filteredAnnonces = state.annonces;
      } else {
        state.filteredAnnonces = state.annonces.filter(
          (a) => a.categorie === action.payload
        );
      }
    },
    addAnnonce: (state, action) => {
      state.annonces.unshift(action.payload);
      state.filteredAnnonces.unshift(action.payload);
    },
    removeAnnonce: (state, action) => {
      state.annonces = state.annonces.filter((a) => a.id !== action.payload);
      state.filteredAnnonces = state.filteredAnnonces.filter(
        (a) => a.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAnnonces,
  setSelectedCategory,
  addAnnonce,
  removeAnnonce,
  setLoading,
  setError,
} = annoncesSlice.actions;
export default annoncesSlice.reducer;