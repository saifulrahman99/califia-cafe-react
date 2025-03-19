import {createContext, useState} from "react";
import PropTypes from "prop-types";
import {Flip, toast} from "react-toastify";

export const MyContext = createContext();

export const MyProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);

    const addToCart = (menuId, name, price, qty, note = null, toppings = []) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item =>
                    item.id === menuId &&
                    JSON.stringify(item.toppings) === JSON.stringify(toppings) &&
                    item.note === note // Perbedaan di note juga diperhitungkan
            );

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === menuId &&
                    JSON.stringify(item.toppings) === JSON.stringify(toppings) &&
                    item.note === note
                        ? {...item, qty: item.qty + qty}
                        : item
                );
            }
            return [...prevCart, {id: menuId, name, qty, price, toppings, note}];
        });
    };

    const updateMenuQty = (cartId, newQty) => {
        setCart(prevCart =>
            prevCart
                .map(item =>
                    item.id === cartId
                        ? {...item, qty: newQty}
                        : item
                )
                .filter(item => item.qty > 0) // Hapus menu jika qty 0
        );
    };
    //  Update note dari menu dalam cart
    const updateNote = (menuId, newNote) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === menuId ? {...item, note: newNote} : item
            )
        );
    };

    const updateToppingQty = (cartId, toppingId, newQty) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === cartId
                    ? {
                        ...item,
                        toppings: item.toppings
                            .map(topping =>
                                topping.id === toppingId ? {...topping, qty: newQty} : topping
                            )
                            .filter(topping => topping.qty > 0) // Hapus topping dengan qty 0
                    }
                    : item
            )
        );
    };

    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== cartId));
    };

    const showToast = (type, message, duration) => {
        const options = {
            position: "top-center",
            autoClose: duration,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            closeButton: false,
            theme: "light",
            transition: Flip,
        }
        switch (type) {
            case "success":
                toast.success(message, options);
                break;
            case "error":
                toast.error(message, options);
                break;
            case "warning":
                toast.warning(message, options);
                break;
            default:
                toast.info(message, options);
                break;
        }
    }

    return (
        <MyContext.Provider value={{
            isLoading,
            setIsLoading,
            cart,
            setCart,
            addToCart,
            updateToppingQty,
            removeFromCart,
            updateMenuQty,
            updateNote,
            showToast
        }}>
            {children}
        </MyContext.Provider>
    );
};

MyProvider.propTypes = {
    children: PropTypes.node.isRequired,
};