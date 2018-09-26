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
         <el-col :span="8"> 用户编号:
          <m-input placeholder="用户编号" v-model="userid" />
        </el-col>
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
        <el-table-column label="用户编号" prop="UserAccountId"></el-table-column>
        <el-table-column label="用户名" prop="UserName"></el-table-column>
        <el-table-column label="电话" prop="Phone"></el-table-column>
        <el-table-column label="注册时间" prop="CreateTime"></el-table-column>
        <el-table-column label="积分" prop="Integral"></el-table-column>
        <el-table-column label="会员等级" prop="Memberlevel">
          <!-- <template slot-scope="scope">
            <el-select @change="onMemberlevel(scope.row)" v-model="scope.row.Memberlevel" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

          </template> -->
        </el-table-column>
        <el-table-column label="二维码权限" prop="IsQrcode" :formatter="formatter"></el-table-column>
        <el-table-column label="协议费率" prop="Rate"></el-table-column>
        <el-table-column label="协议手续费" prop="DrawFee"></el-table-column>
        <el-table-column label="对外费率" prop="UserRate"></el-table-column>
        <el-table-column label="对外手续费" prop="UserDrawFee"></el-table-column>
        <!-- <el-table-column label="二维码权限" prop="IsQrcode">
          <template slot-scope="scope">
            <el-select @change="onqrcode(scope.row)" v-model="scope.row.IsQrcode" placeholder="请选择">
              <el-option v-for="item in qrcodeoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onClickModify(scope.row)">二维码权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next" :current-page="currentPage" :total="total" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="二维码权限" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="二维码权限" :label-width="formLabelWidth">
          <el-select v-model="form.isqrcode" placeholder="请选择">
            <el-option v-for="item in qrcodeoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协议费率" v-if="form.isqrcode==1" :label-width="formLabelWidth">
          <el-input v-model="form.rate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="协议手续费" v-if="form.isqrcode==1" :label-width="formLabelWidth">
          <el-input v-model="form.drawfee" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onModifyQrcode(form.userid)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Service from "../_common";
export default {
  data() {
    return {
      username: "",
      phone: "",
      userid:"",
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {
        isqrcode: "",
        rate: "",
        drawfee: "",
        userid: ""
      },
      formLabelWidth: "100px",
      qrcodeoptions: [
        {
          value: 0,
          label: "无"
        },
        {
          value: 1,
          label: "有"
        }
      ],
      currentPage:1
    };
  },
  methods: {
    formatter(row, column) {
      var msg = "";
      switch (parseInt(row.IsQrcode)) {
        case 1:
          msg = "有";
          break;
        case 0:
          msg = "无";
          break;
        default:
          msg = "未知状态";
          break;
      }
      return msg;
    },
    handleCurrentChange(val) {
      this.onQueryClick(val);
    },

    onQueryClick: function(pageindex) {
      this.currentPage = pageindex;
      //添加交易请求
      this.$http
        .post(
          "/api/User/UserList",
          Service.Encrypt.DataEncryption({
            UserName: this.username,
            Phone: this.phone,
            UserAccountId:this.userid,
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
    },
    onqrcode(row) {
      this.$confirm("是否确认修改二维码权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(
              "/api/User/ModifyQrcode",
              Service.Encrypt.DataEncryption({
                UserAccountId: row.UserAccountId,
                IsQrcode: row.IsQrcode
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
    },
    onClickModify(User) {
      this.dialogFormVisible = true;
      this.form.isqrcode = User.IsQrcode;
      this.form.rate = User.Rate;
      this.form.drawfee = User.DrawFee;
      this.form.userid = User.UserAccountId;
    },
    onModifyQrcode(UserId) {
      this.$http
        .post(
          "/api/User/ModifyQrcode",
          Service.Encrypt.DataEncryption({
            UserAccountId: UserId,
            IsQrcode: this.form.isqrcode,
            Rate: this.form.rate,
            DrawFee: this.form.drawfee
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