SELECT 

te.name AS "የስልጠና አይነት:Link/Training Event",
te.training_program AS "ስልጠና የተሰጠበት ዘርፍ",
te.planned AS "የሰልጣኝ ቁጥር ዕቅድ",
te.excuted AS "የሰልጣኝ ቁጥር ክንዉን",
CASE WHEN te.trainer="Outside Trainer"  THEN "በውጭ አሰልጣኝ" ELSE "በውስጥ አሰልጣኝ" END AS "ስልጠና የተሰጠዉ",
te.examination AS "ምርመራ"
FROM 
`tabTraining Event` te
LEFT JOIN 
  SELECT (
tee.parent AS parent,
  COUNT(DISTINCT tee.employee) as employees
  FROM `tabTraining Event Employee` tee 
  GROUP BY tee.parent
  )AS trainers on   trainers.parent=te.name;



SELECT 
    te.name AS "የስልጠና አይነት:Link/Training Event",
    te.training_program AS "ስልጠና የተሰጠበት ዘርፍ",
    te.planned AS "የሰልጣኝ ቁጥር ዕቅድ",
    te.excuted AS "የሰልጣኝ ቁጥር ክንዉን",
    CASE WHEN te.trainer = "Outside Trainer" THEN "በውጭ አሰልጣኝ" ELSE "በውስጥ አሰልጣኝ" END AS "ስልጠና የተሰጠዉ",
    te.examination AS "ምርመራ",
FROM 
    `tabTraining Event` te
LEFT JOIN 
    (SELECT 
        tee.parent AS parent,
        COUNT(DISTINCT tee.employee) AS employees
     FROM 
        `tabTraining Event Employee` tee 
     GROUP BY 
        tee.parent
    ) AS trainers ON trainers.parent = te.name;
