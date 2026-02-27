import userReducer, {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  authChecked,
  UserState
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test User'
};

const mockRegisterData = {
  email: 'test@test.com',
  password: '123456',
  name: 'Test User'
};

const mockLoginData = {
  email: 'test@test.com',
  password: '123456'
};

describe('userSlice', () => {
  const initialState: UserState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  };

  const authenticatedState: UserState = {
    user: mockUser,
    isAuthChecked: true,
    loading: false,
    error: null
  };

  test('should return initial state', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('should handle authChecked', () => {
    const action = authChecked();
    const state = userReducer(initialState, action);
    expect(state.isAuthChecked).toBe(true);
  });

  test('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  test('should handle registerUser.rejected', () => {
    const action = {
      type: registerUser.rejected.type,
      error: { message: 'Ошибка регистрации' }
    };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка регистрации');
  });

  test('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  test('should handle loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: 'Ошибка входа' }
    };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка входа');
  });

  test('should handle getUser.fulfilled', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  test('should handle getUser.rejected', () => {
    const action = { type: getUser.rejected.type };
    const state = userReducer(authenticatedState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  test('should handle updateUser.fulfilled', () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    };
    const state = userReducer(authenticatedState, action);
    expect(state.user).toEqual(updatedUser);
  });

  test('should handle logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = userReducer(authenticatedState, action);
    expect(state.user).toBeNull();
  });
});
