import { config } from "@/lib/config";

export const getToken =()=> {
    const token = localStorage.getItem("cookieFallback");
    if (!token) {
        return null
    }
    const obj:{[x:string]:string}  = JSON.parse(token);
    if (obj[`a_session_${config.APPWRITE_PROJECT_ID}`]) {
        return obj[`a_session_${config.APPWRITE_PROJECT_ID}`]
    }
    return null
}

export function generateRandomCode(limit:number = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomCode = '';
    
    for (let i = 0; i < limit; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomCode += characters[randomIndex];
    }

    return randomCode;
}