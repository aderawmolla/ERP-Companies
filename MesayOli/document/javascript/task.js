	// Machinery Filter
    frappe.ui.form.on("Task", "project", function(frm) {
        frm.set_query("id_mac", "machinery", function() {
            return {
                "filters": {
                    "project": frm.doc.project,
                }
            };
        });
    });
    // Manpower Filter
    frappe.ui.form.on("Task", "project", function(frm) {
        frm.set_query("id_map", "manpower1", function() {
            return {
                "filters": {
                    "project": frm.doc.project,
                }
            };
        });
    });
    // Material Filter
    frappe.ui.form.on("Task", "project", function(frm) {
        frm.set_query("id_mat", "material1", function() {
            return {
                "filters": {
                    "project": frm.doc.project,
                }
            };
        });
    });
    
    
    // Machinary
    cur_frm.add_fetch('id_mac', 'rental_rate', 'rental_rate');
    cur_frm.add_fetch('id_mac', 'make_model', 'make_model');
    cur_frm.add_fetch('id_mac', 'standard_fuel_consumption', 'standard_fuel_consumption');
    cur_frm.add_fetch('id_mac', 'fuel_cost_per_hour', 'fuel_cost_per_hour');
    cur_frm.add_fetch('id_mac', 'type', 'type');
    
    // Manpower
    cur_frm.add_fetch('id_map', 'hourly_cost', 'hourly_cost');
    cur_frm.add_fetch('id_map', 'job_title', 'job_title');
    cur_frm.add_fetch('id_map', 'li_permanent', 'li_permanent');
    
    //Material
    cur_frm.add_fetch('id_mat', 'item', 'item1');
    cur_frm.add_fetch('id_mat', 'uom', 'uom');
    cur_frm.add_fetch('id_mat', 'quantity', 'qty');
    cur_frm.add_fetch('id_mat', 'unit_price', 'unit_price');
    cur_frm.add_fetch('id_mat', 'loading_unloading_cost', 'loading_unloading_cost');
    cur_frm.add_fetch('id_mat', 'transportation_cost', 'transportation_cost');
    
    // Fetch Task from Task Master
    cur_frm.add_fetch('task_name', 'name1', 'subject');
    cur_frm.add_fetch('task_name', 'type', 'type');
    cur_frm.add_fetch('task_name', 'productivity', 'productivity');
    cur_frm.add_fetch('task_name', 'project', 'project');
    
    //Fetch Consultant from Project
    cur_frm.add_fetch('project', 'consultant', 'consultant');
    
    
    
    // collective task
    cur_frm.add_fetch('task', 'subject', 'subject');
    cur_frm.add_fetch('task', 'quantity', 'quantity');
    cur_frm.add_fetch('task', 'direct_cost_after_conversion', 'rate');
    
    // this is the second phase code after arrca presentation
    //calculate duration

frappe.ui.form.on("Task", {
    quantity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.quantity / (d.productivity * (d.no_of_crew | 1))));
    }
});

frappe.ui.form.on("Task", {
    no_of_crew: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.quantity / (d.productivity * (d.no_of_crew | 1))));
    }
});


frappe.ui.form.on("Task", {
    productivity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.quantity / (d.productivity * (d.no_of_crew | 1))));
    }
});

frappe.ui.form.on("Task", {
    duration: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.duration / d.working_hour_per_day));
    }
});

frappe.ui.form.on("Task", {
    working_hour_per_day: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.duration / d.working_hour_per_day));
    }
});

    frappe.ui.form.on("collective task", {
          quantity: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
             frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity * d.rate));
            
              set_total_amt_mac(frm);
         }
     });
    
    // Populate Machinery, Manpower and Material From Task Master DocType
    // TASK
    // MACHINERY
    frappe.ui.form.on('Task', {
        task_name: function (frm) {
            if (frm.doc.task_name) {
                frm.clear_table('machinery');
                frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                    let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                    $.each(source_doc.machinery, function (index, source_row) {
                const target_row = frm.add_child('machinery');	
                            target_row.type = source_row.type; 
                target_row.uf = source_row.uf;
                target_row.rental_rate = source_row.rental_rate;
                        frm.refresh_field('machinery');
                    });
                });
            }
        },
    });
    
    
    // TASK 1
    // MANPOWER 1
    frappe.ui.form.on('Task', {
        task_name: function (frm) {
            if (frm.doc.task_name) {
                frm.clear_table('manpower1');
                frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                    let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                    $.each(source_doc.manpower, function (index, source_row) {
                const target_row = frm.add_child('manpower1');	
                            target_row.job_title = source_row.job_title; 
                target_row.qty = source_row.qty;
                target_row.li_permanent = source_row.li_permanent;
                target_row.hourly_cost = source_row.hourly_cost;
                        frm.refresh_field('manpower1');
                    });
                });
            }
        },
    });
    
    // TASK 1
    // MATERIAL 1
    frappe.ui.form.on('Task', {
        task_name: function (frm) {
            if (frm.doc.task_name) {
                frm.clear_table('material1');
                frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                    let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                    $.each(source_doc.material, function (index, source_row) {
                const target_row = frm.add_child('material1');	
                target_row.item = source_row.item;
                            target_row.uom = source_row.uom; 
                target_row.qty = source_row.qty;
                target_row.unit_price = source_row.unit_price;
                target_row.total_cost = source_row.total_cost;
                        frm.refresh_field('material1');
                    });
                });
            }
        },
    });
    
    frappe.ui.form.on('Task', {
        task_name: function (frm) {
            if (frm.doc.task_name) {
                frm.clear_table('material1');
                frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                    let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                    $.each(source_doc.material, function (index, source_row) {
                const target_row = frm.add_child('material1');	
                target_row.item = source_row.item;
                            target_row.uom = source_row.uom; 
                target_row.qty = source_row.qty;
                target_row.unit_price = source_row.unit_price;
                target_row.total_cost = source_row.total_cost;
                        frm.refresh_field('material1');
                    });
                });
            }
        },
    });
    /* REFERENCE
    frappe.ui.form.on('Target DocType', {
        link_to_source: function (frm) {
            if (frm.doc.link_to_source) {
                frm.clear_table('target_table');
                frappe.model.with_doc('Source DocType', frm.doc.link_to_source, function () {
                    let source_doc = frappe.model.get_doc('Source DocType', frm.doc.link_to_source);
                    $.each(source_doc.source_table, function (index, source_row) {
                        frm.add_child('target_table').column_name = source_row.column_name; // this table has only one column. You might want to fill more columns.
                        frm.refresh_field('target_table');
                    });
                });
            }
        },
    });
    */
     // END OF POPULATING CHILD TABLE
    
    
    
    // MACHINERY RELATED SCRIPTS
    frappe.ui.form.on("Machinery Detail22", {
          qty: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
             frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
            
              set_total_amt_mac(frm);
         }
     });
    
    frappe.ui.form.on("Machinery Detail22", {
          uf: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
            
              set_total_amt_mac(frm);
         }
     });  
    
    frappe.ui.form.on("Machinery Detail22", {
          efficency: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
            
               set_total_amt_mac(frm);
         }
     });
    
    frappe.ui.form.on("Machinery Detail22", {
          rental_rate: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
        set_total_amt_mac(frm);	
               
         }
     });// TOTAL CALCULATIONS FOR QUANTITY AND TOTAL HOURLY COST OF MACHINERY
    // Set total quantity of machineryplan on save of Activity Type
    
    // Set total amount of machineryplan on save of Activity Type
    frappe.ui.form.on("Task", "validate", function(frm)  {
        set_total_amt_mac(frm);
    });
    
    //Set total amount of machineryplan on change of amount
    frappe.ui.form.on("Machinery Detail22", "total_hourly_cost", function(frm, cdt, cdn)  {
        set_total_amt_mac(frm);
    });
    
    // Calculate and set total_qty_mac
    var set_total_amt_mac = function(frm) {
        var total_amt_mac = 0.0;
        $.each(frm.doc.machinery, function(i, row) {
            total_amt_mac += flt(row.total_hourly_cost);
        })
        frm.set_value("equipment_total_cost", total_amt_mac);
        //frm.refresh();
    }
    
    
    frappe.ui.form.on("Task", {
          equipment_total_cost: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity)); 
         }
     }); 
    
    frappe.ui.form.on("Task", {
          productivity: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity)); 
         }
     }); 
    
    //END OF MACHINERY RELATED TOTAL CALCULATIONS
    
    // END OF MACHINERY RELATED SCRIPT
    
    // Manpower
    
    
    frappe.ui.form.on("Manpower Detail22", {
          no_of_labor: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.no_of_labor * d.labor_index * d.qty * d.hourly_cost * d.uf * d.efficency)); 
                    set_total_man(frm);
         }
    
        
     });
     frappe.ui.form.on("Manpower Detail22", {
        labor_index: function(frm, cdt, cdn) {
          var d = locals[cdt][cdn];
                  frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.no_of_labor * d.labor_index * d.qty * d.hourly_cost * d.uf * d.efficency)); 
                  set_total_man(frm);
       }
    
      
    });
    
    frappe.ui.form.on("Manpower Detail22", {
          li_permanent: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                   frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.no_of_labor * d.labor_index * d.li_permanent * d.qty * d.hourly_cost * d.uf * d.efficency));
    set_total_man(frm);
         }
        
     });
    
    frappe.ui.form.on("Manpower Detail22", {
          qty: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                     frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.no_of_labor * d.labor_index * d.li_permanent * d.qty * d.hourly_cost * d.uf * d.efficency));
                     set_total_man(frm);
         }
        
     });
    
    frappe.ui.form.on("Manpower Detail22", {
          uf: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.no_of_labor * d.labor_index * d.li_permanent * d.qty * d.hourly_cost * d.uf * d.efficency));
            set_total_man(frm);
         }
        
     });
    
    frappe.ui.form.on("Manpower Detail22", {
          hourly_cost: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                      frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.no_of_labor * d.labor_index * d.li_permanent * d.qty * d.hourly_cost * d.uf * d.efficency)); 
    set_total_man(frm);
         }
        
     });
    
    frappe.ui.form.on("Manpower Detail22", {
          efficency: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.no_of_labor * d.labor_index * d.li_permanent * d.qty * d.hourly_cost * d.uf * d.efficency)); 
    
    set_total_man(frm);
         }
        
     });
    
    /*
    frappe.ui.form.on("Manpower Detail", {
          uf: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                      frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 
    
    set_total_man(frm);
         }
        
     });
    
    frappe.ui.form.on("Manpower Detail", {
          hourly_cost: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                      frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 
    set_total_man(frm);
         }
        
     });
    
    frappe.ui.form.on("Manpower Detail", {
          efficency: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 
    
    set_total_man(frm);
         }
        
     }); */
    frappe.ui.form.on("Task", "validate", function(frm)  {
    
           // var d = locals[cdt][cdn];
                   // frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 
    
    
    
        set_total_man(frm);
    });
    
    var set_total_man = function(frm) {
        var total_man = 0.0;
        $.each(frm.doc.manpower1, function(i, row) {
            total_man += flt(row.total_hourly_cost);
        })
        frm.set_value("man_power_total_cost", total_man);
        //frm.refresh();
    }
    
    frappe.ui.form.on("Task", {
          productivity: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity)); 
         }
     }); 
    
    frappe.ui.form.on("Task", {
          man_power_total_cost: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity)); 
         }
     });
    
    
    
    // EDN OF MATERIAL RELATED SCRIPT
    
    // Material
    frappe.ui.form.on("Material Detail22", {
          qty: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.
    qty * d.unit_price) + d.loading_unloading_cost + d.transportation_cost)); 
    
    set_total_mat(frm);
         }
        
     });
    
    frappe.ui.form.on("Material Detail22", {
          unit_price: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                   frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qty * d.unit_price) + d.loading_unloading_cost + d.transportation_cost));
    
    set_total_mat(frm);
         }
        
     });
    
    frappe.ui.form.on("Material Detail22", {
          loading_unloading_cost: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                   frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qty * d.unit_price) + d.loading_unloading_cost + d.transportation_cost));
    
    set_total_mat(frm);
         }
        
     });
    
    frappe.ui.form.on("Material Detail22", {
          transportation_cost: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                   frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qty * d.unit_price) + d.loading_unloading_cost + d.transportation_cost));
    
    set_total_mat(frm);
         }
        
     });
     
    var set_total_mat = function(frm) {
        var total_mat = 0.0;
        $.each(frm.doc.material1, function(i, row) {
            total_mat += flt(row.total_cost);
        })
        frm.set_value("material_total_cost", total_mat);
        //frm.refresh();
    }
    
    frappe.ui.form.on("Task", "refresh", function(frm)  {
        set_total_mat(frm);
    });
    
    // CALCULATE MATERIAL FINAL COST
    
    frappe.ui.form.on("Task", {
          loading_unloading_cost: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            
                    frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost)); 
    
         }
     }); 
    
    frappe.ui.form.on("Task", {
          transportation_cost : function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            
                    frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost)); 
    
         }
     });
    
    frappe.ui.form.on("Task", {
          material_total_cost : function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            
                    frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost)); 
    
         }
     });  
    
    
    // END OF MATERIAL RELATED SCRIPT
    
    // ACTIVITY TOTAL COST RELATED SCRIPT
    /*frappe.ui.form.on("Task", "man_power_unit_rate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost); });
    
    frappe.ui.form.on("Task", "equipment_unit_rate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost); });
    
    frappe.ui.form.on("Task", "material_total_cost", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost); });*/
    
    frappe.ui.form.on("Task", "man_power_unit_rate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') { 
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
     }
    if(frm.doc.work_type == 'Own Force') { 
        frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_total_cost_sc = 0; //frm.model.set_value(cdt, cdn, "material_total_cost ", 0);
    }
    if(frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if(frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if(frm.doc.material_total_cost == '') { frm.doc.material_total_cost = 0; }
    if(frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if(frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if(frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc); });
    
    frappe.ui.form.on("Task", "equipment_unit_rate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') { 
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
     }
    if(frm.doc.work_type == 'Own Force') { 
        frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_total_cost_sc = 0; //frm.model.set_value(cdt, cdn, "material_total_cost ", 0);
    }
    if(frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if(frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if(frm.doc.material_total_cost == '') { frm.doc.material_total_cost = 0; }
    if(frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if(frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if(frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc); });
    
    frappe.ui.form.on("Task", "material_total_cost", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') { 
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
     }
    if(frm.doc.work_type == 'Own Force') { 
        frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_total_cost_sc = 0; //frm.model.set_value(cdt, cdn, "material_total_cost ", 0);
    }
    if(frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if(frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if(frm.doc.material_total_cost == '') { frm.doc.material_total_cost = 0; }
    if(frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if(frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if(frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc); });
    
    frappe.ui.form.on("Task", "man_power_unit_rate_sc", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') { 
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
     }
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') { 
        frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_total_cost = 0; //frm.model.set_value(cdt, cdn, "material_total_cost ", 0);
    }
    if(frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if(frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if(frm.doc.material_total_cost == '') { frm.doc.material_total_cost = 0; }
    if(frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if(frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if(frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc); });
    
    frappe.ui.form.on("Task", "equipment_unit_rate_sc", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') { 
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
     }
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') { 
        frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_total_cost = 0; //frm.model.set_value(cdt, cdn, "material_total_cost ", 0);
    }
    if(frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if(frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if(frm.doc.material_total_cost == '') { frm.doc.material_total_cost = 0; }
    if(frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if(frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if(frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc); }); 
    
    frappe.ui.form.on("Task", "material_unit_rate_sc", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') { 
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
     }
    if(frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') { 
        frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_total_cost = 0; //frm.model.set_value(cdt, cdn, "material_total_cost ", 0);
    }
    if(frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if(frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if(frm.doc.material_total_cost == '') { frm.doc.material_total_cost = 0; }
    if(frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if(frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if(frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_rate + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc); });
    
    
    
    // INDIRECT COST TOTAL COST RELATED SCRIPT
    frappe.ui.form.on("Task", "activity_total_cost", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "indirect_cost_total", (d.activity_total_cost * d.indirectcost)/100); });
    
    frappe.ui.form.on("Task", "indirectcost", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "indirect_cost_total", (d.activity_total_cost * d.indirectcost)/100); });
    
    // TOTAL COST WITH INDIRECT COST
    frappe.ui.form.on("Task", "activity_total_cost", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.activity_total_cost + d.indirect_cost_total); });
    
    frappe.ui.form.on("Task", "indirect_cost_total", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.activity_total_cost + d.indirect_cost_total); });
    
    
    // TOTAL WITH PROFIT MARGIN
    frappe.ui.form.on("Task", "activity_total_cost", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.activity_total_cost * d.profitmargin)/100); });
    
    frappe.ui.form.on("Task", "profitmargin", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.activity_total_cost * d.profitmargin)/100); });
    
    // TOTAL WITH PROFIT MARGIN
    frappe.ui.form.on("Task", "total_cost_with_indirect_cost", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective); });
    
    frappe.ui.form.on("Task", "total_with_profit_margin", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective); });
    
    
    frappe.ui.form.on("Task", "activity_unit_rate_collective", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective); });
    
    cur_frm.add_fetch('item', 'quantity', 'quantity');
    cur_frm.add_fetch('item', 'direct_cost_after_conversion', 'activity_unit_rate');
    cur_frm.add_fetch('item', 'unit', 'uom');
    
    // Total Cost
    frappe.ui.form.on("Quotation Items", {
          quantity: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
            set_total_cost(frm);
         }
     });
    
    frappe.ui.form.on("Quotation Items", {
          activity_unit_rate: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
            set_total_cost(frm);
         }
     });
    
    
    frappe.ui.form.on("Task", "validate", function(frm)  {
        set_total_cost(frm);
    });
    
    //Set total cost of quotation items on change of total cost
    frappe.ui.form.on("Quotation Items", "total_cost", function(frm, cdt, cdn)  {
        set_total_cost(frm);
    });
    
    
    // Calculate total quantity
    var set_total_cost = function(frm) {
        var total_cost = 0.0;
        $.each(frm.doc.task_list, function(i, row) {
            total_cost += flt(row.total_cost);
        })
        frm.set_value("activity_unit_rate_collective", total_cost);
        //frm.refresh();
    }
    
    // Other UOM Conversion
    frappe.ui.form.on("Task", "qty", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "quantity", d.qty * d.conversion_rate); });
    
    frappe.ui.form.on("Task", "conversion_rate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "quantity", d.qty * d.conversion_rate); });
    
    // Direct Cost After Conversion
    frappe.ui.form.on("Task", "conversion_multiplier", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "direct_cost_after_conversion", d.conversion_multiplier * d.activity_unit_rate); });
    
    frappe.ui.form.on("Task", "activity_unit_rate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "direct_cost_after_conversion", d.conversion_multiplier * d.activity_unit_rate); });
    
    // Eyob Quantity Calculation
    frappe.ui.form.on('meter Cube table', {
        member_quantity: function (frm, cdt, cdn) {
            calculateTotalVolume(frm, locals[cdt][cdn]);
            calculateSetSum(frm);
        },
        length: function (frm, cdt, cdn) {
            calculateTotalVolume(frm, locals[cdt][cdn]);
            calculateSetSum(frm);
        },
        height: function (frm, cdt, cdn) {
            calculateTotalVolume(frm, locals[cdt][cdn]);
            calculateSetSum(frm);
        },
        width: function (frm, cdt, cdn) {
            calculateTotalVolume(frm, locals[cdt][cdn]);
            calculateSetSum(frm);
        },
        refresh: function (frm) {
            calculateSetSum(frm);
        },
        meter_cube_table_onload: function (frm, cdt, cdn) {
            calculateSetSum(frm);
        },
    });
    
    function calculateTotalVolume(frm, child) {
        var memberQuantity = child.member_quantity || 0;
        var length = child.length || 0;
        var height = child.height || 0;
        var width = child.width || 0;
        
        var totalVolume = memberQuantity * length * height * width;
        frappe.model.set_value(child.doctype, child.name, 'product', totalVolume);
    }
    
    function calculateSetSum(frm) {
        var sum = 0;
        
        frm.doc.meter_cube_table.forEach(function (row) {
            sum += row.product || 0;
        });
        
        frm.set_value('sum_of_volume', sum);
        frm.set_value('actual_quantity', sum);
    }
    
    
    frappe.ui.form.on('meter square table', {
        member_quantity: function (frm, cdt, cdn) {
            calculateTotalArea(frm, locals[cdt][cdn]);
            calculateAndSum(frm);
        },
        length: function (frm, cdt, cdn) {
            calculateTotalArea(frm, locals[cdt][cdn]);
            calculateAndSum(frm);
        },
        height: function (frm, cdt, cdn) {
            calculateTotalArea(frm, locals[cdt][cdn]);
            calculateAndSum(frm);
        },
       
        refresh: function (frm) {
            calculateAndSum(frm);
        },
        meter_square_table_onload: function (frm, cdt, cdn) {
            calculateAndSum(frm);
        },
    });
    
    function  calculateTotalArea(frm, child) {
        var memberQuantity = child.member_quantity || 0;
        var length = child.length || 0;
        var height = child.height || 0;
       
        
        var totalArea = memberQuantity * length * height;
        frappe.model.set_value(child.doctype, child.name, 'product', totalArea);
    }
    
    function calculateAndSum(frm) {
        var sum = 0;
        
        frm.doc.meter_square_table.forEach(function (row) {
            sum += row.product || 0;
        });
        
        frm.set_value('sum_of_area', sum);
        frm.set_value('actual_quantity', sum);
    }
    
    
    frappe.ui.form.on('Pcs', {
        member_quantity: function (frm, cdt, cdn) {
            calculateTotalPcs(frm, locals[cdt][cdn]);
            calculateAndSetSum(frm);
        },
        pcs: function (frm, cdt, cdn) {
            calculateTotalPcs(frm, locals[cdt][cdn]);
            calculateAndSetSum(frm);
        },
        refresh: function (frm) {
            calculateAndSetSum(frm);
        },
        pcs_onload: function (frm, cdt, cdn) {
            calculateAndSetSum(frm);
        },
    });
    
    function calculateTotalPcs(frm, child) {
        var memberQuantity = child.member_quantity || 0;
        var pcs = child.pcs || 0; // Replace 'pcs' with the actual field name
    
        var totalVolume = memberQuantity * pcs;
        frappe.model.set_value(child.doctype, child.name, 'product', totalVolume);
    }
    
    function calculateAndSetSum(frm) {
        var sum = 0;
    
        frm.doc.pcs.forEach(function (row) {
            sum += row.product || 0;
        });
    
        frm.set_value('sum_of_pcs', sum);
        frm.set_value('actual_quantity', sum);
    }
    frappe.ui.form.on('meter', {
        member_quantity: function (frm, cdt, cdn) {
            calculateTotalLength(frm, locals[cdt][cdn]);
            calculateLengthSum(frm);
        },
        length: function (frm, cdt, cdn) {
            calculateTotalLength(frm, locals[cdt][cdn]);
            calculateLengthSum(frm);
        },
        refresh: function (frm) {
            calculateLengthSum(frm);
        },
        meter_onload: function (frm, cdt, cdn) {
            calculateLengthSum(frm);
        },
    });
    
    function calculateTotalLength(frm, child) {
        var memberQuantity = child.member_quantity || 0;
        var length = child.length || 0; // Replace 'pcs' with the actual field name
    
        var totalLength = memberQuantity * length;
        frappe.model.set_value(child.doctype, child.name, 'product', totalLength);
    }
    
    function calculateLengthSum(frm) {
        var sum = 0;
    
        frm.doc.meter.forEach(function (row) {
            sum += row.product || 0;
        });
    
        frm.set_value('sum_of_length', sum);
        frm.set_value('actual_quantity', sum);
    }