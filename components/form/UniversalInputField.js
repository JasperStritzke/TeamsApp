import React, {useRef} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {gray} from "../../styles/mainTheme";

export default function (props) {
    const max = props.max ? +props.max : 99999;

    let keyboardType = props.keyboardType
    if (!keyboardType) {
        keyboardType = "default"
    }

    const inputEl = useRef(null)

    const focus = () => {
        inputEl.current.focus();
    }

    const appendIcon = props.appendIcon ? props.appendIcon({style: styles.append}) : null
    const prependIcon = props.prependIcon ? props.prependIcon({style: styles.prepend}) : null

    const focusOnSubmit = !!props.focusOnSubmit;

    return (
        <TouchableWithoutFeedback onPress={focus}>
            <View style={[styles.buttonContainer, props.style]}>
                <View style={{display: "flex", flexDirection: "row"}}>
                    {appendIcon}
                    <TextInput
                        style={{fontSize: 16}}
                        placeholder={props.placeholder} placeholderTextColor={gray} ref={inputEl} maxLength={max}
                        keyboardType={keyboardType}
                        onChangeText={props.onChangeText} value={props.value} onBlur={props.onBlur}
                        onSubmitEditing={() => {
                            if (props.onSubmitEditing) props.onSubmitEditing()
                            if (focusOnSubmit) {
                                setTimeout(() => {
                                    focus()
                                }, 125)
                            }
                        }}
                    />
                </View>
                {prependIcon}
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: gray,
        borderRadius: 5,
        padding: 10,
        justifyContent: "space-between"
    },
    append: {
        color: gray,
        marginRight: 15,
    },
    prepend: {
        color: gray,
    }
})
