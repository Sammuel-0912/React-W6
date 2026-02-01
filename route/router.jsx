import { createHashRouter } from "react-router-dom";

import NotFound from '../views/NotFound';
import Products from '../views/Products';
import Layout from "../layout/Layout";
import Checkout from "../views/Checkout";
import Login from "../views/Login";

const router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Checkout />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'admin/products',
                element: <Products />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />
    },
]);

export default router; 