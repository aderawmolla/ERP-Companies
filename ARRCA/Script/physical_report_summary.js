frappe.ui.form.on('Physical Report Summary Table', {
    office: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,2);
    },
    type: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]

    },
});
// window[`data${j}`] += parseFloat(row[`data${j}`] || 0);
function plannedKm(frm,child){
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: '',
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

function calculatePlanned(frm, child, len) {
  planned = 0;
  for (var i = 1; i <= len; i++) {
    planned += (child[`data${i}`]||0);
  }
  child[`data${len}`] = planned;
  frm.refresh_field("physical_report_table");
}

function calculateExcuted(frm, child, len) {
  excuted = 0;
  for (var i = 1; i <= len; i++) {
    excuted += (child[`data${i}${i}`]||0);
  }
  child[`data${len}${len}`] = excuted;
  frm.refresh_field("physical_report_table");
}

function calculatePercentage(frm, child, len) {
  if (excuted !== 0) {
    child[`data${len}${len}${len}`] = (planned / excuted) * 100;
    child.year_comparasion=(child.planned/excuted)*100
  } else {
    child[`data${len}${len}${len}`] = 0;
    child.year_comparasion=(child.planned/excuted)*100

  }
  frm.refresh_field("physical_report_table");
}
