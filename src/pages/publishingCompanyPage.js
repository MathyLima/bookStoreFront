import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space, Spin, Table, Tag, message } from 'antd';
import Search from 'antd/es/input/Search';
import {
  EditFilled,
  DeleteFilled

} from '@ant-design/icons';
import styles from './styles/bookpage.module.css'
import ModalEditCreateBook from '../components/booksPage/modalEditCreateBook';
import { createItem, deleteItem, getItemByName, getPaginateItems } from '../utils/crudOperations';
import ModalDetailBook from '../components/booksPage/modalDetailBook';

const PublishingCompanyPage = (props) => {
  const [data, setData] = useState({ total: 0, data: [] });
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const servicePath = 'editoras'


  const searchByName = async (value, _e, info) => {
    setSearchName(value)
    props.setIsLoading(true)
    try {
      setPage(1);
      let search = await getItemByName(value, 1, servicePath);
      setData(search);
    } catch (erro) {
      // setData([])
      props.setNotification({ erro: true, message: "Erro ao pesquisar '" + value + "'" })
    }
    props.setIsLoading(false)
  }

  const sendData = async (values) => {
    let send = values

    try {

      await createItem(values, servicePath);
      let message = "Sucesso ao criar a editora '" + send['nome'] + "'"
      props.setNotification({ erro: false, message: message })

      getPaginateItems(props.page, servicePath).then((data) => {
        props.setData(data);
      }).catch(() => {

        props.setNotification({ erro: true, message: "Erro ao buscar editoras" })
      })

    } catch (error) {
      let message = "Erro ao criar a esditora '" + send['nome'] + "'"
      if (props.dataToEdit != null && props.dataToEdit != undefined) {
        message = "Erro ao editar a esditora '" + send['nome'] + "'"
      }
      if (send['nome'] == undefined || send['nome'] == null || send['nome'] == "") {
        message = "Erro ao criar a esditora "
      }
      props.setNotification({ erro: true, message: message })
    }
  };

  const del = async (id, nome) => {
    try {
      await deleteItem(id, servicePath)
      let message = "Sucesso ao deletar o livro '" + nome + "'"
      props.setNotification({ erro: false, message: message })

      getPaginateItems(page, servicePath).then((data) => {
        setData(data);
      }).catch(() => {
        props.setNotification({ erro: true, message: "Erro ao buscar editoras" })
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
      console.log("DADOS: ", data)
      setData(data);
    }).catch((error) => {
      console.log(error)
      props.setNotification({ erro: true, message: "Erro ao buscar editoras" })
    })

    props.setIsLoading(false)
  }, [])

  console.log(data)
  const dataShow = data.data.map((editora) => {
    return {
      key: editora.id,
      id: editora.id,
      name: editora.nome,
    }
  })

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    /* {
       title: 'Ações',
       key: 'action',
       render: (_, record) => (
         React.createElement(
           Space,
           { size: 'middle' },
           React.createElement(Button, { type: "primary", danger: true, icon: React.createElement(DeleteFilled), onClick: () => { del(record.id, record.name) } }),
         )
       ),
     },*/
  ];

  return (
    <div className={styles['page']}>
      <div className={styles['conaiter-form']}>
      </div>
      <div className={styles['table-container']}>
        <div className={styles['form-container']}>
          <Form
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

            <div style={{ display: "flex", width: "70vh", alignItems: "center" }}>
              <Form.Item name="nome" label="Nome" >
                <Input placeholder='Editora' style={{ width: "70vh", marginRight: "1vh" }} />
              </Form.Item>
              <Button type='primary' htmlType='submit'>Criar</Button>

            </div>

          </Form>
        </div>
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

                  props.setNotification({ erro: true, message: "Erro ao buscar editoras" })
                })
              } else {
                searchByName(searchName, page).then((data) => {
                  setData(data);
                }).catch(() => {

                  props.setNotification({ erro: true, message: "Erro ao buscar editoras" })
                })
              }
            }
          }} />
      </div>
    </div>
  );
}

export default PublishingCompanyPage;
