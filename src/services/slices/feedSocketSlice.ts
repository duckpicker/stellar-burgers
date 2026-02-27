import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connectionStatus: 'disconnected',
  error: null
};

const feedSocketSlice = createSlice({
  name: 'feedSocket',
  initialState,
  reducers: {
    wsFeedConnecting: (state) => {
      state.connectionStatus = 'connecting';
    },
    wsFeedOpen: (state) => {
      state.connectionStatus = 'connected';
      state.error = null;
    },
    wsFeedClose: (state) => {
      state.connectionStatus = 'disconnected';
    },
    wsFeedError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.connectionStatus = 'disconnected';
    },
    wsFeedMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

export const {
  wsFeedConnecting,
  wsFeedOpen,
  wsFeedClose,
  wsFeedError,
  wsFeedMessage
} = feedSocketSlice.actions;

export default feedSocketSlice.reducer;
