import { getCookie } from "@/utils/cookies";

export const isLoggedIn = (): boolean => {
  return !!getCookie('token');
};
