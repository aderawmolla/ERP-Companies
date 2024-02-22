
cur_frm.add_fetch('road_segment_name', 'maintenance_office', 'maintaince_office');
cur_frm.add_fetch('road_segment_name', 'start_coordinate_easting', 'start_easting');
cur_frm.add_fetch('road_segment_name', 'start_coordinate_northing', 'start_northing');
cur_frm.add_fetch('road_segment_name', 'end_coordinate_easting', 'end_easting');
cur_frm.add_fetch('road_segment_name', 'end_coordinate_northing', 'end_northing');
cur_frm.add_fetch('road_segment_name', 'surface_type', 'type_ofroad');
cur_frm.add_fetch('road_segment_name', 'road_length', 'total_road_length');
cur_frm.add_fetch('type_of_maintainance', 'cost_per_km', 'cost_per_km');

frappe.ui.form.on("Road maintenance plan Table", {
	data1: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data1","data11");

	},
    data2: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data2","data22");

	},
    data3: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data3","data33");

	},
    data4: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data4","data44");

	},
    data5: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data5","data55");

	},
    data6: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data6","data66");

	},
    data7: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data7","data77");

	},
    data8: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data8","data88");

	},
    data9: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data9","data99");

	},
    data10k: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data10k","data10b");

	},
    data11k: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data11k","data11b");

	},
    data12k: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        calculateTotal(frm, child,"data11k","data12b");

	},


});


function calculateTotal(frm,child,km,birr){
   child[birr]=child[km]*frm.doc.cost_per_km;
   var row_km=(child.data1||0) +(child.data2||0)+(child.data3||0)+(child.data4||0)+(child.data5||0)+(child.data6||0)+(child.data7||0)+(child.data8||0)+(child.data9||0)+(child.data10k||0)+(child.data11k||0)+(child.data12k||0);
   var row_birr=(child.data11||0) +(child.data22||0)+(child.data33||0)+(child.data44||0)+(child.data55||0)+(child.data66||0)+(child.data77||0)+(child.data88||0)+(child.data99||0)+(child.data10b||0)+(child.data11b||0)+(child.data12b||0);
   child.total_km=row_km;
   child.total_birr=row_birr;
   frm.refresh_field("maintainance_plan_table")
    var total_km=0;
    var total_birr=0;
   $.each(frm.doc.maintainance_plan_table, function(i, d) {
       total_km+=d.total_km
       total_birr+=d.total_birr
});
frm.set_value("total_km",total_km)
frm.set_value("total_birr",total_birr)
frm.refresh_field("total_km")
frm.refresh_field("total_bir") 
}