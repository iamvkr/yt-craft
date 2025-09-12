"use client";
import ProjectCard from "@/components/projectcard/ProjectCard";
import { Button } from "@/components/ui/button";
import { listProjects } from "@/lib/appwrite/db";
import { useMyStore } from "@/zustand/store";
import { Eye, Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getJwt } from "@/helpers/jwtManager";

const Dashboard = () => {
  const { user, userProjects, setUserProjects } = useMyStore();
  const [isOpen, setisOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const [isLoading, setisLoading] = useState(false);
  const [fetchFinished, setfetchFinished] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);

  const [currErrorMsg, setcurrErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      //   get user projects:
      if (userProjects.length <= 0 && user) {
        setisLoading(true);
        // fetch for projects:
        const { status, data, message } = await listProjects(user.$id);
        if (status && data) {
          setUserProjects(
            data.rows.map((item) => ({
              id: item.$id,
              user_id: item.user_id,
              channelId: item.channelId,
              channelImage: item.channelImage,
              title: item.title,
              verified: item.verified,
              configs: item.configs,
              chHandle: item.chHandle,
            }))
          );
          setisLoading(false);
          setfetchFinished(true);
        } else {
          console.log("ERROR", message);
          setisLoading(false);
          setfetchFinished(true);
        }
      } else {
        setisLoading(false);
        setfetchFinished(true);
      }
    })();
  }, []);

  const handleSubmitCreateNew = async (
    // e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const input = document.getElementById("channelLink") as HTMLInputElement;
    if (!input) {
      return false;
    }
    const url = input.value;
    if (!url?.trim() || !url.includes("https://") || !url.includes("youtube")) {
      setcurrErrorMsg("Invalid Url");
      return false;
    }
    // get token:
    const token = await getJwt();
    if (!token) {
      setcurrErrorMsg("Something went Wrong!!");
      return false;
    }
    setcurrErrorMsg("");
    setisSubmitting(true);
    // create a new project:
    const response = await fetch(`/api/v1/project`, {
      method: "POST",
      body: JSON.stringify({
        url: url,
      }),
      headers: {
        authorization: `bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!result.success) {
      setcurrErrorMsg(result.message);
      setisSubmitting(false);
      return false;
    }
    toast.success(result.message);
    // need to update the projects list in store:
    setUserProjects([
      ...userProjects,
      {
        id: result.data.id,
        user_id: result.data.user_id,
        channelId: result.data.channelId,
        channelImage: result.data.channelImage,
        title: result.data.title,
        verified: result.data.verified,
        configs: result.data.configs,
        chHandle: result.data.chHandle,
      },
    ]);
    // close dialog
    setisSubmitting(false);
    setisOpen(false);
  };

  return (
    <div className="font-sans">
      <div className="flex w-full xl:max-w-[80%] mx-auto h-[calc(100vh_-_4rem)] overflow-y-auto px-4">
        <div className="flex flex-col gap-y-10 w-full py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              My Projects <span>{`( ${userProjects.length}/1 )`}</span>
            </h2>
            <Button
              variant={"default"}
              onClick={() => {
                setisOpen(true);
              }}
              disabled={userProjects.length >= 1}
            >
              {" "}
              <Plus className="size-4" /> Create New
            </Button>
          </div>

          {isLoading && (
            <div>
              <Loader2 className=" animate-spin" />
            </div>
          )}

          {userProjects && userProjects.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/*  projects cards */}
              {userProjects.map((item, i) => (
                <ProjectCard key={i} item={item} />
              ))}
            </div>
          ) : (
            !isLoading &&
            fetchFinished && (
              <div className="text-center w-full">
                No Items found!
                <br />
                Click + to Create New
              </div>
            )
          )}
        </div>
      </div>

      {/* dialog */}
      <Dialog
        open={isOpen}
        onOpenChange={(status) => {
          setisOpen(status);
        }}
      >
        <form id="create-new-form">
          {/* <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger> */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Project</DialogTitle>
              <DialogDescription>Select Your Template</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div
                className="box h-40 overflow-y-auto flex items-center gap-x-2"
                style={{ scrollbarWidth: "none" }}
                onWheel={(e) => {
                  if (e.deltaY > 0) e.currentTarget.scrollLeft += 100;
                  else e.currentTarget.scrollLeft -= 100;
                }}
                onClick={(event) => {
                  const div = event.target as HTMLDivElement;
                  if (div.tagName === "DIV") {
                    setSelectedTemplate(0); // always choose 1st template
                    // uncomment below LATER when using multiple templated
                    // setSelectedTemplate(Number(div.id.split("-")[1]));
                  }
                }}
              >
                {/* <div className="flex items-center gap-x-2"> */}
                <div
                  id="template-0"
                  className={`template h-full rounded-xl w-60 border shrink-0 flex items-center justify-center flex-col gap-2 bg-[#1C1C1C] ${
                    selectedTemplate === 0 && "border-slate-400 border-4"
                  }`}
                >
                  <span className="text-white">Mordern Minimilist</span>
                  <Button variant={"outline"} size={"sm"}
                  onClick={()=>{window.open("https://ytcraft.appwrite.network/c/@youtube")}}>
                    <Eye />
                    Preview
                  </Button>
                </div>
                <div
                  id="template-1"
                  className={`template h-full rounded-xl w-60 border shrink-0 flex items-center justify-center flex-col gap-2 bg-[#800020] ${
                    selectedTemplate === 1 && "border-slate-400 border-4"
                  }`}
                >
                  <span className="text-white">Classic</span>
                  <Button variant={"outline"} size={"sm"} disabled={true}>
                    <Eye />
                    comming soon
                  </Button>
                </div>
                <div
                  id="template-2"
                  className={`template h-full rounded-xl w-60 border shrink-0 flex items-center justify-center flex-col gap-2 bg-[#9B5DE5] ${
                    selectedTemplate === 2 && "border-slate-400 border-4"
                  }`}
                >
                  <span className="text-white">Pop</span>
                  <Button variant={"outline"} size={"sm"} disabled={true}>
                    <Eye />
                    comming soon
                  </Button>
                </div>
                {/* </div> */}
              </div>
              {/* <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div> */}
              <div className="grid gap-3">
                <Label htmlFor="channelLink">Youtube Channel Link</Label>
                <Input
                  type="url"
                  id="channelLink"
                  name="channelUrl"
                  placeholder="paste your Channel Link"
                />
              </div>
              <div>
                <p className="text-xs text-destructive">{currErrorMsg}</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={handleSubmitCreateNew}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className=" animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default Dashboard;
