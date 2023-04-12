<template>
    <div class="main">
        <el-row class="header">
            <div class="header-item">
                数据源：
                <el-select style="width:160px" v-model="form.origin" placeholder="请选择" @change="getLoadData">
                    <el-option v-for="item in form.origin_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                决策参数：
                <el-select style="width:160px" v-model="form.params1" collapse-tags multiple placeholder="请选择">
                    <el-option v-for="item in form.params_options1" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span style="margin-left: 20px;">决策时间：</span>
            </div>
            <div>
                <div class="block">
                    <el-date-picker v-model="form.date" type="date" align="right" unlink-panels range-separator="至"
                        placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions" :default-value="new Date('2021-09-01T00:00:00.000Z')">
                    </el-date-picker>
                </div>
            </div>
            <div class="header-item">
                模型：
                <el-select style="width:160px" v-model="form.chart_type" placeholder="请选择" @change="getLoadData1">
                    <el-option v-for="item in form.chart_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                <el-button type="primary" @click="startJc">开始决策</el-button>
            </div>
        </el-row>
        <el-row class="content">
            <el-card class="card">
                <!-- <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        v-for="o in tableColumn"
                        :prop="o"
                        :label="o"
                        align="center">
                    </el-table-column>
                    </el-table>
                    <div class="pagediv">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo"
                    :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                    </div> -->
                <div id="echart-crad"></div>
                <!-- <el-row type="flex" justify="center">
                    <div id="echart1" style="width: 100%; height: 400px"></div>
                </el-row>
                <el-row type="flex" justify="center">
                    <div id="echart2" style="width: 100%; height: 400px"></div>
                </el-row> -->
                <!-- <el-row type="flex" justify="center"> 
                    <div id="echart3" style="width: 100%; height: 400px"></div>
                </el-row>
                <el-row type="flex" justify="center"> 
                    <div id="echart4" style="width: 100%; height: 400px"></div>
                </el-row> -->
                <div style="height: 400px; overflow-y:auto">
                    <el-row class="header1" v-for="o in map_column" v-show="map_column1.length!==0">
                        <div class="header-item">
                            <div>参数：</div>
                            <div class="blod">{{o}}</div>
                        </div>
                        <div class="header-item">
                            值：<div class="blod">{{map_form[o]}}</div>
                        </div>
                    </el-row>
                    <el-row class="header1" v-for="o in map_column1">
                        <div class="header-item">
                            <div>参数：</div>
                            <div class="blod">{{o}}</div>
                        </div>
                        <div class="header-item">
                            值：<div class="blod">{{map_form1[o]}}</div>
                        </div>
                    </el-row>
                </div>
            </el-card>
        </el-row>
        <el-dialog title="参数设置" :modal-append-to-body="false" :visible.sync="dialogVisible" width="40%">
            <div style="height: 400px; overflow-y:auto">
                <el-row class="header1" v-for="o in map_column">
                    <div class="header-item">
                        <div>参数：</div>
                        <div class="blod">{{o}}</div>
                    </div>
                    <div class="header-item">
                        值：<el-input style="width:160px" v-model="map_form[o]"></el-input>
                    </div>
                </el-row>

            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getJcChart">执 行</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import {
        getNoMenu,
        getParamsMenu,
        getBaseChartByParam,
        getLoad,
        getValueLoad,
        getJcData,
        setLoad,
        getLastJc
    } from '../../utils/request';
    import dateUtil from '../../utils/dateUtil'
    export default {
        name: "AbnormalData",
        components: {},
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date('2021-09-01T00:00:00.000Z').getTime() || time.getTime() > new Date('2022-06-06T00:00:00.000Z').getTime() ;
                    },
                },
                dialogVisible: false,
                paramsText: '',
                tree_data: [],
                pageNo: 1,
                pageSize: 10,
                total: 0,
                form: {
                    origin: '',
                    origin_options: [{
                            label: 'KNN上阈值填充数据',
                            value: 'knn_syz'
                        },
                        {
                            label: 'KNN下阈值填充数据',
                            value: 'knn_xyz'
                        },
                        {
                            label: 'KNN上下阈值填充数据',
                            value: 'knn_sxyz'
                        },
                        {
                            label: '均值上阈值填充数据',
                            value: 'jz_syz'
                        },
                        {
                            label: '均值下阈值填充数据',
                            value: 'jz_xyz'
                        },
                        {
                            label: '均值上下阈值填充数据',
                            value: 'jz_sxyz'
                        },
                        {
                            label: '上邻数上阈值填充数据',
                            value: 'sls_syz'
                        },
                        {
                            label: '上邻数下阈值填充数据',
                            value: 'sls_xyz'
                        },
                        {
                            label: '上邻数上下阈值填充数据',
                            value: 'sls_sxyz'
                        },
                        {
                            label: '下邻数上阈值填充数据',
                            value: 'xls_syz'
                        },
                        {
                            label: '下邻数下阈值填充数据',
                            value: 'xls_xyz'
                        },
                        {
                            label: '下邻数上下阈值填充数据',
                            value: 'xls_sxyz'
                        },
                        {
                            label: '中位数上阈值填充数据',
                            value: 'zws_syz'
                        },
                        {
                            label: '中位数下阈值填充数据',
                            value: 'zws_xyz'
                        },
                        {
                            label: '中位数上下阈值填充数据',
                            value: 'zws_sxyz'
                        },
                        {
                            label: '众数上阈值填充数据',
                            value: 'zs_syz'
                        },
                        {
                            label: '众数下阈值填充数据',
                            value: 'zs_xyz'
                        },
                        {
                            label: '众数上下阈值填充数据',
                            value: 'zs_sxyz'
                        },
                        {
                            label: '最大值上阈值填充数据',
                            value: 'zdz_syz'
                        },
                        {
                            label: '最大值下阈值填充数据',
                            value: 'zdz_xyz'
                        },
                        {
                            label: '最大值上下阈值填充数据',
                            value: 'zdz_sxyz'
                        },
                        {
                            label: '最小值上阈值填充数据',
                            value: 'zxz_syz'
                        },
                        {
                            label: '最小值下阈值填充数据',
                            value: 'zxz_xyz'
                        },
                        {
                            label: '最小值上下阈值填充数据',
                            value: 'zxz_sxyz'
                        }
                    ],
                    params: '',
                    params1: '',
                    params2: '',
                    params_options: [],
                    params_options1: [{
                            "value": "CLL",
                            "label": "槽控工艺报出铝量 (kg)"
                        },
                        {
                            "value": "SDDY",
                            "label": "槽控日报设定电压 (V)"
                        }
                    ],
                    params_options2: [{
                            "value": "CLL",
                            "label": "槽控工艺报出铝量 (kg)"
                        },
                        {
                            "value": "FZB",
                            "label": "槽控工艺报分子比 (N/A)"
                        },
                        {
                            "value": "YHLND",
                            "label": "槽控工艺报氧化铝浓度 (%)"
                        },
                        {
                            "value": "DJWD",
                            "label": "槽控工艺报电解温度 (℃)"
                        },
                        {
                            "value": "LSP",
                            "label": "槽控工艺报铝水平 (cm)"
                        },
                        {
                            "value": "XLCS",
                            "label": "槽控日报下料次数 (次)"
                        },
                        {
                            "value": "GZDY",
                            "label": "槽控日报工作电压 (V)"
                        },
                        {
                            "value": "PJDY",
                            "label": "槽控日报平均电压 (V)"
                        },
                        {
                            "value": "SDDY",
                            "label": "槽控日报设定电压 (V)"
                        },
                        {
                            "value": "ZZ",
                            "label": "槽控日报针振 (mV)"
                        }
                    ],
                    date: '',
                    chart_type: '',
                    chart_options: [{
                            label: 'lstm',
                            value: 'lstm'
                        },
                        {
                            label: 'dflstm',
                            value: 'dflstm'
                        },
                        {
                            label: 'MPA_lstm',
                            value: 'MPA_lstm'
                        },
                        {
                            label: 'MPA_dflstm',
                            value: 'MPA_dflstm'
                        },
                        {
                            label: 'TF-MPA_lstm',
                            value: 'TF-MPA_lstm'
                        },
                        {
                            label: 'TF-MPA_dflstm',
                            value: 'TF-MPA_dflstm'
                        }
                    ]
                },
                map_column: [],
                map_form: {
                    num_leaves: '',
                    eta: '',
                    max_depth: '',
                    min_data_in_leaf: ''
                },
                map_column1: [],
                map_form1: {
                    num_leaves: '',
                    eta: '',
                    max_depth: '',
                    min_data_in_leaf: ''
                },
                series_list: [],
                tableData: [],
                map_form_temp: {
                    num_leaves: '',
                    eta: '',
                    max_depth: '',
                    min_data_in_leaf: ''
                },
                map_column_temp: []
            }
        },
        computed: {},
        mounted() {
            this.getNoMenuData();
            this.initLoadData();
            this.initLoadData1();
        },
        watch: {
            paramsText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            initLoadData() {
                getLoad({
                    name: ''
                }).then((res) => {
                    if (res.code === 200) {
                        var arr = []
                        this.form.origin_options.forEach((item) => {
                            res.data.forEach((j) => {
                                if (item.value === j.name) {
                                    arr.push(item)
                                }
                            })
                        })
                        this.form.origin_options = arr;
                        console.log(arr);
                    }
                })
            },
            initLoadData1() {
                getLoad({
                    name: ''
                }).then((res) => {
                    if (res.code === 200) {
                        var arr = []
                        this.form.chart_options.forEach((item) => {
                            res.data.forEach((j) => {
                                if (item.value === j.name) {
                                    arr.push(item)
                                }
                            })
                        })
                        this.form.chart_options = arr;
                    }
                })
            },
            getLoadData(name) {
                // console.log(this.form.chart_type);

                // console.log(str);
                getLoad({
                    name: name,
                }).then((res) => {
                    if (res.code === 200) {
                        // this.form.date = [res.data[0].start_time, res.data[0].end_time];
                    }
                })
                var arr = name.split('_');
                var name_str = arr[0] + '-' + arr[1]
                this.data_name = name_str;
            },
            getLoadData1(name) {
                getLoad({
                    name: name,
                }).then((res) => {
                    if (res.code === 200) {
                        console.log(res.data);
                        var data = JSON.parse(res.data[0].numbers)
                        this.map_form_temp = JSON.parse(JSON.stringify(data))
                        this.map_column_temp = Object.keys(data)
                    }
                })
            },
            setLoadData() {
                var params = {
                    name: this.form.chart_type,
                    numbers: JSON.stringify(this.map_form)
                }
                setLoad(params).then((res) => {
                    if (res.code === 200) {
                        this.$message.success('载入成功')
                    }
                })
            },
            getValueGy() {
                var str = ''
                this.form.chart_type.forEach((i, index) => {
                    if (index === this.form.chart_type.length - 1) {
                        str += '`' + i + '_隐藏层层数`,' + '`' + i + '_隐藏层神经元个数`,' + '`' + i + '_学习率`'
                    } else {
                        str += '`' + i + '_隐藏层层数`,' + '`' + i + '_隐藏层神经元个数`,' + '`' + i + '_学习率`,'
                    }
                })
                getValueLoad({
                    name: this.data_name,
                    type: '1',
                    fun: str
                }).then((res) => {
                    if (res.code === 200) {
                        this.map_form = res.data[0]
                        this.map_column = Object.keys(res.data[0])
                    }
                })
            },
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
            changeType() {
                console.log(this.form.chart_type);
                if (this.form.chart_type.length === 1) {

                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            openSetDialog() {
                this.dialogVisible = true
                this.getValueGy()
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getJcChart();
            },
            handleCurrentChange(val) {
                this.pageNo = val
                this.getJcChart();
            },
            startJc() {
                var para_str = ''
                this.form.params1.forEach((i) => {
                        para_str += i + '_' + this.form.chart_type + '_pred,'
                })
                var param = {
                    "date": dateUtil.getDppointedDay(this.form.date, 15),
                    "params": para_str.substring(0, para_str.length - 1).replace(/-/g,'_'),
                    "tablename": this.data_name + '-jc'
                }
                getLastJc(param).then((res) => {
                    if (res.code === 200) {
                        this.map_form = this.map_form_temp
                        this.map_column = this.map_column_temp
                        this.map_form1 = res.data[0]
                        this.map_column1 = Object.keys(res.data[0])
                        console.log(this.map_column1, this.map_form1);
                    }
                })
            },
            getCharts() {
                var code_arr = this.$refs['tree'].getCheckedNodes().map((item) => {
                    return item.value
                })
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
                    if (res.code === 200) {
                        let resdata = res.data;
                        var html = ''
                        resdata.forEach((res_i) => {
                            var series = []
                            code_arr.forEach(code_i => {
                                var series_i = []
                                res_i.data.forEach((data_i) => {
                                    if (code_i === data_i.code) {
                                        series_i.push([data_i.time, parseFloat(data_i
                                            .value)])
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
                            html = html +
                                `<el-row type="flex" justify="center"><div id="${res_i.name}" style="width: 100%; height: 400px"></div></el-row>`
                        })
                        console.log(this.series_list);
                        document.getElementById('echart-crad').innerHTML = html
                        this.drawChart1(x_data, y_data);
                        this.drawChart2(x_data, y_data);
                    }
                })
                // this.drawChart2();
                // this.drawChart3();
            },
            drawChart1(x_data, y_data) {
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                let myChart = echarts.init(document.getElementById('echart1'));
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
                        text: '出铝量'
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
                        type: 'category',
                        data: x_data
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
                    dataZoom: [{
                            type: 'inside',
                            start: 0,
                            end: 200
                        },
                        {
                            start: 0,
                            end: 20
                        }
                    ],
                    series: y_data
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

            },
            drawChart2(x_data, y_data) {
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                let myChart = echarts.init(document.getElementById('echart2'));
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
                        text: '设定电压'
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
                        type: 'category',
                        data: x_data
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
                    dataZoom: [{
                            type: 'inside',
                            start: 0,
                            end: 200
                        },
                        {
                            start: 0,
                            end: 20
                        }
                    ],
                    series: y_data
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
            },
            getJcChart() {
                var para_str = ''
                this.form.params1.forEach((i) => {
                    this.form.chart_type.forEach((j) => {
                        para_str += i + '_ture,' + i + '_' + this.form.chart_type + '_pred,'
                    })
                })
                var params = {
                    "param": para_str.substring(0, para_str.length - 1),
                    "date": this.form.date.toString(),
                    "pageNo": this.pageNo,
                    "pageSize": this.pageSize,
                    "tablename": this.data_name + '-jc'
                }
                getJcData(params).then((res) => {
                    if (res.code === 200) {
                        this.tableColumn = Object.keys(res.data[0])
                        this.tableData = res.data;
                        this.dialogVisible = false;
                        this.total = res.total;
                        var x_data = []
                        var arr_jc = Object.keys(this.tableData[0])
                        var arr_obj = []
                        var y_data = []
                        arr_jc.forEach((i) => {
                            arr_obj.push({
                                name: i,
                                type: 'line',
                                data: [],
                            })
                        })
                        this.tableData.forEach((item) => {
                            x_data.push(item.time)
                            arr_jc.forEach((j, index) => {
                                arr_obj[index].data.push(parseFloat(item[j]))
                            })
                        })
                        var cll_ydata = []
                        var sddy_ydata = []
                        arr_obj.forEach((o) => {
                            if (o.name !== 'time' && o.name !== 'SDDY_ture' && o.name !== 'CLL_ture') {
                                if (o.name.split('_')[0] === 'CLL') {
                                    cll_ydata.push(o)
                                } else {
                                    sddy_ydata.push(o)
                                }
                            }
                        })
                        let html = ''
                        if (this.form.params1.length === 1) {
                            if (this.form.params1[0] === 'CLL') {
                                html =
                                    `<el-row type="flex" justify="center"><div id="echart1" style="width: 100%; height: 400px"></div></el-row>`
                                document.getElementById('echart-crad').innerHTML = html
                                this.drawChart1(x_data, cll_ydata);
                            } else {
                                html =
                                    `<el-row type="flex" justify="center"><div id="echart2" style="width: 100%; height: 400px"></div></el-row>`
                                document.getElementById('echart-crad').innerHTML = html
                                this.drawChart2(x_data, sddy_ydata);
                            }
                        } else if (this.form.params1.length === 2) {
                            html =
                                `<el-row type="flex" justify="center"><div id="echart1" style="width: 100%; height: 400px"></div></el-row><el-row type="flex" justify="center"><div id="echart2" style="width: 100%; height: 400px"></div></el-row>`
                            document.getElementById('echart-crad').innerHTML = html
                            this.drawChart1(x_data, cll_ydata);
                            this.drawChart2(x_data, sddy_ydata);
                        }

                    }
                })
            }
        },
    };
</script>

<style lang="scss" scoped>
    .main ::v-deep {
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

        .header1 {
            height: 60px;
            display: flex;

            .header-item {
                width: 50%;
                display: flex;
                align-items: center;
                margin-left: 20px;

                .blod {
                    font-weight: 600;
                    font-size: 20px;
                }
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

                .pagediv {
                    height: 5rem;
                    display: flex;
                }
            }
        }
    }
</style>