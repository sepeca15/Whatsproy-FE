import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { months, completedData,  } from '../data';
import { Styles } from './PedidosRealizadosStyles';

const maxValue = Math.max(...completedData);
const screenWidth = Dimensions.get('window').width;

const PedidosRealizados: React.FC = () => {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [showScale, setShowScale] = useState(false);
    const barAnimations = completedData.map(() => new Animated.Value(0));
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
            <Animated.View style={[Styles.scale, { opacity: scaleAnim, height: 200 }]}>
                {Array.from({ length: steps + 1 }).map((_, index) => (
                    <View key={index} style={Styles.scaleStep}>
                        <Text style={Styles.scaleText}>
                            {Math.round(stepValue * (steps - index))}
                        </Text>
                    </View>
                ))}
            </Animated.View>
        );
    };

    return (
        <Animated.View style={[Styles.chartContainer, { opacity: fadeAnim }]}>
            <View style={Styles.titleContainer}>
                <Text style={Styles.chartTitle}>Pedidos realizados</Text>
                <Pressable onPress={toggleScale}>
                    <Feather name="bar-chart-2" size={24} color="#333" />
                </Pressable>
            </View>
            <View style={[Styles.chartBackground, { flexDirection: 'row' }]}>
                {showScale && renderScale()}
                <View style={[Styles.chart, { flex: 1 }]}>
                    {completedData.map((value, index) => (
                        <Pressable
                            key={index}
                            onPressIn={() => handleMouseEnter(index)}
                            onPressOut={handleMouseLeave}
                            style={Styles.barContainer}
                            accessibilityLabel={`${months[index]}: ${value} pedidos`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: hoveredBar === index }}
                        >
                            <View style={Styles.barWrapper}>
                                <Animated.View
                                    style={[
                                        Styles.bar,
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
                            <Text style={Styles.monthLabel}>{months[index]}</Text>
                            {hoveredBar === index && (
                                <View style={Styles.tooltip}>
                                    <Text style={Styles.tooltipText}>{value}</Text>
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};

export default PedidosRealizados;

