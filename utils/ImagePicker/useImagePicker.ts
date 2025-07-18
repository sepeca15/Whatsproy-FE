import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";

interface UseImagePickerProps {
  toastErrorMessage?: string;

  onImagePicked?: (data: { localUri?: string; apiUrl?: string }) => void;
}

const useImagePicker = ({ toastErrorMessage, onImagePicked }: UseImagePickerProps) => {
  const { showToast } = useToastContext();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const pickImage = async (setFormData?: Function) => {
    setLoadingUpload(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      if (!asset.uri) {
        showToast({ title: toastErrorMessage, status: "error" });
        return;
      }

      setImageUri(asset.uri);
      if (onImagePicked) {
        onImagePicked({ localUri: asset.uri });
      }

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
          [prevData.hasOwnProperty("image") ? "image" : "imagen"]: uploadResponse.url,
        }));

        if (onImagePicked) {
          console.log('entro aqui');
          
          onImagePicked({ apiUrl: uploadResponse.url });
        }
        return uploadResponse?.url;
      } else {
        console.error(": No se recibió una URL.");
        showToast({ title: toastErrorMessage, status: "error" });
      }
    } catch (error) {
      console.error("Error en uploadImage:", error);
      showToast({ title: toastErrorMessage, status: "error" });
      return undefined;
    } finally {
      setLoadingUpload(false);
    }
  };

  return { pickImage, setImageUri, imageUri, uploadImage, loadingUpload };
};

export default useImagePicker;
