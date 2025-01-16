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
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedItemsKeys, setSelectedItemsKeys] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (onSearch) {
      clearTimeout(timeoutSearch);
      timeoutSearch = setTimeout(() => {
        onSearch(query);
      }, 1000);
    }
  }, [query]);

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

  return (
    <VStack space={4}>
      <FormControl  isInvalid={error} isRequired={isRequired}>
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
                  { typeof itm?.label !== "string" ? itm?.placeholder : itm?.placeholder}
                </Text>
              </Badge>
            )})}
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
          <VStack marginBottom={10} space={2}>
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
          </VStack>
        }
      />
    </VStack>
  );
};

export default MultiSelectInput;
