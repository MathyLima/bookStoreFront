import './App.css';
import { useState } from "react";
import {
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  BookFilled,
  ShopFilled,
  
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import {
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

import BooksPage from './pages/booksPage';
import Loading from './components/ui/loading';
import Notification from './components/ui/notification';
import EmployeePage from './pages/employeesPage';
import ClientsPage from './pages/clientsPage';
import OrdersPage from './pages/ordersPage';
import DashboardPage from './pages/dashboardPage';
import PublishingCompanyPage from './pages/publishingCompanyPage';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({error: false, message: ""});
  const [keypage, setKeyPage] = useState('0');
  
  let navigate = useNavigate();

  const { Header, Content, Footer, Sider } = Layout;

  const items = [
    getItem('Dashboard', '1', <PieChartOutlined />),
    getItem('Livros', '2', <BookFilled />),
    getItem('Clientes', '3', < TeamOutlined/>),
    getItem('Funcionários', '4', < TeamOutlined/>),
    getItem('Vendas', '5', < ShopFilled/>),
    getItem('Editoras', '6', < ShopFilled/>),
  ];

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function getItem(
    label,
    key,
    icon,
    children,
  ) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  
  const redirectToLink = (event) => {
    const routes = {
      1: '/',
      2: "/Livros",
      3: "/Clientes",
      4: "/Funcionários",
      5: "/Vendas",
      6: "/Editoras"
    }

    navigate(routes[event.key])
  }

  return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={redirectToLink} />
        </Sider>
        <Layout>
          {/* <Header style={{ padding: 0, background: colorBgContainer }} >
            
          </Header> */}
          <Content style={{ margin: '0 16px' }}>
            <Routes>
              <Route path="/" element={<DashboardPage setIsLoading={setIsLoading} isLoading={isLoading} setNotification={setNotification} notification={notification}/>}/>
              <Route path="Livros" element={<BooksPage setIsLoading={setIsLoading} isLoading={isLoading} setNotification={setNotification} notification={notification}/>} />
              <Route path="Funcionários" element={<EmployeePage setIsLoading={setIsLoading} isLoading={isLoading} setNotification={setNotification} notification={notification}/>} />
              <Route path="Clientes" element={<ClientsPage setIsLoading={setIsLoading} isLoading={isLoading} setNotification={setNotification} notification={notification}/>} />
              <Route path="Vendas" element={<OrdersPage setIsLoading={setIsLoading} isLoading={isLoading} setNotification={setNotification} notification={notification}/>} />
              <Route path="Editoras" element={<PublishingCompanyPage setIsLoading={setIsLoading} isLoading={isLoading} setNotification={setNotification} notification={notification}/>} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}> </Footer>
        </Layout>
      {isLoading && <Loading/>} 
      {notification.message != '' && <Notification notification={notification} setNotification={setNotification}/>} 

      </Layout>
  )

}

export default App;
