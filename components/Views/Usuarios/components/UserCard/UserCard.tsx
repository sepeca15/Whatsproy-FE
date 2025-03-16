import React from "react";
import { Pressable, View, Text } from "react-native";
import styles from "./UserCardStyles";
import FatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IUser } from "../../UsuariosType";
import api from "@/services/api/admin";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import { useUser } from "@/hooks/redux/useUser";
import { useToastContext } from "@/contexts/ToastContext";
import { useIntl } from "react-intl"; // Importa useIntl

interface IUserCard {
  infoUser: IUser;
  deleteUser: (id: number) => void;
  selectEditUser: (user: any) => void;
  allowManage: boolean;
}

const UserCard = ({
  infoUser,
  deleteUser,
  selectEditUser,
  allowManage,
}: IUserCard) => {
  const [stateModal, setStateModal] = React.useState<boolean>(false);
  const { user } = useUser();
  const { showToast } = useToastContext();
  const intl = useIntl(); // Usa useIntl para obtener la instancia de intl

  const onDeleteUser = async () => {
    try {
      const resp = await api.user.delete(infoUser.id);
      if (resp.ok) {
        deleteUser(infoUser.id);
        showToast({
          title: intl.formatMessage({
            id: "userDeleted",
            defaultMessage: "User deleted successfully",
          }),
          status: "success",
        });
      }
    } catch (error: any) {
      console.log("error");
      showToast({
        title: error.response.data.message,
        status: "error",
      });
    }
  };

  const toggleModal = () => {
    setStateModal((prevState) => !prevState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.data}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <FatherIcon name="user" size={20} color={"gray"} />
          </View>
          <View style={styles.Column}>
            <Text style={styles.textName}>
              {user.id === infoUser.id
                ? intl.formatMessage({ id: "me", defaultMessage: "Me" })
                : infoUser.nombre}
            </Text>
            <Text style={styles.textCorreo}>{infoUser.correo}</Text>
          </View>
          <View style={styles.statusUser}>
            <MaterialCommunityIcons
              size={18}
              name={infoUser.activo ? "check" : "close"}
              color={"#000035"}
            />
            <Text style={{ color: "#8e8e95" }}>
              {infoUser.activo
                ? intl.formatMessage({ id: "active", defaultMessage: "Active" })
                : intl.formatMessage({
                    id: "inactive",
                    defaultMessage: "Inactive",
                  })}
            </Text>
          </View>
        </View>
      </View>
      {allowManage ? (
        <View style={styles.buttons}>
          <Pressable
            onPressIn={() => selectEditUser(infoUser)}
            style={styles.buttonEdit}
            accessibilityRole="button"
            onPress={() => {}}
          >
            <FatherIcon name="edit-2" size={12} color={"#000035"} />
            <Text style={styles.textEdit}>
              {intl.formatMessage({ id: "edit", defaultMessage: "Edit" })}
            </Text>
          </Pressable>
          <Pressable
            disabled={user.id === infoUser.id}
            onPressIn={toggleModal}
            style={
              user.id === infoUser.id
                ? styles.disabledDelete
                : styles.buttonDelete
            }
            accessibilityRole="button"
            onPress={() => {}}
          >
            <MaterialCommunityIcons
              name="delete-empty"
              size={14}
              color={"white"}
            />
            <Text style={styles.textDelete}>
              {intl.formatMessage({ id: "delete", defaultMessage: "Delete" })}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text style={{ alignSelf: "flex-end" }}>
          {intl.formatMessage({
            id: "noPermission",
            defaultMessage: "You do not have permission to manage users",
          })}
        </Text>
      )}
      <ModalConfirmAction
        isOpen={stateModal}
        onContinue={onDeleteUser}
        onClose={toggleModal}
        message={intl.formatMessage({
          id: "confirmDeleteUser",
          defaultMessage: "Do you want to delete the selected user?",
        })}
        title={intl.formatMessage({
          id: "deleteUser",
          defaultMessage: "Delete User",
        })}
      />
    </View>
  );
};

export default UserCard;
