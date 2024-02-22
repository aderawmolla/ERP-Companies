frappe.ui.form.on("Road maintenance plan Table",{
	data1: function(frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateTotal(frm,child);
	},
    data2: function(frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateTotal(frm,child);
	},
    data3: function(frm, cdt, cdn) {
        var child=locals[cdt][cdn]
        calculateTotal(frm,child);
	},
    data4: function(frm, cdt, cdn) {
		
        calculateTotal(frm);
	},
    data5: function(frm, cdt, cdn) {
        calculateTotal(frm);
	},
    data6: function(frm, cdt, cdn) {
        calculateTotal(frm);
	},
    data7: function(frm, cdt, cdn) {
        calculateTotal(frm);
	},
    data8: function(frm, cdt, cdn) {
        calculateTotal(frm);
	},
    data9: function(frm, cdt, cdn) {
        calculateTotal(frm);
	},
    data10: function(frm, cdt, cdn) {
        calculateTotal(frm);
	},
    data11: function(frm, cdt, cdn) {
        calculateTotal(frm);
	},
    data12: function(frm, cdt, cdn) {
        calculateTotal(frm);
	},
});
function calculateTotal(frm){
   var sum =((frm.doc.data1|| 0) +(frm.doc.data2 || 0)+(frm.doc.data3|| 0)+(frm.doc.data4 || 0)+(frm.doc.data5 || 0)+(frm.doc.data6 || 0)+(frm.doc.data7 || 0)+(frm.doc.data8 || 0)+(frm.doc.data9 || 0) +(frm.doc.data10 || 0) +(frm.doc.data11 || 0) +(frm.doc.data12 || 0));
    frm.set_value("total",sum)
    frm.refresh_field("total")
}