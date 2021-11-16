export class Group {
    constructor({name, id}) {
        this.name = name
        this.id = id
    }
}

export class Member {
    constructor({name, gender, activated, groupName}) {
        this.name = name
        this.groupName = groupName
        this.gender = gender
        this.activated = activated === true ? true : activated === "true" ? true : activated === "1.0" ? true : activated === "1";
    }
}
