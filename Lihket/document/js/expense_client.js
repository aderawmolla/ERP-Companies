frappe.ui.form.on('Vehicle Rent and Surveying tool', {
    hamle: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    nehase: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    meskerem: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    tkemt: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    hdar: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    tahsas: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    tir: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    yekatit: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    megabit: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    miyazya: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    gnbot: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
    sene: function(frm, cdt, cdn) {
        updateVehicle(frm, cdt, cdn);
    },
});

function updateVehicle(frm, cdt, cdn) {  
    var child = locals[cdt][cdn];
    // Ensure that each monthly field exists and is a number, otherwise default to 0
    var months = ['hamle', 'nehase', 'meskerem', 'tkemt', 'hdar', 'tahsas', 'tir', 'yekatit', 'megabit', 'miyazya', 'gnbot', 'sene'];
    var months_previous = ['hamle_previous', 'nehase_previous', 'meskerem_previous', 'tkemt_previous', 'hdar_previous', 'tahsas_previous', 'tir_previous', 'yekatit_previous', 'megabit_previous', 'miyazya_previous', 'gnbot_previous', 'sene_previous'];

    var total_expense = 0;

    months.forEach(function(month, index) {
        total_expense += flt(child[month]);

        // Update cumulative total for the month
        var cumulative_field = months_previous[index];
        frappe.model.set_value(cdt, cdn, cumulative_field, total_expense);
    });

    frappe.model.set_value(cdt, cdn, 'total_expense', total_expense);
}

frappe.ui.form.on('Stationary and Others', {
    total_expense: function(frm, cdt, cdn) {
        updateStationary(frm, cdt, cdn);
    },
});



function updateStationary(frm, cdt, cdn) {  
    var child = locals[cdt][cdn];

    var months = ['hamle', 'nehase', 'meskerem', 'tkemt', 'hdar', 'tahsas', 'tir', 'yekatit', 'megabit', 'miyazya', 'gnbot', 'sene'];
    var months_previous = ['hamle_previous', 'nehase_previous', 'meskerem_previous', 'tkemt_previous', 'hdar_previous', 'tahsas_previous', 'tir_previous', 'yekatit_previous', 'megabit_previous', 'miyazya_previous', 'gnbot_previous', 'sene_previous'];


    var Expense_month = flt(child.total_expense) / 12;
    
    for (var i = 0; i < months.length; i++) {
        var previous_value = i == 0 ? Expense_month : Expense_month + flt(child[months_previous[i - 1]]);
        frappe.model.set_value(cdt, cdn, months_previous[i], previous_value);
    }

	
    months.forEach(function(month) {
        frappe.model.set_value(cdt, cdn, month, Expense_month); 
    });
} 


frappe.ui.form.on('Daily Labour', {
    hamle: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    nehase: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    meskerem: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    tkemt: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    hdar: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    tahsas: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    tir: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    yekatit: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    megabit: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    miyazya: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    gnbot: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
    sene: function(frm, cdt, cdn) {
        updateDailyLabour(frm, cdt, cdn);
    },
});

function updateDailyLabour(frm, cdt, cdn) {  
    var child = locals[cdt][cdn];

    var months = ['hamle', 'nehase', 'meskerem', 'tkemt', 'hdar', 'tahsas', 'tir', 'yekatit', 'megabit', 'miyazya', 'gnbot', 'sene'];
    var months_previous = ['hamle_previous', 'nehase_previous', 'meskerem_previous', 'tkemt_previous', 'hdar_previous', 'tahsas_previous', 'tir_previous', 'yekatit_previous', 'megabit_previous', 'miyazya_previous', 'gnbot_previous', 'sene_previous'];

    var total_expense = 0;

    months.forEach(function(month, index) {
        total_expense += flt(child[month]);

        // Update cumulative total for the month
        var cumulative_field = months_previous[index];
        frappe.model.set_value(cdt, cdn, cumulative_field, total_expense);
    });

    // Update the total labor expense field
    frappe.model.set_value(cdt, cdn, 'total_labor_expense', total_expense);
}

frappe.ui.form.on('Staff', {
    hamle: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    nehase: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    meskerem: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    tkemt: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    hdar: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    tahsas: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    tir: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    yekatit: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    megabit: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    miyazya: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    gnbot: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    sene: function(frm, cdt, cdn) {
        updateStaff(frm, cdt, cdn);
    },
    hamle_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    nehase_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    meskerem_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    tkemt_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    hdar_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    tahsas_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    tir_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    yekatit_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    megabit_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    miyazya_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    gnbot_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
    sene_perdiem: function(frm, cdt, cdn) {
        updateStaffPerdiem(frm, cdt, cdn);
    },
});

function updateStaff(frm, cdt, cdn) {  
    var child = locals[cdt][cdn];
    // Ensure that each monthly field exists and is a number, otherwise default to 0
    var months = ['hamle', 'nehase', 'meskerem', 'tkemt', 'hdar', 'tahsas', 'tir', 'yekatit', 'megabit', 'miyazya', 'gnbot', 'sene'];
    var months_previous = ['hamle_previous', 'nehase_previous', 'meskerem_previous', 'tkemt_previous', 'hdar_previous', 'tahsas_previous', 'tir_previous', 'yekatit_previous', 'megabit_previous', 'miyazya_previous', 'gnbot_previous', 'sene_previous'];

    var total_expense = 0;

    months.forEach(function(month, index) {
        total_expense += flt(child[month]);

        // Update cumulative total for the month
        var cumulative_field = months_previous[index];
        frappe.model.set_value(cdt, cdn, cumulative_field, total_expense);
    });

    frappe.model.set_value(cdt, cdn, 'total_expense', total_expense);
}

function updateStaffPerdiem(frm, cdt, cdn) {  
    var child = locals[cdt][cdn];
    
    var months = ['hamle_perdiem', 'nehase_perdiem', 'meskerem_perdiem', 'tkemt_perdiem', 'hdar_perdiem', 'tahsas_perdiem', 'tir_perdiem', 'yekatit_perdiem', 'megabit_perdiem', 'miyazya_perdiem', 'gnbot_perdiem', 'sene_perdiem'];
    var months_previous = ['hamle_previous_perdiem', 'nehase_previous_perdiem', 'meskerem_previous_perdiem', 'tkemt_previous_perdiem', 'hdar_previous_perdiem', 'tahsas_previous_perdiem', 'tir_previous_perdiem', 'yekatit_previous_perdiem', 'megabit_previous_perdiem', 'miyazya_previous_perdiem', 'gnbot_previous_perdime', 'sene_previous_perdiem'];

    var total_Previous_expense = 0;

    months.forEach(function(month, index) {
        total_Previous_expense += flt(child[month]);

        // Update cumulative total for the month
        var cumulative_field = months_previous[index];
        frappe.model.set_value(cdt, cdn, cumulative_field, total_Previous_expense);
    });


    frappe.model.set_value(cdt, cdn, 'total_perdiem', total_Previous_expense);


}

frappe.ui.form.on('Fuel and Lubricant Expense', {
    hamle: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    nehase: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    meskerem: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    tkemt: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    hdar: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    tahsas: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    tir: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    yekatit: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    megabit: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    miyazya: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    gnbot: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
    sene: function(frm, cdt, cdn) {
        updateFuel(frm, cdt, cdn);
    },
});

function updateFuel(frm, cdt, cdn) {  
    var child = locals[cdt][cdn];
    // Ensure that each monthly field exists and is a number, otherwise default to 0
    var months = ['hamle', 'nehase', 'meskerem', 'tkemt', 'hdar', 'tahsas', 'tir', 'yekatit', 'megabit', 'miyazya', 'gnbot', 'sene'];
    var months_previous = ['hamle_previous', 'nehase_previous', 'meskerem_previous', 'tkemt_previous', 'hdar_previous', 'tahsas_previous', 'tir_previous', 'yekatit_previous', 'megabit_previous', 'miyazya_previous', 'gnbot_previous', 'sene_previous'];

    var total_expense = 0;

    months.forEach(function(month, index) {
        total_expense += flt(child[month]);

        // Update cumulative total for the month
        var cumulative_field = months_previous[index];
        frappe.model.set_value(cdt, cdn, cumulative_field, total_expense);
    });

    frappe.model.set_value(cdt, cdn, 'total_expense', total_expense);
}

frappe.ui.form.on('income plan',{
    // income_table
    income_of_month: function(frm, cdt, cdn) {

        console.log("does this code excuted")
        var child = locals[cdt][cdn];
        // Find the index of the changed row in the child table
        var childTable = frm.doc.income_table;
        var index = childTable.findIndex(row => row.name === child.name);
        // Call the function to calculate expenses up to the given index
        calculateUptoExpense(frm, index,child);

    }
   
});
function calculateUptoExpense(frm, index,child) {
    var totalIncome = 0;

    for (var i = 0; i <= index; i++) {
        var row = frm.doc.income_table[i];
        // Add the income of each row to the total (assuming 'income' is the field name)
        if (row.income_of_month) {
            totalIncome += row.income_of_month;
        }
    }
    child.total_income=totalIncome
    frm.refresh_field("income_table")
    frm.set_value("total_income",totalIncome)
    frm.refresh_field("total_income")
}