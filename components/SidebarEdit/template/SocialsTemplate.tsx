import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { useMyStore } from "@/zustand/store";

const SocialsTemplate = () => {
  const {
    currentConfig,
    setCurrentConfig,
    currentChannelData,
  } = useMyStore();

  const [formdata, setformdata] = useState({
    showSocialShareButtons: currentConfig
      ? currentConfig.showSocialShareButtons
      : false,
    socialLink: currentConfig? currentConfig.socialLink! : [],
  });

  useEffect(() => {
    const tm = setTimeout(() => {
        if (currentConfig && currentChannelData) {
        const tmp = {...currentConfig}; // shallow copy
        tmp.showSocialShareButtons  = formdata.showSocialShareButtons; 
        tmp.socialLink  = formdata.socialLink; 
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
          <Label htmlFor="socials-mode">Socials</Label>
          <Switch
            id="socials-mode"
            checked={formdata.showSocialShareButtons}
            onCheckedChange={(checked) => {
              setformdata({ ...formdata, showSocialShareButtons: checked });
            }}
          />
        </div>
        <div className="ps-2 flex flex-col gap-y-2">
          {currentConfig.socialLink.map((item, i) => (
            <div className="flex justify-between items-center" key={i}>
              <Label htmlFor="video-card-title" className="capitalize">
                {item.type === "x" ? "twitter" : item.type}
              </Label>
              <Input
                id="yt-link"
                type="text"
                placeholder="Enter link"
                value={formdata.socialLink[i].link}
                onChange={(e) => {
                    // Update the link at specific index
                  setformdata({
                    ...formdata,
                    socialLink: formdata.socialLink.map((item, mainI) => {
                      if (mainI === i) {
                        return { ...item, link: e.target.value };
                      }
                      return item;
                    }),
                  });
                }}
                className="w-1/2"
              />
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default SocialsTemplate;
