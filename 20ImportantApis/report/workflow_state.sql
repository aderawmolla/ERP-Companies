SELECT 
employee_name,
leave_type,
COUNT(*) AS leave_days
FROM 
`tabLeave Application`
WHERE 
workflow_state = 'Approved'
AND (
DATE(from_date) BETWEEN %(from_attendance_date)s AND %(to_attendance_date)s
OR DATE(to_date) BETWEEN %(from_attendance_date)s AND %(to_attendance_date)s
)
GROUP BY 
employee_name, leave_type