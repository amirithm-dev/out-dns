import { invoke } from "@tauri-apps/api/core";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

type InterfaceContextType = {
    selectedInterface: string,
    setSelectedInterface: Dispatch<SetStateAction<string>>,

    interfaceList: string[],
    setInterfaceList: Dispatch<SetStateAction<string[]>>,

    fetchInterfaceList: ()=> void,
}

const InterfaceContext = createContext<InterfaceContextType>({
    selectedInterface: "",
    setSelectedInterface: ()=> {},

    interfaceList: [],
    setInterfaceList: ()=> {},

    fetchInterfaceList: ()=> {},
});

export default function InterfaceProvider({children}: {children: ReactNode}){
    const [selectedInterface, setSelectedInterface] = useState<string>("All Networks");
    const [interfaceList, setInterfaceList] = useState<string[]>([]);

    function fetchInterfaceList(){
        invoke<string[]>("get_interfaces").then((interfaces) => {
            setInterfaceList(interfaces);
        });
    }
    useEffect(()=>{
        fetchInterfaceList();
    },[]);

    return(
        <InterfaceContext.Provider value={{ 
            selectedInterface: selectedInterface,
            setSelectedInterface: setSelectedInterface,

            interfaceList: interfaceList,
            setInterfaceList: setInterfaceList,

            fetchInterfaceList: fetchInterfaceList,
         }}>
            {children}
        </InterfaceContext.Provider>
    );
}

export function useInterface(){
    return useContext(InterfaceContext);
}