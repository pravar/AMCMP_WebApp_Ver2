
(function($) {
    $.fn.timeSchedule = function(options){
        var defaults = {
            rows : {},
            startTime: "07:00",
            endTime: "19:30",
            widthTimeX:10,		// 1cellè¾ºã‚Šã®å¹…(px)
            widthTime:600,		// åŒºåˆ‡ã‚Šæ™‚é–“(ç§’)
            timeLineY:50,		// timeline height(px)
            timeLineBorder:0,	// timeline height border
            timeBorder:0,		// border width
            timeLinePaddingTop:0,
            timeLinePaddingBottom:0,
            headTimeBorder:1,	// time border width
            dataWidth:0,		// data width
            verticalScrollbar:0,	// vertical scrollbar width
            // event
            init_data: null,
            change: null,
            click: null,
            append: null,
            time_click: null,
            debug:""			// debug selecter
        };
        this.calcStringTime = function(string) {
            var slice = string.split(':');
            var h = Number(slice[0]) * 60 * 60;
            var i = Number(slice[1]) * 60;
            var min = h + i;
            return min;
        };
        this.formatTime = function(min) {
            var h = "" + (min/36000|0) + (min/3600%10|0);
            var i = "" + (min%3600/600|0) + (min%3600/60%10|0);
            //var html = '<span>'+h+'</span>';
            var txt = h + ":<span class='minutes'>" + i + "</span>" ;
            return txt;
        };

        var setting = $.extend(defaults,options);
        this.setting = setting;
        var scheduleData = new Array();
        var timelineData = new Array();
        var $element = $(this);
        var element = (this);
        var tableStartTime = element.calcStringTime(setting.startTime);
        var tableEndTime = element.calcStringTime(setting.endTime);
        var currentNode = null;
        tableStartTime -= (tableStartTime % setting.widthTime);
        tableEndTime -= (tableEndTime % setting.widthTime);

        this.getScheduleData = function(){
            return scheduleData;
        }
        this.getTimelineData = function(){
            return timelineData;
        }
        // ç¾åœ¨ã®ã‚¿ã‚¤ãƒ ãƒ©ã‚¤ãƒ³ç•ªå·ã‚’å–å¾—
        this.getTimeLineNumber = function(top){
            var num = 0;
            var n = 0;
            var tn = Math.ceil(top / (setting.timeLineY + setting.timeLinePaddingTop + setting.timeLinePaddingBottom));
            for(var i in setting.rows){
                var r = setting.rows[i];
                var tr = 0;
                if(typeof r["schedule"] == Object){
                    tr = r["schedule"].length;
                }
                if(currentNode && currentNode["timeline"]){
                    tr ++;
                }
                n += Math.max(tr,1);
                if(n >= tn){
                    break;
                }
                num ++;
            }
            return num;
        }
        // èƒŒæ™¯ãƒ‡ãƒ¼ã‚¿è¿½åŠ 
        this.addScheduleBgData = function(data){
            var st = Math.ceil((data["start"] - tableStartTime) / setting.widthTime);
           var et = Math.floor((data["end"] - tableStartTime) / setting.widthTime);
            
            var $bar = jQuery('<div class="sc_bgBar"><span class="text"></span></div>');
            var stext = element.formatTime(data["start"]);
            var etext = element.formatTime(data["end"]);
            var snum = element.getScheduleCount(data["timeline"]);

            $bar.css({
                left : (st * setting.widthTimeX),
                top : 0,
                width : ((et - st) * setting.widthTimeX),
                
                minHeight : $element.find('.sc_main .timeline').eq(data["timeline"]).height()
            });
            if(data["text"]){
                $bar.find(".text").text(data["text"]);
            }
            if(data["class"]){
                $bar.addClass(data["class"]);
            }
            //$element.find('.sc_main').append($bar);
            $element.find('.sc_main .timeline').eq(data["timeline"]).append($bar);
        }
        // ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«è¿½åŠ 
        this.addScheduleData = function(data,i){
           // console.log(data);
            var swidth = data["widthTimeX"];
            var st = Math.ceil((data["start"] - tableStartTime) / setting.widthTime);
           var et = Math.floor((data["end"] - tableStartTime) / setting.widthTime);
          // var st = Math.ceil((data["start"] - tableStartTime) / swidth);
          //  var et = Math.floor((data["end"] - tableStartTime) / swidth);
            var $bar = jQuery('<div class="sc_Bar"><span class="head"><span class="time"></span></span><span class="text"></span></div>');
            var stext = element.formatTime(data["start"]);
            var etext = element.formatTime(data["end"]);
            var snum = element.getScheduleCount(data["timeline"]);
             if(data["heightEle"]){
               var sheight = data["heightEle"];
            }
            else{
                var sheight = setting.timeLineY;
            }
           
            $bar.css({
                left : (st * (setting.widthTimeX))+(i*2),
                
                top : ((snum * setting.timeLineY) + setting.timeLinePaddingTop),
               width : ((et - st) * setting.widthTimeX),
               minHeight : (sheight*1)
            });
            
            //$bar.find(".time").text(stext+"-"+etext);
            $bar.find(".time").html(stext);
            if(data["text"]){
                $bar.find(".text").html(data["text"]);
            }
            if(data["class"]){
                $bar.addClass(data["class"]);
            }
            if(data["data"].screenshare){
                var smileyWidth = Math.floor(((et - st) * setting.widthTimeX)/2);
                $( "<span class='screenshare'>&nbsp;</span>" ).insertAfter( $bar.find(".text"));
               $( '<span class="quickSmiley" style="text-align:center;"><span style="left:'+(smileyWidth-20)+'px"></span></span>' ).appendTo( $bar);
            }
            
            //$element.find('.sc_main').append($bar);
            $element.find('.sc_main .timeline').eq(data["timeline"]).append($bar);
            // ãƒ‡ãƒ¼ã‚¿ã®è¿½åŠ 
            scheduleData.push(data);
            // key
            var key = scheduleData.length - 1;
            $bar.data("sc_key",key);

            $bar.bind("mouseup",function(){
                // ã‚³ãƒ¼ãƒ«ãƒãƒƒã‚¯ãŒã‚»ãƒƒãƒˆã•ã‚Œã¦ã„ãŸã‚‰å‘¼å‡º
                if(setting.click){
                    if(jQuery(this).data("dragCheck") !== true && jQuery(this).data("resizeCheck") !== true){
                        var node = jQuery(this);
                        var sc_key = node.data("sc_key");
                        setting.click(node, scheduleData[sc_key]);
                    }
                }
            });

            var $node = $element.find(".sc_Bar");
            // move node.
           /* $node.draggable({
                grid: [ setting.widthTimeX, 1 ],
                containment: ".sc_main",
                helper : 'original',
                start: function(event, ui) {
                    var node = {};
                    node["node"] = this;
                    node["offsetTop"] = ui.position.top;
                    node["offsetLeft"] = ui.position.left;
                    node["currentTop"] = ui.position.top;
                    node["currentLeft"] = ui.position.left;
                    node["timeline"] = element.getTimeLineNumber(ui.position.top);
                    node["nowTimeline"] = node["timeline"];
                    currentNode = node;
                },
                drag: function(event, ui) {
                    jQuery(this).data("dragCheck",true);
                    if(!currentNode){
                        return false;
                    }
                    var $moveNode = jQuery(this);
                    var sc_key = $moveNode.data("sc_key");
                    var originalTop = ui.originalPosition.top;
                    var originalLeft = ui.originalPosition.left;
                    var positionTop = ui.position.top;
                    var positionLeft = ui.position.left;
                    var timelineNum = element.getTimeLineNumber(ui.position.top);
                    // ä½ç½®ã®ä¿®æ­£
                    //ui.position.top = Math.floor(ui.position.top / setting.timeLineY) * setting.timeLineY;
                    //ui.position.top = element.getScheduleCount(timelineNum) * setting.timeLineY;
                    ui.position.left = Math.floor(ui.position.left / setting.widthTimeX) * setting.widthTimeX;


                    //$moveNode.find(".text").text(timelineNum+" "+(element.getScheduleCount(timelineNum) + 1));
                    if(currentNode["nowTimeline"] != timelineNum){
                        // é«˜ã•ã®èª¿ç¯€
                        //element.resizeRow(currentNode["nowTimeline"],element.getScheduleCount(currentNode["nowTimeline"]));
                        //element.resizeRow(timelineNum,element.getScheduleCount(timelineNum) + 1);
                        // ç¾åœ¨ã®ã‚¿ã‚¤ãƒ ãƒ©ã‚¤ãƒ³
                        currentNode["nowTimeline"] = timelineNum;
                    }else{
                        //ui.position.top = currentNode["currentTop"];
                    }
                    currentNode["currentTop"] = ui.position.top;
                    currentNode["currentLeft"] = ui.position.left;
                    // ãƒ†ã‚­ã‚¹ãƒˆå¤‰æ›´
                    element.rewriteBarText($moveNode,scheduleData[sc_key]);
                    return true;
                },
                // è¦ç´ ã®ç§»å‹•ãŒçµ‚ã£ãŸå¾Œã®å‡¦ç†
                stop: function(event, ui) {
                    jQuery(this).data("dragCheck",false);
                    currentNode = null;

                    var node = jQuery(this);
                    var sc_key = node.data("sc_key");
                    var x = node.position().left;
                    var w = node.width();
                    var start = tableStartTime + (Math.floor(x / setting.widthTimeX) * setting.widthTime);
                    //var end = tableStartTime + (Math.floor((x + w) / setting.widthTimeX) * setting.widthTime);
                    var end = start + ((scheduleData[sc_key]["end"] - scheduleData[sc_key]["start"]));

                    scheduleData[sc_key]["start"] = start;
                    scheduleData[sc_key]["end"] = end;
                    // ã‚³ãƒ¼ãƒ«ãƒãƒƒã‚¯ãŒã‚»ãƒƒãƒˆã•ã‚Œã¦ã„ãŸã‚‰å‘¼å‡º
                    if(setting.change){
                        setting.change(node, scheduleData[sc_key]);
                    }
                }
            });
            $node.resizable({
                handles:'e',
                grid: [ setting.widthTimeX, setting.timeLineY ],
                minWidth:setting.widthTimeX,
                start: function(event, ui){
                    var node = jQuery(this);
                    node.data("resizeCheck",true);
                },
                // è¦ç´ ã®ç§»å‹•ãŒçµ‚ã£ãŸå¾Œã®å‡¦ç†
                stop: function(event, ui){
                    var node = jQuery(this);
                    var sc_key = node.data("sc_key");
                    var x = node.position().left;
                    var w = node.width();
                    var start = tableStartTime + (Math.floor(x / setting.widthTimeX) * setting.widthTime);
                    var end = tableStartTime + (Math.floor((x + w) / setting.widthTimeX) * setting.widthTime);
                    var timelineNum = scheduleData[sc_key]["timeline"];

                    scheduleData[sc_key]["start"] = start;
                    scheduleData[sc_key]["end"] = end;

                    // é«˜ã•èª¿æ•´
                    element.resetBarPosition(timelineNum);
                    // ãƒ†ã‚­ã‚¹ãƒˆå¤‰æ›´
                    element.rewriteBarText(node,scheduleData[sc_key]);

                    node.data("resizeCheck",false);
                    // ã‚³ãƒ¼ãƒ«ãƒãƒƒã‚¯ãŒã‚»ãƒƒãƒˆã•ã‚Œã¦ã„ãŸã‚‰å‘¼å‡º
                    if(setting.change){
                        setting.change(node, scheduleData[sc_key]);
                    }
                }
            });*/
            return key;
        };
        // ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«æ•°ã®å–å¾—
        this.getScheduleCount = function(n){
            var num = 0;
            for(var i in scheduleData){
                if(scheduleData[i]["timeline"] == n){
                    num ++;
                }
            }
            return num;
        };
        // add
        this.addRow = function(timeline,row){
            var title = row["title"];
            var id = $element.find('.sc_main .timeline').length;

            var html;

            html = '';
            html += '<div class="timeline"><span>'+title+'</span></div>';
            var $data = jQuery(html);
            // event call
            if(setting.init_data){
                setting.init_data($data,row);
            }
            $element.find('.sc_data_scroll').append($data);

            html = '';
            html += '<div class="timeline"></div>';
            var $timeline = jQuery(html);
            for(var t=tableStartTime;t<tableEndTime;t+=setting.widthTime){
                var $tl = jQuery('<div class="tl"></div>');
                $tl.width(setting.widthTimeX - setting.timeBorder);//Abhi
                //$tl.width(setting.rows.schedule.widthTimeX - setting.timeBorder);
                $tl.data("time",element.formatTime(t));
                $tl.data("timeline",timeline);
                $timeline.append($tl);
            }
            // ã‚¯ãƒªãƒƒã‚¯ã‚¤ãƒ™ãƒ³ãƒˆ
            if(setting.time_click){
                $timeline.find(".tl").click(function(){
                    setting.time_click(this,jQuery(this).data("time"),jQuery(this).data("timeline"),timelineData[jQuery(this).data("timeline")]);
                });
            }
            $element.find('.sc_main').append($timeline);

            timelineData[timeline] = row;

            if(row["class"] && (row["class"] != "")){
                $element.find('.sc_data .timeline').eq(id).addClass(row["class"]);
                $element.find('.sc_main .timeline').eq(id).addClass(row["class"]);
            }
            // ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ã‚¿ã‚¤ãƒ ãƒ©ã‚¤ãƒ³
            if(row["schedule"]){
                for(var i in row["schedule"]){
                    var bdata = row["schedule"][i];
                    var s = element.calcStringTime(bdata["start"]);
                    var e = element.calcStringTime(bdata["end"]);

                    var data = {};
                    data["timeline"] = id;
                    
                    data["widthTimeX"] = bdata["widthTimeX"] ;
                    data["start"] = s;
                    data["end"] = e;
                    if(bdata["text"]){
                        data["text"] = bdata["text"];
                    }
                    if(bdata["class"]){
                        data["class"] = bdata["class"];
                    }
                    if(bdata["heightEle"]){
                        data["heightEle"] = bdata["heightEle"];
                    }
                    data["data"] = {};
                    if(bdata["data"]){
                        data["data"] = bdata["data"];
                    }
                    element.addScheduleData(data,i);
                }
            }
            // é«˜ã•ã®èª¿æ•´
            element.resetBarPosition(id);
            $element.find('.sc_main .timeline').eq(id).droppable({
                accept: ".sc_Bar",
                drop: function(ev, ui) {
                    var node = ui.draggable;
                    var sc_key = node.data("sc_key");
                    var nowTimelineNum = scheduleData[sc_key]["timeline"];
                    var timelineNum = $element.find('.sc_main .timeline').index(this);
                    // ã‚¿ã‚¤ãƒ ãƒ©ã‚¤ãƒ³ã®å¤‰æ›´
                    scheduleData[sc_key]["timeline"] = timelineNum;
                    node.appendTo(this);
                    // é«˜ã•èª¿æ•´
                    element.resetBarPosition(nowTimelineNum);
                    element.resetBarPosition(timelineNum);
                }
            });
            // ã‚³ãƒ¼ãƒ«ãƒãƒƒã‚¯ãŒã‚»ãƒƒãƒˆã•ã‚Œã¦ã„ãŸã‚‰å‘¼å‡º
            if(setting.append){
                $element.find('.sc_main .timeline').eq(id).find(".sc_Bar").each(function(){
                    var node = jQuery(this);
                    var sc_key = node.data("sc_key");
                    setting.append(node, scheduleData[sc_key]);
                });
            }
        };
        this.getScheduleData = function(){
            var data = new Array();

            for(var i in timelineData){
                if(typeof timelineData[i] == "undefined") continue;
                var timeline = jQuery.extend(true, {}, timelineData[i]);
                timeline.schedule = new Array();
                data.push(timeline);
            }

            for(var i in scheduleData){
                if(typeof scheduleData[i] == "undefined") continue;
                var schedule = jQuery.extend(true, {}, scheduleData[i]);
                schedule.start = this.formatTime(schedule.start);
                schedule.end = this.formatTime(schedule.end);
                var timelineIndex = schedule.timeline;
                delete schedule.timeline;
                data[timelineIndex].schedule.push(schedule);
            }

            return data;
        };
        // ãƒ†ã‚­ã‚¹ãƒˆã®å¤‰æ›´
        this.rewriteBarText = function(node,data){
            var x = node.position().left;
            var w = node.width();
            var start = tableStartTime + (Math.floor(x / setting.widthTimeX) * setting.widthTime);
            //var end = tableStartTime + (Math.floor((x + w) / setting.widthTimeX) * setting.widthTime);
            var end = start + (data["end"] - data["start"]);
            var html = element.formatTime(start)+"-"+element.formatTime(end);
            jQuery(node).find(".time").html(html);
        }
        this.resetBarPosition = function(n){
            // è¦ç´ ã®ä¸¦ã³æ›¿ãˆ
            var $bar_list = $element.find('.sc_main .timeline').eq(n).find(".sc_Bar");
            var codes = [];
            for(var i=0;i<$bar_list.length;i++){
                codes[i] = {code:i,x:jQuery($bar_list[i]).position().left};
            };
            // ã‚½ãƒ¼ãƒˆ
            codes.sort(function(a,b){
                if(a["x"] < b["x"]){
                    return -1;
                }else if(a["x"] > b["x"]){
                    return 1;
                }
                return 0;
            });
            var check = [];
            var h = 0;
            var $e1,$e2;
            var c1,c2;
            var s1,e1,s2,e2;
            for(var i=0;i<codes.length;i++){
                c1 = codes[i]["code"];
                $e1 = jQuery($bar_list[c1]);
                for(h=0;h<check.length;h++){
                    var next = false;
                    L: for(var j=0;j<check[h].length;j++){
                        c2 = check[h][j];
                        $e2 = jQuery($bar_list[c2]);

                        s1 = $e1.position().left;
                        e1 = $e1.position().left + $e1.width();
                        s2 = $e2.position().left;
                        e2 = $e2.position().left + $e2.width();
                        if(s1 < e2 && e1 > s2){
                            next = true;
                            continue L;
                        }
                    }
                    if(!next){
                        break;
                    }
                }
                if(!check[h]){
                    check[h] = [];
                }
                $e1.css({top:((h * setting.timeLineY) + setting.timeLinePaddingTop)});
                check[h][check[h].length] = c1;
            }
            // é«˜ã•ã®èª¿æ•´
            this.resizeRow(n,check.length);
        };
        this.resizeRow = function(n,height){
            //var h = Math.max(element.getScheduleCount(n),1);
            
            var h = Math.max(height,1);
            $element.find('.sc_data .timeline').eq(n).height((h * setting.timeLineY) - setting.timeLineBorder + setting.timeLinePaddingTop + setting.timeLinePaddingBottom);
           //$element.find('.sc_main .timeline').eq(n).css('min-height',(h * setting.timeLineY) - setting.timeLineBorder + setting.timeLinePaddingTop + setting.timeLinePaddingBottom);
           $element.find('.sc_main .timeline').eq(n).css('min-height',$(window).innerHeight() -280);
            $element.find('.sc_main .timeline').eq(n).find(".sc_bgBar").each(function(){
                jQuery(this).height(jQuery(this).closest(".timeline").height());
            });

            $element.find(".sc_data").height($element.find(".sc_main_box").height());
        }
        // resizeWindow
        this.resizeWindow = function(){
            var sc_width = $element.width();
            var sc_main_width = sc_width - setting.dataWidth - (setting.verticalScrollbar);
            var cell_num = Math.floor((tableEndTime - tableStartTime) / setting.widthTime);
            $element.find(".sc_header_cell").width(setting.dataWidth);
            $element.find(".sc_data,.sc_data_scroll").width(setting.dataWidth);
            $element.find(".sc_header").width(sc_main_width);
            $element.find(".sc_main_box").width(sc_main_width);
            $element.find(".sc_header_scroll").width(setting.widthTimeX*cell_num);
            $element.find(".sc_main_scroll").width(setting.widthTimeX*cell_num);

        };
        // init
        this.init = function(){
            var html = '';
            html += '<div class="sc_menu">'+"\n";
            html += '<div class="sc_header_cell"><span>&nbsp;</span></div>'+"\n";
            html += '<div class="sc_header">'+"\n";
            html += '<div class="sc_header_scroll">'+"\n";
            html += '</div>'+"\n";
            html += '</div>'+"\n";
            html += '<br class="clear" />'+"\n";
            html += '</div>'+"\n";
            html += '<div class="sc_wrapper">'+"\n";
            html += '<div class="sc_data">'+"\n";
            html += '<div class="sc_data_scroll">'+"\n";
            html += '</div>'+"\n";
            html += '</div>'+"\n";
            html += '<div class="sc_main_box">'+"\n";
            html += '<div class="sc_main_scroll">'+"\n";
            html += '<div class="sc_main">'+"\n";
            html += '</div>'+"\n";
            html += '</div>'+"\n";
            html += '</div>'+"\n";
            html += '<br class="clear" />'+"\n";
            html += '</div>'+"\n";

            $element.append(html);

            $element.find(".sc_main_box").scroll(function(){
                $element.find(".sc_data_scroll").css("top", $(this).scrollTop() * -1);
                $element.find(".sc_header_scroll").css("left", $(this).scrollLeft() * -1);

            });
            // add time cell
            var cell_num = Math.floor((tableEndTime - tableStartTime) / setting.widthTime);
            var before_time = -1;
            for(var t=tableStartTime;t<tableEndTime;t+=setting.widthTime){

                if(
                    (before_time < 0) ||
                        (Math.floor(before_time / 3600) != Math.floor(t / 3600))){
                    var html = '';
                    html += '<div class="sc_time">'+element.formatTime(t)+'</div>';
                    var $time = jQuery(html);
                    var cell_num = Math.floor(Number(Math.min((Math.ceil((t + setting.widthTime) / 3600) * 3600),tableEndTime) - t) / setting.widthTime);
                    $time.width((cell_num * setting.widthTimeX) - setting.headTimeBorder);
                    $element.find(".sc_header_scroll").append($time);

                    before_time = t;
                }
            }

            jQuery(window).resize(function(){
                element.resizeWindow();
            }).trigger("resize");

            // addrow
            for(var i in setting.rows){
                this.addRow(i,setting.rows[i]);
            }
        };
        // åˆæœŸåŒ–
        this.init();

        this.debug = function(){
            var html = '';
            for(var i in scheduleData){
                html += '<div>';

                html += i+" : ";
                var d = scheduleData[i];
                for(var n in d){
                    var dd = d[n];
                    html += n+" "+dd;
                }

                html += '</div>';
            }
            jQuery(setting.debug).html(html);
        };
        if(setting.debug && setting.debug != ""){
            setInterval(function(){
                element.debug();
            },10);
        }

        return( this );
    };
})(jQuery);