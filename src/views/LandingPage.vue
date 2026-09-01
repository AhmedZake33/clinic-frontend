<template>
  <div
    class="landing-page"
    :dir="isRtl ? 'rtl' : 'ltr'"
  >
    <!-- Top Navigation Bar -->
    <header class="landing-navbar-wrapper">
      <div class="container landing-navbar d-flex align-items-center justify-content-between">
        <!-- Brand / Logo -->
        <router-link
          to="/"
          class="landing-brand d-flex align-items-center text-decoration-none"
        >
          <div class="brand-icon-wrapper">
            <feather-icon
              icon="ActivityIcon"
              size="24"
              class="text-white"
            />
          </div>
          <div
            class="brand-text-wrapper"
            :class="isRtl ? 'mr-1' : 'ml-1'"
          >
            <span class="brand-title font-weight-bolder text-dark">{{ $t('clinic.brandText') || ($i18n.locale === 'ar' ? 'نظام العيادة' : 'Clinic System') }}</span>
            <span class="brand-badge text-muted small d-none d-sm-inline-block">{{ $t('landing.hero.badge') }}</span>
          </div>
        </router-link>

        <!-- Nav Links (Desktop) -->
        <nav class="landing-nav-links d-none d-lg-flex align-items-center">
          <a
            href="#overview"
            class="landing-nav-link"
          >{{ $t('landing.nav.home') }}</a>
          <a
            href="#video-guide"
            class="landing-nav-link"
          >{{ $t('landing.nav.video') }}</a>
          <a
            href="#features"
            class="landing-nav-link"
          >{{ $t('landing.nav.features') }}</a>
          <a
            href="#roles"
            class="landing-nav-link"
          >{{ $t('landing.nav.roles') }}</a>
          <a
            href="#contact"
            class="landing-nav-link"
          >{{ $t('landing.nav.contact') }}</a>
        </nav>

        <!-- Right Controls: Language & Login CTA -->
        <div class="landing-nav-actions d-flex align-items-center">
          <language-switcher :class="isRtl ? 'ml-1' : 'mr-1'" />

          <template v-if="isLoggedIn">
            <b-button
              variant="primary"
              class="btn-portal font-weight-bold shadow-sm d-inline-flex align-items-center"
              :to="{ name: dashboardRouteName }"
            >
              <feather-icon
                icon="LayoutIcon"
                size="16"
                :class="isRtl ? 'ml-50' : 'mr-50'"
              />
              <span>{{ $t('landing.nav.dashboard') }}</span>
            </b-button>
          </template>
          <template v-else>
            <b-button
              variant="primary"
              class="btn-portal font-weight-bold shadow-sm d-inline-flex align-items-center"
              :to="{ name: 'login' }"
            >
              <feather-icon
                icon="LogInIcon"
                size="16"
                :class="isRtl ? 'ml-50' : 'mr-50'"
              />
              <span>{{ $t('landing.nav.login') }}</span>
            </b-button>
          </template>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section
      id="overview"
      class="hero-section position-relative overflow-hidden"
    >
      <div class="hero-bg-glow" />
      <div class="container py-4 py-lg-5 position-relative">
        <b-row class="align-items-center">
          <!-- Hero Text -->
          <b-col
            lg="6"
            class="hero-content-col mb-4 mb-lg-0"
          >
            <div class="hero-badge-pill mb-2 d-inline-flex align-items-center">
              <span class="badge-dot" />
              <span class="badge-text">{{ $t('landing.hero.badge') }}</span>
            </div>

            <h1 class="hero-title font-weight-bolder text-primary mb-2">
              {{ $t('landing.hero.title') }}
            </h1>

            <p class="hero-subtitle text-muted mb-3 lead">
              {{ $t('landing.hero.subtitle') }}
            </p>

            <!-- CTA Buttons -->
            <div class="hero-cta-buttons d-flex flex-wrap align-items-center mt-3">
              <b-button
                variant="primary"
                size="lg"
                class="btn-hero-primary font-weight-bold px-3 py-2 mb-2 d-inline-flex align-items-center"
                :class="isRtl ? 'ml-2' : 'mr-2'"
                :to="{ name: isLoggedIn ? dashboardRouteName : 'login' }"
              >
                <feather-icon
                  :icon="isLoggedIn ? 'LayoutIcon' : 'LogInIcon'"
                  size="18"
                  :class="isRtl ? 'ml-50' : 'mr-50'"
                />
                <span>{{ isLoggedIn ? $t('landing.nav.dashboard') : $t('landing.hero.ctaLogin') }}</span>
              </b-button>

              <b-button
                variant="outline-primary"
                size="lg"
                href="#video-guide"
                class="btn-hero-secondary font-weight-bold px-3 py-2 mb-2 d-inline-flex align-items-center"
                :class="isRtl ? 'ml-2' : 'mr-2'"
              >
                <feather-icon
                  icon="PlayCircleIcon"
                  size="18"
                  :class="isRtl ? 'ml-50' : 'mr-50'"
                />
                <span>{{ $t('landing.nav.video') }}</span>
              </b-button>

              <b-button
                variant="outline-secondary"
                size="lg"
                href="#contact"
                class="btn-hero-secondary font-weight-bold px-3 py-2 mb-2 d-inline-flex align-items-center"
              >
                <feather-icon
                  icon="MailIcon"
                  size="18"
                  :class="isRtl ? 'ml-50' : 'mr-50'"
                />
                <span>{{ $t('landing.nav.contact') }}</span>
              </b-button>
            </div>

            <!-- Quick Trust Highlights -->
            <div class="hero-trust-items d-flex flex-wrap align-items-center mt-3 pt-2">
              <div
                class="trust-item d-flex align-items-center mb-1"
                :class="isRtl ? 'ml-3' : 'mr-3'"
              >
                <feather-icon
                  icon="CheckCircleIcon"
                  size="18"
                  class="text-success"
                  :class="isRtl ? 'ml-50' : 'mr-50'"
                />
                <span class="small font-weight-bold">{{ $t('landing.stats.rolesCount') }}</span>
              </div>
              <div
                class="trust-item d-flex align-items-center mb-1"
                :class="isRtl ? 'ml-3' : 'mr-3'"
              >
                <feather-icon
                  icon="CheckCircleIcon"
                  size="18"
                  class="text-success"
                  :class="isRtl ? 'ml-50' : 'mr-50'"
                />
                <span class="small font-weight-bold">{{ $t('landing.stats.realtime') }}</span>
              </div>
              <div
                class="trust-item d-flex align-items-center mb-1"
                :class="isRtl ? 'ml-3' : 'mr-3'"
              >
                <feather-icon
                  icon="CheckCircleIcon"
                  size="18"
                  class="text-success"
                  :class="isRtl ? 'ml-50' : 'mr-50'"
                />
                <span class="small font-weight-bold">{{ $t('landing.stats.bilingual') }}</span>
              </div>
            </div>
          </b-col>

          <!-- Hero Visual / Showcase Mockup -->
          <b-col lg="6">
            <div class="hero-visual-card p-3 p-md-4">
              <div class="mockup-header d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                <div class="d-flex align-items-center">
                  <span class="window-dot dot-red" />
                  <span class="window-dot dot-yellow mx-1" />
                  <span class="window-dot dot-green" />
                </div>
                <div class="small font-weight-bold text-muted d-flex align-items-center">
                  <feather-icon
                    icon="ShieldIcon"
                    size="14"
                    class="text-primary"
                    :class="isRtl ? 'ml-50' : 'mr-50'"
                  />
                  <span>{{ isRtl ? 'بوابة العيادة السحابية' : 'Clinic Cloud Portal' }}</span>
                </div>
                <b-badge
                  variant="light-success"
                  pill
                  class="font-weight-bold"
                >
                  ● {{ isRtl ? 'نظام مباشر' : 'Live System' }}
                </b-badge>
              </div>

              <!-- Interactive Mockup Content -->
              <div class="mockup-grid">
                <!-- Mini Metric 1: Live Waiting Queue -->
                <div class="mockup-metric-card p-2 mb-2 bg-white rounded shadow-xs d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center">
                    <div
                      class="metric-icon-box bg-light-primary text-primary p-2 rounded"
                      :class="isRtl ? 'ml-2' : 'mr-2'"
                    >
                      <feather-icon
                        icon="UsersIcon"
                        size="20"
                      />
                    </div>
                    <div>
                      <div class="font-weight-bolder text-dark">
                        {{ $t('landing.features.f2Title') }}
                      </div>
                      <div class="small text-muted">
                        {{ $t('landing.stats.realtimeLabel') }}
                      </div>
                    </div>
                  </div>
                  <b-badge
                    variant="primary"
                    class="p-1 font-weight-bold pulse-badge"
                  >
                    {{ isRtl ? 'طابور نشط' : 'Active Queue' }}
                  </b-badge>
                </div>

                <!-- Mini Metric 2: Doctor Clinical Exam -->
                <div class="mockup-metric-card p-2 mb-2 bg-white rounded shadow-xs d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center">
                    <div
                      class="metric-icon-box bg-light-info text-info p-2 rounded"
                      :class="isRtl ? 'ml-2' : 'mr-2'"
                    >
                      <feather-icon
                        icon="ActivityIcon"
                        size="20"
                      />
                    </div>
                    <div>
                      <div class="font-weight-bolder text-dark">
                        {{ $t('landing.features.f1Title') }}
                      </div>
                      <div class="small text-muted">
                        {{ isRtl ? 'فحص سريري وتوثيق الحالات' : 'Diagnosis & Anatomy Map' }}
                      </div>
                    </div>
                  </div>
                  <span class="text-success font-weight-bolder">✓ {{ isRtl ? 'جاهز' : 'Ready' }}</span>
                </div>

                <!-- Mini Metric 3: Cash & Financials -->
                <div class="mockup-metric-card p-2 bg-white rounded shadow-xs d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center">
                    <div
                      class="metric-icon-box bg-light-success text-success p-2 rounded"
                      :class="isRtl ? 'ml-2' : 'mr-2'"
                    >
                      <feather-icon
                        icon="DollarSignIcon"
                        size="20"
                      />
                    </div>
                    <div>
                      <div class="font-weight-bolder text-dark">
                        {{ $t('landing.features.f4Title') }}
                      </div>
                      <div class="small text-muted">
                        {{ isRtl ? 'تسجيل الفواتير والمصروفات' : 'Invoices & Transactions' }}
                      </div>
                    </div>
                  </div>
                  <b-badge
                    variant="light-success"
                    class="p-1 font-weight-bold"
                  >
                    {{ isRtl ? 'آلي' : 'Automated' }}
                  </b-badge>
                </div>
              </div>

              <!-- Mockup Floating Callout -->
              <div class="mockup-callout mt-3 p-2 bg-primary text-white rounded d-flex align-items-center justify-content-between shadow">
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="MailIcon"
                    size="22"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <div>
                    <div
                      class="font-weight-bold small text-white"
                      dir="ltr"
                    >
                      info.tafratech@gmail.com
                    </div>
                    <div
                      class="text-light"
                      style="font-size: 0.75rem;"
                    >
                      {{ isRtl ? 'الدعم الفني والاستفسارات' : 'Technical assistance & inquiries' }}
                    </div>
                  </div>
                </div>
                <a
                  href="mailto:info.tafratech@gmail.com"
                  class="btn btn-light btn-sm font-weight-bold text-primary"
                >
                  {{ $t('landing.contact.sendEmail') }}
                </a>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </section>

    <!-- Key Stats Counter Section -->
    <section class="stats-strip bg-white py-4 border-top border-bottom">
      <div class="container">
        <b-row class="text-center">
          <b-col
            cols="6"
            md="3"
            class="mb-3 mb-md-0 border-right-md"
          >
            <div class="stat-number font-weight-bolder text-primary">
              3+
            </div>
            <div class="stat-label text-muted small font-weight-bold">
              {{ $t('landing.stats.rolesLabel') }}
            </div>
          </b-col>
          <b-col
            cols="6"
            md="3"
            class="mb-3 mb-md-0 border-right-md"
          >
            <div class="stat-number font-weight-bolder text-primary">
              {{ $t('landing.stats.realtime') }}
            </div>
            <div class="stat-label text-muted small font-weight-bold">
              {{ $t('landing.stats.realtimeLabel') }}
            </div>
          </b-col>
          <b-col
            cols="6"
            md="3"
            class="border-right-md"
          >
            <div class="stat-number font-weight-bolder text-primary">
              {{ isRtl ? 'عربي / EN' : 'AR / EN' }}
            </div>
            <div class="stat-label text-muted small font-weight-bold">
              {{ $t('landing.stats.bilingualLabel') }}
            </div>
          </b-col>
          <b-col
            cols="6"
            md="3"
          >
            <div class="stat-number font-weight-bolder text-primary">
              100%
            </div>
            <div class="stat-label text-muted small font-weight-bold">
              {{ $t('landing.stats.securityLabel') }}
            </div>
          </b-col>
        </b-row>
      </div>
    </section>

    <!-- Video Demonstration & Walkthrough Section -->
    <section
      id="video-guide"
      class="video-guide-section py-5 position-relative"
    >
      <div class="container">
        <div class="section-header text-center max-w-700 mx-auto mb-4">
          <b-badge
            variant="light-primary"
            pill
            class="px-2 py-1 mb-2 font-weight-bold"
          >
            {{ $t('landing.video.badge') }}
          </b-badge>
          <h2 class="section-title font-weight-bolder mb-2 text-dark">
            {{ $t('landing.video.title') }}
          </h2>
          <p class="section-subtitle text-muted lead">
            {{ $t('landing.video.subtitle') }}
          </p>
        </div>

        <!-- Video Player / Interactive Simulator Container -->
        <b-row class="justify-content-center">
          <b-col
            cols="12"
            lg="11"
            xl="10"
          >
            <system-video-walkthrough />
          </b-col>
        </b-row>

        <!-- Video Key Highlights Chapters Grid (The 7 Doctor Modules) -->
        <div class="video-chapters-container mt-4 pt-2">
          <h4 class="text-center font-weight-bolder text-dark mb-3">
            {{ $t('landing.video.tipTitle') }}
          </h4>

          <b-row class="justify-content-center">
            <!-- 1. Dashboard -->
            <b-col
              cols="12"
              sm="6"
              lg="4"
              xl="3"
              class="mb-3"
            >
              <div class="chapter-card h-100 p-3 bg-white rounded shadow-xs border">
                <div class="d-flex align-items-center mb-2">
                  <div
                    class="chapter-icon-box bg-light-primary text-primary p-2 rounded"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  >
                    <feather-icon
                      icon="HomeIcon"
                      size="20"
                    />
                  </div>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ $t('landing.video.ch1Title') }}
                  </h6>
                </div>
                <p class="small text-muted mb-0">
                  {{ $t('landing.video.ch1Desc') }}
                </p>
              </div>
            </b-col>

            <!-- 2. Clients -->
            <b-col
              cols="12"
              sm="6"
              lg="4"
              xl="3"
              class="mb-3"
            >
              <div class="chapter-card h-100 p-3 bg-white rounded shadow-xs border">
                <div class="d-flex align-items-center mb-2">
                  <div
                    class="chapter-icon-box bg-light-info text-info p-2 rounded"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  >
                    <feather-icon
                      icon="UsersIcon"
                      size="20"
                    />
                  </div>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ $t('landing.video.ch2Title') }}
                  </h6>
                </div>
                <p class="small text-muted mb-0">
                  {{ $t('landing.video.ch2Desc') }}
                </p>
              </div>
            </b-col>

            <!-- 3. Reservations -->
            <b-col
              cols="12"
              sm="6"
              lg="4"
              xl="3"
              class="mb-3"
            >
              <div class="chapter-card h-100 p-3 bg-white rounded shadow-xs border">
                <div class="d-flex align-items-center mb-2">
                  <div
                    class="chapter-icon-box bg-light-warning text-warning p-2 rounded"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  >
                    <feather-icon
                      icon="ClipboardIcon"
                      size="20"
                    />
                  </div>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ $t('landing.video.ch3Title') }}
                  </h6>
                </div>
                <p class="small text-muted mb-0">
                  {{ $t('landing.video.ch3Desc') }}
                </p>
              </div>
            </b-col>

            <!-- 4. Waiting Queue -->
            <b-col
              cols="12"
              sm="6"
              lg="4"
              xl="3"
              class="mb-3"
            >
              <div class="chapter-card h-100 p-3 bg-white rounded shadow-xs border">
                <div class="d-flex align-items-center mb-2">
                  <div
                    class="chapter-icon-box bg-light-danger text-danger p-2 rounded"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  >
                    <feather-icon
                      icon="ListIcon"
                      size="20"
                    />
                  </div>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ $t('landing.video.ch4Title') }}
                  </h6>
                </div>
                <p class="small text-muted mb-0">
                  {{ $t('landing.video.ch4Desc') }}
                </p>
              </div>
            </b-col>

            <!-- 5. Financials -->
            <b-col
              cols="12"
              sm="6"
              lg="4"
              xl="4"
              class="mb-3"
            >
              <div class="chapter-card h-100 p-3 bg-white rounded shadow-xs border">
                <div class="d-flex align-items-center mb-2">
                  <div
                    class="chapter-icon-box bg-light-success text-success p-2 rounded"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  >
                    <feather-icon
                      icon="DollarSignIcon"
                      size="20"
                    />
                  </div>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ $t('landing.video.ch5Title') }}
                  </h6>
                </div>
                <p class="small text-muted mb-0">
                  {{ $t('landing.video.ch5Desc') }}
                </p>
              </div>
            </b-col>

            <!-- 6. Transactions -->
            <b-col
              cols="12"
              sm="6"
              lg="4"
              xl="4"
              class="mb-3"
            >
              <div class="chapter-card h-100 p-3 bg-white rounded shadow-xs border">
                <div class="d-flex align-items-center mb-2">
                  <div
                    class="chapter-icon-box bg-light-primary text-primary p-2 rounded"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  >
                    <feather-icon
                      icon="CreditCardIcon"
                      size="20"
                    />
                  </div>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ $t('landing.video.ch6Title') }}
                  </h6>
                </div>
                <p class="small text-muted mb-0">
                  {{ $t('landing.video.ch6Desc') }}
                </p>
              </div>
            </b-col>

            <!-- 7. Reports -->
            <b-col
              cols="12"
              sm="6"
              lg="4"
              xl="4"
              class="mb-3"
            >
              <div class="chapter-card h-100 p-3 bg-white rounded shadow-xs border">
                <div class="d-flex align-items-center mb-2">
                  <div
                    class="chapter-icon-box bg-light-info text-info p-2 rounded"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  >
                    <feather-icon
                      icon="BarChart2Icon"
                      size="20"
                    />
                  </div>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ $t('landing.video.ch7Title') }}
                  </h6>
                </div>
                <p class="small text-muted mb-0">
                  {{ $t('landing.video.ch7Desc') }}
                </p>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </section>

    <!-- Core Features Grid Section -->
    <section
      id="features"
      class="features-section py-5 bg-white"
    >
      <div class="container">
        <div class="section-header text-center max-w-700 mx-auto mb-5">
          <b-badge
            variant="light-primary"
            pill
            class="px-2 py-1 mb-2 font-weight-bold"
          >
            {{ $t('landing.nav.features') }}
          </b-badge>
          <h2 class="section-title font-weight-bolder mb-2 text-dark">
            {{ $t('landing.features.title') }}
          </h2>
          <p class="section-subtitle text-muted lead">
            {{ $t('landing.features.subtitle') }}
          </p>
        </div>

        <b-row>
          <!-- Feature 1: Clinical Diagnosis & Anatomy Map -->
          <b-col
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="feature-card h-100 p-4 bg-white rounded-lg shadow-sm border transition-hover">
              <div class="feature-icon bg-light-primary text-primary p-3 rounded-circle mb-3 d-inline-flex">
                <feather-icon
                  icon="ActivityIcon"
                  size="28"
                />
              </div>
              <h4 class="feature-card-title font-weight-bold mb-2">
                {{ $t('landing.features.f1Title') }}
              </h4>
              <p class="feature-card-desc text-muted mb-0">
                {{ $t('landing.features.f1Desc') }}
              </p>
            </div>
          </b-col>

          <!-- Feature 2: Real-time Waiting Queue -->
          <b-col
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="feature-card h-100 p-4 bg-white rounded-lg shadow-sm border transition-hover">
              <div class="feature-icon bg-light-danger text-danger p-3 rounded-circle mb-3 d-inline-flex">
                <feather-icon
                  icon="UsersIcon"
                  size="28"
                />
              </div>
              <h4 class="feature-card-title font-weight-bold mb-2">
                {{ $t('landing.features.f2Title') }}
              </h4>
              <p class="feature-card-desc text-muted mb-0">
                {{ $t('landing.features.f2Desc') }}
              </p>
            </div>
          </b-col>

          <!-- Feature 3: Smart Appointment Scheduling -->
          <b-col
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="feature-card h-100 p-4 bg-white rounded-lg shadow-sm border transition-hover">
              <div class="feature-icon bg-light-warning text-warning p-3 rounded-circle mb-3 d-inline-flex">
                <feather-icon
                  icon="CalendarIcon"
                  size="28"
                />
              </div>
              <h4 class="feature-card-title font-weight-bold mb-2">
                {{ $t('landing.features.f3Title') }}
              </h4>
              <p class="feature-card-desc text-muted mb-0">
                {{ $t('landing.features.f3Desc') }}
              </p>
            </div>
          </b-col>

          <!-- Feature 4: Financials & Cash Transactions -->
          <b-col
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="feature-card h-100 p-4 bg-white rounded-lg shadow-sm border transition-hover">
              <div class="feature-icon bg-light-success text-success p-3 rounded-circle mb-3 d-inline-flex">
                <feather-icon
                  icon="DollarSignIcon"
                  size="28"
                />
              </div>
              <h4 class="feature-card-title font-weight-bold mb-2">
                {{ $t('landing.features.f4Title') }}
              </h4>
              <p class="feature-card-desc text-muted mb-0">
                {{ $t('landing.features.f4Desc') }}
              </p>
            </div>
          </b-col>

          <!-- Feature 5: Patient Profiles & Medical History -->
          <b-col
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="feature-card h-100 p-4 bg-white rounded-lg shadow-sm border transition-hover">
              <div class="feature-icon bg-light-info text-info p-3 rounded-circle mb-3 d-inline-flex">
                <feather-icon
                  icon="FileTextIcon"
                  size="28"
                />
              </div>
              <h4 class="feature-card-title font-weight-bold mb-2">
                {{ $t('landing.features.f5Title') }}
              </h4>
              <p class="feature-card-desc text-muted mb-0">
                {{ $t('landing.features.f5Desc') }}
              </p>
            </div>
          </b-col>

          <!-- Feature 6: Role-Based Permissions -->
          <b-col
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="feature-card h-100 p-4 bg-white rounded-lg shadow-sm border transition-hover">
              <div class="feature-icon bg-light-secondary text-secondary p-3 rounded-circle mb-3 d-inline-flex">
                <feather-icon
                  icon="ShieldIcon"
                  size="28"
                />
              </div>
              <h4 class="feature-card-title font-weight-bold mb-2">
                {{ $t('landing.features.f6Title') }}
              </h4>
              <p class="feature-card-desc text-muted mb-0">
                {{ $t('landing.features.f6Desc') }}
              </p>
            </div>
          </b-col>
        </b-row>
      </div>
    </section>

    <!-- Role-Based Workflows Section -->
    <section
      id="roles"
      class="roles-section py-5 bg-light position-relative"
    >
      <div class="container">
        <div class="section-header text-center max-w-700 mx-auto mb-5">
          <b-badge
            variant="light-primary"
            pill
            class="px-2 py-1 mb-2 font-weight-bold"
          >
            {{ $t('landing.nav.roles') }}
          </b-badge>
          <h2 class="section-title font-weight-bolder mb-2 text-dark">
            {{ $t('landing.roles.title') }}
          </h2>
          <p class="section-subtitle text-muted lead">
            {{ $t('landing.roles.subtitle') }}
          </p>
        </div>

        <b-row class="align-items-stretch">
          <!-- Role 1: Doctor -->
          <b-col
            lg="4"
            class="mb-4"
          >
            <div class="role-card h-100 p-4 bg-white rounded-lg shadow-sm border d-flex flex-column">
              <div class="role-card-header d-flex align-items-center mb-3">
                <div
                  class="role-icon bg-primary text-white p-3 rounded"
                  :class="isRtl ? 'ml-3' : 'mr-3'"
                >
                  <feather-icon
                    icon="HeartIcon"
                    size="24"
                  />
                </div>
                <div>
                  <h4 class="role-title font-weight-bolder mb-0 text-primary">
                    {{ $t('landing.roles.doctorTitle') }}
                  </h4>
                  <span class="text-muted small">{{ isRtl ? 'الكشف والتشخيص السريري' : 'Clinical & Diagnosis' }}</span>
                </div>
              </div>
              <p class="role-desc text-muted mb-3">
                {{ $t('landing.roles.doctorDesc') }}
              </p>

              <ul class="role-points-list list-unstyled mb-4 flex-grow-1">
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.doctorPoint1') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.doctorPoint2') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.doctorPoint3') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.doctorPoint4') }}</span>
                </li>
              </ul>

              <b-button
                variant="outline-primary"
                block
                class="font-weight-bold d-flex align-items-center justify-content-center"
                :to="{ name: 'login' }"
              >
                <span>{{ $t('landing.nav.login') }}</span>
                <feather-icon
                  :icon="isRtl ? 'ArrowLeftIcon' : 'ArrowRightIcon'"
                  size="16"
                  :class="isRtl ? 'mr-50' : 'ml-50'"
                />
              </b-button>
            </div>
          </b-col>

          <!-- Role 2: Assistant / Reception -->
          <b-col
            lg="4"
            class="mb-4"
          >
            <div class="role-card h-100 p-4 bg-white rounded-lg shadow-sm border d-flex flex-column">
              <div class="role-card-header d-flex align-items-center mb-3">
                <div
                  class="role-icon bg-success text-white p-3 rounded"
                  :class="isRtl ? 'ml-3' : 'mr-3'"
                >
                  <feather-icon
                    icon="UserCheckIcon"
                    size="24"
                  />
                </div>
                <div>
                  <h4 class="role-title font-weight-bolder mb-0 text-success">
                    {{ $t('landing.roles.assistantTitle') }}
                  </h4>
                  <span class="text-muted small">{{ isRtl ? 'الاستقبال وإدارة الطابور' : 'Reception & Queue' }}</span>
                </div>
              </div>
              <p class="role-desc text-muted mb-3">
                {{ $t('landing.roles.assistantDesc') }}
              </p>

              <ul class="role-points-list list-unstyled mb-4 flex-grow-1">
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.assistantPoint1') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.assistantPoint2') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.assistantPoint3') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.assistantPoint4') }}</span>
                </li>
              </ul>

              <b-button
                variant="outline-success"
                block
                class="font-weight-bold d-flex align-items-center justify-content-center"
                :to="{ name: 'login' }"
              >
                <span>{{ $t('landing.nav.login') }}</span>
                <feather-icon
                  :icon="isRtl ? 'ArrowLeftIcon' : 'ArrowRightIcon'"
                  size="16"
                  :class="isRtl ? 'mr-50' : 'ml-50'"
                />
              </b-button>
            </div>
          </b-col>

          <!-- Role 3: Admin -->
          <b-col
            lg="4"
            class="mb-4"
          >
            <div class="role-card h-100 p-4 bg-white rounded-lg shadow-sm border d-flex flex-column">
              <div class="role-card-header d-flex align-items-center mb-3">
                <div
                  class="role-icon bg-secondary text-white p-3 rounded"
                  :class="isRtl ? 'ml-3' : 'mr-3'"
                >
                  <feather-icon
                    icon="SlidersIcon"
                    size="24"
                  />
                </div>
                <div>
                  <h4 class="role-title font-weight-bolder mb-0 text-secondary">
                    {{ $t('landing.roles.adminTitle') }}
                  </h4>
                  <span class="text-muted small">{{ isRtl ? 'الإدارة والتحكم الشامل' : 'Administration & Growth' }}</span>
                </div>
              </div>
              <p class="role-desc text-muted mb-3">
                {{ $t('landing.roles.adminDesc') }}
              </p>

              <ul class="role-points-list list-unstyled mb-4 flex-grow-1">
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.adminPoint1') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.adminPoint2') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.adminPoint3') }}</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <feather-icon
                    icon="CheckIcon"
                    size="18"
                    class="text-success mt-25 flex-shrink-0"
                    :class="isRtl ? 'ml-2' : 'mr-2'"
                  />
                  <span class="small font-weight-600">{{ $t('landing.roles.adminPoint4') }}</span>
                </li>
              </ul>

              <b-button
                variant="outline-secondary"
                block
                class="font-weight-bold d-flex align-items-center justify-content-center"
                :to="{ name: 'login' }"
              >
                <span>{{ $t('landing.nav.login') }}</span>
                <feather-icon
                  :icon="isRtl ? 'ArrowLeftIcon' : 'ArrowRightIcon'"
                  size="16"
                  :class="isRtl ? 'mr-50' : 'ml-50'"
                />
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </section>

    <!-- Contact & Technical Support Section -->
    <section
      id="contact"
      class="contact-section py-5 bg-white position-relative"
    >
      <div class="container">
        <div class="section-header text-center max-w-700 mx-auto mb-4">
          <b-badge
            variant="light-primary"
            pill
            class="px-2 py-1 mb-2 font-weight-bold"
          >
            {{ $t('landing.nav.contact') }}
          </b-badge>
          <h2 class="section-title font-weight-bolder mb-2 text-dark">
            {{ $t('landing.contact.title') }}
          </h2>
          <p class="section-subtitle text-muted lead">
            {{ $t('landing.contact.subtitle') }}
          </p>
        </div>

        <b-row class="justify-content-center">
          <b-col
            md="8"
            lg="6"
          >
            <div class="contact-card p-4 rounded-lg bg-light-primary border-primary text-center shadow-sm">
              <div class="contact-icon-box bg-primary text-white rounded-circle p-3 mx-auto mb-3 d-inline-flex shadow">
                <feather-icon
                  icon="MailIcon"
                  size="32"
                />
              </div>

              <h4 class="font-weight-bolder text-dark mb-1">
                {{ $t('landing.contact.emailLabel') }}
              </h4>
              <p class="text-muted small mb-3">
                {{ $t('landing.contact.hours') }}
              </p>

              <div class="email-display-box p-3 bg-white rounded shadow-xs mb-3 d-flex align-items-center justify-content-center">
                <feather-icon
                  icon="SendIcon"
                  size="20"
                  class="text-primary flex-shrink-0"
                  :class="isRtl ? 'ml-2' : 'mr-2'"
                />
                <a
                  href="mailto:info.tafratech@gmail.com"
                  class="email-link font-weight-bolder text-primary text-break"
                  dir="ltr"
                >
                  info.tafratech@gmail.com
                </a>
              </div>

              <b-button
                variant="primary"
                size="lg"
                href="mailto:info.tafratech@gmail.com"
                class="font-weight-bold px-4 py-2 shadow-sm d-inline-flex align-items-center justify-content-center mx-auto"
              >
                <feather-icon
                  icon="MailIcon"
                  size="18"
                  :class="isRtl ? 'ml-50' : 'mr-50'"
                />
                <span>{{ $t('landing.contact.sendEmail') }}</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </section>

    <!-- Bottom Action CTA Banner -->
    <section class="cta-banner-section py-5 position-relative text-white">
      <div class="container text-center py-4 position-relative">
        <div class="max-w-700 mx-auto">
          <div class="cta-icon-wrapper mb-3 mx-auto">
            <feather-icon
              icon="AwardIcon"
              size="36"
              class="text-white"
            />
          </div>
          <h2 class="text-white font-weight-bolder mb-2 display-5">
            {{ $t('landing.cta.title') }}
          </h2>
          <p class="text-white-50 lead mb-4">
            {{ $t('landing.cta.subtitle') }}
          </p>

          <b-button
            variant="light"
            size="lg"
            class="btn-cta-white font-weight-bolder text-primary px-4 py-2 shadow-lg d-inline-flex align-items-center justify-content-center mx-auto"
            :to="{ name: isLoggedIn ? dashboardRouteName : 'login' }"
          >
            <feather-icon
              :icon="isLoggedIn ? 'LayoutIcon' : 'LogInIcon'"
              size="20"
              :class="isRtl ? 'ml-50' : 'mr-50'"
            />
            <span>{{ isLoggedIn ? $t('landing.nav.dashboard') : $t('landing.cta.button') }}</span>
          </b-button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer py-4 bg-dark text-white border-top border-secondary">
      <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between text-center">
        <div
          class="mb-3 mb-md-0"
          :class="isRtl ? 'text-md-right' : 'text-md-left'"
        >
          <div
            class="d-flex align-items-center justify-content-center mb-1"
            :class="isRtl ? 'justify-content-md-start' : 'justify-content-md-start'"
          >
            <feather-icon
              icon="ActivityIcon"
              size="20"
              class="text-primary"
              :class="isRtl ? 'ml-1' : 'mr-1'"
            />
            <span class="font-weight-bold text-white">{{ $t('clinic.brandText') || ($i18n.locale === 'ar' ? 'نظام العيادة' : 'Clinic System') }}</span>
          </div>
          <p class="text-muted small mb-1">
            {{ $t('landing.footer.tagline') }}
          </p>
          <p class="text-muted small mb-0">
            <feather-icon
              icon="MailIcon"
              size="14"
              class="text-primary"
              :class="isRtl ? 'ml-50' : 'mr-50'"
            />
            <a
              href="mailto:info.tafratech@gmail.com"
              class="text-light"
              dir="ltr"
            >info.tafratech@gmail.com</a>
          </p>
        </div>

        <div class="d-flex align-items-center justify-content-center flex-wrap">
          <router-link
            :to="{ name: 'login' }"
            class="text-muted small mx-2 text-decoration-none"
          >
            {{ $t('landing.nav.login') }}
          </router-link>
          <a
            href="#video-guide"
            class="text-muted small mx-2 text-decoration-none"
          >
            {{ $t('landing.nav.video') }}
          </a>
          <a
            href="#features"
            class="text-muted small mx-2 text-decoration-none"
          >
            {{ $t('landing.nav.features') }}
          </a>
          <a
            href="#roles"
            class="text-muted small mx-2 text-decoration-none"
          >
            {{ $t('landing.nav.roles') }}
          </a>
          <a
            href="#contact"
            class="text-muted small mx-2 text-decoration-none"
          >
            {{ $t('landing.nav.contact') }}
          </a>
        </div>
      </div>
      <div class="container text-center mt-3 pt-3 border-top border-secondary">
        <p class="text-muted small mb-0">
          © {{ new Date().getFullYear() }} {{ $t('landing.footer.rights') }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BButton,
  BBadge,
} from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import SystemVideoWalkthrough from '@/components/SystemVideoWalkthrough.vue'

export default {
  name: 'LandingPage',
  components: {
    BRow,
    BCol,
    BButton,
    BBadge,
    SystemVideoWalkthrough,
  },
  computed: {
    ...mapGetters('language', ['currentLocale']),
    isRtl() {
      const activeLocale = this.currentLocale || this.$i18n?.locale || localStorage.getItem('locale') || 'en'
      return activeLocale === 'ar'
    },
    isLoggedIn() {
      return Boolean(this.$store.getters['auth/isLoggedIn'] || localStorage.getItem('token'))
    },
    currentUser() {
      try {
        return this.$store.state.auth?.user || JSON.parse(localStorage.getItem('user') || 'null')
      } catch (e) {
        return null
      }
    },
    dashboardRouteName() {
      const role = this.currentUser?.role
      if (role === 'doctor') return 'doctor-dashboard'
      if (role === 'assistant') return 'assistant-dashboard'
      if (role === 'sub-doctor') return 'doctor-reservations'
      return 'dashboard'
    },
  },
  watch: {
    isRtl: {
      immediate: true,
      handler(val) {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('dir', val ? 'rtl' : 'ltr')
          document.documentElement.setAttribute('lang', val ? 'ar' : 'en')
        }
      },
    },
  },
  mounted() {
    const locale = this.currentLocale || this.$i18n?.locale || localStorage.getItem('locale') || 'en'
    const isRtl = locale === 'ar'
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', locale)
  },
}
</script>

<style lang="scss" scoped>
.landing-page {
  font-family: inherit;
  color: #2c3e50;
  background-color: #f8f9fa;
  min-height: 100vh;

  &[dir='rtl'] {
    direction: rtl;
    text-align: right;

    .hero-content-col {
      text-align: right;
    }

    .hero-cta-buttons,
    .hero-trust-items {
      justify-content: flex-start;
    }

    .feature-card,
    .role-card,
    .chapter-card {
      text-align: right;
    }

    .hero-title,
    .section-title,
    .feature-card-title,
    .role-title {
      letter-spacing: normal !important;
    }
  }

  &[dir='ltr'] {
    direction: ltr;
    text-align: left;

    .hero-content-col {
      text-align: left;
    }

    .hero-cta-buttons,
    .hero-trust-items {
      justify-content: flex-start;
    }

    .feature-card,
    .role-card,
    .chapter-card {
      text-align: left;
    }
  }

  @media (max-width: 991.98px) {
    .hero-content-col {
      text-align: center !important;
    }

    .hero-cta-buttons,
    .hero-trust-items {
      justify-content: center !important;
    }
  }
}

/* Navbar */
.landing-navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 1020;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 0.85rem 0;
}

.brand-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7367f0 0%, #9055fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.35);
  flex-shrink: 0;
}

.brand-title {
  font-size: 1.25rem;
  color: #333;
  display: block;
  line-height: 1.2;
}

.brand-badge {
  font-size: 0.75rem;
}

.landing-nav-link {
  color: #5e5873;
  font-weight: 600;
  margin: 0 1rem;
  transition: color 0.2s ease;
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    color: #7367f0;
  }
}

.btn-portal {
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
}

/* Hero Section */
.hero-section {
  padding: 4rem 0 3rem 0;
  background: radial-gradient(circle at top right, rgba(115, 103, 240, 0.08), transparent 50%),
              radial-gradient(circle at bottom left, rgba(40, 199, 111, 0.05), transparent 50%);
}

.hero-bg-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(115, 103, 240, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}

.hero-badge-pill {
  background-color: #edeefd;
  color: #7367f0;
  padding: 0.35rem 0.85rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(115, 103, 240, 0.15);

  .badge-dot {
    width: 8px;
    height: 8px;
    background-color: #7367f0;
    border-radius: 50%;
    margin-right: 6px;
    margin-left: 6px;
  }
}

.hero-title {
  font-size: 2.2rem;
  line-height: 1.35;

  @media (min-width: 992px) {
    font-size: 2.75rem;
  }
}

.hero-subtitle {
  font-size: 1.08rem;
  line-height: 1.7;
  max-width: 580px;
}

.btn-hero-primary {
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(115, 103, 240, 0.35);
}

.btn-hero-secondary {
  border-radius: 10px;
}

.hero-visual-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  border: 1px solid #ebe9f1;
}

.window-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;

  &.dot-red { background-color: #ea5455; }
  &.dot-yellow { background-color: #ff9f43; }
  &.dot-green { background-color: #28c76f; }
}

.mockup-metric-card {
  border: 1px solid #f0f0f5;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.pulse-badge {
  animation: pulseAnimation 2s infinite;
}

@keyframes pulseAnimation {
  0% { opacity: 0.85; }
  50% { opacity: 1; transform: scale(1.03); }
  100% { opacity: 0.85; }
}

/* Stats Strip */
.stats-strip {
  .stat-number {
    font-size: 1.8rem;
    line-height: 1.2;
  }
}

@media (min-width: 768px) {
  .border-right-md {
    border-right: 1px solid #ebe9f1;
  }
}

/* Video Section */
.video-guide-section {
  background: linear-gradient(180deg, #f8f9fa 0%, #edf0f5 100%);
}

.video-showcase-card {
  border-radius: 16px;
  border: 1px solid #d8d6de;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
}

.video-card-topbar {
  background-color: #1e1e2d !important;
  border-bottom: 1px solid #2d2d3f;
}

.badge-light-danger {
  background-color: rgba(234, 84, 85, 0.15);
  color: #ea5455;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ea5455;
    color: #fff;
  }
}

.video-frame-wrapper {
  background-color: #000;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.chapter-card {
  border: 1px solid #ebe9f1;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06) !important;
  }
}

.chapter-icon-box {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Features */
.max-w-700 {
  max-width: 700px;
}

.transition-hover {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08) !important;
  }
}

.feature-card-title {
  color: #333;
  font-size: 1.15rem;
}

.feature-card-desc {
  font-size: 0.92rem;
  line-height: 1.55;
}

/* Roles */
.role-card {
  border: 1px solid #ebe9f1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07) !important;
  }
}

.role-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.font-weight-600 {
  font-weight: 600;
}

/* Contact & Support Section */
.contact-section {
  .contact-card {
    border: 1px solid rgba(115, 103, 240, 0.25);
    background-color: #f8f8ff;
  }

  .contact-icon-box {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .email-display-box {
    border: 1px dashed #7367f0;
  }

  .email-link {
    font-size: 1.15rem;
    color: #7367f0;
    text-decoration: none;
    letter-spacing: 0.5px;

    &:hover {
      text-decoration: underline;
    }
  }
}

/* CTA Banner */
.cta-banner-section {
  background: linear-gradient(135deg, #7367f0 0%, #4839eb 100%);
}

.cta-icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cta-white {
  border-radius: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
}
</style>
