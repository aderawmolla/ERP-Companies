frappe.ui.form.on('Stock Entry',{
    onload:function(frm){
        if(!frm.doc.issued_by){
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                 doctype: 'User',
                 filters: { name: frappe.session.user },
                 fieldname: ['full_name']
                },
                callback: function(response) {
                 var user = response.message;
                 if (user) {
                  frm.set_value('issued_by', user.full_name);
                 }
                }
               });
        }
        
    },
	stock_entry_type:function(frm){
        var pur=frm.doc.stock_entry_type
      if(pur=="Material transfer"){
         setSeries(frm,"MAT-TR-.YYYY.-")  
      }
      else if(pur=="Material Recipt"){
        setSeries(frm,"MAT-PRE-.YYYY.-")  
      }
      else if(pur=="Material return"){
        setSeries(frm,"MAT-RE-.YYYY.-")  
      }
      else{
        setSeries(frm,"SIV-.YYYY.-")  
      }
    }
})
function setSeries(frm,series){
  frm.set_value("naming_series",series)
  frm.refresh_field("naming_series")
}