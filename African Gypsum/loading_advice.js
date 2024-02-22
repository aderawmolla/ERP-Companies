frappe.ui.form.on('Loading Advice', {
    onload:function(frm){
        if(!frm.doc.date){
            let today_date = frappe.datetime.nowdate();
          frm.set_value("date",today_date)
          frm.refresh_field("date")
        }
         if(!frm.doc.prepared_by){
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
                  frm.set_value('prepared_by', user.full_name);
                 }
                }
               });
         }
        },  
    coupon_number: function (frm, cdt, cdn) {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Coupon Detail',
                filters: { "coupon_no": frm.doc.coupon_number },
                fields: ['*']
            },
            callback: function (response) {
                console.log("the first response is", response);
                if (response.message && response.message.length > 0) {
                    var res = response.message[0];
                    frm.clear_table('loading_detail');
                    frm.set_value("location", res.location);
                    frm.set_value("plate_no", res.plate_no);
                    frm.set_value("driver_name", res.driver_name);
                    frm.refresh_field("plate_no")
                    frm.refresh_field("driver_name")
                    var child = frm.add_child("loading_detail");
                    child.rate = res.unit_price;
                    child.item_code = res.item;
                    child.uom = res.uom;
                    child.item_name = res.item_name
                    child.description = res.description;
                    child.qtyquntal = res.quantity * 10;
                    child.qtybags = res.quantity * 20;
                    child.qtybulk_in_ton = res.quantity;
                    child.name1 = res.name1;

                    frm.refresh_field("loading_detail");
                    frm.refresh_field("location");

                    frappe.call({
                        method: "frappe.client.get_list",
                        args: {
                            doctype: 'Shipment Coupon',
                            filters: { "name": res.parent },
                            fields: ['*']
                        },
                        callback: function (response) {
                            if (response.message) {
                                var res = response.message[0];
                                frm.set_value("sales_order_date", res.order_date);
                                frm.set_value("order_no", res.sales_order_no);
                                frm.set_value("customer", res.customer);
                                frm.set_value("coupon_date", res.date);

                                
                                frm.refresh_field("sales_order_date");
                                frm.refresh_field("order_no");
                                frm.refresh_field("customer");
                                frm.set_value("sales_order_date", res.transaction_date);
                                if (frm.doc.order_no) {
                                    console.log("order number is,", frm.doc.order_no)
                                    var order_no = frm.doc.order_no;
                                    $.each(frm.doc.loading_detail, function (i, d) {
                                        d.parent1 = order_no;
                                    });
                                    frm.refresh_field("loading_detail");
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});
