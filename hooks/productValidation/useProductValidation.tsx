import { useToastContext } from "@/contexts/ToastContext";

interface ProductFormData {
  nombre: string;
  precio: number;
  plazoDuracionEstimadoMinutos: number;
  descripcion: string;
  currency_id?: any;
  categoryIds?: any[] | null; // Permitir nulo o indefinido
}

interface ValidationErrors {
  [key: string]: string;
}

export const useEditProductValidation = () => {
  const { showToast } = useToastContext();

  const validateForm = (
    formData: ProductFormData,
    selectedImage: string | null,
    setErrors: (errors: ValidationErrors) => void
  ): boolean => {
    const newErrors: ValidationErrors = {};

    if (!selectedImage) {
      showToast({
        title: "Imagen requerida",
        description: "Debe seleccionar una imagen para el producto",
        status: "error",
      });
    }
    

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del producto es obligatorio";
    }

    if (formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor que cero";
    }

    // if (!(formData.categoryIds?.length ?? 0)) {
    //   newErrors.categoryIds = "Seleccione al menos una categoría";
    // }

    if (formData.plazoDuracionEstimadoMinutos <= 0) {
      newErrors.plazoDuracionEstimadoMinutos =
        "La duración estimada debe ser mayor que cero minutos";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción del producto es obligatoria";
    }
    if (!formData.currency_id) {
      newErrors.currency_id = "Debe seleccionar una moneda";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return { validateForm };
};