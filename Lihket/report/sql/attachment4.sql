SELECT
emp.designation AS "የአገልግሎት ዘመን",

SUM(CASE WHEN emp.employment_type IN ('Permanent', 'ቋሚ') THEN 1 ELSE 0 END) AS "ቋሚ",
SUM(CASE WHEN emp.employment_type IN ('ኮንትራት', 'Contract') THEN 1 ELSE 0 END) AS "ኮንትራት",
COUNT(*) AS "ድምር",
SUM(CASE WHEN es.reason="በራስ ጠያቂነት" THEN 1 ELSE 0 END) AS "በራስ ጠያቂነት",
SUM(CASE WHEN es.reason="ጥሎ በመጥፋት" THEN 1 ELSE 0 END)  AS "ጥሎ በመጥፋት",
SUM(CASE WHEN es.reason="የስራ ውል በመጠናቀቁ" THEN 1 ELSE 0 END) AS "የስራ ውል በመጠናቀቁ",
SUM(CASE WHEN es.reason="በሞት" THEN 1 ELSE 0 END) AS "በሞት",
SUM(CASE WHEN es.reason="በዲስፕሊን" THEN 1 ELSE 0 END) AS "በዲስፕሊን",
COUNT(*) AS "ድምር"

FROM 
 `tabEmployee` emp
RIGHT JOIN
 `tabEmployee Separation` es on es.employee=emp.name

GROUP BY
emp.designation 



 