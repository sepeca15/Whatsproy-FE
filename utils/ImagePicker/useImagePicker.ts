import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";

interface UseImagePickerProps {
    toastErrorMessage: string;
    toastSuccessMessage: string;
    onImagePicked: (uri: string) => void; 
  }

const useImagePicker = ({ toastErrorMessage, toastSuccessMessage, onImagePicked }: UseImagePickerProps) => {
  const { showToast } = useToastContext();
const [imageUri, setImageUri] = useState<string | null>(null); // Renombramos a imageUri
const [imageResp, setimageResp] = useState<string | null>(null); // Renombramos a imageUri
  const pickImage = async (setFormData: Function) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        console.error("Error: No se pudo obtener la URI de la imagen.");
        showToast({ title: toastErrorMessage, status: "error" });
        return;
      }
      onImagePicked(asset.uri);
      setImageUri(asset.uri);

      const file = {
        uri: asset.uri,
        type: asset.mimeType || "image/png",
        name: asset.fileName || `image_${Date.now()}.png`,
      };

      const uploadResponse = await api.image.upload(file);

      if (uploadResponse?.url) {
        setFormData((prevData: Record<string, any>) => ({ ...prevData, imagen: uploadResponse.url }));
        
        showToast({ title: toastSuccessMessage, status: "success" });
      } else {
        console.error("Error al subir la imagen: No se recibió una URL.");
        showToast({ title: toastErrorMessage, status: "error" });
      }
    } catch (error) {
      console.error("Error en pickImage:", error);
      showToast({ title: toastErrorMessage, status: "error" });
    }
  };

  return { pickImage, setImageUri, imageUri };
};

export default useImagePicker;
