import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Select, Space, Spin, Table, Tag, message } from 'antd';
import Search from 'antd/es/input/Search';
import {
  EditFilled,
  DeleteFilled

} from '@ant-design/icons';
import styles from './styles/bookpage.module.css'
import ModalEditCreateBook from '../components/booksPage/modalEditCreateBook';
import { deleteItem, getItemByName, getPaginateItems } from '../utils/crudOperations';
import ModalDetailBook from '../components/booksPage/modalDetailBook';
import { getPaginateBooksFilter } from '../utils/books';

const BooksPage = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [data, setData] = useState({ total: 0, data: [] });
  const [searchName, setSearchName] = useState("");
  const [genero, setGenero] = useState("");
  const [preco_max, setPreco_max] = useState("");
  const [preco_min, SetPreco_min] = useState("");
  const [dataToEdit, setDataToEdit] = useState(null);
  const [page, setPage] = useState(1);
  const servicePath = 'livros'



  const showModal = () => {
    props.setNotification({ erro: false, message: "" })
    setOpen(true);
  };

  const showModalDetail = (id) => {
    console.log("SHOW")
    props.setNotification({ erro: false, message: "" })
    let select = data.data.filter((book) => book.id == id)
    select = select[0]
    console.log("SELECTED: ", select)
    setSelectedBook(select)
    setOpenDetail(true);
  };

  const edit = (id) => {
    setOpen(true)
    let seletedBook = data.data.filter((book) => book.id === id)
    setOpenDetail(false)
    setDataToEdit(seletedBook[0])
  }

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

  const del = async (id, nome) => {
    setOpenDetail(false)
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

  const onChangeGenero = (event) => {
    setGenero(event.target.value)
  }

  const onChangeMaxValue = (event) => {
    setPreco_max(event.target.value)
  }

  const onChangeMinValue = (event) => {
    SetPreco_min(event.target.value)
  }

  const filtrar = () => {
    console.log("genero ", genero)
    console.log("min ", preco_min)
    console.log("max ", preco_max)

    getPaginateBooksFilter(page, genero, preco_max, preco_min).then((data) => {
      setData(data)
    }).catch((error) => {
      console.log(error)
      props.setNotification({ erro: true, message: "Erro ao filtrar livros" })

    })
  }

  useEffect(() => {
    props.setIsLoading(true)

    getPaginateItems(page, servicePath).then((data) => {
      console.log("DADOS: ", data)
      setData(data);
    }).catch((error) => {
      console.log(error)
      props.setNotification({ erro: true, message: "Erro ao buscar livros" })
    })

    props.setIsLoading(false)
  }, [])

  console.log(dataToEdit)

  console.log("DADOS: ", data)

  const dataShow = data.data.map((book) => {
    return {
      key: book.id,
      id: book.id,
      name: book.nome,
      author: book.autor,
      edition: book.edicao,
      date: book.data_lancamento,
      isbn: book.isbn,
      tags: [book.genero],
      price: `R$ ${book.preco}`,
      stock: book.estoque.quantidade,
      date: book.data_lancamento,
    }
  })

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => React.createElement('a', { onClick: () => { showModalDetail(record.id) } }, text),
      //render: (text, record) => React.createElement('a', { onClick: () => { console.log(record, text) } }, text),

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
      title: 'Lançamento',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
    },

    {
      title: 'Genêros',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        React.createElement(
          React.Fragment,
          null,
          tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              React.createElement(Tag, { color: color, key: tag }, tag.toUpperCase())
            );
          })
        )
      ),
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Estoque',
      dataIndex: 'stock',
      key: 'stock',
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
      <div className={styles['conaiter-form']} >
        <Search placeholder="Digite o nome do livro" style={{ width: '50%' }} enterButton onSearch={searchByName} />
        {/* <Search placeholder="input search loading with enterButton" loading enterButton /> */}
        <Button className={styles['button-create-book']} type="primary" onClick={showModal}>Novo Livro</Button>
        <Input placeholder="Genêro" style={{ width: '20%', marginLeft: "1vw" }} onKeyUp={onChangeGenero} />
        <InputNumber placeholder="Preço minino" style={{ width: '20%', marginLeft: "1vw" }} onKeyUp={onChangeMinValue} />
        <InputNumber placeholder="preço máximo" style={{ width: '20%', marginLeft: "1vw" }} onKeyUp={onChangeMaxValue} />
        <Button className={styles['button-create-book']} type="primary" onClick={filtrar}>Filtrar</Button>
        <ModalEditCreateBook page={page} setData={setData} open={open} setOpen={setOpen} setNotification={props.setNotification} setDataToEdit={setDataToEdit} dataToEdit={dataToEdit} />
        <ModalDetailBook selectedBook={selectedBook} setOpenDetail={setOpenDetail} openDetail={openDetail} edit={edit} del={del} />
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

                  props.setNotification({ erro: true, message: "Erro ao buscar livros" })
                })
              } else {
                searchByName(searchName, page).then((data) => {
                  setData(data);
                }).catch(() => {

                  props.setNotification({ erro: true, message: "Erro ao buscar livros" })
                })
              }
            }
          }} />
      </div>
    </div>
  );
}

export default BooksPage;
