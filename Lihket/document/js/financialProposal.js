frappe.ui.form.on("Financial Proposal for Supervision", {
	participating_staff_salary: function (frm) {
	  calculate_totalSub(frm);
	},
	perdiem_cost_for__professional_staffs: function (frm) {
	  calculate_totalSub(frm);
	},
	vehicles_fuel__and__rental__cost: function (frm) {
	  calculate_totalSub(frm);
	},
	surveying_equipments_depreciation_cost: function (frm) {
	  calculate_totalSub(frm);
	},
	office_equipment__and_furniture_depreciation_cost: function (frm) {
	  calculate_totalSub(frm);
	},
	communication_and_other_accessories: function (frm) {
	  calculate_totalSub(frm);
	},
  });
  function calculate_totalSub(frm) {
	let totalSubValue = 0;
	let vat = 0;
	if (frm.doc.participating_staff_salary) {
	  totalSubValue += frm.doc.participating_staff_salary;
	}
	if (frm.doc.perdiem_cost_for__professional_staffs) {
	  totalSubValue += frm.doc.perdiem_cost_for__professional_staffs;
	}
	if (frm.doc.vehicles_fuel__and__rental__cost) {
	  totalSubValue += frm.doc.vehicles_fuel__and__rental__cost;
	}
	if (frm.doc.surveying_equipments_depreciation_cost) {
	  totalSubValue += frm.doc.surveying_equipments_depreciation_cost;
	}
	if (frm.doc.office_equipment__and_furniture_depreciation_cost) {
	  totalSubValue += frm.doc.office_equipment__and_furniture_depreciation_cost;
	}
	if (frm.doc.communication_and_other_accessories) {
	  totalSubValue += frm.doc.communication_and_other_accessories;
	}
	  
	frm.set_value("total__final", totalSubValue);
	vat = parseFloat(frm.doc.total__final) * 0.15;
	frm.set_value("vat_display", vat);

	frm.set_value(
	  "grand_total__in_etb2",
	  frm.doc.total__final + frm.doc.vat_display
	);
  }






  frappe.ui.form.on("Participating staffs salary B", {
	refresh: function (frm) {
	  calculate_total_days(frm);
	  console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
	},
	validate: function (frm) {
	  calculate_total_days(frm);
	  console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
	},
	table1: function (frm) {
	  calculate_total_days(frm);
	  console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
	},
	table1_remove: function (frm) {
	  calculate_total_days(frm);
	},
	nr: function (frm, cdt, cdn) {
	  calculate_total_days(frm);
	},
	field: function (frm, cdt, cdn) {
	  calculate_total_days(frm);
	},
	office: function (frm, cdt, cdn) {
	  calculate_total_days(frm);
	},
	monthly_rate: function (frm, cdt, cdn) {
	  calculate_total_days(frm);
	},

	participants:function (frm, cdt, cdn) {

		var child=locals[cdt][cdn]
		getMonthlySalary(frm,child);
	  },

  });
	function getMonthlySalary(frm,child){
		console.log("congratulations I am excuting")
		frappe.call({
			method: "frappe.client.get_list",
			args: {
				doctype: 'Monthly Cost Table',
				filters: { position: child.participants },
				fields: ['total_salary']
			},
			callback: function (response) {
				if (response.message) {
					child.monthly_rate=response.message[0].total_salary
					// Update the "equipment_type" field in the current child table row
					frm.refresh_field("table1");
					//  frappe.model.set_value(d.doctype, d.name, 'ot_total_in_birr', (d.ot_normal_amount + d.ot_knight_

				}
			}
		});


	}





function calculate_total_days(frm) {
	let total_days = 0;
	let overall_sum = 0;

	if (Array.isArray(frm.doc.table1)) {
		frm.doc.table1.forEach(function (row) {
			if (row.nr && row.field) {
				// Calculate total_days for the current row
				total_days = parseFloat(row.nr) * row.field + (row.office || 0);
				frappe.model.set_value(row.doctype, row.name, "total", total_days);

				// If monthly_rate is defined, add to overall_sum
				if (row.monthly_rate) {
					overall_sum += (total_days * row.monthly_rate);
					frappe.model.set_value(row.doctype, row.name, "total_amount__etb_birr", total_days * row.monthly_rate);
				}
			}
		});
	} else {
		console.log("table1 is not an array or is undefined"); // Debugging log
	}

	console.log("Overall Sum Calculated:", overall_sum); // Debugging log

	// Set the calculated overall sum in the form fields
	frm.set_value("sub_total", overall_sum);
	frm.set_value("participating_staff_salary", overall_sum);
	frm.refresh_field("sub_total");
	frm.refresh_field("participating_staff_salary");
}







  //table 2
  frappe.ui.form.on("Perdiem Cost B", {
	refresh: function (frm) {
	  calculate_total_days2(frm);
	  console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
	},
	validate: function (frm) {
	  calculate_total_days2(frm);
	  console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
	},
	table2: function (frm) {
	  calculate_total_days2(frm);
	  console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
	},
	table2_remove: function (frm) {
	  calculate_total_days2(frm);
	},
	nr: function (frm, cdt, cdn) {
	  calculate_total_days2(frm);
	},
	field: function (frm, cdt, cdn) {
	  calculate_total_days2(frm);
	},
	office: function (frm, cdt, cdn) {
	  calculate_total_days2(frm);
	},
	monthly_rate: function (frm, cdt, cdn) {
	  calculate_total_days2(frm);
	},



  });






  frappe.ui.form.on("Perdeigm Cost",{
   field:function(frm,cdt,cdn){
	var child=locals[cdt][cdn]
	calculatePerdeigm(frm,child)


   },
   office:function(frm,cdt,cdn){
	var child=locals[cdt][cdn]
	calculatePerdeigm(frm,child)

   } ,  
   daily_perdiem:function(frm,cdt,cdn){
	var child=locals[cdt][cdn]
	child.total_amount__etb_birr=child.daily_perdiem*child.no_days*child.nr
	frm.refresh_field("table2")
   },
  });
function calculatePerdeigm(frm,child){
child.total=child.office + child.field
frm.refresh_field("table2")
  }




  function calculate_total_days2(frm) {
	let total_days = 0;
	let firstValue = 0;

	if (Array.isArray(frm.doc.table2)) {
	  frm.doc.table2.forEach(function (row) {
		if (row.nr && row.field) {
		  console.log("Row value:", row.nr); // Debugging log
		  total_days = parseFloat(row.nr) * row.field + row.office || 0;

		  frappe.model.set_value(row.doctype, row.name, "total", total_days);

		  if (row.monthly_rate) {
			firstValue = total_days * row.monthly_rate;

			frappe.model.set_value(
			  row.doctype,
			  row.name,
			  "total_amount__etb_birr",
			  firstValue
			);
		  }
		}
	  });
	} else {
	  console.log("table1 is not an array or is undefined"); // Debugging log
	}

	console.log("Total Days Calculated:", firstValue); // Debugging log

	frm.set_value("sub_total_2", firstValue);
	frm.set_value("perdiem_cost_for__professional_staffs", firstValue);
	frm.refresh_field("sub_total_2");
	frm.refresh_field("perdiem_cost_for__professional_staffs");
  }
  //table 3
  frappe.ui.form.on("Vehicles fuel and  Rental cost B", {
	refresh: function (frm) {
	  calculate_total_days3(frm);
	  console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
	},
	validate: function (frm) {
	  calculate_total_days3(frm);
	  console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
	},
	table3: function (frm) {
	  calculate_total_days3(frm);
	  console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
	},
	table3_remove: function (frm) {
	  calculate_total_days3(frm);
	},
	nr: function (frm, cdt, cdn) {
	  calculate_total_days3(frm);
	},
	car_months: function (frm, cdt, cdn) {
	  calculate_total_days3(frm);
	},
	monthly_unit_rate: function (frm, cdt, cdn) {
	  calculate_total_days3(frm);
	},
  });




function calculate_total_days3(frm) {
	let overall_sum = 0;

	if (Array.isArray(frm.doc.table3)) {
		frm.doc.table3.forEach(function (row) {
			if (row.nr && row.car_months) {
				// Calculate total_days3 for the current row
				let total_days3 = parseFloat(row.nr) * row.car_months;

				// If monthly_unit_rate is defined, add to overall_sum
				if (row.monthly_unit_rate) {
					let row_total = total_days3 * row.monthly_unit_rate;
					overall_sum += row_total;
					frappe.model.set_value(row.doctype, row.name, "total_amountt", row_total);
				}
			}
		});
	} else {
		console.log("table3 is not an array or is undefined"); // Debugging log
	}

	console.log("Total Days monthly_unit_rate:", overall_sum); // Debugging log

	// Set the calculated overall sum in the form fields
	frm.set_value("sub_total3", overall_sum);
	frm.set_value("vehicles_fuel__and__rental__cost", overall_sum);
	frm.refresh_field("sub_total3");
	frm.refresh_field("vehicles_fuel__and__rental__cost");
}



  //table 4
  frappe.ui.form.on("Surveying equipments Depreciation Cost B", {
	refresh: function (frm) {
	  calculate_total_days4(frm);
	  console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
	},
	validate: function (frm) {
	  calculate_total_days4(frm);
	  console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
	},
	table4: function (frm) {
	  calculate_total_days4(frm);
	  console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
	},
	table5_remove: function (frm) {
	  calculate_total_days4(frm);
	},
	nr: function (frm, cdt, cdn) {
	  calculate_total_days4(frm);
	},
	field: function (frm, cdt, cdn) {
	  calculate_total_days4(frm);
	},
	duration_months: function (frm, cdt, cdn) {
	  calculate_total_days4(frm);
	},
	montly_uint_rate: function (frm, cdt, cdn) {
	  calculate_total_days4(frm);
	},
  });



  frappe.ui.form.on("Perdiem Cost B", {
	refresh: function (frm) {
	  calculate_total_days2(frm);
	  console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
	},
	validate: function (frm) {
	  calculate_total_days2(frm);
	  console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
	},
	table2: function (frm) {
	  calculate_total_days2(frm);
	  console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
	},
	table2_remove: function (frm) {
	  calculate_total_days2(frm);
	},
	nr: function (frm, cdt, cdn) {
	  calculate_total_days2(frm);
	},
	field: function (frm, cdt, cdn) {
	  calculate_total_days2(frm);
	},
	office: function (frm, cdt, cdn) {
	  calculate_total_days2(frm);
	},
	monthly_rate: function (frm, cdt, cdn) {
	  calculate_total_days2(frm);
	},



  });





function calculate_total_days4(frm) {
	let overall_sum = 0;

	if (Array.isArray(frm.doc.table4)) {
		frm.doc.table4.forEach(function (row) {
			if (row.nr && row.duration_months) {
				// Calculate total_days for the current row
				let total_days = parseFloat(row.nr) * row.duration_months;
				frappe.model.set_value(row.doctype, row.name, "total", total_days);

				// If montly_uint_rate is defined, add to overall_sum
				if (row.montly_uint_rate) {
					let row_total = total_days * row.montly_uint_rate;
					overall_sum += row_total;
					frappe.model.set_value(row.doctype, row.name, "total__amount_birr", row_total);
				}
			}
		});
	} else {
		console.log("table4 is not an array or is undefined"); // Debugging log
	}

	console.log("Total Days Calculated:", overall_sum); // Debugging log

	// Set the calculated overall sum in the form fields
	frm.set_value("sub_total4", overall_sum);
	frm.set_value("surveying_equipments_depreciation_cost", overall_sum);
	frm.refresh_field("sub_total4");
	frm.refresh_field("surveying_equipments_depreciation_cost");
}

  //table 5
  frappe.ui.form.on("Office Equipment  and furniture depreciation cost", {
	refresh: function (frm) {
	  calculate_total_days5(frm);
	  console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
	},
	validate: function (frm) {
	  calculate_total_days5(frm);
	  console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
	},
	table5: function (frm) {
	  calculate_total_days5(frm);
	  console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
	},
	table5_remove: function (frm) {
	  calculate_total_days5(frm);
	},
	nr: function (frm, cdt, cdn) {
	  calculate_total_days5(frm);
	},

	duration_months: function (frm, cdt, cdn) {
	  calculate_total_days5(frm);
	},
	montly_uint_rate: function (frm, cdt, cdn) {
	  calculate_total_days5(frm);
	},
  });

function calculate_total_days5(frm) {
	let overall_sum = 0;

	if (Array.isArray(frm.doc.table5)) {
		frm.doc.table5.forEach(function (row) {
			if (row.nr && row.duration_months) {
				// Calculate total_days for the current row
				let total_days = parseFloat(row.nr) * row.duration_months;
				frappe.model.set_value(row.doctype, row.name, "intermediate_total", total_days);

				// If montly_uint_rate is defined, add to overall_sum
				if (row.montly_uint_rate) {
					let row_total = total_days * row.montly_uint_rate;
					overall_sum += row_total;
					frappe.model.set_value(row.doctype, row.name, "total__amount_birr", row_total);
				}
			}
		});
	} else {
		console.log("table5 is not an array or is undefined"); // Debugging log
	}

	console.log("Total Days Calculated:", overall_sum); // Debugging log

	// Set the calculated overall sum in the form fields
	frm.set_value("sub_total5", overall_sum);
	frm.set_value("office_equipment__and_furniture_depreciation_cost", overall_sum);
	frm.refresh_field("sub_total5");
	frm.refresh_field("office_equipment__and_furniture_depreciation_cost");
}

  //table 6
  frappe.ui.form.on("Communication and other accessories B", {
	refresh: function (frm) {
	  calculate_total_days6(frm);
	  console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
	},
	validate: function (frm) {
	  calculate_total_days6(frm);
	  console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
	},
	table6: function (frm) {
	  calculate_total_days6(frm);
	  console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
	},
	table6_remove: function (frm) {
	  calculate_total_days6(frm);
	},
	nr: function (frm, cdt, cdn) {
	  calculate_total_days5(frm);
	},

	duration_months: function (frm, cdt, cdn) {
	  calculate_total_days6(frm);
	},
	montly_uint_rate: function (frm, cdt, cdn) {
	  calculate_total_days6(frm);
	},
  });

function calculate_total_days6(frm) {
	let overall_sum = 0;

	if (Array.isArray(frm.doc.table6)) {
		frm.doc.table6.forEach(function (row) {
			if (row.nr && row.duration_months) {
				// Calculate total_days for the current row
				let total_days = parseFloat(row.nr) * row.duration_months;
				frappe.model.set_value(row.doctype, row.name, "intermediate_total", total_days);

				// If montly_uint_rate is defined, add to overall_sum
				if (row.montly_uint_rate) {
					let row_total = total_days * row.montly_uint_rate;
					overall_sum += row_total;
					frappe.model.set_value(row.doctype, row.name, "total__amount_birr", row_total);
				}
			}
		});
	} else {
		console.log("table6 is not an array or is undefined"); // Debugging log
	}

	console.log("Total Days Calculated:", overall_sum); // Debugging log

	// Set the calculated overall sum in the form fields
	frm.set_value("sub_total6", overall_sum);
	frm.set_value("communication_and_other_accessories", overall_sum);
	frm.refresh_field("sub_total6");
	frm.refresh_field("communication_and_other_accessories");
}



frappe.ui.form.on("Financial Proposal for Supervision",{
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