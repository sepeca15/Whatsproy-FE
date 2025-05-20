import ApiInstances from "@/services/axios/axiosConfig";
import { IUserData } from "@/services/redux/Slices/userSlice/types";
import { CreateEmpresaDto } from "./types";

export const createCompany = async (info: CreateEmpresaDto) => {
  const { data } = await ApiInstances("global").post("empresa", info);

  return data;
};

export const updateCompany = async (
  companyData: IUserData,
  id_empresa: number
) => {
  const { data } = await ApiInstances("global").patch(
    "empresa/" + id_empresa,
    companyData
  );

  return data;
};

export const isGreenApiConfigured = async (id_empresa: number) => {
  const { data } = await ApiInstances("global").post(
    "empresa/isGreenApiConfigured/" + id_empresa
  );

  return data;
};

export const deployCompany = async (companyId: string) => {
  const { data } = await ApiInstances("global").post(
    `admin/deploy/${companyId}`
  );

  return data;
};

export const getCompaniesAdmin = async (
  query: string,
  page: any,
  limit: any
) => {
  const { data } = await ApiInstances("global").get(
    `admin/empresas?query=${query}&page=${page}&limit=${limit}`
  );

  return data;
};

export const updateCompanyAdmin = async (
  id: string,
  empresaInfo: any,
) => {
  const { data } = await ApiInstances("global").put(
    `admin/empresas/${id}`,
    empresaInfo
  );

  return data;
};

export const LoadAuthCode = async ({
  id_empresa,
  numberPhone,
}: {
  id_empresa: number;
  numberPhone: number;
}) => {
  const { data } = await ApiInstances("global").get(
    `empresa/authCode/${id_empresa}/${numberPhone}`
  );
  return data;
};

export const LoadQR = async ({ id_empresa }: { id_empresa: number }) => {
  const { data } = await ApiInstances("global").get(`empresa/qr/${id_empresa}`);
  return data;
};
