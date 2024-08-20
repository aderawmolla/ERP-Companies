SELECT 
    CASE 
        WHEN department IN ('Manager', 'አስተዳዳሪ') THEN 'Manager'
        WHEN department IN ('Developer', 'አንተኛ') THEN 'Developer'
        ELSE department
    END AS Department,
    SUM(CASE WHEN gender IN ('male', 'ወንድ') AND employment_type IN ('ኮንትራት', 'Contract') THEN 1 ELSE 0 END) AS "ኮንትራት ወንድ",
    SUM(CASE WHEN gender IN ('female', 'ሴት') AND employment_type IN ('Contract', 'ኮንትራት') THEN 1 ELSE 0 END) AS "ኮንትራት ሴት",
    SUM(CASE WHEN  employment_type IN ('Contract', 'ኮንትራት') THEN 1 ELSE 0 END) AS "ኮንትራት ድምር",

    SUM(CASE WHEN gender IN ('male', 'ወንድ') AND employment_type IN ('Permanent', 'ቋሚ') THEN 1 ELSE 0 END) AS "ቋሚ ወንድ",
    SUM(CASE WHEN gender IN ('female', 'ሴት') AND employment_type IN ('Permanent', 'ቋሚ') THEN 1 ELSE 0 END) AS "ቋሚ ሴት",
    SUM(CASE WHEN employment_type IN ('Permanent', 'ቋሚ') THEN 1 ELSE 0 END) AS "ቋሚ ድምር",

    SUM(CASE WHEN gender IN ('male', 'ወንድ') THEN 1 ELSE 0 END) AS "ጠቅላላ ወንድ",
    SUM(CASE WHEN gender IN ('female', 'ሴት') THEN 1 ELSE 0 END) AS "ጠቅላላ ሴት",
    COUNT(*) AS "ጠቅላላ ድምር"
FROM 
    `tabEmployee` emp
WHERE 
    status = 'active'
GROUP BY 
    Department
ORDER BY 
    Department;
