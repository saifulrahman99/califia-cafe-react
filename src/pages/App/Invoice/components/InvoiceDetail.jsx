import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useParams} from "react-router-dom";
import BillService from "@services/billService.js";
import {MyContext} from "@/MyContext.jsx";

const InvoiceDetail = () => {
    const {id} = useParams();
    const billService = useMemo(BillService, []);
    const [invoice, setInvoice] = useState({});
    const {isLoading, setIsLoading} = useContext(MyContext);
    useEffect(() => {
        setIsLoading(!isLoading);
        const getInvoice = async () => {
            return await billService.getById(id);
        }
        getInvoice().then((response) => {
            setInvoice(response.data);
            console.log(response.data);
            setIsLoading(false);
        });
    }, [billService])
    return (
        <>
            {
                isLoading ? <>Loading...</> :
                    <>
                        <div>
                            <header>{invoice.invoice_no}</header>
                        </div>
                    </>
            }
        </>
    );
};

export default InvoiceDetail;