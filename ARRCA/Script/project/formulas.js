frm.set_value("task_physical_weightage", frm.doc.duration_in_days / frm.doc.project_total_duration)
frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_total_cost / d.productivity));
frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
frm.set_value("small_tools_cost", frm.doc.equipment_total_cost * frm.doc.small_tools_in_percentage)
frm.set_value("total_with_profit_margin", indirect_cost * frm.doc.profitmargin / 100)
frm.set_value("equipment_unit_cost", (frm.doc.equipment_total_cost + frm.doc.small_tools_cost) / frm.doc.productivity)
