
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, Animated, FlatList, TextInput, StatusBar, RefreshControl } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import UserCard from "./components/UserCard/UserCard"
import CreateUserModal from "./components/ModalCreateUser/ModalCreateUser"
import EditUserModal from "./components/ModalEditUser/ModalEditUser"
import type { IUser, IUserInfo } from "./UsuariosType"
import { Colors } from "@/constants/Coloresuser"
import { styles } from "./UsuariosStyles"

const mockUsers: IUser[] = [
  {
    id: 1,
    nombre: "Ana García",
    correo: "ana.garcia@empresa.com",
    activo: true,
    isAdmin: true,
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    correo: "carlos.rodriguez@empresa.com",
    activo: true,
  },
  {
    id: 3,
    nombre: "María López",
    correo: "maria.lopez@empresa.com",
    activo: false,
  },
  {
    id: 4,
    nombre: "Juan Martínez",
    correo: "juan.martinez@empresa.com",
    activo: true,
  },
]

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

  const fadeAnim = useRef(new Animated.Value(0)).current
  const searchAnim = useRef(new Animated.Value(0)).current
  const fabAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      // Simular carga de datos
      setTimeout(() => {
        setUserData({
          data: mockUsers,
          loading: false,
        })

        // Animaciones de entrada
        Animated.stagger(100, [
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(fabAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start()
      }, 1000)
    } catch (error) {
      console.error("Error loading users:", error)
      setUserData((prev) => ({ ...prev, loading: false }))
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

  const filteredUsers = userData.data.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = (userId: number) => {
    setUserData((prev) => ({
      ...prev,
      data: prev.data.filter((user) => user.id !== userId),
    }))
  }

  const handleCreateUser = (newUser: Omit<IUser, "id">) => {
    const user: IUser = {
      ...newUser,
      id: Math.max(...userData.data.map((u) => u.id)) + 1,
    }
    setUserData((prev) => ({
      ...prev,
      data: [...prev.data, user],
    }))
    setShowCreateModal(false)
  }

  const handleUpdateUser = (updatedUser: IUser) => {
    setUserData((prev) => ({
      ...prev,
      data: prev.data.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    }))
    setShowEditModal(false)
    setSelectedUser(null)
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={[`${Colors.light.primary}20`, `${Colors.light.secondary}20`]}
          style={styles.emptyIconGradient}
        >
          <Ionicons name="people-outline" size={60} color={Colors.light.primary} />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>{searchQuery ? "No se encontraron usuarios" : "No hay usuarios"}</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer usuario"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.emptyActionButton} onPress={() => setShowCreateModal(true)} activeOpacity={0.8}>
          <LinearGradient
            colors={Colors.gradients.primary as [string, string, ...string[]]}
            style={styles.emptyActionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.emptyActionText}>Crear Usuario</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  )

  const renderUserCard = ({ item, index }: { item: IUser; index: number }) => (
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
        currentUserId={1} // Simular usuario actual
        allowManage={true}
      />
    </Animated.View>
  )

  if (userData.loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.light.primary} />
        <LinearGradient colors={Colors.gradients.primary as [string, string, ...string[]]} style={styles.loadingGradient}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Cargando usuarios...</Text>
          </View>
        </LinearGradient>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.primary} />

      {/* Header */}
      <LinearGradient
        colors={Colors.gradients.primary as [string, string, ...string[]]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
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
      </LinearGradient>

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
          <LinearGradient
            colors={Colors.gradients.primary as [string, string, ...string[]]}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="add" size={28} color="white" />
          </LinearGradient>
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
