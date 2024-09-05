Traceback (most recent call last):
  File "/home/frappe/frappe-bench/apps/frappe/frappe/desk/form/save.py", line 43, in cancel
    doc.cancel()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 853, in cancel
    self._cancel()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 843, in _cancel
    self.save()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 260, in save
    return self._save(*args, **kwargs)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 313, in _save
    self.run_post_save_methods()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 911, in run_post_save_methods
    self.check_no_back_links_exist()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 999, in check_no_back_links_exist
    check_if_doc_is_linked(self, method="Cancel")
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/delete_doc.py", line 190, in check_if_doc_is_linked
    ["name", "parent", "parenttype", "docstatus"], as_dict=True):
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database.py", line 535, in get_values
    out = self._get_values_from_table(fields, filters, doctype, as_dict, debug, order_by, update)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database.py", line 677, in _get_values_from_table
    as_dict=as_dict, debug=debug, update=update)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database.py", line 199, in sql
    self._cursor.execute(query, values)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/cursors.py", line 170, in execute
    result = self._query(query)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/cursors.py", line 328, in _query
    conn.query(q)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 517, in query
    self._affected_rows = self._read_query_result(unbuffered=unbuffered)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 732, in _read_query_result
    result.read()
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 1075, in read
    first_packet = self.connection._read_packet()
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 657, in _read_packet
    packet_header = self._read_bytes(4)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 707, in _read_bytes
    CR.CR_SERVER_LOST, "Lost connection to MySQL server during query")
OperationalError: (2013, 'Lost connection to MySQL server during query')

Traceback (most recent call last):
  File "/home/frappe/frappe-bench/apps/frappe/frappe/app.py", line 61, in application
    response = frappe.handler.handle()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/handler.py", line 21, in handle
    data = execute_cmd(cmd)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/handler.py", line 56, in execute_cmd
    return frappe.call(method, **frappe.form_dict)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/__init__.py", line 1032, in call
    return fn(*args, **newargs)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/desk/form/save.py", line 43, in cancel
    doc.cancel()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 853, in cancel
    self._cancel()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 843, in _cancel
    self.save()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 260, in save
    return self._save(*args, **kwargs)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 313, in _save
    self.run_post_save_methods()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 911, in run_post_save_methods
    self.check_no_back_links_exist()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/document.py", line 999, in check_no_back_links_exist
    check_if_doc_is_linked(self, method="Cancel")
  File "/home/frappe/frappe-bench/apps/frappe/frappe/model/delete_doc.py", line 190, in check_if_doc_is_linked
    ["name", "parent", "parenttype", "docstatus"], as_dict=True):
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database.py", line 535, in get_values
    out = self._get_values_from_table(fields, filters, doctype, as_dict, debug, order_by, update)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database.py", line 677, in _get_values_from_table
    as_dict=as_dict, debug=debug, update=update)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database.py", line 199, in sql
    self._cursor.execute(query, values)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/cursors.py", line 170, in execute
    result = self._query(query)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/cursors.py", line 328, in _query
    conn.query(q)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 517, in query
    self._affected_rows = self._read_query_result(unbuffered=unbuffered)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 732, in _read_query_result
    result.read()
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 1075, in read
    first_packet = self.connection._read_packet()
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 657, in _read_packet
    packet_header = self._read_bytes(4)
  File "/home/frappe/frappe-bench/env/local/lib/python2.7/site-packages/pymysql/connections.py", line 707, in _read_bytes
    CR.CR_SERVER_LOST, "Lost connection to MySQL server during query")
OperationalError: (2013, 'Lost connection to MySQL server during query')

Traceback (most recent call last):
  File "/home/frappe/frappe-bench/apps/frappe/frappe/app.py", line 61, in application
    response = frappe.handler.handle()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/handler.py", line 21, in handle
    data = execute_cmd(cmd)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/handler.py", line 56, in execute_cmd
    return frappe.call(method, **frappe.form_dict)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/__init__.py", line 1032, in call
    return fn(*args, **newargs)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/desk/form/load.py", line 77, in getdoctype
    frappe.response.docs.extend(docs)
AttributeError: 'NoneType' object has no attribute 'extend'