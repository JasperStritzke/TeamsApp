import database from "../database";
import {Member} from "../types";

database.transaction((tx) => {
    tx.executeSql("CREATE TABLE IF NOT EXISTS members (name VARCHAR(64), groupName VARCHAR(32), gender VARCHAR(6), activated VARCHAR(4));")
})

export function getAllMembers(groupName) {
    return new Promise((resolve) => {
            database.transaction(tx => {
                tx.executeSql("SELECT * FROM members WHERE groupName=?;", [groupName], (_, {rows: {_array}}) => {
                    resolve(_array.map(obj => new Member(obj)));
                });
            })
        }
    )
}

export function getAllActivatedMembers(groupName) {
    return new Promise(resolve => {
        database.transaction(tx => {
            tx.executeSql("SELECT * FROM members WHERE groupName=? AND activated=?;", [groupName, 'true'], (_, {rows: {_array}}) => {
                resolve(_array.map(obj => new Member(obj)))
            })
        })
    })
}

export function getMember(groupName, name) {
    return new Promise((resolve) => {
        database.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM members WHERE groupName=? AND name=?;",
                [groupName, name],
                (_, {rows}) => {
                    if (rows.length === 0) {
                        resolve(false)
                        return
                    }

                    resolve(true);
                })
        })
    })
}

export function addMember({name, groupName, gender, activated}) {
    return new Promise(async resolve => {
        if (await getMember(groupName, name)) {
            resolve(false);
            return
        }

        database.transaction(tx => {
            tx.executeSql(
                "INSERT INTO members (name, groupName, gender, activated) VALUES (?, ?, ?, ?);",
                [name, groupName, gender, activated ? "true" : "false"],
                () => resolve(true)
            )
        })
    })
}

export function removeMember(name, groupName) {
    return new Promise((resolve) => {
        database.transaction(tx => {
            tx.executeSql("DELETE FROM members WHERE name=? AND groupName=?;", [name, groupName], resolve)
        })
    })
}

export function removeAllMembers(groupName) {
    return new Promise((resolve) => {
        database.transaction(tx => {
            tx.executeSql("DELETE FROM members WHERE groupName=?;", [groupName], resolve)
        })
    })
}

export function saveMember(member) {
    return new Promise(resolve => {
        database.transaction(tx => {
            tx.executeSql("UPDATE members SET gender=?, activated=? WHERE name=? AND groupName=?;", [member.gender, member.activated ? "true" : "false", member.name, member.groupName], resolve)
        })
    })
}

export function moveMembersToGroup(oldGroupName, newGroupName) {
    return new Promise(resolve => {
        database.transaction(tx => {
            tx.executeSql("SELECT name FROM members WHERE groupName=?;", [oldGroupName], async (_, {rows: {_array}}) => {
                const members = _array.map(obj => new Member(obj))

                for (let i = 0; i < members.length; i++) {
                    const {name} = members[i]
                    await new Promise(resolveUpdate => tx.executeSql("UPDATE members SET groupName=? WHERE name=?;", [newGroupName, name], resolveUpdate), (a,b) => console.log(a, b));
                }

                resolve()
            })
        })
    })
}
