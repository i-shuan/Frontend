// src/Layouts/Components/HeaderMenu.js
import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const HeaderMenu = ({ menuItems }) => {
    const navigate = useNavigate();

    return (
        <Menu
            className="header-menu"
            mode="horizontal"
            defaultSelectedKeys={['0']}
            items={menuItems.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: item.title,
                onClick: () => navigate(item.path),
            }))}
        />
    );
};

export default HeaderMenu;
