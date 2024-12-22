SELECT
    gr.name AS "Employee Id:Link/Employee:200",
    gr.employee_name AS "Employee Name",
    gr.date_of_birth AS "Deadline:Date:120",
    DATEDIFF(gr.date_of_birth, CURDATE()) AS "Remaining Days:Int:120",
    Null as "Month remaining",
    Null as "Retirement Date"
FROM
    `tabEmployee` gr
WHERE
    DATEDIFF(gr.date_of_birth, CURDATE()) > 0
ORDER BY
    gr.date_of_birth ASC;