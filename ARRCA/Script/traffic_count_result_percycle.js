
frappe.ui.form.on("Traffic Count Result Percycle", {
    finish_count: function (frm, cdt, cdn) {
        frm.refresh_field("traffic_count_result_table");
        frm.refresh_field("night_time_count");
        frm.refresh_field("two_days_count");
        frm.refresh();     
    },
    avarage_cycle1_day: function (frm, cdt, cdn) {
        calculateAvarage(frm, "traffic_count_result_table",7);
    },
    avarage_cycle1_night: function (frm, cdt, cdn) {
        calculateAvarage(frm,"night_time_count",2);
    },
    avarage_cycle1_2day: function (frm, cdt, cdn) {
        calculateAvarage(frm, "two_days_count",2);
    },
    adt_1:function(frm,cdt,cdn){
         if(frm.doc.adt_1 && frm.doc.adt_1=="1"){
            calculateADT(frm,"1");
         } 
    },
   
    add_conversion_factor_day_1: function (frm, cdt, cdn) {
        if (frm.doc.traffic_count_result_table && frm.doc.add_conversion_factor_day_1 == "1") {
            console.log("excute this");
            var child = frm.add_child("traffic_count_result_table")
            child.date = "Conversion Factor in to PCU";
            console.log(`the added child is ${child}`)
            frm.refresh_field("traffic_count_result_table")
        }
    }, 
});
frappe.ui.form.on("Traffic Count Result Table", {
    car: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    lover: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    s_bus: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    l_bus: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    lover: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    struck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);

    },
    mtruck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);

    },
    htruck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    ttrailor: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
});
frappe.ui.form.on("Two Days Count", {
    car: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    lover: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    s_bus: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    l_bus: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    lover: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    struck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);

    },
    mtruck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);

    },
    htruck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    ttrailor: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);

    },
});
frappe.ui.form.on("Night Time Count", {
    car: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    lover: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    s_bus: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    l_bus: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    lover: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    struck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);

    },
    mtruck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);

    },
    htruck: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);
    },
    ttrailor: function (frm, cdt, cdn) {
        calculateRowTotal(frm, cdt, cdn);

    },
});


///
function calculateRowTotal(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var total = child.car + child.lover + child.s_bus + child.l_bus + child.struck + child.mtruck + child.htruck + child.ttrailor;
    frappe.model.set_value(cdt, cdn, "total", total);
    frm.refresh_field("traffic_count_result_table");
    frm.refresh_field("night_time_count");
    frm.refresh_field("two_days_count");
    frm.refresh_field("seasonal_count");
}

function calculateAvarage(frm,child,dividened) {
    var carTotal = 0;
    var LRoverTotal = 0;
    var SBusTotal = 0;
    var LBusTotal = 0;
    var STruckTotal = 0;
    var MTruckTotal = 0;
    var HTruckTotal = 0;
    var TTrailorTotal = 0;
    var TotalTotal = 0;
    var lastArray=(frm.doc[child].length)-1;
    $.each(frm.doc[child], function(i, d) {
         //to escape adding the last column
        if(dividened=="7" && i=="7"){
        console.log("esc conversion factor here")
        }
        else{
            carTotal += d.car;
            LRoverTotal += d.lover;
            SBusTotal += d.s_bus;
            LBusTotal += d.l_bus;
            STruckTotal += d.struck;
            MTruckTotal += d.mtruck;
            HTruckTotal += d.htruck;
            TTrailorTotal += d.ttrailor;
            TotalTotal += d.total;
        }
        
    }); 

    if(dividened=="7"){
        var GrandcarTotal = frm.doc[child][lastArray].car*carTotal;
        var GrandLRoverTotal = frm.doc[child][lastArray].lover*LRoverTotal;
        var GrandSBusTotal = frm.doc[child][lastArray].s_bus*SBusTotal;
        var GrandLBusTotal = frm.doc[child][lastArray].l_bus*LBusTotal;
        var GrandSTruckTotal = frm.doc[child][lastArray].struck*STruckTotal;
        var GrandMTruckTotal = frm.doc[child][lastArray].mtruck*MTruckTotal;
        var GrandHTruckTotal = frm.doc[child][lastArray].htruck*HTruckTotal;
        var GrandTTrailorTotal = frm.doc[child][lastArray].ttrailor*TTrailorTotal;
        var GrandTotalTotal = GrandcarTotal + GrandLRoverTotal + GrandSBusTotal +GrandLBusTotal + GrandSTruckTotal + GrandMTruckTotal + GrandHTruckTotal + GrandTTrailorTotal;
        var row=frm.add_child(child)
        row.date="Avarage";
        row.car = GrandcarTotal /dividened ;
        row.lover = GrandLRoverTotal /dividened;
        row.s_bus = GrandSBusTotal / dividened;
        row.struck=GrandSTruckTotal/dividened;
        row.l_bus = GrandLBusTotal /dividened;
        row.mtruck = GrandMTruckTotal /dividened;
        row.htruck = GrandHTruckTotal /dividened;
        row.ttrailor = GrandTTrailorTotal /dividened;
        row.total = GrandTotalTotal /dividened;
        frm.refresh_field(child)
    }
    else{ 
        var row=frm.add_child(child)
        row.date="Avarage";
        row.car =  carTotal/dividened ;
        row.lover = LRoverTotal/dividened;
        row.s_bus = SBusTotal / dividened;
        row.struck= STruckTotal/dividened;
        row.l_bus = LBusTotal /dividened;
        row.mtruck = MTruckTotal/dividened;
        row.htruck =  HTruckTotal/dividened;
        row.ttrailor =TTrailorTotal/dividened;
        row.total = TotalTotal/dividened;
        frm.refresh_field(child)
     }
  
}
function calculateADT(frm, cycle) {
    console.log("night time count calculated");
    var NFcar;
    var NFlover;
    var NFsBus;
    var NFlBus;
    var NFsTruck;
    var NFmTruck;
    var NFhTruck;
    var NFtTraitor;
    var NFtotal;
    var dayLengthLastArray;
    var nightLengthLastArray;
    var night_time_count;
    var two_days_count;
    var table;

    if (cycle == "1") {
        night_time_count = "night_time_count";  // Fixing typo
        two_days_count = "two_days_count";
        table = "traffic_count_result_table";
    } else if (cycle == "2") {
        night_time_count = "night__time_count2";
        two_days_count = "two_days_count2";
        table = "traffic_count_result_table2";
    } else {
        night_time_count = "night__time_count3";
        two_days_count = "two_days_count3";
        table = "traffic_count_result_table3";
    }
    nightLengthLastArray = frm.doc[night_time_count].length - 1;
    dayLengthLastArray = frm.doc[two_days_count].length - 1;
    NFcar = (frm.doc[night_time_count][nightLengthLastArray].car + frm.doc[two_days_count][nightLengthLastArray].car) / frm.doc[two_days_count].length;
    NFlover = (frm.doc[night_time_count][nightLengthLastArray].lover + frm.doc[two_days_count][nightLengthLastArray].lover) / frm.doc[two_days_count].length;
    NFsBus = (frm.doc[night_time_count][nightLengthLastArray].s_bus + frm.doc[two_days_count][nightLengthLastArray].s_bus) / frm.doc[two_days_count].length;
    NFlBus = (frm.doc[night_time_count][nightLengthLastArray].l_bus + frm.doc[two_days_count][nightLengthLastArray].l_bus) / frm.doc[two_days_count].length;
    NFsTruck = (frm.doc[night_time_count][nightLengthLastArray].struck + frm.doc[two_days_count][nightLengthLastArray].struck) / frm.doc[two_days_count].length;
    NFmTruck = (frm.doc[night_time_count][nightLengthLastArray].mtruck + frm.doc[two_days_count][nightLengthLastArray].mtruck) / frm.doc[two_days_count].length;
    NFhTruck = (frm.doc[night_time_count][nightLengthLastArray].htruck + frm.doc[two_days_count][nightLengthLastArray].htruck) / frm.doc[two_days_count].length;
    NFtTraitor = (frm.doc[night_time_count][nightLengthLastArray].ttrailor + frm.doc[two_days_count][nightLengthLastArray].ttrailor) / frm.doc[two_days_count].length;
    NFtotal = (frm.doc[night_time_count][nightLengthLastArray].total + frm.doc[two_days_count][nightLengthLastArray].total) / frm.doc[two_days_count][nightLengthLastArray].total;
    console.log("calculated adt is ", NFcar, NFlover);
    var last = frm.doc[table].length - 1;
    var adtRow = frm.doc[table][last];
    var nf=frm.add_child(table)
    nf.date = "NF";
    nf.car = NFcar;
    nf.lover =  NFlover;  // Fixing typo
    nf.s_bus = NFsBus;
    nf.struck = NFsTruck;
    nf.l_bus = NFlBus;
    nf.mtruck = NFmTruck;
    nf.htruck =  NFhTruck;
    nf.ttrailor =  NFtTraitor;
    nf.total = NFtotal;
     ///
    var totalofThis=adtRow.total * NFtotal;
    var row = frm.add_child(table);
    row.date = "ADT";
    row.car = adtRow.car * NFcar;
    row.lover = adtRow.lover * NFlover;  // Fixing typo
    row.s_bus = adtRow.s_bus * NFsBus;
    row.struck = adtRow.struck * NFsTruck;
    row.l_bus = adtRow.l_bus * NFlBus;
    row.mtruck = adtRow.mtruck * NFmTruck;
    row.htruck = adtRow.htruck * NFhTruck;
    row.ttrailor = adtRow.ttrailor * NFtTraitor;
    row.total = adtRow.total * NFtotal;
    var totalofThis=adtRow.total * NFtotal;
    frm.set_value("adt",totalofThis)
    frm.refresh_field("adt")
    frm.refresh_field(table);
    frm.refresh()
}
  