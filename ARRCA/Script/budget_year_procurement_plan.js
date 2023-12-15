
frappe.ui.form.on("Budget Year Procurement Plan", {
    annual_pro_no: function (frm, cdt, cdn) {
                        frappe.call({
                            method: "frappe.client.get_list",
                            args: {
                                doctype: 'Annual Procurement Table',
                                filters: {
                                    parent: frm.doc.annual_pro_no,
                                },
                                fields: ['*']
                            },
                            callback: function (childResponse) {

                                if (childResponse.message) {
                                    var childMessages = childResponse.message;

                                    for (var j = 0; j < childMessages.length; j++) {
                                        var childResponseItem = childMessages[j];
                                        var child = frm.add_child("procurement_table");

                                        child.type_of_material = childResponseItem.item;
                                        child.amount = childResponseItem.total;
                                        child.total_price = childResponseItem.total_cost;
                                        child.uom = childResponseItem.uom;

                                        child.medeb = childResponseItem.medeb;
                                    }

                                    frm.refresh_field("procurement_table");
                                }
                            }
                        });
                    }    
});
