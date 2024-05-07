import { Alert, Modal, Spin, Button } from "antd";
import styles from "./styles/notification.module.css"

const Notification = (props) => {
  console.log(props.notification, props.notification.erro ? "error" : "success")

  const close = () => {
    props.setNotification({erro: "", message:  ""})
  }
  return (
    <div className={styles['notification-container']}>
      <Alert
      message={props.notification.message}
      showIcon
      type={props.notification.erro ? "error" : "success"}
      closable
      onClose={close}
    />
    </div >
  )
}

export default Notification;
