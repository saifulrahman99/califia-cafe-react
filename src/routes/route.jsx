import {createBrowserRouter} from "react-router-dom";
import Home from "@pages/App/Home/Home.jsx";
import NotFound from "@shared/components/Error/NotFound.jsx";
import AppLayout from "@/layout/AppLayout.jsx";
import Search from "@pages/App/Search/Search.jsx";
import DetailMenu from "@pages/App/Detail/DetailMenu.jsx";
import CreateBill from "@pages/App/Cart/components/CreateBill.jsx";
import CartList from "@pages/App/Cart/components/CartList.jsx";
import BillStatus from "@pages/App/Cart/components/BillStatus.jsx";
import Cart from "@pages/App/Cart/Cart.jsx";

const router = createBrowserRouter([
        {
            path: "/",
            element: <AppLayout/>,
            children: [
                {index: true, element: <Home/>},
                {path: "search", element: <Search/>},
                {path: "menu/:id", element: <DetailMenu/>},
                {
                    path: "cart",
                    element: <Cart/>,
                    children: [
                        {index: true, element: <CartList/>},
                        {path: "create-bill", element: <CreateBill/>},
                        {path: "bill-status", element: <BillStatus/>},
                    ]
                },
            ]
        },
        {
            path: "*", element:
                <NotFound/>
        } // Pindahkan ke akhir
    ])
;


export default router;
