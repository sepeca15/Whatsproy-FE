import RoundedInputField from "@/components/RoundedInputField";
import api from "@/services/api/admin";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Pressable, Select, Text, View } from "native-base";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Progress from "react-native-progress";
import CardNewPedido from "../CardNewPedido.tsx";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "@/hooks/redux/useUser";
import * as moment from "moment-timezone";

const FilterSearch = () => {
  const { user } = useUser();
  const dateLocal = moment.tz(user.timeZone);

  const intl = useIntl();
  const [results, setResults] = React.useState<any[]>([]);
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const [infoLinesJson, setInfoLinesJson] = React.useState<any[]>([]);
  const [selectedInfoLine, setSelectedInfoLine] = React.useState<any>(null);
  const [showPicker, setShowPicker] = React.useState(false);

  const togglePicker = () => setShowPicker((prev) => !prev);

  const [valueSearch, setValueSearch] = React.useState<string>("");

  const handleLoadInfoLines = async () => {
    try {
      const resp = await api.dataOrder.getAll();
      if (resp) {
        setInfoLinesJson(resp);
        setSelectedInfoLine(resp[0]);
      }
    } catch (error: any) {
      console.log("eror", error.response.data.message);
    } finally {
      setLoadingApi(false);
    }
  };

  const handleSearchData = async () => {
    try {
      const resp = await api.order.filterByQuery(
        valueSearch,
        selectedInfoLine.nombre
      );

      if (resp.ok) {
        setResults(resp.data);
      }
    } catch (error: any) {
      console.log("eror", error.response.data.message);
    } finally {
      setLoadingApi(false);
    }
  };

  React.useEffect(() => {
    setLoadingApi(true);
    const timeout = setTimeout(() => {
      if (valueSearch.trim()) handleSearchData();
    }, 500);
    return () => clearTimeout(timeout);
  }, [valueSearch]);

  React.useEffect(() => {
    handleLoadInfoLines();
  }, []);

  React.useEffect(() => {
    if (!!selectedInfoLine) {
      setResults([]);
      setValueSearch("");
    }
  }, [selectedInfoLine]);

  return (
    <View
      style={{ paddingHorizontal: 12, paddingVertical: 6, gap: 20 }}
      flex={1}
      display={"flex"}
      flexDir={"column"}
    >
      <View
        w={"full"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        style={{ gap: 8 }}
      >
        <Select
          dropdownIcon={
            <AntDesign
              name="filter"
              style={{ marginRight: 16 }}
              size={20}
              color={"gray"}
            />
          }
          px={4}
          py={3}
          mt={2}
          shadow={8}
          borderWidth={0}
          rounded="full"
          w="full"
          bg="white"
          placeholder="Choose option"
          onValueChange={(value) => setSelectedInfoLine(JSON.parse(value))}
          selectedValue={JSON.stringify(selectedInfoLine)}
          _selectedItem={{
            color: "white",
            bg: "teal.500",
            endIcon: (
              <View
                flex={1}
                display={"flex"}
                flexDir={"row"}
                alignItems={"center"}
                justifyContent={"flex-end"}
              >
                <View p={2} bg={"white"} rounded={"full"} color={"teal.500"}>
                  <AntDesign color={"teal"} name="check" size={12} />
                </View>
              </View>
            ),
          }}
        >
          {infoLinesJson.map((info) => (
            <Select.Item
              rounded="md"
              key={info.id}
              label={info.nombre}
              value={JSON.stringify(info)}
            />
          ))}
        </Select>
        {selectedInfoLine?.tipo === "string" ? (
          <RoundedInputField
            bg="white"
            onChangeText={(text) => setValueSearch(text)}
            icon={<AntDesign size={16} name="search1" />}
            marginTop={8}
            placeholder={intl.formatMessage({
              id: `enterAdressSearch`,
            })}
            type={"text"}
          />
        ) : selectedInfoLine?.tipo === "number" ? (
          <RoundedInputField
            bg="white"
            onChangeText={(text) => setValueSearch(text)}
            icon={<AntDesign size={16} name="search1" />}
            marginTop={8}
            placeholder={intl.formatMessage({
              id: `enterAdressSearch`,
            })}
            keyboardType={"numeric"}
            type={"text"}
          />
        ) : selectedInfoLine?.tipo === "date" ? (
          <Pressable
            mt={2}
            onPress={togglePicker}
            w={"full"}
            display={"flex"}
            style={{ gap: 8 }}
            flexDirection={"row"}
            alignItems={"center"}
            px={4}
            py={3}
            rounded={"full"}
            bg={"white"}
          >
            <Ionicons name="time-outline" size={18} />
            <Text fontSize={14} color={"gray.400"}>
              {valueSearch !== "" ? (
                valueSearch
              ) : (
                <FormattedMessage id="selectTimeFilters" />
              )}
            </Text>
            {showPicker && (
              <DateTimePicker
                style={{ marginLeft: -5 }}
                mode="date"
                value={
                  valueSearch !== ""
                    ? moment.tz(valueSearch, user.timeZone).toDate()
                    : dateLocal.toDate()
                }
                textColor="black"
                display="default"
                onChange={(_, selectedDate) => {
                  togglePicker();
                  if (selectedDate) {
                    const onlyDate = moment
                      .tz(selectedDate, "America/Montevideo")
                      .format("YYYY-MM-DD");
                    setValueSearch(onlyDate);
                  }
                }}
              />
            )}
          </Pressable>
        ) : selectedInfoLine?.tipo === "boolean" ? (
          <Select
            mt={2}
            px={4}
            py={2}
            rounded="full"
            w="full"
            bg="white"
            placeholder="Choose option"
            onValueChange={(value) => setValueSearch(value)}
            selectedValue={JSON.stringify(selectedInfoLine)}
            _selectedItem={{
              bg: "teal.400",
              endIcon: <AntDesign name="check" color="white" size={8} />,
            }}
          >
            <Select.Item
              rounded="md"
              label={intl.formatMessage({
                id: `selectYesFiltersOrder`,
              })}
              value={"true"}
            />
            <Select.Item
              rounded="md"
              label={intl.formatMessage({
                id: `selectNoFiltersOrder`,
              })}
              value={"false"}
            />
          </Select>
        ) : (
          <></>
        )}
      </View>
      <View flex={1} w={"full"}>
        {!valueSearch ? (
          <View
            flex={1}
            flexDir={"column"}
            style={{ gap: 10 }}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Image
              source={require("../../../../../assets/images/searchValue.png")}
              style={{ width: 350, height: 250, objectFit: "contain" }}
              alt="search icon"
            />
            <Text fontSize={20} fontWeight={"medium"}>
              {<FormattedMessage id="searchOrder" />}
            </Text>
          </View>
        ) : (
          <View flex={1}>
            {loadingApi ? (
              <View
                flex={1}
                flexDir={"row"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Progress.Circle
                  color={"#075e54"}
                  indeterminate={true}
                  size={100}
                />
              </View>
            ) : results.length > 0 ? (
              <View display={"flex"} flexDir={"row"} alignItems={"center"}>
                <FlatList
                  data={results}
                  renderItem={({ item }: { item: any }) => (
                    <CardNewPedido
                      key={item.orderId}
                      orderData={item}
                      pending={!item?.finalizador && !item?.finalizador && item?.available}
                    />
                  )}
                  keyExtractor={(item) => item.orderId.toString()}
                  onEndReachedThreshold={0.2}
                  contentContainerStyle={{ paddingBottom: 100 }}
                />
              </View>
            ) : (
              <View
                flex={1}
                flexDir={"column"}
                style={{ gap: 10 }}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  source={require("../../../../../assets/images/no-records.png")}
                  style={{ width: 350, height: 250, objectFit: "contain" }}
                  alt="no results "
                />
                <Text fontSize={20} fontWeight={"medium"}>
                  {<FormattedMessage id="noResultsFound" />}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default FilterSearch;
