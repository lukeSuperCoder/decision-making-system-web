<template>
    <div class="main">
       <el-row class="header">
            <div class="header-item">
                出铝量：
                <el-select style="width:150px" v-model="form.code" collapse-tags multiple placeholder="请选择">
                    <el-option
                    v-for="item in code_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                设定电压：
                <el-select style="width:150px" v-model="form.params" collapse-tags multiple placeholder="请选择">
                    <el-option
                    v-for="item in params_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                空缺值处理：
                <el-select style="width:150px" v-model="form.code" collapse-tags multiple placeholder="请选择">
                    <el-option
                    v-for="item in code_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="header-item">
                异常值处理：
                <el-select style="width:150px" v-model="form.params" collapse-tags multiple placeholder="请选择">
                    <el-option
                    v-for="item in params_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <span style="margin-left: 20px;">起止时间：</span>
            </div>
            <div>
                <div class="block">
                    <el-date-picker
                        v-model="form.date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="header-item">
                <el-button type="primary" @click="getCharts">查询</el-button>
            </div>
       </el-row>
       <el-row class="content">
            <el-card class="card">
                
            </el-card>
       </el-row>
    </div>
</template>

<script>
export default {
    name: "DataPretreatment",
    components: { },
    data() {
        return {
            form: {
                code: '',
                code_options: [],
                params: '',
                params_options: [],
                date: '',
                chart_type: '',
                chart_options: []
            }
        }
    },
    computed: {},
    mounted() {
    },
    methods: {
        getCharts() {
            
        }
    },
};
</script>

<style scoped lang="scss">
    .main {
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
            }
        }
    }
</style>
  