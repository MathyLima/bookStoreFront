import React, { useState } from 'react';
import { Modal, Button, Space, Descriptions, Image } from 'antd';

import styles from '../styles/modalDetailBook.module.css'
import OrderItem from '../ui/orderItem';

const ModalDetailOrder = (props) => {
    const handleCancel = () => {
        props.setOpenDetail(false);
    };

    return (
        <div>
            {(props.selectedOrder != undefined && props.selectedOrder != null) &&
                <Modal
                    title={`Detalhes do pedido Nº #${props.selectedOrder.id}`}
                    open={props.openDetail}
                    onCancel={handleCancel}
                    footer={null}
                    width='76vw'

                >
                <OrderItem order={props.selectedOrder} />
                </Modal>
            }
        </div>
    );
};

export default ModalDetailOrder;
