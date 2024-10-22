// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.require("assets/erpnext/js/financial_statements.js", function() {
    frappe.query_reports["Profit and Loss Statement"] = $.extend({},
        erpnext.financial_statements);

    frappe.query_reports["Profit and Loss Statement"]["filters"].push(
        {
            "fieldname": "project",
            "label": __("Project"),
            "fieldtype": "MultiSelect",
            get_data: function() {
                var projects = frappe.query_report.get_filter_value("project") || "";
                const values = projects.split(/\s*,\s*/).filter(d => d);
                const txt = projects.match(/[^,\s*]*$/)[0] || '';
                let data = [];
                
                frappe.call({
                    type: "GET",
                    method: 'frappe.desk.search.search_link',
                    async: false,
                    no_spinner: true,
                    args: {
                        doctype: "Project",
                        txt: txt,
                        filters: {
                            "name": ["not in", values]
                        }
                    },
                    callback: function(r) {
                        data = r.results;
                    }
                });
                return data;
            }
        },
        {
            "fieldname": "filter_based_on",
            "label": __("Filter Based On"),
            "fieldtype": "Select",
            "options": ["Fiscal Year", "Date Range"],
            "default": "Fiscal Year",
            "on_change": function() {
                let filter_based_on = frappe.query_report.get_filter_value("filter_based_on");
                
                // Show/hide relevant fields based on the selection
                if (filter_based_on === "Fiscal Year") {
                    // frappe.query_report.toggle_filter_display("from_fiscal_year", true);
                    // frappe.query_report.toggle_filter_display("to_fiscal_year", true);
                    frappe.query_report.toggle_filter_display("to_date", false);
                    frappe.query_report.toggle_filter_display("from_date", false);

                } else {
                    // frappe.query_report.toggle_filter_display("from_fiscal_year", false);
                    // frappe.query_report.toggle_filter_display("to_fiscal_year", false);
                    frappe.query_report.toggle_filter_display("to_date", true);
                    frappe.query_report.toggle_filter_display("from_date", true);
                }
            }
        },
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.add_months(frappe.datetime.month_start(), -1),
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.add_days(frappe.datetime.month_start(), -1),
        },
        {
            "fieldname": "accumulated_values",
            "label": __("Accumulated Values"),
            "fieldtype": "Check"
        }
 
    );

    frappe.query_report.toggle_filter_display = function(fieldname, show) {
        let field = frappe.query_report.get_filter(fieldname);
        if (field) {
            field.df.hidden = !show;
            field.refresh();
        }
    };
});
