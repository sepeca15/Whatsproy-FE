import type React from "react";
import { Text, View } from "react-native";
import { Box, HStack, VStack, Icon, Divider } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FormattedMessage } from "react-intl";
import { Shadow } from 'react-native-shadow-2';
import styles from "./salesOverview.styles";


interface SalesOverviewProps {
  totalSales: number;
  previousPeriodSales: number;
  averageSale: number;
  previous: number;
  currency: string;
  period: string;
}

const SalesOverview: React.FC<SalesOverviewProps> = ({
  totalSales = 0,
  previousPeriodSales = 0,
  averageSale = 0,
  currency = "$",
  period = " ",
  previous,
}) => {
  const percentageChange = previousPeriodSales;
  const isPositive = percentageChange >= 0;

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
  
    <Shadow
      distance={5}
      startColor={'rgba(0, 0, 0, 0.05)'}
      endColor={'rgba(0, 0, 0, 0.01)'}
      offset={[0, 2]}
      style={{ width: '100%',  }}
    >
      <View style={{
        backgroundColor: "white", borderRadius: 8, padding: 16, maxHeight: "100%", minHeight: 150, borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
      }} >
        <HStack justifyContent="space-between" alignItems="center" mb={3}>
          <Text allowFontScaling={false} style={styles.title}>
            <FormattedMessage
              id="sales.overview"
              defaultMessage="Resumen de ventas"
            />
          </Text>
          <Box bg={`rgba(7, 94, 84, 0.1)`} px={2} py={1} borderRadius="full">
            <Text allowFontScaling={false} style={styles.periodText}>
              <FormattedMessage
                id={`sales.period.${period}`}
                defaultMessage={period}
              />
            </Text>
          </Box>
        </HStack>

        <VStack space={1}>
          <Box>
            <Text allowFontScaling={false} style={styles.label}>
              <FormattedMessage
                id="sales.total"
                defaultMessage="Ventas totales"
              />
            </Text>
            <HStack alignItems="baseline" space={2}>
              <Text allowFontScaling={false} style={styles.totalSales}>
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
                <Text allowFontScaling={false}
                  style={[
                    styles.percentage,
                    { color: isPositive ? "#128c7e" : "#ef4444" },
                  ]}
                >
                  {Math.abs(percentageChange).toFixed(1)}%
                </Text>
              </HStack>
            </HStack>
          </Box>

          <Divider />

          <HStack justifyContent="space-between">
            <VStack>
              <Text allowFontScaling={false} style={styles.label}>
                <FormattedMessage
                  id="sales.average"
                  defaultMessage="Venta promedio"
                />
              </Text>
              <Text allowFontScaling={false} style={styles.amount}>
                {currency}
                {formatNumber(averageSale)}
              </Text>
            </VStack>

            <VStack>
              <Text allowFontScaling={false} style={styles.label}>
                <FormattedMessage
                  id="sales.previous"
                  defaultMessage="Periodo anterior"
                />
              </Text>
              <Text allowFontScaling={false} style={styles.amount}>
                {currency}
                {formatNumber(previous)}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </View>
    </Shadow>
 
  );
};

export default SalesOverview;
