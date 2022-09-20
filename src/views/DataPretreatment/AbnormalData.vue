<template>
    <div class="main">
        <el-row class="header">
            <div class="header-item">
                数据源：
                <el-select style="width:160px" v-model="form.origin" placeholder="请选择">
                    <el-option  v-for="item in form.origin_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                参数：
                <el-select style="width:160px" v-model="form.params" placeholder="请选择">
                    <el-option  v-for="item in form.params_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span style="margin-left: 20px;">起止时间：</span>
            </div>
            <div>
                <div class="block">
                    <el-date-picker v-model="form.date" type="daterange" align="right" unlink-panels range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div class="header-item">
                处理方式：
                <el-select style="width:180px" v-model="form.fun" placeholder="请选择">
                    <el-option v-for="item in form.fun_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                图表类型：
                <el-select style="width:180px" v-model="form.chart_type" collapse-tags multiple placeholder="请选择">
                    <el-option v-for="item in form.chart_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                <el-button type="primary" @click="getAbnCharts">查询</el-button>
            </div>
        </el-row>
        <el-row class="content">
            <el-card class="card">
                <div id="echart-crad"></div>
                <!-- <el-row type="flex" justify="center">
                    <div id="echart1" style="width: 100%; height: 400px"></div>
                </el-row>
                <el-row type="flex" justify="center">
                    <div id="echart2" style="width: 100%; height: 400px"></div>
                </el-row>
                <el-row type="flex" justify="center"> 
                    <div id="echart3" style="width: 100%; height: 400px"></div>
                </el-row>
                <el-row type="flex" justify="center"> 
                    <div id="echart4" style="width: 100%; height: 400px"></div>
                </el-row> -->
            </el-card>
        </el-row>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import {
        getNoMenu,getParamsMenu,getKnnChart,getAbnChart
    } from '../../utils/request';
    export default {
        name: "AbnormalData",
        components: {},
        data() {
            return {
                // paramsText: '',
                // tree_data: [],
                form: {
                    origin: '',
                    origin_options: [{
                        label: 'KNN-兰铝',
                        value: 'KNN-兰铝'
                    },{
                        label: '线性插值-兰铝',
                        value: '线性插值-兰铝'
                    },{
                        label: '均值-兰铝',
                        value: '均值-兰铝'
                    },{
                        label: '最大值-兰铝',
                        value: '最大值-兰铝'
                    },{
                        label: '最小值-兰铝',
                        value: '最小值-兰铝'
                    }],
                    params: '',
                    params_options: [],
                    date: '',
                    fun: '',
                    fun_options: [{
                        label: '上阈值',
                        value: '1'
                    },
                    {
                        label: '下阈值',
                        value: '2'
                    },
                    {
                        label: '前后点均值',
                        value: '3'
                    }],
                    chart_type: '',
                    chart_options: [{
                        label: '折线图',
                        value: '1'
                    },
                    {
                        label: '柱状图',
                        value: '2'
                    },
                    {
                        label: '散点图',
                        value: '3'
                    },
                    {
                        label: '饼状图',
                        value: '4'
                    }]
                },
                series_list: []
            }
        },
        computed: {},
        mounted() {
            this.getNoMenuData();
        },
        watch: {
            // paramsText(val) {
            //     this.$refs.tree.filter(val);
            // }
        },
        methods: {
            getNoMenuData() {
                // getNoMenu().then((res) => {
                //     if (res.code === 200) {
                //         this.tree_data = res.data;
                //     }
                // })
                getParamsMenu().then((res) => {
                    if (res.code === 200) {
                        this.form.params_options = res.data;
                    }
                })
            },
            handleCheckChange() {
                
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getAbnCharts() {
                let code_arr = ['兰州铝业电解铝板块二厂(200kA)三车间二工区3039#电解槽']
                var that = this;
                if(this.form.params==="") {
                    that.$message.warning('请选择参数')
                    return
                }
                var params = {
                    params: this.form.params,
                    date: this.form.date.toString(),
                    chart: this.form.chart_type.toString()
                }
                // var params = {
                //     "params": "FZB,CLL,YHLND",
                //     "date": "2021-02-01,2021-05-01",
                //     "chart": "1"
                // }
                this.series_list = []
                getAbnChart(params).then((res) => {
                    if(res.code === 200) {
                        let resdata = res.data;
                        var html = ''
                        resdata.forEach((res_i) => {
                            var series = []
                            code_arr.forEach(code_i => {
                                var series_i = []
                                res_i.data.forEach((data_i) => {
                                    if(code_i === data_i.body) {
                                        series_i.push([data_i.time, parseFloat(data_i.value)])
                                    }
                                })
                                series.push({
                                    name: code_i,
                                    type: 'line',
                                    smooth: true,
                                    symbol: 'none',
                                    areaStyle: {
                                        opacity: 0
                                    },
                                    data: series_i,
                                    markLine: {
                                        data: [{
                                            name: '上阈值',
                                            yAxis: 10
                                        },{
                                            name: '下阈值',
                                            yAxis: 50
                                        }]
                                    }
                                })
                            });
                            this.series_list.push({
                                name: res_i.name,
                                data: series
                            });
                            html = html + `<el-row type="flex" justify="center"><div id="${res_i.name}" style="width: 100%; height: 400px"></div></el-row>`
                        })
                        console.log(this.series_list);
                        document.getElementById('echart-crad').innerHTML = html
                        this.drawChart1();
                    }
                })
                // this.drawChart2();
                // this.drawChart3();
            },
            drawChart1() {
                this.series_list.forEach((series_i) => {
                    // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                    let myChart = echarts.init(document.getElementById(series_i.name));
                    // 指定图表的配置项和数据
                    let option = { 
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        },
                    },
                    title: {
                        left: 'center',
                        text: series_i.name
                    },
                    toolbox: {
                        feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'time',
                        boundaryGap: false
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        min: function (value) {
                            return value.min - 0.1;
                        },
                        max: function (value) {
                            return value.max + 0.1;
                        },
                    },
                    dataZoom: [
                        {
                        type: 'inside',
                        start: 0,
                        end: 200
                        },
                        {
                        start: 0,
                        end: 20
                        }
                    ],
                    series: series_i.data
                    }; 
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    //当 鼠标移到线条上时触发
                    myChart.on('click', function (params) {
                        console.log(params);
                    });  
                    //当 鼠标移出线条时触发 ，如果不处理这个，鼠标移到空白上还有tooltip显示。
                    myChart.on('mouseout', function (params) {
                            console.log(params);
                            // window.selectSeries = '';
                        }); 
                })
                
            },
            drawChart2() {
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                let myChart = echarts.init(document.getElementById("echart2"));
                // 指定图表的配置项和数据
                let option = {
                    title: {
                        text: "ECharts 入门示例",
                    },
                    tooltip: {},
                    legend: {
                        data: ["销量"],
                    },
                    xAxis: {
                        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
                    },
                    yAxis: {},
                    series: [{
                        name: "销量",
                        type: "bar",
                        data: [5, 20, 36, 10, 10, 20],
                    }, ],
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },
            drawChart3() {
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                let myChart = echarts.init(document.getElementById("echart3"));
                // 指定图表的配置项和数据
                let option = {
                    title: {
                        text: 'Referer of a Website',
                        subtext: 'Fake Data',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: [{
                                value: 1048,
                                name: 'Search Engine'
                            },
                            {
                                value: 735,
                                name: 'Direct'
                            },
                            {
                                value: 580,
                                name: 'Email'
                            },
                            {
                                value: 484,
                                name: 'Union Ads'
                            },
                            {
                                value: 300,
                                name: 'Video Ads'
                            }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
    };
</script>

<style  lang="scss" scoped>
    .main ::v-deep{
        width: 100%;
        height: 100%;

        .header {
            height: 60px;
            display: flex;
            border-bottom: 1px solid rgba(151, 151, 151, 0.3);

            .header-item {
                margin-left: 20px;
            }

            .date {
                width: 600px;
            }
        }

        .content {
            margin-top: 20px;
            height: 890px;

            .card {
                height: 100%;
                overflow-y: auto;
            }
        }
    }
</style>