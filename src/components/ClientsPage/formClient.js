import { CloseOutlined } from '@ant-design/icons';
import styles from '../styles/formBook.module.css'
import {

  Button,
  Form,
  Input,
  Card,
  Space,
  Switch

} from 'antd';
import React, { useState } from 'react';
import { createItem, editItem, getPaginateItems } from '../../utils/crudOperations';


const FormClient = (props) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const servicePath = 'clientes'
  let isFlamengo = false
  let isOnePieceFa = false

  form.resetFields()

  const onChangeIsFlamengo = (value) => {
    isFlamengo = value
    console.log(form.getFieldsValue())

  }

  const onChangeIsOnePieceFa = (value) => {
    isOnePieceFa = value
    console.log(form.getFieldsValue())
  }


  const sendData = async (values) => {
    let send = values

    if (send['is_flamengo'] == undefined) {
      send['is_flamengo'] = false
    }

    if (send['watch_onepiece'] == undefined) {
      send['watch_onepiece'] = false
    }

    /*send['is_flamengo'] = isFlamengo
    send['watch_onepiece'] = isOnePieceFa*/
    console.log(values)
    try {
      if (props.dataToEdit != null && props.dataToEdit != undefined) {
        await editItem(props.dataToEdit['id'], values, servicePath);
        let message = "Sucesso ao editar os dados do cliente '" + send['nome'] + "'"
        props.setNotification({ erro: false, message: message })
      } else {
        // Descomente para cadastrar vários clientes(Somente para teste)
        // for (let i = 1; i < 9; i++) {
        //     values.isbn = `0${i}000000000`
        //     await createItem(values, servicePath);
        // }
        await createItem(values, servicePath);
        let message = "Sucesso ao criar o cliente '" + send['nome'] + "'"
        props.setNotification({ erro: false, message: message })
      }
      getPaginateItems(props.page, servicePath).then((data) => {
        props.setData(data);
      }).catch(() => {
        props.setNotification({ erro: true, message: "Erro ao buscar clientes" })
      })
    } catch (error) {
      let message = "Erro ao criar o cliente '" + send['nome'] + "'"
      if (props.dataToEdit != null && props.dataToEdit != undefined) {
        message = "Erro ao editar os dados do cliente '" + send['nome'] + "'"
      }
      if (send['nome'] == undefined || send['nome'] == null || send['nome'] == "") {
        message = "Erro ao criar o cliente"
      }
      props.setNotification({ erro: true, message: message })
    }
    props.setOpen(false);
  };

  React.useEffect(() => {
    console.log(props.dataToEdit)
    if (props.dataToEdit != null) {
      form.setFieldsValue({
        autor: props.dataToEdit.autor,
        nome: props.dataToEdit.nome,
        cpf: props.dataToEdit.cpf,
        enderecos: props.dataToEdit.enderecos,
        is_flamengo: props.dataToEdit.is_flamengo,
        watch_onepiece: props.dataToEdit.watch_onepiece

      })

      isOnePieceFa = props.dataToEdit.watch_onepiece
      isFlamengo = props.dataToEdit.is_flamengo
      console.log(form.getFieldsValue())
    }
  }, [props.dataToEdit]);

  return (
    <div className={styles['form-container']}>
      <Form
        form={form}
        labelCol={{
          span: 80,

        }}
        wrapperCol={{
          span: 60,
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
          {props.dataToEdit && <Form.Item label="Flamengista?" valuePropName={isFlamengo} name="is_flamengo">
            {!props.dataToEdit.is_flamengo && <Switch onChange={onChangeIsFlamengo} />}
            {props.dataToEdit.is_flamengo && <Switch onChange={onChangeIsFlamengo} defaultChecked />}
          </Form.Item>}
          {props.dataToEdit && <Form.Item label="Fã de One Piece" valuePropName={isOnePieceFa} name="watch_onepiece">
            {!props.dataToEdit.watch_onepiece && <Switch onChange={onChangeIsOnePieceFa} />}
            {props.dataToEdit.watch_onepiece && <Switch onChange={onChangeIsOnePieceFa} defaultChecked />}
          </Form.Item>}

        </div>

        <Form.List name="enderecos">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: 'flex',
                rowGap: 16,
                flexDirection: 'column',
              }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Endereço ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >
                  <Form.Item label="Recebedor" name={[field.name, 'recebedor']}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Estado" name={[field.name, 'uf']}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Cidade" name={[field.name, 'cidade']}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Bairro" name={[field.name, 'bairro']}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Logradouro" name={[field.name, 'logradouro']}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Número da Residência" name={[field.name, 'numero']}>
                    <Input />
                  </Form.Item>


                </Card>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Adicionar outro Endereço
              </Button>
            </div>
          )}
        </Form.List>

        <div className={styles['container-foot']}>
          <Button type='primary' danger>Cancelar</Button>
          {props.dataToEdit != null && <Button type='primary' htmlType='submit'>Editar</Button>}
          {props.dataToEdit == null && <Button type='primary' htmlType='submit'>Criar</Button>}
        </div>
      </Form>
    </div>
  );
};
export default FormClient;