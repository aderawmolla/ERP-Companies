SELECT
    CASE
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) <= 1 THEN 'እስከ 1 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 2 AND 3 THEN '>1-2 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 2 AND 3 THEN '>2-3 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 3 AND 4 THEN '>4-5 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 4 AND 5 THEN '>5-6 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 5 AND 6 THEN '>6-7 አመት'
        ELSE '>7 አመት'
    END AS "የአገልግሎት ዘመን",
    
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
    `tabEmployee Separation` es on es.employee = emp.name

GROUP BY
    CASE
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) <= 1 THEN 'እስከ 1 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 2 AND 3 THEN '>1-2 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 2 AND 3 THEN '>2-3 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 3 AND 4 THEN '>4-5 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 4 AND 5 THEN '>5-6 አመት'
        WHEN TIMESTAMPDIFF(YEAR, emp.date_of_joiningg, es.resignation_letter_date) BETWEEN 5 AND 6 THEN '>6-7 አመት'
        ELSE '>7 አመት'
    END;