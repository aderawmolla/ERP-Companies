
//label==Task Duration Weight
frm.set_value('task_physical_weightage', ((frm.doc.duration / frm.doc.project_total_duration)));//hour
//label==Weighted Avarage
frm.set_value('weighted_avarage', ((frm.doc.percent_of_finance * frm.doc.task_financial_weightage)));
//Equipment Unit Cost
frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity));
//? Equipment Unit cost updated please use the external efficiency
frm.set_value("small_tools_cost", frm.doc.equipment_total_cost * frm.doc.small_tools_in_percentage)
//Total Direct Unit Cost
//Equipment Unit Cost With Small Tools=equipment_unit_cost
frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost);
//Equipment Unit Cost With Small Tools
frm.set_value("equipment_unit_cost", (frm.doc.equipment_total_cost + frm.doc.small_tools_cost) / frm.doc.productivity)
//Man Power Unit Cost
frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity));
//Total Overhead Cost
frm.set_value("indirect_cost_total", frm.doc.indirectcost * frm.doc.activity_total_cost / 100)
//Activity unit rate
frm.set_value("activity_unit_rate_collective", total_cost);
//Task Unit Rate
frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective);
//Profit
frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.total_cost_with_indirect_cost * d.profitmargin) / 100);
//Total Cost with Indirect Cost
frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.direct_cost_with_small_tool + d.indirect_cost_total);




