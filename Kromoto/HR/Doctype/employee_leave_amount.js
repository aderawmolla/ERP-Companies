frappe.ui.form.on('Employee annual leave amount', {
    unused_annual_leave_balance: function(frm, cdt, cdn) {
        calculate_total(frm, cdt, cdn);
    },
    basic_salary: function(frm, cdt, cdn) {
        calculate_total(frm, cdt, cdn);
    },
});

function calculate_total(frm, cdt, cdn) {
    let doc = locals[cdt][cdn];
    let unused_annual_leave_balance= doc.unused_annual_leave_balance || 0;
    let basic_salary= doc.basic_salary|| 0;

    console.log("Unused annual leave balance:", unused_annual_leave_balance);
    console.log("Basic salary:", basic_salary);

    // Formula for severance calculation
    let result = unused_annual_leave_balance*basic_salary/26;
   frappe.model.set_value(cdt, cdn, 'annual_leave_amount_in_birr', result);
}


frappe.ui.form.on('Employee annual leave amount', {
    to_date: function (frm) {
        if (frm.doc.from_date) {
            console.log("I am calling this now")
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Leave Ledger Entry",
                    filters: {
                        employee: frm.doc.employee, // Match the employee
                        leave_type: "Annual Leave", // Change this if necessary
                        is_expired: 0, // Only include non-expired leaves
                        to_date: [">=", frm.doc.from_date], // Ensure the leave ends after `from_date`
                        from_date: ["<=", frm.doc.to_date] // Ensure the leave starts before `to_date`
                    },
                    fields: ["*"] // Only fetch the `leaves` field
                },
                callback: function (r) {
                    console.log("the origiginal message is ",r)
                    if (r.message) {
                        console.log("the message for the leave is ",r.message)
                        // Calculate the total unused leaves
                        const totalUnusedLeaves = r.message.reduce((total, entry) => total + (entry.leaves || 0), 0);
                        console.log("total unused leave is ",totalUnusedLeaves)
                        
                        // Set the value in the field
                        frm.set_value("unused_annual_leave_balance", totalUnusedLeaves);
                        frm.refresh_field('unused_annual_leave_balance');
                    }
                }
            });
        }
    }
});
