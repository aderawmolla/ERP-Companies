from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Projects"),
			"icon": "fa fa-star",
			"items": [
				{
					"type": "doctype",
					"name": "Projects",
					"description": _("Project master."),
				},
				{
					"type": "doctype",
					"name": "Task",
					"route": "List/Task",
					"description": _("Project activity / task."),
				},
				{
					"type": "doctype",
					"name": "Project Type",
					"description": _("Define Project type."),
				},
			]
		},
		{
			"label": _("Time Tracking"),
			"items": [
				
				{
					"type": "doctype",
					"name": "Master Plan",
					"description": _("Master Plan"),
				},
				{
					"type": "doctype",
					"name": "Operational Plan",
					"description": _("Operational Plan"),
				},
				{
					"type": "doctype",
					"name": "Monthly Plan",
					"description": _("Monthly Plan"),
				},

				{
					"type": "doctype",
					"name": "Weekly Plan",
					"description": _("Weekly Plan"),
				},				
				
				
				{
					"type": "doctype",
					"label": "Daily Monitoring",
					"name": "Timesheet",
					"description": _("Timesheet for tasks."),
				},

			]
		},



	{
			"label": _("Contractual issues"),
			"items": [
				
	{
					"type": "doctype",
					"name": "Variation",
					"description": _("Variation"),
				},


{
					"type": "doctype",
					"name": "Time Extension Management",
					"description": _("Time Extension Management"),
				},
				{
					"type": "doctype",
					"name": "Ommission",
					"description": _("Ommission"),
				},

				{
					"type": "doctype",
					"name": "Addition Management",
					"description": _("Addition Management"),
				},				
				{
					"type": "doctype",
					"name": "Claim Management",
					"description": _("Claim Management"),
				},
				
				
							]
		},


{
			"label": _("Project Followup"),
			"items": [
				{
					"type": "doctype",
					"name": "Material Approval Form",
					"description": _("Material Approval Form"),
				},
				{
					"type": "doctype",
					"name": "Test Approval Management",
					"description": _("Test Approval Management"),
				},

				{
					"type": "doctype",
					"name": "Site Work Permit",
					"description": _("Site Work Permit"),
				},	
								{
					"type": "doctype",
					"name": "Road Work Project Rental Vehicles Control Form",
					"description": _("Road Work Project Rental Vehicles Control Form"),
				},
								{
					"type": "doctype",
					"name": "Daily rental equipment time control",
					"description": _("Daily rental equipment time control"),
				},
								{
					"type": "doctype",
					"name": "Concrete Test Summision",
					"description": _("Concrete Test Summision"),
				},
								{
					"type": "doctype",
					"name": "Laboratory Working Program",
					"description": _("Laboratory Working Program"),
				},
								{
					"type": "doctype",
					"name": "Allowance Request Form",
					"description": _("Allowance Request Form"),
				},		

								{
					"type": "doctype",
					"name": "Operation Request and Permission Form",
					"description": _("Operation Request and Permission Form"),
				},		
				
				
							]
		},

{
			"label": _("Project Payment Issues"),
			"items": [
				{
					"type": "doctype",
					"name": "Takeoff Sheet Preparation",
					"description": _("Takeoff Sheet Preparation"),
				},
				{
					"type": "doctype",
					"name": "Payment Certeficate",
					"description": _("Payment Certeficate"),
				},

				{
					"type": "doctype",
					"name": "Retention followup",
					"description": _("Retention followup"),
				},	
	{
					"type": "doctype",
					"name": "Performance Bond Management",
					"description": _("Performance Bond Management"),
				},	
				
				
				
							]
		},


		{
			"label": _("Reports"),
			"icon": "fa fa-list",
			"items": [
				{
					"type": "report",
					"is_query_report": True,
					"name": "Daily Timesheet Summary",
					"doctype": "Timesheet"
				},
				{
					"type": "report",
					"is_query_report": False,
					"name": "Machinery Scheduling",
					"doctype": "Operational Plan"
				},
				{
					"type": "report",
					"is_query_report": False,
					"name": "Material Scheduling",
					"doctype": "Operational Plan"
				},
				{
					"type": "report",
					"is_query_report": False,
					"name": "Man Power Scheduling",
					"doctype": "Operational Plan"
				},

				{
					"type": "report",
					"is_query_report": True,
					"name": "Project wise Stock Tracking",
					"doctype": "Project"
				},
			]
		},
		{
			"label": _("Master"),
			"icon": "fa fa-facetime-video",
			"items": [
				{
					"type": "doctype",
					"name": "Machinery",
					"description": _("Machinery"),
				},
				{
					"type": "doctype",
					"name": "Manpower",
					"description": _("Manpower"),
				},
        		{
					"type": "doctype",
					"name": "Material",
					"description": _("Material"),
				},
				{
					"type": "doctype",
					"name": "Task Master",
					"description": _("Task Master"),
				},
				{
					"type": "help",
					"label": _("Managing Projects"),
					"youtube_id": "egxIGwtoKI4"
				},
			]
		},
	]