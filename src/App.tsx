import { useEffect, useRef, useState } from "react";

import init_tray from "./lib/tray";
import HMenu from "./components/buttons/HMenu";
import MenuLayout from "./components/menu/Layout";
import ClearCacheButton from "./components/buttons/ClearCacheButton";
import SetDNSButton from "./components/buttons/SetDNSButton";
import NetworkInterfaces from "./components/comboBox/network-interfaces";
import DnsServersInp from "./components/input/dns-servers-inp";
import TitleBar from "./components/titlebar/titlebar";
import DnsList from "./components/comboBox/dns-servers";
import { useLog } from "./contexts/logContext";
import { usePopup } from "./contexts/popupContext";
import DHCP from "./components/buttons/DHCP";
import CheckUpdate from "./components/check-update";
function App() {
  interface SelectedDns{
    name: string;
    primary: string;
    secondary: string;
  }
  const [selectedDns, setSelectedDns] = useState<SelectedDns>({name: "Default DNS", primary: "", secondary: ""});
  const [selectedInterface, setSelectedInterface] = useState<string>("All Networks");
  
  const [primaryDns, setPrimaryDns] = useState<string>("");
  const [secondaryDns, setSecondaryDns] = useState<string>("");
  
  const [menuStatus, setMenuStatus] = useState(false);
  const logRef = useRef<HTMLTextAreaElement>(null);

  const {logContent,log} = useLog();
  const {showPopup} = usePopup();

  useEffect(()=>{
    init_tray(log,showPopup).catch((err) => console.error("Failed to init tray:", err));
  },[]);
  
  useEffect(() => {
    setPrimaryDns(selectedDns.primary);
    setSecondaryDns(selectedDns.secondary);
  }, [selectedDns]);

  useEffect(()=>{
    if(logRef.current){
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  },[logContent]);

  return (
    <main className="bg-zinc-900 overflow-hidden min-w-screen min-h-screen rounded-lg drop-shadow-2xl outline-none">

      <TitleBar></TitleBar>
      <HMenu setMenuStatus={setMenuStatus}></HMenu>
      <MenuLayout menuStatus={menuStatus} setMenuStatus={setMenuStatus}></MenuLayout>

      <NetworkInterfaces selectedInterface={selectedInterface} setSelectedInterface={setSelectedInterface}></NetworkInterfaces>

      <DnsList selectedDns={selectedDns} setSelectedDns={setSelectedDns}></DnsList>

      <DnsServersInp primaryDns={primaryDns} setPrimaryDns={setPrimaryDns} secondaryDns={secondaryDns} setSecondaryDns={setSecondaryDns}></DnsServersInp>

      <DHCP selectedInterface={selectedInterface}></DHCP>

      <div className="absolute bottom-5 right-5 flex flex-col gap-4 text-[#f0f0f0] font-[f1]">
        <SetDNSButton selectedInterface={selectedInterface} primaryDns={primaryDns} secondaryDns={secondaryDns}></SetDNSButton>
        <ClearCacheButton></ClearCacheButton>
      </div>

      <div className="w-87.5 h-25 bg-[#303030] p-0 m-0 rounded-md absolute bottom-5 left-5 overflow-hidden group">
          <div className="w-75 h-75 border-zinc-900 border-20 rounded-full top-5 left-20 absolute"></div>
          <textarea name="log" id="log" placeholder="logs..." className="resize-none outline-none border-0 p-2 absolute inset-0 overflow-y-auto overflow-x-hidden bg-transparent text-[#ccc] z-10 w-full h-full scrollbar-thin scrollbar-thumb-zinc-950 scroll-smooth font-mono text-[0.8rem]" readOnly value={logContent.join('\n')} ref={logRef}></textarea>
      </div>

      <CheckUpdate></CheckUpdate>

    </main>
  );
}

export default App;

