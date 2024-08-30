frappe.ui.form.on('Stock Entry', {
    refresh: function(frm) {
        // filter material request by mr_no
        frm.fields_dict['mr_no'].get_query = function(doc) {
            return {
                filters: {
                    'docstatus': 1
                }
            };
        };
    }
});