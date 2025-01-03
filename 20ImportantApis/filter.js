
// this is for filtering only linked documents which are sumitted
frappe.ui.form.on("Operational Plan", {
	project: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.set_query("activity", "task_list", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});

		frm.set_query("activity", "activity_sequencing", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});
	}
});
frappe.ui.form.on('Stock Entry', {
    refresh: function(frm) {
        // filter material request by mr_no
        frm.fields_dict['mr_no'].get_query = function(doc) {
            return {
                filters: {
                    'docstatus': 1
                }
            };
        };
    }
});

frm.set_query("activity", "task_list", function() {
	return {
		"filters": {
			"project": frm.doc.project,
			"is_group": 0
		}
	}
});



frappe.ui.form.on("Item", {
    item_category: function(frm, cdt, cdn) {
     var d = locals[cdt][cdn];
// in this case item_sub_category is the linked field
     frm.set_query("item_sub_category", function() {
        return {
            "filters": {
				// item category should be in the linked document field
                "item_category": frm.doc.item_category
            }
        }
     });
   },
});
// soon later
// this doctype filters the the next row based on the selcted 
frappe.ui.form.on ('Complain Table', {
	budn: function (frm, cdt, cdn) {
	  var row = locals[cdt][cdn];
	  console.log ('we are here');
	  frappe.meta.get_docfield (
		'Complain Table',
		'act',
		frm.doc.name
	  ).get_query = function () {
		return {
		  filters: {
			specific_equipment_type: row.budn,
		  },
		};
	  };
	  if (frm.doc.equipment_type && row.budn) {
		frappe.meta.get_docfield (
		  'Complain Table',
		  'act',
		  frm.doc.name
		).get_query = function () {
		  return {
			filters: {
			  specific_equipment_type: row.budn,
			  equipment_type: frm.doc.equipment_type,
			},
		  };
		};
	  }
	  frm.refresh_field ('complain_detail');
	},
  });
// 
frm.fields_dict['items'].grid.get_field (
	'location'
  ).get_query = function (doc, cdt, cdn) {
	return {
	  filters: [['name', 'in', warehouseArray]],
	};
  };
// 
frappe.ui.form.on ('Maintenance Work order', {
	group: function (frm, cdt, cdn) {
	  console.log ('group here is ', frm.doc.group);
	  frm.fields_dict['complain_detail'].grid.get_field (
		'name1'
	  ).get_query = function (doc, cdt, cdn) {
		return {
		  filters: {
			group_main: frm.doc.group,
		  },
		};
	  };
	  frm.refresh_field ('group');
	  frm.refresh_field ('complain_detail');
	  frm.fields_dict['complain_detail'].grid.refresh ();
	  // Refresh the 'group' field
	},
	refresh: function (frm, cdt, cdn) {
	  console.log ('group here is ', frm.doc.group);
	  frm.fields_dict['complain_detail'].grid.get_field (
		'name1'
	  ).get_query = function (doc, cdt, cdn) {
		return {
		  filters: {
			group_main: frm.doc.group,
		  },
		};
	  };
	  frm.refresh_field ('group');
	  frm.refresh_field ('complain_detail');
	  frm.fields_dict['complain_detail'].grid.refresh ();
	  // Refresh the 'group' field
	},
  });


// adding date filter in query report
frappe.query_reports["Cashflow Report"] = {
	"filters": [
		{
			fieldname:"from_date",
			label: __("From Date"),
			fieldtype: "Date",
			default: frappe.datetime.add_months(frappe.datetime.month_start(), -1),
			reqd: 1
		},
		{
			fieldname:"to_date",
			label: __("To Date"),
			fieldtype: "Date",
			default: frappe.datetime.add_days(frappe.datetime.month_start(),-1),
			reqd: 1
		},
	        {
			"fieldname": "project",
			"label": __("Project"),
			"fieldtype": "Link",
			"options": "Project",
			"default": "Dodolla Construction of Site Works - Infra",
			"reqd": 1
		},
	]
}