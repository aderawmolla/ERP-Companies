

cur_frm.add_fetch("item_code", "item_name", "item_name");
cur_frm.add_fetch("item_code", "description", "description");
frappe.ui.form.on('Request for Quotation', {
    pr_no: function (frm) {
        console.log("this function is excuted")
        if (frm.doc.pr_no) {

            frm.clear_table('items');

            frappe.model.with_doc('Purchase Requisition', frm.doc.pr_no, function () {

                let source_doc = frappe.model.get_doc('Purchase Requisition', frm.doc.pr_no);
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

