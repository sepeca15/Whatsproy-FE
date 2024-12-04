import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { months, ordersData } from './data';
import { pedidosMensualesStyles as styles } from './StylesMensual';

const maxValue = Math.max(...ordersData);
const screenWidth = Dimensions.get('window').width;

const PedidosMensuales: React.FC = () => {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [showScale, setShowScale] = useState(false);
    const barAnimations = ordersData.map(() => new Animated.Value(0));
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.parallel([
            Animated.stagger(100, barAnimations.map(anim => 
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.elastic(1),
                    useNativeDriver: false
                })
            )),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false
            })
        ]).start();
    }, []);

    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: showScale ? 1 : 0,
            duration: 300,
            useNativeDriver: false
        }).start();
    }, [showScale]);

    const handleMouseEnter = (index: number) => {
        setHoveredBar(index);
    };

    const handleMouseLeave = () => {
        setHoveredBar(null);
    };

    const getBarColor = (index: number) => {
        const colors = ['#FFD700', '#90EE90', '#FFB6C1'];
        return colors[index % colors.length];
    };

    const toggleScale = () => {
        setShowScale(!showScale);
    };

    const renderScale = () => {
        const steps = 5;
        const stepValue = maxValue / steps;
        return (
            <Animated.View style={[styles.scale, { opacity: scaleAnim, height: 200 }]}>
                {Array.from({ length: steps + 1 }).map((_, index) => (
                    <View key={index} style={styles.scaleStep}>
                        <Text style={styles.scaleText}>
                            {Math.round(stepValue * (steps - index))}
                        </Text>
                    </View>
                ))}
            </Animated.View>
        );
    };

    return (
        <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
            <View style={styles.titleContainer}>
                <Text style={styles.chartTitle}>Pedidos mensuales</Text>
                <Pressable onPress={toggleScale}>
                    <Feather name="bar-chart-2" size={24} color="#333" />
                </Pressable>
            </View>
            <View style={[styles.chartBackground, { flexDirection: 'row' }]}>
                {showScale && renderScale()}
                <View style={[styles.chart, { flex: 1 }]}>
                    {ordersData.map((value, index) => (
                        <Pressable
                            key={index}
                            onPressIn={() => handleMouseEnter(index)}
                            onPressOut={handleMouseLeave}
                            style={styles.barContainer}
                            accessibilityLabel={`${months[index]}: ${value} pedidos`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: hoveredBar === index }}
                        >
                            <View style={styles.barWrapper}>
                                <Animated.View
                                    style={[
                                        styles.bar,
                                        {
                                            height: barAnimations[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0%', `${(value / maxValue) * 100}%`]
                                            }),
                                            backgroundColor: getBarColor(index),
                                            transform: [{ 
                                                scaleX: hoveredBar === index 
                                                    ? barAnimations[index].interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [1, 1.1]
                                                      }) 
                                                    : 1 
                                            }]
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.monthLabel}>{months[index]}</Text>
                            {hoveredBar === index && (
                                <View style={styles.tooltip}>
                                    <Text style={styles.tooltipText}>{value}</Text>
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};

export default PedidosMensuales;

