cur_frm.add_fetch("plate_no", "motor_number", "motor");
cur_frm.add_fetch("plate_no", "model", "model");
cur_frm.add_fetch("plate_no", "chasis_no", "chansi");
cur_frm.add_fetch("plate_no", "equipment_type", "type");

cur_frm.add_fetch("item_code", "item_name", "item_name");
cur_frm.add_fetch("item_code", "description", "description");

var  prNoArray=[];
frappe.ui.form.on('PR Table',{
    pr_no: function (frm,cdt,cdn) {
        var child=locals[cdt][cdn]

        if (child.pr_no && prNoArray.includes(child.pr_no)) {        
            frappe.throw({
                title: __("Already Selected"),
                message: __("PR No {0} already selected. Please choose a different PR No.", [child.pr_no])
            }).then(()=>{
                frappe.model.clear_doc(cdt, cdn);
            });
        }
            // frm.clear_table('purchase_requisition_item');
       else {
           prNoArray.push(child.pr_no)
            frappe.model.with_doc('Purchase Requisition', child.pr_no, function () {

                let source_doc = frappe.model.get_doc('Purchase Requisition', child.pr_no);

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
    },
});




frappe.ui.form.on("Request for Quotation", {
    date_ec:function(frm, cdt, cdn) {
        if(frm.doc.date_ec) {

            var finalgc = convertDateTOGC(frm.doc.date_ec.toString());
            frm.doc.date= finalgc;
            refresh_field("date");
            
        }
    }
});

