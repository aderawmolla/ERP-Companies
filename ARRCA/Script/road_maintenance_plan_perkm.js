frappe.ui.form.on("Road maintenance plan Table", {
	data1: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},
    data2: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},
    data3: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},
    data4: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},
    data5: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},
    data6: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},
    data7: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},
    data8: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},
    data9: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child);

	},


});


function calculateTotal(frm,child){
   var sum=(child.data1||0) +(child.data2||0)+(child.data3||0)+(child.data4||0)+(child.data5||0)+(child.data6||0)+(child.data7||0)+(child.data8||0)+(child.data9||0);
   frm.set_value("total",sum)
   frm.refresh_field("total")

}