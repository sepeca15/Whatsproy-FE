import ApiInstances from "@/services/axios/axiosConfig";

export const createMenuImage = async (url: string, nombre: string) => {
  const { data } = await ApiInstances('current').post('menu-images', { url, nombre });
  return data;
};


export const parseImage = async (imageUrl: string) => {
  const { data } = await ApiInstances('current').post(`menu-images/parseMenuImage?url=${imageUrl}`);

  return data;
};

export const getAllMenuImages = async () => {
  const { data } = await ApiInstances('current').get('menu-images');
  return data;
};



export const getMenuImageById = async (id: number) => {
  const { data } = await ApiInstances('current').get(`menu-images/${id}`);
  return data;
};

export const markMenuImageAsProcessed = async (id: number) => {
  const { data } = await ApiInstances('current').patch(`menu-images/${id}/processed`);
  return data;
};

export const deleteMenuImage = async (id: number) => {
  const { data } = await ApiInstances('current').delete(`menu-images/${id}`);
  return data;
};