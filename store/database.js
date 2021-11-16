import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("db.db");

export default database
