const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'grapes',
  password: 'grapes',
  database: 'employeeTracker_db'
});

// Connect to the database
connection.connect();

function handleAction(action) {
  switch (action) {
    case 'View all departments':
      viewAllDepartments();
      break;
    // Add more cases for other actions
    default:
      console.log('Invalid action.');
      break;
  }
}
function handleAction(action) {
    switch (action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      // Add more cases for other actions
      default:
        console.log('Invalid action.');
        break;
    }
  }
  

function viewAllDepartments() {
  // SQL query to retrieve all departments
  const query = 'SELECT * FROM departments';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying departments:', err);
    } else {
      // Display the results using console.table
      console.table('Departments', results);
    }

    // Ask for the next action
    promptForAction();
  });
}
function viewAllRoles() {
    // SQL query to retrieve all roles with additional details
    const query = `
      SELECT roles.id, roles.title, roles.salary, departments.department_name
      FROM roles
      LEFT JOIN departments ON roles.department_id = departments.id
    `;
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error querying roles:', err);
      } else {
        // Display the results using console.table
        console.table('Roles', results);
      }
  
      // Ask for the next action
      promptForAction();
    });
  }
  function viewAllEmployees() {
    // SQL query to retrieve all employees with relevant information
    const query = `
      SELECT 
        e.id,
        e.first_name,
        e.last_name,
        r.title AS job_title,
        d.department_name AS department,
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM 
        employee e
      LEFT JOIN 
        roles r ON e.role_id = r.id
      LEFT JOIN 
        departments d ON r.department_id = d.id
      LEFT JOIN 
        employee m ON e.manager_id = m.id
    `;
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error querying employees:', err);
      } else {
        // Display the results using console.table
        console.table('Employees', results);
      }
  
      // Ask for the next action
      promptForAction();
    });
  }
  function addDepartment() {
    inquirer
      .prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
      })
      .then((answers) => {
        const { departmentName } = answers;
  
        // SQL query to add a new department
        const query = 'INSERT INTO departments (department_name) VALUES (?)';
  
        connection.query(query, [departmentName], (err, result) => {
          if (err) {
            console.error('Error adding department:', err);
          } else {
            console.log(`Department '${departmentName}' added successfully.`);
          }
  
          // Ask for the next action
          promptForAction();
        });
      })
      .catch((error) => {
        console.error('Error during inquirer prompts:', error);
      });
  }
  function addRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'input',
          name: 'departmentId',
          message: 'Enter the department ID for the role:',
        },
      ])
      .then((answers) => {
        const { title, salary, departmentId } = answers;
  
        // SQL query to add a new role
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
  
        connection.query(query, [title, salary, departmentId], (err, result) => {
          if (err) {
            console.error('Error adding role:', err);
          } else {
            console.log(`Role '${title}' added successfully.`);
          }
  
          // Ask for the next action
          promptForAction();
        });
      })
      .catch((error) => {
        console.error('Error during inquirer prompts:', error);
      });
  }
  function handleAction(action) {
    switch (action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      // Add more cases for other actions
      default:
        console.log('Invalid action.');
        break;
    }
  }
  function updateEmployeeRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the ID of the employee you want to update:',
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: 'Enter the new role ID for the employee:',
        },
      ])
      .then((answers) => {
        const { employeeId, newRoleId } = answers;
  
        // SQL query to update the role of an employee
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
  
        connection.query(query, [newRoleId, employeeId], (err, result) => {
          if (err) {
            console.error('Error updating employee role:', err);
          } else {
            console.log(`Employee with ID ${employeeId} has been updated to new role ID ${newRoleId}.`);
          }
  
          // Ask for the next action
          promptForAction();
        });
      })
      .catch((error) => {
        console.error('Error during inquirer prompts:', error);
      });
  }
  
// Implement your application logic here (e.g., inquirer prompts, SQL queries)
function promptForAction() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    })
    .then((answers) => {
      // Handle the selected action
      handleAction(answers.action);
    })
    .catch((error) => {
      console.error('Error during inquirer prompts:', error);
    });
}


 connection.end();

// Start the application by prompting for the first action
promptForAction();

