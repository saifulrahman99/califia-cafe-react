import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {MapPinned, PhoneCall, Undo2} from "lucide-react";

const AboutMe = () => {
    const navigate = useNavigate();
    const [operationalHours, setOperationalHours] = useState([
        {day: "Senin", hours: "08:00 - 17:00"},
        {day: "Selasa", hours: "08:00 - 17:00"},
        {day: "Rabu", hours: "08:00 - 17:00"},
        {day: "Kamis", hours: "08:00 - 17:00"},
        {day: "Jumat", hours: "08:00 - 17:00"},
        {day: "Sabtu", hours: "09:00 - 14:00"},
        {day: "Minggu", hours: "Tutup"}
    ])
    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate("/"); // Fallback ke halaman utama
        }
    };
    return (
        <>
            <div
                className={`header fixed w-full max-w-md md:max-w-lg py-2 px-4 z-1 flex items-center top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 bg-white shadow`}
            >
                <div
                    onClick={handleGoBack}
                    className={`p-1 me-3 cursor-pointer rounded-full bg-white`}>
                    <Undo2 size={25} strokeWidth={1.2}/>
                </div>
            </div>
            <div className="pt-12.5">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.0861156738108!2d114.22171891589733!3d-7.74968686741168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd12a097913b303%3A0x602d2c84f06267e0!2s762C%2B5MH%2C%20Gudang%2C%20Kec.%20Asembagus%2C%20Kabupaten%20Situbondo%2C%20Jawa%20Timur%2068373!5e0!3m2!1sid!2sid!4v1743104958400!5m2!1sid!2sid"
                    height="250" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    className={"w-full border-0"}></iframe>
                <div className="content px-4 pb-8 border-b-slate-200 border-2 border-x-0 border-t-0">
                    <h1 className={"text-primary text-2xl font-bold mt-2 mb-4"}>Califia | Food & Baverage</h1>
                    <div className="flex">
                        <div className="w-4 me-2">
                            <MapPinned strokeWidth={1.5} size={20} className={"inline-block"}/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, praesentium!</p>

                    </div>
                    <div className={"text-center mt-4"}>
                        <Link to="https://wa.me/6285156980936"
                              className={"p-2 font-semibold text-sm shadow border border-slate-200 rounded-lg"}>
                            <PhoneCall
                                className={"inline me-2"} size={18} target="_blank"/> Hubungi Outlet</Link>
                    </div>

                </div>
                <div className="schedule p-4 text-lg font-semibold">Jam Oprasional</div>
                <div className="hour px-4 pb-8">
                    <ul className="space-y-2">
                        {operationalHours.map(({day, hours}, index) => (
                            <li key={index} className="text-sm py-2 border border-slate-200 border-x-0 border-t-0">
                                <span className="w-1/2 inline-block">{day.toUpperCase()}</span>
                                <span>{hours}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AboutMe;