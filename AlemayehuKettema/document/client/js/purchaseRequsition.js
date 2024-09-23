frappe.ui.form.on('Purchase Requisition', {
	refresh(frm) {
		// your code here
	}
});
frappe.ui.form.on('RFQ item', {
    //when equip_code of Tyre Control Table changes it fetches data from the database and assign to equp_type of table document rows
    item_code: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        // Fetch information from the linked doctype using a server call
        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: 'Item',
                filters: { item_code: child.item_code },
                fieldname: ['stock_uom',"valuation_rate","item_name","description"]
            },
            callback: function (response) {
                if (response.message) {
                    // Update the "equipment_type" field in the current child table row
                    frappe.model.set_value(cdt, cdn, "conversion_factor", response.message.valuation_rate);
                    frappe.model.set_value(cdt, cdn, "item_name", response.message.item_name);
                    frappe.model.set_value(cdt, cdn, "stock_uom", response.message.stock_uom);
                    frappe.model.set_value(cdt, cdn, "description", response.message.description);
                    frm.refresh();
                    //  frappe.model.set_value(d.doctype, d.name, 'ot_total_in_birr', (d.ot_normal_amount + d.ot_knight_

                }
            }
        });

}
}
);


