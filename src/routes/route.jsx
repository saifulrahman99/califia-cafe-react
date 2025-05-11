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
import Login from "@pages/Authentication/Login.jsx";
import Dashboard from "@pages/Admin/Dashboard/Dashboard.jsx";
import AdminLayout from "@/layout/AdminLayout.jsx";
import MenuList from "@pages/Admin/Menu/components/MenuList.jsx";
import Discount from "@pages/Admin/Discount/Discount.jsx";
import Category from "@pages/Admin/Category/Category.jsx";
import Topping from "@pages/Admin/Topping/Topping.jsx";
import Transaction from "@pages/Admin/Transaction/Transaction.jsx";
import StoreProfile from "@pages/Admin/Setting/StoreProfile.jsx";
import Operational from "@pages/Admin/Setting/Operational.jsx";
import Account from "@pages/Admin/Account/Account.jsx";
import ProtectedRoute from "@/routes/ProtectedRoute.jsx";
import Menu from "@pages/Admin/Menu/Menu.jsx";
import MenuDetailList from "@pages/Admin/Menu/components/MenuDetailList.jsx";
import MenuForm from "@pages/Admin/Menu/components/MenuForm.jsx";
import CategoryList from "@pages/Admin/Category/components/CategoryList.jsx";
import CategoryForm from "@pages/Admin/Category/components/CategoryForm.jsx";
import DiscountList from "@pages/Admin/Discount/components/DiscountList.jsx";
import DiscountForm from "@pages/Admin/Discount/components/DiscountForm.jsx";
import ToppingList from "@pages/Admin/Topping/components/ToppingList.jsx";
import ToppingForm from "@pages/Admin/Topping/components/ToppingForm.jsx";

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
            element: (
                <ProtectedRoute>
                    <AdminLayout/>
                </ProtectedRoute>
            ),
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
                            element: <Menu/>,
                            children: [
                                {
                                    index: true,
                                    element: <MenuList/>,
                                },
                                {
                                    path: "detail/:id",
                                    element: <MenuDetailList/>,
                                },
                                {
                                    path: "add-menu",
                                    element: <MenuForm/>
                                },
                                {
                                    path: "update-menu/:id",
                                    element: <MenuForm/>
                                }
                            ]
                        },
                        {
                            path: "categories",
                            element: <Category/>,
                            children: [
                                {
                                    index: true,
                                    element: <CategoryList/>,
                                },
                                {
                                    path: "add-category",
                                    element: <CategoryForm/>
                                },
                                {
                                    path: "update-category/:id",
                                    element: <CategoryForm/>
                                }
                            ]
                        },
                        {
                            path: "discounts",
                            element: <Discount/>,
                            children: [
                                {
                                    index: true,
                                    element: <DiscountList/>,
                                },
                                {
                                    path: "add-discount",
                                    element: <DiscountForm/>
                                },
                                {
                                    path: "update-discount/:id",
                                    element: <DiscountForm/>
                                },
                            ]
                        }
                    ]
                },
                {
                    path: "toppings",
                    element: <Topping/>,
                    children: [
                        {
                            index: true,
                            element: <ToppingList/>
                        },
                        {
                            path: "add-topping",
                            element: <ToppingForm/>
                        },
                        {
                            path: "update-topping/:id",
                            element: <ToppingForm/>
                        }
                    ]
                },
                {
                    path: "transactions",
                    element: <Transaction/>
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
