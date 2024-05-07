import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styles from '../styles/formOrder.module.css'
import {

    Button,
    DatePicker,
    Descriptions,
    Form,
    Image,
    Input,
    InputNumber,
    Select,
    Space,
    Table,
    Upload,

} from 'antd';
import { createItem, editItem, getPaginateItems, getEmployeeOrClientByCpf, getItemByName } from '../../utils/crudOperations';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Search from 'antd/es/input/Search';

const FormOrder = (props) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [client, setClient] = useState()
    const [employee, setEmployee] = useState()
    const [books, setBooks] = useState({data: []})
    const [totalPrice, setTotalPrice] = useState(0)
    const [addedbooks, setBooksAdded] = useState([])
    const servicePath = 'pedidos'

    form.resetFields()

    const sendData = async (values) => {
        let send = values
        console.log(props.dataToEdit)
        let books_id = addedbooks.map((book) => {
            console.log(book)
            return { 'id': book.id, 'quantidade': book.quantidade }
        })

        try {
            if (props.dataToEdit != null && props.dataToEdit != undefined) {
                await editItem(props.dataToEdit.id, { cliente_id: client.id, vendedor_id: employee.id, livros: books_id }, servicePath);
                let message = "Sucesso ao editar o livro"
                props.setNotification({ erro: false, message: message })
            } else {
                // Descomente para cadastrar vários livros(Somente para teste)
                // for (let i = 1; i < 9; i++) {
                //     values.isbn = `0${i}000000000`
                //     await createItem(values, servicePath);
                // }
                console.log(client)
                console.log(employee)
                console.log(books_id)
                await createItem({ cliente_id: client.id, vendedor_id: employee.id, livros: books_id }, servicePath);
                let message = "Sucesso ao criar o Pedido"
                props.setNotification({ erro: false, message: message })
            }

            setClient()
            setEmployee()
            setBooksAdded([])
            getPaginateItems(props.page, servicePath).then((data) => {
                props.setData(data);
            }).catch((error) => {
                props.setNotification({ erro: true, message: "Erro ao buscar livros" })
            })

        } catch (error) {
            console.log(error)

            let message = "Erro ao criar o livro"
            if (props.dataToEdit != null && props.dataToEdit != undefined) {
                message = "Erro ao editar o livro"
            }
            if (send['nome'] == undefined || send['nome'] == null || send['nome'] == "") {
                message = "Erro ao criar o livro "
            }
            props.setNotification({ erro: true, message: message })
        }
        props.setOpen(false);
    };

    const getCpfClient = (event) => {
        let value = event.target.value
        if (value.length == 11) {
            getEmployeeOrClientByCpf(value, 'clientes').then((data) => {
                if (data.data.length > 0) {  
                    console.log(data.data[0])                  
                    setClient(data.data[0])
                }
            })
        }
    }

    const getCpfEmployee = (event) => {
        let value = event.target.value
        if (value.length == 11) {
            getEmployeeOrClientByCpf(value, 'vendedores').then((data) => {
                if (data.data.length > 0) {  
                    console.log(data.data[0])                  
                    setEmployee(data.data[0])
                }
            })
        }
    }

    const searchByBookName = (value) => {
        getItemByName(value, 1, 'livros').then((data) => {
            console.log(data)
            setBooks(data)
        });
    }

    const AddNewBook = (book) => {
        let b = [...addedbooks]
        if (!Object.keys(book).includes("quantidade")) {
            book['quantidade'] = 1
        }
        b.push(book)
        setBooksAdded(b)

        console.log(b)
    }

    const changeQty = (book, qty) => {
        let b = [...books.data]
        let addedb = [...addedbooks]
        for (let i = 0; i < books.length; i++) {
            if (book.id == b[i].id) {
                b[i]['quantidade'] = qty
                break;
            }
        }

        console.log("QUANTIDADE: ", qty)

        for (let i = 0; i < addedb.length; i++) {
            if (book.id == addedb[i].id) {
                addedb[i]['quantidade'] = qty
                break;
            }
        }

        setBooks({"data": b, "total": books.total})
        setBooksAdded(addedb)
        console.log(books)

        let total = 0
        addedb.forEach(book => {
            console.log(total)
            total += (book.preco * book.quantidade)
        })

        setTotalPrice(total)
    }

    useEffect(() => {
        setClient()
        setEmployee()
        setBooksAdded([])
    }, [props.dataToEdit])

    React.useEffect(() => {
        if (props.dataToEdit != null) {
            setClient(props.dataToEdit.cliente)
            setEmployee(props.dataToEdit.vendedor)
            setBooksAdded(props.dataToEdit.livros)
        }
    }, [props.dataToEdit, form]);

    useEffect(() => {
        console.log(addedbooks)
        let total = 0
        addedbooks.forEach(book => {
            console.log(total)
            total += (book.preco * book.quantidade)
        })

        setTotalPrice(total)
    }, [addedbooks, books])



    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Autor',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Edição',
            dataIndex: 'edition',
            key: 'edition',
        },
        {
            title: 'Preço',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Quantidade',
            key: 'action',
            render: (_, record) => (
                React.createElement(
                    Space,
                    { size: 'middle' },
                    <InputNumber placeholder='1X' style={{ height: "6vh" }} maxLength={record.estoque.quantidade} onChange={(event) => { changeQty(record, event) }} defaultValue={record.quantidade} />

                    //React.createElement(InputNumber, { type: "primary", icon: React.createElement(EditFilled), onClick: () => { } }),
                    //React.createElement(Button, { type: "primary", icon: React.createElement(EditFilled), onClick: () => { } }),
                    //React.createElement(Button, { type: "primary", danger: true, icon: React.createElement(DeleteFilled), onClick: () => {  } }),
                )
            ),
        },
    ];


    console.log(books)
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
                    <Form.Item name="cpfClient" label="Cliente">
                        <Input placeholder='CPF do cliente' onKeyUp={getCpfClient} maxLength={11} />
                    </Form.Item>
                    <Form.Item name="cpfEmployee" label="Funcionário">
                        <Input placeholder='CPF do funcioário' onKeyUp={getCpfEmployee} maxLength={11} />
                    </Form.Item>
                </div>

                {client && <Descriptions bordered className={styles['description-items-container']}>
                    <Descriptions.Item label="Cliente" span={3} style={{ width: "15vw" }}>{client.nome}</Descriptions.Item>
                    <Descriptions.Item label="CPF Do Cliente" span={3}>{client.cpf}</Descriptions.Item>
                </Descriptions>}
                <br></br>
                {employee && <Descriptions bordered className={styles['description-items-container']}>
                    <Descriptions.Item label="Funcionário" span={3} style={{ width: "15vw" }}>{employee.nome}</Descriptions.Item>
                    <Descriptions.Item label="CPF Do Funcionário" span={3}>{employee.cpf}</Descriptions.Item>
                </Descriptions>}
                <br></br>
                <h2>Total: R$ {totalPrice}</h2>

                <div className={styles['order-books']}>
                    <h2>Livros do pedido: </h2>
                    {addedbooks && addedbooks.map((book) => (
                        <div>
                            <div className={styles['container-added-books']}>
                                <Image
                                    width='7vw'
                                    style={{ paddingTop: '34px' }}
                                    src={book.image_url} />
                                <Table
                                    dataSource={[{
                                        key: book.id,
                                        id: book.id,
                                        name: book.nome,
                                        author: book.autor,
                                        edition: book.edicao,
                                        price: `R$ ${book.preco}`,
                                        quantidade: book.quantidade,
                                        estoque: book.estoque.quantidade
                                    }]}
                                    columns={columns}
                                    pagination={false} />
                            </div>
                            <hr></hr>

                        </div>
                    ))}

                </div>
                <Form.Item name="books">
                    <Search placeholder="Pesquisar livros por nome" enterButton onSearch={searchByBookName} />
                </Form.Item>
                <div className={styles['books']}>

                    {books && books.data.map((book) => (
                        <div className={styles['container-book']}>
                            <Image
                                width='13vw'
                                style={{ paddingTop: '34px' }}
                                src={book.image_url} />
                            <Descriptions bordered className={styles['description-items-container']}>
                                <Descriptions.Item label="Nome" span={3}>{book.nome}</Descriptions.Item>
                                <Descriptions.Item label="Autor" span={2}>{book.autor}</Descriptions.Item>
                                <Descriptions.Item label="Preço">R$ {book.preco}</Descriptions.Item>
                                <Descriptions.Item label="Gênero">{book.genero}</Descriptions.Item>
                                <Descriptions.Item label="Editora">{book.editora.nome}</Descriptions.Item>                                
                                <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
                                <Descriptions.Item label="Edição">{book.edicao}</Descriptions.Item>
                                {book.estoque.quantidade == 0 && <Descriptions.Item><p style={{color: 'red', fontSize: '2vw'}}>Em falta</p></Descriptions.Item>}
                            </Descriptions>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: 'flex-end' }}>
                                {/*!addedbooks.filter(b => b.id == book.id).length > 0 && <InputNumber placeholder='1X' style={{ height: "6vh" }} onChange={(event) => { changeQty(book, event) }} />}
                                {addedbooks.filter(b => b.id == book.id).length > 0 && <InputNumber disabled value={book.quantidade} placeholder='1X' style={{ height: "6vh" }} onChange={(event) => { changeQty(book, event) }} />*/}

                                {(!addedbooks.filter(b => b.id == book.id).length > 0 && book.estoque.quantidade > 0) && <Button type='primary' style={{ height: "6vh" }} onClick={() => { AddNewBook(book) }}>Adicionar</Button>}
                                {(addedbooks.filter(b => b.id == book.id).length > 0 || book.estoque.quantidade == 0) && <Button disabled type='primary' style={{ height: "6vh" }} onClick={() => { AddNewBook(book) }}>Adicionar</Button>}
                            </div>
                        </div>
                    ))}
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
export default FormOrder;