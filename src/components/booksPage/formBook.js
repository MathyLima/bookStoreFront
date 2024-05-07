import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styles from '../styles/formBook.module.css'
import {

    AutoComplete,
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,

} from 'antd';
import { createItem, editItem, getItemByName, getPaginateItems } from '../../utils/crudOperations';
import React, { useState } from 'react';
import dayjs from 'dayjs';

const FormBook = (props) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editora, setEditora] = useState();
    const [value, setValue] = useState();
    const servicePath = 'livros'

    form.resetFields()

    const formatZeros = (numero) => {
        if (numero <= 9)
            return "0" + numero;
        else
            return numero;
    }

    const formatDate = (date) => {
        let dataFormatada = new Date(date)
        dataFormatada = (dataFormatada.getFullYear() + "-" + (formatZeros(dataFormatada.getMonth() + 1).toString()) + "-" + formatZeros(dataFormatada.getDate().toString()));
        return dataFormatada
    }

    const sendData = async (values) => {
        let send = values
        send['data_lancamento'] = formatDate(values['data_lancamento'])
        send['editora_id'] = editora
        console.log(values)
        try {
            if (props.dataToEdit != null && props.dataToEdit != undefined) {
                await editItem(props.dataToEdit['id'], values, servicePath);
                await editItem(props.dataToEdit['estoque']['id'], { quantidade: values.quantidade_estoque }, 'estoques');
                let message = "Sucesso ao editar o livro '" + send['nome'] + "'"
                props.setNotification({ erro: false, message: message })
            } else {
                // Descomente para cadastrar vários livros(Somente para teste)
                // for (let i = 1; i < 9; i++) {
                //     values.isbn = `0${i}000000000`
                //     await createItem(values, servicePath);
                // }
                await createItem(values, servicePath);
                let message = "Sucesso ao criar o livro '" + send['nome'] + "'"
                props.setNotification({ erro: false, message: message })
            }

            getPaginateItems(props.page, servicePath).then((data) => {
                props.setData(data);
            }).catch(() => {

                props.setNotification({ erro: true, message: "Erro ao buscar livros" })
            })

        } catch (error) {
            let message = "Erro ao criar o livro '" + send['nome'] + "'"
            if (props.dataToEdit != null && props.dataToEdit != undefined) {
                message = "Erro ao editar o livro '" + send['nome'] + "'"
            }
            if (send['nome'] == undefined || send['nome'] == null || send['nome'] == "") {
                message = "Erro ao criar o livro "
            }
            props.setNotification({ erro: true, message: message })
        }
        props.setOpen(false);
    };

    React.useEffect(() => {
        if (props.dataToEdit != null) {
            let date = formatDate(props.dataToEdit.data_lancamento)
            // console.log(date)
            form.setFieldsValue({
                autor: props.dataToEdit.autor,
                nome: props.dataToEdit.nome,
                genero: props.dataToEdit.genero,
                isbn: props.dataToEdit.isbn,
                editora: props.dataToEdit.editora,
                edicao: props.dataToEdit.edicao,
                data_lancamento: dayjs(date, 'YYYY-MM-DD'),
                quantidade_estoque: props.dataToEdit.estoque.quantidade,
                preco: props.dataToEdit.preco,
                sinopse: props.dataToEdit.sinopse,
                image_url: props.dataToEdit.image_url,
                pais: props.dataToEdit.pais
            })
        }
    }, [props.dataToEdit, form, formatDate]);


    const getPublishingCompany = async (value) => {
        let search = await getItemByName(value, 1, 'editoras');
        console.log(search)
    }



    const handleSearch = (newValue) => {
        getItemByName(newValue, 1, 'editoras').then((data) => {
            console.log(data)
            const dt = data.data.map((editora) => ({
                value: editora.nome,
                text: editora.id,
            }));
            
            console.log(dt
                )
            setData(dt)
        });
    };
    const handleChange = (newValue) => {
        let edit = data.filter(editora => editora.value == newValue)[0]
        console.log(data, newValue, edit)
        if (edit != undefined) {
            setEditora(edit.text)            
            setValue(edit.console)
        }
    };

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

                {/* 
                <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload action="/upload.do" listType="picture-card">
                        <div>
                            <UploadOutlined />
                            <div
                                style={{
                                    marginTop: 8,
                                }}
                            >
                                Imagem
                            </div>
                        </div>
                    </Upload>
                </Form.Item> */}


                <div className={styles['form-group']}>
                    <Form.Item name="nome" label="Nome">
                        <Input placeholder='Nome' />
                    </Form.Item>
                    <Form.Item name="autor" label="Autor">
                        <Input placeholder='Autor' />
                    </Form.Item>
                    <Form.Item name="genero" label="Gênero">
                        <Input placeholder='Gênero' />
                    </Form.Item>

                </div>

                <div className={styles['form-group']}>
                    <Form.Item name="image_url" label="Imagem">
                        <Input placeholder='Link para capa do livro' />
                    </Form.Item>
                    <Form.Item name="pais" label="Localidade">
                        <Input placeholder='Digite a localidade do livro' />
                    </Form.Item>
                </div>


                <div className={styles['form-group']}>
                    <Form.Item name="isbn" label="ISBN">
                        <Input placeholder='ISBN' />
                    </Form.Item>

                    <Form.Item  label="Editora">

                        <Select

                            showSearch
                            defaultValue={props.dataToEdit != null ? props.dataToEdit.editora.nome :value}
                            value={value}
                            placeholder={props.placeholder}
                            style={{ width: "20vh" }}
                            defaultActiveFirstOption={false}
                            suffixIcon={null}
                            filterOption={false}
                            onSearch={handleSearch}
                            onChange={handleChange}
                            notFoundContent={null}
                            options={
                                data
                            }
                        />
                    </Form.Item>
                    <Form.Item name="edicao" label="Edição" className={styles["custom-form-edition"]}>
                        <Select placeholder="Edição">
                            <Select.Option value="1">1ª Edição</Select.Option>
                            <Select.Option value="2">2ª Edição</Select.Option>
                            <Select.Option value="3">3ª Edição</Select.Option>
                            <Select.Option value="4">4ª Edição</Select.Option>
                            <Select.Option value="5">5ª Edição</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="data_lancamento" label="Data de Lançamento">
                        <DatePicker placeholder='Ano-Mês-Dia' />
                    </Form.Item>
                </div>

                <div className={styles['form-group']}>

                    {props.dataToEdit != null && <Form.Item name="quantidade_estoque" label="Quantidade">
                        <InputNumber placeholder="Quantidade" />
                    </Form.Item>}

                    <Form.Item name="preco" label="Preço">
                        <InputNumber placeholder="Preço" />
                    </Form.Item>
                </div>

                <Form.Item name="sinopse" label="Sinopse">
                    <TextArea rows={4} />
                </Form.Item>
                <div className={styles['container-foot']}>
                    <Button type='primary' danger>Cancelar</Button>
                    {props.dataToEdit != null && <Button type='primary' htmlType='submit'>Editar</Button>}
                    {props.dataToEdit == null && <Button type='primary' htmlType='submit'>Criar</Button>}
                </div>
            </Form>
        </div>
    );
};
export default FormBook;