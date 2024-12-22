# -*- coding: utf-8 -*-
import frappe
from frappe import _

def execute(filters=None):
    columns, suppliers = get_columns(filters)
    if not suppliers:
        return columns, []

    data, winner, active_suppliers = get_data(suppliers, filters)
    columns = filter_columns(columns, active_suppliers)

    return columns, data, winner

def get_columns(filters):
    # Define static columns
    columns = [
        {"label": _("የዕቃው ኮድ"), "fieldname": "item_code", "fieldtype": "Data", "width": 150},
        {"label": _("የዕቃው አይነት"), "fieldname": "item_name", "fieldtype": "Data", "width": 150},
        {"label": _("መለኪያ"), "fieldname": "uom", "fieldtype": "Data", "width": 80},
        {"label": _("ብዛት"), "fieldname": "qty", "fieldtype": "Int", "width": 80}
    ]

    # Construct where clause for suppliers
    where_clause = ""
    if filters and filters.get("rq"):
        where_clause = "WHERE req_qutation = '{0}'".format(filters["rq"])

    # Get distinct supplier names dynamically
    suppliers = frappe.db.sql("SELECT DISTINCT supplier FROM `tabSupplier Quotation` {0}".format(where_clause), as_dict=True)
    supplier_list = [supplier['supplier'] for supplier in suppliers]

    for supplier in supplier_list:
        columns.append({"label": _("{0}".format(supplier)), "fieldname": "{0}_unit_price_with_vat".format(supplier), "fieldtype": "Currency", "width": 100})

    # Add columns for smallest unit price, total cost, supplier with smallest amount, and winner
    columns.extend([
        {"label": _("ዝቅተኛ ዋጋ"), "fieldname": "smallest_unit_price_with_vat", "fieldtype": "Currency", "width": 100},
        {"label": _("ጠቅላላ ዋጋ"), "fieldname": "total_cost", "fieldtype": "Currency", "width": 150},
        {"label": _("የተመረጠው ድርጅት"), "fieldname": "smallest_amount_supplier", "fieldtype": "Data", "width": 150},
        {"label": _("Winner by Total Cost"), "fieldname": "winner", "fieldtype": "Data", "width": 150}
    ])

    return columns, supplier_list

def get_data(suppliers, filters):
    data = []
    supplier_totals = {supplier: 0 for supplier in suppliers}
    active_suppliers = set()
    
    # Construct where clause
    where_clause = ""
    if filters and filters.get("rq"):
        where_clause = "WHERE p.req_qutation = '{0}'".format(filters["rq"])
    
    # Fetch data with the where clause
    quotations = frappe.db.sql("""
        SELECT
            c.item_code,
            c.item_name,
            c.uom,
            c.qty,
            p.supplier,
            c.unit_price_with_vat
        FROM
            `tabSupplier Quotation` p
        INNER JOIN
            `tabSupplier Quotation Item` c ON p.name = c.parent
        {0}
    """.format(where_clause), as_dict=True)

    if not quotations:
        return data, None, []

    # Pivot data
    item_data = {}
    for quotation in quotations:
        key = (quotation.item_code, quotation.item_name, quotation.uom, quotation.qty)
        if key not in item_data:
            item_data[key] = {
                "item_code": quotation.item_code,
                "item_name": quotation.item_name,
                "uom": quotation.uom,
                "qty": quotation.qty,
                "smallest_unit_price_with_vat": None,
                "smallest_amount_supplier": None,
                "total_cost": None
            }
            for supplier in suppliers:
                item_data[key]["{0}_unit_price_with_vat".format(supplier)] = 0

        item_data[key]["{0}_unit_price_with_vat".format(quotation.supplier)] = quotation.unit_price_with_vat

        # Track active suppliers
        if quotation.unit_price_with_vat > 0:
            active_suppliers.add(quotation.supplier)

        # Calculate the smallest unit price with VAT and the corresponding supplier
        if item_data[key]["smallest_unit_price_with_vat"] is None or (quotation.unit_price_with_vat > 0 and quotation.unit_price_with_vat < item_data[key]["smallest_unit_price_with_vat"]):
            item_data[key]["smallest_unit_price_with_vat"] = quotation.unit_price_with_vat
            item_data[key]["smallest_amount_supplier"] = quotation.supplier
            item_data[key]["total_cost"] = quotation.qty * quotation.unit_price_with_vat

        # Add to the supplier's total
        supplier_totals[quotation.supplier] += quotation.qty * quotation.unit_price_with_vat

    # Convert to list of dictionaries
    for key, value in item_data.items():
        data.append(value)

    # Determine the winner by total cost
    winner = min(supplier_totals, key=supplier_totals.get) if supplier_totals else None
    
    # Add winner information to each item
    for item in data:
        item['winner'] = winner

    return data, winner, list(active_suppliers)

def filter_columns(columns, active_suppliers):
    # Filter out suppliers with zero amounts
    new_columns = []
    for col in columns:
        if col['fieldname'].replace('_unit_price_with_vat', '') in active_suppliers or not col['fieldname'].endswith('_unit_price_with_vat'):
            new_columns.append(col)
    return new_columns