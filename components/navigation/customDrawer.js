import React, {useState} from "react";
import {ComponentWrap, text} from "../../styles/mainTheme";
import {Alert, RefreshControl, ScrollView, Text, View} from "react-native";
import UniversalInputField from "../form/UniversalInputField";
import {Search} from "react-native-feather";
import DrawerLink from "./DrawerLink";
import UniversalButton from "../form/UniversalButton";
import {createGroup, deleteGroup, getAllGroups, renameGroup} from "../../store/managers/group";
import {useNavigation} from "@react-navigation/native";

const init = [];

export default function CustomDrawer({state}) {
    const navigation = useNavigation();

    const [groups, setGroups] = useState(init)
    const [filter, setFilter] = useState("")
    const [loading, setLoading] = useState(false)

    const [refreshing, setRefreshing] = useState(false)

    if (groups === init) {
        getAllGroups().then(setGroups)
    }

    const refreshGroups = () => {
        if (refreshing) return

        setRefreshing(true)

        getAllGroups()
            .then(groups => {
                setGroups(groups)
                setTimeout(() => {
                    setRefreshing(false)
                }, 500)
            })
    }

    function createNew() {
        if (loading) return

        Alert.prompt(
            "Geben Sie einen Namen ein",
            "Jeder Name darf nur einmal verwendet werden!",
            (value) => {
                setLoading(true)

                setTimeout(() => {
                    createGroup(value).then(() => {
                        getAllGroups().then(groups => {
                            setGroups(groups)
                            setLoading(false)
                        })
                    })
                }, 500)
            },
        )
    }

    const isSelected = (name) => {
        const currentRoute = state.routes[state.index]
        return currentRoute.name === "SelectedGroup" && currentRoute.params.name === name;
    }

    const requestDelete = (name) => {
        if (loading || refreshing) return

        Alert.alert(
            `Gruppe ${name} löschen?`,
            "Wenn die Gruppe gelöscht wird, kann dies nicht wiederrufen werden.",
            [
                {text: "Abbrechen", style: "cancel"},
                {
                    text: "Löschen", style: "destructive", onPress: () => {
                        deleteGroup(name).then(() => {
                            refreshGroups()

                            if (isSelected(name)) {
                                navigation.navigate("NoneSelected")
                            }
                        })
                    }
                }
            ]
        )
    }

    const select = ({name, id}) => {
        if (isSelected(name)) {
            navigation.navigate("NoneSelected")
            return
        }

        navigation.navigate("SelectedGroup", {name: name, id: id})
    }

    const requestRename = (name) => {
        if (refreshing) return

        Alert.alert("Fehler", "Diese Funktion ist aktuell noch nicht stabil.")

        /*Alert.prompt(
            `Gruppe ${name} umbenennen?`,
            "Möchtest du die Gruppe wirklich umbenennen?",
            (value) => {
                if (!value || value.replaceAll(" ", "").length === 0 || value === name) {
                    Alert.alert("Name ungültig!", "Der Name darf nicht der Vorherige oder kürzer als ein Zeichen sein.")
                    return
                }

                renameGroup(name, value)
                    .then((renamed) => {
                        if (!renamed) return;

                        navigation.navigate("NoneSelected")
                        refreshGroups()

                        Alert.alert("Gruppe umbenannt", "Die Gruppe wurde erfolgreich zu " + value + " umbenannt.")
                    })
            }
        )*/
    }

    const Groups = () => {
        const filteredGroups = groups.filter(({name}) => {
            if (filter) {
                return name.toLowerCase().includes(filter.toLowerCase())
            }

            return true
        })

        if (filteredGroups.length === 0) {
            const groupsText = filter ? "Keine Treffer" : "Keine Gruppen"
            return (<Text style={{color: text, fontWeight: '500', fontSize: 18}}>{groupsText}</Text>)
        }

        return filteredGroups.map(
            ({name, id}) =>
                <DrawerLink
                    label={name} selected={isSelected(name)} key={name}
                    onPress={() => select({name, id})}
                    onLongPress={() => requestRename(name)}
                    onDelete={() => requestDelete(name)}
                />
        )
    }

    return (
        <>
            <ComponentWrap style={{height: "100%"}}>
                <Text style={{
                    fontSize: 25,
                    fontWeight: '600',
                    marginBottom: 15,
                    marginTop: 10
                }}>{filter ? "Suchergebnisse" : `Gruppen (${groups.length})`}</Text>
                <UniversalInputField prependIcon={Search} placeholder="Suche..." value={filter}
                                     onChangeText={setFilter}/>
                <View style={{marginBottom: 30}}/>
                <ScrollView refreshControl={<RefreshControl onRefresh={refreshGroups} refreshing={refreshing}/>}>
                    {Groups()}
                </ScrollView>

                <UniversalButton label="Gruppe anlegen" onPress={createNew} loading={loading} style={{marginTop: 15}}
                                 transparent/>
            </ComponentWrap>
        </>
    )
}
