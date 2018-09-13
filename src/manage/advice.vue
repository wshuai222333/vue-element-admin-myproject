<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">用户管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户留言</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <el-row>
                <!-- <el-col :span="8"> 标题:
                    <m-input placeholder="标题" v-model="title" />
                </el-col> -->
                <m-button type="info" @click="onQueryClick(1)">查询</m-button>
            </el-row>
            <!-- <el-row>
                <el-button type="text" @click="AddClick()">添加</el-button>
            </el-row> -->
            <p></p>
            <el-table :data="tableData">
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="用户编号" prop="UserAccountId"></el-table-column>
                <el-table-column label="内容" prop="AdviceContent"></el-table-column>
                <el-table-column label="提交时间" prop="CreateTime"></el-table-column>
               
                <!-- <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                        <el-button type="text" size="small" @click="modifyClick(scope.row)">编辑</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>

</template>

<script>
import Service from "../_common";

import { VueEditor } from "vue2-editor";
export default {
  data() {
    return {
      title: "",
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {
        title: "",
        body: "",
        ProblemId: 0
      },
      formLabelWidth: "120px"
    };
  },
  components: {
    VueEditor
  },
  methods: {
    handleCurrentChange(val) {
      this.onQueryClick(val);
    },

    onQueryClick: function(pageindex) {
      //添加交易请求
      this.$http
        .post(
          "/api/User/GetAdviceList",
          Service.Encrypt.DataEncryption({
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