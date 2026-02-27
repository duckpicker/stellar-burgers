import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<TOrder | null>(null);

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  const feedOrder = useSelector((state: RootState) =>
    state.feed.orders.find((o) => o.number === Number(number))
  );

  const profileOrder = useSelector((state: RootState) =>
    state.profileOrders.orders.find((o) => o.number === Number(number))
  );

  useEffect(() => {
    const loadOrder = async () => {
      const existingOrder = feedOrder || profileOrder;

      if (existingOrder) {
        setOrderData(existingOrder);
        setLoading(false);
      } else {
        try {
          const data = await getOrderByNumberApi(Number(number));
          setOrderData(data.orders[0]);
        } catch (error) {
          console.error('Ошибка загрузки заказа', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadOrder();
  }, [number, feedOrder, profileOrder]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo: TIngredientsWithCount = {};
    let total = 0;

    orderData.ingredients.forEach((item: string) => {
      if (!ingredientsInfo[item]) {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          ingredientsInfo[item] = {
            ...ingredient,
            count: 1
          };
          total += ingredient.price;
        }
      } else {
        ingredientsInfo[item].count++;
        total += ingredientsInfo[item].price;
      }
    });

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
