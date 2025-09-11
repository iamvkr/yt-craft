"use client";
import { createMyJWT } from "@/lib/appwrite/auth";
// import { useMyStore } from "@/zustand/store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const HandlePage = () => {
  const { status } = useParams();
  const router = useRouter();
  const [Message, setMessage] = useState("Loading...");

  useEffect(() => {
    if (status === "fail") {
      const url = new URL(window.location.href);
      const search = url.searchParams;
      const err = search.get("error");
      if (err) {
        const js = JSON.parse(err);
        setMessage(js.message);
      }
    } else if (status === "success") {
      (async () => {
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
    }
  }, [status]);

  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      {Message}
    </div>
  );
};

export default HandlePage;
