import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Layouts.css"
const { Header, Content } = Layout;

const Layouts = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("HOME");
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = props.menuItems;
  console.log("headerTitle", headerTitle)
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = menuItems.find(item => item.path === currentPath);
    setHeaderTitle(matchedItem ? matchedItem.title : "HOME");
  }, [location, menuItems]);

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  return (
    <Layout className="site-layout" style={{ minHeight: '100vh' }}>
      <Header className="site-header">
        <div className="header-left">
          <span className="header-title">{headerTitle !== "HOME" ? headerTitle : 'EA Operation Portal'}</span>
        </div>
        <div className="header-right">
          <Menu
            className="header-menu"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.title,
              onClick: () => navigate(item.path)
            }))}
          />
        </div>
      </Header>
      <Content>
        {props.children}
      </Content>
    </Layout>
  );
};

export default Layouts;
