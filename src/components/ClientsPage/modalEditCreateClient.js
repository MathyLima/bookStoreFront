import React, { useState } from 'react';
import { Modal } from 'antd';
import FormClient from './formClient';

const ModalEditCreateClient = (props) => {
    const handleCancel = () => {
        props.setOpen(false);
        props.setDataToEdit(null)
    };

    let title = "Criar Novo Cliente"
    if (props.id != null) {
        title = "Editar"
    }


    return (
        <Modal
            title={title}
            open={props.open}
            onCancel={handleCancel}
            width='70vw'
            footer={null}
        >
            <FormClient page={props.page} setData={props.setData} open={props.open} setNotification={props.setNotification} setOpen={props.setOpen} setDataToEdit={props.setDataToEdit} dataToEdit={props.dataToEdit} />
        </Modal>
    );
};
export default ModalEditCreateClient;