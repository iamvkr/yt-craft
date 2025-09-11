import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMyStore } from "@/zustand/store";
import React, { useEffect, useState } from "react";

const HeroTemplate = () => {
  const {
    currentConfig,
    setCurrentConfig,
    currentChannelData,
  } = useMyStore();

  const [formdata, setformdata] = useState({
    included:currentConfig? currentConfig.sections.Hero.included : false,
    title:currentConfig?.sections.Hero.content.title,
    subtitle:currentConfig?.sections.Hero.content.subtitle,
    subscribeBtn:currentConfig? currentConfig.sections.Hero.content.subscribeBtn: false,
    subscribeCount:currentConfig? currentConfig.sections.Hero.content.showSubscriberCount: false,
    vidsCount:currentConfig? currentConfig.sections.Hero.content.showVideoCount: false,
  })

  useEffect(() => {
    const tm = setTimeout(() => {
        if (currentConfig && currentChannelData) {
        const tmp = {...currentConfig}; // shallow copy
        tmp.sections.Hero.included  = formdata.included; //update hero checked
        tmp.sections.Hero.content.title  = formdata.title!; //update title
        tmp.sections.Hero.content.subtitle  = formdata.subtitle!; //update title
        tmp.sections.Hero.content.subscribeBtn  = formdata.subscribeBtn; //update title
        tmp.sections.Hero.content.showSubscriberCount  = formdata.subscribeCount; //update title
        tmp.sections.Hero.content.showVideoCount  = formdata.vidsCount; //update title
        setCurrentConfig(tmp);// update store
    }
    }, 500);

    return ()=>{
        clearTimeout(tm)
    }
    
  }, [formdata])
  return (
    currentConfig && (
        <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2 justify-between">
          <Label htmlFor="hero-mode">Hero</Label>
          <Switch
            id="hero-mode"
            checked={formdata.included}
            onCheckedChange={(checked)=>{setformdata({...formdata,included:checked})}}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-title">Title</Label>
          <Input
            id="hero-title"
            type="text"
            value={formdata.title}
            onChange={(e)=>{setformdata({...formdata,title:e.target.value})}}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-sub-title">Sub Title</Label>
          <Input
            id="hero-sub-title"
            type="text"
            value={formdata.subtitle}
            onChange={(e)=>{setformdata({...formdata,subtitle:e.target.value})}}
          />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="hero-sub-btn">Subscribe Button</Label>
          <Switch
            id="hero-sub-btn"
            checked={
              formdata.subscribeBtn
            }
            onCheckedChange={(checked)=>{setformdata({...formdata,subscribeBtn:checked})}}
          />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="hero-sub-count">Subscribe Count</Label>
          <Switch
            id="hero-sub-count"
            checked={
              formdata.subscribeCount
            }
            onCheckedChange={(checked)=>{setformdata({...formdata,subscribeCount:checked})}}
          />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="hero-vids-count">Video Count</Label>
          <Switch
            id="hero-vids-count"
            checked={
              formdata.vidsCount
            }
            onCheckedChange={(checked)=>{setformdata({...formdata,vidsCount:checked})}}
          />
        </div>
      </div>
    )
  );
};

export default HeroTemplate;
