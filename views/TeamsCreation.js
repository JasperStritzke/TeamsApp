import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {ComponentWrap, primary, white} from "../styles/mainTheme";
import TransparentButton from "../components/form/TransparentButton";
import {Minus, Plus} from "react-native-feather";
import UniversalButton from "../components/form/UniversalButton";
import {randomNumberInRange} from "../util/random";
import {getAllActivatedMembers} from "../store/managers/member";

export default class TeamsCreation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visitId: "",
            teamsCount: 1,
            members: [],
            teams: []
        }
    }

    componentDidMount() {
        this.virtualMount()
    }

    componentDidUpdate() {
        if (this.props.route.params.visitId === this.state.visitId) {
            return
        }

        this.virtualMount();
    }

    virtualMount() {
        this.setState({
            visitId: this.props.route.params.visitId,
            teamsCount: 1,
            members: [],
            teams: []
        })

        getAllActivatedMembers(this.props.route.params.name)
            .then(members => {
                if (members.length === 0) {
                    this.props.navigation.navigate("SelectedGroup", this.props.route.params)
                    return
                }

                this.setState({members})
            })
    }

    isInputValid() {
        return this.state.members.length > 0 && this.state.teamsCount <= this.state.members.length
    }

    manipulateTeamsCountBy(incr) {
        this.setState((state) => {
            let newCount = state.teamsCount + incr

            if (newCount <= 0) {
                newCount = 1
            } else if (newCount > state.members.length) {
                newCount = state.members.length
            }

            return {
                teamsCount: newCount
            }
        })
    }

    calculateMembers() {
        const teams = [];

        for (let i = 0; i < this.state.teamsCount; i++) {
            teams.push({
                number: i + 1,
                members: [],
            })
        }

        let teamsIndex = 0;
        for (let i = 0; i < this.state.members.length; i++) {
            teams[teamsIndex].members.push(this.state.members[i])
            teamsIndex++

            if (teamsIndex === teams.length) {
                teamsIndex = 0;
            }
        }

        const summary = {}

        for (let i = 0; i < teams.length; i++) {
            const size = teams[i].members.length;

            if (!summary[size]) {
                summary[size] = 0;
            }

            summary[size]++;
        }

        const returnArray = []

        for (let teamSize of Object.keys(summary)) {
            const countOfTeams = summary[teamSize]

            returnArray.push({teamSize, countOfTeams})
        }

        return returnArray
    }

    renderSingleTeam(team) {
        return team.countOfTeams + " Team" + (team.countOfTeams == 1 ? "" : "s") + " mit " + team.teamSize + " Mitglied" + (team.teamSize == 1 ? "" : "ern");
    }

    renderText() {
        const members = this.calculateMembers();

        let result = this.renderSingleTeam(members[0])

        if (members.length !== 1) {
            result = result + " + " + this.renderSingleTeam(members[1])
        }

        return result
    }

    mixTeams() {
        const teamsPartition = this.calculateMembers();

        let members = [...this.state.members];

        const drawMember = () => {
            const randomIndex = randomNumberInRange(0, members.length - 1)
            const randomMember = members[randomIndex];

            members = members.filter(member => member != randomMember)

            return randomMember
        }

        const resultingTeams = [];

        for (let i = 0; i < teamsPartition.length; i++) {
            const teams = teamsPartition[i]

            for (let a = 0; a < teams.countOfTeams; a++) {
                const team = []

                for (let b = 0; b < teams.teamSize; b++) {
                    team.push(drawMember())
                }

                resultingTeams.push(team)
            }
        }

        return resultingTeams
    }

    render() {
        const Teams = () => {

            if (this.state.teams.length !== 0) {
                let index = -1;

                return (
                    <ScrollView>
                        <Text style={{fontSize: 18, fontWeight: '600'}}>Teams:</Text>
                        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                            {
                                this.state.teams.map(team => (
                                    <View style={styles.teamCard} key={index++}>
                                        <Text style={{
                                            fontSize: 22,
                                            fontWeight: '500',
                                            color: white,
                                            marginBottom: 10,
                                        }}>Team {index + 1}</Text>
                                        {
                                            team.map(member => (
                                                <Text style={{
                                                    fontSize: 20,
                                                    color: white,
                                                    marginTop: 5,
                                                    fontWeight: '500'
                                                }} key={member.name}>{member.name}</Text>
                                            ))
                                        }
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>
                )
            }

            return null
        }

        return (
            <ComponentWrap>
                <View style={{marginTop: 30, marginBottom: 15}}>
                    <Text style={{fontSize: 30, fontWeight: '500'}}>Mitglieder: {this.state.members.length}</Text>
                    <View style={{flexDirection: "column"}}>
                        <View style={{flexDirection: "row", alignItems: "center", flexWrap: "wrap"}}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginRight: 20,
                                paddingBottom: 15,
                                paddingTop: 15,
                            }}>
                                <TransparentButton
                                    icon={Minus} style={{marginRight: 20}}
                                    onPress={() => this.manipulateTeamsCountBy(-1)}
                                />
                                <Text style={[styles.text, styles.teamsText]}>{this.state.teamsCount + " Teams"}</Text>
                                <TransparentButton icon={Plus} onPress={() => this.manipulateTeamsCountBy(1)}/>
                            </View>
                            <Text style={styles.text}>{this.renderText()}</Text>
                        </View>
                        <UniversalButton
                            label="Teams erstellen"
                            style={{paddingRight: 40, paddingLeft: 40, marginTop: 20}}
                            onPress={() => this.setState({teams: this.mixTeams()})}
                        />
                    </View>
                </View>
                <Teams/>
            </ComponentWrap>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {},
    text: {
        fontSize: 20,
        fontWeight: '500',
        color: primary,
    },
    teamsText: {
        fontSize: 20,
        fontWeight: '500',
        color: primary,
        marginRight: 20,
        textAlignVertical: "center",
        textAlign: "center",
        width: 130
    },
    teamCard: {
        flexGrow: 1,
        padding: 15,
        color: white,
        backgroundColor: primary,

        borderRadius: 5,
        marginTop: 20,
        marginRight: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        width: 200,
    }
})
