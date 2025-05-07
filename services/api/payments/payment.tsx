import ApiInstances from "@/services/axios/axiosConfig";

export const createInitial = async (info: {
  empresaId: string;
  purcheaseToken: string;
  sku: string;
  purchease: any;
}) => {
  const { data } = await ApiInstances("global").post(
    "payments/createInitial",
    info
  );
  return data;
};

export const verifyPaymentIsOk = async (info: {
  empresaId: string;
  purcheaseToken: string;
}) => {
  const { data } = await ApiInstances("global").post(
    "payments/isPaymentOk",
    info
  );
  return data;
};

export const getPlans = async () => {
  const { data } = await ApiInstances("global").get(
    "payments/plans",
  );
  return data;
};