import GlobalModal from "@/components/Modal";
import { Button, FlatList, Text, View, Checkbox, Pressable, Icon } from "native-base";
import * as Contacts from "expo-contacts";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";

interface IModalSelectContact {
    onClose: () => void;
    isOpen: boolean;
    onImportContacts: (contacts: { id: number; nombre: string; numero: string }[]) => void;
    loadingApi: boolean,
    trustedPhones: string[]
}

const normalize = (num: string) => num.replace(/\D/g, '').replace(/^0+/, '');

const ModalSelectContact = ({ isOpen, onClose, onImportContacts, loadingApi, trustedPhones }: IModalSelectContact) => {
    const [contacts, setContacts] = React.useState<any[]>([]);
    const [contactsFilter, setContactsFilter] = React.useState<any[]>([]);

    const [valueSearch, setValueSearch] = React.useState<string>('');

    const [contactsSelected, setContactsSelected] = React.useState<Set<string>>(new Set());

    const importContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();

        try {
            if (status === "granted") {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });

                if (data.length > 0) {
                    setContacts(data);
                    const matchedContacts = data.filter(c =>
                        c.phoneNumbers?.some(p =>
                            trustedPhones.includes((p.number ?? "").replace(/\D/g, '').replace(/^0+/, ''))
                        )
                    );

                    const matchedIds = new Set<string>(
                        matchedContacts.map(c => String(c.id)).filter(Boolean)
                    );
                    setContactsSelected(matchedIds); setContactsSelected(matchedIds);
                }
            }

        } catch (error) {
            console.log(error);

        }
    };

    React.useEffect(() => {
        importContacts();
    }, []);

    const toggleContact = (contact: any) => {
        const contactId = String(contact.id);
        setContactsSelected((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(contactId)) {
                newSelected.delete(contactId);
            } else {
                newSelected.add(contactId);
            }
            return newSelected;
        });
    };

    const renderItem = ({ item }: { item: any }) => {
        const name = item.name ?? (`${item.firstName} ${item.lastName ?? ""}` || "No name");
        const hasNumber = item.phoneNumbers && item.phoneNumbers.length > 0;
        if (!hasNumber) return null;

        const isSelected = contactsSelected.has(String(item.id));

        return (
            <Pressable py={4} borderBottomColor={'gray.200'} borderBottomWidth={1} style={{ gap: 12 }} onPress={() => toggleContact(item)} key={item.id} display={"flex"} flexDirection="row" alignItems="center">
                <Checkbox
                    value={item.id.toString()}
                    isChecked={isSelected}
                    aria-label={`Select contact ${item.name}`}
                />
                <View w={10} h={10} rounded={'full'} bg={'teal.500'}></View>
                <View flex={1} display={'flex'} flexDir={'column'} alignItems={'flex-start'} style={{ gap: 4 }}>
                    <Text fontWeight={'bold'}>{name}</Text>
                    <Text color={'gray.400'}>{item.phoneNumbers[0].number}</Text>
                </View>
            </Pressable>
        );
    };

    React.useEffect(() => {
        const updateValue = setTimeout(() => {
            handleFilterValue(valueSearch)
        }, 500);

        return () => clearTimeout(updateValue)

    }, [valueSearch])

    const handleFilterValue = (value: string) => {
        setContactsFilter(contacts.filter((prv) => prv.name.includes(value)))
    }


    return (
        <GlobalModal
            manyItems={true}
            isVisible={isOpen}
            onClose={onClose}
            content={
                <View>
                    <InputField
                        placeholder="Buscar por nombre..."
                        value={valueSearch}
                        onChangeText={setValueSearch}
                        InputLeftElement={<Icon as={Ionicons} name="search" size={5} ml="2" color={Colors.light.secondary} />}
                    />
                    <FlatList
                        data={valueSearch? contactsFilter : contacts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        windowSize={5}
                    />
                </View>
            }
            actions={[
                <Button
                    onPress={onClose}
                    key="Cancel"
                    size="md"
                    background={"gray.50"}
                    borderWidth={1}
                    borderColor={"gray.500"}
                    borderRadius="md"
                    marginRight={4}
                >
                    <Text color={"gray.500"}>Cancelar</Text>
                </Button>,
                <Button
                    key="Accept"
                    size="md"
                    backgroundColor={"#2C2C2C"}
                    borderRadius="md"
                    isLoading={loadingApi}
                    onPress={() => {
                        const selectedContacts = contacts.filter((contact) =>
                            contactsSelected.has(contact.id)
                        ).map((contact: any) => ({
                            id: contact.id,
                            nombre: contact.name ?? contact.firstName,
                            numero: normalize(contact.phoneNumbers[0]?.number || ""),
                        }));

                        console.log('son', selectedContacts.length);

                        onImportContacts(selectedContacts);
                        setContactsSelected(new Set());
                        onClose();
                    }}
                >
                    <Text color={"white"}>Importar</Text>
                </Button>,
            ]}
            label="Import contacts"
        />
    );
};

export default ModalSelectContact;
