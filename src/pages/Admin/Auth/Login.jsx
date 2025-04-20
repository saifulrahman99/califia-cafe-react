import React from 'react';

const Login = () => {
    return (
        <>
            <div className="bg-gray-100 flex items-center justify-center min-h-screen">

                <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md mx-4 md:mx-0">
                    <div className="logo flex justify-center">
                        <img src="/logo.png" alt="logo"
                             className={"bg-slate-50 w-30 rounded-full border border-slate-200"}/>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login Admin</h2>

                    <form className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email" required
                                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-amber-500 focus:outline-2"/>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Kata
                                Sandi</label>
                            <input type="password" id="password" name="password" required
                                   className="block mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-amber-500 focus:outline-2"/>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <a href="#" className="text-blue-600 hover:underline">Lupa kata sandi?</a>
                        </div>

                        <button type="submit"
                                className="w-full bg-amber-500 text-white py-2 rounded-xl hover:bg-amber-600 transition duration-300">
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;