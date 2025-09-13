import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VideoTemplate from "./template/VideoTemplate";
import AboutTemplate from "./template/AboutTemplate";
import ContactTemplate from "./template/ContactTemplate";
import SocialsTemplate from "./template/SocialsTemplate";
import { Button } from "../ui/button";
import { Loader2, Stars } from "lucide-react";
import { useMyStore } from "@/zustand/store";
import HeroTemplate from "./template/HeroTemplate";
import { getJwt } from "@/helpers/jwtManager";
import { toast } from "sonner";

const SidebarEdit = () => {
  const { currentConfig, currentChannelData, setCurrentChannelData } =
    useMyStore();

  const [errMsg, seterrMsg] = useState("");
  const [loadingprompt, setloadingprompt] = useState(false);

  const [formdata, setformdata] = useState({
    channelName: currentChannelData?.metadata.title,
    channelDesc: currentChannelData?.metadata.description,
  });

  const generateWithAi = async () => {
    if (!formdata.channelDesc?.trim()) {
      seterrMsg("values cannot be empty");
      return false;
    }
    seterrMsg("");
    setloadingprompt(true);
    // ai fetch
    const token = await getJwt();
    if (token) {
      const res = await fetch(`/api/v1/prompt`, {
        method: "POST",
        body: JSON.stringify({
          prompt: formdata.channelDesc,
          type: "hero",
        }),
        headers: {
          authorization: `bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!result.success) {
        toast.error(result.message);
        setloadingprompt(false);
        return false;
      }
      setformdata({ ...formdata, channelDesc: result.data });
    }
    setloadingprompt(false);
  };

  useEffect(() => {
    const tm = setTimeout(() => {
      if (currentConfig && currentChannelData) {
        const tmp = { ...currentChannelData }; // shallow copy
        tmp.metadata.title = formdata.channelName!; //update name
        tmp.metadata.description = formdata.channelDesc!; //update name
        setCurrentChannelData(tmp); // update store
      }
    }, 800);

    return () => {
      clearTimeout(tm);
    };
  }, [formdata]);

  return (
    currentConfig &&
    currentChannelData && (
      <div className="h-full w-full px-2 flex flex-col gap-y-2 overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="basic-info"
        >
          <AccordionItem value="basic-info">
            <AccordionTrigger>Basic Information</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                type="text"
                value={formdata.channelName}
                onChange={(e) => {
                  setformdata({ ...formdata, channelName: e.target.value });
                }}
              />
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={formdata.channelDesc}
                onChange={(e) => {
                  setformdata({ ...formdata, channelDesc: e.target.value });
                }}
                rows={2}
                className="resize-none"
              />
              <p className="text-xs text-destructive mt-1">{errMsg}</p>
              <Button onClick={generateWithAi} disabled={loadingprompt}>
                {loadingprompt ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Stars />
                )}
                Enhance with AI
              </Button>
              {/* <h5>Colors</h5>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                Primary:
                <Input
                  id="primaryColor"
                  type="color"
                  className="w-16"
                  defaultValue={configuration.brandColors.primary}
                />
              </div>
              <div className="flex items-center justify-between">
                Background:
                <Input
                  id="background"
                  type="color"
                  className="w-16"
                  defaultValue={configuration.brandColors.primaryBackground}
                />
              </div>
            </div> */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h5>Sections</h5>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="section-hero">
            <AccordionTrigger>Hero</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <HeroTemplate />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="section-videos">
            <AccordionTrigger>Videos</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <VideoTemplate />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="section-socials">
            <AccordionTrigger>Socials</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <SocialsTemplate />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="section-about">
            <AccordionTrigger>About</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <AboutTemplate />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="section-contact">
            <AccordionTrigger>Contact</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <ContactTemplate />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  );
};

export default SidebarEdit;
