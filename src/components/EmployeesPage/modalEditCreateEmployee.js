import React, { useState } from 'react';
import { Modal } from 'antd';
import FormEmployee from './formEmployee';
const ModalEditCreateEmployee = (props) => {
    const handleCancel = () => {
        props.setOpen(false);
        props.setDataToEdit(null)
    };

    let title = "Criar Novo Funcionário"
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
            <FormEmployee page={props.page} setData={props.setData} open={props.open} setNotification={props.setNotification} setOpen={props.setOpen} setDataToEdit={props.setDataToEdit} dataToEdit={props.dataToEdit} />
        </Modal>
    );
};
export default ModalEditCreateEmployee;