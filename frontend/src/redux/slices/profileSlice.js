import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        config
      );

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Update avatar
export const updateAvatar = createAsyncThunk(
  "profile/updateAvatar",
  async (avatarUrl, thunkAPI) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile/avatar`,
        { avatarUrl },
        config
      );

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Update or replace shipping addresses (payload = full array)
export const updateShippingAddress = createAsyncThunk(
  "profile/updateShippingAddress",
  async (shippingAddresses, thunkAPI) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile/shipping`,
        { shippingAddresses },
        config
      );

      return data.shippingAddresses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Delete shipping address (payload = index)
export const deleteShippingAddress = createAsyncThunk(
  "profile/deleteShippingAddress",
  async (index, thunkAPI) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile/shipping/${index}`,
        config
      );

      return data.shippingAddresses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// *** Change password (new feature) ***
// This thunk sends current and new password to backend to update user password
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile/password`,
        { currentPassword, newPassword },
        config
      );

      // Return success message from backend
      return data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchFeaturedPosts = createAsyncThunk(
  'posts/fetchFeaturedPosts',
  async ({ limit = 8 }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/posts/featured', {
        params: { limit }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    changePasswordLoading: false,
    changePasswordError: null,
    featuredPosts: [],
  },
  reducers: {
    clearProfile(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.updateLoading = false;
      state.updateError = null;
      // *** Also reset password change state when clearing profile ***
      state.changePasswordLoading = false;
      state.changePasswordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          shippingAddresses: action.payload.shippingAddresses || [],
        };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

      .addCase(updateAvatar.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.user) {
          state.user.avatarUrl = action.payload.avatarUrl;
          // update shippingAddresses just in case
          state.user.shippingAddresses = action.payload.shippingAddresses || [];
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      .addCase(updateShippingAddress.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateShippingAddress.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.user) {
          state.user.shippingAddresses = action.payload;
        }
      })
      .addCase(updateShippingAddress.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      .addCase(deleteShippingAddress.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(deleteShippingAddress.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.user) {
          state.user.shippingAddresses = action.payload;
        }
      })
      .addCase(deleteShippingAddress.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // *** Change password extraReducers ***
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.changePasswordLoading = false;
        // You may want to handle success message somewhere if needed
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload;
      })
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.featuredPosts = action.payload;
      })
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
