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
import EditProfileModal from "./components/ModalEditUser/ModalEditUser"
import type { IUser, IUserInfo } from "./UsuariosType"
import { Colors } from "@/constants/Coloresuser"
import { styles } from "./UsuariosStyles"
import api from "@/services/api/admin"
import { useUser } from "@/hooks/redux/useUser"
import { router } from "expo-router"

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
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [currentUserData, setCurrentUserData] = useState<IUser | null>(null)
  const [companyId, setCompanyId] = useState<number | null>(null)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const searchAnim = useRef(new Animated.Value(0)).current
  const fabAnim = useRef(new Animated.Value(0)).current
  const { user } = useUser()

  useEffect(() => {
    uploadUsers()
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
      console.log("=== OBTENIENDO USUARIO ACTUAL ===")
      const currentUser = await api.auth.me()
      // console.log("Datos del usuario actual desde API:", currentUser)
      console.log("Imagen del usuario actual:", currentUser?.image)

      if (currentUser?.id) {
        setCurrentUserId(currentUser.id)

        // Mapear los datos del usuario actual al formato IUser
        const mappedCurrentUser: IUser = {
          id: currentUser.id,
          nombre:
            currentUser.nombre && currentUser.apellido
              ? `${currentUser.nombre} ${currentUser.apellido}`.trim()
              : currentUser.name || "Sin nombre",
          correo: currentUser.correo || currentUser.email || "Sin email",
          activo: currentUser.activo !== undefined ? currentUser.activo : true,
          isAdmin: currentUser.isAdmin || false,
          image: currentUser.image || null,
        }

        console.log("Usuario actual mapeado:", mappedCurrentUser)
        setCurrentUserData(mappedCurrentUser)

        if (currentUser.id_empresa) {
          setCompanyId(currentUser.id_empresa)
        }
      }
    } catch (error) {
      console.error("Error getting current user:", error)
    }
  }

  const uploadUsers = async () => {
    try {
      setUserData((prev) => ({ ...prev, loading: true }))

      // Reset animations
      fadeAnim.setValue(0)
      fabAnim.setValue(0)

      console.log("=== CARGANDO USUARIOS ===")
      const response = await api.user.findAll(user.id_empresa)
      // console.log("Respuesta completa de usuarios:", response)

      // Simplificado: asumimos que la API devuelve { data: [...] }
      const users = response?.data || []
      // console.log("Usuarios raw desde API:", users)

      // Mapear usuarios con validación básica
      const mappedUsers: IUser[] = users
        .filter((userItem: any) => userItem && userItem.id) // Solo usuarios válidos
        .map((userItem: any) => {
          const mapped = {
            id: userItem.id,
            nombre: userItem.nombre || userItem.name || "Sin nombre",
            correo: userItem.correo || userItem.email || "Sin email",
            activo: userItem.activo !== undefined ? userItem.activo : true,
            isAdmin: userItem.isAdmin || false,
            image: userItem.image || null,
          }

          // Log específico para el usuario actual
          if (userItem.id === currentUserId) {
            console.log(`=== USUARIO ACTUAL EN LISTA (ID: ${userItem.id}) ===`)
            console.log("Datos raw:", userItem)
            console.log("Datos mapeados:", mapped)
            console.log("Imagen:", mapped.image)
          }

          return mapped
        })

      console.log("Usuarios mapeados finales:", mappedUsers)

      setUserData({
        data: mappedUsers,
        loading: false,
      })

      // Animar elementos si hay datos
      if (mappedUsers.length > 0) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start()

        Animated.spring(fabAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start()
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
    await uploadUsers()
    await getCurrentUser()
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
          user &&
          user.nombre &&
          user.correo &&
          (user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.correo.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [userData.data, searchQuery],
  )

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleEditProfile = () => {
    if (currentUserData) {
      setShowProfileModal(true)
    }
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
      if (!user?.id_empresa) {
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
        password: "123456", // Contraseña temporal
        id_empresa: user.id_empresa,
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
          isAdmin: newUserData.isAdmin,
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
      const updateData = {
        id: updatedUser.id,
        nombre: nombre,
        apellido: apellido,
        correo: updatedUser.correo,
        activo: updatedUser.activo,
        isAdmin: updatedUser.isAdmin,
        photo: updatedUser.image, // Incluir la foto
      }

      const response = await api.user.update(updatedUser.id, updateData)

      if (response) {
        // Actualizar la lista local inmediatamente
        setUserData((prev) => ({
          ...prev,
          data: prev.data.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
        }))

        // Si es el usuario actual, también actualizar currentUserData
        if (updatedUser.id === currentUserId) {
          setCurrentUserData(updatedUser)
        }

        setShowEditModal(false)
        setSelectedUser(null)
        Alert.alert("Éxito", "Usuario actualizado correctamente")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      Alert.alert("Error", "No se pudo actualizar el usuario")
    }
  }

  const handleUpdateProfile = async (updatedProfile: IUser) => {
    try {
      // Separar nombre y apellido del nombre completo
      const nameParts = updatedProfile.nombre.trim().split(" ")
      const nombre = nameParts[0] || ""
      const apellido = nameParts.slice(1).join(" ") || ""

      // Mapear los datos al formato esperado por la API
      const updateData = {
        nombre: nombre,
        apellido: apellido,
        correo: updatedProfile.correo,
        photo: updatedProfile.image, // Incluir la foto
      }

      console.log("=== ACTUALIZANDO PERFIL ===")
      console.log("Datos a enviar:", updateData)
      console.log("URL de imagen:", updatedProfile.image)

      const response = await api.user.update(updatedProfile.id, updateData)
      console.log("Respuesta del servidor:", response)

      if (response) {
        // ACTUALIZACIÓN OPTIMISTA: Actualizar inmediatamente en la UI
        // independientemente de lo que devuelva el servidor
        console.log("=== APLICANDO ACTUALIZACIÓN OPTIMISTA ===")

        // Actualizar los datos del usuario actual PRIMERO
        setCurrentUserData(updatedProfile)

        // Actualizar en la lista de usuarios inmediatamente
        setUserData((prev) => ({
          ...prev,
          data: prev.data.map((user) => (user.id === updatedProfile.id ? updatedProfile : user)),
        }))

        setShowProfileModal(false)

        // Verificar después de un tiempo si la actualización se persistió
        setTimeout(async () => {
          try {
            console.log("=== VERIFICACIÓN POST-ACTUALIZACIÓN ===")
            // Recargar los datos para verificar
            await uploadUsers()
            await getCurrentUser()
          } catch (error) {
            console.error("Error en verificación:", error)
          }
        }, 3000) // Verificar después de 3 segundos

        Alert.alert("Éxito", "Perfil actualizado correctamente")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Error", "No se pudo actualizar el perfil")
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
        <TouchableOpacity
          style={[styles.emptyActionButton, { backgroundColor: Colors.light.primary }]}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.emptyActionContent}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.emptyActionText}>Crear Usuario</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )

  const renderUserCard = ({ item, index }: { item: IUser; index: number }) => {
    // Validación adicional para asegurar que el item existe
    if (!item || !item.id) {
      return null
    }

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

  // Función segura para keyExtractor
  const keyExtractor = (item: IUser, index: number) => {
    if (item && item.id) {
      return `${item.id}-${item.image || "no-image"}`
    }
    return `user-${index}`
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
      <View style={[styles.header, { backgroundColor: Colors.light.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Usuarios</Text>
            <Text style={styles.headerSubtitle}>{userData.data.length} usuarios registrados</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.profileButton} onPress={handleEditProfile} activeOpacity={0.7}>
              <Ionicons name="person-circle-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={toggleSearch} activeOpacity={0.7}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
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
            keyExtractor={keyExtractor}
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
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            extraData={userData.data} // Forzar re-render cuando cambie userData
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
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: Colors.light.primary }]}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.8}
        >
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

      {currentUserData && (
        <EditProfileModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={currentUserData}
          onUpdateUser={handleUpdateProfile}
        />
      )}
    </SafeAreaView>
  )
}

export default UsersScreen
