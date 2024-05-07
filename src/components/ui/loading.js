import { Modal, Spin } from "antd";
import styles from "./styles/loading.module.css"

const Loading = (props) => {

  return (
    <div className={styles['loading-container']}>
        <Spin tip="Loading" size="large">
        </Spin >
    </div >
  )
}

export default Loading;
