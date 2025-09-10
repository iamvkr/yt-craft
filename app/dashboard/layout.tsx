"use client";
import { account } from '@/lib/appwrite';
import { getUser } from '@/lib/appwrite/auth';
import { useMyStore } from '@/zustand/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const DashboardLayout = ({children}:Readonly<{
    children: React.ReactNode;
  }>) => {
    const { user, setUser } = useMyStore();
    const router = useRouter();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      (async () => {
        const ss = await account.getSession({sessionId:"current"});
        console.log("session:",{ss});
        
        // check login status:
        if (user === null) {
          // check login status
          const res = await getUser();
          if (res.data) {
            // loggedin:
            setUser(res.data);
          } else {
            setUser(false);
            router.replace("/signup");
          }
        } else if (user === false) {
          router.replace("/signup");
        }
      })();
    }, []);

  return (user &&
    <div>{children}</div>
  )
}

export default DashboardLayout