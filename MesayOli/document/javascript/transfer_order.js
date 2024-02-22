
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
var prNoArray=[];
frappe.ui.form.on('To Table', {

    sr_no: function (frm,cdt,cdn) {
        var child=locals[cdt][cdn]

        if (child.sr_no && prNoArray.includes(child.sr_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("SR No {0} already selected. Please choose a different PR No.", [child.sr_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        }
     else{
        prNoArray.push(child.sr_no)
            // frm.clear_table('item');
            frappe.model.with_doc('Material Request', child.sr_no, function () {
                let source_doc = frappe.model.get_doc('Material Request', child.sr_no);

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


frappe.ui.form.on("Transfer Order Item", {
    
    item_code:function(frm, cdt, cdn) {

        cur_frm.add_fetch('item_code', 'description', 'description');
        cur_frm.add_fetch('item_code', 'stock_uom', 'uom');
        cur_frm.add_fetch('item_code', 'item_category', 'item_category');

        refresh_field('uom');
        refresh_field('description');
        refresh_field('item_category')


    }
});


frappe.ui.form.on("Transfer Order", {
    store_request_no: function(frm, cdt, cdn) {
        console.log(cur_frm.doc.order_project); // Check the initial value in the console
        cur_frm.add_fetch('store_request_no', 'requested_project', 'order_project');
	frm.add_fetch('store_request_no', 'requested_from', 'order_by');
        refresh_field('order_project');
	refresh_field('order_by');
        console.log("test last");
    }
});

