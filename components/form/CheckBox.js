import React from "react";
import {View, StyleSheet, Text, TouchableWithoutFeedback, ActivityIndicator} from "react-native";
import {primary} from "../../styles/mainTheme";

export default function ({value, onChange, label, radio, style}) {
    const Dot = value ?
        <View style={[styles.dot, value ? styles.dotChecked : null, radio ? styles.dotRadio : null]}/> : null

    return (
        <TouchableWithoutFeedback onPress={onChange} style={{height: 200, width: 300}}>
            <View style={[{flexDirection: "row"}, style]}>
                <View
                    style={[styles.container, value ? styles.containerChecked : null, label ? {marginRight: 10} : null, radio ? styles.containerRadio : null]}
                    onPress={onChange}
                >
                    {Dot}
                </View>
                <Text style={styles.label}>{label}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#BFBFBF",
        justifyContent: "center",
        alignItems: "center"
    },
    containerChecked: {
        borderColor: primary,
    },
    containerRadio: {
        borderRadius: 50,
    },
    dot: {
        height: 11,
        width: 11,
    },
    dotChecked: {
        backgroundColor: primary,
        borderRadius: 2.75
    },
    dotRadio: {
        borderRadius: 50,
    },
    label: {
        fontWeight: '600',
        fontSize: 16,
    }
})
