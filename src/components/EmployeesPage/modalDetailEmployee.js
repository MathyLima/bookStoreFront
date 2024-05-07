import React, { useState } from 'react';
import { Modal, Button, Space, Descriptions, Image, Card } from 'antd';
import styles from '../styles/modalDetailBook.module.css'

const ModalDetailEmployee = (props) => {
    const handleCancel = () => {
        props.setOpenDetail(false);
    };

    return (
        <div>
            {(props.selectedEmpolyee != undefined && props.selectedEmpolyee != null) &&
                <Modal
                    title={"Detalhes do Empregado: " + props.selectedEmpolyee.nome}
                    open={props.openDetail}
                    onCancel={handleCancel}
                    footer={null}
                    width='76vw'

                >
                    <div className={styles['container-details']}>
                        <Descriptions bordered className={styles['description-items-container']}>
                            <Descriptions.Item label="Nome" span={3}>{props.selectedEmpolyee.nome}</Descriptions.Item>
                            <Descriptions.Item label="CPF" span={2}>{props.selectedEmpolyee.cpf}</Descriptions.Item>

                        </Descriptions>
                    </div>

                    <div className={styles['actions']}>
                        <Button type='primary' danger onClick={() => { props.del(props.selectedEmpolyee.id, props.selectedEmpolyee.nome) }}>Deletar</Button>
                        <Button type='primary' onClick={() => { props.edit(props.selectedEmpolyee.id, props.selectedEmpolyee.nome) }}>Editar</Button>
                        <Button type='primary' onClick={handleCancel}>Voltar</Button>
                    </div>
                </Modal>
            }
        </div>
    );
};

export default ModalDetailEmployee;
