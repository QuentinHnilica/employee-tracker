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
          'Update employee role', 'Quit'
          ],
        },
      ])
      .then((answers) => {
        switch (answers.options) {
          case 'View all roles':
            viewAllRoles()
            break
          case 'View all departments':
            viewDepartments()
            break
          case 'View all employees':
            viewEmployees()
            break
          case 'Add a department':
            addDepartment()
            break
          case 'Add a role':
            addRole()
            break
          case 'add new employee':
            addEmployee()
            break
          case 'Update employee role':
            updateEmployeeRole()
            break
          default:
            console.log('quitting...')
            process.exit(0)
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

const viewAllRoles = async () => {
  const roles =  await db.promise().query(
      `SELECT * FROM roles`
  )
  const theRoles = roles[0]

  const depos =  await db.promise().query(
    `SELECT * FROM departments`
)
const mydpos = depos[0]
const roleTable = []

for (let i = 0; i < theRoles.length; i++){
  let newObj = {}
  for (let v = 0; v < mydpos.length; v++){
    if (theRoles[i].department_id === mydpos[v].id){
      newObj.id = theRoles[i].id
      newObj.title = theRoles[i].title
      newObj.salary = theRoles[i].salary
      newObj.department = mydpos[v].depoName
      roleTable.push(newObj)
    }
  }
}
  console.table(roleTable)

  promptUser()
}

const viewEmployees = async (bool) => {
  const employees =  await db.promise().query(
    `SELECT * FROM employees`
  )
  const theEmployees = employees[0]
  
  if (bool){
    return theEmployees
  }
  else{

  const roles =  await db.promise().query(
    `SELECT * FROM roles`)
  const theRoles = roles[0]

  const depos =  await db.promise().query(
    `SELECT * FROM departments`)
  const mydpos = depos[0]

  const employeeTable = []

  for (let i = 0; i < theEmployees.length; i++){ //Depos info is messed up
    let newObj = {}
    newObj.id = theEmployees[i].id
    newObj.firstName = theEmployees[i].first_name
    newObj.lastName = theEmployees[i].last_name
    for (let q = 0; q < theRoles.length; q++){
      if (theEmployees[i].role_id == theRoles[q].id){
        newObj.title = theRoles[q].title
        for (let z = 0; z < mydpos.length; z++){
          if (mydpos[z].id == theRoles[q].department_id){
            newObj.department = mydpos[z].depoName
          }
        }
        newObj.salary = theRoles[q].salary
      }
    }
    if (theEmployees[i].manager_id != null){
      for (let a = 0; a < theEmployees.length; a++){
        if (theEmployees[i].manager_id == theEmployees[a].id){
          newObj.manager = theEmployees[a].first_name + ' ' + theEmployees[a].last_name
        }
      }
    }
    else{
      newObj.manager = null
    }
    
    employeeTable.push(newObj)
  }
  console.table(employeeTable)
  promptUser()
  }
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
          promptUser()
      })
  }
const addRole = async() => {
    const theDepos = await db.promise().query(
        `SELECT * FROM departments`)
    const depoVar = theDepos[0]
    const depoNames = []

        for (let i = 0; i < depoVar.length; i++){
            depoNames.push(depoVar[i].depoName)
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
            choices: depoNames
            
        }
    ]

    inquirer.prompt(questions).then(async (answers) =>{
      let depoIndex = depoNames.indexOf(answers.depts)
      await db.promise().query(
        `INSERT INTO roles (title, salary, department_id)
        VALUES (?,?,?)`,
      [answers.title, parseInt(answers.salary), depoVar[depoIndex].id]
    )
      promptUser()
    })
}

const addEmployee = async () => {
  const theRoles = await db.promise().query(
  `SELECT * FROM roles`)
  const rolesVar = theRoles[0]
  const roleNames = []

  for (let i = 0; i < rolesVar.length; i++){
      roleNames.push(rolesVar[i].title)
  }

  const theEmployeesVar = await db.promise().query(
    `SELECT * FROM employees`)
  const theEmployees = theEmployeesVar[0]
  const employeeNames = []

  for (let i = 0; i < theEmployees.length; i++){
    employeeNames.push(theEmployees[i].first_name + " " + theEmployees[i].last_name)
  }

  employeeNames.push('None')

  const questions = [
    {
      type: 'input',
      name: 'firstName',
      message: 'What is their first name?'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is their last name?'
    },
    {
      type: 'list',
      name: 'roles',
      message: 'choose thier role',
      choices: roleNames
    },
    {
      type: 'list',
      name: 'Manager',
      message: 'Who is their Manager?',
      choices: employeeNames
    }
  ]

  inquirer.prompt(questions).then(async (answers) =>{
    let roleIndex = roleNames.indexOf(answers.roles)
    let managerIndex = employeeNames.indexOf(answers.Manager)
    let managerId
    if (theEmployees[managerIndex] != null){
      managerId = theEmployees[managerIndex].id
    }
    else{
      managerId = null
    }
    await db.promise().query(
      `INSERT INTO employees (first_name, last_name, role_id, manager_id)
      VALUES (?,?,?,?)`,
    [answers.firstName, answers.lastName, rolesVar[roleIndex].id, managerId]
  )
    promptUser()
  })
}

const updateEmployeeRole = async () => {
  const theEmployeesVar = await db.promise().query(
  `SELECT * FROM employees`)
  const employees = theEmployeesVar[0]
  const employeeNames = []
  for (let i = 0; i < employees.length; i++){
    employeeNames.push(employees[i].first_name + ' ' + employees[i].last_name)
  }

  const roles =  await db.promise().query(
    `SELECT * FROM roles`
  )
  const theRoles = roles[0]
  const RollNames = []


  for (let i = 0; i < theRoles.length; i++){
    RollNames.push(theRoles[i].title)
  }

  const questions = [
    {
      type: 'list',
      name: 'employee',
      message: 'choose an Employee',
      choices: employeeNames
    },
    {
      type: 'list',
      name: 'newRole',
      message: 'Which Role Applies to this Employee?',
      choices: RollNames
    }
  ]

  inquirer.prompt(questions).then(async (answers) => {
    const employeeIndex = employeeNames.indexOf(answers.employee)
    const roleIndex = RollNames.indexOf(answers.newRole)


    db.query('UPDATE ?? SET role_id=? WHERE id=?',
      ['employees', theRoles[roleIndex].id, employees[employeeIndex].id]
    )
    promptUser()
  })
}
  
promptUser()