import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/coupons";

// Lấy danh sách coupon
export const fetchCoupons = createAsyncThunk("coupons/fetchAll", async () => {
  const { data } = await axios.get(API_URL);
  return data.data || data;
});

// Thêm coupon mới
export const addCoupon = createAsyncThunk("coupons/add", async (couponData) => {
  const { data } = await axios.post(API_URL, couponData);
  return data;
});

// Sửa coupon
export const updateCoupon = createAsyncThunk(
  "coupons/update",
  async ({ id, couponData }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, couponData);
    return data;
  }
);

// Xóa coupon
export const deleteCoupon = createAsyncThunk("coupons/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Kiểm tra coupon (user check mã)
export const checkCoupon = createAsyncThunk(
  "coupons/check",
  async ({ couponCode, totalPrice, userId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/check`, {
        couponCode,
        totalPrice,
        userId,
      });
      return data; // { discountAmount, couponId }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check coupon failed"
      );
    }
  }
);

// Ghi nhận user đã dùng coupon (khi đặt hàng thành công)
export const useCoupon = createAsyncThunk(
  "coupons/use",
  async ({ couponId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/use`, { couponId, userId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Use coupon failed");
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
    checkResult: null,
    checkError: null,
  },
  reducers: {
    clearCheckResult(state) {
      state.checkResult = null;
      state.checkError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload);
      })

      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.coupons[index] = action.payload;
      })

      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter((c) => c._id !== action.payload);
      })

      .addCase(checkCoupon.fulfilled, (state, action) => {
        state.checkResult = action.payload;
        state.checkError = null;
      })
      .addCase(checkCoupon.rejected, (state, action) => {
        state.checkResult = null;
        state.checkError = action.payload;
      });
  },
});

export const { clearCheckResult } = couponSlice.actions;
export default couponSlice.reducer;
