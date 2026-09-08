<template>
  <div
    class="assistant-permissions-guide"
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
            <div class="guide-header-icon bg-light-info text-info p-2 rounded mr-2 ml-2 shadow-xs">
              <feather-icon
                icon="UserCheckIcon"
                size="26"
              />
            </div>
            <div>
              <div class="d-flex align-items-center flex-wrap">
                <h4 class="font-weight-bolder text-dark mb-0 mr-2 ml-2">
                  {{ isRtl ? 'دليل وصلاحيات المساعدة وفريق الاستقبال' : 'Assistant & Reception Permissions Guide' }}
                </h4>
                <b-badge
                  variant="light-info"
                  class="font-weight-bold"
                >
                  {{ isRtl ? `القسم ${currentTabIndex + 1} من ${tabs.length}` : `Step ${currentTabIndex + 1} of ${tabs.length}` }}
                </b-badge>
              </div>
              <p class="text-muted small mb-0 mt-25">
                {{ isRtl ? 'دليل تفاعلي شامل يشرح مهام الاستقبال، إدارة المرضى، الحجوزات، طابور الانتظار، والصلاحيات الممنوحة.' : 'Interactive guide covering reception duties, patient care, appointment queues, cashier operations, and role boundaries.' }}
              </p>
            </div>
          </div>

          <!-- Progress Bar & Status -->
          <div class="header-progress-box min-w-250">
            <div class="d-flex justify-content-between align-items-center mb-50">
              <span class="extra-small font-weight-bold text-muted">{{ isRtl ? 'نسبة استعراض الصلاحيات' : 'Guide Progress' }}</span>
              <span class="extra-small font-weight-bold text-info">{{ Math.round(progressPercent) }}%</span>
            </div>
            <b-progress
              :value="progressPercent"
              variant="info"
              height="8px"
              class="rounded-pill shadow-xs"
            />
          </div>
        </div>

        <!-- HORIZONTAL TABS STRIP -->
        <div class="assistant-system-tabs-nav mt-3 pt-2 border-top">
          <div class="d-flex align-items-center overflow-auto pb-1 assistant-tabs-scroll">
            <b-button
              v-for="(tab, idx) in tabs"
              :key="tab.key"
              size="sm"
              :variant="currentTabIndex === idx ? 'info' : 'outline-secondary'"
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
                icon="ShieldIcon"
                size="16"
                class="text-info mr-1 ml-1"
              />
              {{ isRtl ? 'أقسام وصلاحيات المساعدة' : 'Assistant Modules & Roles' }}
            </span>
            <span class="badge badge-light-info extra-small font-weight-bold">10 {{ isRtl ? 'أقسام' : 'Tabs' }}</span>
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
                'active bg-info text-white shadow-sm': currentTabIndex === idx,
                'completed bg-light-success text-success': completedTabs.includes(idx) && currentTabIndex !== idx,
                'bg-white text-dark border': currentTabIndex !== idx && !completedTabs.includes(idx)
              }"
              @click="goToTab(idx)"
            >
              <div class="d-flex align-items-center overflow-hidden">
                <div
                  class="step-number-circle mr-2 ml-2 flex-shrink-0 font-weight-bold"
                  :class="currentTabIndex === idx ? 'bg-white text-info' : (completedTabs.includes(idx) ? 'bg-success text-white' : 'bg-light text-muted')"
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
              💡 {{ isRtl ? 'يمكنك الرجوع لهذا الدليل لمراجعة صلاحياتك وحدود الوصول في أي وقت.' : 'You can reference this guide anytime to verify your permissions.' }}
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
                  variant="light-info"
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
                  variant="outline-info"
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
            <div class="p-2 bg-light-info rounded border border-info mb-3">
              <div class="d-flex align-items-center mb-1">
                <feather-icon
                  icon="KeyIcon"
                  size="16"
                  class="text-info mr-1 ml-1"
                />
                <span class="small font-weight-bold text-dark">
                  {{ isRtl ? 'الصلاحيات الممنوحة في هذا القسم:' : 'Granted Permissions in this Module:' }}
                  <code class="text-info ml-50 mr-50">{{ currentTab.permissionCodes }}</code>
                </span>
              </div>
              <div class="d-flex align-items-start mb-1">
                <feather-icon
                  icon="CheckCircleIcon"
                  size="16"
                  class="text-info mr-1 ml-1 flex-shrink-0 mt-25"
                />
                <span class="small text-dark font-weight-600">{{ currentTab.p1 }}</span>
              </div>
              <div class="d-flex align-items-start mb-0">
                <feather-icon
                  icon="CheckCircleIcon"
                  size="16"
                  class="text-info mr-1 ml-1 flex-shrink-0 mt-25"
                />
                <span class="small text-dark font-weight-600">{{ currentTab.p2 }}</span>
              </div>
            </div>

            <!-- Permission Boundary Alert -->
            <div
              v-if="currentTab.boundary"
              class="p-2 bg-light-danger rounded border border-danger mb-3 d-flex align-items-start"
            >
              <feather-icon
                icon="LockIcon"
                size="16"
                class="text-danger mr-1 ml-1 flex-shrink-0 mt-25"
              />
              <span class="small text-danger font-weight-bold">
                <strong>{{ isRtl ? 'الحدود الأمنية: ' : 'Security Boundary: ' }}</strong>
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
                    {{ currentTab.routePath || '/assistant/permissions' }} — {{ currentTab.title }}
                  </span>
                </div>
                <span class="badge badge-light-success extra-small font-weight-bold">
                  {{ isRtl ? 'معاينة شاشة المساعدة' : 'Assistant Screen Preview' }}
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
                        {{ isRtl ? 'مرحباً بكِ، سارة (فريق الاستقبال)' : 'Welcome, Sara (Receptionist)' }}
                      </h5>
                      <small class="text-muted">{{ isRtl ? 'وردية اليوم — العيادة تعمل بانتظام' : 'Today Shift — Clinic is Active' }}</small>
                    </div>
                    <div class="badge badge-light-success p-1 font-weight-bold mt-1 mt-sm-0">
                      ● {{ isRtl ? 'النظام متصل ومستعد' : 'System Connected' }}
                    </div>
                  </div>

                  <!-- Active Doctor Call Alert Banner Mockup -->
                  <div class="p-2 bg-light-danger border border-danger rounded mb-2 d-flex justify-content-between align-items-center flex-wrap">
                    <div class="d-flex align-items-center mb-1 mb-sm-0">
                      <div class="avatar bg-danger p-50 mr-1 ml-1 text-white rounded-circle">
                        <feather-icon
                          icon="BellIcon"
                          size="18"
                        />
                      </div>
                      <div>
                        <strong class="text-danger font-weight-bold d-block">
                          {{ isRtl ? 'جرس استدعاء: د. محمد خالد (غرفة الكشف 1)' : 'Doctor Call: Dr. Mohamed Khaled (Room 1)' }}
                        </strong>
                        <small class="text-muted">{{ isRtl ? 'منذ دقيقة واحدة — يرجى التوجه لغرفة الكشف' : '1 min ago — Please report to examination room' }}</small>
                      </div>
                    </div>
                    <b-button
                      variant="danger"
                      size="sm"
                      class="font-weight-bold"
                    >
                      ✓ {{ isRtl ? 'تأكيد الحضور (إيقاف الرنين)' : 'Acknowledge Call' }}
                    </b-button>
                  </div>

                  <!-- KPI Metric Cards -->
                  <b-row class="mb-2">
                    <b-col
                      cols="6"
                      md="3"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <feather-icon
                          icon="CalendarIcon"
                          size="18"
                          class="text-info mb-50"
                        />
                        <h4 class="font-weight-bolder text-dark mb-0">
                          18
                        </h4>
                        <small class="text-muted font-weight-bold">{{ isRtl ? 'حجوزات اليوم' : 'Today Visits' }}</small>
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
                          4
                        </h4>
                        <small class="text-muted font-weight-bold">{{ isRtl ? 'في الانتظار' : 'Waiting Room' }}</small>
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
                          12
                        </h4>
                        <small class="text-muted font-weight-bold">{{ isRtl ? 'تم الكشف' : 'Completed' }}</small>
                      </div>
                    </b-col>
                    <b-col
                      cols="6"
                      md="3"
                    >
                      <div class="p-2 bg-white rounded border text-center shadow-xs">
                        <feather-icon
                          icon="DollarSignIcon"
                          size="18"
                          class="text-primary mb-50"
                        />
                        <h4 class="font-weight-bolder text-primary mb-0">
                          3,600
                        </h4>
                        <small class="text-muted font-weight-bold">{{ isRtl ? 'الخزينة (ج.م)' : 'Cash Drawer' }}</small>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <!-- 2. CLIENTS -->
                <div
                  v-else-if="currentTab.key === 'clients'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center flex-wrap">
                    <div class="d-flex align-items-center">
                      <feather-icon
                        icon="SearchIcon"
                        size="16"
                        class="text-muted mr-1 ml-1"
                      />
                      <span class="small text-muted font-weight-bold">{{ isRtl ? 'بحث بالاسم: "أحمد محمود"' : 'Search: "Ahmed Mahmoud"' }}</span>
                    </div>
                    <b-button
                      variant="info"
                      size="sm"
                      class="font-weight-bold"
                    >
                      + {{ isRtl ? 'تسجيل مريض جديد' : 'New Patient' }}
                    </b-button>
                  </div>
                  <div class="bg-white rounded border p-2">
                    <div class="table-responsive">
                      <table class="table table-sm mb-0 extra-small">
                        <thead class="thead-light">
                          <tr>
                            <th>{{ isRtl ? 'المريض' : 'Patient' }}</th>
                            <th>{{ isRtl ? 'رقم الهاتف والواتساب' : 'Phone & WhatsApp' }}</th>
                            <th>{{ isRtl ? 'تاريخ الميلاد' : 'Birth Date' }}</th>
                            <th>{{ isRtl ? 'العمر' : 'Age' }}</th>
                            <th>{{ isRtl ? 'فصيلة الدم' : 'Blood' }}</th>
                            <th>{{ isRtl ? 'إجراءات الاستقبال' : 'Actions' }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="font-weight-bold text-dark">
                              أحمد محمود حسن
                            </td>
                            <td><span class="badge badge-light-success">WhatsApp: 01012345678</span></td>
                            <td>15 May 1990</td>
                            <td>36 {{ isRtl ? 'سنة' : 'yrs' }}</td>
                            <td><span class="badge badge-light-danger">A+</span></td>
                            <td>
                              <span class="badge badge-info mr-50 ml-50 pointer">حجز موعد</span>
                              <span class="badge badge-light-secondary pointer">تعديل</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-dark">
                              مريم إبراهيم العوضي
                            </td>
                            <td><span class="badge badge-light-success">WhatsApp: 01198765432</span></td>
                            <td>20 Oct 1998</td>
                            <td>28 {{ isRtl ? 'سنة' : 'yrs' }}</td>
                            <td><span class="badge badge-light-danger">O+</span></td>
                            <td>
                              <span class="badge badge-info mr-50 ml-50 pointer">حجز موعد</span>
                              <span class="badge badge-light-secondary pointer">تعديل</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- 3. RESERVATIONS -->
                <div
                  v-else-if="currentTab.key === 'reservations'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center flex-wrap">
                    <div class="d-flex align-items-center flex-wrap">
                      <span class="badge badge-info mr-1 ml-1 p-50 font-weight-bold">2026-09-09</span>
                      <span class="small font-weight-bold text-dark">{{ isRtl ? 'الطبيب: د. محمد خالد' : 'Doctor: Dr. Mohamed' }}</span>
                    </div>
                    <b-button
                      variant="info"
                      size="sm"
                      class="font-weight-bold"
                    >
                      + {{ isRtl ? 'حجز موعد جديد' : 'New Reservation' }}
                    </b-button>
                  </div>
                  <div class="bg-white rounded border p-2">
                    <div class="table-responsive">
                      <table class="table table-sm mb-0 extra-small">
                        <thead class="thead-light">
                          <tr>
                            <th>{{ isRtl ? 'الوقت' : 'Time' }}</th>
                            <th>{{ isRtl ? 'المريض' : 'Patient' }}</th>
                            <th>{{ isRtl ? 'الطبيب' : 'Doctor' }}</th>
                            <th>{{ isRtl ? 'المبلغ والمدفوع' : 'Fee / Paid' }}</th>
                            <th>{{ isRtl ? 'الحالة' : 'Status' }}</th>
                            <th>{{ isRtl ? 'إجراء المساعدة' : 'Action' }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="font-weight-bold text-info">
                              10:00 AM
                            </td>
                            <td class="font-weight-bold text-dark">
                              كريم السيد طه
                            </td>
                            <td>د. محمد خالد</td>
                            <td>300 ج.م / <span class="text-success font-weight-bold">مدفوع 300</span></td>
                            <td><span class="badge badge-light-success">مؤكد</span></td>
                            <td>
                              <span class="badge badge-warning text-dark font-weight-bold pointer">تسجيل الوصول ✓</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="font-weight-bold text-info">
                              10:30 AM
                            </td>
                            <td class="font-weight-bold text-dark">
                              هدى عبد العزيز
                            </td>
                            <td>د. محمد خالد</td>
                            <td>300 ج.م / <span class="text-danger font-weight-bold">متبقي 300</span></td>
                            <td><span class="badge badge-light-warning">بانتظار التأكيد</span></td>
                            <td>
                              <span class="badge badge-info pointer">تأكيد هاتفياً 📞</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- 4. ONLINE RESERVATIONS -->
                <div
                  v-else-if="currentTab.key === 'online_reservations'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="text-dark small d-block font-weight-bold">{{ isRtl ? 'طلبات الحجز عبر بوابة المرضى الإلكترونية' : 'Patient Portal Online Requests' }}</strong>
                      <span class="extra-small text-muted">{{ isRtl ? 'حجوزات واردة من رابط العيادة المخصص' : 'Reservations booked via custom web link' }}</span>
                    </div>
                    <span class="badge badge-light-primary">3 {{ isRtl ? 'طلبات جديدة' : 'New Requests' }}</span>
                  </div>
                  <div class="p-2 bg-white rounded border mb-1 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <span class="badge badge-light-info mr-1 ml-1">أونلاين</span>
                      <strong class="text-dark font-weight-bold">سارة عبد الرحمن</strong>
                      <span class="extra-small text-muted mr-2 ml-2">اليوم — 02:30 PM (د. محمد خالد)</span>
                    </div>
                    <div class="mt-1 mt-sm-0">
                      <b-button
                        variant="outline-success"
                        size="sm"
                        class="mr-50 ml-50 font-weight-bold"
                      >
                        واتساب
                      </b-button>
                      <b-button
                        variant="info"
                        size="sm"
                        class="font-weight-bold"
                      >
                        ✓ اعتماد الحجز
                      </b-button>
                    </div>
                  </div>
                </div>

                <!-- 5. WAITING QUEUE -->
                <div
                  v-else-if="currentTab.key === 'waiting_queue'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <strong class="text-dark font-weight-bold">{{ isRtl ? 'شاشة طابور الانتظار (صالة الاستقبال)' : 'Waiting Lobby Queue Board' }}</strong>
                      <span class="extra-small text-muted d-block">{{ isRtl ? 'يتم تسجيل الدور بنقرة واحدة عند حضور المريض للعيادة' : 'Check-in patients on arrival to assign live tokens' }}</span>
                    </div>
                    <b-badge
                      variant="light-warning"
                      class="p-1 font-weight-bold"
                    >
                      {{ isRtl ? '4 مرضى في صالة الانتظار' : '4 Patients Waiting' }}
                    </b-badge>
                  </div>
                  <b-row>
                    <b-col
                      cols="12"
                      md="4"
                      class="mb-1"
                    >
                      <div class="p-2 bg-white rounded border border-warning shadow-xs">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="badge badge-warning font-weight-bolder p-1 text-dark token-badge">#01</span>
                          <span class="badge badge-light-success extra-small">في الانتظار (منذ 15 د)</span>
                        </div>
                        <h6 class="font-weight-bolder text-dark mb-25">
                          كريم السيد طه
                        </h6>
                        <small class="text-muted d-block mb-1">د. محمد خالد — كشف باطنة</small>
                        <b-button
                          variant="outline-info"
                          block
                          size="sm"
                          class="font-weight-bold"
                        >
                          دخول لغرفة الكشف ➔
                        </b-button>
                      </div>
                    </b-col>
                    <b-col
                      cols="12"
                      md="4"
                      class="mb-1"
                    >
                      <div class="p-2 bg-white rounded border shadow-xs">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="badge badge-secondary font-weight-bolder p-1 text-white token-badge">#02</span>
                          <span class="badge badge-light-info extra-small">في الانتظار (منذ 5 د)</span>
                        </div>
                        <h6 class="font-weight-bolder text-dark mb-25">
                          سامح نبيل فوزي
                        </h6>
                        <small class="text-muted d-block mb-1">د. محمد خالد — استشارة</small>
                        <b-button
                          variant="outline-secondary"
                          block
                          size="sm"
                          disabled
                        >
                          التالي في الدور
                        </b-button>
                      </div>
                    </b-col>
                    <b-col
                      cols="12"
                      md="4"
                      class="mb-1"
                    >
                      <div class="p-2 bg-white rounded border shadow-xs">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="badge badge-secondary font-weight-bolder p-1 text-white token-badge">#03</span>
                          <span class="badge badge-light-secondary extra-small">وصل حديثاً</span>
                        </div>
                        <h6 class="font-weight-bolder text-dark mb-25">
                          منى مصطفى كمال
                        </h6>
                        <small class="text-muted d-block mb-1">د. شريف حسن (طبيب مساعد)</small>
                        <b-button
                          variant="outline-secondary"
                          block
                          size="sm"
                          disabled
                        >
                          في الانتظار
                        </b-button>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <!-- 6. FINANCIALS -->
                <div
                  v-else-if="currentTab.key === 'financials'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <strong class="text-dark font-weight-bold">{{ isRtl ? 'تحصيل الفواتير وإيصالات الاستقبال' : 'Billing & Reception Invoicing' }}</strong>
                      <span class="extra-small text-muted d-block">{{ isRtl ? 'إصدار فواتير الزيارات وطباعة إيصال الدفع الحراري 80mm' : 'Issue visit invoices and print thermal 80mm receipts' }}</span>
                    </div>
                    <span class="badge badge-success p-1 font-weight-bold">{{ isRtl ? 'خزينة الاستقبال: متطابقة' : 'Cash Drawer: Balanced' }}</span>
                  </div>
                  <b-row>
                    <b-col
                      cols="12"
                      md="7"
                    >
                      <div class="bg-white rounded border p-2 mb-1">
                        <div class="d-flex justify-content-between border-bottom pb-1 mb-1">
                          <span class="small font-weight-bold">فاتورة كشف #INV-2026-089</span>
                          <span class="badge badge-light-success font-weight-bold">مدفوع بالكامل</span>
                        </div>
                        <div class="d-flex justify-content-between small mb-50">
                          <span class="text-muted">المريض:</span>
                          <span class="font-weight-bold">أحمد محمود حسن</span>
                        </div>
                        <div class="d-flex justify-content-between small mb-50">
                          <span class="text-muted">رسوم الكشف:</span>
                          <span class="font-weight-bold">300 ج.م</span>
                        </div>
                        <div class="d-flex justify-content-between small mb-50">
                          <span class="text-muted">طريقة الدفع:</span>
                          <span class="badge badge-light-primary">نقداً (Cash)</span>
                        </div>
                        <div class="d-flex justify-content-between font-weight-bold text-dark border-top pt-1 mt-1">
                          <span>الإجمالي المدفوع:</span>
                          <span class="text-success h6 mb-0 font-weight-bolder">300.00 ج.م</span>
                        </div>
                      </div>
                    </b-col>
                    <b-col
                      cols="12"
                      md="5"
                    >
                      <div class="p-2 bg-white rounded border text-center">
                        <feather-icon
                          icon="PrinterIcon"
                          size="24"
                          class="text-info mb-1"
                        />
                        <h6 class="font-weight-bold text-dark mb-1">
                          {{ isRtl ? 'طباعة إيصال المريض' : 'Print Patient Receipt' }}
                        </h6>
                        <b-button
                          variant="info"
                          size="sm"
                          block
                          class="font-weight-bold mb-50"
                        >
                          🖨️ {{ isRtl ? 'إيصال حراري (80mm)' : 'Thermal Receipt (80mm)' }}
                        </b-button>
                        <b-button
                          variant="outline-secondary"
                          size="sm"
                          block
                          class="font-weight-bold"
                        >
                          📄 {{ isRtl ? 'فاتورة A4 كاملة' : 'Full A4 Invoice' }}
                        </b-button>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <!-- 7. TRANSACTIONS -->
                <div
                  v-else-if="currentTab.key === 'transactions'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2">
                    <strong class="text-dark font-weight-bold small d-block">{{ isRtl ? 'سجل مدفوعات وردية اليوم' : 'Daily Shift Payment Transactions' }}</strong>
                    <span class="extra-small text-muted">{{ isRtl ? 'كل معاملة مسجلة بوقتها والمريض وطريقة الدفع' : 'Each transaction logged with timestamp, patient, and payment method' }}</span>
                  </div>
                  <div class="bg-white rounded border p-2">
                    <table class="table table-sm mb-0 extra-small">
                      <thead class="thead-light">
                        <tr>
                          <th>{{ isRtl ? 'رقم الإيصال' : 'Receipt #' }}</th>
                          <th>{{ isRtl ? 'الوقت' : 'Time' }}</th>
                          <th>{{ isRtl ? 'المريض' : 'Patient' }}</th>
                          <th>{{ isRtl ? 'طريقة الدفع' : 'Method' }}</th>
                          <th>{{ isRtl ? 'المبلغ' : 'Amount' }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="font-weight-bold text-info">
                            #TX-1042
                          </td>
                          <td>10:15 AM</td>
                          <td class="font-weight-bold">
                            كريم السيد طه
                          </td>
                          <td><span class="badge badge-light-primary">نقداً</span></td>
                          <td class="font-weight-bold text-success">
                            300 ج.م
                          </td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-info">
                            #TX-1041
                          </td>
                          <td>09:45 AM</td>
                          <td class="font-weight-bold">
                            هدى عبد العزيز
                          </td>
                          <td><span class="badge badge-light-info">فيزا (POS)</span></td>
                          <td class="font-weight-bold text-success">
                            450 ج.م
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- 8. PURCHASES -->
                <div
                  v-else-if="currentTab.key === 'purchases'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-2 bg-white rounded border mb-2 d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="text-dark font-weight-bold small d-block">{{ isRtl ? 'مصروفات ومشتريات العيادة التشغيلية' : 'Clinic Operational Purchases & Expenses' }}</strong>
                      <span class="extra-small text-muted">{{ isRtl ? 'تسجيل فواتير المستلزمات الطبية والضيافة والمنظفات' : 'Log medical disposables, sanitation, and hospitality supplies' }}</span>
                    </div>
                    <b-button
                      variant="info"
                      size="sm"
                      class="font-weight-bold"
                    >
                      + {{ isRtl ? 'تسجيل مصروف' : 'Add Expense' }}
                    </b-button>
                  </div>
                  <div class="bg-white rounded border p-2">
                    <table class="table table-sm mb-0 extra-small">
                      <thead class="thead-light">
                        <tr>
                          <th>{{ isRtl ? 'البند' : 'Item' }}</th>
                          <th>{{ isRtl ? 'التصنيف' : 'Category' }}</th>
                          <th>{{ isRtl ? 'المورد / المحل' : 'Supplier' }}</th>
                          <th>{{ isRtl ? 'المبلغ' : 'Amount' }}</th>
                          <th>{{ isRtl ? 'الفاتورة' : 'Receipt' }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="font-weight-bold">
                            شاش وقفازات طبية معقمة
                          </td>
                          <td><span class="badge badge-light-info">مستلزمات طبية</span></td>
                          <td>شركة النور للمستلزمات</td>
                          <td class="font-weight-bold text-danger">
                            280 ج.م
                          </td>
                          <td><span class="badge badge-light-success">مرفقة 📎</span></td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold">
                            مناديل ومطهرات صالة الانتظار
                          </td>
                          <td><span class="badge badge-light-secondary">نظافة وضيافة</span></td>
                          <td>هايبر وان</td>
                          <td class="font-weight-bold text-danger">
                            120 ج.م
                          </td>
                          <td><span class="badge badge-light-success">مرفقة 📎</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- 9. ASSISTANT CALLS -->
                <div
                  v-else-if="currentTab.key === 'assistant_calls'"
                  class="screen-view animated fadeIn"
                >
                  <div class="p-3 bg-white rounded border text-center">
                    <div class="avatar bg-light-danger p-2 rounded-circle mb-1 d-inline-flex">
                      <feather-icon
                        icon="PhoneCallIcon"
                        size="32"
                        class="text-danger"
                      />
                    </div>
                    <h5 class="font-weight-bolder text-dark mb-50">
                      {{ isRtl ? 'نظام استدعاء الأطباء المباشر' : 'Instant Doctor Call Bell System' }}
                    </h5>
                    <p class="small text-muted max-w-500 mx-auto mb-2">
                      {{ isRtl ? 'تنبيه فوري بالصوت والشاشة عند حاجة أي طبيب في غرفة الكشف للمساعدة في فحص، تثبيت مريض، أو تحضير أداة طبية.' : 'Acoustic chime and visual alert whenever a doctor in any exam room requests assistance.' }}
                    </p>
                    <div class="p-2 bg-light rounded border max-w-400 mx-auto text-left mb-2">
                      <div class="d-flex align-items-center justify-content-between mb-1">
                        <span class="font-weight-bold small text-dark">د. محمد خالد — غرفة 1</span>
                        <span class="badge badge-danger">طلب عاجل 🔔</span>
                      </div>
                      <small class="text-muted d-block mb-1">{{ isRtl ? 'مطلوب مساعدة في تحضير جهاز الموجات الصوتية' : 'Assistance requested for ultrasound preparation' }}</small>
                      <b-button
                        variant="success"
                        block
                        size="sm"
                        class="font-weight-bold"
                      >
                        ✓ {{ isRtl ? 'تأكيد التوجه للغرفة (إيقاف الرنين)' : 'Acknowledge & Report to Room' }}
                      </b-button>
                    </div>
                  </div>
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
                            {{ isRtl ? 'الصلاحيات الممنوحة للمساعدة' : 'Granted Assistant Permissions' }}
                          </h6>
                        </div>
                        <ul class="extra-small pl-1 pr-1 mb-0 text-dark">
                          <li class="mb-50">
                            <strong>إدارة المرضى:</strong> بحث، تسجيل ملف جديد، وتعديل بيانات الاتصال.
                          </li>
                          <li class="mb-50">
                            <strong>الحجوزات:</strong> حجز المواعيد لكافة أطباء العيادة، وتأكيد الحجز.
                          </li>
                          <li class="mb-50">
                            <strong>صالة الانتظار:</strong> تسجيل وصول المرضى وترتيب أدوار الطابور (#1، #2...).
                          </li>
                          <li class="mb-50">
                            <strong>الخزينة والماليات:</strong> تحصيل الرسوم، إصدار الفواتير، وطباعة الإيصال الحراري.
                          </li>
                          <li class="mb-50">
                            <strong>المصروفات:</strong> تسجيل فواتير المستلزمات والضيافة اليومية.
                          </li>
                          <li class="mb-0">
                            <strong>جرس الاستدعاء:</strong> استقبال رنين وتنبيهات الأطباء وتأكيد الحضور.
                          </li>
                        </ul>
                      </div>
                    </b-col>
                    <b-col
                      cols="12"
                      md="6"
                      class="mb-2"
                    >
                      <div class="p-2 bg-white rounded border border-danger h-100 shadow-xs">
                        <div class="d-flex align-items-center mb-1">
                          <span class="badge badge-danger p-50 mr-1 ml-1">✕</span>
                          <h6 class="font-weight-bolder text-danger mb-0">
                            {{ isRtl ? 'القيود والحدود الأمنية' : 'Restricted Security Boundaries' }}
                          </h6>
                        </div>
                        <ul class="extra-small pl-1 pr-1 mb-0 text-dark">
                          <li class="mb-50">
                            <strong>الملف الطبي والتشخيص:</strong> لا يمكن كتابة أو تعديل التشخيص والعلاج الطبي.
                          </li>
                          <li class="mb-50">
                            <strong>الروشتات الطبية:</strong> كتابة ووصف الأدوية حصري للأطباء المرخصين فقط.
                          </li>
                          <li class="mb-50">
                            <strong>إكمال الكشف:</strong> زر إكمال الكشف مخصص للطبيب المعالج بعد فحص المريض.
                          </li>
                          <li class="mb-50">
                            <strong>حذف الحسابات المالية:</strong> لا يمكن للمساعدة حذف قيود الفواتير أو الحركات المالية السابقة.
                          </li>
                          <li class="mb-0">
                            <strong>إدارة الفريق والباقة:</strong> صلاحيات المشرف وتعديل أطباء العيادة محجوبة عن الاستقبال.
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
                    class="mr-50 ml-50 text-info"
                  />
                  {{ currentTab.caption }}
                </span>
                <span class="badge badge-light-secondary extra-small font-weight-bold">
                  {{ isRtl ? 'دور المساعدة' : 'Assistant Role' }}
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
              variant="info"
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
  name: 'AssistantPermissionsGuide',
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
            title: 'لوحة الاستقبال والمؤشرات الحية',
            badge: 'مهام الاستقبال',
            permissionCodes: 'assistant.view-dashboard',
            routeName: 'assistant-dashboard',
            routePath: '/assistant/dashboard',
            desc: 'مركز متابعة العيادة لموظفي الاستقبال، يوفر إحصائيات فورية للمرضى، طابور الانتظار، واستقبال رنين الأطباء.',
            p1: 'عدادات حية: استعراض إجمالي مواعيد اليوم، المرضى في صالة الانتظار، والكشوفات المنتهية.',
            p2: 'تنبيهات الاستدعاء: استقبال رنين واستدعاءات الأطباء من غرف الكشف ببيان اسم الطبيب والغرفة.',
            boundary: 'لا يمكن للمساعدة الاطلاع على الملاحظات والتقارير الطبية الخاصة والسرية للطبيب.',
            caption: 'لوحة الاستقبال — مركز العمليات اليومي لمتابعة تدفق المرضى ورنين الأطباء.',
          },
          {
            key: 'clients',
            icon: 'UsersIcon',
            title: 'إدارة وسجلات المرضى',
            badge: 'صلاحية المرضى',
            permissionCodes: 'assistant.view-clients, assistant.create-clients, assistant.edit-clients',
            routeName: 'assistant-clients',
            routePath: '/assistant/clients',
            desc: 'سجل إلكتروني للبحث وتسجيل وتعديل بيانات المرضى والتواصل السريع عبر الواتساب.',
            p1: 'البحث والتسجيل: البحث السريع برقم الهاتف أو الاسم، وتسجيل ملف جديد فوري مع مفتاح الدولة.',
            p2: 'بيانات التواصل: تسجيل رقم الواتساب لإرسال رسائل التذكير والمتابعة الآلية للمريض.',
            boundary: 'لا تملك المساعدة صلاحية تعديل السجل الطبي أو مسح الملفات السريرية المرفقة من الطبيب.',
            caption: 'سجل المرضى — تسجيل ومراجعة بيانات الاتصال وتاريخ الميلاد وفصيلة الدم.',
          },
          {
            key: 'reservations',
            icon: 'CalendarIcon',
            title: 'حجز المواعيد وتأكيد الجداول',
            badge: 'صلاحية الحجوزات',
            permissionCodes: 'assistant.view-reservations, assistant.create-reservations, assistant.confirm-reservations',
            routeName: 'assistant-reservations',
            routePath: '/assistant/reservations',
            desc: 'تقويم شامل لحجز مواعيد المرضى لدى أطباء العيادة وإرسال رسائل التأكيد هاتفياً أو بالواتساب.',
            p1: 'حجز المواعيد: اختيار المريض، الطبيب المعالج، والتاريخ والأوقات الشاغرة وفق جدول العمل.',
            p2: 'تأكيد الحجز: تحديث حالة الحجز إلى "مؤكد" وتسجيل مبالغ العربون أو الرسوم المسددة مقدماً.',
            boundary: 'زر إكمال الكشف والتشخيص الطبي محجوب عن المساعدة ومخصص للطبيب بعد الفحص.',
            caption: 'جدول الحجوزات — تنظيم مواعيد المرضى لدى أطباء العيادة وتأكيد المواعيد مسبقاً.',
          },
          {
            key: 'online_reservations',
            icon: 'GlobeIcon',
            title: 'طلبات الحجز الإلكتروني والموقع',
            badge: 'الحجز الأونلاين',
            permissionCodes: 'assistant.view-reservations',
            routeName: 'assistant-online-reservations',
            routePath: '/assistant/online-reservations',
            desc: 'استقبال وفحص طلبات الحجز الواردة من المرضى عبر رابط حجز العيادة الإلكتروني.',
            p1: 'مراجعة الطلبات: استعراض تفاصيل حجز المريض والوقت المطلوب والبيانات المسجلة.',
            p2: 'الاعتماد والتواصل: التواصل مع المريض بنقرة واحدة عبر الواتساب لتأكيد الموعد وإدراجه بالجدول.',
            boundary: 'يجب التأكد من مطابقة وقت الحجز الأونلاين مع أوقات عمل الطبيب المتاحة قبل الاعتماد.',
            caption: 'الحجز الأونلاين — فلترة ومراجعة واعتماد طلبات حجز المرضى الواردة من الإنترنت.',
          },
          {
            key: 'waiting_queue',
            icon: 'ListIcon',
            title: 'صالة الانتظار وتسجيل الحضور',
            badge: 'إدارة الطابور',
            permissionCodes: 'assistant.view-waiting-queue, assistant.check-in-patients',
            routeName: 'assistant-waiting-queue',
            routePath: '/assistant/waiting-queue',
            desc: 'شاشة حية متزامنة لصالة الاستقبال تسجل وصول المرضى وتمنحهم أرقام أدوار تسلسلية.',
            p1: 'تسجيل الوصول (Check-in): بنقرة زر واحدة عند وصول المريض يتغير لونه ويأخذ رقم دور (#1، #2...).',
            p2: 'إشعار فوري للطبيب: ظهور المريض تلقائياً في شاشة الطبيب كـ "في الانتظار" لطلب دخوله للغرفة.',
            boundary: 'في حال تم تسجيل الوصول بالخطأ، يمكن للمساعدة إلغاء تسجيل الوصول فوراً من نفس الشاشة.',
            caption: 'طابور الانتظار — أرقام أدوار عادلة وشفافة وتنظيم دخول المرضى لغرف الكشف.',
          },
          {
            key: 'financials',
            icon: 'DollarSignIcon',
            title: 'الخزينة، الفواتير، وإيصالات الدفع',
            badge: 'الصلاحيات المالية',
            permissionCodes: 'assistant.view-financials, assistant.create-financials, assistant.edit-financials',
            routeName: 'assistant-financials',
            routePath: '/assistant/financials',
            desc: 'تحصيل رسوم الكشوفات والخدمات، إصدار الفواتير الرسمية، وطباعة الإيصال الحراري للمريض.',
            p1: 'إصدار الفواتير: إنشاء فاتورة للحجز، اختيار طريقة الدفع (نقداً، فيزا، محافظ إلكترونية).',
            p2: 'طباعة الإيصال الحراري: طباعة سريعة لإيصال الاستقبال (80mm) بشعار العيادة وتفاصيل المبلغ.',
            boundary: 'لا تملك المساعدة صلاحية حذف فواتير أو التلاعب في سجل القيود المحاسبية التاريخية.',
            caption: 'الخزينة والماليات — تحصيل دقيق للفواتير وطباعة إيصالات الدفع الحرارية للعملاء.',
          },
          {
            key: 'transactions',
            icon: 'CreditCardIcon',
            title: 'سجل المعاملات والمدفوعات اليومية',
            badge: 'تدقيق المدفوعات',
            permissionCodes: 'assistant.view-financials',
            routeName: 'assistant-transactions',
            routePath: '/assistant/transactions',
            desc: 'سجل تدقيق زمني يوثق كل دفعة، حركة استرداد، أو عربون تم تسجيله خلال وردية الاستقبال.',
            p1: 'توثيق العمليات: تسجيل رقم المعاملة واسم المريض ووقت الدفع بالدقيقة ورقم الإيصال.',
            p2: 'تقفيل الوردية: مطابقة المبالغ النقدية والمحصلة بالفيزا قبل تسليم الخزينة.',
            boundary: 'السجل للقراءة والتحصيل فقط ولا يمكن مسح أي حركة مالية مسجلة بالنظام.',
            caption: 'سجل المعاملات — مراجعة دقيقة لتدفقات الأموال المحصلة أثناء الوردية.',
          },
          {
            key: 'purchases',
            icon: 'ShoppingCartIcon',
            title: 'المشتريات ومصروفات الاستقبال',
            badge: 'تسجيل المصروفات',
            permissionCodes: 'assistant.view-purchases, assistant.create-purchases',
            routeName: 'assistant-purchases',
            routePath: '/assistant/purchases',
            desc: 'تسجيل نثريات ومشتريات العيادة اليومية (شاش، قفازات، مطهرات، ضيافة، وأدوات مكتبية).',
            p1: 'تسجيل المصروف: إدخال البند والمبلغ واسم المورد وتاريخ الشراء وخصمه من العهدة.',
            p2: 'إرفاق الفاتورة الورقية: تصوير أو إرفاق إيصال الشراء لضمان دقة الحسابات أمام الإدارة.',
            boundary: 'لا يمكن تسجيل مصروفات دون تحديد البند والمبلغ المالي المطابق للإيصال.',
            caption: 'المصروفات — توثيق مشتريات الاستقبال ومتابعة العهدة اليومية بمنتهى الشفافية.',
          },
          {
            key: 'assistant_calls',
            icon: 'PhoneCallIcon',
            title: 'جرس استدعاء الأطباء المباشر',
            badge: 'الاستدعاء الفوري',
            permissionCodes: 'assistant.view-assistant-calls, assistant.accept-assistant-calls',
            routeName: 'assistant-dashboard',
            routePath: '/assistant/dashboard',
            desc: 'نظام رنين صوتي ومرئي فوري يربط غرف الأطباء بالاستقبال لطلب المساعدة العاجلة.',
            p1: 'تنبيه فوري: ظهور إشعار باللون الأحمر مع نغمة رنين عند ضغط أي طبيب على زر الاستدعاء.',
            p2: 'تحديد الغرفة: يوضح الإشعار اسم الطبيب ورقم الغرفة المعنية بنقرة واحدة لإيقاف الرنين.',
            boundary: 'يجب على المساعدة إيقاف التنبيه فور التوجه للغرفة لضمان هدوء صالة الانتظار.',
            caption: 'جرس الاستدعاء — استجابة فورية لمتطلبات الأطباء داخل غرف الكشف.',
          },
          {
            key: 'permissions_matrix',
            icon: 'ShieldIcon',
            title: 'مصفوفة الصلاحيات والحدود الأمنية',
            badge: 'الصلاحيات والقيود',
            permissionCodes: 'role: assistant (Reception & Administrative Scope)',
            routeName: '',
            routePath: '/assistant/permissions',
            desc: 'ملخص شامل للحقوق والواجبات الممنوحة للمساعدة مقارنة بالصلاحيات المحفوظة للأطباء والإدارة.',
            p1: 'صلاحيات الاستقبال: إدارة المواعيد، تسجيل المرضى، تنظيم الطابور، تحصيل الرسوم، وطباعة الإيصالات.',
            p2: 'الحدود الأمنية: الحفاظ على سرية ملفات المرضى، الامتناع عن التدخل بالتشخيص أو كتابة الأدوية.',
            boundary: 'أي صلاحية غير مفعلة في حسابك يمكن لطبيب العيادة أو المشرف ضبطها من إدارة الصلاحيات.',
            caption: 'مصفوفة الصلاحيات — فصل كامل بين مهام الاستقبال والاستقلالية الطبية للأطباء.',
          },
        ]
      }

      // English Tabs
      return [
        {
          key: 'dashboard',
          icon: 'HomeIcon',
          title: 'Reception Dashboard & Live Metrics',
          badge: 'Reception Tasks',
          permissionCodes: 'assistant.view-dashboard',
          routeName: 'assistant-dashboard',
          routePath: '/assistant/dashboard',
          desc: 'Central control room for receptionists: live patient counters, waiting queue status, and real-time doctor call alerts.',
          p1: 'Live KPIs: Real-time counters for today visits, patients in lobby waiting, and completed consultations.',
          p2: 'Doctor Call Alerts: Acoustic chimes and visual pop-up banners identifying which doctor and exam room needs support.',
          boundary: 'Assistant cannot access private clinical diagnosis notes or system administration panels.',
          caption: 'Dashboard — Daily reception command center for monitoring clinic flow and doctor alerts.',
        },
        {
          key: 'clients',
          icon: 'UsersIcon',
          title: 'Patient Records & Contact Info',
          badge: 'Patient Permissions',
          permissionCodes: 'assistant.view-clients, assistant.create-clients, assistant.edit-clients',
          routeName: 'assistant-clients',
          routePath: '/assistant/clients',
          desc: 'Search, register, and update patient demographics, blood type, birth date, and WhatsApp numbers.',
          p1: 'Search & Registration: Quick search by phone or name, and fast patient onboarding with country dial codes.',
          p2: 'WhatsApp Reminders: Record validated WhatsApp numbers for automated visit reminders and follow-ups.',
          boundary: 'Assistant cannot edit or delete medical history files or physician diagnostic attachments.',
          caption: 'Patients — Demographic directory, verified contact details, age, and chronic condition tags.',
        },
        {
          key: 'reservations',
          icon: 'CalendarIcon',
          title: 'Appointment Booking & Calendar Slots',
          badge: 'Reservation Permissions',
          permissionCodes: 'assistant.view-reservations, assistant.create-reservations, assistant.confirm-reservations',
          routeName: 'assistant-reservations',
          routePath: '/assistant/reservations',
          desc: 'Comprehensive clinic appointment scheduler across all doctors and available working hour slots.',
          p1: 'Booking: Select client, attending doctor, date, and open time slots according to clinic calendar.',
          p2: 'Confirmation: Confirm reservations via phone/WhatsApp and record deposit or full payment.',
          boundary: 'Visit completion and diagnostic findings are strictly restricted to the attending physician.',
          caption: 'Reservations — Coordinate appointment schedules and manage phone confirmations.',
        },
        {
          key: 'online_reservations',
          icon: 'GlobeIcon',
          title: 'Online Bookings & Portal Requests',
          badge: 'Online Requests',
          permissionCodes: 'assistant.view-reservations',
          routeName: 'assistant-online-reservations',
          routePath: '/assistant/online-reservations',
          desc: 'Screen and approve incoming appointment requests submitted by patients via clinic web booking portal.',
          p1: 'Review Requests: Check patient details, requested time slot, and clinic slot availability.',
          p2: 'Approve & Sync: One-click WhatsApp contact to confirm and sync directly into doctor schedule.',
          boundary: 'Always confirm slot compatibility before approving online appointment requests.',
          caption: 'Online Bookings — Review and confirm appointments submitted from the web portal.',
        },
        {
          key: 'waiting_queue',
          icon: 'ListIcon',
          title: 'Waiting Lobby Queue & Patient Check-in',
          badge: 'Queue Management',
          permissionCodes: 'assistant.view-waiting-queue, assistant.check-in-patients',
          routeName: 'assistant-waiting-queue',
          routePath: '/assistant/waiting-queue',
          desc: 'Real-time synchronized waiting room board: register patient arrivals and assign fair sequential turn tokens.',
          p1: 'Check In: One-click arrival check-in automatically assigns token numbers (#01, #02, #03...).',
          p2: 'Doctor Sync: Instantly updates the doctor screen showing the patient is present in waiting room.',
          boundary: 'If checked in accidentally, assistant can cancel check-in directly from the queue card.',
          caption: 'Waiting Queue — Transparent turn tokens and lobby patient flow into examination rooms.',
        },
        {
          key: 'financials',
          icon: 'DollarSignIcon',
          title: 'Billing, Cashier & Thermal Receipts',
          badge: 'Financial Permissions',
          permissionCodes: 'assistant.view-financials, assistant.create-financials, assistant.edit-financials',
          routeName: 'assistant-financials',
          routePath: '/assistant/financials',
          desc: 'Collect consultation fees, issue official visit invoices, and print 80mm thermal receipts.',
          p1: 'Visit Invoices: Generate invoice (#INV), choose payment method (Cash, POS Card, Mobile Wallet).',
          p2: 'Thermal Receipts: Instant 80mm receipt printing with clinic logo and transaction breakdown.',
          boundary: 'Assistant cannot delete billing records or alter locked historical financial journals.',
          caption: 'Financials — Accurate cashier collection and thermal receipt printing for patients.',
        },
        {
          key: 'transactions',
          icon: 'CreditCardIcon',
          title: 'Daily Shift Payments & Audit Log',
          badge: 'Payment Audit',
          permissionCodes: 'assistant.view-financials',
          routeName: 'assistant-transactions',
          routePath: '/assistant/transactions',
          desc: 'Time-stamped audit ledger of every collected fee, payment method, and receipt during the shift.',
          p1: 'Audit Trail: Track receipt number, patient name, exact timestamp, and payment method.',
          p2: 'Shift Balancing: Reconcile cash in drawer with POS card slips prior to shift handover.',
          boundary: 'Ledger is read-only for audit integrity; past transactions cannot be wiped from database.',
          caption: 'Transactions — Clear payment reconciliation and cash drawer accountability.',
        },
        {
          key: 'purchases',
          icon: 'ShoppingCartIcon',
          title: 'Reception Purchases & Petty Cash',
          badge: 'Petty Cash Expenses',
          permissionCodes: 'assistant.view-purchases, assistant.create-purchases',
          routeName: 'assistant-purchases',
          routePath: '/assistant/purchases',
          desc: 'Record clinic operational consumables (medical gloves, sanitizers, coffee/hospitality, stationery).',
          p1: 'Log Expense: Enter purchased items, amount, supplier name, and deduct from petty cash.',
          p2: 'Attach Receipt: Photograph or upload paper invoice to ensure transparent accounting.',
          boundary: 'All expenses require item description and matching receipt amount.',
          caption: 'Purchases — Track daily clinic operational supplies and petty cash receipts.',
        },
        {
          key: 'assistant_calls',
          icon: 'PhoneCallIcon',
          title: 'Doctor Room Calling Bell System',
          badge: 'Instant Room Bell',
          permissionCodes: 'assistant.view-assistant-calls, assistant.accept-assistant-calls',
          routeName: 'assistant-dashboard',
          routePath: '/assistant/dashboard',
          desc: 'Instant audio-visual chime connecting examination rooms to reception for immediate assistance.',
          p1: 'Instant Alert: Red ringing alert pops up whenever a doctor presses the call button in exam room.',
          p2: 'Room Identification: Shows doctor name and room number; click "Accept Call" to silence chime.',
          boundary: 'Silence the alert promptly upon attending to maintain a peaceful reception lobby.',
          caption: 'Doctor Call Bell — Immediate response to physician assistance requests during procedures.',
        },
        {
          key: 'permissions_matrix',
          icon: 'ShieldIcon',
          title: 'Permissions Matrix & Security Boundaries',
          badge: 'Granted vs Restricted',
          permissionCodes: 'role: assistant (Reception & Administrative Scope)',
          routeName: '',
          routePath: '/assistant/permissions',
          desc: 'Full matrix of granted reception capabilities vs physician/admin restricted boundaries.',
          p1: 'Granted Duties: Appointment booking, patient onboarding, queue check-in, billing, and call answering.',
          p2: 'Security Boundaries: Patient privacy, no diagnostic alterations, no medication prescribing.',
          boundary: 'Clinic doctor or administrator can adjust your permissions through the role manager.',
          caption: 'Permissions Matrix — Clear boundary between reception duties and medical clinical autonomy.',
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
          text: this.isRtl ? 'أنتِ الآن على دراية كاملة بمهام الاستقبال وصلاحيات النظام.' : 'You are now fully oriented with assistant permissions and duties.',
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.assistant-tabs-scroll {
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
