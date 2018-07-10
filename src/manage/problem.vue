<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">用户管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>常见问题</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <el-row>
                <el-col :span="8"> 标题:
                    <m-input placeholder="标题" v-model="title" />
                </el-col>
                <m-button type="info" @click="onQueryClick(1)">查询</m-button>
            </el-row>
            <el-row>
                <el-button type="text" @click="AddClick()">添加</el-button>
            </el-row>
            <p></p>
            <el-table :data="tableData">
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="标题" prop="Title"></el-table-column>
                <el-table-column label="内容" prop="Body"></el-table-column>
                <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
                <el-table-column label="修改时间" prop="MotifyTime"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                        <el-button type="text" size="small" @click="modifyClick(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog title="添加" :visible.sync="dialogFormVisible" width="80%">
            <el-form :model="form">
                <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <vue-editor v-model="form.body"></vue-editor>
                    <el-input type="hidden" v-model="form.ProblemId"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSaveClick">确 定</el-button>
            </div>
        </el-dialog>
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
          "/api/User/GetProblemList",
          Service.Encrypt.DataEncryption({
            Title: this.title,
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
    },
    onSaveClick: function() {
      this.$http
        .post(
          "/api/User/AddProblem",
          Service.Encrypt.DataEncryption({
            Title: this.form.title,
            Body: this.form.body,
            ProblemId: this.form.ProblemId
          })
        )
        .then(
          response => {
            if (
              response.Data &&
              response.Data != null &&
              response.Data != undefined
            ) {
              if (response.Status == 100 && response.Data > 0) {
                this.$message("成功");
                this.onQueryClick(1);
                this.dialogFormVisible = false;
              } else {
                this.$message(response.Message);
              }
            } else {
              this.$message(response.Message);
            }
          },
          error => {
            this.$message("请求失败！");
            console.log(error);
          }
        );
    },
    deleteClick(row) {
      this.$http
        .post(
          "/api/User/DeleteProblem",
          Service.Encrypt.DataEncryption({
            ProblemId: row.ProblemId
          })
        )
        .then(
          response => {
            if (
              response.Data &&
              response.Data != null &&
              response.Data != undefined
            ) {
              if (response.Status == 100 && response.Data > 0) {
                this.$message("删除成功！");
                this.onQueryClick(1);
                // this.dialogFormVisible = false;
              } else {
                this.$message(response.Message);
              }
            } else {
              this.$message(response.Message);
            }
          },
          error => {
            this.$message("请求失败！");
            console.log(error);
          }
        );
    },
    modifyClick(row) {
      debugger;
      this.dialogFormVisible = true;
      this.form.title = row.Title;
      this.form.body = row.Body;
      this.form.ProblemId = row.ProblemId;
    },
    AddClick() {
      this.form.ProblemId = 0;
      this.dialogFormVisible = true;
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