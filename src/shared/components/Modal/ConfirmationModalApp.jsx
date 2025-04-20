import {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";

const ConfirmationModalApp = ({isOpen, onClose, onConfirm, title, message}) => {
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div"
                        className="fixed inset-0 flex items-center justify-center z-50 max-w-md md:max-w-lg mx-auto select-none"
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
                        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative z-1">
                            {/* Title */}
                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                {title}
                            </Dialog.Title>

                            {/* Message */}
                            <p className="mt-2 text-gray-600">{message}</p>

                            {/* Buttons */}
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition hover:text-slate-100 cursor-pointer"
                                    onClick={onClose}
                                >
                                    Batal
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer"
                                    onClick={onConfirm}
                                >
                                    Konfirmasi
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    );
};

export default ConfirmationModalApp;