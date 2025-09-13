import React, {Fragment} from "react";
import {X} from "lucide-react";
import {Dialog, Transition} from "@headlessui/react";

const Modal = ({isOpen, onClose, title, children}) => {
    if (!isOpen) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div"
                    className="fixed inset-0 flex items-center justify-center z-50 select-none"
                    onClose={onClose}>
                {/* Background overlay */}
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

                {/* Modal Container */}
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
                    <Dialog.Panel
                        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative z-1 text-gray-600">
                        <button
                            className="p-1 m-2 hover:bg-slate-200 rounded-full transition hover: cursor-pointer absolute end-0 top-0"
                            onClick={onClose}
                        >
                            <X/>
                        </button>
                        {/* Title */}
                        <Dialog.Title className="text-lg font-bold mb-3">
                            {title}
                        </Dialog.Title>

                        {children}

                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};

export default Modal;
