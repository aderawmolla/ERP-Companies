cur_frm.add_fetch("project", "series", "naming_series");
cur_frm.add_fetch("transfer_order_no", "from_warehouse", "from_warehouse");
cur_frm.add_fetch("transfer_order_no", "to_warehou", "to_wareh");
cur_frm.add_fetch("store_request_no", "requested_project", "from_warehouse");
cur_frm.add_fetch("store_request_no", "requested_from", "to_wareh");
cur_frm.add_fetch("purchase_receipt_no", "set_warehouse", "from_warehouse");
cur_frm.add_fetch("plate_no", "equipment_type", "equipment_type");
cur_frm.add_fetch("fuel_request_no", "previous_km_reading", "previous_km_reading");
var prNoArray7=[];

frappe.ui.form.on('Issue Table', {
    issue_order_no: function (frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        if (child.issue_order_no && prNoArray7.includes(child.issue_order_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("ISSUE No {0} already selected. Please choose a different PR No.", [child.issue_order_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        }

  else{
    prNoArray7.push(child.issue_order_no)

        frappe.model.with_doc('Issue Order', child.issue_order_no, function () {

            let source_doc = frappe.model.get_doc('Issue Order', child.issue_order_no);

            $.each(source_doc.item, function (index, source_row) {
                const target_row = frm.add_child('items');	
                target_row.item_category = source_row.item_category;
                target_row.item_code= source_row.item_code; 
                target_row.qty= source_row.qty;
                target_row.description = source_row.description;
                target_row.uom = source_row.uom;
                target_row.transfer_qty=source_row.qty;
                
            });

            frm.refresh_field('items');
        });
    
  }
        
    },
});

frappe.ui.form.on('Stock Entry', {
    grn: function (frm) {
        if (frm.doc.grn) {
            frm.clear_table('items');
            frappe.model.with_doc('Purchase Receipt', frm.doc.grn, function () {
                let source_doc = frappe.model.get_doc('Purchase Receipt', frm.doc.grn);
                $.each(source_doc.items, function (index, source_row) {
                    const target_row = frm.add_child('items');	
                    target_row.item_category = source_row.item_sub_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.basic_rate = source_row.rate;
                    target_row.basic_amount = source_row.amount;
                    target_row.transfer_qty=source_row.qty;
                });

                frm.refresh_field('items');
            });
        }
    },
});

frappe.ui.form.on('Stock Entry', {
    purchase_receipt_no: function (frm) {
        if (frm.doc.purchase_receipt_no) {
            frm.clear_table('items');
            frappe.model.with_doc('Purchase Receipt', frm.doc.purchase_receipt_no, function () {

                let source_doc = frappe.model.get_doc('Purchase Receipt', frm.doc.purchase_receipt_no);

                $.each(source_doc.items, function (index, source_row) {

                    const target_row = frm.add_child('items');	
                    target_row.item_category = source_row.item_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.basic_rate = source_row.rate;
                    target_row.basic_amount = source_row.amount;
                });

                frm.refresh_field('items');
            });
        }
    },
});
var prNoArray1=[];
frappe.ui.form.on('SEPR table', {
    purchase_receipt_no: function (frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        if (child.purchase_receipt_no && prNoArray1.includes(child.purchase_receipt_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("PR No {0} already selected. Please choose a different PR No.", [child.purchase_receipt_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        }
        else{
            // frm.clear_table('items');
            prNoArray1.push(child.purchase_receipt_no)
            frappe.model.with_doc('Purchase Receipt', child.purchase_receipt_no, function () {

                let source_doc = frappe.model.get_doc('Purchase Receipt', child.purchase_receipt_no);

                $.each(source_doc.items, function (index, source_row) {

                    const target_row = frm.add_child('items');	
                    target_row.item_category = source_row.item_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.basic_rate = source_row.rate;
                    target_row.basic_amount = source_row.amount;
                });

                frm.refresh_field('items');
            });
        }
    },
});
frappe.ui.form.on('Stock Entry', {

    transfer_order_no: function (frm) {

        if (frm.doc.transfer_order_no) {

            frm.clear_table('items');

            frappe.model.with_doc('Transfer Order', frm.doc.transfer_order_no, function () {

                let source_doc = frappe.model.get_doc('Transfer Order', frm.doc.transfer_order_no);

                $.each(source_doc.item, function (index, source_row) {

                    const target_row = frm.add_child('items');
                    target_row.item_code = source_row.item_code;
                    target_row.item_category = source_row.item_sub_category;
		    target_row.description = source_row.description;
		    target_row.qty = source_row.qty;
		    target_row.uom = source_row.uom;

                });

                frm.refresh_field('items');
            });
        }
    }
});

frappe.ui.form.on('Stock Entry', {

    store_request_no: function (frm) {

        if (frm.doc.store_request_no) {
            
            frm.clear_table('items');

            frappe.model.with_doc('Material Request', frm.doc.store_request_no, function () {
                
                let source_doc = frappe.model.get_doc('Material Request', frm.doc.store_request_no);

                $.each(source_doc.items, function (index, source_row) {

                const target_row = frm.add_child('items');	
                target_row.item_category = source_row.item_sub_category;
                target_row.item_code= source_row.item_code; 
                target_row.qty= source_row.qty;
                target_row.description = source_row.description;
                target_row.uom = source_row.uom;
                target_row.basic_rate = source_row.rate;
                target_row.basic_amount = source_row.amount;
		 target_row.transfer_qty= source_row.qty;
		 target_row.stock_uom= source_row.uom;
                });

                frm.refresh_field('items');
            });
        }
    },
});


frappe.ui.form.on('Stock Entry',{
    transfer_out_no: function (frm) {
        if (frm.doc.transfer_out_no) {
            frm.clear_table('items');
            frappe.model.with_doc('Stock Entry', frm.doc.transfer_out_no, function () {
                let source_doc = frappe.model.get_doc('Stock Entry', frm.doc.transfer_out_no);
                 frm.doc.from_warehouse=source_doc.from_warehouse
                 frm.doc.receiving_project=source_doc.to_wareh||source_doc.project
                 frm.doc.project=source_doc.project
                 frm.refresh_field("from_warehouse");
                 frm.refresh_field("receiving_project");
                 frm.refresh_field("project");
                $.each(source_doc.items, function (index, source_row) {
                    const target_row = frm.add_child('items');	
                    target_row.item_category = source_row.item_sub_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.basic_rate = source_row.rate;
                    target_row.transfer_qty=source_row.qty;
                    target_row.basic_amount = source_row.amount;
                    target_row.uom_conversion_factor = 1;

                });
                
                frm.refresh_field('items');
            });
        }
    },
    siv_no: function (frm) {

        if (frm.doc.siv_no) {
            
            frm.clear_table('items');

            frappe.model.with_doc('Stock Entry', frm.doc.siv_no, function () {
                
                let source_doc = frappe.model.get_doc('Stock Entry', frm.doc.siv_no);

                $.each(source_doc.items, function (index, source_row) {

                    const target_row = frm.add_child('items');	
                    target_row.item_category = source_row.item_sub_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.basic_rate = source_row.rate;
                    target_row.basic_amount = source_row.amount;
                    target_row.uom_conversion_factor = 1;

                });

                frm.refresh_field('items');
            });
        }
    },

});
//SETOO Table

var prNoArray3=[]
frappe.ui.form.on('SETO Table', {

    transfer_order_no: function (frm,cdt,cdn) {
        var child=locals[cdt][cdn]

        if (child.transfer_order_no && prNoArray3.includes(child.transfer_order_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("TO No {0} already selected. Please choose a different PR No.", [child.transfer_order_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        }
         else{ 
            // frm.clear_table('items');
            prNoArray3.push(child.transfer_order_no)
            frappe.model.with_doc('Transfer Order', child.transfer_order_no, function () {
                
                let source_doc = frappe.model.get_doc('Transfer Order', child.transfer_order_no);
                $.each(source_doc.items, function (index, source_row) {
                    const target_row = frm.add_child('items');	
                    target_row.item_category = source_row.item_sub_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;

                });

                frm.refresh_field('items');
            });
        }   

    },
});
var prNoArray4=[];
frappe.ui.form.on('SETOO Table', {
    transfer_out_no: function (frm,cdt,cdn) {
        console.log("excute this")
       var child=locals[cdt][cdn]
        if (child.transfer_out_no && prNoArray4.includes(child.transfer_out_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("TO No {0} already selected. Please choose a different TO No.", [child.transfer_out_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        }
           else{
            // frm.clear_table('items');
            prNoArray4.push(child.transfer_out_no)
            frappe.model.with_doc('Stock Entry', child.transfer_out_no, function () {
                let source_doc = frappe.model.get_doc('Stock Entry', child.transfer_out_no);
                $.each(source_doc.items, function (index, source_row) {
                    const target_row = frm.add_child('items');	
                    target_row.item_category = source_row.item_sub_category;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.basic_rate = source_row.rate;
                    target_row.basic_amount = source_row.amount;
                    target_row.uom_conversion_factor = 1;
                });

                frm.refresh_field('items');
            });
         }
    },
});
frappe.ui.form.on("Stock Entry", {
   	transfer_order_no: function(frm, cdt, cdn) {
	frm.add_fetch('transfer_order_no', 'from_warehouse', 'from_warehouse');
	frm.add_fetch('transfer_order_no', 'order_by', 'to_wareh');
        refresh_field('order_by');
	refresh_field('from_warehouse');
        console.log("test last");
    }
});



frappe.ui.form.on('Stock Entry', {

    sr_no: function (frm) {

        if (frm.doc.sr_no) {
            
            frm.clear_table('items');

            frappe.model.with_doc('Material Request', frm.doc.sr_no, function () {
                
                let source_doc = frappe.model.get_doc('Material Request', frm.doc.sr_no);

                $.each(source_doc.items, function (index, source_row) {

                const target_row = frm.add_child('items');	
                target_row.item_category = source_row.item_sub_category;
                target_row.item_code= source_row.item_code; 
                target_row.qty= source_row.qty;
                target_row.description = source_row.description;
                target_row.uom = source_row.uom;
                target_row.basic_rate = source_row.rate;
                target_row.basic_amount = source_row.amount;
                });

                frm.refresh_field('items');
            });
        }
    },
});
var prNoArray2=[];
frappe.ui.form.on('SEMR Table', {

    sr_no: function (frm,cdt,cdn) {
        var child=locals[cdt][cdn]


        if (child.sr_no && prNoArray2.includes(child.sr_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("SR No {0} already selected. Please choose a different PR No.", [child.sr_no])
            });

            frappe.model.clear_doc(cdt, cdn);
        }
        else{
            prNoArray2.push(child.sr_no)
            // frm.clear_table('items');

            frappe.model.with_doc('Material Request', child.sr_no, function () {
                
                let source_doc = frappe.model.get_doc('Material Request', child.sr_no);

                $.each(source_doc.items, function (index, source_row) {

                const target_row = frm.add_child('items');	
                target_row.item_category = source_row.item_sub_category;
                target_row.item_code= source_row.item_code; 
                target_row.qty= source_row.qty;
                target_row.description = source_row.description;
                target_row.uom = source_row.uom;
                target_row.basic_rate = source_row.rate;
                target_row.basic_amount = source_row.amount;
                });

                frm.refresh_field('items');
            });
        } 
    },
});



frappe.ui.form.on('Stock Entry', {

    fuel_request_no: function (frm) {

        if (frm.doc.fuel_request_no) {
            
            frm.clear_table('items');

            frappe.model.with_doc('Fuel Request for Equipment Form', frm.doc.fuel_request_no, function () {
                let source_doc = frappe.model.get_doc('Fuel Request for Equipment Form', frm.doc.fuel_request_no);
                $.each(source_doc.items, function (index, source_row) {
                const target_row = frm.add_child('items');	
                target_row.item_category = source_row.serial_no;
                target_row.item_code= source_row.item_code; 
                target_row.qty= source_row.qty;
                target_row.description = source_row.description;
                target_row.uom = source_row.uom;
                target_row.basic_rate = source_row.rate;
                target_row.basic_amount = source_row.amount;
                });
                frm.refresh_field('items');
            });
        }
    },
});


frappe.ui.form.on("Stock Entry Detail", {
      qty: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'transfer_qty', (d.qty * 1));   
    }
});
