import { Modal, Button, Space, Descriptions, Image, Collapse, Pagination } from 'antd';
import styles from './styles/modalViewOrders.module.css'
import { useEffect, useState } from 'react';

const OrderItem = (props) => {
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        let total = 0
        props.order.livros.forEach(book => {
            console.log(total)
            total += (book.preco * book.ItemModel.quantidade)
        })

        setTotalPrice(total)
    }, [props.order.livros])

    return (
        <div className={styles['order-item']}>
            <Descriptions bordered className={styles['description-items-container']}>
                <Descriptions.Item label="Cliente" span={3} style={{width: "15vw"}}>{props.order.cliente.nome}</Descriptions.Item>
                <Descriptions.Item label="CPF Do Cliente" span={3}>{props.order.cliente.cpf}</Descriptions.Item>
                <Descriptions.Item label="Funcionário" span={3}>{props.order.vendedor.nome}</Descriptions.Item>
                <Descriptions.Item label="Total">R$ {totalPrice} </Descriptions.Item>
            </Descriptions>

            <h2> Livros do Pedido: </h2>
            {props.order.livros.map((book) => (
                <Collapse
                    style={{marginBottom: "1vh"}}
                    size="large"
                    items={[
                        {
                            key: '1',
                            label: `${book.nome} x${book.ItemModel.quantidade}` ,
                            children: <div className={styles['container-book']}>
                                <Image
                                    width='15vw'

                                    src={book.image_url}
                                />
                                <Descriptions bordered className={styles['description-items-container']}>
                                    <Descriptions.Item label="Nome" span={3}>{book.nome}</Descriptions.Item>
                                    <Descriptions.Item label="Autor" span={2}>{book.autor}</Descriptions.Item>
                                    <Descriptions.Item label="Preço">R$ {book.preco}</Descriptions.Item>
                                    <Descriptions.Item label="Gênero">{book.genero}</Descriptions.Item>
                                    <Descriptions.Item label="Quantidade" span={2}>{book.quantidade}</Descriptions.Item>
                                    <Descriptions.Item label="Lançamento">{book.data_lancamento}</Descriptions.Item>
                                    <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
                                    <Descriptions.Item label="Edição">{book.edicao}</Descriptions.Item>
                                </Descriptions>
                            </div>,
                        },
                    ]}
                />
            ))}
        </div>
    )
}

export default OrderItem;
