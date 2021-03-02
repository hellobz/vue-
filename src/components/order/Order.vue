<template>
    <div class="order">
         <!--面包屑导航-->
        <el-breadcrumb class="card_user" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单表格 -->
            <el-table :data="orderData" border stripe="">
                <!-- 索引列 -->
                <el-table-column type="index">

                </el-table-column>

                <!--指定与之对应的属性-->
                <el-table-column label="订单编号" prop="order_number">

                </el-table-column>

                 <el-table-column label="订单价格" prop="order_price">

                </el-table-column>

                 <el-table-column label="是否付款" prop="pay_status">
                     <template slot-scope="scope">
                         <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                         <el-tag type="success" v-else>已付款</el-tag>
                     </template>
                </el-table-column>

                 <el-table-column label="是否发货" prop="is_send">

                </el-table-column>

                 <el-table-column label="下单时间" prop="create_time">
                     <template slot-scope="scope">
                         {{scope.row.create_time |dateFormat}}
                     </template>
                </el-table-column>

                 <el-table-column label="操作">
                     <template slot-scope="scope">
                         <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
                         <el-button type="success" size="mini" icon="el-icon-setting" @click="showProgressBox"></el-button>
                     </template>

                </el-table-column>
            </el-table>

            <!-- 修改地址的对话框 -->
             <el-pagination
            @size-change="handleOrderSizeChange"
            @current-change="handleOrderCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 展示修改地址对话框 -->
        <el-dialog
        @close="handleOrderClosed"
        title="修改地址"
        :visible.sync="editOrderVisible"
        width="50%"
        >

        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市区/县">
                <!-- 级联选择器 -->
                <!-- 双向绑定到addressForm的address1上面 -->
                <el-cascader                
                v-model="addressForm.address1"
                :options="cityData"
                >
                </el-cascader>
            </el-form-item>

            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
          
        <span slot="footer" class="dialog-footer">
            <el-button @click="editOrderVisible = false">取 消</el-button>
            <el-button type="primary" @click="editOrderVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 展示物流进度的对话框 -->
        <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%"
        >
         <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
export default {
    name: 'order',
    data(){
        return {
            // 所有订单数据
            orderData: [],

            //当前分页有几条数据
            currentOrderPage4: 5,

            //总数据条数
            total: 0,

            // 请求参数
            queryInfo: {
                //查询参数
                query: '',
                //当前页码
                pagenum: 1,
                // 每页显示条数
                pagesize: 10
            },                  

            addressForm:{            
                address1: [],
                address2: ''
            },

            addressFormRules:{
                address1:[
                    { required: true, message: '请选择省市区县', trigger: 'blur' }
                ],
                address2:[
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ]
            },

            //级联数据源
            cityData,

            // 对话框的显示隐藏
            editOrderVisible: false,

            //物流进度对话框显示隐藏
            progressVisible: false,

            //物流进度信息
            progressInfo: []
        }
    },

    created(){
        this.getOrders();
    },

    methods:{
        //   改变每页条数
          handleOrderSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            //发起请求
            this.getOrders();
        },

        //  改变当前所在页 页码值变化
          handleOrderCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            //发起请求
            this.getOrders();
        },

        // 获取订单列表
        async getOrders(){
            const {data: res} = await this.$http.get('api/orders',{params:this.queryInfo});
            if(res.meta.status !== 200) return this.$message.error('获取订单列表数据失败');
            // 获取所有订单数据
            this.orderData = res.data.goods;
            //获取总条数
            this.total = res.data.total;
        },

        //修改地址显示对话框
        showBox(){
            this.editOrderVisible = true;
        },

        //清空对话框
        handleOrderClosed(){
            this.$refs.addressFormRef.resetFields();
        },

        //点击按钮显示物流进度对话框
        async showProgressBox(){
            const {data: res} = await this.$http.get('api/kuaidi/1106975712662');
            if(res.meta.status !== 200) return this.$message.error('获取物流信息失败');
            this.progressInfo = res.data;            
            this.progressVisible = true;
        }

    }
}
</script>

<style lang="scss" scoped>
    @import '../../plugins/timeline/timeline.css';
    @import '../../plugins/timeline-item/timeline-item.css';

    .el-table-column {
        display: flex;
        justify-content: center;
    }

    // 级联选择器宽度
    .el-cascader {
        width: 100%;
    }
</style>