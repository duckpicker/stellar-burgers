import orderReducer, {
  placeOrder,
  closeOrderModal,
  clearOrder,
  OrderState
} from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order123',
  number: 12345,
  name: 'Бургер',
  status: 'done',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ingredients: ['bun1', 'main1', 'sauce1']
};

describe('orderSlice', () => {
  const initialState: OrderState = {
    order: null,
    orderRequest: false,
    orderModalData: null,
    loading: false,
    error: null
  };

  const filledState: OrderState = {
    order: mockOrder,
    orderRequest: false,
    orderModalData: mockOrder,
    loading: false,
    error: null
  };

  test('should return initial state', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('should handle placeOrder.pending', () => {
    const action = { type: placeOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle placeOrder.fulfilled', () => {
    const action = {
      type: placeOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.orderModalData).toEqual(mockOrder);
  });

  test('should handle placeOrder.rejected', () => {
    const errorMessage = 'Ошибка оформления заказа';
    const action = {
      type: placeOrder.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('should handle closeOrderModal', () => {
    const action = closeOrderModal();
    const state = orderReducer(filledState, action);
    expect(state.orderModalData).toBeNull();
    expect(state.order).toBeNull();
  });

  test('should handle clearOrder', () => {
    const action = clearOrder();
    const state = orderReducer(filledState, action);
    expect(state).toEqual(initialState);
  });
});
