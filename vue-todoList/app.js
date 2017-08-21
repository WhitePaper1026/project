import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'cINj4IIkDIGIn04wVT5tSgDD-gzGzoHsz';
var APP_KEY = 'viJ669Phz4VHn0Yof7PBXbSE';
	AV.init({
	  appId: APP_ID,
	  appKey: APP_KEY
	});



var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    currentUser:null,
    actionType:'signUp',
    formData:{
    	username:'',
    	password:''
    }
  },
  created: function(){
    // onbeforeunload文档：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onbeforeunload
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList) // JSON 文档: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON
      window.localStorage.setItem('myTodos', dataString) // 看文档https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage
    }

    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []

    this.currentUser = this.getCurrentUser();

  },
  methods:{
  	addTodo:function(){
  		this.todoList.push({
  			title:this.newTodo,
  			createAt:new Date(),
  			done:false
  		})
  		this.newTodo=''
  	},
  	removeTodo:function(todo){
  		let index = this.todoList.indexOf(todo)
  		this.todoList.splice(index,1)
  	},
  	signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => { // 👈，将 function 改成箭头函数，方便使用 this
        this.currentUser = this.getCurrentUser() // 👈
      }, (error) => {
        alert('注册失败') // 
      });
    },
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => { // 👈
        this.currentUser = this.getCurrentUser() // 👈
      }, function (error) {
        alert('登录失败') // 👈
      });
    },
     getCurrentUser: function () { // 👈
      let current = AV.User.current()
       if (current) {
         let {id, createdAt, attributes: {username}} = current
         // 上面这句话看不懂就得看 MDN 文档了
         // 我的《ES 6 新特性列表》里面有链接：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
         return {id, username, createdAt} // 看文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#ECMAScript_6%E6%96%B0%E6%A0%87%E8%AE%B0
       } else {
         return null
       }
    },
    logout: function () {
	    AV.User.logOut()
	    this.currentUser = null
       	window.location.reload()
      }



  }
})                