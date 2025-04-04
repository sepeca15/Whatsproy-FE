import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import { IUserUpdate } from "@/services/api/user/user.types";
import { IUserData } from "@/services/redux/Slices/userSlice/types";
import {
  onAddUserData,
  mostrarMensaje,
  onUpdateKeys,
  onPurchasedPlan,
  greenApiConfigured,
  onApiConfigured,
  onUserConfigured,
} from "@/services/redux/Slices/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";

export const useUser = () => {
  const { showToast } = useToastContext();
  const Dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  const Mensaje = () => {
    Dispatch(mostrarMensaje("hola soy un nuevo mensaje ;D"));
  };

  const handleAddUserData = async () => {
    try {
      const userData = await api.auth.me();
      if (userData) {
        Dispatch(onAddUserData(userData));
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleAssignUserToPlan = async ({
    id_empresa,
    id_plan,
    fecha_inicio,
  }: {
    id_empresa: number;
    id_plan: number;
    fecha_inicio: Date;
  }) => {
    try {
      const res = await api.plans.assignPlanToCompany({
        id_empresa,
        id_plan,
        fecha_inicio,
      });
      if (res.ok === true) {
        Dispatch(onPurchasedPlan());
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdateGreenApiConfig = async () => {
    try {
      await api.company.update({ greenApiConfigured: true }, user.id_empresa);
      Dispatch(greenApiConfigured());
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateApiConfigured = async () => {
    try {
      await api.company.update({ apiConfigured: true }, user.id_empresa);
      Dispatch(onApiConfigured());
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateCompany = async (companyData: IUserData) => {
    try {
      const data = await api.company.update(companyData, user.id_empresa);
      if (data.ok) {
        Dispatch(
          onUpdateKeys({ data: companyData, isUser: false, isGrenApi: true }),
        );
        showToast({
          title: "¡Empresa actualizada!",
          description: "Su empresa fue actualizada exitosamente.",
          status: "success",
        });
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
      });
    }
  };

  const handleUpdateUser = async (userData: IUserUpdate) => {
    try {
      await api.user.update(user.id, userData);
      Dispatch(onUserConfigured({ data: userData }));
    } catch (error: any) {
      console.log(error.response.message);
    }
  };

  return {
    Mensaje,
    handleAddUserData,
    handleAssignUserToPlan,
    handleUpdateCompany,
    handleUpdateUser,
    handleUpdateGreenApiConfig,
    handleUpdateApiConfigured,
    user,
  };
};
