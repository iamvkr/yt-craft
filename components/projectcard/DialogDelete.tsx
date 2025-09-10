"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useMyStore } from "@/zustand/store";
import { getJwt } from "@/helpers/jwtManager";

const DialogDelete = ({
  isOpen,
  setisOpen,
  id,
}: {
  isOpen: boolean;
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}) => {
  const { setUserProjects, userProjects } = useMyStore();
  const [loading, setloading] = useState(false);
  const deleteProject = async () => {
    const token = await getJwt();
    if (!token) {
      toast.error("something went wrong!!");
    }
    setloading(true);
    const res = await fetch(`/api/v1/project`, {
      method: "DELETE",
      body: JSON.stringify({
        rowId: id,
      }),
      headers: {
        authorization: `bearer ${token}`,
      },
    });
    const result = await res.json();
    console.log({ result });
    if (!result.success) {
      toast.error(result.message);
      setloading(false);
      return false;
    }
    toast.success(result.message);

    //   update in store
    setUserProjects(userProjects.filter((item) => item.id !== id));

    setloading(false);
    setisOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(status) => {
        setisOpen(status);
      }}
    >
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
            <DialogDescription>Are you sure to delete?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"destructive"}
              disabled={loading}
              onClick={deleteProject}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DialogDelete;
