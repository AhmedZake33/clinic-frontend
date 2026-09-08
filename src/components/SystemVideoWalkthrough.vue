<template>
  <div
    class="system-video-walkthrough"
    :dir="isRtl ? 'rtl' : 'ltr'"
  >
    <div
      ref="playerWrapper"
      class="player-theater-wrapper shadow-2xl rounded-lg overflow-hidden border position-relative"
      :class="{ 'is-fullscreen': isFullscreen }"
    >
      <!-- Theater Top Bar / Browser Shell Header -->
      <div class="theater-topbar p-2 p-md-3 bg-dark d-flex align-items-center justify-content-between text-white border-bottom border-secondary flex-wrap">
        <div class="d-flex align-items-center overflow-hidden mr-1 ml-1">
          <div class="window-dots d-none d-sm-flex align-items-center mr-2 ml-2 flex-shrink-0">
            <span class="window-dot dot-red" />
            <span class="window-dot dot-yellow mx-1" />
            <span class="window-dot dot-green" />
          </div>
          <div class="player-title small font-weight-bold text-light d-inline-flex align-items-center text-truncate">
            <feather-icon
              icon="MonitorIcon"
              size="15"
              class="text-primary flex-shrink-0"
              :class="isRtl ? 'ml-50' : 'mr-50'"
            />
            <span class="d-none d-md-inline">{{ isRtl ? 'جولة تفاعلية شاملة من داخل أقسام الطبيب في النظام (١٢ قسماً)' : 'Interactive In-System Doctor Walkthrough (12 Modules)' }}</span>
            <span class="d-inline d-md-none text-truncate">{{ isRtl ? 'جولة نظام الطبيب (١٢ قسماً)' : 'Doctor Portal Tour (12 Modules)' }}</span>
          </div>
        </div>

        <div class="d-flex align-items-center flex-shrink-0">
          <span class="badge badge-light-success font-weight-bold d-inline-flex align-items-center extra-small py-25 px-50">
            <span class="live-dot mr-25 ml-25" />
            {{ isRtl ? 'معاينة حية' : 'Live Preview' }}
          </span>
        </div>
      </div>

      <!-- PROMINENT 12-SECTIONS TABS STRIP INSIDE THE VIDEO PLAYER -->
      <div class="video-inner-tabs-strip bg-darker p-2 border-bottom border-secondary overflow-auto">
        <div class="d-flex align-items-center justify-content-start inner-tabs-scroll pb-1">
          <div
            v-for="(tab, idx) in chapters"
            :key="tab.id"
            class="video-inner-tab-pill d-flex align-items-center px-2 py-1 rounded mx-1 pointer position-relative flex-shrink-0"
            :class="{
              'active-tab bg-primary text-white shadow-sm': currentSceneIndex === idx,
              'bg-dark text-light border border-secondary': currentSceneIndex !== idx
            }"
            @click="jumpToChapter(idx)"
          >
            <feather-icon
              :icon="tab.icon"
              size="13"
              :class="isRtl ? 'ml-50' : 'mr-50'"
            />
            <span class="small font-weight-bold">{{ tab.title }}</span>
            <span
              v-if="currentSceneIndex === idx"
              class="active-pulse-dot mr-50 ml-50"
            />
          </div>
        </div>
      </div>

      <!-- Main Stage Container -->
      <div class="theater-stage-container position-relative">
        <div
          class="interactive-stage"
          @click="togglePlay"
        >
          <!-- Full System App Shell Simulation (Sidebar + Top Navbar + Active Page View) -->
          <div class="system-app-layout d-flex">
            <!-- Simulated Vuexy Left Sidebar with Doctor Tabs -->
            <div class="sim-sidebar bg-white border-right d-none d-md-flex flex-column justify-content-between p-2">
              <div>
                <!-- Brand in Sidebar -->
                <div class="sim-sidebar-brand d-flex align-items-center mb-2 pb-2 border-bottom">
                  <div class="brand-logo-box bg-primary text-white p-1 rounded mr-2 ml-2">
                    <feather-icon
                      icon="ActivityIcon"
                      size="18"
                    />
                  </div>
                  <div>
                    <h6 class="font-weight-bolder text-dark mb-0">
                      {{ $t('clinic.brandText') || (isRtl ? 'نظام العيادة' : 'Clinic System') }}
                    </h6>
                    <span class="extra-small text-muted font-weight-bold">v2.4 Pro</span>
                  </div>
                </div>

                <!-- Navigation Links List in Sidebar -->
                <div
                  class="sim-nav-items"
                  style="max-height: 380px; overflow-y: auto;"
                >
                  <div
                    v-for="(tab, idx) in chapters"
                    :key="tab.id"
                    class="sim-nav-item d-flex align-items-center p-1 rounded mb-1 font-weight-600 extra-small"
                    :class="{ 'active bg-light-primary text-primary font-weight-bold shadow-xs': currentSceneIndex === idx }"
                    @click.stop="jumpToChapter(idx)"
                  >
                    <feather-icon
                      :icon="tab.icon"
                      size="13"
                      class="mr-1 ml-1"
                    />
                    <span class="text-truncate">{{ tab.sidebarTitle }}</span>
                  </div>
                </div>
              </div>

              <!-- Sidebar User Status Footer -->
              <div class="sim-sidebar-user p-1 bg-light rounded d-flex align-items-center mt-2">
                <b-avatar
                  size="28"
                  variant="light-primary"
                  text="MK"
                  class="mr-1 ml-1 font-weight-bold"
                />
                <div class="overflow-hidden">
                  <div class="extra-small font-weight-bold text-dark text-truncate">
                    {{ isRtl ? 'د. محمد خالد' : 'Dr. Mohamed' }}
                  </div>
                  <div
                    class="text-muted"
                    style="font-size: 0.65rem;"
                  >
                    {{ isRtl ? 'طبيب متخصص' : 'Doctor' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Main App Body (Top Navbar + Simulated Pages) -->
            <div class="sim-main-content flex-grow-1 d-flex flex-column bg-light">
              <!-- Top Header Navbar -->
              <div class="sim-top-navbar bg-white p-2 px-2 px-md-3 shadow-xs d-flex align-items-center justify-content-between border-bottom">
                <div class="d-flex align-items-center overflow-hidden">
                  <feather-icon
                    icon="MenuIcon"
                    size="18"
                    class="text-muted mr-1 ml-1 d-md-none flex-shrink-0"
                  />
                  <div class="page-breadcrumb font-weight-bold small text-dark d-flex align-items-center text-truncate">
                    <span class="text-primary d-none d-sm-inline flex-shrink-0">{{ isRtl ? 'شاشة الطبيب' : 'Doctor Portal' }}</span>
                    <feather-icon
                      :icon="isRtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'"
                      size="14"
                      class="text-muted mx-50 d-none d-sm-inline flex-shrink-0"
                    />
                    <span class="badge badge-primary mr-50 ml-50 px-50 flex-shrink-0">{{ currentSceneIndex + 1 }}/{{ chapters.length }}</span>
                    <span class="text-truncate">{{ currentChapter.title }}</span>
                  </div>
                </div>

                <div class="d-flex align-items-center flex-shrink-0">
                  <div class="header-bell-box p-1 px-1 px-sm-2 rounded mr-1 ml-1 d-flex align-items-center bg-light text-muted">
                    <feather-icon
                      icon="BellIcon"
                      size="14"
                      class="text-primary"
                    />
                    <span class="extra-small font-weight-bold text-dark d-none d-sm-inline ml-50 mr-50">
                      {{ isRtl ? 'جرس المساعد' : 'Call Bell' }}
                    </span>
                  </div>

                  <span class="badge badge-light-success extra-small font-weight-bold">
                    {{ isRtl ? 'متصل' : 'Online' }}
                  </span>
                </div>
              </div>

              <!-- Real Page Content Stage -->
              <div class="sim-page-viewport p-2 p-md-3 flex-grow-1 overflow-auto">
                <!-- 1. DASHBOARD -->
                <div
                  v-if="currentSceneIndex === 0"
                  class="real-page page-doctor-dashboard animated fadeIn"
                >
                  <div class="b-card p-2 bg-white rounded shadow-sm border mb-2">
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        <h6 class="font-weight-bolder text-dark mb-0">
                          {{ isRtl ? 'مرحباً بك مجدداً، د. محمد خالد!' : 'Welcome back, Dr. Mohamed Khaled!' }}
                        </h6>
                        <span class="extra-small text-muted">{{ isRtl ? 'التخصص: باطنة وعلاج تشريحي' : 'Internal Medicine' }}</span>
                      </div>
                      <b-button
                        size="xs"
                        variant="primary"
                        class="font-weight-bold mt-1 mt-sm-0"
                      >
                        {{ isRtl ? 'عرض جدول المواعيد' : 'View Schedule' }}
                      </b-button>
                    </div>
                  </div>

                  <b-row class="mb-2">
                    <b-col cols="4">
                      <div class="stat-card p-2 bg-white rounded shadow-sm border text-center">
                        <b-avatar
                          variant="light-info"
                          size="30"
                          class="mb-1"
                        >
                          <feather-icon
                            icon="CalendarIcon"
                            size="14"
                          />
                        </b-avatar>
                        <h5 class="font-weight-bolder text-dark mb-0">
                          24
                        </h5>
                        <div class="text-muted extra-small">
                          {{ isRtl ? 'إجمالي الحجوزات' : 'Total Appts' }}
                        </div>
                      </div>
                    </b-col>
                    <b-col cols="4">
                      <div class="stat-card p-2 bg-white rounded shadow-sm border text-center">
                        <b-avatar
                          variant="light-warning"
                          size="30"
                          class="mb-1"
                        >
                          <feather-icon
                            icon="ClockIcon"
                            size="14"
                          />
                        </b-avatar>
                        <h5 class="font-weight-bolder text-warning mb-0">
                          5
                        </h5>
                        <div class="text-muted extra-small">
                          {{ isRtl ? 'في الانتظار' : 'Pending Queue' }}
                        </div>
                      </div>
                    </b-col>
                    <b-col cols="4">
                      <div class="stat-card p-2 bg-white rounded shadow-sm border text-center">
                        <b-avatar
                          variant="light-success"
                          size="30"
                          class="mb-1"
                        >
                          <feather-icon
                            icon="CheckCircleIcon"
                            size="14"
                          />
                        </b-avatar>
                        <h5 class="font-weight-bolder text-success mb-0">
                          19
                        </h5>
                        <div class="text-muted extra-small">
                          {{ isRtl ? 'كشوفات مكتملة' : 'Completed' }}
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <!-- 2. CLIENTS -->
                <div
                  v-else-if="currentSceneIndex === 1"
                  class="real-page page-clients animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center">
                    <strong class="small text-dark">{{ isRtl ? 'دليل المرضى والملف الطبي' : 'Patients Directory & Medical Records' }}</strong>
                    <b-button
                      size="xs"
                      variant="primary"
                      class="font-weight-bold"
                    >
                      + {{ isRtl ? 'إضافة مريض' : 'New Patient' }}
                    </b-button>
                  </div>
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom">
                      <div class="d-flex align-items-center">
                        <b-avatar
                          variant="light-primary"
                          size="36"
                          text="SA"
                          class="mr-2 ml-2 font-weight-bold"
                        />
                        <div>
                          <strong class="text-dark small">{{ isRtl ? 'سارة أحمد محمود (ملف رقم #982)' : 'Sarah Ahmed Mahmoud (#982)' }}</strong>
                          <div class="extra-small text-muted">
                            {{ isRtl ? 'الهاتف: 01012345678 | السن: 29 سنة | فصيلة الدم: A+' : '01012345678 | Age: 29 | Blood: A+' }}
                          </div>
                        </div>
                      </div>
                      <span class="badge badge-light-success">{{ isRtl ? 'ملف نشط' : 'Active Profile' }}</span>
                    </div>
                  </div>
                </div>

                <!-- 3. RESERVATIONS -->
                <div
                  v-else-if="currentSceneIndex === 2"
                  class="real-page page-reservations animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2">
                    <div class="table-responsive">
                      <table class="table table-sm extra-small mb-0 text-nowrap">
                        <thead>
                          <tr>
                            <th>{{ isRtl ? 'كود الحجز' : 'Token' }}</th>
                            <th>{{ isRtl ? 'المريض' : 'Patient' }}</th>
                            <th>{{ isRtl ? 'النوع' : 'Type' }}</th>
                            <th>{{ isRtl ? 'المبلغ' : 'Fee' }}</th>
                            <th>{{ isRtl ? 'الحالة' : 'Status' }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="font-weight-bold text-primary">
                              #RES-104
                            </td>
                            <td>{{ isRtl ? 'سارة أحمد محمود' : 'Sarah Ahmed' }}</td>
                            <td>{{ isRtl ? 'كشف جديد' : 'New Exam' }}</td>
                            <td>350 EGP</td>
                            <td><span class="badge badge-light-success">{{ isRtl ? 'مؤكد' : 'Confirmed' }}</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- 4. ONLINE BOOKING -->
                <div
                  v-else-if="currentSceneIndex === 3"
                  class="real-page page-online-booking animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <div>
                        <strong class="small text-dark font-weight-bold">{{ isRtl ? 'بوابة الحجز الأونلاين للمرضى' : 'Online Patient Booking Portal' }}</strong>
                        <div class="extra-small text-muted">
                          {{ isRtl ? 'رابط الحجز المباشر عبر الإنترنت' : 'Direct web reservation link' }}
                        </div>
                      </div>
                      <span class="badge badge-light-success">{{ isRtl ? 'مفعّل ومتاح' : 'Active' }}</span>
                    </div>
                    <div class="p-2 bg-light rounded d-flex justify-content-between align-items-center mb-2 flex-wrap">
                      <code
                        class="small text-primary font-weight-bold text-truncate mr-1 ml-1"
                        dir="ltr"
                        style="max-width: 170px; display: inline-block;"
                      >https://clinic.tafratech.com/book/dr-mohamed</code>
                      <b-button
                        size="xs"
                        variant="primary"
                        class="font-weight-bold flex-shrink-0"
                      >
                        {{ isRtl ? 'نسخ الرابط' : 'Copy URL' }}
                      </b-button>
                    </div>
                  </div>
                </div>

                <!-- 5. WAITING QUEUE -->
                <div
                  v-else-if="currentSceneIndex === 4"
                  class="real-page page-queue animated fadeIn"
                >
                  <div class="p-2 bg-light-primary rounded border border-primary d-flex justify-content-between align-items-center shadow-xs">
                    <div class="d-flex align-items-center">
                      <div class="token-badge bg-primary text-white font-weight-bolder p-2 rounded mr-2 ml-2">
                        #12
                      </div>
                      <div>
                        <div class="font-weight-bold text-dark small">
                          {{ isRtl ? 'سارة أحمد محمود' : 'Sarah Ahmed' }}
                        </div>
                        <div class="extra-small text-muted">
                          10:25 AM | {{ isRtl ? 'كشف باطنة وتخصصي' : 'Consultation' }}
                        </div>
                      </div>
                    </div>
                    <b-button
                      size="sm"
                      variant="primary"
                      class="font-weight-bold"
                    >
                      {{ isRtl ? 'دخول غرفة الكشف →' : 'Call Exam →' }}
                    </b-button>
                  </div>
                </div>

                <!-- 6. DIAGNOSES & ANATOMY -->
                <div
                  v-else-if="currentSceneIndex === 5"
                  class="real-page page-diagnoses animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <strong class="small text-dark font-weight-bold">{{ isRtl ? 'التشخيصات وخريطة التشريح السريري' : 'Diagnoses & Anatomy Map' }}</strong>
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
                        <strong class="small text-dark">{{ isRtl ? 'التهاب الفقرات العنقية والمفاصل' : 'Cervical Spine Spondylosis' }}</strong>
                        <div class="extra-small text-muted">
                          {{ isRtl ? 'تحديد وتظليل مواضع الألم على خريطة الجسم' : 'Body Anatomy Mapping: Cervical / Shoulder' }}
                        </div>
                      </div>
                      <span class="badge badge-light-primary">ICD-10 M47</span>
                    </div>
                  </div>
                </div>

                <!-- 7. SERVICES -->
                <div
                  v-else-if="currentSceneIndex === 6"
                  class="real-page page-services animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <strong class="small text-dark font-weight-bold">{{ isRtl ? 'قائمة الخدمات الطبية الإضافية' : 'Additional Medical Services' }}</strong>
                      <b-button
                        size="xs"
                        variant="primary"
                        class="font-weight-bold"
                      >
                        + {{ isRtl ? 'إضافة خدمة' : 'Add Service' }}
                      </b-button>
                    </div>
                    <div class="table-responsive">
                      <table class="table table-sm extra-small mb-0 text-nowrap">
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
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- 8. FINANCIALS -->
                <div
                  v-else-if="currentSceneIndex === 7"
                  class="real-page page-financials animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-1 mb-2 border-bottom">
                      <strong class="small text-success font-weight-bold">{{ isRtl ? 'فاتورة الزيارة والإيصال (#INV-2026-092)' : 'Invoice #INV-2026-092' }}</strong>
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

                <!-- 9. TRANSACTIONS & PAYMENTS -->
                <div
                  v-else-if="currentSceneIndex === 8"
                  class="real-page page-transactions animated fadeIn"
                >
                  <div class="table-responsive">
                    <table class="table table-sm extra-small mb-0 bg-white rounded border text-nowrap">
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
                </div>

                <!-- 10. ASSISTANTS -->
                <div
                  v-else-if="currentSceneIndex === 9"
                  class="real-page page-assistants animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <strong class="small text-dark font-weight-bold">{{ isRtl ? 'إدارة المساعدين والاستقبال' : 'Clinic Assistants & Front Desk' }}</strong>
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
                          size="32"
                          text="NS"
                          class="mr-2 ml-2 font-weight-bold"
                        />
                        <div>
                          <strong class="text-dark small">{{ isRtl ? 'نورهان سمير' : 'Nourhan Samir' }}</strong>
                          <div class="extra-small text-muted">
                            nourhan@clinic.com | {{ isRtl ? 'صلاحيات الحجز والطابور' : 'Reception & Queue' }}
                          </div>
                        </div>
                      </div>
                      <span class="badge badge-light-success">{{ isRtl ? 'نشط' : 'Active' }}</span>
                    </div>
                  </div>
                </div>

                <!-- 11. SUB-DOCTORS -->
                <div
                  v-else-if="currentSceneIndex === 10"
                  class="real-page page-sub-doctors animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                      <div>
                        <strong class="small text-dark font-weight-bold">{{ isRtl ? 'الأطباء الفرعيين والزملاء' : 'Sub-Doctors & Associate Physicians' }}</strong>
                        <div class="extra-small text-muted">
                          {{ isRtl ? 'استخدام الخطة: 1 / 3 أطباء' : 'Usage: 1 / 3 Physicians' }}
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
                          size="32"
                          text="AH"
                          class="mr-2 ml-2 font-weight-bold"
                        />
                        <div>
                          <strong class="text-dark small">{{ isRtl ? 'د. أحمد حسام (علاج طبيعي)' : 'Dr. Ahmed Hossam' }}</strong>
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
                  v-else-if="currentSceneIndex === 11"
                  class="real-page page-reports animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border shadow-xs">
                    <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom flex-wrap">
                      <div>
                        <h6 class="font-weight-bolder text-dark mb-0">
                          {{ isRtl ? 'التقارير التحليلية والمالية الشاملة' : 'Clinic Financial Analytics' }}
                        </h6>
                      </div>
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
              <div class="screen-caption-bar p-2 px-3 bg-dark text-white d-none d-md-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="InfoIcon"
                    size="15"
                    class="text-primary mr-1 ml-1"
                  />
                  <span class="extra-small font-weight-bold text-light">
                    {{ currentChapter.caption }}
                  </span>
                </div>
                <span class="badge badge-secondary extra-small font-weight-bold">
                  {{ currentSceneIndex + 1 }} / {{ chapters.length }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Subtitle / Narration Bar -->
          <div class="subtitles-narration-bar p-2 p-md-3 bg-dark text-white d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center overflow-hidden mr-1 ml-1">
              <span class="badge badge-primary font-weight-bold mr-1 ml-1 flex-shrink-0 extra-small">
                {{ isRtl ? 'شرح الشاشة' : 'Narration' }}
              </span>
              <span class="subtitle-text text-light font-weight-bold small text-truncate">
                {{ currentSceneSubtitle }}
              </span>
            </div>
            <div
              class="time-counter small text-muted d-none d-sm-block flex-shrink-0"
              dir="ltr"
            >
              {{ formattedCurrentTime }} / {{ formattedDuration }}
            </div>
          </div>
        </div>
      </div>

      <!-- Video Control Bar -->
      <div class="video-controls-bar p-2 bg-darker text-white border-top border-secondary">
        <!-- Scrubbable Progress Bar with Chapter Segment Notches -->
        <div
          class="progress-bar-track position-relative mb-2 pointer"
          @click="onProgressClick"
        >
          <div
            class="progress-bar-fill bg-primary h-100 rounded"
            :style="{ width: `${progressPercentage}%` }"
          />
          <div
            class="progress-scrubber-handle"
            :style="{ [isRtl ? 'right' : 'left']: `${progressPercentage}%` }"
          />
        </div>

        <!-- Controls Action Row -->
        <div class="d-flex flex-wrap align-items-center justify-content-between">
          <!-- Left: Play/Pause & Speed -->
          <div class="d-flex align-items-center flex-wrap">
            <b-button
              variant="primary"
              size="sm"
              class="btn-play-pause font-weight-bold mr-1 ml-1 d-inline-flex align-items-center shadow-sm"
              @click="togglePlay"
            >
              <feather-icon
                :icon="isPlaying ? 'PauseIcon' : 'PlayIcon'"
                size="15"
                class="mr-25 ml-25"
              />
              <span>{{ isPlaying ? (isRtl ? 'إيقاف' : 'Pause') : (isRtl ? 'تشغيل' : 'Play') }}</span>
            </b-button>

            <b-button
              size="sm"
              variant="outline-light"
              class="extra-small font-weight-bold mr-50 ml-50 py-25 px-50"
              @click="cycleSpeed"
            >
              {{ playbackSpeed }}x
            </b-button>

            <span
              class="extra-small text-muted d-inline-block d-sm-none mr-50 ml-50"
              dir="ltr"
            >
              {{ formattedCurrentTime }} / {{ formattedDuration }}
            </span>
          </div>

          <!-- Right: Fullscreen -->
          <div class="d-flex align-items-center">
            <b-button
              size="sm"
              variant="outline-light"
              class="btn-icon mr-1 ml-1 py-25 px-50"
              :title="isRtl ? 'ملء الشاشة' : 'Fullscreen'"
              @click="toggleFullscreen"
            >
              <feather-icon
                :icon="isFullscreen ? 'MinimizeIcon' : 'MaximizeIcon'"
                size="14"
              />
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BRow,
  BCol,
  BAvatar,
} from 'bootstrap-vue'
import { mapGetters } from 'vuex'

const SECONDS_PER_SCENE = 20
const TOTAL_CHAPTERS = 12
const TOTAL_DURATION_SECONDS = SECONDS_PER_SCENE * TOTAL_CHAPTERS // 240 seconds total (4 minutes)

export default {
  name: 'SystemVideoWalkthrough',
  components: {
    BButton,
    BRow,
    BCol,
    BAvatar,
  },
  data() {
    return {
      isPlaying: true,
      currentTime: 0,
      playbackSpeed: 1,
      timerInterval: null,
      isFullscreen: false,
    }
  },
  computed: {
    ...mapGetters('language', ['currentLocale']),
    isRtl() {
      const activeLocale = this.currentLocale || this.$i18n?.locale || 'en'
      return activeLocale === 'ar'
    },
    chapters() {
      if (this.isRtl) {
        return [
          {
            id: 0,
            title: '١. لوحة التحكم',
            sidebarTitle: 'لوحة التحكم',
            icon: 'HomeIcon',
            timeStart: 0,
            caption: 'لوحة التحكم — كروت الإحصائيات الفورية، طابور الانتظار، وجدول مواعيد اليوم.',
          },
          {
            id: 1,
            title: '٢. المرضى',
            sidebarTitle: 'المرضى',
            icon: 'UsersIcon',
            timeStart: 20,
            caption: 'المرضى — البحث الفوري، إضافة ملف جديد، والاطلاع على التاريخ المرضي والقياسات الحيوية.',
          },
          {
            id: 2,
            title: '٣. الحجوزات',
            sidebarTitle: 'الحجوزات',
            icon: 'ClipboardIcon',
            timeStart: 40,
            caption: 'الحجوزات — جدول المواعيد، تتبع الحالات (مؤكد/انتظار/مكتمل)، وحجز الاستشارات القادمة.',
          },
          {
            id: 3,
            title: '٤. الحجز الأونلاين',
            sidebarTitle: 'الحجز الأونلاين',
            icon: 'GlobeIcon',
            timeStart: 60,
            caption: 'الحجز الأونلاين — رابط حجز إلكتروني مخصص للمرضى مع حجز المواعيد المتاحة تلقائياً.',
          },
          {
            id: 4,
            title: '٥. طابور الانتظار',
            sidebarTitle: 'طابور الانتظار',
            icon: 'ListIcon',
            timeStart: 80,
            caption: 'طابور الانتظار — المرضى الحاضرين بالعيادة، أرقام الأدوار (#12)، واستدعاء المريض لغرفة الكشف.',
          },
          {
            id: 5,
            title: '٦. التشخيصات',
            sidebarTitle: 'التشخيصات والتشريح',
            icon: 'ActivityIcon',
            timeStart: 100,
            caption: 'التشخيصات وخريطة الفحص — التشخيصات الطبية المحفوظة وخريطة الجسم التفاعلية.',
          },
          {
            id: 6,
            title: '٧. الخدمات الإضافية',
            sidebarTitle: 'الخدمات الإضافية',
            icon: 'GridIcon',
            timeStart: 120,
            caption: 'الخدمات الإضافية — إدارة وتسعير الفحوصات والإجراءات الطبية وإضافتها للحجوزات.',
          },
          {
            id: 7,
            title: '٨. الماليات',
            sidebarTitle: 'الماليات والفواتير',
            icon: 'DollarSignIcon',
            timeStart: 140,
            caption: 'الماليات — إصدار الفواتير الفورية، طباعة الإيصال الحراري، وتقفيل الخزينة اليومية.',
          },
          {
            id: 8,
            title: '٩. المعاملات',
            sidebarTitle: 'المعاملات والمدفوعات',
            icon: 'CreditCardIcon',
            timeStart: 160,
            caption: 'المعاملات والمدفوعات — سجل مفصل لكافة المدفوعات والحركات المالية وطرق الدفع.',
          },
          {
            id: 9,
            title: '١٠. المساعدين',
            sidebarTitle: 'المساعدين والاستقبال',
            icon: 'UserPlusIcon',
            timeStart: 180,
            caption: 'المساعدين — إدارة حسابات فريق الاستقبال وتعيين الصلاحيات وجرس الاستدعاء.',
          },
          {
            id: 10,
            title: '١١. الأطباء الفرعيين',
            sidebarTitle: 'الأطباء الفرعيين',
            icon: 'UserCheckIcon',
            timeStart: 200,
            caption: 'الأطباء الفرعيين — إضافة وتنسيق الأطباء المساعدين وإسناد الحالات لهم داخل العيادة.',
          },
          {
            id: 11,
            title: '١٢. التقارير',
            sidebarTitle: 'التقارير التحليلية',
            icon: 'BarChart2Icon',
            timeStart: 220,
            caption: 'التقارير — ملخصات دخل العيادة، أداء المواعيد، وتصدير التقارير بصيغة PDF.',
          },
        ]
      }
      return [
        {
          id: 0,
          title: '1. Dashboard',
          sidebarTitle: 'Dashboard',
          icon: 'HomeIcon',
          timeStart: 0,
          caption: 'Dashboard — Real-time KPI statistics, pending queue counter, and today appointment list.',
        },
        {
          id: 1,
          title: '2. Clients',
          sidebarTitle: 'Clients',
          icon: 'UsersIcon',
          timeStart: 20,
          caption: 'Clients & Patients — Quick search, new profile registration, chronic medical history, and vital stats.',
        },
        {
          id: 2,
          title: '3. Reservations',
          sidebarTitle: 'Reservations',
          icon: 'ClipboardIcon',
          timeStart: 40,
          caption: 'Reservations — Appointment filters, status tracking (confirmed/waiting/completed), and follow-ups.',
        },
        {
          id: 3,
          title: '4. Online Booking',
          sidebarTitle: 'Online Booking',
          icon: 'GlobeIcon',
          timeStart: 60,
          caption: 'Online Booking — Custom online portal for patients to book available slots remotely.',
        },
        {
          id: 4,
          title: '5. Waiting Queue',
          sidebarTitle: 'Waiting Queue',
          icon: 'ListIcon',
          timeStart: 80,
          caption: 'Waiting Queue — Checked-in patients in waiting room with turn tokens (#12) and room entry call.',
        },
        {
          id: 5,
          title: '6. Diagnoses',
          sidebarTitle: 'Diagnoses & Anatomy',
          icon: 'ActivityIcon',
          timeStart: 100,
          caption: 'Diagnoses & Anatomy — Clinical diagnosis library and interactive body mapping.',
        },
        {
          id: 6,
          title: '7. Services',
          sidebarTitle: 'Services',
          icon: 'GridIcon',
          timeStart: 120,
          caption: 'Additional Services — Medical catalog pricing, tests, and service additions to visits.',
        },
        {
          id: 7,
          title: '8. Financials',
          sidebarTitle: 'Financials',
          icon: 'DollarSignIcon',
          timeStart: 140,
          caption: 'Financials — Instant visit invoice generation, thermal receipt printing, and daily cash closing.',
        },
        {
          id: 8,
          title: '9. Transactions',
          sidebarTitle: 'Transactions',
          icon: 'CreditCardIcon',
          timeStart: 160,
          caption: 'Transactions & Payments — Complete ledger of all financial receipts and payment methods.',
        },
        {
          id: 9,
          title: '10. Assistants',
          sidebarTitle: 'Assistants',
          icon: 'UserPlusIcon',
          timeStart: 180,
          caption: 'Assistants — Front desk staff management, permissions, and instant call bell link.',
        },
        {
          id: 10,
          title: '11. Sub-Doctors',
          sidebarTitle: 'Sub-Doctors',
          icon: 'UserCheckIcon',
          timeStart: 200,
          caption: 'Sub-Doctors — Associate physician coordination, delegation, and scheduling.',
        },
        {
          id: 11,
          title: '12. Reports',
          sidebarTitle: 'Reports',
          icon: 'BarChart2Icon',
          timeStart: 220,
          caption: 'Reports — Comprehensive clinic income analytics, patient volume, and PDF report export.',
        },
      ]
    },
    currentSceneIndex() {
      const idx = Math.floor(this.currentTime / SECONDS_PER_SCENE)
      return Math.min(TOTAL_CHAPTERS - 1, Math.max(0, idx))
    },
    currentChapter() {
      return this.chapters[this.currentSceneIndex] || this.chapters[0]
    },
    currentSceneSubtitle() {
      if (this.isRtl) {
        switch (this.currentSceneIndex) {
          case 0:
            return 'لوحة التحكم: استعراض إحصائيات المواعيد اليومية، الحالات في الانتظار، والكشوفات المكتملة.'
          case 1:
            return 'المرضى: البحث الفوري، فتح الملف الطبي الشامل، ومتابعة التاريخ المرضي والقياسات الحيوية.'
          case 2:
            return 'الحجوزات: جدول المواعيد، تتبع الحالات (مؤكد/انتظار/مكتمل)، وحجز الاستشارات والمتابعات.'
          case 3:
            return 'الحجز الأونلاين: تخصيص رابط الحجز المباشر للمرضى عبر الإنترنت واستقبال المواعيد تلقائياً.'
          case 4:
            return 'طابور الانتظار: شاشة صالة الانتظار الحية، أرقام الأدوار (#12)، واستدعاء المريض لغرفة الكشف.'
          case 5:
            return 'التشخيصات وخريطة التشريح: توثيق التشخيص الطبي وتحديد مواضع الفحص على خريطة الجسم.'
          case 6:
            return 'الخدمات الإضافية: إدارة وتسعير الخدمات والفحوصات الطبية وإضافتها للحجوزات.'
          case 7:
            return 'الماليات والفواتير: إصدار فواتير الكشف (#INV)، طباعة الإيصال الحراري، وتقفيل الخزينة.'
          case 8:
            return 'المعاملات والمدفوعات: سجل مفصل بكافة المدفوعات والحركات المالية وطرق الدفع (نقدي/فيزا).'
          case 9:
            return 'المساعدين: إدارة حسابات فريق الاستقبال وتعيين الصلاحيات وجرس الاستدعاء الفوري.'
          case 10:
            return 'الأطباء الفرعيين: تنسيق الأطباء المساعدين داخل العيادة وإسناد الحالات وتحديد الصلاحيات.'
          case 11:
            return 'التقارير التحليلية: تقارير إحصائية شاملة لدخل العيادة وأعداد المرضى مع تصدير PDF.'
          default:
            return 'جولة فيديو حية من داخل شاشات نظام العيادة'
        }
      }
      switch (this.currentSceneIndex) {
        case 0:
          return 'Doctor Dashboard: Real-time metrics for appointments, pending queue, and completed consults.'
        case 1:
          return 'Clients & Patients: Instant search, digital medical history, vital stats, and previous visits.'
        case 2:
          return 'Reservations: Booking schedule with status filters and follow-up appointment booking.'
        case 3:
          return 'Online Booking: Dedicated patient web booking portal with automatic calendar synchronization.'
        case 4:
          return 'Waiting Queue: Live waiting room queue board, sequential tokens (#12), and room calls.'
        case 5:
          return 'Diagnoses & Anatomy: Medical diagnosis library and interactive body anatomy chart.'
        case 6:
          return 'Additional Services: Clinical catalog pricing, laboratory tests, and procedure add-ons.'
        case 7:
          return 'Financials: Instant visit invoice generation, thermal receipts, and daily cash closing.'
        case 8:
          return 'Transactions & Payments: Complete ledger of receipts, payments, and payment methods.'
        case 9:
          return 'Assistants: Front desk staff management, permissions, and instant call bell chime.'
        case 10:
          return 'Sub-Doctors: Managing associate physicians, case delegation, and schedule coordination.'
        case 11:
          return 'Reports & Analytics: In-depth financial summaries, patient volume, and PDF export.'
        default:
          return 'Live Walkthrough of Actual System Screens'
      }
    },
    progressPercentage() {
      return Math.min(100, Math.max(0, (this.currentTime / TOTAL_DURATION_SECONDS) * 100))
    },
    formattedCurrentTime() {
      const mins = Math.floor(this.currentTime / 60)
      const secs = Math.floor(this.currentTime % 60)
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    },
    formattedDuration() {
      const mins = Math.floor(TOTAL_DURATION_SECONDS / 60)
      const secs = Math.floor(TOTAL_DURATION_SECONDS % 60)
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    },
  },
  watch: {
    currentSceneIndex() {
      this.$nextTick(() => {
        if (!this.$refs.playerWrapper) return
        const activeTab = this.$refs.playerWrapper.querySelector('.video-inner-tab-pill.active-tab')
        if (activeTab && activeTab.scrollIntoView) {
          activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
      })
    },
  },
  mounted() {
    this.startTimer()
    document.addEventListener('fullscreenchange', this.handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange)
  },
  beforeDestroy() {
    this.stopTimer()
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange)
  },
  methods: {
    handleFullscreenChange() {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
      this.isFullscreen = !!fsElement && fsElement === this.$refs.playerWrapper
    },
    startTimer() {
      this.stopTimer()
      this.timerInterval = setInterval(() => {
        if (this.isPlaying) {
          this.currentTime += 1 * this.playbackSpeed
          if (this.currentTime >= TOTAL_DURATION_SECONDS) {
            this.currentTime = 0
          }
        }
      }, 1000)
    },
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying
    },
    jumpToChapter(index) {
      const target = this.chapters[index]
      if (target) {
        this.currentTime = target.timeStart
        this.isPlaying = true
      }
    },
    onProgressClick(event) {
      const rect = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const ratio = Math.max(0, Math.min(1, clickX / rect.width))
      const targetTime = this.isRtl ? (1 - ratio) * TOTAL_DURATION_SECONDS : ratio * TOTAL_DURATION_SECONDS
      this.currentTime = Math.floor(targetTime)
    },
    cycleSpeed() {
      if (this.playbackSpeed === 1) this.playbackSpeed = 1.5
      else if (this.playbackSpeed === 1.5) this.playbackSpeed = 2
      else this.playbackSpeed = 1
    },
    toggleFullscreen() {
      const el = this.$refs.playerWrapper
      if (!el) return

      const isFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
      if (!isFs) {
        if (el.requestFullscreen) {
          el.requestFullscreen().catch(() => {})
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen()
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen()
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen()
        }
        this.isFullscreen = true
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {})
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.isFullscreen = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.system-video-walkthrough {
  width: 100%;
}

.player-theater-wrapper {
  background-color: #0e1017;
  border: 1px solid #232733;
  width: 100%;
  position: relative;

  &:fullscreen,
  &:-webkit-full-screen,
  &:-moz-full-screen {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;
  }
}

.theater-topbar {
  background-color: #161922 !important;
}

.window-dots {
  .window-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;

    &.dot-red { background-color: #ea5455; }
    &.dot-yellow { background-color: #ff9f43; }
    &.dot-green { background-color: #28c76f; }
  }
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: #28c76f;
  border-radius: 50%;
  display: inline-block;
  animation: liveDotPulse 1.8s infinite ease-in-out;
}

@keyframes liveDotPulse {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

/* VIDEO INNER TABS STRIP */
.video-inner-tabs-strip {
  background-color: #12151e !important;
}

.video-inner-tab-pill {
  transition: all 0.25s ease;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    background-color: #1e2230 !important;
  }

  &.active-tab {
    background-color: #7367f0 !important;
    border-color: #7367f0 !important;
    box-shadow: 0 3px 10px rgba(115, 103, 240, 0.4) !important;
  }
}

.active-pulse-dot {
  width: 7px;
  height: 7px;
  background-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
  animation: liveDotPulse 1.2s infinite ease-in-out;
}

.inner-tabs-scroll {
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.theater-stage-container {
  min-height: 440px;
  background-color: #12141c;
  display: flex;
  flex-direction: column;
}

.interactive-stage {
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Simulated App Layout */
.system-app-layout {
  min-height: 400px;
  flex-grow: 1;
  background-color: #f8f9fa;
}

.sim-sidebar {
  width: 220px;
  flex-shrink: 0;
  border-color: #ebe9f1 !important;
}

.sim-nav-item {
  color: #6e6b7b;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
    color: #7367f0;
  }

  &.active {
    box-shadow: 0 0 10px 1px rgba(115, 103, 240, 0.2);
  }
}

.sim-top-navbar {
  height: 48px;
  border-color: #ebe9f1 !important;
}

.sim-page-viewport {
  background: #f8f9fa;
  min-height: 350px;
}

.extra-small {
  font-size: 0.73rem;
}

.font-weight-600 {
  font-weight: 600;
}

.subtitles-narration-bar {
  background-color: #1a1d27 !important;
  border-top: 1px solid #2a2e3d;
  min-height: 52px;
}

.video-controls-bar {
  background-color: #0f1118;
}

.progress-bar-track {
  height: 6px;
  background-color: #2d3245;
  border-radius: 4px;
}

.progress-scrubber-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: #7367f0;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(115, 103, 240, 0.8);
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

@media (max-width: 767.98px) {
  .theater-stage-container {
    min-height: 290px;
  }

  .system-app-layout {
    min-height: 270px;
  }

  .sim-page-viewport {
    min-height: 240px;
    padding: 0.65rem !important;
  }

  .theater-topbar {
    padding: 0.5rem 0.75rem !important;
  }

  .video-inner-tabs-strip {
    padding: 0.4rem 0.5rem !important;
  }

  .video-inner-tab-pill {
    padding: 0.3rem 0.6rem !important;
    font-size: 0.78rem;
  }

  .subtitles-narration-bar {
    min-height: 42px;
    padding: 0.4rem 0.65rem !important;
  }

  .video-controls-bar {
    padding: 0.5rem 0.65rem !important;
  }

  .btn-play-pause {
    padding: 0.3rem 0.6rem !important;
    font-size: 0.8rem;
  }
}

@media (max-width: 575.98px) {
  .stat-card {
    padding: 0.5rem !important;

    h5 {
      font-size: 1rem;
    }

    .extra-small {
      font-size: 0.65rem;
    }
  }
}
</style>
