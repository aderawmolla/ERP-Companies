SELECT 
    PlateNo AS "Plate No:Link/Equipment Birth Certificate Form",
    SUM(CannibalizationCost) AS "Cannibalization Cost",
    SUM(FuelCost) AS "Fuel Cost",
    SUM(AccidentInsuranceFollowupCost) AS "Accident Insurance Followup Cost",
    SUM(MaintenanceWorkorderCost) AS "Maintenance Workorder Cost",
    SUM(TotalCost) AS "Total Cost"
FROM (
    (SELECT
        COALESCE(cr.to,i.plate_no, mwo.serial_or_plate_no, fr.plate_no) AS PlateNo,
        SUM(i.maintainance_cost + i.compansation_cost ) AS AccidentInsuranceFollowupCost,
        SUM((fr.vehicle_km_litr + fr.others_liters_hr) * fr.rate) AS FuelCost,
        SUM(mwo.total_cost) AS MaintenanceWorkorderCost,
        SUM(cr.total_cost) AS CannibalizationCost,
        SUM(COALESCE(i.maintainance_cost, 0) + COALESCE(i.compansation_cost, 0) + COALESCE(, 0) + COALESCE(mwo.total_cost, 0) + COALESCE((fr.vehicle_km_litr + fr.others_liters_hr) * fr.rate, 0)) AS TotalCost
    FROM 
        `tabFuel Request for Equipment Form` fr 
    LEFT JOIN
        `tabAccident Insurance Followup` i 
        ON i.plate_no = fr.plate_no
    LEFT JOIN 
        `tabCannibalization request Form` cr on cr.to=fr.plate_no
    LEFT JOIN `tabMaintenance Work order` mwo.serial_or_plate_no=i.plate_no
    GROUP BY COALESCE(i.plate_no,fr.plate_no))
    WHERE
        cr.date >= %(from_date)s AND dp.date <= %(to_date)s AND cr.date >= %(from_date)s AND fr.date <= %(to_date)s AND i.completed_gc >= %(from_date)s AND i.completed_gc <= %(to_date)s ;

) AS CombinedResults;
