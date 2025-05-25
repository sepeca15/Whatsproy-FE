import RoundedInputField from "@/components/RoundedInputField";
import api from "@/services/api/admin";
import { AntDesign } from "@expo/vector-icons";
import { Image, InfoOutlineIcon, Select, Spinner, View } from "native-base"
import * as React from "react";
import { useIntl } from "react-intl";
import * as Progress from "react-native-progress";

const FilterSearch = () => {
    const intl = useIntl()
    const [results, setResults] = React.useState<any[]>([]);
    const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
    const [infoLinesJson, setInfoLinesJson] = React.useState<any[]>([]);
    const [selectedInfoLine, setSelectedInfoLine] = React.useState<string>('');

    const [valueSearch, setValueSearch] = React.useState<string>("");

    const handleLoadInfoLines = async () => {
        try {

            const resp = await api.dataOrder.getAll()
            console.log('respondio', resp);

            if (resp) {
                setInfoLinesJson(resp)
                setSelectedInfoLine(resp[0].nombre)
            }

        } catch (error: any) {
            console.log('eror', error.response.data.message);
        } finally {
            setLoadingApi(false)
        }
    }

    const handleSearchData = async () => {
        try {

            const resp = await api.order.filterByQuery(valueSearch,selectedInfoLine)

            if (resp.ok && resp.data.length > 0) {
                setResults(resp.data)
            }

        } catch (error: any) {
            console.log('eror', error.response.data.message);
        } finally {
            setLoadingApi(false)
        }
    }

    React.useEffect(() => {
        setLoadingApi(true)
        const timeout = setTimeout(() => {
            if (valueSearch.trim()) handleSearchData();
        }, 500);
        return () => clearTimeout(timeout);
    }, [valueSearch]);

    React.useEffect(() => {
        handleLoadInfoLines()
    }, [])

    return (
        <View style={{ paddingHorizontal: 12, paddingVertical: 6, gap: 20 }} flex={1} display={'flex'} flexDir={'column'} >
            <View w={'full'} display={'flex'} flexDir={'column'} alignItems={'center'} style={{ gap: 8 }}>
                <Select px={4} py={2} rounded={'full'} w={'full'} bg={'white'} placeholder="Choose option" onValueChange={(value) => setSelectedInfoLine(value)} selectedValue={selectedInfoLine} _selectedItem={{
                    bg: "teal.400",
                    endIcon: <AntDesign name="check" color={'white'} size={8} />
                }}>
                    {
                        infoLinesJson.length > 0 &&
                        infoLinesJson.map((info) => {
                            return <Select.Item rounded={'md'} key={info.id} label={info.nombre} value={info.nombre} />
                        })
                    }
                </Select>
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
            </View>
            <View flex={1} w={'full'}>
                {
                    !valueSearch ?
                        <View flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'}>
                            <Image
                                source={require("../../../../../assets/images/searchValue.png")}
                                style={{ width: 350, height: 250, objectFit: "contain" }}
                                alt="search icon"
                            />
                        </View>
                        :
                        <View flex={1}>
                            {
                                loadingApi ?
                                    <View flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'}>
                                        <Progress.Circle color={"#075e54"} indeterminate={true} size={100} />
                                    </View>
                                    :
                                    results.length > 0 ?

                                        <View display={'flex'} flexDir={'row'} alignItems={'center'}>

                                        </View>
                                        :
                                        <View flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'}>
                                            <Image
                                                source={require("../../../../../assets/images/no-records.png")}
                                                style={{ width: 350, height: 250, objectFit: "contain" }}
                                                alt="no results "

                                            />
                                        </View>
                            }

                        </View>
                }
            </View>
        </View>
    )
}

export default FilterSearch