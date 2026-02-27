import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';

type ActionWithPayload = {
  type: string;
  payload?: string;
};

export const socketMiddleware = (): Middleware =>
  ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;
    let url = '';
    let isConnected = false;
    let reconnectTimer: NodeJS.Timeout | null = null;

    return (next) => (action: ActionWithPayload) => {
      const { dispatch } = store;

      switch (action.type) {
        case 'profileOrders/wsConnect': {
          if (socket) {
            socket.close();
            socket = null;
          }
          if (typeof action.payload === 'string') {
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

            socket.onmessage = (event: MessageEvent) => {
              try {
                const parsedData = JSON.parse(event.data);
                dispatch({
                  type: 'profileOrders/wsProfileMessage',
                  payload: parsedData
                });
              } catch (error) {
                console.error('Ошибка парсинга сообщения:', error);
              }
            };

            socket.onclose = () => {
              dispatch({ type: 'profileOrders/wsProfileClose' });
              if (isConnected) {
                if (reconnectTimer) {
                  clearTimeout(reconnectTimer);
                }
                reconnectTimer = setTimeout(() => {
                  dispatch({ type: 'profileOrders/wsConnect', payload: url });
                }, 3000);
              }
            };
          }
          break;
        }

        case 'profileOrders/wsDisconnect': {
          if (socket) {
            if (reconnectTimer) {
              clearTimeout(reconnectTimer);
              reconnectTimer = null;
            }
            isConnected = false;
            socket.close();
            socket = null;
          }
          break;
        }

        default:
          break;
      }

      next(action);
    };
  }) as Middleware;
