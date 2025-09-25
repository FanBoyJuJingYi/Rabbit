import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/categories";

// Lấy danh mục
export const fetchCategories = createAsyncThunk("categories/fetchAll", async () => {
  const { data } = await axios.get(API_URL);
  return data;
});

// Thêm danh mục
export const addCategory = createAsyncThunk("categories/add", async (categoryData) => {
  const { data } = await axios.post(API_URL, categoryData);
  return data;
});

// Sửa danh mục
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, categoryData }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, categoryData);
    return data;
  }
);

// Xóa danh mục
export const deleteCategory = createAsyncThunk("categories/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.categories[index] = action.payload;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
