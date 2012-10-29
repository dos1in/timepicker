timepicker
==========

A time picker component built using JavaScript.(时间选择器组件)

Useage
==========
    var test1 = new Timepicker({
            cont: "container",  // div id
            name: "time1",      // input name
            showTime : "11:10:59", // Initialization time
            openSec : true      // default value : false
    });
    test1.show();


    // two timepicker components, enable compare mode
    var test1 = new Timepicker({
            cont: "container",
            name: "time1",
            showTime : "11:10:59",
            openSec : true
    });

    var test2 = new Timepicker({
        cont: "container2",
        name: "time2",
        openSec : true
    });

    test1.setCompareProps({gObj: test2 , mode: "<"});
    test2.setCompareProps({gObj: test1 , mode: ">"});

    test1.show();
    test2.show();
