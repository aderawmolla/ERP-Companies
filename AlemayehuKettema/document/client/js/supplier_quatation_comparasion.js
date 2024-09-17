frappe.ui.form.on('Supplier Quotation Comparison', {
    request_for_quotation: function(frm) {
           populateSupplierQuotations(frm);
   },
   fetch: function(frm) {
       fetchQuotationItems(frm);
   }
})

function populateSupplierQuotations(frm) {
    console.log("here you are bro")
       frm.clear_table('table_3'); // Clear existing entries
   
       if (frm.doc.request_for_quotation) {
        console.log("does this excuted")
           frappe.db.get_list('Supplier Quotation', {
               fields: ['name', 'quotation_numbers'],
               filters: {
                   quotation_numbers: frm.doc.request_for_quotation,
                
               },
               limit: 2000 
           }).then(quotations => {
            console.log("after callback")
               quotations.forEach(emp => {
                   let row = frm.add_child('table_3');
                   console.log("the name is ",emp.name)
                   row.supplier_quotations = emp.name;
   
                   // Set additional values here if needed, without saving
                   // Example: row.another_field = some_value;
               });
               frm.refresh_field('table_3'); // Refresh to reflect changes
           });
       } 
   }
   
   
   function fetchQuotationItems(frm) {
       frm.clear_table('items'); // Clear the items table
   
       // Loop through all rows in table_3 (supplier quotations)
       frm.doc.table_3.forEach(quotation_row => {
           // Fetch items for each supplier quotation
           if (quotation_row.supplier_quotations) {
               frappe.model.with_doc('Supplier Quotation', quotation_row.supplier_quotations, function () {
   
                   let source_doc = frappe.model.get_doc('Supplier Quotation', quotation_row.supplier_quotations);
                   
                    let supplier_name = source_doc.supplier;
                    let tax = source_doc.taxes_and_charges;
                    
   
                   $.each(source_doc.items, function (index, source_row) {
                       const target_row = frm.add_child('items');	
                       target_row.item_name = source_row.item_name;
                       target_row.item_code = source_row.item_code; 
                       target_row.uom = source_row.uom;
                       target_row.rate = source_row.rate;
                       target_row.amount = source_row.amount;
                       target_row.quantity = source_row.qty;
                       
                       
                       target_row.supplier = supplier_name;
                   });
   
                   frm.refresh_field('items');
               });
           }
       });
   }


   frappe.ui.form.on('Supplier Quotation Comparison', {
       compare: function(frm) {
           // Clear existing ranked items
           frm.clear_table('ranked_suppliers');
           frm.clear_table('ranked_items');
   
           // Dictionary to store total amounts per supplier
           var supplier_totals = {};
   
           // Dictionary to store total amounts per supplier for each item
           var supplier_totals_per_item = {};
   
           // Fetch items from the items table
           frm.doc.items.forEach(function(item) {
               // For ranked_suppliers table
               if (!supplier_totals[item.supplier]) {
                   supplier_totals[item.supplier] = {
                       total_amount: 0,
                       supplier: item.supplier
                   };
               }
               supplier_totals[item.supplier].total_amount += item.amount;
   
               // For ranked_items table
               if (!supplier_totals_per_item[item.item_code]) {
                   supplier_totals_per_item[item.item_code] = {};
               }
   
               if (!supplier_totals_per_item[item.item_code][item.supplier]) {
                   supplier_totals_per_item[item.item_code][item.supplier] = {
                       total_amount: 0,
                       item_name: item.item_name,
                       uom: item.uom,
                       quantity: item.quantity,
                       rate: item.rate,
                       supplier: item.supplier
                   };
               }
               supplier_totals_per_item[item.item_code][item.supplier].total_amount += item.amount;
           });
   
           // Populate the ranked_suppliers table with ranked data
           var supplier_list = Object.keys(supplier_totals).map(function(key) {
               return supplier_totals[key];
           });
   
           supplier_list.sort(function(a, b) {
               return a.total_amount - b.total_amount;
           });
   
           supplier_list.forEach(function(supplier, index) {
               var ranked_row = frappe.model.add_child(frm.doc, 'Supplier Quotation Comparison Table', 'ranked_suppliers');
               ranked_row.supplier = supplier.supplier;
               ranked_row.total_amount = supplier.total_amount * 1.15;
               ranked_row.rank = index + 1;
           });
   
           // Populate the ranked_items table with ranked data
           for (var item_code in supplier_totals_per_item) {
               if (supplier_totals_per_item.hasOwnProperty(item_code)) {
                   var supplier_list_per_item = Object.keys(supplier_totals_per_item[item_code]).map(function(supplier) {
                       return supplier_totals_per_item[item_code][supplier];
                   });
   
                   supplier_list_per_item.sort(function(a, b) {
                       return a.total_amount - b.total_amount;
                   });
   
                   supplier_list_per_item.forEach(function(supplier, index) {
                       var ranked_row = frappe.model.add_child(frm.doc, 'Supplier Quotation Comparison Table 3', 'ranked_items');
                       ranked_row.item_code = item_code;
                       ranked_row.item_name = supplier.item_name;
                       ranked_row.uom = supplier.uom;
                       ranked_row.quantity = supplier.quantity;
                       ranked_row.rate = supplier.rate;
                       ranked_row.supplier = supplier.supplier;
                       ranked_row.amount = supplier.total_amount;
                       ranked_row.rank = index + 1;
                   });
               }
           }
   
           frm.refresh_field('ranked_suppliers');
           frm.refresh_field('ranked_items');
       }
   });

   

      