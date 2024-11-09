cur_frm.add_fetch('plate_no', 'engine_no', 'no');
cur_frm.add_fetch('plate_no', 'chasis_no', 'serial_no');
cur_frm.add_fetch('plate_no', 'equipment_type', 'equipment_description');

frappe.ui.form.on("Fuel Request for Equipment Form", {
	equipment_type: function(frm, cdt, cdn) {
        console.log("abebe")
		frm.set_query("plate_no", function() {
			return {
				"filters": {
					"type": frm.doc.equipment_type
				}
			}
		});
	}
});

frappe.ui.form.on("Fuel Request for Equipment Form", {
    plate_no: function (frm, cdt, cdn) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Fuel Request for Equipment Form',
                filters: { 'name': ['!=', frm.docname], "plate_no": frm.doc.plate_no },
                fields: ['*']
            },
            callback: function (response) {
                var cards = response.message;
                console.log("the response message", cards);
                if (cards) {
                    var card = cards[0];
                    frm.set_value("date_issued", card.date_ec)
                    frm.set_value("fuel_issue", card.vehicle_km_litr + card.others_liters_hr)
                    frm.set_value("prev_km", card.km_readings)
                }
            }
        });
    }
    ,
    date_ec: function (frm, cdt, cdn) {
        if (frm.doc.date_ec) {



        }
    },
   
    before_save: function (frm, cdt, cdn) {
        frm.set_value("vehicle_km_litr",frm.doc.vehicle_km_litr+frm.doc.fuel_issue)
        frm.set_value("km_readings",frm.doc.prev_km+frm.doc.km_readings)
    }
});