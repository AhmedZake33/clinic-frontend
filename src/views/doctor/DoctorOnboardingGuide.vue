<template>
  <div
    class="doctor-onboarding-guide"
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
                icon="CompassIcon"
                size="26"
              />
            </div>
            <div>
              <div class="d-flex align-items-center flex-wrap">
                <h4 class="font-weight-bolder text-dark mb-0 mr-2 ml-2">
                  {{ $t('onboarding.guideTitle') }}
                </h4>
                <b-badge
                  variant="light-primary"
                  class="font-weight-bold"
                >
                  {{ $t('onboarding.stepOf', { current: currentTabIndex + 1, total: doctorTabs.length }) }}
                </b-badge>
              </div>
              <p class="text-muted small mb-0 mt-25">
                {{ $t('onboarding.guideSubtitle') }}
              </p>
            </div>
          </div>

          <!-- Progress Bar & Status -->
          <div class="header-progress-box min-w-250">
            <div class="d-flex justify-content-between align-items-center mb-50">
              <span class="extra-small font-weight-bold text-muted">{{ $t('onboarding.progress') }}</span>
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

        <!-- HORIZONTAL TABS STRIP (12 Doctor Tabs) -->
        <div class="doctor-system-tabs-nav mt-3 pt-2 border-top">
          <div class="d-flex align-items-center overflow-auto pb-1 doctor-tabs-scroll">
            <b-button
              v-for="(tab, idx) in doctorTabs"
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
              <span>{{ $t(`onboarding.steps.${tab.key}.title`) }}</span>
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
              {{ isRtl ? 'أقسام الطبيب في النظام' : 'Doctor System Tabs' }}
            </span>
            <span class="badge badge-light-primary extra-small font-weight-bold">12 {{ isRtl ? 'قسماً' : 'Tabs' }}</span>
          </div>

          <div
            class="steps-nav-list p-2"
            style="max-height: 540px; overflow-y: auto;"
          >
            <div
              v-for="(tab, idx) in doctorTabs"
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
                  {{ $t(`onboarding.steps.${tab.key}.title`) }}
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
              💡 {{ $t('onboarding.reopenTip') }}
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
                  {{ $t(`onboarding.steps.${currentTab.key}.badge`) }}
                </b-badge>
                <h4 class="font-weight-bolder text-dark mb-1">
                  {{ $t(`onboarding.steps.${currentTab.key}.title`) }}
                </h4>
                <p class="text-muted small mb-0 max-w-750">
                  {{ $t(`onboarding.steps.${currentTab.key}.desc`) }}
                </p>
              </div>

              <!-- Live Route Link Action Button -->
              <div class="mt-2 mt-sm-0">
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

            <!-- Bullet Explanations of the Screen -->
            <div class="p-2 bg-light-primary rounded border border-primary mb-3">
              <div class="d-flex align-items-start mb-1">
                <feather-icon
                  icon="CheckCircleIcon"
                  size="16"
                  class="text-primary mr-1 ml-1 flex-shrink-0 mt-25"
                />
                <span class="small text-dark font-weight-600">{{ $t(`onboarding.steps.${currentTab.key}.p1`) }}</span>
              </div>
              <div class="d-flex align-items-start mb-0">
                <feather-icon
                  icon="CheckCircleIcon"
                  size="16"
                  class="text-primary mr-1 ml-1 flex-shrink-0 mt-25"
                />
                <span class="small text-dark font-weight-600">{{ $t(`onboarding.steps.${currentTab.key}.p2`) }}</span>
              </div>
            </div>

            <!-- REAL SYSTEM SCREENSHOT CONTAINER -->
            <div class="real-screen-frame rounded border shadow-sm overflow-hidden mb-3">
              <!-- Browser Mockup Title Bar -->
              <div class="screen-frame-topbar p-2 bg-dark d-flex align-items-center justify-content-between text-white">
                <div class="d-flex align-items-center">
                  <span class="window-dot dot-red" />
                  <span class="window-dot dot-yellow mx-1" />
                  <span class="window-dot dot-green" />
                  <span class="extra-small font-weight-bold text-light mr-2 ml-2">
                    {{ currentTab.routePath }} — {{ $t(`onboarding.steps.${currentTab.key}.title`) }}
                  </span>
                </div>
                <span class="badge badge-light-success extra-small font-weight-bold">
                  {{ isRtl ? 'معاينة حية' : 'Live Preview' }}
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
                        {{ isRtl ? 'مرحباً بك مجدداً، د. محمد خالد!' : 'Welcome back, Dr. Mohamed Khaled!' }}
                      </h5>
                      <span class="extra-small text-muted">{{ isRtl ? 'التخصص: باطنة وعلاج تشريحي' : 'Specialization: Internal Medicine' }}</span>
                    </div>
                    <b-button
                      size="xs"
                      variant="primary"
                      class="font-weight-bold mt-1 mt-sm-0"
                    >
                      {{ isRtl ? 'عرض جدول المواعيد' : 'View Schedule' }}
                    </b-button>
                  </div>

                  <b-row class="mb-2">
                    <b-col cols="4">
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <b-avatar
                          variant="light-info"
                          size="32"
                        >
                          <feather-icon
                            icon="CalendarIcon"
                            size="16"
                          />
                        </b-avatar>
                        <h4 class="font-weight-bolder text-dark mb-0 mt-50">
                          24
                        </h4>
                        <span class="extra-small text-muted">{{ isRtl ? 'إجمالي المواعيد' : 'Total Appts' }}</span>
                      </div>
                    </b-col>
                    <b-col cols="4">
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <b-avatar
                          variant="light-warning"
                          size="32"
                        >
                          <feather-icon
                            icon="ClockIcon"
                            size="16"
                          />
                        </b-avatar>
                        <h4 class="font-weight-bolder text-warning mb-0 mt-50">
                          5
                        </h4>
                        <span class="extra-small text-muted">{{ isRtl ? 'في الانتظار' : 'Waiting Queue' }}</span>
                      </div>
                    </b-col>
                    <b-col cols="4">
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <b-avatar
                          variant="light-success"
                          size="32"
                        >
                          <feather-icon
                            icon="CheckCircleIcon"
                            size="16"
                          />
                        </b-avatar>
                        <h4 class="font-weight-bolder text-success mb-0 mt-50">
                          19
                        </h4>
                        <span class="extra-small text-muted">{{ isRtl ? 'كشوفات مكتملة' : 'Completed' }}</span>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <!-- 2. CLIENTS -->
                <div
                  v-else-if="currentTab.key === 'clients'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center">
                    <strong class="small text-dark font-weight-bold">{{ isRtl ? 'دليل المرضى وسجلات الكشف' : 'Patients Directory' }}</strong>
                    <b-button
                      size="xs"
                      variant="primary"
                      class="font-weight-bold"
                    >
                      + {{ isRtl ? 'إضافة مريض جديد' : 'New Patient' }}
                    </b-button>
                  </div>
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom">
                      <div class="d-flex align-items-center">
                        <b-avatar
                          variant="light-primary"
                          size="38"
                          text="SA"
                          class="mr-2 ml-2 font-weight-bold"
                        />
                        <div>
                          <h6 class="font-weight-bolder text-dark mb-0">
                            {{ isRtl ? 'سارة أحمد محمود (#982)' : 'Sarah Ahmed (#982)' }}
                          </h6>
                          <span class="extra-small text-muted">01012345678 | A+ | 29 yrs</span>
                        </div>
                      </div>
                      <span class="badge badge-light-success">{{ isRtl ? 'نشط' : 'Active' }}</span>
                    </div>
                  </div>
                </div>

                <!-- 3. RESERVATIONS -->
                <div
                  v-else-if="currentTab.key === 'reservations'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2">
                    <table class="table table-sm extra-small mb-0">
                      <thead>
                        <tr>
                          <th>{{ isRtl ? 'الكود' : 'Token' }}</th>
                          <th>{{ isRtl ? 'المريض' : 'Patient' }}</th>
                          <th>{{ isRtl ? 'الموعد' : 'Time' }}</th>
                          <th>{{ isRtl ? 'الحالة' : 'Status' }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="font-weight-bold text-primary">
                            #RES-104
                          </td>
                          <td>{{ isRtl ? 'سارة أحمد' : 'Sarah Ahmed' }}</td>
                          <td>10:30 AM</td>
                          <td><span class="badge badge-light-success">{{ isRtl ? 'مؤكد' : 'Confirmed' }}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- 4. ONLINE BOOKING -->
                <div
                  v-else-if="currentTab.key === 'online_booking'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <div>
                        <h6 class="font-weight-bolder text-dark mb-0">
                          {{ isRtl ? 'إعدادات ورابط الحجز الأونلاين' : 'Online Booking Settings & Link' }}
                        </h6>
                        <span class="extra-small text-muted">{{ isRtl ? 'رابط الحجز العام للمرضى عبر الإنترنت' : 'Public Patient Booking Link' }}</span>
                      </div>
                      <span class="badge badge-light-success font-weight-bold">{{ isRtl ? 'الحجز مفعّل' : 'Active' }}</span>
                    </div>
                    <div class="p-2 bg-light rounded d-flex justify-content-between align-items-center mb-2">
                      <code
                        class="small text-primary font-weight-bold"
                        dir="ltr"
                      >https://clinic.tafratech.com/book/dr-mohamed</code>
                      <b-button
                        size="xs"
                        variant="primary"
                        class="font-weight-bold"
                      >
                        {{ isRtl ? 'نسخ الرابط' : 'Copy' }}
                      </b-button>
                    </div>
                  </div>
                </div>

                <!-- 5. WAITING QUEUE -->
                <div
                  v-else-if="currentTab.key === 'waiting_queue'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-light-primary rounded border border-primary d-flex justify-content-between align-items-center shadow-xs">
                    <div class="d-flex align-items-center">
                      <div class="token-badge bg-primary text-white font-weight-bolder p-2 rounded mr-2 ml-2">
                        #12
                      </div>
                      <div>
                        <strong class="text-dark small">{{ isRtl ? 'سارة أحمد محمود' : 'Sarah Ahmed' }}</strong>
                        <div class="extra-small text-muted">
                          10:25 AM | {{ isRtl ? 'كشف باطنة' : 'Consultation' }}
                        </div>
                      </div>
                    </div>
                    <b-button
                      size="sm"
                      variant="primary"
                      class="font-weight-bold"
                    >
                      {{ isRtl ? 'دخول الكشف →' : 'Call Exam →' }}
                    </b-button>
                  </div>
                </div>

                <!-- 6. DIAGNOSES & ANATOMY -->
                <div
                  v-else-if="currentTab.key === 'diagnoses'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <strong class="small text-dark font-weight-bold">{{ isRtl ? 'مكتبة التشخيصات وخريطة الفحص الطبي' : 'Clinical Diagnoses Catalog' }}</strong>
                      <b-button
                        size="xs"
                        variant="primary"
                        class="font-weight-bold"
                      >
                        + {{ isRtl ? 'إضافة تشخيص' : 'Add Diagnosis' }}
                      </b-button>
                    </div>
                    <div class="p-2 bg-light rounded d-flex justify-content-between align-items-center mb-1">
                      <div>
                        <strong class="small text-dark">{{ isRtl ? 'التهاب المفاصل والفقرات العنقية' : 'Cervical Spine Spondylosis' }}</strong>
                        <div class="extra-small text-muted">
                          {{ isRtl ? 'تظليل موضعي على خريطة الظهر والرقبة' : 'Anatomy Mapping: Cervical / Shoulder' }}
                        </div>
                      </div>
                      <span class="badge badge-light-primary">Rx #92</span>
                    </div>
                  </div>
                </div>

                <!-- 7. SERVICES -->
                <div
                  v-else-if="currentTab.key === 'services'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <strong class="small text-dark font-weight-bold">{{ isRtl ? 'قائمة الخدمات الطبية الإضافية' : 'Clinic Additional Services' }}</strong>
                      <b-button
                        size="xs"
                        variant="primary"
                        class="font-weight-bold"
                      >
                        + {{ isRtl ? 'إضافة خدمة' : 'Add Service' }}
                      </b-button>
                    </div>
                    <table class="table table-sm extra-small mb-0">
                      <thead>
                        <tr>
                          <th>{{ isRtl ? 'الخدمة' : 'Service' }}</th>
                          <th>{{ isRtl ? 'السعر' : 'Price' }}</th>
                          <th>{{ isRtl ? 'النوع' : 'Billing' }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>{{ isRtl ? 'رسم قلب وتخطيط (ECG)' : 'ECG Test' }}</strong></td>
                          <td class="text-success font-weight-bold">
                            150 EGP
                          </td>
                          <td><span class="badge badge-light-success">{{ isRtl ? 'بفاتورة' : 'Invoice' }}</span></td>
                        </tr>
                        <tr>
                          <td><strong>{{ isRtl ? 'سونار وموجات صوتية' : 'Ultrasound Scan' }}</strong></td>
                          <td class="text-success font-weight-bold">
                            250 EGP
                          </td>
                          <td><span class="badge badge-light-success">{{ isRtl ? 'بفاتورة' : 'Invoice' }}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- 8. FINANCIALS -->
                <div
                  v-else-if="currentTab.key === 'financials'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-1 mb-2 border-bottom">
                      <strong class="small text-success font-weight-bold">{{ isRtl ? 'فاتورة الزيارة (#INV-2026-092)' : 'Invoice #INV-2026-092' }}</strong>
                      <span class="badge badge-light-success">350 EGP (Paid)</span>
                    </div>
                    <b-button
                      size="xs"
                      variant="success"
                      class="font-weight-bold"
                    >
                      {{ isRtl ? 'طباعة الإيصال الحراري' : 'Print Thermal Receipt' }}
                    </b-button>
                  </div>
                </div>

                <!-- 9. TRANSACTIONS -->
                <div
                  v-else-if="currentTab.key === 'transactions'"
                  class="screen-view animated fadeIn"
                >
                  <table class="table table-sm extra-small mb-0 bg-white rounded border">
                    <thead>
                      <tr>
                        <th>TRX ID</th>
                        <th>{{ isRtl ? 'المريض' : 'Patient' }}</th>
                        <th>{{ isRtl ? 'طريقة الدفع' : 'Method' }}</th>
                        <th>{{ isRtl ? 'المبلغ' : 'Amount' }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="font-weight-bold text-primary">
                          #TRX-8821
                        </td>
                        <td>{{ isRtl ? 'سارة أحمد' : 'Sarah Ahmed' }}</td>
                        <td><span class="badge badge-light-success">{{ isRtl ? 'نقدي (Cash)' : 'Cash' }}</span></td>
                        <td class="text-success font-weight-bold">
                          +450 EGP
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 10. ASSISTANTS -->
                <div
                  v-else-if="currentTab.key === 'assistants'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <strong class="small text-dark font-weight-bold">{{ isRtl ? 'إدارة فريق المساعدين والاستقبال' : 'Clinic Assistants & Front Desk' }}</strong>
                      <b-button
                        size="xs"
                        variant="primary"
                        class="font-weight-bold"
                      >
                        + {{ isRtl ? 'إضافة مساعد' : 'Add Assistant' }}
                      </b-button>
                    </div>
                    <div class="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                      <div class="d-flex align-items-center">
                        <b-avatar
                          variant="light-warning"
                          size="34"
                          text="NS"
                          class="mr-2 ml-2 font-weight-bold"
                        />
                        <div>
                          <strong class="text-dark small">{{ isRtl ? 'نورهان سمير (استقبال صباحي)' : 'Nourhan Samir' }}</strong>
                          <div class="extra-small text-muted">
                            nourhan@clinic.com | {{ isRtl ? 'صلاحية كاملة للطابور والحجز' : 'Full Reception Access' }}
                          </div>
                        </div>
                      </div>
                      <span class="badge badge-light-success">{{ isRtl ? 'نشط' : 'Active' }}</span>
                    </div>
                  </div>
                </div>

                <!-- 11. SUB-DOCTORS -->
                <div
                  v-else-if="currentTab.key === 'sub_doctors'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <div>
                        <strong class="small text-dark font-weight-bold">{{ isRtl ? 'الأطباء الفرعيين والزملاء' : 'Sub-Doctors & Partner Physicians' }}</strong>
                        <div class="extra-small text-muted">
                          {{ isRtl ? 'المستخدم: 1 / 3 أطباء متاحين بالخطة' : 'Usage: 1 / 3 Sub-Doctors' }}
                        </div>
                      </div>
                      <b-button
                        size="xs"
                        variant="primary"
                        class="font-weight-bold"
                      >
                        + {{ isRtl ? 'إضافة طبيب فرعي' : 'Add Sub-Doctor' }}
                      </b-button>
                    </div>
                    <div class="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                      <div class="d-flex align-items-center">
                        <b-avatar
                          variant="light-info"
                          size="34"
                          text="AH"
                          class="mr-2 ml-2 font-weight-bold"
                        />
                        <div>
                          <strong class="text-dark small">{{ isRtl ? 'د. أحمد حسام (أخصائي علاج طبيعي)' : 'Dr. Ahmed Hossam' }}</strong>
                          <div class="extra-small text-muted">
                            ahmed.hossam@clinic.com
                          </div>
                        </div>
                      </div>
                      <span class="badge badge-light-primary">{{ isRtl ? 'طبيب فرعي' : 'Sub-Doctor' }}</span>
                    </div>
                  </div>
                </div>

                <!-- 12. REPORTS -->
                <div
                  v-else-if="currentTab.key === 'reports'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom flex-wrap">
                      <h6 class="font-weight-bolder text-dark mb-0">
                        {{ isRtl ? 'التقارير التحليلية والمالية الشاملة' : 'Clinic Financial Analytics' }}
                      </h6>
                      <b-button
                        size="xs"
                        variant="success"
                        class="font-weight-bold mt-1 mt-sm-0"
                      >
                        {{ isRtl ? 'تصدير تقرير PDF' : 'Export PDF' }}
                      </b-button>
                    </div>
                    <b-row class="text-center mb-2">
                      <b-col cols="6">
                        <div class="p-2 bg-light-primary rounded border border-primary">
                          <h5 class="font-weight-bolder text-primary mb-0">
                            142
                          </h5>
                          <span class="extra-small text-muted">{{ isRtl ? 'إجمالي الحالات' : 'Patients' }}</span>
                        </div>
                      </b-col>
                      <b-col cols="6">
                        <div class="p-2 bg-light-success rounded border border-success">
                          <h5 class="font-weight-bolder text-success mb-0">
                            48,500 EGP
                          </h5>
                          <span class="extra-small text-muted">{{ isRtl ? 'إجمالي الدخل' : 'Gross Income' }}</span>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>

              <!-- SCREENSHOT CAPTION BAR -->
              <div class="screen-caption-bar p-2 px-3 bg-dark text-white d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="InfoIcon"
                    size="15"
                    class="text-primary mr-1 ml-1"
                  />
                  <span class="extra-small font-weight-bold text-light">
                    {{ currentTab.caption }}
                  </span>
                </div>
                <span class="badge badge-secondary extra-small font-weight-bold">
                  {{ currentTabIndex + 1 }} / {{ doctorTabs.length }}
                </span>
              </div>
            </div>
          </b-card-body>

          <!-- Navigation Action Footer -->
          <div class="guide-footer-actions p-3 bg-light border-top d-flex flex-wrap align-items-center justify-content-between">
            <div class="d-flex align-items-center mb-2 mb-sm-0">
              <b-form-checkbox
                v-model="dontShowAgain"
                class="extra-small font-weight-bold text-muted"
                @change="onDontShowAgainChange"
              >
                {{ $t('onboarding.dontShowAgain') }}
              </b-form-checkbox>
            </div>

            <div class="d-flex align-items-center flex-wrap">
              <b-button
                v-if="currentTabIndex > 0"
                variant="outline-secondary"
                size="sm"
                class="font-weight-bold mr-1 ml-1"
                @click="prevTab"
              >
                <feather-icon
                  :icon="isRtl ? 'ArrowRightIcon' : 'ArrowLeftIcon'"
                  size="14"
                  class="mr-25 ml-25"
                />
                <span>{{ $t('onboarding.previous') }}</span>
              </b-button>

              <b-button
                v-if="currentTabIndex < doctorTabs.length - 1"
                variant="primary"
                size="sm"
                class="font-weight-bold mr-1 ml-1 shadow-sm"
                @click="nextTab"
              >
                <span>{{ $t('onboarding.next') }}</span>
                <feather-icon
                  :icon="isRtl ? 'ArrowLeftIcon' : 'ArrowRightIcon'"
                  size="14"
                  class="mr-25 ml-25"
                />
              </b-button>

              <b-button
                v-else
                variant="success"
                size="sm"
                class="font-weight-bold mr-1 ml-1 shadow-sm"
                @click="finishGuide"
              >
                <feather-icon
                  icon="CheckCircleIcon"
                  size="14"
                  class="mr-25 ml-25"
                />
                <span>{{ $t('onboarding.finish') }}</span>
              </b-button>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BButton,
  BBadge,
  BProgress,
  BAvatar,
  BFormCheckbox,
} from 'bootstrap-vue'
import { mapGetters } from 'vuex'

export default {
  name: 'DoctorOnboardingGuide',
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BButton,
    BBadge,
    BProgress,
    BAvatar,
    BFormCheckbox,
  },
  data() {
    return {
      currentTabIndex: 0,
      completedTabs: [0],
      dontShowAgain: false,
    }
  },
  computed: {
    ...mapGetters('language', ['currentLocale']),
    isRtl() {
      const activeLocale = this.currentLocale || this.$i18n?.locale || 'en'
      return activeLocale === 'ar'
    },
    doctorTabs() {
      if (this.isRtl) {
        return [
          {
            key: 'dashboard',
            icon: 'HomeIcon',
            routeName: 'doctor-dashboard',
            routePath: '/doctor/dashboard',
            caption: 'لوحة التحكم — كروت الإحصائيات الفورية، طابور الانتظار، وجدول مواعيد اليوم.',
          },
          {
            key: 'clients',
            icon: 'UsersIcon',
            routeName: 'doctor-clients',
            routePath: '/doctor/clients',
            caption: 'المرضى — البحث الفوري، إضافة ملف جديد، والاطلاع على التاريخ المرضي والقياسات الحيوية.',
          },
          {
            key: 'reservations',
            icon: 'ClipboardIcon',
            routeName: 'doctor-reservations',
            routePath: '/doctor/reservations',
            caption: 'الحجوزات — جدول المواعيد، تتبع الحالات (مؤكد/انتظار/مكتمل)، وحجز الاستشارات القادمة.',
          },
          {
            key: 'online_booking',
            icon: 'GlobeIcon',
            routeName: 'doctor-online-booking-settings',
            routePath: '/doctor/online-booking-settings',
            caption: 'الحجز الأونلاين — رابط حجز إلكتروني مخصص للمرضى مع حجز المواعيد المتاحة تلقائياً.',
          },
          {
            key: 'waiting_queue',
            icon: 'ListIcon',
            routeName: 'doctor-waiting-queue',
            routePath: '/doctor/waiting-queue',
            caption: 'طابور الانتظار — المرضى الحاضرين بالعيادة، أرقام الأدوار (#12)، واستدعاء المريض لغرفة الكشف.',
          },
          {
            key: 'diagnoses',
            icon: 'ActivityIcon',
            routeName: 'doctor-diagnoses',
            routePath: '/doctor/diagnoses',
            caption: 'التشخيصات وخريطة الفحص — التشخيصات الطبية المحفوظة وخريطة الجسم التفاعلية.',
          },
          {
            key: 'services',
            icon: 'GridIcon',
            routeName: 'doctor-services',
            routePath: '/doctor/services',
            caption: 'الخدمات الإضافية — إدارة وتسعير الفحوصات والإجراءات الطبية وإضافتها للحجوزات.',
          },
          {
            key: 'financials',
            icon: 'DollarSignIcon',
            routeName: 'doctor-financials',
            routePath: '/doctor/financials',
            caption: 'الماليات — إصدار الفواتير الفورية، طباعة الإيصال الحراري، وتقفيل الخزينة اليومية.',
          },
          {
            key: 'transactions',
            icon: 'CreditCardIcon',
            routeName: 'doctor-transactions',
            routePath: '/doctor/transactions',
            caption: 'المعاملات والمدفوعات — سجل مفصل لكافة المدفوعات والحركات المالية وطرق الدفع.',
          },
          {
            key: 'assistants',
            icon: 'UserPlusIcon',
            routeName: 'doctor-assistants',
            routePath: '/doctor/assistants',
            caption: 'المساعدين — إدارة حسابات فريق الاستقبال وتعيين الصلاحيات وجرس الاستدعاء.',
          },
          {
            key: 'sub_doctors',
            icon: 'UserCheckIcon',
            routeName: 'doctor-sub-doctors',
            routePath: '/doctor/sub-doctors',
            caption: 'الأطباء الفرعيين — إضافة وتنسيق الأطباء المساعدين وإسناد الحالات لهم داخل العيادة.',
          },
          {
            key: 'reports',
            icon: 'BarChart2Icon',
            routeName: 'doctor-reports',
            routePath: '/doctor/reports',
            caption: 'التقارير — ملخصات دخل العيادة، أداء المواعيد، وتصدير التقارير بصيغة PDF.',
          },
        ]
      }
      return [
        {
          key: 'dashboard',
          icon: 'HomeIcon',
          routeName: 'doctor-dashboard',
          routePath: '/doctor/dashboard',
          caption: 'Dashboard — Real-time KPI statistics, pending queue counter, and today appointment list.',
        },
        {
          key: 'clients',
          icon: 'UsersIcon',
          routeName: 'doctor-clients',
          routePath: '/doctor/clients',
          caption: 'Clients & Patients — Quick search, new profile registration, chronic medical history, and vital stats.',
        },
        {
          key: 'reservations',
          icon: 'ClipboardIcon',
          routeName: 'doctor-reservations',
          routePath: '/doctor/reservations',
          caption: 'Reservations — Appointment filters, status tracking (confirmed/waiting/completed), and follow-ups.',
        },
        {
          key: 'online_booking',
          icon: 'GlobeIcon',
          routeName: 'doctor-online-booking-settings',
          routePath: '/doctor/online-booking-settings',
          caption: 'Online Booking — Custom online portal for patients to book available slots remotely.',
        },
        {
          key: 'waiting_queue',
          icon: 'ListIcon',
          routeName: 'doctor-waiting-queue',
          routePath: '/doctor/waiting-queue',
          caption: 'Waiting Queue — Checked-in patients in waiting room with turn tokens (#12) and room entry call.',
        },
        {
          key: 'diagnoses',
          icon: 'ActivityIcon',
          routeName: 'doctor-diagnoses',
          routePath: '/doctor/diagnoses',
          caption: 'Diagnoses & Anatomy — Clinical diagnosis library and interactive body mapping.',
        },
        {
          key: 'services',
          icon: 'GridIcon',
          routeName: 'doctor-services',
          routePath: '/doctor/services',
          caption: 'Additional Services — Medical catalog pricing, tests, and service additions to visits.',
        },
        {
          key: 'financials',
          icon: 'DollarSignIcon',
          routeName: 'doctor-financials',
          routePath: '/doctor/financials',
          caption: 'Financials — Instant visit invoice generation, thermal receipt printing, and daily cash closing.',
        },
        {
          key: 'transactions',
          icon: 'CreditCardIcon',
          routeName: 'doctor-transactions',
          routePath: '/doctor/transactions',
          caption: 'Transactions & Payments — Complete ledger of all financial receipts and payment methods.',
        },
        {
          key: 'assistants',
          icon: 'UserPlusIcon',
          routeName: 'doctor-assistants',
          routePath: '/doctor/assistants',
          caption: 'Assistants — Front desk staff management, permissions, and instant call bell link.',
        },
        {
          key: 'sub_doctors',
          icon: 'UserCheckIcon',
          routeName: 'doctor-sub-doctors',
          routePath: '/doctor/sub-doctors',
          caption: 'Sub-Doctors — Associate physician coordination, delegation, and scheduling.',
        },
        {
          key: 'reports',
          icon: 'BarChart2Icon',
          routeName: 'doctor-reports',
          routePath: '/doctor/reports',
          caption: 'Reports — Comprehensive clinic income analytics, patient volume, and PDF report export.',
        },
      ]
    },
    currentTab() {
      return this.doctorTabs[this.currentTabIndex] || this.doctorTabs[0]
    },
    progressPercent() {
      return ((this.currentTabIndex + 1) / this.doctorTabs.length) * 100
    },
  },
  mounted() {
    this.dontShowAgain = localStorage.getItem('doctor_onboarding_completed') === 'true'
  },
  methods: {
    goToTab(index) {
      this.currentTabIndex = index
      if (!this.completedTabs.includes(index)) {
        this.completedTabs.push(index)
      }
    },
    nextTab() {
      if (this.currentTabIndex < this.doctorTabs.length - 1) {
        this.currentTabIndex += 1
        if (!this.completedTabs.includes(this.currentTabIndex)) {
          this.completedTabs.push(this.currentTabIndex)
        }
      }
    },
    prevTab() {
      if (this.currentTabIndex > 0) {
        this.currentTabIndex -= 1
      }
    },
    onDontShowAgainChange(val) {
      if (val) {
        localStorage.setItem('doctor_onboarding_completed', 'true')
      } else {
        localStorage.removeItem('doctor_onboarding_completed')
      }
    },
    finishGuide() {
      localStorage.setItem('doctor_onboarding_completed', 'true')
      this.$router.push({ name: 'doctor-dashboard' }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.doctor-onboarding-guide {
  width: 100%;
}

.onboarding-header-card {
  border-radius: 0.5rem;
}

.min-w-250 {
  min-width: 240px;
}

.max-w-750 {
  max-width: 750px;
}

.doctor-tabs-scroll {
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

.token-badge {
  min-width: 36px;
  text-align: center;
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
