"use client";

import { Button } from "@/components/ui/button";

const SubsBtn = ({channelId}:{channelId:string}) => {
  return <Button
  className="max-w-40 mx-auto lg:mx-0"
  onClick={() => {
    window.open(
      `https://www.youtube.com/channel/${channelId}?sub_confirmation=1`,
      "_blank"
    );
  }}
>
  Subscribe
</Button>;
};

export default SubsBtn;
