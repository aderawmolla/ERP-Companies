// Additional permission check (clarify this if necessary)

cur_frm.add_fetch('id', 'subject', 'activity_name');
cur_frm.add_fetch('id', 'unit', 'unit');


frappe.ui.form.on("Projects", {
    refresh: function(frm) {
        if (frm.doc.expected_project_start_date && frm.doc.status !== "Submitted") {
            getDurationInDays(frm);
        }
    },
    expected_project_start_date: function(frm) {
        if (frm.doc.expected_project_start_date) {
            setFieldInGC(frm, "expected_project_start_date", "expected_project_start_date_gc");
            frm.set_value("project_type", "Existing");
            frm.refresh_field("project_type");
            getDurationInDays(frm);
        }
    },
    
    expected_project_end_date_ec: function(frm) {
        if (frm.doc.expected_project_end_date_ec) {
            setFieldInGC(frm, "expected_project_end_date_ec", "expected_end_date_gc");
            calculateYears(frm);  // Call calculateYears to set the contract period
        }
    }
});

function calculateYears(frm) {
    // Get the start and end dates
    const startDate = frm.doc.expected_project_start_date;
    const endDate = frm.doc.expected_project_end_date_ec;

    // Check if both dates are present
    if (startDate && endDate) {
        // Convert the dates to JavaScript Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the difference in years
        let yearsDifference = end.getFullYear() - start.getFullYear();

        // Adjust if the end date hasn't reached the same month and day as start date
        if (
            end.getMonth() < start.getMonth() ||
            (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
        ) {
            yearsDifference -= 1;
        }

        // Set the year difference in the contract_period_in_years field as a string
        frm.set_value("contract_period_in_years", yearsDifference.toString());
        frm.refresh_field("contract_period_in_years");
    }
}


function setFieldInGC(frm, ec_field, gc_field) {
    if (frm.doc[ec_field] && gc_field) {
        let date = convertDateTOGC(frm.doc[ec_field].toString());
        let dateObject = new Date(date);
        
        // Format the date as a string in YYYY-MM-DD format
        let formattedDate = dateObject.toISOString().slice(0, 10);
        frm.set_value(gc_field, formattedDate);
        frm.refresh_field(gc_field);
    }
}

function getDurationInDays(frm) {
    console.log("getDurationInDays function executed.");
    let today = frappe.datetime.get_today();
    // Calculate the duration
    let duration = frappe.datetime.get_day_diff(today, frm.doc.expected_project_start_date_gc);
    // Display the duration in days (if it's negative, set it to 0)
    console.log("day difference is",duration)
    frm.set_value('actual_project_duration_in_days', duration >= 0 ? duration : 0);
    frm.refresh_field('actual_project_duration_in_days');
}


// Project history
frappe.ui.form.on('Project Accomplishment', {
    pervious_executed_qty: function(frm, cdt, cdn) {
        calculateDifference(frm, cdt, cdn, 'total_contract_qty', 'pervious_executed_qty', 'remaining_quantity');
        calculateProgress(frm, cdt, cdn, 'total_contract_qty', 'pervious_executed_qty')
    },
    total_contract_qty: function(frm, cdt, cdn) {
        calculateDifference(frm, cdt, cdn, 'total_contract_qty', 'pervious_executed_qty', 'remaining_quantity');
        calculateProgress(frm, cdt, cdn, 'total_contract_qty', 'pervious_executed_qty')

    },
    executed_amount: function(frm, cdt, cdn) {
        calculateDifference(frm, cdt, cdn, 'contract_amount', 'executed_amount', 'remaining_amount');
    },
    contract_amount: function(frm, cdt, cdn) {
        calculateDifference(frm, cdt, cdn, 'contract_amount', 'executed_amount', 'remaining_amount');
    }
});

// Reusable function to calculate difference and refresh the field
function calculateDifference(frm, cdt, cdn, total_field, executed_field, remaining_field) {
    let child = locals[cdt][cdn];
    
    // Ensure fields have values before calculating difference
    if (child[total_field] && child[executed_field] !== undefined) {
        child[remaining_field] = child[total_field] - child[executed_field];
        frm.refresh_field("to_date_accomplishment");
    }
}

function calculateProgress(frm, cdt, cdn, total_qty_field, executed_qty_field) {
    let child = locals[cdt][cdn];

    // Ensure both fields have values before calculating the progress percentage
    if (child[total_qty_field] && child[executed_qty_field] !== undefined) {
        // Calculate physical progress percentage only if total quantity is greater than zero
        if (child[total_qty_field] > 0) {
            child.physical_progress_percentage = (child[executed_qty_field] / child[total_qty_field]) * 100;
        } else {
            child.physical_progress_percentage = 0; // Default to 0 if total quantity is zero or undefined
        }

        // Refresh the specific field to display the updated progress percentage
        frm.refresh_field('to_date_accomplishment');
    }
}
