import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getJwt } from "@/helpers/jwtManager";
import { useMyStore } from "@/zustand/store";
import { Loader2, Stars } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AboutTemplate = () => {
  const { currentConfig, setCurrentConfig, currentChannelData } = useMyStore();

  const [errMsg, seterrMsg] = useState("");
  const [loadingprompt, setloadingprompt] = useState(false);

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

  const generateWithAi = async () => {
    if (!formdata.info?.trim()) {
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
          prompt: formdata.info,
          type: "about",
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
      setformdata({ ...formdata, info: result.data });
    }
    setloadingprompt(false);
  };

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
        <Label htmlFor="desc">Description</Label>
        <Textarea
          id="desc"
          value={formdata.info}
          onChange={(e) => {
            setformdata({ ...formdata, info: e.target.value });
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
          <span>Enhance with AI</span>
        </Button>
      </div>
    )
  );
};

export default AboutTemplate;
