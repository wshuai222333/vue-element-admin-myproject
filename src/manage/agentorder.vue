<template>
  <div class="page-body">
    <div class="page-header">
      <h1 class="page-title">商户订单管理</h1>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商户订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box">
      <el-row>
        <el-col :span="12"> 订单号:
          <m-input placeholder="订单号" v-model="orderid" />
        </el-col>
        <el-col :span="12"> 交易状态:
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
        <span>总金额:
          <strong v-text="totalamount"></strong>
        </span>
        <span>总利润:
          <strong v-text="totalProfits"></strong>
        </span>
      </el-row>

      <p></p>

      <el-table :data="tableData">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单号" prop="TradeOrderId"></el-table-column>
        <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
        <el-table-column label="交易金额" prop="Amount"></el-table-column>
        <el-table-column label="协议手续费率" prop="AgentRate"></el-table-column>
        <el-table-column label="商户手续费费率" prop="TradeRate"></el-table-column>
        <el-table-column label="商户手续费" prop="Poundage"></el-table-column>
        <el-table-column label="商户利润" prop="Profits"></el-table-column>
        <el-table-column label="状态" prop="State" :formatter="formatter"></el-table-column>
        <el-table-column label="交易时间" prop="TradeTime"></el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
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
      orderid: "",
      tradetimes: [],
      begintime: "",
      endtime: "",
      totalProfits: 0,
      totalamount:0
    };
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.user
    })
  },
  methods: {
    ...mapActions(["getLoginUser", "logout"]),
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
      let usermodel = this.user;
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
          "/api/Agent/GetAgentTradeListByAdmin",
          Service.Encrypt.DataEncryption({
            State: this.state,
            TradeOrderId: this.orderid,
            BeginTime: this.begintime,
            EndTime: this.endtime,
            pageindex: pageindex,
            pagesize: 10
          })
        )
        .then(
          response => {
            debugger;
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
          "/api/Agent/GetAgentTradeTotal",
          Service.Encrypt.DataEncryption({
            State: this.state,
            TradeOrderId: this.orderid,
            BeginTime: this.begintime,
            EndTime: this.endtime,
            
          })
        )
        .then(
          response => {
            if (response.Data != null && response.Data != undefined) {
              if (response.Status == 100) {
                this.totalProfits = response.Data.TotalProfits;
                this.totalamount = response.Data.TotalAmount
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