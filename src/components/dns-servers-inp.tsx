import { invoke } from "@tauri-apps/api/core";
import React, { useState } from "react";
import { useLog } from "../contexts/log-context";
import { useDNS } from "../contexts/dns-context";

export default function DnsServersInp(){
    const {primaryDNS, setPrimaryDNS, secondaryDNS, setSecondaryDNS} = useDNS();

    const [primaryLookup, setPrimaryLookup] = useState<string>("0 ms");
    const [secondaryLookup, setSecondaryLookup] = useState<string>("0 ms");
    
    const allowedInput = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        const allowedKey = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "."]
        if(!allowedKey.includes(e.key) && !/^[0-9]$/.test(e.key)){
            e.preventDefault();
        }
    }
    
    const {log} = useLog();
    const lookupDns = ()=>{
        setPrimaryLookup("testing...");
        setSecondaryLookup("testing...");
        // lookup primary dns
        invoke<number>("lookup", {ip: primaryDNS})
        .then((result)=>{
            setPrimaryLookup(`${result} ms`);
        })
        .catch((error)=>{
            log(error);
            setPrimaryLookup("0 ms");
        });
        // lookup secondary dns
        invoke<number>("lookup", {ip: secondaryDNS})
        .then((result)=>{
            setSecondaryLookup(`${result} ms`);
        })
        .catch((error)=>{
            log(error);
            setSecondaryLookup("0 ms");
        });
    }

    return(
        <div className=" w-10/12 h-fit flex flex-row justify-around items-center text-white absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-[f2]">
            <div className="relative">
                <div className="absolute -top-3 right-4 z-20 text-[0.9rem] bg-[#1f2023] rounded text-[#8b8b8b] select-none"><span>{primaryLookup}</span></div>
                <input onChange={(e)=> {setPrimaryDNS(e.currentTarget.value)}} value={primaryDNS} className="w-56 h-14 outline-none rounded-md bg-[#1f2023] border border[1px] border-[#0000008c] focus:border-[#2052a8] duration-200 ease-in-out px-2 py-1 text-center drop-shadow-2xl text-[1.2rem]" type="text" placeholder="primary: 0.0.0.0" onKeyDown={allowedInput} maxLength={15}/>
            </div>
            
            <div  onClick={lookupDns} className="rounded bg-[#363636] text-[0.8rem] p-1 text-white drop-shadow-2xl hover:translate-y-0.5 active:rounded-lg duration-200 ease-in-out">
                <button className="outline-none" title="test dns speed">TEST</button>
            </div>

            <div className="relative">
                <div className="absolute -top-3 right-4 z-20 text-[0.9rem] bg-[#1f2023] rounded text-[#8b8b8b] select-none"><span>{secondaryLookup}</span></div>
                <input onChange={(e)=> {setSecondaryDNS(e.currentTarget.value)}} value={secondaryDNS} className="w-56 h-14 outline-none rounded-md bg-[#1f2023] border border[1px] border-[#0000008c] focus:border-[#2052a8] duration-200 ease-in-out px-2 py-1 text-center drop-shadow-2xl text-[1.2rem]" type="text" placeholder="secondary: 0.0.0.0" onKeyDown={allowedInput} maxLength={15}/>
            </div>
        </div>
    );
}