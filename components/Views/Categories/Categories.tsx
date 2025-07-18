"use client";

import * as React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Text } from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { FormattedMessage, useIntl } from "react-intl";
import { router } from "expo-router";

import api from "@/services/api/admin";
import CardCategory from "./components/CardCategory";
import type { ICategoryData } from "./components/CardCategory/CardCategory";
import ModalCreateOrEditCategory from "./components/ModalCreateOrEditCategory/ModalCreateOrEditCategory";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import { useToastContext } from "@/contexts/ToastContext";
import { Colors } from "@/constants/Colors";
import { styles } from "./CategoriesStyles";
import CustomHeader from "@/components/CustomHeader/CustomHeader";

const Categories = () => {
  const intl = useIntl();
  const { showToast } = useToastContext();

  const [allCategories, setAllCategories] = React.useState<ICategoryData[]>([]);
  const [categorySelected, setCategorySelected] =
    React.useState<ICategoryData | null>(null);
  const [stateModal, setStateModal] = React.useState(false);
  const [modalDelete, setModalDelete] = React.useState(false);
  const [loadingApi, setLoadingApi] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  console.log("stateModal", stateModal)
  const toggleModal = () => setStateModal((prev) => !prev);
  const toggleModalDelete = () => setModalDelete((prev) => !prev);

  const loadAllCategories = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoadingApi(true);
    }

    try {
      const resp = await api.category.getAll();
      if (resp.ok) {
        setAllCategories(resp.data);
      }
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "categories.error.loading",
          defaultMessage: "Error al cargar categorías",
        }),
      });
    } finally {
      setLoadingApi(false);
      setRefreshing(false);
    }
  };

  const handleEditCategory = (category: ICategoryData) => {
    setCategorySelected(category);
    toggleModal();
  };

  const handleDeleteCategory = (category: ICategoryData) => {
    setCategorySelected(category);
    setModalDelete(true);
  };

  const editCategorie = async (category: ICategoryData) => {
    try {
      console.log('recibo', category)
      const resp = await api.category.update({
        categoryId: category.id,
        dataUpdate: category,
      });
      if (resp.ok) {
        console.log("sapee 2")
        setAllCategories((prev) =>
          prev.map((item) => (item.id === resp.data.id ? resp.data : item))
        );
        setStateModal(false);
        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "categories.success.updated",
            defaultMessage: "Categoría actualizada correctamente",
          }),
        });
      }
    } catch (error: any) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "categories.error.updating",
          defaultMessage: "Error al actualizar categoría",
        }),
      });
    }
  };

  const createCategory = async (data: any) => {
    try {
      const resp = await api.category.create(data);
      if (resp.ok) {
        console.log("sapee")
        setAllCategories((prev) => [...prev, resp.data]);
        setStateModal(false);
        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "categories.success.created",
            defaultMessage: "Categoría creada correctamente",
          }),
        });
      }
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "categories.error.creating",
          defaultMessage: "Error al crear categoría",
        }),
      });
    }
  };

  const deleteCategory = async () => {
    if (!categorySelected) return;

    setLoadingDelete(true);
    try {
      const resp = await api.category.delete({
        categoryId: categorySelected.id,
      });
      if (resp) {
        setAllCategories((prev) =>
          prev.filter((cat) => cat.id !== categorySelected.id)
        );
        setCategorySelected(null);
        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "categories.success.deleted",
            defaultMessage: "Categoría eliminada correctamente",
          }),
        });
      }
    } catch (error: any) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "categories.error.deleting",
          defaultMessage: "Error al eliminar categoría",
        }),
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    loadAllCategories(true);
  }, []);

  React.useEffect(() => {
    loadAllCategories();
  }, []);

  React.useEffect(() => {
    if (!stateModal && categorySelected) {
      setCategorySelected(null);
    }
  }, [stateModal]);

  const renderCategoryItem = ({
    item,
    index,
  }: {
    item: ICategoryData;
    index: number;
  }) => (
    <CardCategory
      handleDeleteCategory={handleDeleteCategory}
      onPress={() => handleEditCategory(item)}
      data={item}
    />
  );

  const renderHeader = () => (
    <View
      style={styles.headerSection}
    >
      <View style={styles.infoBanner}>
        <View style={styles.infoIconContainer}>
          <MaterialIcons
            name="info-outline"
            size={20}
            color={Colors.light.primary}
          />
        </View>
        <View style={styles.infoTextContainer}>
          <Text allowFontScaling={false} style={styles.infoTitle}>
            <FormattedMessage
              id="categories.info.title"
              defaultMessage="Gestión de categorías"
            />
          </Text>
          <Text allowFontScaling={false} style={styles.infoDescription}>
            <FormattedMessage
              id="categories.info.description"
              defaultMessage="Organiza tus productos en categorías para facilitar la navegación"
            />
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        title={
          <FormattedMessage id="categories.title" defaultMessage="Categorías" />
        }
        subtitle={
          <FormattedMessage
            id="categories.subtitle"
            defaultMessage="Organiza tus productos"
          />
        }
        onBack={() => router.back()}
        showBackButton
      />
      {loadingApi ? (
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text allowFontScaling={false} style={styles.loadingText}>
            <FormattedMessage
              id="categories.loading"
              defaultMessage="Cargando categorías..."
            />
          </Text>
        </Animated.View>
      ) : (
        <View style={styles.content}>
          {allCategories.length > 0 ? (
            <FlatList
              data={allCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              numColumns={2}
              columnWrapperStyle={styles.categoryRow}
              contentContainerStyle={styles.categoriesList}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={renderHeader}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.light.primary]}
                  tintColor={Colors.light.primary}
                />
              }
            />
          ) : (
            <Animated.View
              entering={FadeInDown.duration(600).delay(400)}
              style={styles.emptyState}
            >
              <View style={styles.emptyIconContainer}>
                <LinearGradient
                  colors={[
                    Colors.light.primary + "25",
                    Colors.light.primary + "15",
                  ]}
                  style={styles.emptyIconBackground}
                >
                  <MaterialIcons
                    name="category"
                    size={64}
                    color={Colors.light.primary}
                  />
                </LinearGradient>
              </View>
              <Text allowFontScaling={false} style={styles.emptyTitle}>
                <FormattedMessage
                  id="categories.empty.title"
                  defaultMessage="No hay categorías"
                />
              </Text>
              <Text allowFontScaling={false} style={styles.emptySubtitle}>
                <FormattedMessage
                  id="categories.empty.subtitle"
                  defaultMessage="Comienza creando tu primera categoría para organizar tus productos"
                />
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={toggleModal}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.light.primary, Colors.light.primary + "DD"]}
                  style={styles.emptyButtonGradient}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text allowFontScaling={false} style={styles.emptyButtonText}>
                    <FormattedMessage
                      id="categories.empty.button"
                      defaultMessage="Crear primera categoría"
                    />
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}

      {!loadingApi && allCategories.length > 0 && (
        <Animated.View
          entering={FadeInUp.duration(600).delay(800)}
          style={styles.fabContainer}
        >
          <TouchableOpacity
            style={styles.fab}
            onPress={toggleModal}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.primary + "CC"]}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {stateModal && (
        <ModalCreateOrEditCategory
          onClose={toggleModal}
          isOpen={true}
          categorySelected={categorySelected}
          editCategorie={editCategorie}
          createCategory={createCategory}
        />
      )}

      <ModalConfirmAction
        isOpen={modalDelete}
        onClose={toggleModalDelete}
        loading={loadingDelete}
        title={intl.formatMessage({
          id: "categories.deleteModal.title",
          defaultMessage: "Eliminar categoría",
        })}
        message={intl.formatMessage({
          id: "categories.deleteModal.message",
          defaultMessage:
            "¿Estás seguro de que deseas eliminar esta categoría?",
        })}
        onContinue={deleteCategory}
      />
    </View>
  );
};

export default Categories;
