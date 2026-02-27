import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { placeOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { getCookie } from '../../utils/cookie';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector((state: RootState) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state: RootState) => state.burgerConstructor.ingredients
  );
  const user = useSelector((state: RootState) => state.user.user);
  const orderRequest = useSelector(
    (state: RootState) => state.order.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.order.orderModalData
  );

  const constructorItems = {
    bun: bun
      ? {
          ...bun,
          price: bun.price,
          id: bun._id
        }
      : null,
    ingredients: ingredients.map((item, index) => ({
      ...item,
      id: `${item._id}_${index}`
    }))
  };

  const onOrderClick = () => {
    if (!bun) return;
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item: TIngredient) => item._id),
      bun._id
    ];

    dispatch(placeOrder(ingredientsIds)).then((action) => {
      if (action.type.endsWith('fulfilled')) {
        dispatch(clearConstructor());
      }
    });
  };

  const closeOrderModalHandler = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((s: number, v: TIngredient) => s + v.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
