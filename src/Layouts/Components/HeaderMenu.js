// src/Layouts/Components/HeaderMenu.js
import React from 'react';
import { Menu } from 'antd';

import { useHistory } from 'react-router-dom';
const HeaderMenu = ({ menuItems }) => {
    const history = useHistory();

    return (
        <Menu
            className="header-menu"
            mode="horizontal"
            defaultSelectedKeys={['0']}
            items={menuItems.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: item.title,
                onClick: () => history.push(item.path),
            }))}
        />
    );
};

export default HeaderMenu;
