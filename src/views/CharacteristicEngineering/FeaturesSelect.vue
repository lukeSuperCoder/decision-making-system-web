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
                槽号：
                <el-popover popper-class="vmpopper" placement="bottom-start" width="450" trigger="click">
                    <el-tree ref="tree" :data="tree_data" show-checkbox node-key="value"
                        :filter-node-method="filterNode">
                    </el-tree>
                    <el-input style="width:120px" slot="reference" placeholder="输入关键字" v-model="paramsText">
                    </el-input>
                </el-popover>
            </div>
            <!-- <div class="header-item">
                参数：
                <el-select style="width:250px" v-model="form.params" collapse-tags multiple placeholder="请选择">
                    <el-option  v-for="item in form.params_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div> -->
            <!-- <div>
                <div class="block">
                    <el-date-picker v-model="form.date" type="daterange" align="right" unlink-panels range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div> -->
            <div class="header-item">
                算法：
                <el-select style="width:180px" v-model="form.chart_type" placeholder="请选择">
                    <el-option v-for="item in form.chart_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- <div class="header-item">
                图表类型：
                <el-select style="width:180px" v-model="form.chart_type" collapse-tags multiple placeholder="请选择">
                    <el-option v-for="item in form.chart_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div> -->
            
            <div class="header-item">
                <el-button type="primary" @click="openSetDialog">参数设置</el-button>
                <el-button type="primary" @click="deleteAbnCharts">删除</el-button>
            </div>
        </el-row>
        <!-- <el-row style="margin-top:15px" class="header" v-for="index in form.select_params_list" :key="index">
            <div class="header-item">
                参数：
                <el-select style="width:160px" v-model="form.select_params_value[index]" placeholder="请选择">
                    <el-option  v-for="item in form.select_params_opt" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                值：<el-input style="width:160px" v-model="form.select_params_value[index]"></el-input>
            </div>
            <div class="header-item">
                <el-button type="primary" @click="addParams">添加参数</el-button>
                <el-button type="primary" @click="reduceParams">删除参数</el-button>
            </div>
        </el-row> -->
        <el-row class="content">
            <el-card class="card">
                <div id="echart-crad"></div>
                <el-row type="flex" justify="center">
                    <div id="echart2" style="width: 100%; height: 400px"></div>
                </el-row>
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
        <el-dialog
        title="GA-LightGBM  参数设置"
        :modal-append-to-body="false"
        :visible.sync="dialogVisible"
        width="30%">
        <el-row class="header1">
            <div class="header-item">
               <div>参数：</div> <div class="blod">num_leaves</div>        
            </div>
            <div class="header-item">
                值：<el-input style="width:160px"  v-model="map_form['num_leaves']"></el-input>
            </div>
        </el-row>
        <el-row class="header1">
            <div class="header-item">
                <div>参数：</div> <div class="blod">eta</div> 
            </div>
            <div class="header-item">
                值：<el-input style="width:160px" v-model="map_form['eta']"></el-input>
            </div>
        </el-row>
        <el-row class="header1">
            <div class="header-item">
                <div>参数：</div>    <div class="blod">max_depth</div>        
            </div>
            <div class="header-item">
                值：<el-input style="width:160px" v-model="map_form['max_depth']"></el-input>
            </div>
        </el-row>
        <el-row class="header1">
            <div class="header-item">
                <div>参数：</div><div class="blod">min_data_in_leaf</div>  
            </div>
            <div class="header-item">
                值：<el-input style="width:160px" v-model="map_form['min_data_in_leaf']"></el-input>
            </div>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="getChartBar">执 行</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import {
        getNoMenu,getParamsMenu,getBaseChartByParam,getLoad,getValueLoad,
        deleteLoad,
        getHxgChart,
        getTzgc
    } from '../../utils/request';
    export default {
        name: "AbnormalData",
        components: {},
        data() {
            return {
                dialogVisible: false,
                paramsText: '',
                tree_data: [],
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
                    params_options: [],
                    date: '',
                    chart_type: '',
                    chart_options: [
                    {
                        label: 'GA-lightGBM',
                        value: '1'
                    }],
                    select_params_list: 1,
                    select_params_value: [],
                    select_params_opt:[{
                        label: 'num_leaves',
                        value: '22'
                    },
                    {
                        label: 'eta',
                        value: '0.01'
                    },
                    {
                        label: 'max_depth',
                        value: '9'
                    },
                    {
                        label: 'min_data_in_leaf',
                        value: '1300'
                    }]
                },
                map_form: {
                    num_leaves: '',
                    eta: '',
                    max_depth: '',
                    min_data_in_leaf: ''
                },
                data_name: '',
                series_list: []
            }
        },
        computed: {},
        mounted() {
            this.getNoMenuData();
            this.initLoadData();
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
            getLoadData(name) {
                getLoad({
                    name: name
                }).then((res) => {
                    if (res.code === 200) {
                        this.form.date = [res.data[0].start_time, res.data[0].end_time];
                        var arr = res.data[0].numbers.split(',');
                        var data = []
                        this.tree_data[0].children.forEach((i) => {
                            arr.forEach((j) => {
                                if (i.value === j) {
                                    data.push(i)
                                }
                            })
                        })
                        this.tree_data[0].children = data;
                    }
                })
                var arr = name.split('_');
                var name_str = arr[0]+'-'+arr[1]
                this.data_name = name_str;
                getValueLoad({
                    name: name_str
                }).then((res) => {
                    if (res.code === 200) {
                        this.map_form = res.data[0]
                    }
                })
            },
            deleteAbnCharts() {
                deleteLoad({
                    name: this.form.origin
                }).then((res) => {
                    if (res.code === 200) {
                        this.form.origin = ''
                        this.form.date = []
                        this.tree_data = []
                        this.initLoadData();
                        this.$message.success('删除成功')
                    }
                })
            },
            getNoMenuData() {
                getNoMenu().then((res) => {
                    if (res.code === 200) {
                        this.tree_data = res.data;
                    }
                })
                // getParamsMenu().then((res) => {
                //     if (res.code === 200) {
                //         this.form.params_options = res.data;
                //     }
                // })
            },
            handleCheckChange() {
                
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            addParams() { 
                if(this.form.select_params_list < 4) {
                    this.form.select_params_list += 1;
                }
            },
            reduceParams() {
                if(this.form.select_params_list > 0) {
                    this.form.select_params_list -= 1;
                }
            },
            openSetDialog() {
                this.dialogVisible = true
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
            drawChart2(x_name,y_data) {
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                let myChart = echarts.init(document.getElementById("echart2"));
                // 指定图表的配置项和数据
                let option = option = {
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    },
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
                    data: x_name
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        data: y_data,
                        type: 'bar'
                    }
                ]
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
            },
            getChartBar() {
                this.dialogVisible= false
                getTzgc({
                    name: this.data_name
                }).then((res) => {
                    if(res.code===200) {
                        var x_name = []
                        var y_data = []
                        res.data.forEach((item) => {
                            x_name.push(item.param)
                            y_data.push(item.value)
                        })
                        this.drawChart2(x_name,y_data)
                    }
                }) 
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
            }
        }
    }
</style>