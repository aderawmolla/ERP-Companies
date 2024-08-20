
SELECT 
 item.item_category AS "Major Category",
  item.item_sub_category AS "Item Category",
  item.description AS "Description",
  item.item_code AS "Item Code",
  transIn.count AS "GRV Count",
  retn.qty+transIn.qty AS "Total Received Qty",
  issued.count + transOut.count  AS "SIV Count",
  issued.qty + transOut.qty AS "Total SIV Qty",
 (issued.count + transOut.count/retn.qty+transIn.qty)*100 AS "Movement:Percent",

 SUM(COALESCE(sri.qty, 0)) + SUM(COALESCE(pri.qty, 0)) + COALESCE(SUM(manf.qty), 0) + COALESCE(SUM(transIn.qty), 0) - COALESCE(SUM(issued.qty), 0) - COALESCE(SUM(transOut.qty), 0) AS "Qty InStock",
 transIn.lastGRV AS "Last GRV Unit Cost",
 (SUM(COALESCE(sri.qty, 0)) + SUM(COALESCE(pri.qty, 0)) + COALESCE(SUM(manf.qty), 0) + COALESCE(SUM(transIn.qty), 0) - COALESCE(SUM(issued.qty), 0) - COALESCE(SUM(transOut.qty), 0))*transIn.lastGRV AS "Total Cost"
FROM
  `tabStock Reconciliation` sr
LEFT JOIN `tabStock Reconciliation Item` sri ON sri.parent = sr.name 
LEFT JOIN `tabPurchase Receipt Item` pri ON sri.item_code = pri.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Receipt" AND se.documentt = "Own Manufacturing"
  GROUP BY 
  sed.item_code
) AS manf ON sri.item_code = manf.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    -- illogical to be honest
    AVG(sed.valuation_rate) AS "lastGRV",
    COUNT(sed.item_code) AS "count",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Receipt" AND se.documentt = "Transfer In"
   GROUP BY 
  sed.item_code
) AS transIn ON sri.item_code = transIn.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Receipt" AND se.documentt = "Material Return"
   GROUP BY 
  sed.item_code
) AS retn ON sri.item_code = retn.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount",
    COUNT(sed.item_code) AS "count"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Issue" AND se.documentt = "Issue"
   GROUP BY 
  sed.item_code
) AS issued ON sri.item_code = issued.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount",
    COUNT(sed.item_code) AS "count"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Issue" AND se.documentt = "Transfer Out"
   GROUP BY 
  sed.item_code
) AS transOut ON sri.item_code = transOut.item_code
LEFT JOIN `tabItem` item on sri.item_code=item.name
GROUP BY
--   sri.item_code,
  sr.cost_center,
  item.item_category;
--   sr.purpose;


-- SELECT 
--     Null AS "Major category",
--     NULL AS "item category",
--     Null AS "Description",
--     NULL AS "Item Code",
--     NULL AS "Unit",
--     NULL AS "GRV Count",
--     NULL AS "Total Received Qty",
--     NULL AS "SIV Count",
--     NULL AS "Total SIV Qty",
--     NULL AS "Movement",
--     NULL AS "Qty InStock",
--     Null AS "Last GRV Unit Cost",
--     NULL AS "Total Cost"
-- FROM 
--     `tabStock Entry`;
