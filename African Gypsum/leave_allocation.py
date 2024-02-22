@frappe.whitelist()
def mark_employee_attendance(employee_list, status, date, crew, leave_type=None, company=None):
  employee_list = json.loads(employee_list)
  for employee in employee_list:
    attendance = frappe.new_doc("Attendance")
    attendance.employee = employee['employee']
    attendance.employee_name = employee['employee_name']
    attendance.attendance_date = date
    attendance.status = status
    attendance.crew = crew

    if status == "On Leave" and leave_type:
      attendance.leave_type = leave_type
    if company:
      attendance.company = company
    else:
      attendance.company = frappe.db.get_value("Employee", employee['employee'], "Company")
    attendance.submit()