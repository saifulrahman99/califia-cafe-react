import React, {useEffect, useMemo, useState} from 'react';
import MenuService from "@services/menuService.js";

const LowStock = () => {
    const menuService = useMemo(() => MenuService(), [])
    const [menus, setMenus] = useState([])
    const getLowStockMenu = (menus) => {
        return menus
            .filter(menu => menu.stock < 10)
            .sort((a, b) => a.stock - b.stock);
    };

    useEffect(() => {
        const getMenus = async () => {
            const response = await menuService.getAll()
            setMenus(getLowStockMenu(response.data.data))
        }
        getMenus()
    }, [menuService])
    return (
        <>
            <div className="overflow-x-auto">
                <h2 className="font-semibold mb-2">{"Produk dengan Stok < 10"}</h2>
                {menus.length === 0 ? (
                    <p className="text-sm text-gray-500">Semua stok aman ✅</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nama
                                Produk
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Kategori</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stok</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {menus.map((product, index) => (
                            <tr key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-2 text-sm">{index + 1}</td>
                                <td className="px-4 py-2 text-sm">{product.name}</td>
                                <td className="px-4 py-2 text-sm">{product.category.name}</td>
                                <td className={`px-4 py-2 text-sm font-medium ${product.stock < 5 ? 'text-red-600' : 'text-gray-800'}`}>
                                    {product.stock}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default LowStock;