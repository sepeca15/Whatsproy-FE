import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";

interface UseImagePickerProps {
  toastErrorMessage: string;
 
  onImagePicked: (data: { localUri?: string; apiUrl?: string }) => void;
}

const useImagePicker = ({ toastErrorMessage, onImagePicked }: UseImagePickerProps) => {
  const { showToast } = useToastContext();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageApiUrl, setImageApiUrl] = useState<string | null>(null);

  const pickImage = async (setFormData?: Function) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      if (!asset.uri) {
        showToast({ title: toastErrorMessage, status: "error" });
        return;
      }


      setImageUri(asset.uri);
      onImagePicked({ localUri: asset.uri });

      await uploadImage(asset, setFormData);
    } catch (error) {
      console.error("Error en pickImage:", error);
      showToast({ title: toastErrorMessage, status: "error" });
    }
  };

  const uploadImage = async (asset: any, setFormData?: Function) => {
    try {
      const file = {
        uri: asset.uri,
        type: asset.mimeType || "image/png",
        name: asset.fileName || `image_${Date.now()}.png`,
      };

      const uploadResponse = await api.image.upload(file);

      if (uploadResponse?.url) {
        setFormData?.((prevData: Record<string, any>) => ({
          ...prevData,
          imagen: uploadResponse.url,

        }));

      
        setImageApiUrl(uploadResponse.url);
        onImagePicked({ apiUrl:  await uploadResponse.url });
      } else {
        console.error("Error al subir la imagen: No se recibió una URL.");
        showToast({ title: toastErrorMessage, status: "error" });
      }
    } catch (error) {
      console.error("Error en uploadImage:", error);
      showToast({ title: toastErrorMessage, status: "error" });
    }
  };

  return { pickImage, setImageUri, imageUri };
};

export default useImagePicker;
