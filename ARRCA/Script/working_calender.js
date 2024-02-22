frappe.ui.form.on ('Calender Table', {
    data1: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data2: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data3: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data4: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data5: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data6: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data7: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data8: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data9: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    data10: function (frm,cdt,cdn) {
      var child = locals[cdt][cdn];
      calculateTotal (child, frm);
    },
    act:function(frm,cdt,cdn){
     var child=locals[cdt][cdn]
     if(child.act=="Working Day Available"){
      workingDays(frm,child);
     }

    }
  });
  function calculateTotal (child, frm) {
  console.log("excute this function")
  var total=0;
  for(var i=1;i<=10;i++){
   total+=parseFloat(child[`data${i}`]||0)
  }
  child.total=total
  frm.refresh_field("calender_table")
  }
  function workingDays(frm,child){
  var  workingRow;
   var data1=0;
   var data2=0;
   var data3=0;
   var data4=0;
   var data5=0;
   var data6=0;
   var data7=0;
   var data8=0;
   var data9=0
   var data10=0;
    $.each(frm.doc.calender_table, function(i, row) {
       if(row.act=="Calender Day") {
        workingRow=row
       } 
      else{
        for(var j=1;j<=10;j++){
          window[`data${j}`] += parseFloat(row[`data${j}`] || 0);

        }
        
         
       }
    });

    for(var k=1;k<=10;k++){
      child[`data${k}`] = parseFloat(workingRow[`data${k}`]) - (parseFloat(window[`data${k}`])||0);

    }
    var total=0;
    for(var k=0;k<=10;k++){
     total+=parseFloat(window[`data${k}`])||0
    }
    child.total=total
    frm.refresh_field("calender_table")

  }
  