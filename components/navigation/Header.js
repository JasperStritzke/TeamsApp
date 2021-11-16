import React from "react";
import {StyleSheet, Text, View} from "react-native";
import TransparentButton from "../form/TransparentButton";
import {Shuffle, Download} from "react-native-feather";

export default function Header({membersCount, randomMember, saveTeam, groupName}) {
    return (
        <View style={styles.header}>
            <Text style={styles.members}>Mitglieder ({membersCount})</Text>
            <Text style={{fontSize: 15, fontWeight: '600'}}>{groupName}</Text>
            <View style={{display: "flex", flexDirection: "row"}}>
                <View style={{marginRight: 15}}>
                    <TransparentButton icon={Shuffle} small onPress={randomMember}/>
                </View>
                <TransparentButton icon={Download} onPress={saveTeam} small/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingLeft: 30,
        paddingRight: 30,
        marginBottom: 30,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    members: {
        fontSize: 25,
    }
})
