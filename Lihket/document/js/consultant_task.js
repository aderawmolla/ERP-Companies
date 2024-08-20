frappe.ui.form.on("Consultant Task", {
    participating_staff_salary: function (frm) {
      calculate_totalSub(frm);
    },
    perdiem_cost_for__professional_staffs: function (frm) {
      calculate_totalSub(frm);
    },
    vehicles_fuel__and__rental__cost: function (frm) {
      calculate_totalSub(frm);
    },
    surveying_equipments_depreciation_cost: function (frm) {
      calculate_totalSub(frm);
    },
    office_equipment__and_furniture_depreciation_cost: function (frm) {
      calculate_totalSub(frm);
    },
    communication_and_other_accessories: function (frm) {
      calculate_totalSub(frm);
    },
  });
  function calculate_totalSub(frm) {
    let totalSubValue = 0;
    let vat = 0;
    if (frm.doc.participating_staff_salary) {
      totalSubValue += frm.doc.participating_staff_salary;
    }
    if (frm.doc.perdiem_cost_for__professional_staffs) {
      totalSubValue += frm.doc.perdiem_cost_for__professional_staffs;
    }
    if (frm.doc.vehicles_fuel__and__rental__cost) {
      totalSubValue += frm.doc.vehicles_fuel__and__rental__cost;
    }
    if (frm.doc.surveying_equipments_depreciation_cost) {
      totalSubValue += frm.doc.surveying_equipments_depreciation_cost;
    }
    if (frm.doc.office_equipment__and_furniture_depreciation_cost) {
      totalSubValue += frm.doc.office_equipment__and_furniture_depreciation_cost;
    }
    if (frm.doc.communication_and_other_accessories) {
      totalSubValue += frm.doc.communication_and_other_accessories;
    }
    frm.set_value("total__final", totalSubValue);
    vat = parseFloat(frm.doc.total__final) * 0.15;
    frm.set_value("vat_display", vat);
  
    frm.set_value(
      "grand_total__in_etb2",
      frm.doc.total__final + frm.doc.vat_display
    );
  }
  frappe.ui.form.on("Participating staffs salary 1", {
    refresh: function (frm) {
      calculate_total_days(frm);
      console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
    },
    validate: function (frm) {
      calculate_total_days(frm);
      console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
    },
    table1: function (frm) {
      calculate_total_days(frm);
      console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
    },
    table1_remove: function (frm) {
      calculate_total_days(frm);
    },
    nr: function (frm, cdt, cdn) {
      calculate_total_days(frm);
    },
    field: function (frm, cdt, cdn) {
      calculate_total_days(frm);
    },
    office: function (frm, cdt, cdn) {
      calculate_total_days(frm);
    },
    monthly_rate: function (frm, cdt, cdn) {
      calculate_total_days(frm);
    },
  });
  
  function calculate_total_days(frm) {
    let total_days = 0;
    // here total value should be added for each iteration
    let firstValue = 0;
  
    if (Array.isArray(frm.doc.table1)) {
      frm.doc.table1.forEach(function (row) {
        if (row.nr && row.field) {
          console.log("Row value:", row.nr); // Debugging log
          total_days = parseFloat(row.nr) * row.field + row.office || 0;
  
          frappe.model.set_value(row.doctype, row.name, "total", total_days);
  
          if (row.monthly_rate) {
            let thisRow=total_days * row.monthly_rate
            firstValue+=thisRow;
            frappe.model.set_value(
              row.doctype,
              row.name,
              "total_amount__etb_birr",
              thisRow
            );
          }
        }
      });
    } else {
      console.log("table1 is not an array or is undefined"); // Debugging log
    }
  
    console.log("Total Days Calculated:", firstValue); // Debugging log
  
    frm.set_value("sub_total", firstValue);
    frm.set_value("participating_staff_salary", firstValue);
    frm.refresh_field("sub_total");
    frm.refresh_field("participating_staff_salary");
  }
  //table 2
  frappe.ui.form.on("Perdiem Cost 1", {
    refresh: function (frm) {
      calculate_total_days2(frm);
      console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
    },
    validate: function (frm) {
      calculate_total_days2(frm);
      console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
    },
    table2: function (frm) {
      calculate_total_days2(frm);
      console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
    },
    table2_remove: function (frm) {
      calculate_total_days2(frm);
    },
    nr: function (frm, cdt, cdn) {
      calculate_total_days2(frm);
    },
    field: function (frm, cdt, cdn) {
      calculate_total_days2(frm);
    },
    office: function (frm, cdt, cdn) {
      calculate_total_days2(frm);
    },
    monthly_rate: function (frm, cdt, cdn) {
      calculate_total_days2(frm);
    },
  });
  
  function calculate_total_days2(frm) {
    let total_days = 0;
    let firstValue = 0;
  
    if (Array.isArray(frm.doc.table2)) {
      frm.doc.table2.forEach(function (row) {
        if (row.nr && row.field) {
          console.log("Row value:", row.nr); // Debugging log
          total_days = parseFloat(row.nr) * (row.field + row.office || 0);
  
          frappe.model.set_value(row.doctype, row.name, "total", total_days);
  
          if (row.monthly_rate) {
            let thisRow = total_days * row.monthly_rate;
            firstValue +=thisRow;
  
            frappe.model.set_value(
              row.doctype,
              row.name,
              "total_amount__etb_birr",
               thisRow

            );
          }
        }
      });
    } else {
      console.log("table1 is not an array or is undefined"); // Debugging log
    }
  
    console.log("Total Days Calculated:", firstValue); // Debugging log
  
    frm.set_value("sub_total_2", firstValue);
    frm.set_value("perdiem_cost_for__professional_staffs", firstValue);
    frm.refresh_field("sub_total_2");
    frm.refresh_field("perdiem_cost_for__professional_staffs");
  }
  //table 3
  frappe.ui.form.on("Vehicles fuel and  Rental cost 1", {
    refresh: function (frm) {
      calculate_total_days3(frm);
      console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
    },
    validate: function (frm) {
      calculate_total_days3(frm);
      console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
    },
    table3: function (frm) {
      calculate_total_days3(frm);
      console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
    },
    table3_remove: function (frm) {
      calculate_total_days3(frm);
    },
    nr: function (frm, cdt, cdn) {
      calculate_total_days3(frm);
    },
    car_months: function (frm, cdt, cdn) {
      calculate_total_days3(frm);
    },
    monthly_unit_rate: function (frm, cdt, cdn) {
      calculate_total_days3(frm);
    },
  });
  
  function calculate_total_days3(frm) {
    let total_days3 = 0;
    let firstValue3 = 0;
  
    if (Array.isArray(frm.doc.table3)) {
      frm.doc.table3.forEach(function (row) {
        if (row.nr && row.car_months) {
          console.log("Row value:", row.nr); // Debugging log
          total_days3 = parseFloat(row.nr) * row.car_months;
  
          //  frappe.model.set_value(row.doctype, row.name, 'total', total_days);
  
          if (row.monthly_unit_rate) {
            firstValue3 = total_days3 * row.monthly_unit_rate;
  
            frappe.model.set_value(
              row.doctype,
              row.name,
              "total_amountt",
              firstValue3
            );
          }
        }
      });
    } else {
      console.log("table1 is not an array or is undefined"); // Debugging log
    }
  
    console.log("Total Days monthly_unit_rate:", firstValue3); // Debugging log
  
    frm.set_value("sub_total3", firstValue3);
    frm.set_value("vehicles_fuel__and__rental__cost", firstValue3);
    frm.refresh_field("sub_total3");
    frm.refresh_field("vehicles_fuel__and__rental__cost");
  }
  //table 4
  frappe.ui.form.on("Surveying equipments Depreciation Cost 1", {
    refresh: function (frm) {
      calculate_total_days4(frm);
      console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
    },
    validate: function (frm) {
      calculate_total_days4(frm);
      console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
    },
    table4: function (frm) {
      calculate_total_days4(frm);
      console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
    },
    table5_remove: function (frm) {
      calculate_total_days4(frm);
    },
    nr: function (frm, cdt, cdn) {
      calculate_total_days4(frm);
    },
    field: function (frm, cdt, cdn) {
      calculate_total_days4(frm);
    },
    duration_months: function (frm, cdt, cdn) {
      calculate_total_days4(frm);
    },
    montly_uint_rate: function (frm, cdt, cdn) {
      calculate_total_days4(frm);
    },
  });
  
  function calculate_total_days4(frm) {
    let total_days = 0;
    let firstValue = 0;
  
    if (Array.isArray(frm.doc.table4)) {
      frm.doc.table4.forEach(function (row) {
        if (row.nr && row.duration_months) {
          console.log("Row value:", row.nr); // Debugging log
          total_days = parseFloat(row.nr) * row.duration_months;
  
          frappe.model.set_value(row.doctype, row.name, "total", total_days);
  
          if (row.montly_uint_rate) {
            firstValue = total_days * row.montly_uint_rate;
  
            frappe.model.set_value(
              row.doctype,
              row.name,
              "total__amount_birr",
              firstValue
            );
          }
        }
      });
    } else {
      console.log("table1 is not an array or is undefined"); // Debugging log
    }
  
    console.log("Total Days Calculated:", firstValue); // Debugging log
  
    frm.set_value("sub_total4", firstValue);
    frm.set_value("surveying_equipments_depreciation_cost", firstValue);
    frm.refresh_field("sub_total4");
    frm.refresh_field("surveying_equipments_depreciation_cost");
  }
  //table 5
  frappe.ui.form.on("Office Equipment  and furniture depreciation cost 1", {
    refresh: function (frm) {
      calculate_total_days5(frm);
      console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
    },
    validate: function (frm) {
      calculate_total_days5(frm);
      console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
    },
    table5: function (frm) {
      calculate_total_days5(frm);
      console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
    },
    table5_remove: function (frm) {
      calculate_total_days5(frm);
    },
    nr: function (frm, cdt, cdn) {
      calculate_total_days5(frm);
    },
  
    duration_months: function (frm, cdt, cdn) {
      calculate_total_days5(frm);
    },
    montly_uint_rate: function (frm, cdt, cdn) {
      calculate_total_days5(frm);
    },
  });
  
  function calculate_total_days5(frm) {
    let total_days = 0;
    let firstValue = 0;
  
    if (Array.isArray(frm.doc.table5)) {
      frm.doc.table5.forEach(function (row) {
        if (row.nr && row.duration_months) {
          console.log("Row value:", row.nr); // Debugging log
          total_days = parseFloat(row.nr) * row.duration_months;
  
          frappe.model.set_value(
            row.doctype,
            row.name,
            "intermediate_total",
            total_days
          );
  
          if (row.montly_uint_rate) {
            firstValue = total_days * row.montly_uint_rate;
  
            frappe.model.set_value(
              row.doctype,
              row.name,
              "total__amount_birr",
              firstValue
            );
          }
        }
      });
    } else {
      console.log("table1 is not an array or is undefined"); // Debugging log
    }
  
    console.log("Total Days Calculated:", firstValue); // Debugging log
  
    frm.set_value("sub_total5", firstValue);
    frm.set_value(
      "office_equipment__and_furniture_depreciation_cost",
      firstValue
    );
    frm.refresh_field("sub_total5");
    frm.refresh_field("office_equipment__and_furniture_depreciation_cost");
  }
  //table 6
  frappe.ui.form.on("Communication and other accessories 1", {
    refresh: function (frm) {
      calculate_total_days6(frm);
      console.log("Time claim field on refresh:", frm.doc.table1); // Debugging log
    },
    validate: function (frm) {
      calculate_total_days6(frm);
      console.log("Time claim field on validate:", frm.doc.table1); // Debugging log
    },
    table6: function (frm) {
      calculate_total_days6(frm);
      console.log("Time claim field on table1 change:", frm.doc.table1); // Debugging log
    },
    table6_remove: function (frm) {
      calculate_total_days6(frm);
    },
    nr: function (frm, cdt, cdn) {
      calculate_total_days5(frm);
    },
  
    duration_months: function (frm, cdt, cdn) {
      calculate_total_days6(frm);
    },
    montly_uint_rate: function (frm, cdt, cdn) {
      calculate_total_days6(frm);
    },
  });
  
  function calculate_total_days6(frm) {
    let total_days = 0;
    let firstValue = 0;
  
    if (Array.isArray(frm.doc.table6)) {
      frm.doc.table6.forEach(function (row) {
        if (row.nr && row.duration_months) {
          console.log("Row value:", row.nr); // Debugging log
          total_days = parseFloat(row.nr) * row.duration_months;
  
          frappe.model.set_value(
            row.doctype,
            row.name,
            "intermediate_total",
            total_days
          );
  
          if (row.montly_uint_rate) {
            firstValue = total_days * row.montly_uint_rate;
  
            frappe.model.set_value(
              row.doctype,
              row.name,
              "total__amount_birr",
              firstValue
            );
          }
        }
      });
    } else {
      console.log("table1 is not an array or is undefined"); // Debugging log
    }
  
    console.log("Total Days Calculated:", firstValue); // Debugging log
  
    frm.set_value("sub_total6", firstValue);
    frm.set_value("communication_and_other_accessories", firstValue);
    frm.refresh_field("sub_total6");
    frm.refresh_field("communication_and_other_accessories");
  }