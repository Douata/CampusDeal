import { useSelector, useDispatch } from 'react-redux';
import {
  setAnnonces,
  setSelectedCategory,
  addAnnonce,
  removeAnnonce,
} from '../store/slices/annoncesSlice';
import { annoncesService } from '../services/annoncesService';

export const useAnnonces = () => {
  const dispatch = useDispatch();
  const { annonces, filteredAnnonces, loading, error, selectedCategory } =
    useSelector((state) => state.annonces);

  const fetchAnnonces = async () => {
    const data = await annoncesService.getAll();
    dispatch(setAnnonces(data));
  };

  const filterByCategory = (categoryId) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const createAnnonce = async (annonce) => {
    const newAnnonce = await annoncesService.create(annonce);
    dispatch(addAnnonce(newAnnonce));
    return newAnnonce;
  };

  const deleteAnnonce = async (id) => {
    await annoncesService.delete(id);
    dispatch(removeAnnonce(id));
  };

  return {
    annonces,
    filteredAnnonces,
    loading,
    error,
    selectedCategory,
    fetchAnnonces,
    filterByCategory,
    createAnnonce,
    deleteAnnonce,
  };
};