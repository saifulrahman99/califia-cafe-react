import React, {useContext, useEffect, useMemo} from 'react';
import {useAuth} from "@/context/AuthContext.jsx";
import * as yup from 'yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import AuthServices from "@services/authServices.js";
import {useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {MyContext} from "@/context/MyContext.jsx";

const loginSchema = yup.object().shape({
    email: yup.string()
        .email('Format email tidak valid')
        .required('Email wajib diisi'),
    password: yup.string()
        .min(6, 'Kata sandi minimal 6 karakter')
        .required('Kata sandi wajib diisi'),
});

const Login = () => {
    const {login, isAuthenticated} = useAuth();
    const {showToast} = useContext(MyContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const authService = useMemo(() => AuthServices(), []);
    const onSubmit = (data) => {
        const loginAction = async () => {
            try {
                const response = await authService.login(data); // tidak perlu stringify
                login(response.data);
            } catch {
                showToast("error", "Email Atau Password Salah", 1000);
            }
        };

        loginAction();
    };
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin");
        }
    })
    return (
        <>
            <div className="bg-gray-100 flex items-center justify-center min-h-screen relative overflow-hidden z-1">

                {/* 🌊 Wave Layer 1 */}
                <div
                    className="fixed inset-0 -z-30 transform -rotate-6 scale-125 translate-8 lg:-translate-y-5 opacity-70">
                    <svg className="w-full h-auto" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path
                            fill="#fbbf24"
                            fillOpacity="1"
                            d="M0,224L48,208C96,192,192,160,288,138.7C384,117,480,107,576,128C672,149,768,203,864,218.7C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                        />
                    </svg>
                </div>

                {/* 🌊 Wave Layer 2 */}
                <div
                    className="fixed inset-0 -z-20 transform -rotate-6 scale-125 translate-y-15 md:translate-y-10 opacity-70">
                    <svg className="w-full h-auto" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path
                            fill="#facc15" // amber-400
                            fillOpacity="1"
                            d="M0,288L48,266.7C96,245,192,203,288,181.3C384,160,480,160,576,176C672,192,768,224,864,224C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                        />
                    </svg>
                </div>

                {/* 🌊 Wave Layer 3 */}
                <div className="absolute bottom-0 left-0 w-full z-0 opacity-40">
                    <svg className="w-full h-auto" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path
                            fill="#fde68a" // amber-200
                            fillOpacity="1"
                            d="M0,160L48,186.7C96,213,192,267,288,288C384,309,480,299,576,282.7C672,267,768,245,864,240C960,235,1056,245,1152,224C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                </div>

                {/*Form Login*/}
                <div
                    className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md mx-4 md:mx-0 relative z-1 select-none">
                    <div className="logo flex justify-center">
                        <img src="/logo.png" alt="logo"
                             className={"bg-slate-50 w-30 rounded-full border border-slate-200"}/>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login Admin</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register('email')}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-amber-500 focus:outline-2"
                            />
                            <div className="relative min-h-5 mt-1">
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Kata
                                Sandi</label>
                            <input
                                type="password"
                                id="password"
                                {...register('password')}
                                className="block mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-amber-500 focus:outline-2"
                            />
                            <div className="relative min-h-5 mt-1">
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm my-5 cursor-pointer">
                            <a href="#" className="text-blue-600 hover:underline">Lupa kata sandi?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-amber-500 text-white py-2 rounded-xl hover:bg-amber-600 transition duration-300"
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
};

export default Login;