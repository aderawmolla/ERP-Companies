
//in the row there should be Total,Avarage,ADT,

frappe.ui.form.on("Traffic Count Result", {
    finish_count: function (frm, cdt, cdn) {
        calculateStaffs(frm, cdt, cdn, "day",);
        calculateStaffs(frm, cdt, cdn, "night");
        calculateStaffs(frm, cdt, cdn, "two");
        calculateStaffs(frm, cdt, cdn, "seasonal");
        frm.refresh_field("traffic_count_result_table");
        frm.refresh_field("night_time_count");
        frm.refresh_field("two_days_count");
        frm.refresh_field("seasonal_count");
    },
    add_conversion_factor: function (frm, cdt, cdn) {
        console.log("this is excuted")
        console.log(`traffic count table ${frm.doc.traffic_count_result_table}`)

        if (frm.doc.traffic_count_result_table && frm.doc.add_conversion_factor == "1") {
            console.log("excute this");
            var child = frm.add_child("traffic_count_result_table")
            child.date = "Conversion Factor in to PCU";
            console.log(`the added child is ${child}`)
            frm.refresh_field("traffic_count_result_table")
        }
    },
    add__conversion_factor2: function (frm, cdt, cdn) {
        console.log("this is excuted")
        console.log(`traffic count table ${frm.doc.seasonal_count}`)

        if (frm.doc.seasonal_count && frm.doc.add__conversion_factor2== "1") {
            console.log("excute this");
            var child = frm.add_child("seasonal_count")
            child.date = "Conversion Factor in to PCU";
            console.log(`the added child is ${child}`)
            frm.refresh_field("seasonal_count")
        }
    }
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
function calculateRowTotal(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var total = child.car + child.lover + child.s_bus + child.l_bus + child.struck + child.mtruck + child.htruck + child.ttrailor;
    frappe.model.set_value(cdt, cdn, "total", total);
    frm.refresh_field("traffic_count_result_table");
    frm.refresh_field("night_time_count");
    frm.refresh_field("two_days_count");
    frm.refresh_field("seasonal_count");
}

function calculateStaffs(frm, cdt, cdn, whichStaff) {
    console.log("come on")
    var carTotal = 0;
    var LRoverTotal = 0;
    var SBusTotal = 0;
    var LBusTotal = 0;
    var STruckTotal = 0;
    var MTruckTotal = 0;
    var HTruckTotal = 0;
    var TTrailorTotal = 0;
    var TotalTotal = 0;
    var tableDocs;
    var table_field;
    var len;
    var length;
    //grand total
    var GrandcarTotal = 0;
    var GrandLRoverTotal = 0;
    var GrandSBusTotal = 0;
    var GrandLBusTotal = 0;
    var GrandSTruckTotal = 0;
    var GrandMTruckTotal = 0;
    var GrandHTruckTotal = 0;
    var GrandTTrailorTotal = 0;
    var GrandTotalTotal = 0;

    if (whichStaff == "day") {
        //rows to be added at the end
        len = 4;
        table_field = "traffic_count_result_table";
        tableDocs = frm.doc.traffic_count_result_table || [];
        console.log("day time count is ", tableDocs)
        //subtracting conversion factor row
        length = tableDocs.length;
        for (var i = 0; i <= len; i++) {
            frm.add_child(`traffic_count_result_table`)

        }
        refresh_field("traffic_count_result_table");

    }
    else if (whichStaff == "night") {
        len = 1;
        table_field = "night_time_count";
        tableDocs = frm.doc.night_time_count || [];
        //length before adding rows at the end
        length = tableDocs.length;
        for (var i = 0; i <= len; i++) {
            frm.add_child("night_time_count")
        }
        refresh_field("night_time_count");
    }
    else if (whichStaff == "two") {
        console.log("two days")
        len = 1;
        table_field = "two_days_count";
        tableDocs = frm.doc.two_days_count || [];
        //length before adding rows at the end
        length = tableDocs.length;
        for (var i = 0; i <= len; i++) {
            frm.add_child("two_days_count")
        }
        frm.refresh_field("two_days_count");

    }
    else {
        table_field = "seasonal_count";
        tableDocs = frm.doc.seasonal_count || [];
        //length before adding rows at the end
        length = tableDocs.length;
        len = 1;
        for (var i = 0; i <= len; i++) {
            frm.add_child("seasonal_count")
            frm.refresh_field("seasonal_count");
        }
    }
    console.log("does this excuted")
    frm.refresh_field("traffic_count_result_table");
    frm.refresh_field("night_time_count");
    frm.refresh_field("two_days_count");
    frm.refresh_field("seasonal_count");
    //calculating the sum
    var CFcar;
    var CFlover;
    var CFsBus;
    var CFlBus;
    var CFsTruck;
    var CFmTruck;
    var CFhTruck;
    var CFtTraitor;
    var CFtotal;
    $.each(tableDocs, function (i, d) {
        if (i == length - 1 && whichStaff == "day" ||whichStaff=="seasonal") {
            //skiping to add the conversion factor row in the context
            console.log("cf index is ", length - 1)
            CFcar = d.car;
            CFlover = d.lover;
            CFsBus = d.s_bus;
            CFlBus = d.l_bus;
            CFsTruck = d.struck;
            CFmTruck = d.mtruck;
            CFhTruck = d.htruck;
            CFtTraitor = d.ttrailor;
            CFtotal = d.total;
            console.log("CF factors", CFcar, CFlBus,)
        }
        {
            console.log("excute this")
            carTotal += d.car;
            LRoverTotal += d.lover;
            SBusTotal += d.s_bus;
            LBusTotal += d.l_bus;
            STruckTotal += d.struck;
            MTruckTotal += d.mtruck;
            HTruckTotal += d.htruck;
            TTrailorTotal += d.ttrailor;
            TotalTotal += d.total;
            //calculating grand total
        }

    });
    GrandcarTotal = carTotal * CFlover
    GrandLRoverTotal = LRoverTotal * CFlover
    GrandSBusTotal = SBusTotal * CFlBus
    GrandLBusTotal = LBusTotal * CFlBus
    GrandSTruckTotal = STruckTotal * CFsTruck
    GrandMTruckTotal = MTruckTotal * CFmTruck
    GrandHTruckTotal = HTruckTotal * CFhTruck
    GrandTTrailorTotal = TTrailorTotal * CFtTraitor
    GrandTotalTotal = TotalTotal * CFtotal
    ///////////////////////
    carTotal -= CFcar;
    LRoverTotal -= CFlover;
    SBusTotal -= CFsBus;
    LBusTotal -= CFlBus;
    STruckTotal -= CFsTruck;
    MTruckTotal -= CFmTruck;
    HTruckTotal -= CFhTruck;
    TTrailorTotal -= CFtTraitor;
    TotalTotal -= CFtotal;

    ///updating the table fields
    
       
            
    
        console.log("the total sum is", tableDocs[length],)
        tableDocs[length].date = "Total SUm OF Column A";
        tableDocs[length].car = carTotal;
        tableDocs[length].lover = LRoverTotal;
        tableDocs[length].s_bus = SBusTotal;
        tableDocs[length].l_bus = LBusTotal;
        tableDocs[length].mtruck = MTruckTotal;
        tableDocs[length].htruck = HTruckTotal;
        tableDocs[length].ttrailor = TTrailorTotal;
        tableDocs[length].total = TotalTotal;
        //avarage
        tableDocs[length + 1].date = "Avarage(D=A/7)";
        tableDocs[length + 1].car = carTotal / length - 1
        tableDocs[length + 1].lover = LRoverTotal / length - 1
        tableDocs[length + 1].s_bus = SBusTotal / length - 1
        tableDocs[length + 1].l_bus = LBusTotal / length - 1;
        tableDocs[length + 1].mtruck = MTruckTotal / length - 1;
        tableDocs[length + 1].htruck = HTruckTotal / length - 1;
        tableDocs[length + 1].ttrailor = TTrailorTotal / length - 1;
        tableDocs[length + 1].total = TotalTotal / length - 1;

    

    //nfc
    if (whichStaff == "day") {
        //update again
        console.log("in the first section",)
        tableDocs[length + 1].date = "Grand Total=TOTAL*Convertion Factor in to PCU";
        tableDocs[length + 1].car = GrandcarTotal
        tableDocs[length + 1].lover = GrandLRoverTotal;
        tableDocs[length + 1].s_bus = GrandSBusTotal;
        tableDocs[length + 1].l_bus = GrandLBusTotal;
        tableDocs[length + 1].mtruck = GrandMTruckTotal;
        tableDocs[length + 1].htruck = GrandHTruckTotal;
        tableDocs[length + 1].ttrailor = GrandTTrailorTotal;
        tableDocs[length + 1].total = GrandTotalTotal;

        //best fit
        tableDocs[length + 2].date = "Avarage(D=A/7)";
        tableDocs[length + 2].car = GrandcarTotal / (length - 1);
        tableDocs[length + 2].lover = GrandLRoverTotal / (length - 1);
        tableDocs[length + 2].s_bus = GrandSBusTotal / (length - 1);
        tableDocs[length + 2].l_bus = GrandLBusTotal / (length - 1);
        tableDocs[length + 2].mtruck = GrandMTruckTotal / (length - 1);
        tableDocs[length + 2].htruck = GrandHTruckTotal / (length - 1);
        tableDocs[length + 2].ttrailor = GrandTTrailorTotal / (length - 1);
        tableDocs[length + 2].total = GrandTotalTotal / (length - 1);
        //t
        tableDocs[length + 3].date = "N.F(E=(B+C)/C)";
        tableDocs[length + 3].car = carTotal / length;
        tableDocs[length + 3].lover = LRoverTotal / length;
        tableDocs[length + 3].s_bus = SBusTotal / length;
        tableDocs[length + 3].l_bus = LBusTotal / length;
        tableDocs[length + 3].mtruck = MTruckTotal / length;
        tableDocs[length + 3].htruck = HTruckTotal / length;
        tableDocs[length + 3].ttrailor = TTrailorTotal / length;
        tableDocs[length + 3].total = TotalTotal / length;
        //

        tableDocs[length + 4].date = "A.D.T(E*D)";
        tableDocs[length + 4].car = carTotal / length;
        tableDocs[length + 4].lover = LRoverTotal / length;
        tableDocs[length + 4].s_bus = SBusTotal / length;
        tableDocs[length + 4].l_bus = LBusTotal / length;
        tableDocs[length + 4].mtruck = MTruckTotal / length;
        tableDocs[length + 4].htruck = HTruckTotal / length;
        tableDocs[length + 4].ttrailor = TTrailorTotal / length;
        tableDocs[length + 4].total = TotalTotal / length;
    }
    if (whichStaff == "seasonal") {
        console.log("this is excuted well")
        console.log("in the first section",)
        tableDocs[length].date = "Average of ADT seasonal  counts";
        tableDocs[length].car = GrandcarTotal / (length - 1);
        tableDocs[length].lover = GrandLRoverTotal / (length - 1);
        tableDocs[length].s_bus = GrandSBusTotal / (length - 1);
        tableDocs[length].l_bus = GrandLBusTotal / (length - 1);
        tableDocs[length].mtruck = GrandMTruckTotal / (length - 1);
        tableDocs[length].htruck = GrandHTruckTotal / (length - 1);
        tableDocs[length].ttrailor = GrandTTrailorTotal / (length - 1);
        tableDocs[length].total = GrandTotalTotal / (length - 1);
        //best fit
        tableDocs[length+1].date = "AADT";
        tableDocs[length+1].car=tableDocs[length].car* CFcar
        tableDocs[length+1].lover= tableDocs[length].lover*CFlover
        tableDocs[length+1].s_bus=tableDocs[length].s_bus*CFsBus
        tableDocs[length+1].l_bus=tableDocs[length].l_bus*CFlBus
        tableDocs[length+1].mtruck=tableDocs[length].mtruck*CFmTruck
        tableDocs[length+1].htruck=tableDocs[length].htruck*CFhTruck
        tableDocs[length+1].ttrailor=tableDocs[length].ttrailor*CFtTraitor
        tableDocs[length+1].total=tableDocs[length].total*CFtotal
    }
    frm.refresh_field("traffic_count_result_table");
    frm.refresh_field("night_time_count");
    frm.refresh_field("two_days_count");
    frm.refresh_field("seasonal_count");
}
