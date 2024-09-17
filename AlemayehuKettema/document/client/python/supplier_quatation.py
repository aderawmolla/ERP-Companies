@frappe.whitelist()
def get_supplier_quotations(request_for_quotation):
    # Fetch Supplier Quotations matching the given RFQ
    supplier_quotations = frappe.get_list('Supplier Quotation', 
                                          filters={'quotation_number': request_for_quotation}, 
                                          fields=['name', 'supplier'])
    
    if not supplier_quotations:
        frappe.throw("No supplier quotations found for the selected request for quotation.")

    items_to_add = []

    for quotation in supplier_quotations:
        # Fetch items for each Supplier Quotation
        items = frappe.get_list('Supplier Quotation Item', 
                                filters={'parent': quotation.name}, 
                                fields=['item_code', 'item_name', 'uom', 'qty', 'rate', 'amount'])

        for item in items:
            items_to_add.append({
                'supplier': quotation.supplier,
                'item_code': item.item_code,
                'item_name': item.item_name,
                'uom': item.uom,
                'quantity': item.qty,
                'rate': item.rate,
                'amount': item.amount
            })
    
    # Return the items to be added to the 'Supplier Quotation Comparison Table 2'
    return items_to_add
