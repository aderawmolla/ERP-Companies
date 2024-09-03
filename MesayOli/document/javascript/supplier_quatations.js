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

frappe.ui.form.on('Transfer Order', {
    store_request_no: function (frm) {
        if (frm.doc.store_request_no) {
            frm.clear_table('item');
            frappe.model.with_doc('Material Request', frm.doc.store_request_no, function () {

                let source_doc = frappe.model.get_doc('Material Request', frm.doc.store_request_no);

                $.each(source_doc.items, function (index, source_row) {

                    const target_row = frm.add_child('item');
                    target_row.item_code= source_row.item_code;
                    target_row.item_category = source_row.item_sub_category;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.qty = source_row.qty;

                });

                frm.refresh_field('item');
            });
        }
    }
});
