import React, { useState } from "react";
import { Text, Dimensions, View } from "react-native";
import { Box, HStack, VStack } from "native-base";
import { FormattedMessage, useIntl } from "react-intl";
import { Shadow } from "react-native-shadow-2";

import { toStrictInteger } from "./numberUtils";

interface SalesChartProps {
  monthlySales: number[];
  labels: string[];
  period: string; 
  onPeriodChange?: (period: string) => void;
}

const SalesChart: React.FC<SalesChartProps> = ({
  monthlySales = [0, 0, 0, 0, 0, 0],
  labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  period = "mensual",
  onPeriodChange = () => {},
}) => {
  const [showAllValues, setShowAllValues] = useState(false);

  const fullLabels = labels;
  const fullSales = monthlySales;

  const intl = useIntl();

  const getAdjustedFontSize = () => {
    if (showAllValues) return 8;
    if (fullSales.length > 6) return 10;
    return 12;
  };
  const fontSize = getAdjustedFontSize();

  const nonZeroSales = fullSales.filter((sale) => sale > 0);

  const maxSale = nonZeroSales.length > 0 ? Math.max(...nonZeroSales) : 0;
  const maxSaleIndex = fullSales.indexOf(maxSale);
  const minSale = nonZeroSales.length > 0 ? Math.min(...nonZeroSales) : 0;
  const minSaleIndex = nonZeroSales.length > 0 ? fullSales.indexOf(minSale) : -1;
  const avgSale =
    nonZeroSales.length > 0
      ? toStrictInteger(
          nonZeroSales.reduce((a, b) => a + b, 0) / nonZeroSales.length
        )
      : 0;

  const chartWidth = Dimensions.get("window").width - 60;

  // Barras más estrechas porque sólo 6 meses
  const barWidth = chartWidth / fullSales.length - 4;

  // Función para formatear valores grandes (puedes ajustar)
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value}`;
    }
  };

  const shouldShowValue = (index: number, value: number) => {
    if (value === 0) return false;
    if (showAllValues) return true;
    return index % 2 === 0;
  };

  const getPeriodName = (index: number) => fullLabels[index] || "N/A";

  return (
    <Shadow
      distance={5}
      startColor={"rgba(0, 0, 0, 0.05)"}
      endColor={"rgba(0, 0, 0, 0.01)"}
      offset={[0, 2]}
      style={{ width: "100%", marginBottom: 32 }}
    >
      <Box bg="white" borderRadius="lg" p={4}>
        <VStack space={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>
              <FormattedMessage
                id="sales.trend"
                defaultMessage="Tendencia de ventas - Últimos 6 meses"
              />
            </Text>
          </HStack>
        </VStack>

        <Box height={150} mb={4} mt={20}>
          <HStack
            justifyContent="space-between"
            height="100%"
            alignItems="flex-end"
          >
            {fullSales.map((sale, index) => {
              const heightPercentage =
                maxSale > 0 ? toStrictInteger((sale / maxSale) * 100) : 10;

              const isHighest = sale === maxSale && sale > 0;
              const hasData = sale > 0;
              const showValue = shouldShowValue(index, sale);
              const formattedValue = formatValue(sale);

              const valueStyle = {
                fontSize: showAllValues ? fontSize - 2 : fontSize - 1,
                fontWeight: "bold" as "bold",
                marginBottom: 2,
                textAlign: "center" as "center",
                transform:
                  showAllValues && period === "mensual"
                    ? [{ rotate: "-45deg" }]
                    : [],
              };

              return (
                <VStack
                  key={index}
                  alignItems="center"
                  space={1}
                  width={barWidth + 4}
                >
                  {hasData && showValue && (
                    <Text allowFontScaling={false}
                      style={valueStyle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formattedValue}
                    </Text>
                  )}
                  {hasData && !showValue && <View style={{ height: fontSize + 2 }} />}
                  <Box
                    width={barWidth}
                    height={`${heightPercentage}%`}
                    bg={isHighest ? "#075e54" : hasData ? "#128c7e" : "#e0e0e0"}
                    borderRadius="md"
                    opacity={hasData ? 1 : 0.5}
                  />
                  <Text allowFontScaling={false}
                    style={{
                      fontSize,
                      fontWeight: hasData ? "bold" : "normal",
                      color: hasData ? "#000" : "#666",
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {fullLabels[index]}
                  </Text>
                </VStack>
              );
            })}
          </HStack>
        </Box>

        <HStack justifyContent="space-between">
          <VStack>
            <Text allowFontScaling={false} style={{ fontSize: 12, color: "#666" }}>
              <FormattedMessage id="sales.highest" defaultMessage="Venta más alta" />
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "bold" }}>
              {maxSale > 0 ? `$${maxSale.toLocaleString()}` : "N/A"}
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 12, color: "#075e54" }}>
              {maxSale > 0 ? getPeriodName(maxSaleIndex) : "N/A"}
            </Text>
          </VStack>

          <VStack>
            <Text allowFontScaling={false} style={{ fontSize: 12, color: "#666" }}>
              <FormattedMessage id="sales.average" defaultMessage="Promedio" />
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "bold" }}>
              {avgSale > 0 ? `$${avgSale.toLocaleString()}` : "N/A"}
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 12, color: "#075e54" }}>
              Mensual
            </Text>
          </VStack>

          <VStack>
            <Text allowFontScaling={false} style={{ fontSize: 12, color: "#666" }}>
              <FormattedMessage id="sales.lowest" defaultMessage="Venta más baja" />
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "bold" }}>
              {minSale > 0 ? `$${minSale.toLocaleString()}` : "N/A"}
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 12, color: "#075e54" }}>
              {minSale > 0 ? getPeriodName(minSaleIndex) : "N/A"}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Shadow>
  );
};

export default SalesChart;
