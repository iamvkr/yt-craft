"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { useMyStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { faDiscord, faFacebook, faGithub, faInstagram, faLinkedin, faTiktok, faTwitch, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IconMap = new Map();
IconMap.set('youtube',faYoutube);
IconMap.set('twitter',faXTwitter);
IconMap.set('instagram',faInstagram);
IconMap.set('facebook',faFacebook);
IconMap.set('tiktok',faTiktok);
IconMap.set('discord',faDiscord);
IconMap.set('twitch',faTwitch);
IconMap.set('linkedin',faLinkedin);
IconMap.set('github',faGithub);
IconMap.set('website',faGlobe);

const PreviewComponent = () => {
  const {
    userProjects,
    currentConfig,
    setCurrentConfig,
    currentChannelData,
    setCurrentChannelData,
  } = useMyStore();
  const { id: projectId } = useParams();

  /** channel data: */
  const metaData = currentChannelData!.metadata;
  const videoData = currentChannelData!.videos;

  /** configuration */
  const Hero = currentConfig!.sections.Hero;
  const VideosCf = currentConfig!.sections.Videos;
  const About = currentConfig!.sections.About;
  const Contact = currentConfig!.sections.Contact;
  const showSocialShareButtons = currentConfig!.showSocialShareButtons;
  return (
    currentConfig && (
      <div className="border-4 dark:border-secondary rounded-xl">
        <div className="h-full w-full flex flex-col gap-4 lg:max-w-[80%] lg:mx-auto">
          {/* NAVBAR */}
          <div className="nav mt-2">
            <div className="navbar flex justify-between items-center p-2">
              <div className="brand flex gap-4 items-center">
                <div className="image">
                  <img
                    src={metaData.avatar[0].url}
                    alt="logo"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <h3 className="text-xl">{metaData.title}</h3>
              </div>
              <div className="links hidden xl:block">
                <ul className="flex gap-4">
                  <li>Home</li>
                  <li>
                    {currentChannelData!.videos.length > 0 &&
                      VideosCf.included &&
                      "Videos"}
                  </li>
                  {About.included && <li>About</li>}
                  {Contact.included && <li>Contact</li>}
                  {/* TODO: PLAYLIST AND LIVE VIDEOS*/}
                </ul>
              </div>
            </div>
          </div>

          {/* HEADER START */}
          {Hero.included && (
            <div className=" p-4 w-full">
              <div className="grid h-full grid-cols-1 xl:grid-cols-[20%_80%] ">
                <div className="image h-full w-full flex items-center justify-center">
                  <img
                    src={metaData.thumbnail[0].url}
                    alt="logo"
                    className="min-w-40 h-40 rounded-full object-fit border-3"
                  />
                </div>
                <div className="details flex flex-col gap-2 justify-center text-center xl:text-start">
                  <span className="text-4xl mb-4">{Hero.content.title}</span>
                  <span className="text-xl mb-4">{metaData.description}</span>
                  <span className=" mb-4">{Hero.content.subtitle}</span>
                  <div className="flex items-center gap-2 justify-center xl:justify-start">
                    {Hero.content.showSubscriberCount && (
                      <span>{metaData.subs} </span>
                    )}
                    {Hero.content.showSubscriberCount &&
                      Hero.content.showVideoCount && (
                        <span className="text-[8px]">🔴</span>
                      )}
                    {Hero.content.showVideoCount && (
                      <span> {metaData.vidCounts}</span>
                    )}
                  </div>
                  {Hero.content.subscribeBtn && (
                    <Button
                      className="max-w-40 mx-auto lg:mx-0"
                      onClick={() => {
                        const proj = userProjects.find(
                          (p) => p.id === projectId
                        );
                        console.log(proj);
                        window.open(
                          `https://www.youtube.com/channel/${proj?.channelId}?sub_confirmation=1`,
                          "_blank"
                        );
                      }}
                    >
                      Subscribe
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIDEO SECTION START */}
          {VideosCf.included && (
            <>
              <h3 className="w-full   px-4 text-2xl mb-4">{VideosCf.title}</h3>
              <div className="w-full  px-4">
                <div className="grid w-full grid-cols-1 xl:grid-cols-3 gap-4">
                  {videoData.length > 0 &&
                    videoData.map((v, i, arr) => {
                      const cf = VideosCf;
                      if (i < 12) {
                        return (
                          <Card
                            key={i}
                            className={`h-full min-h-48 pt-0 overflow-hidden cursor-pointer ${
                              !cf.cardOptions.rounded && "rounded-none"
                            }`}
                          >
                            <img
                              className="img w-full h-40 bg-slate-500 object-cover object-center overflow-hidden hover:scale-110 transition-all"
                              src={`http://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`}
                            />
                            <CardHeader>
                              {cf.cardOptions.showDate && (
                                <CardDescription>{v.published}</CardDescription>
                              )}
                              {cf.cardOptions.showTitle && (
                                <CardTitle className=" line-clamp-2">
                                  {v.title}
                                </CardTitle>
                              )}
                              {cf.cardOptions.showDesc && (
                                <CardDescription className=" line-clamp-3">
                                  {v.description_snippet}
                                </CardDescription>
                              )}
                            </CardHeader>
                          </Card>
                        );
                      }
                    })}
                </div>
              </div>
              <div className="flex justify-center">
                <Button className="max-w-40 mx-auto lg:mx-0">Load More</Button>
              </div>
            </>
          )}

          {/* Socials SECTION START */}
          {showSocialShareButtons && (
            <>
              <h3 className="w-full px-4 text-2xl mt-4">Socials</h3>
              <div className="w-full px-4">
                <div className="grid w-full grid-cols-1 xl:grid-cols-4 gap-4">
                  {/* RENDER ONLY VALID LINK (link those are not be empty) */}
                  {currentConfig.socialLink
                    .filter((item) => item.link)
                    .map((item, i) => (
                      <Card className="p-3" key={i}>
                        <CardTitle>
                          <div className="flex items-center justify-center gap-4">
                            {
                            //   <SocialIcon
                            //     href={item.link}
                            //     url={`https://www.${
                            //       item.type === "x" ? "twitter" : item.type
                            //     }.com`}
                            //     fallback={{ color: "", path: "" }}
                            //     bgColor="transparent"
                            //     className="h-4 w-4 bg-primary dark:bg-secondary rounded-full"
                            //     style={{ height: "2rem", width: "2rem" }}
                            //   />
                            }
                            <FontAwesomeIcon icon={IconMap.get(item.type)} className="size-5"/>
                            <a href={item.link} className=" capitalize">
                              {item.type}
                            </a>
                          </div>
                        </CardTitle>
                      </Card>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* About SECTION START */}
          {About.included && (
            <>
              <h3 className="w-full  px-4 text-2xl mt-4">
                {About.content.title}
              </h3>
              <div className="w-full px-4 border-b pb-4">
                {About.content.info}
              </div>
            </>
          )}

          {/* Contact SECTION START */}
          {Contact.included && (
            <>
              <h3 className="w-full px-4 text-2xl mt-4">
                {Contact.content.title}
              </h3>
              <div className="w-full px-4 border-b pb-4">
                {Contact.content.email}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center text-xs py-2">
            Copyright @2025 {metaData.title} <br />
            Build with Yt Craft | Powered by Appwrite
          </div>
        </div>
      </div>
    )
  );
};

export default PreviewComponent;
