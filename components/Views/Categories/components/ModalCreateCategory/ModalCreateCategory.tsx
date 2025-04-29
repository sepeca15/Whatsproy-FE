import * as React from "react";
import InputField from "@/components/InputField";
import GlobalModal from "@/components/Modal";
import { Button, Image, Text, View } from "native-base";
import useImagePicker from "@/utils/ImagePicker/useImagePicker";
import api from "@/services/api/admin";
import { FormattedMessage } from "react-intl";
import { MaterialIcons } from "@expo/vector-icons";

interface IModalCreateCategory {
  onClose: () => void;
  isOpen: boolean;
  addCategory: (newCategory: any) => void;
}

const initialState = {
  name: "",
  description: "",
  imagen: "",
};

const ModalCreateCategory = ({
  isOpen,
  onClose,
  addCategory,
}: IModalCreateCategory) => {
  const [formData, setFormData] = React.useState(initialState);
  const [errors, setErrors] = React.useState<any>({});
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false)
  const [selectedImage, setSelectedImage] = React.useState<any>(null);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
      setErrors({});
      setSelectedImage(null);
    }
  }, [isOpen]);

  const handleChangeValue = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImagePick = async () => {
    pickImage(setFormData);
  };

  const { pickImage, setImageUri, imageUri } = useImagePicker({
    toastErrorMessage: "Error al seleccionar la imagen",

    onImagePicked: ({ localUri }) => {
      if (localUri) {
        setSelectedImage(localUri);
      }
    },
  });

  const validData = () => {
    setLoadingApi(true)

    if (!formData.imagen) {
      setErrors((prevState: any) => ({
        ...prevState,
        imagen: "Please enter a valid image (pref png)",
      }));
      return;
    }
    if (!formData.name) {
      setErrors((prevState: any) => ({
        ...prevState,
        name: "Please enter a valid name",
      }));
      return;
    }
    if (!formData.description) {
      setErrors((prevState: any) => ({
        ...prevState,
        description: "Please enter a valid description",
      }));
      return;
    }
    onSubmit();
  };

  const onSubmit = async () => {
    setLoadingApi(true)
    try {
      const resp = await api.category.create({
        ...formData,
        image: formData.imagen,
      });

      if (resp.ok) {
        onClose();
        addCategory(resp.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false)
    }
  };

  return (
    <GlobalModal
      content={
        <View
          display={"flex"}
          mb={10}
          flexDir={"column"}
          alignItems={"center"}
          w={"full"}
        >
          <View display={"flex"} flexDir={"column"} alignItems={"center"}>
            <View
              w={"120px"}
              h={"120px"}
              bg={"gray.100"}
              rounded={"full"}
              alignItems={"center"}
              shadow={'2'}
            >
              {selectedImage && (
                <Image
                  alt="selectedimage"
                  source={{ uri: selectedImage }}
                  w={"full"}
                  h={"full"}
                  rounded={"full"}
                />
              )}
            </View>
            <Button size={"sm"} mt={4} bg={"gray.800"} onPress={handleImagePick}>
              <View style={{gap:8}} display={'flex'} flexDir={'row'} alignItems={'center'} >
                <MaterialIcons name="photo" size={20} color={'white'}/>
                <Text color={'white'}>
                  <FormattedMessage id="uploadPhoto" />
                </Text>
              </View>
            </Button>
            {errors.imagen && (
              <Text color={"red.400"} my={1}>
                {errors.imagen}
              </Text>
            )}
          </View>
          <InputField
            isRequired={false}
            value={formData.name}
            onChangeText={(text) => handleChangeValue("name", text)}
            label="Name"
            placeholder="Ej: food"
            error={errors?.name}
          />
          <InputField
            isRequired={false}
            value={formData.description}
            onChangeText={(text) => handleChangeValue("description", text)}
            label="Description"
            placeholder="Ej: meals and daily menus "
            error={errors?.description}
          />
        </View>
      }
      isVisible={isOpen}
      onClose={onClose}
      label="Crear Categoria"
      actions={[
        <Button
          onPress={onClose}
          key="Cancel"
          size="md"
          background={"gray.50"}
          borderWidth={1}
          borderColor={"gray.500"}
          borderRadius="md"
          marginRight={4}
        >
          <Text color={"gray.500"}>Cancel</Text>
        </Button>,
        <Button
          isLoading={loadingApi}
          key="Accept"
          size="md"
          backgroundColor={"#2C2C2C"}
          borderRadius="md"
          onPress={validData}
        >
          Aceptar
        </Button>,
      ]}
    />
  );
};

export default ModalCreateCategory;
