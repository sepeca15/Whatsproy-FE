import type React from "react";
import { Text, Dimensions, View, TouchableOpacity } from "react-native";
import { Box, HStack, VStack, Select, Icon, Switch } from "native-base";
import { FormattedMessage, useIntl} from "react-intl"
import { Ionicons } from "@expo/vector-icons";
// Importar la función de utilidad
import { toStrictInteger } from "./numberUtils";
import { useState } from "react";

interface SalesChartProps {
  monthlySales: number[];
  labels: string[];
  period: string;
  onPeriodChange: (period: string) => void;
}

const SalesChart: React.FC<SalesChartProps> = ({
  monthlySales = [1, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
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
  // Estado para controlar si se muestran todos los valores
  const [showAllValues, setShowAllValues] = useState(false);
  
  // Crear arrays completos para cada periodo
  const getFullPeriodData = () => {
    let fullLabels: string[] = [];
    let fullSales: number[] = [];
    let currentData: number[] = [];
    
    switch (period) {
      case "semanal":
        fullLabels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"];
        fullSales = new Array(fullLabels.length).fill(0);
        // Obtener la semana actual del mes
        const currentWeek = Math.ceil(new Date().getDate() / 7);
        // Copiar los datos disponibles
        currentData = monthlySales.slice(0, currentWeek);
        break;
        
      case "mensual":
        // Para mensual, solo usamos los datos disponibles (no rellenamos con ceros)
        const currentMonth = new Date().getMonth();
        fullLabels = labels.slice(0, currentMonth + 1);
        fullSales = monthlySales.slice(0, currentMonth + 1);
        break;
        
      case "trimestral":
        // Para trimestral, solo usamos los datos disponibles
        const currentQuarter = Math.floor(new Date().getMonth() / 3);
        fullLabels = labels.slice(0, (currentQuarter + 1));
        fullSales = monthlySales.slice(0, (currentQuarter + 1));
        break;
        
      case "anual":
        // Para anual, usamos todos los datos disponibles
        fullLabels = labels;
        fullSales = monthlySales;
        break;
        
      default:
        fullLabels = labels;
        fullSales = monthlySales;
        break;
    }
    
    // Solo para semanal, copiamos los datos disponibles a los arrays completos
    if (period === "semanal") {
      for (let i = 0; i < currentData.length; i++) {
        if (i < fullSales.length) {
          fullSales[i] = currentData[i];
        }
      }
    }
    
    // Filtrar valores cero para periodos que no son semanales
    if (period !== "semanal") {
      const filteredLabels: string[] = [];
      const filteredSales: number[] = [];
      
      for (let i = 0; i < fullSales.length; i++) {
        if (fullSales[i] > 0) {
          filteredLabels.push(fullLabels[i]);
          filteredSales.push(fullSales[i]);
        }
      }
      
      fullLabels = filteredLabels;
      fullSales = filteredSales;
    }
    
    return { fullLabels, fullSales };
  };
  
  const { fullLabels, fullSales } = getFullPeriodData();
  
  const intl = useIntl();
  
  // Ajustar el tamaño de fuente según el número de barras y si se muestran todos los valores
  const getAdjustedFontSize = () => {
    if (period === "mensual") {
      return showAllValues ? 8 : 9; // Tamaño más pequeño cuando se muestran todos los valores
    } else if (fullSales.length > 6) {
      return 10;
    } else {
      return 12;
    }
  };
  
  const fontSize = getAdjustedFontSize();
  
  // Filtrar valores mayores que 0 para cálculos estadísticos
  const nonZeroSales = fullSales.filter(sale => sale > 0);
  
  // Si no hay ventas, establecer valores predeterminados
  const maxSale = nonZeroSales.length > 0 ? Math.max(...nonZeroSales) : 0;
  const maxSaleIndex = fullSales.indexOf(maxSale);
  const minSale = nonZeroSales.length > 0 ? Math.min(...nonZeroSales) : 0;
  const minSaleIndex = nonZeroSales.length > 0 ? fullSales.indexOf(minSale) : -1;
  const avgSale = nonZeroSales.length > 0 
    ? toStrictInteger(nonZeroSales.reduce((a, b) => a + b, 0) / nonZeroSales.length)
    : 0;
  
  const chartWidth = Dimensions.get("window").width - 60;
  
  // Ajustar el ancho de las barras según el periodo
  const getBarWidth = () => {
    if (period === "mensual") {
      return (chartWidth / fullSales.length) - 4; // Barras más estrechas para meses
    } else {
      return (chartWidth / fullSales.length) - 10;
    }
  };
  
  const barWidth = getBarWidth();

  // Determinar el periodo en español para mostrar en la información
  const getPeriodName = (index: number) => {
    if (index < 0) return "N/A";
    return fullLabels[index] || "N/A";
  };
  
  // Función para formatear valores grandes
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value}`;
    }
  };
  
  // Determinar si mostrar el valor sobre la barra
  const shouldShowValue = (index: number, value: number) => {
    if (value === 0) return false;
    
    // Si está activada la opción de mostrar todos los valores, mostrar siempre
    if (showAllValues) return true;
    
    // Para periodos mensuales, mostrar valores alternados para evitar solapamiento
    if (period === "mensual") {
      return index % 2 === 0; // Mostrar solo en meses alternos
    }
    
    return true;
  };

  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <VStack space={2}>
        <HStack justifyContent="space-between" alignItems="center">
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
            <Select.Item
              label={intl.formatMessage({ id: "period.weekly", defaultMessage: "Semanal" })}
              value="semanal"
            />
            <Select.Item
              label={intl.formatMessage({ id: "period.monthly", defaultMessage: "Mensual" })}
              value="mensual"
            />
            <Select.Item
              label={intl.formatMessage({ id: "period.quarterly", defaultMessage: "Trimestral" })}
              value="trimestral"
            />
            <Select.Item
              label={intl.formatMessage({ id: "period.annual", defaultMessage: "Anual" })}
              value="anual"
            />
          </Select>
        </HStack>
        
        {/* Opción para mostrar todos los valores */}
        {period === "mensual" && (
          <HStack justifyContent="flex-end" alignItems="center" space={2}>
            <Text style={{ fontSize: 12, color: "#666" }}>
              <FormattedMessage
                id="chart.show.all.values"
                defaultMessage="Mostrar todos los valores"
              />
            </Text>
            <Switch
              size="sm"
              onToggle={() => setShowAllValues(!showAllValues)}
              isChecked={showAllValues}
              onTrackColor="#075e54"
            />
          </HStack>
        )}
      </VStack>

      <Box height={150} mb={4} mt={20}>
        <HStack
          justifyContent="space-between"
          height="100%"
          alignItems="flex-end"
        >
          {fullSales.map((sale, index) => {
            // Si el valor máximo es 0, establecer un porcentaje mínimo para mostrar barras vacías
            const heightPercentage = maxSale > 0 
              ? toStrictInteger((sale / maxSale) * 100) 
              : 10; // Altura mínima para barras sin datos
              
            const isHighest = sale === maxSale && sale > 0;
            const hasData = sale > 0;
            
            // Determinar si mostrar el valor
            const showValue = shouldShowValue(index, sale);
            
            // Formatear el valor para que ocupe menos espacio
            const formattedValue = formatValue(sale);
            
            // Determinar el estilo del valor según si se muestran todos o no
            const valueStyle = {
              fontSize: showAllValues ? fontSize - 2 : fontSize - 1, 
              fontWeight: "bold" as "bold", 
              marginBottom: 2,
              textAlign: "center" as "center",
              // Rotar el texto si se muestran todos los valores en modo mensual
              transform: showAllValues && period === "mensual" ? [{ rotate: "-45deg" }] : [],
            };

            return (
              <VStack key={index} alignItems="center" space={1} width={barWidth + 4}>
                {hasData && showValue && (
                  <Text 
                    style={valueStyle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formattedValue}
                  </Text>
                )}
                {(hasData && !showValue) && (
                  <View style={{ height: fontSize + 2 }} />
                )}
                <Box
                  width={barWidth}
                  height={`${heightPercentage}%`}
                  bg={isHighest ? "#075e54" : hasData ? "#128c7e" : "#e0e0e0"} // Barras sin datos en gris claro
                  borderRadius="md"
                  opacity={hasData ? 1 : 0.5} // Barras sin datos con menor opacidad
                />
                <Text 
                  style={{ 
                    fontSize, 
                    fontWeight: hasData ? "bold" : "normal",
                    color: hasData ? "#000" : "#666",
                    textAlign: "center"
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {fullLabels[index] ?? "N/A"}
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
            {maxSale > 0 ? `$${maxSale.toLocaleString()}` : "N/A"}
          </Text>
          <Text style={{ fontSize: 12, color: "#075e54" }}>
            {maxSale > 0 ? getPeriodName(maxSaleIndex) : "N/A"}
          </Text>
        </VStack>

        <VStack>
          <Text style={{ fontSize: 12, color: "#666" }}>
            <FormattedMessage id="sales.average" defaultMessage="Promedio" />
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            {avgSale > 0 ? `$${avgSale.toLocaleString()}` : "N/A"}
          </Text>
          <Text style={{ fontSize: 12, color: "#075e54" }}>
            {period === "semanal" ? "Semanal" : 
             period === "mensual" ? "Mensual" : 
             period === "trimestral" ? "Trimestral" : "Anual"}
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
            {minSale > 0 ? `$${minSale.toLocaleString()}` : "N/A"}
          </Text>
          <Text style={{ fontSize: 12, color: "#075e54" }}>
            {minSale > 0 ? getPeriodName(minSaleIndex) : "N/A"}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default SalesChart;