import { useEffect, useRef, useState } from "react";

import init_tray from "./lib/tray";
import HMenu from "./components/menu-btn";
import MenuLayout from "./components/menu/Layout";
import ClearCacheButton from "./components/clear-cache-btn";
import SetDNSButton from "./components/set-DNS-btn";
import { useLog } from "./contexts/log-context";
import { usePopup } from "./contexts/popup-context";
import { check } from "@tauri-apps/plugin-updater";
import { useNotification } from "../hooks/useNotification";
import TitleBar from "./components/titlebar";
import DnsServersInp from "./components/dns-servers-inp";
import DHCP from "./components/DHCP-btn";
import NetworkInterfacesList from "./components/network-interfaces-list";
import DNSServersList from "./components/dns-servers-list";

function App() {
    
  const [menuStatus, setMenuStatus] = useState(false);
  const logRef = useRef<HTMLTextAreaElement>(null);

  const {logContent,log} = useLog();
  const {showPopup} = usePopup();
  const {send} = useNotification();

  // initialize the tray icon
  useEffect(()=>{
    init_tray(log,showPopup).catch((err) => console.error("Failed to init tray:", err));
  },[]);

  // scroll the log to end 
  useEffect(()=>{
    if(logRef.current){
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  },[logContent]);

  // check for update 
  useEffect(()=>{
    check()
    .then((update)=>{
      if(update !== null){
        send({
          title: "Out DNS",
          body: "Update available. Pleas update Out DNS from update menu"
        });
      }
    })
    .catch(()=>{});
  },[]);

  return (
    <main className="bg-zinc-900 overflow-hidden min-w-screen min-h-screen rounded-lg drop-shadow-2xl outline-none">

      <TitleBar></TitleBar>
      <HMenu setMenuStatus={setMenuStatus}></HMenu>
      <MenuLayout menuStatus={menuStatus} setMenuStatus={setMenuStatus}></MenuLayout>

      <NetworkInterfacesList></NetworkInterfacesList>

      <DNSServersList></DNSServersList>

      <DnsServersInp></DnsServersInp>

      <DHCP></DHCP>

      <div className="absolute bottom-5 right-5 flex flex-col gap-4 text-[#f0f0f0] font-[f1]">
        <SetDNSButton></SetDNSButton>
        <ClearCacheButton></ClearCacheButton>
      </div>

      <div className="w-87.5 h-25 bg-[#303030] p-0 m-0 rounded-md absolute bottom-5 left-5 overflow-hidden group">
          <div className="w-75 h-75 border-zinc-900 border-20 rounded-full top-5 left-20 absolute"></div>
          <textarea name="log" id="log" placeholder="logs..." className="resize-none outline-none border-0 p-2 absolute inset-0 overflow-y-auto overflow-x-hidden bg-transparent text-[#ccc] z-10 w-full h-full scrollbar-thin scrollbar-thumb-zinc-950 scroll-smooth font-mono text-[0.8rem]" readOnly value={logContent.join('\n')} ref={logRef}></textarea>
      </div>

    </main>
  );
}

export default App;

