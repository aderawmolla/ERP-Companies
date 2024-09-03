// to get a single value

frappe.call({
    method: "frappe.client.get_value",
    args: {
        doctype: 'Item',
        filters: { item_code: child.item_code },
        fieldname: ['stock_uom']
    },
    callback: function (response) {
        if (response.message) {
            // Update the "equipment_type" field in the current child table row
            frappe.model.set_value(cdt, cdn, "uom", response.message.stock_uom);
            frm.refresh();
            //  frappe.model.set_value(d.doctype, d.name, 'ot_total_in_birr', (d.ot_normal_amount + d.ot_knight_

        }
    }
});

// get list of values

frappe.call({
    method: "frappe.client.get_list",
    args: {
      doctype: "Operational Plan",
      filters: {
        start_date: frm.doc.start_date
          ? [">", frm.doc.start_date]
          : undefined,
        end_date: frm.doc.end_date ? ["<=", frm.doc.end_date] : undefined,
        project: frm.doc.project ? frm.doc.project : undefined,
        name: ["!=", frm.docname],
      },
    },
    callback: function (response) {
      if (response.message && Array.isArray(response.message)) {
        var records = response.message;
        if (records.length === 0) {
          frm.clear_table("cashflow_table");
          refresh_field("cashflow_table");
        } else {
          fetchAndLogAllFields(records[0].name, frm);
        }
      }
    },
  });
  // call the backend
  frappe.call({
    method: "erpnext.hr.doctype.employee_attendance_tool.employee_attendance_tool.mark_employee_attendance",
    args:{
      "employee_list":employee_present,
      "status":"Present",
      "date":frm.doc.date,
      "attendance_date_ec":frm.doc.attendance_date_ec,
      "company":frm.doc.company
    },

    callback: function(r) {
      erpnext.employee_attendance_tool.load_employees(frm);

    }
  });