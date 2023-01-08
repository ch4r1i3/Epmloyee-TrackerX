SELECT 
role.department_id AS department_id, employee.role_id AS role_id
FROM role
JOIN employee ON role.department = department.manager_id