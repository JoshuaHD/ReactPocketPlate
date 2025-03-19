import { pb } from "@/settings.js";
import { redirect, type ParsedLocation } from "@tanstack/react-router";

const REDIRECT_PARAM = "redirect";

/**
 * Check if the user is authenticated. If not, redirect to the sign-in page.
 *
 * @param location a path to redirect to after sign-in
 */
export const protectPage = (location?: ParsedLocation) => {
  if (!pb.authStore.isValid) {
    const redirectOptions: any = {
        to: "/user/login",
        search: {
          [REDIRECT_PARAM]: location?.href,
        },
      }
      // @ts-ignore // FIXME: Issue with Tanstack Router Expected 0 arguments, but got 1.
    throw redirect(redirectOptions);
  }
};

export const getRedirectAfterSignIn = () =>
  new URLSearchParams(location.search).get(REDIRECT_PARAM) || "/";