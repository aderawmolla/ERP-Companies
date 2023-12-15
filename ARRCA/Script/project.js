cur_frm.add_fetch('id', 'subject', 'activity_name');


frappe.ui.form.on('Project', {
	expected_end_date: function(frm) {
		if (frm.doc.expected_start_date && frm.doc.expected_end_date) {
			var expected_start_date = frappe.datetime.str_to_obj(frm.doc.expected_start_date);
			var expected_end_date = frappe.datetime.str_to_obj(frm.doc.expected_end_date);

			var year_diff = expected_end_date.getFullYear() - expected_start_date.getFullYear();
			var month_diff = expected_end_date.getMonth() - expected_start_date.getMonth();
			var day_diff = expected_end_date.getDate() - expected_start_date.getDate();

			var total_months = year_diff * 12 + month_diff + day_diff / 30; // Approximate days in a month

			var year_diff_decimal = total_months / 12;
			frm.set_value('duration_in_years', year_diff_decimal.toFixed(2));
			console.log("duration_in_years", year_diff_decimal.toFixed(2));
			frm.refresh_field("duration_in_years")
		}
	}
});



frappe.ui.form.on("Project", {
	duration_in_years: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.duration_in_years * 365));
	}
});


frappe.ui.form.on("Project", {
    expected_start_date_ec:function(frm, cdt, cdn) {
        if(frm.doc.expected_start_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.expected_start_date_ec.toString());
            frm.doc.expected_start_date = finalgc;
            refresh_field("expected_start_date");
            
        }
    }
});


frappe.ui.form.on("Project", {
    expected_end_date_ec:function(frm, cdt, cdn) {
        if(frm.doc.expected_end_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.expected_end_date_ec.toString());
            frm.doc.expected_end_date = finalgc;
            refresh_field("expected_end_date");
            
        }
    }
});

frappe.ui.form.on("Project", {
    actual_start_date_ec:function(frm, cdt, cdn) {
        if(frm.doc.actual_start_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.actual_start_date_ec.toString());
            frm.doc.actual_start_date = finalgc;
            refresh_field("actual_start_date");
            
        }
    }
});

frappe.ui.form.on("Project", {
    actual_end_date_ec:function(frm, cdt, cdn) {
        if(frm.doc.actual_end_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.actual_end_date_ec.toString());
            frm.doc.actual_end_date= finalgc;
            refresh_field("actual_end_date");
            
        }
    }
});

frappe.ui.form.on("Project", {
    project_commencement_date_ec:function(frm, cdt, cdn) {
        if(frm.doc.project_commencement_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.project_commencement_date_ec.toString());
            frm.doc.project_commencement_date= finalgc;
            refresh_field("project_commencement_date");
            
        }
    }
});
frappe.ui.form.on('Project Accomplishment', {
    total_contract_qty: function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        calculateRemainingQty(frm,child)
    } ,
    pervious_executed_qty: function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        calculateRemainingQty(frm,child)
    } ,
    contract_amount:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        calculateRemainingAmount(frm,child)
    } ,
    excuted_amount:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        calculateRemainingAmount(frm,child)
    } ,
    
})
function calculateRemainingQty(frm,child){
   var difference=child.pervious_executed_qty- child.total_contract_qty
   child.remaining_qty=difference
   frm.refresh_field("project_accomplishment")
}
function calculateRemainingAmount(frm,child){
    var difference=child.excuted_amount-child.contract_amount
    child.remaining_amount=difference
    frm.refresh_field("project_accomplishment")
}