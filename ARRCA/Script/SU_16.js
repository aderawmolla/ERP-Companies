
var routine;
var periodic;
var ownForce;//outsource
frappe.ui.form.on('Su 2016', {
    onload: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Type of Road Maintainance',
                fields: ['*']
            },
            callback: function (response) {
                  console.log("response",response) 
                  var res=response.message; 
                  var length=res.length
                  for(var i=0;i<length;i++){
                 if(res[i].name=="መደበኛ ጥገና በሌንግዝ ፐርሰን"){
                     ownForce=res[i].cost_per_km
                    }
                    else  if(res[i].name=="መደበኛ ጥገና በመሣሪያ"){
                        routine=res[i].cost_per_km
                    }
                       else  if(res[i].name=="ወቅታዊ ጥገና"){
                        periodic=res[i].cost_per_km
                       }
                       else{

                       }
                    
                  }      
            }
        });
    },
    
});
frappe.ui.form.on('Su 16 Table', {
    data1: function(frm,cdt,cdn) {
    var child=locals[cdt][cdn]
       calTotalKm(frm,child)
       calTotalBirr(frm,child)
    } ,
    data2: function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
       calTotalKm(frm,child)
       calTotalBirr(frm,child)
    } ,
    data3: function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        calTotalKm(frm,child)
        calTotalBirr(frm,child)
 
    },
    
    data44: function(frm,cdt,cdn) {
        var child=locals[cdt][cdn]
        calTotalBirr(frm,child)

    } 

});

function calTotalKm(frm,child){
 var totalKm=(child.data1||0)+(child.data2||0)+(child.data3||0)
 child.total_km=totalKm
 frm.refresh_field("su_table")
 child.data11=child.data1*routine
 child.data22=child.data2*ownForce
 child.data33=child.data3*periodic
 frm.refresh_field("su_table")

}
function calTotalBirr(frm,child){

    var totalBirr=(child.data11||0)+(child.data22||0)+(child.data33||0)+(child.data44||0)
    child.total_birr=totalBirr
    frm.refresh_field("su_table")
}