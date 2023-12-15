cur_frm.add_fetch('serial_or_plate_no', 'chasis_no', 'chasis_no');

frappe.ui.form.on('work done', {
    technician_name: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        if (frm.doc.serial_or_plate_no) {
            var plat_no = frm.doc.serial_or_plate_no;
            var technician_name = child.technician_name;
            var date_ec = frm.doc.date_ec;
            var date=frm.doc.date
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: 'Stock Entry',
                    filters: {
                        "plate_no": plat_no,
                        "transfer_no": technician_name,
                        "posting_date_ec": date_ec
                            ? date
                                ? ["between", [date_ec, date]]
                                : [">=", date_ec]
                            : date
                                ? ["<=", date]
                                : undefined,
                    },
                    fields: ['name']
                },
                callback: function (response) {
                    if (response.message.length > 0) {
                        console.log("response", response.message);
                        response.message.forEach(function (stockEntry) {
                            frappe.call({
                                method: "frappe.client.get_list",
                                args: {
                                    doctype: 'Stock Entry Detail',
                                    filters: {
                                        "parent": stockEntry.name,
                                    },
                                    fields: ['*']
                                },
                                callback: function (resp) {
                                    if (resp.message) {
                                        var source = resp.message;
                                        console.log("response for the detail", resp.message);
                                        source.forEach(function (detail) {
                                            var rowTable = frm.add_child("replaced_part_and_labor_cost_summary");
                                            console.log("row table", rowTable);
                                            rowTable.part_no = detail.item_code;
                                            rowTable.description_parts_or_lubricants_or_materials_or_issued = detail.item_name;
                                            rowTable.uom = detail.uom;
                                            rowTable.qty = detail.qty;
                                            rowTable.cost_summary_type = detail.rate;
                                            rowTable.cost_summary_birr = detail.amount;
                                            frm.refresh_field("replaced_part_and_labor_cost_summary");
                                        });
                                    }
                                    totalCostCalculator(frm);
                                }
                            });
                        });
                    } else {
                        frappe.show_alert(`There is no Stock Entry(ሞዴል 22) which has plate no: ${plat_no}, technician name: ${technician_name} and date: ${date_ec}`);
                    }
                }
            });
        }
    }
});



frappe.ui.form.on('work done', {
    date_ec: function(frm) {
        if(frm.doc.date_ec){
            var date = convertDateTOGC(frm.doc.date_ec.toString());
            frm.set_value("date", date);
            frm.refresh_field("date")
        }
    }
});


frappe.ui.form.on('Maintenance Work order', {
    date_ec: function(frm) {
        if(frm.doc.date_ec){
            var date = convertDateTOGC(frm.doc.date_ec.toString());
            var dateObject = new Date(date);
// Format the date as a string in a desired format
           var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("from_date_gc", formattedDate);
            frm.refresh_field("from_date_gc")
        }
    },
    date: function(frm) {
        if(frm.doc.date_ec){
            var date = convertDateTOGC(frm.doc.date.toString());
            var dateObject = new Date(date);
            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("to_date_gc", formattedDate);
            frm.refresh_field("to_date_gc")
        }
    }
});

frappe.ui.form.on('Replaced parts', {
    cost_summary_type: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.cost_summary_type & row.qty){
            row.cost_summary_birr = row.cost_summary_type * row.qty
            frm.refresh_field("replaced_part_and_labor_cost_summary")
        }
        totalCostCalculator(frm);
    },
    qty: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.cost_summary_type & row.qty){
            row.cost_summary_birr = row.cost_summary_type * row.qty
            frm.refresh_field("replaced_part_and_labor_cost_summary")
        }
        totalCostCalculator(frm);
 
    }
});
function totalCostCalculator(frm){
 var total_cost=0;
    $.each(frm.doc.replaced_part_and_labor_cost_summary, function (i, d) {
        // calculate incentive
        total_cost+=d.cost_summary_birr
    });
 frm.set_value("total_cost",total_cost)
 frm.refresh_field("total_cost")

}


frappe.ui.form.on('Complain Table', {
    group: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var group = child.group;
        // Set the value of 'group' field
        frm.set_value("group", group);
        console.log("the group is",frm.doc.group)
        console.log("step 1")
        frm.refresh_field("group");
        frm.refresh_field("complain_detail")
        // Refresh the 'complain_detail' grid to apply the changes
        frm.fields_dict['complain_detail'].grid.refresh();
        console.log("step2")
        // Refresh the 'group' field
    }
});


frappe.ui.form.on('Maintenance Work order', {
    group: function(frm, cdt, cdn) {
        console.log("group here is ",frm.doc.group)
        frm.fields_dict['complain_detail'].grid.get_field('name1').get_query = function(doc, cdt, cdn) {
            return {
                filters: {
                    group_main:frm.doc.group
                }
            };
        };
        frm.refresh_field("group");
        frm.refresh_field("complain_detail")
        frm.fields_dict['complain_detail'].grid.refresh();
        // Refresh the 'group' field
    },
    refresh: function(frm, cdt, cdn) {
        console.log("group here is ",frm.doc.group)
        frm.fields_dict['complain_detail'].grid.get_field('name1').get_query = function(doc, cdt, cdn) {
            return {
                filters: {
                    group_main:frm.doc.group
                }
            };
        };
        frm.refresh_field("group");
        frm.refresh_field("complain_detail")
        frm.fields_dict['complain_detail'].grid.refresh();
        // Refresh the 'group' field
    },
});











