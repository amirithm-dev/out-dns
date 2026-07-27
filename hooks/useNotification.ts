import { sendNotification } from "@tauri-apps/plugin-notification";

export function useNotification(){
    const send = ({title, body}: {title: string, body: string})=>{
        sendNotification({
            title: title,
            body: body,
        });
    }

    return{send};
}