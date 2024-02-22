frappe.ui.form.on('Purchase Receipt', {
    before_save: function (frm) {
        // Fetch all Purchase Receipts
        // frappe.call({
        //     method: 'frappe.client.get_list',
        //     args: {
        //         doctype: 'Purchase Receipt',
        //         fields: ['grn_no'],
        //     },
        //     callback: function (response) {
        //         if (response.message) {
        //             // Find the maximum grn_no from all Purchase Receipts
        //             var maxGrnNo = 0;
                 
        //             response.message.forEach(function (pr) {
        //                 console.log("the pr",pr.grn_no)
        //                 maxGrnNo = parseInt(pr.grn_no) >parseInt(maxGrnNo) ? pr.grn_no : maxGrnNo;
        //             });

        //             console.log("maximum grn no", maxGrnNo);

        //             // Set the new grn_no in the current Purchase Receipt
        //             frm.set_value('grn_no', parseInt(maxGrnNo) + 1);
        //             // Refresh the form to reflect the changes
        //             frm.refresh();
        //         }
        //     },
        // });
    },
});



frappe.ui.form.on('Purchase Receipt', {
    // onload: function (frm) {
    //     // Fetch all Purchase Receipts
    //     frappe.call({
    //         method: 'frappe.client.get_list',
    //         args: {
    //             doctype: 'Purchase Receipt',
    //             fields: ['grn_no'],
    //         },
    //         callback: function (response) {
    //             if (response.message) {
    //                 // Find the maximum grn_no from all Purchase Receipts
    //                 var maxGrnNo = 0;
                 
    //                 response.message.forEach(function (pr) {
    //                     console.log("the pr",pr.grn_no)
    //                     maxGrnNo = parseInt(pr.grn_no) >parseInt(maxGrnNo) ? pr.grn_no : maxGrnNo;
    //                 });

    //                 console.log("maximum grn no", maxGrnNo);

    //                 // Set the new grn_no in the current Purchase Receipt
    //                 frm.set_value('grn_no', parseInt(maxGrnNo) + 1);
    //                 // Refresh the form to reflect the changes
    //                 frm.refresh();
    //             }
    //         },
    //     });
    // },
});



frappe.ui.form.on('Purchase Receipt', {
 onload: function(frm) {
    if(!frm.doc.received_by){
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
              frm.set_value('received_by', user.full_name);
             }
            }
           });
    }
  
 }
});





