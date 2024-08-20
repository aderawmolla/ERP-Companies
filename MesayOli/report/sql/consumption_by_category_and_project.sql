
SELECT 
  item.item_category AS "Major Category",
  item.description AS "Description",
  item.item_code AS "Item Code",
  transIn.count AS "GRV Count",
  retn.qty+transIn.qty AS "Total Rec Qty",
  issued.count + transOut.count  AS "SIV Count",
  issued.qty + transOut.qty AS "Total SIV Qty",
  SUM(COALESCE(sri.qty, 0)) + SUM(COALESCE(pri.qty, 0)) + COALESCE(SUM(manf.qty), 0) + COALESCE(SUM(transIn.qty), 0) - COALESCE(SUM(issued.qty), 0) - COALESCE(SUM(transOut.qty), 0) AS "Ending Balance QTY",
  (issued.count + transOut.count/retn.qty+transIn.qty)*100 AS "Movement:Percent"
--   this is separate line between the template code and this code
  -- pri.item_code AS "Purchase Receipt Item",
  -- transIn.item_code "transfered Item",
--   sr.cost_center AS "Project",
--   item.uom AS "Unit",
--   -- sr.purpose AS "Purpose",
--   sr.name AS "Stock Reconciliation:Link/Stock Reconciliation",
--   NULL AS "Beginning Balance LI",
--   SUM(sri.qty) AS "Beginning Balance QTY",
--   SUM(sri.amount) AS "Beginning Balance AMOUNT",
--   NULL AS "Purchase LI",
--   SUM(pri.qty) AS "Purchase QTY",
--   SUM(pri.amount) AS "Purchase AMT",
--   NULL AS "Manufacturing LI",
--   SUM(manf.qty) AS "Manufacturing QTY",
--   SUM(manf.amount) AS "Manufacturing AMT",
--   NULL AS "Transfer In LI",
--  SUM(transIn.qty) AS "Transfer In  QTY",
--  SUM(transIn.amount) AS "Transfer AMT",
--  SUM(retn.qty) AS "Returned QTY",
--   SUM(retn.amount) AS "Returned AMT",
--   NULL AS "Issued  LI",
--   SUM(issued.qty) AS "Issued  QTY",
--   SUM(issued.amount) AS "Issued AMT",
--   SUM(transOut.qty) AS "Transfer Out QTY",
--   SUM(transOut.amount) AS "Transfer Out AMT",
--   NULl AS "Ending Balance LI",
--  SUM(COALESCE(sri.qty, 0)) + SUM(COALESCE(pri.qty, 0)) + COALESCE(SUM(manf.qty), 0) + COALESCE(SUM(transIn.qty), 0) - COALESCE(SUM(issued.qty), 0) - COALESCE(SUM(transOut.qty), 0) AS "Ending Balance QTY",
--  SUM(COALESCE(sri.amount, 0)) + SUM(COALESCE(pri.amount, 0)) + COALESCE(SUM(manf.amount), 0) + COALESCE(SUM(transIn.amount), 0) - COALESCE(SUM(transOut.amount), 0) AS "Ending Balance AMT"

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

