import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  FlatList,
  TextInput,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import UserCard from "@/components/Views/Usuarios/components/UserCard/UserCard";
import CreateUserModal from "./components/ModalCreateUser/ModalCreateUser";
import EditUserModal from "./components/ModalEditUser/ModalEditUser";
import EditProfileModal from "./components/ModalEditUser/ModalEditUser";
import type { IUser, IUserInfo } from "./UsuariosType";
import { Colors } from "@/constants/Coloresuser";
import { styles } from "./UsuariosStyles";
import api from "@/services/api/admin";
import { useUser } from "@/hooks/redux/useUser";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";
import { FormattedMessage, useIntl } from "react-intl";
import { useToastContext } from "@/contexts/ToastContext";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import { Text } from "native-base";

const UsersScreen: React.FC = () => {
  const [userData, setUserData] = useState<IUserInfo>({
    data: [],
    loading: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserData, setCurrentUserData] = useState<IUser | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const { showToast } = useToastContext();
  const { handleAddUserData } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;
  const { user } = useUser();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteUserId, setOpenDeleteUserId] = useState(0);
  const intl = useIntl();
  const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);

  useEffect(() => {
    uploadUsers();
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!userData.loading && userData.data.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
      Animated.spring(fabAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [userData.loading, userData.data.length, fadeAnim, fabAnim]);

  const getCurrentUser = async () => {
    try {
      const currentUser = await api.auth.me();
      if (currentUser?.id) {
        setCurrentUserId(currentUser.id);
        const mappedCurrentUser: IUser = {
          id: currentUser.id,
          nombre:
            currentUser.nombre && currentUser.apellido
              ? `${currentUser.nombre} ${currentUser.apellido}`.trim()
              : currentUser.name ||
                intl.formatMessage({
                  id: "users.noName",
                  defaultMessage: "Sin nombre",
                }),
          correo:
            currentUser.correo ||
            currentUser.email ||
            intl.formatMessage({
              id: "users.noEmail",
              defaultMessage: "Sin email",
            }),
          activo: currentUser.activo !== undefined ? currentUser.activo : true,
          isAdmin: currentUser.isAdmin || false,
          image: currentUser.image || null,
        };
        setCurrentUserData(mappedCurrentUser);
        if (currentUser.id_empresa) {
          setCompanyId(currentUser.id_empresa);
        }
      }
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "users.errorLoadingCurrentUser",
          defaultMessage: "Error al cargar usuario actual",
        }),
      });
    }
  };

  const uploadUsers = async () => {
    try {
      setUserData((prev) => ({ ...prev, loading: true }));
      fadeAnim.setValue(0);
      fabAnim.setValue(0);
      const response = await api.user.findAll(user.id_empresa);
      const users = response?.data || [];
      const mappedUsers: IUser[] = users
        .filter((userItem: any) => userItem && userItem.id)
        .map((userItem: any) => ({
          id: userItem.id,
          nombre:
            userItem.nombre ||
            userItem.name ||
            intl.formatMessage({
              id: "users.noName",
              defaultMessage: "Sin nombre",
            }),
          correo:
            userItem.correo ||
            userItem.email ||
            intl.formatMessage({
              id: "users.noEmail",
              defaultMessage: "Sin email",
            }),
          activo: userItem.activo !== undefined ? userItem.activo : true,
          isAdmin: userItem.isAdmin || false,
          image: userItem.image || null,
        }));

      setUserData({
        data: mappedUsers,
        loading: false,
      });

      if (mappedUsers.length > 0) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
        Animated.spring(fabAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      setUserData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      }));
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "users.errorLoadingUsers",
          defaultMessage:
            "No se pudieron cargar los usuarios. Por favor, intenta de nuevo.",
        }),
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await uploadUsers();
    await getCurrentUser();
    setRefreshing(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    Animated.timing(searchAnim, {
      toValue: showSearch ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    if (showSearch) {
      setSearchQuery("");
    }
  };

  const filteredUsers = useMemo(() => {
    const filtered = userData.data.filter(
      (user) =>
        user &&
        user.nombre &&
        user.correo &&
        (user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.correo.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (currentUserId) {
      const currentUser = filtered.find((u) => u.id === currentUserId);
      const others = filtered.filter((u) => u.id !== currentUserId);
      return currentUser ? [currentUser, ...others] : filtered;
    }
    return filtered;
  }, [userData.data, searchQuery, currentUserId]);

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditProfile = () => {
    if (currentUserData) {
      setShowProfileModal(true);
    }
  };

  const deleteUser = async () => {
    try {
      setLoadingDeleteUser(true);
      await api.user.delete(openDeleteUserId);
      setUserData((prev) => ({
        ...prev,
        data: prev.data.filter((user) => user.id !== openDeleteUserId),
      }));
      setOpenDeleteModal(false);
      setOpenDeleteUserId(0);
      showToast({
        status: "success",
        title: intl.formatMessage({
          id: "users.deleteSuccess",
          defaultMessage: "Usuario eliminado correctamente",
        }),
      });
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "users.deleteError",
          defaultMessage: "Error eliminando usuario",
        }),
      });
      setLoadingDeleteUser(false);
    } finally {
      setLoadingDeleteUser(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setOpenDeleteModal(true);
    setOpenDeleteUserId(userId);
  };

  const handleCreateUser = async (newUserData: Omit<IUser, "id">) => {
    try {
      if (!user?.id_empresa) {
        showToast({
          status: "error",
          title: intl.formatMessage({
            id: "users.companyInfoError",
            defaultMessage: "No se pudo obtener la información de la empresa",
          }),
        });
        return;
      }

      const nameParts = newUserData.nombre.trim().split(" ");
      const nombre = nameParts[0] || "";
      const apellido = nameParts.slice(1).join(" ") || "";

      const userData = {
        nombre: nombre,
        apellido: apellido,
        correo: newUserData.correo,
        password: newUserData.password ?? '',
        id_empresa: user.id_empresa,
      };

      const createdUser = await api.user.create(userData);
    
      if (createdUser.ok) {
        setUserData((prev) => ({
          ...prev,
          data: [...prev.data, createdUser.data],
        }));
        setShowCreateModal(false);
        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "users.createSuccess",
            defaultMessage: "Usuario creado correctamente",
          }),
        });
      }
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "users.createError",
          defaultMessage: "Error creando usuario",
        }),
      });
    }
  };

  const handleUpdateUser = async (updatedUser: IUser) => {
    try {
      const nameParts = updatedUser.nombre.trim().split(" ");
      const nombre = nameParts[0] || "";
      const apellido = nameParts.slice(1).join(" ") || "";

      const updateData = {
        id: updatedUser.id,
        nombre: nombre,
        apellido: apellido,
        correo: updatedUser.correo,
        activo: updatedUser.activo,
        isAdmin: updatedUser.isAdmin,
        image: updatedUser.image,
      };

      const response = await api.user.update(updatedUser.id, updateData);

      if (response) {
        setUserData((prev) => ({
          ...prev,
          data: prev.data.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
        }));

        if (updatedUser.id === currentUserId) {
          setCurrentUserData(updatedUser);
        }

        setShowEditModal(false);
        setSelectedUser(null);
        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "users.updateSuccess",
            defaultMessage: "Usuario actualizado correctamente",
          }),
        });
      }
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "users.updateError",
          defaultMessage: "No se pudo actualizar el usuario",
        }),
      });
    }
  };

  const handleUpdateProfile = async (updatedProfile: IUser) => {
    try {
      const nameParts = updatedProfile.nombre.trim().split(" ");
      const nombre = nameParts[0] || "";
      const apellido = nameParts.slice(1).join(" ") || "";

      const updateData = {
        nombre: nombre,
        apellido: apellido,
        correo: updatedProfile.correo,
        image: updatedProfile.image,
      };

      const response = await api.user.update(updatedProfile.id, updateData);

      if (response) {
        setCurrentUserData(updatedProfile);
        setUserData((prev) => ({
          ...prev,
          data: prev.data.map((user) =>
            user.id === updatedProfile.id ? updatedProfile : user
          ),
        }));
        handleAddUserData();
        setShowProfileModal(false);

        setTimeout(async () => {
          try {
            await uploadUsers();
            await getCurrentUser();
          } catch (error) {
            // Silent error handling
          }
        }, 3000);

        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "users.profileUpdateSuccess",
            defaultMessage: "Perfil actualizado correctamente",
          }),
        });
      }
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "users.profileUpdateError",
          defaultMessage: "No se pudo actualizar el perfil",
        }),
      });
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <View style={styles.emptyIconBackground}>
          <Ionicons
            name="people-outline"
            size={60}
            color={Colors.light.primary}
          />
        </View>
      </View>
      <Text allowFontScaling={false} style={styles.emptyTitle}>
        {searchQuery
          ? intl.formatMessage({
              id: "users.noUsersFound",
              defaultMessage: "No se encontraron usuarios",
            })
          : intl.formatMessage({
              id: "users.noUsers",
              defaultMessage: "No hay usuarios",
            })}
      </Text>
      <Text allowFontScaling={false} style={styles.emptySubtitle}>
        {searchQuery
          ? intl.formatMessage({
              id: "users.tryDifferentSearch",
              defaultMessage: "Intenta con otros términos de búsqueda",
            })
          : intl.formatMessage({
              id: "users.addFirstUser",
              defaultMessage: "Comienza agregando tu primer usuario",
            })}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[
            styles.emptyActionButton,
            { backgroundColor: Colors.light.primary },
          ]}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.emptyActionContent}>
            <Ionicons name="add" size={20} color="white" />
            <Text allowFontScaling={false} style={styles.emptyActionText}>
              <FormattedMessage
                id="users.createUser"
                defaultMessage="Crear Usuario"
              />
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderUserCard = ({ item, index }: { item: IUser; index: number }) => {
    if (!item || !item.id) {
      return null;
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
    );
  };

  const keyExtractor = (item: IUser, index: number) => {
    if (item && item.id) {
      return `${item.id}-${item.image || "no-image"}`;
    }
    return `user-${index}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.light.primary}
      />
       <CustomHeader
          title={
            <FormattedMessage
              id="users.title"
              defaultMessage="Usuarios"
            />
          }
          onBack={() => router.back()}
          showBackButton
          rightComponent={ <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleEditProfile}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={toggleSearch}
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>}
          bottomComponent={ <Animated.View
          style={[
            styles.searchContainer,
            {
            height: searchAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 60], // asegurate que cuando está cerrado el height sea 0
            }),
            overflow: 'hidden', 
              opacity: searchAnim,
            },
          ]}
        >
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="rgba(255,255,255,0.7)"
              style={styles.searchIcon}
            />
            <TextInput allowFontScaling={false}
              style={styles.searchInput}
              placeholder={intl.formatMessage({
                id: "users.searchPlaceholder",
                defaultMessage: "Buscar usuarios...",
              })}
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>}
        />

      {userData.loading || currentUserId === null ? (
        <View style={styles.loadingContent}>
          <ActivityIndicator
            size={60}
            color={Colors.light.secondary || Colors.light.success || "#fff"}
          />
          <Text allowFontScaling={false} style={styles.loadingText}>
            <FormattedMessage
              id="users.loading"
              defaultMessage="Cargando usuarios..."
            />
          </Text>
        </View>
      ) : (
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
              extraData={userData.data}
            />
          )}
        </View>
      )}

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

      <CreateUserModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateUser={handleCreateUser}
      />

      {selectedUser && (
        <EditUserModal
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
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

      {openDeleteModal && (
        <ModalConfirmAction
          isOpen={!!openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          title={intl.formatMessage({
            id: "users.deleteModal.title",
            defaultMessage: "Eliminar Usuario",
          })}
          message={intl.formatMessage({
            id: "users.deleteModal.message",
            defaultMessage:
              "¿Estás seguro de que deseas eliminar este usuario?",
          })}
          loading={loadingDeleteUser}
          onContinue={() => {
            deleteUser();
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default UsersScreen;
