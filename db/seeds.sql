INSERT INTO department (name)
VALUES 
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 100000, 1),
('Software Engineer', 120000, 1),
('Accountant', 450000, 2), 
('Finanical Analyst', 150000, 2),
('Marketing Coordindator', 70000, 3), 
('Sales Lead', 90000, 3),
('Project Manager', 100000, 4),
('Operations Manager', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Mark', 'Christensen', 2, null),
('David', 'De Bruyne', 1, 1),
('Vinicius', 'Junior', 4, null),
('Sergio', 'Ramos', 3, 3),
('Toni', 'Kroos', 6, null),
('Christian', 'Pulisic', 5, 5),
('Lewis', 'Hamilton', 7, null),
('Kate', 'Bush', 8, 7);