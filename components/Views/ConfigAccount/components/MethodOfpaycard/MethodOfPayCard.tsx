"use client"

import * as React from "react"
import { View, Pressable, Animated } from "react-native"
import { styles } from "./MethodOfPayCardStyles"
import CustomText from "@/components/CustomText"
import ComunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { FormattedMessage } from "react-intl"
import type { Subscription } from "react-native-iap"
import { LinearGradient } from "expo-linear-gradient"

interface IMethodOfPayCard {
  Plan: any
  selectPlan: (plan: Subscription) => void
  planInfo: any
}

const MethodOfPayCard = ({ Plan, selectPlan, planInfo }: IMethodOfPayCard) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current
  const [isPressed, setIsPressed] = React.useState(false)

  const getPrice = () => {
    if (Plan?.subscriptionOfferDetails?.length > 0) {
      const offerDetails = Plan.subscriptionOfferDetails[0]
      if (offerDetails?.pricingPhases?.pricingPhaseList?.length > 0) {
        const pricingPhase = offerDetails?.pricingPhases?.pricingPhaseList[0]
        return pricingPhase?.formattedPrice
      }
    }
    return <FormattedMessage id="priceNotAvailable" defaultMessage="Precio no disponible" />
  }

  const price = planInfo?.costoUSD ? `${planInfo?.costoUSD} USD` : getPrice()
  const adventagesArray = planInfo?.adventages ? planInfo?.adventages?.split(",") : []

  const handlePressIn = () => {
    setIsPressed(true)
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    setIsPressed(false)
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  const gradientColors = planInfo?.mostPopular ? ["#667eea", "#764ba2"] : ["#2c3e50", "#34495e"]

  const accentColor = planInfo?.mostPopular ? "#FFD700" : "#20c997"

  return (
    <View style={styles.MainContainer}>
      {planInfo?.mostPopular && (
        <View style={styles.ContainerMostPopular}>
          <LinearGradient
            colors={["#FFD700", "#FFA500"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.PopularGradient}
          >
            <CustomText style={styles.PopularText}>
              ⭐ <FormattedMessage id="mostPopular" defaultMessage="Más popular" />
            </CustomText>
          </LinearGradient>
        </View>
      )}

      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => selectPlan(Plan)}
          style={({ pressed }) => [
            styles.containerCardMethodOfPay,
            pressed && styles.cardPressed,
            planInfo?.mostPopular && styles.popularCard,
          ]}
        >
          <LinearGradient
            colors={gradientColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.ContainerHeader}>
              <View style={styles.titleContainer}>
                <CustomText style={styles.WhiteTextBold}>{planInfo?.nombre ?? Plan?.name}</CustomText>
                {planInfo?.mostPopular && (
                  <View style={styles.crownIcon}>
                    <ComunityIcons name="crown" color={accentColor} size={20} />
                  </View>
                )}
              </View>

              <View style={styles.priceContainer}>
                <CustomText style={[styles.WhiteTextPrice, { color: accentColor }]}>{price}</CustomText>
                <CustomText style={styles.WhiteText}>/mo</CustomText>
              </View>

              <View style={styles.ContainerAdvantages}>
                {adventagesArray.map((advantage: string, index: number) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.ContainerRowAdventage,
                      {
                        opacity: 1,
                        transform: [{ translateX: 0 }],
                      },
                    ]}
                  >
                    <LinearGradient colors={[accentColor, accentColor + "80"]} style={styles.ContainerCircle}>
                      <ComunityIcons name="check" color="white" size={12} />
                    </LinearGradient>
                    <CustomText style={styles.WhiteText}>{advantage.trim()}</CustomText>
                  </Animated.View>
                ))}
              </View>
            </View>

            <View style={styles.ContainerFooter}>
              <LinearGradient
                colors={planInfo?.mostPopular ? ["#20c997", "#17a2b8"] : ["#128c7e", "#0d6efd"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ButtonBuyNow}
              >
                <Pressable style={styles.buttonPressable} android_ripple={{ color: "rgba(255,255,255,0.2)" }}>
                  <CustomText style={styles.buttonText}>
                    <FormattedMessage id="buyNow" defaultMessage="Comprar ahora" />
                  </CustomText>
                </Pressable>
              </LinearGradient>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  )
}

export default MethodOfPayCard
