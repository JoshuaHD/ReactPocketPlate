import { atom, useAtom } from "jotai";
import { pb } from "@/settings.js";
import { AuthRecord } from "pocketbase";

const userAtom = atom<AuthRecord | null>(pb.authStore.record);

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);

  const login = async (email: string, password: string) => {
    const authData = await pb.collection("users").authWithPassword(email, password);
    setUser(authData.record)
  };
  const update = (authData: AuthRecord) => {
    setUser(authData)
  }
  const logout = () => {
    pb.authStore.clear()
    setUser(null);
  }

  const refresh = async () => {
    const authData = await pb.collection("users").authRefresh()
    console.log({ authData })
    setUser(authData.record)
  }

  const changePassword = async (oldPassword: string, password: string, passwordConfirm: string) => {
    if (!user?.id)
      throw Error("You need to be logged in to change your password!")

    const data = { oldPassword, password, passwordConfirm };

    console.log({ data })

    await pb.collection('users').update(user?.id, data);

    logout()
  }

  const requestOTP = async (email: string) => {
    // send OTP email to the provided auth record
    const req = await pb.collection('users').requestOTP(email);

    return req.otpId
  }
  const authWithOTP = async (otpId: string, otp: string) => {
    const authData = await pb.collection('users').authWithOTP(
      otpId,
      otp,
    );
    
    setUser(authData.record)
  }
  return { user, login, logout, refresh, update, changePassword, requestOTP, authWithOTP, isAuthenticated: !!user?.id, authStore: pb.authStore };
};