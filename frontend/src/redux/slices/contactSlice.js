import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an axios instance with baseURL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Utility function to get token from localStorage
const getToken = () => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('No auth token found');
  return token;
};

// Fetch all contacts with authentication token from localStorage
export const fetchContacts = createAsyncThunk(
  'contacts/fetch',
  async () => {
    const token = getToken();
    const { data } = await api.get('/api/contacts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

// Create a new contact without authentication (open endpoint)
export const createContact = createAsyncThunk(
  'contacts/create',
  async (formData) => {
    const { data } = await api.post('/api/contacts', formData);
    return data;
  }
);

// Delete a contact by id, requires authentication token
export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id) => {
    const token = getToken();
    await api.delete(`/api/contacts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

// Mark a contact as complete by id, requires authentication token
export const completeContact = createAsyncThunk(
  'contacts/complete',
  async (id) => {
    const token = getToken();
    const { data } = await api.put(
      `/api/contacts/${id}/complete`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  }
);

const contactSlice = createSlice({
  name: 'contacts',
  initialState: {
    list: [], // list of contacts
    status: 'idle', // fetch status
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchContacts.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
      })
      .addCase(completeContact.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export default contactSlice.reducer;
