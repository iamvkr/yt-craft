import { tablesDb } from "@/lib/appwrite";
import { UserProjectType } from "@/lib/appwrite/db";
import { config } from "@/lib/config";
import { Query } from "appwrite";
import React from "react";
import { getChannelData } from "../../../helpers/getChannelData";
import { ConfigurationType } from "@/types";
import SubsBtn from "./Client/SubsBtn";
import {
  Card,
  CardTitle,
} from "@/components/ui/card";
import VideosGrid from "./Client/VideosGrid";
import ToggleMode from "./Client/ToggleMode";
import { unstable_cache } from "next/cache";
import Page404 from "./Client/Page404";
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

const site = async ({ params }: { params: Promise<{ handle: string }> }) => {
  /** 1. get channel handle */
  const { handle } = await params;
  const formattedHandle = decodeURIComponent(handle);

  // Create a cached version of your database call
  const getCachedUserData = unstable_cache(
    async () => {
      /** 2. check if site is published with that handle */
      const resultRows = await tablesDb.listRows<UserProjectType>({
        databaseId: config.APPWRITE_DATABASE_ID,
        tableId: config.APPWRITE_TABLE_ID,
        queries: [Query.equal("chHandle", formattedHandle)],
      });
      if (!resultRows || resultRows.total <= 0) {
        return `Site doesn't exist! Crete your own new Site`;
      }
      /** 3. get latest channel data from channelId */
      const targetProjectData = resultRows.rows[0];
      const cData = await getChannelData(targetProjectData.channelId);
      if (!cData) {
        return `Failed to load channel Data`;
      }
      /** if everything went well */
      return { cData, targetProjectData };
    },
    [formattedHandle], // cache key prefix
    {
      revalidate: 60, // Cache for 60 seconds
    }
  );

  const resData = await getCachedUserData();
  if (typeof resData === "string") {
    return (
      <div>
        <Page404 message={resData} />
      </div>
    );
  }
  const { cData, targetProjectData } = resData;

  const metaData = cData.metadata;
  const videoData = cData.videos;

  const cF: ConfigurationType = JSON.parse(targetProjectData.configs);
  const Hero = cF.sections.Hero;
  const VideosCf = cF.sections.Videos;
  const About = cF.sections.About;
  const Contact = cF.sections.Contact;
  const showSocialShareButtons = cF.showSocialShareButtons;

  /** override to user eidted custom titles id any: */
  cData.metadata.title = cF.title;
  cData.metadata.description = cF.description;

  /** construct a site using 'targetProjectData' and 'cData' */

  return (
    <div>
      <div className="h-full w-full flex flex-col gap-4 lg:max-w-[80%] lg:mx-auto">
        {/* NAVBAR */}
        <nav className="nav mt-2 w-full">
          <div className="navbar flex justify-between items-center p-2">
            <div className="brand flex gap-4 items-center">
              <div className="image">
                <img
                  src={
                    cData.metadata.avatar ? cData.metadata.avatar[0].url : ""
                  }
                  alt="logo"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <h3 className="text-xl">{cData.metadata.title}</h3>
            </div>
            <div className="links hidden xl:block">
              <ul className="flex gap-4">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#video-section">
                    {cData.videos.length > 0 &&
                      cF.sections.Videos.included &&
                      "Videos"}
                  </a>
                </li>
                {About.included && (
                  <li>
                    <a href="#about-section">About</a>
                  </li>
                )}
                {Contact.included && (
                  <li>
                    <a href="#contact-section">Contact</a>
                  </li>
                )}
                {/* TODO: PLAYLIST AND LIVE VIDEOS*/}
              </ul>
            </div>

            <div className="theme_toggle">
              <ToggleMode />
            </div>
          </div>
        </nav>

        {/* HEADER START */}
        {Hero.included && (
          <div className=" p-4 w-full">
            <div className="grid h-full grid-cols-1 xl:grid-cols-[20%_80%] ">
              <div className="image h-full w-full flex items-center justify-center">
                <img
                  src={metaData.thumbnail ? metaData.thumbnail[0].url : ""}
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
                  <SubsBtn channelId={targetProjectData.channelId} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIDEO SECTION START */}
        {VideosCf.included && (
          <>
            <h3 id="video-section" className="w-full px-4 text-2xl mb-4">
              {VideosCf.title}
            </h3>
            <div className="w-full px-4">
              {/* <div className="grid w-full grid-cols-1 xl:grid-cols-3 gap-4"> */}
              <VideosGrid videoData={videoData} VideosCf={VideosCf} />
              {/* </div> */}
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
                {cF.socialLink
                  .filter((item) => item.link)
                  .map((item, i) => (
                    <Card className="p-3" key={i}>
                      <CardTitle>
                        <div className="flex items-center justify-center gap-4">
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
            <h3 id="about-section" className="w-full  px-4 text-2xl mt-4">
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
            <h3 id="contact-section" className="w-full px-4 text-2xl mt-4">
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
          Build with{" "}
          <a href="/"  target="_blank"className="underline cursor-pointer">
            Yt Craft
          </a>{" "}
          | Powered by{" "}
          <a href="https://appwrite.io/" target="_blank" className="underline cursor-pointer">
            Appwrite
          </a>
        </div>
      </div>
    </div>
  );
};

export default site;
