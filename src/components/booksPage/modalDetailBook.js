import React, { useState } from 'react';
import { Modal, Button, Space, Descriptions, Image } from 'antd';
import styles from '../styles/modalDetailBook.module.css'

const ModalDetailBook = (props) => {
    const handleCancel = () => {
        props.setOpenDetail(false);
    };
    return (
        <div>
            {(props.selectedBook != undefined && props.selectedBook != null) &&
                <Modal
                    title={"Detalhes do Livro: " + props.selectedBook.nome}
                    open={props.openDetail}
                    onCancel={handleCancel}
                    footer={null}
                    width='76vw'

                >
                    <div className={styles['container-details']}>
                        <Image
                            width='21vw'

                            src={props.selectedBook.image_url}
                        />
                        <Descriptions bordered className={styles['description-items-container']}>
                            <Descriptions.Item label="Nome" span={3}>{props.selectedBook.nome}</Descriptions.Item>
                            <Descriptions.Item label="Autor" span={2}>{props.selectedBook.autor}</Descriptions.Item>
                            <Descriptions.Item label="Preço">R$ {props.selectedBook.preco}</Descriptions.Item>
                            <Descriptions.Item label="Gênero">{props.selectedBook.genero}</Descriptions.Item>
                            <Descriptions.Item label="Estoque">{props.selectedBook.estoque.quantidade}</Descriptions.Item>
                            <Descriptions.Item label="Editora">{props.selectedBook.editora.nome}</Descriptions.Item>
                            <Descriptions.Item label="Lançamento">{props.selectedBook.data_lancamento}</Descriptions.Item>
                            <Descriptions.Item label="ISBN">{props.selectedBook.isbn}</Descriptions.Item>
                            <Descriptions.Item label="Edição">{props.selectedBook.edicao}</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <Descriptions bordered className={styles['sinopse-item']}>
                        <Descriptions.Item label="Sinopse" span={2}>{props.selectedBook.sinopse}</Descriptions.Item>
                    </Descriptions >
                    <div className={styles['actions']}>
                        <Button type='primary' danger onClick={() => { props.del(props.selectedBook.id, props.selectedBook.nome) } }>Deletar</Button>
                        <Button type='primary' onClick={() => { props.edit(props.selectedBook.id, props.selectedBook.nome) } }>Editar</Button>
                        <Button type='primary'  onClick={handleCancel}>Voltar</Button>
                    </div>
                </Modal>
            }
        </div>
    );
};

export default ModalDetailBook;
