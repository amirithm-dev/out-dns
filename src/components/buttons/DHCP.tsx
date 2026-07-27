import { RotateCcw } from "lucide-react"
import { useLog } from "../../contexts/log-context";
import { invoke } from "@tauri-apps/api/core";
import { usePopup } from "../../contexts/popup-context";

export default function DHCP({selectedInterface}: {selectedInterface: string}){
    const {log} = useLog();
    const {showPopup} = usePopup();
    const setToDHCP = ()=>{
        log("processing... ⏳");
        invoke<string>("set_dns",{interface: selectedInterface,primary: "",secondary: ""})
        .then(()=>{
            showPopup("success");
            log(`DNS set to DHCP for ${selectedInterface} ✅`);
        })
        .catch((error)=>{
            showPopup("warning");
            log(`${error} ❌`);
        });
    }

    return(
        <div onClick={setToDHCP} className="absolute top-1/2 right-0 -translate-y-1/2 group">
            <div className="flex justify-center items-center gap-2 bg-amber-300 rounded-l-full p-1 drop-shadow-2xl translate-x-14 hover:translate-0 duration-300 ease-in-out select-none">
                <RotateCcw color="#111111" className="group-hover:rotate-180 duration-300 ease-in-out"></RotateCcw>
                <p className="font-[f3]">DHCP</p>
            </div>
        </div>
    );
}