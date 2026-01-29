<template>
  <v-app>
    <div class="main">
      <div class="body">
      <div class="left">
        <v-img src="../assets/img/welcome illustration.png" />
      </div>

      <div class="right">
        <h1 style="color:#10a29b">منصه مركز هيلب للشرق الاوسط وشمال افريقيا</h1>
        <div style="width:500px">
          <h4>لوريم لوريم لوريم لوريم لوريم لوريم لوريم لوريم الوريم لوريم لوريم لوريم لوريم الوريم لوريم لوريم لوريم لوريم الوريم لوريم لوريم لوريم لوريم الوريم لوريم لوريم</h4>
        </div>
        <div style="margin-top:40px">
         <v-btn
         
          rounded
          color="#10a29b"
          @click="login"
          x-large
          outlined
          dark
          >
          تسجيل الدخول
          </v-btn>
          &nbsp;
          &nbsp;
           <v-btn
          rounded
          color="#10a29b"
          x-large
          dark
          >
          عن منصة هيلب
          </v-btn>
        </div>  
      </div>
      </div>

      <div class="footer">
       
          <h1 style="color:#10a29b">منصه مركز هيلب للشرق الاوسط وشمال افريقيا</h1>
         
            <h4>لوريم لوريم لوريم لوريم لوريم لوريم لوريم لوريم الوريم لوريم لوريم لوريم لوريم الوريم لوريم لوريم لوريم لوريم الوريم لوريم لوريم لوريم لوريم الوريم لوريم لوريم</h4>
         
        </div>
     

      
    </div>

  
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
    
  },
  methods:{
    login(){
        this.$router.push('/login');
    }
    
  },


  data: () => ({
    //
  }),
};
</script>

<style scoped>



.main .header {
height: 116px;
  background-color:#fbfbfb;
  padding: 20px;

}

.main .header .left {
  float:left;
  margin-top: 16px;
}

.main .header .left button {
  font-weight: bold;
  border-color: #10a29b;

}

.main .header .right {
  float: right;
}

.main .header .right .logo {
  float: right;
}

.main .header .right .lang {
  float: left;
  margin-top:34px;
  margin-right:20px

}

.main .body{
  height: 530px;
  padding: 20px;
  padding-top: 100px;
}
.main .body .left {
  float: left;
  padding-left:50px
}
 
 .main .body .right {
    float:right;
    padding-right: 50px;
    padding-top: 40px;
 }

 .main .body .right button {
    border-color:#10a29b
 }

 .main .footer {
  text-align: center;
 }

button{
  font-weight: bold;
}

 



</style>
