<template>
    <div class="goods">
         <!--面包屑导航-->
        <el-breadcrumb class="card_user" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <!-- gutter是间隙 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoods">
                        <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
                    </el-input>
                </el-col>

                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <el-table :data="goodslist" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>

                <el-table-column label="商品名称" prop="goods_name"></el-table-column>

                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>

                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>

                <el-table-column label="创建时间" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
            @size-change="handleGoodsSizeChange"
            @current-change="handleGoodsCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 30,70]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background>
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    name: 'goods',

    data(){
        return{
            //请求参数
            queryInfo: {
                //查询参数
                query: '',
                // 当前页码
                pagenum: 1,
                // 每页显示条数
                pagesize: 10
            },
            
            //所有商品列表数据
            goodslist: [],

            // 总条数
            total : 0
        }
    },

    created(){
        this.getGoods();
    },

    methods: {
        //请求所有商品列表数据
        async getGoods(){
            const {data: res} = await this.$http.get('api/goods',{params:this.queryInfo});
            if(res.meta.status !== 200) return this.$message.error('获取商品列表数据失败');
            this.goodslist = res.data.goods;
            this.total = res.data.total;
        },

        // 改变每页显示条数
        handleGoodsSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoods();
        },

        //改变页码
        handleGoodsCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoods();
        },

        //删除信息
        async removeById(id){
         const confirmResult =  await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

        if (confirmResult !== 'confirm'){
            return this.$message.info('已取消删除')
        }

       const {data: res} = this.$http.delete(`api/goods/${id}`);
       if(res.meta.status !== 200) return this.$message.error('删除商品信息失败');
        //提示
        this.$message.success('删除商品信息成功');
        //刷新列表
        this.getGoods();
        },

        //添加商品
        goAddPage(){
            this.$router.push('/goods/add')
        }
    }
}
</script>
<style lang="scss" scoped>

</style>