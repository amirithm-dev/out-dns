import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInterface } from "../contexts/interface-context";


export default function NetworkInterfacesList(){
    const {interfaceList, selectedInterface, setSelectedInterface} = useInterface();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const comboRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        function handleClickOutside(e: MouseEvent){
            if(comboRef.current && !comboRef.current.contains(e.target as Node)){
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[]);

    return(
        <div ref={comboRef} className="w-60 h-10 flex justify-end absolute top-10 left-12 z-20 select-none">
            <div id="network-interfaces" className="rounded-sm border border-[#000000] px-1 text-white text-[0.9rem] drop-shadow-2xl outline-0 w-full h-7 flex items-center" onClick={()=>{setIsOpen(prev => !(prev))}}>
                <div className="absolute top-0 right-1 flex justify-center items-center w-5 h-full ">
                    <ChevronLeft strokeWidth={1} className={(isOpen ? "-rotate-90 " : "rotate-0 ") + "w-4 h-4 duration-200 ease-in-out"}></ChevronLeft>
                </div>
                <p id="selected-interface" className="w-full h-fit">{selectedInterface}</p>
            </div>
            <div className={(isOpen ? "h-52 " : "h-0 opacity-0 ") + "absolute top-8 left-0 bg-[#1f2023] rounded-md p-2 text-[#ffffffa8] overflow-y-scroll overflow-x-hidden scrollbar-thumb-transparent border-[#0000008c] border flex flex-col gap-2 drop-shadow-2xl duration-400 ease-in-out w-60"}>
                <div className="relative w-full h-fit flex flex-row gap-1">
                    <div className="w-px h-full bg-[#09ff008a] rounded-full"></div>
                    <p className="cursor-default hover:pl-2 hover:text-[#2052a8] duration-200 ease-in-out" onClick={()=>{setSelectedInterface("All Networks"); setIsOpen(false)}}>All Networks</p>
                </div>
                {interfaceList.map((iface,i) => (
                    <div className="relative w-full h-fit flex flex-row gap-1">
                        <div className="w-px h-full bg-[#005eff8a] rounded-full"></div>
                        <p key={i} className="cursor-default hover:pl-2 hover:text-[#2052a8] duration-200 ease-in-out truncate min-h-fit" onClick={()=>{setSelectedInterface(iface); setIsOpen(false)}}>{iface}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
