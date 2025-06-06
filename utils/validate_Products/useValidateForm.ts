import { useIntl } from "react-intl";
import { useToastContext } from "@/contexts/ToastContext";
import ProductoTypes from "./types";

const useValidateForm = (formData: ProductoTypes) => {
  const { showToast } = useToastContext();
  const intl = useIntl();

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.imagen)
      errors.push(intl.formatMessage({ id: "imageRequired" }));
    if (!formData.nombre)
      errors.push(intl.formatMessage({ id: "nameRequired" }));
    // if (formData.categoryIds?.length === 0)
    //   errors.push(intl.formatMessage({ id: "categoryRequired" }));

    if (!formData.precio || formData.precio <= 0)
      errors.push(intl.formatMessage({ id: "priceRequired" }));
    if (
      !formData.plazoDuracionEstimadoMinutos ||
      formData.plazoDuracionEstimadoMinutos <= 0
    )
      errors.push(intl.formatMessage({ id: "durationRequired" }));
    if (!formData.descripcion)
      errors.push(intl.formatMessage({ id: "descriptionRequired" }));
    if (!formData.currency_id)
      errors.push(intl.formatMessage({ id: "currencyRequired" }));

    if (errors.length > 0) {
      showToast({ title: errors.join("\n"), status: "error" }); // Un solo toast con todos los errores
      return false;
    }
    return true;
  };

  return validateForm;
};

export default useValidateForm;
