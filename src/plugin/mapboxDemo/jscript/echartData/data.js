class echart{
    constructor(){
        this.map = ""
    }
    discount_chart(ids,echarts){
        var myChart = echarts.init(document.getElementById(ids));

        var colors = ['#5793f3', '#d14a61', '#675bba'];

        var option = {
            color: colors,

            tooltip: {
                trigger: 'none',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data:['2017 用电量', '2018 用电量']
            },
            grid: {
                top: 60,
                bottom: 50
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return '用电量  ' + params.value 
                                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '') ;
                            }
                        }
                    },
                    data: ["2018-1", "2018-2", "2018-3", "2018-4", "2018-5", "2018-6", "2018-7", "2018-8", "2018-9", "2018-10", "2018-11", "2018-12"]
                },
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return '用电量  ' + params.value
                                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            }
                        }
                    },
                    data: ["2017-1", "2017-2", "2017-3", "2017-4", "2017-5", "2017-6", "2017-7", "2017-8", "2017-9", "2017-10", "2017-11", "2017-12"]
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    // name:"/万千瓦", 
                    scale:true, //脱离0刻度
                }
            ],
            series: [
                {
                    name:'2017 用电量',
                    type:'line',
                    xAxisIndex: 1,
                    smooth: true,
                    data: [120, 124, 120, 123, 140, 150, 157, 146, 138.7, 118.8, 126.0, 112.3]
                },
                {
                    name:'2018 用电量',
                    type:'line',
                    smooth: true,
                    data: [113.9, 115.9, 111.1, 118.7, 148.3, 159.2, 151.6, 136.6, 142.4, 113.4, 120.3, 110.7]
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    dot_plot(ids,echarts){
        var myChart = echarts.init(document.getElementById(ids));

        setTimeout(function () {

          var option = {
                title : {
                    text: '温度',
                    subtext: '平均温度比例',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['28°','32°','36°','35.7°','30°']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'28°'},
                            {value:310, name:'32°'},
                            {value:234, name:'36°'},
                            {value:135, name:'35.7°'},
                            {value:1548, name:'30°'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            

    myChart.setOption(option);

});
        

        
    }

    // scatter_point(ids,echarts){
    //     var myChart = echarts.init(document.getElementById(ids));

        // // 使用刚指定的配置项和数据显示图表。
        // myChart.setOption(option);
    // }


}
let eht=new echart()
export default eht