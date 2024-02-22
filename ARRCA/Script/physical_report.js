frappe.ui.form.on('Financial Report Table', {
    data2: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,2);
    },
    data22: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateExcuted(frm,child,2);
        calculatePercentage(frm,child,2)
    },
    data3: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,3);
    },
    data33: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateExcuted(frm,child,3);
        calculatePercentage(frm,child,3)
    },
    data4: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,4);
    },
    data44: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateExcuted(frm,child,4);
        calculatePercentage(frm,child,4)
    },
    data5: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,5);
    },
    data55: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateExcuted(frm,child,5);
        calculatePercentage(frm,child,5)
    },
    data6: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,6);
    },
    data66: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateExcuted(frm,child,6);
        calculatePercentage(frm,child,6)
    },
    data7: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,7);
    },
    data77: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateExcuted(frm,child,7);
        calculatePercentage(frm,child,7)
    },
    data8: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,8);
    },
    data88: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateExcuted(frm,child,8);
        calculatePercentage(frm,child,8)
    },
    data9: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculatePlanned(frm,child,9);
    },
    data99: function (frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateExcuted(frm,child,9);
        calculatePercentage(frm,child,9)
    },


});
// window[`data${j}`] += parseFloat(row[`data${j}`] || 0);
var excuted = 0;
var planned = 0;

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
