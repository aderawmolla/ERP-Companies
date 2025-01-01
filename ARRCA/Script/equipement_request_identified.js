
frappe.ui.form.on('Equipement Request Table', {
    refresh: function(frm) {
        frm.fields_dict['equipement_request_table'].grid.get_field('light_vehicle').toggle_display(false);
        frm.fields_dict['equipement_request_table'].grid.get_field('heavy_vehicle').toggle_display(false);
        frm.fields_dict['equipement_request_table'].grid.get_field('machine').toggle_display(false);
        frm.fields_dict['equipement_request_table'].grid.get_field('construction_equipment_and_generators').toggle_display(false);
    },
    equipment_type: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        
        if (row.equipment_type == 'Light Vehicle') {
            frm.fields_dict['equipement_request_table'].grid.get_field('light_vehicle').toggle_display(true);
        } else {

        }
    }
});