frappe.ui.form.on('Shipment Coupon', {
    onload: function(frm) {
     if(!frm.doc.dispatcher_name){
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
              frm.set_value('dispatcher_name', user.full_name);
             }
            }
     });
     }
    }
   });
   frappe.ui.form.on('Shipment Coupon', {
    onload: function(frm) {
     frappe.call({
      method: 'frappe.client.get_value',
      args: {
       doctype: 'Shipment Coupon',
       fieldname: ['*']
      },
      callback: function(response) {
       console.log(response);
      }
     });
    }
   });
   
   frappe.ui.form.on('Shipment Coupon', {
       onload:function(frm){
           if(!frm.doc.date){
               let today_date = frappe.datetime.nowdate();
             frm.set_value("date",today_date)
             frm.refresh_field("date")
           }
           },        
       sales_order_no: function (frm, cdt, cdn) {
           if (!frm.doc.number_of_coupons) {
               frappe.throw({
                   title: __("Mandatory"),
                   message: __("Please insert number of coupons")
               });
           }
           else {
               frappe.call({
                   method: "frappe.client.get_list",
                   args: {
                       parent: frm.doc.sales_order_no,
                       doctype: 'Sales Order Item',
                       filters: { "parent": frm.doc.sales_order_no },
                       fields: ['*']
                   },
                   callback: function (response) {
   
                       if (response.message && response.message.length > 0) {
                           console.log("here excuted");
                           var res = response.message[0];
                           console.log("the respons is", res)
                           frm.clear_table("coupon_detail");
                           var number_of_columns = parseInt(frm.doc.number_of_coupons);
                           for (var i = 0; i < number_of_columns; i++) {
                               const randomNum = Math.floor(Math.random() * 99999) + 1;
                               var remain=res.qty-res.delivered_qty
                               var child = frm.add_child("coupon_detail");
                               child.item = res.item_code;
                               child.description = res.item_name;
                               child.uom = res.stock_uom;
                               child.unit_price = res.rate;
                               child.item_name = res.item_name
                               child.quantity = parseInt(remain / frm.doc.number_of_coupons);
                               child.amount = parseFloat(res.rate * (remain / frm.doc.number_of_coupons)).toFixed(2);
                               child.coupon_no = `SSH-COP-${randomNum.toString().padStart(3, '0')}`;
                               child.name1 = res.name;
                           }
                           frm.refresh_field('coupon_detail');
   
                           frappe.call({
                               method: "frappe.client.get_value",
                               args: {
                                   doctype: 'Sales Order',
                                   filters: { "name": response.message[0].parent },
                                   fieldname: ['*']
                               },
                               callback: function (response) {
                                   if (response.message) {
                                       console.log("the response from sales Order is", response.message);
                                       frm.set_value("customer", response.message.customer);
                                       frm.set_value("transaction_date", response.message.transaction_date);
                                       frm.set_value("customer", "read_only", 1);
                                       frm.set_value("transaction_date", "read_only", 1);
                                       refresh_field("customer");
                                       refresh_field("transaction_date");
                                   }
                               }
                           });
                       } else {
                       }
                   }
               })
           }
       },
       number_of_coupons: function (frm, cdt, cdn) {
           if (!frm.doc.sales_order_no) {
               frappe.throw({
                   title: __("Mandatory"),
                   message: __("Please Select Saes Order")
               });
           }
           else {
               frappe.call({
                   method: "frappe.client.get_list",
                   args: {
                       parent: frm.doc.sales_order_no,
                       doctype: 'Sales Order Item',
                       filters: { "parent": frm.doc.sales_order_no },
                       fields: ['*']
                   },
                   callback: function (response) {
   
                       if (response.message && response.message.length > 0) {
                           console.log("here excuted");
                           var res = response.message[0];
                           console.log("the respons is", res)
                           frm.clear_table("coupon_detail");
                           var number_of_columns = parseInt(frm.doc.number_of_coupons);
                           for (var i = 0; i < number_of_columns; i++) {
                               const randomNum = Math.floor(Math.random() * 99999) + 1;
                               var child = frm.add_child("coupon_detail");
                               var rem=res.qty-res.delivered_qty;
                               child.item = res.item_code;
                               child.description = res.item_name;
                               child.uom = res.stock_uom;
                               child.item_name = res.item_name;
                               child.unit_price = res.rate;
                               child.quantity = (rem / frm.doc.number_of_coupons).toFixed(2);
                               child.amount = parseFloat(res.rate * (rem / parseFloat(frm.doc.number_of_coupons))).toFixed(2);
                               child.coupon_no = `SSH-COP-${randomNum.toString().padStart(3, '0')}`;
                               child.name1 = res.name;
                           }
                           frm.refresh_field('coupon_detail');
                           frappe.call({
                               method: "frappe.client.get_value",
                               args: {
                                   doctype: 'Sales Order',
                                   filters: { "name": response.message[0].parent },
                                   fieldname: ['*']
                               },
                               callback: function (response) {
                                   if (response.message) {
                                       console.log("the response from sales Order is", response.message);
                                       frm.set_value("customer", response.message.customer);
                                       frm.set_value("transaction_date", response.message.transaction_date);
                                       frm.set_value("customer", "read_only", 1);
                                       frm.set_value("transaction_date", "read_only", 1);
                                       refresh_field("customer");
                                       refresh_field("transaction_date");
   
                                   }
                               }
                           });
                       } else {
   
   
                       }
                   }
               })
   
   
           }
       }
   });
   