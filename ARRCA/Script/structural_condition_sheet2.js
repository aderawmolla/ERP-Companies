cur_frm.add_fetch('act_code', 'act_name', 'act_name');
cur_frm.add_fetch('act_code', 'uom', 'unit');
cur_frm.add_fetch('act_code', 'unit_rate', 'unit_price');
frappe.ui.form.on('Road Condition Summary', {
    act_code: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateTotalAct(frm, child);
    },

});
function calculateTotalAct(frm, child) {
    var data = frm.doc.sheet1_table
    var length = data.length
    console.log("data", data, length)
    var actQty = 0;
    var act = child.act_code
    console.log("string activity is",)
    for (var i = 0; i < length; i++) {
        console.log("excute this")
        if (data[i].condition == "act") {
            console.log("excute this 3")
            for (var j = 0; j <= 7; j++) {
                console.log("data of this", data[i][`data${j}`])
                if (data[i][`data${j}`] == `${act}`) {
                    var columnQty = data[i + 1][`data${j}`]
                    actQty += (parseFloat(columnQty) || 0)
                    console.log("act qty is", actQty)
                }
            }
        }
    }
    child.qty = actQty
    child.amount = child.unit_price * actQty
    frm.refresh_field("sheet1_table")
    frm.refresh()
}
frappe.ui.form.on('Structural Activity and Quantity', {
    // data1: function (frm, cdt, cdn) {
    //     var child = locals[cdt][cdn];
    //     if (child.condition == "qty" && !child.data1) {
    //         findQty(frm, child);
    //     }
    // },
    // data2: function (frm, cdt, cdn) {
    //     var child = locals[cdt][cdn];
    //     if (child.condition == "qty") {
    //         findQty(frm, child);
    //     }
    // },
    // data3: function (frm, cdt, cdn) {
    //     var child = locals[cdt][cdn];
    //     if (child.condition == "qty") {
    //         findQty(frm, child);
    //     }
    // },
    // data4: function (frm, cdt, cdn) {
    //     var child = locals[cdt][cdn];
    //     if (child.condition == "qty") {
    //         findQty(frm, child);
    //     }
    // },
    // data5: function (frm, cdt, cdn) {
    //     var child = locals[cdt][cdn];
    //     if (child.condition == "qty") {
    //         findQty(frm, child);
    //     }
    // },
    // data6: function (frm, cdt, cdn) {
    //     var child = locals[cdt][cdn];
    //     if (child.condition == "qty" ) {
    //         findQty(frm, child);
    //     }
    // },
    // data7: function (frm, cdt, cdn) {
    //     var child = locals[cdt][cdn];
    //     if (child.condition == "qty") {
    //         findQty(frm, child);
    //     }
    // },
    condition: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        if (child.condition == "qty") {
            findQty(frm, child);
        }

    },

});
function findQty(frm, child) {
    var sheet2Table=frm.doc.sheet1_table
    var actLength=sheet2Table.length;
    var  sheet2ActRow;
  for(var i=0;i<actLength;i++ ){
     if(sheet2Table[i].initial_coordinate == child.initial_coordinate && sheet2Table[i].condition=="act"){
        sheet2ActRow=sheet2Table[i];
        console.log("sheet 2 act row",sheet2ActRow)
     }
  }
  frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Severity and Extent Table',
        filters: { "parent": frm.doc.sheet1 },
        fields: ['*']
    },
    callback: function (response) {
        var sheet1Table = response.message;
        var sheet1SevRow;
        var sheet1ExtRow;
        var length = sheet1Table.length;

        for (var i = 0; i < length; i++) {
            if (sheet1Table[i].initial_coordinate == child.initial_coordinate && 
                sheet1Table[i].condition == "sev") {
                sheet1SevRow = sheet1Table[i];
                console.log("sheet 1 table row is", sheet1SevRow);
            } else if (sheet1Table[i].initial_coordinate == child.initial_coordinate &&
                sheet1Table[i].condition == "ext") {
                sheet1ExtRow = sheet1Table[i];
                console.log("sheet 1 ext row is", sheet1ExtRow);
            }
        }
         var defectArray=
         [
        "2.1.1 Silted/Blocked",
        "2.1.2 Outfall Scoured",
        "2.1.3 Structural Damage",
        "2.2.1 Dirty",
        "2.2.2 Damaged/Corroded",
        "2.2.3 Missing",
        "2.3.1 Structural Damage"
        ]
var dataSev = [];
var dataExt = [];
var actArray = [];
var qtyArray = [];
var promises = [];

// Make sure sheet2ActRow, sheet1SevRow, and sheet1ExtRow are defined
var sheet2ActRow = sheet2ActRow || {};
var sheet1SevRow = sheet1SevRow || {};
var sheet1ExtRow = sheet1ExtRow || {};

for (var i = 0; i < 7; i++) {
    actArray.push(sheet2ActRow[`data${i + 1}`] || 0)
    dataSev.push(sheet1SevRow[`data${i + 1}`] || 0);
    dataExt.push(sheet1ExtRow[`data${i + 1}`] || 0);

    var promise = new Promise((resolve, reject) => {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'Severity and Extent Data',
                filters: { "defect": defectArray[i], "sev": dataSev[i], "ext": dataExt[i] },
                fieldname: ['name']
            },
            callback: (function (index) {
                return function (response) {
                    console.log("the response for this is",response)
                    if (response.message) {
                        frappe.call({
                            method: 'frappe.client.get_list',
                            args: {
                                doctype: 'Activity and Quantity Table',
                                filters: { "parent":response.message.name, "act_code": actArray[index] },
                                fields: ['quantity', "parent", "act_code"]
                            },
                            callback: function (res) {
                                console.log("qty response is", res);
                                if (res.message && res.message.length > 0 && res.message[0].quantity !== undefined) {
                                    var qty = res.message[0].quantity || 0;
                                    console.log("qty is", qty);
                                    qtyArray[index]=qty;
                                    resolve();
                                } else {
                                    // Handle the case where quantity is undefined or the response is empty
                                    console.error("Error: Quantity is undefined or response is empty");
                                    resolve();
                                }
                            }
                        });
                    } else {
                        qtyArray.push(0)
                        resolve(); // Resolve the promise even if there's no response.message
                    }
                };
            })(i)
        });
    });

    promises.push(promise);
}

Promise.all(promises)
    .then(() => {
        console.log("All qty requests are completed");
        // Now, qtyArray should contain all the quantities
        for (var i = 1; i <= 7; i++) {
            child[`data${i}`] = qtyArray[i - 1];
        }
        frm.refresh_field("sheet1_table");
        frm.refresh();
    })
    .catch((error) => {
        console.error("Error in processing qty requests:", error);
    });

        }  
        //assigning child table
   
    
});

}


