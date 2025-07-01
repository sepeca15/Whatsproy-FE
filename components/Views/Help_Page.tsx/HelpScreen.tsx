
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Dimensions, Platform } from "react-native"
import { useRouter } from "expo-router"
import { FormattedMessage, useIntl } from "react-intl"
import { useColorScheme } from "react-native"
import { Colors } from "@/constants/Colors"
import Animated from "react-native-reanimated"
import * as Animatable from "react-native-animatable"
import Feather from "react-native-vector-icons/Feather"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import VisualGuideModal from "@/hooks/GuieModal/VisualGuideModal"
import { GuideImages } from "@/assets/images/index"
import CustomHeader from "@/components/CustomHeader/CustomHeader"

const primaryColor = "#075e54"
const secondaryColor = "#128c7e"

interface GuideImage {
  id: number
  src: any // Para imágenes locales (require)
  title: string
  description: string
  instructions: string[]
}

interface VisualGuide {
  id: number
  title: string
  description: string
  category: string
  images: GuideImage[]
}

const HelpScreen = () => {
  const intl = useIntl()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = isDark ? Colors.dark : Colors.light

  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [selectedGuide, setSelectedGuide] = useState<VisualGuide | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const faqCategories = [
    {
      id: 1,
      title: intl.formatMessage({
        id: "generalHelp",
        defaultMessage: "General",
      }),
      icon: <Feather name="help-circle" size={22} color="white" />,
      questions: [
        {
          id: "q1-1",
          question: intl.formatMessage({
            id: "howToStartQuestion",
            defaultMessage: "¿Cómo empiezo a usar la aplicación?",
          }),
          answer: intl.formatMessage({
            id: "howToStartAnswer",
            defaultMessage:
              "Para comenzar, primero debes configurar tu perfil en la sección de ajustes generales. Luego, configura tus horarios de trabajo y comienza a recibir pedidos.",
          }),
        },
        {
          id: "q1-2",
          question: intl.formatMessage({
            id: "serviceTypesQuestion",
            defaultMessage: "¿Qué tipos de servicios puedo ofrecer?",
          }),
          answer: intl.formatMessage({
            id: "serviceTypesAnswer",
            defaultMessage:
              "Puedes ofrecer servicios de delivery y reservas. El tipo de servicio se configura en tu perfil de usuario.",
          }),
        },
        {
          id: "q1-3",
          question: intl.formatMessage({
            id: "changeLanguageQuestion",
            defaultMessage: "¿Cómo cambio el idioma de la aplicación?",
          }),
          answer: intl.formatMessage({
            id: "changeLanguageAnswer",
            defaultMessage:
              "Ve a Configuración General > Idioma y selecciona tu idioma preferido. La aplicación se actualizará automáticamente.",
          }),
        },
      ],
    },
    {
      id: 2,
      title: intl.formatMessage({
        id: "settingsHelp",
        defaultMessage: "Configuración",
      }),
      icon: <Feather name="settings" size={22} color="white" />,
      questions: [
        {
          id: "q2-1",
          question: intl.formatMessage({
            id: "scheduleConfigQuestion",
            defaultMessage: "¿Cómo configuro mis horarios de trabajo?",
          }),
          answer: intl.formatMessage({
            id: "scheduleConfigAnswer",
            defaultMessage:
              "Ve a la sección 'Horarios' en el menú de configuración. Allí puedes establecer tus días y horas de trabajo, así como pausas y días libres.",
          }),
        },
        {
          id: "q2-2",
          question: intl.formatMessage({
            id: "provisionalClosureQuestion",
            defaultMessage: "¿Qué es el cierre provisorio?",
          }),
          answer: intl.formatMessage({
            id: "provisionalClosureAnswer",
            defaultMessage:
              "El cierre provisorio te permite pausar temporalmente tu servicio sin afectar tu configuración principal. Útil para descansos o emergencias.",
          }),
        },
        {
          id: "q2-3",
          question: intl.formatMessage({
            id: "trustedNumbersQuestion",
            defaultMessage: "¿Cómo funcionan los números de confianza?",
          }),
          answer: intl.formatMessage({
            id: "trustedNumbersAnswer",
            defaultMessage:
              "Los números de confianza son contactos especiales que pueden comunicarse contigo directamente sin activar el bot automático.",
          }),
        },
      ],
    },
    {
      id: 3,
      title: intl.formatMessage({
        id: "usersRolesHelp",
        defaultMessage: "Usuarios y Roles",
      }),
      icon: <FontAwesome5 name="users" size={22} color="white" />,
      questions: [
        {
          id: "q3-1",
          question: intl.formatMessage({
            id: "adminDifferenceQuestion",
            defaultMessage: "¿Cuál es la diferencia entre admin y usuario normal?",
          }),
          answer: intl.formatMessage({
            id: "adminDifferenceAnswer",
            defaultMessage:
              "Los administradores pueden gestionar usuarios, configurar horarios, ver estadísticas y acceder a todas las funciones. Los usuarios normales solo pueden ver y gestionar sus propios pedidos.",
          }),
        },
        {
          id: "q3-2",
          question: intl.formatMessage({
            id: "createUsersQuestion",
            defaultMessage: "¿Cómo creo nuevos usuarios?",
          }),
          answer: intl.formatMessage({
            id: "createUsersAnswer",
            defaultMessage:
              "Solo los administradores pueden crear usuarios. Ve a la sección 'Usuarios' y haz clic en 'Agregar Usuario'.",
          }),
        },
      ],
    },
    {
      id: 4,
      title: intl.formatMessage({
        id: "securityHelp",
        defaultMessage: "Seguridad",
      }),
      icon: <Feather name="shield" size={22} color="white" />,
      questions: [
        {
          id: "q4-1",
          question: intl.formatMessage({
            id: "protectAccountQuestion",
            defaultMessage: "¿Cómo protejo mi cuenta?",
          }),
          answer: intl.formatMessage({
            id: "protectAccountAnswer",
            defaultMessage:
              "Usa contraseñas seguras, no compartas tus credenciales y revisa regularmente la sección de Privacidad y Seguridad.",
          }),
        },
        {
          id: "q4-2",
          question: intl.formatMessage({
            id: "dataStorageQuestion",
            defaultMessage: "¿Qué datos se almacenan?",
          }),
          answer: intl.formatMessage({
            id: "dataStorageAnswer",
            defaultMessage:
              "Solo almacenamos los datos necesarios para el funcionamiento del servicio. Consulta nuestra política de privacidad para más detalles.",
          }),
        },
      ],
    },
  ]

  // Guías visuales actualizadas con imágenes locales
  const visualGuides: VisualGuide[] = [
    {
      id: 1,
      title: intl.formatMessage({
        id: "dashboardScreenshot",
        defaultMessage: "Panel Principal",
      }),
      description: intl.formatMessage({
        id: "dashboardScreenshotDesc",
        defaultMessage: "Vista general del dashboard con métricas y pedidos recientes",
      }),
      category: "Dashboard",
      images: [
        {
          id: 1,
          src: GuideImages.dashboard.main, // Imagen local
          title: intl.formatMessage({
            id: "dashboardMainTitle",
            defaultMessage: "Vista del Dashboard",
          }),
          description: intl.formatMessage({
            id: "dashboardMainDesc",
            defaultMessage:
              "Aquí puedes ver un resumen de tus métricas principales, pedidos recientes y estado general de tu negocio.",
          }),
          instructions: [
            intl.formatMessage({
              id: "dashboardStep1",
              defaultMessage: "Abre la aplicación desde tu dispositivo móvil",
            }),
            intl.formatMessage({
              id: "dashboardStep2",
              defaultMessage: "Inicia sesión con tus credenciales",
            }),
            intl.formatMessage({
              id: "dashboardStep3",
              defaultMessage: "La pantalla principal mostrará automáticamente el dashboard",
            }),
            intl.formatMessage({
              id: "dashboardStep4",
              defaultMessage: "Revisa las métricas en la parte superior de la pantalla",
            }),
          ],
        },
        {
          id: 2,
          src: GuideImages.dashboard.metrics,
          title: intl.formatMessage({
            id: "dashboardMetricsTitle",
            defaultMessage: "Métricas Detalladas",
          }),
          description: intl.formatMessage({
            id: "dashboardMetricsDesc",
            defaultMessage: "Las métricas incluyen ventas del día, pedidos completados, calificaciones promedio y más.",
          }),
          instructions: [
            intl.formatMessage({
              id: "metricsStep1",
              defaultMessage: "Toca en cualquier métrica para ver más detalles",
            }),
            intl.formatMessage({
              id: "metricsStep2",
              defaultMessage: "Desliza hacia la izquierda para ver métricas adicionales",
            }),
            intl.formatMessage({
              id: "metricsStep3",
              defaultMessage: "Usa el selector de fecha para cambiar el período",
            }),
            intl.formatMessage({
              id: "metricsStep4",
              defaultMessage: "Toca el ícono de gráfico para ver tendencias",
            }),
          ],
        },
        {
          id: 3,
          src: GuideImages.dashboard.orders,
          title: intl.formatMessage({
            id: "dashboardOrdersTitle",
            defaultMessage: "Pedidos Recientes",
          }),
          description: intl.formatMessage({
            id: "dashboardOrdersDesc",
            defaultMessage: "Lista de los últimos pedidos recibidos con su estado actual y detalles importantes.",
          }),
          instructions: [
            intl.formatMessage({
              id: "ordersStep1",
              defaultMessage: "Desplázate hacia abajo para ver la lista de pedidos",
            }),
            intl.formatMessage({
              id: "ordersStep2",
              defaultMessage: "Toca cualquier pedido para ver sus detalles completos",
            }),
            intl.formatMessage({
              id: "ordersStep3",
              defaultMessage: "Usa los filtros para buscar pedidos específicos",
            }),
            intl.formatMessage({
              id: "ordersStep4",
              defaultMessage: "Desliza un pedido hacia la izquierda para acciones rápidas",
            }),
          ],
        },
      ],
    },
    {
      id: 2,
      title: intl.formatMessage({
        id: "scheduleScreenshot",
        defaultMessage: "Configuración de Horarios",
      }),
      description: intl.formatMessage({
        id: "scheduleScreenshotDesc",
        defaultMessage: "Cómo establecer tus horarios de trabajo y disponibilidad",
      }),
      category: "Configuración",
      images: [
        {
          id: 4,
          src: GuideImages.schedule.weekly,
          title: intl.formatMessage({
            id: "scheduleWeeklyTitle",
            defaultMessage: "Horarios Semanales",
          }),
          description: intl.formatMessage({
            id: "scheduleWeeklyDesc",
            defaultMessage: "Configura tus horarios de trabajo para cada día de la semana.",
          }),
          instructions: [
            intl.formatMessage({
              id: "weeklyStep1",
              defaultMessage: "Ve al menú principal y selecciona 'Configuración'",
            }),
            intl.formatMessage({
              id: "weeklyStep2",
              defaultMessage: "Toca en 'Horarios de Trabajo'",
            }),
            intl.formatMessage({
              id: "weeklyStep3",
              defaultMessage: "Selecciona cada día de la semana individualmente",
            }),
            intl.formatMessage({
              id: "weeklyStep4",
              defaultMessage: "Establece hora de inicio y fin para cada día",
            }),
            intl.formatMessage({
              id: "weeklyStep5",
              defaultMessage: "Guarda los cambios tocando 'Confirmar'",
            }),
          ],
        },
        // {
        //   id: 5,
        //   src: GuideImages.schedule.breaks,
        //   title: intl.formatMessage({
        //     id: "scheduleBreaksTitle",
        //     defaultMessage: "Pausas y Descansos",
        //   }),
        //   description: intl.formatMessage({
        //     id: "scheduleBreaksDesc",
        //     defaultMessage: "Establece pausas automáticas durante tu jornada laboral.",
        //   }),
        //   instructions: [
        //     intl.formatMessage({
        //       id: "breaksStep1",
        //       defaultMessage: "En la pantalla de horarios, toca 'Configurar Pausas'",
        //     }),
        //     intl.formatMessage({
        //       id: "breaksStep2",
        //       defaultMessage: "Selecciona el tipo de pausa (almuerzo, descanso, etc.)",
        //     }),
        //     intl.formatMessage({
        //       id: "breaksStep3",
        //       defaultMessage: "Establece la hora de inicio y duración",
        //     }),
        //     intl.formatMessage({
        //       id: "breaksStep4",
        //       defaultMessage: "Marca si la pausa es automática o manual",
        //     }),
        //     intl.formatMessage({
        //       id: "breaksStep5",
        //       defaultMessage: "Confirma la configuración",
        //     }),
        //   ],
        // },
        {
          id: 6,
          src: GuideImages.schedule.holidays,
          title: intl.formatMessage({
            id: "cierreprovisorio",
            defaultMessage: "Cierre Provisorio",
          }),
          description: intl.formatMessage({
            id: "scheduleHolidaysDesc",
            defaultMessage: "Marca los días en que no estarás disponible para recibir pedidos.",
          }),
          instructions: [
            intl.formatMessage({
              id: "holidaysStep1",
              defaultMessage: "Ve a la sección 'Cierre provisorios' en configuración",
            }),
            intl.formatMessage({
              id: "holidaysStep2",
              defaultMessage: "Toca el boton ' + ' para agregar una nueva fecha de cierre",
            }),
            intl.formatMessage({
              id: "holidaysStep3",
              defaultMessage: "Selecciona las fechas de inicio y fin del cierre provisorio",
            }),
           
          ],
        },
      ],
    },
    {
      id: 3,
      title: intl.formatMessage({
        id: "usersScreenshot",
        defaultMessage: "Gestión de Usuarios",
      }),
      description: intl.formatMessage({
        id: "usersScreenshotDesc",
        defaultMessage: "Crear y administrar usuarios del sistema",
      }),
      category: "Administración",
      images: [
        {
          id: 7,
          src: GuideImages.users.list,
          title: intl.formatMessage({
            id: "usersListTitle",
            defaultMessage: "Lista de Usuarios",
          }),
          description: intl.formatMessage({
            id: "usersListDesc",
            defaultMessage: "Vista general de todos los usuarios registrados en el sistema.",
          }),
          instructions: [
            intl.formatMessage({
              id: "usersListStep1",
              defaultMessage: "Ve a la sección 'Usuarios' en configuración",
            }),
            intl.formatMessage({
              id: "usersListStep2",
              defaultMessage: "Revisa la lista completa de usuarios activos",
            }),
          
          ],
        },
        {
          id: 8,
          src: GuideImages.users.create,
          title: intl.formatMessage({
            id: "usersCreateTitle",
            defaultMessage: "Crear Usuario",
          }),
          description: intl.formatMessage({
            id: "usersCreateDesc",
            defaultMessage: "Formulario para agregar nuevos usuarios con sus respectivos roles.",
          }),
          instructions: [
            intl.formatMessage({
              id: "usersCreateStep1",
              defaultMessage: "Toca el botón '+' o 'Agregar Usuario'",
            }),
            intl.formatMessage({
              id: "usersCreateStep2",
              defaultMessage: "Completa todos los campos obligatorios",
            }),
           
           
           
          ],
        },
        {
          id: 9,
          src: GuideImages.users.permissions,
          title: intl.formatMessage({
            id: "usersPermissionsTitle",
            defaultMessage: "Permisos y Roles",
          }),
          description: intl.formatMessage({
            id: "usersPermissionsDesc",
            defaultMessage: "Asignar permisos específicos para cada tipo de usuario.",
          }),
          instructions: [
            intl.formatMessage({
              id: "usersCreateStep1",
              defaultMessage: "Al momento de crear un usuario selecciona el rol correspondiente",
            }),
          
          ],
        },
      ],
    },
    {
      id: 4,
      title: intl.formatMessage({
        id: "paymentsScreenshot",
        defaultMessage: "Métodos de Pago",
      }),
      description: intl.formatMessage({
        id: "paymentsScreenshotDesc",
        defaultMessage: "Configurar y gestionar métodos de pago disponibles",
      }),
      category: "Pagos",
      images: [
        {
          id: 10,
          src: GuideImages.payments.methods,
          title: intl.formatMessage({
            id: "paymentsMethodsTitle",
            defaultMessage: "Métodos Disponibles",
          }),
          description: intl.formatMessage({
            id: "paymentsMethodsDesc",
            defaultMessage: "Lista de todos los métodos de pago que puedes ofrecer a tus clientes.",
          }),
          instructions: [
            intl.formatMessage({
              id: "paymentsStep1",
              defaultMessage: "Ve a 'Configuración' > 'Métodos de Pago'",
            }),
            intl.formatMessage({
              id: "paymentsStep2",
              defaultMessage: "Revisa todos los métodos disponibles",
            }),
            intl.formatMessage({
              id: "paymentsStep3",
              defaultMessage: "Activa o desactiva métodos según tu preferencia",
            }),
            intl.formatMessage({
              id: "paymentsStep4",
              defaultMessage: "Configura límites mínimos y máximos si es necesario",
            }),
          ],
        },
        // {
        //   id: 11,
        //   src: GuideImages.payments.config,
        //   title: intl.formatMessage({
        //     id: "paymentsConfigTitle",
        //     defaultMessage: "Configuración de Pagos",
        //   }),
        //   description: intl.formatMessage({
        //     id: "paymentsConfigDesc",
        //     defaultMessage: "Ajustes específicos para cada método de pago, incluyendo comisiones.",
        //   }),
        //   instructions: [
        //     intl.formatMessage({
        //       id: "configStep1",
        //       defaultMessage: "Selecciona un método de pago específico",
        //     }),
        //     intl.formatMessage({
        //       id: "configStep2",
        //       defaultMessage: "Configura las comisiones y tarifas",
        //     }),
        //     intl.formatMessage({
        //       id: "configStep3",
        //       defaultMessage: "Establece límites de transacción",
        //     }),
        //     intl.formatMessage({
        //       id: "configStep4",
        //       defaultMessage: "Configura notificaciones de pago",
        //     }),
        //     intl.formatMessage({
        //       id: "configStep5",
        //       defaultMessage: "Prueba la configuración antes de activar",
        //     }),
        //   ],
        // },
      ],
    },
  ]

  const filteredFAQ = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const filteredScreenshots = visualGuides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  const openGuideModal = (guide: VisualGuide) => {
    setSelectedGuide(guide)
    setModalVisible(true)
  }

  const closeGuideModal = () => {
    setModalVisible(false)
    setSelectedGuide(null)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}

      <CustomHeader 
      title={<FormattedMessage id="helpCenter" defaultMessage="Centro de Ayuda" />}
      subtitle={<FormattedMessage
                id="helpCenterDesc"
                defaultMessage="Encuentra respuestas a tus preguntas"
              />}
              onBack={() => router.back()}
              showBackButton

      />
   
      {/* Search Bar */}
      <Animatable.View animation="fadeInDown" duration={800} style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={colors.icon} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={intl.formatMessage({
              id: "searchHelp",
              defaultMessage: "Buscar ayuda...",
            })}
            placeholderTextColor={colors.icon}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Feather name="x" size={20} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>
      </Animatable.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <Animatable.View animation="fadeInUp" duration={800} delay={100}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            <FormattedMessage id="frequentQuestions" defaultMessage="Preguntas Frecuentes" />
          </Text>

          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((category, index) => (
              <Animatable.View
                key={category.id}
                animation="fadeInUp"
                duration={800}
                delay={150 + index * 50}
                style={[styles.categoryContainer, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
              >
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: colors.primary }]}>
                    {category.icon}
                  </View>
                  <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                  <Feather
                    name={expandedCategory === category.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>

                {expandedCategory === category.id && (
                  <View style={styles.questionsContainer}>
                    {category.questions.map((question, qIndex) => (
                      <Animatable.View key={question.id} animation="fadeIn" duration={400} delay={qIndex * 100}>
                        <TouchableOpacity
                          style={styles.questionItem}
                          onPress={() => toggleQuestion(question.id)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.questionHeader}>
                            <Text style={[styles.questionText, { color: colors.text }]}>{question.question}</Text>
                            <Feather
                              name={expandedQuestion === question.id ? "minus" : "plus"}
                              size={18}
                              color={colors.icon}
                            />
                          </View>

                          {expandedQuestion === question.id && (
                            <Animatable.View animation="fadeIn" duration={300} style={styles.answerContainer}>
                              <Text style={[styles.answerText, { color: isDark ? "#e0e0e0" : "#555" }]}>
                                {question.answer}
                              </Text>
                            </Animatable.View>
                          )}
                        </TouchableOpacity>
                      </Animatable.View>
                    ))}
                  </View>
                )}
              </Animatable.View>
            ))
          ) : (
            <Animatable.View
              animation="fadeIn"
              duration={800}
              style={[styles.emptyResultContainer, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
            >
              <Feather name="search" size={40} color={colors.icon} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                <FormattedMessage
                  id="noQuestionsFound"
                  defaultMessage="No se encontraron preguntas que coincidan con tu búsqueda"
                />
              </Text>
            </Animatable.View>
          )}
        </Animatable.View>

        {/* Screenshots Section */}
        <Animatable.View animation="fadeInUp" duration={800} delay={300}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
            <FormattedMessage id="visualGuides" defaultMessage="Guías Visuales" />
          </Text>

          {filteredScreenshots.length > 0 ? (
            <View style={styles.screenshotsGrid}>
              {filteredScreenshots.map((guide, index) => (
                <Animatable.View
                  key={guide.id}
                  animation="fadeInUp"
                  duration={800}
                  delay={350 + index * 50}
                  style={[styles.screenshotCard, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
                >
                  <TouchableOpacity onPress={() => openGuideModal(guide)} activeOpacity={0.8}>
                    <View style={styles.screenshotPlaceholder}>
                      <Animated.Image
                      source={guide.images[0]?.src}
                      style={[
                        StyleSheet.absoluteFill,
                        { borderRadius: 0, opacity: 0.45, width: "100%", height: "100%" },
                      ]}
                      resizeMode="cover"
                      />
                      <Feather name="play-circle" size={30} color={colors.primary} />
                      <Text style={[styles.placeholderText, { color: colors.primary }]}>
                      <FormattedMessage id="tapToViewGuide" defaultMessage="Toca para ver la guía" />
                      </Text>
                    </View>
                    <View style={styles.screenshotInfo}>
                      <View style={[styles.categoryBadge, { borderColor: colors.secondary }]}>
                        <Text style={[styles.categoryBadgeText, { color: colors.secondary }]}>{guide.category}</Text>
                      </View>
                      <Text style={[styles.screenshotTitle, { color: colors.text }]}>{guide.title}</Text>
                      <Text style={[styles.screenshotDescription, { color: isDark ? "#e0e0e0" : "#555" }]}>
                        {guide.description}
                      </Text>
                      <View style={styles.guideStats}>
                        <Text style={[styles.guideStatsText, { color: colors.icon }]}>
                          {guide.images.length}{" "}
                          {guide.images.length === 1
                            ? intl.formatMessage({ id: "step", defaultMessage: "paso" })
                            : intl.formatMessage({ id: "steps", defaultMessage: "pasos" })}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>
          ) : (
            searchTerm.length > 0 && (
              <Animatable.View
                animation="fadeIn"
                duration={800}
                style={[styles.emptyResultContainer, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
              >
                <Feather name="image" size={40} color={colors.icon} style={styles.emptyIcon} />
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  <FormattedMessage
                    id="noScreenshotsFound"
                    defaultMessage="No se encontraron guías que coincidan con tu búsqueda"
                  />
                </Text>
              </Animatable.View>
            )
          )}
        </Animatable.View>

        {/* Contact Support */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={400}
          style={[styles.contactContainer, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
        >
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            <FormattedMessage id="needMoreHelp" defaultMessage="¿No encuentras lo que buscas?" />
          </Text>
          <Text style={[styles.contactDescription, { color: isDark ? "#e0e0e0" : "#555" }]}>
            <FormattedMessage id="contactSupport" defaultMessage="Contáctanos para obtener ayuda personalizada" />
          </Text>
          <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
            <Text style={styles.contactButtonText}>
              <FormattedMessage id="contactSupportButton" defaultMessage="Contactar Soporte" />
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      {/* Visual Guide Modal */}
      <VisualGuideModal visible={modalVisible} guide={selectedGuide} onClose={closeGuideModal} />
    </View>
  )
}

const { width } = Dimensions.get("window")
const isSmallDevice = width < 375

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  categoryContainer: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  questionsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  questionItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    paddingRight: 10,
  },
  answerContainer: {
    marginTop: 10,
    paddingLeft: 5,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyResultContainer: {
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    marginBottom: 15,
    opacity: 0.5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
  },
  screenshotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  screenshotCard: {
    width: width > 500 ? (width - 60) / 2 : width - 40,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  screenshotPlaceholder: {
    height: 120,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  screenshotInfo: {
    padding: 12,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  screenshotTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  screenshotDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  guideStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  guideStatsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  contactContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  contactButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default HelpScreen
