import React, { useState } from 'react';
import { Modal, Button, Space, Descriptions, Image, Collapse, Pagination } from 'antd';
import styles from './styles/modalViewOrders.module.css'
import OrderItem from './orderItem';

const ModalViewOrders = (props) => {
    const setOpenOrders = () => {
        props.setOpenOrders(false);
    };


    return (
        <div>
            <Modal
                title={"Pedidos"}
                open={props.openOrders}
                onCancel={setOpenOrders}
                footer={null}
                width='76vw'

            >
                <div className={styles['container-details']}>
                    {props.orders.data.map((order) => (
                        <Collapse
                            size="large"
                            items={[
                                {
                                    key: '1',
                                    label: 'Pedido número #' + order.id,
                                    children: <OrderItem order={order} />,
                                },
                            ]}
                        />
                    ))}
                </div>
                
                {props.orders.data.length > 0 && <Pagination defaultCurrent={props.page} total={props.orders.quantidade} onChange={(page, pageSize) => {props.onChangePaginateOrders(props.orders.data[0].id, page)}}/>}
            </Modal>
        </div>
    );
};

export default ModalViewOrders;
