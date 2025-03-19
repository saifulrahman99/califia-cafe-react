import {MyContext} from "@/MyContext.jsx";
import {useContext} from "react";

const Cart = () => {
    const {cart} = useContext(MyContext);

    return (
        <div>
            {
                cart.map((item) => (
                    <div key={item.id}>{item.id}</div>
                ))
            }
        </div>
    );
};

export default Cart;