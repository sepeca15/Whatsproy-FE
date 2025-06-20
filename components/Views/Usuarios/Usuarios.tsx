"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  TextInput,
  StatusBar,
  RefreshControl,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import UserCard from "@/components/Views/Usuarios/components/UserCard/UserCard"
import CreateUserModal from "./components/ModalCreateUser/ModalCreateUser"
import EditUserModal from "./components/ModalEditUser/ModalEditUser"
import type { IUser, IUserInfo } from "./UsuariosType"
import { Colors } from "@/constants/Coloresuser"
import { styles } from "./UsuariosStyles"
import api from "@/services/api/admin"
import { useUser } from "@/hooks/redux/useUser";

const UsersScreen: React.FC = () => {
  const [userData, setUserData] = useState<IUserInfo>({
    data: [],
    loading: true,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [companyId, setCompanyId] = useState<number | null>(null)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const searchAnim = useRef(new Animated.Value(0)).current
  const fabAnim = useRef(new Animated.Value(0)).current
  const { user } = useUser();

  useEffect(() => {
    loadUsers()
    getCurrentUser()
  }, [])

  // Animar elementos cuando los datos se cargan
  useEffect(() => {
    if (!userData.loading && userData.data.length > 0) {
      // Animar las cards
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start()

      // Animar el FAB
      Animated.spring(fabAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start()
    }
  }, [userData.loading, userData.data.length, fadeAnim, fabAnim])

  const getCurrentUser = async () => {
    try {
      const currentUser = await api.auth.me()
      if (currentUser?.id) {
        setCurrentUserId(currentUser.id)
        // Asumiendo que el usuario actual tiene información de la empresa
        if (currentUser.id_empresa) {
          setCompanyId(currentUser.id_empresa)
        }
      }
    } catch (error) {
      console.error("Error getting current user:", error)
    }
  }

  const loadUsers = async () => {
    try {
      setUserData((prev) => ({ ...prev, loading: true }))

      // Reset animations
      fadeAnim.setValue(0)
      fabAnim.setValue(0)

    const response = await api.user.findAll(user.id_empresa)
    console.log("Usuarios cargados:", response)

      if (!response || response.error) {
        throw new Error(response?.error || "Error al cargar los usuarios")
      }


      if (response && Array.isArray(response)) {
        // Mapear los datos de la API al formato esperado
        const mappedUsers: IUser[] = response.map((user: any) => ({
          id: user.id,
          nombre:
            user.nombre && user.apellido
              ? `${user.nombre} ${user.apellido}`.trim()
              : user.name || user.nombre || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          correo: user.correo || user.email || "",
          activo: user.activo !== undefined ? user.activo : user.active !== undefined ? user.active : true,
          isAdmin: user.isAdmin || user.role === "admin" || false,
          image: user.image || user.avatar || null,
        }))

        setUserData({
          data: mappedUsers,
          loading: false,
        })
      } else {
        setUserData({
          data: [],
          loading: false,
        })
      }
    } catch (error) {
      console.error("Error loading users:", error)
      setUserData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      }))

      Alert.alert("Error", "No se pudieron cargar los usuarios. Por favor, intenta de nuevo.", [{ text: "OK" }])
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadUsers()
    setRefreshing(false)
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    Animated.timing(searchAnim, {
      toValue: showSearch ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start()

    if (showSearch) {
      setSearchQuery("")
    }
  }

  const filteredUsers = useMemo(
    () =>
      userData.data.filter(
        (user) =>
          user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.correo.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [userData.data, searchQuery],
  )

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      Alert.alert("Confirmar eliminación", "¿Estás seguro de que deseas eliminar este usuario?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.user.delete(userId)

              // Actualizar la lista local
              setUserData((prev) => ({
                ...prev,
                data: prev.data.filter((user) => user.id !== userId),
              }))

              Alert.alert("Éxito", "Usuario eliminado correctamente")
            } catch (error) {
              console.error("Error deleting user:", error)
              Alert.alert("Error", "No se pudo eliminar el usuario")
            }
          },
        },
      ])
    } catch (error) {
      console.error("Error in handleDeleteUser:", error)
    }
  }

  const handleCreateUser = async (newUserData: Omit<IUser, "id">) => {
    try {
      if (!companyId) {
        Alert.alert("Error", "No se pudo obtener la información de la empresa")
        return
      }

      // Separar nombre y apellido del nombre completo
      const nameParts = newUserData.nombre.trim().split(" ")
      const nombre = nameParts[0] || ""
      const apellido = nameParts.slice(1).join(" ") || ""

      // Mapear los datos al formato esperado por la API
      const userData = {
        nombre: nombre,
        apellido: apellido,
        correo: newUserData.correo,
        password: "123456", // Contraseña temporal - deberías manejar esto de manera más segura
        id_empresa: companyId,
      }

      const createdUser = await api.user.create(userData)

      if (createdUser) {
        // Mapear la respuesta de vuelta al formato local
        const newUser: IUser = {
          id: createdUser.id,
          nombre:
            createdUser.nombre && createdUser.apellido
              ? `${createdUser.nombre} ${createdUser.apellido}`.trim()
              : createdUser.name || "",
          correo: createdUser.correo || createdUser.email || "",
          activo: createdUser.activo !== undefined ? createdUser.activo : true,
          isAdmin: newUserData.isAdmin, // Usar el valor del formulario
          image: createdUser.image || null,
        }

        setUserData((prev) => ({
          ...prev,
          data: [...prev.data, newUser],
        }))

        setShowCreateModal(false)
        Alert.alert("Éxito", "Usuario creado correctamente")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      Alert.alert("Error", "No se pudo crear el usuario")
    }
  }

  const handleUpdateUser = async (updatedUser: IUser) => {
    try {
      // Separar nombre y apellido del nombre completo
      const nameParts = updatedUser.nombre.trim().split(" ")
      const nombre = nameParts[0] || ""
      const apellido = nameParts.slice(1).join(" ") || ""

      // Mapear los datos al formato esperado por la API
      const userData = {
        id: updatedUser.id,
        nombre: nombre,
        apellido: apellido,
        correo: updatedUser.correo,
        activo: updatedUser.activo,
        isAdmin: updatedUser.isAdmin,
      }

      const response = await api.user.update(user.id, userData)

      if (response) {
        // Actualizar la lista local
        setUserData((prev) => ({
          ...prev,
          data: prev.data.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
        }))

        setShowEditModal(false)
        setSelectedUser(null)
        Alert.alert("Éxito", "Usuario actualizado correctamente")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      Alert.alert("Error", "No se pudo actualizar el usuario")
    }
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <View style={styles.emptyIconBackground}>
          <Ionicons name="people-outline" size={60} color={Colors.light.primary} />
        </View>
      </View>
      <Text style={styles.emptyTitle}>{searchQuery ? "No se encontraron usuarios" : "No hay usuarios"}</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer usuario"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.emptyActionButton} onPress={() => setShowCreateModal(true)} activeOpacity={0.8}>
          <View style={styles.emptyActionContent}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.emptyActionText}>Crear Usuario</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )

  const renderUserCard = ({ item, index }: { item: IUser; index: number }) => {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <UserCard
          user={item}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          currentUserId={currentUserId || 0}
          allowManage={true}
        />
      </Animated.View>
    )
  }

  if (userData.loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.light.primary} />
        <View style={styles.loadingBackground}>
          <View style={styles.loadingContent}>
            <Animated.View
              style={[
                styles.loadingSpinner,
                {
                  transform: [
                    {
                      rotate: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.loadingText}>Cargando usuarios...</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Usuarios</Text>
            <Text style={styles.headerSubtitle}>{userData.data.length} usuarios registrados</Text>
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={toggleSearch} activeOpacity={0.7}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              height: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 60],
              }),
              opacity: searchAnim,
            },
          ]}
        >
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar usuarios..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {filteredUsers.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.light.primary]}
                tintColor={Colors.light.primary}
              />
            }
          />
        )}
      </View>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [
              {
                scale: fabAnim,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.fab} onPress={() => setShowCreateModal(true)} activeOpacity={0.8}>
          <View style={styles.fabContent}>
            <Ionicons name="add" size={28} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Modals */}
      <CreateUserModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateUser={handleCreateUser}
      />

      {selectedUser && (
        <EditUserModal
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          user={selectedUser}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </SafeAreaView>
  )
}

export default UsersScreen
