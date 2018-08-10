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
        <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
        <el-table-column label="会员等级" prop="Memberlevel">
          <!-- <template slot-scope="scope">
            <el-select @change="onMemberlevel(scope.row)" v-model="scope.row.Memberlevel" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

          </template> -->
        </el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
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
      total: 0,
      options: [
        {
          value: 0,
          label: "普通会员"
        },
        {
          value: 1,
          label: "银卡会员"
        },
        {
          value: 2,
          label: "金卡会员"
        }
      ]
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
    },
    onMemberlevel(row) {
      this.$confirm("是否确认修改会员等级?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(
              "/api/User/ModifyMemberlevel",
              Service.Encrypt.DataEncryption({
                UserAccountId: row.UserAccountId,
                Memberlevel:row.Memberlevel
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
                    this.$message({
                      type: "success",
                      message: "更改成功!"
                    });
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更改"
          });
          this.onQueryClick(1);
        });
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