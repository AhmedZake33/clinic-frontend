<template>
  <div>
    <div
      v-if="pageLoading"
      class="text-center py-5"
    >
      <b-spinner
        variant="primary"
        class="mb-1"
      />
      <div class="text-muted">
        {{ $t('messages.loading') }}
      </div>
    </div>

    <template v-else>
      <b-card :title="$t('menu.schedule')">
        <b-form @submit.prevent="saveAvailability">
          <b-form-group
            :label="$t('reservation.appointmentDuration')"
            class="mb-2"
          >
            <b-form-select
              v-model="appointmentDuration"
              :options="durationOptions"
            />
          </b-form-group>

          <div
            v-for="day in days"
            :key="day.index"
            class="mb-3 p-2 bg-light rounded"
          >
            <div class="d-flex align-items-center justify-content-between mb-1">
              <div class="d-flex align-items-center">
                <feather-icon
                  icon="CalendarIcon"
                  size="18"
                  class="text-primary mr-1 ml-1"
                />
                <h5 class="mb-0 font-weight-bolder">
                  {{ dayName(day.index) }}
                </h5>
                <b-badge
                  v-if="getSlots(day.index).length > 0"
                  variant="light-primary"
                  class="ml-2 mr-2 font-weight-bold"
                >
                  {{ getSlots(day.index).length }} {{ $i18n.locale === 'ar' ? 'فترة عمل' : 'slot(s)' }}
                </b-badge>
              </div>
              <b-button
                type="button"
                size="sm"
                variant="primary"
                @click="addSlot(day.index)"
              >
                <feather-icon
                  icon="PlusIcon"
                  size="14"
                  class="mr-25 ml-25"
                />
                {{ $t('actions.add') }}
              </b-button>
            </div>

            <div
              v-if="getSlots(day.index).length === 0"
              class="text-muted small py-1"
            >
              {{ $i18n.locale === 'ar' ? '— لا توجد فترات عمل محددة لهذا اليوم —' : '— No working slots configured for this day —' }}
            </div>

            <template v-else>
              <b-row class="mb-50 text-muted small font-weight-bold d-none d-md-flex px-1">
                <b-col
                  cols="5"
                  md="4"
                >
                  <feather-icon
                    icon="ClockIcon"
                    size="12"
                    class="mr-25 ml-25"
                  />
                  {{ $t('reservation.startTime') || ($i18n.locale === 'ar' ? 'وقت البداية' : 'Start Time') }}
                </b-col>
                <b-col
                  cols="5"
                  md="4"
                >
                  <feather-icon
                    icon="ClockIcon"
                    size="12"
                    class="mr-25 ml-25"
                  />
                  {{ $t('reservation.endTime') || ($i18n.locale === 'ar' ? 'وقت النهاية' : 'End Time') }}
                </b-col>
                <b-col
                  cols="2"
                  md="2"
                />
              </b-row>

              <b-row
                v-for="(slot, idx) in getSlots(day.index)"
                :key="slot._key"
                class="mb-1 align-items-center"
              >
                <b-col
                  cols="5"
                  md="4"
                >
                  <b-form-input
                    v-model="slot.start_time"
                    type="time"
                    required
                    :class="{ 'is-invalid': slot.end_time && slot.start_time && slot.end_time <= slot.start_time }"
                  />
                </b-col>
                <b-col
                  cols="5"
                  md="4"
                >
                  <b-form-input
                    v-model="slot.end_time"
                    type="time"
                    required
                    :class="{ 'is-invalid': slot.end_time && slot.start_time && slot.end_time <= slot.start_time }"
                  />
                </b-col>
                <b-col
                  cols="2"
                  md="2"
                >
                  <b-button
                    v-b-tooltip.hover
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    :title="$t('actions.remove')"
                    @click="removeSlot(day.index, idx)"
                  >
                    <feather-icon
                      icon="TrashIcon"
                      size="14"
                    />
                  </b-button>
                </b-col>
              </b-row>
            </template>
          </div>

          <div class="text-end mt-2">
            <b-button
              type="submit"
              variant="primary"
              size="lg"
              class="font-weight-bold shadow-sm"
              :disabled="saving"
            >
              <b-spinner
                v-if="saving"
                small
                class="mr-1 ml-1"
              />
              <feather-icon
                v-else
                icon="SaveIcon"
                class="mr-50 ml-50"
              />
              {{ $t('actions.save') }}
            </b-button>
          </div>
        </b-form>
      </b-card>

      <b-card
        class="mt-2"
        :title="$t('reservation.holidays')"
      >
        <b-form @submit.prevent="addHoliday">
          <b-row class="align-items-end">
            <b-col
              cols="12"
              sm="6"
              md="3"
              class="mb-1 mb-md-0"
            >
              <label class="font-weight-bold small text-muted">
                {{ $i18n.locale === 'ar' ? 'نوع الإجازة' : 'Holiday Type' }}
              </label>
              <b-form-select
                v-model="newHoliday.type"
                :options="holidayTypeOptions"
                @change="onHolidayTypeChange"
              />
            </b-col>

            <b-col
              v-if="newHoliday.type === 'date'"
              cols="12"
              sm="6"
              md="3"
              class="mb-1 mb-md-0"
            >
              <label class="font-weight-bold small text-muted">
                {{ $t('reservation.date') }}
              </label>
              <b-form-input
                v-model="newHoliday.date"
                type="date"
                required
              />
            </b-col>

            <b-col
              v-else
              cols="12"
              sm="6"
              md="3"
              class="mb-1 mb-md-0"
            >
              <label class="font-weight-bold small text-muted">
                {{ $t('reservation.day') }}
              </label>
              <b-form-select
                v-model="newHoliday.recurring_day_of_week"
                :options="dayOptions"
                required
              />
            </b-col>

            <b-col
              cols="12"
              sm="6"
              md="4"
              class="mb-1 mb-md-0"
            >
              <label class="font-weight-bold small text-muted">
                {{ $t('reservation.reason') }}
              </label>
              <b-form-input
                v-model="newHoliday.reason"
                :placeholder="$t('reservation.reason')"
              />
            </b-col>

            <b-col
              cols="12"
              sm="6"
              md="2"
              class="text-end"
            >
              <b-button
                type="submit"
                variant="warning"
                block
                class="font-weight-bold"
                :disabled="addingHoliday"
              >
                <b-spinner
                  v-if="addingHoliday"
                  small
                  class="mr-1 ml-1"
                />
                <feather-icon
                  v-else
                  icon="PlusIcon"
                  class="mr-25 ml-25"
                />
                {{ $t('actions.add') }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>

        <b-table
          :items="holidays"
          :fields="holidayFields"
          small
          responsive
          class="mt-2"
          show-empty
          :empty-text="$t('messages.noRecords')"
        >
          <template #cell(date)="data">
            <b-badge
              :variant="data.item.recurring_day_of_week !== null && data.item.recurring_day_of_week !== undefined ? 'light-warning' : 'light-info'"
              class="font-weight-bold p-50"
            >
              <feather-icon
                :icon="data.item.recurring_day_of_week !== null && data.item.recurring_day_of_week !== undefined ? 'RepeatIcon' : 'CalendarIcon'"
                size="14"
                class="mr-25 ml-25"
              />
              {{ holidayDisplay(data.item) }}
            </b-badge>
          </template>
          <template #cell(actions)="data">
            <responsive-table-actions>
              <b-button
                v-b-tooltip.hover
                size="sm"
                variant="danger"
                :title="$t('actions.delete')"
                @click="removeHoliday(data.item)"
              >
                <feather-icon icon="TrashIcon" />
              </b-button>
            </responsive-table-actions>
          </template>
        </b-table>

        <b-pagination
          v-if="holidaysPagination.total > holidaysPagination.per_page"
          v-model="holidaysPagination.current_page"
          :total-rows="holidaysPagination.total"
          :per-page="holidaysPagination.per_page"
          class="mt-2"
          align="center"
          @change="onHolidaysPageChange"
        />
        <div
          v-if="holidaysPagination.total"
          class="text-center text-muted small mt-1"
        >
          {{ paginationCountText(holidaysPagination) }}
        </div>
      </b-card>
    </template>
  </div>
</template>

<script>
import {
  BCard, BForm, BTable, BPagination, BButton, BRow, BCol, BFormInput, BSpinner, BFormGroup, BFormSelect, BBadge, VBTooltip,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import scheduleService from '@/services/schedule'
import ResponsiveTableActions from '@/components/ResponsiveTableActions.vue'

let slotKeyCounter = 0

const getTodayDateString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default {
  name: 'DoctorSchedule',
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BCard,
    BForm,
    BTable,
    BPagination,
    BButton,
    BRow,
    BCol,
    BFormInput,
    BSpinner,
    BFormGroup,
    BFormSelect,
    BBadge,
    ResponsiveTableActions,
  },
  data() {
    return {
      user: null,
      days: [
        { index: 0 },
        { index: 1 },
        { index: 2 },
        { index: 3 },
        { index: 4 },
        { index: 5 },
        { index: 6 },
      ],
      availabilitySlots: [],
      appointmentDuration: 30,
      holidays: [],
      holidaysPagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
      holidayFields: [
        { key: 'date', label: this.$t('reservation.date') },
        { key: 'reason', label: this.$t('reservation.reason') },
        { key: 'actions', label: this.$t('table.actions') },
      ],
      saving: false,
      addingHoliday: false,
      pageLoading: true,
      newHoliday: {
        type: 'date',
        date: getTodayDateString(),
        recurring_day_of_week: 5,
        reason: '',
      },
    }
  },
  computed: {
    durationOptions() {
      return [5, 10, 15, 20, 30, 45, 60].map(value => ({
        value,
        text: `${value} ${this.$t('reservation.minutes')}`,
      }))
    },
    holidayTypeOptions() {
      return [
        { value: 'date', text: this.$t('reservation.oneTimeHoliday') },
        { value: 'weekly', text: this.$t('reservation.weeklyHoliday') },
      ]
    },
    dayOptions() {
      return this.days.map(day => ({
        value: day.index,
        text: this.dayName(day.index),
      }))
    },
  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null')
    if (this.user) {
      await Promise.all([
        this.fetchAvailability(),
        this.fetchHolidays(),
      ])
    }
    this.pageLoading = false
  },
  methods: {
    dayName(idx) {
      const isAr = this.$i18n.locale === 'ar'
      const namesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const namesAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      return isAr ? namesAr[idx] : namesEn[idx]
    },
    getSlots(dayIndex) {
      return this.availabilitySlots.filter(s => s.day_of_week === dayIndex)
    },
    addSlot(dayIndex) {
      const existing = this.getSlots(dayIndex)
      let startTime = '09:00'
      let endTime = '17:00'

      if (existing.length > 0) {
        const lastSlot = existing[existing.length - 1]
        if (lastSlot.end_time) {
          const [h, m] = lastSlot.end_time.split(':').map(Number)
          const nextStartH = Math.min(22, (h || 9) + 1)
          const nextEndH = Math.min(23, nextStartH + 4)
          startTime = `${String(nextStartH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`
          endTime = `${String(nextEndH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`
        }
      }

      slotKeyCounter += 1
      this.availabilitySlots.push({
        _key: slotKeyCounter,
        day_of_week: dayIndex,
        start_time: startTime,
        end_time: endTime,
      })
    },
    removeSlot(dayIndex, idx) {
      const daySlots = this.availabilitySlots.filter(s => s.day_of_week === dayIndex)
      const target = daySlots[idx]
      const globalIdx = this.availabilitySlots.indexOf(target)
      if (globalIdx !== -1) {
        this.availabilitySlots.splice(globalIdx, 1)
      }
    },
    onHolidayTypeChange(newType) {
      if (newType === 'date' && !this.newHoliday.date) {
        this.newHoliday.date = getTodayDateString()
      } else if (newType === 'weekly' && this.newHoliday.recurring_day_of_week === null) {
        this.newHoliday.recurring_day_of_week = 5
      }
    },
    extractErrorMessage(error, defaultFallback = '') {
      const data = error.response?.data
      const isAr = this.$i18n.locale === 'ar'

      if (!data) {
        return error.message || defaultFallback || (isAr ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error')
      }

      // Check field errors first
      if (data.errors && typeof data.errors === 'object') {
        const errorList = []
        Object.keys(data.errors).forEach(key => {
          const val = data.errors[key]
          const msgs = Array.isArray(val) ? val : [val]
          msgs.forEach(msg => {
            let formatted = msg
            if (msg.includes('End time must be after start time') || key.includes('end_time')) {
              formatted = isAr ? 'وقت النهاية يجب أن يكون بعد وقت البداية' : 'End time must be after start time'
            } else if (msg.includes('Recurring holiday already exists') || key.includes('recurring_day_of_week')) {
              formatted = isAr ? 'تم تسجيل إجازة أسبوعية لهذا اليوم مسبقاً' : 'A recurring holiday already exists for this day'
            } else if (msg.includes('date') && msg.includes('required')) {
              formatted = isAr ? 'يرجى تحديد تاريخ الإجازة' : 'Holiday date is required'
            } else if (msg.includes('date')) {
              formatted = isAr ? 'تاريخ الإجازة غير صالح أو مسجل مسبقاً' : 'Holiday date is invalid or already registered'
            }
            errorList.push(formatted)
          })
        })
        if (errorList.length > 0) {
          return errorList.join(' • ')
        }
      }

      if (data.message && data.message !== 'Validation error') {
        if (data.message === 'Recurring holiday already exists for this day') {
          return isAr ? 'تم تسجيل إجازة أسبوعية لهذا اليوم مسبقاً' : 'Recurring holiday already exists for this day'
        }
        if (data.message === 'Unauthorized') {
          return isAr ? 'غير مصرح لك بتنفيذ هذه العملية' : 'Unauthorized operation'
        }
        if (data.message === 'User is not a doctor') {
          return isAr ? 'المستخدم ليس مسجلاً كطبيب' : 'User is not a doctor'
        }
        return data.message
      }

      if (data.error) {
        return data.error
      }

      return defaultFallback || (isAr ? 'حدث خطأ أثناء تنفيذ العملية' : 'An error occurred')
    },
    async fetchAvailability() {
      try {
        const res = await scheduleService.getAvailability(this.user.id)
        const slots = res.data || []
        const firstDurationSlot = slots.find(slot => slot.slot_duration_minutes)
        this.appointmentDuration = firstDurationSlot ? firstDurationSlot.slot_duration_minutes : 30
        this.availabilitySlots = slots.map(slot => {
          slotKeyCounter += 1
          return {
            _key: slotKeyCounter,
            day_of_week: slot.day_of_week,
            start_time: slot.start_time ? slot.start_time.substring(0, 5) : '09:00',
            end_time: slot.end_time ? slot.end_time.substring(0, 5) : '17:00',
          }
        })
      } catch (e) {
        // silent load
      }
    },
    async saveAvailability() {
      const isAr = this.$i18n.locale === 'ar'

      // Pre-validation: check empty or invalid times
      let invalidSlotError = null
      this.availabilitySlots.some(slot => {
        const dayLabel = this.dayName(slot.day_of_week)
        if (!slot.start_time || !slot.end_time) {
          invalidSlotError = {
            title: this.$t('messages.warning'),
            text: isAr
              ? `يرجى تحديد وقت البداية ووقت النهاية لجميع الفترات في يوم (${dayLabel})`
              : `Please set both start and end times for all slots on (${dayLabel})`,
            variant: 'warning',
          }
          return true
        }

        if (slot.end_time <= slot.start_time) {
          invalidSlotError = {
            title: this.$t('messages.error'),
            text: isAr
              ? `في يوم (${dayLabel}): وقت النهاية (${slot.end_time}) يجب أن يكون بعد وقت البداية (${slot.start_time})`
              : `On (${dayLabel}): End time (${slot.end_time}) must be after start time (${slot.start_time})`,
            variant: 'danger',
          }
          return true
        }
        return false
      })

      if (invalidSlotError) {
        this.$toast({
          component: ToastificationContent,
          props: invalidSlotError,
        })
        return
      }

      // Pre-validation: check overlapping slots on the same day
      let overlapError = null
      this.days.some(day => {
        const daySlots = this.getSlots(day.index)
        if (daySlots.length > 1) {
          const sorted = [...daySlots].sort((a, b) => a.start_time.localeCompare(b.start_time))
          for (let i = 0; i < sorted.length - 1; i += 1) {
            if (sorted[i].end_time > sorted[i + 1].start_time) {
              const dayLabel = this.dayName(day.index)
              overlapError = {
                title: this.$t('messages.warning'),
                text: isAr
                  ? `في يوم (${dayLabel}): توجد فترات عمل متداخلة (${sorted[i].start_time} - ${sorted[i].end_time}) مع (${sorted[i + 1].start_time} - ${sorted[i + 1].end_time})`
                  : `On (${dayLabel}): Overlapping slots (${sorted[i].start_time} - ${sorted[i].end_time}) with (${sorted[i + 1].start_time} - ${sorted[i + 1].end_time})`,
                variant: 'warning',
              }
              return true
            }
          }
        }
        return false
      })

      if (overlapError) {
        this.$toast({
          component: ToastificationContent,
          props: overlapError,
        })
        return
      }

      this.saving = true
      try {
        const slots = this.availabilitySlots
          .filter(r => r.start_time && r.end_time)
          .map(r => ({ day_of_week: r.day_of_week, start_time: r.start_time, end_time: r.end_time }))

        await scheduleService.updateAvailability(this.user.id, slots, Number(this.appointmentDuration) || 30)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.scheduleSaved'),
            variant: 'success',
          },
        })
      } catch (error) {
        const errorText = this.extractErrorMessage(error, this.$t('messages.scheduleSaveError'))
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: errorText,
            variant: 'danger',
          },
        })
      } finally {
        this.saving = false
      }
    },
    async fetchHolidays() {
      try {
        const params = {
          page: this.holidaysPagination.current_page,
        }
        const res = await scheduleService.getHolidays(this.user.id, params)
        this.holidays = res.data.data
        this.holidaysPagination = {
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          per_page: res.data.per_page,
          total: res.data.total,
        }
      } catch (e) {
        // silent
      }
    },
    async addHoliday() {
      const isAr = this.$i18n.locale === 'ar'

      if (this.newHoliday.type === 'date' && !this.newHoliday.date) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.warning'),
            text: isAr ? 'يرجى تحديد تاريخ الإجازة' : 'Please select a holiday date',
            variant: 'warning',
          },
        })
        return
      }

      if (this.newHoliday.type === 'weekly' && (this.newHoliday.recurring_day_of_week === null || this.newHoliday.recurring_day_of_week === undefined)) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.warning'),
            text: isAr ? 'يرجى تحديد يوم الإجازة الأسبوعية' : 'Please select a recurring day',
            variant: 'warning',
          },
        })
        return
      }

      this.addingHoliday = true
      try {
        const payload = {
          reason: this.newHoliday.reason,
        }

        if (this.newHoliday.type === 'weekly') {
          payload.recurring_day_of_week = this.newHoliday.recurring_day_of_week
        } else {
          payload.date = this.newHoliday.date
        }

        await scheduleService.addHoliday(this.user.id, payload)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.addSuccess'),
            variant: 'success',
          },
        })
        this.newHoliday = {
          type: 'date',
          date: getTodayDateString(),
          recurring_day_of_week: 5,
          reason: '',
        }
        this.fetchHolidays()
      } catch (error) {
        const errorText = this.extractErrorMessage(error, this.$t('messages.addHolidayError'))
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: errorText,
            variant: 'danger',
          },
        })
      } finally {
        this.addingHoliday = false
      }
    },
    async removeHoliday(item) {
      const isAr = this.$i18n.locale === 'ar'
      const result = await this.$swal({
        title: this.$t('messages.deleteConfirm'),
        text: this.holidayDisplay(item),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('actions.delete'),
        cancelButtonText: this.$t('actions.cancel') || (isAr ? 'إلغاء' : 'Cancel'),
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-secondary ml-1 mr-1',
        },
        buttonsStyling: false,
      })

      if (!result.isConfirmed) return

      try {
        await scheduleService.deleteHoliday(this.user.id, item.id)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.deleteSuccess'),
            variant: 'success',
          },
        })
        this.fetchHolidays()
      } catch (error) {
        const errorText = this.extractErrorMessage(error, this.$t('messages.deleteError'))
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: errorText,
            variant: 'danger',
          },
        })
      }
    },
    onHolidaysPageChange(page) {
      this.holidaysPagination.current_page = page
      this.fetchHolidays()
    },
    holidayDisplay(item) {
      if (item.recurring_day_of_week === null || item.recurring_day_of_week === undefined) {
        return item.date
      }

      return `${this.dayName(item.recurring_day_of_week)} (${this.$t('reservation.everyWeek')})`
    },
    paginationCountText(paginationState) {
      if (!paginationState?.total) return '0 / 0'
      const from = ((paginationState.current_page - 1) * paginationState.per_page) + 1
      const to = Math.min(paginationState.current_page * paginationState.per_page, paginationState.total)
      return `${from}-${to} / ${paginationState.total}`
    },
  },
}
</script>
