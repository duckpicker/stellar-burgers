import feedReducer, { getFeeds, FeedState } from './feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: 'order1',
    number: 12345,
    name: 'Бургер 1',
    status: 'done',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ingredients: ['bun1', 'main1', 'sauce1']
  },
  {
    _id: 'order2',
    number: 12346,
    name: 'Бургер 2',
    status: 'pending',
    createdAt: '2024-01-01T00:01:00.000Z',
    updatedAt: '2024-01-01T00:01:00.000Z',
    ingredients: ['bun2', 'main2', 'sauce2']
  }
];

const mockFeedResponse = {
  orders: mockOrders,
  total: 100,
  totalToday: 5
};

describe('feedSlice', () => {
  const initialState: FeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  test('should return initial state', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('should handle getFeeds.pending', () => {
    const action = { type: getFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle getFeeds.fulfilled', () => {
    const action = {
      type: getFeeds.fulfilled.type,
      payload: mockFeedResponse
    };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(5);
    expect(state.error).toBeNull();
  });

  test('should handle getFeeds.rejected', () => {
    const errorMessage = 'Ошибка загрузки ленты';
    const action = {
      type: getFeeds.rejected.type,
      error: { message: errorMessage }
    };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('should handle getFeeds.rejected without error message', () => {
    const action = {
      type: getFeeds.rejected.type,
      error: {}
    };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ленты');
  });

  test('should not modify state on other actions', () => {
    const state = feedReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });
});
