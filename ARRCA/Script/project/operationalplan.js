cur_frm.add_fetch('activity', 'quantity', 'quantity');
cur_frm.add_fetch('activity', 'direct_cost_after_conversion', 'rate');
cur_frm.add_fetch('activity', 'unit', 'uom');
cur_frm.add_fetch('activity', 'subject', 'activity_name');
cur_frm.add_fetch('activity', 'productivity', 'productivity');
cur_frm.add_fetch('activity', 'duration_in_days', 'duration');

cur_frm.add_fetch('activity', 'quantity', 'planned');


frappe.ui.form.on('Operational Plan', {
	onload: function(frm) {
		console.log("abe", frm.doc.no)
		if (!frm.doc.no) {
			addRowToCPT(frm);

		}
	}
});
// Aderaw the fool
frappe.ui.form.on("Holidayss", {

    from_date_ec: function(frm,cdt,cdn) {
        console.log("I am touched")
        var child=locals[cdt][cdn]
        if (child.from_date_ec) {
            // Update fields for GC date and calculate duration
        let date = convertDateTOGC(child.from_date_ec.toString());
        let dateObject = new Date(date);
        
        // Format the date as a string in YYYY-MM-DD format
        let formattedDate = dateObject.toISOString().slice(0, 10);
        child.from_date=formattedDate
        frm.refresh_field("holiday");
        }
    },
    to_date_ec: function(frm,cdt,cdn) {
        console.log("I am  touched from todate")
        var child=locals[cdt][cdn]
        if (child.to_date_ec) {
            // Update fields for GC date and calculate duration
        let date = convertDateTOGC(child.to_date_ec.toString());
        let dateObject = new Date(date);
        
        // Format the date as a string in YYYY-MM-DD format
        let formattedDate = dateObject.toISOString().slice(0, 10);
        child.to_date=formattedDate
        frm.refresh_field("holiday");
        }
    }
});

function setFieldInGC(frm, ec_field, gc_field) {
    if (frm.doc[ec_field] && gc_field) {
        let date = convertDateTOGC(frm.doc[ec_field].toString());
        let dateObject = new Date(date);
        
        // Format the date as a string in YYYY-MM-DD format
        let formattedDate = dateObject.toISOString().slice(0, 10);
        frm.set_value(gc_field, formattedDate);
        frm.refresh_field(gc_field);
    }
}



frappe.ui.form.on('Operational Plan', {
    cal_equip: function(frm, cdt, cdn) {
		console.log("test 1")
        var total = 0;
        frm.doc.machinery.map((row) => {
            total += row.total_hourly_cost;
        })
        frm.doc.equipment_total_cost = total;
        frm.refresh_field("equipment_total_cost")
	},
    cal_mat: function(frm, cdt, cdn) {
		console.log("test 1")
        var total = 0;
        frm.doc.material1.map((row) => {
            total += row.total_cost;
        })
        frm.doc.material_total_cost = total;
        frm.refresh_field("material_total_cost")
	}
});



frappe.ui.form.on('Operational Plan Detail', {
	before_task_list_remove: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var removed_activity = row.activity;
		console.log("removed task id", removed_activity);

		var operational_plan_detail_one1 = frm.doc.operational_plan_detail_one;
		var operational_plan_detail_two2 = frm.doc.operational_plan_detail_two;

		deleteRow(frm, removed_activity, "operational_plan_detail_one");
		deleteRow(frm, removed_activity, "operational_plan_detail_two");

		deleteRow(frm, removed_activity, "machinery");
		deleteRow(frm, removed_activity, "manpower1");
		deleteRow(frm, removed_activity, "material1");



	}
});

function deleteRow(frm, removed_activity, childTable) {
	var table = frm.doc[childTable];
	for (var i = 0; i < table.length; i++) {
		if (table[i].activity === removed_activity) {
			// Remove the row from the child table
			console.log("removed")
			table.splice(i, 1);
			// Update the form
			frm.refresh_field(childTable);
		}
	}
}



frappe.ui.form.on("Operational Plan", {
	project: function(frm, cdt, cdn) {
		if (frm.doc.project) {
			var d = locals[cdt][cdn];
			frm.set_query("activity", "task_list", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});

			frm.set_query("activity", "activity_sequencing", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});
		}
	},
	onload: function(frm, cdt, cdn) {
		if (frm.doc.project) {
			var d = locals[cdt][cdn];
			frm.set_query("activity", "task_list", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});

			frm.set_query("activity", "activity_sequencing", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});
		}
	}
});


//preventing assigning  a planed quantity which is greter than the remining
frappe.ui.form.on('Operational Plan Detail', {
	planned: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("duration", frm.doc.duration_in_days)
		if (row.planned > row.quantity) {
			row.planned = null;
			frappe.show_alert("Please select lower amount of quantity. It can not be done with the specidied day duration!")
		} else if (row.duration > frm.doc.duration_in_days) {
			console.log("i am hereeee")
			row.planned = null;
			frappe.show_alert("Please select lower amount of quantity. It can not be done with the specidied operational task duration!")
		}
		else {
			row.planned_day = row.duration;
			console.log("ppppppppppppppp", row.planned_day, row.planned_day)
			frm.refresh_field("task_list");
			// AutoPopulate(frm, cdt, cdn);
		}
		frm.refresh_field("task_list")
	},
	activity:function(frm,cdt,cdn){
	   AutoPopulate(frm, cdt, cdn);
	   frm.refresh_field("task_list");


	}
	
});

//about the critical path calculation
function findMaxDate(dateArray) {
	console.log("date arrya", dateArray)
	if (dateArray.length == 0) {
		return null;
	}
	const timestamps = dateArray.map(date => new Date(date).getTime());
	const maxTimestamp = Math.max(...timestamps)
	return maxTimestamp && new Date(maxTimestamp).toISOString().split('T')[0];
}
function findMinDate(dateArray) {
	console.log("date array", dateArray)
	const timestamps = dateArray.map(date => new Date(date).getTime());
	const minTimestamp = Math.min(...timestamps);

	return new Date(minTimestamp).toISOString().split('T')[0];
}


frappe.ui.form.on('Activity Sequencing', {
	activity: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("row", row)
		if (row.idx == 1) {
			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Task',
					filters: {
						'name': row.activity,
					},
					fields: ["exp_start_date"],
				},
				callback: async function(response) {
					console.log("Response ", response.message[0].exp_start_date)
					frm.set_value('start_date_of_first_task', response.message[0].exp_start_date);
					frm.refresh_field("start_date_of_first_task")

				}
			})



		}
	}
});

frappe.ui.form.on('Operational Plan', {
    get_critical_path: function(frm) {

        const dependency = frm.doc.activity_sequencing;
        let nodes = {};

        if (dependency && frm.doc.start_date_of_first_task) {
            // Step 1: Initialize nodes with start and end dates based on dependencies
            dependency.forEach(task => {
                const duration = task.duration || 0;

                if (!nodes[task.activity]) {
                    if (!task.predecessor_activity) {
                        nodes[task.activity] = {
                            es: [frm.doc.start_date_of_first_task],
                            ef: [frappe.datetime.add_days(frm.doc.start_date_of_first_task, duration)],
                            ls: [],
                            lf: []
                        };
                    } else {
                        nodes[task.activity] = { es: [], ef: [], ls: [], lf: [] };
                        let predecessorEf = nodes[task.predecessor_activity]?.ef?.slice(-1)[0];

                        if (task.relationship_type === "Finish to Start" && predecessorEf) {
                            nodes[task.activity]["es"].push(
                                frappe.datetime.add_days(predecessorEf, task.lag_days - task.lead_days)
                            );
                            nodes[task.activity]["ef"].push(
                                frappe.datetime.add_days(nodes[task.activity]["es"][0], duration)
                            );
                        }
                    }
                } else {
                    if (task.relationship_type === "Finish to Start") {
                        let predecessorEf = nodes[task.predecessor_activity]?.ef?.slice(-1)[0];
                        nodes[task.activity]["es"].push(
                            frappe.datetime.add_days(predecessorEf, task.lag_days - task.lead_days)
                        );
                        nodes[task.activity]["ef"].push(
                            frappe.datetime.add_days(nodes[task.activity]["es"].slice(-1)[0], duration)
                        );
                    }
                }
            });

            // Step 2: Calculate all possible paths and track their durations
            let paths = [];
            const traversePaths = (activity, currentPath, totalDuration) => {
                const activityStart = nodes[activity].es[0];
                const activityFinish = nodes[activity].ef[0];
                const activityDuration = activityFinish && activityStart ? 
                    frappe.datetime.get_diff(activityFinish, activityStart) : 0;

                currentPath.push({ activity, duration: activityDuration });
                totalDuration += activityDuration;

                if (!dependency.some(task => task.predecessor_activity === activity)) {
                    paths.push({
                        path: currentPath.map(item => `${item.activity} (${item.duration} days)`).join(" ............... "),
                        duration: totalDuration
                    });
                } else {
                    dependency
                        .filter(task => task.predecessor_activity === activity)
                        .forEach(task => traversePaths(task.activity, [...currentPath], totalDuration));
                }
            };

            traversePaths(dependency[0].activity, [], 0);

            frm.set_value(
                "all_paths",
                paths.map((p, index) => `Path${index + 1}:\n${p.path} (Total: ${p.duration} days)`).join("\n\n")
            );
            frm.refresh_field("all_paths");

            // Step 3: Identify Critical Path
            let criticalPath = paths.reduce((max, path) => (path.duration > max.duration ? path : max), paths[0]);
            frm.set_value("tasks_on_the_critical_path", criticalPath.path);
            frm.set_value("critical_path_duration_in_days", criticalPath.duration);

            // Step 4: Calculate LS and LF for all tasks (Backward Pass)
            let latestFinishDate = frappe.datetime.add_days(frm.doc.start_date_of_first_task, criticalPath.duration);
            let criticalActivities = criticalPath.path.split(" ............... ").map(item => item.split(" (")[0]);

            // Backward pass for tasks on the critical path
            criticalActivities.reverse().forEach(activity => {
                let node = nodes[activity];
                node.lf = [latestFinishDate];
                node.ls = [frappe.datetime.add_days(latestFinishDate, -frappe.datetime.get_diff(node.ef[0], node.es[0]))];
                latestFinishDate = node.ls[0];
            });

            // Backward pass for non-critical path tasks
            dependency.reverse().forEach(task => {
                if (!nodes[task.activity].lf.length) {
                    let successors = dependency.filter(dep => dep.predecessor_activity === task.activity);
                    if (successors.length > 0) {
                        nodes[task.activity].lf = [Math.min(...successors.map(s => nodes[s.activity].ls[0]))];
                        nodes[task.activity].ls = [
                            frappe.datetime.add_days(nodes[task.activity].lf[0], -frappe.datetime.get_diff(nodes[task.activity].ef[0], nodes[task.activity].es[0]))
                        ];
                    }
                }
            });

            // Step 5: Populate critical_path_table
            frm.clear_table("critical_path_table");

            Object.keys(nodes).forEach(activity => {
                let task = nodes[activity];
                let tableRow = frm.add_child("critical_path_table");
                tableRow.activity = activity;
                tableRow.es = task.es[0];
                tableRow.ef = task.ef[0];
                tableRow.ls = task.ls[0];
                tableRow.lf = task.lf[0];
            });

            frm.refresh_field("critical_path_table");
            frm.refresh_field("tasks_on_the_critical_path");
            frm.refresh_field("critical_path_duration_in_days");

            console.log("All Paths with Durations", paths);
            console.log("Critical Path", criticalPath);
        } else {
            frappe.show_alert("Please select a list of activities first.");
        }
    }
});

//stop here

function addRowToCPT(frm, cdt, cdn) {
	console.log(frm.doc.no)
	var no = frm.doc.no;
	frm.clear_table("no");

	frm.set_value("no", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "No of working days", "no");
	tableRow1.sep = 30;
	tableRow1.oct = 30;
	tableRow1.nov = 30;
	tableRow1.dec = 30;
	tableRow1.jan = 30;
	tableRow1.feb = 30;
	tableRow1.mar = 30;
	tableRow1.apr = 30;
	tableRow1.may = 30;
	tableRow1.jun = 30;
	tableRow1.july = 30;
	tableRow1.aug = 30;

	console.log("table row", tableRow1)

	refresh_field("no");

}




var month_totals = {};


// Calfulate total Holidayss
frappe.ui.form.on('Holidayss', {
	from_date: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		console.log("child", child)
		if (child.from_date && child.to_date) {
			var start_date = frappe.datetime.str_to_obj(child.from_date);
			var end_date = frappe.datetime.str_to_obj(child.to_date);

			var day_diff = end_date.getDate() - start_date.getDate() + 1;
			child.total = Math.ceil(day_diff);

			var month_number = start_date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
			child.month = month_number;
			console.log("month", child.month)



			frm.refresh_field("holiday")
		}


	},
	to_date: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		console.log("child", child)
		if (child.from_date && child.to_date) {

			var start_date = frappe.datetime.str_to_obj(child.from_date);
			var end_date = frappe.datetime.str_to_obj(child.to_date);

			var day_diff = end_date.getDate() - start_date.getDate() + 1;


			var month_number = start_date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
			var month_number2 = end_date.getMonth() + 1;
			child.month = month_number;
			console.log("month number 1", month_number)
			console.log("month number 2", month_number2)


			if (month_number == month_number2) {
				child.total = Math.ceil(day_diff);
				if (month_totals[child.month]) {
					month_totals[child.month] += child.total;
				} else {
					month_totals[child.month] = child.total;
				}

				console.log("month", month_totals)
				console.log("no", frm.doc.no)

				frm.doc.no[0].sep = 30 - (month_totals[9] || 0);  // September
				frm.doc.no[0].oct = 30 - (month_totals[10] || 0); // October
				frm.doc.no[0].nov = 30 - (month_totals[11] || 0); // November
				frm.doc.no[0].dec = 30 - (month_totals[12] || 0); // December
				frm.doc.no[0].jan = 30 - (month_totals[1] || 0);  // January
				frm.doc.no[0].feb = 30 - (month_totals[2] || 0);  // February
				frm.doc.no[0].mar = 30 - (month_totals[3] || 0);  // March
				frm.doc.no[0].apr = 30 - (month_totals[4] || 0);  // April
				frm.doc.no[0].may = 30 - (month_totals[5] || 0);  // May
				frm.doc.no[0].jun = 30 - (month_totals[6] || 0);  // June
				frm.doc.no[0].july = 30 - (month_totals[7] || 0); // July
				frm.doc.no[0].aug = 30 - (month_totals[8] || 0);  // August

				frm.refresh_field("no")
				console.log("sth", frm.doc.no[0])

				frm.refresh_field("holiday")


			} else {
				frappe.show_alert("The month of the from date and the to date should be the same. Otherwise use additonal rows to add separetely")
				child.to_date = null;
				frm.refresh_field("holiday")

			}

		}
	}
});




frappe.ui.form.on('Operational Plan', {
	end_date_ec: function(frm) {
		if (frm.doc.end_date_ec) {
			var finalgc = convertDateTOGC(frm.doc.end_date_ec.toString());
			frm.doc.end_date = finalgc;
			frm.refresh_field("end_date")
		}

	},
	start_date_ec: function(frm) {
		if (frm.doc.start_date_ec) {
			var finalgc = convertDateTOGC(frm.doc.start_date_ec.toString());
			frm.doc.start_date = finalgc;
			frm.refresh_field("start_date")
		}
	}
});




//calculating duration
frappe.ui.form.on('Operational Plan', {
	end_date: function(frm) {
		if (frm.doc.start_date && frm.doc.end_date) {
			var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
			var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

			var year_diff = end_date.getFullYear() - start_date.getFullYear();
			var month_diff = end_date.getMonth() - start_date.getMonth();
			var day_diff = end_date.getDate() - start_date.getDate();

			var total_months = year_diff * 12 + month_diff + day_diff / 30; // Approximate days in a month

			var year_diff_decimal = total_months / 12;
			frm.set_value('duration', year_diff_decimal.toFixed(2));
			frm.set_value('duration_in_days', total_months * 30);
			console.log("duration", year_diff_decimal.toFixed(2));
			frm.refresh_field("duration")
		}
	}
});


//Property of ERP Solutions PLC Custom Script Written by Bereket T May 24 2023

cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

function DurationMessage(years, months, days) {
	var message = "";
	if (years > 0) {

		if (years == 1)
			message += years + " year ";
		else
			message += years + " years ";
	}

	if (months > 0 || years > 0) {

		if (months == 1)
			message += months + " month ";
		else if (months != 0)
			message += months + " months";

	}

	if (days == 1)
		message += days + " day ";
	else if (days != 0)
		message += days + " days ";

	return message;
}

function CalDaysInBetweenDates(date1, date2) {
	if ((Object.prototype.toString.call(date1) === '[object Date]') && (Object.prototype.toString.call(date2) === '[object Date]')) {

		var diff = Math.floor(date2.getTime() - date1.getTime());
		var secs = Math.floor(diff / 1000);
		var mins = Math.floor(secs / 60);
		var hours = Math.floor(mins / 60);
		var days = Math.floor(hours / 24);
		return days;
	}
	var days = 0;
	return days;
}

function RemainDays(days) {
	days = Math.floor(days % 31);
	return days
}

function CalMonthFromDays(days) {
	var months = Math.floor(days / 31);
	return months;
}

function RemainMonths(months) {
	months = Math.floor(months % 12);
	return months
}

function CalYearFromMonth(months) {
	var years = Math.floor(months / 12);
	return years;
}

function GetDuration(date1, date2) {
	var totalDays = CalDaysInBetweenDates(date1, date2);
	var month = CalMonthFromDays(totalDays);
	var year = CalYearFromMonth(month);
	var remainDays = RemainDays(totalDays);
	var remainMonth = RemainMonths(month);
	var message = DurationMessage(year, remainMonth, remainDays);
	return message;
}

frappe.ui.form.on("Operational Plan", {
	quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));
	}
});

frappe.ui.form.on("Operational Plan", {
	productivity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));
	}
});

frappe.ui.form.on("Operational Plan", {
	project: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.set_query("activity", "task_list", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});

		frm.set_query("activity", "activity_sequencing", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});
	}
});


frappe.ui.form.on("Operational Plan", {
	onload: function(frm, cdt, cdn) {
		if (frm.doc.project) {
			var d = locals[cdt][cdn];
			frm.set_query("activity", "task_list", function() {
				return {
					"filters": {
						"project": frm.doc.project
					}
				}
			});

			frm.set_query("activity", "activity_sequencing", function() {
				return {
					"filters": {
						"project": frm.doc.project
					}
				}
			});
		}
	}
});


function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

frappe.ui.form.on("Operational Plan", {
	start_date: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		var start_date = frappe.model.get_value(d.doctype, d.name, "start_date");
		if (start_date) {

			var end_date = addDays(start_date, 372);
			frappe.model.set_value(d.doctype, d.name, "end_date", end_date);

			var date1 = new Date(start_date.toString());
			var date2 = new Date(end_date.toString());

			var duration_result = GetDuration(date1, date2);
			frappe.model.set_value(d.doctype, d.name, "duration", duration_result);
			refresh_field("end_date");
			refresh_field("duration");
		}
	}
});

function AutoPopulate(frm, cdt, cdn) {
    console.log("Auto populate path")
	cur_frm.add_fetch('activity', 'planned_qty_of_the_year', 'quantity');
	cur_frm.add_fetch('activity', 'quantity', 'planned');
    
	cur_frm.add_fetch('activity', 'direct_cost_after_conversion', 'rate');
	cur_frm.add_fetch('activity', 'duration_in_days', 'duration');

	cur_frm.add_fetch('activity', 'unit', 'uom');
	cur_frm.add_fetch('activity', 'subject', 'activity_name');
	cur_frm.add_fetch('activity', 'productivity', 'productivity');
	cur_frm.add_fetch('activity', 'duration_in_days', 'duration');

  
	frm.refresh_field("task_list");
	frm.refresh_field("uom");
	frm.refresh_field("quantity");
	frm.refresh_field("activity_name");
	frm.refresh_field("duration");
    frm.refresh_field("duration_in_days");
	frm.refresh_field("planned");

	var date1 = frm.doc.start_date;
	var date2 = frm.doc.end_date;

	var d = locals[cdt][cdn];
	var activity = frappe.model.get_value(d.doctype, d.name, "activity");


    // I commented after operational detail
	frm.doc.operational_plan_detail_one = []
	frm.doc.operational_plan_detail_two = []

	frm.doc.machinery = []
	frm.doc.manpower1 = []
	frm.doc.material1 = []

	frm.doc.machinery_detail_summerized = []
	frm.doc.manpower_detail_summerized = []
	frm.doc.material_detail_summerized = []

	var allMachinesMap = new Map();

	var grand_total_cost_for_machinary = 0;
	var number_of_items_for_machinary = 0;
	var sum_of_unit_rate_for_machinary = 0;

	var grand_total_cost_for_manpower = 0;
	var number_of_items_for_manpower = 0;
	var sum_of_unit_rate_for_manpower = 0;

	var grand_total_cost_for_material = 0;
	var number_of_items_for_material = 0;
	var sum_of_unit_rate_for_material = 0;


	allMachinesMap.clear();


	var task_lists = frm.doc.task_list;
	$.each(task_lists, function(_i, eMain) {
     
		//Script to populate child tables for machinary
		var taskParent = eMain.activity;
		var subject = eMain.activity_name;
		var planned_qty = eMain.planned;
		console.log("plllllllllllllllllllllllllllllllllllllllllllllllllll", eMain)




		if (taskParent) {
			frappe.call({
				method: "erpnext.machinary_populate_api.get_machinary_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {



					var entry = frm.add_child("machinery");
					console.log("eeeeeeeeeeee", e)
					entry.id_mac = e.id_mac;
					entry.type = e.type;
					entry.activity = taskParent;
					entry.subject = subject;

					entry.equp_no = e.qty;
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.rental_rate = e.rental_rate;
					


					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							console.log("uf ", entry.uf, "eff ", entry.efficency, "qty ", entry.qty, "item no ", entry.equp_no, "prod", entry.productivity)
							entry.equp_hr = (entry.uf * entry.efficency * entry.qty * entry.equp_no) / entry.productivity;

							entry.total_hourly_cost = entry.qty * entry.rental_rate;
							grand_total_cost_for_machinary += entry.qty * entry.rental_rate;
							frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
							console.log("graaaaaaaaaaaaaaaaaaaaaaaaaaand machinery", grand_total_cost_for_machinary)
							frm.refresh_field("equipment_total_cost")

							frm.refresh_field("machinery")

						}
					})


					if (!frm.doc.machinary_detail_summarized_by_month_section_a) {

						console.log("first");
						var machinery_exist1 = false;
						var machinery_exist2 = false;
						console.log("operational plan detail one", frm.doc.operational_plan_detail_one, frm.doc.operational_plan_detail_one.length)

						if (frm.doc.operational_plan_detail_one.length > 0) {
							console.log("i am here")
							frm.doc.operational_plan_detail_one((row, index) => {
								console.log("machinery eee", e)
								console.log("machinery  row", row)

								if (row.activity === e.parent) {
									machinery_exist1 = true;
									machinery_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							})
						}
						else {
							console.log("I am not here")
						}


						console.log("machinery exist 1", machinery_exist1)
						console.log("machinery exist 2", machinery_exist2)


						if (!machinery_exist1) {
							var newEntrySummerized_section_a = frm.add_child("machinary_detail_summarized_by_month_section_a");
							newEntrySummerized_section_a.id_mac = e.id_mac;
							newEntrySummerized_section_a.activity = e.parent;

							newEntrySummerized_section_a.type = e.type;

							var newEntrySummerized_section_a_qty = frm.add_child("operational_plan_machinery_detail_summarized_one_qty"); var newEntrySummerized_section_b_qty = frm.add_child("operational_plan_machinery_detail_summarized_two_qty");

							newEntrySummerized_section_a_qty.id_mac = e.id_mac;
							newEntrySummerized_section_b_qty.id_mac = e.id_mac;

							newEntrySummerized_section_a_qty.activity = e.parent;
							newEntrySummerized_section_b_qty.activity = e.parent;


							newEntrySummerized_section_a_qty.type = e.type;
							newEntrySummerized_section_b_qty.type = e.type;


							var newEntrySummerized_section_a_cost = frm.add_child("operational_plan_machinery_detail_summarized_one_cost"); var newEntrySummerized_section_b_cost = frm.add_child("operational_plan_machinery_detail_summarized_two_cost");

							newEntrySummerized_section_a_cost.id_mac = e.id_mac;
							newEntrySummerized_section_b_cost.id_mac = e.id_mac;

							newEntrySummerized_section_a_cost.activity = e.parent;
							newEntrySummerized_section_b_cost.activity = e.parent;


							newEntrySummerized_section_a_cost.type = e.type;
							newEntrySummerized_section_b_cost.type = e.type;

						}


						if (!machinery_exist2) {
							var newEntrySummerized_section_b = frm.add_child("machinary_detail_summarized_by_month_section_b");
							newEntrySummerized_section_b.id_mac = e.id_mac;
							newEntrySummerized_section_b.activity = e.parent;

							newEntrySummerized_section_b.type = e.type;
						}
					}
					else {
						console.log("second")

						var machinery_exist = false;


						$.each(frm.doc.machinary_detail_summarized_by_month_section_a, function(index, row) {
							if (row.id_mac === e.id_mac) {
								machinery_exist = true;
								return false; // Exit the loop if manpower entry is found
							}
						});

						if (!machinery_exist) {

							var machinery_exist1 = false;
							var machinery_exist2 = false;
							console.log("eeeeeee2", e);
							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									machinery_exist1 = true;
									machinery_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});


							if (!machinery_exist1) {
								var newEntrySummerized_section_a = frm.add_child("machinary_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.id_mac = e.id_mac;
								newEntrySummerized_section_a.activity = e.parent;

								newEntrySummerized_section_a.type = e.type;

								var newEntrySummerized_section_a_qty = frm.add_child("operational_plan_machinery_detail_summarized_one_qty"); var newEntrySummerized_section_b_qty = frm.add_child("operational_plan_machinery_detail_summarized_two_qty");

								newEntrySummerized_section_a_qty.id_mac = e.id_mac;
								newEntrySummerized_section_b_qty.id_mac = e.id_mac;

								newEntrySummerized_section_a_qty.activity = e.parent;
								newEntrySummerized_section_b_qty.activity = e.parent;


								newEntrySummerized_section_a_qty.type = e.type;
								newEntrySummerized_section_b_qty.type = e.type;


								var newEntrySummerized_section_a_cost = frm.add_child("operational_plan_machinery_detail_summarized_one_cost"); var newEntrySummerized_section_b_cost = frm.add_child("operational_plan_machinery_detail_summarized_two_cost");

								newEntrySummerized_section_a_cost.id_mac = e.id_mac;
								newEntrySummerized_section_b_cost.id_mac = e.id_mac;

								newEntrySummerized_section_a_cost.activity = e.parent;
								newEntrySummerized_section_b_cost.activity = e.parent;


								newEntrySummerized_section_a_cost.type = e.type;
								newEntrySummerized_section_b_cost.type = e.type;
							}

							if (!machinery_exist2) {
								var newEntrySummerized_section_b = frm.add_child("machinary_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.id_mac = e.id_mac;
								newEntrySummerized_section_b.activity = e.parent;

								newEntrySummerized_section_b.type = e.type;
							}
						} else {
							console.log("it alredy exists")
						}
					}




				})
				frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
				console.log("graaaaaaaaaaaaaaaaaaaaaaaaaaand machinery", grand_total_cost_for_machinary)
				frm.refresh_field("equipment_total_cost")

				refresh_field("machinery");
				refresh_field("equipment_total_cost");
				refresh_field("equipment_unit_rate");
				refresh_field("machinery_detail_summerized");
				refresh_field("machinary_detail_summarized_by_month_section_a");
				refresh_field("machinary_detail_summarized_by_month_section_b");
				refresh_field("operational_plan_machinery_detail_summarized_one_qty");
				refresh_field("operational_plan_machinery_detail_summarized_two_qty");
				refresh_field("operational_plan_machinery_detail_summarized_one_cost");
				refresh_field("operational_plan_machinery_detail_summarized_two_cost");

			})
		}

		//Script to populate child tables for manpower
		if (taskParent) {
			frappe.call({
				method: "erpnext.manpower_populate_api.get_manpower_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {
					var entry = frm.add_child("manpower1");
					entry.id_map = e.id_map;
					entry.job_title = e.job_title;
					entry.activity = taskParent;
					entry.subject = subject;
					entry.qty = e.qty * planned_qty;
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.labor_no = parseFloat(e.qty);
					entry.li_permanent = e.li_permanent;
					entry.hourly_cost = e.hourly_cost;
					grand_total_cost_for_manpower += entry.qty * entry.hourly_cost;
				console.log("graaaaaaaaaaaaaaaaaaaaaaaaaand total for manpower beforee:", entry.qty, entry.hourly_cost)
					number_of_items_for_manpower += 1;
					sum_of_unit_rate_for_manpower += entry.hourly_cost;
					entry.total_hourly_cost = entry.qty * entry.hourly_cost;



					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.act_quantity = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							entry.mp_hour = (entry.uf * entry.li_permanent * entry.mp_number * entry.act_quantity) / entry.productivity;
							entry.act_quantity = entry.act_quantity;


							frm.refresh_field("manpower1")

						}
					})

					if (!frm.doc.manpower_detail_summarized_by_month_section_a) {
						console.log("first man")
						var manpower_exist1 = false;
						var manpower_exist2 = false;
						console.log("eeeeeee2", e);
						$.each(frm.doc.operational_plan_detail_one, function(index, row) {
							console.log("the code that is not executing")
							if (row.activity === e.parent) {
								manpower_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});

						$.each(frm.doc.operational_plan_detail_one, function(index, row) {
							if (row.activity === e.parent) {
								manpower_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});
						console.log("manpower exist 1", manpower_exist1);
						console.log("manpower exist 2", manpower_exist2);


						if (!manpower_exist1) {
							var newEntrySummerized_section_a = frm.add_child("manpower_detail_summarized_by_month_section_a");
							newEntrySummerized_section_a.id_map = e.id_map;
							newEntrySummerized_section_a.activity = e.parent;

							newEntrySummerized_section_a.job_title = e.job_title;


							var newEntrySummerized_section_a_qty = frm.add_child("operational_plan_manpower_detail_summarized_one_qty"); var newEntrySummerized_section_b_qty = frm.add_child("operational_plan_manpower_detail_summarized_two_qty");

							newEntrySummerized_section_a_qty.id_map = e.id_map;
							newEntrySummerized_section_b_qty.id_map = e.id_map;

							newEntrySummerized_section_a_qty.activity = e.parent;
							newEntrySummerized_section_b_qty.activity = e.parent;


							newEntrySummerized_section_a_qty.job_title = e.job_title;
							newEntrySummerized_section_b_qty.job_title = e.job_title;


							var newEntrySummerized_section_a_cost = frm.add_child("operational_plan_manpower_detail_summarized_one_cost"); var newEntrySummerized_section_b_cost = frm.add_child("operational_plan_manpower_detail_summarized_two_cost");

							newEntrySummerized_section_a_cost.id_map = e.id_map;
							newEntrySummerized_section_b_cost.id_map = e.id_map;

							newEntrySummerized_section_a_cost.activity = e.parent;
							newEntrySummerized_section_b_cost.activity = e.parent;


							newEntrySummerized_section_a_cost.job_title = e.job_title;
							newEntrySummerized_section_b_cost.job_title = e.job_title;

						}

						if (!manpower_exist2) {
							var newEntrySummerized_section_b = frm.add_child("manpower_detail_summarized_by_month_section_b");
							newEntrySummerized_section_b.id_map = e.id_map;
							newEntrySummerized_section_b.activity = e.parent;

							newEntrySummerized_section_b.job_title = e.job_title;
						}


						var entryMPSummerized = frm.add_child("manpower_detail_summerized");
						entryMPSummerized.id_map = e.id_map;
						entryMPSummerized.job_title = e.job_title;
						entryMPSummerized.qty = e.qty * planned_qty;
						entryMPSummerized.uf = e.uf;
						entryMPSummerized.efficency = e.efficency;
						entryMPSummerized.hourly_cost = e.hourly_cost;
						entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
					}
					else {

						var manpower_exist = false;


						$.each(frm.doc.manpower_detail_summarized_by_month_section_a, function(index, row) {
							if (row.id_map === e.id_map) {
								manpower_exist = true;
								return false; // Exit the loop if manpower entry is found
							}
						});

						if (!manpower_exist) {

							var manpower_exist1 = false;
							var manpower_exist2 = false;
							console.log("eeeeeee2", e);
							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									manpower_exist1 = true;
									return false; // Exit the loop if activity is found
								}
							});

							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									manpower_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});

							if (!manpower_exist1) {
								var newEntrySummerized_section_a = frm.add_child("manpower_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.id_map = e.id_map;
								newEntrySummerized_section_a.activity = e.parent;

								newEntrySummerized_section_a.job_title = e.job_title;


								var newEntrySummerized_section_a_qty = frm.add_child("operational_plan_manpower_detail_summarized_one_qty"); var newEntrySummerized_section_b_qty = frm.add_child("operational_plan_manpower_detail_summarized_two_qty");

								newEntrySummerized_section_a_qty.id_map = e.id_map;
								newEntrySummerized_section_b_qty.id_map = e.id_map;

								newEntrySummerized_section_a_qty.activity = e.parent;
								newEntrySummerized_section_b_qty.activity = e.parent;


								newEntrySummerized_section_a_qty.job_title = e.job_title;
								newEntrySummerized_section_b_qty.job_title = e.job_title;


								var newEntrySummerized_section_a_cost = frm.add_child("operational_plan_manpower_detail_summarized_one_cost"); var newEntrySummerized_section_b_cost = frm.add_child("operational_plan_manpower_detail_summarized_two_cost");

								newEntrySummerized_section_a_cost.id_map = e.id_map;
								newEntrySummerized_section_b_cost.id_map = e.id_map;

								newEntrySummerized_section_a_cost.activity = e.parent;
								newEntrySummerized_section_b_cost.activity = e.parent;


								newEntrySummerized_section_a_cost.job_title = e.job_title;
								newEntrySummerized_section_b_cost.job_title = e.job_title;
							}

							if (!manpower_exist2) {
								var newEntrySummerized_section_b = frm.add_child("manpower_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.id_map = e.id_map;
								newEntrySummerized_section_b.activity = e.parent;

								newEntrySummerized_section_b.job_title = e.job_title;
							}
						} else {
							var entryMPSummerized = frm.add_child("manpower_detail_summerized");
							entryMPSummerized.id_map = e.id_map;
							entryMPSummerized.job_title = e.job_title;
							entryMPSummerized.qty = e.qty * planned_qty;
							entryMPSummerized.uf = e.uf;
							entryMPSummerized.efficency = e.efficency;
							entryMPSummerized.hourly_cost = e.hourly_cost;
							entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
						}
					}

				})


				frm.doc.man_power_total_cost = grand_total_cost_for_manpower;
				console.log("graaaaaaaaaaaaaaaaaaaaaaaaaand total for manpower:", grand_total_cost_for_manpower)
				frm.doc.man_power_unit_rate = (sum_of_unit_rate_for_manpower / number_of_items_for_manpower);

				refresh_field("manpower1");
				refresh_field("man_power_total_cost");
				refresh_field("man_power_unit_rate");
				refresh_field("manpower_detail_summerized");
				refresh_field("manpower_detail_summarized_by_month_section_a");
				refresh_field("manpower_detail_summarized_by_month_section_b");
				refresh_field("operational_plan_manpower_detail_summarized_one_qty");
				refresh_field("operational_plan_manpower_detail_summarized_two_qty");
				refresh_field("operational_plan_manpower_detail_summarized_one_cost");
				refresh_field("operational_plan_manpower_detail_summarized_two_cost");
			})
		}



		//Script to populate child tables for material
		if (taskParent) {
			console.log("we are heeeeeeeeeeeeeeeeeeeeeeeer", taskParent)
			frappe.call({

				method: "frappe.client.get_list",
				args: {
					doctype: 'Material DetailARRCA',
					filters: {
						'parent': taskParent
					},
					fields: ['*']

				}, callback: async function(r) {
					console.log("meeeeeeeeeeeeeeeeeesage", r.message)
					$.each(r.message, function(_i, e) {
						console.log("material eeeeeeeeeeeeeeeeeeeee", e)

						var entry = frm.add_child("material1");
						entry.id_mat = e.id_mat;
						entry.item1 = e.item1;
						entry.activity = taskParent;
						entry.subject = subject;
						entry.uom = e.uom;
						entry.qty = e.qaty;


						//fetching the quantity from the database
						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Task',
								filters: {
									'name': e.parent,
								},
								fields: ["quantity"],
							},
							callback: async function(response) {
								console.log("Response ", response.message[0].quantity)
								entry.task_qty = response.message[0].quantity;
								entry.uf = e.uf;
								entry.efficency = e.efficency;
								entry.unit_price = e.unit_price;

								entry.total_cost = entry.qty * entry.unit_price;
								entry.material_qty = entry.qty * entry.task_qty;
								entry.material_no = entry.qty * entry.task_qty;
								grand_total_cost_for_material += entry.qty * entry.unit_price;
								frm.doc.material_total_cost = grand_total_cost_for_machinary;
								console.log("graaaaaaaaaaaaaaaaaaaaaaaaaaand machinery", grand_total_cost_for_material)
								frm.refresh_field("material_total_cost")

								frm.refresh_field("material1")

							}
						})

						if (!frm.doc.material_detail_summarized_by_month_section_a) {

							var entryMaterialSummerized = frm.add_child("material_detail_summerized");
							entryMaterialSummerized.id_mat = e.id_mat;
							entryMaterialSummerized.item1 = e.item1;
							entryMaterialSummerized.uom = e.uom;
							entryMaterialSummerized.qty = e.qty * planned_qty;
							entryMaterialSummerized.uf = e.uf;
							entryMaterialSummerized.efficency = e.efficency;
							entryMaterialSummerized.unit_price = e.unit_price;
							entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;

							var material_exist1 = false;
							var material_exist2 = false;

							console.log("eeeeeeeeee material", e);

							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									material_exist1 = true;
									return false; // Exit the loop if activity is found
								}
							});

							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									material_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});

							console.log(" material exist 1", material_exist1);
							console.log(" material exist 2", material_exist2);


							if (!material_exist1) {
								var newEntrySummerized_section_a = frm.add_child("material_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.id_mat = e.id_mat;
								newEntrySummerized_section_a.unit = e.uom;
								newEntrySummerized_section_a.item = e.item1;



								var newEntrySummerized_section_a_qty = frm.add_child("operational_plan_material_detail_summarized_one_qty"); var newEntrySummerized_section_b_qty = frm.add_child("operational_plan_material_detail_summarized_two_qty");

								newEntrySummerized_section_a_qty.id_mat = e.id_mat;
								newEntrySummerized_section_b_qty.id_mat = e.id_mat;

								newEntrySummerized_section_a_qty.activity = e.parent;
								newEntrySummerized_section_b_qty.activity = e.parent;


								newEntrySummerized_section_a_qty.item = e.item1;
								newEntrySummerized_section_b_qty.item = e.item1;

								newEntrySummerized_section_a_qty.unit = e.uom;
								newEntrySummerized_section_b_qty.unit = e.uom;


								var newEntrySummerized_section_a_cost = frm.add_child("operational_plan_material_detail_summarized_one_cost"); var newEntrySummerized_section_b_cost = frm.add_child("operational_plan_material_detail_summarized_two_cost");

								newEntrySummerized_section_a_cost.id_mat = e.id_mat;
								newEntrySummerized_section_b_cost.id_mat = e.id_mat;

								newEntrySummerized_section_a_cost.activity = e.parent;
								newEntrySummerized_section_b_cost.activity = e.parent;


								newEntrySummerized_section_a_cost.item = e.item1;
								newEntrySummerized_section_b_cost.item = e.item1;

								newEntrySummerized_section_a_cost.unit = e.uom;
								newEntrySummerized_section_b_cost.unit = e.uom;
							}

							if (!material_exist2) {
								var newEntrySummerized_section_b = frm.add_child("material_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.id_mat = e.id_mat;
								newEntrySummerized_section_b.unit = e.uom;
								newEntrySummerized_section_b.item = e.item1;
							}
						}
						else {

							var material_exist = false;


							$.each(frm.doc.material_detail_summarized_by_month_section_a, function(index, row) {
								if (row.id_mat === e.id_mat) {
									material_exist = true;
									return false; // Exit the loop if manpower entry is found
								}
							});

							if (!material_exist) {
								var material_exist1 = false;
								var material_exist2 = false;

								$.each(frm.doc.operational_plan_detail_one, function(index, row) {
									if (row.activity === e.parent) {
										material_exist1 = true;
										return false; // Exit the loop if activity is found
									}
								});

								$.each(frm.doc.operational_plan_detail_one, function(index, row) {
									if (row.activity === e.parent) {
										material_exist2 = true;
										return false; // Exit the loop if activity is found
									}
								});

								if (!material_exist1) {
									var newEntrySummerized_section_a = frm.add_child("material_detail_summarized_by_month_section_a");
									newEntrySummerized_section_a.id_mat = e.id_mat;
									newEntrySummerized_section_a.unit = e.uom;
									newEntrySummerized_section_a.item = e.item1;



									var newEntrySummerized_section_a_qty = frm.add_child("operational_plan_material_detail_summarized_one_qty"); var newEntrySummerized_section_b_qty = frm.add_child("operational_plan_material_detail_summarized_two_qty");

									newEntrySummerized_section_a_qty.id_mat = e.id_mat;
									newEntrySummerized_section_b_qty.id_mat = e.id_mat;

									newEntrySummerized_section_a_qty.activity = e.parent;
									newEntrySummerized_section_b_qty.activity = e.parent;


									newEntrySummerized_section_a_qty.item = e.item1;
									newEntrySummerized_section_b_qty.item = e.item1;

									newEntrySummerized_section_a_qty.unit = e.uom;
									newEntrySummerized_section_b_qty.unit = e.uom;


									var newEntrySummerized_section_a_cost = frm.add_child("operational_plan_material_detail_summarized_one_cost"); var newEntrySummerized_section_b_cost = frm.add_child("operational_plan_material_detail_summarized_two_cost");

									newEntrySummerized_section_a_cost.id_mat = e.id_mat;
									newEntrySummerized_section_b_cost.id_mat = e.id_mat;

									newEntrySummerized_section_a_cost.activity = e.parent;
									newEntrySummerized_section_b_cost.activity = e.parent;


									newEntrySummerized_section_a_cost.item = e.item1;
									newEntrySummerized_section_b_cost.item = e.item1;

									newEntrySummerized_section_a_cost.unit = e.uom;
									newEntrySummerized_section_b_cost.unit = e.uom;

								}

								if (!material_exist2) {
									var newEntrySummerized_section_b = frm.add_child("material_detail_summarized_by_month_section_b");
									newEntrySummerized_section_b.id_mat = e.id_mat;
									newEntrySummerized_section_b.unit = e.uom;
									newEntrySummerized_section_b.item = e.item1;
								}
							} else {
								var entryMaterialSummerized = frm.add_child("material_detail_summerized");
								entryMaterialSummerized.id_mat = e.id_mat;
								entryMaterialSummerized.item1 = e.item1;
								entryMaterialSummerized.uom = e.uom;
								entryMaterialSummerized.qty = e.qty * planned_qty;
								entryMaterialSummerized.uf = e.uf;
								entryMaterialSummerized.efficency = e.efficency;
								entryMaterialSummerized.unit_price = e.unit_price;
								entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;
							}
						}
					})

					frm.doc.material_total_cost = grand_total_cost_for_material;
					//frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

					refresh_field("material1");
					refresh_field("material_total_cost");
					refresh_field("material_detail_summerized");
					refresh_field("material_detail_summarized_by_month_section_a");
					refresh_field("material_detail_summarized_by_month_section_b");
					refresh_field("operational_plan_material_detail_summarized_one_qty");
					refresh_field("operational_plan_material_detail_summarized_two_qty");
					refresh_field("operational_plan_material_detail_summarized_one_cost");
					refresh_field("operational_plan_material_detail_summarized_two_cost");
				}
			})
		}
		
		//Script to populate child tables for task detail by month
		if (taskParent) {
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Task",
					filters: {
						name: taskParent
					},
					fields: "*"
				},
				callback: function(response) {
					console.log("The response of API from task list is:", response);
					if (response.message && Array.isArray(response.message)) {
						const tasks = response.message;
						tasks.forEach(function(e) {
							console.log("Processing task:", e);
			
							// Get Early Start (es) directly from frm.doc.critical_path_table for the current task
							let earlyStart = null;

									// Convert critical_path_table to an array, even if it's undefined or an object
									const criticalPathEntries = Array.isArray(frm.doc.critical_path_table)
									? frm.doc.critical_path_table
									: frm.doc.critical_path_table ? [frm.doc.critical_path_table] : [];

								// Find the matching activity in the critical path table
								const criticalPathEntry = criticalPathEntries.find(function(entry) {
									return entry.activity === e.name; // Match activity name
								});

								// If a matching entry is found, set earlyStart
								if (criticalPathEntry) {
									earlyStart = criticalPathEntry.es; // Set early start date if found
								}

			
							// Fetch holidays from the Operational Plan
							let holidays = getHolidaysFromOperationalPlan(frm);
			
							// Populate operational_plan_detail_one
							var entryOne = frm.add_child("operational_plan_detail_one");
							entryOne.activity = e.name;
							entryOne.activity_name = e.task_specific_name;
							entryOne.duration = e.duration_in_days;
							entryOne.uom = e.unit;
							entryOne.productivity = e.productivity;
			
							let remainingPlanned = AutoCalculateMonthValueOne(frm, entryOne, planned_qty, e.productivity, earlyStart, holidays);
							console.log("Remaining Planned after First Half Allocation:", remainingPlanned);
			
							// Populate operational_plan_detail_two
							var entryTwo = frm.add_child("operational_plan_detail_two");
							entryTwo.activity = e.name;
							entryTwo.activity_name = e.task_specific_name;
							entryTwo.duration = e.duration_in_days;
							entryTwo.uom = e.unit;
							remainingPlanned = AutoCalculateMonthValueTwo(frm, entryTwo, remainingPlanned, e.productivity, earlyStart, holidays);
			
							// Refresh both fields after all rows are added
							frm.refresh_field("operational_plan_detail_one");
							frm.refresh_field("operational_plan_detail_two");
						});
					}
				}
			});

		}		


	});
}

// Function to get holidays from Operational Plan
function getHolidaysFromOperationalPlan(frm) {
    const holidays = frm.doc.holiday || []; // Assuming holiday list is linked to the operational plan
    return holidays;
}

// Function to distribute planned quantity for the first table (first half of the year)
// Function to distribute planned quantity for the first table (September to February period)
function AutoCalculateMonthValueOne(frm, child, planned, productivity, earlyStart, holidays) {
    console.log("AutoCalculateMonthValueOne function called");
    let remainingPlanned = planned;
    const workingHoursPerDay = 8;
    const daysProductivity = productivity * workingHoursPerDay;
	const workingDaysByMonth = getWorkingDaysFromDoc(frm) || {}; // Default to empty object if undefined

    // Months in the first half of the assignment period
    const months = ["sep", "oct", "nov", "dec", "jan", "feb"];
    
    // Determine if there's a year transition based on earlyStart month
    const startDate = new Date(earlyStart);
    const startMonth = startDate.getMonth(); // 0 for Jan, 8 for Sep, etc.
    const startYear = startDate.getFullYear();

    // Check if startMonth is September (8) or later, to decide on year transition
    const firstHalfYear = startYear;
    const secondHalfYear = (startMonth >= 8) ? startYear + 1 : startYear;

    months.forEach((month, index) => {
        const monthField = `m_${index + 1}`;
        
        // Assign year based on month position
        const currentYear = (["sep", "oct", "nov", "dec"].includes(month)) ? firstHalfYear : secondHalfYear;

        const workingDays = calculateWorkingDaysForMonth(
            workingDaysByMonth[month] || 0,
            holidays,
            earlyStart,
            month,
            currentYear  // Pass the dynamically calculated year
        );

        const monthlyAllocation = daysProductivity * workingDays;

        // Distribute based on remaining planned quantity
        const allocatedPlanned = Math.min(remainingPlanned, monthlyAllocation);
        child[monthField] = allocatedPlanned;

        console.log(`Remaining planned after ${month} ${currentYear}:`, remainingPlanned); // Log remaining quantity each month
        remainingPlanned -= allocatedPlanned;
    });

    child.planned = planned - remainingPlanned;
    frm.refresh_field("operational_plan_detail_one");

    return Math.max(remainingPlanned, 0);
}

// Function to distribute planned quantity for the second table (March to August period)
function AutoCalculateMonthValueTwo(frm, child, remainingPlanned, productivity, earlyStart, holidays) {
    console.log("AutoCalculateMonthValueTwo function called for operational_plan_detail_two");
    const workingHoursPerDay = 8;
    const daysProductivity = productivity * workingHoursPerDay;
    child.planned = remainingPlanned;
	const workingDaysByMonth = getWorkingDaysFromDoc(frm) || {}; // Default to empty object if undefined

    const months = ["mar", "apr", "may", "jun", "jul", "aug"];
    
    const startDate = new Date(earlyStart);
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();

    // Determine the assignment year for the second half of the period (March-August)
    const secondHalfYear = (startMonth >= 8) ? startYear + 1 : startYear;

    months.forEach((month, index) => {
        const monthField = `m_${index + 7}`;

        const workingDays = calculateWorkingDaysForMonth(
			workingDaysByMonth[month] || 0,
            holidays,
            earlyStart,
            month,
            secondHalfYear  // Pass the dynamically calculated year for second half
        );

        const monthlyAllocation = daysProductivity * workingDays;

        // Distribute based on remaining planned quantity
        const allocatedPlanned = Math.min(remainingPlanned, monthlyAllocation);
        console.log(`Allocating ${allocatedPlanned} to ${monthField} for ${month} ${secondHalfYear}`);
        child[monthField] = allocatedPlanned;

        remainingPlanned -= allocatedPlanned;
    });

    frm.refresh_field("operational_plan_detail_two");

    return Math.max(remainingPlanned, 0);
}


function calculateWorkingDaysForMonth(workingDays, holidays, earlyStart, month, year) {
    let adjustedWorkingDays = workingDays; // Start with the initial working days in the month
    console.log("________________________________");
    console.log("Month", month);
    console.log("Adjusted working days", adjustedWorkingDays);
    console.log("Early start", earlyStart);
    console.log("Holidays", holidays);

    // Mapping of abbreviated month names to month indices (0-indexed)
    const monthAbbreviations = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11
    };

    // Retrieve the month index from the abbreviation
    let monthIndex = monthAbbreviations[month.toLowerCase()];

    if (monthIndex === undefined) {
        console.log("Invalid month abbreviation:", month);
        return;
    } else {
        console.log("Date month", monthIndex); // Corrected to output the month index
    }

    // Parse the early start date to get the start month and year
    const earlyStartDate = new Date(earlyStart);
    const startMonth = earlyStartDate.getMonth(); // 0-indexed month of earlyStart
    const startYear = earlyStartDate.getFullYear(); // Full year from earlyStart

    console.log("Early start year:", startYear);
    console.log("Early start month:", startMonth + 1); // Log the month in 1-indexed format

    // Skip months before the earlyStart month in the same year, or in a previous year
    if (year < startYear || (year === startYear && monthIndex < startMonth)) {
        console.log(`Skipping month: ${month} of ${year} because it's before the earlyStart month and year.`);
        adjustedWorkingDays = 0;  // Set to 0 for months before earlyStart
    }

    // Adjust working days based on early start and holidays
    if (year > startYear || (year === startYear && monthIndex >= startMonth)) {
        console.log("Processing for month:", month, "of year:", year);

        // For months where the early start is inside the same month and year
        if (monthIndex === startMonth && year === startYear) {
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            const remainingDays = daysInMonth - earlyStartDate.getDate() + 1;  // Remaining days from earlyStart onward
            adjustedWorkingDays = remainingDays; // Adjust to the working days remaining in the month
            console.log(`Adjusting for early start in the month: ${month}`);
            console.log(`Remaining working days: ${adjustedWorkingDays}`);
        }

        // Subtract holidays from working days by checking if any holiday range overlaps with the month and year
        holidays.forEach(holiday => {
            // Parse the from_date and to_date of the holiday range
            const holidayFromDate = new Date(holiday.from_date);
            const holidayToDate = new Date(holiday.to_date);
            
            // Check if the holiday range falls within the target year and month
            if ((holidayFromDate.getFullYear() === year || holidayToDate.getFullYear() === year)) {
                // Check if the holiday is within the same month and year as the current month
                let currentHolidayDate = new Date(holidayFromDate);
                while (currentHolidayDate <= holidayToDate) {
                    if (currentHolidayDate.getFullYear() === year && currentHolidayDate.getMonth() === monthIndex) {
                        adjustedWorkingDays--; // Subtract one day for each day in the holiday range within the month
                        console.log("Holiday from", holiday.from_date, "to", holiday.to_date, "subtracting 1 day");
                    }
                    // Move to the next day in the range
                    currentHolidayDate.setDate(currentHolidayDate.getDate() + 1);
                }
            }
        });
    }

    console.log("Adjusted working days for", month, "of year", year, ":", adjustedWorkingDays);
    console.log("________________________________");

    return adjustedWorkingDays;
}


// Function to access working days directly from the linked field in frm.doc.no
function getWorkingDaysFromDoc(frm) {
    console.log("the document before accessed is ", frm.doc.no);

    // Check if frm.doc.no exists and is an array or object
    if (!frm.doc.no || !Array.isArray(frm.doc.no) || frm.doc.no.length === 0) {
        console.warn("No working days found. Returning default values.");
        return {
            sep: 0,
            oct: 0,
            nov: 0,
            dec: 0,
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            july: 0,
            aug: 0
        };
    }

    // Access the first element if it exists
    const workingDays = frm.doc.no[0] || {};

    return {
        sep: workingDays.sep || 0,
        oct: workingDays.oct || 0,
        nov: workingDays.nov || 0,
        dec: workingDays.dec || 0,
        jan: workingDays.jan || 0,
        feb: workingDays.feb || 0,
        mar: workingDays.mar || 0,
        apr: workingDays.apr || 0,
        may: workingDays.may || 0,
        jun: workingDays.jun || 0,
        july: workingDays.july || 0,
        aug: workingDays.aug || 0
    };
}
// Main trigger function in the Operational Plan Detail form
frappe.ui.form.on("Operational Plan Detail", {
    activity: function(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        let planned = row.planned || 0; // Ensure planned is a number
        let productivity = row.productivity || 0; // Ensure productivity is a number
        console.log("Productivity and Planned at Start: ", planned, productivity);

        // Call the first half-year allocation function and capture the remaining planned quantity
        // let remainingPlanned = AutoCalculateMonthValueOne(frm, planned, productivity);
        
        // console.log("Remaining Planned after First Half Allocation: ", remainingPlanned);

        // // Pass the remaining planned quantity to the second half-year allocation function
        // remainingPlanned = AutoCalculateMonthValueTwo(frm, remainingPlanned, productivity);

        // console.log("Remaining Planned after Second Half Allocation: ", remainingPlanned);
    },
});




// frappe.ui.form.on("Operational Plan Detail One", {
// 	planned: function(frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		frm.refresh_field("planned");
// 		AutoCalculateMonthValueOne(d.doctype, d.name, d.planned);
// 	}
// });

// frappe.ui.form.on("Operational Plan Detail Two", {
// 	planned: function(frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		frm.refresh_field("planned");
// 		AutoCalculateMonthValueTwo(d.doctype, d.name, d.planned);
// 	}
// });


frappe.ui.form.on('Operational Plan Detail One', {
	m_1: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "1");
		calculateMaterialValues(frm, cdt, cdn, "1");
		calculateManpowerValues(frm, cdt, cdn, "1");
	},
	m_2: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "2");
		calculateMaterialValues(frm, cdt, cdn, "2");
		calculateManpowerValues(frm, cdt, cdn, "2");
	},
	m_3: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "3");
		calculateMaterialValues(frm, cdt, cdn, "3");
		calculateManpowerValues(frm, cdt, cdn, "3");
	},
	m_4: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "4");
		calculateMaterialValues(frm, cdt, cdn, "4");
		calculateManpowerValues(frm, cdt, cdn, "4");
	},
	m_5: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "5");
		calculateMaterialValues(frm, cdt, cdn, "5");
		calculateManpowerValues(frm, cdt, cdn, "5");
	},
	m_6: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "6");
		calculateMaterialValues(frm, cdt, cdn, "6");
		calculateManpowerValues(frm, cdt, cdn, "6");
	},
});

frappe.ui.form.on('Operational Plan', {
	before_save: function(frm, cdt, cdn) {
		console.log("i am going to save it")
		calculateMachineryValues(frm, cdt, cdn, "1");
		calculateMaterialValues(frm, cdt, cdn, "1");
		calculateManpowerValues(frm, cdt, cdn, "1");

		calculateMachineryValues(frm, cdt, cdn, "2");
		calculateMaterialValues(frm, cdt, cdn, "2");
		calculateManpowerValues(frm, cdt, cdn, "2");

		calculateMachineryValues(frm, cdt, cdn, "3");
		calculateMaterialValues(frm, cdt, cdn, "3");
		calculateManpowerValues(frm, cdt, cdn, "3");

		calculateMachineryValues(frm, cdt, cdn, "4");
		calculateMaterialValues(frm, cdt, cdn, "4");
		calculateManpowerValues(frm, cdt, cdn, "4");

		calculateMachineryValues(frm, cdt, cdn, "5");
		calculateMaterialValues(frm, cdt, cdn, "5");
		calculateManpowerValues(frm, cdt, cdn, "5");

		calculateMachineryValues(frm, cdt, cdn, "6");
		calculateMaterialValues(frm, cdt, cdn, "6");
		calculateManpowerValues(frm, cdt, cdn, "6");
	},
});

frappe.ui.form.on('Operational Plan Detail Two', {
	m_7: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "7");
		calculateMaterialValuesB(frm, cdt, cdn, "7");
		calculateManpowerValuesB(frm, cdt, cdn, "7");
	},
	m_8: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "8");
		calculateMaterialValuesB(frm, cdt, cdn, "8");
		calculateManpowerValuesB(frm, cdt, cdn, "8");
	},
	m_9: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "9");
		calculateMaterialValuesB(frm, cdt, cdn, "9");
		calculateManpowerValuesB(frm, cdt, cdn, "9");
	},
	m_10: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "10");
		calculateMaterialValuesB(frm, cdt, cdn, "10");
		calculateManpowerValuesB(frm, cdt, cdn, "10");
	},
	m_11: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "11");
		calculateMaterialValuesB(frm, cdt, cdn, "11");
		calculateManpowerValuesB(frm, cdt, cdn, "11");
	},
	m_12: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "12");
		calculateMaterialValuesB(frm, cdt, cdn, "12");
		calculateManpowerValuesB(frm, cdt, cdn, "12");
	},
});

frappe.ui.form.on('Operational Plan', {
	before_save: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "7");
		calculateMaterialValuesB(frm, cdt, cdn, "7");
		calculateManpowerValuesB(frm, cdt, cdn, "7");

		calculateMachineryValuesB(frm, cdt, cdn, "8");
		calculateMaterialValuesB(frm, cdt, cdn, "8");
		calculateManpowerValuesB(frm, cdt, cdn, "8");

		calculateMachineryValuesB(frm, cdt, cdn, "9");
		calculateMaterialValuesB(frm, cdt, cdn, "9");
		calculateManpowerValuesB(frm, cdt, cdn, "9");

		calculateMachineryValuesB(frm, cdt, cdn, "10");
		calculateMaterialValuesB(frm, cdt, cdn, "10");
		calculateManpowerValuesB(frm, cdt, cdn, "10");

		calculateMachineryValuesB(frm, cdt, cdn, "11");
		calculateMaterialValuesB(frm, cdt, cdn, "11");
		calculateManpowerValuesB(frm, cdt, cdn, "11");

		calculateMachineryValuesB(frm, cdt, cdn, "12");
		calculateMaterialValuesB(frm, cdt, cdn, "12");
		calculateManpowerValuesB(frm, cdt, cdn, "12");
	},
});

function calculateMaterialValues(frm, cdt, cdn, m) {
	var materialAggregatedValues = {};
	var materialAggregatedValuesCost = {};

	// Iterate through the material1 array
	for (var i = 0; i < frm.doc.material1.length; i++) {
		var materialItem = frm.doc.material1[i];
		console.log("material item", materialItem);
		var itemName = materialItem.item1;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one[j];
			if (monthData.activity == materialItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("month quantity", activityMonthQuantity);

		if (materialAggregatedValues[itemName]) {
			materialAggregatedValues[itemName] += activityMonthQuantity * materialItem.qty;
		} else {
			materialAggregatedValues[itemName] = activityMonthQuantity * materialItem.qty;
		}

		if (materialAggregatedValuesCost[itemName]) {
			materialAggregatedValuesCost[itemName] += activityMonthQuantity * materialItem.qty * materialItem.unit_price;
		} else {
			materialAggregatedValuesCost[itemName] = activityMonthQuantity * materialItem.qty * materialItem.unit_price;
		}
	}
	console.log("material aggregate", materialAggregatedValues);

	for (var i = 0; i < frm.doc.material_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.material_detail_summarized_by_month_section_a[i];
		var currentItemQty = frm.doc.operational_plan_material_detail_summarized_one_qty[i];
		var currentItemCost = frm.doc.operational_plan_material_detail_summarized_one_cost[i];

		console.log("cureiejireb", currentItem)
		var itemName = currentItem.item;
		var aggregatedValueForType = materialAggregatedValues[itemName];

		if (aggregatedValueForType) {

			var month_name =
				m === "1" ? "jan" :
					m === "2" ? "feb" :
						m === "3" ? "mar" :
							m === "4" ? "apr" :
								m === "5" ? "may" :
									m === "6" ? "jun" :
										m === "7" ? "july" :
											m === "8" ? "aug" :
												m === "9" ? "sep" :
													m === "10" ? "oct" :
														m === "11" ? "nov" :
															m === "12" ? "dec" :
																null;
			console.log("silkshn newa", materialAggregatedValuesCost)
			currentItem["op_m_m" + m] = aggregatedValueForType;
			currentItemQty["op_m_m" + m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			currentItemCost["op_m_m" + m] = materialAggregatedValuesCost[itemName]


		} else {
			currentItem["op_m_m" + m] = 0;
			currentItemQty["op_m_m" + m] = 0;
			currentItemCost["op_m_m" + m] = 0;
		}
	}

	frm.refresh_field("material_detail_summarized_by_month_section_a");
	frm.refresh_field("operational_plan_material_detail_summarized_one_qty");
	frm.refresh_field("operational_plan_material_detail_summarized_one_cost");


}
function calculateMaterialValuesB(frm, cdt, cdn, m) {
	var materialAggregatedValues = {};
	var materialAggregatedValuesCost = {};


	// Iterate through the material1 array
	for (var i = 0; i < frm.doc.material1.length; i++) {
		var materialItem = frm.doc.material1[i];
		console.log("material item", materialItem);
		var itemName = materialItem.item1;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two[j];


			if (monthData.activity == materialItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("month quantity", activityMonthQuantity);

		if (materialAggregatedValues[itemName]) {
			materialAggregatedValues[itemName] += activityMonthQuantity * materialItem.qty;
		} else {
			materialAggregatedValues[itemName] = activityMonthQuantity * materialItem.qty;
		}

		if (materialAggregatedValuesCost[itemName]) {
			materialAggregatedValuesCost[itemName] += activityMonthQuantity * materialItem.qty * materialItem.unit_price;
		} else {
			materialAggregatedValuesCost[itemName] = activityMonthQuantity * materialItem.qty * materialItem.unit_price;
		}

	}
	console.log("material aggregate", materialAggregatedValues);

	for (var i = 0; i < frm.doc.material_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.material_detail_summarized_by_month_section_b[i];
		var currentItemQty = frm.doc.operational_plan_material_detail_summarized_two_qty[i];
		var currentItemCost = frm.doc.operational_plan_material_detail_summarized_two_cost[i];
		console.log("cureiejireb", currentItem)
		var itemName = currentItem.item;
		var aggregatedValueForType = materialAggregatedValues[itemName];

		if (aggregatedValueForType) {

			var month_name =
				m === "1" ? "jan" :
					m === "2" ? "feb" :
						m === "3" ? "mar" :
							m === "4" ? "apr" :
								m === "5" ? "may" :
									m === "6" ? "jun" :
										m === "7" ? "july" :
											m === "8" ? "aug" :
												m === "9" ? "sep" :
													m === "10" ? "oct" :
														m === "11" ? "nov" :
															m === "12" ? "dec" :
																null;
			currentItem["op_m_m" + m] = aggregatedValueForType;
			currentItemQty["op_m_m" + m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			currentItemCost["op_m_m" + m] = materialAggregatedValuesCost[itemName]
		} else {
			currentItem["op_m_m" + m] = 0;
			currentItemQty["op_m_m" + m] = 0;
			currentItemCost["op_m_m" + m] = 0;
		}
	}

	frm.refresh_field("material_detail_summarized_by_month_section_b");
	frm.refresh_field("operational_plan_material_detail_summarized_two_qty")
	frm.refresh_field("operational_plan_material_detail_summarized_two_cost");
}

function calculateManpowerValues(frm, cdt, cdn, m) {
	var manpowerAggregatedValues = {};
	var manpowerAggregatedValuesCost = {};

	// Iterate through the manpower array
	for (var i = 0; i < frm.doc.manpower1.length; i++) {
		var manpowerItem = frm.doc.manpower1[i];
		console.log("manp ower item", manpowerItem)
		var job_title = manpowerItem.job_title;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one[j];
			if (monthData.activity == manpowerItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("monthe qunttity", activityMonthQuantity)

		if (manpowerAggregatedValues[job_title]) {
			manpowerAggregatedValues[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		} else {
			manpowerAggregatedValues[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		}

		if (manpowerAggregatedValuesCost[job_title]) {
			manpowerAggregatedValuesCost[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity * manpowerItem.hourly_cost;
		} else {
			manpowerAggregatedValuesCost[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity * manpowerItem.hourly_cost;
		}
	}
	console.log("manppppppppp aggrirgate", manpowerAggregatedValues);

	for (var i = 0; i < frm.doc.manpower_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.manpower_detail_summarized_by_month_section_a[i];
		var currentItemQty = frm.doc.operational_plan_manpower_detail_summarized_one_qty[i];
		var currentItemCost = frm.doc.operational_plan_manpower_detail_summarized_one_cost[i];

		var job_title = currentItem.job_title;
		var aggregatedValueForType = manpowerAggregatedValues[job_title];

		if (aggregatedValueForType) {
			var month_name =
				m === "1" ? "jan" :
					m === "2" ? "feb" :
						m === "3" ? "mar" :
							m === "4" ? "apr" :
								m === "5" ? "may" :
									m === "6" ? "jun" :
										m === "7" ? "july" :
											m === "8" ? "aug" :
												m === "9" ? "sep" :
													m === "10" ? "oct" :
														m === "11" ? "nov" :
															m === "12" ? "dec" :
																null;
			console.log("silke", month_name, manpowerAggregatedValuesCost);
			currentItem["op_mp_m" + m] = aggregatedValueForType;
			currentItemQty["op_mp_m" + m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			currentItemCost["op_mp_m" + m] = manpowerAggregatedValuesCost[job_title]
		} else {
			currentItem["op_mp_m" + m] = 0;
			currentItemQty["op_mp_m" + m] = 0;
			currentItemCost["op_mp_m" + m] = 0;
		}
	}

	frm.refresh_field("manpower_detail_summarized_by_month_section_a");
	frm.refresh_field("operational_plan_manpower_detail_summarized_one_qty");
	frm.refresh_field("operational_plan_manpower_detail_summarized_one_cost");

}
function calculateManpowerValuesB(frm, cdt, cdn, m) {
	var manpowerAggregatedValues = {};
	var manpowerAggregatedValuesCost = {};

	// Iterate through the manpower array
	for (var i = 0; i < frm.doc.manpower1.length; i++) {
		var manpowerItem = frm.doc.manpower1[i];
		console.log("manp ower item", manpowerItem)
		var job_title = manpowerItem.job_title;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two[j];
			if (monthData.activity == manpowerItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("monthe qunttity", activityMonthQuantity)

		if (manpowerAggregatedValues[job_title]) {
			manpowerAggregatedValues[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity;
		} else {
			manpowerAggregatedValues[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity;
		}

		if (manpowerAggregatedValuesCost[job_title]) {
			manpowerAggregatedValuesCost[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity * manpowerItem.hourly_cost;
		} else {
			manpowerAggregatedValuesCost[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity * manpowerItem.hourly_cost;
		}
	}
	console.log("manpoere aggrirgate", manpowerAggregatedValues);

	for (var i = 0; i < frm.doc.manpower_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.manpower_detail_summarized_by_month_section_b[i];
		var currentItemQty = frm.doc.operational_plan_manpower_detail_summarized_two_qty[i];
		var currentItemCost = frm.doc.operational_plan_manpower_detail_summarized_two_cost[i];

		var job_title = currentItem.job_title;
		var aggregatedValueForType = manpowerAggregatedValues[job_title];

		if (aggregatedValueForType) {
			var month_name =
				m === "1" ? "jan" :
					m === "2" ? "feb" :
						m === "3" ? "mar" :
							m === "4" ? "apr" :
								m === "5" ? "may" :
									m === "6" ? "jun" :
										m === "7" ? "july" :
											m === "8" ? "aug" :
												m === "9" ? "sep" :
													m === "10" ? "oct" :
														m === "11" ? "nov" :
															m === "12" ? "dec" :
																null;
			currentItem["op_mp_m" + m] = aggregatedValueForType;
			currentItemQty["op_mp_m" + m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			currentItemCost["op_mp_m" + m] = manpowerAggregatedValuesCost[job_title]
		} else {
			currentItem["op_mp_m" + m] = 0;
			currentItemQty["op_mp_m" + m] = 0;
			currentItemCost["op_mp_m" + m] = 0;
		}
	}

	frm.refresh_field("manpower_detail_summarized_by_month_section_b");
	frm.refresh_field("operational_plan_manpower_detail_summarized_two_qty");
	frm.refresh_field("operational_plan_manpower_detail_summarized_two_cost");

}

function calculateMachineryValues(frm, cdt, cdn, m) {
	var machineryAggregatedValues = {};
	var machineryAggregatedValuesCost = {};


	// Iterate through the machinery array
	for (var i = 0; i < frm.doc.machinery.length; i++) {
		var machineryItem = frm.doc.machinery[i];
		var type = machineryItem.type;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one[j];
			if (monthData.activity == machineryItem.activity) { // Compare activity
				activityMonthQuantity = monthData["m_" + m] || 0;
				console.log("activity month quantity", activityMonthQuantity)
				break;
			}
		}

		if (machineryAggregatedValues[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValues[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValues[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity;
		}

		if (machineryAggregatedValuesCost[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValuesCost[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity * machineryItem.rental_rate;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValuesCost[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity * machineryItem.rental_rate;
		}

	}
	console.log("AGGRICAGEeeeejjjjjjjjeeeee", machineryAggregatedValuesCost)

	// Iterate through the machinary_detail_summarized_by_month_section_a array
	for (var i = 0; i < frm.doc.machinary_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.machinary_detail_summarized_by_month_section_a[i];
		var currentItemQty = frm.doc.operational_plan_machinery_detail_summarized_one_qty[i];
		var currentItemCost = frm.doc.operational_plan_machinery_detail_summarized_one_cost[i];

		var type = currentItem.type;
		var aggregatedValueForType = machineryAggregatedValues[type];

		if (aggregatedValueForType) {
			var month_name =
				m === "1" ? "jan" :
					m === "2" ? "feb" :
						m === "3" ? "mar" :
							m === "4" ? "apr" :
								m === "5" ? "may" :
									m === "6" ? "jun" :
										m === "7" ? "july" :
											m === "8" ? "aug" :
												m === "9" ? "sep" :
													m === "10" ? "oct" :
														m === "11" ? "nov" :
															m === "12" ? "dec" :
																null;
			console.log("silkshn newa", machineryAggregatedValuesCost)
			currentItem["op_e_m" + m] = aggregatedValueForType;
			currentItemQty["op_e_m" + m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			currentItemCost["op_e_m" + m] = machineryAggregatedValuesCost[type]
			
		} else {
			currentItem["op_e_m" + m] = 0; // or handle the case where there is no aggregated value for the type
			currentItemQty["op_e_m" + m] = 0;
			currentItemCost["op_e_m" + m] = 0;
		}
	}

	frm.refresh_field("machinary_detail_summarized_by_month_section_a");
	frm.refresh_field("operational_plan_machinery_detail_summarized_one_qty");
	frm.refresh_field("operational_plan_machinery_detail_summarized_one_cost");

}
function calculateMachineryValuesB(frm, cdt, cdn, m) {
	var machineryAggregatedValues = {};
	var machineryAggregatedValuesCost = {};

	// Iterate through the machinery array
	for (var i = 0; i < frm.doc.machinery.length; i++) {
		var machineryItem = frm.doc.machinery[i];
		var type = machineryItem.type;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two[j];
			if (monthData.activity == machineryItem.activity) { // Compare activity
				activityMonthQuantity = monthData["m_" + m] || 0;
				console.log("activity month quantity", activityMonthQuantity)
				break;
			}
		}

		if (machineryAggregatedValues[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValues[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValues[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity;
		}

		if (machineryAggregatedValuesCost[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValuesCost[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity * machineryItem.rental_rate;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValuesCost[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity * machineryItem.rental_rate;
		}
	}
	console.log("AGGRICAGE", machineryAggregatedValues)

	// Iterate through the machinary_detail_summarized_by_month_section_a array
	for (var i = 0; i < frm.doc.machinary_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.machinary_detail_summarized_by_month_section_b[i];
		var currentItemQty = frm.doc.operational_plan_machinery_detail_summarized_two_qty[i];
		var currentItemCost = frm.doc.operational_plan_machinery_detail_summarized_two_cost[i];
		var type = currentItem.type;
		var aggregatedValueForType = machineryAggregatedValues[type];

		if (aggregatedValueForType) {
			var month_name =
				m === "1" ? "jan" :
					m === "2" ? "feb" :
						m === "3" ? "mar" :
							m === "4" ? "apr" :
								m === "5" ? "may" :
									m === "6" ? "jun" :
										m === "7" ? "july" :
											m === "8" ? "aug" :
												m === "9" ? "sep" :
													m === "10" ? "oct" :
														m === "11" ? "nov" :
															m === "12" ? "dec" :
																null;
			console.log("silkshn newa", machineryAggregatedValuesCost)
			currentItem["op_e_m" + m] = aggregatedValueForType;
			currentItemQty["op_e_m" + m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			currentItemCost["op_m_m" + m] = machineryAggregatedValuesCost[type]

		} else {
			currentItem["op_e_m" + m] = 0; // or handle the case where there is no aggregated value for the type
			currentItemQty["op_e_m" + m] = 0;
			currentItemCost["op_e_m" + m] = 0;
		}
	}

	frm.refresh_field("machinary_detail_summarized_by_month_section_b");
	frm.refresh_field("operational_plan_machinery_detail_summarized_two_qty");
	frm.refresh_field("operational_plan_machinery_detail_summarized_two_cost");

}