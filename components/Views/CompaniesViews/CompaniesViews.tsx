import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import moment from "moment";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { globalStyles } from "@/components/globalStyles";
import CustomText from "@/components/CustomText";
import { FormattedMessage, useIntl } from "react-intl";
import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import CustomButton from "@/components/CustomButton";
import { EMPRESA_PAYMENT_FREE_TIME_AFTER_CANCEL } from "@/constants/variables";
import { useToastContext } from "@/contexts/ToastContext";

const CompaniesView = () => {
  const router = useRouter();
  const { user } = useUser();

  const [companies, setCompanies] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deploying, setDeploying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { showToast } = useToastContext();
  const intl = useIntl();

  const loadCompanies = async (pageNumber = 1) => {
    try {
      setLoadingCompanies(true);
      const resp = await api.company.getCompaniesAdmin("", pageNumber, 10);
      setCompanies(resp.data || []);
      setPage(Number(resp.page) || 1);
      setTotalPages(Number(resp.totalPages) || 1);
    } catch (error) {
      console.log("error loading companies", error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadCompanies(1);
    }
  }, [user]);

  const handleDeploy = async (item: any) => {
    try {
      setDeploying(true);
      const resp = await api.company.deployCompany(item?.id);
      if (resp?.ok) {
        showToast({
          title: intl.formatMessage({ id: "deployTitle" }),
          description: intl.formatMessage({ id: "deployDesc" }),
          status: "success",
        });
      } else {
        showToast({
          title: intl.formatMessage({ id: "ooops" }),
          description: intl.formatMessage({ id: "deployDescError" }),
          status: "success",
        });
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({ id: "ooops" }),
        description: intl.formatMessage({ id: "deployDescError" }),
        status: "success",
      });
    } finally {
      setDeploying(false);
    }
  };

  const renderCard = ({ item }: any) => {
    const renderBooleanValue = (value: boolean) => (
      <View style={styles.booleanContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: value ? "#4caf4fa6" : "#f44336ae" },
          ]}
        >
          <Text style={{ color: "white", fontWeight: 600, padding: 4 }}>
            {value === true ? "Sí" : "No"}
          </Text>
        </View>
      </View>
    );
    const paymentExpireDate = moment(item?.payment?.subscription_date).add(
      EMPRESA_PAYMENT_FREE_TIME_AFTER_CANCEL,
      "days"
    );

    const now = moment();
    const daysToExpire = paymentExpireDate.diff(now, "days");

    return (
      <View style={styles.card}>
        <Text style={styles.companyName}>{item.nombre}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="openingTime" />
          </Text>
          <Text style={styles.value}>{item.hora_apertura || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="closingTime" />
          </Text>
          <Text style={styles.value}>{item.hora_cierre || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="deploy" />
          </Text>
          {renderBooleanValue(item.deploy)}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="greenAPI" />
          </Text>
          {renderBooleanValue(item.greenApiConfigured)}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="address" />
          </Text>
          <Text style={styles.value}>{item.direccion || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="notifyReservation" />
          </Text>
          {renderBooleanValue(item.notificarReservaHoras)}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="isOpen" />
          </Text>
          {renderBooleanValue(item.abierto)}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="dbName" />
          </Text>
          <Text style={styles.value}>{item.db_name || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="serviceType" />
          </Text>
          <Text style={styles.value}>{item.tipoServicioId || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="calendarInterval" />
          </Text>
          <Text style={styles.value}>
            {item.intervaloTiempoCalendario || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="paymentExpire" />
          </Text>
          <Text style={styles.value}>
            {paymentExpireDate.format("YYYY-MM-DD HH:mm")}
          </Text>
          {daysToExpire <= 3 && daysToExpire >= 0 && (
            <Text style={styles.expireSoonText}>Expire soon</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            <FormattedMessage id="paymentActive" />
          </Text>
          {renderBooleanValue(item.payment?.isActive)}
        </View>

        <View style={styles.deployButtonContainer}>
          <CustomButton
            onPress={() => setEditOpen(!editOpen)}
            loading={editing}
            style={styles.deployButton}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              <FormattedMessage id="edit" defaultMessage="edit" />
            </Text>
          </CustomButton>
          <CustomButton
            onPress={() => handleDeploy(item)}
            loading={deploying}
            style={styles.deployButton}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              <FormattedMessage id="deployNow" defaultMessage="Deploy" />
            </Text>
          </CustomButton>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <Animated.View style={globalStyles.header2}>
        <View style={globalStyles.headerContent_categorias}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <View style={globalStyles.headerLef_categorias}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Pedidos"
            >
              <FormattedMessage id="companies" />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      {loadingCompanies ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 20,
            paddingTop: 15,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 18,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <CustomButton
          disabled={page <= 1}
          onPress={() => loadCompanies(page - 1)}
          style={[page <= 1 && styles.pageButtonDisabled]}
        >
          <Text style={styles.pageButtonText}>
            <FormattedMessage id="previous" />
          </Text>
        </CustomButton>

        <Text style={styles.pageInfo}>
          <FormattedMessage
            id="pageInfo"
            values={{ currentPage: page, totalPages }}
          />
        </Text>

        <CustomButton
          disabled={page >= totalPages}
          onPress={() => loadCompanies(page + 1)}
          style={[page >= totalPages && styles.pageButtonDisabled]}
        >
          <Text style={styles.pageButtonText}>
            <FormattedMessage id="next" />
          </Text>
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    color: "#1E293B",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  label: {
    flexBasis: "40%",
    width: 150,
    fontWeight: "600",
    color: "#64748B",
    fontSize: 14,
    paddingRight: 8,
  },
  value: {
    flexBasis: "60%",
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "500",
    flexWrap: "wrap",
  },
  backButton: {
    padding: 12,
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  pageInfo: {
    alignSelf: "center",
    color: "#475569",
    fontWeight: "600",
    fontSize: 15,
  },
  expireSoonText: {
    marginLeft: 8,
    backgroundColor: "#d4ac0d9b",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    alignSelf: "center",
  },
  booleanContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    borderRadius: 6,
    paddingHorizontal: 4,
    marginRight: 8,
  },
  deployButtonContainer: {
    marginTop: 12,
    gap: 6,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deployButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default CompaniesView;
