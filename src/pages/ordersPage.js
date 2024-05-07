import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Spin, Table, Tag, message } from 'antd';
import Search from 'antd/es/input/Search';
import {
  EditFilled,
  DeleteFilled

} from '@ant-design/icons';
import styles from './styles/bookpage.module.css'
import { deleteItem, getItemById, getItemByName, getPaginateItems } from '../utils/crudOperations';
import ModalDetailOrder from '../components/orderPage/modalDetailOrder';
import ModalEditCreateOrder from '../components/orderPage/modalEditCreateOrder';


const OrdersPage = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [data, setData] = useState({total: 1, data: []});
  const [searchId, setSearchId] = useState("");
  const [dataToEdit, setDataToEdit] = useState(null);
  const [page, setPage] = useState(1);
  const servicePath = 'pedidos'


  const showModal = () => {
    props.setNotification({ erro: false, message: "" })
    setOpen(true);
  };

  const showModalDetail = (id) => {
    props.setNotification({ erro: false, message: "" })
    let select = data.data.filter((pedido) => pedido.id == id)
    select = select[0]
    console.log(select)
    setSelectedOrder(select)
    setOpenDetail(true);
    console.log(openDetail)
  };

  const edit = (id) => {
    setOpen(true)
    let order = data.data.filter((pedido) => pedido.id === id)
    console.log("PEDIDO: ", order)
    setOpenDetail(false)
    setDataToEdit(order[0])
  }

  const searchById = async (value, _e, info) => {
    setSearchId(value)
    props.setIsLoading(true)
    try {
      setPage(1);
      let search = await getItemById(value, servicePath);
      setData({total: 1, data: [search]})
    } catch (erro) {
      // setData([])
      console.log(erro)
      props.setNotification({ erro: true, message: "Erro ao pesquisar '" + value + "'" })
    }
    props.setIsLoading(false)
  }

  const del = async (id, nome) => {
    setOpenDetail(false)
    try {
      await deleteItem(id, servicePath)
      let message = "Sucesso ao deletar a venda '" + nome + "'"
      props.setNotification({ erro: false, message: message })

      getPaginateItems(page, servicePath).then((data) => {
        setData(data);
      }).catch(() => {
        props.setNotification({ erro: true, message: "Erro ao buscar as vendas" })
      })

      props.setNotification({ erro: false, message: message })
    } catch (error) {
      let message = "Erro ao deletar a venda '" + nome + "'"
      if (nome == undefined || nome == null || nome == "") {
        message = "Erro ao deletar a venda"
      }
      props.setNotification({ erro: true, message: message })
    }


  }

  useEffect(() => {
    props.setIsLoading(true)

    getPaginateItems(page, servicePath).then((data) => {
      console.log("DADOS: ", data)
      setData(data);
    }).catch(() => {

      props.setNotification({ erro: true, message: "Erro ao buscar as vendas" })
    })

    props.setIsLoading(false)
  }, [])


  const dataShow = data.data.map((pedido) => {
    let total = 0;
    pedido.livros.forEach((livro) => {
      total+= Number(livro.preco)
    })

    return {
      key: pedido.id,
      id: pedido.id,
      nameClient: pedido.cliente.nome,
      cpf: pedido.cliente.cpf,
      nameEmployee: pedido.vendedor.nome,
      total: `R$ ${total}`
    }
  })

  const columns = [
    {
      title: 'Nº Da Compra',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => React.createElement('a', { onClick: () => { showModalDetail(record.id) } }, text),

    },
    {
      title: 'Cliente',
      dataIndex: 'nameClient',
      key: 'nameClient',
    },   
    {
      title: 'CPF Do Cliente',
      dataIndex: 'cpf',
      key: 'cpf',
    },
    {
      title: 'Funcioário',
      dataIndex: 'nameEmployee',
      key: 'nameEmployee',
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_, record) => (
        React.createElement(
          Space,
          { size: 'middle' },
          //React.createElement(Button, { type: "primary", icon: React.createElement(EditFilled), onClick: () => { edit(record.id, record.name) } }),
          React.createElement(Button, { type: "primary", danger: true, icon: React.createElement(DeleteFilled), onClick: () => { del(record.id, record.name) } }),
        )
      ),
    },
  ];

  return (
    <div className={styles['page']}>
      <div className={styles['conaiter-form']}>
        <Search placeholder="Digite o número do pedido" enterButton onSearch={searchById}/>
        {/* <Search placeholder="input search loading with enterButton" loading enterButton /> */}
        <Button className={styles['button-create-book']} type="primary" onClick={showModal}>Novo Pedido</Button>
        <ModalEditCreateOrder page={page} setData={setData} open={open} setOpen={setOpen} setNotification={props.setNotification} setDataToEdit={setDataToEdit} dataToEdit={dataToEdit}/>
        <ModalDetailOrder selectedOrder={selectedOrder} setOpenDetail={setOpenDetail} openDetail={openDetail}  edit={edit} del={del}/>
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
              if (searchId == "") {
                getPaginateItems(page, servicePath).then((data) => {
                  setData(data);
                }).catch(() => {

                  props.setNotification({ erro: true, message: "Erro ao buscar as vendas" })
                })
              } else {
                searchById(searchId, page).then((data) => {
                  setData(data);
                }).catch(() => {

                  props.setNotification({ erro: true, message: "Erro ao buscar as vendas" })
                })
              }
            }
          }} />
      </div>
    </div>
  );
}

export default OrdersPage;
