<template>
    <v-app>
        <div class="main" v-if="$route.params.id == 1">
            <div class="addForm">
                <h2>إضافه طفل جديد</h2>
                <div class="heading">
                     <div class="numberCard">1</div> 
                    <div class="text additionalText">
                        البيانات الاوليه للحاله 
                    </div>

                    <div class="numberCard">2</div> 
                    <div class="text additionalText">
                        البيانات التفصيليه  
                    </div>

                    <div class="numberCard">3</div> 
                    <div class="text additionalText">
                          تاريخ الحاله 
                    </div>

                    <div class="numberCard">4</div> 
                    <div class="text additionalText">
                        المشاكل   
                    </div>

                    <div class="numberCard">5</div> 
                    <div class="text additionalText">
                         بيانات الاسره  
                    </div>

                    <div class="numberCard">6</div> 
                    <div class="text additionalText">
                        المهارات
                    </div>

                </div>
                <div class="data">
                    <div class="initData div" v-if="type == 0">
                        <v-form>
                            <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>اسم الطفل :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span> هاتف المنزل :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>

                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>رقم الملف  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>  رقم المحمول :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>تاريخ الميلاد  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>  نوع الاعاقه :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span> العمر :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span> مدخل البيانات  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>محل الميلاد  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                
                            </v-row>


                            <v-btn
                            @click="nextInit"
                            depressed
                            color="primary"
                            >
                            التالي
                            </v-btn>

                            
                        </v-form>
                    </div>

                    <div class="div" v-if="type == 1">
                        <v-row>
                            <v-col cols="6">
                                <span>كود الاعاقه</span>
                                <v-text-field
                                    solo
                                ></v-text-field>
                            </v-col>
                        </v-row>
                         <v-row>
                            <v-col cols="6">
                                <span>وصف الاعاقه</span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>
                         <v-row>
                            <v-col cols="6">
                                <span>الخدمات </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <span>الخدمات الاضافيه </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                            <v-btn color="primary" @click="nextDetails">التالي</v-btn>
                    </div>

                    <div class="div" v-if="type == 2">
                        <v-row>
                            <v-col cols="6">
                                <span>حدوث الاعاقه</span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="قبل الولاده"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="اثناء الولاده"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                     <v-radio
                                        label="بعد الولاده"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                          <v-row>
                            <v-col cols="6">
                                <span>سبب الاعاقه</span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row>
                           
                            <v-col cols="6">
                                <span>عمر الوالدين عند الولاده</span>
                                <v-row>
                                    <v-col cols="2">الاب</v-col>
                                    <v-col cols="4">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>

                                </v-row>
                                 <v-row>
                                    <v-col cols="2">الام</v-col>
                                    <v-col cols="4">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>

                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <span> هل التحق الطفل بمؤسسه تعليميه</span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>


                         <v-row>
                            <v-col cols="6">
                                <span> هل لدي الطفل مشاكل سلوكيه   </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>


                          <v-btn color="primary" @click="toProblem">التالي</v-btn>
                    </div>

                    <div class="problems div" v-if="type == 3">
                        <v-row>
                            <v-col cols="6">
                                <span>هل يعاني من مشاكل صحيه </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <span>هل  لديه اعاقه عقليه   </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>هل لديه مشاكل في السمع او الابصار    </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <span>هل لديه اعاقات اخري    </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <span>هل لديه حساسيه من بعض الاطعمه    </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <span>هل  لديه حساسيه صدريه او جلديه   </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <span>هل يتناول الادويه    </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <span>هل  يعاني من التشنجات   </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                        <v-btn color="primary" @click="toFamily">التالي</v-btn>
                    </div>

                    <div class="family div" v-if="type == 4">
                        <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>اسم ولي الامر :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span> العمر  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>صله القرابه   :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                        <span> رقم المحمول  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>المهنه   :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="4">
                                            <span> المستوي التعليمي  :</span>
                                    </v-col>
                                    <v-col cols="5">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>هاتف العمل   :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span> عنوان العمل  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>اسم الام  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span> العمر  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>منطقه السكن    :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span> رقم المحمول  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>المهنه   :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span> المستوي التعليمي  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>هاتف العمل   :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span> عنوان العمل  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span>عدد الاخوه   :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                            <span> ترتيب الطفل  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span> هل يوجد صله قرابه بين الوالدين   </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    
                                 </v-radio-group>  
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span> هل يوجد امراض مزمنه في الاسره      </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    
                                 </v-radio-group>  
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span> هل يوجد حالات مماثله في الاسره      </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="نعم "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="لا "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    
                                 </v-radio-group>  
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <span>التوضيح </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span> وسيله النقل </span>
                                 <v-radio-group
                                    column
                                    >
                                    <v-radio
                                        label="ولي امر "
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                     <v-radio
                                        label="سائق خاص "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                      <v-radio
                                        label="حافله المركز  "
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    
                                 </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                        <span>اسم السائق  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                        </v-row>

                         <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="3">
                                        <span>جوال السائق  :</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            solo
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                    
                                <span>الدخل الشهري</span>                  
                                <v-radio-group
                                column
                                >
                                <v-radio
                                    label="ضعيف اقل من 3000 الاف "
                                    color="#10a29b"
                                    value="1"
                                ></v-radio>
                                    <v-radio
                                    label="جيد 3000-5000 "
                                    color="#10a29b"
                                    value="2"
                                ></v-radio>
                                    <v-radio
                                    label=" جيد جدا 5000-10000 "
                                    color="#10a29b"
                                    value="3"
                                ></v-radio>
                                    <v-radio
                                    label="ممتاز اكثر من 10000"
                                    color="#10a29b"
                                    value="4"
                                ></v-radio>   
                                </v-radio-group>  
                            </v-col>
                        </v-row>

                        <v-btn color="primary" @click="toSkills">التالي</v-btn>
                   

                    </div>

                    <div class="skills div" v-if="type == 5">
                        <span> المهارات الاجتماعيه : </span>
                        <v-row>
                            <v-col cols="3">
                                <h5>يشارك اقرانه في اللعب</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5> هل يشارك الطفل اسرته   </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5>يستجيب للمؤثرات الاجتماعيه</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5>يقلد حركات الاخرين  </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <span> المهارات الادراكيه : </span>

                        <v-row>
                            <v-col cols="3">
                                <h5>يدرك بنفسه    </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5>يدرك والديه/اخوته/المربيه</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5> يدرك الاشياء المحيطه من حوله</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5> يتعرف علي صور الاشياء المحيطه من حوله  </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <span> المهارات الاتصاليه : </span>

                        <v-row>
                            <v-col cols="3">
                                <h5>  التواصل البصري </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5>  اللغه الاستقباليه  </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <span>المهارات الحركيه :</span>
                        <v-row>
                            <v-col cols="3">
                                <h5>يشارك اقرانه في اللعب</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5> هل يشارك الطفل اسرته   </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5>يستجيب للمؤثرات الاجتماعيه</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                               
                                <h5>يقلد حركات الاخرين  </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="نعم"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="لا"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                   <v-col cols="2">
                                        <v-radio
                                        label="نوعا ما"
                                        color="#10a29b"
                                        value="3"
                                    ></v-radio>
                                    </v-col>
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <span>المساعده الذاتيه  :</span>

                        
                        <v-row>
                            <v-col cols="3">
                                <h5>يشارك اقرانه في اللعب</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="مستقل"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="بمساعده"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5>هل يشارك الطفل اسرته</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="مستقل"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="بمساعده"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5>يستجيب للمؤثرات الاجتماعيه   </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="مستقل"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="بمساعده"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <h5>يقلد حركات الاخرين   </h5>
                            </v-col>
                            <v-col cols="9">
                                <v-radio-group
                                    column
                                >
                                <v-row>
                                    <v-col cols="2">
                                        <v-radio
                                        label="مستقل"
                                        color="#10a29b"
                                        value="1"
                                    ></v-radio>
                                    </v-col>
                                   
                                    <v-col cols="2">
                                        <v-radio
                                        label="بمساعده"
                                        color="#10a29b"
                                        value="2"
                                    ></v-radio>
                                    </v-col>
                                    
                                      
                                </v-row>
                               </v-radio-group>  
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <span>اذكر بعض المعززات لدي الطفل </span>
                                <v-textarea
                                auto-grow
                                outlined
                                rows="5"
                                row-height="30"
                            ></v-textarea>
                            </v-col>
                        </v-row>

                        <v-btn color="#10a29b" style="color:white" 
                        @click="addChild">إضافه</v-btn>



                    </div>


                    <div class="div final" v-if="type == 6" >
                      
                        <div class="contentDiv">
                              <h3>تم اضافه الطفل بنجاح</h3><br>
                            <v-row>
                                <v-col cols="6">
                                    <v-btn @click="showAll" style="color:white" class="showAll" color="#10a29b">عرض قائمه الاطفال</v-btn>
                                </v-col>

                                <v-col cols="6">
                                    <v-btn @click="addNew" style="border-color:#10a29b;color:#10a29b" class="addNew" outlined> إضافه طفل جديد  </v-btn>
                                </v-col>
                        </v-row>
                        </div>
                      
                    </div>
                </div>  
            </div>
        </div>

        <div class="main" v-if="$route.params.id == 2">
            <div class="addForm" v-if="!showSuccess">
                <h2>إضافه مدرسه</h2>
                <div class="header">
                    <h3>بيانات المدرسه المراد اضافتها</h3>
                </div>
                <div class="data">
                 <div class="initData div">
                        <v-form>
                            <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>الكود  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span> الاسم بالانجليزيه  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>

                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>الاسم بالعربي   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>  المرحله  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>البريد الالكتروني   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>  الهاتف  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="5">
                                             <span> نوع المؤسسه التعليميه :</span>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span> نوع الترخيص   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>البلد   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                <v-row>
                                        <v-col cols="3">
                                             <span>المدينه   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                
                            </v-row>

                              <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>المنطقه   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                <v-row>
                                        <v-col cols="3">
                                             <span>الشارع   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                
                            </v-row>


                              <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>العنوان مفصل   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-textarea
                                            auto-grow
                                            outlined
                                            rows="2"
                                            row-height="15"
                                        ></v-textarea>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                <v-row>
                                        <v-col cols="3">
                                             <span>مدير الاداره   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                
                            </v-row>


                            <v-btn
                            @click="saveSchool"
                            depressed
                            color="primary"
                            >
                            حفظ
                            </v-btn>
                        </v-form>
                    </div>
                </div> 
            </div>
            <div class="div final" v-if="showSuccess">
            <div class="contentDiv">
                    <h3>تم اضافه المؤسسه بنجاح</h3><br>
                <v-row>
                    <v-col cols="6">
                        <v-btn @click="showSchools" style="color:white" class="showAll" color="#10a29b">عرض قائمه المؤسسات</v-btn>
                    </v-col>

                    <v-col cols="6">
                        <v-btn @click="addNew" style="border-color:#10a29b;color:#10a29b" class="addNew" outlined> إضافه مؤسسه جديد  </v-btn>
                    </v-col>
            </v-row>
            </div>
                      
            </div>

        </div>

        <div class="main" v-if="$route.params.id == 3">
            <div class="addForm" v-if="!showSuccessSpecialist">
                <h2>إضافه متخصص</h2>
                <div class="header">
                    <h3> مستخدم جديد  </h3>
                </div>
                <div class="data">
                 <div class="initData div">
                        <v-form>
                            <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>اسم المستخدم  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span> المسمي الوظيفي   :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>

                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>البريد الالكتروني    :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>  كلمه المرور  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                             <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>الصلاحيات :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select
                                                multiple=""
                                                :items="[' admin','user']"
                                                outlined
                                            ></v-select>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span>  تأكيد كلمه المرور  :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                             <v-row>
                               
                                <v-col cols="6">
                                    <v-row>
                                        <v-col cols="3">
                                             <span> الهاتف :</span>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                solo
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            


                            <v-btn
                            @click="saveSpecialist"
                            depressed
                            color="primary"
                            >
                            حفظ
                            </v-btn>
                        </v-form>
                    </div>
                </div> 
            </div>
            <div class="div final" v-if="showSuccessSpecialist">
            <div class="contentDiv">
                    <h3>تم اضافه المتخصص بنجاح</h3><br>
                <v-row>
                    <v-col cols="6">
                        <v-btn @click="showSpecialist" style="color:white" class="showAll" color="#10a29b">عرض قائمه المستخدمين</v-btn>
                    </v-col>

                    <v-col cols="6">
                        <v-btn @click="addNew" style="border-color:#10a29b;color:#10a29b" class="addNew" outlined> إضافه مستخدم جديد  </v-btn>
                    </v-col>
            </v-row>
            </div>
                      
        </div>
        </div>

        

        
       
    </v-app>
</template>


<script>
export default {

    data(){
        return {
            type:0,
            showSuccess:false,
            showSuccessSpecialist:false
        }
    },
    mounted(){
        console.log(document.getElementsByClassName('numberCard')[0]);
        console.log(document.getElementsByClassName('text')[0])
        let div = document.getElementsByClassName('numberCard')[0];
        let text = document.getElementsByClassName('text')[0];
        text.classList.add("activeText")
        div.classList.add("active")
    },
    methods:{
        nextInit(){
          this.type = 1
            let div = document.getElementsByClassName('numberCard')[1];
            let text = document.getElementsByClassName('text')[1];
            text.classList.add("activeText")
            div.classList.add("active")
        },
        nextDetails(){
            this.type = 2
            let div = document.getElementsByClassName('numberCard')[2];
            let text = document.getElementsByClassName('text')[2];
            text.classList.add("activeText")
            div.classList.add("active")
        },
        toProblem(){
            this.type = 3
            let div = document.getElementsByClassName('numberCard')[3];
            let text = document.getElementsByClassName('text')[3];
            text.classList.add("activeText")
            div.classList.add("active")
        },
        toFamily(){
            this.type = 4
            let div = document.getElementsByClassName('numberCard')[4];
            let text = document.getElementsByClassName('text')[4];
            text.classList.add("activeText")
            div.classList.add("active")
        },
        toSkills(){
            this.type = 5
            let div = document.getElementsByClassName('numberCard')[5];
            let text = document.getElementsByClassName('text')[5];
            text.classList.add("activeText")
            div.classList.add("active")
        },
        addChild(){
           this.type = 6
        },
        showAll(){
            this.$router.push('/mainComponent/'+1);
        },
        showSchools(){
            this.$router.push('/mainComponent/'+2);

        },
        saveSchool(){
            this.showSuccess = true;
        },
        addNew(){
            this.$router.go()
        },
        saveSpecialist(){
            this.showSuccessSpecialist = true
        },
        showSpecialist(){
            this.$router.push('/mainComponent/'+3);
        }
    }
    
}
</script>


<style scoped>

.main{
    margin-top:15px;
    margin-left:10px;
    margin-right: 70px;
} 
.main .addForm {
    /* padding-top:50px ;
    display: flex;
    align-items: center;
    justify-content: center; */
}

.main .addForm .data {
    font-weight: bold;
    font-size: 18px;
    direction: rtl;
}
.main .addForm .heading{
     font-weight: bold;
    font-size: 25px;
    direction: rtl;
}

.main .addForm .header{
    height: 75px;
    background-color: #fbfbfb;
    direction: rtl;
    padding:20px
}

.main .addForm .body{
     display: flex;
    align-items: center;
    justify-content: center;
}

.main .addForm .numberCard{
    height: 20px;
    width: 20px;
    padding: 5px;
    background-color: gray;
    display: inline;
    border-radius: 21%;
    color: aliceblue;
}

.main .addForm .active{
    background-color: #10a29b;
} 

.main .addForm .activeText{
    color:black
}

.main .addForm .text{
    display: inline;
    margin-left: 67px;
   
}

main .addForm .additionalText{
     color:gray;
}

.main .addForm .div{
    margin-top: 20px;
    margin-bottom: 10px;

}




.main .addForm .initData .right{
float: right;
border:1px solid black
}


.main .addForm .initData .left{
float: left;
border:1px solid black

}


.main .addForm h2{
    font-weight: bold;
    margin-bottom: 10px;
    direction: rtl;
}

.main .final {
   display: flex;
align-items: center;
justify-content: center;
}

.main .final h3{
    color:black;
    text-align: center;
}

.main .final .contentdiv{

    text-align: center;
}


</style>