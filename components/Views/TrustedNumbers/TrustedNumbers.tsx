"use client";

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Spinner } from "native-base";
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { FormattedMessage, useIntl } from "react-intl";
import { router } from "expo-router";

import CardContact from "./components/CardContact";
import ModalSelectContact from "./components/ModalSelectContacts";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import { useUser } from "@/hooks/redux/useUser";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import { Colors } from "@/constants/Colors";
import { styles } from "./TrustedNumbersStyles";
import CustomHeader from "@/components/CustomHeader/CustomHeader";

interface INumberTrusted {
  nombre: any;
  telefono: string;
  id?: number;
}

const TrustedNumbers = () => {
  const { user } = useUser();
  const { showToast } = useToastContext();
  const intl = useIntl();

  const [numbersTrusted, setNumberTrusted] = React.useState<INumberTrusted[]>(
    []
  );
  const [stateModalSelectContacts, setstateModalSelectContacts] =
    React.useState<boolean>(false);
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const [loadingAll, setLoadingAll] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [stateModalDeleteNumber, setStateModalDeleteNumber] =
    React.useState<boolean>(false);
  const [trustedNumberSelectedId, setTrustedNumberSelectedId] = React.useState<
    number | null
  >(null);

  const toggleStateModal = () => setstateModalSelectContacts((prev) => !prev);
  const toggleModalDelete = () => setStateModalDeleteNumber((prev) => !prev);

  const trustedPhones = numbersTrusted.map((n) => n.telefono);

  const ImportContacts = async (contacts: any[]) => {
    setLoadingApi(true);
    const normalize = (num: string) =>
      num.replace(/\D/g, "").replace(/^0+/, "");

    const incomingPhones = new Set(contacts.map((c) => normalize(c.numero)));
    const existingPhones = new Set(
      numbersTrusted.map((n: any) => normalize(n.telefono))
    );

    const toDelete = numbersTrusted.filter(
      (n: any) => n.id && !incomingPhones.has(normalize(n.telefono))
    );
    const toAdd = contacts.filter(
      (c) => !existingPhones.has(normalize(c.numero))
    );

    try {
      await Promise.all(
        toDelete.map(async (n: any) => {
          await api.numeroConfianza.delete(n.id);
        })
      );

      await Promise.all(
        toAdd.map(async (c) => {
          const resp = await api.numeroConfianza.create({
            nombre: c.nombre,
            telefono: normalize(c.numero),
          });

          if (resp.ok) {
            setNumberTrusted((prev: any) => [
              ...prev.filter(
                (p: any) => normalize(p.telefono) !== normalize(c.numero)
              ),
              {
                nombre: resp.data.nombre,
                telefono: resp.data.telefono,
                id: resp.data.id,
              },
            ]);
          }
        })
      );

      setNumberTrusted((prev) =>
        prev.filter((n) => !toDelete.some((d) => d.id === n.id))
      );

      showToast({
        title: intl.formatMessage({
          id: "trustedNumbers.success.imported",
          defaultMessage: "Contactos importados correctamente",
        }),
        status: "success",
      });
    } catch (error: any) {
      console.error(
        "Error importing contacts:",
        error.response?.data?.message || error.message
      );
      showToast({
        title: intl.formatMessage({
          id: "trustedNumbers.error.importing",
          defaultMessage: "Error al importar contactos",
        }),
        status: "error",
      });
    } finally {
      setLoadingApi(false);
    }
  };

  const deleteNumberTrusted = async () => {
    if (!trustedNumberSelectedId) return;

    setLoadingApi(true);
    try {
      const resp = await api.numeroConfianza.delete(trustedNumberSelectedId);
      if (resp.ok) {
        setNumberTrusted((prev) =>
          prev.filter((item) => item.id !== trustedNumberSelectedId)
        );
        showToast({
          title: intl.formatMessage({
            id: "trustedNumbers.success.deleted",
            defaultMessage: "Número eliminado correctamente",
          }),
          status: "success",
        });
        setTrustedNumberSelectedId(null);
      }
    } catch (error: any) {
      console.log(error);
      showToast({
        title: intl.formatMessage({
          id: "trustedNumbers.error.deleting",
          defaultMessage: "Error al eliminar número",
        }),
        status: "error",
      });
    } finally {
      setLoadingApi(false);
    }
  };

  const loadAllNumbersTrusted = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoadingAll(true);
    }

    try {
      const resp = await api.numeroConfianza.findAll();
      if (resp.ok) {
        setNumberTrusted(resp.data);
      }
    } catch (error: any) {
      showToast({
        title: intl.formatMessage({
          id: "trustedNumbers.error.loading",
          defaultMessage: "Error al cargar números de confianza",
        }),
        status: "error",
      });
    } finally {
      setLoadingAll(false);
      setRefreshing(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setTrustedNumberSelectedId(id);
    toggleModalDelete();
  };

  const onRefresh = React.useCallback(() => {
    loadAllNumbersTrusted(true);
  }, []);

  React.useEffect(() => {
    loadAllNumbersTrusted();
  }, []);

  const renderHeader = () => (
    <CustomHeader
      title={
        <FormattedMessage
          id="trustedNumbers.title"
          defaultMessage="Números de Confianza"
        />
      }
      onBack={() => router.back()}
    />
  );

  const renderContactCard = (number: INumberTrusted, index: number) => (
    <View key={`${number.id}-${index}`}>
      <CardContact
        clickDeleteAction={() => handleDeleteClick(number.id ?? 0)}
        nombre={number.nombre}
        telefono={number.telefono}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={[Colors.light.primary + "25", Colors.light.primary + "15"]}
          style={styles.emptyIconBackground}
        >
          <MaterialIcons
            name="contacts"
            size={64}
            color={Colors.light.primary}
          />
        </LinearGradient>
      </View>
      <Text allowFontScaling={false} style={styles.emptyTitle}>
        <FormattedMessage
          id="trustedNumbers.empty.title"
          defaultMessage="No hay números de confianza"
        />
      </Text>
      <Text allowFontScaling={false} style={styles.emptySubtitle}>
        <FormattedMessage
          id="trustedNumbers.empty.subtitle"
          defaultMessage="Agrega contactos de confianza para facilitar la comunicación"
        />
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={toggleStateModal}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.primary + "DD"]}
          style={styles.emptyButtonGradient}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text allowFontScaling={false} style={styles.emptyButtonText}>
            <FormattedMessage
              id="trustedNumbers.empty.button"
              defaultMessage="Agregar primer contacto"
            />
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderInfoBanner = () => (
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
            id="trustedNumbers.info.title"
            defaultMessage="Números de confianza"
          />
        </Text>
        <Text allowFontScaling={false} style={styles.infoDescription}>
          <FormattedMessage
            id="trustedNumbers.info.description"
            defaultMessage="Los números de confianza pueden realizar pedidos sin restricciones adicionales"
          />
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {loadingAll ? (
        <View style={styles.loadingContainer}>
          <Spinner size="large" color={Colors.light.primary} />
          <Text allowFontScaling={false} style={styles.loadingText}>
            <FormattedMessage
              id="trustedNumbers.loading"
              defaultMessage="Cargando números de confianza..."
            />
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          {numbersTrusted.length > 0 ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.light.primary]}
                  tintColor={Colors.light.primary}
                />
              }
            >
              {renderInfoBanner()}
              {numbersTrusted.map((number, index) =>
                renderContactCard(number, index)
              )}
            </ScrollView>
          ) : (
            renderEmptyState()
          )}
        </View>
      )}

      {!loadingAll && numbersTrusted.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={toggleStateModal}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.primary + "CC"]}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {stateModalSelectContacts && (
        <ModalSelectContact
          trustedPhones={trustedPhones}
          loadingApi={loadingApi}
          onImportContacts={ImportContacts}
          isOpen={stateModalSelectContacts}
          onClose={toggleStateModal}
        />
      )}

      {stateModalDeleteNumber && (
        <ModalConfirmAction
          loading={loadingApi}
          onContinue={deleteNumberTrusted}
          isOpen={stateModalDeleteNumber}
          onClose={toggleModalDelete}
          title={intl.formatMessage({
            id: "trustedNumbers.deleteModal.title",
            defaultMessage: "Eliminar número de confianza",
          })}
          message={intl.formatMessage({
            id: "trustedNumbers.deleteModal.message",
            defaultMessage:
              "¿Estás seguro de que deseas eliminar este número de confianza?",
          })}
        />
      )}
    </View>
  );
};

export default TrustedNumbers;
