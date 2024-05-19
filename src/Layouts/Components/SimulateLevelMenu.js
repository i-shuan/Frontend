// src/Layouts/Components/SimulateLevelMenu.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown, Button } from 'antd';
import { setSimulatedLevel } from '../../store/userProfile-action';
import { levelKeys } from '../../Enum/UserProfileEnums';
import { useHistory } from 'react-router-dom';

const SimulateLevelMenu = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const defaultUserLevel = useSelector(state => state.userProfile.defaultUserLevel);
    const simulatedLevel = useSelector(state => state.userProfile.simulatedLevel);

    const handleMenuClick = (e) => {
        dispatch(setSimulatedLevel(e.key));
        history.push("/");
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
                        模拟为 {simulatedLevel || "选择级别"}
                    </Button>
                </Dropdown>
            )}
        </div>
    );
};

export default SimulateLevelMenu;
