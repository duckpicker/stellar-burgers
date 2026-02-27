import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';

const rootReducer = {
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer
};

const testStore = configureStore({
  reducer: rootReducer
});

type TestRootState = ReturnType<typeof testStore.getState>;

describe('rootReducer', () => {
  test('should have correct initial state', () => {
    const state = testStore.getState() as TestRootState;

    expect(state.ingredients).toEqual({
      items: [],
      loading: false,
      error: null
    });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(state.user).toEqual({
      user: null,
      isAuthChecked: false,
      loading: false,
      error: null
    });

    expect(state.order).toEqual({
      order: null,
      orderRequest: false,
      orderModalData: null,
      loading: false,
      error: null
    });

    expect(state.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });
  });
});
