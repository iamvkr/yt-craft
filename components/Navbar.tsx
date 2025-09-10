"use client";
import React, { useState } from "react";
import { Loader2, Moon, Sun, UserCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useMyStore } from "@/zustand/store";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/lib/appwrite/auth";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const { setTheme } = useTheme();
  const { user } = useMyStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setisLoggingOut] = useState(false);
  return (
    !pathname.includes("/c/") && (
      <div className="h-16 border dark:text-white text-black font-sans">
        <div className="navbar h-full xl:max-w-[80%] mx-auto flex justify-between items-center px-4 xl:px-0">
          <div className="brand text-xl xl:text-3xl font-bold"><Link href={"/"}>Yt Craft</Link></div>

          {!user ? (
            <ul className="hidden xl:flex items-center gap-x-4 font-semibold">
              <li><a href="#">Home</a></li>
              <li><a href="#featuers">Featuers</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          ) : (
            <ul className="hidden xl:flex items-center gap-x-4 font-semibold">
              <li><a href="#">Home</a></li>
              <li><Link href={"/dashboard"}>Dashboard</Link></li>
              {/* <li><a href="#">My Account</a></li> */}
            </ul>
          )}

          <div suppressHydrationWarning className="flex items-center gap-3">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"link"} size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* user */}
            {user && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <UserCircle2 />
                      <span className="sr-only">Profile</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {}}>
                      Manage
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
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
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
        {isLoggingOut && (
          <div className="fixed top-0 left-0 h-screen w-full bg-black/20 z-[10] flex items-center justify-center">
            <Loader2 className="animate-spin size-10" />
          </div>
        )}
      </div>
    )
  );
};

export default Navbar;
