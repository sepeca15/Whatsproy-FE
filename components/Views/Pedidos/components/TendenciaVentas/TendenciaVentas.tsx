import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Path, G, Circle } from "react-native-svg";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { data, categories, colors, totalValues } from "../data";
import { MonthlySalesData, SalesSegment } from "./types";
import { Styles } from "./TendenciaVentasStyles";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = screenWidth - 40;
const chartHeight = 220;
const radius = Math.min(chartWidth, chartHeight) / 2 - 20;

const calculateCategoryPercentage = (category: string) => {
  const totalCategoryValue = data.reduce(
    (sum, d) => sum + d.categories[category],
    0,
  );
  const totalValue = data.reduce(
    (sum, d) => sum + Object.values(d.categories).reduce((a, b) => a + b, 0),
    0,
  );
  return ((totalCategoryValue / totalValue) * 100).toFixed(1);
};

const TendenciaVentasCircular: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<SalesSegment | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const segments: SalesSegment[] = [];

  data.forEach((d: MonthlySalesData, index: number) => {
    let startAngle = 0;
    categories.forEach((category: string, catIndex: number) => {
      const value = d.categories[category];
      const angle = (value / totalValues[index]) * 360;
      const endAngle = startAngle + angle;
      segments.push({
        startAngle,
        endAngle,
        color: colors[catIndex],
        label: `${category} (${d.month})`,
        value,
        month: d.month,
        category,
      });
      startAngle = endAngle;
    });
  });

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
      "Z",
    ].join(" ");
    return d;
  };

  const handleSegmentPress = (segment: SalesSegment) => {
    setSelectedSegment(segment);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  return (
    <GestureHandlerRootView style={Styles.container}>
      <Text style={Styles.title}>
        <FormattedMessage
          id="salesTrendByCategory"
          defaultMessage="Sales Trend by Category"
        />
      </Text>
      <Svg
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={Styles.chart}
      >
        <G transform={`translate(${chartWidth / 2}, ${chartHeight / 2})`}>
          {segments.map((segment, index) => (
            <TapGestureHandler
              key={index}
              onActivated={() => handleSegmentPress(segment)}
            >
              <Path
                d={describeArc(
                  0,
                  0,
                  radius,
                  segment.startAngle,
                  segment.endAngle,
                )}
                fill={segment.color}
                opacity={
                  selectedCategory === null ||
                  selectedCategory === segment.category
                    ? 1
                    : 0.3
                }
              />
            </TapGestureHandler>
          ))}
          <Circle cx={0} cy={0} r={radius * 0.6} fill="white" />
        </G>
      </Svg>
      <View style={Styles.legend}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={Styles.legendItem}
            onPress={() => handleCategoryPress(category)}
          >
            <View
              style={[Styles.legendColor, { backgroundColor: colors[index] }]}
            />
            <Text
              style={[
                Styles.legendText,
                selectedCategory === category && Styles.selectedLegendText,
              ]}
            >
              {category} ({calculateCategoryPercentage(category)}%)
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedSegment && (
        <View style={Styles.tooltip}>
          <Text style={Styles.tooltipText}>{selectedSegment.label}</Text>
          <Text style={Styles.tooltipText}>
            <FormattedMessage id="value" defaultMessage="Value" />:{" "}
            {selectedSegment.value}
          </Text>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default TendenciaVentasCircular;
