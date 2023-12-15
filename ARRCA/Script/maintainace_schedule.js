cur_frm.add_fetch("item_code", "item_name", "item_name");
cur_frm.add_fetch("item_code", "description", "description");
cur_frm.add_fetch("item_code", "stock_uom", "uom");
cur_frm.add_fetch("item_code", "location", "location");
cur_frm.add_fetch("vehicle_plate_no", "chasis_no", "chasis_number");
var warehouses=[]
frappe.ui.form.on("Maintenance Schedule", {
    schedule_date_ec: function (frm) {
        if (frm.doc.schedule_date_ec) {
            var date = convertDateTOGC(frm.doc.schedule_date_ec.toString());
            var dateObject = new Date(date);
            // Format the date as a string in a desired format
            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("date", formattedDate);
            frm.refresh_field("date")
        }
    },
    warehouse: function(frm, cdt, cdn) {
        console.log("group here is ",frm.doc.warehouse)
        frm.fields_dict['items'].grid.get_field('location').get_query = function(doc, cdt, cdn) {
            return {
                filters: [
                    ['name', 'in', warehouses]
                ]
            };
        };
        frm.refresh_field("warehouse");
        frm.refresh_field("items")
        frm.fields_dict['items'].grid.refresh();
        // Refresh the 'group' field
    },
    refresh: function(frm, cdt, cdn) {
        console.log("group here is ",frm.doc.warehouse)
        frm.fields_dict['items'].grid.get_field('location').get_query = function(doc, cdt, cdn) {
            return {
                filters: [
                    ['name', 'in', warehouses]
                ]
            };
        };
        frm.refresh_field("warehouse");
        frm.refresh_field("items")
        frm.fields_dict['items'].grid.refresh();
        // Refresh the 'group' field
    },

});
//complain_detail...table field in parent field
//name1.....field in the current table we want to set
//group_main....field in doctype Maintaince case Linked by name1 field
//group...parent field in the current document linked to 
//please be takecare name1 Link field and group_main in another doctype not in this child table

frappe.ui.form.on('Maintenance Schedule', {
    po_no: function (frm) {
        if (frm.doc.po_no) {
            frm.clear_table('items_from_purchase_order');
            console.log("Test 1");
            frappe.model.with_doc('Purchase Order', frm.doc.po_no, function () {
                console.log("Test 2", frm.doc.po_no)
                let source_doc = frappe.model.get_doc('Purchase Order', frm.doc.po_no);
                console.log("source doc", source_doc)
                $.each(source_doc.items, function (index, source_row) {

                    console.log("Test 3");
                    const target_row = frm.add_child('items_from_purchase_order');
                    target_row.item_code = source_row.item_code;
                    target_row.stock_quantity = source_row.stock_quantity;
                    target_row.item_name = source_row.item_name;
                    target_row.uom = source_row.uom;
                    target_row.amount = source_row.amount;
                    target_row.qty = source_row.qty;
                    target_row.rate = source_row.rate;
                    target_row.description = source_row.description;

                });

                frm.refresh_field('items_from_purchase_order');
            });
        }
    },
});
frappe.ui.form.on('Maintenance Schedule Item', {
    item_code: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Stock Ledger Entry',
                filters: {
                    item_code: child.item_code,
                },
                fields: ['*']
            },
            callback: function (response) {
                if (response.message) {
                    let warehouseEntries = {};

                    response.message.forEach((entry) => {
                        if (!warehouseEntries[entry.warehouse]) {
                            warehouseEntries[entry.warehouse] = entry;
                        } else {
                            if (new Date(entry.posting_time) > new Date(warehouseEntries[entry.warehouse].posting_time)) {
                                warehouseEntries[entry.warehouse] = entry;
                            }
                        }
                    });

                    let total = 0;
                    Object.values(warehouseEntries).forEach((entry) => {
                        total += entry.qty_after_transaction;
                    });

                    // Set the stock_quantity field
                    frappe.model.set_value(cdt, cdn, "stock_quantity", total);

                    // Set the location field with all warehouses
                    let warehouseArray = Object.keys(warehouseEntries);
                    warehouses=warehouseArray
                    frm.fields_dict['items'].grid.get_field('location').get_query = function (doc, cdt, cdn) {
                        return {
                            filters: [
                                ['name', 'in', warehouseArray]
                            ]
                        };
                    };

                    frm.refresh_field("items");
                }
            }
        });
    },

    location: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var warehouse = child.location;

        if (child.item_code) {
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: 'Stock Ledger Entry',
                    filters: {
                        item_code: child.item_code,
                    },
                    fields: ['*']
                },
                callback: function (response) {
                    if (response.message) {
                        let warehouseEntries = {};

                        response.message.forEach((entry) => {
                            if (!warehouseEntries[entry.warehouse]) {
                                warehouseEntries[entry.warehouse] = entry;
                            } else {
                                if (new Date(entry.posting_time) > new Date(warehouseEntries[entry.warehouse].posting_time)) {
                                    warehouseEntries[entry.warehouse] = entry;
                                }
                            }
                        });

                        let total = 0;
                        let warehouse_balance = 0;

                        Object.values(warehouseEntries).forEach((entry) => {
                            if (entry.warehouse == warehouse) {
                                warehouse_balance += entry.qty_after_transaction
                            }
                            total += entry.qty_after_transaction;
                        });

                        frappe.model.set_value(cdt, cdn, "stock_quantity", total);
                        frappe.model.set_value(cdt, cdn, "store_balance", warehouse_balance);

                        frm.refresh_field("items");
                    }
                }
            });
        }
    }
});

frappe.ui.form.on('Purchase Order Item',{
    //when equip_code of Tyre Control Table changes it fetches data from the database and assign to equp_type of table document rows
    item_code: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        // Fetch information from the linked doctype using a server call
        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: 'Stock Ledger Entry',
                filters: { item_code: child.item_code },
                fieldname: ['qty_after_transaction']
            },
            callback: function (response) {
                if (response.message) {
                    // Update the "equipment_type" field in the current child table row
                    frappe.model.set_value(cdt, cdn, "stock_quantity", response.message.qty_after_transaction);
                    frappe.model.set_df_property(cdt, cdn, 'stock_quantity', 'read_only', 1); // Make stock_quantity readonly
                    frm.refresh_field("items");
                    //  frappe.model.set_value(d.doctype, d.name, 'ot_total_in_birr', (d.ot_normal_amount + d.ot_knight_
                }
            }
        });
    }
});

