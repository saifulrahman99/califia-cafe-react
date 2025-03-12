import {createBrowserRouter} from "react-router-dom";
import Home from "@pages/App/Home/Home.jsx";
import NotFound from "@shared/components/Error/NotFound.jsx";
import AppLayout from "@/layout/AppLayout.jsx";
import Search from "@pages/App/Search/Search.jsx";

const router = createBrowserRouter([
    {
        path: "*",
        element: <NotFound/>
    },
    {
        path: "/",
        element: <AppLayout/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "/search",
                element: <Search/>
            }
        ]
    },
]);

export default router;
