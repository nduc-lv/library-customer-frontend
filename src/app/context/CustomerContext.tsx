'use client'
import { createContext, useEffect, useState} from "react";
import CustomerInterface from "../interfaces/CustomerInterface";
import http from "../utils/http";
export const UserContext = createContext({
    id: "",
    setState: (state:any) => {},
    getCustomerId: (accessToken: string) => {},
    state: false
});
export function UserProvider({children}: any) {
    const [id, setId] = useState<string>(""); 
    const [state, setState] = useState<boolean>(false);
    const getCustomerId = async (accessToken: string) => {
        try {
            console.log("get id first");
            const data = await http.getWithAutoRefreshToken("/getCustomerId", {useAccessToken:true});
            setId(curr => data.customerId);
            console.log(data);
        }
        catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            // fetch customer id here
            getCustomerId(accessToken);
        }
        else if (!accessToken){
            setId(curr => "");
            console.log("need to login");
        }
        // 
    }, [state])
    
    // call api to set interests
    return (
        <UserContext.Provider value ={
            {id, setState, getCustomerId, state}
        }>
            {children}
        </UserContext.Provider> 
    )
}