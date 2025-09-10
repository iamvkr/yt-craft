import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMyStore } from "@/zustand/store";
import React, { useEffect, useState } from "react";

const AboutTemplate = () => {
  const {
    currentConfig,
    setCurrentConfig,
    currentChannelData,
    setCurrentChannelData,
  } = useMyStore();

  const [formdata, setformdata] = useState({
    included: currentConfig ? currentConfig.sections.About.included : false,
    title: currentConfig?.sections.About.content.title,
    info: currentConfig?.sections.About.content.info,
  });

  useEffect(() => {
    const tm = setTimeout(() => {
      if (currentConfig && currentChannelData) {
        const tmp = { ...currentConfig }; // shallow copy
        tmp.sections.About.included = formdata.included;
        tmp.sections.About.content.title = formdata.title!;
        tmp.sections.About.content.info = formdata.info!;

        setCurrentConfig(tmp); // update store
      }
    }, 500);

    return () => {
      clearTimeout(tm);
    };
  }, [formdata]);

  return (
    currentConfig && (
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2 justify-between">
          <Label htmlFor="about-mode">About</Label>
          <Switch
            id="about-mode"
            checked={formdata.included}
            onCheckedChange={(checked) => {
              setformdata({ ...formdata, included: checked });
            }}
          />
        </div>
        <div className="flex gap-2 pe-1">
          <Label htmlFor="about-email" className="w-1/2">
            Title
          </Label>
          <Input
            id="about-email"
            type="text"
            value={formdata.title}
            onChange={(e) => {
              setformdata({ ...formdata, title: e.target.value });
            }}
            className="w-1/2"
          />
        </div>
        <div className="flex gap-2 pe-1">
          <Label htmlFor="about-title" className="w-1/2">
            Info
          </Label>
          <Input
            id="about-title"
            type="text"
            value={formdata.info}
            onChange={(e) => {
              setformdata({ ...formdata, info: e.target.value });
            }}
            className="w-1/2"
          />
        </div>
      </div>
    )
  );
};

export default AboutTemplate;
