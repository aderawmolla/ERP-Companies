// error message
frappe.throw({
    title: __("Mandatory"),
    message: __("Please Select a Customer")
 });

//  alert message
frappe.show_alert (
    `There is no Stock Entry(ሞዴል 22) which has plate no: ${plat_no}, technician name: ${technician_name} and date: ${date_ec}`
  );
// message print
frappe.msgprint(`Vehicle or Machinery (${frm.doc.serial_or_plate_no}) set to Non-Operable.`);
