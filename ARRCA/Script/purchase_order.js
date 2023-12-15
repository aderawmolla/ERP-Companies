frappe.ui.form.on('MRI', {
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
                    frm.refresh();
                    //  frappe.model.set_value(d.doctype, d.name, 'ot_total_in_birr', (d.ot_normal_amount + d.ot_knight_

                }
            }
        });
    }
});

frappe.ui.form.on("Purchase Order", {
    date_ec: function (frm, cdt, cdn) {
        if (frm.doc.date_ec) {

            var finalgc = convertDateTOGC(frm.doc.date_ec.toString());
            frm.doc.transaction_date = finalgc;
            refresh_field("transaction_date");

        }
    },
    purchase_request: function (frm, cdt, cdn) {
        if (frm.doc.purchase_request) {

            frm.clear_table('items');

            frappe.model.with_doc('Purchase Requisition', frm.doc.purchase_request, function () {

                let source_doc = frappe.model.get_doc('Purchase Requisition', frm.doc.purchase_request);

                $.each(source_doc.table_12, function (index, source_row) {
                    const target_row = frm.add_child('items');
                    target_row.item_code = source_row.item_code;
                    target_row.item_name = source_row.item_name;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.qty = source_row.qty;
                    target_row.rate = source_row.rate;
                    target_row.amount = source_row.amount;


                });
                frm.refresh_field('items');
            });
        }


    }
});

frappe.ui.form.on("Purchase Order", {
    reqd_by_date_ec: function (frm, cdt, cdn) {
        if (frm.doc.reqd_by_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.reqd_by_date_ec.toString());
            frm.doc.schedule_date = finalgc;
            refresh_field("schedule_date");

        }
    }
});
cur_frm.add_fetch("item_code", "brand", "shelf_no");