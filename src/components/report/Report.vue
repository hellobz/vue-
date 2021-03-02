<template>
    <div class="report">
         <!--面包屑导航-->
        <el-breadcrumb class="card_user" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width:750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
//1.导入echarts包
import echarts from 'echarts'
import _ from 'lodash'
//使用lodash将两个对象合并
export default {
    name: 'report',
    data(){
        return{
            //需要合并的数据
            options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ]
            }
        }
    },

    created(){
    },

    //在created里面初始化图表会报错
    async mounted(){
        // 基于准备好的dom，初始化echarts实例
        // 3.此时页面上的元素已经被渲染完毕了
        var myChart = echarts.init(document.getElementById('main'));
        // 发起请求
        const {data: res} = await this.$http.get('api/reports/type/1');
        if(res.meta.status !== 200) return this.$message.error('获取折线图数据失败');

        // 4.准备数据和配置项
        // 指定图表的配置项和数据 
       const opdata =  _.merge(res.data,this.options)      

        // 5.展示数据
        myChart.setOption(opdata);
    },

    methods:{    
    }
}
</script>

<style lang="scss" scoped>

</style>