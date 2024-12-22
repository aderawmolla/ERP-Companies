

frappe.ui.form.on("Employee Medical Form", {
	date_ec: function(frm) {
		checkYear(frm);
	},

	employee_id: function(frm) {
		checkYear(frm);
	},

});

frappe.ui.form.on("Medical Form", {
	percent: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		
		// Correct calculation for 'asked'
		child.asked = ((child.amount_paid || 0) * (child.percent || 0)) / 100;

		frm.refresh_field('medicine');
	},
});




function checkYear(frm) {
	if (frm.doc.date_ec && frm.doc.employee_id) {
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Employee Medical Form',
				filters: {
					'employee_id': frm.doc.employee_id,
					'date_ec': ['like', '%' + frm.doc.date_ec.split('/')[2] + '%'] // Check for same year
				},
				fields: ["*"],
			},
			callback: async function (response) {
				console.log("Response ", response.message)
				response.message.map((row) => {
					if (row.date_ec && row.date_ec.split('/')[2] === frm.doc.date_ec.split('/')[2]) {
						frappe.msgprint(`Employee Medical Form for ${frm.doc.employee_name}  already exists for year ${frm.doc.date_ec.split('/')[2]}, Please try again.`);
						frm.set_value("date_ec", "");
						frm.set_value("employee_id", "");
						frm.set_value("employee_name", "");
						frm.set_value("gender", "");

					}
				})
			}
		})
	}
}



frappe.ui.form.on("Employee Medical Form", {
	date_ec: function(frm) {
		if (frm.doc.date_ec) {
			var date = convertDateTOGC(frm.doc.date_ec.toString());
			var dateObject = new Date(date);
			// Format the date as a string in a desired format
			var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
			frm.set_value("date", formattedDate);
			frm.refresh_field("date")
		}
	},
});

frappe.ui.form.on("Medical Form", {
	asked: function(frm, cdt, cdn) {
		calculateMedicine(frm, cdt, cdn);
	},
});

frappe.ui.form.on("Medical Form Two", {
	asked: function(frm, cdt, cdn) {
		calculateMedicineTwo(frm, cdt, cdn);
	},
});

function calculateMedicine(frm, cdt, cdn) {
	var used = 0;
	var allowSave = true;
	var forGlass = 0;
	var forBIrth = 0;
	var forEar = 0;

	$.each(frm.doc.medicine, function(index, row) {
		if (row.reason == "የህክምና") {
			console.log("wer are  inside")

			// if (row.from_government == "Yes") {
			used += row.asked;
			if (frm.doc.type_of_employee == "ለሰራተኛ" && used > 12000) {
				frappe.msgprint("የህክምና  can not exceed birr 12,000")
				row.asked = null;
				allowSave = false;
				return false;
			}
			// row.amount_paid = row.asked;
			refresh_field("medicine")

		}
		else if (row.reason == "የመነፅር") {
			forGlass += row.asked;
			refresh_field("medicine")

			if (frm.doc.type_of_employee == "ለሰራተኛ" && forGlass > parseFloat(3000)) {
				row.asked = null;
				refresh_field("medicine")
				allowSave = false;
				frappe.throw("Total amount paid for የመነጸርየመነጸር can not exceed 3000.");
				return false;  // exit the loop
			}
		}

		else if (row.reason == "ለወሊድ") {
			forBIrth += row.asked;
			refresh_field("medicine")

			if (forBIrth > parseFloat(3000)) {
				row.asked = null;
				refresh_field("medicine")
				allowSave = false;
				frappe.throw("Total amount paid for ለለወሊድ can not exceed 3000.");
				return false;  // exit the loop
			}
		}

		else if (row.reason == "የጆሮ ማዳመጫ") {
			forEar += row.asked;
			refresh_field("medicine")

			if (frm.doc.type_of_employee == "ለሰራተኛ" && forEar > parseFloat(2500)) {
				row.asked = null;
				refresh_field("medicine")
				allowSave = false;
				frappe.throw("Total amount paid for የጆሮ ማዳመጫ can not exceed 2500.");
				return false;  // exit the loop
			}
		}
	});

	if (allowSave) {
		frm.set_value("used_medicine__from_12000", used);
		frm.set_value("total_birr_for_glass", forGlass);
		frm.set_value("total_birr_for_birth", forBIrth);
		frm.set_value("ramaining_from_12000", forEar);
		frm.set_value("total_birr_for_medication", (forEar || 0) + (forBIrth || 0) + (forGlass || 0) + (used || 0));
 
		frm.refresh_field("sed_medicine__from_12000");
		frm.refresh_field("total_birr_for_glass");
		frm.refresh_field("ramaining_from_12000");
		frm.refresh_field("total_birr_for_medication");

	}
}

function calculateMedicineTwo(frm, cdt, cdn) {
	var used = 0;

	frm.doc.medicene2.map((row) => {
		// if (row.from_government == "Yes") {
		used += row.asked;
		console.log("total for medicne 2", used)
		// row.amount_paid = row.asked;
		refresh_field("medicine2")

		// } else {
		// 	used += row.asked * 0.8;
		// 	row.amount_paid = row.asked * 0.8;
		// 	refresh_field("medicine2")
		// }
	})

	frm.set_value("total_medicine_in_birr", used);
	frm.set_value("total_birr_for_medication", used);

	frm.refresh_field("total_birr_for_medication");
}