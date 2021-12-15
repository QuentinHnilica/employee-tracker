const inquirer = require('inquirer')
const cTable = require('console.table')
const mysql = require('mysql2')



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1',
    database: 'employee_db'
}, () => console.log('Connected to db'))

//db.execute("database/seeds.sql")



const inputs = async() => {
    
}

function promptUser() {
    // view all departments
    // view all roles
    // view all employees
    // add a department
    // add a role
    // add an employee
    // update an employee role
    // quit
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'options',
          message: 'What would you like to do?',
          choices: ['View all departments', 'View all roles', 'View all employees',
          'Add a department', 'Add a role', 'add new employee',
          'Update exsisting employee', 'Quit'
          ],
        },
      ])
      .then((answers) => {
        switch (answers.options) {
          case 'View all roles':
            viewAllRoles()
            break
          case 'View all departments':
            console.log('View all departments')
            viewDepartments()
            break
          case 'View all employees':
            console.log('View all employees')
            promptUser()
            break
          case 'Add a department':
            console.log('Add a department')
            addDepartment()
            break
          case 'Add a role':
            console.log('Add a role')
            addRole()
            break
          case 'Add a employee':
            console.log('Add a employee')
            promptUser()
            break
          case 'Update exsisting employee':
            console.log('Update exsisting employee')
            promptUser()
            break
        //   default:
        //     console.log('default')
        //     console.log('quit')
        //     process.exit(0)
        }
      })
  }

const viewDepartments = async () => {
    const depos =  await db.promise().query(
        `SELECT * FROM departments`
    )
    console.table(depos[0])
    promptUser()
}

function addDepartment() {
      inquirer.prompt([
          {
              type: 'input',
              name: 'depo',
              message: 'What is the name of the department?'
          }
      ]).then( async (answer) => {

        await db.promise().query(
            `INSERT INTO departments (depoName)
            VALUES (?)`,
            answer.depo
        )
          console.log(answer.depo)
          promptUser()
      })
  }
const addRole = async() => {
    const theDepos = await db.promise().query(
        `SELECT * FROM departments`)

        for (let i = 0; i < theDepos[0].length; i++){
            
        }

    
    const questions = [
        {
            type: 'input',
            name: 'title',
            message: 'What is the role Title?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the roles Salary?'
        },
        {
            type: 'list',
            name: 'depts',
            message: 'choose the department',
            choices: theDepos[0]
            
        }
    ]

    inquirer.prompt(questions)
}

  function viewAllRoles() {
    const employeeRoles = [
      {
        name: 'foo',
        age: 10,
      },
      {
        name: 'bar',
        age: 20,
      },
    ]
  
    setTimeout(() => {
      console.log('view all roles')
  
      console.log('the users roles displayed in a fancy table here, but I dont know how to do that yet')
      console.log('-------------------------------------------------------')
      console.log('Imagine this is the roles table below...:nerd_face:')
      console.table(employeeRoles)
      console.log('-------------------------------------------------------')
  
      promptUser()
    }, 3000)
  }
  
  promptUser()