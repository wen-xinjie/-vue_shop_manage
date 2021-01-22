<template>
  <div class="welcome-container">
      <span>welcome! </span>
      <span class="userName">{{userName}}</span> 
  </div>
</template>

<script>
export default {
data(){
  return{
    userName:''
  }
},
created(){
  this.getUserName();
},
methods:{
  getUserName(){
     this.userName = window.sessionStorage.getItem("username");
  }
}
}
</script>

<style lang="less" scoped>
.userName{
  color: rgb(99, 32, 32);
  font-size: 18px;
  font-weight: 600;
  margin: 0 8px;
}
</style>