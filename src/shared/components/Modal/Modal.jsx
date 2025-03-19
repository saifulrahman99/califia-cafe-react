import React, {useState} from 'react';

const Modal = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setIsOpen(true)}
            >
                Tampilkan Modal
            </button>

            {isOpen && (
                <div
                    className="fixed w-full h-full max-w-md md:max-w-lg m-auto flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

                    <div className="fixed inset-0 w-max-md md:w-max-lg m-auto bg-black z-0 opacity-10"></div>

                    <div
                        className={`bg-white p-6 rounded-lg shadow-lg relative z-1 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-0'}`}>

                        <h2 className="text-xl font-bold">Peringatan</h2>
                        <p>Apakah kamu yakin ingin melanjutkan?</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => alert("Dikonfirmasi!")}
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;