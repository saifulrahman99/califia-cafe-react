import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './output.css';
import {RouterProvider} from "react-router-dom";
import router from "@/routes/route";
import {MyProvider} from "@/MyContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MyProvider>
            <RouterProvider router={router}/>
        </MyProvider>
    </StrictMode>
)
