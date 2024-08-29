SELECT 
  prt.name               AS 	"GRN No:Link/Purchase Receipt",
  prt.delivery_date               AS	"Received Date",
  prt.received_by AS "Received By",
  poi.warehouse AS  "Location",
  prti.profit_center           AS	"Profit Center Code:Link/Profit Center",
  prti.cost_center          AS	"Cost Center Code:Link/Cost Center",
  po.supplier                AS 	"Vendor No",
  po.supplier_name               AS 	 "Vendor Name",

  poi.warehouse     AS	"Location",
  prti.item_code              AS	 "Item No:Link/Item",	
  prti.description           AS	"Description",	
  prti.uom                AS	 "UOM",
    po.name                AS 	"Purchase Order No",
    poi.qty                AS 	"QTY On Purchase Order",
    poi.rate                AS 	"Unit Cost",
    (poi.qty*poi.rate)      AS "Total Cost",
    prti.qty               AS 	"Quantity Received",
 (poi.qty-prti.qty)                AS 	"Out Standing Qty",
  NULL AS "Ticket NO"
  
FROM 
`tabPurchase Receipt` prt
LEFT JOIN `tabPurchase Order` po ON po.name = prt.purchase_order
LEFT JOIN `tabPurchase Receipt Item` prti ON prt.name = prti.parent
LEFT JOIN `tabPurchase Order Item` poi ON poi.item_code= prti.item_code
WHERE  
    prt.delivery_date >= %(from_date)s AND prt.delivery_date <= %(to_date)s
GROUP BY
prt.name,prt.delivery_date,prti.item_code;