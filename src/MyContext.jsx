import {createContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Flip, toast} from "react-toastify";

export const MyContext = createContext();

export const MyProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);

    const addToCart = (menu, toppings = []) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item =>
                    item.menuId === menu.menuId && // Ubah id ke menuId agar id tetap unik
                    JSON.stringify(item.toppings) === JSON.stringify(toppings) &&
                    item.note === menu.note
            );

            if (existingItem) {
                return prevCart.map(item =>
                    item.menuId === menu.menuId &&
                    JSON.stringify(item.toppings) === JSON.stringify(toppings) &&
                    item.note === menu.note
                        ? {...item, qty: item.qty + menu.qty}
                        : item
                );
            }

            // Generate id baru sebagai angka urutan
            const newId = prevCart.length > 0 ? Math.max(...prevCart.map(i => i.id)) + 1 : 1;

            return [...prevCart, {
                id: newId,
                menuId: menu.menuId,
                name: menu.name,
                qty: menu.qty,
                price: menu.price,
                note: menu.note,
                stock: menu.stock,
                type: menu.type,
                toppingEnabled: menu.toppingEnabled,
                toppings
            }];
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
        setTimeout(() => {
            mergeCartItems();
        }, 5000);
    };

    const addDirectToppingToMenu = (cartId, topping) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === cartId
                    ? {
                        ...item,
                        toppings: [
                            ...item.toppings,
                            {
                                ...topping,
                                qty: 1,
                            }
                        ]
                    } : item
            ));

        setTimeout(() => {
            mergeCartItems();
        }, 5000);
    }

    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== cartId));
    };

    const mergeCartItems = () => {
        setCart(prevCart => {
            const itemMap = new Map();

            prevCart.forEach(item => {
                const key = `${item.menuId}-${item.toppings}-${item.note || ''}`;

                if (itemMap.has(key)) {
                    // Jika sudah ada, tambahkan qty
                    itemMap.get(key).qty += item.qty;
                } else {
                    // Jika belum ada, simpan di Map tanpa mengubah cartId
                    itemMap.set(key, {...item});
                }
            });

            return Array.from(itemMap.values());
        });
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
            showToast,
            addDirectToppingToMenu,
            mergeCartItems
        }}>
            {children}
        </MyContext.Provider>
    );
};

MyProvider.propTypes = {
    children: PropTypes.node.isRequired,
};