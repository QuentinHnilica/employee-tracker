const mysql = require('mysq12')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1',
    database: 'employee_db'
})

db.connect((err) => {
    if (err) throw err
})

module.exports(db)