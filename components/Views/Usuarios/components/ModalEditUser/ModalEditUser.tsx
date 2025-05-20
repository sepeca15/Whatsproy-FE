import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity, ScrollView, Image } from "react-native";
import { FormControl, Input, Modal, Select } from "native-base";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./ModalEditUserStyles";
import api from "@/services/api/admin";
import CustomButton from "@/components/CustomButton";
import { useIntl } from "react-intl"; // Importa useIntl
import useImagePicker from "@/utils/ImagePicker/useImagePicker";
import { useToastContext } from "@/contexts/ToastContext";

interface IEditUser {
  nombre: string;
  apellido: string;
  photo: string;
  activo: boolean;
}

interface IModalCreateUser {
  onToogleModal: () => void;
  isOpen: boolean;
  userInfo: any;
  editUserSelected: (userId: number, userData: any) => void;
}

const ModalEditUser = ({
  onToogleModal,
  isOpen,
  userInfo,
  editUserSelected,
}: IModalCreateUser) => {
  const [formData, setFormData] = useState<IEditUser>(userInfo);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const intl = useIntl(); 
  const { showToast } = useToastContext();

  const [selectedImage, setSelectedImage] = useState<string | null>();
  useEffect(() => {
    if (userInfo) {
      setFormData(userInfo);
    }
  }, [userInfo]);

  const handleInputChange = useCallback(
    (key: keyof IEditUser, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );
  

  const { pickImage } = useImagePicker({
    toastErrorMessage: "Error al seleccionar la imagen",
    onImagePicked: async ({ localUri, apiUrl }) => {
      if (localUri) {
        setSelectedImage(localUri.toString());
      }
      console.log('apiurl', apiUrl);
      
      if (apiUrl) {
        setFormData((prevData) => ({
          ...prevData,
          image: apiUrl,
        }));
      }
    },
  });

  const handleImagePick = async () => {
    try {
      await pickImage(setFormData);
    } catch (error) {
      console.error("Error selecting image:", error);
      showToast({
        title: intl.formatMessage({ id: "errorSelectingImage" }),
        status: "error",
      });
    } finally {
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nombre)
      newErrors.nombre = intl.formatMessage({
        id: "modalValidName",
        defaultMessage: "Please enter a valid name",
      });
    if (!formData.apellido)
      newErrors.apellido = intl.formatMessage({
        id: "modalValidLastName",
        defaultMessage: "Please enter a valid last name",
      });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {    
    console.log(validate());
    
      if (!validate()) return;
      setLoading(true);
      try {                
        await editUserSelected(userInfo.id, formData);
      } catch (error) {
        console.error("Error updating user:", error);
      } finally {
        setLoading(false);
      }
  };

  return (
    <Modal onClose={onToogleModal} isOpen={isOpen}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>
          {intl.formatMessage({
            id: "modalEditUser",
            defaultMessage: "Edit User",
          })}
        </Modal.Header>
        <Modal.Body>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
              <Image
                source={{
                  uri:
                    selectedImage ||
                    "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
                }}
                style={styles.image}
              />
              <Ionicons
                name="camera"
                size={16}
                color="#fff"
                style={styles.imagePicker}
              />
            </TouchableOpacity>

            <FormControl isInvalid={!!errors.nombre}>
              <FormControl.Label>
                {intl.formatMessage({
                  id: "modalName",
                  defaultMessage: "Name",
                })}
              </FormControl.Label>
              <Input
                placeholder={intl.formatMessage({
                  id: "modalEnterName",
                  defaultMessage: "Enter a name",
                })}
                value={formData.nombre}
                onChangeText={(value) => handleInputChange("nombre", value)}
                InputLeftElement={
                  <AntDesign
                    name="user"
                    size={16}
                    color="gray"
                    style={styles.marginCont}
                  />
                }
              />
              <FormControl.ErrorMessage>
                {errors.nombre}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.apellido}>
              <FormControl.Label>
                {intl.formatMessage({
                  id: "modalLastName",
                  defaultMessage: "Last Name",
                })}
              </FormControl.Label>
              <Input
                placeholder={intl.formatMessage({
                  id: "modalEnterLastName",
                  defaultMessage: "Enter a last name",
                })}
                value={formData.apellido}
                onChangeText={(value) => handleInputChange("apellido", value)}
                InputLeftElement={
                  <AntDesign
                    name="user"
                    size={16}
                    color="gray"
                    style={styles.marginCont}
                  />
                }
              />
              <FormControl.ErrorMessage>
                {errors.apellido}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl>
              <FormControl.Label>
                {intl.formatMessage({
                  id: "modalActive",
                  defaultMessage: "Active",
                })}
              </FormControl.Label>
              <Select
                borderRadius={8}
                selectedValue={formData.activo ? "Si" : "No"}
                onValueChange={(value) =>
                  handleInputChange("activo", value === "Si")
                }
                minWidth="100%"
              >
                <Select.Item label="Si" value="Si" />
                <Select.Item label="No" value="No" />
              </Select>
            </FormControl>
          </ScrollView>
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            colorSpiner="white"
            loading={loading}
            onPress={handleSubmit}
            style={styles.buttonCreate}
          >
            {intl.formatMessage({ id: "modalSave", defaultMessage: "Save" })}
          </CustomButton>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ModalEditUser;
