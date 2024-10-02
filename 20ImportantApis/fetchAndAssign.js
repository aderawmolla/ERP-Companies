// linked then source and target field name
frm.add_fetch('transfer_order_no', 'from_warehouse', 'from_warehouse');
// fetch from document to document
frappe.ui.form.on('Supplier Quotation', {
    req_qutation: function (frm,cdt,cdn) {
            frappe.model.with_doc('Request for Quotation', frm.doc.req_qutation, function () {
                let source_doc = frappe.model.get_doc('Request for Quotation', frm.doc.req_qutation);
                $.each(source_doc.items, function (index, source_row) {
			            const target_row = frm.add_child('items');
                    	target_row.item_code = source_row.item_code;
                        target_row.uom = source_row.uom;
                        target_row.description = source_row.description;
                        target_row.qty = source_row.qty;
                        target_row.warehouse = source_row.warehouse;
                });
                frm.refresh_field('items');
            });
    },
});