<template>
    <div class="main">
        <el-row class="header">
            <div class="header-item">
                槽号：
                <el-popover popper-class="vmpopper" placement="bottom-start" width="450" trigger="click">
                    <el-tree ref="tree" :data="tree_data" show-checkbox node-key="value"
                    @check-change="handleCheckChange" :filter-node-method="filterNode">
                    </el-tree>
                    <el-input style="width:120px" slot="reference" :placeholder="InfoText" v-model="paramsText">
                    </el-input>
                </el-popover>
            </div>
            <div class="header-item">
                参数：
                <el-select style="width:260px" v-model="form.params" collapse-tags multiple placeholder="请选择">
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
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions" :default-value="new Date('2021-08-02T00:00:00.000Z')">
                    </el-date-picker>
                </div>
            </div>
            <div class="header-item">
                图表类型：
                <el-select style="width:180px" v-model="form.chart_type" placeholder="请选择">
                    <el-option v-for="item in form.chart_options" :key="item.value" :label="item.label" :value="item.value">
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
                <el-table :data="tableData" style="width: 100%" v-show="tableData_visible">
                    <el-table-column width="80" label="序号" sortable type="index">
                    </el-table-column>
                    <el-table-column prop="time" label="日期" width="100" sortable>
                    </el-table-column>
                    <el-table-column v-for="item in table_column" :prop="item" :label="item" width="200" align="center" sortable>
                    </el-table-column>
                    <el-table-column prop="number" label="槽号" sortable>
                    </el-table-column>
                    <el-table-column prop="list" sortable label="列表号">
                    </el-table-column>
                </el-table>
                <div class="pagediv">
                <el-pagination v-show="tableData_visible" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo"
                    :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
                </div>
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
        name: "BaseChartAnalysis",
        components: {},
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date('2021-08-01T00:00:00.000Z').getTime() || time.getTime() > new Date('2022-05-22T00:00:00.000Z').getTime() ;
                    },
                },
                paramsText: '',
                InfoText: '请勾选槽号',
                tree_data: [],
                form: {
                    params: '',
                    params_options: [],
                    date: '',
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
                    }]
                },
                series_list: [],
                tableData_visible: false,
                tableData: [],
                table_column: [],
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
            handleCheckChange(val) {
                let arr = this.$refs['tree'].getCheckedKeys();
                if(arr[0]==='0') {
                    this.InfoText = arr.toString().substr(2)
                } else {
                    this.InfoText = arr.toString()
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getCharts() {
                let arr = this.$refs['tree'].getCheckedKeys();
                let code_arr = []
                arr.forEach((i) => {
                    code_arr.push('兰州铝业电解铝板块一厂(400kA)五车间二工区'+i+'#电解槽')
                })
                var params = {
                    code: code_arr.toString(),
                    params: this.form.params.toString(),
                    date: this.form.date.toString(),
                    chart: this.form.chart_type.toString(),
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                }
                // var params = {
                //     "code": "0,3039,3040,3041,3042,3043,3044,3045,3046,3047,3048,3049,3050,3051,3052,3053,3054,3055,3056,3057,3058,3059,3060,3061,3062,3063,3064,3065,3066,3067,3068,3069,3070,3071,3072,3073,3074,3075,3076",
                //     "params": "FZB,CLL,YHLND",
                //     "date": "2021-02-01,2021-05-01",
                //     "chart": "1"
                // }
                console.log(params);
                this.series_list = []
                // getBaseChartByParam(params).then((res) => {
                //     if(res.code === 200) {
                //         let resdata = res.data;
                //         var html = ''
                //         resdata.forEach((res_i) => {
                //             var series = []
                //             code_arr.forEach(code_i => {
                //                 var series_i = []
                //                 res_i.data.forEach((data_i) => {
                //                     if(code_i === data_i.body) {
                //                         series_i.push([data_i.time, parseFloat(data_i.value)])
                //                     }
                //                 })
                //                 series.push({
                //                     name: code_i,
                //                     type: 'line',
                //                     smooth: true,
                //                     symbol: 'none',
                //                     areaStyle: {
                //                         opacity: 0
                //                     },
                //                     data: series_i
                //                 })
                //             });
                //             this.series_list.push({
                //                 name: res_i.name,
                //                 data: series
                //             });
                //             html = html + `<el-row type="flex" justify="center"><div id="${res_i.name}" style="width: 100%; height: 400px"></div></el-row>`
                //         })
                //         console.log(this.series_list);
                //         document.getElementById('echart-crad').innerHTML = html
                //         this.drawChart1();
                //     }
                // })

                if(this.form.chart_type==='1') {
                    this.tableData_visible = false;
                    getBaseChartByParam(params).then((res) => {
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
                } else if(this.form.chart_type==='2') {
                    this.tableData_visible = false;
                    getBaseChartByParam(params).then((res) => {
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
                                        type: 'bar',
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
                            this.drawChart2();
                        }
                    })
                } else if(this.form.chart_type==='3') {
                    this.tableData_visible = false;
                    getBaseChartByParam(params).then((res) => {
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
                                        type: 'scatter',
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
                            this.drawChart3();
                        }
                    })
                } else if(this.form.chart_type==='4') {
                    document.getElementById('echart-crad').innerHTML = ''
                    getBaseChartByParam(params).then((res) => {
                        if(res.code === 200) {
                            this.tableData = res.data;
                            this.tableData_visible = true;
                            this.total = res.total;
                        }
                    })
                }
                // this.drawChart2();
                // this.drawChart3();
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getKnnCharts();
            },
            handleCurrentChange(val) {
                this.pageNo = val
                this.getKnnCharts();
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
            drawChart3() {
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