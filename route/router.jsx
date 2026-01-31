import { createHashRouter } from "react-router-dom";

import Home from '../views/Home';
import NotFound from '../views/NotFound';
import Product from '../views/Products';
import Layout from "../layout/Layout";
import SingleProduct from "../views/SingleProduct";
import Cart from "../views/Cart";

const router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'product',
                element: <Product />
            },
            {
                path: 'product/:id',
                element: <SingleProduct />
            },
            {
                path: 'cart',
                element: <Cart />
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />
    },
]);

export default router; 