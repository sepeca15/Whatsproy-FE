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
