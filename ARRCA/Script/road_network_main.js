frappe.ui.form.on('Road Network Table', {
    data_1: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: 'Road Segment Data',
                filters: {"name": child.data_1},
                fieldname: ['road_length']
            },
            callback: function (response) {
                   console.log("The parent of this list: ", response);            
                    frappe.model.set_value(cdt, cdn, "roads_length", response.message.road_length);
                    frm.refresh()   
            }
        });
    }
});
