import React, { useState, useEffect } from 'react';
import { Layout, FloatButton, Modal } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderMenu from './Components/HeaderMenu';
import SimulateLevelMenu from './Components/SimulateLevelMenu';
import "./Layouts.css";

const { Header, Content, Footer } = Layout;

const Layouts = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("HOME");

  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = props.menuItems;

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = menuItems.find(item => item.path === currentPath);
    setHeaderTitle(matchedItem ? matchedItem.title : "HOME");
  }, [location, menuItems]);

  const handleFaqModalOpen = () => {
    setIsOpen(true);
  };

  const handleFaqModalClose = () => {
    setIsOpen(false);
  };

  return (
    <Layout className="site-layout" style={{ minHeight: '100vh' }}>
      <Header className="site-header">
        <div className="header-left">
          <span className="header-title">{headerTitle !== "HOME" ? headerTitle : 'EA Operation Portal'}</span>
        </div>
        <div className="header-right">
          <HeaderMenu menuItems={menuItems} />
          <SimulateLevelMenu />
        </div>
      </Header>
      <Content>
        {props.children}
        <Modal
          title="FAQ"
          open={isOpen}
          onCancel={handleFaqModalClose}
          footer={null}
        >
          <h3>Frequently Asked Questions</h3>
          <ul>
            <li>Q1: What is this portal?</li>
            <li>A1: This is the EA Operation Portal.</li>
            <li>Q2: How do I navigate?</li>
            <li>A2: Use the menu at the top to navigate between sections.</li>
            {/* Add more FAQs as needed */}
          </ul>
        </Modal>
      </Content>
      <Footer className='layout-footer-container'>
        <FloatButton
          icon={<FileTextOutlined />}
          description="HELP INFO"
          shape="square"
          onClick={handleFaqModalOpen}
        />
      </Footer>
    </Layout>
  );
};

export default Layouts;
