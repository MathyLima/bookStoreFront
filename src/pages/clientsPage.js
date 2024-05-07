import React, { useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import Search from 'antd/es/input/Search';
import {
  EditFilled,
  DeleteFilled,
  HomeFilled,
  ShoppingCartOutlined

} from '@ant-design/icons';
import styles from './styles/bookpage.module.css'
import ModalEditCreateClient from '../components/ClientsPage/modalEditCreateClient';
import ModalDetailClient from '../components/ClientsPage/modalDetailClient';
import { deleteItem, getItemByName, getPaginateItems } from '../utils/crudOperations';

import ModalViewOrders from '../components/ui/modalViewOrders';
import { getOrdersByClient, getOrdersByClientPaginate } from '../utils/orders';

const ClientsPage = (props) => {
  const [open, setOpen] = useState(false);
  const [pageOrders, setPageOrders] = useState({ page: 1, pageSize: 10 });
  const [selectedClient, setSelectedClient] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [dataToEdit, setDataToEdit] = useState(null);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState({ data: [{ funcionario: [], cliente: [], livros: [] }] });

  const [data, setData] = useState({ total: 1, data: [] });
  const servicePath = 'clientes'
  const servicePathOrders = 'pedidos'

  const showModal = () => {
    props.setNotification({ erro: false, message: "" })
    setOpen(true);
  };

  const showModalDetail = (id) => {
    props.setNotification({ erro: false, message: "" })
    let select = data.data.filter((client) => client.id == id)
    select = select[0]
    setSelectedClient(select)
    setOpenDetail(true);
  };

  const edit = (id) => {
    setOpen(true)
    setOpenDetail(false)
    let select = data.data.filter((client) => {
    //  console.log(data.data)
    //  console.log(client.id, id)
      return client.id == id
    })
    setDataToEdit(select[0])
  }

  const searchByName = async (value, _e, info) => {
    setSearchName(value)
    props.setIsLoading(true)
    try {
      setPage(1);
      let search = await getItemByName(value, 1, servicePath);
      setData(search)
    } catch (erro) {
      // setData([])
      props.setNotification({ erro: true, message: "Erro ao pesquisar '" + value + "'" })
    }
    props.setIsLoading(false)
  }

  const del = async (id, nome) => {
    try {
      await deleteItem(id, servicePath)
      let message = "Sucesso ao deletar o livro '" + nome + "'"
      props.setNotification({ erro: false, message: message })

      getPaginateItems(page, servicePath).then((data) => {
        setData(data);
      }).catch(() => {
        props.setNotification({ erro: true, message: "Erro ao buscar livros" })
      })

      props.setNotification({ erro: false, message: message })
    } catch (error) {
      let message = "Erro ao deletar o livro '" + nome + "'"
      if (nome == undefined || nome == null || nome == "") {
        message = "Erro ao deletar o livro"
      }
      props.setNotification({ erro: true, message: message })
    }
  }

  const viewOrders = (id) => {
    setOpenOrders(true)
    getOrdersByClientPaginate(id, pageOrders.page, servicePathOrders).then((data) => {
      setOrders(data)
    })
    //console.log("DADOS")
    //console.log(str)

    //setOrders(str)
  }

  function onChangePaginateOrders(id, page, pageSize) {
    setPageOrders({ page, pageSize })
    getOrdersByClientPaginate(id, page, servicePathOrders).then((data) => {
      setOrders(data)
    }).catch(() => {

      props.setNotification({ erro: true, message: "Erro ao buscar pedidos" })
    })

  }


  useEffect(() => {
    props.setIsLoading(true)
    getPaginateItems(page, servicePath).then((data) => {
      setData(data)
    }).catch(() => {

      props.setNotification({ erro: true, message: "Erro ao buscar clientes" })
    })

    props.setIsLoading(false)
  }, [])

 // console.log("DATA: ", data)

  const dataShow = data.data.map((client) => {
    return {
      key: client.id,
      id: client.id,
      name: client.nome,
      cpf: client.cpf,
      flamengo: client.is_flamengo ? "Sim" : "Não",
      onepiece: client.watch_onepiece ? "Sim" : "Não",
    }
  })

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => React.createElement('a', { onClick: () => { showModalDetail(record.id) } }, text),

    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
    },
    {
      title: 'Flamengista',
      dataIndex: 'flamengo',
      key: 'flamengo',
    },
    {
      title: 'One Piece',
      dataIndex: 'onepiece',
      key: 'onepiece',
    },
    {
      title: 'Pedidos',
      key: 'action',
      render: (_, record) => (
        React.createElement(
          Space,
          { size: 'middle' },
          React.createElement(Button, { type: "primary", icon: React.createElement(ShoppingCartOutlined), onClick: () => { viewOrders(record.id) } }, "Ver Pedidos Realizados"),
        )
      ),
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_, record) => (
        React.createElement(
          Space,
          { size: 'middle' },
          React.createElement(Button, { type: "primary", icon: React.createElement(EditFilled), onClick: () => { edit(record.id, record.name) } }),
          React.createElement(Button, { type: "primary", danger: true, icon: React.createElement(DeleteFilled), onClick: () => { del(record.id, record.name) } }),
        )
      ),
    },
  ];

 // console.log("PAGINAÇÃO DOS PEDIDOS: ", pageOrders.page, pageOrders.pageSize)
 // console.log(orders)

  return (
    <div className={styles['page']}>
      <div className={styles['conaiter-form']}>
        <Search placeholder="Digite o nome do cliente" enterButton onSearch={searchByName} />
        {/* <Search placeholder="input search loading with enterButton" loading enterButton /> */}
        <Button className={styles['button-create-book']} type="primary" onClick={showModal}>Novo Cliente</Button>
        <ModalEditCreateClient page={page} setData={setData} open={open} setOpen={setOpen} setNotification={props.setNotification} setDataToEdit={setDataToEdit} dataToEdit={dataToEdit} />
        <ModalDetailClient selectedClient={selectedClient} setOpenDetail={setOpenDetail} openDetail={openDetail} edit={edit} del={del} />
        <ModalViewOrders orders={orders} openOrders={openOrders} setOpenOrders={setOpenOrders} onChangePaginateOrders={onChangePaginateOrders} page={pageOrders.page} pageSize={pageOrders.pageSize} />
      </div>
      <div className={styles['table-container']}>
        <Table
          dataSource={dataShow}
          columns={columns}
          pagination={{
            total: data.total,
            showSizeChanger: false,
            onChange: (page, pageSize) => {
              // fetchRecords(page, pageSize);
              setPage(page)
              if (searchName == "") {
                getPaginateItems(page, servicePath).then((data) => {
                  setData(data);
                }).catch(() => {

                  props.setNotification({ erro: true, message: "Erro ao buscar clientes" })
                })
              } else {
                searchByName(searchName, page).then((data) => {
                  setData(data);
                }).catch(() => {

                  props.setNotification({ erro: true, message: "Erro ao buscar clientes" })
                })
              }
            }
          }} />
      </div>
    </div>
  );
}

export default ClientsPage;
