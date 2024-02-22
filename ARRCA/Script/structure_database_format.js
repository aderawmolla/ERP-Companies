frappe.ui.form.on('stru', {
    structure_type: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Road Segment Table',
                filters: {"parent": frm.doc.road_segment_name,"structure_type":child.structure_type},
                fields: ['*']
            },
            callback: function (response) {
                console.log("Callback executed");
                console.log("The parent of this list: ", response);
                if (response.message && response.message[0]) {
                    var result = response.message[0];
                    frappe.model.set_value(cdt, cdn, "qty", result.qty);
                    frm.refresh()
                }
            }
        });
    }
});
