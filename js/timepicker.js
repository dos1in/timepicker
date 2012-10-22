/*
 * A time picker component built using JavaScript.
 * Licensed under the MIT.
 * Copyright (c) 2012 DosLin
 * @name     timePicker
 * @author   DosLin (http://ijava.me doslin.com)
 */

/**
 * 时间选择器组件构造函数
 * @param options
 * @constructor
 */
function Timepicker(options) {
    if(options) {
        this.container = options.cont || null;
        this.inputName = options.name || null;

        this.openSec = options.openSec || false;
        this.showTime = options.showTime || null;
    }

    if(this.container === null || this.inputName === null) {
        alert("Missing Required Arguments!");
        throw (new Error(-1, "Missing Required Arguments!"));
    }

    this.timeCtrlBtns = {
        hourBtns : {
            upBtn : null,
                downBtn : null
        },

        minBtns : {
            upBtn : null,
                downBtn : null
        },

        secBtns : {
            upBtn : null,
                downBtn : null
        }
    };

}

//TODO:添加12小时制;添加IE下鼠标进入手型样式;时间调整提示;输入框失去焦点时验证时间;table更改为div布局;添加禁用时间功能
Timepicker.prototype = {
    constructor: Timepicker,
    version: "0.0.1",

    openSec: false,

    /**
     * 根据配置初始化时间
     */
    initTime : function() {
        var o = this;
        if(o.showTime) {
            var inputVals = o.showTime.split(":");

            var btns = o.timeCtrlBtns;

            if(o.openSec) {
                if(inputVals.length !== 3) {
                    alert("Time Format Error!");
                    throw (new Error(-1, "Time Format Error!"));
                }
                var sInput = btns.secBtns.module;
                sInput.value = inputVals[2];
            }
            if(o.openSec===false && inputVals.length !== 2) {
                alert("Time Format Error!");
                throw (new Error(-1, "Time Format Error!"));
            }
            var hInput = btns.hourBtns.module;
            var mInput = btns.minBtns.module;

            hInput.value = inputVals[0];
            mInput.value = inputVals[1];
            o.hiInput.value = o.showTime;
        }
    },

    /**
     * 时间改变时的回调函数
     */
    onTimeChange : function() {
        var o = this;
        var time = o.getTime();
        o.hiInput.value = o.getHMS(time);
    },

    /**
     * 创建并得到隐藏时间输入表单
     */
    getHiddenInput : function(){
        var o = this;
        if(o.hiInput) {
            return;
        }
        var hiInput = o.getDomEle("input");
        hiInput.type = "hidden";
        hiInput.name = this.inputName;
        hiInput.readOnly = true;
        o.hiInput = hiInput;
        o.getCon().appendChild(hiInput);
    },

    /**
     * 获取输入框对象的值
     * @param inputObj
     * @return {Number}
     */
    getInputVal : function(inputObj) {
        var strVal = inputObj.value;
        return parseInt(strVal, 10);
    },

    /**
     * 时间调整的核心逻辑
     * @param btn
     */
    changeTime : function(btn) {
        var o = this;
        var type = btn.type;

        var base = 60;
        if(type.valType === "hour") {
           base = 24;
        }
        // 未存在时间范围比较对象 或 启用时间比较，但其比较对象时间值未赋予时
        // 上述两种情况下的时间调整不进行时间范围比较
        if(!o.hasOwnProperty("gObj") || (o.gObj && o.isNull(o.gObj.hiInput))) {
            var time = parseInt(btn.module.value, 10);
            if(type.btnType === "up") {
                isNaN(time) ? time = 0 : (time = (time + 1) % base);
            } else if (type.btnType === "down") {
                isNaN(time) ? time = 0 : ( (time-1 < 0) ? time = base-1 : time -= 1 );
            }
            btn.module.value = o.padZero(time);

        } else {
            if(o.openSec !== o.gObj.openSec) {
                alert("Config Error!");
                throw (new Error(-1, "Config Error!"));
            }
            if(type.btnType === "up") {
                o.addTime(btn, o.mode);
            } else {
                o.reduceTime(btn, o.mode);
            }

        }

        o.onTimeChange();
    },
    addTime : function(btn, mode) {
        switch(btn.type.valType) {
            case "hour" : {
                this.addHour(mode);
                break;
            }
            case "min" : {
                this.addMin(mode);
                break;
            }
            case "sec" : {
                this.addSec(mode);
                break;
            }
        }
    },

    reduceTime : function(btn, mode){
        switch(btn.type.valType) {
            case "hour" : {
                this.reduceHour(mode);
                break;
            }
            case "min" : {
                this.reduceMin(mode);
                break;
            }
            case "sec" : {
                this.reduceSec(mode);
                break;
            }
        }
    },
    addHour : function(mode) {
        var o = this;
        var g = this.gObj;
        var btns = o.timeCtrlBtns;

        var oHMS = o.getTime();
        var oH = oHMS.h;
        var oM = oHMS.m;

        var gHMS = g.getTime();
        var gH = gHMS.h;
        var gM = gHMS.m;

        if(isNaN(oH)) {
           oH = 0;
        } else {
           oH = (oH + 1) % 24;
        }
        if(mode === ">") {
            if(oH < gH) {
                oH = gH;
                if(isNaN(oM) || oM <= gM) {
                    btns.minBtns.module.value = o.padZero(gM);
                    if(o.openSec) {
                        var oS = oHMS.s;
                        var gS = gHMS.s;
                        if(isNaN(oS) || oS < gS) {
                            btns.secBtns.module.value = o.padZero(gS);
                        }
                    }
                }
            }
        } else if(mode === "<"){
            if(oH > gH) {
                oH = gH;
                if(isNaN(oM) || oM >= gM) {
                    btns.minBtns.module.value = o.padZero(gM);
                    if(o.openSec) {
                        var oS = oHMS.s;
                        var gS = gHMS.s;
                        if(oS > gS) {
                            btns.secBtns.module.value = o.padZero(gS);
                        }
                    }
                }
            }
        }
        btns.hourBtns.module.value = o.padZero(oH);
    },

    addMin : function(mode) {
        var o = this;
        var g = this.gObj;
        var btns = o.timeCtrlBtns;

        var oHMS = o.getTime();
        var oH = oHMS.h;
        var oM = oHMS.m;

        var gHMS = g.getTime();
        var gH = gHMS.h;
        var gM = gHMS.m;

        if(isNaN(oM)) {
            oM = 0;
        } else {
            oM = (oM + 1) % 60;
        }
        if(oH === gH) {
            if(mode === ">") {
                (oM < gM) && (oM = gM);
            } else if(mode === "<"){
                (oM > gM) && (oM = gM);
            }
        }

        btns.minBtns.module.value = o.padZero(oM);
    },

    addSec : function(mode) {
        var o = this;
        var g = this.gObj;
        var btns = o.timeCtrlBtns;

        var oHMS = o.getTime();
        var oH = oHMS.h;
        var oM = oHMS.m;
        var oS = oHMS.s;

        var gHMS = g.getTime();
        var gH = gHMS.h;
        var gM = gHMS.m;
        var gS = gHMS.s;

        if(isNaN(oS)) {
            oS = 0;
        } else {
            oS = (oS + 1) % 60;
        }

        if(oH === gH && oM === gM) {
            if(mode === ">") {
               (oS < gS) && (oS = gS);
            } else if(mode === "<"){
               (oS > gS) && (oS = gS);
            }
        }
        btns.secBtns.module.value = o.padZero(oS);
    },

    reduceHour : function(mode){
        var o = this;
        var g = this.gObj;
        var btns = o.timeCtrlBtns;

        var oHMS = o.getTime();
        var oH = oHMS.h;
        var oM = oHMS.m;

        var gHMS = g.getTime();
        var gH = gHMS.h;
        var gM = gHMS.m;
        if(isNaN(oH)) {
            oH = 0;
        } else {
            (oH-1 < 0) ? oH = 24-1 : oH -= 1;
        }
        if(mode === ">") {
            if(oH < gH) {
                oH = gH;
                if(isNaN(oM) || oM < gM) {
                    btns.minBtns.module.value = o.padZero(gM);
                    if(o.openSec) {
                        var oS = oHMS.s;
                        var gS = gHMS.s;
                        if(isNaN(oS) || oS < gS) {
                            btns.secBtns.module.value = o.padZero(gS);
                        }
                    }
                }
            }
        } else if(mode === "<"){
            if(oH > gH) {
                oH = gH;
                if(isNaN(oM) || oM > gM) {
                    btns.minBtns.module.value = o.padZero(gM);
                    if(o.openSec) {
                        var oS = oHMS.s;
                        var gS = gHMS.s;
                        if(oS > gS) {
                            btns.secBtns.module.value = o.padZero(gS);
                        }
                    }
                }
            }
        }
        btns.hourBtns.module.value = o.padZero(oH);
    },

    reduceMin : function(mode){
        var o = this;
        var g = this.gObj;
        var btns = o.timeCtrlBtns;

        var oHMS = o.getTime();
        var oH = oHMS.h;
        var oM = oHMS.m;

        var gHMS = g.getTime();
        var gH = gHMS.h;
        var gM = gHMS.m;

        if(isNaN(oM)) {
            oM = 0;
        } else {
            (oM-1 < 0) ? oM = 60-1 : oM -= 1;
        }
        if(oH === gH) {
            if(mode === ">") {
                (oM < gM) && (oM = gM);
            } else if(mode === "<"){
                (oM > gM) && (oM = gM);
            }
        }
        btns.minBtns.module.value = o.padZero(oM);
    },

    reduceSec : function(mode){
        var o = this;
        var g = this.gObj;
        var btns = o.timeCtrlBtns;

        var oHMS = o.getTime();
        var oH = oHMS.h;
        var oM = oHMS.m;
        var oS = oHMS.s;

        var gHMS = g.getTime();
        var gH = gHMS.h;
        var gM = gHMS.m;
        var gS = gHMS.s;

        if(isNaN(oS)) {
            oS = 0;
        } else {
            (oS-1 < 0) ? oS = 60-1 : oS -= 1;
        }

        if(oH === gH && oM === gM) {
            if(mode === ">") {
                (oS < gS) && (oS = gS);
            } else if(mode === "<"){
                (oS > gS) && (oS = gS);
            }
        }
        btns.secBtns.module.value = o.padZero(oS);
    },

    /**
     * 时间设置组件事件绑定入口
     */
    bindEvent : function() {
        var o = this;
        var btns = o.timeCtrlBtns;

        var setBtnInterval = function() {
            var btn = this;
            var inputModule = btn.module;
            o.changeTime(btn);

            inputModule.timer = window.setInterval(function(){
                o.changeTime(btn);
            }, 200);
        };

        var clearTimer = function() {
            var btn = this;
            var inputModule = btn.module;

            inputModule.timer && window.clearInterval(inputModule.timer);
        };

        var hBtns = btns.hourBtns;
        var mBtns = btns.minBtns;

        hBtns.upBtn.onmousedown
            = hBtns.downBtn.onmousedown
            = mBtns.upBtn.onmousedown
            = mBtns.downBtn.onmousedown = setBtnInterval;

        hBtns.upBtn.onmouseup
            = hBtns.upBtn.onmouseout
            = hBtns.downBtn.onmouseup
            = hBtns.downBtn.onmouseout
            = mBtns.upBtn.onmouseup
            = mBtns.upBtn.onmouseout
            = mBtns.downBtn.onmouseup
            = mBtns.downBtn.onmouseout = clearTimer;

        var keyUp = function() {
            var input = this;
             if(o.isNull(input)) {
                input.value = "";
                // 如果时分秒都未设值，则清空隐藏输入框的时间值
                if(o.openSec) {
                    if(o.isNull(hBtns.module) && o.isNull(mBtns.module) && o.isNull(sBtns.module)) {
                        o.hiInput.value = "";
                    }
                } else {
                    if(o.isNull(hBtns.module) && o.isNull(mBtns.module)) {
                        o.hiInput.value = "";
                    }
                }

                return;
            }

            if(isNaN(input.value)) {
                input.value = "00";
                return;
            }

            var val = parseInt(input.value, 10);
            if(input.isHour) {
                (val < 0 || val > 23) && (input.value = "00");
            } else {
                (val < 0 || val > 59) && (input.value = "00");
            }
        };

        hBtns.module.onkeyup = mBtns.module.onkeyup = keyUp;

        var onBlur = function() {
            var input = this;
            if(o.isNull(input)){
                return;
            }
            //TODO:失去焦点时判定时间范围
            input.value = o.padZero(input.value);
            o.onTimeChange();
        };

        hBtns.module.onblur = mBtns.module.onblur = onBlur;

        if(o.openSec) {
            var sBtns = btns.secBtns;
            sBtns.upBtn.onmousedown
                = sBtns.downBtn.onmousedown = setBtnInterval;

            sBtns.upBtn.onmouseup
                = sBtns.upBtn.onmouseout
                = sBtns.downBtn.onmouseup
                = sBtns.downBtn.onmouseout = clearTimer;

            sBtns.module.onkeyup = keyUp;

            sBtns.module.onblur = onBlur;
        }

    },

    /**
     * 初始化时间设置组件
     * @return {HTMLElement}
     */
    init : function() {
        this.initModule();
        this.initCtrlBtn();
        this.bindEvent();
        this.getHiddenInput();
        return this.initContainer();
    },

    /**
     * 创建DOM元素
     * @param type
     * @return {HTMLElement}
     */
    getDomEle : function(type) {
        return document.createElement(type);
    },

    /**
     * 创建时间分隔符
     * @return {HTMLElement}
     */
    getSeparate: function() {
        var td = document.createElement("td");
        td.rowSpan = 2;
        td.className = "ssTimepicker-sep";
        return td;
    },

    /**
     * 初始化时间设置组件dom结构
     * @return {HTMLElement}
     */
    initContainer: function() {
        var o = this;
        var btns = o.timeCtrlBtns;

        var tr1 = o.getDomEle("tr");

        var hBtns = btns.hourBtns;
        var hourValTd = o.getDomEle("td");
        hourValTd.rowSpan = 2;
        hourValTd.appendChild(hBtns.module);
        tr1.appendChild(hourValTd);

        var hourUpTd = o.getDomEle("td");
        hourUpTd.appendChild(hBtns.upBtn);
        tr1.appendChild(hourUpTd);

        tr1.appendChild(o.getSeparate());

        var mBtns = btns.minBtns;
        var minValTd = o.getDomEle("td");
        minValTd.rowSpan = 2;
        minValTd.appendChild(mBtns.module);
        tr1.appendChild(minValTd);

        var minUpTd = o.getDomEle("td");
        minUpTd.appendChild(mBtns.upBtn);
        tr1.appendChild(minUpTd);

        tr1.appendChild(o.getSeparate());

        if(o.openSec) {
            var sBtns = btns.secBtns;
            var secValTd = o.getDomEle("td");
            secValTd.rowSpan = 2;
            secValTd.appendChild(sBtns.module);
            tr1.appendChild(secValTd);

            var secUpTd = o.getDomEle("td");
            secUpTd.appendChild(sBtns.upBtn);
            tr1.appendChild(secUpTd);
        }

        var tr2 = o.getDomEle("tr");

        var hourDownTd = o.getDomEle("td");
        hourDownTd.appendChild(hBtns.downBtn);
        tr2.appendChild(hourDownTd);

        var minDownTd = o.getDomEle("td");
        minDownTd.appendChild(mBtns.downBtn);
        tr2.appendChild(minDownTd);

        if(o.openSec) {
            var sBtns = btns.secBtns;
            var secDownTd = o.getDomEle("td");
            secDownTd.appendChild(sBtns.downBtn);
            tr2.appendChild(secDownTd);
        }

        var tbody = o.getDomEle("tbody");
        tbody.appendChild(tr1);
        tbody.appendChild(tr2);

        var table = o.getDomEle("table");
        table.className = "ssTimepicker";
        table.appendChild(tbody);

        return table;
    },

    /**
     * 初始化时间输入框
     */
    initModule: function() {
        var o = this;
        var btns = o.timeCtrlBtns;

        var hBtns = btns.hourBtns;
        hBtns.module = this.getModule();
        hBtns.module.isHour = true;

        var mBtns = btns.minBtns;
        mBtns.module = this.getModule();

        if(this.openSec) {
            var sBtns = btns.secBtns;
            sBtns.module = this.getModule();
            sBtns.module.isSec = true;
        }

    },

    /**
     * 初始化时分秒调整按钮
     */
    initCtrlBtn: function() {
        var o = this;
        var btns = o.timeCtrlBtns;

        var hBtns = btns.hourBtns;
        hBtns.upBtn = o.getCtrlBtn("up");
        hBtns.upBtn.type = {valType : "hour" , btnType : "up"};
        hBtns.downBtn = o.getCtrlBtn("down");
        hBtns.downBtn.type = {valType : "hour" , btnType : "down"};
        hBtns.upBtn.module = hBtns.downBtn.module = hBtns.module;

        var mBtns = btns.minBtns;
        mBtns.upBtn = o.getCtrlBtn("up");
        mBtns.upBtn.type = {valType : "min" , btnType : "up"};
        mBtns.downBtn = o.getCtrlBtn("down");
        mBtns.downBtn.type = {valType : "min" , btnType : "down"};
        mBtns.upBtn.module = mBtns.downBtn.module = mBtns.module;

        if(o.openSec) {
            var sBtns = btns.secBtns;
            sBtns.upBtn = o.getCtrlBtn("up");
            sBtns.upBtn.type = {valType : "sec" , btnType : "up"};
            sBtns.downBtn = o.getCtrlBtn("down");
            sBtns.downBtn.type = {valType : "sec" , btnType : "down"};
            sBtns.upBtn.module = sBtns.downBtn.module = sBtns.module;
        }
    },

    /**
     * 创建并得到时间赋值输入框
     * @return {HTMLElement}
     */
    getModule: function() {
        var timeInput = this.getDomEle("input");
        timeInput.setAttribute("type" , "text");
        timeInput.setAttribute("maxLength" , "2");
        timeInput.setAttribute("size", "1");

        return timeInput;
    },

    /**
     * 创建并得到控制按钮
     * @param type
     * @return {HTMLElement}
     */
    getCtrlBtn: function(type) {
         var ctrlBtn = document.createElement("div");
         switch (type) {
             case "up": {
                 ctrlBtn.className = "ssTimepicker-upBtn";
                 break;
             }
             case "down": {
                 ctrlBtn.className = "ssTimepicker-downBtn";
                 break;
             }
         }
         return ctrlBtn;
    },

    /**
     * 获取时间设置组件放置的容器
     * @return {*}
     */
    getCon : function() {
        !this.con && (this.con = document.getElementById(this.container));
        return this.con;
    },

    /**
     * 加载时间设置组件的样式及将其dom结构追加在制定容器中
     */
    show : function() {
        var cssUrl = "css/timepicker.css";
        if(document.createStyleSheet) {
            document.createStyleSheet(cssUrl);
        } else {
            var link = this.getDomEle("link");
            link.setAttribute("type" , "text/css");
            link.setAttribute("rel" , "stylesheet");
            link.href = cssUrl;
            document.getElementsByTagName("head")[0].appendChild(link);
        }

        var o = this;
        o.getCon().appendChild(o.init());

        o.initTime();
    },

    /**
     * 设置时间比较对象及其策略
     * @param props
     */
    setCompareProps : function(props) {
        var o = this;
        o.gObj = props.gObj;
        o.mode = props.mode;
    },

    /**
     * 个位数值补零操作
     * @param num
     * @return {*}
     */
    padZero : function(num) {
        if(num.toString(10).length < 2 && num >= 0 && num <= 9) {
            num = "0" + num;
        }
        return num;
    },

    /**
     * 判定指定输入框对象值是否为空
     * @param input
     * @return {Boolean}
     */
    isNull : function (input) {
        return input.value == undefined || input.value == "" || input.value == null;
    },

    /**
     * 获取各个输入框时间(避免从隐藏文本框获取时间值的滞后性),以JSON格式返回
     * @return {Object}
     */
    getTime : function() {
        var o = this;

        var ctrlBtns = o.timeCtrlBtns;

        var hInput = ctrlBtns.hourBtns.module;
        var mInput = ctrlBtns.minBtns.module;

        var h = hInput.value;
        var m = mInput.value;

        var timeJson = { "h" : parseInt(h, 10), "m" : parseInt(m, 10)};

        if(o.openSec) {
            var sInput = ctrlBtns.secBtns.module;
            var s = sInput.value;
            timeJson = { "h" : parseInt(h, 10), "m" : parseInt(m, 10), "s" : parseInt(s, 10)};
        }

        return timeJson;
    },

    /**
     * 将JSON格式的时间转换成"HH:mm:ss"的形式
     * @param timeJson
     * @return {String}
     */
    getHMS : function(timeJson) {
        isNaN(timeJson.h) && (timeJson.h = 0);
        isNaN(timeJson.m) && (timeJson.m = 0);
        timeJson.h = this.padZero(timeJson.h);
        timeJson.m = this.padZero(timeJson.m);

        var hms = timeJson.h + ":" + timeJson.m;

        if(this.openSec) {
            isNaN(timeJson.s) && (timeJson.s = 0);
            timeJson.s = this.padZero(timeJson.s);
            hms += ":" + timeJson.s;
        }

        return hms;
    }

};