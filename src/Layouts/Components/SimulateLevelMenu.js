// src/Layouts/Components/SimulateLevelMenu.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown, Button } from 'antd';
import { setSimulatedLevel } from '../../store/userProfile-action';
import { levelKeys } from '../../Enum/UserProfileEnums';
import { useNavigate } from 'react-router-dom';

const SimulateLevelMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const defaultUserLevel = useSelector(state => state.userProfile.defaultUserLevel);
    const simulatedLevel = useSelector(state => state.userProfile.simulatedLevel);

    const handleMenuClick = (e) => {
        dispatch(setSimulatedLevel(e.key));
        navigate("/")
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            {Object.values(levelKeys).map(level => (
                <Menu.Item key={level}>{level}</Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div>
            {defaultUserLevel === levelKeys.S && (
                <Dropdown overlay={menu}>
                    <Button>
                        模擬為 {simulatedLevel || "選擇級別"}
                    </Button>
                </Dropdown>
            )}
        </div>
    );
};

export default SimulateLevelMenu;
