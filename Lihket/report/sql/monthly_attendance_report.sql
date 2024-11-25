SELECT 
    r.employee AS "Employee:Link/Employee",
    r.employee_name AS "Employee Name",
    r.department AS "Department:Link/Department",
     
    GROUP_CONCAT(
        CASE 
            WHEN r.status = 'Present' THEN 'P' 
            WHEN r.status = 'Absent' THEN 'A' 
            WHEN r.status = 'Half Day' THEN 'HF'
            WHEN r.status = 'On Field' THEN 'F'
            WHEN r.status = 'On Education' THEN 'E'
            WHEN r.status = 'On Holiday' THEN 'H'
            WHEN r.status = 'On Sunday' THEN 'S'
            ELSE ''
        END
        ORDER BY r.attendance_date
        SEPARATOR ', '
    ) AS "Attendance Record",
    
    -- Attendance Type Totals
    COUNT(CASE WHEN r.status = 'Present' THEN 1 END) AS "Total Present",
    COUNT(CASE WHEN r.status = 'Absent' THEN 1 END) AS "Total Absent",
    COUNT(CASE WHEN r.status = 'Half Day' THEN 1 END) AS "Total Half Days",
    COUNT(CASE WHEN r.status = 'On Field' THEN 1 END) AS "Total On-Field",
    COUNT(CASE WHEN r.status = 'On Education' THEN 1 END) AS "Total On-Education",
    COUNT(CASE WHEN r.status = 'On Holiday' THEN 1 END) AS "Total On-Holiday",
    COUNT(CASE WHEN r.status = 'On Sunday' THEN 1 END) AS "Total On-Sunday",

    -- Aggregate leave days and leave types
    COALESCE(leave_summary.exact_leave_days, 0) AS "Total Leave Days",
    leave_summary.leave_types AS "Leave Types",

    -- Salary Days Calculation
    SUM(
        CASE 
            WHEN r.status IN ('Present', 'On Field', 'On Education', 'On Holiday', 'On Sunday') THEN 1 
            WHEN r.status = 'Half Day' THEN 0.5 
            ELSE 0 
        END
    ) + COALESCE(leave_summary.exact_leave_days, 0) AS "Total Salary Days"
FROM 
    (
        -- Attendance Records with Rankings for Accurate Aggregation
        SELECT 
            e.employee,
            e.employee_name,
            e.department,
            e.status,
            e.attendance_date,
            ROW_NUMBER() OVER (
                PARTITION BY e.employee, e.attendance_date 
                ORDER BY 
                    CASE 
                        WHEN e.status = 'Present' THEN 1
                        WHEN e.status = 'On Field' THEN 2
                        WHEN e.status = 'On Education' THEN 3
                        WHEN e.status = 'On Holiday' THEN 4
                        WHEN e.status = 'On Sunday' THEN 5
                        WHEN e.status = 'Half Day' THEN 6
                        WHEN e.status = 'Absent' THEN 7
                        ELSE 8
                    END
            ) AS rank
        FROM 
            tabAttendance e
        WHERE 
            DATE(e.attendance_date) BETWEEN %(from_attendance_date)s AND %(to_attendance_date)s
    ) r
LEFT JOIN 
    (
        -- Refined Leave Summary with Exact Day Calculation
        SELECT 
            employee,
            GROUP_CONCAT(DISTINCT leave_type ORDER BY leave_type SEPARATOR ', ') AS leave_types,
            SUM(
                CASE 
                    WHEN from_date <= %(to_attendance_date)s AND to_date >= %(from_attendance_date)s 
                    THEN 
                        DATEDIFF(
                            LEAST(to_date, %(to_attendance_date)s), 
                            GREATEST(from_date, %(from_attendance_date)s)
                        ) + 1
                    ELSE 0
                END
            ) AS exact_leave_days
        FROM 
            `tabLeave Application`
        WHERE 
            workflow_state = 'Approved'
            AND (
                from_date <= %(to_attendance_date)s
                AND to_date >= %(from_attendance_date)s
            )
        GROUP BY 
            employee
    ) leave_summary ON r.employee = leave_summary.employee
WHERE 
    r.rank = 1
GROUP BY 
    r.employee, r.employee_name, r.department, leave_summary.leave_types
ORDER BY 
    r.employee_name;
