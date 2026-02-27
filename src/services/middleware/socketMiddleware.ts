export const socketMiddleware = () => (store: any) => {
  let socket: any = null;
  let url = '';
  let isConnected = false;
  let reconnectTimer: any = 0;

  return (next: any) => (action: any) => {
    const { dispatch } = store;

    switch (action.type) {
      case 'profileOrders/wsConnect':
        if (socket) {
          socket.close();
          socket = null;
        }
        url = action.payload;
        socket = new WebSocket(url);
        isConnected = true;
        dispatch({ type: 'profileOrders/wsProfileConnecting' });

        socket.onopen = () => {
          dispatch({ type: 'profileOrders/wsProfileOpen' });
        };

        socket.onerror = () => {
          dispatch({
            type: 'profileOrders/wsProfileError',
            payload: 'WebSocket error'
          });
        };

        socket.onmessage = (event: any) => {
          const { data } = event;
          const parsedData = JSON.parse(data);
          dispatch({
            type: 'profileOrders/wsProfileMessage',
            payload: parsedData
          });
        };

        socket.onclose = () => {
          dispatch({ type: 'profileOrders/wsProfileClose' });
          if (isConnected) {
            reconnectTimer = window.setTimeout(() => {
              dispatch({ type: 'profileOrders/wsConnect', payload: url });
            }, 3000);
          }
        };
        break;

      case 'profileOrders/wsDisconnect':
        if (socket) {
          clearTimeout(reconnectTimer);
          isConnected = false;
          socket.close();
          socket = null;
        }
        break;

      default:
        break;
    }

    next(action);
  };
};
