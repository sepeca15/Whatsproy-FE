import * as React from "react";
import { Link, usePathname, useRouter } from "expo-router";
import { View } from "native-base";
import { Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import SimpleIcon from "react-native-vector-icons/SimpleLineIcons";
import { Colors } from "@/constants/Colors";
import AntDesign from "react-native-vector-icons/AntDesign"
import { useUser } from "@/hooks/redux/useUser";
import { TipoServicio } from "@/enums/TipoServicio";

const Pages = (empresaType: number) => {
    
    return [
        {
            name: 'home',
            path: '/(tabs)/home',
            icon: (select: boolean) => <Icon name="home" size={24} color={select ? Colors.light.primary : "#717171"} />
        },
        {
            name: 'pedidos',
            path: empresaType === TipoServicio.DELIVERY ? '/(tabs)/pedidos' : '/(tabs)/calendar',
            icon: (select: boolean) => empresaType === TipoServicio.DELIVERY ? <SimpleIcon name="notebook" size={24} color={select ? Colors.light.primary : "#717171"} /> : <AntDesign name="calendar" size={24} color={select ? Colors.light.primary : "#717171"} />
        },
        {
            name: 'productos',
            path: '/(tabs)/productos',
            icon: (select: boolean) => <IonIcon name="fast-food" size={24} color={select ? Colors.light.primary : "#717171"} />
        },
        {
            name: 'perfil',
            path: '/(tabs)/perfil',
            icon: (select: boolean) => <Icon name="user" size={24} color={select ? Colors.light.primary : "#717171"} />
        },
    ] as const;
}

const Layout = ({ children }: any) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useUser()
    const [selected, setSelected] = React.useState<string>("");
    const pages = Pages(user.tipo_servicio);

    React.useEffect(() => {
        const existRouter = pages.find((path) => pathname.split('/')[1] === path.name);
        if (existRouter) {
            setSelected(existRouter.name);
        }
    }, [pathname]);

    return (
        <View style={styles.mainContainer}>
            {children}
            <View style={styles.navigationMenu}>
                {pages.map((page) => (
                    <Pressable
                        key={page.name}
                        style={styles.LinkContainer}
                        onPress={() => {
                            setSelected(page.name);
                            router.push(page.path)
                        }}
                    >
                        {page.icon(page.name === selected)}
                        {page.name === selected && <View style={styles.roundedDivBottom} />}
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    navigationMenu: {
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        height: 60,
        alignItems: "center",
        justifyContent: "space-between",
    },
    LinkContainer: {
        height:60,
        width: "25%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    roundedDivBottom: {
        position: "absolute",
        width: "60%",
        height: 8,
        backgroundColor: Colors.light.primary,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        bottom: 0,
    },
    link: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default Layout;

