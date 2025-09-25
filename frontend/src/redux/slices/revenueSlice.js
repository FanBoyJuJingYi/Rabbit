import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
const getToken = () => localStorage.getItem('userToken') || '';

// Thunks
export const fetchSummary = createAsyncThunk('revenue/fetchSummary', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/summary`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
});

export const fetchMonthlySales = createAsyncThunk('revenue/fetchMonthlySales', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/sales/monthly`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
});

export const fetchMonthlyTargets = createAsyncThunk('revenue/fetchMonthlyTargets', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/targets/monthly`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
});

export const fetchSales = createAsyncThunk('revenue/fetchSales', async (period = 'monthly') => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/sales/${period}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return { data: response.data, period };
});

export const fetchTargets = createAsyncThunk('revenue/fetchTargets', async (period = 'monthly') => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/targets/${period}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return { data: response.data, period };
});

export const fetchRecentOrders = createAsyncThunk('revenue/fetchRecentOrders', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/orders/recent`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
});

export const fetchMonthlyStatistics = createAsyncThunk('revenue/fetchMonthlyStatistics', async () => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/statistics/monthly`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
});

export const fetchStatistics = createAsyncThunk('revenue/fetchStatistics', async (period = 'monthly') => {
  const response = await axios.get(`${API_URL}/api/admin/revenue/statistics/${period}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return { data: response.data, period };
});

// Slice
const revenueSlice = createSlice({
  name: 'revenue',
  initialState: {
    summary: null,

    monthlySales: [],
    monthlyTargets: [],
    monthlyStatistics: [],

    sales: {
      monthly: [],
      quarterly: [],
      yearly: [],
    },
    targets: {
      monthly: [],
      quarterly: [],
      yearly: [],
    },
    statistics: {
      monthly: [],
      quarterly: [],
      yearly: [],
    },

    recentOrders: [],
    currentPeriod: 'monthly',

    loading: false,
    error: null,
  },

  reducers: {
    setPeriod: (state, action) => {
      state.currentPeriod = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Monthly Sales
      .addCase(fetchMonthlySales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlySales.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlySales = action.payload;
      })
      .addCase(fetchMonthlySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Sales by Period
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales[action.payload.period] = action.payload.data;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Monthly Targets
      .addCase(fetchMonthlyTargets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlyTargets.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyTargets = action.payload;
      })
      .addCase(fetchMonthlyTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Targets by Period
      .addCase(fetchTargets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTargets.fulfilled, (state, action) => {
        state.loading = false;
        state.targets[action.payload.period] = action.payload.data;
      })
      .addCase(fetchTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Recent Orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Monthly Statistics
      .addCase(fetchMonthlyStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlyStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyStatistics = action.payload;
      })
      .addCase(fetchMonthlyStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Statistics by Period
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics[action.payload.period] = action.payload.data;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPeriod } = revenueSlice.actions;
export default revenueSlice.reducer;
