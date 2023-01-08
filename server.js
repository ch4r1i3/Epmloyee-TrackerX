    // import mysql2
    const mysql = require('mysql2')
    // import inquirer 
    const inquirer = require('inquirer'); 
    // import console.table
    const cTable = require('console.table'); 


    // connection to database
    const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'karli.2606',
    database: 'employee_db'
    });

    connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    afterConnection();
    });

    // function after connection is established and welcome image shows 
    afterConnection = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    promptUser();
    };

    // inquirer prompt for first action
    const promptUser = () => {
    inquirer.prompt ([
        {
        type: 'list',
        name: 'choices', 
        message: 'What would you like to do?',
        choices: ['View all departments', 
                    'View all roles', 
                    'View all employees', 
                    'Add a department', 
                    'Add a role', 
                    'Add an employee', 
                    'Update an employee role',
                    'Update an employee manager',
                    "View employees by department",
                    'Delete a department',
                    'Delete a role',
                    'Delete an employee',
                    'View department budgets',
                    'No Action']
        }
    ])
        .then((answers) => {
        const { choices } = answers; 

        if (choices === "View all departments") {
            showDepartments();
        }

        if (choices === "View all roles") {
            showRoles();
        }

        if (choices === "View all employees") {
            showEmployees();
        }

        if (choices === "Add a department") {
            addDepartment();
        }

        if (choices === "Add a role") {
            addRole();
        }

        if (choices === "Add an employee") {
            addEmployee();
        }

        if (choices === "Update an employee role") {
            updateEmployee();
        }

        if (choices === "Update an employee manager") {
            updateManager();
        }

        if (choices === "View employees by department") {
            employeeDepartment();
        }

        if (choices === "Delete a department") {
            deleteDepartment();
        }

        if (choices === "Delete a role") {
            deleteRole();
        }

        if (choices === "Delete an employee") {
            deleteEmployee();
        }

        if (choices === "View department budgets") {
            viewBudget();
        }

        if (choices === "No Action") {
            connection.end()
        };
    });
    };

    // function to show all departments 
    showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
    };

    // function to show all roles 
    showRoles = () => {
    console.log('Showing all roles...\n');

    const sql = `SELECT role.id, role.title, department.name AS department
                FROM role
                INNER JOIN department ON role.department_id = department.id`;
    
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err; 
        console.table(rows); 
        promptUser();
    })
    };

    // function to show all employees 
    showEmployees = () => {
    console.log('Showing all employees...\n'); 
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department,
                        role.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err; 
        console.table(rows);
        promptUser();
    });
    };

    // function to add a department 
    addDepartment = () => {
    inquirer.prompt([
        {
        type: 'input', 
        name: 'addDept',
        message: "What department do you want to add?",
        validate: addDept => {
            if (addDept) {
                return true;
            } else {
                console.log('Please enter a department');
                return false;
            }
        }
        }
    ])
        .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.addDept, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDept + " to departments!"); 

            showDepartments();
        });
    });
    };

    // function to add a role 
    addRole = () => {
    inquirer.prompt([
        {
        type: 'input', 
        name: 'role',
        message: "What role do you want to add?",
        validate: addRole => {
            if (addRole) {
                return true;
            } else {
                console.log('Please enter a role');
                return false;
            }
        }
        },
        {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: addSalary => {
            if (isNAN(addSalary)) {
                return true;
            } else {
                console.log('Please enter a salary');
                return false;
            }
        }
        }
    ])
        .then(answer => {
        const params = [answer.role, answer.salary];

        // grab dept from department table
        const roleSql = `SELECT name, id FROM department`; 

        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err; 
        
            const dept = data.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
            {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
            }
            ])
            .then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id)
                            VALUES (?, ?, ?)`;

                connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.role + " to roles!"); 

                showRoles();
        });
        });
    });
    });
    };

    // function to add an employee 
    addEmployee = () => {
    inquirer.prompt([
        {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
        validate: addFirst => {
            if (addFirst) {
                return true;
            } else {
                console.log('Please enter a first name');
                return false;
            }
        }
        },
        {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLast => {
            if (addLast) {
                return true;
            } else {
                console.log('Please enter a last name');
                return false;
            }
        }
        }
    ])
        .then(answer => {
        const params = [answer.fistName, answer.lastName]

        // grab roles from roles table
        const roleSql = `SELECT role.id, role.title FROM role`;
    
        connection.promise().query(roleSql, (err, data) => {
        if (err) throw err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
                {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
                }
            ])
                .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerSql = `SELECT * FROM employee`;

                connection.promise().query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                    // console.log(managers);

                    inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                    }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;

                        connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been added!")

                        showEmployees();
                });
                });
            });
            });
        });
    });
    };

    // function to update an employee 
    updateEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err; 

    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

        inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: "Which employee would you like to update?",
            choices: employees
        }
        ])
        .then(empChoice => {
            const employee = empChoice.name;
            const params = []; 
            params.push(employee);

            const roleSql = `SELECT * FROM role`;

            connection.promise().query(roleSql, (err, data) => {
            if (err) throw err; 

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
                inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's new role?",
                    choices: roles
                }
                ])
                    .then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role); 
                    
                    let employee = params[0]
                    params[0] = role
                    params[1] = employee 
                    

                    // console.log(params)

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee has been updated!");
                
                    showEmployees();
            });
            });
        });
        });
    });
    };

    // function to update an employee 
    updateManager = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err; 

    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

        inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: "Which employee would you like to update?",
            choices: employees
        }
        ])
        .then(empChoice => {
            const employee = empChoice.name;
            const params = []; 
            params.push(employee);

            const managerSql = `SELECT * FROM employee`;

            connection.promise().query(managerSql, (err, data) => {
                if (err) throw err; 

            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                
                inquirer.prompt([
                    {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                    }
                ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager); 
                        
                        let employee = params[0]
                        params[0] = manager
                        params[1] = employee 
                        

                        // console.log(params)

                        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                        connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been updated!");
                    
                        showEmployees();
            });
            });
        });
        });
    });
    };

    // function to view employee by department
    employeeDepartment = () => {
    console.log('Showing employee by departments...\n');
    const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                FROM employee 
                LEFT JOIN role ON employee.role_id = role.id 
                LEFT JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err; 
        console.table(rows); 
        promptUser();
    });          
    };

    // function to delete department
    deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`; 

    connection.promise().query(deptSql, (err, data) => {
        if (err) throw err; 

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
        {
            type: 'list', 
            name: 'dept',
            message: "What department do you want to delete?",
            choices: dept
        }
        ])
        .then(deptChoice => {
            const dept = deptChoice.dept;
            const sql = `DELETE FROM department WHERE id = ?`;

            connection.query(sql, dept, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!"); 

            showDepartments();
        });
        });
    });
    };

    // function to delete role
    deleteRole = () => {
    const roleSql = `SELECT * FROM role`; 

    connection.promise().query(roleSql, (err, data) => {
        if (err) throw err; 

        const role = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
        {
            type: 'list', 
            name: 'role',
            message: "What role do you want to delete?",
            choices: role
        }
        ])
        .then(roleChoice => {
            const role = roleChoice.role;
            const sql = `DELETE FROM role WHERE id = ?`;

            connection.query(sql, role, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!"); 

            showRoles();
        });
        });
    });
    };

    // function to delete employees
    deleteEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err; 

    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

        inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: "Which employee would you like to delete?",
            choices: employees
        }
        ])
        .then(empChoice => {
            const employee = empChoice.name;

            const sql = `DELETE FROM employee WHERE id = ?`;

            connection.query(sql, employee, (err, result) => {
            if (err) throw err;
            console.log("Successfully Deleted!");
            
            showEmployees();
        });
    });
    });
    };

    // view department budget 
    viewBudget = () => {
    console.log('Showing budget by department...\n');

    const sql = `SELECT department_id AS id, 
                        department.name AS department,
                        SUM(salary) AS budget
                FROM  role  
                JOIN department ON role.department_id = department.id GROUP BY  department_id`;
    
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err; 
        console.table(rows);

        promptUser(); 
    });            
    };