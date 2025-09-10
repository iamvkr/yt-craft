"use client";
import SidebarEdit from "@/components/SidebarEdit/SidebarEdit";
import { Button } from "@/components/ui/button";
import type { ChannelDataType, ConfigurationType } from "@/types";
import { getToken } from "@/helpers";
import { defaultConfiguration } from "@/defaultConfigs";
import { useMyStore } from "@/zustand/store";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import PreviewComponent from "@/components/PreviewComponent";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import BouncyLoader from "@/components/BouncyLoader";

const ProjectView = () => {
  const {
    userProjects,
    setUserProjects,
    currentConfig,
    setCurrentConfig,
    currentChannelData,
    setCurrentChannelData,
  } = useMyStore();
  const { id: projectId }: { id: string } = useParams();
  const project = useMemo(() => {
    return userProjects.find((p) => p.id === projectId);
  }, [projectId]);
  //   const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [publishDialogOpen, setpublishDialogOpen] = useState(false);
  const [userChHandle, setuserChHandle] = useState("");

  const [isSidebarOpen, setisSidebarOpen] = useState(true);

  const [currError, setcurrError] = useState("");

  useEffect(() => {
    // check for configuration from user project.
    if (userProjects) {
      if (!project) {
        toast.error("Project not found!!!");
      } else {
        (async () => {
          /** 1. get channel latest data: */
          let cData = {} as ChannelDataType;
          const cache = sessionStorage.getItem("cData");
          if (cache) {
            console.log("using cacahed cData ");
            cData = JSON.parse(cache);
          } else {
            setIsLoading(true);
            const token = getToken();
            if (!token) {
              toast.error("Something went Wrong!!");
              setIsLoading(false);
              return false;
            }
            const dataResponse = await fetch(
              `/api/v1/channeldata?channelId=${project.channelId}`,
              {
                method: "GET",
                headers: {
                  authorization: `bearer ${token}`,
                },
              }
            );
            const res = await dataResponse.json();
            if (res.success) {
              cData = res.data;
              //   cache results:
              sessionStorage.setItem(`cData`, JSON.stringify(cData));
            } else {
              toast.error(res.message);
              setIsLoading(false);
              return false;
            }
          }
          /** 2. set data */
          if (!project.configs) {
            console.log("using default config");
            // project config is empty: use from defaultConfigs.ts
            setCurrentConfig(defaultConfiguration);
            setCurrentChannelData(cData);
          } else {
            console.log("using config from DB");
            const savedConfigs = JSON.parse(project.configs);
            setCurrentConfig(savedConfigs);
            // channel title and description might be custom in configs, hence should be updated
            setCurrentChannelData({
              ...cData,
              metadata: {
                ...cData.metadata,
                title: savedConfigs.title,
                description: savedConfigs.description,
              },
            });
          }
          setIsLoading(false);
        })();
      }
    }
  }, []);

  const handlePublish = async () => {
    if (currentConfig) {
      const finalConfig: ConfigurationType = {
        ...currentConfig,
        title: currentChannelData!.metadata.title,
        description: currentChannelData!.metadata.description,
      };
      console.log({ finalConfig });
      //   const project = userProjects.find((p) => p.id === projectId);
      console.log({ project });

      setIsPublishing(true);
      const token = getToken();
      if (!token) {
        toast.error("Something went Wrong!!");
        setIsPublishing(false);
        return false;
      }
      const dataResponse = await fetch(`/api/v1/publish`, {
        method: "POST",
        headers: {
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          rowId: project?.id,
          data: {
            configs: JSON.stringify(finalConfig),
            chHandle: "@" + userChHandle.trim(),
          },
        }),
      });
      const res = await dataResponse.json();
      if (res.success) {
        toast.success(res.message);
        // we need to update in store with user chHandle to mark item as published:
        setUserProjects(
          userProjects.map((item) => {
            if (item.id === projectId) {
              return {
                ...item,
                chHandle: "@" + userChHandle.trim(),
                configs: JSON.stringify(finalConfig),
              };
            }
            return item;
          })
        );
      } else {
        toast.error(res.message);
      }
      setIsPublishing(false);
      setpublishDialogOpen(false);
      window.history.back();
    }
  };

  const handleUpdateSite = async () => {
    /** site is already published! we need to just update config */
    if (currentConfig) {
      const finalConfig: ConfigurationType = {
        ...currentConfig,
        title: currentChannelData!.metadata.title,
        description: currentChannelData!.metadata.description,
      };
      console.log({ finalConfig });
      // const project = userProjects.find((p) => p.id === projectId);
      console.log({ project });

      setIsUpdating(true);
      const token = getToken();
      if (!token) {
        toast.error("Something went Wrong!!");
        setIsUpdating(false);
        return false;
      }
      const dataResponse = await fetch(`/api/v1/project`, {
        method: "PATCH",
        headers: {
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          rowId: project?.id,
          data: {
            configs: JSON.stringify(finalConfig),
          },
        }),
      });
      const res = await dataResponse.json();
      if (res.success) {
        toast.success(res.message);
        // we need to update in store with user chHandle to mark item as published:
        setUserProjects(
          userProjects.map((item) => {
            if (item.id === projectId) {
              return {
                ...item,
                configs: JSON.stringify(finalConfig),
              };
            }
            return item;
          })
        );
      } else {
        toast.error(res.message);
      }
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex w-full  mx-auto h-[calc(100vh_-_4rem)] overflow-y-auto px-4">
      <div className="flex flex-col gap-y-4 w-full py-4 h-full pb-10">
        <div
          className={`${
            currentConfig && currentChannelData ? "h-full" : "min-h-80"
          } flex items-center justify-center flex-col gap-4 w-full`}
        >
          {/* main section */}
          {currentConfig && currentChannelData ? (
            <div className="w-full h-full">
              <div className="h-10">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 cursor-pointer">
                    {isSidebarOpen ? (
                      <ChevronLeft
                        onClick={() => {
                          setisSidebarOpen(!isSidebarOpen);
                        }}
                      />
                    ) : (
                      <ChevronRight
                        onClick={() => {
                          setisSidebarOpen(!isSidebarOpen);
                        }}
                      />
                    )}
                    <h5 className="text-xl">Site Settings</h5>
                  </div>
                  <div className="flex gap-2">
                    {!project?.chHandle ? (
                      <Button
                        size={"sm"}
                        onClick={() => {
                          setpublishDialogOpen(true);
                        }}
                      >
                        Publish
                      </Button>
                    ) : (
                      <Button
                        size={"sm"}
                        onClick={handleUpdateSite}
                        disabled={isUpdating}
                      >
                        {isUpdating && (
                          <Loader2 className="size-4 animate-spin" />
                        )}
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`grid h-[95%] w-full ${
                  isSidebarOpen ? "grid-cols-[20%_80%]" : "grid-cols-1"
                }`}
              >
                {isSidebarOpen && (
                  <div className="w-full h-full overflow-y-auto">
                    <SidebarEdit />
                  </div>
                )}

                <div className="w-full h-full overflow-y-auto ps-2">
                  <PreviewComponent
                  // configuration={currentConfig}
                  // channelData={currentChannelData}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="flex items-center flex-col">
                  <BouncyLoader className="bg-black dark:bg-white"/>
                  <br />
                  Please wait while we setup your page!
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* DIALOG FOR CONFIRM PUBLISH */}
      <Dialog
        open={publishDialogOpen}
        // onOpenChange={(status) => {
        //   setpublishDialogOpen(status);
        // }}
      >
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Publish</DialogTitle>
              <DialogDescription>Choose your handle</DialogDescription>
            </DialogHeader>
            <div className="flex items-center border-2 rounded-lg ps-1">
              <Label htmlFor="handlech">{window.location.origin}/c/@</Label>
              <Input
                type="text"
                id="handlech"
                placeholder="channelname"
                className={
                  "border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                }
                value={userChHandle}
                onChange={(e) => {
                  setuserChHandle(e.target.value);
                }}
              />
            </div>
            <div>
              {currError && (
                <p className="text-xs text-destructive">{currError}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={isPublishing}
                  onClick={() => {
                    setpublishDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPublishing}
                onClick={() => {
                  if (!userChHandle.trim()) {
                    setcurrError("handle cannot be empty! ");
                    return false;
                  }
                  if (userChHandle.trim().length < 3) {
                    setcurrError("Min length should be 3 ");
                    return false;
                  }
                  if (!/^[a-z0-9]+$/.test(userChHandle.trim())) {
                    setcurrError("Only lowercase a-z and 0-9");
                    return false;
                  }
                  setcurrError("");
                  handlePublish();
                }}
              >
                {isPublishing && <Loader2 className="size-4 animate-spin" />}
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default ProjectView;
