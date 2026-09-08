<template>
  <div class="waiting-queue-page">
    <!-- Queue Stats Cards -->
    <b-row class="mb-2">
      <b-col
        cols="6"
        md="3"
        class="mb-1 mb-md-0"
      >
        <b-card
          no-body
          class="text-center border-primary h-100 p-1"
        >
          <div class="d-flex align-items-center justify-content-center">
            <div
              class="rounded-circle bg-light-primary p-75"
              :class="isRTL ? 'ml-1' : 'mr-1'"
            >
              <feather-icon
                icon="UsersIcon"
                size="22"
                class="text-primary"
              />
            </div>
            <div :class="isRTL ? 'text-right' : 'text-left'">
              <h3 class="mb-0 font-weight-bolder text-primary">
                {{ stats.total_checked_in }}
              </h3>
              <small class="text-muted font-weight-bold">{{ $t('queue.checkedIn') }}</small>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col
        cols="6"
        md="3"
        class="mb-1 mb-md-0"
      >
        <b-card
          no-body
          class="text-center border-warning h-100 p-1"
        >
          <div class="d-flex align-items-center justify-content-center">
            <div
              class="rounded-circle bg-light-warning p-75"
              :class="isRTL ? 'ml-1' : 'mr-1'"
            >
              <feather-icon
                icon="ClockIcon"
                size="22"
                class="text-warning"
              />
            </div>
            <div :class="isRTL ? 'text-right' : 'text-left'">
              <h3 class="mb-0 font-weight-bolder text-warning">
                {{ stats.waiting }}
              </h3>
              <small class="text-muted font-weight-bold">{{ $t('queue.waiting') }}</small>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col
        cols="6"
        md="3"
        class="mb-1 mb-md-0"
      >
        <b-card
          no-body
          class="text-center border-info h-100 p-1"
        >
          <div class="d-flex align-items-center justify-content-center">
            <div
              class="rounded-circle bg-light-info p-75"
              :class="isRTL ? 'ml-1' : 'mr-1'"
            >
              <feather-icon
                icon="ActivityIcon"
                size="22"
                class="text-info"
              />
            </div>
            <div :class="isRTL ? 'text-right' : 'text-left'">
              <h3 class="mb-0 font-weight-bolder text-info">
                {{ stats.currently_serving ? `#${stats.currently_serving}` : '—' }}
              </h3>
              <small class="text-muted font-weight-bold">{{ $t('queue.nowServing') }}</small>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col
        cols="6"
        md="3"
        class="mb-1 mb-md-0"
      >
        <b-card
          no-body
          class="text-center border-success h-100 p-1"
        >
          <div class="d-flex align-items-center justify-content-center">
            <div
              class="rounded-circle bg-light-success p-75"
              :class="isRTL ? 'ml-1' : 'mr-1'"
            >
              <feather-icon
                icon="CheckCircleIcon"
                size="22"
                class="text-success"
              />
            </div>
            <div :class="isRTL ? 'text-right' : 'text-left'">
              <h3 class="mb-0 font-weight-bolder text-success">
                {{ stats.completed }}
              </h3>
              <small class="text-muted font-weight-bold">{{ $t('queue.completed') }}</small>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Main Queue Card -->
    <b-card class="shadow-sm">
      <!-- Filter Bar -->
      <b-row class="mb-2 align-items-center">
        <!-- Title & Status Badge -->
        <b-col
          cols="12"
          lg="4"
          class="mb-1 mb-lg-0"
        >
          <div class="d-flex align-items-center">
            <div
              class="rounded p-50 bg-light-primary"
              :class="isRTL ? 'ml-1' : 'mr-1'"
            >
              <feather-icon
                icon="ListIcon"
                size="22"
                class="text-primary"
              />
            </div>
            <div>
              <h4 class="mb-0 font-weight-bolder d-flex align-items-center flex-wrap">
                {{ $t('queue.title') }}
                <b-badge
                  v-if="isToday"
                  variant="light-success"
                  pill
                  class="font-small-1 font-weight-bold"
                  :class="isRTL ? 'mr-50' : 'ml-50'"
                >
                  <span
                    class="live-dot"
                    :class="isRTL ? 'ml-25' : 'mr-25'"
                  />
                  {{ $t('queue.liveQueue') }}
                </b-badge>
                <b-badge
                  v-else
                  variant="light-warning"
                  pill
                  class="font-small-1 font-weight-bold"
                  :class="isRTL ? 'mr-50' : 'ml-50'"
                >
                  {{ $t('queue.historyQueue') }}
                </b-badge>
              </h4>
              <small class="text-muted">
                {{ formatDisplayDate(filterDate) }}
              </small>
            </div>
          </div>
        </b-col>

        <!-- Controls Row -->
        <b-col
          cols="12"
          lg="8"
        >
          <div class="queue-controls-wrapper d-flex flex-wrap align-items-center justify-content-lg-end">
            <!-- Doctor Filter (Shown when multiple doctors exist or for assistant) -->
            <div
              v-if="doctorOptions.length > 2 || (isAssistant && doctorOptions.length > 1)"
              class="filter-control-item"
            >
              <b-form-select
                v-model="selectedDoctor"
                :options="doctorOptions"
                size="sm"
                class="custom-select-sm"
                @change="fetchQueue"
              />
            </div>

            <!-- Date Picker -->
            <div class="filter-control-item">
              <b-form-input
                v-model="filterDate"
                type="date"
                size="sm"
                class="date-input-sm"
                @change="fetchQueue"
              />
            </div>

            <!-- Today Quick Button (When not viewing today) -->
            <b-button
              v-if="!isToday"
              variant="outline-secondary"
              size="sm"
              class="action-btn-sm"
              @click="setToday"
            >
              <feather-icon
                icon="CalendarIcon"
                size="13"
                :class="isRTL ? 'ml-25' : 'mr-25'"
              />
              {{ $t('queue.today') }}
            </b-button>

            <!-- Refresh Button -->
            <b-button
              variant="primary"
              size="sm"
              class="action-btn-sm"
              :disabled="loading"
              @click="fetchQueue"
            >
              <feather-icon
                icon="RefreshCwIcon"
                size="13"
                :class="[loading ? 'spin-icon' : '', isRTL ? 'ml-50' : 'mr-50']"
              />
              <span>{{ $t('queue.refresh') }}</span>
            </b-button>
          </div>
        </b-col>
      </b-row>

      <!-- Reorder Hint for Assistant on Today's Queue -->
      <div
        v-if="canReorder && activeQueue.length > 1"
        class="reorder-hint alert alert-light py-50 px-1 mb-2 d-flex align-items-center"
      >
        <feather-icon
          icon="InfoIcon"
          size="16"
          class="text-primary flex-shrink-0"
          :class="isRTL ? 'ml-50' : 'mr-50'"
        />
        <small class="text-muted font-weight-bold">
          {{ $t('queue.dragToReorder') }}
        </small>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="text-center my-4 py-2"
      >
        <b-spinner
          variant="primary"
          style="width: 2.5rem; height: 2.5rem;"
        />
        <p class="mt-1 text-muted font-weight-bold">
          {{ $t('messages.loading') }}
        </p>
      </div>

      <!-- Future Date State -->
      <div
        v-else-if="isFutureDate"
        class="future-date-container text-center my-4 py-3 px-2 rounded border border-primary bg-light-primary"
      >
        <div class="empty-icon-circle mx-auto mb-1">
          <feather-icon
            icon="CalendarIcon"
            size="36"
            class="text-primary"
          />
        </div>
        <h4 class="font-weight-bolder text-dark mb-50">
          {{ $t('queue.futureDateTitle') }}
        </h4>
        <p class="text-muted mb-2 max-w-500 mx-auto">
          {{ $t('queue.futureDateNotice') }}
        </p>
        <div class="d-flex flex-wrap justify-content-center align-items-center">
          <b-button
            variant="primary"
            class="d-inline-flex align-items-center font-weight-bold"
            :class="isRTL ? 'ml-75' : 'mr-75'"
            @click="goToReservations"
          >
            <feather-icon
              icon="CalendarIcon"
              size="15"
              :class="isRTL ? 'ml-50' : 'mr-50'"
            />
            <span>{{ $t('queue.viewScheduledReservations') }}</span>
          </b-button>

          <b-button
            variant="outline-secondary"
            class="d-inline-flex align-items-center"
            @click="setToday"
          >
            <feather-icon
              icon="RefreshCwIcon"
              size="14"
              :class="isRTL ? 'ml-50' : 'mr-50'"
            />
            <span>{{ $t('queue.backToToday') }}</span>
          </b-button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="queue.length === 0"
        class="empty-queue-container text-center my-4 py-3"
      >
        <div class="empty-icon-circle mx-auto mb-1">
          <feather-icon
            icon="InboxIcon"
            size="36"
            class="text-muted"
          />
        </div>
        <h5 class="font-weight-bold text-dark mb-50">
          {{ $t('queue.noPatients') }}
        </h5>
        <p class="text-muted small mb-1">
          {{ isToday ? (isRTL ? 'لم يتم تسجيل وصول أي مريض في عيادتك اليوم حتى الآن.' : 'No patients have checked in today yet.') : (isRTL ? 'لا توجد بيانات مسجلة لهذا التاريخ المختار.' : 'No queue records found for the selected date.') }}
        </p>
        <b-button
          v-if="!isToday"
          variant="outline-primary"
          size="sm"
          @click="setToday"
        >
          {{ isRTL ? 'العودة لقائمة اليوم' : 'Back to Today' }}
        </b-button>
      </div>

      <!-- Queue List -->
      <div v-else>
        <!-- Active Queue (Serving + Waiting) -->
        <div
          v-for="(item, index) in activeQueue"
          :key="item.id"
          class="queue-item p-1 mb-1 rounded border position-relative"
          :class="queueItemClass(item)"
          :draggable="canReorder && item.queue_status !== 'completed'"
          @dragstart="onDragStart($event, item.id)"
          @dragover.prevent="onDragOver($event, index)"
          @dragend="onDragEnd"
        >
          <div class="queue-item-layout d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <!-- Left: Number, Drag handle, Patient Details -->
            <div class="d-flex align-items-start align-items-md-center flex-grow-1 min-w-0">
              <!-- Drag Handle for Desktop Assistant -->
              <div
                v-if="canReorder && item.queue_status !== 'completed'"
                class="drag-handle d-none d-md-flex align-items-center justify-content-center text-muted cursor-move"
                :class="isRTL ? 'ml-75' : 'mr-75'"
                :title="$t('queue.dragToReorder')"
              >
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="18"
                />
              </div>

              <!-- Waiting Number Badge -->
              <div
                class="queue-number font-weight-bolder shadow-sm flex-shrink-0"
                :class="[queueNumberClass(item), isRTL ? 'ml-1' : 'mr-1']"
              >
                <span>#{{ item.waiting_number }}</span>
              </div>

              <!-- Patient Core Info -->
              <div class="flex-grow-1 min-w-0">
                <!-- Name & Badges Row -->
                <div class="d-flex flex-wrap align-items-center mb-25">
                  <h5
                    class="mb-0 font-weight-bolder patient-name text-truncate"
                    :class="isRTL ? 'ml-75' : 'mr-75'"
                  >
                    {{ item.client ? item.client.name : '—' }}
                  </h5>

                  <div class="badges-group d-flex align-items-center flex-wrap">
                    <b-badge
                      :variant="queueBadgeVariant(item)"
                      pill
                      class="px-75 py-25 font-small-2 font-weight-bold"
                    >
                      {{ $t('queue.' + item.queue_status) }}
                    </b-badge>
                    <b-badge
                      v-if="item.is_current"
                      variant="danger"
                      pill
                      class="px-75 py-25 font-small-2 font-weight-bold pulse-badge"
                      :class="isRTL ? 'mr-50' : 'ml-50'"
                    >
                      {{ $t('queue.current') }}
                    </b-badge>
                    <span
                      v-if="item.estimated_wait !== null && item.estimated_wait > 0"
                      class="badge badge-light-warning px-75 py-25 font-small-2 font-weight-bold"
                      :class="isRTL ? 'mr-50' : 'ml-50'"
                    >
                      <feather-icon
                        icon="ClockIcon"
                        size="11"
                        :class="isRTL ? 'ml-25' : 'mr-25'"
                      />
                      ~{{ item.estimated_wait }} {{ $t('queue.minutes') }}
                    </span>
                  </div>
                </div>

                <!-- Meta Chips Row -->
                <div class="d-flex flex-wrap align-items-center text-muted small meta-chips mt-50">
                  <!-- Doctor -->
                  <div
                    class="meta-chip d-flex align-items-center"
                    :class="isRTL ? 'ml-1' : 'mr-1'"
                  >
                    <feather-icon
                      icon="UserIcon"
                      size="13"
                      class="text-primary flex-shrink-0"
                      :class="isRTL ? 'ml-25' : 'mr-25'"
                    />
                    <span class="text-truncate">{{ item.doctor ? item.doctor.name : '—' }}</span>
                  </div>

                  <!-- Appointment Time -->
                  <div
                    class="meta-chip d-flex align-items-center"
                    :class="isRTL ? 'ml-1' : 'mr-1'"
                  >
                    <feather-icon
                      icon="CalendarIcon"
                      size="13"
                      class="text-info flex-shrink-0"
                      :class="isRTL ? 'ml-25' : 'mr-25'"
                    />
                    <span>{{ formatTime(item.appointment_date) }}</span>
                  </div>

                  <!-- Checked In Time -->
                  <div
                    class="meta-chip d-flex align-items-center"
                    :class="isRTL ? 'ml-1' : 'mr-1'"
                  >
                    <feather-icon
                      icon="LogInIcon"
                      size="13"
                      class="text-success flex-shrink-0"
                      :class="isRTL ? 'ml-25' : 'mr-25'"
                    />
                    <span>{{ $t('queue.checkedInAt') }}: {{ formatTime(item.checked_in_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Actions (Assistant & Doctor) -->
            <div class="queue-actions d-flex align-items-center justify-content-end flex-wrap pt-75 pt-md-0">
              <!-- Reorder Arrows for Assistant on Active Queue -->
              <b-button-group
                v-if="canReorder"
                size="sm"
                class="reorder-btn-group"
                :class="isRTL ? 'ml-50' : 'mr-50'"
              >
                <b-button
                  variant="outline-secondary"
                  class="btn-icon"
                  :disabled="isFirstActive(item) || reordering"
                  :title="$t('queue.moveUp')"
                  @click.stop="moveActiveItem(item, -1)"
                >
                  <feather-icon
                    icon="ChevronUpIcon"
                    size="15"
                  />
                </b-button>
                <b-button
                  variant="outline-secondary"
                  class="btn-icon"
                  :disabled="isLastActive(item) || reordering"
                  :title="$t('queue.moveDown')"
                  @click.stop="moveActiveItem(item, 1)"
                >
                  <feather-icon
                    icon="ChevronDownIcon"
                    size="15"
                  />
                </b-button>
              </b-button-group>

              <!-- Doctor Action: Consult / Examine -->
              <b-button
                v-if="isDoctor"
                variant="primary"
                size="sm"
                class="d-flex align-items-center font-weight-bold"
                :class="isRTL ? 'ml-50' : 'mr-50'"
                @click="consultPatient(item)"
              >
                <feather-icon
                  icon="ActivityIcon"
                  size="14"
                  :class="isRTL ? 'ml-50' : 'mr-50'"
                />
                <span>{{ $t('queue.startConsultation') }}</span>
              </b-button>

              <!-- Assistant Action: Undo Check-in -->
              <b-button
                v-if="isAssistant"
                v-b-tooltip.hover
                :title="$t('queue.undoCheckIn')"
                variant="outline-danger"
                size="sm"
                class="d-flex align-items-center"
                @click="undoCheckIn(item)"
              >
                <feather-icon
                  icon="XIcon"
                  size="14"
                />
                <span
                  class="d-inline d-md-none"
                  :class="isRTL ? 'mr-25' : 'ml-25'"
                >
                  {{ $t('queue.undoCheckIn') }}
                </span>
              </b-button>
            </div>
          </div>
        </div>

        <!-- Completed Patients Section (Divider & Collapsible / List) -->
        <div
          v-if="completedQueue.length > 0"
          class="completed-section mt-3 pt-1 border-top"
        >
          <div
            class="d-flex align-items-center justify-content-between mb-1 cursor-pointer py-50"
            @click="showCompleted = !showCompleted"
          >
            <h6 class="mb-0 text-muted font-weight-bold d-flex align-items-center">
              <feather-icon
                icon="CheckCircleIcon"
                size="16"
                class="text-success"
                :class="isRTL ? 'ml-50' : 'mr-50'"
              />
              {{ $t('queue.completedToday') }} ({{ completedQueue.length }})
            </h6>
            <b-button
              variant="flat-secondary"
              size="sm"
              class="btn-icon p-25"
            >
              <feather-icon
                :icon="showCompleted ? 'ChevronUpIcon' : 'ChevronDownIcon'"
                size="16"
              />
            </b-button>
          </div>

          <div v-show="showCompleted">
            <div
              v-for="item in completedQueue"
              :key="item.id"
              class="queue-item p-1 mb-1 rounded border queue-completed"
            >
              <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                <!-- Info -->
                <div class="d-flex align-items-center flex-grow-1 min-w-0">
                  <div
                    class="queue-number queue-number-completed font-weight-bold flex-shrink-0"
                    :class="isRTL ? 'ml-1' : 'mr-1'"
                  >
                    <span>#{{ item.waiting_number }}</span>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="d-flex flex-wrap align-items-center">
                      <h6
                        class="mb-0 font-weight-bold text-truncate"
                        :class="isRTL ? 'ml-75' : 'mr-75'"
                      >
                        {{ item.client ? item.client.name : '—' }}
                      </h6>
                      <b-badge
                        variant="success"
                        pill
                        class="px-50 font-small-1"
                      >
                        {{ $t('queue.completed') }}
                      </b-badge>
                    </div>
                    <div class="text-muted small mt-25 d-flex flex-wrap align-items-center">
                      <span :class="isRTL ? 'ml-1' : 'mr-1'">
                        <feather-icon
                          icon="UserIcon"
                          size="12"
                          :class="isRTL ? 'ml-25' : 'mr-25'"
                        />
                        {{ item.doctor ? item.doctor.name : '—' }}
                      </span>
                      <span>
                        <feather-icon
                          icon="CheckIcon"
                          size="12"
                          class="text-success"
                          :class="isRTL ? 'ml-25' : 'mr-25'"
                        />
                        {{ formatTime(item.completed_at || item.updated_at) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Doctor View Link -->
                <div
                  v-if="isDoctor"
                  class="pt-50 pt-md-0"
                >
                  <b-button
                    variant="outline-primary"
                    size="sm"
                    class="d-flex align-items-center"
                    @click="consultPatient(item)"
                  >
                    <feather-icon
                      icon="EyeIcon"
                      size="13"
                      :class="isRTL ? 'ml-25' : 'mr-25'"
                    />
                    <span>{{ $t('queue.viewReservation') }}</span>
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto-Refresh Indicator Footer -->
      <div class="text-center mt-2 pt-1 border-top">
        <small class="text-muted d-inline-flex align-items-center">
          <feather-icon
            icon="RefreshCwIcon"
            size="12"
            :class="[loading ? 'spin-icon' : '', isRTL ? 'ml-50' : 'mr-50']"
          />
          {{ $t('queue.autoRefresh') }}
        </small>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BButton,
  BButtonGroup,
  BFormInput,
  BFormSelect,
  BSpinner,
  BBadge,
  VBTooltip,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import reservationsService from '@/services/reservations'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BButton,
    BButtonGroup,
    BFormInput,
    BFormSelect,
    BSpinner,
    BBadge,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      queue: [],
      stats: {
        total_checked_in: 0,
        waiting: 0,
        completed: 0,
        avg_consultation_minutes: 15,
        currently_serving: null,
      },
      doctors: [],
      selectedDoctor: null,
      loading: false,
      filterDate: this.getTodayDate(),
      refreshInterval: null,
      draggingIndex: null,
      lastOverId: null,
      movedDuringDrag: false,
      reordering: false,
      showCompleted: true,
    }
  },
  computed: {
    userRole() {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      return userData.role || ''
    },
    isAssistant() {
      return this.userRole === 'assistant'
    },
    isDoctor() {
      return this.userRole === 'doctor' || this.userRole === 'sub-doctor'
    },
    isToday() {
      return this.filterDate === this.getTodayDate()
    },
    isFutureDate() {
      if (!this.filterDate) return false
      return this.filterDate > this.getTodayDate()
    },
    canReorder() {
      return this.isAssistant && this.isToday
    },
    isRTL() {
      return Boolean(this.$store.state.appConfig?.isRTL || this.$i18n.locale === 'ar')
    },
    doctorOptions() {
      const options = [
        { value: null, text: this.$t('queue.allDoctors') },
      ]
      if (Array.isArray(this.doctors)) {
        this.doctors.forEach(doc => {
          options.push({
            value: doc.id,
            text: doc.role === 'sub-doctor' ? `${doc.name} (${this.isRTL ? 'طبيب مساعد' : 'Sub-Doctor'})` : doc.name,
          })
        })
      }
      return options
    },
    activeQueue() {
      return this.queue.filter(i => i.queue_status !== 'completed')
    },
    completedQueue() {
      return this.queue.filter(i => i.queue_status === 'completed')
    },
  },
  watch: {
    '$store.state.broadcast.eventCounter': {
      handler() {
        this.fetchQueue()
      },
    },
  },
  mounted() {
    this.fetchQueue()
    // Auto-refresh every 30 seconds if not dragging or reordering
    this.refreshInterval = setInterval(() => {
      if (!this.draggingIndex && !this.reordering) {
        this.fetchQueue()
      }
    }, 30000)
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    async fetchQueue() {
      this.loading = true
      try {
        const params = { date: this.filterDate }
        if (this.selectedDoctor) {
          params.doctor_id = this.selectedDoctor
        }
        const response = await reservationsService.getWaitingQueue(params)
        this.queue = response.data.queue || []
        this.stats = response.data.stats || this.stats
        if (response.data.doctors) {
          this.doctors = response.data.doctors
        }
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: this.$t('queue.loadError'),
            variant: 'danger',
          },
        })
      } finally {
        this.loading = false
      }
    },

    setToday() {
      this.filterDate = this.getTodayDate()
      this.fetchQueue()
    },

    formatDisplayDate(dateStr) {
      if (!dateStr) return ''
      try {
        const d = new Date(dateStr)
        return d.toLocaleDateString(this.isRTL ? 'ar-EG' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch (e) {
        return dateStr
      }
    },

    formatTime(value) {
      if (!value) return '—'
      const date = new Date(value)
      return date.toLocaleTimeString(this.isRTL ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    getTodayDate() {
      const d = new Date()
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },

    queueItemClass(item) {
      if (item.queue_status === 'completed') return 'border-success bg-light-success queue-completed'
      if (item.is_current) return 'border-danger bg-light-danger queue-current'
      return 'border-warning queue-waiting'
    },

    queueNumberClass(item) {
      if (item.queue_status === 'completed') return 'bg-success text-white'
      if (item.is_current) return 'bg-danger text-white'
      return 'bg-warning text-white'
    },

    queueBadgeVariant(item) {
      const map = { serving: 'danger', waiting: 'warning', completed: 'success' }
      return map[item.queue_status] || 'secondary'
    },

    isFirstActive(item) {
      return this.activeQueue.length > 0 && this.activeQueue[0].id === item.id
    },

    isLastActive(item) {
      return this.activeQueue.length > 0 && this.activeQueue[this.activeQueue.length - 1].id === item.id
    },

    async moveActiveItem(item, direction) {
      if (!this.canReorder || item.queue_status === 'completed' || this.reordering) return
      const active = this.activeQueue
      const activeIdx = active.findIndex(i => i.id === item.id)
      if (activeIdx === -1) return
      const targetActiveIdx = activeIdx + direction
      if (targetActiveIdx < 0 || targetActiveIdx >= active.length) return

      const fromQueueIdx = this.queue.findIndex(i => i.id === item.id)
      const targetItem = active[targetActiveIdx]
      const toQueueIdx = this.queue.findIndex(i => i.id === targetItem.id)
      if (fromQueueIdx === -1 || toQueueIdx === -1) return

      const moved = this.queue.splice(fromQueueIdx, 1)[0]
      this.queue.splice(toQueueIdx, 0, moved)

      await this.syncOrder()
    },

    consultPatient(item) {
      this.$router.push({
        name: 'doctor-reservations',
        query: {
          search: item.client?.name || '',
          date_from: this.filterDate,
          date_to: this.filterDate,
        },
      })
    },

    goToReservations() {
      const targetRoute = this.isAssistant ? 'assistant-reservations' : 'doctor-reservations'
      this.$router.push({
        name: targetRoute,
        query: {
          date_from: this.filterDate,
          date_to: this.filterDate,
        },
      })
    },

    async undoCheckIn(item) {
      const result = await this.$swal({
        title: this.$t('queue.undoCheckInConfirm'),
        text: this.$t('queue.undoCheckInText', { name: item.client?.name || '' }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('actions.confirm'),
        cancelButtonText: this.$t('actions.cancel'),
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-secondary ml-1',
        },
        buttonsStyling: false,
      })
      if (!result.isConfirmed) return

      try {
        await reservationsService.undoCheckIn(item.id)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('queue.checkInUndone'),
            variant: 'success',
          },
        })
        this.fetchQueue()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.error || this.$t('queue.undoError'),
            variant: 'danger',
          },
        })
      }
    },

    onDragStart(event, id) {
      if (!this.canReorder) return
      try {
        event.dataTransfer.setData('text/plain', String(id))
        this.draggingIndex = id
        this.movedDuringDrag = false
      } catch (e) {
        // ignore
      }
    },

    onDragOver(event, index) {
      if (!this.canReorder) return
      const target = this.queue[index]
      if (!target || target.queue_status === 'completed') return
      const targetId = target.id
      if (this.lastOverId === targetId) return
      this.lastOverId = targetId

      let draggedId = null
      if (this.draggingIndex !== null) {
        draggedId = this.draggingIndex
      } else {
        draggedId = parseInt(event.dataTransfer.getData('text/plain'), 10)
      }
      if (Number.isNaN(draggedId)) return
      const from = this.queue.findIndex(i => i.id === draggedId)
      if (from === -1 || from === index) return

      const item = this.queue.splice(from, 1)[0]
      this.queue.splice(index, 0, item)
      this.movedDuringDrag = true
    },

    async onDragEnd() {
      this.lastOverId = null
      if (this.movedDuringDrag) {
        this.movedDuringDrag = false
        await this.syncOrder()
      }
      this.draggingIndex = null
    },

    async syncOrder() {
      this.reordering = true
      try {
        const orderedIds = this.queue.map(i => i.id)
        await reservationsService.reorderWaitingQueue(orderedIds)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('queue.reorderSuccess'),
            variant: 'success',
          },
        })
        await this.fetchQueue()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.error || this.$t('queue.reorderError'),
            variant: 'danger',
          },
        })
        await this.fetchQueue()
      } finally {
        this.reordering = false
      }
    },
  },
}
</script>

<style scoped>
.waiting-queue-page {
  position: relative;
}

.queue-controls-wrapper {
  gap: 0.5rem;
}

.filter-control-item {
  min-width: 150px;
  flex: 1 1 auto;
}

.custom-select-sm,
.date-input-sm {
  height: 34px;
}

.action-btn-sm {
  height: 34px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #28c76f;
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

.queue-number {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  letter-spacing: -0.5px;
}

.queue-number-completed {
  width: 38px;
  height: 38px;
  font-size: 1rem;
  background-color: rgba(40, 199, 111, 0.18);
  color: #28c76f;
}

.queue-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: #ffffff;
}

.queue-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.queue-waiting {
  border-left-width: 4px !important;
}

[dir="rtl"] .queue-waiting {
  border-left-width: 1px !important;
  border-right-width: 4px !important;
}

.queue-current {
  border-left-width: 4px !important;
  animation: pulse-border 2s infinite;
}

[dir="rtl"] .queue-current {
  border-left-width: 1px !important;
  border-right-width: 4px !important;
}

.queue-completed {
  opacity: 0.75;
  background-color: #fafbfc;
}

.cursor-move {
  cursor: grab;
}

.cursor-move:active {
  cursor: grabbing;
}

.cursor-pointer {
  cursor: pointer;
}

.pulse-badge {
  animation: pulse-opacity 1.5s infinite;
}

@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(234, 84, 85, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(234, 84, 85, 0); }
  100% { box-shadow: 0 0 0 0 rgba(234, 84, 85, 0); }
}

@keyframes pulse-opacity {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(115, 103, 240, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta-chips {
  row-gap: 0.25rem;
}

.badges-group {
  gap: 0.35rem;
}

.queue-actions {
  gap: 0.35rem;
}

.reorder-btn-group .btn {
  padding: 0.35rem 0.5rem;
}

.bg-light-success { background-color: rgba(40, 199, 111, 0.08) !important; }
.bg-light-danger { background-color: rgba(234, 84, 85, 0.08) !important; }
.bg-light-primary { background-color: rgba(115, 103, 240, 0.08) !important; }
.bg-light-warning { background-color: rgba(255, 159, 67, 0.08) !important; }
.bg-light-info { background-color: rgba(0, 207, 232, 0.08) !important; }

@media (max-width: 767.98px) {
  .queue-controls-wrapper {
    width: 100%;
  }

  .filter-control-item {
    min-width: calc(50% - 0.25rem);
    flex: 1 1 calc(50% - 0.25rem);
  }

  .action-btn-sm {
    flex: 1 1 calc(50% - 0.25rem);
    justify-content: center;
  }

  .queue-actions {
    width: 100%;
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px dashed #ebe9f1;
    justify-content: space-between !important;
  }

  .patient-name {
    max-width: 180px;
  }
}
</style>
