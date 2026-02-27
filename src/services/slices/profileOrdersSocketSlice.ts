import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

type ProfileOrdersSocketState = {
  orders: TOrder[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  error: string | null;
};

const initialState: ProfileOrdersSocketState = {
  orders: [],
  connectionStatus: 'disconnected',
  error: null
};

const profileOrdersSocketSlice = createSlice({
  name: 'profileOrdersSocket',
  initialState,
  reducers: {
    wsProfileOrdersConnecting: (state) => {
      state.connectionStatus = 'connecting';
    },
    wsProfileOrdersOpen: (state) => {
      state.connectionStatus = 'connected';
      state.error = null;
    },
    wsProfileOrdersClose: (state) => {
      state.connectionStatus = 'disconnected';
    },
    wsProfileOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.connectionStatus = 'disconnected';
    },
    wsProfileOrdersMessage: (
      state,
      action: PayloadAction<{ orders: TOrder[] }>
    ) => {
      state.orders = action.payload.orders;
    }
  }
});

export const {
  wsProfileOrdersConnecting,
  wsProfileOrdersOpen,
  wsProfileOrdersClose,
  wsProfileOrdersError,
  wsProfileOrdersMessage
} = profileOrdersSocketSlice.actions;

export default profileOrdersSocketSlice.reducer;
