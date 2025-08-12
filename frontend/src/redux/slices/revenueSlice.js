import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// Async thunk lấy summary
export const fetchSummary = createAsyncThunk('revenue/fetchSummary', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/summary`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken') || ''}` },
  });
  return response.data;
});

// Async thunk lấy doanh thu tháng
export const fetchMonthlySales = createAsyncThunk('revenue/fetchMonthlySales', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/sales/monthly`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken') || ''}` },
  });
  return response.data;
});

// Async thunk lấy mục tiêu tháng
export const fetchMonthlyTargets = createAsyncThunk('revenue/fetchMonthlyTargets', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/targets/monthly`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken') || ''}` },
  });
  return response.data;
});

// Async thunk lấy đơn hàng mới
export const fetchRecentOrders = createAsyncThunk('revenue/fetchRecentOrders', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/orders/recent`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken') || ''}` },
  });
  console.log("Recent Orders Response:", response.data);
  return response.data;
});

// Async thunk lấy thống kê tháng
export const fetchMonthlyStatistics = createAsyncThunk('revenue/fetchMonthlyStatistics', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/statistics/monthly`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken') || ''}` },
  });
  return response.data;
});

const revenueSlice = createSlice({
  name: 'revenue',
  initialState: {
    summary: null,
    monthlySales: [],
    monthlyTargets: [],
    recentOrders: [],
    monthlyStatistics: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => { state.loading = true; })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchMonthlySales.pending, (state) => { state.loading = true; })
      .addCase(fetchMonthlySales.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlySales = action.payload;
      })
      .addCase(fetchMonthlySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchMonthlyTargets.pending, (state) => { state.loading = true; })
      .addCase(fetchMonthlyTargets.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyTargets = action.payload;
      })
      .addCase(fetchMonthlyTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchRecentOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchMonthlyStatistics.pending, (state) => { state.loading = true; })
      .addCase(fetchMonthlyStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyStatistics = action.payload;
      })
      .addCase(fetchMonthlyStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default revenueSlice.reducer;
