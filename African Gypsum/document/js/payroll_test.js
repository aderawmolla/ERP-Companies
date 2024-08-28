// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
var in_progress = false;
frappe.provide("erpnext.accounts.dimensions");
frappe.ui.form.on('Payroll Entry', {
	refresh: function (frm) {
		if (frm.doc.docstatus == 0) {
			if ((frm.doc.employees || []).length && !frappe.model.has_workflow(frm.doctype)) {
				frm.page.clear_primary_action();
				frm.page.set_primary_action(__('Create Salary Slips'), () => {
					frm.save('Submit').then(() => {
						frm.page.clear_primary_action();
						frm.refresh();
						frm.events.refresh(frm);
					});
				});
			}
		}
		if (frm.doc.docstatus == 1) {
			if (frm.custom_buttons) 
            frm.clear_custom_buttons();
			frm.events.add_context_buttons(frm);
		}
	},
	create_salary_slips: function (frm) {
		frm.call({
			doc: frm.doc,
			method: "create_salary_slips",
			callback: function () {
				frm.refresh();
				frm.toolbar.refresh();
			}
		});
	},

	add_context_buttons: function (frm) {
		if (frm.doc.salary_slips_submitted || (frm.doc.__onload && frm.doc.__onload.submitted_ss)) {
			frm.events.add_bank_entry_button(frm);
		} else if (frm.doc.salary_slips_created) {
			frm.add_custom_button(__("Submit Salary Slip"), function () {
				submit_salary_slip(frm);
			}).addClass("btn-primary");
		}
	},
	clear_employee_table: function (frm) {
		frm.clear_table('employees');
		frm.refresh();
	},
});

// Submit salary slips

const submit_salary_slip = function (frm) {
	frappe.confirm(__('This will submit Salary Slips and create accrual Journal Entry. Do you want to proceed?'),
		function () {
			frappe.call({
				method: 'submit_salary_slips',
				args: {},
				callback: function () {
					frm.events.refresh(frm);
				},
				doc: frm.doc,
				freeze: true,
				freeze_message: __('Submitting Salary Slips and creating Journal Entry...')
			});
		},
		function () {
			if (frappe.dom.freeze_count) {
				frappe.dom.unfreeze();
				frm.events.refresh(frm);
			}
		}
	);
};




