frappe.ui.form.on("Tisisat Payroll", {
    cost_center: function(frm, cdt, cdn) {
        getEmployees(frm, cdt, cdn);
    },
});

function getEmployees(frm, cdt, cdn) {
    console.log("Fetching employees...");
    if(frm.doc.payroll_table){
    frm.clear_table("payroll_table");  // Properly clear the payroll table
    }
   else{
    frm.doc.payroll_table=[];
   }
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Employee",
            filters: {
                cost_center: frm.doc.cost_center ? frm.doc.cost_center : undefined,
                name: ["!=", frm.docname],  // Exclude current docname from results
            },
            fields: ["*"],  // Fetch all fields
            limit: 100  // Correct limit argument
        },
        callback: function(response) {
            if (response.message && Array.isArray(response.message)) {
                var records = response.message;
                console.log("The records are:", records);

                // Ensure loop executes if there are records
                if (records.length > 0) {
                    $.each(records, function(i, source) {
                        var target = frm.add_child("payroll_table");
                        var income =getEarning(source)          
                        var percent_18 = (((source.salary) * 0.07) + ((source.salary) * 0.11));

                        // Populate payroll table fields
                        target.name_of_staff = source.employee_name;
                        target.salary = source.salary;
                        target.housing_allowance = source.housing_allowance;
                        target.transport_allowance = source.transport_allowance;
                        target.professional_allowance = source.professional_allowance;
                        target.position_allowance = source.position_allowance;
                        target.gross = income;
                        target.taxable_income = income;
                        target.income_tax = getIncomeTax(source);  // Calculate income tax
                        target.pension_7 = source.salary * 0.07;  // Calculate pension
                        target.social_contribution = source.social_contribution;
                        target.workers_union = source.workers_union;
                        target.cost_sharing = source.cost_sharing;
                        target.other_earning = source.other_earning;
                        target.orda_saving = source.orda_saving;
                        target.telephone = source.telephone;
                        target.staff_loan = source.staff_loan;
                        target.total_deduction = getDeductions(source);  // Calculate total deductions
                        target.netpay = getNetPay(source);  // Calculate net pay
                        target.pension_11 = (source.salary) * 0.11;
                        target.pension_18 = percent_18;
                    });
                    frm.refresh_field("payroll_table");  // Refresh the payroll table field after adding records
                } else {
                    console.log("No records found.");
                }
            }
        }
    });
}

function getDeductions(sourceRow) {
    var incomeTax = getIncomeTax(sourceRow); 
    var totalDeduction = (sourceRow.salary * 0.07) + 
                         (sourceRow.social_contribution )+
                         (sourceRow.workers_union) +
                         (sourceRow.cost_sharing )+
                         (sourceRow.other_earning) +
                         (sourceRow.orda_saving) +
                         (sourceRow.telephone) +
                         (sourceRow.staff_loan) +
                         incomeTax;
        return totalDeduction;
}


function getEarning(source) {
var income= parseFloat(source.housing_allowance || 0) + 
parseFloat(source.professional_allowance || 0) + 
parseFloat(source.position_allowance || 0) + 
parseFloat(source.transport_allowance || 0);
return income;

}

function getIncomeTax(sourceRow) {
   var totalIncome= getEarning(sourceRow)
    if (totalIncome > 10900) {
        return totalIncome * 0.35 - 1500;
    } else if (totalIncome > 7800) {
        return totalIncome * 0.30 - 950;
    } else if (totalIncome > 5250) {
        return totalIncome * 0.15 - 142.50;
    } else if (totalIncome > 3200) {
        return totalIncome * 0.20 - 302.50;
    } else if (totalIncome > 1650) {
        return totalIncome * 0.20 - 302.50;
    } else if (totalIncome > 600) {
        return totalIncome * 0.10 - 60;
    } else {
        return totalIncome;  // No deductions for total income <= 600
    }
}

function getNetPay(source) {
    var deduction=getDeductions(source)
    var earning=getEarning(source)
    var net=earning-deduction
   return net;  // Update this with actual net pay calculation
}
