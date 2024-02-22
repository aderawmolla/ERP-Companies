SELECT 	
 poi.pr_no      AS "PR No.",
 poi.pr_date    AS "PR DATE",
 po.name    AS "PO No.",
 po.transaction_date     AS "PO DATE",
 poi.item_code          AS "ITEM CODE",
 poi.description        AS "ITEM DESCRIPTION",
 poi.uom          AS "UOM",
 poi.weight_per_unit  AS "WEIGHT CONVERSION",
 po.branch    AS "PROJECT",
 po.supplier          AS "SUPPLIER NAME",
 poi.pr_qty         AS "PR QUANTITY",
 poi.qty          AS "PO QTY",
(poi.qty*poi.weight_per_unit )     AS "PO WEIGHT",
 pri.received_qty       AS "RECEIVED QUANTITY",
(poi.qty-pri.received_qty)   AS "REMAINING Quantity",
 poi.rate           AS "UNIT PRICE",
(poi.rate*poi.qty)      AS "PO AMOUNT",
(pri.received_qty*poi.rate)  AS "RECEIVED AMOUNT",
(poi.rate*poi.qty)      AS "PO AMOUNT",
((poi.rate*poi.qty)-(pri.received_qty*poi.rate))   AS "REMAINING BALANCE",
((poi.weight_per_unit* poi.qty)-(poi.weight_per_unit* pri.qty))  AS "Remaining Weight"

FROM `tabPurchase Order` po
LEFT JOIN `tabPurchase Order Item` poi on po.name=poi.parent
LEFT JOIN `tabPurchase Receipt Item` pri on poi.parent=pri.purchase_order
  