import ApiInstances from "@/services/axios/axiosConfig";

export const Login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await ApiInstances("global").post(`auth/login`, {
      email,
      password,
    });
    return data;
  } catch (error) {
  }
};

export const GetMyAccountData = async () => {
  const { data } = await ApiInstances("global").get(`auth/me`);
  return data;
};


export const resetPassword = async (token: string, newPassword: string) => {
  const { data } = await ApiInstances("global").post(
    `auth/reset-password`,
    { newPassword },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data;
};

export const sendLinkToGmail = async (email: any) => {
  const { data } = await ApiInstances("global").post(`auth/sendLinkToGmail`, { email });
  return data;
};
