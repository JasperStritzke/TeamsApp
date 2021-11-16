import React from "react";
import {TouchableOpacity, StyleSheet, Text, ActivityIndicator} from "react-native";
import {primary, primaryWithOpacity, white} from "../../styles/mainTheme";

export default function ({label, transparent, style, onPress, loading}) {
    const content =
        loading ?
            <ActivityIndicator color={transparent ? null : "#fff"}/> :
            <Text style={[styles.text, transparent ? styles.textTransparent : null]}>{label}</Text>

    return (
        <TouchableOpacity
            style={[styles.button, transparent ? styles.buttonTransparent : null, style]}
            onPress={onPress}
        >
            {content}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: primary,
        padding: 10,
        borderRadius: 5,
    },
    buttonTransparent: {
        backgroundColor: primaryWithOpacity
    },
    text: {
        fontSize: 18,
        textAlign: "center",
        color: white
    },
    textTransparent: {
        color: primary,
    },
})
