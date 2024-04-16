import React from "react";
import useWebSocket from "react-use-websocket";
import { FbAuth } from "src/firebase";

let baseSocketUrl = "ws://pusher.pilipilih.com/event/v1/order";

type NewEventOrderItmes = {
  name: string;
  qty: number;
};

type NewEventOrder = {
  orderId: string;
  userId: string;
  customerName: string;
  merchantId: string;
  items: NewEventOrderItmes[];
};

const useIoSocket = () => {
  const getSocketUrl = React.useCallback(() => {
    return new Promise<string>((resolve) => {
      FbAuth.onAuthStateChanged(
        async (user) => {
          if (user) {
            const tokens = await user.getIdToken();
            resolve(baseSocketUrl + `?token=${tokens}`);
          }
        },
        (e) => {
          console.log("Error : ", JSON.stringify(e));
        }
      );
    });
  }, []);

  const stateSocket = useWebSocket<MessageEvent<NewEventOrder>>(getSocketUrl, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
  });

  return stateSocket;
};

const NotificationOrder = () => {
  const stateSocket = useIoSocket();

  React.useEffect(() => {
    const ss = stateSocket.getWebSocket();

    if (ss) {
      ss.onmessage = console.log;
    }
  }, []);

  return null;
};

export default NotificationOrder;
