frappe.ui.form.on('Fuel Utilization table', {
    month_start: function(frm,cdt,cdn) {
       var child=locals[cdt][cdn]
       var difference=child. month_end-child. month_start
       child.difference1=difference
    frm.refresh_field("fuel_utilization_table")
    } ,
    month_end: function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        var difference=child.month_end-child.month_start
        child.difference1=difference
        frm.refresh_field("fuel_utilization_table")

    } ,
    should_use:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        var difference=child.used-child.should_use
        child.z=difference
        frm.refresh_field("fuel_utilization_table")

    } ,
    used:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        var difference=child.used-child.should_use
        child.difference2=difference
        frm.refresh_field("fuel_utilization_table")
    } ,
})
