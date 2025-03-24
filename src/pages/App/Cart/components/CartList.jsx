import React from 'react';
import {MyContext} from "@/MyContext.jsx";
import {useContext, useState, Fragment, useEffect, useMemo} from "react";
import {Edit3, MinusIcon, NotepadText, PlusIcon, Trash2Icon, Undo2, X} from "lucide-react";
import {Disclosure, Dialog, Transition} from "@headlessui/react";
import {ChevronUp} from "lucide-react";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {calculateOrderTotalPrice} from "@/utils/calculateOrderTotalPrice.js";
import ToppingService from "@services/toppingService.js";
import {Link} from "react-router-dom";
import Ripples from "react-ripples";
import ConfirmationModal from "@shared/components/Modal/ConfirmationModal.jsx";

const CartList = () => {
    const {
        cart,
        removeFromCart,
        updateToppingQty,
        updateNote,
        updateMenuQty,
        isLoading,
        setIsLoading,
        addDirectToppingToMenu,
    } = useContext(MyContext);
    const toppingService = useMemo(() => ToppingService(), []);
    const [toppings, setToppings] = useState([]);
    const [temporaryNote, setTemporaryNote] = useState({});
    const [isOpenNote, setIsOpenNote] = useState(false);
    const [isOpenAddTopping, setIsOpenAddTopping] = useState(false);
    const [addToppings, setAddToppings] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [removeCartFromId, setRemoveCartFromId] = useState(null);
    const handleConfirm = () => {
        removeFromCart(removeCartFromId);
        setIsModalOpen(false);
    };
    const handleTextAreaChange = (e) => {
        setTemporaryNote({
            ...temporaryNote,
            note: e.target.value,
        });
    }
    const handleUpdateNote = () => {
        updateNote(temporaryNote.id, (temporaryNote.note === "") ? null : temporaryNote.note);
        setIsOpenNote(false);
    }
    const handleOpenModalAddTopping = (cartItem) => {
        const type = (cartItem.type !== "beverage") ? ["food", "snack"] : ["beverage"];
        const excludeToppings = cartItem.toppings.map((item) => item.id);
        setCartId(cartItem.id);
        setAddToppings(
            toppings
                .filter((topping) => type.includes(topping.type))
                .filter((topping) => !excludeToppings
                    .includes(topping.id)));
        setIsOpenAddTopping(true);
    }
    const handleAddToppings = (topping) => {
        setAddToppings(
            addToppings.filter((item) => item.id !== topping.id)
        );
        addDirectToppingToMenu(cartId, topping);
    }
    useEffect(() => {
        window.scrollTo({top: 0, behavior: "instant"});
    }, [])
    useEffect(() => {
        if (cart.length > 0) {
            const getToppings = async () => {
                setIsLoading(!isLoading);
                try {
                    const data = await toppingService.getAll();
                    setToppings(data.data);
                } catch (e) {
                    console.log(e.message);
                }
            }
            getToppings().then(() => {
                setIsLoading(false);
            });
        }
    }, [toppingService]);

    return (
        <>
            <div className="pt-15 pb-30 text-slate-700 px-4 select-none">

                <div className="my-3">
                   <span className="flex items-center">
                       <span className="h-px flex-1 bg-slate-700"></span>
                       <span className="shrink-0 px-6  text-xl font-bold">Daftar Pesanan</span>
                       <span className="h-px flex-1 bg-slate-700"></span>
                    </span>
                </div>

                {
                    cart.map((menu) => (
                        <div key={menu.id}>
                            <div className="w-full border-2 border-x-0 border-t-0 border-b-slate-300 py-4">
                                <div className="flex items-center">
                                    <div className="menu-info w-1/2">
                                        <span className="font-bold block">{capitalizeWords(menu.name)}</span>
                                        <div
                                            className="note my-2 flex w-60 text-wrap items-center text-slate-400 font-semibold">
                                            <span className="w-5 me-1">
                                            <NotepadText className="" size={16}/>
                                            </span>
                                            <span
                                                className="text-sm italic flex items-center"> {(menu.note != null && menu.note !== '') ? menu.note : "tidak ada catatan"}</span>
                                            <button onClick={() => {
                                                setIsOpenNote(true)
                                                setTemporaryNote({
                                                    id: menu.id,
                                                    note: menu.note
                                                });
                                            }}
                                                    className="ms-2 text-sky-300 cursor-pointer">
                                                <Edit3 size={20}/>
                                            </button>
                                        </div>
                                        <span
                                            className="font-bold block text-slate-500">{formatRupiah(menu.price)}</span>
                                        <div className="qty mt-2">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => updateMenuQty(menu.id, menu.qty - 1)}
                                                    disabled={menu.qty < 2}
                                                    type="button"
                                                    className={`text-gray-600 transition hover:bg-slate-100 rounded-full p-2 border border-slate-200 ${menu.qty < 2 ? 'cursor-no-drop' : 'cursor-pointer'} active:bg-slate-200`}>
                                                    <MinusIcon strokeWidth={1.5} size={16}/>
                                                </button>

                                                <input
                                                    type="number"
                                                    id="Quantity"
                                                    value={menu.qty}
                                                    min="1"
                                                    className="h-10 w-5 text-slate-500 border-gray-200 mx-2 text-center [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none focus:outline-none cursor-default select-none font-semibold"
                                                    readOnly={true}
                                                />
                                                <button
                                                    onClick={() => updateMenuQty(menu.id, menu.qty + 1)}
                                                    disabled={menu.qty >= menu.stock}
                                                    type="button"
                                                    className={`text-gray-600 transition hover:bg-slate-100 rounded-full p-2 border border-slate-200 ${menu.qty >= menu.stock ? 'cursor-no-drop' : 'cursor-pointer'} active:bg-slate-200`}>
                                                    <PlusIcon strokeWidth={1.5} size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-1/2 text-end">
                                        <div
                                            className="inline-flex overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    setRemoveCartFromId(menu.id)
                                                    setIsModalOpen(true);
                                                }}
                                                className="inline-block p-3 text-gry-700 cursor-pointer hover:bg-gray-50 focus:relative bg-red-100 rounded-full border-red-300 border text-red-400"
                                                title="Delete menu"
                                            >
                                                <Trash2Icon strokeWidth={1} size={20}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {
                                    (menu.toppings.length < 1) ? null :
                                        <div className="detail">
                                            <Disclosure defaultOpen={true}>
                                                {({open}) => (
                                                    <div>
                                                        <Disclosure.Button
                                                            className="flex justify-between w-full cursor-pointer py-1 mt-2 px-1 font-semibold text-slate-500 bg-gray-100 border border-slate-200">
                                                            Toppings
                                                            <ChevronUp
                                                                className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}/>
                                                        </Disclosure.Button>
                                                        <Disclosure.Panel className="px-2 mt-2 text-gray-600">
                                                            {
                                                                menu.toppings.map((topping) => (
                                                                    <div key={topping.id}
                                                                         className="shadow py-1 px-4 mb-2 rounded-lg border border-slate-200 flex justify-between items-center">
                                                                        <div>
                                                                            <span
                                                                                className=" block pt-1 font-semibold text-slate-700">{capitalizeWords(topping.name)}</span>
                                                                            <span
                                                                                className=" block pb-1 font-bold text-slate-500">{formatRupiah(topping.price)}</span>
                                                                        </div>
                                                                        <div className="qty my-1">
                                                                            <div
                                                                                className="flex items-center justify-center gap-1">
                                                                                <button
                                                                                    onClick={() => updateToppingQty(menu.id, topping.id, topping.qty - 1)}
                                                                                    type="button"
                                                                                    className={`text-gray-600 transition hover:bg-slate-100 rounded-full p-2 border border-slate-200 ${'cursor-pointer'} active:bg-slate-200`}>
                                                                                    <MinusIcon strokeWidth={1.5}
                                                                                               size={16}/>
                                                                                </button>

                                                                                <input
                                                                                    type="number"
                                                                                    id="Quantity"
                                                                                    value={topping.qty}
                                                                                    min="1"
                                                                                    className="h-10 w-8 text-slate-500 border-gray-200 mx-2 text-center [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none focus:outline-none cursor-default select-none font-semibold"
                                                                                    readOnly={true}
                                                                                />
                                                                                <button
                                                                                    onClick={() => updateToppingQty(menu.id, topping.id, topping.qty + 1)}
                                                                                    disabled={topping.qty >= topping.stock}
                                                                                    type="button"
                                                                                    className={`text-gray-600 transition hover:bg-slate-100 rounded-full p-2 border border-slate-200 ${topping.qty >= topping.stock ? 'cursor-no-drop' : 'cursor-pointer'} active:bg-slate-200`}>
                                                                                    <PlusIcon strokeWidth={1.5}
                                                                                              size={16}/>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </Disclosure.Panel>
                                                    </div>
                                                )}
                                            </Disclosure>
                                        </div>
                                }
                                {
                                    menu.toppingEnabled === 1 && (
                                        <div
                                            className="pt-4">
                                            <div
                                                className="flex justify-center items-center m-auto">
                                                <button
                                                    onClick={() => handleOpenModalAddTopping(menu)}
                                                    className="font-semibold rounded-lg text-sm cursor-pointer py-1 px-2 flex justify-center items-center border border-slate-200 text-slate-500 bg-slate-100">
                                                    <PlusIcon strokeWidth={1.5}
                                                              size={18}
                                                              className="inline me-1"/>
                                                    <span>Tambah Topping</span>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }

                {
                    cart.length > 0 && (
                        <div className="w-full fixed -bottom-3.5 py-3 left-0">
                            <div
                                className="m-auto w-full max-w-md md:max-w-lg bg-white p-4 pb-3 border border-b-0 border-slate-200 rounded-t-2xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.15)] flex justify-between items-center">
                                <div>
                                    <span className="block text-lg font-semibold -mb-1">Total</span>
                                    <span
                                        className="text-2xl font-bold">{formatRupiah(calculateOrderTotalPrice(cart))}</span>
                                </div>
                                <div>
                                    <Ripples>
                                        <Link to="create-bill">
                                            <button
                                                className="btn-primary bg-primary py-2 px-6 text-lg font-semibold text-white rounded-lg shadow cursor-pointer">Selanjutnya
                                            </button>
                                        </Link>
                                    </Ripples>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>

            {/*KONFIRMASI HAPUS ORDER*/}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                title="Konfirmasi Penghapusan"
                message="Apakah Anda yakin ingin menghapus pesanan ini?"
            />

            {/*MODAL NOTE*/}
            <Transition appear show={isOpenNote} as={Fragment}>
                <Dialog as="div" onClose={() => setIsOpenNote(true)} unmount={false}
                        className="fixed inset-0 flex items-center justify-center z-50 max-w-md md:max-w-lg mx-auto select-none">
                    <Transition.Child
                        as="div"
                        className="absolute inset-0 z-0 bg-black/30 bg-opacity-50"
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    />
                    <Transition.Child
                        as="div"
                        className="w-full px-8 max-w-md md:max-w-lg mx-auto"
                        enter="transition-transform transition-opacity duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition-transform transition-opacity duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white px-4 py-4 rounded-lg shadow-lg relative z-10 w-full">
                            <Dialog.Title className="text-lg font-bold mb-2 text-slate-700 relative">
                                <span className="block">Edit Note</span>
                                <div className="absolute -top-8 -right-8">
                                    <button onClick={() => setIsOpenNote(false)}
                                            className="bg-white shadow text-slate-700 p-2 rounded-full cursor-pointer hover:bg-slate-100">
                                        <X/>
                                    </button>
                                </div>
                            </Dialog.Title>
                            <Dialog.Description
                                as="div"
                                className="text-gray-600 my-2">
                        <textarea
                            onChange={(e) => handleTextAreaChange(e)}
                            defaultValue={temporaryNote.note}
                            className="w-full border border-slate-200 focus:outline-none p-2 rounded-lg">
                        </textarea>
                            </Dialog.Description>
                            <div className="text-end">
                                <button
                                    onClick={handleUpdateNote}
                                    className="bg-primary text-white px-6 py-2 rounded-lg cursor-pointer btn-primary shadow"
                                >Simpan
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>

            {/* MODAL TOPPING */}
            <Transition appear show={isOpenAddTopping} as={Fragment}>
                <Dialog as="div" onClose={() => setIsOpenAddTopping(true)} unmount={false}
                        className="fixed inset-0 flex items-center justify-center z-50 max-w-md md:max-w-lg mx-auto select-none">
                    <Transition.Child
                        as="div"
                        className="absolute inset-0 z-0 bg-black/30 bg-opacity-50"
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    />
                    <Transition.Child
                        as="div"
                        className="w-full px-8 max-w-md md:max-w-lg mx-auto"
                        enter="transition-transform transition-opacity duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition-transform transition-opacity duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white px-4 py-4 rounded-lg shadow-lg relative z-10 w-full">
                            <Dialog.Title className="text-lg font-bold mb-2 text-slate-700 relative">
                                <span className="block">Tambah Topping</span>
                                <div className="absolute -top-8 -right-8">
                                    <button onClick={() => setIsOpenAddTopping(false)}
                                            className="bg-white shadow text-slate-700 p-2 rounded-full cursor-pointer hover:bg-slate-100">
                                        <X/>
                                    </button>
                                </div>
                            </Dialog.Title>
                            <Dialog.Description as="div"
                                                className="text-gray-600 mt-2 mb-6 min-h-50 max-h-[70vh] overflow-y-auto">
                                {
                                    addToppings.map((topping, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="my-3 p-2 w-full border border-slate-200 rounded-lg flex item-center justify-between shadow">
                                                <div>
                                                        <span
                                                            className="block font-semibold text-slate-700">{capitalizeWords(topping.name)}</span>
                                                    <span
                                                        className="block font-bold text-slate-500">{formatRupiah(topping.price)}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => handleAddToppings(topping)}
                                                        className="px-2 py-1 btn-primary bg-primary rounded-lg text-white cursor-pointer shadow flex items-center text-sm">
                                                        <PlusIcon strokeWidth={1}/> Tambah
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </Dialog.Description>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    );
};

export default CartList;