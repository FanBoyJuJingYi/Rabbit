import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Fetch comments with pagination
export const fetchComments = createAsyncThunk(
  "commentAdmin/fetchComments",
  async (page = 1, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/comments?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Expected response: { comments, page, totalPages, totalComments }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ✅ Delete a comment by ID
export const deleteComment = createAsyncThunk(
  "commentAdmin/deleteComment",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ✅ Slice definition
const commentAdminSlice = createSlice({
  name: "commentAdmin",
  initialState: {
    comments: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalComments: 0,
  },
  reducers: {
    // You can add sync reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalComments = action.payload.totalComments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteComment.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default commentAdminSlice.reducer;
