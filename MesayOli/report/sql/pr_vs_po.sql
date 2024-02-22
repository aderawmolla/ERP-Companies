SELECT
    mr.name AS "PR NO:Link/PR",
    mri.item_code AS "Item Code:Link/Item",
    mri.description AS "Description",
    mri.uom AS "UOM",
    SUM(mri.qty) AS "PR QTY",
    SUM(pri.qty) AS "PO QTY",
    pr.name AS "PO NO:Link/PR"
FROM 
    `tabPR` mr
LEFT JOIN  
    `tabPR Item` mri ON mr.name = mri.parent
LEFT JOIN
    `tabPurchase Order Item` pri ON pri.pr_no = mr.name
LEFT JOIN 
    `tabPurchase Order` pr ON pr.name = pri.parent
GROUP BY 
    mri.item_code, mr.name,pr.name AND pri.pr_no IS NOT NULL;
