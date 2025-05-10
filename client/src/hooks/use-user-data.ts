import { useState } from "react";

export type UserData = {
  name: string;
  country: string;
  age: number;
  school: string;
  gender: string;
  photoFile: File;
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const resetUserData = () => {
    setUserData(null);
  };
  
  return {
    userData,
    setUserData,
    resetUserData,
  };
};
