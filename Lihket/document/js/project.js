frappe.ui.form.on("Lproject", {
    expected_project_duration_in_days: function(frm, cdt, cdn) {
        if (frm.doc.expected_project_start_date) {
            var date = calculateEndDate(frm.doc.expected_project_start_date, frm.doc.expected_project_duration_in_days);
            frm.set_value("expected_project_end_date", date);
            frm.refresh_field("expected_project_end_date");
        }
    }
});
function calculateEndDate(startDate, duration) {
    // Convert startDate to Date object
    const start = new Date(startDate);
    // Add duration (in days) to the start date
    const end = new Date(start);
    end.setDate(start.getDate() + parseInt(duration, 10));
    // Format the end date to DD-MM-YYYY
    const year = end.getFullYear();
    const month = String(end.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(end.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
}
