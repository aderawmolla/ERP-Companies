frappe.ui.form.on('Employee', {
    refresh: function(frm) {
        if (frm.doc.date_of_birth) {
            // Get today's date
            const today = new Date();
            const dob = new Date(frm.doc.date_of_birth);

            // Calculate age
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            const dayDiff = today.getDate() - dob.getDate();

            // Adjust age if the current month/day is before the birth month/day
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }

            // Set the calculated age to a custom field named 'age'
            frm.set_value('age', age); // Ensure 'age' field exists in Employee doctype
            frm.refresh_field('age');
        }
    }
});