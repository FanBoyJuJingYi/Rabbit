import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch comments by productId (public)
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/product/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch comments' });
    }
  }
);

// Add a new comment (private)
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ productId, content, rating }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue({ message: 'User not authenticated' });
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments`,
        { productId, content, rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add comment' });
    }
  }
);

// Delete comment by id (private, owner or admin)
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue({ message: 'User not authenticated' });
      }

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete comment' });
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch comments';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      });
  },
});

export default commentsSlice.reducer;
