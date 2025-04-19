import React, { useEffect, useState } from "react";
import {
  VStack,
  FormControl,
  Input,
  Pressable,
  ScrollView,
  HStack,
  Badge,
  Text,
  Checkbox,
  View,
  Spinner,
  Button,
} from "native-base";
import GlobalModal from "./Modal";
import InputField from "./InputField";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";
import { TouchableOpacity } from "react-native";
import TapSensitiveInput from "./TapSensitiveInput/TapSensitiveInput";

interface itemAdd {
  name: string;
  type: string;
}

interface MultiSelectInputProps {
  placeholder?: string;
  label?: string;
  options: { label: any; value: any; placeholder?: string; subText?: string }[];
  setItemsSelected: any;
  handleProductSelection?: any;
  isRequired?: boolean;
  isMultiple?: boolean;
  onSearch?: (qry: string) => void;
  loading?: boolean;
  error?: any;
  initialStateAdd?: itemAdd[];
  actionToAddItem?: (data: any) => void;
  height?: number;
  sizeText?: number;
  itemsSelected?: any[];
  withAdd?: boolean;
}

let timeoutSearch: any = 0;

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  placeholder = "Seleccionar opciones",
  label = "Seleccionar",
  options,
  isRequired = false,
  loading,
  isMultiple = true,
  error,
  setItemsSelected,
  handleProductSelection,
  onSearch,
  initialStateAdd,
  actionToAddItem,
  height,
  sizeText,
  withAdd = true,
  itemsSelected,
}) => {
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemsKeys, setSelectedItemsKeys] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);
  const { showToast } = useToastContext();
  const [formValues, setFormValues] = React.useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (itemsSelected && Array.isArray(itemsSelected)) {
      setSelectedItemsKeys(itemsSelected);
    }
  }, [itemsSelected]);

  useEffect(() => {
    if (onSearch) {
      clearTimeout(timeoutSearch);
      timeoutSearch = setTimeout(() => {
        onSearch(query);
      }, 1000);
    }
  }, [query]);

  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    }
  }, []);

  useEffect(() => {
    if (initialStateAdd) {
      const initialValues = initialStateAdd.reduce(
        (acc, item) => ({ ...acc, [item.name]: "" }),
        {}
      );
      setFormValues(initialValues);
    }
  }, [initialStateAdd]);

  const handleFieldChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSelectionKeys = (value: string) => {
    console.log("xd");
    const stringValue = value.toString();
    let updatedSelected: string[];

    if (!isMultiple) {
      updatedSelected = [stringValue];
      setSelectedItemsKeys(updatedSelected);
      setItemsSelected(updatedSelected);
      return;
    }

    let newKeysSelected: string[] = [];
    setSelectedItemsKeys((prevValue) => {
      let oldItems = [];
      if (prevValue?.includes(stringValue)) {
        oldItems = prevValue?.filter((itm) => itm != stringValue);
      } else {
        oldItems = [...prevValue, stringValue];
      }
      newKeysSelected = oldItems;
      return oldItems;
    });

    setItemsSelected(newKeysSelected);
  };

  console.log("selectedItemsKeys", selectedItemsKeys);

  const areAllFieldsFilled = () => {
    return (
      initialStateAdd?.every((item) => formValues[item.name]?.trim()) ?? false
    );
  };

  const DispatchActionAdd = async () => {
    if (actionToAddItem && areAllFieldsFilled()) {
      setLoadingApi(true);
      await actionToAddItem(formValues);
      setIsModalOpenAdd(false);
      setLoadingApi(false);
    } else {
      showToast({
        title: "Error!",
        description: "Debe de lleanr todos los campos",
        status: "error",
      });
    }
  };

  return (
    <VStack space={4}>
      <TapSensitiveInput
       label={label}
       error={error}
       isRequired={isRequired}
       height={height}
       sizeText={sizeText}
       placeholder={placeholder}
       setIsModalOpen={setIsModalOpen}
       value={selectedItemsKeys
        ?.map((itm) => {
          const option = options?.find((item) => item?.value === itm);
          return option?.placeholder ?? "";
        })
        .join(", ")}
      />

      {selectedItemsKeys?.length > 0 && (
        <View
          width={"100%"}
          display={"flex"}
          flexDir={"row"}
          style={{ gap: 4 }}
          flexWrap={"wrap"}
        >
          {selectedItemsKeys.map((item, index) => {
            const itm = options?.find((itm) => `${itm?.value}` === item);
            return (
              <Badge
                key={index}
                colorScheme="teal"
                color={"white"}
                variant="solid"
                rounded="full"
                px={3}
                py={1}
                height={"auto"}
                size={"12"}
                alignSelf="center"
              >
                <Text color="white" fontWeight="semibold">
                  {typeof itm?.label !== "string"
                    ? itm?.placeholder
                    : itm?.placeholder}
                  {typeof itm?.subText === "string" ? itm?.subText : ""}
                </Text>
              </Badge>
            );
          })}
        </View>
      )}

      <GlobalModal
        isVisible={isModalOpen}
        label={label}
        onClose={() => setIsModalOpen(false)}
        actions={[
          <Button
            isLoading={false}
            onPress={() => setIsModalOpen(false)}
            size="sm"
            key="aceptar"
            backgroundColor={"#2C2C2C"}
            borderRadius={"6"}
            fontWeight={700}
          >
            <Text fontWeight={500} color={"white"}>
              Aceptar
            </Text>
          </Button>,
        ]}
        content={
          <View
            style={{
              flex: 1,
              display: "flex",
              marginBottom: 5,
            }}
          >
            {onSearch && (
              <InputField
                isRequired={false}
                value={query}
                onChangeText={setQuery}
                placeholder={`Buscar ${label}`}
              />
            )}

            <View>
              {!loading ? (
                options.map((option, index) => (
                  <View
                    key={option.value + index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 10,
                      gap: 10,
                      width: "100%",
                    }}
                  >
                    <Checkbox
                      value={option.value}
                      isChecked={selectedItemsKeys.includes(
                        option.value.toString()
                      )}
                      onChange={(isSelected) => {
                        handleProductSelection?.(option.value, isSelected);
                        toggleSelectionKeys(option.value);
                      }}
                    />
                    <Text style={{ flex: 1 }}>{option.label}</Text>
                  </View>
                ))
              ) : (
                <Spinner size="lg" />
              )}
            </View>

            {withAdd && <Pressable
              onPress={() => setIsModalOpenAdd(true)}
              alignSelf="center"
              flexDirection="row"
              alignItems="center"
            >
              <Ionicons
                name="add-circle"
                size={24}
                color={Colors.light.primary}
              />
              <Text ml={2}>Agregar {label}</Text>
            </Pressable>
}
            {isModalOpenAdd && withAdd && (
              <GlobalModal
                key="addAction"
                isVisible={isModalOpenAdd}
                label={`Agregar ${label}`}
                content={
                  <View padding="10px 20px" width="100%" alignItems="center">
                    {initialStateAdd?.map((item, index) => (
                      <View key={index} width="100%" mb={5}>
                        <InputField
                          label={`Ingresar ${item.name}`}
                          keyboardType={item.type}
                          isRequired
                          value={formValues[item.name] || ""}
                          placeholder={`Ingresar ${item.name}`}
                          onChangeText={(value) =>
                            handleFieldChange(item.name, value)
                          }
                        />
                      </View>
                    ))}
                  </View>
                }
                actions={[
                  <Button
                    width={150}
                    isLoading={false}
                    onPress={DispatchActionAdd}
                    size="sm"
                    key="accept"
                    backgroundColor="#2C2C2C"
                    borderRadius={6}
                    fontWeight={700}
                  >
                    {loadingApi ? (
                      <Spinner
                        style={{ marginTop: 10, marginBottom: 10 }}
                        color="white"
                        size={20}
                      />
                    ) : (
                      <Text fontWeight={500} color="white">
                        Crear {label}
                      </Text>
                    )}
                  </Button>,
                ]}
                onClose={() => setIsModalOpenAdd(false)}
              />
            )}
          </View>
        }
      />
    </VStack>
  );
};

export default MultiSelectInput;
