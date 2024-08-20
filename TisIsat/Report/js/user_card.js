cur_frm.add_fetch("employee_name", "employee_name", "name1");
cur_frm.add_fetch("employee_name", "department", "department");
cur_frm.add_fetch("item_code", "item_name", "item_name");
cur_frm.add_fetch('plate_no', 'equipment_type', 'eqipment_type');
cur_frm.add_fetch('plate_no', 'chasis_no', 'chasis_no');
cur_frm.add_fetch('plate_no', 'engine_no', 'engine_no');
cur_frm.add_fetch('palte_no', 'equipment_type', 'equipment_type');
frappe.ui.form.on('Property Sheet', {
    return_reference_no: function (frm, cdt, cdn) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Property Sheet Table',
                filters: { "parent": frm.doc.return_reference_no },
                fields: ['*']
            },
            callback: function (response) {
                frm.doc.user_card_item = [];
                var cards = response.message;
                console.log("the response messafe", cards)
                if (cards) {
                    console.log("cards excuted");
                    $.each(cards, function (index, row) {
                        var child = frappe.model.add_child(frm.doc, "property_sheet_table");
                         child.item = row.item;
                         child.item_name_or_description=row.item_name_or_description
                         child.classification_code=row.classification_code
                          child.unit=row.unit
                          child.qty=row.qty
                          child.status=row.status
                          child.unit_cost=row.unit_cost
                          child.no_of_issue_vocher=row.no_of_issue_vocher
                          child.date1=row.date1
                          
                    });
                    refresh_field("property_sheet_table");
                }
            }
        });

    },
})
frappe.ui.form.on("User Card",{
    item_group: function (frm, cdt, cdn) {
         frm.set_value("item_group","Fixed Asset");
        console.log("field refreshed");
         refresh_field("item_group");
         console.log(frm.doc.item_group)
            frm.set_query("item","user_card_item", function (frm, cdt, cdn) {
                return {
                    "filters": {
                        "item_group":frm.doc.item_group
                    }
                }
            });
      


    }
});

cur_frm.add_fetch("item", "item_name", "item_name");


frappe.ui.form.on("User Card Item", {
      price: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_price', (d.price * d.qty));   
    }
});
