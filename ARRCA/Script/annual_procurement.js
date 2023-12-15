frappe.ui.form.on('Annual Procurement Table', {
    rate:function(frm,cdt,cdn) {
         console.log("change detected")
      var child=locals[cdt][cdn]
         calculateRowTotal(child,frm)   
    } ,
    data_1:function(frm,cdt,cdn) {
        console.log("called")
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_2:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_3:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_4:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_5:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_6:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_7:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_8:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_9:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_10:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_11:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_12:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_13:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
    data_14:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
      data_15:function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
           calculateRowTotal(child,frm)   
      } ,
})
function calculateRowTotal(child, frm) {
    var row_total =
        child.data_1 | 0 +
        child.data_2 | 0 +
        child.data_3 | 0 +
        child.data_4 | 0 +
        child.data_5 | 0 +
        child.data_6 | 0 +
        child.data_7 | 0 +
        child.data_8 | 0 +
        child.data_9 | 0 +
        child.data_10 | 0 +
        child.data_11 | 0 +
        child.data_12 | 0 +
        child.data_13 | 0 +
        child.data_14 | 0;
        child.data_15 | 0;
    child.total = parseFloat(row_total);

    var total_cost = 0;

    $.each(frm.doc.procurement_table, function (i, d) {
        // Make sure 'total' and 'rate' properties exist before using them
            // calculate incentive
            child.total_cost= d.total * d.rate;

            total_cost += d.total * d.rate;

        
    });

    frm.refresh_field("procurement_table");
    frm.set_value("total_sum", total_cost);
}

