

frappe.ui.form.on('Request for Quotation', {
    pr_no: function (frm,cdt,cdn) {
        console.log("what the fuck")
            frappe.model.with_doc('Purchase Requisition', frm.doc.pr_no, function () {
                let source_doc = frappe.model.get_doc('Purchase Requisition',frm.doc.pr_no);
                console.log("today is sep 21",source_doc)
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
    }
})