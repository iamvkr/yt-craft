import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { useMyStore } from "@/zustand/store";

const ContactTemplate = () => {
  const {
    currentConfig,
    setCurrentConfig,
    currentChannelData,
    setCurrentChannelData,
  } = useMyStore();

  const [formdata, setformdata] = useState({
    included: currentConfig ? currentConfig.sections.Contact.included : false,
    title: currentConfig?.sections.Contact.content.title,
    email: currentConfig?.sections.Contact.content.email,
  });

  useEffect(() => {
    const tm = setTimeout(() => {
      if (currentConfig && currentChannelData) {
        const tmp = { ...currentConfig }; // shallow copy
        tmp.sections.Contact.included = formdata.included;
        tmp.sections.Contact.content.title = formdata.title!;
        tmp.sections.Contact.content.email = formdata.email!;

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
          <Label htmlFor="contact-mode">Contact</Label>
          <Switch
            id="contact-mode"
            checked={formdata.included}
            onCheckedChange={(checked) => {
              setformdata({ ...formdata, included: checked });
            }}
          />
        </div>
        <div className="flex gap-2 pe-1">
          <Label htmlFor="contact-email" className="w-1/2">
            Email
          </Label>
          <Input
            id="contact-email"
            type="text"
            value={formdata.email}
            onChange={(e) => {
              setformdata({ ...formdata, email: e.target.value });
            }}
            className="w-1/2"
          />
        </div>
        <div className="flex gap-2 pe-1">
          <Label htmlFor="contact-title" className="w-1/2">
            Title
          </Label>
          <Input
            id="contact-title"
            type="text"
            value={formdata.title}
            onChange={(e) => {
              setformdata({ ...formdata, title: e.target.value });
            }}
            className="w-1/2"
          />
        </div>
      </div>
    )
  );
};

export default ContactTemplate;
