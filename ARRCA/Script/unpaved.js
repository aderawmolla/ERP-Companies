frappe.ui.form.on("ARRCA Unpaved Road Quantities Form",{
    onload: function(frm, cdt, cdn) {
        var list = [
            "Left Side drain silt",
            "Left Side drain Scour",
            "Left Shoulder Deform",
            "Left Shoulder Scour",
            "Left Shoulder Vegtation",
            "Left Edge step",
            "left Edge damage",
            "Carrigeway Rutting",
            "Carrigeway Corrogation",
            "Carrigeway Cracking wheel track",
            "Carrigeway Creacking other",
            "Carrigeway Stripping",
            "Carrigeway photoles",
            "Carrigeway Bleeding",
            "Carrigeway Failures",
            "Carrigeway Safety",
            "Carrigeway lane Marking",
            "Right Side drain silt",
            "Right Side drain Scour",
            "RIght Shoulder Deform",
            "Right Shoulder Scour",
            "Right Shoulder Vegtation",
            "Right Edge step",
            "Right Edge damage"
        ];

        for (var i = 0; i < list.length; i++) {
            var table_row = frm.add_child("arrca_paved_road_quantities_form_table");
             table_row.carrige_condition=list[i];
        }

         frm.refresh_field("arrca_paved_road_quantities_form_table");
    }
   
   });
frappe.ui.form.on("ARRCA Unpaved Road Quantities Form",{

activity:function(frm,cdt,cdn){
       frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Task',
                    filters: {'name': frm.doc.activity },
                    fields: ['name',"subject","unit","direct_cost_after_conversion"],
                },
                callback: function (response) {
                    console.log("the response message is",response.message)
                    if (response.message) {  
                       
                      frm.set_value("description",response.message[0].subject);
                      frm.set_value("uom",response.message[0].unit);
                      frm.set_value("unit_rate",response.message[0].direct_cost_after_conversion);
                    frm.refresh();
                    }
            }
    });
   }
});
frappe.ui.form.on('ARRCA Unpaved Road Quantities Form Table',{
    a0_500_act_1: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },
    a0_500_qt_1: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a500_1000_act_1: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },
    a500_1000_qt_1: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a0_500_act_2: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },
    a0_500_qt_2: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a500_1000_act_2: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },

    a500_1000_qt_2: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a0_500_act_3: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },
    a0_500_qt_3: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a500_1000_act_3: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },

    a500_1000_qt_3: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a0_500_act_4: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },
    a0_500_qt_4: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a500_1000_act_4: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },

    a500_1000_qt_4: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a0_500_act_5: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },
    a0_500_qt_5: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    },
    a500_1000_act_5: function (frm, cdt, cdn) {
        calculateTotalAct(frm, cdt, cdn);
    },
    a500_1000_qt_5: function (frm, cdt, cdn) {
        calculateTotalQt(frm, cdt, cdn);
    }

});

function calculateTotalAct(frm, cdt, cdn) {
        console.log("calculating actual");
        var child = locals[cdt][cdn];
        var totalAc = child.a0_500_act_1 + child.a500_1000_act_1 + child.a0_500_act_2 + child.a500_1000_act_2 + child.a0_500_act_3 + child.a500_1000_act_3 + child.a0_500_act_4 + child.a500_1000_act_4 + child.a0_500_act_5 + child.a500_1000_act_5;
        frappe.model.set_value(cdt, cdn, "total_act1", totalAc);
        calculateTotal(frm);
        frm.refresh();
 }
function calculateTotalQt(frm, cdt, cdn){
    var child = locals[cdt][cdn];
    console.log("calculating total quantity");
    var totalQt = child.a0_500_qt_1 + child.a500_1000_qt_1 + child.a0_500_qt_2 + child.a500_1000_qt_2 + child.a0_500_qt_3 + child.a500_1000_qt_3 + child.a0_500_qt_4 + child.a500_1000_act_4 + child.a0_500_qt_5 + child.a500_1000_qt_5;
    frappe.model.set_value(cdt,cdn, "total_qt1",totalQt);
    calculateTotal(frm);
    frm.refresh();
}
function calculateTotal(frm) {
    console.log("excute maintainance schedule")
    var total_qt = 0;
    $.each(frm.doc.arrca_paved_road_quantities_form_table, function (index, row) {
        total_qt += row.total_qt1;
    });
    frm.set_value("total_sum_of_qty",total_qt);
    frm.refresh();
}



      