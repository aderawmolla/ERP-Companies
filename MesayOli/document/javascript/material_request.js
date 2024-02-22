frappe.ui.form.on("Material Request", "refresh", function(frm) {
    if (!frm.doc.schedule_date) {
      
   
    }
	frm.fields_dict['items'].grid.get_field('item_code').get_query = function(doc, cdt, cdn) {
        var child = locals[cdt][cdn];
        return {    
            filters:[
                ['Item', 'item_sub_category', '=', child.item_sub_category]
            ]
        };
    };
});

frappe.ui.form.on("Material Request Item",{
    item_sub_category: function(frm, cdt, cdn) {
        frm.fields_dict['items'].grid.get_field('item_code').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            
            return {    
                filters:[
                    ['Item', 'item_sub_category', '=', child.item_sub_category]
                ]
            };
        };
    },
    item_code:function(frm, cdt, cdn) {
        frm.add_fetch('item_code', 'description', 'description');
        frm.add_fetch('item_code', 'stock_uom', 'uom');
        frm.add_fetch('item_code', 'weight', 'weight');
        frm.add_fetch('item_code', 'item_sub_category', 'item_category');
        refresh_field('uom');
        refresh_field('description');
        refresh_field('item_category')

    },
   
});
