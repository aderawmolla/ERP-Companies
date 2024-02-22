cur_frm.add_fetch('act_code', 'act_name', 'activity_name');
cur_frm.add_fetch('act_code', 'uom', 'unit');
cur_frm.add_fetch('act_code', 'unit_rate', 'data1');
frappe.ui.form.on('Balance Cost', {
    road_segement_name:function (frm, cdt, cdn) {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Payment SUMMARY OF ACTIVITIES',
                filters: {maintenance_route:frm.doc.road_segement_name },
                fields: ['*']
            },
            callback: function (response) {
                  var res=response.message;
                  var length=res.length
                   frm.doc.activity_cost_table=[];
                  console.log("the response in parent is",res)
                for(var i=0;i<length;i++){
                    frappe.call({
                        method: "frappe.client.get_list",
                        args: {
                            doctype: 'Payment Summary Table',
                            filters: {parent:res[i].name},
                            fields: ['*']
                        },
                        callback: function (response) {

                              var res=response.message;
                              console.log("the response is in child is",res)
                               var length=res.length
                               for(var i=0;i<length;i++){
                                var source=res[i];
                                var target=frm.add_child("activity_cost_table")
                                 target.act_code=source.act_code
                                 target.activity_name=source.description
                                 target.unit=source.unit
                                 target.data1=source.unit_price
                                 target.data2=source.quantity_executed_this_month
                                 target.row_total=source.unit_price*source.quantity_executed_this_month
                              }
                             var  toalCost=0;
                             frm.refresh_field("activity_cost_table")
                            $.each(frm.doc.activity_cost_table, function(i, row) {
                                  toalCost+=row.row_total;
                            });
                             frm.set_value("activity_cost",toalCost)
                             frm.refresh_field("activity_cost")
                             frm.refresh_field("activity_cost_table")
                        }
                    });
                  }


            }
        }); 
    },
    calculate_balance:function(frm,cdt,cdn) {
     calculateBalance(frm);
    } 
});


frappe.ui.form.on('Own Equipment Table', {
    data1: function (frm, cdt, cdn) {
        updateTotalsSum(frm, cdt, cdn, "own_equipment_running_cost", "equipment_cost", 8);
    },
    data2: function (frm, cdt, cdn) {
        updateTotalsSum(frm, cdt, cdn, "own_equipment_running_cost", "equipment_cost", 8);
    },
    data3: function (frm, cdt, cdn) {
        updateTotalsSum(frm, cdt, cdn, "own_equipment_running_cost", "equipment_cost", 8);
    },
    data4: function (frm, cdt, cdn) {
        updateTotalsSum(frm, cdt, cdn, "own_equipment_running_cost", "equipment_cost", 8);
    },
    data5: function (frm, cdt, cdn) {
        updateTotalsSum(frm, cdt, cdn, "own_equipment_running_cost", "equipment_cost", 8);
    },
    data6: function (frm, cdt, cdn) {
        updateTotalsSum(frm, cdt, cdn, "own_equipment_running_cost", "equipment_cost", 8);
    },
    data7: function (frm, cdt, cdn) {
        updateTotalsSum(frm, cdt, cdn, "own_equipment_running_cost", "equipment_cost", 8);
    },
    data8: function (frm, cdt, cdn) {
        updateTotalsSum(frm, cdt, cdn, "own_equipment_running_cost", "equipment_cost", 8);
    },
});
frappe.ui.form.on('Activity Cost Table', {
    data1: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "activity_cost_table", "activity_cost", 2);
    }, 
    data2: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "activity_cost_table", "activity_cost", 2);
    }, 

});


frappe.ui.form.on('Rental Equipment Cost Table', {
    data1: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn,"rental_equipment_running_cost", "rental_cost", 4);
    },
    data2: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "rental_equipment_running_cost", "rental_cost", 4);
    },
    data3: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "rental_equipment_running_cost", "rental_cost", 4);
    },
    data4: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "rental_equipment_running_cost", "rental_cost", 4);
    },
});

frappe.ui.form.on('Manpower Cost Table', {
    data1: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "skilled_manpower_running_cost", "skilled_manpower_cost", 4);
    },
    data2: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "skilled_manpower_running_cost", "skilled_manpower_cost", 4);
    },
    data3: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "skilled_manpower_running_cost", "skilled_manpower_cost", 4);
    },
    data4: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "skilled_manpower_running_cost", "skilled_manpower_cost", 4);
    },
});
frappe.ui.form.on('Unskilled Manpower Table', {
    data1: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "unskilled_manpower_running_cost", "unskilled_manpower_cost", 3);
    },
    data2: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "unskilled_manpower_running_cost", "unskilled_manpower_cost", 3);
    },
    data3: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "unskilled_manpower_running_cost", "unskilled_manpower_cost", 3);
    },
});

function updateTotalsSum(frm, cdt, cdn, rowField, totalField, dataLength) {
    var child = locals[cdt][cdn];
    calculateRowTotalSum(frm, child, rowField, dataLength);
    calculateRowsTotal(frm, rowField, totalField);
}
function updateTotalsProduct(frm, cdt, cdn, rowField, totalField, dataLength) {
    var child = locals[cdt][cdn];
    calculateRowTotalProduct(frm, child, rowField, dataLength);
    calculateRowsTotal(frm, rowField, totalField);
}
function calculateRowTotalSum(frm, child, field, dataLength) {
    var rowTotal = 0;
    for (var i = 1; i <= dataLength; i++) {
        rowTotal += child[`data${i}`] || 0;
    }
    child.row_total = rowTotal;
    frm.refresh_field(field);
}
function calculateRowTotalProduct(frm, child, field, dataLength) {
    var rowTotal = 1;
    for (var i = 1; i <= dataLength; i++) {
        rowTotal *= child[`data${i}`] || 1;
    }
    child.row_total = rowTotal;
    frm.refresh_field(field);
}

function calculateRowsTotal(frm, table, field) {
    var rowsTotal = frm.doc[table].reduce((total, row) => total + (row.row_total || 0), 0);
    frm.set_value(field, rowsTotal);
    frm.refresh_field(field);
}

function calculateBalance(frm){
 var running_cost=((frm.doc.equipment_cost||0)+(frm.doc.rental_cost||0)+(frm.doc.skilled_manpower_cost||0)+(frm.doc.unskilled_manpower_cost||0));
 var overHeadCost=running_cost*0.15;
 var expCost=running_cost+overHeadCost;
   frm.set_value("activity_total_cost",frm.doc.activity_cost||0);
   frm.set_value("running_cost",running_cost);
   frm.set_value("over_head_cost",overHeadCost);
   frm.set_value("expenditure_cost",expCost);
   frm.set_value("balance",frm.doc.activity_cost-expCost);
   frm.fresh();
}

