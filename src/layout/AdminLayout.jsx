import {useState} from 'react';
import {NavLink, Outlet, useLocation} from "react-router-dom";
import {
    ChevronDown,
    CircleUserRound,
    Cookie,
    Dot,
    Home, LogOut,
    Menu,
    ScrollText,
    Settings,
    SquareMenu,
    X
} from "lucide-react";
import {capitalizeWords} from "@/utils/capitalWords.js";
import ConfirmationModalAdmin from "@shared/components/Modal/ConfirmationModalAdmin.jsx";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="flex h-screen bg-neutral-50">
            {/* SIDEBAR */}
            <aside
                className={`fixed z-50 inset-y-0 left-0 transform bg-white border-e border-slate-200 min-w-[250px] transition-transform duration-300 ease-in-out select-none overflow-y-auto thin-scrollbar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}>

                <div className="px-4 py-6 sticky top-0 bg-white z-2 border-b border-slate-200 md:border-0">
                    <div className="flex flex-row justify-between">
                        <img src="/logo.png" alt="logo"
                             className={"bg-slate-50 w-20 rounded-full border border-slate-200"}/>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                            <X className="text-slate-500" size={22}/>
                        </button>
                    </div>
                </div>

                <div className="px-4">
                    <ul className="my-4 space-y-1.5">
                        <li>
                            <NavLink
                                to="/admin/dashboard"
                                className={({isActive}) =>
                                    `flex items-center gap-1 rounded-lg px-4 py-2 font-medium ${isActive ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-amber-500 hover:text-white'}`
                                }
                            >
                                <Home size={20}/> Dashboard
                            </NavLink>
                        </li>

                        <li>
                            <details className="group [&_summary::-webkit-details-marker]:hidden"
                                     open={location.pathname.includes('/admin/menu')}>
                                <summary
                                    className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 hover:bg-amber-500 hover:text-white ${location.pathname.includes('/admin/menu') ? 'bg-amber-500 text-white' : 'text-gray-500'}`}>
                                    <span className="font-medium flex items-center gap-1"> <SquareMenu size={20}/> Menu</span>
                                    <span
                                        className="shrink-0 transition duration-300 group-open:-rotate-180"><ChevronDown
                                        size={18} strokeWidth={2.5}/></span>
                                </summary>
                                <ul className="mt-2 space-y-1 mx-2 p-2 bg-neutral-50 rounded-lg">
                                    <li>
                                        <NavLink
                                            to="/admin/menu/list"
                                            className={({isActive}) =>
                                                `flex gap-1 items-center rounded-lg p-2 font-medium ${isActive ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'}`
                                            }
                                        >
                                            <Dot/> Menu List
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/admin/menu/categories"
                                            className={({isActive}) =>
                                                `flex gap-1 items-center rounded-lg p-2 font-medium ${isActive ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'}`
                                            }
                                        >
                                            <Dot/> Categories
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/admin/menu/discounts"
                                            className={({isActive}) =>
                                                `flex gap-1 items-center rounded-lg p-2 font-medium ${isActive ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'}`
                                            }
                                        >
                                            <Dot/> Discounts
                                        </NavLink>
                                    </li>
                                </ul>
                            </details>
                        </li>

                        <li>
                            <NavLink
                                to="/admin/toppings"
                                className={({isActive}) =>
                                    `flex gap-1 items-center rounded-lg px-4 py-2 font-medium ${isActive ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-amber-500 hover:text-white'}`
                                }
                            >
                                <Cookie size={20}/> Toppings
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/admin/transactions"
                                className={({isActive}) =>
                                    `flex gap-1 rounded-lg items-center px-4 py-2 font-medium ${isActive ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-amber-500 hover:text-white'}`
                                }
                            >
                                <ScrollText size={20}/> Transactions
                            </NavLink>
                        </li>

                        <li>
                            <details className="group [&_summary::-webkit-details-marker]:hidden"
                                     open={location.pathname.includes('/admin/settings')}>
                                <summary
                                    className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 hover:bg-amber-500 hover:text-white ${location.pathname.includes('/admin/settings') ? 'bg-amber-500 text-white' : 'text-gray-500'}`}>
                                    <span className="font-medium flex items-center gap-1"><Settings size={20}/> Settings</span>
                                    <span
                                        className="shrink-0 transition duration-300 group-open:-rotate-180"><ChevronDown
                                        size={18} strokeWidth={2.5}/></span>
                                </summary>

                                <ul className="mt-2 space-y-1 mx-2 p-2 bg-neutral-50 rounded-lg">
                                    <li>
                                        <NavLink
                                            to="/admin/settings/store-profile"
                                            className={({isActive}) =>
                                                `flex gap-1 rounded-lg items-center p-2 font-medium ${
                                                    isActive ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'
                                                }`
                                            }
                                        >
                                            <Dot/> Profile Store
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/admin/settings/operational-store"
                                            className={({isActive}) =>
                                                `flex gap-1 rounded-lg items-center p-2 font-medium ${
                                                    isActive ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'
                                                }`
                                            }
                                        >
                                            <Dot/> Operational Store
                                        </NavLink>
                                    </li>
                                </ul>
                            </details>
                        </li>

                        <li>
                            <NavLink
                                to="/admin/account"
                                className={({isActive}) =>
                                    `flex gap-1 rounded-lg items-center px-4 py-2 font-medium ${isActive ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-amber-500 hover:text-white'}`
                                }
                            >
                                <CircleUserRound size={20}/> Account
                            </NavLink>
                        </li>

                    </ul>
                </div>

                {/* Profile */}
                <div className="static md:absolute inset-x-0 bottom-0 border-t border-slate-200 cursor-pointer">
                    <div onClick={() => setIsModalOpen(true)}
                         className="flex items-center justify-between bg-white p-4 hover:bg-amber-50">
                        <div className={"flex items-center gap-2"}>
                            <img
                                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&w=1770&q=80"
                                alt="" className="size-10 rounded-full object-cover"/>
                            <p className="text-xs">
                                <strong className="block font-medium">Eric Frusciante</strong>
                                <span>eric@frusciante.com</span>
                            </p>
                        </div>

                        <LogOut size={20} className={"text-slate-500"}/>
                    </div>
                </div>

                <ConfirmationModalAdmin
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Logout Admin"
                    message="Apakah Anda yakin ingin Logout?"
                />
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex flex-col flex-1">
                <div
                    className="top-bar w-full bg-white border-b border-slate-200 p-4">
                    {/* Toggle Sidebar Button */}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden float-left">
                        <Menu className="text-slate-700"/>
                    </button>

                    <div className="notify float-right">
                        Notify
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 text-slate-500">
                    <div
                        className="px-4 py-2 font-semibold w-full bg-white rounded mb-4 border border-slate-200"> {capitalizeWords(location.pathname.replace("/admin/", ""))}</div>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;