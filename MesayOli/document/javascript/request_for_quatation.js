cur_frm.add_fetch("Material Request", "purpose", "purpose");
cur_frm.add_fetch("Material Request", "model_no", "model_no");
cur_frm.add_fetch("Material Request", "chasis_no", "chasis_no");
cur_frm.add_fetch("Material Request", "project", "project");
var  prNoArray=[];
frappe.ui.form.on('Pr Table', {
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
            frappe.model.with_doc('PR', child.mr_no, function () {

                let source_doc = frappe.model.get_doc('PR', child.mr_no);

                $.each(source_doc.purchase_requisition_item, function (index, source_row) {

			            const target_row = frm.add_child('items');	
                    	target_row.item_code = source_row.item_code;
                        target_row.description= source_row.description;
                        target_row.uom = source_row.uom;
                        target_row.qty = source_row.qty;

                       
                        
                });

                frm.refresh_field('items');
		       
            });
        } 
    },
});

