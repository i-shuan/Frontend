// src/Layouts/Components/HeaderMenu.js
import React from 'react';
import { Menu } from 'antd';

import { useHistory } from 'react-router-dom';
const HeaderMenu = ({ routes }) => {
    const history = useHistory();

    return (
        <Menu
            className="header-menu"
            mode="horizontal"
            defaultSelectedKeys={['0']}
            items={routes.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: item.title,
                onClick: () => history.push(item.path),
            }))}
        />
    );
};

export default HeaderMenu;
