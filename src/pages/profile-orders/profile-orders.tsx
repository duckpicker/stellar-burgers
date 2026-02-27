import { FC, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { getProfileOrders } from '../../services/slices/profileOrdersSlice';
import { Preloader } from '@ui';
import { getCookie } from '../../utils/cookie';

const WS_URL = process.env.BURGER_WS_URL || 'wss://norma.nomoreparties.space';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const [useApi, setUseApi] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const wsConnected = useRef(false);
  const wsAttempted = useRef(false);

  const wsOrders = useSelector(
    (state: RootState) => state.profileOrdersSocket?.orders || []
  );
  const apiOrders = useSelector(
    (state: RootState) => state.profileOrders.orders
  );
  const apiLoading = useSelector(
    (state: RootState) => state.profileOrders.loading
  );

  const orders = useApi ? apiOrders : wsOrders;
  const loading = useApi ? apiLoading : !dataLoaded;

  useEffect(() => {
    dispatch(getProfileOrders());

    let accessToken = getCookie('accessToken') || '';
    accessToken = accessToken.replace('Bearer ', '');

    if (!accessToken) {
      setUseApi(true);
      setDataLoaded(true);
      return;
    }

    const socketUrl = `${WS_URL}/orders?token=${accessToken}`;

    const timeout = setTimeout(() => {
      if (!wsConnected.current) {
        console.log('WS timeout, используем API');
        setUseApi(true);
        setDataLoaded(true);
      }
    }, 3000);

    const ws = new WebSocket(socketUrl);

    ws.onopen = () => {
      wsConnected.current = true;
      dispatch({ type: 'profileOrdersSocket/wsProfileOrdersConnecting' });
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.success) {
        dispatch({
          type: 'profileOrdersSocket/wsProfileOrdersMessage',
          payload: data
        });
        setDataLoaded(true);
        clearTimeout(timeout);
      }
    };

    ws.onerror = () => {
      clearTimeout(timeout);
      setUseApi(true);
      setDataLoaded(true);
    };

    ws.onclose = () => {
      dispatch({ type: 'profileOrdersSocket/wsProfileOrdersClose' });
    };

    return () => {
      ws.close();
      clearTimeout(timeout);
    };
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
