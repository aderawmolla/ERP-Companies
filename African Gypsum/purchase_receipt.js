frappe.ui.form.on('Purchase Receipt', {
    onload: function (frm) {
        console.log("return excuted")
         if(frm.doc.is_return=="1" && frm.is_new()){
            frm.set_value("naming_series","MAT-PR-RET-.YYYY.-")
            frm.refresh_field("naming_series")
         }


    },
    is_return:function(frm){
        console.log("return excuted")
         if(frm.doc.is_return=="1"){
            frm.set_value("naming_series","MAT-PR-RET-.YYYY.-")
            frm.refresh_field("naming_series")
         }
    }
});
