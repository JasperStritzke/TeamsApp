import React from "react";
import {TouchableOpacity, StyleSheet, Text} from "react-native";
import {primary, text, white} from "../../styles/mainTheme";
import {Users, Trash2} from "react-native-feather";

export default function ({label, selected, onPress, onLongPress, onDelete}) {
    return (
        <TouchableOpacity style={[styles.button, !selected ? styles.buttonSelected : null]} onPress={onPress} onLongPress={onLongPress}>
            <Users width={24} style={[{marginRight: 20, height: "100%"}, selected ? styles.text : styles.textSelected]}/>
            <Text style={[styles.text, !selected ? styles.textSelected : null]}>{label}</Text>
            <TouchableOpacity style={{marginLeft: 15, position: "absolute", right: 10, top: 10, bottom: 10, justifyContent: "center"}}>
                <Trash2 width={24} style={[selected ? styles.text : styles.textSelected, {opacity: 0.5}]} onPress={onDelete}/>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: primary,
        padding: 10,
        borderRadius: 5,
        marginBottom: 25,
        flexDirection: "row",
    },
    buttonSelected: {
        backgroundColor: null
    },
    text: {
        fontSize: 20,
        fontWeight: '500',
        color: white,
        maxWidth: 150,
    },
    textSelected: {
        color: text,
    },
})
