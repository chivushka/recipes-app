const password = "iva2002"

import mysql from "mysql2"

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:password,
    database: "yumbook"
})

