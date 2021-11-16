import React from "react";
import Header from "../components/navigation/Header";
import {addMember, getAllMembers, removeMember, saveMember} from "../store/managers/member";
import {Text, View, StyleSheet, ScrollView, Alert, TouchableOpacity} from "react-native";
import {danger, text} from "../styles/mainTheme";
import CheckBox from "../components/form/CheckBox";
import MemberCreateForm from "../components/form/MemberCreateForm";
import UniversalButton from "../components/form/UniversalButton";
import {Member} from "../store/types";
import {Trash2} from "react-native-feather";
import {randomGenerator, randomNumberInRange} from "../util/random";

const styles = StyleSheet.create({
    tableColumnTitle: {
        fontWeight: '600',
        color: text,
        fontSize: 16,
        marginBottom: 25,
    },
    tableColumn: {
        marginLeft: 15,
        marginRight: 15,
    },
    columnMember: {
        fontSize: 16,
        fontWeight: '600',
        height: 45,
    },
})


export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupName: "",
            groupId: "",
            members: [],
        }
    }

    create(resolve, {name, gender}) {
        addMember(
            new Member({
                name: name,
                gender: gender,
                activated: true,
                groupName: this.state.groupName
            })
        ).then((created) => {
            if (!created) {
                Alert.alert("Name existiert bereits")
                resolve();
                return;
            }

            resolve();

            this.refresh()
        })
    }

    refresh() {
        getAllMembers(this.props.route.params.name)
            .then((members) => {
                this.setState({
                    members: members,
                })
            })
    }

    saveTeam() {

    }

    randomMember() {
        const activeMembers = this.getActivatedMembers();

        if (activeMembers.length === 0) {
            Alert.alert("Keine Mitglieder.", "Bitte füge Mitglieder zur Gruppe hinzu, um ein züfalliges Mitglied auszuwälen.")
            return
        }

        const randomMember = activeMembers[randomNumberInRange(0, activeMembers.length - 1)]
        Alert.alert(randomMember.name, "Zufälliges Mitglied")
    }

    componentDidUpdate() {
        if (this.props.route.params.id === this.state.id) {
            return
        }

        this.virtualMount()
    }

    componentDidMount() {
        this.virtualMount()
    }

    virtualMount() {
        this.setState({
            groupName: this.props.route.params.name,
            id: this.props.route.params.id,
            members: []
        });

        this.refresh()
    }

    prettyGender(raw) {
        switch (raw) {
            case "f":
                return "Weiblich"
            case "m":
                return "Männlich"
            case "d":
                return "Divers"
            default:
                return ""
        }
    }

    deleteMember(name) {
        Alert.alert(`Mitglied ${name} löschen?`,
            "",
            [
                {text: "Abbrechen", style: "cancel"},
                {
                    text: "Löschen", style: "destructive", onPress: () => {
                        removeMember(name, this.props.route.params.name)
                            .then(() => {
                                Alert.alert(`Mitglied ${name} gelöscht.`)
                                this.refresh()
                            })
                    }
                }
            ]
        );
    }

    toggleActivity(member) {
        member.activated = !member.activated;

        saveMember(member)
            .then(() => {
                this.refresh()
            })
    }

    createTeams() {
        if (this.getActivatedMembers().length >= 1) {
            this.props.navigation.navigate("TeamsCreation", {...this.props.route.params, visitId: randomGenerator(8)});
        }
    }

    getActivatedMembers() {
        return this.state.members.filter(member => member.activated)
    }

    render() {
        const CreateButton = () => {
            if (this.getActivatedMembers().length < 1) {
                return null
            }

            return (
                <UniversalButton
                    label={`Teams erstellen mit ${this.getActivatedMembers().length} Person(en) `}
                    style={{width: 300}} onPress={() => this.createTeams()}
                />
            )
        }

        return (
            <>
                <Header
                    saveTeam={this.saveTeam}
                    randomMember={this.randomMember}
                    membersCount={this.state.members.length}
                    groupName={this.state.groupName}
                />

                <View style={{flexDirection: "column", padding: 30}}>
                    <MemberCreateForm onCreate={(resolve, member) => this.create(resolve, member)}/>
                    <ScrollView contentContainerStyle={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                        <View style={styles.tableColumn}>
                            <Text style={styles.tableColumnTitle}>Name</Text>
                            {
                                this.state.members.map(
                                    ({name}) => <Text style={styles.columnMember} key={`${name}-name`}>{name}</Text>
                                )
                            }
                        </View>
                        <View style={styles.tableColumn}>
                            <Text style={styles.tableColumnTitle}>Geschlecht</Text>
                            {
                                this.state.members.map(({name, gender}) =>
                                    <Text style={styles.columnMember}
                                          key={`${name}-gender`}>{this.prettyGender(gender)}</Text>
                                )
                            }
                        </View>
                        <View style={styles.tableColumn}>
                            <Text style={styles.tableColumnTitle}>Aktiviert</Text>
                            {
                                this.state.members.map((member) =>
                                    <View style={{width: "100%", alignItems: "center"}}
                                          key={`${member.name}-activated`}>
                                        <CheckBox
                                            style={styles.columnMember}
                                            value={member.activated}
                                            onChange={() => this.toggleActivity(member)}
                                        />
                                    </View>)
                            }
                        </View>
                        <View style={styles.tableColumn}>
                            <Text style={styles.tableColumnTitle}>Aktion</Text>
                            {
                                this.state.members.map(({name}) =>
                                    <View style={{width: "100%", alignItems: "center"}} key={`${name}-action`}>
                                        <TouchableOpacity style={styles.columnMember}
                                                          onPress={() => this.deleteMember(name)}>
                                            <Trash2 color={danger}/>
                                        </TouchableOpacity>
                                    </View>)
                            }
                        </View>
                        <View style={{
                            position: "absolute",
                            width: "100%",
                            height: 2,
                            backgroundColor: "#C4C4C4",
                            top: 25
                        }}/>
                    </ScrollView>
                </View>
                <View style={{
                    position: "absolute",
                    bottom: 30,
                    left: 0,
                    right: 100,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <CreateButton/>
                </View>
            </>
        )
    }
}
