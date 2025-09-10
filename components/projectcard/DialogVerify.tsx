"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { generateRandomCode } from "@/helpers";
import { useMyStore } from "@/zustand/store";
import { getJwt } from "@/helpers/jwtManager";

const DialogVerify = ({
  isOpen,
  setisOpen,
  item,
}: {
  isOpen: boolean;
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: {
    id: string;
    title: string;
    channelId: string;
    channelImage: string;
    verified: boolean | null;
  };
}) => {
  const { setUserProjects, userProjects } = useMyStore();
  const [loading, setloading] = useState(false);
  const verificationCode = generateRandomCode(10);
  const verifyProject = async () => {
    setloading(true);
    const token = await getJwt();
    if (token) {
      const res = await fetch(`/api/v1/verify`, {
        method: "POST",
        body: JSON.stringify({
          code: verificationCode,
          channelId: item.channelId,
          docId: item.id,
        }),
        headers: {
          authorization: `bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!result.success) {
        toast.error(result.message);
        setloading(false);
        return false;
      }
      toast.success(result.message);

      //   update in store
      setUserProjects(
        userProjects.map((project) => {
          if (project.id === item.id) {
            return { ...project, verified: true };
          }
          return project;
        })
      );
    }
    setloading(false);
    setisOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(status) => {
        setisOpen(status);
      }}
    >
      <form>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify</DialogTitle>
            {/* <DialogDescription>
              Select Your Template
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4">
            <h3 className="text-sm">
              To protect individual channel, we need quick verification. Follow
              simple steps to verify your channel.
            </h3>

            <div className="text-sm">
              <div className="mt-4 font-semibold">
                Step 1: Copy Your Unique Code
              </div>
              <div className="tracking-wide mb-4 mt-2 text-center flex justify-evenly">
                <div className="flex items-center">
                  <span className="border px-6 p-2">{verificationCode}</span>
                  {/* mobile */}
                  <Copy
                    className="xl:hidden size-4 border ms-4"
                    onClick={() => {
                      navigator.clipboard.writeText(String(verificationCode));
                      toast.success("copied to clipbaord!", {
                        position: "top-left",
                      });
                    }}
                  />
                  {/* desktop */}
                  <Copy
                    className="hidden xl:block size-4 border ms-4"
                    onClick={() => {
                      navigator.clipboard.writeText(String(verificationCode));
                      toast.success("copied to clipbaord!");
                    }}
                  />
                </div>
              </div>
              <div className="mb-2 font-semibold">
                Step 2: Add the Code to Your YouTube Video
              </div>
              <ol className="list-decimal list-inside text-sm flex flex-col gap-y-1">
                <li>Go to your YouTube Studio.</li>
                <li>Click on Content from the left menu</li>
                <li>Open your latest video.</li>
                <li>In the description box, paste the code you copied.</li>
                <li>Click Save.</li>
              </ol>
              <div className="mt-1 mb-4 text-sm">
                💡 Make sure the video is public
              </div>
              <div className="mt-1 mb-4 text-xs underline">
                Verify your channel till 30 oct 2025.
              </div>
              <div className="mb-2 font-semibold">Step 3: Confirm</div>
              <div className="text-sm">
                Once you&#34;ve added the code, click the &#34;Verify&#34; button below.
              </div>
              {/* <div className="mt-4">
                    <Button className="h-10 w-full flex justify-center">
                      Verify
                    </Button>
                  </div> */}
            </div>
            {/* <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div> */}
            {/* <div className="grid gap-3">
              <Label htmlFor="channelLink-1">Youtube Channel Link</Label>
              <Input type="url" id="channelLink-1" name="channel" placeholder="paste your Channel Link" />
            </div> */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={verifyProject} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />} Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DialogVerify;
