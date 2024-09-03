
// current user
frappe.ui.form.on('Tyre Control Card', {
    onload: function(frm) {
     frappe.call({
      method: 'frappe.client.get_value',
      args: {
       doctype: 'User',
       filters: { name: frappe.session.user },
       fieldname: ['full_name']
      },
      callback: function(response) {
       var user = response.message;
       if (user) {
        frm.set_value('encoded_by', user.full_name);
       }
      }
     });
    }
   });