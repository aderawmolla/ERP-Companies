frappe.ui.form.on('Asset', {
    final_depreciation_value: function(frm) {
        if(frm.doc.final_depreciation_value && frm.doc.depreciation_method && frm.doc.frequency_of_depreciation && frm.doc.percentage_of_depreciation && frm.doc.gross_purchase_amount){
          calculateDepreciationNumber(frm);
        }
    }
  });

  var bookValue;
  var numberOfDepreciation=0;
  var percentageValue;
  var first=0;
  function calculateDepreciationNumber(frm){
    console.log("excute this function")
    var depreciatedValue;
     if(first==0){
      first++
      bookValue=frm.doc.gross_purchase_amount
      percentageValue=frm.doc.percentage_of_depreciation/100
     }
    if(frm.doc.depreciation_method=="Straight Line"){
        console.log("straight line")
        depreciatedValue=bookValue*percentageValue;
        bookValue=bookValue-depreciatedValue
        if(bookValue>frm.doc.final_depreciation_value){
         console.log("Book Value",bookValue)
         numberOfDepreciation++ 
         console.log("number of depreciation",numberOfDepreciation)
         percentageValue+=frm.doc.percentage_of_depreciation/100
         calculateDepreciationNumber(frm,"Straight Line",percentageValue)  
        }
        else{
          console.log("number of depreciation",numberOfDepreciation)
          frm.set_value("total_number_of_depreciations",parseInt(numberOfDepreciation))
          frm.refresh_field("total_number_of_depreciations")  
        }
    }
    else if("Double Declining Balance"){
        console.log("pooling")
        depreciatedValue=frm.doc.gross_purchase_amount*percentageValue;
        bookValue=bookValue-depreciatedValue
        if(bookValue>frm.doc.final_depreciation_value){
         console.log("Book Value",bookValue)
         numberOfDepreciation++ 
         console.log("number of depreciation",numberOfDepreciation)
         percentageValue+=frm.doc.percentage_of_depreciation/100
         calculateDepreciationNumber(frm,"Straight Line",percentageValue)  
        }
        else{
          console.log("number of depreciation",numberOfDepreciation)
          frm.set_value("total_number_of_depreciations",parseInt(numberOfDepreciation))
          frm.refresh_field("total_number_of_depreciations")  
        }

    }
    else{

    }
  }