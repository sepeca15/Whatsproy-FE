import ApiInstances from "@/services/axios/axiosConfig";

export const uploadImage = async (image: {
  uri: string;
  type: string;
  name: string;
}) => {
  const formData = new FormData();
  formData.append("file", {
    uri: image.uri,
    type: image.type,
    name: image.name,
  } as any);

  try {
    const { data } = await ApiInstances("global").post(
      "upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  } catch (error: any) {
    console.log('xdxd');
    
    console.log("Error al subir la imagen", error.response.data.message);
    throw error;
  }
};
