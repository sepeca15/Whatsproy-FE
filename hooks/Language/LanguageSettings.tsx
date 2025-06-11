// 

// import { useState, useEffect } from "react"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import * as Localization from "expo-localization"

// interface LanguageHook {
//   currentLanguage: string
//   isAutoDetectEnabled: boolean
//   changeLanguage: (languageCode: string) => Promise<void>
//   toggleAutoDetect: () => Promise<void>
//   getLanguageFromTimezone: () => string
// }

// export const useLanguage = (): LanguageHook => {
//   const [currentLanguage, setCurrentLanguage] = useState<string>("es")
//   const [isAutoDetectEnabled, setIsAutoDetectEnabled] = useState<boolean>(true)

//   // Tu JSON de mapeo de zona horaria a idioma
//   const timezoneToLanguageMap: { [key: string]: string } = {
//     "America/Argentina/Buenos_Aires": "es-AR",
//     "America/Mexico_City": "es-MX",
//     "Europe/Madrid": "es",
//     "America/New_York": "en",
//     "Europe/London": "en-GB",
//     "America/Sao_Paulo": "pt-BR",
//     "Europe/Lisbon": "pt",
//     "Europe/Paris": "fr",
//     "Europe/Rome": "it",
//     "Europe/Berlin": "de",
//     // Agregar más mapeos según necesites
//   }

//   useEffect(() => {
//     loadLanguageSettings()
//   }, [])

//   const loadLanguageSettings = async () => {
//     try {
//       const savedLanguage = await AsyncStorage.getItem("user_selected_language")
//       const autoDetect = await AsyncStorage.getItem("auto_detect_language")

//       const isAutoDetect = autoDetect !== "false"
//       setIsAutoDetectEnabled(isAutoDetect)

//       if (isAutoDetect) {
//         // Usar detección automática por zona horaria
//         const detectedLanguage = getLanguageFromTimezone()
//         setCurrentLanguage(detectedLanguage)
//       } else if (savedLanguage) {
//         // Usar idioma seleccionado manualmente
//         setCurrentLanguage(savedLanguage)
//       } else {
//         // Fallback al idioma del dispositivo
//         const deviceLanguage = Localization.locale
//         setCurrentLanguage(deviceLanguage)
//       }
//     } catch (error) {
//       console.error("Error loading language settings:", error)
//     }
//   }

//   const getLanguageFromTimezone = (): string => {
//     const timezone = Localization.timezone
//     return timezoneToLanguageMap[timezone] || "es"
//   }

//   const changeLanguage = async (languageCode: string): Promise<void> => {
//     try {
//       await AsyncStorage.setItem("user_selected_language", languageCode)
//       await AsyncStorage.setItem("auto_detect_language", "false")
//       setCurrentLanguage(languageCode)
//       setIsAutoDetectEnabled(false)
//     } catch (error) {
//       console.error("Error changing language:", error)
//       throw error
//     }
//   }

//   const toggleAutoDetect = async (): Promise<void> => {
//     try {
//       const newAutoDetectState = !isAutoDetectEnabled
//       await AsyncStorage.setItem("auto_detect_language", newAutoDetectState.toString())
//       setIsAutoDetectEnabled(newAutoDetectState)

//       if (newAutoDetectState) {
//         await AsyncStorage.removeItem("user_selected_language")
//         const detectedLanguage = getLanguageFromTimezone()
//         setCurrentLanguage(detectedLanguage)
//       }
//     } catch (error) {
//       console.error("Error toggling auto detect:", error)
//       throw error
//     }
//   }

//   return {
//     currentLanguage,
//     isAutoDetectEnabled,
//     changeLanguage,
//     toggleAutoDetect,
//     getLanguageFromTimezone,
//   }
// }
