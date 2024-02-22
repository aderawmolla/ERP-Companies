SELECT
mr.name AS "SR NO:Link/Material Request",
mri.item_code AS "Item Code:Link/Item",
mri.description AS "Description",
mri.uom AS "UOM",
mri.qty AS "SR QTY",
pri.qty AS "PR QTY",
pr.name AS "PR Name:Link/PR"
FROM 
`tabMaterial Request` mr
 LEFT JOIN  
`tabMaterial Request Item` mri on  mr.name=mri.parent
LEFT JOIN
`tabPR Item` pri on pri.sr_no=mr.name
LEFT JOIN `tabPR` pr on pr.name=pri.parent
GROUP BY 
  mri.item_code,pri.item_code