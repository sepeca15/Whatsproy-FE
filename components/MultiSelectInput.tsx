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

interface itemAdd {
  name: string,
  type: string
}

interface MultiSelectInputProps {
  placeholder?: string;
  label?: string;
  options: { label: any; value: any; placeholder?: string }[];
  setItemsSelected: any;
  isRequired?: boolean;
  isMultiple?: boolean;
  onSearch?: (qry: string) => void;
  loading?: boolean;
  error?: any;
  initialStateAdd?: itemAdd[],
  actionToAddItem?: (data: any) => void
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
  onSearch,
  initialStateAdd,
  actionToAddItem
}) => {
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedItemsKeys, setSelectedItemsKeys] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);
  const { showToast } = useToastContext()
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (onSearch) {
      clearTimeout(timeoutSearch);
      timeoutSearch = setTimeout(() => {
        onSearch(query);
      }, 1000);
    }
  }, [query]);

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

  const toggleSelection = (value: string) => {
    if (!isMultiple) {
      setSelectedItems([value]);
      return;
    }
    setSelectedItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSelectionKeys = (value: string) => {
    if (!isMultiple) {
      setItemsSelected([value]);
      setSelectedItemsKeys([value]);
      return;
    }
    setItemsSelected((prev: any) =>
      prev.includes(value)
        ? prev.filter((item: any) => item !== value)
        : [...prev, value]
    );
    setSelectedItemsKeys((prev: any) =>
      prev.includes(value)
        ? prev.filter((item: any) => item !== value)
        : [...prev, value]
    );
  };

  const areAllFieldsFilled = () => {
    return initialStateAdd?.every((item) => formValues[item.name]?.trim()) ?? false;
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
      <FormControl isInvalid={error} isRequired={isRequired}>
        <FormControl.Label>{label}</FormControl.Label>
        <Pressable onPress={() => setIsModalOpen(true)}>
          <Input
            isReadOnly
            value={selectedItemsKeys?.map((itm) => {
              const option = options?.find((item) => item?.value === itm);
              return option?.placeholder ?? "";
            }).join(", ")}
            placeholder={placeholder}
            borderColor="coolGray.300"
            backgroundColor="coolGray.50"
          />
        </Pressable>
        {error && <FormControl.ErrorMessage>
          {error}
        </FormControl.ErrorMessage>}
      </FormControl>

      {selectedItems?.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space={2}>
            {selectedItemsKeys.map((item) => {
              const itm = options?.find((itm) => itm?.value === item);
              return (
                <Badge
                  key={item}
                  colorScheme="teal"
                  color={"white"}
                  variant="solid"
                  rounded="full"
                  px={3}
                  py={1}
                  height={'auto'}
                  size={'12'}
                  alignSelf="center"
                >
                  <Text color="white" fontWeight="semibold">
                    {typeof itm?.label !== "string" ? itm?.placeholder : itm?.placeholder}
                  </Text>
                </Badge>
              )
            })}
          </HStack>
        </ScrollView>
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
          </Button>
        ]}
        content={
          <VStack marginBottom={5} space={2}>
            {onSearch && (
              <View marginBottom={4}>
                <InputField
                  isRequired={false}
                  value={query}
                  onChangeText={(text) => setQuery(text)}
                  placeholder={`Buscar ${label}`}
                />
              </View>
            )}
            <View maxHeight={400}>
              {!loading ? <ScrollView
                flexDirection={"column"}
                display={"flex"}
                horizontal={false}
                contentContainerStyle={{ flexGrow: 1, gap: 8 }}
              >
                {options.map((option) => (
                  <Checkbox
                    key={option.value}
                    value={option.value}
                    alignItems={'center'}
                    isChecked={selectedItemsKeys.includes(option.value)}
                    onChange={() => {
                      toggleSelection(option.label);
                      toggleSelectionKeys(option.value);
                    }}
                  >
                    {option.label}
                  </Checkbox>
                ))}
              </ScrollView> : <Spinner size={'lg'} />}
            </View>
            <Pressable onPress={() => setIsModalOpenAdd(true)} alignSelf={'center'} display={'flex'} flexDir={'row'} alignItems={'center'}>
              <Ionicons name="add-circle" size={24} color={Colors.light.primary} />
              <Text marginLeft={2} textAlign={'center'}>Agregar {label}</Text>
            </Pressable>
            {
              isModalOpenAdd &&
              <GlobalModal
                key={'addAction'}
                isVisible={isModalOpenAdd}
                label={"Agregar " + label}
                content={
                  <View padding={'10px 20px'} width={'full'} display={'flex'} flexDir={'column'} alignItems={'center'}>
                    {
                      initialStateAdd &&
                      initialStateAdd.map((item, index) => {
                        return <View width={'full'} marginBottom={5}>
                          <InputField
                            label={`Ingresar ${item.name}`}
                            key={index}
                            keyboardType={item.type}
                            isRequired={true}
                            value={formValues[item.name] || ""}
                            placeholder={`Ingresar ${item.name}`}
                            onChangeText={(value) => handleFieldChange(item.name, value)}
                          />
                          
                        </View>
                      })
                    }
                  </View>
                }
                actions={[
                  <Button
                    width={150}
                    isLoading={false}
                    onPress={DispatchActionAdd}
                    size="sm"
                    key="aceptar"
                    backgroundColor={"#2C2C2C"}
                    borderRadius={"6"}
                    fontWeight={700}
                  >
                      {
                        loadingApi? 
                        <Spinner color={'white'} size={20} />
                        :
                        <Text fontWeight={500} color={"white"}>
                        Crear {label}
                        </Text>
                      }
                  </Button>
                ]}
                onClose={() => setIsModalOpenAdd(false)}
              />
            }
          </VStack>
        }
      />
    </VStack>
  );
};

export default MultiSelectInput;
