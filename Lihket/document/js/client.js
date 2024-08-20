frappe.ui.form.on('desgin team  table for perdiem cost', {
	man_field: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee(frm, cdt, cdn);
	},
	man_office: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee(frm, cdt, cdn);
	},
	monthly_ratebirr: function(frm, cdt, cdn) {
		console.log("i am rate")
		updateTotalfee(frm, cdt, cdn);
	},
	nr_of_professionals: function(frm, cdt, cdn) {
		console.log("i am pro")
		updateTotalfee(frm, cdt, cdn);
	},
});


//This was Design Team Table
function updateTotalfee(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	
		console.log("all satisfied")
		var result = child.man_field + child.man_office;
		child.man_total = result;
		console.log("result", child.man_total)
		frm.refresh_field('table1');
		if(child.nr_of_professionals && child.monthly_ratebirr){
			var totalfee = child.nr_of_professionals * child.monthly_ratebirr * result;
			child.total_fee_birr = totalfee;
			frm.refresh_field('table1');
		}
		CalculateSubTotalOfDesignTeam(frm);
	

}

function CalculateSubTotalOfDesignTeam(frm) {
	var subTotal = 0;
	frm.doc['table1'].forEach(function(row) {
		subTotal += row.total_fee_birr || 0;
	});

	frm.set_value('sub_total1', subTotal);
	frm.refresh_field('sub_total1');

}
//Table 2 
frappe.ui.form.on('Control Points Surveying Team DGPS Table', {
	field: function(frm, cdt, cdn) {
		updateTotalfeee(frm, cdt, cdn);
	},
	office: function(frm, cdt, cdn) {
		updateTotalfeee(frm, cdt, cdn);
	},
	nr_of_professionals: function(frm, cdt, cdn) {
		updateTotalfeee(frm, cdt, cdn);
	},
	monthly_ratebirr: function(frm, cdt, cdn) {
		updateTotalfeee(frm, cdt, cdn);
	},
});


//This was Design Team Table
function updateTotalfeee(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	var result = child.field + child.office;
	var totalfee = child.nr_of_professionals * (child.field + child.office) * child.monthly_ratebirr;


	frappe.model.set_value(cdt, cdn, 'total', result);
	frappe.model.set_value(cdt, cdn, 'total_fee_birr', totalfee);
	CalculateSubTotalOfControlSurveyingTeam(frm);
}
function CalculateSubTotalOfControlSurveyingTeam(frm) {
	var subTotal1 = 0;
	frm.doc['table2'].forEach(function(row) {
		subTotal1 += row.total_fee_birr || 0;
	});

	frm.set_value('sub_total2', subTotal1);
	frm.refresh_field('sub_total2');

}

//Table 3
frappe.ui.form.on('Topgraphic Surveying Team TS Table', {
	field: function(frm, cdt, cdn) {
		updateTotalfeeee(frm, cdt, cdn);
	},
	office: function(frm, cdt, cdn) {
		updateTotalfeeee(frm, cdt, cdn);
	},
	nr_of_professionals: function(frm, cdt, cdn) {
		updateTotalfeeee(frm, cdt, cdn);
	},
	monthly_ratebirr: function(frm, cdt, cdn) {
		updateTotalfeeee(frm, cdt, cdn);
	},
});


//This was Topgraphic Surveying Team TS Table
function updateTotalfeeee(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	var result = child.field + child.office;
	var totalfee = child.nr_of_professionals * (child.field + child.office) * child.monthly_ratebirr;


	frappe.model.set_value(cdt, cdn, 'total', result);
	frappe.model.set_value(cdt, cdn, 'total_fee_birr', totalfee);
	CalculateSubTotalOfTopgraphicSurveyingTeamTSTable(frm);
}
function CalculateSubTotalOfTopgraphicSurveyingTeamTSTable(frm) {
	var subTotal3 = 0;
	frm.doc['table3'].forEach(function(row) {
		subTotal3 += row.total_fee_birr || 0;
	});

	frm.set_value('sub_total3', subTotal3);
	frm.refresh_field('sub_total3');

}


//Table 4 
frappe.ui.form.on('Assistant Team Table', {
	field: function(frm, cdt, cdn) {
		updateTotalfeeel(frm, cdt, cdn);
	},
	office: function(frm, cdt, cdn) {
		updateTotalfeeel(frm, cdt, cdn);
	},
	nr_of_professionals: function(frm, cdt, cdn) {
		updateTotalfeeel(frm, cdt, cdn);
	},
	monthly_ratebirr: function(frm, cdt, cdn) {
		updateTotalfeeel(frm, cdt, cdn);
	},
});


//This was Assistant Team
function updateTotalfeeel(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	var result = child.field + child.office;
	var totalfee = child.nr_of_professionals * (child.field + child.office) * child.monthly_ratebirr;


	frappe.model.set_value(cdt, cdn, 'total', result);
	frappe.model.set_value(cdt, cdn, 'total_fee_birr', totalfee);
	CalculateSubTotalOfAssintantTeam(frm);
}
function CalculateSubTotalOfAssintantTeam(frm) {
	var subTotal4 = 0;
	frm.doc['table4'].forEach(function(row) {
		subTotal4 += row.total_fee_birr || 0;
	});

	frm.set_value('sub_total4', subTotal4);
	frm.refresh_field('sub_total4');
	updateTotalG(frm);



}


//Grand total

function updateTotalG(frm) {
	// Initialize total to 0
	var total = 0;

	// Check if all sub-totals have values
	if (frm.doc.sub_total4 && frm.doc.sub_total3 && frm.doc.sub_total2 && frm.doc.sub_total1) {
		// Calculate total by adding sub-totals
		total = frm.doc.sub_total4 + frm.doc.sub_total3 + frm.doc.sub_total2 + frm.doc.sub_total1;

		// Update the 'total' field value in the document
		frm.set_value('total', total);

		// Refresh the display of the 'total' field
		frm.refresh_field('total');
	}
}







