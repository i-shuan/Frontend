// src/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getLevelValue } from './Enum/UserProfileEnums'
const ProtectedRoute = ({ component: Component, requiredLevel, ...rest }) => {
    const { simulatedLevel } = useSelector((state) => state.userProfile);

    return (
        <Route
            {...rest}
            render={props =>
                getLevelValue(simulatedLevel) >= requiredLevel ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/no-access" />
                )
            }
        />
    );
};

export default ProtectedRoute;
