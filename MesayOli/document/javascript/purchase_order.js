frappe.ui.form.on('Purchase Order', {

    pr_no: function(frm) {
     if (frm.doc.pr_no) {
        cur_frm.add_fetch('pr_no', 'purchase_for', 'purchase_for');
        cur_frm.add_fetch('pr_no', 'receiving_project', 'receiving_project');
        cur_frm.add_fetch('pr_no', 'date', 'schedule_date');
        frm.refresh_field('purchase_for');
        frm.refresh_field('receiving_project');
        frm.refresh_field('schedule_date');
      frm.clear_table('items');
      console.log("Test 1");
      frappe.model.with_doc('PR', frm.doc.pr_no, function() {
   
       let source_doc = frappe.model.get_doc('PR', frm.doc.pr_no);
       console.log("source doc", source_doc)
   
       $.each(source_doc.purchase_requisition_item, function(index, source_row) {
   
        console.log("Test 3");
       
                   const target_row = frm.add_child('items');
                    target_row.item_code = source_row.item_code;
                    target_row.item_category = source_row.item_category;
                    target_row.description = source_row.description;
		    target_row.item_name = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.qty = source_row.qty;
   
       });
   
       frm.refresh_field('items');
      });
     }
    },
   });
   var prNoArray = [];  // Add this line to create an array to store pr_no values
   frappe.ui.form.on('POPR Table', {
    pr_no: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];    
        if (child.pr_no && prNoArray.includes(child.pr_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("PR No {0} already selected. Please choose a different PR No.", [child.pr_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        } else {
            prNoArray.push(child.pr_no);
            frappe.model.with_doc('PR', child.pr_no, function() {
                let source_doc = frappe.model.get_doc('PR', child.pr_no);
                $.each(source_doc.purchase_requisition_item, function(index, source_row) {
                    const target_row = frm.add_child('items');
                    target_row.item_code = source_row.item_code;
                    target_row.item_category = source_row.item_category;
                    target_row.description = source_row.description;
                    target_row.item_name = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.qty = source_row.qty;
                    target_row.weight_per_unit=source_row.weight
                    //adding purchase request
                    target_row.pr_qty = source_row.qty;
                    target_row.pr_date = source_row.date;
                    target_row.pr_no = child.pr_no;

                });

                frm.refresh_field('items');
            });
        }
    },
});
 
frappe.ui.form.on('Purchase Order', {
    on_cancel: function(frm) {
        // Perform your custom action here
        frappe.msgprint('Custom action performed when canceling Purchase Order.');
        
        // You can also update the status or perform other frontend actions as needed
        frm.set_value('status', 'Cancelled');
        frm.refresh();
    }
});
