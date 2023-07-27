import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({
    children,
    redirectPath
}: {
    children: any;
    redirectPath: string;
}) => {
    let access_token = localStorage.getItem('access_token')
    return access_token ? children : <Navigate to={redirectPath} />
}

export default PrivateRoute