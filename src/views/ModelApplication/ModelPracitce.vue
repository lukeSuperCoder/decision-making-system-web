<template>
    <div class="main">
        <el-row class="header">
            <div class="header-item">
                模型：
                <el-select style="width:180px" v-model="form.chart_type" collapse-tags multiple placeholder="请选择">
                    <el-option v-for="item in form.chart_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                参数优化算法：
                <el-select style="width:180px" v-model="form.origin" collapse-tags multiple placeholder="请选择">
                    <el-option v-for="item in form.origin_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                <el-button type="primary" @click="getCharts">查询</el-button>
            </div>
        </el-row>
        <el-row class="content">
            <el-card class="card">
                <div id="echart-crad"></div>
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="value"
                        label="结果"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="Num_layers"
                        label="Num_layers"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="Hidden_size"
                        label="Hidden_size"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="lr"
                        label="lr"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="Batch_size"
                        label="Batch_size"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="optimizer"
                        label="optimizer"
                        align="center">
                    </el-table-column>
                    </el-table>
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
        getNoMenu,getParamsMenu,getBaseChartByParam
    } from '../../utils/request';
    export default {
        name: "AbnormalData",
        components: {},
        data() {
            return {
                paramsText: '',
                tree_data: [],
                form: {
                    origin: '',
                    origin_options: [{
                        value: '1',
                        label: '无'
                    },{
                        value: '1',
                        label: 'MPA'
                    },{
                        value: '1',
                        label: 'TF-MPA'
                    }],
                    params: '',
                    params_options: [],
                    date: '',
                    chart_type: '',
                    chart_options: [{
                        label: 'LSTM',
                        value: '1'
                    },
                    {
                        label: 'dfLSTM',
                        value: '2'
                    }]
                },
                series_list: [],
                tableData: [{
                    value: 'LSTM',
                    Num_layers: '1',
                    Hidden_size: '64',
                    lr: '0.01',
                    Batch_size: '20',
                    optimizer: 'adam'
                }, {
                    value: 'dfLSTM',
                    Num_layers: '1',
                    Hidden_size: '64',
                    lr: '0.01',
                    Batch_size: '20',
                    optimizer: 'adam'
                }, {
                    value: 'MPA-LSTM',
                    Num_layers: '1',
                    Hidden_size: '128',
                    lr: '0.01',
                    Batch_size: '20',
                    optimizer: 'adam'
                }, {
                    value: 'MPA-dfLSTM',
                    Num_layers: '1',
                    Hidden_size: '128',
                    lr: '0.01030531',
                    Batch_size: '20',
                    optimizer: 'adam'
                }, {
                    value: 'TF-MPA-LSTM',
                    Num_layers: '1',
                    Hidden_size: '32',
                    lr: '0.02547853',
                    Batch_size: '20',
                    optimizer: 'adam'
                }, {
                    value: 'TF-MPA-dfLSTM',
                    Num_layers: '1',
                    Hidden_size: '128',
                    lr: '0.02961708',
                    Batch_size: '20',
                    optimizer: 'adam'
                }]
            }
        },
        computed: {},
        mounted() {
            this.getNoMenuData();
        },
        watch: {
            paramsText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            getNoMenuData() {
                getNoMenu().then((res) => {
                    if (res.code === 200) {
                        this.tree_data = res.data;
                    }
                })
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
            getCharts() {
                var code_arr = this.$refs['tree'].getCheckedNodes().map((item) => {return item.value})
                // var params = {
                //     code: code_arr.toString(),
                //     params: this.form.params.toString(),
                //     date: this.form.date.toString(),
                //     chart: this.form.chart_type.toString()
                // }
                var params = {
                    "code": "0,3039,3040,3041,3042,3043,3044,3045,3046,3047,3048,3049,3050,3051,3052,3053,3054,3055,3056,3057,3058,3059,3060,3061,3062,3063,3064,3065,3066,3067,3068,3069,3070,3071,3072,3073,3074,3075,3076",
                    "params": "FZB,CLL,YHLND",
                    "date": "2021-02-01,2021-05-01",
                    "chart": "1"
                }
                console.log(params);
                this.series_list = []
                getBaseChartByParam(params).then((res) => {
                    if(res.code === 200) {
                        let resdata = res.data;
                        var html = ''
                        resdata.forEach((res_i) => {
                            var series = []
                            code_arr.forEach(code_i => {
                                var series_i = []
                                res_i.data.forEach((data_i) => {
                                    if(code_i === data_i.code) {
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
                                    data: series_i
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