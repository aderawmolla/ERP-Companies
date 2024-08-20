frappe.ui.form.on('Participating staffs salary', {
	field: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee(frm, cdt, cdn);
	},
	office: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee(frm, cdt, cdn);
	},
	monthly_rate: function(frm, cdt, cdn) {
		console.log("i am rate")
		updateTotalfee(frm, cdt, cdn);
	},
	nr: function(frm, cdt, cdn) {
		console.log("i am pro")
		updateTotalfee(frm, cdt, cdn);
	},
});


frappe.ui.form.on('Perdeigm Cost', {
	field: function(frm, cdt, cdn) {
		console.log("i am month")
		updatePerdiem(frm, cdt, cdn);
	},
	office: function(frm, cdt, cdn) {
		console.log("i am month")
		updatePerdiem(frm, cdt, cdn);
	},
	monthly_rate: function(frm, cdt, cdn) {
		console.log("i am rate")
		updatePerdiem(frm, cdt, cdn);
	},
	nr: function(frm, cdt, cdn) {
		console.log("i am pro")
		updatePerdiem(frm, cdt, cdn);
	},
});
function  updatePerdiem(frm,cdt,cdn){
  var child=locals[cdt][cdn]
  var total=(child.office||0+child.field||0)*(child.nr||1)
  child.total=(child.office||0+child.field||0)*child.nr
  child.total_amount__etb_birr=total*(child.monthly_rate||0)
  frm.refresh_field("table6")
  updateTotalPerdiem(frm);

}


function updateTotalPerdiem(frm){
	var totalAmount = 0;
	$.each(frm.doc.table6, function(i, d) {
		// calculate incentive
		 totalAmount+=d.monthly_rate
	});
	frm.set_value("sub_total6",totalAmount)
    frm.refresh_field("sub_total6")
}

function updateTotalfee(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	if (child.field && child.office ) {
		console.log("all satisfied")
		var result = child.field + child.office;
		child.total = result;
		console.log("result", child.total)
		frm.refresh_field('tabel_1');
		if(child.nr && child.monthly_rate){
			var totalfee = child.nr * child.monthly_rate * result;
			child.total_amount__etb_birr = totalfee;
			frm.refresh_field('tabel_1');
		}
		CalculateSubTotalOfDesignTeam(frm);
	}

}

function CalculateSubTotalOfDesignTeam(frm) {
	var subTotal = 0;
	frm.doc['tabel_1'].forEach(function(row) {
		subTotal += (row.total_amount__etb_birr || 0);
	});

	frm.set_value('sub_total1', subTotal);
	frm.refresh_field('sub_total1');
	frm.doc.table_7[0].amount_etb_birr = subTotal 
	frm.refresh_field('table_7');
	calculateTotal(frm)

}



//Table 2 
frappe.ui.form.on('Perdiem Cost B', {
	field: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee2(frm, cdt, cdn);
	},
	office: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee2(frm, cdt, cdn);
	},
	monthly_rate: function(frm, cdt, cdn) {
		console.log("i am rate")
		updateTotalfee2(frm, cdt, cdn);
	},
	nr: function(frm, cdt, cdn) {
		console.log("i am pro")
		updateTotalfee2(frm, cdt, cdn);
	},
});


//This was Design Team Table
function updateTotalfee2(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	if (child.field && child.office ) {
		console.log("all satisfied")
		var result = child.field + child.office;
		child.total = result;
		console.log("result", child.total)
		frm.refresh_field('table_2');
		if(child.nr && child.monthly_rate){
			var totalfee = child.nr * child.monthly_rate * result;
			child.total_amount__etb_birr = totalfee;
			frm.refresh_field('table_2');
		}
		CalculateSubTotalOfDesignTeam2(frm);
	}

}

function CalculateSubTotalOfDesignTeam2(frm) {
	var subTotal = 0;
	frm.doc['table_2'].forEach(function(row) {
		subTotal += row.total_amount__etb_birr || 0;
	});

	frm.set_value('sub_total2', subTotal);
	frm.refresh_field('sub_total2');
	frm.doc.table_7[1].amount_etb_birr = subTotal 
	frm.refresh_field('table_7');
	calculateTotal(frm)

}

//Table 3
frappe.ui.form.on('Vehicle Rent and fuel Cost table', {
	monthly_unit_rate: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee3(frm, cdt, cdn);
	},
	car_months: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee3(frm, cdt, cdn);
	},
	nr: function(frm, cdt, cdn) {
		console.log("i am pro")
		updateTotalfee3(frm, cdt, cdn);
	},
});


//This was Design Team Table
function updateTotalfee3(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	if (child.monthly_unit_rate && child.car_months && child.nr ) {
		console.log("all satisfied")
		var result = child.monthly_unit_rate * child.car_months * child.nr;
		child.total_amountt = result;
		console.log("result", child.total_amountt)
		frm.refresh_field('table_3');

		CalculateSubTotalOfDesignTeam3(frm);
	}

}

function CalculateSubTotalOfDesignTeam3(frm) {
	var subTotal = 0;
	frm.doc['table_3'].forEach(function(row) {
		subTotal += row.total_amountt || 0;
	});

	frm.set_value('sub_total3', subTotal);
	frm.refresh_field('sub_total3');
	frm.doc.table_7[2].amount_etb_birr = subTotal 
	frm.refresh_field('table_7');
	calculateTotal(frm)

}


//Table 4
frappe.ui.form.on('Surveying equipments Depreciation Cost 1', {
	montly_uint_rate: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee4(frm, cdt, cdn);
	},
	duration_months: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee4(frm, cdt, cdn);
	},
	nr: function(frm, cdt, cdn) {
		console.log("i am pro")
		updateTotalfee4(frm, cdt, cdn);
	},
});


//This was Design Team Table
function updateTotalfee4(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	if (child.montly_uint_rate && child.duration_months && child.nr ) {
		console.log("all satisfied")
		var result = child.duration_months * child.montly_uint_rate * child.nr;
		child.total__amount_birr = result;
		console.log("result", child.total__amount_birr)
		frm.refresh_field('table_4');

		CalculateSubTotalOfDesignTeam4(frm);
	}

}
function CalculateSubTotalOfDesignTeam4(frm) {
	var subTotal = 0;
	frm.doc['table_4'].forEach(function(row) {
		subTotal += row.total__amount_birr || 0;
	});

	frm.set_value('sub_total4', subTotal);
	frm.refresh_field('sub_total4');
	frm.doc.table_7[3].amount_etb_birr = subTotal 
	frm.refresh_field('table_7');
	calculateTotal(frm)

}


//Table 5
frappe.ui.form.on('Office Equipment  and furniture depreciation cost', {
	montly_uint_rate: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee5(frm, cdt, cdn);
	},
	duration_months: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee5(frm, cdt, cdn);
	},
	nr: function(frm, cdt, cdn) {
		console.log("i am pro")
		updateTotalfee5(frm, cdt, cdn);
	},
});


//This was Design Team Table
function updateTotalfee5(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	if (child.montly_uint_rate && child.duration_months && child.nr ) {
		console.log("all satisfied")
		var result = child.duration_months * child.montly_uint_rate * child.nr;
		child.total__amount_birr = result;
		console.log("result", child.total__amount_birr)
		frm.refresh_field('table_5');

		CalculateSubTotalOfDesignTeam5(frm);
	}

}

function CalculateSubTotalOfDesignTeam5(frm) {
	var subTotal = 0;
	frm.doc['table_5'].forEach(function(row) {
		subTotal += row.total__amount_birr || 0;
	});

	frm.set_value('sub_total5', subTotal);
	frm.refresh_field('sub_total5');
	frm.doc.table_7[4].amount_etb_birr = subTotal 
	frm.refresh_field('table_7');
	calculateTotal(frm)

}


//Table 6
frappe.ui.form.on('Communication and other accessories B', {
	montly_uint_rate: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee6(frm, cdt, cdn);
	},
	duration_months: function(frm, cdt, cdn) {
		console.log("i am month")
		updateTotalfee6(frm, cdt, cdn);
	},
	nr: function(frm, cdt, cdn) {
		console.log("i am pro")
		updateTotalfee6(frm, cdt, cdn);
	},
});


//This was Design Team Table
function updateTotalfee6(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	if (child.montly_uint_rate && child.duration_months && child.nr ) {
		console.log("all satisfied")
		var result = child.duration_months * child.montly_uint_rate * child.nr;
		child.total__amount_birr = result;
		console.log("result", child.total__amount_birr)
		frm.refresh_field('table_6');

		CalculateSubTotalOfDesignTeam6(frm);
	}

}

function CalculateSubTotalOfDesignTeam6(frm) {
	var subTotal = 0;
	frm.doc['table_6'].forEach(function(row) {
		subTotal += row.total__amount_birr || 0;
	});

	frm.set_value('sub_total6', subTotal);
	frm.refresh_field('sub_total6');

	frm.doc.table_7[5].amount_etb_birr = subTotal 
	frm.refresh_field('table_7');
	calculateTotal(frm)

}

//the overll table
frappe.ui.form.on('Project Agreement', {
	onload: function(frm, cdt, cdn) {
		console.log("i am here")
		var table = frm.doc.table_7
		if (!table) {
			frm.set_value("table_7", []);
			var row = frappe.model.add_child(frm.doc, "Breakdown of Financial Proposal by Activity", "table_7");
			row.description = "Participating Staff Salary";

			var row1 = frappe.model.add_child(frm.doc, "Breakdown of Financial Proposal by Activity", "table_7");
			row1.description = "Perdiem Cost for  Professional staffs";

			var row2 = frappe.model.add_child(frm.doc, "Breakdown of Financial Proposal by Activity", "table_7");
			row2.description = "Vehicles fuel  and  Rental  cost";

			var row3 = frappe.model.add_child(frm.doc, "Breakdown of Financial Proposal by Activity", "table_7");
			row3.description = "Surveying equipment’s Depreciation Cost";

			var row4 = frappe.model.add_child(frm.doc, "Breakdown of Financial Proposal by Activity", "table_7");
			row4.description = "Office Equipment  and furniture depreciation cost";

			var row5 = frappe.model.add_child(frm.doc, "Breakdown of Financial Proposal by Activity", "table_7");
			row5.description = "Communication and other accessories";


			frm.refresh_field("table_7");
		}
	},

});

function calculateTotal(frm){
	var total = 0;
	frm.doc.table_7.map((row, index) => {
		total += row.amount_etb_birr || 0
	})
	frm.doc.total = total;
	frm.doc.vat =  total + (total * 0.15);
	frm.doc.grand =  total + (total * 0.15);

	frm.refresh_field("total")
	frm.refresh_field("vat")
	frm.refresh_field("grand")
}


frappe.ui.form.on("Professional Fee",{
	overhead_percentage:function(frm,cdt,cdn){
	  console.log("this code is gonna excuted")
	calculateFinanceRelated(frm,frm.doc.overhead_percentage,"over_head_amount")
	},
	profit_margin_percent:function(frm,cdt,cdn){
	
	calculateFinanceRelated(frm,frm.doc.profit_margin_percent,"profit_margin_amount")
	}
	
	});
	
	function calculateFinanceRelated(frm,byWhat,what){
	  
	let value=parseFloat(frm.doc.total__final)*(byWhat*0.01)
	console.log("The value for this is",value)
	frm.doc[what]=value
	frm.refresh_field(what)
	
	}