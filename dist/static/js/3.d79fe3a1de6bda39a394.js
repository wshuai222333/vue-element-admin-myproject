webpackJsonp([3],{Luci:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=e("Dd8w"),i=e.n(a),n=e("NYxO"),o={name:"login",data:function(){return{username:"",password:"",isLoging:!1,author:window.APP_INFO.author,version:window.APP_INFO.version,appName:window.APP_INFO.appName}},methods:i()({},Object(n.b)(["login"]),{handleLogin:function(){var t=this;return this.username&&this.password?"wsadmin"!=this.username||"ws654321"!=this.password?this.$message.warning("用户名和密码不正确"):(this.isLoging=!0,void this.login({username:this.username,password:this.password}).then(function(s){t.$message.success("登录成功"),t.$router.push({name:"home"}),t.isLoging=!1})):this.$message.warning("用户名和密码不能为空")}})},r={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"fullscreen"},[e("div",{staticClass:"login-box"},[t._m(0),t._v(" "),e("p",{staticClass:"text-tips"},[t._v("你好，欢迎登录")]),t._v(" "),e("form",{staticClass:"login-form",attrs:{action:""}},[e("div",{staticClass:"m-list-group"},[e("div",{staticClass:"m-list-group-item"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.username,expression:"username"}],staticClass:"m-input",attrs:{type:"text",placeholder:"用户名"},domProps:{value:t.username},on:{input:function(s){s.target.composing||(t.username=s.target.value)}}})]),t._v(" "),e("div",{staticClass:"m-list-group-item"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"m-input",attrs:{type:"password",placeholder:"密码"},domProps:{value:t.password},on:{input:function(s){s.target.composing||(t.password=s.target.value)}}})])]),t._v(" "),e("button",{directives:[{name:"loading",rawName:"v-loading",value:t.isLoging,expression:"isLoging"}],staticClass:"m-btn sub select-none",on:{click:function(s){s.preventDefault(),t.handleLogin(s)}}},[t._v("登录")])]),t._v(" "),e("div",{staticStyle:{"margin-top":"50px"}}),t._v(" "),e("p",{staticClass:"text-tips"},[e("i",{staticClass:"fa fa-meetup",staticStyle:{color:"#29ABE2"}}),t._v(" \n      "),e("span",{staticClass:"footer-text"},[t._v(t._s(t.appName)+"  \n        "),e("el-tag",{attrs:{size:"mini"}},[t._v(t._s(t.version))]),t._v(" "),e("br"),t._v("©make by\n        "),e("a",{attrs:{href:"https://www.github.com/mengdu",target:"_blank"}},[t._v(t._s(t.author))])],1)])])])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticStyle:{"text-align":"center"}},[s("img",{staticClass:"logo",attrs:{src:e("7Otq"),alt:""}})])}]};var l=e("VU/8")(o,r,!1,function(t){e("U3aM")},null,null);s.default=l.exports},U3aM:function(t,s){}});
//# sourceMappingURL=3.d79fe3a1de6bda39a394.js.map