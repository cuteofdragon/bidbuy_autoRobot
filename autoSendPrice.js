
var seconds;
function ShowPrice(data,i) {
    StillRun = true
    var startDate = new Date();
    var ShowPrice_seconds;

    var data = {message: data, TIME:  new Date().getTime()};
    fancyAjax('../../product/product00/websocket', data, function(response) {					
        var json;
        var no;
        try {						
            json = JSON.parse(response);		
            no = json.no;		
        } catch (e) {
            alert(e.message);
        }	
        console.log(json.serverTime);
        document.getElementsByClassName("fancybox-iframe")[0].src = "http://shwoo.taipei.gov.tw/shwoo/product/product00/showCaptcha?auid="+auid+"&bidprice="+(parseInt(json.money)+i).toString()
        console.log((parseInt(json.money)+i).toString())
        var endDate = new Date();
        ShowPrice_seconds = (endDate.getTime() - startDate.getTime());
        console.log("ShowPrice 執行秒數：" + (ShowPrice_seconds).toString()+"ms");
        
        seconds += ShowPrice_seconds;
        console.log("執行秒數：" + (seconds).toString()+"ms");
        seconds = 0
        StillRun = false
    }, null);				
};

function updatetime(data,BuyItTime,i) {
    var startDate = new Date();
    var data = {message: data, TIME:  new Date().getTime()};
    fancyAjax('../../product/product00/websocket', data, function(response) {					
        var json;
        var no;
        try {						
            json = JSON.parse(response);		
            no = json.no;		
        } catch (e) {
            alert(e.message);
        }	
        serverTime = json.serverTime;				
        if(countDownTimeout != null) {
            clearTimeout(countDownTimeout);
        }				
        document.getElementById('hiddenFrame').src = '../../home/home00/keep';
        countDownTimeout = setTimeout(chgTime, 1000);	
        console.log(serverTime);	
        var endDate   = new Date();
        seconds += (endDate.getTime() - startDate.getTime());
        console.log("updatetime 執行秒數：" + (seconds).toString()+"ms");
        
        serverTime_int = parseInt(serverTime);
        serverTime_Date = new Date(serverTime_int);

        resolution = (BuyItTime.getTime() - serverTime_Date.getTime())/1000
        console.log("diff: " + resolution)
        
        //最後一刻才出價
        if ( resolution < 0.4 & resolution>0)
        {
            if (StillRun == false)
            {
                console.log("Run Show price !!!")
                ShowPrice(getJson(1, auid),i);
            }
        }
    }, null);				
};


async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

var StillRun = false
async function run() {
    var i=0;
    seconds = 0
    //預計要下標的時間
    BuyItTime = new Date(2021,00,20,02,30,00);
    while (true) {
        updatetime(getJson(4),BuyItTime,i);
        await sleep(100);
        i+=1;
    }
}

run()
