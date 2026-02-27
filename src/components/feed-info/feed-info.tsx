import { FC } from 'react';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const wsOrders = useSelector(
    (state: RootState) => state.feedSocket?.orders || []
  );
  const wsTotal = useSelector(
    (state: RootState) => state.feedSocket?.total || 0
  );
  const wsTotalToday = useSelector(
    (state: RootState) => state.feedSocket?.totalToday || 0
  );

  const apiOrders = useSelector((state: RootState) => state.feed.orders);
  const apiTotal = useSelector((state: RootState) => state.feed.total);
  const apiTotalToday = useSelector(
    (state: RootState) => state.feed.totalToday
  );

  const hasWsData = wsOrders.length > 0 && wsTotal > 0;

  const orders = hasWsData ? wsOrders : apiOrders;
  const feed = {
    total: hasWsData ? wsTotal : apiTotal,
    totalToday: hasWsData ? wsTotalToday : apiTotalToday
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
