INSERT INTO department (name)
VALUES
('Engineering'),
('Finance'),
('Sales'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Software Engineer Manager', 120000, 1),
('Software Engineer', 110000, 1),
('Accountant', 125000, 2),
('Salesperson', 80000, 3),
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Thomas', 'Muller', 1, NULL),
('Devin', 'De Bruyne', 2, 1),
('Chris', 'Brown', 3, 2),
('Lewis', 'Hamilton', 4, 3),
('Ana', 'De Paul', 5, 4);
