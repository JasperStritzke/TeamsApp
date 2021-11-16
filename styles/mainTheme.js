import React from "react";
import {View} from "react-native";

const primary = "#459958"
const primaryWithOpacity = "rgba(69, 153, 88, 0.15)"
const white = "#fff"
const text = "#2A2636"
const gray = "#838187"
const borderColor = '#E3E3E3'
const danger = '#D7564E';

export function ComponentWrap(props) {
    const style = props.style;

    const safeProps = Object.assign({}, props);
    delete safeProps.style;

    return <View style={[{padding: 30}, style]} {...safeProps}>{safeProps.children}</View>
}

export {
    primary, primaryWithOpacity, white, text, gray, borderColor, danger
}
