"use client";
import { Button } from "@/components/ui/button";
import { getUser, logoutUser } from "@/lib/appwrite/auth";
import { useMyStore } from "@/zustand/store";
import { Loader2, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ManagePage = () => {
  const { user, setUser } = useMyStore();
  const [isLoggingOut, setisLoggingOut] = useState(false);
  const router = useRouter();
  useEffect(() => {
    (async () => {
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

  return (
    <div className="flex items-center justify-center w-full min-h-[50vh]">
      {user ? (
        <>
          <div className="max-w-lg min-w-sm mx-auto  rounded-lg shadow-lg overflow-hidden border">
            {/* Logo */}
            <div className="flex justify-center py-4 ">
              <UserCircle className="w-16 h-16 rounded-full" />
            </div>

            {/* Name and Email */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-semibold 0">{user.name}</h2>
              {user.email && <p className="text-sm mt-2">{user.email}</p>}
            </div>

            {/* Edit Button */}
            <div className="px-6 py-4 flex justify-center">
              <Button
                className="px-4 py-2"
                disabled={isLoggingOut}
                onClick={async () => {
                  setisLoggingOut(true);
                  const res = await logoutUser();
                  if (res.success) {
                    toast.success(res.message);
                    router.replace("/");
                    setTimeout(() => {
                      window.location.reload();
                    }, 200);
                  }
                  setisLoggingOut(false);
                }}
              >
                {isLoggingOut && <Loader2 className="animate-spin" />}
                Logout
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div>LOADING...</div>
      )}
    </div>
  );
};

export default ManagePage;
