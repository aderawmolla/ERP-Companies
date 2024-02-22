
frappe.ui.form.on('Purchase Receipt', {

    purchase_requesition_no: function (frm) {
        if (frm.doc.purchase_requesition_no) {
            frm.clear_table('items');

            frappe.model.with_doc('PR', frm.doc.purchase_requesition_no, function () {

                let source_doc = frappe.model.get_doc('PR', frm.doc.purchase_requesition_no);

                $.each(source_doc.purchase_requisition_item, function (index, source_row) {

                    const target_row = frm.add_child('items');
                    target_row.item_category = source_row.item_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
		    target_row.item_name = source_row.description;
                });

                frm.refresh_field('items');
            });
        }
    },
});
var prNoArray=[];
frappe.ui.form.on('PRPR table', {

    purchase_requesition_no: function (frm,cdt,cdn) {
        var child=locals[cdt][cdn]

        if (child.purchase_requesition_no && prNoArray.includes(child.purchase_requesition_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("PR No {0} already selected. Please choose a different PR No.", [child.purchase_requesition_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        }
        else{
            // frm.clear_table('items');
            prNoArray.push(child.purchase_requesition_no)
            frappe.model.with_doc('PR', child.purchase_requesition_no, function () {

                let source_doc = frappe.model.get_doc('PR', child.purchase_requesition_no);

                $.each(source_doc.purchase_requisition_item, function (index, source_row) {

                    const target_row = frm.add_child('items');
                    target_row.item_category = source_row.item_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
		    target_row.item_name = source_row.description;
                });

                frm.refresh_field('items');
            });
        }
    },
});
frappe.ui.form.on('Purchase Receipt', {

    grn: function (frm) {
        if (frm.doc.grn) {
            frm.clear_table('items');

            frappe.model.with_doc('PR', frm.doc.grn, function () {

                let source_doc = frappe.model.get_doc('PR', frm.doc.grn);

                $.each(source_doc.purchase_requisition_item, function (index, source_row) {

                    const target_row = frm.add_child('items');
                    target_row.item_category = source_row.item_category;
                    target_row.item_code= source_row.item_code; 
		    target_row.rate = source_row.rate;
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
		    target_row.item_name = source_row.description;
                });

                frm.refresh_field('items');
            });
        }
    },
});