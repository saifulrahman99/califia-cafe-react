import {useState, useEffect} from "react";
import {ChevronUp} from "lucide-react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 800); // Tombol muncul setelah scroll 300px
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({top: 370, behavior: "smooth"});
    };

    return (
        <div
            className={`fixed z-1 w-full ms-7 max-w-xs md:max-w-md bottom-20 transition-all overflow-hidden duration-500 ${isVisible ? 'max-h-full' : 'max-h-0'}`}>
            <button
                onClick={handleScrollToTop}
                className="bg-primary rounded-full p-1 text-white font-semibold float-right shadow shadow-slate-400 m-1 cursor-pointer">
                <ChevronUp size={30}/>
            </button>
        </div>
    );
};

export default ScrollToTop;
