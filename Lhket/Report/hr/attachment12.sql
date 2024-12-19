
SELECT
    emp.department AS 'የስራ ዘርፍ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 20 AND 30 AND emp.gender IN ('female', 'ሴት') THEN 1 ELSE 0 END) AS 'ከ 20-30 ወ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 20 AND 30 AND emp.gender IN ('male', 'ወንድ') THEN 1 ELSE 0 END) AS 'ከ 20-30 ሴ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 20 AND 30 THEN 1 ELSE 0 END) AS 'ከ 20-30 ድምር',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 31 AND 40 AND emp.gender IN ('female', 'ሴት') THEN 1 ELSE 0 END) AS 'ከ 31-40 ወ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 31 AND 40 AND emp.gender IN ('male', 'ወንድ') THEN 1 ELSE 0 END) AS 'ከ 31-40 ሴ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 31 AND 40 THEN 1 ELSE 0 END) AS 'ከ 31-40 ድምር',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 41 AND 50 AND emp.gender IN ('female', 'ሴት') THEN 1 ELSE 0 END) AS 'ከ 41-50 ወ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 41 AND 50 AND emp.gender IN ('male', 'ወንድ') THEN 1 ELSE 0 END) AS 'ከ 41-50 ሴ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 41 AND 50 THEN 1 ELSE 0 END) AS 'ከ 41-50 ድምር',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 51 AND 60 AND emp.gender IN ('female', 'ሴት') THEN 1 ELSE 0 END) AS 'ከ 51-60 ወ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 51 AND 60 AND emp.gender IN ('male', 'ወንድ') THEN 1 ELSE 0 END) AS 'ከ 51-60 ሴ',
    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, emp.date_of_birth, CURDATE()) BETWEEN 51 AND 60 THEN 1 ELSE 0 END) AS 'ከ 51-60 ድምር',
    COUNT(*) AS 'ጠ/ድምር'
FROM
    `tabEmployee` emp
GROUP BY
    
    department
    
ORDER BY
    department;
    
