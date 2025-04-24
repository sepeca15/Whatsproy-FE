import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Animated,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import UserCard from "./components/UserCard";
import { styles } from "./UsuariosStyles";
import api from "@/services/api/admin";
import { IUser, IUserInfo } from "./UsuariosType";
import { ScrollView } from "native-base";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { useUser } from "@/hooks/redux/useUser";
import ModalCreateUser from "./components/ModalCreateUser";
import ModalEditUser from "./components/ModalEditUser";
import { FormattedMessage, useIntl } from "react-intl";
import Usuarios from ".";
import { FadeIn } from "react-native-reanimated";
import CustomText from "@/components/CustomText";

const initialValues = {
  data: [],
  loading: true,
};
const UsuariosEmpresasScreen: React.FC = () => {
  const { user } = useUser();
  const intl = useIntl();
  const [userData, setUserData] = React.useState<IUserInfo>(initialValues);
  const [stateModal, setStateModal] = React.useState({
    modalEdit: false,
    modalCreate: false,
  });
  const [selectedUser, setSelectedUser] = React.useState<any>(undefined);
  const router = useRouter();

  const uploadUsers = async () => {
    try {
      const resp = await api.user.findAll(user.id_empresa);
      setUserData((prevState) => ({
        ...prevState,
        data: resp.data,
      }));
    } catch (error) {
      console.log("error", error);
    } finally {
      setUserData((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  React.useEffect(() => {
    uploadUsers();
  }, []);

  const toggleModalState = (
    key: "modalEdit" | "modalCreate",
    value: boolean,
  ) => {
    setStateModal((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addNewUser = (user: IUser) => {
    setUserData((prevState) => ({
      ...prevState,
      data: [...prevState.data, user],
    }));
  };

  const deleteUser = (userId: number) => {
    setUserData((prevState) => ({
      ...prevState,
      data: prevState.data.filter((data) => data.id !== userId),
    }));
  };

  const selectEditUser = (user: IUser) => {
    toggleModalState("modalEdit", true);
    setSelectedUser(user);

  };

  const editUserSelected = (userId: number, userData: any) => {
    setUserData((prevState) => ({
      ...prevState,
      data: prevState.data.map((user) =>
        user.id === userId ? { ...user, ...userData } : user,
      ),


    }));
  };
  return (
    <View style={styles.container}>
      <Animated.View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="arrowleft" size={22} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <CustomText
              style={styles.businessName}
              accessibilityLabel="Pedidos"
            >
              <FormattedMessage
                id="users"
              />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      {userData.loading === true ? (
        <View style={styles.spinner}>
          <Progress.Circle
            color={Colors.light.primary}
            indeterminate={true}
            size={100}
          />
        </View>
      ) : (
        userData.data.length > 0 && (
          <ScrollView style={{ flex: 1 }} horizontal={false}>
            {userData.data.map((infoUser, index) => {
              return (
                <UserCard
                  allowManage={user.firstUser}
                  selectEditUser={selectEditUser}
                  deleteUser={deleteUser}
                  key={index}
                  infoUser={infoUser}
                />
              );
            })}
          </ScrollView>
        )
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => toggleModalState("modalCreate", true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <ModalCreateUser
        onToogleModal={() => toggleModalState("modalCreate", false)}
        isOpen={stateModal.modalCreate}
        addNewUser={addNewUser}
      />
      {selectedUser && (
        <ModalEditUser
          editUserSelected={editUserSelected}
          onToogleModal={() => toggleModalState("modalEdit", false)}
          isOpen={stateModal.modalEdit}
          userInfo={selectedUser}
        />
      )}
    </View>
  );
};

export default UsuariosEmpresasScreen;
