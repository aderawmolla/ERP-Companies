SELECT 	
 poi.pr_no      AS "PR No.",
 poi.pr_date    AS "PR DATE",
 po.name    AS "PO No.",
 po.transaction_date     AS "PO DATE",
 poi.item_code          AS "ITEM CODE",
 poi.description        AS "ITEM DESCRIPTION",
 poi.uom          AS "UOM",
 po.branch    AS "PROJECT",
 po.supplier          AS "SUPPLIER NAME",
 poi.qty          AS "PO QTY",
 pri.received_qty       AS "RECEIVED QUANTITY",
(poi.qty-pri.received_qty)   AS "REMAINING Quantity",
(poi.rate*poi.qty)      AS "PO AMOUNT",
(pri.received_qty*poi.rate)  AS "RECEIVED AMOUNT",
(poi.rate*poi.qty)      AS "PO AMOUNT"
FROM `tabPurchase Order` po
LEFT JOIN `tabPurchase Order Item` poi on po.name=poi.parent
LEFT JOIN `tabPurchase Receipt Item` pri on poi.parent=pri.purchase_order
  