import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// Fetch all published posts (public)
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/posts`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch posts' });
    }
  }
);

// Fetch single post by ID (public)
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/posts/${postId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch post' });
    }
  }
);

// Fetch featured posts with limit (public)
export const fetchFeaturedPosts = createAsyncThunk(
  'posts/fetchFeaturedPosts',
  async ({ limit = 8 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/posts/featured`, {
        params: { limit }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch featured posts' });
    }
  }
);

// Create a new post (private/admin)
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return rejectWithValue({ message: 'User not authenticated' });

      const response = await axios.post(`${API_BASE}/api/posts`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to create post' });
    }
  }
);

// Update post by ID (private/admin)
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return rejectWithValue({ message: 'User not authenticated' });

      const response = await axios.put(`${API_BASE}/api/posts/${id}`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to update post' });
    }
  }
);

// Delete post by ID (private/admin)
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return rejectWithValue({ message: 'User not authenticated' });

      await axios.delete(`${API_BASE}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return postId;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to delete post' });
    }
  }
);

// Fetch posts for admin (private/admin)


const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],           // public posts
    postsStatus: 'idle',
    postsError: null,

    adminPosts: [],      // admin posts list
    adminPostsStatus: 'idle',
    adminPostsError: null,

    featuredPosts: [],
    featuredPostsStatus: 'idle',
    featuredPostsError: null,

    currentPost: null,
    currentPostStatus: 'idle',
    currentPostError: null,

    operationStatus: 'idle', // for create/update/delete
    operationError: null,
  },
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.currentPostStatus = 'idle';
      state.currentPostError = null;
    },
    resetOperationStatus: (state) => {
      state.operationStatus = 'idle';
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all public posts
      .addCase(fetchPosts.pending, (state) => {
        state.postsStatus = 'loading';
        state.postsError = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.postsStatus = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.postsStatus = 'failed';
        state.postsError = action.payload?.message || 'Failed to fetch posts';
      })

      // Fetch single post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.currentPostStatus = 'loading';
        state.currentPostError = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentPostStatus = 'succeeded';
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.currentPostStatus = 'failed';
        state.currentPostError = action.payload?.message || 'Failed to fetch post';
      })

      // Fetch featured posts
      .addCase(fetchFeaturedPosts.pending, (state) => {
        state.featuredPostsStatus = 'loading';
        state.featuredPostsError = null;
      })
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.featuredPostsStatus = 'succeeded';
        state.featuredPosts = action.payload;
      })
      .addCase(fetchFeaturedPosts.rejected, (state, action) => {
        state.featuredPostsStatus = 'failed';
        state.featuredPostsError = action.payload?.message || 'Failed to fetch featured posts';
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload?.message || 'Failed to create post';
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        // Update in public posts
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;

        // Update in admin posts
        const adminIndex = state.adminPosts.findIndex(post => post._id === action.payload._id);
        if (adminIndex !== -1) state.adminPosts[adminIndex] = action.payload;

        // Update current post if matches
        if (state.currentPost?._id === action.payload._id) state.currentPost = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload?.message || 'Failed to update post';
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.posts = state.posts.filter(post => post._id !== action.payload);
        state.adminPosts = state.adminPosts.filter(post => post._id !== action.payload);

        if (state.currentPost?._id === action.payload) state.currentPost = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload?.message || 'Failed to delete post';
      });
  },
});

export const { clearCurrentPost, resetOperationStatus } = postsSlice.actions;

export default postsSlice.reducer;
