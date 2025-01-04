import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, useColorScheme, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserCard from './components/UserCard';
import { styles } from './UsuariosStyles';
import api from '@/services/api/admin';
import { IUserInfo } from './UsuariosType';
import { Button, Modal, ScrollView } from 'native-base';
import * as Progress from "react-native-progress";
import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/redux/useUser';
import ModalCreateUser from './components/ModalCreateUser';

const initialValues = {
  data: [],
  loading: true
}
const UsuariosEmpresasScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useUser()
  const [userData, setUserData] = React.useState<IUserInfo>(initialValues)
  const [stateModal, setStateModal] = React.useState<boolean>(false)


  const uploadUsers = async () => {
    try {
      const resp = await api.user.findAll(user.id_empresa)
      setUserData((prevState) => ({
        ...prevState,
        data: resp.data
      }))

    } catch (error) {
      console.log('error', error);
    } finally {
      setUserData((prevState) => ({
        ...prevState,
        loading: false
      }))
    }
  }

  React.useEffect(() => {
    uploadUsers()
  }, [])

  const toggleModalState = () => {
    setStateModal((prev) => !prev)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>
      {
        userData.loading === true ?
          <View style={styles.spinner}>
            <Progress.Circle color={Colors.light.primary} indeterminate={true} size={100} />
          </View>
          :
          userData.data.length > 0 &&
          <ScrollView style={{ flex: 1 }} horizontal={false}>
            {
              userData.data.map((infoUser, index) => {
                return <UserCard key={index} infoUser={infoUser} />
              })
            }
          </ScrollView>
      }

      <TouchableOpacity
        style={styles.addButton}
        onPress={toggleModalState}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

            <ModalCreateUser onToogleModal={toggleModalState} isOpen={stateModal}/>
    </View>
  );
};

export default UsuariosEmpresasScreen;

