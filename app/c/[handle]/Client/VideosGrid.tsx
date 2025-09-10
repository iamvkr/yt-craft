"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfigurationType } from "@/types";
import React, { useState } from "react";

const ctype: ConfigurationType = {} as ConfigurationType; // eslint-disable-line @typescript-eslint/no-unused-vars

const VideosGrid = ({
  videoData,
  VideosCf,
}: {
  videoData: {
    video_id?: string | undefined;
    title?: string | undefined;
    description_snippet?: string | undefined;
    published?: string | undefined;
    view_count?: string | undefined;
    short_view_count?: string | undefined;
    length_text?: string | undefined;
    token?: string | undefined;
  }[];
  VideosCf: typeof ctype.sections.Videos;
}) => {
  const BATCH_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  const visibleItems = videoData.slice(0, visibleCount);
  const hasMore = visibleCount < videoData.length;
  return (
    <>
      <div className="grid w-full grid-cols-1 xl:grid-cols-3 gap-4">
        {visibleItems.length > 0 &&
          visibleItems.map((v, i) => {
            const cf = VideosCf;
              return (
                <Card
                  key={i}
                  className={`h-full min-h-48 pt-0 overflow-hidden cursor-pointer ${
                    !cf.cardOptions.rounded && "rounded-none"
                  }`}
                  onClick={()=>{
                    window.open(`https://youtube.com/watch?v=${v.video_id}`,"_blank")
                  }}
                >
                  <img
                    className="img w-full h-40 bg-slate-500 object-cover object-center overflow-hidden hover:scale-110 transition-all"
                    src={`http://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`}
                    alt="video Thumbnail"
                  />
                  <CardHeader>
                    {cf.cardOptions.showDate && (
                      <CardDescription>{v.published}</CardDescription>
                    )}
                    {cf.cardOptions.showTitle && (
                      <CardTitle className=" line-clamp-2">{v.title}</CardTitle>
                    )}
                    {cf.cardOptions.showDesc && (
                      <CardDescription className=" line-clamp-3">
                        {v.description_snippet}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              );
          })}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore} className="max-w-40 mx-auto lg:mx-0">
            Load More
          </Button>
        </div>
      )}
    </>
  );
};

export default VideosGrid;
