import React from "react"
import { View, Text, TouchableOpacity, Animated } from "react-native"
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import UserCard from "./components/UserCard"
import { styles } from "./UsuariosStyles"
import api from "@/services/api/admin"
import type { IUser, IUserInfo } from "./UsuariosType"
import { Input, ScrollView } from "native-base"
import * as Progress from "react-native-progress"
import { Colors } from "@/constants/Colors"
import { useUser } from "@/hooks/redux/useUser"
import ModalCreateUser from "./components/ModalCreateUser"
import ModalEditUser from "./components/ModalEditUser"
import { FormattedMessage, useIntl } from "react-intl"
import CustomText from "@/components/CustomText"
import { useToastContext } from "@/contexts/ToastContext"

const initialValues = {
  data: [],
  loading: true,
}

const UsuariosEmpresasScreen: React.FC = () => {
  const intlRef = useIntl()

  const { user } = useUser()
  const [userData, setUserData] = React.useState<IUserInfo>(initialValues)
  const [stateModal, setStateModal] = React.useState({
    modalEdit: false,
    modalCreate: false,
  })
  const [stateSearchValue, setStateSearchValue] = React.useState<boolean>(false)
  const [valueSearch, setValueSearch] = React.useState<string>('')
  const [selectedUser, setSelectedUser] = React.useState<any>(undefined)

  const { showToast } = useToastContext()
  const router = useRouter()
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current

  const toggleSearchValue = () => {
    setStateSearchValue((prev) => !prev)
  }

  const uploadUsers = async () => {
    try {
      const resp = await api.user.findAll(user.id_empresa);
      setUserData((prevState) => ({
        ...prevState,
        data: resp.data,
      }))

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()

      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start()
    } catch (error) {
      console.log("error", error)
    } finally {
      setUserData((prevState) => ({
        ...prevState,
        loading: false,
      }))
    }
  }

  React.useEffect(() => {
    uploadUsers()
  }, [])


  const toggleModalState = (key: "modalEdit" | "modalCreate", value: boolean) => {
    setStateModal((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const addNewUser = (user: IUser) => {
    setUserData((prevState) => ({
      ...prevState,
      data: [...prevState.data, user],
    }))
  }

  const selectEditUser = (user: IUser) => {
    toggleModalState("modalEdit", true);
    setSelectedUser(user);
  };

  const editUserSelected = async (userId: number, userData: any) => {
    try {
      const resp = await api.user.update(userId, userData)
      if (resp) {
        console.log('respondio', resp.data);

        setUserData((prevState) => ({
          ...prevState,
          data: prevState.data.map((user) =>
            user.id === userId ? resp : user,
          ),
        }));
        toggleModalState("modalEdit", false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteUser = async (userId: number) => {
    try {
      const resp = await api.user.delete(userId)
      if (resp.ok) {
        setUserData((prevState) => ({
          ...prevState,
          data: prevState.data.filter((data) => data.id !== userId),
        }))

        showToast({
          title: intlRef.formatMessage({
            id: "userDeleted",
            defaultMessage: "User deleted successfully",
          }),
          status: "success",
        })
      }
    } catch (error: any) {
      console.log("error")
      showToast({
        title: error.response.data.message,
        status: "error",
      })
    }
  }

  const filteredUsers = React.useMemo(() => {
    return userData.data.filter((user) =>
      user.nombre.toLowerCase().includes(valueSearch.toLocaleLowerCase())
    );
  }, [userData.data, valueSearch]);
  
  return (
    <View style={styles.container}>
      <View style={[styles.headerGradient, { backgroundColor: Colors.light.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <AntDesign name="arrowleft" size={22} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <CustomText style={styles.businessName} accessibilityLabel="Pedidos">
              <FormattedMessage id="users" />
            </CustomText>
          </View>
          <TouchableOpacity onPress={toggleSearchValue} style={styles.searchButton} activeOpacity={0.7}>
            <MaterialIcons name="search" size={22} color="white" />
          </TouchableOpacity>
        </View>
        {
          stateSearchValue &&
          <View style={styles.inputContainer}>
            <Input onChangeText={(text: string)=> setValueSearch(text)} placeholder="Search user" variant="unstyled" style={styles.input} value={valueSearch} ></Input>
          </View>
        }
      </View>

      {userData.loading ? (
        <View style={styles.spinner}>
          <Progress.Circle
            color={Colors.light.primary}
            indeterminate={true}
            size={60}
            borderWidth={3}
          />
          <Text style={styles.loadingText}>
            <FormattedMessage id="loading" defaultMessage="Loading users..." />
          </Text>
        </View>
      ) : filteredUsers.length > 0 ? (
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredUsers.map((infoUser, index) => (
              <UserCard
                allowManage={user.firstUser}
                selectEditUser={selectEditUser}
                deleteUser={onDeleteUser}
                key={index}
                infoUser={infoUser}
              />
            ))}
          </ScrollView>
        </Animated.View>
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="people-outline" size={80} color={`${Colors.light.primary}80`} />
          <Text style={styles.emptyStateText}>
            <FormattedMessage id="noUsers" defaultMessage="No users found" />
          </Text>
          <Text style={styles.emptyStateSubtext}>
            <FormattedMessage id="addUserPrompt" defaultMessage="Add your first user by clicking the + button below" />
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => toggleModalState("modalCreate", true)}
        activeOpacity={0.8}
      >
        <View style={[styles.addButtonGradient, { backgroundColor: Colors.light.primary }]}>
          <Ionicons name="add" size={30} color="#fff" />
        </View>
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
  )
}

export default UsuariosEmpresasScreen
