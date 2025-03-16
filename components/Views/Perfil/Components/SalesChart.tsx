import type React from "react";
import { Text, Dimensions } from "react-native";
import { Box, HStack, VStack, Select, Icon } from "native-base";
import { FormattedMessage } from "react-intl";
import { Ionicons } from "@expo/vector-icons";
// Importar la función de utilidad
import { toStrictInteger } from "./numberUtils";

// Nota: En una implementación real, importarías una biblioteca de gráficos como
// react-native-chart-kit, react-native-svg-charts, o victory-native
// Aquí simulamos un gráfico simple con barras usando View

interface SalesChartProps {
  monthlySales: number[];
  labels: string[];
  period: string;
  onPeriodChange: (period: string) => void;
}

const SalesChart: React.FC<SalesChartProps> = ({
  monthlySales = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  labels = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
  ],
  period = "mensual",
  onPeriodChange = () => {},
}) => {
  // Encontrar el valor máximo para calcular las alturas relativas
  const maxSale = Math.max(...monthlySales);

  // Ancho disponible para el gráfico
  const chartWidth = Dimensions.get("window").width - 60; // Restando padding
  const barWidth = chartWidth / monthlySales.length - 10; // 10px de espacio entre barras

  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={10}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          <FormattedMessage
            id="sales.trend"
            defaultMessage="Tendencia de ventas"
          />
        </Text>

        <Select
          selectedValue={period}
          minWidth={120}
          accessibilityLabel="Seleccionar periodo"
          placeholder="Seleccionar periodo"
          onValueChange={onPeriodChange}
          fontSize={12}
          borderColor="#075e54"
          _selectedItem={{
            bg: `rgba(7, 94, 84, 0.1)`,
            endIcon: (
              <Icon as={Ionicons} name="checkmark" size="xs" color="#075e54" />
            ),
          }}
        >
          <Select.Item label="Semanal" value="semanal" />
          <Select.Item label="Mensual" value="mensual" />
          <Select.Item label="Trimestral" value="trimestral" />
          <Select.Item label="Anual" value="anual" />
        </Select>
      </HStack>

      <Box height={150} mb={4}>
        <HStack
          justifyContent="space-between"
          height="100%"
          alignItems="flex-end"
        >
          {monthlySales.map((sale, index) => {
            // Asegurarse de que los cálculos de altura para las barras del gráfico también usen enteros
            const heightPercentage = toStrictInteger((sale / maxSale) * 100);
            const isHighest = sale === maxSale;

            return (
              <VStack key={index} alignItems="center" space={1}>
                <Text style={{ fontSize: 7, marginBottom: 2 }}>
                  ${sale.toLocaleString()}
                </Text>
                <Box
                  width={barWidth}
                  height={`${heightPercentage}%`}
                  bg={isHighest ? "#075e54" : "#128c7e"}
                  borderRadius="md"
                />
                <Text style={{ fontSize: 10 }}>{labels[index]}</Text>
              </VStack>
            );
          })}
        </HStack>
      </Box>

      <HStack justifyContent="space-between">
        <VStack>
          <Text style={{ fontSize: 12, color: "#666" }}>
            <FormattedMessage
              id="sales.highest"
              defaultMessage="Venta más alta"
            />
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            ${Math.max(...monthlySales).toLocaleString()}
          </Text>
        </VStack>

        <VStack>
          <Text style={{ fontSize: 12, color: "#666" }}>
            <FormattedMessage id="sales.average" defaultMessage="Promedio" />
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            $
            {toStrictInteger(
              monthlySales.reduce((a, b) => a + b, 0) / monthlySales.length,
            ).toLocaleString()}
          </Text>
        </VStack>

        <VStack>
          <Text style={{ fontSize: 12, color: "#666" }}>
            <FormattedMessage
              id="sales.lowest"
              defaultMessage="Venta más baja"
            />
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            ${Math.min(...monthlySales).toLocaleString()}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default SalesChart;
