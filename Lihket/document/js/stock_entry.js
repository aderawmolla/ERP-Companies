cur_frm.add_fetch("item_code", "brand", "brand");

cur_frm.add_fetch("item_code", "shelf_no", "location");

frappe.ui.form.on('Stock Entry', {
    refresh: function(frm) {
        frm.fields_dict['mr_no'].get_query = function(doc) {
            return {
                filters: {
                    'docstatus': 1  // Show only submitted Material Requests
                }
            };
        };
    }
});


frappe.ui.form.on('Stock Entry', {
    refresh: function(frm) {
        frm.fields_dict['items'].grid.get_field('material_request').get_query = function(doc, cdt, cdn) {
            return {
                filters: {
                    'docstatus': 1  // Filters to show only submitted Material Requests
                }
            };
        };
    }
});




frappe.ui.form.on('Stock Entry', {
    mr_no: function (frm) {
        if (frm.doc.mr_no) {
            frm.clear_table('table_9');
            frappe.model.with_doc('Material Request', frm.doc.mr_no, function () {

                let source_doc = frappe.model.get_doc('Material Request', frm.doc.mr_no);


                $.each(source_doc.items, function (index, source_row) {

                    const target_row = frm.add_child('items');	
                    target_row.item_code= source_row.item_code; 
                    target_row.item_name= source_row.item_name;
                    target_row.shelf_no = source_row.shelf_no;
                    target_row.qty = source_row.qty;
                    target_row.uom = source_row.uom;
                    target_row.conversion_factor = source_row.conversion_factor;
                    target_row.description = source_row.description;
                    target_row.stock_uom = source_row.stock_uom;
                    target_row.warehouse = source_row.t_warehouse;
                    target_row.project = source_row.lproject;
                    target_row.cost_center = source_row.cost_center;

                });

                frm.refresh_field('items');
            });
        }
    },
});
