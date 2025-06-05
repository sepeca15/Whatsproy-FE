import * as React from "react";
import InputField from "@/components/InputField";
import GlobalModal from "@/components/Modal";
import { Button, Image, Text, View } from "native-base";
import useImagePicker from "@/utils/ImagePicker/useImagePicker";
import { FormattedMessage } from "react-intl";
import { MaterialIcons } from "@expo/vector-icons";
import { ICategoryData } from "../CardCategory/CardCategory";

interface IModalCreateCategory {
  onClose: () => void;
  isOpen: boolean;
  categorySelected: ICategoryData | null;
  editCategorie: (editedCategory: ICategoryData) => void;
  createCategory: (createdCategory: ICategoryData) => void;
}

const initialState = {
  name: "",
  description: "",
  image: "",
};

const ModalCreateOrEditCategory = ({
  isOpen,
  onClose,
  categorySelected,
  editCategorie,
  createCategory
}: IModalCreateCategory) => {
  const [formData, setFormData] = React.useState<Partial<ICategoryData>>(categorySelected ? { ...categorySelected } : initialState);
  const [errors, setErrors] = React.useState<any>({});
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const [selectedImage, setSelectedImage] = React.useState<any>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (categorySelected) {
        setSelectedImage(formData.image)
      }
    }
    return () => {
      setFormData(initialState)
      setSelectedImage(null)
      setErrors({})
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (selectedImage) {
      handleChangeValue('image', selectedImage)
    }
  }, [selectedImage]);

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
    if (!formData.image) {
      setErrors((prevState: any) => ({
        ...prevState,
        image: "Please enter a valid image (pref png)",
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
    try {
      setLoadingApi(true)

      if (categorySelected) {
        await editCategorie(formData as ICategoryData)
      } else {
        await createCategory(formData as ICategoryData);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false);
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
              shadow={"2"}
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
            <Button
              size={"sm"}
              mt={4}
              bg={"gray.800"}
              onPress={handleImagePick}
            >
              <View
                style={{ gap: 8 }}
                display={"flex"}
                flexDir={"row"}
                alignItems={"center"}
              >
                <MaterialIcons name="photo" size={20} color={"white"} />
                <Text color={"white"}>
                  <FormattedMessage id="uploadPhoto" />
                </Text>
              </View>
            </Button>
            {errors.image && (
              <Text color={"red.400"} my={1}>
                {errors.image}
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
          <Text color={"gray.500"}>
            <FormattedMessage id="cancel" />
          </Text>
        </Button>,
        <Button
          isLoading={loadingApi}
          key="Accept"
          size="md"
          backgroundColor={"#2C2C2C"}
          borderRadius="md"
          onPress={validData}
        >
          <Text color={'white'}>
            {
              categorySelected ?
                <FormattedMessage id="saveButton" />
                :
                <FormattedMessage id="accept" />
            }
          </Text>
        </Button>,
      ]}
    />
  );
};

export default ModalCreateOrEditCategory;
