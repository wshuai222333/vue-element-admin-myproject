<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">用户管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <el-row>
                <el-col :span="8"> 用户名:
                    <m-input placeholder="用户名" v-model="username" />
                </el-col>
                <el-col :span="8"> 手机号:
                    <m-input placeholder="手机号" v-model="phone" />
                </el-col>
                <m-button type="info" @click="onQueryClick(1)">查询</m-button>
            </el-row>

            <p></p>
            <el-table :data="tableData">
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="用户名" prop="UserName"></el-table-column>
                <el-table-column label="电话" prop="Phone"></el-table-column>
                <el-table-column label="等级" prop="Memberlevel"></el-table-column>
                <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Service from "../_common";
export default {
  data() {
    return {
      username: "",
      phone: "",
      tableData: [],
      total: 0
    };
  },
  methods: {
    handleCurrentChange(val) {
      
      this.onQueryClick(val);
    },

    onQueryClick: function(pageindex) {
       
      //添加交易请求
      this.$http
        .post(
          "/api/User/UserList",
          Service.Encrypt.DataEncryption({
            UserName: this.username,
            Phone: this.phone,
            pageindex: pageindex,
            pagesize: 10
          })
        )
        .then(
          response => {
            if (
              response.Data &&
              response.Data != null &&
              response.Data != undefined
            ) {
                
              if (response.Status == 100) {
                this.total = response.Data.TotalItems;
                this.tableData = response.Data.Items;
              } else {
                this.$message(response.Message);
              }
            } else {
              this.$message(response.Message);
            }
          },
          error => {
            this.$message(error);
            console.log(error);
          }
        );
    }
  },
  mounted() {
    this.onQueryClick(1);
  }
};
</script>


<style>
.box-body {
  width: 100%;
  overflow: auto;
}
</style>