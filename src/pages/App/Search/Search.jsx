import {useContext, useState} from 'react';
import {SearchIcon, Undo2} from "lucide-react";
import {useNavigate} from "react-router-dom";
import SearchResult from "@pages/App/Search/components/SearchResult.jsx";
import Cart from "@shared/components/Cart/Cart.jsx";
import {MyContext} from "@/MyContext.jsx";

const Search = () => {
    const {cart} = useContext(MyContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleSearchBoxChange = (e) => {
        setSearch(e.target.value);
    }
    return (
        <>
            <div
                className="header fixed w-full max-w-md md:max-w-lg py-3 px-4 z-1 bg-white shadow flex items-center top-7.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <div
                    onClick={() => navigate("/")}
                    className="p-1 me-3 cursor-pointer hover:bg-slate-200 rounded-full">
                    <Undo2 size={25} strokeWidth={1.2}/>
                </div>
                <div className="relative w-full">
                    <span className="absolute inset-y-0 start-0 grid w-10 place-content-center">
                         <SearchIcon strokeWidth={1} size={20}/>
                    </span>
                    <input
                        onChange={handleSearchBoxChange}
                        type="text"
                        id="Search"
                        placeholder="Search for..."
                        className="w-full rounded-md border-primary border-2 py-2 ps-10 shadow-xs sm:text-sm focus:outline-none"
                    />

                </div>
            </div>
            {
                (cart.length > 0) && <Cart/>
            }
            <SearchResult search={search}/>
        </>
    );
};

export default Search;