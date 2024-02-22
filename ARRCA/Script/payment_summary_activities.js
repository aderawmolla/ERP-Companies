frappe.ui.form.on('Payment SUMMARY OF ACTIVITIES', {
  maintenance_route: function (frm, cdt, cdn) {
     if(frm.doc.maintenance_type && frm.doc.year && frm.doc.payment_no) {
       console.log("excute type")
       getActivities(frm);
     }
},
  year: function (frm, cdt, cdn) {
     if(frm.doc.maintenance_route && frm.doc.maintenance_type && frm.doc.payment_no) {
       console.log("excute type")
       getActivities(frm);
     }
},
 payment_no: function (frm, cdt, cdn) {
     if(frm.doc.maintenance_route && frm.doc.year && frm.doc.maintenance_type) {
       console.log("excute type")
       getActivities(frm);
     }
},
 maintenance_type: function (frm, cdt, cdn) {
       if(frm.doc.maintenance_route && frm.doc.year && frm.doc.payment_no) {
         console.log("excute type")
         getActivities(frm);
       }
 },
});
function getActivities(frm){
 frappe.call({
     method: "frappe.client.get_list",
     args: {
         doctype: 'Payment Back Up Sheet',
         filters: { "maintenance_type":frm.doc.maintenance_type||undefined,"payment_no":frm.doc.payment_no||undefined,"year":frm.doc.year||undefined,"maintenance_route":frm.doc.maintenance_route||undefined },
         fields: ['*']
     },
     callback: function (response) {
         var res=response.message;
         frm.doc.payment_summary_table=[];
         for(var i=0;i<res.length;i++){
          var child=frm.add_child("payment_summary_table")  

           child.act_code=res[i].act_code
           child.description=res[i].act_name
           child.unit=res[i].uom
           child.unit_price=res[i].unit_price
           child.quantity_executed_previous=res[i].prev
           child.quantity_executed_this_month=res[i].net
           child.quantity_executed__to_date=res[i].to_date
           child.executed_amount_in_birr_previous=res[i].unit_price*child.quantity_executed_previous
           child.executed_amount_in_birr_this_month=res[i].unit_price*child.quantity_executed_this_month
           child.executed_amount_in_birr_to_date=res[i].unit_price*child.quantity_executed__to_date
           frm.refresh_field("payment_summary_table")
         }    
     console.log("response is",response)
     var thisMonth=0;
     var prevMonth=0;
     var toDateMonth=0;
     $.each(frm.doc.payment_summary_table, function(i, row) {
       thisMonth +=row.executed_amount_in_birr_this_month
       prevMonth +=row.executed_amount_in_birr_previous
       toDateMonth +=row.executed_amount_in_birr_to_date
    
    }); 
    
    frm.set_value("this_toal",thisMonth)
    frm.set_value("prev_total",prevMonth)
    frm.set_value("todate_total",toDateMonth)
    frm.refresh_field("this_toal")
    frm.refresh_field("prev_total")
    frm.refresh_field("todate_total")

     }
 });
  
 

}
