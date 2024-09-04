SELECT 
    sg.posting_date AS "Date",                    -- The date of the transaction
    sed.item_code AS "Item Code",                 -- The code of the item
    sed.item_name AS "Item Name",                 -- The name of the item
    sg.name AS "Voucher Number:Link/Servicable Goods", -- The voucher number linked to the transaction
    warehouse_data.warehouse AS "Warehouse",      -- The warehouse involved (either source or target)
    SUM(warehouse_data.qty_change) AS "QTY"       -- The net quantity change for the warehouse
FROM 
    `tabServicable Goods` sg
LEFT JOIN 
    `tabService Entry Detail` sed ON sg.name = sed.parent
JOIN 
    (
        -- Handle Source Warehouse with a negative quantity change
        SELECT 
            parent,
            IFNULL(s_warehouse, 'No Source Warehouse') AS warehouse,
            -qty AS qty_change
        FROM 
            `tabService Entry Detail`
        WHERE 
            s_warehouse IS NOT NULL

        UNION ALL

        -- Handle Target Warehouse with a positive quantity change
        SELECT 
            parent,
            IFNULL(t_warehouse, 'No Target Warehouse') AS warehouse,
            qty AS qty_change
        FROM 
            `tabService Entry Detail`
        WHERE 
            t_warehouse IS NOT NULL
    ) AS warehouse_data 
    ON sed.parent = warehouse_data.parent
WHERE 
    sg.purpose IN ('Material Receipt', 'Material Issue', 'Material Transfer')
GROUP BY 
    sg.posting_date, 
    sed.item_code, 
    sed.item_name, 
    warehouse_data.warehouse
ORDER BY 
    sg.posting_date, sed.item_code, "Warehouse";
