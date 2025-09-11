"use client";
import { createMyJWT } from "@/lib/appwrite/auth";
// import { useMyStore } from "@/zustand/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SuccessPage = () => {
  const [Message, setMessage] = useState(
    "Login success.. Please wait Redirecting..."
  );
  const router = useRouter();
//   const { setUser } = useMyStore();
  useEffect(() => {
    (async () => {
    //   const res = await getUser();
    //   if (res.data) {
    //     setUser(res.data);
    //   } else {
    //     setMessage("Something went Wrong! Try Again");
    //     return false;
    //   }
      /** ! create a jwt and save to localstorage */
      const jwt = await createMyJWT();
      if (jwt) {
        localStorage.setItem("JWT", jwt);
        //  redirect to dashboard
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1500);
      } else {
        setMessage("Failed to create token! Try Again");
      }
    })();
  }, []);

  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      {Message}
    </div>
  );
};

export default SuccessPage;
