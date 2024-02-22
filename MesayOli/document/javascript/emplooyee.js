frappe.ui.form.on('Employee', {
    date_of_birth: function (frm) {
        // Get the birthdate from the form field
        var birthdate = frm.doc.date_of_birth;
        
        if (birthdate) {
            // Calculate the current date
            var currentDate = new Date();
            
            // Parse the birthdate from the form
            var dob = new Date(birthdate);
            
            // Calculate the age
            var age = currentDate.getFullYear() - dob.getFullYear();
            
            // Calculate the number of months
            var months = (currentDate.getMonth() + 1) - (dob.getMonth() + 1);
            
            // Adjust months if current date day is earlier than birthdate day
            if (currentDate.getDate() < dob.getDate()) {
                months--;
            }
            
            // If months are negative, adjust age accordingly
            if (months < 0) {
                age--;
                months += 12;
            }
            
            // Format age and months as "35 years and 6 months"
            var ageString = age + " years";
            if (months > 0) {
                ageString += " and " + months + " months";
            }
            
            // Set the age string in the 'age' field
            frm.set_value('ages', ageString);
        }
    },
    scale:function (frm) {
        // if (frm.doc.scale&& frm.doc.department && frm.doc.divisionlist) {
        //   frappe.model.with_doc('Designation', frm.doc.scale,frm.doc.department,frm.doc.divisionlist, function() {
       
        //    let source_doc = frappe.model.get_doc('Designation', frm.doc.scale,frm.doc.department,frm.doc.divisionlist);
        //    console.log("source doc", source_doc)
       
        // //    $.each(source_doc.purchase_requisition_item, function(index, source_row) {
       
        // //     console.log("Test 3");
           
        // //                const target_row = frm.add_child('items');
        // //                 target_row.item_code = source_row.item_code;
        // //                 target_row.item_category = source_row.item_category;
        // //                 target_row.description = source_row.description;
        // //         target_row.item_name = source_row.description;
        // //                 target_row.uom = source_row.uom;
        // //                 target_row.qty = source_row.qty;
       
        // //    });
       
        //    frm.refresh_field('items');
        //   });
        //  }

        frappe.call({
            method: "frappe.client.get_value",
             args: {
                doctype: 'Designation',
                filters: { "department":frm.doc.department,"divisionlist":frm.doc.division,"grade":frm.doc.grade},
                 fieldname: ['name']
            },
            callback: function(response) {
                console.log("the response is",response)
                if (response.message) {
                    frappe.call({
                        method: "frappe.client.get_list",
                         args: {
                            doctype: 'JOB ENTRY TABLE',
                            filters: {"parent":response.message.name},
                            fields: ['salary',"scale"]
                        },
                        callback: function(response) {
                            var sal=0;
                            if (response.message) { 
                            console.log("response message of salary is",response.message)         
                             for(var i=0;i<response.message.length;i++){
                                 if(response.message[i].scale==frm.doc.scale) {
                                  sal=parseFloat(response.message[i].salary)
                                  
                                 }  
                                 frm.set_value("salary",sal)
                                 frm.refresh_field("salary")

                             }
            
                            }
                        }
                    });
               

                }
            }
        });
    



        },
});