import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

const selectBun = (state: RootState) => state.burgerConstructor.bun;
const selectIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, onAddToConstructor }, ref) => {
  const bun = useSelector(selectBun);
  const constructorIngredients = useSelector(selectIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    if (bun) counters[bun._id] = 2;
    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      onAddToConstructor={onAddToConstructor}
      ref={ref}
    />
  );
});
