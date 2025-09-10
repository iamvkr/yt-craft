"use client";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OAuthProvider } from "appwrite";
import React from "react";

const GoogleLogin = () => {
  async function loginWithGoogle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      account.createOAuth2Session({
        provider: OAuthProvider.Google,
        success: window.location.origin + "/signup/google/success",
        failure: window.location.origin + "/signup/google/fail",
      });
    } catch (error) {
      console.error("Failed to login with Google:", error);
    }
  }
  return (
    <>
      <hr />
      <Button
        className="w-full"
        variant={"secondary"}
        onClick={loginWithGoogle}
      >
        <FontAwesomeIcon icon={faGoogle} className="size-5" /> Continue With
        Google
      </Button>
    </>
  );
};

export default GoogleLogin;
