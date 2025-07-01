"use client"

import React from "react"
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native"
import { Checkbox, Icon } from "native-base"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown } from "react-native-reanimated"
import { FormattedMessage, useIntl } from "react-intl"
import { useColorScheme } from "react-native"
import * as Contacts from "expo-contacts"

import GenericModal from "@/components/Views/ConfigAccount/components/GenericModal/GenericModal"
import InputField from "@/components/InputField"
import { Colors } from "@/constants/Colors"
import { styles } from "./ModalSelectContactStyles"

interface IModalSelectContact {
  onClose: () => void
  isOpen: boolean
  onImportContacts: (contacts: { id: number; nombre: string; numero: string }[]) => void
  loadingApi: boolean
  trustedPhones: string[]
}

const normalize = (num: string) => num.replace(/\D/g, "").replace(/^0+/, "")

const ModalSelectContact = ({ isOpen, onClose, onImportContacts, loadingApi, trustedPhones }: IModalSelectContact) => {
  const intl = useIntl()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]

  const [contacts, setContacts] = React.useState<any[]>([])
  const [contactsFilter, setContactsFilter] = React.useState<any[]>([])
  const [valueSearch, setValueSearch] = React.useState<string>("")
  const [contactsSelected, setContactsSelected] = React.useState<Set<string>>(new Set())
  const [loadingContacts, setLoadingContacts] = React.useState<boolean>(false)
  const [permissionDenied, setPermissionDenied] = React.useState<boolean>(false)

  const importContacts = async () => {
    setLoadingContacts(true)
    setPermissionDenied(false)

    try {
      const { status } = await Contacts.requestPermissionsAsync()

      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        })

        if (data.length > 0) {
          // Filter contacts that have phone numbers
          const contactsWithPhones = data.filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
          setContacts(contactsWithPhones)

          // Pre-select contacts that are already trusted
          const matchedContacts = contactsWithPhones.filter((c) =>
            c.phoneNumbers?.some((p) => trustedPhones.includes((p.number ?? "").replace(/\D/g, "").replace(/^0+/, ""))),
          )

          const matchedIds = new Set<string>(matchedContacts.map((c) => String(c.id)).filter(Boolean))
          setContactsSelected(matchedIds)
        }
      } else {
        setPermissionDenied(true)
      }
    } catch (error) {
      console.log(error)
      setPermissionDenied(true)
    } finally {
      setLoadingContacts(false)
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      importContacts()
    }
  }, [isOpen])

  const toggleContact = (contact: any) => {
    const contactId = String(contact.id)
    setContactsSelected((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(contactId)) {
        newSelected.delete(contactId)
      } else {
        newSelected.add(contactId)
      }
      return newSelected
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const renderContactItem = ({ item, index }: { item: any; index: number }) => {
    const name = item.name ?? (`${item.firstName} ${item.lastName ?? ""}` || "No name")
    const hasNumber = item.phoneNumbers && item.phoneNumbers.length > 0

    if (!hasNumber) return null

    const isSelected = contactsSelected.has(String(item.id))
    const phoneNumber = item.phoneNumbers[0].number

    return (
      <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
        <TouchableOpacity style={styles.contactItem} onPress={() => toggleContact(item)} activeOpacity={0.7}>
          <View style={styles.contactContent}>
            <Checkbox
              value={item.id.toString()}
              isChecked={isSelected}
              aria-label={`Select contact ${name}`}
              colorScheme="primary"
              size="md"
            />

            <View style={styles.avatarContainer}>
              <LinearGradient colors={[colors.primary + "25", colors.primary + "15"]} style={styles.avatarGradient}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(name)}</Text>
              </LinearGradient>
            </View>

            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: colors.text }]} numberOfLines={1}>
                {name}
              </Text>
              <Text style={[styles.contactPhone, { color: colors.textSecondary }]} numberOfLines={1}>
                {phoneNumber}
              </Text>
            </View>

            {isSelected && (
              <View style={styles.selectedIndicator}>
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  React.useEffect(() => {
    const updateValue = setTimeout(() => {
      handleFilterValue(valueSearch)
    }, 300)

    return () => clearTimeout(updateValue)
  }, [valueSearch])

  const handleFilterValue = (value: string) => {
    if (!value.trim()) {
      setContactsFilter([])
      return
    }

    const filtered = contacts.filter((contact) => {
      const name = contact.name ?? (`${contact.firstName} ${contact.lastName ?? ""}` || "")
      const phone = contact.phoneNumbers?.[0]?.number || ""
      return name.toLowerCase().includes(value.toLowerCase()) || phone.includes(value)
    })
    setContactsFilter(filtered)
  }

  const handleImport = () => {
    const selectedContacts = contacts
      .filter((contact) => contactsSelected.has(contact.id))
      .map((contact: any) => ({
        id: contact.id,
        nombre: contact.name ?? contact.firstName,
        numero: normalize(contact.phoneNumbers[0]?.number || ""),
      }))

    onImportContacts(selectedContacts)
    setContactsSelected(new Set())
    onClose()
  }

  const modalActions = [
    {
      label: intl.formatMessage({ id: "common.cancel", defaultMessage: "Cancelar" }),
      onPress: onClose,
      style: "secondary" as const,
      disabled: loadingApi,
    },
    {
      label: loadingApi
        ? intl.formatMessage({ id: "common.importing", defaultMessage: "Importando..." })
        : intl.formatMessage(
            { id: "trustedNumbers.modal.import", defaultMessage: "Importar ({count})" },
            { count: contactsSelected.size },
          ),
      onPress: handleImport,
      style: "primary" as const,
      disabled: loadingApi || contactsSelected.size === 0,
    },
  ]

  const renderContent = () => {
    if (loadingContacts) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            <FormattedMessage id="trustedNumbers.modal.loadingContacts" defaultMessage="Cargando contactos..." />
          </Text>
        </View>
      )
    }

    if (permissionDenied) {
      return (
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <MaterialIcons name="contacts" size={48} color={colors.textSecondary} />
          </View>
          <Text style={[styles.permissionTitle, { color: colors.text }]}>
            <FormattedMessage
              id="trustedNumbers.modal.permissionDenied.title"
              defaultMessage="Permisos de contactos requeridos"
            />
          </Text>
          <Text style={[styles.permissionDescription, { color: colors.textSecondary }]}>
            <FormattedMessage
              id="trustedNumbers.modal.permissionDenied.description"
              defaultMessage="Para importar contactos, necesitamos acceso a tu lista de contactos"
            />
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={importContacts} activeOpacity={0.8}>
            <LinearGradient colors={[colors.primary, colors.primary + "DD"]} style={styles.retryButtonGradient}>
              <MaterialIcons name="refresh" size={20} color="white" />
              <Text style={styles.retryButtonText}>
                <FormattedMessage id="trustedNumbers.modal.retry" defaultMessage="Intentar de nuevo" />
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }

    if (contacts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="contact-phone" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            <FormattedMessage id="trustedNumbers.modal.noContacts" defaultMessage="No se encontraron contactos" />
          </Text>
        </View>
      )
    }

    const displayContacts = valueSearch ? contactsFilter : contacts

    return (
      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <InputField
            placeholder={intl.formatMessage({
              id: "trustedNumbers.modal.searchPlaceholder",
              defaultMessage: "Buscar por nombre o teléfono...",
            })}
            value={valueSearch}
            onChangeText={setValueSearch}
            InputLeftElement={<Icon as={Ionicons} name="search" size={5} ml="2" color={colors.textSecondary} />}
            style={styles.searchInput}
          />
        </View>

        {contactsSelected.size > 0 && (
          <View style={[styles.selectionSummary, { backgroundColor: colors.primary + "15" }]}>
            <MaterialIcons name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.selectionText, { color: colors.primary }]}>
              <FormattedMessage
                id="trustedNumbers.modal.selectedCount"
                defaultMessage="{count} contactos seleccionados"
                values={{ count: contactsSelected.size }}
              />
            </Text>
          </View>
        )}

        <FlatList
          data={displayContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          contentContainerStyle={styles.listContainer}
          windowSize={5}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptySearchContainer}>
              <MaterialIcons name="search-off" size={32} color={colors.textSecondary} />
              <Text style={[styles.emptySearchText, { color: colors.textSecondary }]}>
                <FormattedMessage
                  id="trustedNumbers.modal.noSearchResults"
                  defaultMessage="No se encontraron contactos con ese criterio"
                />
              </Text>
            </View>
          )}
        />
      </View>
    )
  }

  return (
    <GenericModal
      visible={isOpen}
      onClose={onClose}
      title={intl.formatMessage({
        id: "trustedNumbers.modal.title",
        defaultMessage: "Importar contactos",
      })}
      subtitle={intl.formatMessage({
        id: "trustedNumbers.modal.subtitle",
        defaultMessage: "Selecciona los contactos de confianza",
      })}
      actions={modalActions}
      scrollable={false}
    >
      {renderContent()}
    </GenericModal>
  )
}

export default ModalSelectContact
