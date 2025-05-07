import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import {RotateCcw, Undo2} from "lucide-react";
import CategoryService from "@services/categoryService.js";
import DiscountService from "@services/discountService.js";
import MenuService from "@services/menuService.js";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {MyContext} from "@/context/MyContext.jsx";
import AdminLoading from "@shared/components/Loading/AdminLoading.jsx";
import defaultImage from "@assets/images/default.jpg";
import Select from "react-select";

// Validasi dengan Yup
const schema = yup.object().shape({
    name: yup.string().required("Nama wajib di isi"),
    price: yup
        .number()
        .typeError("Harus berupa angka")
        .positive("Angka harus positif")
        .required("Harga wajib di isi"),
    description: yup.string(),
    stock: yup
        .number()
        .typeError("Harus berupa angka")
        .integer("Harus bilangan bulat")
        .positive("Angka harus positif")
        .required("Stok wajib di isi"),
    type: yup.string().required("Tipe wajib di isi"),
    topping_enabled: yup.boolean().required("Wajib di isi"),
    category_id: yup
        .string()
        .uuid("UUID category tidak valid")
        .required("Kategori wajib di isi"),

    // Kondisional: jika isUpdate = true → tidak wajib
    image: yup.mixed().when('$isUpdate', {
        is: true,
        then: (schema) => schema.nullable(), // tidak required
        otherwise: (schema) =>
            schema
                .required("Gambar diperlukan")
                .test("fileSize", "Ukuran gambar maksimal 2MB", (value) => {
                    if (!value || value.length === 0) return true;
                    return value[0].size <= 2 * 1024 * 1024;
                })
                .test("fileType", "Hanya file JPG, PNG, atau WEBP", (value) => {
                    if (!value || value.length === 0) return true;
                    return ["image/jpeg", "image/png", "image/webp"].includes(value[0].type);
                }),
    }),
});

const MenuForm = () => {
    const fileInputRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [imagePreview, setImagePreview] = useState(defaultImage);
    const {isLoading, setIsLoading, showToast} = useContext(MyContext);
    const [isLoadingFetchData, setIsLoadingFetchData] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const {id} = useParams();
    const isEditMode = !!id;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        context: {
            isUpdate: Boolean(id),
        }
    });

    const navigate = useNavigate();
    const menuService = useMemo(MenuService, []);
    const categoryService = useMemo(CategoryService, []);
    const discountService = useMemo(DiscountService, []);

    const onSubmit = async (data) => {
        const form = new FormData();
        form.append("name", data.name);
        form.append("price", data.price);
        form.append("description", data.description);
        form.append("stock", data.stock);
        form.append("type", data.type);
        form.append("topping_enabled", data.topping_enabled ? "1" : "0");
        form.append("category_id", data.category_id);
        form.append("discount_id", data.discount_id || "");

        if (isEditMode) form.append('id', id);
        if (data.image !== null) form.append("image", data.image[0]);
        if (isEditMode) form.append('_method', 'PUT');

        for (const [key, value] of form.entries()) {
            console.log(`${key}:`, value);
        }

        setIsLoading(!isLoading);
        setIsOpen(!isOpen);
        try {
            if (isEditMode) {
                await menuService.update(form);
                showToast("success", "Berhasil mengupdate", 1000);
            } else {
                await menuService.create(form);
                showToast("success", "Berhasil menyimpan", 1000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }

        setTimeout(() => {
            navigate("../");
        }, 2000);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingFetchData(!isLoadingFetchData);
            try {
                const [categoryRes, discountRes] = await Promise.all([
                    categoryService.getAll(),
                    discountService.getAll(),
                ]);
                setCategories(categoryRes.data.map((cat) => ({value: cat.id, label: cat.name})));
                setDiscounts(discountRes.data);

                if (isEditMode) {
                    const {data} = await menuService.getById(id);
                    setImagePreview(data.image);
                    reset({
                        name: data.name,
                        price: data.price,
                        description: data.description,
                        stock: data.stock,
                        type: data.type,
                        topping_enabled: data.topping_enabled,
                        category_id: data.category.id,
                        discount_id: data.discount?.id ?? "",
                        image: null
                    });
                }
                setIsLoadingFetchData(false);
            } catch {
                showToast("error", "gagal memuat data", 1000);
            }
        };
        fetchData();
    }, [isEditMode, id, categoryService, discountService, menuService, reset]);

    const handleReset = () => {
        setImagePreview(defaultImage);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    return (
        <div>
            <div className="px-4 py-2 font-semibold w-full bg-white rounded mb-4 border border-slate-200">
                <button
                    onClick={() => navigate("../")}
                    className="cursor-pointer flex menus-center gap-x-2">
                    <Undo2 size={20}/>
                    <span>kembali</span>
                </button>
            </div>

            <div className="p-4 bg-white rounded border border-slate-200 mb-25">
                <h2 className="text-xl font-bold mb-4">Menu Form</h2>
                {isLoadingFetchData ? "Loading..." :
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        {/* Image preview */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <div className="img">
                                <p className="font-semibold mb-2">Preview:</p>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-48 h-48 object-cover rounded border border-slate-300"
                                />
                            </div>
                            {imagePreview !== defaultImage && (
                                <button
                                    onClick={handleReset}
                                    className={"p-1 px-2 text-white cursor-pointer bg-slate-400 flex gap-x-2 items-center rounded-lg"}>
                                    <RotateCcw size={20}/> Reset</button>
                            )}
                        </div>
                        {/* Image input */}
                        <Controller
                            name="image"
                            control={control}
                            defaultValue={null}
                            render={({field}) => (
                                <div className="mb-4 col-span-2">
                                    <label className="block font-medium mb-1">Gambar Produk </label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={(e) => {
                                            const fileList = e.target.files;
                                            if (fileList.length > 0) {
                                                setImagePreview(URL.createObjectURL(fileList[0]));
                                                field.onChange(fileList); // ✅ inject file ke RHF
                                            } else {
                                                setImagePreview(null);
                                                field.onChange(null);
                                            }
                                        }}
                                        className="flex text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white file:cursor-pointer hover:file:bg-amber-600 duration-300 cursor-pointer"/>
                                    {errors.image && (
                                        <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        {[
                            {label: "Nama", name: "name", type: "text"},
                            {label: "Harga", name: "price", type: "number"},
                            {label: "Stok", name: "stock", type: "number"},
                        ].map(({label, name, type}) => (
                            <div key={name} className="col-span-2 md:col-span-1">
                                <label className="block font-semibold mb-2">{label} <span
                                    className={"text-red-500 text-xs"}>*</span></label>
                                <input
                                    type={type}
                                    {...register(name)}
                                    min={0}
                                    className="w-full p-2 border border-slate-300 outline-amber-500 focus:outline-amber-500 rounded-md"
                                />
                                {errors[name] && (
                                    <p className="text-red-500 text-sm">{errors[name]?.message}</p>
                                )}
                            </div>
                        ))}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block font-semibold mb-2">Tipe <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <select
                                {...register("type")}
                                className="w-full p-2 border border-slate-300 outline-amber-500 focus:outline-amber-500 rounded-md"
                            >
                                <option value="">-</option>
                                {[
                                    {name: "food"},
                                    {name: "beverage"},
                                    {name: "snack"},
                                ].map((cat) => (
                                    <option key={cat.name} value={cat.name}>
                                        {capitalizeWords(cat.name)}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-sm">{errors.type.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Nyalakan Topping <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <select
                                {...register("topping_enabled")}
                                className="w-full p-2 border border-slate-300 outline-amber-500 focus:outline-amber-500 rounded-md"
                            >
                                {[
                                    {name: "tidak", value: "0"},
                                    {name: "ya", value: "1"},
                                ].map((cat) => (
                                    <option key={cat.name} value={cat.value}>
                                        {capitalizeWords(cat.name)}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-sm">{errors.type.message}</p>
                            )}
                        </div>

                        {/* Description as textarea */}
                        <div className="col-span-2">
                            <label className="block font-semibold mb-2">Deskirpsi <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <textarea
                                {...register("description")}
                                className="w-full p-2 border border-slate-300 outline-amber-500 focus:outline-amber-500 rounded-md"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Category ID as select */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block font-semibold mb-2">Kategori <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <Controller
                                name="category_id"
                                control={control}
                                rules={{required: "Kategori wajib dipilih"}}
                                render={({field}) => {
                                    return (
                                        (
                                            <Select
                                                {...field}
                                                options={categories}
                                                placeholder="Pilih kategori"
                                                value={categories.find(option => option.value === field.value)}
                                                styles={{
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                        overflowY: "auto",

                                                    }),
                                                    control: (provided, state) => ({
                                                        ...provided,
                                                        boxShadow: state.isFocused ? '0 0 0 1px #d1d5db' : 'none',
                                                        '&:hover': {
                                                            borderColor: '#d1d5db',
                                                        },
                                                    }),
                                                }}
                                                onChange={(val) => field.onChange(val?.value)}
                                            />
                                        )
                                    )
                                }
                                }
                            />
                            {errors.category_id && (
                                <p className="text-sm text-red-500">{errors.category_id.message}</p>
                            )}
                        </div>

                        {/* Discount ID as select */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block font-semibold mb-2">Diskon</label>
                            <select
                                {...register("discount_id")}
                                className="w-full p-2 border border-slate-300 outline-amber-500 focus:outline-amber-500 rounded-md"
                            >
                                <option value="">-</option>
                                {discounts.map((disc) => (
                                    <option key={disc.id} value={disc.id}>
                                        {capitalizeWords(disc.name)}
                                    </option>
                                ))}
                            </select>
                            {errors.discount_id && (
                                <p className="text-red-500 text-sm">{errors.discount_id.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-amber-500 text-white p-2 rounded-md hover:bg-amber-600 col-span-2 max-w-md mt-5 mb-4 mx-auto cursor-pointer shadow"
                        >
                            {isEditMode ? "Update" : "Simpan"}
                        </button>
                    </form>
                }
            </div>
            <AdminLoading isOpen={isOpen} isLoading={isLoading}/>
        </div>
    );
};

export default MenuForm;