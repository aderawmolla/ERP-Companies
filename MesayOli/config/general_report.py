from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Project Reports"),
			"icon": "fa fa-star",
			"items": [
				{
					"type": "report",
					"name": "Daily Monitoring Report",
					"lable": "Daily Monitoringg Report",
					"is_query_report": True,
         			"doctype": "Doctype For Reports",
				},
				{
					"type": "report",
					"name": "OID Report",
					"lable": "OID Report",
					"is_query_report": False,
					"doctype": "Timesheet",
				},
								{
					"type": "report",
					"name": "Project Wise Profit and loss",
					"lable": "Project Wise Profit and loss Report",
					"doctype": "Timesheet",
				},
								{
					"type": "report",
					"name": "Project Financial Progress",
					"lable": "Project Financial Progress Report",
					"doctype": "Timesheet",
				},
				{
					"type": "report",
					"name": "Operational Plan Report",
					"lable": "Operational Plan Report",
					"is_query_report": True,
					"doctype": "Operational Plan",
				},
			]
		},
		
		{
			"label": _("Fleet Maintenance Report"),
			"icon": "fa fa-star",
			"items": [
				{
					"type": "report",
					"name": "Annual Fuel Consumption Report",
					"lable": "Annual Fuel Consumption Report",
					"doctype": "Annual fuel and oil consumption"
				},
								{
					"type": "report",
					"name": "Cannibalization Report",
					"lable": "Cannibalization Report",
					"doctype": "Cannibalization request Form"
				},
								{
					"type": "report",
					"name": "General Vehicle Expense Report",
					"lable": "General Vehicle Expense Report",
					"is_query_report": True,
					"doctype": "Fuel Request for Equipment Form"
				},
								{
					"type": "report",
					"name": "Performance Evalution Report",
					"lable": "Performance Evalution Report",
					"is_query_report": True,
					"doctype": "Performance Evalution Table"
				},
								{
					"type": "report",
					"name": "Machine Utilization Report",
					"lable": "Machine Utilization Report",
					"doctype": "Daily Machin Utilization Form"
				},
			]
		},
		{
			"label": _("Procurement Reports"),
			"icon": "fa fa-cog",
			"items": [
				{
					"type": "report",
					"name": "Supplier Lot Report",
					"lable": "Supplier Lot Report",
					"doctype": "Supplier Quotation",
					"is_query_report": True,
				},
												{
					"type": "report",
					"name": "Supplier Winner Report",
					"lable": "Supplier Winner Report",
					"doctype": "Supplier Quotation",
					"is_query_report": True,
				},
								{
					"type": "report",
					"name": "Item-wise Purchase History",
					"lable": "Item-wise Purchase History Report",
					"doctype": "Purchase Order",
					"is_query_report": True,
				},
								{
					"type": "report",
					"name": "Purchase Analytics",
					"lable": "Purchase Analytics Report",
					"doctype": "Purchase Order",
				},
								{
					"type": "report",
					"name": "Annual Procurement Plan Report",
					"lable": "Annual Procurement Plan Report",
					"doctype": "Annual procurement request submission"
				},
			]
		},
		{
			"label": _("Inventory or Stock Reports"),
			"icon": "fa fa-wrench",
			"items": [
				{
					"type": "report",
					"name": "Stock Balance",
					"lable": "Stock Balance Report",
					"doctype": "Stock Ledger Entry"
				},
				{
					"type": "report",
					"name": "Stock Ledger",
					"lable": "Stock Ledger Report",
					"doctype": "Stock Ledger Entry"
				},
								{
					"type": "report",
					"name": "Stock issue weekly report",
					"lable": "Stock Issue Weekly Report",
					"doctype": "Stock Entry"
				},
								{
					"type": "report",
					"name": "Itemwise Recommended Reorder Level",
					"lable": "Itemwise Recommended Reorder Level Report",
					"doctype": "Itemwise Recommended Reorder Level"
				},
								{
					"type": "report",
					"name": "Item Shortage Report",
					"lable": "Item Shortage Report",
					"doctype": "Bin",
					"is_query_report": True,
				},
                {
					"type": "report",
					"name": "Stock Reconcilation",
					"lable": "Stock Reconcilation",
					"doctype": "Stock Reconciliation",
					"is_query_report": True,


				},

				

			]
		},
		{
			"label": _("Human Resourse Plan"),
			"items": [
				{
					"type": "report",
					"name": "Employee Performance Report",
					"lable": "Employee Performance Report",
					"doctype": "Employee",
					"is_query_report": True,
				},
								{
					"type": "report",
					"name": "Employee Leave Balance",
					"lable": "Employee Leave Balance Report",
					"doctype": "Employee"
				},
								{
					"type": "report",
					"name": "Monthly Attendance Sheet",
					"lable": "Monthly Attendance Sheet Report",
					"doctype": "Attendance"
				},
								{
					"type": "report",
					"name": "Employee Information",
					"lable": "Employee Information Report",
					"doctype": "Employee"
				},
												{
					"type": "report",
					"name": "User Card Updated Report",
					"lable": "User Card Report",
					"doctype": "User Card",
					"is_query_report": True,
				},
			]
		},
	]