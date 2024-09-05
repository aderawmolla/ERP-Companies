Traceback (most recent call last):
  File "/home/frappe/frappe-bench/apps/frappe/frappe/app.py", line 61, in application
    response = frappe.handler.handle()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/handler.py", line 21, in handle
    data = execute_cmd(cmd)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/handler.py", line 56, in execute_cmd
    return frappe.call(method, **frappe.form_dict)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/__init__.py", line 1032, in call
    return fn(*args, **newargs)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/desk/form/load.py", line 78, in getdoctype
    frappe.response.docs.extend(docs)
AttributeError: 'NoneType' object has no attribute 'extend'