"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Copy, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  //   DropdownMenuLabel,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DialogVerify from "./DialogVerify";
import DialogDelete from "./DialogDelete";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProjectCard = ({
  item,
}: {
  item: {
    id: string;
    title: string;
    channelId: string;
    channelImage: string;
    verified: boolean | null;
    chHandle: string;
  };
}) => {
  const [isOpen, setisOpen] = useState(false);
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const router = useRouter();
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Link href={`/dashboard/${item.id}`}>
              <CardTitle className="cursor-pointer">{item.title}</CardTitle>
            </Link>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                  {/* <DropdownMenuSeparator /> */}
                  {!item.verified && (
                    <DropdownMenuItem
                      onClick={() => {
                        setisOpen(true);
                      }}
                    >
                      Verify
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      setisDeleteOpen(true);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/*  */}
          </div>

          {/* <CardDescription>
              Enter your details below to{" "}
              {isLoginMode ? "Sign In into " : "Sign Up for"} your account
            </CardDescription> */}
        </CardHeader>
        <Link suppressHydrationWarning={true} href={`/dashboard/${item.id}`}>
        <CardContent
        //   onClick={() => {
        //     router.push(`/dashboard/${item.id}`);
        //   }}
          role="link"
        >
          {/* <Button variant="outline" className="w-full capitalize">
            Hello
          </Button> */}
          <div className="flex">
            <img
              src={item.channelImage}
              className="h-20 w-20 rounded-full border-2"
              alt="thumbnail"
            />
            <div className="text-sm ps-4 flex flex-col gap-y-2">
              <p>
                ChannelID:
                <br />
                {item.channelId}
              </p>
              <div className="flex gap-2">
                <div>
                  {item.verified ? (
                    <Badge variant="default" className="cursor-pointer">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">unverified</Badge>
                  )}
                </div>
                <div>
                  {item.chHandle ? (
                    <Badge
                      variant="default"
                    >
                        <Link target="_blank" suppressHydrationWarning={true} href={window.location.origin + "/c/" + item.chHandle}
                        onClick={e=>e.stopPropagation()}>
                      {item.chHandle}
                        </Link>
                    </Badge>
                  ) : (
                    <Badge variant="destructive">draft</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        </Link>
      </Card>

      {/* verify dialog */}
      <DialogVerify isOpen={isOpen} setisOpen={setisOpen} item={item} />

      {/* delete dialog */}
      <DialogDelete
        isOpen={isDeleteOpen}
        setisOpen={setisDeleteOpen}
        id={item.id}
      />
    </div>
  );
};

export default ProjectCard;
