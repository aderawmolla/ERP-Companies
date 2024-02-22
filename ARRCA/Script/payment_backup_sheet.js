cur_frm.add_fetch('act_code', 'act_name', 'act_name');
cur_frm.add_fetch('act_code', 'uom', 'uom');
cur_frm.add_fetch('act_code', 'unit_rate', 'unit_price');

frappe.ui.form.on('Payment Back Up Sheet', {
    cal_qty: function (frm, cdt, cdn) {
        var total_size = 1;
        var num = 0;

        if (frm.doc.cal_qty == "1") {
            console.log(frm.doc.payment_backup_sheet_table);

            $.each(frm.doc.payment_backup_sheet_table || [], function (i, child) {
                num++;
                total_size *= child.size;
            });
        }
        // Adding a new child row
        var number=frm.doc.payment_backup_sheet_table[0].no
        var child = frm.add_child("payment_backup_sheet_table");
        child.qty = total_size * parseFloat(number);
        frm.refresh_field("payment_backup_sheet_table");
        /// setting other informations
         if(frm.doc.less_prev){
            frm.set_value("to_date",child.qty+frm.doc.prev-frm.doc.less_prev)
            frm.refresh_field("to_date") 
            frm.set_value("net",child.qty)
            frm.refresh_field("net")
          }
          else{
            frm.set_value("to_date",child.qty+frm.doc.prev)
            frm.refresh_field("to_date") 
            frm.set_value("net",child.qty)
            frm.refresh_field("net")
          }
          frm.refresh_field("payment_backup_sheet_table");

         
    },
});
frappe.ui.form.on('Payment Back Up Sheet', {
    act_code: function (frm, cdt, cdn) {
       if(frm.doc.year &&frm.doc.maintenance_type && frm.doc.maintenance_route && frm.doc.year && frm.doc.payment_no){
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Payment Back Up Sheet',
                filters: { "act_code":frm.doc.act_code,"maintenance_type":frm.doc.maintenance_type,"year":frm.doc.year,"maintenance_route":frm.doc.maintenance_route },
                fields: ['*']
            },
            callback: function (response) {
                 console.log("response is",response.message[0])
                if (response.message) {
                 frm.set_value("prev",response.message[0].to_date)
                 frm.refresh_field("prev")
                }
            }
        });
       }
       else{

       }
         
       
    },
});
