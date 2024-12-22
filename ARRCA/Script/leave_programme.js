
// Calculate requested and given incentives for each row
frappe.ui.form.on('Leave Programme Table', {
    requested: function(frm) {
        let total_requested = 0;
        $.each(frm.doc.programm_table, function(i, d) {
            total_requested += flt(d.requested); // Sum up the 'requested' field
        });
        frm.doc.requested = total_requested; // Assign the total to the parent field
        frm.refresh_field("requested");
    },
    given: function(frm) {
        let total_given = 0;
        $.each(frm.doc.programm_table, function(i, d) {
            total_given += flt(d.given); // Sum up the 'given' field
        });
        frm.doc.given = total_given; // Assign the total to the parent field
        frm.refresh_field("given");
    }
});

// Calculate total leaves allocated based on budget year
frappe.ui.form.on('Annual Leave Programme', {
    leave_type: function (frm) {
        if (frm.doc.employee && frm.doc.leave_type) {
            console.log("Filtering by budget year:", frm.doc.budget_year);

            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Leave Allocation",
                    filters: {
                        employee: frm.doc.employee, // Match the employee
                        leave_type: frm.doc.leave_type // Filter by leave type
                    },
                    fields: ["from_date", "to_date", "new_leaves_allocated"] // Fetch required fields
                },
                callback: function (r) {
                    if (r.message) {
                        console.log("All leave entries:", r.message);

                        // Calculate the total new leaves allocated
                        const totalLeavesAllocated = r.message.reduce((total, entry) => {
                            return total + (entry.new_leaves_allocated || 0); // Sum up 'new_leaves_allocated'
                        }, 0);

                        console.log("Total new leaves allocated:", totalLeavesAllocated);

                        // Set the calculated value in the appropriate field
                      frm.set_value("unused_annual_leave_balance", totalLeavesAllocated);
                    frm.refresh_field('unused_annual_leave_balance');
                    }
                }
            });
        }
    }
});
