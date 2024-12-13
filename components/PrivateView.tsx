import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";

export const PrivateView = ({ children }: any) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/(auth)/login");
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <View style={styles.spinner}>
                <Progress.Circle color={Colors.light.primary} indeterminate={true} size={100} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return null;
    }
    return <View style={{ flex: 1 }}>{children}</View>;
};


const styles = StyleSheet.create({
    spinner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
