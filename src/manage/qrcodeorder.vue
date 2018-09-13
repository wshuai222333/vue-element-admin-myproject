<template>
  <div class="page-body">
    <div class="page-header">
      <h1 class="page-title">订单管理</h1>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
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
        <el-col :span="8"> 交易状态:
          <el-select v-model="state" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">交易日期
          <el-date-picker v-model="tradetimes" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="8">
          <m-button type="info" @click="onQueryClick(1)">查询</m-button>
        </el-col>
      </el-row>

      <p></p>

      <el-row>
        <span>总利润:
          <strong v-text="totalProfits"></strong>
        </span>
      </el-row>

      <p></p>

      <el-table :data="tableData">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单号">
          <template slot-scope="scope">
            <i class="el-icon-menu" v-if="scope.row.IsQrcode==1"></i>
            <span style="margin-left: 10px">{{ scope.row.TradeOrderId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="Amount"></el-table-column>
        <el-table-column label="预留手机号" prop="MobileNo"></el-table-column>
        <el-table-column label="收款银行" prop="BankName"></el-table-column>
        <el-table-column label="收款人" prop="AcctName"></el-table-column>
        <el-table-column label="二维码手续费率" prop="TradeRate"></el-table-column>
        <el-table-column label="二维码手续费" prop="Poundage"></el-table-column>
        <el-table-column label="协议手续费率" prop="Rate"></el-table-column>
        <el-table-column label="佣金" prop="Profits"></el-table-column>
        <el-table-column label="状态" prop="State" :formatter="formatter"></el-table-column>
        <el-table-column label="交易时间" prop="TradeTime"></el-table-column>
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
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "未完成"
        },
        {
          value: 1,
          label: "完成"
        },
        {
          value: 2,
          label: "交易失败"
        }
      ],
      state: -1,
      totalProfits: 0,
      tradetimes: [],
      begintime: "",
      endtime: ""
    };
  },
  methods: {
    formatter(row, column) {
      var msg = "";
      switch (parseInt(row.State)) {
        case 1:
          msg = "完成";
          break;
        case 0:
          msg = "未完成";
          break;
        case 2:
          msg = "交易失败";
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
      if (this.tradetimes != null) {
        this.begintime = this.tradetimes[0];
        this.endtime = this.tradetimes[1];
      } else {
        this.begintime = null;
        this.endtime = null;
      }
      //添加交易请求
      this.$http
        .post(
          "/api/Trade/GetTradeList",
          Service.Encrypt.DataEncryption({
            UserName: this.username,
            Phone: this.phone,
            State: this.state,
            BeginTime: this.begintime,
            EndTime: this.endtime,
            pageindex: pageindex,
            pagesize: 10,
            IsQrcode: 1
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
      this.getQueryTotal();
    },
    getQueryTotal: function() {
      this.$http
        .post(
          "/api/Trade/GetTradeTotal",
          Service.Encrypt.DataEncryption({
            State: this.state,
            TradeOrderId: this.orderid,
            BeginTime: this.begintime,
            EndTime: this.endtime
          })
        )
        .then(
          response => {
            
            if (response.Data != null && response.Data != undefined) {
              if (response.Status == 100) {
                this.totalProfits = response.Data;
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
    this.tradetimes = [this.getWeekBeforeFormatDate(), this.getNowFormatDate()];
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