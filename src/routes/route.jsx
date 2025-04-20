import {createBrowserRouter, Navigate} from "react-router-dom";
import Home from "@pages/App/Home/Home.jsx";
import NotFound from "@shared/components/Error/NotFound.jsx";
import AppLayout from "@/layout/AppLayout.jsx";
import Search from "@pages/App/Search/Search.jsx";
import MenuDetail from "@pages/App/Detail/MenuDetail.jsx";
import CreateBill from "@pages/App/Cart/components/CreateBill.jsx";
import CartList from "@pages/App/Cart/components/CartList.jsx";
import BillStatus from "@pages/App/Cart/components/BillStatus.jsx";
import Cart from "@pages/App/Cart/Cart.jsx";
import Invoice from "@pages/App/Invoice/Invoice.jsx";
import InvoiceList from "@pages/App/Invoice/components/InvoiceList.jsx";
import InvoiceDetail from "@pages/App/Invoice/components/InvoiceDetail.jsx";
import AboutMe from "@pages/App/AboutMe/AboutMe.jsx";
import Login from "@pages/Admin/Auth/Login.jsx";
import Dashboard from "@pages/Admin/Dashboard/Dashboard.jsx";
import AdminLayout from "@/layout/AdminLayout.jsx";
import MenuList from "@pages/Admin/Menu/MenuList.jsx";
import Discounts from "@pages/Admin/Menu/Discounts.jsx";
import Categories from "@pages/Admin/Menu/Categories.jsx";
import Toppings from "@pages/Admin/Topping/Toppings.jsx";
import Transactions from "@pages/Admin/Transaction/Transactions.jsx";
import StoreProfile from "@pages/Admin/Setting/StoreProfile.jsx";
import Operational from "@pages/Admin/Setting/Operational.jsx";
import Account from "@pages/Admin/Account/Account.jsx";

const router = createBrowserRouter([
        {
            path: "/",
            element: <AppLayout/>,
            children: [{
                index: true, element: <Home/>
            }, {
                path: "search", element: <Search/>
            }, {
                path: "menu/:id", element: <MenuDetail/>
            }, {
                path: "cart",
                element: <Cart/>,
                children: [
                    {index: true, element: <CartList/>},
                    {path: "create-bill", element: <CreateBill/>},
                    {path: "bill-status", element: <BillStatus/>},
                ]
            }, {
                path: "invoice",
                element: <Invoice/>,
                children: [
                    {index: true, element: <InvoiceList/>},
                    {path: "detail/:id", element: <InvoiceDetail/>},
                ]
            },
                {
                    path: "about",
                    element: <AboutMe/>
                },
            ]
        },
        {
            path: "auth/login",
            element: <Login/>
        },
        {
            path: "admin",
            element: <AdminLayout/>,
            children: [
                {
                    index: true,
                    element: <Navigate to="dashboard" replace/>,
                },
                {
                    path: "dashboard",
                    element: <Dashboard/>
                },
                {
                    path: "menu",
                    children: [
                        {
                            index: true,
                            element: <Navigate to="list" replace/>,
                        },
                        {
                            path: "list",
                            element: <MenuList/>
                        },
                        {
                            path: "categories",
                            element: <Categories/>
                        },
                        {
                            path: "discounts",
                            element: <Discounts/>
                        }
                    ]
                },
                {
                    path: "toppings",
                    element: <Toppings/>
                },
                {
                    path: "transactions",
                    element: <Transactions/>
                },
                {
                    path: "settings",
                    children: [
                        {
                            index: true,
                            element: <Navigate to="store-profile" replace/>,
                        },
                        {
                            path: "store-profile",
                            element: <StoreProfile/>
                        }, {
                            path: "operational-store",
                            element: <Operational/>
                        }
                    ]
                },
                {
                    path: "account",
                    element: <Account/>
                }
            ],
        },
        {
            path: "*", element:
                <NotFound/>
        }
    ])
;


export default router;
