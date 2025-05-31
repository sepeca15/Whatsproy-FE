import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import { styles } from "./CardProdStyle";
import api from "@/services/api/admin";
import { FormattedMessage, useIntl } from "react-intl";
import LottieView from "lottie-react-native";
import Toast, { ToastShowParams } from "react-native-toast-message";
import type {
  Product,
  ProductBDD,
  DayslySalesData,
  MonthlySalesData,
} from "../../../../../hooks/dataProduct";
import { useUser } from "@/hooks/redux/useUser";
import { Button } from "native-base";
import AlertConfirmationModal from "../../../../../hooks/AlertModalConfirmation/alertConfirmation";

/* ---------- Hook que evita toasts duplicados ---------- */
const activeToasts = new Set<string>();

function useToastOnce() {
  const show = (params: ToastShowParams & { id: string }) => {
    if (activeToasts.has(params.id)) return; // ya está visible
    activeToasts.add(params.id);

    Toast.show({
      ...params,
      onHide: () => {
        activeToasts.delete(params.id);
        params.onHide?.();
      },
    });
  };

  return { show };
}
/* ------------------------------------------------------ */

interface ProductCardProps {
  product: Product;
  productBDD: ProductBDD;
  monthlySalesData: MonthlySalesData;
  dayslySalesData: DayslySalesData;
  onUpdateProduct: (newProduct: any) => void;
  onDeleteRequest: (productId: number) => void;
  isBeingDeleted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  productBDD,
  monthlySalesData,
  dayslySalesData,
  onUpdateProduct,
  onDeleteRequest,
  isBeingDeleted,
}) => {
  const router = useRouter();
  const intl = useIntl();
  const { show } = useToastOnce();            // <- nuevo hook

  const [modalVisible, setModalVisible] = useState(false);
  const [localDisponible, setLocalDisponible] = useState(productBDD.disponible);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showDisableAlert, setShowDisableAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { user } = useUser();
  const currencies = user?.currencies ?? [];
  const currenctCurrency =
    currencies.find((itm: any) => itm?.id === productBDD?.currency_id) ?? {
      simbolo: "$",
      codigo: "USD",
    };

  /* ---------- Animación al borrar ---------- */
  const slideOutAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isBeingDeleted) {
      Animated.parallel([
        Animated.timing(slideOutAnim, {
          toValue: 500,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isBeingDeleted, slideOutAnim, opacityAnim]);
  /* ------------------------------------------ */

  const handleImageLoad = () => setLoading(false);

  const toast = (msgKey: string, type: "success" | "error", action: string) => {
    show({
      id: `${productBDD.id}-${action}`,          // <-- ID único
      type,
      text1: intl.formatMessage({ id: msgKey }),
      position: "bottom",
      visibilityTime: 1200,
    });
  };

  /* ---------------- Edit / View ---------------- */
  const handleEdit = () => {
    router.push({
      pathname: "/(tabs)/editprod",
      params: {
        id: productBDD.id.toString(),
        title: productBDD.nombre,
        price: productBDD.precio?.toString(),
        currency: currenctCurrency.simbolo,
        description: productBDD.descripcion,
        imageUrl: productBDD.imagen || "../errorimage.png",
        duration: productBDD.plazoDuracionEstimadoMinutos.toString(),
        currency_id: productBDD.currency_id,
        disponible: productBDD.disponible.toString(),
        category: productBDD.category.map((cat) => cat.id).join(","),
      },
    });
  };
  

  const handleView = () => {
    router.push({
      pathname: "/(tabs)/graficprod",
      params: {
        id: productBDD.id.toString(),
        title: productBDD.nombre,
        price: productBDD.precio?.toString(),
        currency: currenctCurrency.simbolo,
        duration: productBDD.plazoDuracionEstimadoMinutos.toString(),
        description: productBDD.descripcion,
        imageUrl: productBDD.imagen || "../errorimage.png",
        rating: product.rating,
        currency_id: productBDD.currency_id,
        reviews: product.reviews,
        tags: product.tags,
        daydata: JSON.stringify(dayslySalesData),
        monthdata: JSON.stringify(monthlySalesData),
        disponible: productBDD.disponible.toString(),
        empresa_id: productBDD.empresa_id.toString(),
        category: productBDD.category,
      },
    });
  };


  /* ------------------------------------------- */

  /* --------- Disponibilizar / Deshabilitar --------- */
  const confirmDisable = async () => {
    setShowDisableAlert(false);
    setProcessing(true);
    const newDisponible = false;
    setLocalDisponible(newDisponible);
    try {
      const res = await api.products.update(productBDD.id, {
        ...productBDD,
        disponible: newDisponible,
      });
      if (res.data?.ok) {
        toast("disableSuccess", "success", "disable");
        onUpdateProduct(res.data.data);
      }
    } catch {
      toast("disableError", "error", "disable");
      setLocalDisponible(true);
    } finally {
      setProcessing(false);
    }
  };

  const toggleAvailability = () => {
    if (processing) return;

    if (localDisponible) {
      setShowDisableAlert(true);
    } else {
      setProcessing(true);
      const newDisponible = true;
      setLocalDisponible(newDisponible);

      api.products
        .update(productBDD.id, { ...productBDD, disponible: newDisponible })
        .then(({ data }) => {
          if (data.ok) {
            toast("enableSuccess", "success", "enable");
            onUpdateProduct(data.data);
          }
        })
        .catch(() => {
          toast("enableError", "error", "enable");
          setLocalDisponible(false);
        })
        .finally(() => setProcessing(false));
    }
    setModalVisible(false);
  };
  /* -------------------------------------------------- */

  /* ------------------- Eliminar --------------------- */
  const handleDelete = () => {
    setShowDeleteAlert(true);
    setModalVisible(false);
  };

  const confirmDelete = () => {
    setShowDeleteAlert(false);
    onDeleteRequest(productBDD.id);
    toast("deleteSuccess", "success", "delete");
  };
  /* -------------------------------------------------- */

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: slideOutAnim }], opacity: opacityAnim },
        ]}
      >
        {!localDisponible && (
          <View style={styles.disabledLabel}>
            <Text style={styles.disabledText}>
              <FormattedMessage id="notAvailable" defaultMessage="Disabled" />
            </Text>
          </View>
        )}

        <Button
          onPress={handleView}
          style={styles.overlay1}
          disabled={processing}
        />

        <View style={styles.card}>
          {loading && (
            <View style={styles.animationContainer}>
              <LottieView
                source={require("../../../../../constants/Animation-1742586349562.json")}
                autoPlay
                loop
                style={styles.animation}
              />
            </View>
          )}

          <Image
            source={{ uri: productBDD.imagen }}
            style={styles.image}
            onLoad={handleImageLoad}
          />

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={2}>
                {productBDD.nombre}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.moreButton}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                disabled={processing}
              >
                <Icon name="more-vertical" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.price}>
              {currenctCurrency.simbolo}
              {Number(productBDD.precio).toFixed(2)} {currenctCurrency.codigo}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {productBDD.descripcion}
            </Text>
          </View>
        </View>

        {/* -------- Menú modal (edit / disable / delete) -------- */}
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleView}
                disabled={processing}
              >
                <Icon name="eye" size={20} style={styles.modalIcon} />
                <Text style={styles.modalOptionText}>
                  <FormattedMessage id="viewModal" defaultMessage="View" />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleEdit}
                disabled={processing}
              >
                <Icon name="edit" size={20} style={styles.modalIcon} />
                <Text style={styles.modalOptionText}>
                  <FormattedMessage id="edit" defaultMessage="Edit" />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={toggleAvailability}
                disabled={processing}
              >
                <Icon name="archive" size={20} style={styles.modalIcon} />
                <Text style={styles.modalOptionText}>
                  {localDisponible ? (
                    <FormattedMessage id="disable" defaultMessage="Disable" />
                  ) : (
                    <FormattedMessage id="enable" defaultMessage="Enable" />
                  )}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleDelete}
                disabled={processing}
              >
                <Icon name="trash-2" size={20} style={styles.modalIcon} />
                <Text style={styles.modalOptionText}>
                  <FormattedMessage id="delete" defaultMessage="Delete" />
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        {/* ------------------------------------------------------ */}
      </Animated.View>

      {/* ------ Confirmaciones ----- */}
      <AlertConfirmationModal
        show={showDisableAlert}
        processing={processing}
        title={intl.formatMessage({
          id: "confirmDisable",
          defaultMessage: "Confirm disable",
        })}
        message={intl.formatMessage({
          id: "confirmDisableMessage",
          defaultMessage: "Are you sure you want to disable this product?",
        })}
        cancelText={intl.formatMessage({ id: "cancel", defaultMessage: "Cancel" })}
        confirmText={intl.formatMessage({ id: "disable", defaultMessage: "Disable" })}
        onCancel={() => setShowDisableAlert(false)}
        onConfirm={confirmDisable}
      />

      <AlertConfirmationModal
        show={showDeleteAlert}
        processing={processing}
        title={intl.formatMessage({
          id: "confirmDelete",
          defaultMessage: "Confirm delete",
        })}
        message={intl.formatMessage({
          id: "confirmDeleteMessage",
          defaultMessage: "Are you sure you want to delete this product?",
        })}
        cancelText={intl.formatMessage({ id: "cancel", defaultMessage: "Cancel" })}
        confirmText={intl.formatMessage({ id: "delete", defaultMessage: "Delete" })}
        onCancel={() => setShowDeleteAlert(false)}
        onConfirm={confirmDelete}
      />
      {/* --------------------------- */}

      <Toast />
    </>
  );
};

export default ProductCard;
