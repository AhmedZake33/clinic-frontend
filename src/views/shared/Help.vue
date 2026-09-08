<template>
  <div
    class="help-page"
    :dir="pageDirection"
  >
    <!-- Top View Mode Tabs (Interactive Guide vs Quick Cards) & Role Switcher -->
    <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap">
      <div class="d-flex align-items-center flex-wrap mb-1 mb-sm-0">
        <b-button-group
          size="sm"
          class="mr-1 ml-1 mb-1 mb-md-0"
        >
          <b-button
            :variant="activeTab === 'guide' ? 'primary' : 'outline-primary'"
            class="font-weight-bold px-2"
            @click="activeTab = 'guide'"
          >
            <feather-icon
              icon="CompassIcon"
              size="14"
              :class="isRTL ? 'ml-50' : 'mr-50'"
            />
            <span>{{ guideButtonTitle }}</span>
          </b-button>
          <b-button
            :variant="activeTab === 'cards' ? 'primary' : 'outline-primary'"
            class="font-weight-bold px-2"
            @click="activeTab = 'cards'"
          >
            <feather-icon
              icon="GridIcon"
              size="14"
              :class="isRTL ? 'ml-50' : 'mr-50'"
            />
            <span>{{ isRTL ? 'بطاقات المساعدة السريعة' : 'Quick Reference Cards' }}</span>
          </b-button>
        </b-button-group>

        <!-- Role Switcher for Doctor and Admin -->
        <b-button-group
          v-if="canSwitchRole"
          size="sm"
          class="mr-1 ml-1"
        >
          <b-button
            :variant="selectedRoleKey === 'doctor' ? 'primary' : 'outline-secondary'"
            class="extra-small font-weight-bold"
            @click="overrideRoleKey = 'doctor'"
          >
            👨‍⚕️ {{ isRTL ? 'دليل الطبيب' : 'Doctor Guide' }}
          </b-button>
          <b-button
            :variant="selectedRoleKey === 'assistant' ? 'info' : 'outline-secondary'"
            class="extra-small font-weight-bold"
            @click="overrideRoleKey = 'assistant'"
          >
            👩‍💼 {{ isRTL ? 'صلاحيات المساعدة' : 'Assistant Permissions' }}
          </b-button>
          <b-button
            :variant="selectedRoleKey === 'sub-doctor' ? 'primary' : 'outline-secondary'"
            class="extra-small font-weight-bold"
            @click="overrideRoleKey = 'sub-doctor'"
          >
            🩺 {{ isRTL ? 'صلاحيات الطبيب المساعد' : 'Sub-Doctor Permissions' }}
          </b-button>
        </b-button-group>
      </div>

      <b-badge
        variant="light-primary"
        class="font-weight-bold p-1 mt-1 mt-sm-0"
      >
        {{ roleLabel }}
      </b-badge>
    </div>

    <!-- TAB 1: Interactive Onboarding & Permissions Guide Component -->
    <div
      v-if="activeTab === 'guide'"
      class="onboarding-guide-tab"
    >
      <assistant-permissions-guide v-if="selectedRoleKey === 'assistant'" />
      <sub-doctor-permissions-guide v-else-if="selectedRoleKey === 'sub-doctor'" />
      <doctor-onboarding-guide v-else />
    </div>

    <!-- TAB 2: Quick Reference Cards View -->
    <div
      v-else
      class="quick-cards-tab"
    >
      <b-row>
        <b-col cols="12">
          <b-card class="mb-2 shadow-sm border">
            <div class="d-flex align-items-center justify-content-between flex-wrap">
              <div>
                <h5 class="mb-50 font-weight-bolder text-dark">
                  {{ pageTitle }}
                </h5>
                <p class="text-muted mb-0 small">
                  {{ pageIntro }}
                </p>
              </div>
            </div>
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col
          v-for="section in sections"
          :key="section.title"
          cols="12"
          md="6"
          xl="4"
          class="mb-2"
        >
          <b-card
            no-body
            class="h-100 shadow-sm border"
          >
            <b-card-body>
              <div class="d-flex align-items-center mb-1">
                <feather-icon
                  :icon="section.icon"
                  size="20"
                  class="text-primary"
                  :class="isRTL ? 'ml-75' : 'mr-75'"
                />
                <h5 class="mb-0 font-weight-bolder text-dark">
                  {{ section.title }}
                </h5>
              </div>
              <ol
                class="help-steps mb-0 extra-small"
                :class="isRTL ? 'pr-1' : 'pl-1'"
              >
                <li
                  v-for="step in section.steps"
                  :key="step"
                  class="help-step-item mb-50"
                >
                  <span class="help-step-text">{{ step }}</span>
                </li>
              </ol>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>

      <b-card class="shadow-sm border">
        <h5 class="mb-1 font-weight-bolder text-dark">
          {{ content.quickTips }}
        </h5>
        <b-alert
          v-for="tip in tips"
          :key="tip"
          variant="light-info"
          show
          class="mb-1 small font-weight-bold"
        >
          💡 {{ tip }}
        </b-alert>
      </b-card>
    </div>
  </div>
</template>

<script>
import {
  BAlert,
  BBadge,
  BCard,
  BCardBody,
  BCol,
  BRow,
  BButton,
  BButtonGroup,
} from 'bootstrap-vue'
import DoctorOnboardingGuide from '@/views/doctor/DoctorOnboardingGuide.vue'
import AssistantPermissionsGuide from '@/views/assistant/AssistantPermissionsGuide.vue'
import SubDoctorPermissionsGuide from '@/views/doctor/SubDoctorPermissionsGuide.vue'

const helpContent = {
  ar: {
    quickTips: 'نصائح سريعة',
    roles: {
      doctor: 'الدكتور الرئيسي',
      assistant: 'المساعدة والاستقبال',
      'sub-doctor': 'الطبيب المساعد / الزميل',
    },
    titlePrefix: 'دليل مساعدة وصلاحيات',
    intros: {
      doctor: 'دليل شامل لإدارة العيادة، الحجوزات، طاقم المساعدين والأطباء الفرعيين، والتقارير المالية.',
      assistant: 'دليل شامل لمهام الاستقبال، حجز المواعيد، تسجيل وصول المرضى، الخزينة، والصلاحيات الممنوحة.',
      'sub-doctor': 'دليل الاستقلالية الطبية، متابعة الحالات المسندة، إكمال الكشوفات، وكتابة الروشتات الإلكترونية.',
    },
    sharedTips: [
      'لو ظهرت رسالة خطأ في الحفظ، راجع الحقول المطلوبة مثل التاريخ، المبلغ، وطريقة الدفع.',
      'استخدم البحث والفلاتر لتقليل القائمة بدل التنقل بين صفحات كثيرة.',
      'أي تغيير مهم في الحجز يظهر داخل سجل الحركات في تفاصيل الحجز.',
    ],
    doctorTips: [
      'الحجز المستقبلي من تفاصيل الحجز يستخدم نفس العميل والطبيب تلقائياً.',
      'إكمال الحجز هو المكان المناسب لتسجيل التشخيص والعلاج والملفات.',
      'يمكنك استعراض أدلة وصلاحيات المساعدة والطبيب المساعد من أزرار التبديل أعلاه.',
    ],
    assistantTips: [
      'تأكيد الحجز وتسجيل الوصول يساعد الدكتور على متابعة الدور بدقة في صالة الانتظار.',
      'عند إضافة خدمة على الحجز، تأكدي هل تحتاج فاتورة أم لا قبل الحفظ.',
      'جرس الاستدعاء يصدر تنبيهاً مباشراً على شاشتك عند حاجة أي طبيب للمساعدة.',
    ],
    subDoctorTips: [
      'يمكنك كتابة الروشتة وطباعتها مباشرة ببيانات المريض بعد البحث الذكي في قاعدة الأدوية.',
      'أي إجراء طبي تنفذه (سونار، خياطة) يمكنك إضافته من زر الخدمات لربطه بفاتورة الاستقبال.',
      'تحديد موعد المتابعة من شاشة الكشف يحفظ وقتك ويثبت المريض في جدولك تلقائياً.',
    ],
    sections: {
      doctor: [
        {
          icon: 'UsersIcon',
          title: 'إدارة العملاء والمرضى',
          steps: [
            'افتح العملاء من القائمة الجانبية.',
            'أضف عميل جديد أو افتح ملف عميل موجود.',
            'راجع رقم الهاتف والواتساب لأن رسائل التذكير تعتمد عليهما.',
          ],
        },
        {
          icon: 'ClipboardIcon',
          title: 'الحجوزات والكشف',
          steps: [
            'افتح حجوزاتي لمتابعة حجوزات اليوم وطابور الانتظار.',
            'من تفاصيل الحجز يمكنك إنشاء حجز مستقبلي لنفس العميل.',
            'استخدم إكمال الحجز لتسجيل التشخيص والعلاج والطلبات الإضافية.',
          ],
        },
        {
          icon: 'ClockIcon',
          title: 'المواعيد والجدول',
          steps: [
            'افتح الجدول لتحديد أيام وساعات العمل الرسمية.',
            'أضف الإجازات أو الأيام المتكررة غير المتاحة.',
            'النظام يمنع الحجز خارج أوقات العمل أو في وقت محجوز.',
          ],
        },
        {
          icon: 'UserPlusIcon',
          title: 'الفريق الطبي والاستقبال',
          steps: [
            'أضف المساعدين من صفحة المساعدين.',
            'أضف الدكتور المساعد من صفحة الدكاترة المساعدين حسب حدود الباقة.',
            'راجع الصلاحيات من الإدارة إذا لم تظهر صفحة معينة لأحد أفراد الفريق.',
          ],
        },
        {
          icon: 'DollarSignIcon',
          title: 'الماليات والمشتريات',
          steps: [
            'تابع الفواتير والمدفوعات وتقفيل الخزينة من الماليات.',
            'سجل المصروفات من صفحة المشتريات مع إرفاق الإيصالات.',
            'استخدم التقارير لمراجعة ملخص الدخل والحجوزات وتصدير PDF.',
          ],
        },
      ],
      assistant: [
        {
          icon: 'UsersIcon',
          title: 'المرضى واستقبال الحالات',
          steps: [
            'افتح العملاء لإضافة عميل جديد أو تعديل بيانات عميل.',
            'تأكد من رقم الهاتف والواتساب ومفتاح الدولة قبل إنشاء الحجز.',
            'استخدم البحث السريع للوصول الفوري لملف المريض.',
          ],
        },
        {
          icon: 'CalendarIcon',
          title: 'حجز وتأكيد المواعيد',
          steps: [
            'افتح الحجوزات ثم اختر حجز موعد جديد.',
            'اختر العميل والطبيب والتاريخ والوقت المتاح.',
            'أدخل المبلغ والمدفوع وطريقة الدفع ثم احفظ الحجز وأكده هاتفياً.',
          ],
        },
        {
          icon: 'ListIcon',
          title: 'صالة الانتظار وتسجيل الوصول',
          steps: [
            'استخدم زر تسجيل الوصول (Check In) فور حضور العميل للعيادة.',
            'يمنح النظام المريض رقم دور تسلسلي عادل (#01، #02...).',
            'يظهر المريض مباشرة في شاشة الطبيب لطلب دخوله لغرفة الكشف.',
          ],
        },
        {
          icon: 'DollarSignIcon',
          title: 'الخزينة والفواتير الحرارية',
          steps: [
            'راجع الفواتير والمدفوعات من صفحة الماليات.',
            'سجل دفعات الحجز وطريقة الدفع (نقداً، فيزا، محافظ).',
            'اطبع إيصال الاستقبال الحراري 80mm بشعار العيادة للمريض.',
          ],
        },
        {
          icon: 'ShoppingCartIcon',
          title: 'المشتريات ومصروفات الاستقبال',
          steps: [
            'سجل فواتير النظافة والمستلزمات الطبية والضيافة من صفحة المشتريات.',
            'أرفق صورة الفاتورة الورقية لضمان دقة تدقيق العهدة.',
            'راجع تقرير المصروفات اليومية قبل تسليم الوردية.',
          ],
        },
        {
          icon: 'PhoneCallIcon',
          title: 'جرس استدعاء الأطباء',
          steps: [
            'استقبل التنبيه الصوتي والمرئي عند رنين أي طبيب من غرفته.',
            'يوضح الإشعار اسم الطبيب ورقم الغرفة المعنية.',
            'اضغط تأكيد الحضور لإيقاف الرنين والتوجه للغرفة فوراً.',
          ],
        },
        {
          icon: 'ShieldIcon',
          title: 'مصفوفة الصلاحيات والحدود الأمنية',
          steps: [
            'صلاحيات الاستقبال: إدارة المواعيد، الطابور، تحصيل الرسوم، وطباعة الإيصالات.',
            'الحدود الأمنية: لا تملك المساعدة صلاحية تعديل التشخيص الطبي أو كتابة الروشتات.',
            'لا يمكن للمساعدة حذف الحركات المالية المسجلة بالخزينة.',
          ],
        },
      ],
      'sub-doctor': [
        {
          icon: 'ClipboardIcon',
          title: 'حجوزاتي وحالات اليوم',
          steps: [
            'افتح حجوزاتي لمتابعة قائمة المرضى المسندين لك اليوم.',
            'راقب المرضى الذين وصلوا صالة الانتظار وبانتظار الدخول.',
            'اضغط زر بدء الكشف لاستدعاء المريض وفتح ملفه الطبي.',
          ],
        },
        {
          icon: 'CheckCircleIcon',
          title: 'إكمال الكشف والتشخيص السريري',
          steps: [
            'استخدم زر إكمال الحجز لتوثيق الفحص السريري.',
            'سجل التشخيص الطبي، العلامات الحيوية، والملاحظات الإكلينيكية.',
            'أرفق ملفات الأشعة والتحاليل في الملف الطبي الدائم للمريض.',
          ],
        },
        {
          icon: 'FileTextIcon',
          title: 'الروشتة الإلكترونية والأدوية',
          steps: [
            'ابحث في قاعدة بيانات الأدوية المصرية وOpenFDA بالاسم التجاري أو المادة الفعالة.',
            'حدد الجرعات، التكرار، ومدة العلاج وملاحظات الاستخدام.',
            'اطبع الروشتة الرسمية المعتمدة ببيانات المريض وترويسة العيادة.',
          ],
        },
        {
          icon: 'GridIcon',
          title: 'الخدمات والإجراءات الطبية',
          steps: [
            'أضف الإجراءات والفحوصات المنفذة (سونار، غيار جراحي، خياطة) للكشف.',
            'حدد ما إذا كان الإجراء يتطلب فاتورة محاسبية للاستقبال.',
            'يتم تحويل الرسوم تلقائياً إلى خزينة الاستقبال لتحصيلها.',
          ],
        },
        {
          icon: 'CalendarIcon',
          title: 'جدولة المتابعات والاستشارات',
          steps: [
            'ثبت موعد الاستشارة القادمة للمريض مباشرة من تفاصيل الكشف.',
            'يتم حفظ بيانات المريض وتثبيت الموعد في جدولك بضغطة زر.',
            'يضمن استمرارية الرعاية ومتابعة استجابة المريض للعلاج.',
          ],
        },
        {
          icon: 'UsersIcon',
          title: 'الملف الطبي وتاريخ المريض',
          steps: [
            'اطلع على السجل الطبي الشامل وتاريخ الزيارات السابقة بالعيادة.',
            'راجع تنبيهات الأمراض المزمنة (ضغط، سكر) والحساسيات الدوائية.',
            'استعرض تشخيصات وروشتات الأطباء السابقين لضمان سلامة القرار الطبي.',
          ],
        },
        {
          icon: 'BellIcon',
          title: 'جرس استدعاء المساعدة',
          steps: [
            'استخدم زر الاستدعاء من غرفتك لطلب حضور المساعدة فورياً.',
            'يصدر رنين وتنبيه مباشر في الاستقبال برقم غرفتك واسمك.',
            'يظهر إشعار بتأكيد المساعدة وتوجهها لغرفتك.',
          ],
        },
        {
          icon: 'ShieldIcon',
          title: 'الاستقلالية الطبية والحدود الإدارية',
          steps: [
            'استقلالية كاملة: الكشف، التشخيص، الروشتات، طلب الفحوصات، وحجز المتابعات.',
            'الحدود الإدارية: إدارة فريق العمل، إضافة أطباء، وباقة العيادة مخصص للمالك.',
            'الحسابات المالية مفصولة لتعرض فقط أداء وإيرادات الحالات المسندة لك.',
          ],
        },
      ],
    },
  },
  en: {
    quickTips: 'Quick Tips',
    roles: {
      doctor: 'Lead Doctor',
      assistant: 'Reception & Assistant',
      'sub-doctor': 'Associate Physician',
    },
    titlePrefix: 'Help & Permissions Guide for',
    intros: {
      doctor: 'Comprehensive guide for clinic management, reservations, staff, associate doctors, and finance.',
      assistant: 'Comprehensive guide covering reception duties, appointment booking, queue tokens, billing, and permissions.',
      'sub-doctor': 'Guide detailing clinical autonomy, caseload management, visit completion, and e-prescriptions.',
    },
    sharedTips: [
      'If a save error appears, review required fields such as date, amount, and payment method.',
      'Use search and filters to narrow the list instead of moving through many pages.',
      'Important reservation changes appear in the activity log inside reservation details.',
    ],
    doctorTips: [
      'Creating a future reservation from reservation details automatically uses the same client and doctor.',
      'Completing a reservation is the right place to add diagnosis, treatment, and files.',
      'You can switch role guides using the toggle pills above to inspect assistant and sub-doctor permissions.',
    ],
    assistantTips: [
      'Confirming reservations and checking clients in helps the doctor follow the queue accurately in the lobby.',
      'When adding a service to a reservation, confirm whether it needs an invoice before saving.',
      'Doctor call bells chime directly on your screen whenever a physician requests assistance.',
    ],
    subDoctorTips: [
      'You can write and print e-prescriptions directly using the built-in medication database.',
      'Any procedure performed (Ultrasound, dressing) can be billed directly to the visit.',
      'Scheduling follow-ups from the consultation view automatically books into your calendar.',
    ],
    sections: {
      doctor: [
        {
          icon: 'UsersIcon',
          title: 'Client & Patient Management',
          steps: [
            'Open Clients from the side menu.',
            'Add a new client or open an existing client profile.',
            'Review the phone and WhatsApp numbers because reminder messages depend on them.',
          ],
        },
        {
          icon: 'ClipboardIcon',
          title: 'Reservations & Consultations',
          steps: [
            'Open My Reservations to follow today reservations and waiting queue.',
            'From reservation details, you can create a future reservation for the same client.',
            'Use Complete Reservation to record diagnosis, treatment, and additional requests.',
          ],
        },
        {
          icon: 'ClockIcon',
          title: 'Schedule & Clinic Hours',
          steps: [
            'Open Schedule to set working days and hours.',
            'Add vacations or recurring unavailable days.',
            'The system blocks reservations outside working hours or in reserved slots.',
          ],
        },
        {
          icon: 'UserPlusIcon',
          title: 'Staff & Team Coordination',
          steps: [
            'Add assistants from the Assistants page.',
            'Add sub doctors from the Sub Doctors page according to package limits.',
            'Review permissions from admin if a page does not appear for a team member.',
          ],
        },
        {
          icon: 'DollarSignIcon',
          title: 'Finance & Invoicing',
          steps: [
            'Follow invoices, payments, and daily cash closing from Finance.',
            'Record expenses from Purchases with attached paper receipts.',
            'Use Reports to review income and reservation summaries and export PDF.',
          ],
        },
      ],
      assistant: [
        {
          icon: 'UsersIcon',
          title: 'Patients & Reception Records',
          steps: [
            'Open Clients to register new patients or update contact details.',
            'Verify phone number, country dial code, and WhatsApp prior to booking.',
            'Use fast search by phone or name for instant file retrieval.',
          ],
        },
        {
          icon: 'CalendarIcon',
          title: 'Appointment Booking & Confirmation',
          steps: [
            'Open Reservations and select a new appointment slot.',
            'Choose client, doctor, date, and open time slots.',
            'Enter fee amount, payment method, and confirm appointment via phone/WhatsApp.',
          ],
        },
        {
          icon: 'ListIcon',
          title: 'Waiting Lobby Queue & Check-In',
          steps: [
            'Click Check In as soon as the patient arrives at the clinic reception.',
            'System issues a sequential, transparent turn token (#01, #02...).',
            'Doctor is notified immediately in room that patient is ready in lobby.',
          ],
        },
        {
          icon: 'DollarSignIcon',
          title: 'Billing & Thermal Receipts',
          steps: [
            'Review invoices and payments from the Financials dashboard.',
            'Collect fees via Cash, POS Card, or Mobile Wallets.',
            'Print 80mm thermal receipt with clinic logo for the patient.',
          ],
        },
        {
          icon: 'ShoppingCartIcon',
          title: 'Reception Purchases & Petty Cash',
          steps: [
            'Record sanitation, medical disposables, and hospitality from Purchases.',
            'Attach photos of paper receipts to verify petty cash reconciliation.',
            'Review shift expense summaries before handing over the register.',
          ],
        },
        {
          icon: 'PhoneCallIcon',
          title: 'Doctor Calling Bell System',
          steps: [
            'Receive acoustic chime and visual pop-up when any doctor rings from room.',
            'Alert displays doctor name and exam room number.',
            'Click Acknowledge to silence chime and report to the room immediately.',
          ],
        },
        {
          icon: 'ShieldIcon',
          title: 'Permissions Matrix & Security Boundaries',
          steps: [
            'Granted Reception: Bookings, queue check-in, billing, and receipt printing.',
            'Security Boundaries: Cannot alter doctor diagnoses or prescribe medications.',
            'Cannot delete financial invoices or historical accounting records.',
          ],
        },
      ],
      'sub-doctor': [
        {
          icon: 'ClipboardIcon',
          title: 'My Caseload & Today Queue',
          steps: [
            'Open My Reservations to track patients assigned to you today.',
            'Monitor patients who arrived in the lobby and are ready for consultation.',
            'Click Start Consultation to call the patient and open their clinical chart.',
          ],
        },
        {
          icon: 'CheckCircleIcon',
          title: 'Clinical Consultation & Visit Completion',
          steps: [
            'Use Complete Visit to document clinical findings and diagnosis.',
            'Record vital signs (BP, Pulse, Temp) and recommendations.',
            'Attach radiographs, ultrasound scans, and lab reports to patient EHR.',
          ],
        },
        {
          icon: 'FileTextIcon',
          title: 'E-Prescriptions & Medication Search',
          steps: [
            'Search Egypt Drug Database and OpenFDA by brand or generic name.',
            'Specify dosage, frequency, treatment duration, and doctor instructions.',
            'Print official clinic prescription with doctor signature line.',
          ],
        },
        {
          icon: 'GridIcon',
          title: 'Medical Procedures & Service Billing',
          steps: [
            'Add performed medical procedures (Ultrasound, suturing, dressing) to visit.',
            'Toggle invoice requirement for the reception cashier.',
            'Charges are automatically linked to the visit for front desk collection.',
          ],
        },
        {
          icon: 'CalendarIcon',
          title: 'Follow-Up Scheduling & Return Visits',
          steps: [
            'Schedule return consultation directly from the consultation screen.',
            'Patient details are preserved and synced into your calendar with one click.',
            'Ensures clinical continuity and patient recovery monitoring.',
          ],
        },
        {
          icon: 'UsersIcon',
          title: 'Patient Electronic Health Record (EHR)',
          steps: [
            'Review lifelong clinical timeline and previous visits across clinic.',
            'Check chronic illnesses (Hypertension, Diabetes) and drug allergy warnings.',
            'Inspect past prescriptions and lab attachments for safe care delivery.',
          ],
        },
        {
          icon: 'BellIcon',
          title: 'Room Calling Bell for Assistant',
          steps: [
            'Use the call button in exam room to summon nursing/reception staff.',
            'Instant acoustic chime and visual alert sound at the front desk.',
            'Screen confirms when assistant acknowledges and reports to your room.',
          ],
        },
        {
          icon: 'ShieldIcon',
          title: 'Clinical Autonomy vs Admin Boundaries',
          steps: [
            'Full Clinical Autonomy: Consultation, diagnosis, prescriptions, and follow-ups.',
            'Administrative Scope: Clinic plans, adding staff, and global settings reserved for owner.',
            'Financial reports are scoped to your caseload and performed procedures.',
          ],
        },
      ],
    },
  },
}

export default {
  components: {
    BAlert,
    BBadge,
    BCard,
    BCardBody,
    BCol,
    BRow,
    BButton,
    BButtonGroup,
    DoctorOnboardingGuide,
    AssistantPermissionsGuide,
    SubDoctorPermissionsGuide,
  },
  data() {
    return {
      activeTab: 'guide',
      overrideRoleKey: null,
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user') || 'null') || {}
    },
    role() {
      return this.user.role || 'doctor'
    },
    roleKey() {
      if (this.role === 'assistant') return 'assistant'
      if (this.role === 'sub-doctor') return 'sub-doctor'
      return 'doctor'
    },
    selectedRoleKey() {
      return this.overrideRoleKey || this.roleKey
    },
    canSwitchRole() {
      return this.role === 'doctor' || this.role === 'admin'
    },
    localeKey() {
      return this.$i18n.locale === 'ar' ? 'ar' : 'en'
    },
    content() {
      return helpContent[this.localeKey]
    },
    isRTL() {
      return this.localeKey === 'ar'
    },
    pageDirection() {
      return this.isRTL ? 'rtl' : 'ltr'
    },
    roleLabel() {
      return this.content.roles[this.selectedRoleKey]
    },
    guideButtonTitle() {
      if (this.selectedRoleKey === 'assistant') {
        return this.isRTL ? 'دليل وصلاحيات المساعدة التفاعلي' : 'Interactive Assistant Permissions Guide'
      }
      if (this.selectedRoleKey === 'sub-doctor') {
        return this.isRTL ? 'دليل وصلاحيات الطبيب المساعد التفاعلي' : 'Interactive Sub-Doctor Permissions Guide'
      }
      return this.isRTL ? 'دليل وتهيئة الطبيب التفاعلي' : 'Interactive Doctor Guide'
    },
    pageTitle() {
      return `${this.content.titlePrefix} ${this.roleLabel}`
    },
    pageIntro() {
      return this.content.intros[this.selectedRoleKey]
    },
    sections() {
      return this.content.sections[this.selectedRoleKey]
    },
    tips() {
      let roleTips = this.content.doctorTips
      if (this.selectedRoleKey === 'assistant') {
        roleTips = this.content.assistantTips
      } else if (this.selectedRoleKey === 'sub-doctor') {
        roleTips = this.content.subDoctorTips
      }

      return [
        ...(roleTips || []),
        ...this.content.sharedTips,
      ]
    },
  },
}
</script>

<style scoped>
.extra-small {
  font-size: 0.78rem;
}

.help-page[dir='rtl'] .help-steps {
  padding-right: 1rem;
  padding-left: 0;
}

.help-page[dir='ltr'] .help-steps {
  padding-left: 1rem;
  padding-right: 0;
}

.help-step-item {
  margin-bottom: 0.4rem;
}
</style>
