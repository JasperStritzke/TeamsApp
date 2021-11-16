import database from "../database";
import {Group} from "../types";
import {Alert} from "react-native";
import {moveMembersToGroup, removeAllMembers} from "./member";
import {randomGenerator} from "../../util/random";

database.transaction((tx) => {
    tx.executeSql("CREATE TABLE IF NOT EXISTS groups (name VARCHAR(32), id VARCHAR(16));")
})

export function getAllGroups() {
    return new Promise((resolve) => {
            database.transaction(tx => {
                tx.executeSql("SELECT * FROM groups;", [], (_, {rows: {_array}}) => {
                    resolve(_array.map(obj => new Group(obj)))
                });
            })
        }
    )
}

export function existsGroup(name) {
    return new Promise((resolve) => {
        database.transaction(tx => {
            tx.executeSql("SELECT * FROM groups WHERE name=?;", [name], (_, {rows}) => {
                if (rows.length === 0) {
                    resolve(false)
                    return
                }

                resolve(true);
            })
        })
    })
}

export async function createGroup(name) {
    if (!name || name.length > 32 || name.replaceAll(" ", "").length === 0) {
        Alert.alert("Ungültiger Name", "Der Name darf nicht leer oder länge als 32 Zeichen sein.")
        return;
    }

    const exists = await existsGroup(name);

    if (exists) {
        Alert.alert("Gruppe existiert bereits.", "Eine Gruppe mit diesem Namen existiert bereits. Bitte erstelle eine mit einem anderen Namen.")
        return
    }

    database.transaction(tx => {
        tx.executeSql("INSERT INTO groups (name, id) VALUES (?, ?)", [name, randomGenerator(12)])
    })

    Alert.alert("Gruppe \"" + name + "\" erstellt.")
}

export function renameGroup(name, newName) {
    return new Promise(async resolve => {
        if(await existsGroup(newName)) {
            Alert.alert("Name bereits verwendet!")
            resolve(false)
            return;
        }

        database.transaction(tx => {
            tx.executeSql("DELETE FROM groups WHERE name=?;", [name], () => {
                tx.executeSql("INSERT INTO groups (name, id) VALUES (?, ?);", [newName, randomGenerator(12)], async () => {
                    await moveMembersToGroup(name, newName).then(() => resolve(true))
                })
            })
        });
    })
}

export function deleteGroup(name) {
    return new Promise(resolve => {
        database.transaction(tx => {
            tx.executeSql("DELETE FROM groups WHERE name=?;", [name], () => removeAllMembers(name).then(resolve))
        })
    })
}
