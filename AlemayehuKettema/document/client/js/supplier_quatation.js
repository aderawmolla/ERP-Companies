frappe.ui.form.on('Supplier Quotation', {
    quotation_numbers: function (frm,cdt,cdn) {
            frappe.model.with_doc('Request for Quotation', frm.doc.quotation_numbers, function () {
                let source_doc = frappe.model.get_doc('Request for Quotation',frm.doc.quotation_numbers);
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
    pr_number: function (frm,cdt,cdn) {
        frappe.model.with_doc('Purchase Requisition', frm.doc.pr_number, function () {
            let source_doc = frappe.model.get_doc('Purchase Requisition',frm.doc.pr_number);
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