frappe.ui.form.on('Purchase Receipt', {
    pr_number: function (frm) {
        if (frm.doc.pr_number) {
            frm.clear_table('items');
            frappe.model.with_doc('Purchase Requisition', frm.doc.pr_number, function () {

                let source_doc = frappe.model.get_doc('Purchase Requisition', frm.doc.pr_number);
                frm.set_value('set_warehouse', source_doc.set_warehouse);

                $.each(source_doc.table_9, function (index, source_row) {

                    const target_row = frm.add_child('items');
                    target_row.item_code = source_row.item_code;
                    target_row.schedule_date = source_row.schedule_date;
                    target_row.qty = source_row.qty;
                    target_row.uom = source_row.uom;
                    target_row.rate = source_row.rate;
                    target_row.amount = source_row.amount;
                    target_row.description = source_row.description;
                    target_row.conversion_factor = source_row.conversion_factor;
                    target_row.warehouse = source_row.warehouse;
                    target_row.from_warehouse = source_row.from_warehouse;
                    target_row.item_name = source_row.item_name;
                    target_row.make = source_row.make;
                });

                frm.refresh_field('items');
            });
        }
    },
});

cur_frm.add_fetch('prepared_by', 'employee_name', 'approver_name');
cur_frm.add_fetch('checked_by', 'employee_name', 'checked_by_name');
cur_frm.add_fetch('authorized_by', 'employee_name', 'authorized_by_name');

frappe.ui.form.on('Purchase Receipt', {
    grand_total: function (frm) {
        var inFigureValue = parseFloat(frm.doc.grand_total);
        var hasCents = inFigureValue % 1 !== 0;

        // Function to convert a number to words
        function numberToWords(num) {
            var units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            var teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            var tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

            if (num < 10) {
                return units[num];
            } else if (num < 20) {
                return teens[num - 10];
            } else if (num < 100) {
                return tens[Math.floor(num / 10)] + ' ' + units[num % 10];
            } else if (num < 1000) {
                return units[Math.floor(num / 100)] + ' Hundred ' + numberToWords(num % 100);
            } else if (num < 1000000) {
                return numberToWords(Math.floor(num / 1000)) + ' Thousand ' + numberToWords(num % 1000);
            } else if (num < 1000000000) {
                return numberToWords(Math.floor(num / 1000000)) + ' Million ' + numberToWords(num % 1000000);
            } else if (num < 1000000000000) {
                return numberToWords(Math.floor(num / 1000000000)) + ' Billion ' + numberToWords(num % 1000000000);
            } else {
                return 'Number out of range';
            }
        }

        // Convert the number to words
        var inWordValue = numberToWords(Math.floor(inFigureValue));

        if (!hasCents) {
            // If no cents, set the value directly
            frm.set_value('grand_total_amount_in_word', inWordValue);
        } else {
            // If there are cents, set the value in the 'in_word' field including cents part
            var centsValue = Math.round((inFigureValue % 1) * 100);
            var centsWord = numberToWords(centsValue) + " Cents";
            frm.set_value('grand_total_amount_in_word', inWordValue + " and " + centsWord);
        }
    }
});


frappe.ui.form.on('Purchase Receipt', {
    refresh: function (frm) {
        // Custom display logic here
        let field_value = frm.doc.workflow_state;

        // Display the field value in the toolbar
        frm.dashboard.set_headline(
            __('Approval State: {0}', [field_value])
        );
    }
});



var prNoArray = []; // Add this line to create an array to store pr_no values

frappe.ui.form.on('Pr No 2', {
    pr_no: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        if (child.pr_no && prNoArray.includes(child.pr_no)) {
            frappe.throw({
                title: __("Already Selected"),
                message: __("PR No {0} already selected. Please choose a different PR No.", [child.pr_no])
            });
            frappe.model.clear_doc(cdt, cdn);
        } else {
            prNoArray.push(child.pr_no);
            frappe.model.with_doc('Purchase Requisition', child.pr_no, function () {
                let source_doc = frappe.model.get_doc('Purchase Requisition', child.pr_no);
                $.each(source_doc.table_9, function (index, source_row) {
                    const target_row = frm.add_child('items');
                    target_row.item_code = source_row.item_code;
                    target_row.schedule_date = source_row.schedule_date;
                    target_row.qty = source_row.qty;
                    target_row.uom = source_row.uom;
                    target_row.rate = source_row.rate;
                    target_row.company_id = source_row.company_id;
                    target_row.plate_no = source_row.plate_no;
                    target_row.chassis_no = source_row.chassis_no;
                    target_row.model_no = source_row.model_no;
                    target_row.amount = source_row.amount;
                    target_row.description = source_row.description;
                    target_row.conversion_factor = source_row.conversion_factor;
                    target_row.warehouse = source_row.warehouse;
                    target_row.from_warehouse = source_row.from_warehouse;
                    target_row.item_name = source_row.item_name;
                    target_row.make = source_row.make;
                });
                frm.refresh_field('items');
            });
        }
    }
});