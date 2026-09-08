<template>
  <div
    class="sub-doctor-permissions-guide"
    :dir="isRtl ? 'rtl' : 'ltr'"
  >
    <!-- Top Onboarding Header Card -->
    <b-card
      no-body
      class="onboarding-header-card shadow-sm border mb-2"
    >
      <b-card-body class="p-2 p-md-3">
        <div class="d-flex flex-wrap align-items-center justify-content-between">
          <div class="d-flex align-items-center mb-2 mb-md-0">
            <div class="guide-header-icon bg-light-primary text-primary p-2 rounded mr-2 ml-2 shadow-xs">
              <feather-icon
                icon="ActivityIcon"
                size="26"
              />
            </div>
            <div>
              <div class="d-flex align-items-center flex-wrap">
                <h4 class="font-weight-bolder text-dark mb-0 mr-2 ml-2">
                  {{ isRtl ? 'دليل وصلاحيات الطبيب المساعد / الزميل' : 'Sub-Doctor & Associate Physician Permissions Guide' }}
                </h4>
                <b-badge
                  variant="light-primary"
                  class="font-weight-bold"
                >
                  {{ isRtl ? `القسم ${currentTabIndex + 1} من ${tabs.length}` : `Step ${currentTabIndex + 1} of ${tabs.length}` }}
                </b-badge>
              </div>
              <p class="text-muted small mb-0 mt-25">
                {{ isRtl ? 'دليل تفاعلي يشرح الصلاحيات الطبية، إكمال الكشوفات، كتابة الروشتات، والفصل بين الاستقلالية السريرية وإدارة العيادة.' : 'Interactive guide detailing clinical autonomy, visit completion, e-prescriptions, and role scope for associate physicians.' }}
              </p>
            </div>
          </div>

          <!-- Progress Bar & Status -->
          <div class="header-progress-box min-w-250">
            <div class="d-flex justify-content-between align-items-center mb-50">
              <span class="extra-small font-weight-bold text-muted">{{ isRtl ? 'نسبة استعراض الصلاحيات' : 'Guide Progress' }}</span>
              <span class="extra-small font-weight-bold text-primary">{{ Math.round(progressPercent) }}%</span>
            </div>
            <b-progress
              :value="progressPercent"
              variant="primary"
              height="8px"
              class="rounded-pill shadow-xs"
            />
          </div>
        </div>

        <!-- HORIZONTAL TABS STRIP -->
        <div class="subdoctor-system-tabs-nav mt-3 pt-2 border-top">
          <div class="d-flex align-items-center overflow-auto pb-1 subdoctor-tabs-scroll">
            <b-button
              v-for="(tab, idx) in tabs"
              :key="tab.key"
              size="sm"
              :variant="currentTabIndex === idx ? 'primary' : 'outline-secondary'"
              class="mr-1 ml-1 font-weight-bold flex-shrink-0 d-inline-flex align-items-center tab-nav-pill"
              :class="{ 'shadow-sm': currentTabIndex === idx }"
              @click="goToTab(idx)"
            >
              <feather-icon
                :icon="tab.icon"
                size="14"
                :class="isRtl ? 'ml-50' : 'mr-50'"
              />
              <span>{{ tab.title }}</span>
              <span
                v-if="completedTabs.includes(idx) && currentTabIndex !== idx"
                class="badge badge-success ml-50 mr-50 p-25"
              >✓</span>
            </b-button>
          </div>
        </div>
      </b-card-body>
    </b-card>

    <!-- Main Guide Body (Sidebar Steps + Interactive Screen Content) -->
    <b-row class="match-height">
      <!-- Steps Sidebar Column -->
      <b-col
        cols="12"
        lg="4"
        xl="3"
        class="mb-2"
      >
        <b-card
          no-body
          class="steps-sidebar-card shadow-sm border h-100"
        >
          <div class="p-2 border-bottom bg-light d-flex align-items-center justify-content-between">
            <span class="small font-weight-bold text-dark d-flex align-items-center">
              <feather-icon
                icon="LayersIcon"
                size="16"
                class="text-primary mr-1 ml-1"
              />
              {{ isRtl ? 'أقسام الطبيب المساعد' : 'Sub-Doctor Modules' }}
            </span>
            <span class="badge badge-light-primary extra-small font-weight-bold">10 {{ isRtl ? 'أقسام' : 'Tabs' }}</span>
          </div>

          <div
            class="steps-nav-list p-2"
            style="max-height: 540px; overflow-y: auto;"
          >
            <div
              v-for="(tab, idx) in tabs"
              :key="tab.key"
              class="step-nav-item p-2 rounded mb-1 d-flex align-items-center justify-content-between pointer"
              :class="{
                'active bg-primary text-white shadow-sm': currentTabIndex === idx,
                'completed bg-light-success text-success': completedTabs.includes(idx) && currentTabIndex !== idx,
                'bg-white text-dark border': currentTabIndex !== idx && !completedTabs.includes(idx)
              }"
              @click="goToTab(idx)"
            >
              <div class="d-flex align-items-center overflow-hidden">
                <div
                  class="step-number-circle mr-2 ml-2 flex-shrink-0 font-weight-bold"
                  :class="currentTabIndex === idx ? 'bg-white text-primary' : (completedTabs.includes(idx) ? 'bg-success text-white' : 'bg-light text-muted')"
                >
                  <feather-icon
                    v-if="completedTabs.includes(idx) && currentTabIndex !== idx"
                    icon="CheckIcon"
                    size="12"
                  />
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <div class="step-nav-title text-truncate small font-weight-bold">
                  {{ tab.title }}
                </div>
              </div>

              <feather-icon
                :icon="isRtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'"
                size="14"
                class="flex-shrink-0 opacity-75"
              />
            </div>
          </div>

          <!-- Quick Tip in Sidebar -->
          <div class="p-2 mt-auto border-top bg-light text-center">
            <p class="extra-small text-muted mb-0">
              💡 {{ isRtl ? 'بصفتك طبيباً مساعداً، تتمتع باستقلالية طبية كاملة في كشوفات وروشتات الحالات المسندة لك.' : 'As an associate physician, you enjoy full clinical autonomy for your assigned cases.' }}
            </p>
          </div>
        </b-card>
      </b-col>

      <!-- Active Tab Content & Real Screen Display -->
      <b-col
        cols="12"
        lg="8"
        xl="9"
        class="mb-2"
      >
        <b-card
          no-body
          class="step-display-card shadow-sm border h-100 d-flex flex-column justify-content-between"
        >
          <!-- Step Header & Description -->
          <b-card-body class="p-3">
            <div class="d-flex align-items-center justify-content-between flex-wrap pb-2 mb-3 border-bottom">
              <div>
                <b-badge
                  variant="light-primary"
                  class="px-2 py-50 mb-1 font-weight-bold"
                >
                  {{ currentTab.badge }}
                </b-badge>
                <h4 class="font-weight-bolder text-dark mb-1">
                  {{ currentTab.title }}
                </h4>
                <p class="text-muted small mb-0 max-w-750">
                  {{ currentTab.desc }}
                </p>
              </div>

              <!-- Live Route Link Action Button -->
              <div
                v-if="currentTab.routeName"
                class="mt-2 mt-sm-0"
              >
                <b-button
                  :to="{ name: currentTab.routeName }"
                  variant="outline-primary"
                  size="sm"
                  class="font-weight-bold"
                >
                  <feather-icon
                    icon="ExternalLinkIcon"
                    size="13"
                    :class="isRtl ? 'ml-50' : 'mr-50'"
                  />
                  <span>{{ isRtl ? 'الانتقال للشاشة في النظام' : 'Open Live Screen' }}</span>
                </b-button>
              </div>
            </div>

            <!-- Permissions & Core Actions Box -->
            <div class="p-2 bg-light-primary rounded border border-primary mb-3">
              <div class="d-flex align-items-center mb-1">
                <feather-icon
                  icon="KeyIcon"
                  size="16"
                  class="text-primary mr-1 ml-1"
                />
                <span class="small font-weight-bold text-dark">
                  {{ isRtl ? 'الصلاحيات الممنوحة في هذا القسم:' : 'Granted Permissions in this Module:' }}
                  <code class="text-primary ml-50 mr-50">{{ currentTab.permissionCodes }}</code>
                </span>
              </div>
              <div class="d-flex align-items-start mb-1">
                <feather-icon
                  icon="CheckCircleIcon"
                  size="16"
                  class="text-primary mr-1 ml-1 flex-shrink-0 mt-25"
                />
                <span class="small text-dark font-weight-600">{{ currentTab.p1 }}</span>
              </div>
              <div class="d-flex align-items-start mb-0">
                <feather-icon
                  icon="CheckCircleIcon"
                  size="16"
                  class="text-primary mr-1 ml-1 flex-shrink-0 mt-25"
                />
                <span class="small text-dark font-weight-600">{{ currentTab.p2 }}</span>
              </div>
            </div>

            <!-- Permission Boundary Alert -->
            <div
              v-if="currentTab.boundary"
              class="p-2 bg-light-warning rounded border border-warning mb-3 d-flex align-items-start"
            >
              <feather-icon
                icon="ShieldIcon"
                size="16"
                class="text-warning mr-1 ml-1 flex-shrink-0 mt-25"
              />
              <span class="small text-dark font-weight-bold">
                <strong class="text-warning">{{ isRtl ? 'حدود نطاق العمل الإداري: ' : 'Administrative Scope Boundary: ' }}</strong>
                {{ currentTab.boundary }}
              </span>
            </div>

            <!-- REAL SYSTEM SCREENSHOT CONTAINER -->
            <div class="real-screen-frame rounded border shadow-sm overflow-hidden mb-3">
              <!-- Browser Mockup Title Bar -->
              <div class="screen-frame-topbar p-2 bg-dark d-flex align-items-center justify-content-between text-white">
                <div class="d-flex align-items-center">
                  <div class="window-dots d-flex align-items-center">
                    <span class="window-dot dot-red" />
                    <span class="window-dot dot-yellow mx-1" />
                    <span class="window-dot dot-green" />
                  </div>
                  <span class="extra-small font-weight-bold text-light mr-2 ml-2">
                    {{ currentTab.routePath || '/sub-doctor/permissions' }} — {{ currentTab.title }}
                  </span>
                </div>
                <span class="badge badge-light-primary extra-small font-weight-bold">
                  {{ isRtl ? 'معاينة شاشة الطبيب المساعد' : 'Sub-Doctor Screen Preview' }}
                </span>
              </div>

              <!-- SCREENSHOT VIEWPORT -->
              <div class="screen-frame-content p-2 p-md-3 bg-light">
                <!-- 1. DASHBOARD -->
                <div
                  v-if="currentTab.key === 'dashboard'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h5 class="font-weight-bolder text-dark mb-0">
                        {{ isRtl ? 'مرحباً بك، د. شريف حسن (طبيب مساعد / زميل)' : 'Welcome, Dr. Sherif Hassan (Associate Physician)' }}
                      </h5>
                      <small class="text-muted">{{ isRtl ? 'جدول حالاتك المسندة اليوم — عيادة الباطنة والتخصصات' : 'Your Assigned Caseload Today — Internal Medicine Clinic' }}</small>
                    </div>
                    <div class="badge badge-light-primary p-1 font-weight-bold mt-1 mt-sm-0">
                      {{ isRtl ? 'الطبيب الرئيسي: د. محمد خالد' : 'Lead Doctor: Dr. Mohamed Khaled' }}
                    </div>
                  </div>

                  <!-- Caseload Metrics -->
                  <b-row class="mb-2">
                    <b-col
                      cols="6"
                      md="3"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <feather-icon
                          icon="CalendarIcon"
                          size="18"
                          class="text-primary mb-50"
                        />
                        <h4 class="font-weight-bolder text-dark mb-0">
                          8
                        </h4>
                        <small class="text-muted font-weight-bold">{{ isRtl ? 'حالاتي المسندة' : 'My Cases' }}</small>
                      </div>
                    </b-col>
                    <b-col
                      cols="6"
                      md="3"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <feather-icon
                          icon="ClockIcon"
                          size="18"
                          class="text-warning mb-50"
                        />
                        <h4 class="font-weight-bolder text-warning mb-0">
                          2
                        </h4>
                        <small class="text-muted font-weight-bold">{{ isRtl ? 'في الانتظار (وصلوا)' : 'Checked-in' }}</small>
                      </div>
                    </b-col>
                    <b-col
                      cols="6"
                      md="3"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <feather-icon
                          icon="CheckCircleIcon"
                          size="18"
                          class="text-success mb-50"
                        />
                        <h4 class="font-weight-bolder text-success mb-0">
                          6
                        </h4>
                        <small class="text-muted font-weight-bold">{{ isRtl ? 'تم الفحص' : 'Completed' }}</small>
                      </div>
                    </b-col>
                    <b-col
                      cols="6"
                      md="3"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <feather-icon
                          icon="ActivityIcon"
                          size="18"
                          class="text-info mb-50"
                        />
                        <h4 class="font-weight-bolder text-info mb-0">
                          3
                        </h4>
                        <small class="text-muted font-weight-bold">{{ isRtl ? 'إجراءات منفذة' : 'Procedures' }}</small>
                      </div>
                    </b-col>
                  </b-row>

                  <!-- Next Patient In Waiting Room -->
                  <div class="p-2 bg-white rounded border d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <span class="badge badge-warning text-dark font-weight-bolder mr-1 ml-1">دور #03</span>
                      <strong class="text-dark font-weight-bold">منى مصطفى كمال</strong>
                      <span class="extra-small text-muted mr-2 ml-2">(في صالة الانتظار منذ 10 دقائق — كشف باطنة)</span>
                    </div>
                    <b-button
                      variant="primary"
                      size="sm"
                      class="font-weight-bold mt-1 mt-sm-0"
                    >
                      🚪 {{ isRtl ? 'بدء الكشف ودخول المريض' : 'Call to Exam Room' }}
                    </b-button>
                  </div>
                </div>

                <!-- 2. RESERVATIONS -->
                <div
                  v-else-if="currentTab.key === 'reservations'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center flex-wrap">
                    <div class="d-flex align-items-center">
                      <span class="badge badge-primary mr-1 ml-1 p-50 font-weight-bold">{{ isRtl ? 'الحالات المسندة لي فقط' : 'My Assigned Patients Only' }}</span>
                      <span class="small font-weight-bold text-muted">اليوم — 2026-09-09</span>
                    </div>
                    <span class="badge badge-light-success extra-small font-weight-bold">✓ {{ isRtl ? 'صلاحية الكشف الطبي كاملة' : 'Full Clinical Rights' }}</span>
                  </div>
                  <div class="bg-white rounded border p-2">
                    <table class="table table-sm mb-0 extra-small">
                      <thead class="thead-light">
                        <tr>
                          <th>{{ isRtl ? 'الموعد' : 'Time' }}</th>
                          <th>{{ isRtl ? 'المريض' : 'Patient' }}</th>
                          <th>{{ isRtl ? 'الدور' : 'Token' }}</th>
                          <th>{{ isRtl ? 'الحالة' : 'Status' }}</th>
                          <th>{{ isRtl ? 'الإجراء السريري' : 'Action' }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="font-weight-bold text-primary">
                            11:00 AM
                          </td>
                          <td class="font-weight-bold text-dark">
                            منى مصطفى كمال
                          </td>
                          <td><span class="badge badge-warning text-dark font-weight-bold">#03</span></td>
                          <td><span class="badge badge-light-warning">في صالة الانتظار</span></td>
                          <td>
                            <span class="badge badge-primary font-weight-bold pointer mr-50 ml-50">بدء الكشف 🩺</span>
                            <span class="badge badge-light-secondary pointer">الملف الطبي</span>
                          </td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-primary">
                            11:30 AM
                          </td>
                          <td class="font-weight-bold text-dark">
                            طارق جلال رضوان
                          </td>
                          <td><span class="badge badge-secondary">#05</span></td>
                          <td><span class="badge badge-light-success">مؤكد</span></td>
                          <td>
                            <span class="badge badge-light-secondary pointer">تفاصيل الحجز</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- 3. COMPLETE VISIT -->
                <div
                  v-else-if="currentTab.key === 'complete_visit'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2">
                    <strong class="text-dark font-weight-bold small d-block">{{ isRtl ? 'نموذج إكمال الكشف والتشخيص السريري' : 'Clinical Examination & Consultation Completion' }}</strong>
                    <span class="extra-small text-muted">{{ isRtl ? 'تسجيل التشخيص، الفحص الإكلينيكي، القياسات الحيوية، والمرفقات' : 'Document diagnosis, physical findings, vital signs, and files' }}</span>
                  </div>
                  <div class="bg-white rounded border p-2 mb-1">
                    <b-row>
                      <b-col
                        cols="12"
                        md="6"
                        class="mb-1"
                      >
                        <label class="extra-small font-weight-bold text-dark mb-25">التشخيص الطبي (Diagnosis):</label>
                        <div class="p-1 bg-light rounded border text-dark extra-small font-weight-bold">
                          التهاب حاد بالشعب الهوائية (Acute Bronchitis)
                        </div>
                      </b-col>
                      <b-col
                        cols="12"
                        md="6"
                        class="mb-1"
                      >
                        <label class="extra-small font-weight-bold text-dark mb-25">القياسات الحيوية (Vitals):</label>
                        <div class="d-flex extra-small">
                          <span class="badge badge-light-info mr-50 ml-50">BP: 120/80</span>
                          <span class="badge badge-light-info mr-50 ml-50">HR: 76 bpm</span>
                          <span class="badge badge-light-info">Temp: 37.8°C</span>
                        </div>
                      </b-col>
                      <b-col
                        cols="12"
                        class="mb-1"
                      >
                        <label class="extra-small font-weight-bold text-dark mb-25">الملاحظات الطبية والتوصيات السريرية:</label>
                        <div class="p-1 bg-light rounded border text-muted extra-small">
                          راحة تامة لمدة ٤ أيام، الإكثار من السوائل الدافئة، ومراجعة العيادة في حال استمرار ارتفاع درجة الحرارة.
                        </div>
                      </b-col>
                    </b-row>
                    <div class="d-flex justify-content-between align-items-center border-top pt-1">
                      <span class="badge badge-light-success extra-small font-weight-bold">📎 إرفاق إشاعة الصدر (مرفقة)</span>
                      <b-button
                        variant="success"
                        size="sm"
                        class="font-weight-bold"
                      >
                        ✓ حفظ وإكمال الكشف
                      </b-button>
                    </div>
                  </div>
                </div>

                <!-- 4. PRESCRIPTIONS -->
                <div
                  v-else-if="currentTab.key === 'prescriptions'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <strong class="text-dark font-weight-bold small d-block">{{ isRtl ? 'كتابة الروشتة الإلكترونية وطباعتها' : 'Electronic Prescription (Rx) Pad' }}</strong>
                      <span class="extra-small text-muted">{{ isRtl ? 'بحث فوري في قاعدة بيانات الأدوية المصرية وOpenFDA مع الجرعات' : 'Live drug search across Egypt Drug DB & OpenFDA with dosage instructions' }}</span>
                    </div>
                    <b-button
                      variant="outline-primary"
                      size="sm"
                      class="font-weight-bold"
                    >
                      🖨️ {{ isRtl ? 'طباعة الروشتة' : 'Print Rx' }}
                    </b-button>
                  </div>
                  <div class="bg-white rounded border p-2">
                    <div class="table-responsive">
                      <table class="table table-sm mb-0 extra-small">
                        <thead class="thead-light">
                          <tr>
                            <th>{{ isRtl ? 'الدواء (Drug)' : 'Medication' }}</th>
                            <th>{{ isRtl ? 'الشكل والتركيز' : 'Form & Strength' }}</th>
                            <th>{{ isRtl ? 'الجرعة وطريقة الاستخدام' : 'Dosage & Frequency' }}</th>
                            <th>{{ isRtl ? 'المدة' : 'Duration' }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="font-weight-bold text-primary">
                              Augmentin
                            </td>
                            <td>1g Tablets</td>
                            <td>قرص واحد كل ١٢ ساعة بعد الأكل</td>
                            <td><span class="badge badge-light-primary">٧ أيام</span></td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-primary">
                              Panadol Extra
                            </td>
                            <td>500mg Tablets</td>
                            <td>قرصان عند اللزوم (بحد أقصى ٣ مرات)</td>
                            <td><span class="badge badge-light-primary">٥ أيام</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- 5. SERVICES -->
                <div
                  v-else-if="currentTab.key === 'services'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="text-dark font-weight-bold small d-block">{{ isRtl ? 'إضافة الإجراءات والخدمات الطبية للحجز' : 'Medical Procedures & Service Billing' }}</strong>
                      <span class="extra-small text-muted">{{ isRtl ? 'إضافة إجراء تم تنفيذه (سونار، غيار جراحي، خياطة) لربطه بالحسابات' : 'Add procedures (Ultrasound, suturing, dressing) to the visit' }}</span>
                    </div>
                    <b-button
                      variant="primary"
                      size="sm"
                      class="font-weight-bold"
                    >
                      + {{ isRtl ? 'إضافة إجراء للكشف' : 'Add Procedure' }}
                    </b-button>
                  </div>
                  <div class="p-2 bg-white rounded border">
                    <div class="d-flex justify-content-between align-items-center pb-1 border-bottom mb-1">
                      <div>
                        <span class="font-weight-bold text-dark d-block">فحص بالموجات الصوتية (Ultrasound Abdomen)</span>
                        <span class="extra-small text-muted">المنفذ: د. شريف حسن (طبيب مساعد)</span>
                      </div>
                      <div class="text-right text-sm-left">
                        <strong class="text-primary h6 mb-0 font-weight-bolder">350.00 ج.م</strong>
                        <span class="badge badge-light-success d-block extra-small mt-25">بفاتورة محاسبية</span>
                      </div>
                    </div>
                    <small class="text-muted d-block">يتم إدراج الرسوم تلقائياً في حساب المريض لدى الاستقبال للتحصيل.</small>
                  </div>
                </div>

                <!-- 6. FOLLOWUPS -->
                <div
                  v-else-if="currentTab.key === 'followups'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2">
                    <strong class="text-dark font-weight-bold small d-block">{{ isRtl ? 'حجز المتابعة والاستشارة القادمة' : 'Return Visit & Follow-Up Booking' }}</strong>
                    <span class="extra-small text-muted">{{ isRtl ? 'جدولة موعد الاستشارة للمريض بنقرة واحدة من شاشة الكشف' : 'Schedule return consultation directly from the consultation screen' }}</span>
                  </div>
                  <div class="p-2 bg-white rounded border">
                    <b-row class="align-items-center">
                      <b-col
                        cols="12"
                        md="5"
                        class="mb-1 mb-md-0"
                      >
                        <span class="extra-small text-muted d-block">المريض والحالة:</span>
                        <strong class="text-dark small font-weight-bold">منى مصطفى كمال — متابعة باطنة</strong>
                      </b-col>
                      <b-col
                        cols="12"
                        md="4"
                        class="mb-1 mb-md-0"
                      >
                        <span class="extra-small text-muted d-block">تاريخ الاستشارة:</span>
                        <span class="badge badge-primary p-50 font-weight-bold">بعد ٧ أيام (2026-09-16)</span>
                      </b-col>
                      <b-col
                        cols="12"
                        md="3"
                        class="text-md-right"
                      >
                        <b-button
                          variant="success"
                          size="sm"
                          block
                          class="font-weight-bold"
                        >
                          ✓ تثبيت المتابعة
                        </b-button>
                      </b-col>
                    </b-row>
                  </div>
                </div>

                <!-- 7. CLIENTS EHR -->
                <div
                  v-else-if="currentTab.key === 'clients'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="text-dark font-weight-bold small d-block">{{ isRtl ? 'الملف الطبي والتاريخ المرضي الشامل' : 'Comprehensive Electronic Health Record (EHR)' }}</strong>
                      <span class="extra-small text-muted">{{ isRtl ? 'استعراض الحساسيات، الأمراض المزمنة، وسجل الزيارات السابقة' : 'Review allergies, chronic illnesses, and past clinical timeline' }}</span>
                    </div>
                    <span class="badge badge-light-danger font-weight-bold">⚠️ حساسية بنسلين</span>
                  </div>
                  <div class="p-2 bg-white rounded border">
                    <div class="d-flex flex-wrap align-items-center mb-1 pb-1 border-bottom">
                      <span class="badge badge-light-primary mr-50 ml-50">فصيلة الدم: B+</span>
                      <span class="badge badge-light-warning mr-50 ml-50">ضغط دم مرتفع</span>
                      <span class="badge badge-light-info">العمر: 34 سنة (12 Aug 1992)</span>
                    </div>
                    <h6 class="font-weight-bolder text-dark mb-50">
                      سجل الزيارات السابقة (Timeline):
                    </h6>
                    <div class="extra-small text-muted">
                      <div class="mb-50">
                        ● <strong>2026-08-10:</strong> كشف سابق لدى د. محمد خالد — تشخيص: نزلة معوية حادة (مكتمل).
                      </div>
                      <div>● <strong>2026-09-09:</strong> زيارة اليوم لدى د. شريف حسن — التهاب بالشعب الهوائية (قيد الفحص).</div>
                    </div>
                  </div>
                </div>

                <!-- 8. CALL BELL -->
                <div
                  v-else-if="currentTab.key === 'call_bell'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border text-center">
                    <div class="avatar bg-light-primary p-2 rounded-circle mb-1 d-inline-flex">
                      <feather-icon
                        icon="BellIcon"
                        size="32"
                        class="text-primary"
                      />
                    </div>
                    <h5 class="font-weight-bolder text-dark mb-50">
                      {{ isRtl ? 'استدعاء المساعدة لغرفة الكشف' : 'Room Calling Bell for Reception' }}
                    </h5>
                    <p class="small text-muted max-w-500 mx-auto mb-2">
                      {{ isRtl ? 'بنقرة زر واحدة من شاشتك، يصدر رنين وتنبيه مباشر على شاشة الاستقبال بحضور المساعدة فوراً إلى غرفتك.' : 'One click alerts the reception assistant to report immediately to your examination room.' }}
                    </p>
                    <b-button
                      variant="primary"
                      size="md"
                      class="font-weight-bold px-3 shadow-sm"
                    >
                      🔔 {{ isRtl ? 'استدعاء المساعدة للغرفة الآن' : 'Ring Assistant Now' }}
                    </b-button>
                  </div>
                </div>

                <!-- 9. FINANCIALS -->
                <div
                  v-else-if="currentTab.key === 'financials'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2">
                    <strong class="text-dark font-weight-bold small d-block">{{ isRtl ? 'متابعة إيرادات ورسوم الحالات الخاصة بك' : 'Caseload Revenue & Procedure Accounting' }}</strong>
                    <span class="extra-small text-muted">{{ isRtl ? 'استعراض مالي مخصص لكشوفاتك وإجراءاتك الطبية المنفذة' : 'Financial summary scoped to your consultations and performed procedures' }}</span>
                  </div>
                  <b-row>
                    <b-col
                      cols="12"
                      md="4"
                      class="mb-1"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <span class="extra-small text-muted font-weight-bold d-block mb-25">كشوفات منجزة</span>
                        <h4 class="font-weight-bolder text-dark mb-0">
                          14 كشفاً
                        </h4>
                      </div>
                    </b-col>
                    <b-col
                      cols="12"
                      md="4"
                      class="mb-1"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <span class="extra-small text-muted font-weight-bold d-block mb-25">رسوم الإجراءات الطبية</span>
                        <h4 class="font-weight-bolder text-primary mb-0">
                          2,450 ج.م
                        </h4>
                      </div>
                    </b-col>
                    <b-col
                      cols="12"
                      md="4"
                      class="mb-1"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <span class="extra-small text-muted font-weight-bold d-block mb-25">نسبة التحصيل</span>
                        <h4 class="font-weight-bolder text-success mb-0">
                          100%
                        </h4>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <!-- 10. PERMISSIONS MATRIX -->
                <div
                  v-else-if="currentTab.key === 'permissions_matrix'"
                  class="screen-view animated fadeIn"
                >
                  <b-row>
                    <b-col
                      cols="12"
                      md="6"
                      class="mb-2"
                    >
                      <div class="p-2 bg-white rounded border border-success h-100 shadow-xs">
                        <div class="d-flex align-items-center mb-1">
                          <span class="badge badge-success p-50 mr-1 ml-1">✓</span>
                          <h6 class="font-weight-bolder text-success mb-0">
                            {{ isRtl ? 'الاستقلالية والصلاحيات الطبية الممنوحة' : 'Granted Clinical Autonomy' }}
                          </h6>
                        </div>
                        <ul class="extra-small pl-1 pr-1 mb-0 text-dark">
                          <li class="mb-50">
                            <strong>الكشف السريري:</strong> فحص الحالات المسندة وتسجيل التشخيص والملاحظات.
                          </li>
                          <li class="mb-50">
                            <strong>الروشتات الطبية:</strong> كتابة وطباعة الروشتة مع البحث بقاعدة الأدوية.
                          </li>
                          <li class="mb-50">
                            <strong>الخدمات والإجراءات:</strong> إضافة الإجراءات الطبية المنفذة لكشف المريض.
                          </li>
                          <li class="mb-50">
                            <strong>حجز المتابعات:</strong> جدولة مواعيد الاستشارة القادمة لنفس الطبيب.
                          </li>
                          <li class="mb-50">
                            <strong>استدعاء المساعدة:</strong> استخدام جرس الاستدعاء المباشر لغرفة الكشف.
                          </li>
                          <li class="mb-0">
                            <strong>الملف الطبي:</strong> الاطلاع الكامل على تاريخ المريض وأمراضه المزمنة.
                          </li>
                        </ul>
                      </div>
                    </b-col>
                    <b-col
                      cols="12"
                      md="6"
                      class="mb-2"
                    >
                      <div class="p-2 bg-white rounded border border-warning h-100 shadow-xs">
                        <div class="d-flex align-items-center mb-1">
                          <span class="badge badge-warning text-dark p-50 mr-1 ml-1">🛡️</span>
                          <h6 class="font-weight-bolder text-dark mb-0">
                            {{ isRtl ? 'الحدود الإدارية لمالك العيادة' : 'Clinic Owner Administrative Scope' }}
                          </h6>
                        </div>
                        <ul class="extra-small pl-1 pr-1 mb-0 text-dark">
                          <li class="mb-50">
                            <strong>إدارة الفريق:</strong> إضافة وتعديل حسابات المساعدين أو أطباء آخرين حصري للطبيب المالك.
                          </li>
                          <li class="mb-50">
                            <strong>باقة واشتراك العيادة:</strong> تجديد أو ترقية باقة العيادة محجوز لإدارة العيادة.
                          </li>
                          <li class="mb-50">
                            <strong>إعدادات الطباعة العامة:</strong> ضبط ترويسة وشعار العيادة المطبوع على الروشتات.
                          </li>
                          <li class="mb-50">
                            <strong>طابور الأطباء الآخرين:</strong> طابور الكشف مفصول بحيث يركز كل طبيب على حالاته.
                          </li>
                          <li class="mb-0">
                            <strong>الحسابات الإجمالية:</strong> تقفيل الخزينة الشامل للعيادة مخصص للإدارة العامة.
                          </li>
                        </ul>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>

              <!-- Bottom Caption Bar -->
              <div class="screen-caption-bar p-2 bg-dark text-white d-flex align-items-center justify-content-between flex-wrap">
                <span class="extra-small text-light">
                  <feather-icon
                    icon="InfoIcon"
                    size="13"
                    class="mr-50 ml-50 text-primary"
                  />
                  {{ currentTab.caption }}
                </span>
                <span class="badge badge-light-primary extra-small font-weight-bold">
                  {{ isRtl ? 'طبيب مساعد / زميل' : 'Associate Physician Role' }}
                </span>
              </div>
            </div>
          </b-card-body>

          <!-- Bottom Step Navigation Actions -->
          <b-card-body class="p-3 pt-0 border-top bg-light d-flex align-items-center justify-content-between flex-wrap">
            <b-button
              variant="outline-secondary"
              size="sm"
              :disabled="currentTabIndex === 0"
              class="font-weight-bold"
              @click="goToTab(currentTabIndex - 1)"
            >
              <feather-icon
                :icon="isRtl ? 'ArrowRightIcon' : 'ArrowLeftIcon'"
                size="14"
                :class="isRtl ? 'ml-50' : 'mr-50'"
              />
              <span>{{ isRtl ? 'القسم السابق' : 'Previous Step' }}</span>
            </b-button>

            <div class="d-flex align-items-center my-1 my-sm-0">
              <span class="small text-muted mr-1 ml-1 font-weight-bold">
                {{ isRtl ? `القسم ${currentTabIndex + 1} من ${tabs.length}` : `Step ${currentTabIndex + 1} of ${tabs.length}` }}
              </span>
            </div>

            <b-button
              v-if="currentTabIndex < tabs.length - 1"
              variant="primary"
              size="sm"
              class="font-weight-bold"
              @click="nextTab"
            >
              <span>{{ isRtl ? 'القسم التالي' : 'Next Step' }}</span>
              <feather-icon
                :icon="isRtl ? 'ArrowLeftIcon' : 'ArrowRightIcon'"
                size="14"
                :class="isRtl ? 'mr-50' : 'ml-50'"
              />
            </b-button>
            <b-button
              v-else
              variant="success"
              size="sm"
              class="font-weight-bold"
              @click="finishGuide"
            >
              <feather-icon
                icon="CheckCircleIcon"
                size="14"
                :class="isRtl ? 'ml-50' : 'mr-50'"
              />
              <span>{{ isRtl ? 'إتمام استعراض الدليل' : 'Complete Guide' }}</span>
            </b-button>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BCard,
  BCardBody,
  BRow,
  BCol,
  BButton,
  BBadge,
  BProgress,
} from 'bootstrap-vue'

export default {
  name: 'SubDoctorPermissionsGuide',
  components: {
    BCard,
    BCardBody,
    BRow,
    BCol,
    BButton,
    BBadge,
    BProgress,
  },
  data() {
    return {
      currentTabIndex: 0,
      completedTabs: [0],
    }
  },
  computed: {
    isRtl() {
      return this.$i18n.locale === 'ar'
    },
    progressPercent() {
      return (this.completedTabs.length / this.tabs.length) * 100
    },
    currentTab() {
      return this.tabs[this.currentTabIndex] || this.tabs[0]
    },
    tabs() {
      if (this.isRtl) {
        return [
          {
            key: 'dashboard',
            icon: 'HomeIcon',
            title: 'لوحة الطبيب والمواعيد المسندة',
            badge: 'المؤشرات الحية',
            permissionCodes: 'doctor.view-dashboard, doctor.view-reservations',
            routeName: 'doctor-dashboard',
            routePath: '/doctor/dashboard',
            desc: 'مركز متابعة مخصص للحالات المسندة لك اليوم، مع مؤشر لحالات صالة الانتظار التي تم تسجيل وصولها.',
            p1: 'المؤشرات الفورية: استعراض الحالات المسندة لك اليوم، في الانتظار، والكشوفات المنتهية.',
            p2: 'طابور الغرفة: إشعار فوري بالحالة التالية الواصلة لصالة الانتظار مع زر استدعاء مباشر.',
            boundary: 'جدول المواعيد مخصص لحالاتك، بينما تظل حالات الزملاء الآخرين مفصولة لتنظيم العمل.',
            caption: 'لوحة الطبيب المساعد — متابعة دقيقة لحالات اليوم وطابور الانتظار الخاص بك.',
          },
          {
            key: 'reservations',
            icon: 'ClipboardIcon',
            title: 'حجوزاتي وطابور الكشف اليومي',
            badge: 'قائمة الكشوفات',
            permissionCodes: 'doctor.view-reservations',
            routeName: 'doctor-reservations',
            routePath: '/doctor/reservations',
            desc: 'استعراض ومتابعة حجوزاتك، معرفة أرقام أدوار المرضى بالانتظار، وبدء الكشف الطبي.',
            p1: 'متابعة الحالات: فلترة الحجوزات المسندة لك ومتابعة حالة كل مريض (في الانتظار، مؤكد، تم الكشف).',
            p2: 'بدء الكشف: فتح تفاصيل الحجز، مراجعة التاريخ المرضي، وبدء الفحص الإكلينيكي.',
            boundary: 'لا يمكن للطبيب المساعد إلغاء حجوزات أطباء آخرين بالعيادة.',
            caption: 'حجوزاتي — جدول الكشف اليومي ومتابعة الحالات الجاهزة للدخول لغرفة الفحص.',
          },
          {
            key: 'complete_visit',
            icon: 'CheckCircleIcon',
            title: 'إكمال الكشف والتشخيص السريري',
            badge: 'الفحص والتشخيص',
            permissionCodes: 'doctor.complete-reservations',
            routeName: 'doctor-reservations',
            routePath: '/doctor/reservations',
            desc: 'استقلالية طبية كاملة في تسجيل التشخيص، الملاحظات السريرية، العلامات الحيوية، وإرفاق الأشعة والتحاليل.',
            p1: 'التشخيص الطبي: تسجيل التشخيص النهائي وكتابة الملاحظات الإكلينيكية وتوجيهات المريض.',
            p2: 'المرفقات والملفات: رفع صور الأشعة، تقارير المعامل، والفحوصات وحفظها بملف المريض الدائم.',
            boundary: 'القرارات السريرية والتشخيصية ترجع بالكامل لتقدير الطبيب المعالج للحالة.',
            caption: 'إكمال الكشف — توثيق التشخيص الطبي، العلامات الحيوية، وملاحظات الفحص.',
          },
          {
            key: 'prescriptions',
            icon: 'FileTextIcon',
            title: 'كتابة وطباعة الروشتة الإلكترونية',
            badge: 'الروشتة الطبية',
            permissionCodes: 'doctor.generate-prescriptions, doctor.view-drugs',
            routeName: 'doctor-reservations',
            routePath: '/doctor/reservations',
            desc: 'منظومة روشتات إلكترونية متكاملة مع بحث فوري في قاعدة بيانات الأدوية المصرية وOpenFDA.',
            p1: 'البحث الذكي بالأدوية: إكمال تلقائي لأسماء الأدوية، التركيزات، وتحديد الجرعة ومدة العلاج.',
            p2: 'طباعة الروشتة: طباعة فورية للروشتة بترويسة العيادة المعتمدة واسم الطبيب المعالج.',
            boundary: 'صلاحية وصف الأدوية وكتابة الروشتات حصرية للأطباء المرخصين.',
            caption: 'الروشتة الإلكترونية — وصف الأدوية بجرعاتها وطباعة الروشتة ببيانات المريض.',
          },
          {
            key: 'services',
            icon: 'GridIcon',
            title: 'الخدمات والإجراءات الطبية الإضافية',
            badge: 'تسعير الإجراءات',
            permissionCodes: 'doctor.view-services, doctor.create-reservation-services',
            routeName: 'doctor-services',
            routePath: '/doctor/services',
            desc: 'إضافة الإجراءات والفحوصات المنفذة أثناء الكشف (سونار، غيار جراحي، خياطة) لربطها بالحسابات.',
            p1: 'إضافة الإجراء: اختيار الإجراء المنفذ من القائمة وإدراجه في كشف المريض مع تحديد التكلفة.',
            p2: 'المزامنة مع الاستقبال: إرسال تكلفة الإجراء تلقائياً لخزينة الاستقبال لتحصيلها.',
            boundary: 'تعديل قائمة أسعار الخدمات العامة للعيادة محكوم بسياسة العيادة المعتمدة.',
            caption: 'الإجراءات الطبية — إدراج الفحوصات والتدخلات المنفذة أثناء الزيارة.',
          },
          {
            key: 'followups',
            icon: 'CalendarIcon',
            title: 'جدولة المتابعات والاستشارات القادمة',
            badge: 'حجز المتابعة',
            permissionCodes: 'doctor.create-reservations',
            routeName: 'doctor-reservations',
            routePath: '/doctor/reservations',
            desc: 'تحديد وتثبيت موعد إعادة الكشف أو الاستشارة القادمة للمريض مباشرة من شاشة الكشف.',
            p1: 'حجز فوري: تحديد موعد المتابعة (بعد أسبوع، أسبوعين) وإدراجه في جدولك تلقائياً.',
            p2: 'بيانات المريض: يتم سحب بيانات المريض ورقم هاتفه تلقائياً دون الحاجة لإعادة إدخالها.',
            boundary: 'يتم الحجز وفق المواعيد الشاغرة بجدول العيادة.',
            caption: 'المتابعات — حجز استشارة العودة للمريض بسهولة لضمان استمرارية الرعاية الطبية.',
          },
          {
            key: 'clients',
            icon: 'UsersIcon',
            title: 'الملف الطبي وتاريخ المريض الشامل',
            badge: 'السجل الطبي',
            permissionCodes: 'doctor.view-clients',
            routeName: 'doctor-clients',
            routePath: '/doctor/clients',
            desc: 'اطلاع كامل على السجل الطبي للمريض، الأمراض المزمنة، الحساسيات، وسجل الزيارات السابقة.',
            p1: 'سجل متكامل: مراجعة التاريخ الصحي، فصيلة الدم، وتنبيهات الحساسية الدوائية (كالبنسلين).',
            p2: 'تاريخ الزيارات: استعراض تشخيصات وروشتات الزيارات السابقة لدى أطباء العيادة.',
            boundary: 'يتاح للطبيب الاطلاع الكامل لتقديم التشخيص والعلاج الآمن والأمثل.',
            caption: 'الملف الطبي — الرؤية المتكاملة للتاريخ الصحي للحالة لضمان سلامة العلاج.',
          },
          {
            key: 'call_bell',
            icon: 'BellIcon',
            title: 'جرس استدعاء المساعدة لغرفة الكشف',
            badge: 'استدعاء المساعدة',
            permissionCodes: 'doctor.create-assistant-calls',
            routeName: 'doctor-reservations',
            routePath: '/doctor/reservations',
            desc: 'زر اتصال فوري لطلب حضور المساعدة لغرفة الكشف للمساعدة في فحص، تثبيت مريض، أو إحضار أدوات.',
            p1: 'نقرة واحدة: إرسال تنبيه رنين وشاشة فورية للاستقبال باسمك ورقم غرفتك.',
            p2: 'تأكيد الحضور: يظهر إشعار على شاشتك عند تأكيد المساعدة استلام الطلب وتوجهها إليك.',
            boundary: 'متاح في أي وقت من شاشة الحجوزات لضمان انسيابية العمل الطبي.',
            caption: 'جرس الاستدعاء — استدعاء فريق الاستقبال والتمريض لغرفة الكشف فورياً.',
          },
          {
            key: 'financials',
            icon: 'DollarSignIcon',
            title: 'الحسابات والتقارير الخاصة بحالاتي',
            badge: 'الإيرادات والرسوم',
            permissionCodes: 'doctor.view-financials, doctor.view-purchases',
            routeName: 'doctor-financials',
            routePath: '/doctor/financials',
            desc: 'استعراض مالي وإحصائي لرسوم الكشوفات والإجراءات الطبية المنفذة بمعرفتك.',
            p1: 'كشف الحساب: متابعة إجمالي الكشوفات والإجراءات المنفذة وحالة تحصيلها بالاستقبال.',
            p2: 'تقييم الأداء: إحصائيات دقيقة عن عدد الحالات المنجزة شهرياً.',
            boundary: 'الحسابات مخصصة لحالاتك فقط ولا تعرض ميزانية العيادة العامة أو أرباح الطبيب المالك.',
            caption: 'المالية — تقرير أداء ورسوم الحالات والإجراءات الطبية الخاصة بك.',
          },
          {
            key: 'permissions_matrix',
            icon: 'ShieldIcon',
            title: 'مصفوفة الصلاحيات والاستقلالية الطبية',
            badge: 'الصلاحيات والقيود',
            permissionCodes: 'role: sub-doctor (Associate Physician)',
            routeName: '',
            routePath: '/sub-doctor/permissions',
            desc: 'الفصل بين الصلاحيات السريرية المستقلة للطبيب وبين الإدارة العامة والاشتراكات المحفوظة لمالك العيادة.',
            p1: 'صلاحيات سريرية كاملة: التشخيص، وصف الأدوية، طلب الفحوصات، إجراء العمليات، وحجز المتابعات.',
            p2: 'الحدود الإدارية: إدارة فريق العمل، إضافة أطباء فرعيين، وضبط باقة العيادة مخصص للمالك.',
            boundary: 'يوفر النظام بيئة عمل احترافية تجمع بين حرية الممارسة الطبية والتنظيم الإداري المحكم.',
            caption: 'مصفوفة الصلاحيات — استقلالية تشخيصية وعلاجية كاملة مع فصل إداري واضح.',
          },
        ]
      }

      // English Tabs
      return [
        {
          key: 'dashboard',
          icon: 'HomeIcon',
          title: 'Sub-Doctor Dashboard & Caseload',
          badge: 'Clinical Overview',
          permissionCodes: 'doctor.view-dashboard, doctor.view-reservations',
          routeName: 'doctor-dashboard',
          routePath: '/doctor/dashboard',
          desc: 'Personalized command center for your assigned caseload, waiting room arrivals, and completed consultations.',
          p1: 'Live KPIs: Track today assigned appointments, lobby waiting patients, and completed examinations.',
          p2: 'Next Patient in Queue: Real-time notification when your assigned patient arrives at reception with token #.',
          boundary: 'Your dashboard focuses on your caseload; other physicians queues remain segregated.',
          caption: 'Dashboard — Monitor your assigned appointments and waiting room flow.',
        },
        {
          key: 'reservations',
          icon: 'ClipboardIcon',
          title: 'My Reservations & Examination Queue',
          badge: 'Consultation Queue',
          permissionCodes: 'doctor.view-reservations',
          routeName: 'doctor-reservations',
          routePath: '/doctor/reservations',
          desc: 'Filter and track your daily appointments, see arrival tokens, and initiate clinical examinations.',
          p1: 'Caseload Tracking: View patients assigned to you with live status (Checked-in / Waiting / Confirmed).',
          p2: 'Start Consultation: One-click opening of the clinical file and physical examination workflow.',
          boundary: 'Associate physicians focus on their clinical queue without modifying other doctors visits.',
          caption: 'Reservations — Daily consultation schedule and patients ready for exam room entry.',
        },
        {
          key: 'complete_visit',
          icon: 'CheckCircleIcon',
          title: 'Clinical Consultation & Visit Completion',
          badge: 'Clinical Notes & Findings',
          permissionCodes: 'doctor.complete-reservations',
          routeName: 'doctor-reservations',
          routePath: '/doctor/reservations',
          desc: 'Full clinical autonomy: record primary diagnosis, clinical findings, vital signs, and diagnostic attachments.',
          p1: 'Medical Diagnosis: Record clinical diagnosis, examination findings, and patient instructions.',
          p2: 'Attachments & Vitals: Upload radiographs, lab reports, ultrasound scans, and save to patient EHR.',
          boundary: 'Clinical decisions and diagnosis rest entirely with the attending physician.',
          caption: 'Complete Visit — Document medical diagnosis, vital signs, and clinical findings.',
        },
        {
          key: 'prescriptions',
          icon: 'FileTextIcon',
          title: 'E-Prescription & Drug Database Search',
          badge: 'Electronic Prescription',
          permissionCodes: 'doctor.generate-prescriptions, doctor.view-drugs',
          routeName: 'doctor-reservations',
          routePath: '/doctor/reservations',
          desc: 'Comprehensive prescription writing pad with smart search across Egyptian Drug DB and OpenFDA.',
          p1: 'Smart Drug Search: Auto-complete medication names, strengths, dosage frequencies, and duration.',
          p2: 'Print Rx: Instant prescription printing with clinic branding and attending physician signature.',
          boundary: 'Prescription writing is strictly restricted to licensed medical physicians.',
          caption: 'E-Prescriptions — Prescribe medications with precise dosages and print official Rx.',
        },
        {
          key: 'services',
          icon: 'GridIcon',
          title: 'Medical Procedures & Treatment Services',
          badge: 'Medical Procedures',
          permissionCodes: 'doctor.view-services, doctor.create-reservation-services',
          routeName: 'doctor-services',
          routePath: '/doctor/services',
          desc: 'Add clinical procedures performed during the visit (Ultrasound, suturing, dressing) to the patient record.',
          p1: 'Procedure Addition: Select performed medical procedure and link fees to the visit record.',
          p2: 'Cashier Sync: Automatically forwards procedural charges to reception for cashier collection.',
          boundary: 'General clinic service catalogs are governed by clinic pricing policies.',
          caption: 'Procedures — Document and bill medical interventions performed during consultation.',
        },
        {
          key: 'followups',
          icon: 'CalendarIcon',
          title: 'Follow-Up Scheduling & Return Consultations',
          badge: 'Follow-Up Booking',
          permissionCodes: 'doctor.create-reservations',
          routeName: 'doctor-reservations',
          routePath: '/doctor/reservations',
          desc: 'Schedule return consultations directly from the active examination screen with one click.',
          p1: 'Instant Follow-Up: Schedule return visit (e.g. 1 week, 2 weeks later) directly into your calendar.',
          p2: 'Client Retention: Patient demographic details and phone numbers are automatically linked.',
          boundary: 'Follow-ups are scheduled into available clinic calendar slots.',
          caption: 'Follow-ups — Effortless re-examination scheduling to ensure continuous patient care.',
        },
        {
          key: 'clients',
          icon: 'UsersIcon',
          title: 'Patient Electronic Health Record (EHR)',
          badge: 'Medical Record',
          permissionCodes: 'doctor.view-clients',
          routeName: 'doctor-clients',
          routePath: '/doctor/clients',
          desc: 'Comprehensive access to patient medical history, chronic diseases, drug allergies, and past visits.',
          p1: 'Lifelong EHR: Review vital signs, blood type, and critical allergy alerts (e.g. Penicillin allergy).',
          p2: 'Visit Timeline: Inspect past diagnoses, treatments, and prescriptions across all clinic visits.',
          boundary: 'Physicians have full clinical record visibility to deliver safe and informed healthcare.',
          caption: 'Medical Record — Complete health history for safe diagnosis and treatment planning.',
        },
        {
          key: 'call_bell',
          icon: 'BellIcon',
          title: 'Room Calling Bell for Reception/Assistant',
          badge: 'Room Assistance Bell',
          permissionCodes: 'doctor.create-assistant-calls',
          routeName: 'doctor-reservations',
          routePath: '/doctor/reservations',
          desc: 'One-click call button to summon reception/nursing staff to your examination room immediately.',
          p1: 'One Click Alert: Rings an acoustic chime and displays room number on the reception desk.',
          p2: 'Acknowledgment: Visual notification confirms when the assistant has acknowledged and is en route.',
          boundary: 'Available anytime from the header or visit screen for smooth clinical workflow.',
          caption: 'Calling Bell — Instant room communication with reception and nursing staff.',
        },
        {
          key: 'financials',
          icon: 'DollarSignIcon',
          title: 'Caseload Financials & Procedure Revenue',
          badge: 'Caseload Performance',
          permissionCodes: 'doctor.view-financials, doctor.view-purchases',
          routeName: 'doctor-financials',
          routePath: '/doctor/financials',
          desc: 'Financial reports and revenue breakdown scoped specifically to your consultations and performed procedures.',
          p1: 'Caseload Accounting: Track completed consultations, procedure fees, and collection status.',
          p2: 'Performance Metrics: Monthly and daily summaries of clinical volume and completed visits.',
          boundary: 'Scoped to your caseload; does not expose clinic owner overall balance sheets.',
          caption: 'Financials — Transparent revenue reporting for your consultations and procedures.',
        },
        {
          key: 'permissions_matrix',
          icon: 'ShieldIcon',
          title: 'Clinical Autonomy & Permissions Matrix',
          badge: 'Clinical vs Admin Boundaries',
          permissionCodes: 'role: sub-doctor (Associate Physician)',
          routeName: '',
          routePath: '/sub-doctor/permissions',
          desc: 'Clear boundary between clinical autonomy for patient care and clinic owner administrative privileges.',
          p1: 'Full Clinical Autonomy: Diagnosis, prescriptions, procedure billing, follow-ups, and EHR access.',
          p2: 'Clinic Administration: Adding staff, sub-doctor creation, and subscription plans reserved for owner.',
          boundary: 'Empowers associate physicians with medical freedom while safeguarding clinic governance.',
          caption: 'Permissions Matrix — Clinical excellence combined with clear administrative structure.',
        },
      ]
    },
  },
  methods: {
    goToTab(idx) {
      if (idx >= 0 && idx < this.tabs.length) {
        this.currentTabIndex = idx
        if (!this.completedTabs.includes(idx)) {
          this.completedTabs.push(idx)
        }
      }
    },
    nextTab() {
      if (this.currentTabIndex < this.tabs.length - 1) {
        this.goToTab(this.currentTabIndex + 1)
      }
    },
    finishGuide() {
      this.$toast({
        component: () => import('@core/components/toastification/ToastificationContent.vue'),
        props: {
          title: this.isRtl ? 'تم إتمام استعراض دليل الصلاحيات' : 'Permissions Guide Completed',
          icon: 'CheckCircleIcon',
          variant: 'success',
          text: this.isRtl ? 'أنت الآن على دراية كاملة بصلاحياتك واستقلاليتك الطبية.' : 'You are now fully oriented with your sub-doctor clinical permissions.',
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.subdoctor-tabs-scroll {
  scrollbar-width: thin;
}

.tab-nav-pill {
  transition: all 0.2s ease;
  border-radius: 20px;
  padding: 0.35rem 0.85rem;

  &:hover {
    transform: translateY(-1px);
  }
}

.extra-small {
  font-size: 0.75rem;
}

.font-weight-600 {
  font-weight: 600;
}

.pointer {
  cursor: pointer;
}

.step-nav-item {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

.step-number-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

/* Screen Mockup Frame */
.real-screen-frame {
  background-color: #ffffff;
  border: 1px solid #d8d6de;
}

.screen-frame-topbar {
  background-color: #1e293b !important;
}

.window-dots {
  .window-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;

    &.dot-red { background-color: #ea5455; }
    &.dot-yellow { background-color: #ff9f43; }
    &.dot-green { background-color: #28c76f; }
  }
}

.screen-frame-content {
  min-height: 260px;
  background-color: #f8fafc;
}

.screen-caption-bar {
  background-color: #0f172a !important;
  border-top: 1px solid #334155;
}

.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fadeIn {
  animation-name: fadeIn;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
