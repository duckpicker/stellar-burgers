import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  ConstructorState
} from './constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
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
};

const mockSauce: TIngredient = {
  _id: 'sauce1',
  name: 'Соус',
  type: 'sauce',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 30,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructorSlice', () => {
  const initialState: ConstructorState = {
    bun: null,
    ingredients: []
  };

  const filledState: ConstructorState = {
    bun: mockBun,
    ingredients: [mockMain, mockSauce]
  };

  test('should return initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('should handle addIngredient (bun)', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(initialState, action);
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  test('should handle addIngredient (main)', () => {
    const action = addIngredient(mockMain);
    const state = constructorReducer(initialState, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockMain);
  });

  test('should handle addIngredient (sauce)', () => {
    const action = addIngredient(mockSauce);
    const state = constructorReducer(initialState, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockSauce);
  });

  test('should handle removeIngredient', () => {
    const action = removeIngredient(0);
    const state = constructorReducer(filledState, action);
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockSauce);
  });

  test('should handle moveIngredient (down)', () => {
    const action = moveIngredient({ from: 0, to: 1 });
    const state = constructorReducer(filledState, action);
    expect(state.ingredients[0]).toEqual(mockSauce);
    expect(state.ingredients[1]).toEqual(mockMain);
  });

  test('should handle moveIngredient (up)', () => {
    const action = moveIngredient({ from: 1, to: 0 });
    const state = constructorReducer(filledState, action);
    expect(state.ingredients[0]).toEqual(mockSauce);
    expect(state.ingredients[1]).toEqual(mockMain);
  });

  test('should handle clearConstructor', () => {
    const action = clearConstructor();
    const state = constructorReducer(filledState, action);
    expect(state).toEqual(initialState);
  });

  test('should replace bun when adding new bun', () => {
    const newBun = { ...mockBun, _id: 'bun2', name: 'Новая булка' };
    const action = addIngredient(newBun);
    const state = constructorReducer(filledState, action);
    expect(state.bun).toEqual(newBun);
    expect(state.ingredients).toEqual([mockMain, mockSauce]);
  });
});
