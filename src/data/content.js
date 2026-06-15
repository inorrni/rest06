/* ============================================================
   content.js — all bilingual copy + demo data in one place.
   Each text is [ko, en]; render with t(...item).
   ============================================================ */

// left-rail 노선도 (linenav) — order matches the <section> stages below
export const NAV_STOPS = [
  ['출발', 'Start'],
  ['실시간 위치', 'Live location'],
  ['자율주행 소개', 'About'],
  ['운행 노선', 'Routes'],
  ['이용 방법', 'How to ride'],
  ['운행 현황', 'By the numbers'],
  ['자주 묻는 질문', 'FAQ'],
]

// header nav links (anchor + label)
export const HEADER_NAV = [
  ['#live', '실시간 위치', 'Live'],
  ['#about', '소개', 'About'],
  ['#route', '노선', 'Routes'],
  ['#howto', '이용 방법', 'How to ride'],
  ['#faq', 'FAQ', 'FAQ'],
]

// 02 ABOUT — features
export const FEATURES = [
  {
    icon: 'clock',
    title: ['레벨 4 자율주행', 'Level 4 autonomy'],
    body: ['운행 구간 내에서 스스로 주행·정차·정류합니다.', 'Drives, stops and parks on its own within the operating zone.'],
  },
  {
    icon: 'monitor',
    title: ['24시간 관제 모니터링', '24/7 control center'],
    body: ['관제센터가 모든 차량을 실시간으로 지켜봅니다.', 'A control room watches every vehicle in real time.'],
  },
  {
    icon: 'person',
    title: ['안전요원 동승', 'Safety attendant on board'],
    body: ['훈련된 안전요원이 함께 타고, 언제든 개입할 수 있습니다.', 'A trained attendant rides along and can take over anytime.'],
  },
]

// 03 ROUTE — operating routes
export const ROUTES = [
  {
    tag: 'A01',
    name: ['청계천 순환선', 'Cheonggye Loop'],
    desc: ['시청 · 광화문 · 청계광장 · 종로', 'City Hall · Gwanghwamun · Jongno'],
    stops: 6,
    headway: 8,
  },
  {
    tag: 'A02',
    name: ['여의도–마포선', 'Yeouido–Mapo'],
    desc: ['여의도공원 · 국회 · 합정', 'Yeouido Park · National Assembly · Hapjeong'],
    stops: 8,
    headway: 10,
  },
  {
    tag: 'A03',
    name: ['상암 DMC선', 'Sangam DMC'],
    desc: ['DMC역 · 미디어시티 · 월드컵공원', 'DMC Station · Media City · World Cup Park'],
    stops: 7,
    headway: 9,
  },
]

// 04 HOWTO — steps
export const STEPS = [
  {
    title: ['정류장에서 대기', 'Wait at the stop'],
    body: ['노선 위 자율주행버스 정류장에서 기다립니다.', 'Stand at a marked autonomous-bus stop along the route.'],
  },
  {
    title: ['도착 시간 확인', 'Check arrival'],
    body: ['이 페이지나 앱에서 실시간 위치와 도착 시간을 확인합니다.', 'See the live location and ETA on this page or the app.'],
  },
  {
    title: ['탑승 후 착석', 'Board & take a seat'],
    body: ['앞문으로 탑승해 좌석에 앉아 안전벨트를 매세요.', 'Board through the front door and fasten up in a seat.'],
  },
  {
    title: ['하차벨로 내리기', 'Press to alight'],
    body: ['내리기 전 하차벨을 누르면 안내와 함께 정차합니다.', 'Press the bell before your stop; the bus announces and stops.'],
  },
]

// 05 STATS — count-up figures
export const STATS = [
  { to: 128, dec: 0, suffix: ['만+', 'M+'], label: ['누적 탑승객', 'cumulative riders'] },
  { to: 42, dec: 0, suffix: ['만 km', '0k km'], label: ['누적 운행 거리', 'distance driven'] },
  { to: 540, dec: 0, suffix: ['일', 'days'], label: ['무사고 운행', 'accident-free days'] },
  { to: 98.6, dec: 1, suffix: ['%', '%'], label: ['정시 도착률', 'on-time rate'] },
]

// 06 FAQ
export const FAQS = [
  {
    q: ['정말 무료인가요?', 'Is it really free?'],
    a: ['네. 시범 운행 기간 동안 모든 자율주행버스 노선은 무료로 이용하실 수 있습니다.', 'Yes. During the pilot period all autonomous bus routes are free to ride.'],
  },
  {
    q: ['안전요원이 타고 있나요?', 'Is a person on board?'],
    a: ['모든 차량에는 훈련된 안전요원이 탑승해 운행을 지켜보며, 필요 시 언제든 수동으로 전환할 수 있습니다.', 'Every vehicle has a trained safety attendant who monitors the drive and can take manual control at any moment.'],
  },
  {
    q: ['사고나 비상 상황이 생기면?', 'What about an emergency?'],
    a: ['버스가 스스로 안전하게 정차하고 안전요원이 즉시 대응하며, 24시간 관제센터가 지원을 조율합니다.', 'The bus stops safely on its own, the attendant responds immediately, and the 24/7 control center coordinates support.'],
  },
  {
    q: ['휠체어도 탑승할 수 있나요?', 'Is it wheelchair accessible?'],
    a: ['네. 모든 차량은 저상버스로, 경사판과 휠체어 전용 공간을 갖추고 있습니다.', 'Yes. All vehicles are low-floor with a ramp and a dedicated wheelchair space.'],
  },
  {
    q: ['운행 시간은 어떻게 되나요?', 'What are the hours?'],
    a: ['매일 07:00–22:00 운행합니다. 노선과 기상 상황에 따라 달라질 수 있습니다.', 'Routes operate 07:00–22:00 daily. Hours may vary by route and weather conditions.'],
  },
]

// LIVE map demo — stops along the route (frac = position 0..1)
export const MAP_STOPS = [
  { frac: 0.04, ko: '시청 정류장', en: 'City Hall' },
  { frac: 0.20, ko: '광화문', en: 'Gwanghwamun' },
  { frac: 0.37, ko: '청계광장', en: 'Cheonggye Plaza' },
  { frac: 0.54, ko: '을지로입구', en: 'Euljiro 1-ga' },
  { frac: 0.70, ko: '동대문', en: 'Dongdaemun' },
  { frac: 0.86, ko: '종로3가', en: 'Jongno 3-ga' },
]

// LIVE map demo — buses
export const MAP_BUSES = [
  { no: 'A01-03', frac: 0.0, speed: 0.030, occ: 3, color: 'var(--brand)' },
  { no: 'A01-07', frac: 0.33, speed: 0.026, occ: 2, color: 'var(--brand-strong)' },
  { no: 'A01-11', frac: 0.66, speed: 0.034, occ: 4, color: '#f59e0b' },
]
