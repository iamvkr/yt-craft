import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { useMyStore } from "@/zustand/store";

const VideoTemplate = () => {
  const {
    currentConfig,
    setCurrentConfig,
    currentChannelData,
  } = useMyStore();

  const [formdata, setformdata] = useState({
    included: currentConfig ? currentConfig.sections.Videos.included : false,
    title: currentConfig?.sections.Videos.title,
    showTitle: currentConfig
      ? currentConfig.sections.Videos.cardOptions.showTitle
      : false,
    showDesc: currentConfig
      ? currentConfig.sections.Videos.cardOptions.showDesc
      : false,
    showDate: currentConfig
      ? currentConfig.sections.Videos.cardOptions.showDate
      : false,
    rounded: currentConfig
      ? currentConfig.sections.Videos.cardOptions.rounded
      : false,
    paddingTop: currentConfig?.sections.Videos.cardOptions.paddingTop,
    paddingBottom: currentConfig?.sections.Videos.cardOptions.paddingBottom,
  });

  useEffect(() => {
    const tm = setTimeout(() => {
      if (currentConfig && currentChannelData) {
        const tmp = { ...currentConfig }; // shallow copy
        tmp.sections.Videos.included = formdata.included;
        tmp.sections.Videos.title = formdata.title!; //update title
        tmp.sections.Videos.cardOptions.showTitle = formdata.showTitle; 
        tmp.sections.Videos.cardOptions.showDesc = formdata.showDesc;
        tmp.sections.Videos.cardOptions.showDate = formdata.showDate;
        tmp.sections.Videos.cardOptions.rounded = formdata.rounded;
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
          <Label htmlFor="videos-mode">Videos</Label>
          <Switch
            id="videos-mode"
            checked={formdata.included}
            onCheckedChange={(checked) => {
              setformdata({ ...formdata, included: checked });
            }}
          />
        </div>
        <div>
          <Label htmlFor="video-header">Header</Label>
          <Input
            id="video-header"
            type="text"
            value={formdata.title}
            onChange={(e) => {
              setformdata({ ...formdata, title: e.target.value });
            }}
          />
        </div>

        <Label className="mt-3 mb-1">Card Options</Label>
        <div className="ps-2 flex flex-col gap-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="video-card-title">Show Title</Label>
            <Switch
              id="video-card-title"
              checked={formdata.showTitle}
              onCheckedChange={(checked) => {
                setformdata({ ...formdata, showTitle: checked });
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="video-card-desc">Show Desc</Label>
            <Switch
              id="video-card-desc"
              checked={formdata.showDesc}
              onCheckedChange={(checked) => {
                setformdata({ ...formdata, showDesc: checked });
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="video-card-date">Show Date</Label>
            <Switch
              id="video-card-date"
              checked={formdata.showDate}
              onCheckedChange={(checked) => {
                setformdata({ ...formdata, showDate: checked });
              }}
            />
          </div>
          {/* <div className="flex justify-between items-center">
            <Label htmlFor="video-card-shadow">Shadow</Label>
            <Switch
              id="video-card-shadow"
              defaultChecked={currentConfig.sections.Videos.cardOptions.shadow}
            />
          </div> */}
          <div className="flex justify-between items-center">
            <Label htmlFor="video-card-corner">Rounded Corners</Label>
            <Switch
              id="video-card-corner"
              checked={formdata.rounded}
              onCheckedChange={(checked) => {
                setformdata({ ...formdata, rounded: checked });
              }}
            />
          </div>
          {/* <div className="flex">
            <div className="flex gap-2 w-1/2 pe-1">
              <Label htmlFor="video-card-columns" className="w-1/2">
                Columns
              </Label>
              <Input
                id="video-card-columns"
                type="number"
                defaultValue={currentConfig.sections.Videos.cardOptions.columns}
                className="w-1/2"
              />
            </div>
            <div className="flex gap-2 w-1/2 ps-1">
              <Label htmlFor="video-card-gap" className="w-1/2">
                Gap
              </Label>
              <Input
                id="video-card-gap"
                type="number"
                defaultValue={currentConfig.sections.Videos.cardOptions.gap}
                className="w-1/2"
              />
            </div>
          </div> */}


          {/* <div className="p">Padding</div>
          <div className="flex">
            <div className="flex w-1/2 pe-1">
              <Label htmlFor="video-card-paddingtop" className="w-1/2">
                Top
              </Label>
              <Input
                id="video-card-paddingtop"
                type="number"
                value={formdata.paddingTop}
                onChange={(e) => {
                  setformdata({
                    ...formdata,
                    paddingTop: Number(e.target.value),
                  });
                }}
                className="w-1/2"
              />
            </div>
            <div className="flex  w-1/2 ps-1">
              <Label htmlFor="video-card-paddingbottom" className="w-1/2">
                Bottom
              </Label>
              <Input
                id="video-card-paddingbottom"
                type="number"
                value={formdata.paddingBottom}
                onChange={(e) => {
                  setformdata({
                    ...formdata,
                    paddingBottom: Number(e.target.value),
                  });
                }}
                className="w-1/2"
              />
            </div>
          </div> */}
          {/* <div className="flex justify-between items-center">
            <Label htmlFor="video-card-background" className="w-1/2">
              Background
            </Label>
            <Input
              id="video-card-background"
              type="color"
              className="w-16"
              defaultValue={
                currentConfig.sections.Videos.cardOptions.backgroundColor
              }
            />
          </div> */}
        </div>
      </div>
    )
  );
};

export default VideoTemplate;
