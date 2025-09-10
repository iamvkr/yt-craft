"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BtnWaitList = ({ popular }: { popular: boolean }) => {
  const [isOpen, setisOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleClick = () => {
    if (popular) {
      setisOpen(true);
    } else {
      router.push("/signup");
    }
  };

  const joinWaitlist = async () => {
    if (!email.trim()) {
      toast.error("value cannot be empty");
      return false;
    }
    setloading(true);
    try {
      const res = await fetch(`/api/v1/waitlist`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
    setloading(false);
    setisOpen(false);
  };
  return (
    <>
      <Button
        onClick={handleClick}
        className="w-full py-6 text-lg font-semibold cursor-pointer"
        variant={popular ? "default" : "outline"}
      >
        {popular ? "Join Waitlist" : "Get Started"}
      </Button>

      {/* DIALOG FOR JOIN WAITLIST */}
      <Dialog
        open={isOpen}
        onOpenChange={(status) => {
          setisOpen(status);
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join Waitlist</DialogTitle>
              <DialogDescription>Enter your email</DialogDescription>
            </DialogHeader>
            <div>
              <Input
                id="user-email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading} onClick={joinWaitlist}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                Join
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default BtnWaitList;
