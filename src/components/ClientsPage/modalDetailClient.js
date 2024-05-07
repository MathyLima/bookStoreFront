import React, { useState } from 'react';
import { Modal, Button, Space, Descriptions, Image, Card } from 'antd';
import styles from '../styles/modalDetailBook.module.css'
import stylesPage from '../styles/modalDetailClient.module.css'
import {
  HomeFilled

} from '@ant-design/icons';
const ModalDetailClient = (props) => {
  const handleCancel = () => {
    props.setOpenDetail(false);
  };

  return (
    <div>
      {(props.selectedClient != undefined && props.selectedClient != null) &&
        <Modal
          title={"Detalhes do Cliente: " + props.selectedClient.nome}
          open={props.openDetail}
          onCancel={handleCancel}
          footer={null}
          width='76vw'

        >
          <div className={styles['container-details']}>
            <Descriptions bordered className={styles['description-items-container']}>
              <Descriptions.Item label="Nome" span={3}>{props.selectedClient.nome}</Descriptions.Item>
              <Descriptions.Item label="CPF" span={2}>{props.selectedClient.cpf}</Descriptions.Item>

            </Descriptions>
          </div>
          <div className={stylesPage['container-address']}>
            {props.selectedClient.enderecos && props.selectedClient.enderecos.map((endereco, i) => (
             <Card
                title={endereco.nome_recebedor}
                extra={
                  (endereco.id == props.selectedClient.endereco_padrao || i == 0) &&  <div>Endereço padrão <HomeFilled style={{fontSize: "2vw"}}/> </div>
                }
                style={{ width: "34.8vw", marginRight: "1%", marginTop: "1%" }} bordered={true}>
                <p>Estado: {endereco.uf}</p>
                <p>Cidade: {endereco.cidade}</p>
                <p>Bairro: {endereco.bairro}</p>
                <p>Logradouro: {endereco.logradouro}</p>
                <p>Nº Casa: {endereco.numero}</p>
              </Card>
              
            ))}
          </div>
          <div className={styles['actions']}>
            <Button type='primary' danger onClick={() => { props.del(props.selectedClient.id, props.selectedClient.nome) }}>Deletar</Button>
            <Button type='primary' onClick={() => { props.edit(props.selectedClient.id, props.selectedClient.nome) }}>Editar</Button>
            <Button type='primary' onClick={handleCancel}>Voltar</Button>
          </div>
        </Modal>
      }
    </div>
  );
};

export default ModalDetailClient;
