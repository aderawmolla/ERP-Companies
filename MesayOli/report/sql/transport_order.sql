SELECT 	
 po.supplier AS "SUPPLIER NAME",
 poi.item_code AS "ITEM CODE",
 poi.description AS "ITEM DESCRIPTION",
 poi.pr_qty AS "PR QUANTITY",
 poi.qty AS "PO QTY",
 (COALESCE(pri.received_qty, 0) * poi.rate) AS "RECEIVED AMOUNT",
 (poi.qty - COALESCE(pri.received_qty, 0)) AS "REMAINING Quantity",
 ((poi.weight_per_unit * poi.qty) - (poi.weight_per_unit * COALESCE(pri.received_qty, 0))) AS "Remaining Weight"
FROM `tabPurchase Order` po
LEFT JOIN `tabPurchase Order Item` poi ON po.name = poi.parent
LEFT JOIN `tabPurchase Receipt Item` pri ON poi.parent = pri.purchase_order
WHERE
  po.name = %(po_no)s  or 
  po.branch=%(project1)s 
--   OR po.branch IN (
--     COALESCE(%(project2)s, %(project1)s),
--     COALESCE(%(project3)s, %(project1)s),
--     COALESCE(%(project4)s, %(project1)s),
--     COALESCE(%(project5)s, %(project1)s),
--     COALESCE(%(project6)s, %(project1)s),
--     COALESCE(%(project7)s, %(project1)s)
--   );