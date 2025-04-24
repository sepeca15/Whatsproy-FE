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
const currentMonth = new Date().getMonth(); // Mes actual (0 = Enero, 11 = Diciembre)

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
  onPeriodChange = () => { },
}) => {


  // const currentMonth = new Date().getMonth(); // Mes actual (0 = Enero, 11 = Diciembre)

  // const filteredSales = monthlySales.slice(0, currentMonth + 1);
  // const filteredLabels = labels.slice(0, currentMonth + 1);

  let filteredLabels = labels;
  let filteredSales = monthlySales;

  switch (period) {
    case "semanal":
      // Obtener la semana actual del mes
      const currentWeek = Math.ceil(new Date().getDate() / 7);
      filteredLabels = labels.slice(0, currentWeek);
      filteredSales = monthlySales.slice(0, currentWeek);
      break;

    case "mensual":
      // Obtener el mes actual
      const currentMonth = new Date().getMonth();
      filteredLabels = labels.slice(0, currentMonth + 1);
      filteredSales = monthlySales.slice(0, currentMonth + 1);
      break;

    case "trimestral":
      // Obtener el trimestre actual
      const currentQuarter = Math.floor(new Date().getMonth() / 3);
      filteredLabels = labels.slice(0, (currentQuarter + 1) * 3);
      filteredSales = monthlySales.slice(0, (currentQuarter + 1) * 3);
      break;

    case "anual":
      // Mostrar el año completo
      filteredLabels = labels;
      filteredSales = monthlySales;
      break;

    default:
      break;
  }


  const fontSize = Math.max(10, Math.min(16, 40 / filteredSales.length));
  const maxSale = Math.max(...filteredSales);
  const chartWidth = Dimensions.get("window").width - 60;
  const barWidth = chartWidth / filteredSales.length - 10;

  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={20}>
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
          justifyContent={filteredLabels.length < 2 ? "center" : "space-between"}
          height="100%"
          alignItems="flex-end"
        >
          {filteredSales.map((sale, index) => {

            const heightPercentage = toStrictInteger((sale / maxSale) * 100);
            const isHighest = sale === maxSale;

            return (
              <VStack key={index} alignItems="center" space={1}  justifyContent={filteredLabels.length < 2 ? "center" : "space-between"}  >
                <Text style={{ fontSize, fontWeight: "bold", marginBottom: 2, marginTop: 1 }}>
                  ${sale.toLocaleString()}
                </Text>
                <Box
                  width={filteredLabels.length < 2 ? Math.max(barWidth - 200, 10) : barWidth}
                  height={`${heightPercentage}%`}
                  bg={isHighest ? "#075e54" : "#128c7e"}
                  borderRadius="md"
                  
                />
                <Text style={{ fontSize, fontWeight: "bold" }}>
                  {filteredLabels[index] ?? "N/A"}
                </Text>
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
