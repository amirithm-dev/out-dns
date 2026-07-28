import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { DNSEntry, SelectedDNS } from "../../types";
import { invoke } from "@tauri-apps/api/core";
import { useLog } from "./log-context";

type DNSContextType = {
    selectedDNS: SelectedDNS,
    setSelectedDNS: Dispatch<SetStateAction<SelectedDNS>>,

    primaryDNS: string,
    setPrimaryDNS: Dispatch<SetStateAction<string>>,

    secondaryDNS: string,
    setSecondaryDNS: Dispatch<SetStateAction<string>>,

    DNSList: DNSEntry[],
    setDNSList: Dispatch<SetStateAction<DNSEntry[]>>,

    fetchDNSList: () => void,
}

const DNSContext = createContext<DNSContextType>({
    selectedDNS: {name: "", primary: "", secondary: ""},
    setSelectedDNS: ()=> {},

    primaryDNS: "",
    setPrimaryDNS: ()=> {},

    secondaryDNS: "",
    setSecondaryDNS: () => {},

    DNSList: [{id: "", name: "", primary_dns: "", secondary_dns: ""}],
    setDNSList: () => {},

    fetchDNSList: () => {},
});

export default function DNSProvider({children}: {children: ReactNode}){
    const {log} = useLog();

    const [selectedDNS, setSelectedDNS] = useState<SelectedDNS>({name: "Default DNS", primary: "", secondary: ""});
    const [primaryDNS, setPrimaryDNS] = useState<string>("");
    const [secondaryDNS, setSecondaryDNS] = useState<string>("");

    const [DNSList, setDNSList] = useState<DNSEntry[]>([]);

    function fetchDNSList(): void{
        invoke<DNSEntry[]>("get_dns_from_db")
        .then(result => setDNSList(result))
        .catch((error)=>{
            log(`${error} ❌`);
        });

    }
    useEffect(()=>{
        fetchDNSList();
    },[]);

    // sync dns servers with selected profile
    useEffect(() => {
        setPrimaryDNS(selectedDNS.primary);
        setSecondaryDNS(selectedDNS.secondary);
    }, [selectedDNS]);

    return(
        <DNSContext.Provider value={{
            selectedDNS: selectedDNS,
            setSelectedDNS: setSelectedDNS,

            primaryDNS: primaryDNS,
            setPrimaryDNS: setPrimaryDNS,

            secondaryDNS: secondaryDNS,
            setSecondaryDNS: setSecondaryDNS,

            DNSList: DNSList,
            setDNSList: setDNSList,

            fetchDNSList: fetchDNSList,
        }}>
            {children}
        </DNSContext.Provider>
    );
}

export function useDNS(){
    return useContext(DNSContext);
}