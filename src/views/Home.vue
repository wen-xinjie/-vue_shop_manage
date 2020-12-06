<template>
  <div class="home-container">
      
    <el-button type="info" @click="back">退出</el-button>
  </div>
</template>

<script>
export default {
    methods:{
        back(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }

}
</script>

<style lang="less" scoped>

</style>