@frappe.whitelist()
def cancelJournal(name):
    try:
        # Check if the Journal Entry exists and is in 'Submitted' status (docstatus = 1)
        journal_entry = frappe.db.sql("""
            SELECT name FROM `tabJournal Entry`
            WHERE name = %s AND docstatus = 1
        """, (name,), as_dict=True)
        
        if journal_entry:
            # Prepare the SQL query to update the docstatus to 2 (Cancelled)
            sql = """
                UPDATE `tabJournal Entry`
                SET docstatus = 2
                WHERE name = %s AND docstatus = 1;
            """
            
            # Execute the SQL query with the journal entry ID
            frappe.db.sql(sql, (name,))
            
            # Commit the transaction to the database
            frappe.db.commit()
            
            # frappe.msgprint("Journal Entry '{}' has been cancelled successfully.".format(name))
        else:
            frappe.msgprint("Journal Entry '{}' was not found or is already cancelled.".format(name))
    
    except Exception as z:
        frappe.log_error(message=str(e), title="Error updating Journal Entry docstatus")
        frappe.msgprint("Error: {}".format(e))
