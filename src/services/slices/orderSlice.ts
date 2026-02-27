import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const placeOrder = createAsyncThunk(
  'order/place',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export interface OrderState {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.order = null;
    },
    clearOrder: (state) => {
      state.order = null;
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.order = action.payload;
        state.orderModalData = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      });
  }
});

export const { closeOrderModal, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
