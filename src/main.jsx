import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './output.css';
import {RouterProvider} from "react-router-dom";
import router from "@/routes/route";
import {MyProvider} from "@/context/MyContext.jsx";
import {AuthProvider} from "@/context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MyProvider>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </MyProvider>
    </StrictMode>
)
