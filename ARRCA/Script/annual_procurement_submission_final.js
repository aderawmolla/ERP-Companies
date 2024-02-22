
frappe.ui.form.on("Annual Procurement Request and permission Final", {
    budget_amet: function (frm, cdt, cdn) {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Annual procurement request submission',
                filters: {
                    "budget_year": frm.doc.budget_amet,"maintenance_office":frm.doc.office
                },
                fields: ['name', "type_of_material", "total_sum"]
            },
            callback: function (response) {
                frm.clear_table("procurement_table");
                frm.refresh_field("procurement_table");

                if (response.message && response.message.length > 0) {
                    console.log("the response is", response.message);
                     var all_cost=0;
                    for (var i = 0; i < response.message.length; i++) {
                        var parent = response.message[i].name;
                        var type = response.message[i].type_of_material;
                        var total_cost = response.message[i].total_sum;
                        all_cost+=total_cost;
                        (function (type) {
                            frappe.call({
                                method: "frappe.client.get_list",
                                args: {
                                    doctype: 'Annual Procurement Table',
                                    filters: {
                                        parent: parent,
                                    },
                                    fields: ['*']
                                },
                                callback: function (childResponse) {
                                    console.log("here executed");
                                    if (childResponse.message) {
                                        var childMessages = childResponse.message;
                                        for (var j = 0; j < childMessages.length; j++) {
                                            var responseMessages = childMessages[j];
                                            var child = frm.add_child("procurement_table")
                                            child.item = responseMessages.item
                                            child.uom = responseMessages.uom
                                            child.data_1 = responseMessages.data_1
                                            child.data_2 = responseMessages.data_2
                                            child.data_3 = responseMessages.data_3
                                            child.data_4 = responseMessages.data_4
                                            child.data_5 = responseMessages.data_5
                                            child.data_6 = responseMessages.data_6
                                            child.data_7 = responseMessages.data_7
                                            child.data_8 = responseMessages.data_8
                                            child.data_9 = responseMessages.data_9
                                            child.data_10 = responseMessages.data_10
                                            child.data_11 = responseMessages.data_11
                                            child.data_12 = responseMessages.data_12
                                            child.data_13 = responseMessages.data_13
                                            child.data_14 = responseMessages.data_14
                                            child.data_15 = responseMessages.data_15
                                            child.total = responseMessages.total
                                            child.rate = responseMessages.rate
                                            child.total_cost = responseMessages.total_cost
                                            child.medeb = responseMessages.medeb
                                        }
                                        frm.set_value("total_sum", all_cost);
                                        frm.refresh_field("total_sum");
                                        frm.refresh_field("procurement_table");
                                    }
                                }
                            });
                        })(type);
                    }
                }
            }
        });
    }
});
frappe.ui.form.on('Annual Procurement Table', {
    rate: function (frm, cdt, cdn) {
        console.log("change detected");
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_1: function (frm, cdt, cdn) {
        console.log("called");
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_2: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_3: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_4: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_5: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_6: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_7: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_8: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_9: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_10: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_11: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_12: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_13: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_14: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
    data_15: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        calculateRowTotal(child, frm);
    },
});

function calculateRowTotal(child, frm) {
    var row_total = (
        child.data_1 | 0 +
        child.data_2 | 0 +
        child.data_3 | 0 +
        child.data_4 | 0 +
        child.data_5 | 0 +
        child.data_6 | 0 +
        child.data_7 | 0 +
        child.data_8 | 0 +
        child.data_9 | 0 +
        child.data_10 | 0 +
        child.data_11 | 0 +
        child.data_12 | 0 +
        child.data_13 | 0 +
        child.data_14 | 0 +
        child.data_15 | 0
    );

    child.total = parseFloat(row_total);

    var total_cost = 0;

    $.each(frm.doc.procurement_table, function (i, d) {
        // Make sure 'total' and 'rate' properties exist before using them
        // calculate incentive
        child.total_cost = d.total * d.rate;

        total_cost += d.total * d.rate;
    });

    frm.refresh_field("procurement_table");
    frm.set_value("total_sum", total_cost);
}
