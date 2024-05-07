import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styles from '../styles/formBook.module.css'
import {

    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,

} from 'antd';
import { createItem, editItem, getPaginateItems } from '../../utils/crudOperations';
import React from 'react';
import dayjs from 'dayjs';

const FormEmployee = (props) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();

    const servicePath = 'vendedores'
    console.log(props)

    form.resetFields()

    const sendData = async (values) => {
        let send = values
        try {
            if (props.dataToEdit != null && props.dataToEdit != undefined) {
                await editItem(props.dataToEdit['id'], values, servicePath);
                let message = "Sucesso ao editar os dados do funcionário '" + send['nome'] + "'"
                props.setNotification({ erro: false, message: message })
            } else {
                // Descomente para cadastrar vários funcinonários(Somente para teste)
                // for (let i = 1; i < 9; i++) {
                //     values.isbn = `0${i}000000000`
                //     await createItem(values, servicePath);
                // }
                await createItem(values, servicePath);
                let message = "Sucesso ao criar funcionário '" + send['nome'] + "'"
                props.setNotification({ erro: false, message: message })
            }

            getPaginateItems(props.page, servicePath).then((data) => {
                props.setData(data);
            }).catch(() => {

                props.setNotification({ erro: true, message: "Erro ao buscar funcionários" })
            })

        } catch (error) {
            let message = "Erro ao criar o funcionpario '" + send['nome'] + "'"
            if (props.dataToEdit != null && props.dataToEdit != undefined) {
                message = "Erro ao editar os dados do funcionário '" + send['nome'] + "'"
            }
            if (send['nome'] == undefined || send['nome'] == null || send['nome'] == "") {
                message = "Erro ao criar o funcionário "
            }
            props.setNotification({ erro: true, message: message })
        }
        props.setOpen(false);
    };

    React.useEffect(() => {
        if (props.dataToEdit != null) {
            form.setFieldsValue({
                autor: props.dataToEdit.autor,
                nome: props.dataToEdit.nome,
                cpf: props.dataToEdit.cpf,

            })
        }
    }, [props.dataToEdit, form]);

    return (
        <div className={styles['form-container']}>
            <Form
                form={form}
                labelCol={{
                    span: 70,

                }}
                wrapperCol={{
                    span: 50,
                }}
                layout="vertical"
                style={{
                    maxWidth: '80vw',

                }}
                onFinish={sendData}
            >

                <div className={styles['form-group']}>
                    <Form.Item name="nome" label="Nome">
                        <Input placeholder='Nome' />
                    </Form.Item>
                    <Form.Item name="cpf" label="CPF">
                        <Input placeholder='CPF' />
                    </Form.Item>
                </div>

                <div className={styles['container-foot']}>
                    <Button type='primary' danger>Cancelar</Button>
                    {props.dataToEdit != null && <Button type='primary' htmlType='submit'>Editar</Button>}
                    {props.dataToEdit == null && <Button type='primary' htmlType='submit'>Criar</Button>}
                </div>
            </Form>
        </div>
    );
};
export default FormEmployee;