frappe.ui.form.on ('Maintenance Work order', {
  before_submit: function (frm) {
    console.log("On Summit")
    frappe.call ({
      method: 'erpnext.update_equipment_status.update_equipment_status',
      args: {
        serial_or_plate_no: frm.doc.serial_or_plate_no,
        action: 'submit',
      },
      callback: function (r) {
        frappe.msgprint(`Vehicle or Machinery (${frm.doc.serial_or_plate_no}) set to Non-Operable.`);
        console.log ('message', r);
      },
    });
  },
  on_trash: function(frm) {
    console.log("On Cancel");
    frappe.call({
      method: 'erpnext.update_equipment_status.update_equipment_status',
      args: {
        serial_or_plate_no: frm.doc.serial_or_plate_no,
        action: 'cancel',
      },
      callback: function(r) {
        frappe.msgprint(`Vehicle or Machinery (${frm.doc.serial_or_plate_no}) set to Operable.`);
        console.log ('message', r);
      },
    });
  }});