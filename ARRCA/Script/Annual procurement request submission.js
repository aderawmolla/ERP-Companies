


 console.log("Here is the test on oct22,2024")

frappe.ui.form.on("Annual Procurement Request and permission Final", {
    budget_amet: function (frm, cdt, cdn) {
         getItems(frm);
    },
    office:function(frm,cdt,cdn){
        getItems(frm);
    }
});


function getItems(frm) {
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: 'Annual procurement request submission',
            filters: {
                "budget_year": frm.doc.budget_amet,
                "maintenance_office": frm.doc.office
            },
            fields: ['name', "type_of_material", "total_sum"]
        },
        callback: function (response) {
            frm.clear_table("procurement_table");
            frm.refresh_field("procurement_table");
            var itemMap = {}; // Object to track items
            var allPromises = []; // Array to store promises for all calls

            if (response.message && response.message.length > 0) {
                var all_cost = 0;
                for (var i = 0; i < response.message.length; i++) {
                    var parent = response.message[i].name;
                    var type = response.message[i].type_of_material;
                    var total_cost = response.message[i].total_sum;
                    all_cost += total_cost;

                    // Create a promise for each call
                    var promise = new Promise(function (resolve, reject) {
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
                                if (childResponse.message) {
                                    var childMessages = childResponse.message;
                                    
                                    // Loop through all items
                                    for (var j = 0; j < childMessages.length; j++) {
                                        var responseMessages = childMessages[j];
                                        var itemName = responseMessages.item;

                                        // If item already exists, sum up the relevant fields
                                        if (itemMap[itemName]) {
                                            itemMap[itemName].data_1 += responseMessages.data_1;
                                            itemMap[itemName].data_2 += responseMessages.data_2;
                                            itemMap[itemName].data_3 += responseMessages.data_3;
                                            itemMap[itemName].data_4 += responseMessages.data_4;
                                            itemMap[itemName].data_5 += responseMessages.data_5;
                                            itemMap[itemName].data_6 += responseMessages.data_6;
                                            itemMap[itemName].data_7 += responseMessages.data_7;
                                            itemMap[itemName].data_8 += responseMessages.data_8;
                                            itemMap[itemName].data_9 += responseMessages.data_9;
                                            itemMap[itemName].data_10 += responseMessages.data_10;
                                            itemMap[itemName].data_11 += responseMessages.data_11;
                                            itemMap[itemName].data_12 += responseMessages.data_12;
                                            itemMap[itemName].data_13 += responseMessages.data_13;
                                            itemMap[itemName].data_14 += responseMessages.data_14;
                                            itemMap[itemName].data_15 += responseMessages.data_15;
                                            itemMap[itemName].total += responseMessages.total;
                                            itemMap[itemName].rate = responseMessages.rate;
                                            itemMap[itemName].total_cost += responseMessages.total_cost;
                                            itemMap[itemName].item_name = responseMessages.item_name;
                                            itemMap[itemName].medeb = responseMessages.medeb;
                                        } else {
                                            // If item doesn't exist, add it to the map
                                            itemMap[itemName] = {
                                                item: responseMessages.item,
                                                uom: responseMessages.uom,
                                                data_1: responseMessages.data_1,
                                                data_2: responseMessages.data_2,
                                                data_3: responseMessages.data_3,
                                                data_4: responseMessages.data_4,
                                                data_5: responseMessages.data_5,
                                                data_6: responseMessages.data_6,
                                                data_7: responseMessages.data_7,
                                                data_8: responseMessages.data_8,
                                                data_9: responseMessages.data_9,
                                                data_10: responseMessages.data_10,
                                                data_11: responseMessages.data_11,
                                                data_12: responseMessages.data_12,
                                                data_13: responseMessages.data_13,
                                                data_14: responseMessages.data_14,
                                                data_15: responseMessages.data_15,
                                                total: responseMessages.total,
                                                rate: responseMessages.rate,
                                                total_cost: responseMessages.total_cost,
                                                medeb: responseMessages.medeb,
                                                item_name: responseMessages.item_name
                                            };
                                        }
                                    }
                                }
                                resolve(); // Resolve the promise after processing
                            },
                            error: function(error) {
                                reject(error); // Reject the promise in case of error
                            }
                        });
                    });

                    allPromises.push(promise); // Add the promise to the array
                }
            }

            // Wait for all the promises to resolve before processing the itemMap
            Promise.all(allPromises).then(function () {
                Object.keys(itemMap).forEach(function (key) {
                    var groupedItem = itemMap[key];
                    var child = frm.add_child("procurement_table");
                    child.item = groupedItem.item;
                    child.uom = groupedItem.uom;
                    child.item_name = groupedItem.item_name;
                    child.data_1 = groupedItem.data_1;
                    child.data_2 = groupedItem.data_2;
                    child.data_3 = groupedItem.data_3;
                    child.data_4 = groupedItem.data_4;
                    child.data_5 = groupedItem.data_5;
                    child.data_6 = groupedItem.data_6;
                    child.data_7 = groupedItem.data_7;
                    child.data_8 = groupedItem.data_8;
                    child.data_9 = groupedItem.data_9;
                    child.data_10 = groupedItem.data_10;
                    child.data_11 = groupedItem.data_11;
                    child.data_12 = groupedItem.data_12;
                    child.data_13 = groupedItem.data_13;
                    child.data_14 = groupedItem.data_14;
                    child.data_15 = groupedItem.data_15;
                    child.total = groupedItem.total;
                    child.rate = groupedItem.rate;
                    child.total_cost = groupedItem.total_cost;
                    child.medeb = groupedItem.medeb;
                });
                frm.set_value("total_sum", all_cost);
                frm.refresh_field("total_sum");
                frm.refresh_field("procurement_table");   
            }).catch(function(error) {
                console.error("Error processing items: ", error);
            });
        }
    });
}

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
