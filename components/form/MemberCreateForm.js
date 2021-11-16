import React, {useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
import UniversalInputField from "./UniversalInputField";
import UniversalButton from "./UniversalButton";
import CheckBox from "./CheckBox";

const genders = [
    {
        text: "Weiblich",
        value: "f"
    },
    {
        text: "Männlich",
        value: "m"
    },
    {
        text: "Divers",
        value: "d",
    },
    {
        text: "Nicht angegeben",
        value: ""
    }
]

export default class MemberCreateForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            gender: "",
            loading: false
        }
    }

    async triggerCreate() {
        if (this.state.loading) return

        this.setState({loading: true})

        if (!this.state.name || this.state.name.replaceAll(" ", "").length === 0) {
            Alert.alert("Ungültiger Name", "Der Name darf nicht leer sein.")
            this.setState({loading: false})
            return
        }

        if (this.props.onCreate) {
            new Promise(resolve => this.props.onCreate(resolve, {name: this.state.name, gender: this.state.gender}))
                .then(() => {
                    this.setState({loading: false, name: "", gender: ""})
                })
        }
    }

    render() {
        return (
            <View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <UniversalInputField
                        placeholder="Name" style={{flex: 1, marginRight: 15}}
                        value={this.state.name} onChangeText={(name) => this.setState({name})}
                        onSubmitEditing={() => this.triggerCreate()}
                        focusOnSubmit
                    />
                    <UniversalButton
                        label="Hinzufügen" style={{minWidth: 150}}
                        onPress={() => this.triggerCreate()} loading={this.state.loading}
                    />
                </View>
                <View style={{flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginBottom: 20}}>
                    {
                        genders.map(current =>
                            <CheckBox
                                key={current.text}
                                label={current.text} value={this.state.gender === current.value} radio
                                onChange={() => this.setState({gender: current.value})}
                                style={styles.genderField}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    genderField: {
        marginRight: 30,
        marginTop: 5,
        marginBottom: 5,
    }
})
