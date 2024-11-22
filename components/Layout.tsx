import * as React from "react";
import { Link, usePathname } from "expo-router";
import { View } from "native-base";
import { Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import SimpleIcon from "react-native-vector-icons/SimpleLineIcons";
import { Colors } from "@/constants/Colors";

const Pages = [
    { 
        name: 'home',
        path: '/(tabs)/home',
        icon: (select: boolean) => <Icon name="home" size={24} color={select ? Colors.light.primary : "#717171"} />
    },
    {
        name: 'pedidos',
        path: '/(tabs)/pedidos',
        icon: (select: boolean) => <SimpleIcon name="notebook" size={24} color={select ? Colors.light.primary : "#717171"} />
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

const Layout = ({ children }: any) => {
    const pathname = usePathname();
    const [selected, setSelected] = React.useState<string>("");

    React.useEffect(() => {
        const existRouter = Pages.find((path) => pathname.split('/')[1] === path.name);
        if (existRouter) {
            setSelected(existRouter.name);
        }
    }, [pathname]);

    return (
        <View style={styles.mainContainer}>
            {children}
            <View style={styles.navigationMenu}>
                {Pages.map((page) => (
                    <Pressable 
                        key={page.name} 
                        style={styles.LinkContainer}
                        onPress={() => setSelected(page.name)}  // Al hacer clic, marca como seleccionado
                    >
                        <Link style={styles.link} href={page.path}>
                            {page.icon(page.name === selected)}
                        </Link>
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
        paddingTop:15,
        alignItems: "center",
        justifyContent: "space-between",
    },
    LinkContainer: {
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
        height: 20,
        backgroundColor: Colors.light.primary,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        bottom: -12,
    },
    link: {
        flex:1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default Layout;
