function toggleColumns(frm, fields, table, show = false) {
    let grid = frm.get_field(table).grid;
    // Show or hide specified fields
    for (let field of fields) {
        grid.fields_map[field].hidden = show ? 0 : 1;
    }
    // Refresh grid columns
    grid.visible_columns = undefined;
    grid.setup_visible_columns();

    // Rebuild the header row
    grid.header_row.wrapper.remove();
    delete grid.header_row;
    grid.make_head();
    // Update each row in the grid
    for (let row of grid.grid_rows) {
        if (row.open_form_button) {
            row.open_form_button.parent().remove();
            delete row.open_form_button;
        }

        // Update columns for each row
        for (let field in row.columns) {
            if (row.columns[field] !== undefined) {
                row.columns[field].remove();
            }
        }
        delete row.columns;
        row.columns = [];
        row.render_row();
    }
}

// Frappe form logic using the toggleColumns function
frappe.ui.form.on('Equipement Request Table', {
    refresh: function(frm) {
        // Hide all equipment type columns by default
        toggleColumns(frm, ['light_vehicle', 'heavy_vehicle', 'machine', 'construction_equipment_and_generators'], 'equipement_request_table', false);
    },
    equipment_type: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        // Show the relevant column based on the selected equipment type
        if (row.equipment_type == 'Light Vehicle') {
            toggleColumns(frm, ['light_vehicle'], 'equipement_request_table', true);
        } else if (row.equipment_type == 'Heavy Vehicle') {
            toggleColumns(frm, ['heavy_vehicle'], 'equipement_request_table', true);
        } else if (row.equipment_type == 'Machine') {
            toggleColumns(frm, ['machine'], 'equipement_request_table', true);
        } else if (row.equipment_type == 'Construction Equipment and Generators') {
            toggleColumns(frm, ['construction Equipment & Generators'], 'equipement_request_table', true);
        }
    }
});
