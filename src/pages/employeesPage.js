import React, { useEffect, useState } from 'react';
import { Button, Space, Table  } from 'antd';
import Search from 'antd/es/input/Search';
import {
  EditFilled,
  DeleteFilled,
  ShoppingCartOutlined

} from '@ant-design/icons';
import styles from './styles/bookpage.module.css'
import { deleteEmployee, getEmployeeByName, getPaginateEmployees } from '../utils/employees';
import { deleteItem, getItemByName, getPaginateItems } from '../utils/crudOperations';

import ModalEditCreateEmployee from '../components/EmployeesPage/modalEditCreateEmployee';
import ModalDetailEmployee from '../components/EmployeesPage/modalDetailEmployee';
import { getOrdersByClientPaginate, getOrdersByEmpoyeesPaginate } from '../utils/orders';
import ModalViewOrders from '../components/ui/modalViewOrders';


const EmployeePage = (props) => {
  const [open, setOpen] = useState(false);
  const [pageOrders, setPageOrders] = useState({ page: 1, pageSize: 10 });
  const [selectedEmpolyee, setSelectedEmployee] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);  
  const [searchName, setSearchName] = useState("");
  const [dataToEdit, setDataToEdit] = useState(null);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState({ data: [{ funcionario: [], cliente: [], livros: [] }] });
  const [data, setData] = useState({total: 1, data: []});
  const servicePath = 'vendedores'
  const servicePathOrders = 'pedidos'

  console.log(data)

  const showModal = () => {
    props.setNotification({ erro: false, message: "" })
    setOpen(true);
  };

  const showModalDetail = (id) => {
    props.setNotification({ erro: false, message: "" })
    let select = data.data.filter((employee) => employee.id == id)
    select = select[0]
    setSelectedEmployee(select)
    setOpenDetail(true);
  };

  const edit = (id) => {
    setOpen(true)
    setOpenDetail(false)
    let select = data.data.filter((employee) => employee.id == id)
    setDataToEdit(select[0])
  }


  const viewOrders = (id) => {
    setOpenOrders(true)
    getOrdersByEmpoyeesPaginate(id,pageOrders.page, servicePathOrders).then((data) => {
      setOrders(data)
      console.log("DADOS", data)
    })
  }

  function onChangePaginateOrders(id, page, pageSize) {
    setPageOrders({ page, pageSize })
    getOrdersByEmpoyeesPaginate(id, page, servicePathOrders).then((data) => {
      setOrders(data)
    }).catch(() => {

      props.setNotification({ erro: true, message: "Erro ao buscar pedidos" })
    })

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

  useEffect(() => {
    props.setIsLoading(true)

    getPaginateItems(page, servicePath).then((data) => {
      setData(data)
    }).catch((error) => {
      console.log(error)
      props.setNotification({ erro: true, message: "Erro ao buscar funcionários" })
    })

    props.setIsLoading(false)
  }, [])


  const dataShow = data.data.map((employee) => {
    return {
      key: employee.id,
      id: employee.id,
      name: employee.nome,
      cpf: employee.cpf,
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
      title: 'Pedidos',
      key: 'action',
      render: (_, record) => (
        React.createElement(
          Space,
          { size: 'middle' },
          React.createElement(Button, { type: "primary", icon: React.createElement(ShoppingCartOutlined), onClick: () => { viewOrders(record.id) } }, "Ver Pedidos Fechados"),
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




  return (
    <div className={styles['page']}>
      <div className={styles['conaiter-form']}>
        <Search placeholder="Digite o nome do funcionário" enterButton onSearch={searchByName} />
        {/* <Search placeholder="input search loading with enterButton" loading enterButton /> */}
        <Button className={styles['button-create-book']} type="primary" onClick={showModal}>Novo Funcinário</Button>
        <ModalEditCreateEmployee page={page} setData={setData} open={open} setOpen={setOpen} setNotification={props.setNotification} setDataToEdit={setDataToEdit} dataToEdit={dataToEdit} />
        <ModalDetailEmployee selectedEmpolyee={selectedEmpolyee} setOpenDetail={setOpenDetail} openDetail={openDetail} edit={edit} del={del}/>
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

                  props.setNotification({ erro: true, message: "Erro ao buscar funcionários" })
                })
              } else {
                searchByName(searchName, page).then((data) => {
                  setData(data);
                }).catch(() => {

                  props.setNotification({ erro: true, message: "Erro ao buscar funcionários" })
                })
              }
            }
          }} />
      </div>
    </div>
  );
}

export default EmployeePage;
