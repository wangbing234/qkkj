$(function(){
    var getData=function(){
        $.ajax({
            type : "post",
            timeout : 3000,
            url : "/f/wallet",
            datatype : "json",
            success : function(ret) {
                if (ret.success) {
                    console.log("查询钱包成功");
                    console.log(ret);
                    operateData(ret);

                } else {
                    // 执行成功，结果错误
                    console.log("查询钱包失败");
                }
            },
            error : function() {
                // 超时或后台报错
                console.log("超时或后台报错");
            }
        });
    }

    var operateData=function(ret){
        //取到钱包
        var baseFree=ret.data.baseFree;
        var baseFreeze=ret.data.baseFreeze;
        var baseTrading=ret.data.baseTrading;
        var growFree=ret.data.growFree;
        var growFreeze=ret.data.growFreeze;
        var growTrading=ret.data.growTrading;
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'), 'macarons');
        var newChart = echarts.init(document.getElementById('main11'), 'macarons');

        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['未确认a1元','冻结a2元','已确认a3元']
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:baseTrading, name:'未确认a1元'},
                        {value:baseFreeze, name:'冻结a2元'},
                        {value:baseFree, name:'已确认a3元'}
                    ]
                }
            ]
        };

        var option1 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['未确认a1元','冻结a2元','已确认a3元']
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:growTrading, name:'未确认a1元'},
                        {value:growFreeze, name:'冻结a2元'},
                        {value:growFree, name:'已确认a3元'}

                    ]
                }
            ]
        };


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        newChart.setOption(option1)
    }

    getData();

})
