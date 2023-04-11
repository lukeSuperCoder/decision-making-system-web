<template>
    <div class="main">
        <el-row class="header"  style="border: 0; height: 40px;">
            <div class="header-item">
                数据源：
                <el-select style="width:160px" v-model="form.origin" placeholder="请选择" @change="getLoadData">
                    <el-option  v-for="item in form.origin_options" :key="item.value" :label="item.label"
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
                <el-select style="width:180px" v-model="form.chart_type" collapse-tags placeholder="请选择">
                    <el-option v-for="item in form.chart_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </el-row>
        <el-row class="header" style=" height: 60px;">
            <div class="header-item"  style="width: 100%; display: flex; height: 50%; justify-content: center; align-items: center;margin-top: 10px;">
                <el-button type="primary" @click="getKnnCharts">执行</el-button>
                <el-button type="primary" @click="deleteAbnCharts">删除</el-button>
                <el-button type="primary" @click="setloadData">载入</el-button>
                <download-excel  
                    :data="json_data"
                    :fields="json_fields"
                    worksheet="My Worksheet"
                    name="异常值处理数据.xls"
                    >
                    <el-button type="primary" style="height:100%;margin-left: 10px;">保存</el-button>
                    </download-excel>
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
            </el-card>
        </el-row>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import { sessionGet, sessionSet } from "../../utils/auth";
    import {
        getNoMenu,getParamsMenu,getKnnChart,getAbnChart,setLoad,getLoad,deleteLoad
    } from '../../utils/request';
    export default {
        name: "AbnormalData",
        components: {},
        data() {
            return {
                InfoText: '请勾选槽号',
                paramsText: '',
                tree_data: [],
                pageNo: 1,
                pageSize: 10,
                total: 0,
                tableData_visible: false,
                tableData: [],
                table_column: [],
                form: {
                    origin: '',
                    origin_options: [{
                        label: 'KNN填充数据',
                        value: 'knn'
                    },
                    {
                        label: '均值填充数据',
                        value: 'jz'
                    },
                    {
                        label: '上邻数填充数据',
                        value: 'sls'
                    },
                    {
                        label: '下邻数填充数据',
                        value: 'xls'
                    },{
                        label: '中位数填充数据',
                        value: 'zws'
                    },{
                        label: '众数填充数据',
                        value: 'zs'
                    },{
                        label: '最大值填充数据',
                        value: 'zdz'
                    },{
                        label: '最小值填充数据',
                        value: 'zxz'
                    }],
                    params: '',
                    params_options: [],
                    date: '',
                    fun: '',
                    fun_options: [{
                        label: '上阈值',
                        value: 'syz'
                    },
                    {
                        label: '下阈值',
                        value: 'xyz'
                    },
                    {
                        label: '上下阈值',
                        value: 'sxyz'
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
                        label: '表格',
                        value: '4'
                    }]
                },
                series_list: [],
                json_fields: {              //表头设计
                   
                },
                json_data: [               //表格数据

                ],
                param_key: {
                    knn_xyz: {
                        CLL:       2590.000000,
                        SDDY:        3.805000,
                        LSP :         4.833333,
                        DJWD:       921.000000,
                        FZB:       2.515000,
                        GZDY:       3.850000,
                        PJDY:        3.844000,
                        XLCS:     1476.500000,
                        YHLND:       1.135000,
                        ZZ:        2.166667
                    },
                    knn_syz: {
                        CLL:      2910.000000,
                        SDDY:         4.245000,
                        LSP:         43.500000,
                        DJWD:      947.666667,
                        FZB:          2.715000,
                        GZDY:         4.292667,
                        PJDY :       4.292000,
                        XLCS:    2064.500000,
                        YHLND:      2.481667,
                        ZZ:      19.500000,
                        number :   5104.500000,
                        list :      221.000000
                    },
                    jz_xyz: {
                        SDDY:         3.8125,
                        CLL:       2640.0000,
                        LSP:          2.4115,
                        YHLND:        1.3000,
                        DJWD:       926.0000,
                        FZB:          2.5300,
                        GZDY:         3.8635,
                        PJDY:         3.8660,
                        XLCS:      1500.5000,
                        ZZ :          3.0000
                    },
                    jz_syz: {
                        SDDY:         4.2325,
                        CLL:       2880.0000,
                        LSP:         70.6475,
                        YHLND:        2.3400,
                        DJWD:       942.0000,
                        FZB :         2.6900,
                        GZDY :        4.2675,
                        PJDY :        4.2660,
                        XLCS :     2048.5000,
                        ZZ  :        19.0000
                    },
                    sls_xyz: {
                        SDDY:         3.8050,
                        CLL:       2590.0000,
                        LSP :       -52.5000,
                        YHLND :       1.0450,
                        DJWD:       919.5000,
                        FZB :         2.5150,
                        GZDY:         3.8330,
                        PJDY :        3.8365,
                        XLCS:      1436.5000,
                        ZZ  :         3.0000
                    },
                    sls_syz: {
                        SDDY:         4.2450,
                        CLL:       2910.0000,
                        LSP:        159.5000,
                        YHLND :       2.6050,
                        DJWD:       947.5000,
                        FZB:          2.7150,
                        GZDY:         4.3050,
                        PJDY:         4.2965,
                        XLCS :     2088.5000,
                        ZZ :         19.0000
                    },
                    xls_xyz: {
                        SDDY:         3.805000,
                        CLL:       2590.000000,
                        LSP:        -52.500000,
                        YHLND :       1.100000,
                        DJWD:       919.500000,
                        FZB :         2.490000,
                        GZDY :        3.835125,
                        PJDY :        3.836500,
                        XLCS:      1439.000000,
                        ZZ :          3.000000
                    },
                    xls_syz: {
                        SDDY:         4.245000,
                        CLL:       2910.000000,
                        LSP :       159.500000,
                        YHLND :       2.540000,
                        DJWD:       947.500000,
                        FZB:          2.730000,
                        GZDY:         4.302125,
                        PJDY :        4.296500,
                        XLCS:      2087.000000,
                        ZZ :         19.000000
                    },
                    zs_xyz: {
                        SDDY :        3.7625,
                        CLL:       2640.0000,
                        LSP:        -65.0000,
                        YHLND:        1.3000,
                        DJWD:       926.0000,
                        FZB :         2.5300,
                        GZDY:         3.8215,
                        PJDY:         3.8645,
                        XLCS:      1500.5000,
                        ZZ :          3.0000
                    },
                    zs_syz: {
                        SDDY:         4.2625,
                        CLL:       2880.0000,
                        LSP :       183.0000,
                        YHLND :       2.3400,
                        DJWD:       942.0000,
                        FZB :         2.6900,
                        GZDY:         4.3375,
                        PJDY:         4.2685,
                        XLCS:      2048.5000,
                        ZZ :         19.0000
                    },
                    zws_xyz: {
                        SDDY:         3.8125,
                        CLL:       2640.0000,
                        LSP :        23.5000,
                        YHLND :       0.1300,
                        DJWD :      921.0000,
                        FZB :         2.5300,
                        GZDY :        3.8620,
                        PJDY :        3.8345,
                        XLCS:      1500.5000,
                        ZZ :          3.0000
                    },
                    zws_syz: {
                        SDDY:         4.2325,
                        CLL:       2880.0000,
                        LSP :        35.5000,
                        YHLND :       4.2900,
                        DJWD:       945.0000,
                        FZB:          2.6900,
                        GZDY:         4.2700,
                        PJDY:         4.3185,
                        XLCS:      2048.5000,
                        ZZ :         19.0000
                    },
                    zdz_xyz: {
                        SDDY:         3.7900,
                        CLL:       2640.0000,
                        LSP :       -65.0000,
                        YHLND:        0.1300,
                        DJWD:       828.5000,
                        FZB:          2.3500,
                        GZDY:         3.8215,
                        PJDY:         3.8300,
                        XLCS:      1401.5000,
                        ZZ:          -1.5000
                    },
                    zdz_syz: {
                        SDDY:         4.2700,
                        CLL:       2880.0000,
                        LSP:        183.0000,
                        YHLND:        4.2900,
                        DJWD:      1104.5000,
                        FZB:          2.9900,
                        GZDY :        4.3375,
                        PJDY:         4.3260,
                        XLCS:      2213.5000,
                        ZZ:          26.5000
                    },
                    zxz_xyz: {
                        SDDY:         3.7625,
                        CLL:       2440.0000,
                        LSP:        -41.5000,
                        YHLND:        0.4000,
                        DJWD:     -1171.5000,
                        FZB :         2.3050,
                        GZDY:         3.7935,
                        PJDY :        3.7960,
                        XLCS :     1365.5000,
                        ZZ :          0.5000
                    },
                    zxz_syz: {
                        SDDY:         4.2625,
                        CLL:       3000.0000,
                        LSP :        74.5000,
                        YHLND :       2.8800,
                        DJWD:      2200.5000,
                        FZB :         2.8250,
                        GZDY:         4.3095,
                        PJDY:         4.3080,
                        XLCS:      2129.5000,
                        ZZ:          20.5000
                    }
                },
                params_param_key: [
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
                    ]
            }
        },
        computed: {},
        mounted() {
            this.getNoMenuData();
            this.initLoadData();
            // var data = JSON.parse(sessionGet('formdata'));
            // this.form.origin = data.fun_data;
            // this.form.date = data.date;
        },
        watch: {
            // paramsText(val) {
            //     this.$refs.tree.filter(val);
            // }
        },
        methods: {
            initLoadData() {
                getLoad({name:''}).then((res) => {
                    if(res.code===200) {
                        var arr = []
                        this.form.origin_options.forEach((item) => {
                            res.data.forEach((j) => {
                                if(item.value === j.name) {
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
                getLoad({name:name}).then((res) => {
                    if(res.code===200) {
                        this.form.date = [res.data[0].start_time,res.data[0].end_time];
                        var arr = res.data[0].numbers.split(',');
                        var data = []
                        this.tree_data[0].children.forEach((i)=> {
                            arr.forEach((j) => {
                                if(i.value===j) {
                                    data.push(i)
                                }
                            })
                        })
                        this.tree_data[0].children = data;
                    }
                })
            },
            deleteAbnCharts() {
                deleteLoad({name:this.form.origin}).then((res) => {
                    if(res.code===200) {
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
                getParamsMenu().then((res) => {
                    if (res.code === 200) {
                        this.form.params_options = res.data;
                    }
                })
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
            getKnnCharts() {
                let code_arr = ['兰州铝业电解铝板块一厂(400kA)五车间二工区5048#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5049#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5050#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5051#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5052#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5053#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5054#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5055#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5057#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5059#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5060#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5061#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5062#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5063#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5064#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5065#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5066#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5068#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5069#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5071#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5072#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5073#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5074#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5075#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5076#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5077#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5079#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5080#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5081#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5082#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5084#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5085#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5086#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5091#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5092#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5093#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5094#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5095#电解槽',
                                '兰州铝业电解铝板块一厂(400kA)五车间二工区5096#电解槽']  
                var that = this;
                let legend = ['槽控工艺报出铝量 (kg)','槽控日报设定电压 (V)','槽控工艺报铝水平 (cm)','槽控工艺报氧化铝浓度 (%)','槽控工艺报电解温度 (℃)',
                '槽控工艺报分子比 (N/A)','槽控日报工作电压 (V)','槽控日报平均电压 (V)','槽控日报下料次数 (次)','槽控日报针振 (mV)']
                // that.form.params.forEach((j) => {
                //     legend.splice(legend.indexOf(j),1)
                // })
                
                // if(that.form.params.length===0) {
                //     that.$message.warning('至少保留一项参数')
                //     return
                // }
                // let legend = [that.form.params];
                this.table_column = legend;
                var str = '{"列表号":"list","槽号":"number","时间":"time",'
                console.log(this.table_column);
                this.table_column.forEach((i,index) => {
                    if(index===this.table_column.length-1) {
                        str+='"'+i+'":"'+i+'"'
                    } else {
                        str+='"'+i+'":"'+i+'",'
                    }
                })
                str += '}'
                this.json_fields = JSON.parse(str)
                this.form.numbers = this.$refs['tree'].getCheckedKeys();
                var params = {
                    numbers: this.form.numbers.toString(),
                    params: that.form.params.toString(),
                    date: this.form.date.toString(),
                    chart: this.form.chart_type,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    fun: this.form.origin+'_database',
                    fun1: this.form.origin+'_'+this.form.fun
                }
                // var params = {
                //     "params": "FZB,CLL,YHLND",
                //     "date": "2021-02-01,2021-05-01",
                //     "chart": "1"
                // }
                console.log(params);
                let excel_params = JSON.parse(JSON.stringify(params))
                excel_params.params = ['槽控工艺报出铝量 (kg)','槽控日报设定电压 (V)','槽控工艺报铝水平 (cm)','槽控工艺报氧化铝浓度 (%)','槽控工艺报电解温度 (℃)',
                '槽控工艺报分子比 (N/A)','槽控日报工作电压 (V)','槽控日报平均电压 (V)','槽控日报下料次数 (次)','槽控日报针振 (mV)'].toString()
                excel_params.pageSize = -1
                excel_params.chart = '4'
                getKnnChart(excel_params).then((res) => {
                    if(res.code === 200) {
                        this.json_data = res.data;
                    }
                })
                this.series_list = []
                if(this.form.chart_type==='1') {
                    this.tableData_visible = false;
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
                                            series_i.push([data_i.time, parseFloat(data_i.value).toFixed(3)])
                                        }
                                    })
                                    let mark_line_data = this.getMarkLine(params)
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
                                            data: mark_line_data
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
                } else if(this.form.chart_type==='2') {
                    this.tableData_visible = false;
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
                    getKnnChart(params).then((res) => {
                        if(res.code === 200) {
                            this.tableData = res.data;
                            this.json_data = this.tableData;
                            this.tableData_visible = true;
                            this.total = res.total;
                        }
                    })
                }
                
                // this.drawChart2();
                // this.drawChart3();
            },
            setloadData() {
                this.form.numbers = this.$refs['tree'].getCheckedKeys();
                this.form.fun_options.forEach((item) => {
                    if(this.form.fun === item.value) {
                        this.form.fun_data = item.value
                        var params = {
                            start_time: this.form.date[0],
                            end_time: this.form.date[1],
                            name: this.form.origin+'_'+this.form.fun,
                            numbers: this.form.numbers.toString()
                        }
                        setLoad(params).then((res) => {
                            if(res.code===200) {
                                this.$message.success('载入成功')
                            }
                        })  
                    }
                })
                // sessionSet('formdata', JSON.stringify(this.form))
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getKnnCharts();
            },
            handleCurrentChange(val) {
                this.pageNo = val
                this.getKnnCharts();
            },
            getMarkLine(params) {
                let params_name = ''
                this.params_param_key.forEach((i) => {
                    if(params.params===i.label) {
                        params_name = i.value
                    }
                })
                var data = []
                data.push({ yAxis: this.param_key[params.fun1.split('_')[0]+'_syz'][params_name] })
                data.push({ yAxis: this.param_key[params.fun1.split('_')[0]+'_xyz'][params_name] })
                return data
            },
            getNumberMax(num) {
                var i = parseInt(num);
	            var l=0;
                var res = parseInt(num)
                while(i >= 1){
                    i=i/10;
                    l++;
                }
                switch(l) {
                    case 1: res=res+1;break;
                    case 2: res=res+10;break;
                    case 3: res=res+50;break;
                    case 4: res=res+100;break;
                }
			    return res
            },
            getNumberMin(num) {
                var i = parseInt(num);
	            var l=0;
                var res = parseInt(num)
                while(i >= 1){
                    i=i/10;
                    l++;
                }
                switch(l) {
                    case 1: res=res-1;break;
                    case 2: res=res-10;break;
                    case 3: res=res-50;break;
                    case 4: res=res-100;break;
                }
			    return res
            },
            drawChart1() {
                this.series_list.forEach((series_i) => {
                    let range = series_i.data[0].markLine.data;
                    let range_max = this.getNumberMax(range[0].yAxis)
                    let range_min = this.getNumberMin(range[1].yAxis)
                    console.log(range_max,range_min);
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
                        min: range_min,
                        max: range_max,
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
                .pagediv {
                    height: 5rem;
                    display: flex;
                    }
            }
        }
    }
</style>