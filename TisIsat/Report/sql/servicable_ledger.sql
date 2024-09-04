SELECT 
    sg.posting_date AS "Date",
    sed.item_code ,
    sed.item_name AS "Item Name",
    sg.purpose AS "Type",
    warehouse_data.warehouse AS "Warehouse",
    sg.name AS "Voucher Number",
    sed.uom AS "UOM",
    warehouse_data.qty_change AS "QTY"
FROM 
    `tabServicable Goods` sg
LEFT JOIN 
    `tabService Entry Detail` sed 
    ON sg.name = sed.parent
LEFT JOIN (
    SELECT 
        s_warehouse AS warehouse, 
        -qty AS qty_change, 
        'Source' AS direction 
    FROM 
        `tabService Entry Detail`
    WHERE 
        s_warehouse IS NOT NULL
    UNION ALL
    SELECT 
        t_warehouse AS warehouse, 
        qty AS qty_change, 
        'Target' AS direction 
    FROM 
        `tabService Entry Detail`
    WHERE 
        t_warehouse IS NOT NULL
) AS warehouse_data
    ON (sed.s_warehouse = warehouse_data.warehouse AND warehouse_data.direction = 'Source')
    OR (sed.t_warehouse = warehouse_data.warehouse AND warehouse_data.direction = 'Target')
WHERE 
    sg.purpose IN ('Material Receipt', 'Material Issue', 'Material Transfer')
GROUP BY
    sg.posting_date,
    sed.item_code ,
    sed.item_name,
    sg.purpose ,
    warehouse_data.warehouse,
    sg.name

ORDER BY 
    sg.posting_date, sed.item_name, warehouse_data.warehouse;
