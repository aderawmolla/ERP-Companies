// set value in parent document
frm.set_value('sub_total1', subTotal);

// set value in child document

frappe.model.set_value(cdt, cdn, 'total', result);


// set value in child document with calculation
var d = locals[cdt][cdn];
frappe.model.set_value(d.doctype, d.name, 'transfer_qty', (d.qty * 1));