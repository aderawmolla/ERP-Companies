cur_frm.add_fetch("sr_no", "requested_project", "receiving_project");
cur_frm.add_fetch("sr_no", "plate_no", "plate_no");
cur_frm.add_fetch("sr_no", "requested_from", "purchase_for");

frappe.ui.form.on("PR Item", {    
    item_code:function(frm, cdt, cdn) {
        cur_frm.add_fetch('item_code', 'description', 'description');
        cur_frm.add_fetch('item_code', 'stock_uom', 'uom');
        cur_frm.add_fetch('item_code', 'item_sub_category', 'item_category');
        cur_frm.add_fetch('sr_no', 'item_sub_category', 'item_category');
        cur_frm.add_fetch('item_code', 'requested_project', 'receiving_project ');
        cur_frm.add_fetch('item_code', 'weight', 'weight');
   
        refresh_field('uom');
        refresh_field('description');
        refresh_field('item_category')


    }
});


var  prNoArray=[];
frappe.ui.form.on('Sr Table', {
    mr_no: function (frm,cdt,cdn) {
        var child=locals[cdt][cdn]

        if (child.mr_no && prNoArray.includes(child.mr_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("SR No {0} already selected. Please choose a different PR No.", [child.mr_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        }
            // frm.clear_table('purchase_requisition_item');
       else {
           prNoArray.push(child.mr_no)
            frappe.model.with_doc('Material Request', child.mr_no, function () {

                let source_doc = frappe.model.get_doc('Material Request', child.mr_no);
                   
                $.each(source_doc.items, function (index, source_row) {

			            const target_row = frm.add_child('purchase_requisition_item');	
                    	target_row.item_code = source_row.item_code;
                        target_row.item_category = source_row.item_sub_category;
                        target_row.description = source_row.description;
                        target_row.uom = source_row.uom;
                        target_row.qty = source_row.qty;
                        target_row.weight=source_row.weight
                        target_row.sr_no=child.mr_no    
                        target_row.date=frm.doc.date    
                });

                frm.refresh_field('purchase_requisition_item');
		       frm.refresh_field('item_category');
            });
        } 
    },
});

frappe.ui.form.on('PR', {

    sr_no: function (frm,cdt,cdn) {
        if (frm.doc.sr_no) {

            // frm.clear_table('purchase_requisition_item');

            frappe.model.with_doc('Material Request', frm.doc.sr_no, function () {

                let source_doc = frappe.model.get_doc('Material Request', frm.doc.sr_no);

                $.each(source_doc.items, function (index, source_row) {

			           const target_row = frm.add_child('purchase_requisition_item');	
                    	target_row.item_code = source_row.item_code;
                        target_row.item_category = source_row.item_sub_category;
                        target_row.description = source_row.description;
                        target_row.uom = source_row.uom;
                        target_row.qty = source_row.qty;
                        

                });

                frm.refresh_field('purchase_requisition_item');
		frm.refresh_field('item_category');
            });
        }
    },
});
frappe.ui.form.on("PR", {
    
    store_request_no:function(frm, cdt, cdn) {

        cur_frm.add_fetch('store_request_no', 'requested_project', 'receiving_project');
        refresh_field('receiving_project')
    }
});