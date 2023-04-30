import React, { useState, useEffect } from 'react';
import { Drawer, Button, Layout, Menu, Avatar } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

import './Layouts.css';

const { Header, Content } = Layout;

const Layouts = (props) => {
  const menuItems = props.menuItems;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const [isOpen, setIsOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("HOME");
  const navigate = useNavigate();
  const location = useLocation();

  const showDrawer = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleMenuClick = (e) => {

    const findItems = menuItems.find((obj) => obj.key === e.key);
    setHeaderTitle(findItems);
    navigate(findItems?.path);

  };

  useEffect(() => {

    const currentPath = location.pathname;
    const findItems = menuItems.find((obj) => obj.path === currentPath);
    setHeaderTitle(findItems);

  }, [location.pathname, menuItems]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="site-header">
        <div className="menu-icon" onClick={showDrawer}>
          <MenuOutlined />
          <span>{headerTitle.title!=="HOME" ? headerTitle.title : 'EA Operation Portal'}</span>
        </div>
      </Header>
      <Drawer placement="left" closable={false} onClose={onClose} open={isOpen} className="drawer">
        <div className="sider-top">
          <div className="user-info">
            <div>
              <Avatar className="user-avatar" size={48} icon={<UserOutlined />} />
              <div className="user-name">Hi, Ann</div>
            </div>
          </div>
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={['0']} style={{ height: windowHeight - 151 }}>
          {menuItems.map((item, index) => {
            if (index === 0 || item.group !== menuItems[index - 1].group) {
              return (
                <Menu.ItemGroup key={item.group} title={item.group}>
                  <Menu.Item key={item.key} icon={item.icon} onClick={handleMenuClick}>
                    {item.title}
                  </Menu.Item>
                </Menu.ItemGroup>
              );
            } else {
              return (
                <Menu.Item key={item.key} icon={item.icon} onClick={handleMenuClick}>
                  {item.title}
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </Drawer>
      <Layout>
        <Content>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default Layouts;
