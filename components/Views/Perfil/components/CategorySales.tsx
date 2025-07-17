import type React from "react";
import { Text } from "react-native";
import {
  Box,
  HStack,
  VStack,
  Icon,
  Divider,
  Select,
  Center,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FormattedMessage, useIntl } from "react-intl";
import SafeProgress from "./SafeProgress";
import { Shadow } from "react-native-shadow-2";

interface CategoryData {
  id: string;
  name: string;
  sales: number;
  percentage: number;
  color: string;
  icon: string;
}

interface CategorySalesProps {
  categories: CategoryData[];
  currency: string;
  totalSales: number;
  filterType: any;
  setFilterType: any;
}

const CategorySales: React.FC<CategorySalesProps> = ({
  currency = "$",
  totalSales = 15750,
  filterType,
  setFilterType,
  categories = [
    {
      id: "1",
      name: "Electrónicos",
      sales: 5250,
      percentage: 33,
      color: "#075e54",
      icon: "phone-portrait-outline",
    },
  ],
}) => {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const intl = useIntl();

  return (
    <Shadow
      distance={5}
      startColor={"rgba(0, 0, 0, 0.05)"}
      endColor={"rgba(0, 0, 0, 0.01)"}
      offset={[0, 2]}
      style={{ width: "100%", marginBottom: 20 }}
    >
      <Box bg="white" borderRadius="lg" p={4}>
        <Box
          width={"full"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>
            <FormattedMessage
              id="sales.byCategory"
              defaultMessage="Ventas por categoría"
            />
          </Text>

          <HStack
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={4}
          >
            <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>
              <FormattedMessage
                id="sales.byCategory"
                defaultMessage="Ventas por categoría"
              />
            </Text>

            <Select
              selectedValue={filterType}
              minWidth={150}
              height={8}
              accessibilityLabel={intl.formatMessage({
                id: "selectPeriod",
                defaultMessage: "Seleccionar Periodo",
              })}
              placeholder={intl.formatMessage({
                id: "selectPeriod",
                defaultMessage: "Seleccionar Periodo",
              })}
              onValueChange={(val) => {
                setFilterType(val);
              }}
              borderRadius={10}
              fontSize={12}
              backgroundColor="white"
              _selectedItem={{
                bg: `rgba(7, 94, 84, 0.1)`,
                endIcon: (
                  <Icon
                    as={Ionicons}
                    name="checkmark"
                    size="xs"
                    color="#075e54"
                  />
                ),
              }}
            >
              <Select.Item
                label={intl.formatMessage({
                  id: "lastDay",
                  defaultMessage: "Último día",
                })}
                value="lastDay"
              />
              <Select.Item
                label={intl.formatMessage({
                  id: "lastWeek",
                  defaultMessage: "Última semana",
                })}
                value="lastWeek"
              />
              <Select.Item
                label={intl.formatMessage({
                  id: "lastMonth",
                  defaultMessage: "Último mes",
                })}
                value="lastMonth"
              />
            </Select>
          </HStack>
        </Box>

        {categories.length === 0 ? (
          <Center py={8}>
            <Text allowFontScaling={false} style={{ color: "#999" }}>
              <FormattedMessage
                id="noData"
                defaultMessage="No hay datos disponibles"
              />
            </Text>
          </Center>
        ) : (
          <VStack space={4}>
            {categories.map((category) => {
              const safeProgressValue =  Number(Math.round(category.percentage).toFixed(2));

              return (
              <VStack key={category.id} space={1}>
                <HStack justifyContent="space-between" alignItems="center">
                  <HStack space={2} alignItems="center">
                    <Box bg={`${category.color}20`} p={1.5} borderRadius="full">
                      <Icon
                        as={Ionicons}
                        name={category.icon}
                        size="xs"
                        color={category.color}
                      />
                    </Box>
                    <Text allowFontScaling={false} style={{ fontSize: 14 }}>{category.name}</Text>
                  </HStack>
                  <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "bold" }}>
                    <FormattedMessage id="sales" />:{" "}
                    {formatNumber(category.sales)}
                  </Text>
                </HStack>
                <HStack space={2} alignItems="start" flexDir={"column"} style={{gap:4}}>
                  <SafeProgress
                    value={safeProgressValue}
                  />
                  <Text allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: "#666",
                      textAlign: "right",
                    }}
                  >
                    {Math.round(category.percentage)}%
                  </Text>
                </HStack>
              </VStack>
            )})}
          </VStack>
        )}

        <Divider my={4} />

        <HStack justifyContent="space-between" alignItems="center">
          <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: "bold" }}>
            <FormattedMessage id="sales.total" defaultMessage="Total" />
          </Text>
          <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>
            <FormattedMessage id="totalProductosVendidos" />
            {": "}
            {formatNumber(totalSales)}
          </Text>
        </HStack>
      </Box>
    </Shadow>
  );
};

export default CategorySales;
