

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

const primaryColor = "#075e54"
const secondaryColor = "#128c7e"

const HelpScreen = () => {
    const intl = useIntl()
    const router = useRouter()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === "dark"
    const colors = isDark ? Colors.dark : Colors.light

    const [searchTerm, setSearchTerm] = useState("")
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0)
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

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

    const screenshots = [
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

    const filteredScreenshots = screenshots.filter(
        (screenshot) =>
            screenshot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            screenshot.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const toggleCategory = (categoryId: number) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
    }

    const toggleQuestion = (questionId: string) => {
        setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <Animated.View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>
                        <FormattedMessage id="helpCenter" defaultMessage="Centro de Ayuda" />
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        <FormattedMessage id="helpCenterDesc" defaultMessage="Encuentra respuestas a tus preguntas" />
                    </Text>
                </View>
            </Animated.View>

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
                            {filteredScreenshots.map((screenshot, index) => (
                                <Animatable.View
                                    key={screenshot.id}
                                    animation="fadeInUp"
                                    duration={800}
                                    delay={350 + index * 50}
                                    style={[styles.screenshotCard, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
                                >
                                    <View style={styles.screenshotPlaceholder}>
                                        <Feather name="image" size={30} color={colors.icon} />
                                        <Text style={[styles.placeholderText, { color: colors.icon }]}>
                                            <FormattedMessage id="screenshot" defaultMessage="Captura" />
                                        </Text>
                                    </View>
                                    <View style={styles.screenshotInfo}>
                                        <View style={[styles.categoryBadge, { borderColor: colors.secondary }]}>
                                            <Text style={[styles.categoryBadgeText, { color: colors.secondary }]}>{screenshot.category}</Text>
                                        </View>
                                        <Text style={[styles.screenshotTitle, { color: colors.text }]}>{screenshot.title}</Text>
                                        <Text style={[styles.screenshotDescription, { color: isDark ? "#e0e0e0" : "#555" }]}>
                                            {screenshot.description}
                                        </Text>
                                    </View>
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
