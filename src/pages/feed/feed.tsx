import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';
import { RootState } from '../../services/store';

const WS_URL = process.env.BURGER_WS_URL || 'wss://norma.nomoreparties.space';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const [useApi, setUseApi] = useState(false);
  const wsConnected = useRef(false);
  const wsAttempted = useRef(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const wsOrders = useSelector(
    (state: RootState) => state.feedSocket?.orders || []
  );
  const apiOrders = useSelector((state: RootState) => state.feed.orders);
  const loading = useSelector((state: RootState) => state.feed.loading);

  const orders = useApi ? apiOrders : wsOrders;

  const loadData = () => {
    if (useApi) {
      dispatch(getFeeds());
    } else {
      dispatch({ type: 'feedSocket/wsDisconnect' });
      setTimeout(() => {
        dispatch({
          type: 'feedSocket/wsConnect',
          payload: `${WS_URL}/orders/all`
        });
      }, 100);
    }
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (wsAttempted.current) return;
    wsAttempted.current = true;

    const socketUrl = `${WS_URL}/orders/all`;

    const timeout = setTimeout(() => {
      if (!wsConnected.current) {
        setUseApi(true);
        dispatch(getFeeds());
      }
    }, 3000);

    const ws = new WebSocket(socketUrl);

    ws.onopen = () => {
      wsConnected.current = true;
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.success) {
        clearTimeout(timeout);
      }
    };

    ws.onerror = () => {
      clearTimeout(timeout);
      setUseApi(true);
      dispatch(getFeeds());
    };

    return () => {
      ws.close();
      clearTimeout(timeout);
    };
  }, [dispatch, refreshKey]);

  useEffect(() => {
    if (useApi && !apiOrders.length && !loading) {
      dispatch(getFeeds());
    }
  }, [useApi, apiOrders.length, loading, dispatch]);

  useEffect(() => {
    if (!useApi && wsOrders.length > 0 && orders.length === 0) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [wsOrders, orders, useApi]);

  if (
    (!useApi && !wsOrders.length) ||
    (useApi && loading && !apiOrders.length)
  ) {
    return <Preloader />;
  }

  return <FeedUI key={refreshKey} orders={orders} handleGetFeeds={loadData} />;
};
