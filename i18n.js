'use strict';
const D = {
  ar: {
    title: 'بوابتي الجامعية', nDash: 'الرئيسية', nSched: 'الجدول', nGpa: 'المعدل والساعات', nTasks: 'الواجبات', nExams: 'الاختبارات', nCal: 'التقويم', nAna: 'التحليل',
    alertsH: 'التنبيهات', notif: 'تفعيل تنبيهات المتصفح', badgesH: 'لوحة الإنجازات', todayH: 'محاضرات اليوم', progH: 'تقدم الواجبات', backupH: 'النسخ الاحتياطي', exp: 'تصدير بياناتي', imp: 'استيراد نسخة',
    addCourse: 'إضافة مقرر', pName: 'اسم المقرر', pCr: 'الساعات', from: 'من', to: 'إلى', pGrade: 'الدرجة (اختياري)',
    gpaL: 'المعدل (من 5)', hrsL: 'الساعات المنجزة', reqL: 'إجمالي ساعات الخطة', gradesH: 'درجات المقررات',
    addTask: 'إضافة واجب', pTitle: 'عنوان الواجب', pCourse: 'المقرر', addExam: 'إضافة اختبار', prev: 'الشهر السابق', next: 'الشهر التالي',
    days: 'الأحد,الاثنين,الثلاثاء,الأربعاء,الخميس', wd: 'أحد,اثنين,ثلاثاء,أربعاء,خميس,جمعة,سبت',
    check: 'تحقق من المدخلات', lateTask: 'واجب متأخر: {0}', dueSoon: 'واجب «{0}» يسلَّم بعد {1} يوم', examSoon: 'اختبار {0} بعد {1} يوم', noAlerts: 'لا توجد تنبيهات. أنت على المسار الصحيح.',
    a1: 'أضفت أول مقرر', a2: 'معدل 4.5 أو أعلى', a3: 'أنجزت 5 واجبات', a4: 'أنجزت ربع الخطة', a5: 'بلا واجبات متأخرة',
    sGpa: 'المعدل', sHrs: 'الساعات', sPend: 'واجبات معلقة', sNext: 'أقرب اختبار', dayN: '{0} يوم', noLec: 'لا محاضرات', noToday: 'لا محاضرات اليوم', taskPct: '{0} من {1} منجز',
    exc: 'ممتاز', vg: 'جيد جدًا', gd: 'جيد', low: 'يحتاج تحسين', del: 'حذف',
    hint: 'أضف مقرراتك من قسم الجدول.', hrsN: '{0} ساعات', gradeOf: 'درجة {0}', noTasks: 'لا توجد واجبات بعد.', undo: 'تراجع', doneBtn: 'تم الإنجاز', general: 'عام', complete: 'مكتمل', late: 'متأخر', inN: 'بعد {0} يوم',
    noExams: 'لا توجد اختبارات بعد.', over: 'انتهى', comp: 'الالتزام بالواجبات: {0}%', lateN: '{0} واجب متأخر', focus: 'ركّز على «{0}» فهو أضعف مقرراتك', daily: 'خصص ساعة يوميًا لمراجعة المقررات الضعيفة',
    lateFirst: 'ابدأ بالواجبات المتأخرة قبل أي مهمة جديدة', revise: 'ابدأ مراجعة {0} الآن، الاختبار قريب', pace: 'وزّع الساعات القادمة لتبقى على المسار', strengths: 'نقاط القوة', weak: 'نقاط الضعف', tips: 'توصيات', needData: 'أضف درجات وواجبات ليظهر التحليل.',
    nTimer: 'المؤقت', tFocus: 'تركيز', tRest: 'استراحة', tStart: 'ابدأ', tPause: 'إيقاف مؤقت', tReset: 'إعادة', tFocusMin: 'دقائق التركيز', tRestMin: 'دقائق الاستراحة', tStats: 'إحصائيات التركيز',
    tSum: '{0} جلسة تركيز، {1} دقيقة', tDoneF: 'انتهت جلسة التركيز. خذ استراحة', tDoneR: 'انتهت الاستراحة. هيا نبدأ', a6: 'خمس جلسات تركيز',
    nSupport: 'المتصفح لا يسمح بالإشعارات هنا. جرّب Chrome على الحاسوب وتأكد أن الموقع يفتح بـ https', nDenied: 'الإشعارات محظورة. اضغط القفل بجانب رابط الموقع واسمح بالإشعارات ثم أعد المحاولة', nOk: 'تم تفعيل التنبيهات', nTest: 'إشعار تجريبي: التنبيهات تعمل'
  },
  en: {
    title: 'My Uni Hub', nDash: 'Home', nSched: 'Schedule', nGpa: 'GPA & Credits', nTasks: 'Assignments', nExams: 'Exams', nCal: 'Calendar', nAna: 'Insights',
    alertsH: 'Alerts', notif: 'Enable browser notifications', badgesH: 'Achievements', todayH: "Today's classes", progH: 'Assignment progress', backupH: 'Backup', exp: 'Export my data', imp: 'Import backup',
    addCourse: 'Add course', pName: 'Course name', pCr: 'Credits', from: 'From', to: 'To', pGrade: 'Grade (optional)',
    gpaL: 'GPA (out of 5)', hrsL: 'Credits completed', reqL: 'Total plan credits', gradesH: 'Course grades',
    addTask: 'Add assignment', pTitle: 'Assignment title', pCourse: 'Course', addExam: 'Add exam', prev: 'Previous month', next: 'Next month',
    days: 'Sunday,Monday,Tuesday,Wednesday,Thursday', wd: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
    check: 'Please check your inputs', lateTask: 'Overdue: {0}', dueSoon: '"{0}" is due in {1} day(s)', examSoon: '{0} exam in {1} day(s)', noAlerts: "No alerts. You're on track.",
    a1: 'Added first course', a2: 'GPA 4.5 or higher', a3: 'Finished 5 assignments', a4: 'A quarter of the plan done', a5: 'No overdue work',
    sGpa: 'GPA', sHrs: 'Credits', sPend: 'Pending assignments', sNext: 'Next exam', dayN: '{0} d', noLec: 'No classes', noToday: 'No classes today', taskPct: '{0} of {1} done',
    exc: 'Excellent', vg: 'Very good', gd: 'Good', low: 'Needs work', del: 'Delete',
    hint: 'Add your courses from the Schedule tab.', hrsN: '{0} credits', gradeOf: 'Grade for {0}', noTasks: 'No assignments yet.', undo: 'Undo', doneBtn: 'Mark done', general: 'General', complete: 'Done', late: 'Overdue', inN: 'in {0} day(s)',
    noExams: 'No exams yet.', over: 'Ended', comp: 'Assignment completion: {0}%', lateN: '{0} overdue assignment(s)', focus: 'Focus on "{0}", your weakest course', daily: 'Set aside an hour a day to review weak courses',
    lateFirst: 'Clear overdue assignments before new tasks', revise: 'Start revising {0} now, the exam is close', pace: 'Spread upcoming credits to stay on track', strengths: 'Strengths', weak: 'Weaknesses', tips: 'Recommendations', needData: 'Add grades and assignments to see insights.',
    nTimer: 'Timer', tFocus: 'Focus', tRest: 'Break', tStart: 'Start', tPause: 'Pause', tReset: 'Reset', tFocusMin: 'Focus minutes', tRestMin: 'Break minutes', tStats: 'Focus stats',
    tSum: '{0} focus sessions, {1} minutes', tDoneF: 'Focus session done. Take a break', tDoneR: 'Break over. Back to it', a6: '5 focus sessions',
    nSupport: 'Notifications are not available here. Try desktop Chrome and open the site over https', nDenied: 'Notifications are blocked. Click the lock next to the site address, allow notifications, then try again', nOk: 'Notifications enabled', nTest: 'Test notification: alerts work'
  }
};
const st = (k, v) => { try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v) } catch { } };
let lang = st('uniLang') === 'en' ? 'en' : 'ar';
const tr = (k, ...a) => (D[lang][k] ?? k).replace(/\{(\d)\}/g, (_, i) => a[i]),
  days = () => tr('days').split(',');
function setTheme(t) {
  document.documentElement.dataset.theme = t; st('uniTheme', t);
  document.getElementById('theme').textContent = t === 'dark' ? '☀️' : '🌙';
}
function applyI18n() {
  const r = document.documentElement; r.lang = lang; r.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.title = tr('title');
  document.querySelectorAll('[data-i]').forEach(e => e.textContent = tr(e.dataset.i));
  document.querySelectorAll('[data-p]').forEach(e => e.placeholder = tr(e.dataset.p));
  document.querySelectorAll('[name=day] option').forEach((o, i) => o.textContent = days()[i]);
  document.getElementById('lang').textContent = lang === 'ar' ? 'English' : 'العربية';
  if (typeof render === 'function') render();
}
document.getElementById('lang').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; st('uniLang', lang); applyI18n() };
document.getElementById('theme').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
setTheme(st('uniTheme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
applyI18n();
