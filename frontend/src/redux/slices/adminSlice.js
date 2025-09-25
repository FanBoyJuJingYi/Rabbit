import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;
const USER_TOKEN = `Bearer ${localStorage.getItem('userToken')}`;

// Fetch users with pagination
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ page = 1, limit = 10 }) => {
    const response = await axios.get(`${API_URL}/api/admin/users?page=${page}&limit=${limit}`, {
      headers: { Authorization: USER_TOKEN },
    });
    return response.data; // { users, page, pages, totalUsers }
  }
);

// Add user
export const addUser = createAsyncThunk(
  'admin/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/users`, userData, {
        headers: { Authorization: USER_TOKEN },
      });
      return response.data; // { message, user }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, name, email, role }) => {
    const response = await axios.put(
      `${API_URL}/api/admin/users/${id}`,
      { name, email, role },
      { headers: { Authorization: USER_TOKEN } }
    );
    return response.data.user;
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id) => {
    await axios.delete(`${API_URL}/api/admin/users/${id}`, {
      headers: { Authorization: USER_TOKEN },
    });
    return id;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    totalUsers: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload.user); // add new user on top
        state.totalUsers++;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add user';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.totalUsers--;
      });
  },
});

export default adminSlice.reducer;
