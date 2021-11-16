import React from "react";
import {StyleSheet, TouchableOpacity} from "react-native";
import {primary, primaryWithOpacity} from "../../styles/mainTheme";

export default function (props) {
    const newProps = {
        ...props,
        style: [styles.button, props.style]
    }

    return (
        <TouchableOpacity {...newProps}>
            {props.icon({style: styles.icon, width: props.small ? 17 : 24})}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: primaryWithOpacity,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        width: 34,
        height: 34,
    },
    icon: {
        color: primary,
    },
})
