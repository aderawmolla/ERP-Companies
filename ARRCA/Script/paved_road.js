// frappe.ui.form.on("ARRCA Paved Road Quantities Form",
//     {
//         onload: function (frm, cdt, cdn) {
//             for (var i = 0; i < list.length; i++) { var table_row = frm.add_child("arrca_paved_road_quantities_form_table"); table_row.carrige_condition = list[i]; } frm.refresh_field("arrca_paved_road_quantities_form_table");
//         }
//     }); frappe.ui.form.on('ARRCA Paved Road Quantities Form Table', {
//         a0_500_act_1: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a0_500_qt_1: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }, a500_1000_act_1: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a500_1000_qt_1: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }, a0_500_act_2: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a0_500_qt_2: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }, a500_1000_act_2: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a500_1000_qt_2: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }, a0_500_act_3: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a0_500_qt_3: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }, a500_1000_act_3: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a500_1000_qt_3: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }, a0_500_act_4: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a0_500_qt_4: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }, a500_1000_act_4: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a500_1000_qt_4: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }, a0_500_act_5: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); }, a0_500_qt_5: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); },
//         a500_1000_act_5: function (frm, cdt, cdn) { calculateTotalAct(frm, cdt, cdn); },
//         a500_1000_qt_5: function (frm, cdt, cdn) { calculateTotalQt(frm, cdt, cdn); }
//     });
// function calculateTotalAct(frm, cdt, cdn) {
//     console.log("calculating actual");
//     var child = locals[cdt][cdn];
//     var totalAc = child.a0_500_act_1 + child.a500_1000_act_1 + child.a0_500_act_2 + child.a500_1000_act_2 + child.a0_500_act_3 + child.a500_1000_act_3 + child.a0_500_act_4 + child.a500_1000_act_4 + child.a0_500_act_5 + child.a500_1000_act_5;
//     frappe.model.set_value(cdt, cdn, "total_act1", totalAc); calculateTotal(frm); frm.refresh();
// } function calculateTotalQt(frm, cdt, cdn) {
//     var child = locals[cdt][cdn];
//     console.log("calculating total quantity"); var totalQt = child.a0_500_qt_1 + child.a500_1000_qt_1 + child.a0_500_qt_2 + child.a500_1000_qt_2 + child.a0_500_qt_3 + child.a500_1000_qt_3 + child.a0_500_qt_4 + child.a500_1000_act_4 + child.a0_500_qt_5 + child.a500_1000_qt_5; frappe.model.set_value(cdt, cdn, "total_qt1", totalQt); calculateTotal(frm); frm.refresh();
// } function calculateTotal(frm) {
//     console.log("excute maintainance schedule")
//     var total_cost_ac = 0;
//     var total_qt = 0; $.each(frm.doc.arrca_paved_road_quantities_form_table,
//         function (index, row) {
//             total_cost_ac += row.total_act1; total_qt += row.total_qt1;
//         });
//     frm.set_value("total_cost", total_cost_ac);
//     frm.set_value("total_qt", total_qt); frm.refresh()
// }