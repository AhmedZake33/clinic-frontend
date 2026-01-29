<template>
    <v-app>
        <h1  style="text-align:center">إسناد طفل</h1>

        <div class="main" v-if="!final">
            <div>
                <v-form>
                    <v-row>
                        <v-col cols="4">
                            <h4>اسم الطفل : </h4>
                        </v-col>
                        <v-col cols="8">
                            <v-select
                                :items="[' خالد','احمد ']"
                                outlined
                            ></v-select>
                        </v-col>
                    </v-row>
                     <v-row>
                        <v-col cols="4">
                            <h4>اسم المتخصص : </h4>
                        </v-col>
                        <v-col cols="8">
                            <v-select
                                :items="['عيسي ','زكي ']"
                                outlined
                            ></v-select>
                        </v-col>
                    </v-row>
                     <v-row>
                        <v-col cols="4">
                            <h4>اسم المدرسه : </h4>
                        </v-col>
                        <v-col cols="8">
                            <v-select
                                :items="['مدينه العمال ','طلعت حرب ']"
                                outlined
                            ></v-select>
                        </v-col>
                    </v-row>
                     <v-row>
                        <v-col cols="4">
                            <h4>الصف الدراسي  : </h4>
                        </v-col>
                        <v-col cols="8">
                            <v-select
                                :items="['الصف الاول','الصف التاني']"
                                outlined
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-btn style="color:white;font-weight:bold" color="#10a29b" @click="addChild">إسناد طفل </v-btn>

                     
                </v-form>

            </div>
        </div>
        <div class="main">
        <div class="contentDiv" v-if="final">
                <h3>تم إسناد الطفل  محمود للمتخصص ابراهيم</h3><br>
            <v-row>
                <v-col cols="6">
                    <v-btn @click="showAll" style="color:white" class="showAll" color="#10a29b">عرض اطفال المتخصص </v-btn>
                </v-col>

                <v-col cols="6">
                    <v-btn @click="addNew" style="border-color:#10a29b;color:#10a29b" class="addNew" outlined> إسناد طفل جديد  </v-btn>
                </v-col>
        </v-row>
        </div>
        </div>

    </v-app>
</template>

<script>
export default {
    data(){
        return {
            final:false
        }
    },
    methods:{
        showAll(){
            this.$router.push('/mainComponent/'+5);
        },
        addNew(){
            this.$router.go();
        },
        addChild(){
            this.final = true
        }
    }
}
</script>

<style scoped>
.main {
    padding-top:50px ;
    display: flex;
    align-items: center;
    justify-content: center;
    direction: rtl;
}
.contentDiv{
    text-align:center;
}
</style>