import {useState, useEffect} from "react";
import {ChevronUp} from "lucide-react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 800);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);


    const handleScrollToTop = () => {
        window.scrollTo({top: 370, behavior: "smooth"});
    };

    return (
        <div
            className={`fixed z-1 w-full max-w-md md:max-w-lg bottom-20 transition-all overflow-hidden duration-500 ${isVisible ? 'max-h-full' : 'max-h-0'}`}>
            <button
                onClick={handleScrollToTop}
                className="bg-primary rounded-full p-2 text-white font-semibold float-right shadow shadow-slate-400 m-1 cursor-pointer me-4">
                <ChevronUp size={30}/>
            </button>
        </div>
    );
};

export default ScrollToTop;
