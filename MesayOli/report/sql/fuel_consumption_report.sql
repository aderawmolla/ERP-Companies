SELECT
    sed.fuel_request_no AS "Fuel Req No:Link/Fuel Request for Equipment Form",
    sed.equip_type_name AS "Equipment Type:Data:200",
    sed.plate_no AS "Plate No:Link/Equipment Birth Certificate Form:200",
    se.name AS "FIV NO:Link/Stock Entry",
    se.posting_date AS "Date:Date:200",
    sed.current_fuel_issue AS "Fuel Qty:Float:200",
    sed.previous_km_reading AS "Previous Km Reading",
    sed.current_km_readings AS "Current Km_Hr:Float:200",
   (sed.current_km_readings-sed.previous_km_reading) AS "Km_Hr diff:Float:120",
    sed.kml AS "Rate:Float:120",
   '-' AS "Standard Range:Data:100",
   " " AS "Status:Data:200",
   sed.driver_name  AS "Operator:Link/Employee:200",
   "" AS "Type of Work:Data:120",
   " " AS "Reason of derivation:Data:200"
FROM
    `tabStock Entry` se
RIGHT JOIN 
  `tabStock Entry Detail` sed on sed.parent=se.name

WHERE  
    se.posting_date >= %(from_date)s AND se.posting_date <= %(to_date)s AND sed.fuel_request_no IS NOT NULL

