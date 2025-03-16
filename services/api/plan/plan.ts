import ApiInstances from "@/services/axios/axiosConfig";

export const getAllPlans = async () => {
  const { data } = await ApiInstances("global").get("plan");

  return data;
};

export const AssignPlan = async ({
  id_empresa,
  id_plan,
  fecha_inicio,
}: {
  id_empresa: number;
  id_plan: number;
  fecha_inicio: Date;
}) => {
  const { data } = await ApiInstances("global").post("planEmpresa", {
    id_empresa,
    id_plan,
    fecha_inicio,
  });

  return data;
};
