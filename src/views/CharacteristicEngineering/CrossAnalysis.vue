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
                        :filter-node-method="filterNode" @check-change="handleCheckChange">
                    </el-tree>
                    <el-input style="width:120px" slot="reference" :placeholder="InfoText" v-model="paramsText">
                    </el-input>
                </el-popover>
            </div>
            <div class="header-item">
                参数1：
                <el-select style="width:160px" v-model="form.params1" collapse-tags multiple placeholder="请选择">
                    <el-option v-for="item in form.params_options1" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                参数2：
                <el-select style="width:160px" v-model="form.params2" collapse-tags multiple placeholder="请选择">
                    <el-option v-for="item in form.params_options2" :key="item.value" :label="item.label"
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
                <el-button type="primary" @click="getKnnCharts">执行</el-button>
                <el-button type="primary" @click="deleteAbnCharts">删除</el-button>
            </div>
            <!-- <div class="header-item">
                图表类型：
                <el-select style="width:180px" v-model="form.chart_type" collapse-tags multiple placeholder="请选择">
                    <el-option v-for="item in form.chart_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div> -->
        </el-row>
        <!-- <el-row class="header">
            <div class="header-item">
                <el-button type="primary" @click="getCharts">执行</el-button>
                <el-button type="primary" @click="deleteAbnCharts">删除</el-button>
            </div>
        </el-row> -->
        <el-row class="content">
            <el-card class="card"  v-if="series_list.length!==1">
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
                <div class="img-span" id="echart-crad">
                    <!-- <div class="img-item">
                    </div> -->
                </div>
            </el-card>
            <el-card class="card"  v-else>
                <div class="img-span1" id="echart-crad">
                </div>
            </el-card>
        </el-row>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import {
        getNoMenu,
        getParamsMenu,
        getBaseChartByParam,
        setLoad,
        getLoad,
        deleteLoad,
        getHxgChart
    } from '../../utils/request';
    export default {
        name: "AbnormalData",
        components: {},
        data() {
            return {
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                srcList: [
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ],
                InfoText: '请勾选槽号',
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
                    params1: '',
                    params2: '',
                    params_options: [],
                    params_options1: [
                        {
                            "value": "CLL",
                            "label": "槽控工艺报出铝量 (kg)"
                        },
                        {
                            "value": "SDDY",
                            "label": "槽控日报设定电压 (V)"
                        }
                    ],
                    params_options2: [
                        {
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
                        }
                    ]
                },
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
                var code_arr = ['CLL_CLL']
                // var params = {
                //     code: code_arr.toString(),
                //     params: this.form.params.toString(),
                //     date: this.form.date.toString(),
                //     chart: this.form.chart_type.toString()
                // }
                var params = {
                    "params": "CLL_CLL",
                    "fun": "jz-sxyz-hxg"
                }
                this.series_list = []
                getHxgChart(params).then((res) => {
                    if (res.code === 200) {
                        let resdata = res.data;
                        var html = ''
                        resdata.forEach((res_i) => {
                            var series = []
                            code_arr.forEach(code_i => {
                                var series_i = []
                                res_i.data.forEach((data_i) => {
                                    if (code_i === data_i.body) {
                                        series_i.push([parseInt(data_i.time), parseFloat(data_i
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
                                `<el-row type="flex" justify="center"><div id="${res_i.name}" style="height: 400px"></div></el-row>`
                        })
                        console.log(this.series_list);
                        document.getElementById('echart-crad').innerHTML = html
                        this.drawChart1();
                    }
                })
                // this.drawChart2();
                // this.drawChart3();
            },
            getKnnCharts() {
                var that = this;
                var code_arr = "all,CLL_CLL,CLL_DJWD,CLL_FZB,CLL_GZDY,CLL_LSP,CLL_PJDY,CLL_SDDY,CLL_XLCS,CLL_YHLND,CLL_ZZ,SDDY_CLL,SDDY_DJWD,SDDY_FZB,SDDY_GZDY,SDDY_LSP,SDDY_PJDY,SDDY_SDDY,SDDY_XLCS,SDDY_YHLND,SDDY_ZZ".split(',')
                // let legend = ['槽控工艺报出铝量 (kg)','槽控日报设定电压 (V)','槽控工艺报铝水平 (cm)','槽控工艺报氧化铝浓度 (%)','槽控工艺报电解温度 (℃)',
                // '槽控工艺报分子比 (N/A)','槽控日报工作电压 (V)','槽控日报平均电压 (V)','槽控日报下料次数 (次)','槽控日报针振 (mV)']
                // that.form.params.forEach((j) => {
                //     legend.splice(legend.indexOf(j),1)
                // })
                // if(legend.length===0) {
                //     that.$message.warning('至少保留一项参数')
                //     return
                // }
                // this.table_column = legend;
                // this.form.numbers = this.$refs['tree'].getCheckedKeys();
                // var params = {
                //     numbers: this.form.numbers.toString(),
                //     params: legend.toString(),
                //     date: this.form.date.toString(),
                //     chart: this.form.chart_type,
                //     pageNo: this.pageNo,
                //     pageSize: this.pageSize,
                //     fun: this.form.fun+'_database'
                // }
                // var params = {
                //     "params": "FZB,CLL,YHLND",
                //     "date": "2021-02-01,2021-05-01",
                //     "chart": "1"
                // }
                var str = this.form.origin.split('_')[0]+'-'+this.form.origin.split('_')[1]
                var params = {
                    "params": "",
                    "fun": str+"-hxg"
                }
                if(this.form.params1.toString() === 'CLL,SDDY') {
                    params.params = "all"
                } else {
                    let str_arr = []
                    this.form.params2.forEach((item) => {
                        str_arr.push(this.form.params1[0] + '_' + item)
                    })
                    params.params = str_arr.toString()
                }
                console.log(params);
                this.series_list = []
                this.tableData_visible = false;
                getHxgChart(params).then((res) => {
                        if(res.code === 200) {
                            let resdata = res.data;
                            var html = ''
                            resdata.forEach((res_i) => {
                            var series = []
                            code_arr.forEach(code_i => {
                                var series_i = []
                                res_i.data.forEach((data_i) => {
                                    if (code_i === data_i.body) {
                                        series_i.push([parseInt(data_i.time), parseFloat(data_i.value).toFixed(4)])
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
                                    symbol: 'square',
                                    symbolSize: 2,
                                    lineStyle: {
                                        color: '#5470C6',
                                        width: 1,
                                        type: 'line'
                                    },
                                    itemStyle: {
                                        borderWidth: 1,
                                        borderColor: '#5470C6',
                                        color: '#5470C6'
                                    }
                                })
                            });
                            this.series_list.push({
                                name: res_i.name,
                                data: series
                            });
                            if(resdata.length===1) {
                                html = html +
                                `<el-row type="flex" justify="center"><div id="${res_i.name}" style="margin-top:100px; margin-left:400px; width:800px; height: 560px"></div></el-row>`  
                            } else if(resdata.length===2){
                                html = html +
                                `<el-row type="flex" justify="center"><div id="${res_i.name}" style="margin-top:100px; width:800px; height: 560px"></div></el-row>`  
                            } else {
                                html = html +
                                `<el-row type="flex" justify="center"><div id="${res_i.name}" style="height: 260px"></div></el-row>`
                            }
                            
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
                        // dataZoom: [{
                        //         type: 'inside',
                        //         start: 0,
                        //         end: 200
                        //     },
                        //     {
                        //         start: 0,
                        //         end: 20
                        //     }
                        // ],
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
            },
            getImgs() {

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

        .content {
            width: 100%;
            margin-top: 20px;
            height: 890px;

            .card {
                height: 100%;
                overflow-y: auto;
                .img-span {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    /* 设置间距 */
                    grid-gap: 20px;

                    .img-item {
                        // width: 400px;
                        height: 270px;
                        // background-image: url('https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg');
                        // background-size: 100% 100%;
                    }
                }
                .img-span1 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    /* 设置间距 */
                    grid-gap: 20px;
                }
            }
        }
    }
</style>