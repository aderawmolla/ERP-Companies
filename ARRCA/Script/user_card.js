cur_frm.add_fetch("employee_name", "employee_name", "name1");
cur_frm.add_fetch("employee_name", "department", "department");
cur_frm.add_fetch("item_code", "item_name", "item_name");
cur_frm.add_fetch('plate_no', 'equipment_type', 'eqipment_type');
cur_frm.add_fetch('plate_no', 'chasis_no', 'chasis_no');
cur_frm.add_fetch('plate_no', 'engine_no', 'engine_no');
cur_frm.add_fetch('palte_no', 'equipment_type', 'equipment_type');
frappe.ui.form.on('User Card', {
    user_card: function (frm, cdt, cdn) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'User Card Item',
                filters: { "parent": frm.doc.user_card },
                fields: ['*']
            },
            callback: function (response) {
                frm.doc.user_card_item = [];
                var cards = response.message;
                console.log("the response messafe", cards)
                if (cards) {
                    console.log("cards excuted");
                    $.each(cards, function (index, row) {
                        var child = frappe.model.add_child(frm.doc, "user_card_item");
                        child.item = row.item;
                        child.status = row.status;
                        child.qty = row.qty;
                        child.serial_no = row.serial_no;
                        child.model = row.model;
                        child.item_code = row.item_code;
                        child.price = row.price;
                    });
                    refresh_field("user_card_item");
                }
            }
        });

    }
})
frappe.ui.form.on("User Card",{
    onload: function (frm, cdt, cdn) {
         frm.set_value("item_group","Fixed Asset");
        console.log("field refreshed");
         refresh_field("item_group");
        console.log(frm.doc.item_group)
            frm.set_query("item","user_card_item", function (frm, cdt, cdn) {
                return {
                    "filters": {
                        "item_group":"Fixed Asset"
                    }
                }
            });
      


    }
});

cur_frm.add_fetch("item", "item_name", "item_name");


frappe.ui.form.on("User Card Item", {
      price:function(frm, cdt, cdn) {
      var d = locals[cdt][cdn];
      frappe.model.set_value(d.doctype, d.name, 'total_price', (d.price * d.qty));   
    }
});
