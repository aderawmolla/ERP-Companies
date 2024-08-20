SELECT 
    st.budget_year AS "Budget Year",
    st.project AS "Project",
    COALESCE(ep.total_income, 0) AS "Income",
    (COALESCE(cs.budget, 0) + COALESCE(dl.total_labor_expense, 0) + 
     COALESCE(fl.total_expense, 0) + COALESCE(vr.total_expense, 0) + 
     COALESCE(sf.total_perdiem, 0) + COALESCE(sn.total_expense, 0)) AS "Expense",
    (COALESCE(ep.total_income, 0) - 
     (COALESCE(cs.budget, 0) + COALESCE(dl.total_labor_expense, 0) + 
      COALESCE(fl.total_expense, 0) + COALESCE(vr.total_expense, 0) + 
      COALESCE(sf.total_perdiem, 0) + COALESCE(sn.total_expense, 0))) AS "Balance"
FROM 
    `tabSITE DIARY` st
LEFT JOIN (
    SELECT 
        parent,
        SUM(budget) AS budget
    FROM 
        `tabConsultancy service`
    GROUP BY 
        parent
) cs ON st.name = cs.parent
LEFT JOIN (
    SELECT 
        parent,
        SUM(total_labor_expense) AS total_labor_expense
    FROM 
        `tabDaily Labour`
    GROUP BY 
        parent
) dl ON st.name = dl.parent
LEFT JOIN (
    SELECT 
        parent,
        SUM(total_expense) AS total_expense
    FROM 
        `tabFuel and Lubricant Expense`
    GROUP BY 
        parent
) fl ON st.name = fl.parent
LEFT JOIN (
    SELECT 
        parent,
        SUM(total_expense) AS total_expense
    FROM 
        `tabVehicle Rent and Surveying tool`
    GROUP BY 
        parent
) vr ON st.name = vr.parent
LEFT JOIN (
    SELECT 
        parent,
        SUM(total_perdiem) AS total_perdiem
    FROM 
        `tabStaff`
    GROUP BY 
        parent
) sf ON st.name = sf.parent
LEFT JOIN (
    SELECT 
        parent,
        SUM(total_expense) AS total_expense
    FROM 
        `tabStationary and Others`
    GROUP BY 
        parent
) sn ON st.name = sn.parent
LEFT JOIN (
    SELECT 
        project,
        budget_year,
        SUM(total_income) AS total_income
    FROM 
        `tabExpense Plan`
    GROUP BY 
        project
) ep 
ON st.budget_year = ep.budget_year

GROUP BY  st.budget_year,st.project;
