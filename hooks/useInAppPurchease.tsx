import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import { useEffect } from "react";
import {
  purchaseUpdatedListener,
  finishTransaction,
  Purchase,
  ProductPurchase,
} from "react-native-iap";
import { useUser } from "./redux/useUser";

export function useIAPHandler(empresaId: any) {
  const { showToast } = useToastContext();
  const { handlePayOk } = useUser();

  useEffect(() => {
    const purchaseListener = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        const { purchaseToken, productId } = purchase;
        if (purchase?.isAcknowledgedAndroid) {
          return;
        }

        try {
          if (purchaseToken) {
            const resp = await api.payments.createInitial({
              empresaId: empresaId,
              purcheaseToken: purchaseToken ?? "",
              sku: productId ?? "",
            });
            if (!resp?.success) {
              showToast({
                title: "No se pudo verificar la suscripción'",
                descripcion: "Contacta con soporte para mas informacion",
                status: "error",
              });
            }

            const res = await api.payments.verifyPaymentIsOk({
              empresaId: empresaId ?? "",
              purcheaseToken: purchaseToken ?? "",
            });

            console.log("xd1 res", res);
            if (res && res?.success) {
              showToast({
                title: "Suscripcion realizada exitosamente",
                descripcion: "",
                status: "success",
              });
              console.log("finishTransaction", purchase);
              handlePayOk();
              await finishTransaction({
                purchase: purchase,
                isConsumable: false,
              });
            } else {
              console.log("xd1", res?.data);
              showToast({
                title: "No se pudo verificar la suscripción'",
                descripcion: "Contacta con soporte",
                status: "error",
              });
            }
            await finishTransaction({
              purchase: purchase,
              isConsumable: false,
            });
          }
        } catch (e) {
          console.error("Error al verificar compra con el backend:", e);
          showToast({
            title: "No se pudo verificar la suscripción'",
            descripcion: "Contacta con soporte",
            status: "error",
          });
        }
      }
    );

    return () => {
      if (purchaseListener) {
        purchaseListener.remove();
      }
    };
  }, [empresaId]);
}
