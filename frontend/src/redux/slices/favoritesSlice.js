import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper để lấy config header có token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

// Fetch favorites list
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites`,
        getAuthHeaders()
      );
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add product to favorites
export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites/${productId}`,
        {}, // POST body trống
        getAuthHeaders()
      );
      return Array.isArray(data.favorites) ? data.favorites : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Remove product from favorites
export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites/${productId}`,
        getAuthHeaders()
      );
      return Array.isArray(data.favorites) ? data.favorites : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add favorite
      .addCase(addFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove favorite
      .addCase(removeFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default favoritesSlice.reducer;
