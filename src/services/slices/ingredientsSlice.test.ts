import ingredientsReducer, {
  fetchIngredients,
  IngredientsState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: 'main1',
    name: 'Начинка',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  const initialState: IngredientsState = {
    items: [],
    loading: false,
    error: null
  };

  test('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('should handle fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual([]);
    expect(state.error).toBe(errorMessage);
  });

  test('should handle fetchIngredients.rejected without error message', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: {}
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual([]);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
