import type React from "react";
import { Text } from "react-native";
import { Box, HStack, VStack, Icon, Divider } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FormattedMessage } from "react-intl";

interface SalesOverviewProps {
  totalSales: number;
  previousPeriodSales: number;
  averageSale: number;
  currency: string;
  period: string;
}

const SalesOverview: React.FC<SalesOverviewProps> = ({
  totalSales = 0,
  previousPeriodSales = 0,
  averageSale = 0,
  currency = "$",
  period = " ",
}) => {
  // Calcular el porcentaje de cambio
  const percentageChange =
    ((totalSales - previousPeriodSales) / previousPeriodSales) * 100;
  const isPositive = percentageChange >= 0;

  // Formatear números para mostrar con separadores de miles
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={3}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          <FormattedMessage
            id="sales.overview"
            defaultMessage="Resumen de ventas"
          />
        </Text>
        <Box bg={`rgba(7, 94, 84, 0.1)`} px={2} py={1} borderRadius="full">
          <Text style={{ color: "#075e54", fontWeight: "bold", fontSize: 12 }}>
            <FormattedMessage
              id={`sales.period.${period}`}
              defaultMessage={period}
            />
          </Text>
        </Box>
      </HStack>

      <VStack space={4}>
        <Box>
          <Text style={{ fontSize: 12, color: "#666" }}>
            <FormattedMessage
              id="sales.total"
              defaultMessage="Ventas totales"
            />
          </Text>
          <HStack alignItems="baseline" space={2}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {currency}
              {formatNumber(totalSales)}
            </Text>
            <HStack alignItems="center">
              <Icon
                as={Ionicons}
                name={isPositive ? "arrow-up" : "arrow-down"}
                size="xs"
                color={isPositive ? "#128c7e" : "red.500"}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: isPositive ? "#128c7e" : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {Math.abs(percentageChange).toFixed(1)}%
              </Text>
            </HStack>
          </HStack>
        </Box>

        <Divider />

        <HStack justifyContent="space-between">
          <VStack>
            <Text style={{ fontSize: 12, color: "#666" }}>
              <FormattedMessage
                id="sales.average"
                defaultMessage="Venta promedio"
              />
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {currency}
              {formatNumber(averageSale)}
            </Text>
          </VStack>

          <VStack>
            <Text style={{ fontSize: 12, color: "#666" }}>
              <FormattedMessage
                id="sales.previous"
                defaultMessage="Periodo anterior"
              />
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {currency}
              {formatNumber(previousPeriodSales)}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SalesOverview;
