
frappe.ui.form.on("Accident Insurance Followup", {
    date_of_accident_ec:function(frm, cdt, cdn) {
        if(frm.doc.date_of_accident_ec) {

            var finalgc = convertDateTOGC(frm.doc.date_of_accident_ec.toString());
            frm.doc.የአደጋው_ቀን = finalgc;
            refresh_field("የአደጋው_ቀን");
            
        }
    }
});

frappe.ui.form.on("Accident Insurance Followup", {
    completed_date_ec:function(frm, cdt, cdn) {
        if(frm.doc.completed_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.completed_date_ec.toString());
            
            var dateObject = new Date(finalgc);
            // Format the date as a string in a desired format
                var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
             frm.set_value("completed_gc", formattedDate);
            frm.refresh_field("completed_gc")
            
        }
    }
});