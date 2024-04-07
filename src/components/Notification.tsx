import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { onMessageListener, requestForToken } from "src/firebase";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const notify = () => toast(<ToastDisplay />);

  function ToastDisplay() {
    return (
      <div>
        <p>
          <b>{notification?.title}</b>
        </p>
        <p>{notification?.body}</p>
      </div>
    );
  }

  useEffect(() => {
    if (notification?.title) {
      notify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  requestForToken();

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload?.notification?.title ?? "",
        body: payload?.notification?.body ?? "",
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <div />;
};

export default Notification;
