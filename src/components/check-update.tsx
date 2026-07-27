import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";
import { useEffect } from "react";

export default function CheckUpdate() {

    // async function send() {
    //     let permissionGranted = await isPermissionGranted();
    //     if(!permissionGranted){
    //         const permission = await requestPermission();
    //         permissionGranted = permission === "granted";
    //     }
    //     if(permissionGranted){
    //         sendNotification({
    //             title: "Out DNS",
    //             body: "Update available. Pleas update Out DNS from update menu",
    //         });
    //     }
    // }

    useEffect(()=>{
  (async () => {
    console.log("before");

    try {
      const granted = await isPermissionGranted();
      console.log("granted", granted);

      const permission = await requestPermission();
      console.log("permission", permission);

      sendNotification("Hello!");
      console.log("after");
    } catch (e) {
      console.error(e);
    }
  })();
    },[]);

    return(
        <div>
            <p></p>
        </div>
    );
}