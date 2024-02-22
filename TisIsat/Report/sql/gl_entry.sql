select
account AS "Account:Link/Account:150",
ge.posting_date AS "Date:Date:200",
sum(debit)As "Debit:Currency:120",
sum(credit) AS "Credit:Currency:120",
(sum(debit) - sum(credit)) as "Net:Currency:120"
from `tabGL Entry` ge
WHERE
    ge.posting_date >= %(from_date)s AND ge.posting_date <= %(to_date)s 
group by account