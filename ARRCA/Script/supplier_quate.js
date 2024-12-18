
frappe.ui.form.on("Supplier Quotation", {
    supplier_quotation_date_ec:function(frm, cdt, cdn) {
        if(frm.doc.supplier_quotation_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.supplier_quotation_date_ec.toString());
            frm.doc.transaction_date= finalgc;
            refresh_field("transaction_date");
            
        }
    }
});
frappe.ui.form.on('Supplier Quotation', {
    req_qutation: function (frm) {
        if (frm.doc.req_qutation) {

            frm.clear_table('items');

            frappe.model.with_doc('Request for Quotation', frm.doc.req_qutation, function () {

                let source_doc = frappe.model.get_doc('Request for Quotation', frm.doc.req_qutation);

                $.each(source_doc.items, function (index, source_row) {

			const target_row = frm.add_child('items');	
                    	target_row.item_code = source_row.item_code;
                        target_row.description = source_row.description;
                        target_row.uom = source_row.uom;
                        target_row.qty = source_row.qty;
                        

                });


		frm.refresh_field('items');
            });
        }
    },
});
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
                    // target_row.rate = source_row.rate;
                    // target_row.amount = source_row.amount;
                        
                });

                frm.refresh_field('items');
            });
        } 
    },
});



frappe.ui.form.on("Supplier Quotation Item", {
      rate: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'unit_price_with_vat', (d.rate * d.vat));   
                frappe.model.set_value(d.doctype, d.name, 'total_price_with_vat', (d.rate * d.vat * d.qty)); 
    }
});
