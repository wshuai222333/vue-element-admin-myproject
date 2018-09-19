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
                <!-- <el-col :span="8"> 用户名:
          <m-input placeholder="用户名" v-model="username" />
        </el-col>
        <el-col :span="8"> 手机号:
          <m-input placeholder="手机号" v-model="phone" />
        </el-col>
        <m-button type="info" @click="onQueryClick(1)">查询</m-button> -->
                <m-button type="info" @click="dialogFormVisible = true">添加</m-button>
            </el-row>

            <p></p>
            <el-table :data="tableData">
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="商户编号" prop="AgentId"></el-table-column>
                <el-table-column label="商户名称" prop="MerchantName"></el-table-column>
                <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
                <el-table-column label="协议费率" prop="Rate"></el-table-column>
                <el-table-column label="电话" prop="Phone"></el-table-column>
                <el-table-column label="UserKey" prop="UserKey"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="onClickModify(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog title="添加商户" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="商户名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="协议费率" :label-width="formLabelWidth">
                    <el-input v-model="form.rate" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickAdd(0)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改商户" :visible.sync="dialogMFormVisible">
            <el-form :model="form">
                <el-form-item label="商户名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="协议费率" :label-width="formLabelWidth">
                    <el-input v-model="form.rate" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickAdd(form.agentid)">确 定</el-button>
            </div>

        </el-dialog>
    </div>

</template>

<script>
import Service from "../_common";
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      dialogMFormVisible: false,
      form: {
        name: "",
        rate: "",
        phone: "",
        agentid: ""
      },
      formLabelWidth: "100px"
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.onQueryClick(val);
    },

    onQueryClick: function(pageindex) {
      this.$http
        .post(
          "/api/Agent/AgentList",
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
    },
    onClickModify(agent) {
      //   debugger;
      this.dialogMFormVisible = true;
      this.form.name = agent.MerchantName;
      this.form.rate = agent.Rate;
      this.form.phone = agent.Phone;
      this.form.agentid = agent.AgentId;
    },
    onClickAdd(agentid) {
      debugger;
      this.$http
        .post(
          "/api/Agent/AddAgent",
          Service.Encrypt.DataEncryption({
            MerchantName: this.form.name,
            Rate: this.form.rate,
            Phone: this.form.phone,
            AddAgentId: agentid
          })
        )
        .then(
          response => {
            if (
              response.Data &&
              response.Data != null &&
              response.Data != undefined
            ) {
              if (response.Data > 0) {
                this.$message("商户添加或修改成功!");
                this.dialogFormVisible = false;
                this.dialogMFormVisible = false;
                this.form.name = "";
                this.form.rate = "";
                this.form.phone = "";
                this.onQueryClick(1);
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
                Memberlevel: row.Memberlevel
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