import { invoke } from "@tauri-apps/api/core";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useLog } from "../../contexts/log-context";

import { usePopup } from "../../contexts/popup-context";
import { useDNS } from "../../contexts/dns-context";
import { ChevronDown, ChevronLeft, ChevronRight, CircleCheckBig, Globe, Minus, Plus, ReceiptText, RefreshCcw, Search } from "lucide-react";
import axios from "axios";
import { DatabaseDNSEntry } from "../../../types";

export default function DNS({section}: {section: string}){
    const {DNSList, fetchDNSList} = useDNS();
    const { showPopup } = usePopup();
    const {log} = useLog();

    const [dnsName, setDnsName] = useState<string>("");
    const [firstAddress, setFirstAddress] = useState<string>("");
    const [secondAddress, setSecondAddress] = useState<string>("");

    const [onlinePanelIsOpen, setOnlinePanelIsOpen] = useState<boolean>(false);

    function insert(name: string, primary: string, secondary: string){
        if(name.length < 1 || primary.length < 7 || secondary.length < 7 ){
            log("invalid DNS data ❌");
            return showPopup("warning");
        }
        
        invoke<string>("new_dns",{name: name, primary: primary, secondary: secondary})
        .then(() => {
            showPopup("success");
            log(`${name} successfully added ✅`);
            fetchDNSList();
            setDnsName("");
            setFirstAddress("");
            setSecondAddress("");
        })
        .catch(()=>{
            showPopup("warning");
            log(`failed to insert DNS ❌`);
        });
    }

    function removeDns(id: number) {
        invoke<string>("remove_dns", {id: id})
        .then(()=>{
            showPopup("success");
            log(`DNS successfully deleted`);
            fetchDNSList();
        })
        .catch(()=>{
            log(`failed to remove DNS ❌`);
        });
    }
    
    return(
        <div className={(section == "dns" ? "" : "translate-x-full opacity-0 ") + "absolute top-0 left-0 duration-300 w-full h-full flex flex-col items-center p-5 gap-4"}>
            <OnlineDNS onlinePanelIsOpen={onlinePanelIsOpen} setOnlinePanelIsOpen={setOnlinePanelIsOpen} insert={insert}></OnlineDNS>

            <div className="w-full max-w-100 h-36 rounded-md bg-zinc-900 border border-black drop-shadow-2xl overflow-hidden relative overflow-x-hidden overflow-y-scroll scrollbar-none">
                {DNSList.map((dns,i)=>{
                    return(
                        <div key={i} className="w-full h-fit flex flex-col truncate border-b border-b-black p-1 group gap-2">
                            <div className="flex gap-2 justify-center truncate overflow-hidden relative">
                                <div className="truncate flex gap-2 justify-center absolute rounded backdrop-blur px-2 -translate-y-full scale-0 group-hover:translate-0 group-hover:scale-100 duration-200 ease-in-out border border-[#8181812c]">
                                    <p className="truncate w-fit text-[0.9rem]">{dns.name}</p>
                                </div>
                                <p className="w-full h-full truncate text-right font-[f2] text-[1rem]">{dns.primary_dns}</p>
                                <span className="text-black font-mono">|</span>
                                <p className="w-full h-full truncate text-left font-[f2] text-[1rem]">{dns.secondary_dns}</p>
                            </div>
                            <div className="w-1/12 flex justify-center items-center translate-x-7 group-hover:translate-0 group-hover:rotate-0 duration-200 ease-in-out fixed right-0">
                                <button onClick={(e)=>{removeDns(parseInt(e.currentTarget.value))}} value={dns.id} className="rotate-180 hover:scale-95"><Minus className="max-w-[1.4rem] max-h-[1.4rem] rounded-full bg-red-700"></Minus></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex w-fit gap-10">
                <div className="w-full flex items-center gap-2">
                    <div className="flex gap-2 flex-col justify-center items-center font-[f1]">
                        <input value={dnsName} onChange={e => {setDnsName(e.currentTarget.value)}}          className="tracking-widest outline-none bg-zinc-900 rounded-md py-2 px-5 text-center border border-[#0000008c] focus:border-[#2052a8] duration-200 max-w-52 min-w-52 font-[f3]" type="text" name="" id="" placeholder="DNS name" maxLength={30}/>
                        <input value={firstAddress} onChange={e => (setFirstAddress(e.target.value))}       className="tracking-widest outline-none bg-zinc-900 rounded-md py-2 px-5 text-center border border-[#0000008c] focus:border-[#2052a8] duration-200 max-w-52 min-w-52" type="text" name="" id="" placeholder="primary: 0.0.0.0" maxLength={15}/>
                        <input value={secondAddress} onChange={e => (setSecondAddress(e.target.value))}     className="tracking-widest outline-none bg-zinc-900 rounded-md py-2 px-5 text-center border border-[#0000008c] focus:border-[#2052a8] duration-200 max-w-52 min-w-52" type="text" name="" id="" placeholder="secondary: 0.0.0.0" maxLength={15}/>
                    </div>
                </div>
                <div className="flex justify-center items-center font-[f1] w-fit h-full gap-2">
                    <div className="w-fit h-10/12 flex flex-col items-center justify-between">
                        <button onClick={()=>{insert(dnsName, firstAddress, secondAddress)}} className="w-32 h-5/12 bg-[#2052a8] rounded-md text-center drop-shadow-2xl border border-[#1f20239f] overflow-hidden group">
                            <div className="absolute -top-10 -left-10 scale-0 group-hover:scale-100 border-4 border-[#111111] bg-transparent rounded-full w-20 h-20 blur-xs duration-300"></div>
                            <span>Add</span>
                        </button>
                        <button onClick={()=>{setDnsName(""); setFirstAddress(""); setSecondAddress("")}} className="w-32 h-5/12 bg-[#2052a8] rounded-md text-center drop-shadow-2xl border border-[#1f20239f] overflow-hidden group">
                            <div className="absolute -top-10 -left-10 scale-0 group-hover:scale-100 border-4 border-[#111111] bg-transparent rounded-full w-20 h-20 blur-xs duration-300"></div>
                            <span>clear</span>
                        </button>                    
                    </div>
                    <button onClick={()=>{setOnlinePanelIsOpen(true)}} className="w-12 h-10/12 bg-[#2b974c] rounded-md flex justify-center items-center drop-shadow-2xl border border-[#1f20239f] overflow-hidden group">
                        <Globe className="group-hover:-rotate-45 duration-300"></Globe>
                    </button>
                </div>
            </div>

        </div>
    );
}

function OnlineDNS({
    onlinePanelIsOpen,
    setOnlinePanelIsOpen,
    insert,
}: {
    onlinePanelIsOpen: boolean, 
    setOnlinePanelIsOpen: Dispatch<SetStateAction<boolean>>, 
    insert: (name: string, primary: string, secondary: string)=> void
})
{
    const [offset, setOffset] = useState<number>(0);
    const [DNSList, setDNSList] = useState<DatabaseDNSEntry[]>();
    const [fetchError, setFetchError] = useState<string>();
    const [fetching, setFetching] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>("Cloudflare");
    const mainDivRef = useRef<HTMLDivElement>(null);

    const refetchDNSList = ()=>{
        if(fetching) return;
        setFetching(true);
        axios.get(`https://outdns.ir/api/dns-profile?offset=${offset}&limit=10`)
        .then((r)=>{
            if(r.status === 200){
                setDNSList(r.data);
            }else{
                setFetchError("Unable to fetch DNS List");
            }
        })
        .catch(()=>{
            setFetchError("Unable to fetch DNS List");
        })
        .finally(()=>{
            setFetching(false);
        });
    }

    useEffect(()=>{
        refetchDNSList();
    },[offset]);

    function openDetails(e: React.MouseEvent){
        const element = e.currentTarget;
        const parentElement = element.parentElement;
        const child = element.children[0];
        
        if(!parentElement) return;

        if(parentElement.classList.contains("h-fit")){
            child.classList.replace("rotate-180","rotate-0");
            parentElement.classList.replace("h-fit","h-9");
        }else{
            child.classList.replace("rotate-0","rotate-180");
            parentElement.classList.replace("h-9","h-fit");
        }
    }

    const insertFetchedDNS = async (id: string, name: string, primary: string, secondary: string)=>{
        await axios.post(`https://outdns.ir/api/dns-profile/${id}/use`).catch();
        insert(name, primary, secondary);
        document.getElementById(id)?.remove();
    }

    useEffect(()=>{
        function handleClickOutside(e: MouseEvent){
            if(mainDivRef.current && !mainDivRef.current.contains(e.target as Node)){
                setOnlinePanelIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[]);

    const reload = ()=>{
        refetchDNSList();
    }

    const fetchMore = ()=>{
        if(DNSList && DNSList.length === 10){
            setDNSList(undefined);
            setOffset(prev => prev + 10);
        }
    }    
    const fetchLess = ()=>{
        if(offset > 0){
            setDNSList(undefined);
            setOffset(prev => prev - 10);
        }
    }

    const search = ()=>{
        if(fetching || !searchParam) return;
        setFetching(true);
        
        axios.get(`https://outdns.ir/api/dns-profile/search/${searchParam}`)
        .then((r)=>{
            if(r.status === 200){
                setDNSList(r.data);
            }else{
                setFetchError("Unable to fetch DNS List");
            }
        })
        .catch(()=>{
            setFetchError("Unable to fetch DNS List");
        })
        .finally(()=>{
            setFetching(false);
        });
    }

    const handleKeyDown = (e: React.KeyboardEvent)=>{
        if(e.code === "Enter"){
            search();
        }
    }

    return(
        <div ref={mainDivRef} className={(onlinePanelIsOpen ? "translate-0" : "translate-y-full") + " absolute top-0 left-0 w-full h-full z-30 bg-zinc-900/90 duration-300 ease-in-out flex justify-center items-center"}>
            <ChevronDown onClick={()=>{setOnlinePanelIsOpen(false)}} className="absolute top-1 right-1 bg-zinc-900 rounded-full"></ChevronDown>

            <div className="w-11/12 h-10/12 bg-zinc-900 ring ring-black rounded-xl flex flex-wrap gap-2 justify-start content-start p-2 overflow-y-scroll scrollbar-none relative peer">
                {/* search */}
                <div className="w-full h-9 rounded-full ring ring-black px-4 mb-2 relative flex items-center">
                    <input onKeyDown={handleKeyDown} onChange={(e)=>{setSearchParam(e.currentTarget.value)}} type="text" name="param" id="param" placeholder="Search For" className="outline-none w-full h-full"/>
                    <Search onClick={search} className="absolute right-2 text-blue-700 z-20 bg-zinc-900 rounded-full hover:-rotate-45 duration-300"/>
                </div>
                {/* dns list */}
                {DNSList?.map((dns, key)=>(
                    <div id={dns.id} key={key} className="w-full min-h-9 h-9 bg-zinc-800 rounded-md group duration-300 relative overflow-hidden">
                        <div onClick={()=>{insertFetchedDNS(dns.id, dns.name, dns.primary, dns.secondary)}} className="absolute rounded p-1 bg-blue-700 top-1 right-2"><Plus className="hover:rotate-90 duration-300" width={20} height={20}/></div>
                        <div onClick={openDetails} className="absolute rounded p-1 bg-amber-600 top-1 left-2"><ChevronDown className="rotate-0 duration-300" width={20} height={20}/></div>
                        <div className="w-full flex items-center justify-center duration-300">
                            <p className="py-1">{dns.name}</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className="w-11/12 flex justify-center items-center mt-4 gap-2 bg-zinc-950 rounded-md">
                                <p>{dns.primary}</p>
                                <span className="font-serif">|</span> 
                                <p>{dns.secondary}</p>
                            </div>

                            <div className="flex truncate gap-2 pl-2 mt-5">
                                <p className="opacity-70">Suggested By:</p>
                                <p>{dns.suggestedBy}</p>
                            </div>

                            <div className="w-11/12 bg-zinc-950 mt-5 flex flex-col gap-5 rounded-md">
                                {Object.entries(dns.description).map((description, key)=>(
                                    <div key={key} className="w-full flex flex-col items-center">
                                        <p className="opacity-70">{description[0]}:</p>
                                        <div className="w-11/12 text-sm text-pretty break-before-all line-clamp-4">
                                            <p>{description[1]}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full my-2 px-2">
                            {dns.recommended && (
                                <CircleCheckBig color="green"></CircleCheckBig>
                            )}
                        </div>
                    </div>
                ))}

            </div>

            <div className="w-10/12 flex justify-between absolute bottom-0 p-2 backdrop-blur-3xl rounded-t-2xl ring ring-[#8d8d8d2f] peer-hover:translate-y-full translate-0 duration-300">
                <ChevronLeft onClick={fetchLess}/>
                <RefreshCcw onClick={reload} className="hover:rotate-180 duration-500 ease-in-out"/>
                <ChevronRight onClick={fetchMore}/>
            </div>

            {fetching !== undefined && (
                <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full bg-zinc-900 text-center z-40">
                    <p className="text-red-800 text-xl">{fetchError}</p>
                </div>
            )}
            {fetching && (
                <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full bg-zinc-900 text-center z-40">
                    <p className="text-blue-700 text-xl">Loading...</p>
                </div>
            )}

        </div>
    );
}