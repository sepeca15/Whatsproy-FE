import type React from "react"
import { Text } from "react-native"
import { Box, HStack, VStack, Icon, Divider } from "native-base"
import { Ionicons } from "@expo/vector-icons"
import { FormattedMessage } from "react-intl"
import SafeProgress from "./SafeProgress"

interface CategoryData {
  id: string
  name: string
  sales: number
  percentage: number
  color: string
  icon: string
}

interface CategorySalesProps {
  categories: CategoryData[]
  currency: string
  totalSales: number
}

const CategorySales: React.FC<CategorySalesProps> = ({
  currency = "$",
  totalSales = 15750,
  categories = [
    {
      id: "1",
      name: "Electrónicos",
      sales: 5250,
      percentage: 33,
      color: "#075e54",
      icon: "phone-portrait-outline",
    },
    {
      id: "2",
      name: "Ropa",
      sales: 4200,
      percentage: 27,
      color: "#128c7e",
      icon: "shirt-outline",
    },
    {
      id: "3",
      name: "Hogar",
      sales: 3150,
      percentage: 20,
      color: "#25d366",
      icon: "home-outline",
    },
    {
      id: "4",
      name: "Alimentos",
      sales: 1575,
      percentage: 10,
      color: "#34b7f1",
      icon: "fast-food-outline",
    },
    {
      id: "5",
      name: "Otros",
      sales: 1575,
      percentage: 10,
      color: "#687076",
      icon: "ellipsis-horizontal-outline",
    },
  ],
}) => {
  // Formatear números para mostrar con separadores de miles
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        <FormattedMessage id="sales.byCategory" defaultMessage="Ventas por categoría" />
      </Text>

      <VStack space={4}>
        {categories.map((category) => (
          <VStack key={category.id} space={1}>
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={2} alignItems="center">
                <Box bg={`${category.color}20`} p={1.5} borderRadius="full">
                  <Icon as={Ionicons} name={category.icon} size="xs" color={category.color} />
                </Box>
                <Text style={{ fontSize: 14 }}>{category.name}</Text>
              </HStack>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                {currency}
                {formatNumber(category.sales)}
              </Text>
            </HStack>
            <HStack space={2} alignItems="center">
              <SafeProgress value={category.percentage} _filledTrack={{ bg: category.color }} size="xs" flex={1} />
              <Text style={{ fontSize: 12, color: "#666", width: 35, textAlign: "right" }}>
                {Math.round(category.percentage)}%
              </Text>
            </HStack>
          </VStack>
        ))}
      </VStack>

      <Divider my={4} />

      <HStack justifyContent="space-between" alignItems="center">
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
          <FormattedMessage id="sales.total" defaultMessage="Total" />
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {currency}
          {formatNumber(totalSales)}
        </Text>
      </HStack>
    </Box>
  )
}

export default CategorySales

