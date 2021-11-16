import React from "react";
import {Text, View} from "react-native";
import {text} from "../styles/mainTheme";

export default function NoneSelected() {
    return (
        <View style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 25, color: text}}>Keine Gruppe ausgewählt.</Text>
        </View>
    )
}
