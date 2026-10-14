
  // ==========================================
  // ==========================================
// محرك استوديو عروض الأسعار (Quotation Studio Engine)
// ==========================================
let qtCurrency = "$";
let quotationItems = [
  {
    desc: "حفارة هيدروليكية مجنزرة SCOR PRO-350",
    specs: "محرك Cummins QSM11 بقوة 335 حصان | أقصى عمق حفر 7.35 م | سعة المغرفة 1.8 م³ | كابينة مشغل مكيفة مع نظام أمان ROPS/FOPS",
    qty: 1,
    price: 145000,
    imgSrc: ""
  },
  {
    desc: "جرافة شاقة SCOR LOAD-500",
    specs: "محرك Weichai WD10 بقوة 220 حصان | سعة المغرفة 3.5 م³ | حمولة تشغيلية 5,000 كجم | نظام هيدروليكي مزدوج",
    qty: 1,
    price: 118000,
    imgSrc: ""
  }
];

function renderQuotationTable() {
  const tbody = document.getElementById('quotationItemsTableBody');
  if(!tbody) return;
  tbody.innerHTML = '';

  quotationItems.forEach((item, idx) => {
    const tr = document.createElement('tr');
    const total = item.qty * item.price;
    const thumbContent = item.imgSrc ? 
      '<img src="' + item.imgSrc + '" class="w-full h-full object-cover rounded" />' :
      '<span class="text-xl">🚜</span>';

    tr.innerHTML = 
      '<td style="text-align:center; font-weight:bold;">' + (idx + 1) + '</td>' +
      '<td style="text-align:center;">' +
        '<div class="product-thumb-container" onclick="triggerQtImgUpload(this)">' +
          thumbContent +
          '<span class="text-[9px] text-gray-500 absolute bottom-0 bg-white/80 w-full text-center no-print">صورة</span>' +
          '<input type="file" accept="image/*" class="hidden" onchange="previewQtThumb(this, ' + idx + ')">' +
        '</div>' +
      '</td>' +
      '<td>' +
        '<input type="text" value="' + item.desc + '" oninput="quotationItems[' + idx + '].desc = this.value" class="font-bold text-gray-900 text-xs mb-1" placeholder="اسم المعدة / البند...">' +
        '<textarea oninput="quotationItems[' + idx + '].specs = this.value" rows="2" class="w-full text-[10px] text-gray-600 bg-transparent border-0 outline-none resize-none" placeholder="المواصفات الفنية التفصيلية للمعدة والمحرك والملحقات...">' + item.specs + '</textarea>' +
      '</td>' +
      '<td style="text-align:center;">' +
        '<input type="number" min="1" value="' + item.qty + '" oninput="quotationItems[' + idx + '].qty = Math.max(1, parseInt(this.value)||1); calculateQuotationTotals();" style="text-align:center; font-weight:bold;">' +
      '</td>' +
      '<td style="text-align:center;">' +
        '<input type="number" min="0" value="' + item.price + '" oninput="quotationItems[' + idx + '].price = Math.max(0, parseFloat(this.value)||0); calculateQuotationTotals();" style="text-align:center; font-weight:bold;">' +
      '</td>' +
      '<td style="text-align:center; font-weight:black; color:#111;">' +
        qtCurrency + total.toLocaleString() +
      '</td>' +
      '<td style="text-align:center;" class="no-print">' +
        '<button onclick="deleteQuotationItem(' + idx + ')" class="text-red-500 hover:text-red-700 font-black text-sm">✖</button>' +
      '</td>';
    tbody.appendChild(tr);
  });

  calculateQuotationTotals();
}

function addQuotationRow(desc, qty, price, imgSrc, specs) {
  imgSrc = imgSrc || '';
  specs = specs || '';
  quotationItems.push({ desc: desc, qty: qty, price: price, imgSrc: imgSrc, specs: specs });
  renderQuotationTable();
}

function deleteQuotationItem(idx) {
  if(quotationItems.length > 1) {
    quotationItems.splice(idx, 1);
    renderQuotationTable();
  } else {
    alert('يجب الإبقاء على بند واحد على الأقل في عرض السعر.');
  }
}

function addPredefinedMachineToQuotation(key) {
  if(key === 'excavator_350') {
    addQuotationRow('حفارة هيدروليكية مجنزرة SCOR PRO-350', 1, 145000, '', 'محرك Cummins QSM11 بقوة 335 حصان | أقصى عمق حفر 7.35 م | سعة المغرفة 1.8 م³ | ضمان 2000 ساعة');
  } else if(key === 'loader_500') {
    addQuotationRow('جرافة شاقة SCOR LOAD-500 (مغرفة 3.5 م³)', 1, 118000, '', 'محرك Weichai WD10 بقوة 220 حصان | حمولة 5 طن | مضخات هيدروليك شاقة | كابينة عازلة للصوت');
  } else if(key === 'bulldozer_420') {
    addQuotationRow('بلدوزر تسوية شاق SCOR BULL-420', 1, 185000, '', 'محرك Cummins KTA19 تيربو بقوة 420 حصان | نصل تسوية شبه منحرف 11.8 م³ | كسارة خلفية أحادية');
  } else if(key === 'crane_150') {
    addQuotationRow('رافعة مجنزرة شاقة SCOR CRANE-150', 1, 290000, '', 'أقصى قدرة رفع 150 طن | ذراع رئيسي تلسكوبي 73 متر | محرك ديزل هيدروليكي ذكي');
  } else if(key === 'generator_800') {
    addQuotationRow('مولد ديزل صناعي صامت SCOR POWER-800', 1, 62000, '', 'قدرة 800 kVA / 640 kW | محرك Cummins KTA38 | كابينة عازلة للصوت 68 dB | خزان وقود 1200 لتر');
  }
}

function updateQtCurrency(curr) {
  qtCurrency = curr;
  document.querySelectorAll('.qt-currency-symbol').forEach(function(el) { el.innerText = curr; });
  calculateQuotationTotals();
}

function updateQtClientFields() {
  const c = document.getElementById('qtClientName').value || '-';
  const a = document.getElementById('qtAttn').value || '-';
  const p = document.getElementById('qtPhone').value || '-';
  const loc = document.getElementById('qtProjectLocation').value || '-';
  document.getElementById('lblQtClientName').innerText = c;
  document.getElementById('lblQtAttn').innerText = a;
  document.getElementById('lblQtPhone').innerText = p;
  document.getElementById('lblQtLocation').innerText = loc;
}

function calculateQuotationTotals() {
  let subtotal = 0;
  quotationItems.forEach(function(i) { subtotal += (i.qty * i.price); });

  const discRate = parseFloat(document.getElementById('qtDiscountRate') ? document.getElementById('qtDiscountRate').value : 0) || 0;
  const taxRate = parseFloat(document.getElementById('qtTaxRate') ? document.getElementById('qtTaxRate').value : 0) || 0;

  const discountVal = subtotal * (discRate / 100);
  const taxable = Math.max(0, subtotal - discountVal);
  const taxVal = taxable * (taxRate / 100);
  const grandTotal = taxable + taxVal;

  if(document.getElementById('qtSubTotalVal')) document.getElementById('qtSubTotalVal').innerText = qtCurrency + Math.round(subtotal).toLocaleString();
  if(document.getElementById('qtDiscountVal')) document.getElementById('qtDiscountVal').innerText = '-' + qtCurrency + Math.round(discountVal).toLocaleString();
  if(document.getElementById('qtDiscountPercentLabel')) document.getElementById('qtDiscountPercentLabel').innerText = discRate;
  if(document.getElementById('qtTaxPercentLabel')) document.getElementById('qtTaxPercentLabel').innerText = taxRate;
  if(document.getElementById('qtTaxVal')) document.getElementById('qtTaxVal').innerText = qtCurrency + Math.round(taxVal).toLocaleString();
  if(document.getElementById('qtGrandTotalVal')) document.getElementById('qtGrandTotalVal').innerText = qtCurrency + Math.round(grandTotal).toLocaleString();

  // التفقيط باللغة العربية
  const tafqeet = tafqeetArabic(Math.round(grandTotal), qtCurrency);
  if(document.getElementById('lblQtTafqeetText')) {
    document.getElementById('lblQtTafqeetText').innerText = tafqeet;
  }
}

function triggerQtImgUpload(container) {
  const input = container.querySelector('input[type="file"]');
  if(input) input.click();
}

function previewQtThumb(input, idx) {
  if(input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      quotationItems[idx].imgSrc = e.target.result;
      renderQuotationTable();
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// دالة التفقيط باللغة العربية
function tafqeetArabic(num, currency) {
  if(num <= 0) {
    let emptyCurr = currency === '$' ? 'دولار أمريكي' : currency;
    return 'صفر ' + emptyCurr;
  }
  
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convertGroup(n) {
    let str = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    if(h > 0) str += hundreds[h];
    if(rem > 0) {
      if(str) str += ' و';
      if(rem < 20) {
        str += ones[rem];
      } else {
        const o = rem % 10;
        const t = Math.floor(rem / 10);
        if(o > 0) str += ones[o] + ' و';
        str += tens[t];
      }
    }
    return str;
  }

  let result = '';
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;

  if(millions > 0) {
    if(millions === 1) result += 'مليون';
    else if(millions === 2) result += 'مليونان';
    else if(millions >= 3 && millions <= 10) result += convertGroup(millions) + ' ملايين';
    else result += convertGroup(millions) + ' مليون';
  }

  if(thousands > 0) {
    if(result) result += ' و';
    if(thousands === 1) result += 'ألف';
    else if(thousands === 2) result += 'ألفان';
    else if(thousands >= 3 && thousands <= 10) result += convertGroup(thousands) + ' آلاف';
    else result += convertGroup(thousands) + ' ألفاً';
  }

  if(remainder > 0) {
    if(result) result += ' و';
    result += convertGroup(remainder);
  }

  let currName = 'دولار أمريكي';
  if(currency === 'SAR') currName = 'ريال سعودي';
  else if(currency === 'AED') currName = 'درهم إماراتي';
  else if(currency === '€') currName = 'يورو';
  else if(currency === 'KWD') currName = 'دينار كويتي';

  return 'فقط ' + result + ' ' + currName + ' لا غير.';
}

function loadQuotationPreset(key) {
  if(key === 'machinery') {
    document.getElementById('pageQtDocTitle').innerText = 'عرض سعر رسمي معتمد - توريد معدات وآليات ثقيلة';
    document.getElementById('qtDocNum').value = 'SCOR/QT-2026-088';
    document.getElementById('lblQtRefNum').innerText = 'REF: SCOR/QT-2026-088';
    quotationItems = [
      {
        desc: "حفارة هيدروليكية مجنزرة SCOR PRO-350",
        specs: "محرك Cummins QSM11 بقوة 335 حصان | أقصى عمق حفر 7.35 م | سعة المغرفة 1.8 م³ | ضمان 2000 ساعة",
        qty: 1, price: 145000, imgSrc: ""
      },
      {
        desc: "جرافة شاقة SCOR LOAD-500",
        specs: "محرك Weichai WD10 بقوة 220 حصان | سعة المغرفة 3.5 م³ | حمولة 5,000 كجم | نظام هيدروليكي مزدوج",
        qty: 1, price: 118000, imgSrc: ""
      }
    ];
  } else if(key === 'tender') {
    document.getElementById('pageQtDocTitle').innerText = 'عطاء ومناقصة توريد معدات إنشائية - TENDER BID';
    document.getElementById('qtDocNum').value = 'TND-2026-GOV-410';
    document.getElementById('lblQtRefNum').innerText = 'REF: TND-2026-GOV-410';
    document.getElementById('lblQtValidity').innerText = '60 يوماً من تاريخ فتح المظاريف';
    quotationItems = [
      {
        desc: "رافعة مجنزرة شاقة SCOR CRANE-150",
        specs: "قدرة رفع قصوى 150 طن | ذراع رئيسي 73 متر | نظام أمان ومراقبة أحمال ذكي",
        qty: 3, price: 290000, imgSrc: ""
      },
      {
        desc: "مولد ديزل صناعي صامت SCOR POWER-800",
        specs: "قدرة 800 kVA / 640 kW | محرك Cummins KTA38 | كابينة عازلة للصوت | لوحة تحكم أوتوماتيكية ATS",
        qty: 2, price: 55000, imgSrc: ""
      }
    ];
  } else if(key === 'commercial') {
    document.getElementById('pageQtDocTitle').innerText = 'عرض تجاري معتمد - COMMERCIAL QUOTATION';
    document.getElementById('qtDocNum').value = 'COMM-2026-102';
    document.getElementById('lblQtRefNum').innerText = 'REF: COMM-2026-102';
    quotationItems = [
      {
        desc: "بلدوزر تسوية شاق SCOR BULL-420",
        specs: "محرك Cummins KTA19 بقوة 420 حصان | نصل تسوية 11.8 م³ | كسارة خلفية | ضمان شامل",
        qty: 1, price: 185000, imgSrc: ""
      }
    ];
  } else if(key === 'parts_service') {
    document.getElementById('pageQtDocTitle').innerText = 'عرض سعر قطع الغيار الأصلية وعقد الصيانة - SPARE PARTS';
    document.getElementById('qtDocNum').value = 'PRT-2026-880';
    document.getElementById('lblQtRefNum').innerText = 'REF: PRT-2026-880';
    quotationItems = [
      {
        desc: "مضخة هيدروليك رئيسية طراز K3V180",
        specs: "أصلية OEM لحفارات PRO-350 | ضغط تشغيلي 34.3 MPa | تدفق 2x360 L/min",
        qty: 2, price: 4200, imgSrc: ""
      },
      {
        desc: "باقة الصيانة الدورية الشاملة (2000 ساعة)",
        specs: "تشمل كافة فلاتر الزيت والوقود والهواء والزيوت الهيدروليكية مع أجور زيارة المهندس الفني",
        qty: 1, price: 2770, imgSrc: ""
      }
    ];
  }
  renderQuotationTable();
}

// ==========================================
// المعاينة السريعة الفورية للقوالب من البوابة (Instant Quick Preview)
// ==========================================
function openTemplateQuickPreview(category, key, optDocName) {
  const modal = document.getElementById('docPreviewModal');
  const wrapper = document.getElementById('previewModalCanvasWrapper');
  const title = document.getElementById('previewModalTitle');
  const subtitle = document.getElementById('previewModalSubtitle');
  const pageControls = document.getElementById('modalPageSpreadControls');
  const editBtn = document.getElementById('modalEditInStudioBtn');
  if(!modal || !wrapper) return;

  modalPreviewZoom = 1.0;
  updateModalZoomDisplay();
  wrapper.innerHTML = '';
  wrapper.classList.remove('preview-spread-wrapper');
  if(pageControls) pageControls.classList.add('hidden');
  if(editBtn) editBtn.style.display = 'none';

  const docName = optDocName || key || 'مستند رسمي معتمد';

  // ضبط زر الفتح في الاستوديو
  if(editBtn) {
    editBtn.style.display = 'inline-flex';
    editBtn.onclick = function() {
      closeFullDocumentPreviewModal();
      openDocInEditor(category, docName);
    };
  }

  if(category === 'quotation' || category === 'quotations') {
    if(key === 'machinery' || key === 'tender' || key === 'parts_service' || key === 'commercial') {
      loadQuotationPreset(key);
    }
    title.innerText = 'معاينة عرض السعر المعتمد: ' + (docName.length > 35 ? docName.substring(0, 35) + '...' : docName);
    subtitle.innerText = 'مقاس A4 المعتمد - شامل المواصفات والأسعار والضمان والتفقيط والاعتماد الرسمي';
    const page = document.getElementById('quotationA4Page');
    if(page) {
      const clone = page.cloneNode(true);
      cleanCloneForPreview(clone);
      clone.style.transform = 'scale(1)';
      clone.style.margin = '0 auto';
      wrapper.appendChild(clone);
    }
  } else if(category === 'catalog' || category === 'technical') {
    if(key === 'master' || key === 'brochure' || key === 'category' || key === 'parts' || key === 'spec_card') {
      applyKtlgTemplate(key);
    }
    title.innerText = 'معاينة الكتالوج الهندسي المعتمد (2 صفحة)';
    subtitle.innerText = 'استوديو الكتالوجات (KTLG Studio) - دقة هندسية عالية جاهزة للطباعة';
    if(pageControls) pageControls.classList.remove('hidden');

    const p1 = document.getElementById('ktlgPage1');
    const p2 = document.getElementById('ktlgPage2');
    if(p1) {
      const c1 = p1.cloneNode(true);
      cleanCloneForPreview(c1);
      c1.id = 'modalCloneP1';
      c1.style.transform = 'scale(1)';
      c1.style.margin = '0 auto';
      wrapper.appendChild(c1);
    }
    if(p2) {
      const c2 = p2.cloneNode(true);
      cleanCloneForPreview(c2);
      c2.id = 'modalCloneP2';
      c2.style.transform = 'scale(1)';
      c2.style.margin = '20px auto 0 auto';
      wrapper.appendChild(c2);
    }
    switchModalPageView('both');
  } else if(category === 'letterhead') {
    openDocInEditor('letterhead', docName);
    title.innerText = 'معاينة الورقة الرسمية: ' + docName;
    subtitle.innerText = 'مقاس A4 المعتمد - ترويسة وتذييل معتمد وختم رسمي موثق';
    const p1 = document.getElementById('letterheadPage');
    if(p1) {
      const clone1 = p1.cloneNode(true);
      cleanCloneForPreview(clone1);
      clone1.style.transform = 'scale(1)';
      clone1.style.margin = '0 auto';
      wrapper.appendChild(clone1);
      const p2 = document.getElementById('page2Continuation');
      if(p2 && !p2.classList.contains('hidden')) {
        const clone2 = p2.cloneNode(true);
        cleanCloneForPreview(clone2);
        clone2.style.transform = 'scale(1)';
        clone2.style.margin = '20px auto 0 auto';
        wrapper.appendChild(clone2);
      }
    }
  } else if(category === 'envelope') {
    openDocInEditor('envelope', docName);
    title.innerText = 'معاينة المغلف الرسمي: ' + docName;
    subtitle.innerText = 'مقاس ' + (currentEnvelopeSize || 'DL').toUpperCase() + ' المعتمد للمراسلات';
    const env = document.getElementById('envelopePage');
    if(env) {
      const clone = env.cloneNode(true);
      cleanCloneForPreview(clone);
      clone.style.transform = 'scale(1)';
      clone.style.margin = '0 auto';
      wrapper.appendChild(clone);
    }
  } else if(category === 'financial') {
    openDocInEditor('financial', docName);
    const titleEl = document.getElementById('pageFinDocTitle');
    title.innerText = 'معاينة المستند المالي: ' + (titleEl ? titleEl.innerText : docName);
    subtitle.innerText = 'مقاس A4 (210 × 297 مم) - جاهز للطباعة والترحيل الحسابي';
    const fin = document.getElementById('invoiceA4Page');
    if(fin) {
      const clone = fin.cloneNode(true);
      cleanCloneForPreview(clone);
      clone.style.transform = 'scale(1)';
      clone.style.margin = '0 auto';
      wrapper.appendChild(clone);
    }
  } else if(category === 'contracts') {
    openDocInEditor('contracts', docName);
    const titleEl = document.getElementById('pageContractTitleText');
    title.innerText = 'معاينة العقد والاتفاقية: ' + (titleEl ? titleEl.innerText : docName);
    subtitle.innerText = 'صيغة قانونية معتمدة A4 مع بنود الحماية والضمان والتوقيعات الرسمية';
    const cPage = document.getElementById('contractA4Page');
    if(cPage) {
      const clone = cPage.cloneNode(true);
      cleanCloneForPreview(clone);
      clone.style.transform = 'scale(1)';
      clone.style.margin = '0 auto';
      wrapper.appendChild(clone);
    }
  }

  modal.style.display = 'flex';
}


  
  let qtZoom = 1.0;
  function zoomQuotationCanvas(delta) {
    qtZoom = Math.min(1.5, Math.max(0.4, Math.round((qtZoom + delta) * 10) / 10));
    updateQuotationZoomDisplay();
  }
  function resetQuotationZoom() {
    qtZoom = 1.0;
    updateQuotationZoomDisplay();
  }
  function updateQuotationZoomDisplay() {
    const wrapper = document.getElementById('quotationZoomWrapper');
    const label = document.getElementById('qtZoomLabel');
    if(wrapper) wrapper.style.transform = 'scale(' + qtZoom + ')';
    if(label) label.innerText = Math.round(qtZoom * 100) + '%';
  }


  // الحالة العامة للمنظومة (Global App State)
  // ==========================================
  let activeCompany = "SCOR & ALFA CORP";

  function updateActiveCompany(name) {
    activeCompany = name || "ALFA STUDIO";
    document.querySelectorAll('.active-company-text').forEach(el => el.innerText = activeCompany);
    const banner = document.getElementById('companyNameBanner');
    if(banner) banner.innerText = activeCompany;
  }

  function toggleMobileNav() {
    const m = document.getElementById('mobileNavMenu');
    m.classList.toggle('hidden');
  }

  // التبديل بين شاشات النظام
  function switchView(viewName) {
    const views = ['hub', 'quotations', 'letterhead', 'envelope', 'financial', 'contracts', 'technical'];
    views.forEach(v => {
      const el = document.getElementById('view-' + v);
      const tab = document.getElementById('tab-' + v);
      if(v === viewName) {
        if(el) el.classList.remove('hidden');
        if(tab) {
          tab.classList.add('active');
          tab.classList.remove('text-gray-300');
        }
      } else {
        if(el) el.classList.add('hidden');
        if(tab) {
          tab.classList.remove('active');
          tab.classList.add('text-gray-300');
        }
      }
    });

    if(viewName === 'hub' && isPreviewMode) {
      togglePreviewMode();
    }
    if(viewName === 'envelope') {
      setTimeout(fitEnvelopeScale, 50);
    }

    if(window.innerWidth < 768) {
      document.getElementById('mobileNavMenu').classList.add('hidden');
    }
  }

  // فتح أي وثيقة مختارة في المحرر المناسب
  function openDocInEditor(editorType, docName) {
    switchView(editorType);

    if(editorType === 'quotations' || (docName && (docName.includes('عرض') || docName.includes('Quotation') || docName.includes('سعر')))) {
      switchView('quotations');
      if(docName.includes('مناقصات') || docName.includes('مشاريع')) {
        loadQuotationPreset('tender');
      } else if(docName.includes('قطع') || docName.includes('صيانة')) {
        loadQuotationPreset('parts_service');
      } else if(docName.includes('تجاري')) {
        loadQuotationPreset('commercial');
      } else {
        loadQuotationPreset('machinery');
      }
      return;
    } else if(editorType === 'letterhead') {
      const badge = document.getElementById('letterheadDocTitleBadge');
      if(badge) badge.innerText = docName;

      // اختيار وضبط النموذج الإداري المناسب تلقائياً
      if(docName.includes('ملفات حفظ المستندات') || docName.includes('Folders') || docName.includes('تقديم العروض')) {
        applyLetterheadTemplate('folder');
      } else if(docName.includes('دفاتر') || docName.includes('الملاحظات') || docName.includes('ملاحظات')) {
        applyLetterheadTemplate('notepad');
      } else if(docName.includes('التعاميم') || docName.includes('مذكرة') || docName.includes('تعميم')) {
        applyLetterheadTemplate('memo');
      } else if(docName.includes('التفويض') || docName.includes('توكيل') || docName.includes('صلاحيات')) {
        applyLetterheadTemplate('auth');
      } else if(docName.includes('الخبرة') || docName.includes('إخلاء')) {
        applyLetterheadTemplate('experience');
      } else if(docName.includes('الشكر') || docName.includes('Compliment') || docName.includes('تقدير')) {
        applyLetterheadTemplate('compliment');
      } else if(docName.includes('المواصفات الفنية') || docName.includes('Spec Sheet') || docName.includes('مواصفات')) {
        applyLetterheadTemplate('spec_sheet');
      } else if(docName.includes('بطاقات الأعمال') || docName.includes('Business Cards')) {
        applyLetterheadTemplate('business_card');
      } else if(docName.includes('بطاقات تعريف') || docName.includes('Badges')) {
        applyLetterheadTemplate('id_badge');
      } else if(docName.includes('دليل') || docName.includes('Manual')) {
        applyLetterheadTemplate('manual');
      } else if(docName.includes('الملف التعريفي') || docName.includes('Company Profile') || docName.includes('البروفايل')) {
        applyLetterheadTemplate('company_profile');
      } else if(docName.includes('صنف') || docName.includes('Bin Card')) {
        applyLetterheadTemplate('bin_card');
      } else if(docName.includes('ملصقات') || docName.includes('تغليف') || docName.includes('شريط') || docName.includes('كراتين')) {
        applyLetterheadTemplate('packaging_label');
      } else if(docName.includes('دعوة') || docName.includes('معارض') || docName.includes('فعاليات')) {
        applyLetterheadTemplate('invitation');
      } else if(docName.includes('توظيف') || docName.includes('إجازة') || docName.includes('تعريف بالراتب') || docName.includes('مباشرة') || docName.includes('تكليف') || docName.includes('تقييم')) {
        applyLetterheadTemplate('hr_request');
      } else {
        applyLetterheadTemplate('formal');
      }

      initAllPPTBoxes();
      refreshSavedTemplatesDropdown();
    } else if(editorType === 'envelope') {
      const badge = document.getElementById('envelopeDocBadge');
      if(badge) badge.innerText = docName;
      if(docName.includes('C5')) {
        setEnvelopeSize('c5');
      } else if(docName.includes('C4')) {
        setEnvelopeSize('c4');
      } else {
        setEnvelopeSize('dl');
      }
      initAllPPTBoxes();
      refreshSavedEnvelopeTemplatesDropdown();
      setTimeout(fitEnvelopeScale, 60);
    } else if(editorType === 'financial') {
      const titleElem = document.getElementById('pageFinDocTitle');
      if(titleElem) titleElem.innerText = docName;
      const select = document.getElementById('finDocTypeSelect');
      if(select) {
        let matched = false;
        for(let i=0; i<select.options.length; i++) {
          if(select.options[i].text.includes(docName.split(' ')[0])) {
            select.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if(!matched && select.options.length > 0) {
          select.selectedIndex = 0;
        }
      }
      calculateFinTotals();
    } else if(editorType === 'contracts') {
      const titleElem = document.getElementById('pageContractTitleText');
      if(titleElem) titleElem.innerText = docName;
      const select = document.getElementById('contractTypeSelect');
      if(select) {
        for(let i=0; i<select.options.length; i++) {
          if(select.options[i].text.includes(docName.split(' ')[0])) {
            select.selectedIndex = i;
            updateContractType(select.options[i].value);
            break;
          }
        }
      }
    } else if(editorType === 'technical') {
      const badge = document.getElementById('ktlgDocTitleBadge');
      if(badge) badge.innerText = docName;
      const refEl = document.getElementById('ktlgDocRefText');
      if(refEl) refEl.innerText = 'REF: KTLG-2026-' + (docName.includes('قطع') ? 'PARTS' : (docName.includes('بروشور') ? 'BROCH' : 'MASTER'));
      
      const select = document.getElementById('ktlgTemplateSelect');
      if(docName.includes('قطع الغيار') || docName.includes('الأرقام المرجعية')) {
        if(select) select.value = 'parts';
        applyKtlgTemplate('parts');
      } else if(docName.includes('بروشور')) {
        if(select) select.value = 'brochure';
        applyKtlgTemplate('brochure');
      } else if(docName.includes('فئة')) {
        if(select) select.value = 'category';
        applyKtlgTemplate('category');
      } else if(docName.includes('بطاقة مواصفات') || docName.includes('القدرات')) {
        if(select) select.value = 'spec_card';
        applyKtlgTemplate('spec_card');
      } else {
        if(select) select.value = 'master';
        applyKtlgTemplate('master');
      }
    }
  }

  // فلترة الأقسام في Hub
  function filterCategorySection(sectionId) {
    const allSecs = document.querySelectorAll('#sectionsContainer > section');
    const allBtns = document.querySelectorAll('#hubCategoriesList .cat-filter-btn');

    allBtns.forEach(btn => {
      btn.classList.remove('bg-[#f5b700]', 'text-black');
      btn.classList.add('text-gray-300');
    });

    event.currentTarget.classList.add('bg-[#f5b700]', 'text-black');
    event.currentTarget.classList.remove('text-gray-300');

    if(sectionId === 'all') {
      allSecs.forEach(sec => sec.style.display = 'block');
      return;
    }

    allSecs.forEach(sec => {
      sec.style.display = (sec.id === 'sec-' + sectionId) ? 'block' : 'none';
    });
  }

  // البحث السريع في المستندات
  function filterDocuments(keyword) {
    const q = keyword.trim().toLowerCase();
    const items = document.querySelectorAll('.sub-item');
    items.forEach(item => {
      const text = item.innerText.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  // ==========================================
  // 1. محرك الورق الرسمي - نظام كائنات البوربوينت التفاعلي (PowerPoint Canvas Engine)
  // ==========================================
  let currentLetterheadSize = 'a4';
  let activePPTBox = null;
  let currentCanvasScale = 0.64;

  function execCmd(command, val = null) {
    document.execCommand(command, false, val);
    autoSaveDraft();
  }

  function applyFontFamily(fontFamily) {
    if(activePPTBox) {
      const content = activePPTBox.querySelector('.ppt-content');
      if(content) content.style.fontFamily = fontFamily;
    } else {
      document.querySelectorAll('.ppt-content').forEach(c => c.style.fontFamily = fontFamily);
    }
    autoSaveDraft();
  }

  function applyFontSize(size) {
    if(activePPTBox) {
      const content = activePPTBox.querySelector('.ppt-content');
      if(content) content.style.fontSize = size;
    } else {
      document.querySelectorAll('.ppt-content').forEach(c => c.style.fontSize = size);
    }
    autoSaveDraft();
  }

  function adjustFontSize(delta) {
    const select = document.getElementById('fmtFontSize');
    let idx = select.selectedIndex + delta;
    if(idx >= 0 && idx < select.options.length) {
      select.selectedIndex = idx;
      applyFontSize(select.value);
    }
  }

  // التحكم بمستوى التكبير (Canvas Zoom)
  function zoomCanvas(dir) {
    if(dir === 0) currentCanvasScale = 0.64;
    else if(dir > 0) currentCanvasScale = Math.min(1.0, currentCanvasScale + 0.08);
    else currentCanvasScale = Math.max(0.4, currentCanvasScale - 0.08);

    const pages = document.querySelectorAll('.a4-page');
    pages.forEach(p => {
      p.style.transform = `scale(${currentCanvasScale})`;
      p.style.marginBottom = `${-105 * (currentCanvasScale / 0.64)}mm`;
    });
    const zoomText = document.getElementById('zoomDisplayLabel');
    if(zoomText) zoomText.innerText = `${Math.round(currentCanvasScale / 0.64 * 100)}%`;
  }

  // تحديد صندوق البوربوينت وإظهار الحدود ومقابض التحجيم (Select Box)
  function selectPPTBox(box, event) {
    if(event) {
      event.stopPropagation();
      if(event.target.closest('.ppt-presets-dropdown') || event.target.closest('.ppt-preset-btn') || event.target.closest('.ppt-dup-btn') || event.target.closest('.ppt-del-btn')) {
        return;
      }
    }

    if(activePPTBox && activePPTBox !== box) {
      activePPTBox.classList.remove('selected');
      const dd = activePPTBox.querySelector('.ppt-presets-dropdown');
      if(dd) dd.classList.remove('open');
    }

    activePPTBox = box;
    box.classList.add('selected');

    // ضبط موقع شريط الإجراءات إذا كان الصندوق قريباً من الحافة العلوية للورقة
    const actionBar = box.querySelector('.ppt-action-bar');
    if(actionBar) {
      if(box.offsetTop < 42) {
        actionBar.style.top = 'auto';
        actionBar.style.bottom = '-36px';
      } else {
        actionBar.style.top = '-36px';
        actionBar.style.bottom = 'auto';
      }
    }

    // مزامنة الخط والحجم في الشريط العلوي مع هذا الصندوق
    const content = box.querySelector('.ppt-content');
    if(content) {
      const style = window.getComputedStyle(content);
      if(style.fontSize) {
        const sizeSelect = document.getElementById('fmtFontSize');
        for(let i=0; i<sizeSelect.options.length; i++) {
          if(sizeSelect.options[i].value === style.fontSize) {
            sizeSelect.selectedIndex = i;
            break;
          }
        }
      }
      if(style.fontFamily) {
        const fontSelect = document.getElementById('fmtFontFamily');
        for(let i=0; i<fontSelect.options.length; i++) {
          if(fontSelect.options[i].value.includes(style.fontFamily.replace(/['"]/g, ''))) {
            fontSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  // النقر خارج الصناديق لإلغاء التحديد وإخفاء الحدود
  function handleCanvasClick(event) {
    if(event.target.closest('.ppt-box')) return;
    if(activePPTBox) {
      activePPTBox.classList.remove('selected');
      const dd = activePPTBox.querySelector('.ppt-presets-dropdown');
      if(dd) dd.classList.remove('open');
      activePPTBox = null;
    }
  }

  // فتح وإغلاق قائمة النصوص الجاهزة
  function togglePresetsMenu(btn, event) {
    event.stopPropagation();
    const dropdown = btn.parentElement.querySelector('.ppt-presets-dropdown');
    if(dropdown) {
      document.querySelectorAll('.ppt-presets-dropdown').forEach(d => {
        if(d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    }
  }

  // مكتبة النصوص والنماذج الجاهزة للاستبدال الفوري
  const PPT_PRESETS = {
    'date_ref': `التاريخ: [اكتب التاريخ هـ / م] | الرقم الإشاري: [REF-0000-2026]`,
    'recipient': `إلى السادة المحترمين: [اسم الشركة أو الجهة المرسل إليها الخطاب]<br><span style="font-size:12px; color:#4b5563; font-weight:normal;"><strong>عناية:</strong> [اسم المسؤول أو الإدارة المعنية - المسمى الوظيفي]</span>`,
    'recipient_gov': `سعادة / [المسمى الوظيفي للمسؤول / سعادة الوزير أو الوكيل أو المدير العام المحترم]<br><span style="font-size:12px; color:#4b5563; font-weight:normal;"><strong>الجهة:</strong> [اسم الوزارة أو الهيئة الحكومية الرسمية - اسم المدينة / العاصمة]</span>`,
    'intro': `<p><strong>تحية طيبة وبعد،،</strong></p><p>بالإشارة إلى الموضوع المذكور أعلاه، يسر إدارة شركة <span class="active-company-text">${activeCompany}</span> إفادتكم بما يلي:</p>`,
    'memo': `<p><strong>تعميم إداري وتنظيمي رقم: [رقم التعميم / 2026]</strong></p><p><strong>إلى:</strong> [كافة مدراء الإدارات ورؤساء الأقسام وجميع منسوبي المنشأة]</p><p><strong>من:</strong> إدارة الموارد البشرية والعمليات المركزية</p><p>نود إحاطة الجميع بضرورة الالتزام الصارم بالتعليمات والضوابط الإدارية والتشغيلية المعتمدة التالية:</p>`,
    'offer': `<p>يسرنا أن نرفع إليكم عرضنا الفني والتجاري لتوريد وصيانة الآلات والمعدات الثقيلة وقطع الغيار الأصلية وفق الشروط والمواصفات المعتمدة التالية:</p>`,
    'auth': `<p><strong>خطاب تفويض وتوكيل إداري رسمي:</strong></p><p>تشهد إدارة شركة <strong class="active-company-text">${activeCompany}</strong> بأنها قد فوضت حامل هذا الخطاب السيد / [اسم المفوض بالكامل] (هوية / جواز رقم: [رقم الإثبات]) بمتابعة كافة الإجراءات الرسمية والتعاقدية والتوقيع نيابة عن المنشأة في كل ما يتعلق بالمعاملة الموضحة أعلاه، خلال المدة من [تاريخ البدء] حتى [تاريخ الانتهاء].</p>`,
    'experience': `<p><strong>شهادة خبرة مهنية وإخلاء طرف رسمي:</strong></p><p>تشهد إدارة شركة <strong class="active-company-text">${activeCompany}</strong> بأن السيد / [اسم الموظف أو المهندس] قد عمل لدينا في [اسم القسم أو الإدارة] بوظيفة [المسمى الوظيفي] خلال الفترة من [تاريخ البدء] إلى [تاريخ الانتهاء]، وقد أدى مهامه بكل كفاءة وإخلاص، وتم إخلاء طرفه المالي والإداري دون أي التزامات متبقية، وأُعطيت هذه الشهادة بناءً على طلبه.</p>`,
    'appreciation': `<p><strong>شهادة شكر وتقدير رسمي:</strong></p><p>تتقدم إدارة المنشأة بوافر الشكر والتقدير إلى: [اسم المكرم / الفريق المكرم] تقديراً لجهودكم المتميزة والمخلصة ومساهمتكم الفعالة في إنجاز خطط العمل والمشاريع الميدانية بنجاح باهر.</p>`,
    'notice': `<p><strong>إشعار وتنبيه إداري رسمي:</strong></p><p>نلفت عنايتكم الكريمة بموجب هذا الإشعار الرسمي بضرورة مراجعة الإدارة المختصة لتسوية واستكمال الإجراءات المحددة خلال مدة أقصاها [اكتب عدد الأيام، مثال: 3 أيام عمل] من تاريخه.</p>`,
    'compliment': `<div style="text-align:center; padding:10px;"><h3 style="font-size:16px; font-weight:800; color:#1f2937; margin-bottom:6px;">مع أطيب التحيات والتقدير</h3><p style="font-size:12px; color:#4b5563;">يسر إدارة <strong class="active-company-text">${activeCompany}</strong> إهداؤكم هذا المستند مع وافر التمنيات بدوام التوفيق والنجاح المشترك.</p><p style="margin-top:12px; font-size:11px; color:#6b7280; border-top:1px dashed #d1d5db; padding-top:6px;">[ملاحظة أو إهداء خاص: اكتب هنا أي توجيه أو رسالة شكر خاصة للمستلم]</p></div>`,
    'folder_sheet': `<div><h3 style="font-size:16px; font-weight:900; color:#1f2937; border-bottom:2px solid #f5b700; padding-bottom:4px; margin-bottom:8px;">📁 ملف توثيق المعاملات والمستندات الإدارية</h3><table style="width:100%; font-size:12px; border-collapse:collapse; margin-bottom:10px;"><tr style="background:#f3f4f6;"><td style="border:1px solid #d1d5db; padding:5px; font-weight:bold; width:25%;">اسم المعاملة:</td><td style="border:1px solid #d1d5db; padding:5px;">[اكتب اسم المعاملة أو المشروع]</td><td style="border:1px solid #d1d5db; padding:5px; font-weight:bold; width:20%;">رقم الملف:</td><td style="border:1px solid #d1d5db; padding:5px;">[REF-FILE-2026]</td></tr><tr><td style="border:1px solid #d1d5db; padding:5px; font-weight:bold;">الإدارة المودعة:</td><td style="border:1px solid #d1d5db; padding:5px;">[اسم الإدارة أو القسم المسؤول]</td><td style="border:1px solid #d1d5db; padding:5px; font-weight:bold;">تاريخ الحفظ:</td><td style="border:1px solid #d1d5db; padding:5px;">[اليوم / الشهر / السنة]</td></tr></table><p style="font-size:11px; font-weight:bold; color:#374151;">فهرس المستندات المرفقة داخل الملف:</p><ol style="font-size:11px; color:#4b5563; padding-right:18px; margin:4px 0;"><li>[المستند الأول: أصل العقد أو الاتفاقية الرسمية]</li><li>[المستند الثاني: المخططات والمواصفات الفنية المعتمدة]</li><li>[المستند الثالث: المراسلات ومحاضر الاجتماعات الرسمية]</li></ol></div>`,
    'notepad': `<div><div style="display:flex; justify-content:space-between; border-bottom:2px solid #1f2937; padding-bottom:4px; margin-bottom:10px;"><span style="font-size:14px; font-weight:900; color:#1f2937;">📝 مذكرة متابعة واجتماع إداري</span><span style="font-size:11px; color:#6b7280;">التاريخ: [اكتب التاريخ] | المكان: [قاعة الاجتماعات / أونلاين]</span></div><p style="font-size:12px; margin:4px 0;"><strong>الموضوع / جدول الأعمال:</strong> [اكتب موضوع الاجتماع أو المذكرة الإدارية]</p><p style="font-size:12px; margin:4px 0;"><strong>الحاضرون:</strong> [أسماء المشاركين والإدارات الحاضرة]</p><div style="border:1px solid #e5e7eb; border-radius:4px; padding:8px; margin-top:8px; background:#fafafa;"><p style="font-size:11px; font-weight:bold; color:#1f2937; margin-bottom:4px;">القرارات والتوصيات المتفق عليها:</p><ul style="font-size:11px; color:#374151; padding-right:16px; margin:0;"><li style="margin-bottom:3px;">[القرار الأول: الإجراء المطلوب والمسؤول عنه والموعد النهائي]</li><li style="margin-bottom:3px;">[القرار الثاني: الإجراء المطلوب والمسؤول عنه والموعد النهائي]</li><li>[القرار الثالث: المتابعة والمراجعة الدورية]</li></ul></div></div>`,
    'table_data': `<table style="width:100%; border-collapse:collapse; margin-top:4px;"><tr style="background:#1f2937; color:#f5b700;"><th style="border:1px solid #374151; padding:4px;">م</th><th style="border:1px solid #374151; padding:4px;">البند والمواصفة الفنية</th><th style="border:1px solid #374151; padding:4px;">الكمية</th><th style="border:1px solid #374151; padding:4px;">ملاحظات</th></tr><tr><td style="border:1px solid #d1d5db; padding:4px;">1</td><td style="border:1px solid #d1d5db; padding:4px;">[اكتب بيان أو مواصفة البند المطلوب]</td><td style="border:1px solid #d1d5db; padding:4px;">[الكمية]</td><td style="border:1px solid #d1d5db; padding:4px;">[الملاحظة أو كود الاعتماد]</td></tr></table>`,
    'signoff': `<p>وتفضلوا بقبول فائق الاحترام والتقدير،،</p><br><p><strong>[المسمى الوظيفي للمعتمد / المدير العام أو المفوض بالتوقيع]</strong></p>`,
    // نصوص وقوالب المغلفات الرسمية الجاهزة (Envelopes Engine)
    'env_sender_hq': `
      <div class="flex items-center gap-2 mb-1">
        <div style="width:24px; height:24px; border-radius:4px; background:#f5b700; color:#000; font-weight:900; display:flex; align-items:center; justify-content:center; font-size:14px;">α</div>
        <div>
          <h4 class="active-company-text font-black text-[13px] text-gray-900 leading-none">${activeCompany}</h4>
          <p class="text-[9px] text-gray-500 font-bold">المقر الرئيسي - المراسلات الرسمية</p>
        </div>
      </div>
      <p class="text-[10px] text-gray-600 m-0">[ص.ب: .... - الرمز البريدي: .... | الهاتف الموحد: +000 00 000 0000]</p>
      <p class="text-[10px] text-gray-600 m-0">[اكتب الدولة / المدينة - الحي - اسم الشارع] | info@scor-alfa.com</p>
    `,
    'env_sender_branch': `
      <div class="flex items-center gap-2 mb-1">
        <div style="width:24px; height:24px; border-radius:4px; background:#f5b700; color:#000; font-weight:900; display:flex; align-items:center; justify-content:center; font-size:14px;">α</div>
        <div>
          <h4 class="active-company-text font-black text-[13px] text-gray-900 leading-none">${activeCompany}</h4>
          <p class="text-[9px] text-gray-500 font-bold">إدارة المشاريع والخدمات الفنية</p>
        </div>
      </div>
      <p class="text-[10px] text-gray-600 m-0">[عنوان الفرع الإقليمي: المدينة - اسم الشارع / الحي] | هاتف: [رقم الهاتف المباشر]</p>
    `,
    'env_recipient_corp': `
      <div style="border-right: 3px solid #f5b700; padding-right: 10px;">
        <span style="font-size: 11px; color: #6b7280; font-weight: bold; display: block;">إلى السادة المحترمين:</span>
        <h3 style="font-size: 15px; font-weight: 800; color: #111827; margin: 2px 0;">[اسم الشركة أو المؤسسة المستقبلة]</h3>
        <p style="font-size: 11px; color: #374151; margin: 1px 0;"><strong>عناية:</strong> [الإدارة المعنية / اسم المسؤول الموجه إليه الخطاب]</p>
        <p style="font-size: 11px; color: #6b7280; margin: 1px 0;">[العنوان: الدولة - المدينة - الحي / اسم الشارع - الرمز البريدي أو ص.ب]</p>
      </div>
    `,
    'env_recipient_gov': `
      <div style="border-right: 3px solid #1e3a8a; padding-right: 10px;">
        <span style="font-size: 11px; color: #6b7280; font-weight: bold; display: block;">سعادة /</span>
        <h3 style="font-size: 15px; font-weight: 800; color: #111827; margin: 2px 0;">[المسمى الوظيفي للمسؤول / سعادة الوزير أو الوكيل المحترم]</h3>
        <p style="font-size: 11px; color: #374151; margin: 1px 0;"><strong>الجهة:</strong> [اسم الوزارة أو الهيئة الحكومية الرسمية - اسم المدينة / العاصمة]</p>
        <p style="font-size: 11px; color: #6b7280; margin: 1px 0;">[الإدارة العامة المختصة / المبنى الحكومي]</p>
      </div>
    `,
    'env_recipient_tender': `
      <div style="border-right: 3px solid #dc2626; padding-right: 10px;">
        <span style="font-size: 11px; color: #dc2626; font-weight: 900; display: block;">سري للغاية - مظروف مناقصة مغلق:</span>
        <h3 style="font-size: 15px; font-weight: 800; color: #111827; margin: 2px 0;">لجنة فتح المظاريف وفحص العروض الفنية</h3>
        <p style="font-size: 11px; color: #374151; margin: 1px 0;"><strong>مناقصة رقم:</strong> [رقم وتاريخ المناقصة أو الممارسة] ([موضوع وتفاصيل المناقصة])</p>
        <p style="font-size: 10px; color: #6b7280; margin: 1px 0;">[ملاحظة: لا يُفتح إلا بمعرفة رئيس وأعضاء لجنة فحص العروض المختصة]</p>
      </div>
    `,
    'env_postage': `
      <div class="text-center h-full flex flex-col justify-center items-center" style="border: 1.5px dashed #9ca3af; border-radius: 4px; padding: 4px; background: #f9fafb;">
        <span style="font-size: 8px; color: #6b7280; font-weight: bold;">خلوص البريد الرسمي</span>
        <span style="font-size: 15px; margin: 1px 0;">📮</span>
        <span style="font-size: 8px; color: #9ca3af; font-family: monospace;">POSTAGE PAID</span>
      </div>
    `,
    'env_confidential': `
      <span style="border: 1.5px solid #dc2626; color: #dc2626; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 900; letter-spacing: 0.5px; display: inline-block;">
        سري وشخصي | CONFIDENTIAL
      </span>
    `,
    'env_urgent': `
      <span style="border: 1.5px solid #d97706; color: #d97706; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 900; letter-spacing: 0.5px; display: inline-block;">
        عاجل وهام | URGENT PRIORITY
      </span>
    `
  };

  // تطبيق النص الجاهز المختار داخل الصندوق المحدد
  function applyPresetToBox(item, presetKey) {
    const box = item.closest('.ppt-box');
    if(!box) return;
    const content = box.querySelector('.ppt-content');
    if(content && PPT_PRESETS[presetKey]) {
      content.innerHTML = PPT_PRESETS[presetKey];
    }
    const dropdown = item.closest('.ppt-presets-dropdown');
    if(dropdown) dropdown.classList.remove('open');
    autoSaveDraft();
    checkAutoContinuationPage();
  }

  // حذف الصندوق
  function deletePPTBox(source) {
    const box = source.closest ? source.closest('.ppt-box') : source;
    if(box) {
      if(activePPTBox === box) activePPTBox = null;
      box.remove();
      autoSaveDraft();
    }
  }

  function deleteSelectedPPTBox() {
    if(activePPTBox) {
      deletePPTBox(activePPTBox);
    } else {
      alert('يرجى النقر على كتلة أو عنصر لتحديده أولاً ثم الضغط على حذف');
    }
  }

  // تكرار الصندوق المحدد (Duplicate)
  function duplicatePPTBox(source) {
    const box = source.closest ? source.closest('.ppt-box') : source;
    if(!box) return;
    const page = box.closest('.a4-page') || box.closest('.envelope-page') || document.getElementById('letterheadPage') || document.getElementById('envelopePage');
    const clone = box.cloneNode(true);
    clone.classList.remove('selected');
    const topVal = (parseFloat(box.style.top) || 40) + 10;
    const leftVal = (parseFloat(box.style.left) || 20) + 10;
    clone.style.top = `${topVal}px`;
    clone.style.left = `${leftVal}px`;
    page.appendChild(clone);
    initPPTBoxInteractions(clone);
    selectPPTBox(clone);
    autoSaveDraft();
  }

  function duplicateSelectedPPTBox() {
    if(activePPTBox) {
      duplicatePPTBox(activePPTBox);
    } else {
      alert('يرجى النقر على كتلة لتحديدها أولاً ثم الضغط على تكرار');
    }
  }

  // إنشاء وإدراج صندوق بوربوينت جديد على الصفحة
  function createPPTBox(type = 'text', targetPageId = 'letterheadPage') {
    const page = document.getElementById(targetPageId) || document.getElementById('letterheadPage');
    if(!page) return;

    const isEnv = targetPageId === 'envelopePage' || page.classList.contains('envelope-page');
    const box = document.createElement('div');
    box.className = 'ppt-box';
    box.style.top = isEnv ? '35mm' : '100mm';
    box.style.left = isEnv ? '20mm' : '15mm';
    box.style.width = isEnv ? '90mm' : '180mm';

    let initialHTML = 'اكتب النص هنا... يمكنك تحريك هذا الصندوق من إطاره أو مقبض السحب (☩) وتغيير مقاسه من أي زاوية مثل PowerPoint.';
    let extraContentClass = isEnv ? 'text-[12px] text-gray-800' : 'text-[14px] text-gray-800';

    if(type === 'title') {
      box.style.top = isEnv ? '15mm' : '50mm';
      box.style.width = isEnv ? '100mm' : '180mm';
      extraContentClass = 'text-xl font-black text-gray-900';
      initialHTML = 'عنوان مخصص رئيسي';
    } else if(type === 'sign') {
      box.style.top = isEnv ? '75mm' : '210mm';
      box.style.width = isEnv ? '60mm' : '75mm';
      extraContentClass = 'text-[12px] text-gray-900';
      initialHTML = '<p>وتفضلوا بقبول فائق الاحترام والتقدير،،</p><br><p><strong>المدير العام / المفوض بالتوقيع</strong></p>';
    }

    box.innerHTML = `
      <div class="ppt-action-bar no-print">
        <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩ سحب</span>
        <div class="relative">
          <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
          <div class="ppt-presets-dropdown">
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'date_ref')">📅 ترويسة التاريخ والرقم</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'recipient')">👤 صيغة مخاطبة عميل</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'intro')">📄 افتتاحية خطاب إداري</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'memo')">📢 صيغة تعميم داخلي</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'offer')">⚙️ عرض فني وتوريد</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'auth')">⚖️ صيغة تفويض رسمي</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'experience')">🎖️ شهادة خبرة وإنجاز</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'appreciation')">🏆 شهادة شكر وتقدير</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'table_data')">📊 جدول بنود ومواصفات</div>
            <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'signoff')">✍️ خاتمة واعتماد المدير</div>
          </div>
        </div>
        <span class="ppt-dup-btn" onclick="duplicatePPTBox(this)" title="تكرار الصندوق">📄 تكرار</span>
        <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">🗑️</span>
      </div>
      <div class="ppt-content ${extraContentClass}" contenteditable="true">
        ${initialHTML}
      </div>
      <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
      <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
    `;

    box.onclick = (e) => selectPPTBox(box, e);
    page.appendChild(box);
    initPPTBoxInteractions(box);
    selectPPTBox(box);
    autoSaveDraft();
    checkAutoContinuationPage();
  }

  // إدراج جدول بنود مصغر داخل الورقة ككتلة قابلة للتحريك
  function insertTableBox(targetPageId = 'letterheadPage') {
    const page = document.getElementById(targetPageId);
    if(!page) return;
    const box = document.createElement('div');
    box.className = 'ppt-box';
    box.style.top = '120mm';
    box.style.left = '12mm';
    box.style.width = '186mm';
    box.innerHTML = `
      <div class="ppt-action-bar no-print">
        <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩ سحب</span>
        <span class="ppt-dup-btn" onclick="duplicatePPTBox(this)">📄 تكرار</span>
        <span class="ppt-del-btn" onclick="deletePPTBox(this)">🗑️</span>
      </div>
      <div class="ppt-content text-[12px]" contenteditable="true">
        <table style="width:100%; border-collapse:collapse; text-align:right;">
          <thead>
            <tr style="background:#1f2937; color:#f5b700;">
              <th style="border:1px solid #374151; padding:6px; width:40px;">م</th>
              <th style="border:1px solid #374151; padding:6px;">البيان / المواصفة الفنية للمعدة</th>
              <th style="border:1px solid #374151; padding:6px; width:80px;">الكمية</th>
              <th style="border:1px solid #374151; padding:6px; width:120px;">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #d1d5db; padding:6px;">1</td>
              <td style="border:1px solid #d1d5db; padding:6px;">توريد رافعة شوكية هيدروليكية 5 طن موديل 2026</td>
              <td style="border:1px solid #d1d5db; padding:6px;">1 وحدة</td>
              <td style="border:1px solid #d1d5db; padding:6px;">فحص PDI معتمد</td>
            </tr>
            <tr>
              <td style="border:1px solid #d1d5db; padding:6px;">2</td>
              <td style="border:1px solid #d1d5db; padding:6px;">مجموعة قطع غيار وفلاتر دورية كاملة</td>
              <td style="border:1px solid #d1d5db; padding:6px;">1 طقم</td>
              <td style="border:1px solid #d1d5db; padding:6px;">أصلي وكالة</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
      <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
    `;
    box.onclick = (e) => selectPPTBox(box, e);
    page.appendChild(box);
    initPPTBoxInteractions(box);
    selectPPTBox(box);
    autoSaveDraft();
  }

  // إدراج صورة أو شعار ككتلة قابلة للتحريك والتحجيم
  function insertImageBox(targetPageId = 'letterheadPage') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const page = document.getElementById(targetPageId);
        const box = document.createElement('div');
        box.className = 'ppt-box';
        box.style.top = '90mm';
        box.style.left = '20mm';
        box.style.width = '60mm';
        box.innerHTML = `
          <div class="ppt-action-bar no-print">
            <span class="ppt-drag-icon" title="اسحب لتحريك الصورة">☩ سحب</span>
            <span class="ppt-dup-btn" onclick="duplicatePPTBox(this)">📄 تكرار</span>
            <span class="ppt-del-btn" onclick="deletePPTBox(this)">🗑️</span>
          </div>
          <div class="ppt-content" style="padding:0; overflow:hidden;">
            <img src="${ev.target.result}" style="width:100%; height:auto; display:block; pointer-events:none;" />
          </div>
          <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
          <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
        `;
        box.onclick = (ev2) => selectPPTBox(box, ev2);
        page.appendChild(box);
        initPPTBoxInteractions(box);
        selectPPTBox(box);
        autoSaveDraft();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // تفعيل السحب والتحجيم الثماني لجميع صناديق البوربوينت
  function initPPTBoxInteractions(box) {
    const page = box.closest('.a4-page') || box.closest('.envelope-page') || document.getElementById('letterheadPage') || document.getElementById('envelopePage');
    const dragIcon = box.querySelector('.ppt-drag-icon');

    // 1. التحريك عبر سحب الإطار أو مقبض السحب (Drag to Move)
    let isDragging = false, startX, startY, initL, initT;

    function onDragStart(e) {
      if(e.target.classList.contains('ppt-handle') ||
         e.target.closest('.ppt-presets-dropdown') ||
         e.target.closest('.ppt-preset-btn') ||
         e.target.closest('.ppt-dup-btn') ||
         e.target.closest('.ppt-del-btn') ||
         e.target.tagName === 'SELECT' ||
         e.target.tagName === 'BUTTON' ||
         e.target.tagName === 'INPUT') {
        return;
      }
      // إذا كان النقر داخل النص في وضع التحرير نتركه يكتب إلا إذا ضغط على إطار الصندوق أو مقبض السحب
      if(e.target.classList.contains('ppt-content') && e.target === document.activeElement && e.target !== box) {
        return;
      }

      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      startX = clientX;
      startY = clientY;
      initL = box.offsetLeft;
      initT = box.offsetTop;

      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchmove', onDragMove);
      document.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
      if(!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const pageRect = page ? page.getBoundingClientRect() : { width: 1, offsetWidth: 1 };
      const currentScale = (page && page.offsetWidth) ? (pageRect.width / page.offsetWidth) : 1;
      const dx = (clientX - startX) / currentScale;
      const dy = (clientY - startY) / currentScale;
      box.style.left = `${Math.max(0, initL + dx)}px`;
      box.style.top = `${Math.max(0, initT + dy)}px`;
      box.style.bottom = 'auto';
      box.style.right = 'auto';

      // ضبط شريط الإجراءات
      const actionBar = box.querySelector('.ppt-action-bar');
      if(actionBar) {
        if(box.offsetTop < 42) {
          actionBar.style.top = 'auto';
          actionBar.style.bottom = '-36px';
        } else {
          actionBar.style.top = '-36px';
          actionBar.style.bottom = 'auto';
        }
      }

      checkAutoContinuationPage();
    }

    function onDragEnd() {
      isDragging = false;
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', onDragMove);
      document.removeEventListener('touchend', onDragEnd);
      autoSaveDraft();
    }

    if(dragIcon) {
      dragIcon.addEventListener('mousedown', onDragStart);
      dragIcon.addEventListener('touchstart', onDragStart);
    }
    box.addEventListener('mousedown', (e) => {
      if(e.target === box || e.target.classList.contains('ppt-action-bar')) {
        onDragStart(e);
      }
    });

    // 2. التحجيم الدقيق عبر المقابض الثمانية (8 PowerPoint Handles)
    box.querySelectorAll('.ppt-handle').forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        let isResizing = true;
        let sX = e.clientX, sY = e.clientY;
        let sW = box.offsetWidth, sH = box.offsetHeight;
        let sL = box.offsetLeft, sT = box.offsetTop;

        function onResizeMove(ev) {
          if(!isResizing) return;
          const pageRect = page ? page.getBoundingClientRect() : { width: 1, offsetWidth: 1 };
          const currentScale = (page && page.offsetWidth) ? (pageRect.width / page.offsetWidth) : 1;
          let dx = (ev.clientX - sX) / currentScale;
          let dy = (ev.clientY - sY) / currentScale;

          // المقابض اليمينية: tr, br, rm
          if(handle.classList.contains('tr') || handle.classList.contains('br') || handle.classList.contains('rm')) {
            box.style.width = `${Math.max(40, sW + dx)}px`;
          }
          // المقابض اليسارية: tl, bl, lm
          if(handle.classList.contains('tl') || handle.classList.contains('bl') || handle.classList.contains('lm')) {
            let newW = Math.max(40, sW - dx);
            box.style.width = `${newW}px`;
            box.style.left = `${sL + dx}px`;
          }
          // المقابض السفلية: bl, br, bm
          if(handle.classList.contains('bl') || handle.classList.contains('br') || handle.classList.contains('bm')) {
            box.style.height = `${Math.max(20, sH + dy)}px`;
          }
          // المقابض العلوية: tl, tr, tm
          if(handle.classList.contains('tl') || handle.classList.contains('tr') || handle.classList.contains('tm')) {
            let newH = Math.max(20, sH - dy);
            box.style.height = `${newH}px`;
            box.style.top = `${sT + dy}px`;
          }

          checkAutoContinuationPage();
        }

        function onResizeEnd() {
          isResizing = false;
          document.removeEventListener('mousemove', onResizeMove);
          document.removeEventListener('mouseup', onResizeEnd);
          autoSaveDraft();
        }

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd, {once:true});
      });
    });

    // استماع للتعديل على النصوص للحفظ التلقائي
    const content = box.querySelector('.ppt-content');
    if(content) {
      content.addEventListener('input', () => {
        autoSaveDraft();
        checkAutoContinuationPage();
      });
    }
  }

  // تفعيل جميع صناديق الصفحة الحالية
  function initAllPPTBoxes() {
    document.querySelectorAll('.ppt-box').forEach(box => {
      box.onclick = (e) => selectPPTBox(box, e);
      initPPTBoxInteractions(box);
    });
  }

  // اختصارات لوحة المفاتيح: Delete للحذف و Escape لإلغاء التحديد
  document.addEventListener('keydown', (e) => {
    if(activePPTBox) {
      if(e.key === 'Escape') {
        activePPTBox.classList.remove('selected');
        activePPTBox = null;
      } else if(e.key === 'Delete' && document.activeElement !== activePPTBox.querySelector('.ppt-content') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        deletePPTBox(activePPTBox);
      }
    }
  });

  // ==========================================
  // إدارة وحفظ واسترجاع القوالب المخصصة بنظام البوربوينت
  // ==========================================
  const LETTERHEAD_STORAGE_KEY = 'alfa_letterhead_custom_templates';
  const LETTERHEAD_DRAFT_KEY = 'alfa_letterhead_auto_draft';

  function getStoredLetterheadTemplates() {
    try {
      const data = localStorage.getItem(LETTERHEAD_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch(e) {
      return {};
    }
  }

  function refreshSavedTemplatesDropdown() {
    const dropdown = document.getElementById('savedTemplatesDropdown');
    if(!dropdown) return;
    const templates = getStoredLetterheadTemplates();
    dropdown.innerHTML = '<option value="">-- اختر قالباً محفوظاً --</option>';
    for(const name in templates) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.innerText = `${name} (${templates[name].savedAt || 'معتمد'})`;
      dropdown.appendChild(opt);
    }
  }

  function saveCustomTemplate() {
    const input = document.getElementById('customTemplateNameInput');
    const name = (input.value || '').trim();
    if(!name) {
      alert('يرجى كتابة اسم للقالب أولاً (مثال: خطاب رسمي للموردين)');
      input.focus();
      return;
    }

    const p1 = document.getElementById('letterheadPage');
    const p2 = document.getElementById('letterheadPage2');
    const headerImg = document.getElementById('lhHeaderLayer').innerHTML;
    const footerImg = document.getElementById('lhFooterLayer').innerHTML;

    // استخراج كافة صناديق البوربوينت بإحداثياتها ونصوصها وأحجامها وخطوطها
    const pptBoxes = [];
    p1.querySelectorAll('.ppt-box').forEach(box => {
      const content = box.querySelector('.ppt-content');
      pptBoxes.push({
        top: box.style.top,
        left: box.style.left,
        width: box.style.width,
        height: box.style.height,
        fontFamily: content ? content.style.fontFamily : '',
        fontSize: content ? content.style.fontSize : '',
        html: content ? content.innerHTML : ''
      });
    });

    const stamps = [];
    p1.querySelectorAll('.draggable-stamp img').forEach(img => {
      const wrap = img.parentElement;
      stamps.push({
        src: img.src,
        top: wrap.style.top,
        left: wrap.style.left,
        bottom: wrap.style.bottom,
        right: wrap.style.right,
        width: wrap.style.width
      });
    });

    const templateData = {
      name: name,
      paperSize: currentLetterheadSize,
      hasPage2: !p2.classList.contains('hidden'),
      headerImg: headerImg,
      footerImg: footerImg,
      pptBoxes: pptBoxes,
      stamps: stamps,
      company: activeCompany,
      savedAt: new Date().toLocaleDateString('ar')
    };

    const templates = getStoredLetterheadTemplates();
    templates[name] = templateData;
    localStorage.setItem(LETTERHEAD_STORAGE_KEY, JSON.stringify(templates));

    refreshSavedTemplatesDropdown();
    dropdown.value = name;
    alert(`تم حفظ القالب "${name}" بنجاح! بكافة صناديقه، مقاساته وتنسيقاته.`);
    input.value = '';
  }

  function loadSelectedTemplate() {
    const dropdown = document.getElementById('savedTemplatesDropdown');
    const name = dropdown.value;
    if(!name) {
      alert('يرجى اختيار قالب من القائمة أولاً');
      return;
    }

    const templates = getStoredLetterheadTemplates();
    const t = templates[name];
    if(!t) {
      alert('لم يتم العثور على القالب المختار');
      return;
    }

    applyTemplateDataToCanvas(t);
    alert(`تم تحميل القالب "${name}" بنجاح بكافة كائناته وتنسيقاته ومواقعه!`);
  }

  function deleteSelectedTemplate() {
    const dropdown = document.getElementById('savedTemplatesDropdown');
    const name = dropdown.value;
    if(!name) {
      alert('يرجى اختيار قالب لحذفه أولاً');
      return;
    }
    if(confirm(`هل أنت متأكد من حذف القالب "${name}" نهائياً من الذاكرة؟`)) {
      const templates = getStoredLetterheadTemplates();
      delete templates[name];
      localStorage.setItem(LETTERHEAD_STORAGE_KEY, JSON.stringify(templates));
      refreshSavedTemplatesDropdown();
      alert(`تم حذف القالب "${name}" بنجاح.`);
    }
  }

  function applyTemplateDataToCanvas(t) {
    if(!t) return;
    setLetterheadPaperSize(t.paperSize || 'a4');

    if(t.headerImg) document.getElementById('lhHeaderLayer').innerHTML = t.headerImg;
    if(t.footerImg) document.getElementById('lhFooterLayer').innerHTML = t.footerImg;

    const p2 = document.getElementById('letterheadPage2');
    if(t.hasPage2) {
      p2.classList.remove('hidden');
      document.getElementById('btnTogglePage2').innerText = '✖ إخفاء صفحة المتابعة 2';
      document.getElementById('btnTogglePage2').classList.add('text-red-400');
    } else {
      p2.classList.add('hidden');
      document.getElementById('btnTogglePage2').innerText = '+ إدراج صفحة ثانية للمتابعة';
      document.getElementById('btnTogglePage2').classList.remove('text-red-400');
    }

    const p1 = document.getElementById('letterheadPage');
    p1.querySelectorAll('.ppt-box').forEach(el => el.remove());
    p1.querySelectorAll('.draggable-stamp').forEach(el => el.remove());

    if(t.pptBoxes && t.pptBoxes.length) {
      t.pptBoxes.forEach(b => {
        const box = document.createElement('div');
        box.className = 'ppt-box';
        box.style.top = b.top;
        box.style.left = b.left;
        box.style.width = b.width;
        if(b.height) box.style.height = b.height;

        box.innerHTML = `
          <div class="ppt-action-bar no-print">
            <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩ سحب</span>
            <div class="relative">
              <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
              <div class="ppt-presets-dropdown">
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'date_ref')">📅 ترويسة التاريخ والرقم</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'recipient')">👤 صيغة مخاطبة عميل</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'intro')">📄 افتتاحية خطاب إداري</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'memo')">📢 صيغة تعميم داخلي</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'offer')">⚙️ عرض فني وتوريد</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'auth')">⚖️ صيغة تفويض رسمي</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'experience')">🎖️ شهادة خبرة وإنجاز</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'appreciation')">🏆 شهادة شكر وتقدير</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'table_data')">📊 جدول بنود ومواصفات</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'signoff')">✍️ خاتمة واعتماد المدير</div>
              </div>
            </div>
            <span class="ppt-dup-btn" onclick="duplicatePPTBox(this)" title="تكرار الصندوق">📄 تكرار</span>
            <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">🗑️</span>
          </div>
          <div class="ppt-content text-[14px] text-gray-800" contenteditable="true">
            ${b.html}
          </div>
          <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
          <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
        `;

        const content = box.querySelector('.ppt-content');
        if(b.fontFamily && content) content.style.fontFamily = b.fontFamily;
        if(b.fontSize && content) content.style.fontSize = b.fontSize;

        box.onclick = (e) => selectPPTBox(box, e);
        p1.appendChild(box);
        initPPTBoxInteractions(box);
      });
    }

    if(t.stamps && t.stamps.length) {
      t.stamps.forEach(s => {
        const wrap = document.createElement('div');
        wrap.className = 'draggable-stamp';
        wrap.style.width = s.width || '130px';
        if(s.top) wrap.style.top = s.top;
        if(s.left) wrap.style.left = s.left;
        if(s.bottom) wrap.style.bottom = s.bottom;
        if(s.right) wrap.style.right = s.right;
        wrap.innerHTML = `<img src="${s.src}"><div class="stamp-resizer"></div>`;
        p1.appendChild(wrap);
        makeDraggable(wrap, wrap);
        makeStampResizable(wrap, wrap.querySelector('.stamp-resizer'));
      });
    }
  }

  // الحفظ التلقائي للمسودة المستمرة (Auto-Save Draft)
  let autoSaveTimeout = null;
  function autoSaveDraft() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      const p1 = document.getElementById('letterheadPage');
      if(!p1) return;
      const pptBoxes = [];
      p1.querySelectorAll('.ppt-box').forEach(box => {
        const content = box.querySelector('.ppt-content');
        pptBoxes.push({
          top: box.style.top,
          left: box.style.left,
          width: box.style.width,
          height: box.style.height,
          fontFamily: content ? content.style.fontFamily : '',
          fontSize: content ? content.style.fontSize : '',
          html: content ? content.innerHTML : ''
        });
      });
      const draft = {
        paperSize: currentLetterheadSize,
        pptBoxes: pptBoxes,
        hasPage2: !document.getElementById('letterheadPage2').classList.contains('hidden'),
        updatedAt: Date.now()
      };
      localStorage.setItem(LETTERHEAD_DRAFT_KEY, JSON.stringify(draft));
    }, 800);
  }

  // استعادة المسودة التلقائية
  function restoreAutoDraft() {
    try {
      const raw = localStorage.getItem(LETTERHEAD_DRAFT_KEY);
      if(!raw) return;
      const draft = JSON.parse(raw);
      if(draft && draft.pptBoxes && draft.pptBoxes.length) {
        applyTemplateDataToCanvas(draft);
      }
    } catch(e) {}
  }

  // استعادة التخطيط الأصلي المعتمد (Reset to Default)
  function resetLetterheadToDefault() {
    if(confirm('هل تريد استعادة التخطيط الرسمي الافتراضي وإلغاء التعديلات غير المحفوظة؟')) {
      localStorage.removeItem(LETTERHEAD_DRAFT_KEY);
      location.reload();
    }
  }

  // تبديل مقاس الورقة الرسمية (A4, A5, Letter)
  function setLetterheadPaperSize(size) {
    currentLetterheadSize = size;
    const p1 = document.getElementById('letterheadPage');
    const p2 = document.getElementById('letterheadPage2');
    const btnA4 = document.getElementById('btnPageSizeA4');
    const btnA5 = document.getElementById('btnPageSizeA5');
    const btnLetter = document.getElementById('btnPageSizeLetter');
    const badge = document.getElementById('letterheadDocTitleBadge');

    [btnA4, btnA5, btnLetter].forEach(b => {
      if(b) {
        b.classList.remove('bg-[#f5b700]', 'text-black', 'font-black');
        b.classList.add('bg-[#181b22]', 'text-gray-300');
      }
    });

    if(size === 'a5') {
      p1.style.width = '148mm';
      p1.style.minHeight = '210mm';
      p1.style.height = '210mm';
      if(p2) {
        p2.style.width = '148mm';
        p2.style.minHeight = '210mm';
        p2.style.height = '210mm';
      }
      if(btnA5) {
        btnA5.classList.add('bg-[#f5b700]', 'text-black', 'font-black');
        btnA5.classList.remove('bg-[#181b22]', 'text-gray-300');
      }
      if(badge) badge.innerText = 'الورق الرسمي المروّس (A5 - 148×210 مم)';
    } else if(size === 'letter') {
      p1.style.width = '216mm';
      p1.style.minHeight = '279mm';
      p1.style.height = '279mm';
      if(p2) {
        p2.style.width = '216mm';
        p2.style.minHeight = '279mm';
        p2.style.height = '279mm';
      }
      if(btnLetter) {
        btnLetter.classList.add('bg-[#f5b700]', 'text-black', 'font-black');
        btnLetter.classList.remove('bg-[#181b22]', 'text-gray-300');
      }
      if(badge) badge.innerText = 'الورق الرسمي المروّس (Letter - 216×279 مم)';
    } else {
      p1.style.width = '210mm';
      p1.style.minHeight = '297mm';
      p1.style.height = '297mm';
      if(p2) {
        p2.style.width = '210mm';
        p2.style.minHeight = '297mm';
        p2.style.height = '297mm';
      }
      if(btnA4) {
        btnA4.classList.add('bg-[#f5b700]', 'text-black', 'font-black');
        btnA4.classList.remove('bg-[#181b22]', 'text-gray-300');
      }
      if(badge) badge.innerText = 'الورق الرسمي المروّس (A4 - 210×297 مم)';
    }
    autoSaveDraft();
  }

  // إدراج صفحة ثانية للمتابعة
  function toggleContinuationPage() {
    const p2 = document.getElementById('letterheadPage2');
    const btn = document.getElementById('btnTogglePage2');
    const badge = document.getElementById('pageCountBadge');

    if(p2.classList.contains('hidden')) {
      p2.classList.remove('hidden');
      btn.innerText = '✖ إخفاء صفحة المتابعة 2';
      btn.classList.add('text-red-400');
      if(badge) badge.innerText = 'صفحتان (1 و 2)';
    } else {
      p2.classList.add('hidden');
      btn.innerText = '+ إدراج صفحة ثانية للمتابعة';
      btn.classList.remove('text-red-400');
      if(badge) badge.innerText = 'صفحة 1 فقط';
    }
    autoSaveDraft();
  }

  // التدفق التلقائي للصفحات مثل MS Word
  function checkAutoContinuationPage() {
    const p1 = document.getElementById('letterheadPage');
    const p2 = document.getElementById('letterheadPage2');
    if(!p1 || !p2) return;

    let hasOverflow = false;
    const pageMaxY = p1.offsetHeight - 110;

    p1.querySelectorAll('.ppt-box').forEach(box => {
      const bottom = box.offsetTop + box.offsetHeight;
      if(bottom > pageMaxY) {
        hasOverflow = true;
      }
    });

    if(hasOverflow && p2.classList.contains('hidden')) {
      p2.classList.remove('hidden');
      const btn = document.getElementById('btnTogglePage2');
      if(btn) {
        btn.innerText = '✖ إخفاء صفحة المتابعة 2';
        btn.classList.add('text-red-400');
      }
      const badge = document.getElementById('pageCountBadge');
      if(badge) badge.innerText = 'صفحتان (تدفق تلقائي)';
    }
  }

  // تطبيق القوالب الإدارية المعتمدة للمراسلات والورقيات الرسمية
  function applyLetterheadTemplate(type) {
    const p1 = document.getElementById('letterheadPage');
    if(!p1) return;

    let paperSize = 'a4';
    let boxes = [];

    if(type === 'formal') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '75mm', html: `التاريخ: [اكتب التاريخ هـ / م] | الرقم: [REF-0000-2026]` },
        { top: '55mm', left: '12mm', width: '186mm', html: `إلى السادة المحترمين: [اسم الشركة أو الجهة المرسل إليها الخطاب]<br><span style="font-size:12px; color:#4b5563; font-weight:normal;"><strong>عناية:</strong> [اسم المسؤول أو الإدارة المختصة - المسمى الوظيفي]</span>` },
        { top: '69mm', left: '12mm', width: '186mm', html: `<strong>الموضوع:</strong> [اكتب موضوع الخطاب الإداري الرسمي هنا]` },
        { top: '82mm', left: '12mm', width: '186mm', height: '110mm', html: `<p><strong>السلام عليكم ورحمة الله وبركاته،، تحية طيبة وبعد،</strong></p><br><p>بالإشارة إلى الموضوع المذكور أعلاه، يسر إدارة شركة <strong class="active-company-text">${activeCompany}</strong> أن تفيدكم بما يلي:</p><br><p>[اكتب هنا نص وتفاصيل الخطاب الرسمي، مبيناً الخلفية، الأهداف، الإجراءات أو التنسيق المطلوب تنفيذه بين الطرفين...]</p><br><p>شاكرين ومقدرين حسن تعاونكم الدائم معنا، متطلعين إلى استمرار التنسيق والتعاون المثمر.</p>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p>وتفضلوا بقبول فائق الاحترام والتقدير،،</p><br><p><strong>[المسمى الوظيفي للمعتمد / المدير العام]</strong></p>` }
      ];
    } else if(type === 'memo') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: `<div style="text-align:center; border-bottom:2px solid #1f2937; padding-bottom:6px;"><h2 style="font-size:18px; font-weight:900; color:#111827; margin:0;">تعميم إداري وتنظيمي داخلي</h2><p style="font-size:11px; color:#6b7280; margin:2px 0;">رقم التعميم: [رقم التعميم الإداري / 2026] | التاريخ: [اليوم / الشهر / السنة]</p></div>` },
        { top: '60mm', left: '12mm', width: '186mm', html: `<table style="width:100%; font-size:13px; border-collapse:collapse; background:#f9fafb;"><tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px; font-weight:bold; width:15%;">إلى:</td><td style="padding:6px;">[كافة مدراء الإدارات ورؤساء الأقسام وجميع منسوبي المنشأة]</td></tr><tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px; font-weight:bold;">من:</td><td style="padding:6px;">إدارة الموارد البشرية والعمليات المركزية</td></tr><tr><td style="padding:6px; font-weight:bold;">الموضوع:</td><td style="padding:6px; font-weight:bold; color:#1f2937;">[اكتب موضوع التعميم الداخلي وضوابط العمل هنا]</td></tr></table>` },
        { top: '88mm', left: '12mm', width: '186mm', height: '105mm', html: `<p><strong>تحية إدارية طيبة للجميع،،</strong></p><br><p>في إطار حرص الإدارة العليا على تنظيم سير الأعمال والارتقاء بكفاءة العمليات التشغيلية، يُرجى التقيد التام بالضوابط والتعليمات التالية:</p><br><ol style="padding-right:20px; line-height:1.8;"><li><strong>أولاً:</strong> [اكتب البند التنظيمي الأول، مثال: مواعيد الحضور والانصراف وضوابط العمل الميداني].</li><li><strong>ثانياً:</strong> [اكتب البند التنظيمي الثاني، مثال: آلية رفع التقارير الأسبوعية واعتماد المصاريف].</li><li><strong>ثالثاً:</strong> [اكتب البند التنظيمي الثالث، مثال: التقيد الصارم بمعايير السلامة المهنية والصحة والبيئة].</li></ol><br><p>يُعمل بهذا التعميم ابتداءً من تاريخ صدوره، ويتحمل كل مدير إدارة مسؤولية إبلاغ فريقه ومتابعة التطبيق.</p>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p>شاكرين للجميع حسن الالتزام والتعاون،،</p><br><p><strong>مدير عام الموارد البشرية والعمليات</strong></p>` }
      ];
    } else if(type === 'auth') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '75mm', html: `التاريخ: [اكتب التاريخ هـ / م] | الرقم: [REF-AUTH-2026]` },
        { top: '56mm', left: '12mm', width: '186mm', html: `<div style="text-align:center;"><h2 style="font-size:20px; font-weight:900; color:#111827; border-bottom:2px solid #f5b700; display:inline-block; padding-bottom:4px;">خطاب تفويض وتوكيل إداري رسمي</h2></div>` },
        { top: '75mm', left: '12mm', width: '186mm', height: '120mm', html: `<p><strong>إلى من يهمه الأمر / الجهات الرسمية والخاصة المعنية المحترمين،</strong></p><p>السلام عليكم ورحمة الله وبركاته،،</p><br><p>تشهد وتُقر شركة <strong class="active-company-text">${activeCompany}</strong> بأنها قد فوضت بموجب هذا الخطاب السيد /</p><p style="background:#f3f4f6; padding:8px; border-radius:4px; font-size:14px; font-weight:bold; margin:6px 0;">[اسم المفوض الرباعي] - يحمل هوية / جواز سفر رقم: [رقم الإثبات]</p><br><p><strong>وذلك للقيام بالصلاحيات والإجراءات الإدارية التالية نيابة عن المنشأة:</strong></p><ul style="padding-right:20px; line-height:1.8;"><li>[مراجعة الجهات والهيئات المختصة واستلام وتسليم المعاملات الرسمية المتعلقة بالمشروع].</li><li>[التوقيع على خطابات الاستلام والمحاضر الفنية والتنسيق الميداني المعتمد].</li><li>[تمثيل المنشأة في كل ما يلزم لإنهاء الإجراءات المحددة في هذا التفويض].</li></ul><br><p>يسري هذا التفويض رسمياً اعتباراً من تاريخ: [تاريخ البدء] وحتى تاريخ: [تاريخ الانتهاء] ما لم يُلغَ خطياً قبل ذلك.</p>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p>وهذا تفويض رسمي صادر للاعتماد،،</p><br><p><strong>المدير العام / المفوض بالتوقيع</strong></p>` }
      ];
    } else if(type === 'experience') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '75mm', html: `الرقم: [REF-EXP-2026] | التاريخ: [اكتب التاريخ هـ / م]` },
        { top: '56mm', left: '12mm', width: '186mm', html: `<div style="text-align:center;"><h2 style="font-size:20px; font-weight:900; color:#111827; border-bottom:2px solid #f5b700; display:inline-block; padding-bottom:4px;">شهادة خبرة وكفاءة مهنية وإخلاء طرف</h2></div>` },
        { top: '75mm', left: '12mm', width: '186mm', height: '120mm', html: `<p><strong>تشهد إدارة شركة <strong class="active-company-text">${activeCompany}</strong> بأن:</strong></p><div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:10px; margin:8px 0;"><table style="width:100%; font-size:13px; border-collapse:collapse;"><tr><td style="padding:4px; font-weight:bold; width:25%;">اسم الموظف:</td><td style="padding:4px;">[اسم الموظف الرباعي]</td><td style="padding:4px; font-weight:bold; width:20%;">رقم الإثبات / الهوية:</td><td style="padding:4px;">[رقم الهوية أو الجواز]</td></tr><tr><td style="padding:4px; font-weight:bold;">المسمى الوظيفي:</td><td style="padding:4px;">[المسمى الوظيفي، مثال: مهندس ميكانيكي أول]</td><td style="padding:4px; font-weight:bold;">القسم / الإدارة:</td><td style="padding:4px;">[إدارة المشاريع الهندسية والصيانة]</td></tr><tr><td style="padding:4px; font-weight:bold;">فترة العمل:</td><td colspan="3" style="padding:4px;">من تاريخ: [تاريخ مباشرة العمل] إلى تاريخ: [تاريخ انتهاء الخدمة]</td></tr></table></div><br><p>وخلال فترة عمله بالشركة، أظهر المذكور كفاءة مهنية عالية وأخلاقاً وظيفية رفيعة والتزاماً تاماً بالمسؤوليات الموكلة إليه.</p><p>كما تُقر الشركة بأنه قد <strong>أخلى طرفه رسمياً</strong> من أي عهد أو التزامات مالية أو إدارية للشركة حتى تاريخ تركه العمل.</p><br><p>وقد أُعطيت له هذه الشهادة بناءً على طلبه دون أدنى مسؤولية مالية أو قانونية على الشركة تجاه حقوق الغير.</p>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p>مع تمنياتنا له بالتوفيق والنجاح الدائم،،</p><br><p><strong>مدير عام الموارد البشرية والشؤون الإدارية</strong></p>` }
      ];
    } else if(type === 'appreciation') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '75mm', html: `الرقم: [REF-APR-2026] | التاريخ: [اكتب التاريخ هـ / م]` },
        { top: '56mm', left: '12mm', width: '186mm', html: `<div style="text-align:center;"><h2 style="font-size:22px; font-weight:900; color:#b45309; border-bottom:2px solid #f5b700; display:inline-block; padding-bottom:4px;">🏆 شهادة شكر وتقدير رسمي</h2></div>` },
        { top: '78mm', left: '12mm', width: '186mm', height: '115mm', html: `<div style="text-align:center; padding:15px; border:2px dashed #f5b700; border-radius:8px; background:#fffbeb;"><p style="font-size:16px; color:#4b5563;">تتقدم إدارة شركة <strong class="active-company-text" style="color:#000;">${activeCompany}</strong></p><p style="font-size:14px; color:#6b7280; margin:4px 0;">بأسمى آيات الشكر والامتنان وعظيم التقدير إلى:</p><h3 style="font-size:24px; font-weight:900; color:#1f2937; margin:12px 0;">[اسم الموظف / الفريق / الجهة المكرمة]</h3><p style="font-size:14px; color:#374151; line-height:1.9;">نظير جهودكم الاستثنائية وتفانيكم المتميز في [اكتب هنا اسم المشروع أو الإنجاز المتميز، مثال: إنجاز أعمال التوريد والصيانة الميدانية في وقت قياسي وبأعلى معايير الجودة والسلامة].</p><br><p style="font-size:13px; color:#6b7280;">سائلين المولى عز وجل لكم دوام التوفيق والتميز والريادة المهنية.</p></div>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p>شاكرين ومقدرين عطاءكم المستمر،،</p><br><p><strong>رئيس مجلس الإدارة / المدير التنفيذي</strong></p>` }
      ];
    } else if(type === 'notice') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '75mm', html: `الرقم: [REF-NTC-2026] | التاريخ: [اكتب التاريخ هـ / م]` },
        { top: '55mm', left: '12mm', width: '186mm', html: `إلى السيد / [اسم الشخص أو الجهة المعنية بالإشعار]<br><span style="font-size:12px; color:#4b5563;"><strong>المسمى الوظيفي / الصفة:</strong> [المسمى الوظيفي أو الصفة التعاقدية]</span>` },
        { top: '69mm', left: '12mm', width: '186mm', html: `<strong>الموضوع:</strong> إشعار واستدعاء إداري رسمي لتسوية الإجراءات` },
        { top: '82mm', left: '12mm', width: '186mm', height: '110mm', html: `<p><strong>تحية طيبة وبعد،،</strong></p><br><p>نلفت عنايتكم الكريمة بموجب هذا الإشعار الرسمي بضرورة مراجعة إدارة [اسم الإدارة، مثال: إدارة الموارد البشرية / الشؤون القانونية] بشأن [اكتب هنا موضوع الاستدعاء أو استكمال الإجراءات والوثائق المطلوبة].</p><br><p><strong>المطلوب تنفيذه:</strong></p><ul style="padding-right:20px; line-height:1.8;"><li>[مراجعة الإدارة المختصة خلال مهلة أقصاها: (اكتب عدد الأيام، مثال: 3 أيام عمل) من تاريخ استلام الإشعار].</li><li>[إحضار وتقديم الوثائق والمستندات الثبوتية المطلوبة].</li><li>[تسوية المعاملة وفقاً للوائح والأنظمة الإدارية المعتمدة بالمنشأة].</li></ul><br><p>شاكرين لكم سرعة التجاوب والتعاون في إنهاء الإجراءات المحددة.</p>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p>وتفضلوا بقبول الاحترام،،</p><br><p><strong>إدارة الموارد البشرية والشؤون الإدارية</strong></p>` }
      ];
    } else if(type === 'folder') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: PPT_PRESETS['folder_sheet'] },
        { top: '150mm', left: '12mm', width: '186mm', html: `<div style="border:1px solid #d1d5db; border-radius:6px; padding:12px; background:#fff;"><h4 style="font-size:13px; font-weight:bold; color:#1f2937; margin-bottom:6px;">ملاحظات واعتماد الحفظ الإداري:</h4><p style="font-size:12px; color:#4b5563; line-height:1.7;">[اكتب هنا أي شروط حفظ خاصة، تصنيف السرية، أو تعليمات الأرشفة الإلكترونية طبقاً لسياسات المنشأة].</p><div style="display:flex; justify-content:space-between; margin-top:20px; font-size:12px; font-weight:bold;"><span>الموظف المسؤول عن الحفظ: [اسم الموظف]</span><span>اعتماد مدير الأرشيف: [التوقيع والختم]</span></div></div>` }
      ];
    } else if(type === 'notepad') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: PPT_PRESETS['notepad'] },
        { top: '150mm', left: '12mm', width: '186mm', height: '80mm', html: `<div style="border:1px dashed #9ca3af; border-radius:6px; padding:12px; height:100%;"><p style="font-size:12px; font-weight:bold; color:#1f2937; margin-bottom:6px;">📝 مساحة حرة للملاحظات والتأشيرات الميدانية السريعة:</p><p style="font-size:11px; color:#9ca3af;">[اكتب هنا الملاحظات اليدوية، تواريخ المتابعة، أو تأشيرة التحويل إلى القسم المعني...]</p></div>` }
      ];
    } else if(type === 'compliment') {
      paperSize = 'a5';
      boxes = [
        { top: '35mm', left: '10mm', width: '128mm', html: PPT_PRESETS['compliment'] }
      ];
    } else if(type === 'spec_sheet') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: `<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #f5b700; padding-bottom:6px;"><div><h2 style="font-size:18px; font-weight:900; margin:0; color:#111;">ورقة المواصفات الفنية المعتمدة (Spec Sheet)</h2><p style="font-size:11px; color:#6b7280; margin:2px 0;">كود الوثيقة: [TECH-SPEC-2026] | الموديل: [اكتب موديل الآلة أو المعدة]</p></div><div style="background:#0e1014; color:#f5b700; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">مواصفات قياسية ISO</div></div>` },
        { top: '65mm', left: '12mm', width: '186mm', html: `<table style="width:100%; font-size:12px; border-collapse:collapse; margin-top:4px;"><tr style="background:#f3f4f6;"><th style="border:1px solid #d1d5db; padding:6px; text-align:right;">البند الفني</th><th style="border:1px solid #d1d5db; padding:6px; text-align:right;">المواصفة والقدرة القياسية</th><th style="border:1px solid #d1d5db; padding:6px; text-align:right;">ملاحظات التحمل</th></tr><tr><td style="border:1px solid #d1d5db; padding:6px; font-weight:bold;">المحرك والقدرة</td><td style="border:1px solid #d1d5db; padding:6px;">محرك ديزل تيربو متقدم بقوة [335 حصان / 250 ك.واط]</td><td style="border:1px solid #d1d5db; padding:6px;">كفاءة عالية واستهلاك اقتصادي</td></tr><tr><td style="border:1px solid #d1d5db; padding:6px; font-weight:bold;">النظام الهيدروليكي</td><td style="border:1px solid #d1d5db; padding:6px;">مضخات مزدوجة تدفق متغير [350 لتر/دقيقة] ضغط [34.3 ميغاباسكال]</td><td style="border:1px solid #d1d5db; padding:6px;">استجابة سريعة ودقيقة</td></tr><tr><td style="border:1px solid #d1d5db; padding:6px; font-weight:bold;">الوزن والأبعاد</td><td style="border:1px solid #d1d5db; padding:6px;">الوزن التشغيلي: [35,000 كغ] | سعة الحاوية/الباكيت: [1.6 م³]</td><td style="border:1px solid #d1d5db; padding:6px;">اتزان قياسي في أصعب التضاريس</td></tr><tr><td style="border:1px solid #d1d5db; padding:6px; font-weight:bold;">معايير الانبعاثات</td><td style="border:1px solid #d1d5db; padding:6px;">مطابق لمعايير Tier 4 Final / Stage V العالمية</td><td style="border:1px solid #d1d5db; padding:6px;">صديق للبيئة ومنخفض الضوضاء</td></tr></table>` },
        { top: '145mm', left: '12mm', width: '186mm', height: '65mm', html: `<div style="border:1px solid #e5e7eb; border-radius:6px; padding:10px; background:#f9fafb;"><h4 style="font-size:12px; font-weight:bold; color:#1f2937; margin:0 0 4px 0;">إقرارات الفحص وضبط الجودة الفنية:</h4><p style="font-size:11px; color:#4b5563; line-height:1.7;">تم تدقيق واختبار كافة المواصفات والقدرات المذكورة في مختبرات الفحص الهندسي المعتمدة ومطابقتها للمعايير الدولية للتشغيل الشاق.</p><div style="display:flex; justify-content:space-between; margin-top:15px; font-size:11px; font-weight:bold;"><span>مهندس الفحص وضبط الجودة: [الاسم والاعتماد]</span><span>ختم الإدارة الهندسية والفنية: [الختم الرسمي]</span></div></div>` }
      ];
    } else if(type === 'business_card') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: `<div style="text-align:center; border-bottom:2px solid #111; padding-bottom:4px;"><h2 style="font-size:16px; font-weight:900; margin:0;">بطاقة الأعمال والهوية المهنية (Business Card - معتمدة للطباعة)</h2><p style="font-size:10px; color:#6b7280;">المقاس المعياري: 90 × 50 مم | هوية SCOR & ALFA CORP</p></div>` },
        { top: '65mm', left: '20mm', width: '90mm', height: '50mm', html: `<div style="border:1px solid #d1d5db; border-radius:6px; padding:12px; background:#fff; height:100%; box-shadow:0 2px 8px rgba(0,0,0,0.06); display:flex; flex-direction:column; justify-content:between;"><div style="display:flex; justify-content:space-between; align-items:center;"><div><h3 style="font-size:14px; font-weight:900; margin:0; color:#111;">[اسم المسؤول / المهندس]</h3><p style="font-size:10px; color:#f5b700; font-weight:bold; margin:2px 0;">[المسمى الوظيفي، مثال: المدير التنفيذي / مدير المشاريع]</p></div><div style="width:26px; height:26px; border-radius:4px; background:#f5b700; color:#000; font-weight:900; display:flex; align-items:center; justify-content:center; font-size:14px;">α</div></div><div style="font-size:9.5px; color:#4b5563; line-height:1.6; border-top:1px solid #f3f4f6; padding-top:6px;"><p style="margin:0;">📞 هاتف مباشر: [+000 00 000 0000]</p><p style="margin:0;">✉️ البريد: [email@company.com]</p><p style="margin:0;">🏢 [الدولة - المدينة - المقر الرئيسي]</p></div></div>` },
        { top: '65mm', left: '115mm', width: '90mm', height: '50mm', html: `<div style="border:1px solid #1f2937; border-radius:6px; padding:12px; background:#0e1014; color:#fff; height:100%; box-shadow:0 2px 8px rgba(0,0,0,0.15); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;"><div style="width:36px; height:36px; border-radius:6px; background:#f5b700; color:#000; font-weight:900; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:6px;">α</div><h3 class="active-company-text" style="font-size:13px; font-weight:900; color:#f5b700; margin:0;">${activeCompany}</h3><p style="font-size:9px; color:#9ca3af; margin:2px 0;">Heavy Machinery & Engineering Excellence</p><p style="font-size:9px; color:#f5b700; margin-top:4px;">www.company-portal.com</p></div>` }
      ];
    } else if(type === 'id_badge') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: `<div style="text-align:center; border-bottom:2px solid #111; padding-bottom:4px;"><h2 style="font-size:16px; font-weight:900; margin:0;">بطاقة تعريف الموظف والتصريح الأمني (ID Badge & Security Pass)</h2><p style="font-size:10px; color:#6b7280;">المقاس المعياري الرأسي: 54 × 86 مم (CR80 Standard)</p></div>` },
        { top: '65mm', left: '60mm', width: '70mm', height: '110mm', html: `<div style="border:1.5px solid #d1d5db; border-radius:8px; overflow:hidden; background:#fff; height:100%; box-shadow:0 4px 12px rgba(0,0,0,0.1); display:flex; flex-direction:column; text-align:center;"><div style="background:#0e1014; color:#f5b700; padding:10px 6px;"><div style="font-size:14px; font-weight:900;">SCOR & ALFA</div><div style="font-size:8px; color:#9ca3af;">بطاقة دخول موظف معتمد</div></div><div style="padding:10px; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:space-between;"><div style="width:55px; height:65px; background:#f3f4f6; border:1px solid #d1d5db; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#9ca3af;">صورة شخصية</div><div><h4 style="font-size:13px; font-weight:900; color:#111; margin:4px 0 0 0;">[اسم الموظف الرباعي]</h4><p style="font-size:10px; color:#f5b700; font-weight:bold; margin:0;">[المسمى الوظيفي]</p><p style="font-size:9px; color:#6b7280; margin:2px 0;">الرقم الوظيفي: [EMP-0000]</p></div><div style="border-top:1px dashed #d1d5db; width:100%; padding-top:6px; font-size:8px; color:#6b7280;"><p style="margin:0;">فصيلة الدم: [O+] | الصلاحية: 2026/12</p><div style="font-family:monospace; letter-spacing:2px; font-size:10px; color:#111; margin-top:2px;">|||||||||||||||||||||</div></div></div></div>` }
      ];
    } else if(type === 'manual') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: `<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #111; padding-bottom:6px;"><div><h2 style="font-size:18px; font-weight:900; margin:0;">دليل التشغيل والصيانة القياسي (Standard Operation Manual)</h2><p style="font-size:11px; color:#6b7280; margin:2px 0;">كود الوثيقة: [MAN-SOP-2026] | الإصدار: 1.0</p></div><div style="background:#f5b700; color:#000; font-weight:900; font-size:10px; padding:4px 8px; border-radius:4px;">إجراءات قياسية معتمدة</div></div>` },
        { top: '65mm', left: '12mm', width: '186mm', height: '140mm', html: `<div style="font-size:12px; line-height:1.8; color:#1f2937;"><h3 style="font-size:14px; font-weight:bold; color:#111; border-right:4px solid #f5b700; padding-right:8px; margin:6px 0;">1. إرشادات ما قبل التشغيل (Pre-Operation Checks):</h3><ul style="padding-right:20px;"><li>فحص مستويات زيت المحرك، السائل الهيدروليكي، ومستوى ماء التبريد يومياً قبل بدء الوردية.</li><li>فحص خلو المسار ومحيط المعدة بزاوية 360 درجة والتأكد من عدم وجود عوائق أو أشخاص في نطاق الدوران.</li><li>معاينة سيور المحرك وضغط الجنازير/الإطارات وملاحظة أي تسريبات زيت محتملة.</li></ul><h3 style="font-size:14px; font-weight:bold; color:#111; border-right:4px solid #f5b700; padding-right:8px; margin:10px 0 6px 0;">2. ضوابط التشغيل والعمل الميداني (Operating Procedures):</h3><ul style="padding-right:20px;"><li>تشغيل المحرك في وضع التباطؤ (Idling) لمدة 5 دقائق حتى تستقر درجات الحرارة وضغوط الزيت.</li><li>عدم تجاوز الحمولات المقررة أو زوايا الميلان المحددة في جدول قدرات المعدة.</li><li>الالتزام بارتداء معدات الوقاية الشخصية (PPE) الكاملة داخل كابينة القيادة ومحيط العمل.</li></ul></div>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p style="font-size:11px; color:#6b7280;">اعتماد الإدارة الفنية وهندسة الصيانة،،</p><br><p style="font-size:12px; font-weight:bold;">[رئيس قسم الدعم الفني والتدريب]</p>` }
      ];
    } else if(type === 'company_profile') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: `<div style="text-align:center; border-bottom:3px solid #f5b700; padding-bottom:8px;"><h1 class="active-company-text" style="font-size:24px; font-weight:900; color:#111; margin:0;">${activeCompany}</h1><p style="font-size:12px; color:#b45309; font-weight:bold; margin:4px 0;">الملف التعريفي للشركة والرؤية الاستراتيجية (Company Profile)</p></div>` },
        { top: '70mm', left: '12mm', width: '186mm', height: '135mm', html: `<div style="font-size:12.5px; line-height:1.9; color:#1f2937;"><h3 style="font-size:15px; font-weight:bold; color:#111; border-right:4px solid #f5b700; padding-right:8px;">نبذة عن الشركة:</h3><p>تُعد شركة <strong class="active-company-text">${activeCompany}</strong> من الكيانات الرائدة المتخصصة في حلول وتوريد الآلات والمعدات الثقيلة، وتقديم الخدمات الهندسية الشاملة وعقود الصيانة المتطورة لكبرى المشاريع الإنشائية والصناعية.</p><br><h3 style="font-size:15px; font-weight:bold; color:#111; border-right:4px solid #f5b700; padding-right:8px;">رؤيتنا ورسالتنا:</h3><p><strong>الرؤية:</strong> تحقيق الريادة المطلقة في تزويد قطاع المقاولات والصناعة بأحدث الآليات ذات الكفاءة العالية والاعتمادية الفائقة.</p><p><strong>الرسالة:</strong> تقديم حلول توريد متكاملة، مدعومة بضمان موثوق، وتوفير قطع غيار أصلية وفِرق دعم ميداني هندسي على مدار الساعة.</p><br><h3 style="font-size:15px; font-weight:bold; color:#111; border-right:4px solid #f5b700; padding-right:8px;">مجالات الاختصاص الرئيسية:</h3><ul style="padding-right:20px;"><li>توريد وتأجير الحفارات، اللوادر، الرافعات، والمعدات التخصصية.</li><li>خدمات الصيانة الدورية الشاملة وعقود الخدمة الفنية الميدانية.</li><li>إدارة قطع الغيار والخدمات اللوجستية والشحن الدولي المعتمد.</li></ul></div>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p style="font-size:11px; color:#6b7280;">صادر عن الإدارة العامة للشركة،،</p><br><p style="font-size:12px; font-weight:bold;">[مجلس الإدارة / قطاع تطوير الأعمال]</p>` }
      ];
    } else if(type === 'bin_card') {
      paperSize = 'a5';
      boxes = [
        { top: '30mm', left: '10mm', width: '128mm', html: `<div style="border:2px solid #111; padding:10px; background:#fff; border-radius:4px;"><div style="text-align:center; border-bottom:1.5px solid #111; padding-bottom:4px; margin-bottom:8px;"><h3 style="font-size:15px; font-weight:900; margin:0;">بطاقة صنف ورف مستودعات (Bin Card)</h3><p style="font-size:10px; color:#6b7280; margin:0;">إدارة المستودعات ومطابقة الأصول</p></div><table style="width:100%; font-size:11px; border-collapse:collapse;"><tr style="background:#f3f4f6;"><td style="padding:4px; font-weight:bold; width:30%;">رقم الصنف (SKU):</td><td style="padding:4px;">[SKU-000000]</td></tr><tr><td style="padding:4px; font-weight:bold;">اسم وتوصيف الصنف:</td><td style="padding:4px;">[اكتب اسم القطعة أو المعدة بدقة]</td></tr><tr style="background:#f3f4f6;"><td style="padding:4px; font-weight:bold;">موقع الرف / الزقاق:</td><td style="padding:4px;">[المستودع الرئيسي - ممر A - رف 04]</td></tr><tr><td style="padding:4px; font-weight:bold;">الحد الأدنى للطلب:</td><td style="padding:4px;">[5 وحدات] | الحد الأقصى: [50 وحدة]</td></tr></table><div style="margin-top:10px; border-top:1px dashed #d1d5db; padding-top:6px; display:flex; justify-content:space-between; font-size:10px; font-weight:bold;"><span>الرصيد الفعلي الحالي: [.....]</span><span>أمين المستودع: [الاسم]</span></div></div>` }
      ];
    } else if(type === 'packaging_label') {
      paperSize = 'a5';
      boxes = [
        { top: '25mm', left: '10mm', width: '128mm', html: `<div style="border:2px solid #0e1014; padding:12px; background:#fff; border-radius:6px; text-align:center;"><div style="background:#0e1014; color:#f5b700; padding:6px; font-weight:900; font-size:14px; border-radius:4px;">SCOR & ALFA CORP - SHIPPING & PACKING</div><div style="text-align:right; margin-top:8px; font-size:11px; line-height:1.7;"><p style="margin:2px 0;"><strong>المرسل:</strong> ${activeCompany} [الدولة / المدينة]</p><p style="margin:2px 0;"><strong>المرسل إليه:</strong> [اسم العميل / المستلم - المدينة والحي والشارع]</p><p style="margin:2px 0;"><strong>رقم الشحنة / الطرد:</strong> [PKG-2026-9901] | الوزن: [...... كغ]</p><p style="margin:2px 0;"><strong>تعليمات المناولة:</strong> ⚠️ قابل للكسر / احفظه جافاً / اتجاه الرفع ⬆️</p></div><div style="font-family:monospace; font-size:14px; letter-spacing:3px; margin-top:10px; border-top:1px solid #e5e7eb; padding-top:6px;">||||||||||||||||||||||||||||||</div></div>` }
      ];
    } else if(type === 'invitation') {
      paperSize = 'a5';
      boxes = [
        { top: '30mm', left: '10mm', width: '128mm', html: `<div style="border:2px solid #f5b700; border-radius:8px; padding:16px; background:#fffbeb; text-align:center;"><div style="font-size:24px; color:#b45309; margin-bottom:4px;">✉️</div><h2 style="font-size:18px; font-weight:900; color:#111; margin:0;">دعوة رسمية لحضور فعاليات المعرض</h2><p style="font-size:12px; color:#4b5563; margin:6px 0;">تتشرف شركة <strong class="active-company-text">${activeCompany}</strong> بدعوة حضرتكم الكريمة لحضور:</p><h3 style="font-size:16px; font-weight:900; color:#b45309; margin:10px 0;">[اكتب اسم الفعالية، المعرض الدولي، أو حفل تدشين المنتجات]</h3><p style="font-size:12px; color:#374151;">المكان: [اسم القاعة / أرض المعارض - الجناح رقم ...] | التاريخ: [اكتب التاريخ والوقت]</p><p style="font-size:11px; color:#6b7280; margin-top:12px;">يسعدنا ويشرفنا حضوركم الكريم ومشاركتنا هذا الحدث المتميز،،</p></div>` }
      ];
    } else if(type === 'hr_request') {
      paperSize = 'a4';
      boxes = [
        { top: '42mm', left: '12mm', width: '186mm', html: `<div style="text-align:center; border-bottom:2px solid #111; padding-bottom:6px;"><h2 style="font-size:18px; font-weight:900; margin:0;">نموذج إداري لشؤون الموظفين والموارد البشرية</h2><p style="font-size:11px; color:#6b7280; margin:2px 0;">رقم المعاملة: [HR-REQ-2026] | التاريخ: [اكتب التاريخ هـ / م]</p></div>` },
        { top: '65mm', left: '12mm', width: '186mm', height: '130mm', html: `<div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:12px; font-size:12px;"><table style="width:100%; border-collapse:collapse; margin-bottom:10px;"><tr><td style="padding:5px; font-weight:bold; width:20%;">اسم الموظف:</td><td style="padding:5px;">[اسم الموظف الرباعي]</td><td style="padding:5px; font-weight:bold; width:20%;">الرقم الوظيفي:</td><td style="padding:5px;">[EMP-0000]</td></tr><tr><td style="padding:5px; font-weight:bold;">القسم / الإدارة:</td><td style="padding:5px;">[اسم الإدارة]</td><td style="padding:5px; font-weight:bold;">المسمى الوظيفي:</td><td style="padding:5px;">[المسمى]</td></tr></table><div style="border-top:1px solid #e5e7eb; padding-top:10px;"><h4 style="font-size:13px; font-weight:bold; color:#111; margin:0 0 6px 0;">تفاصيل الطلب الإداري:</h4><p style="font-size:12px; color:#374151; line-height:1.8;">[اكتب هنا موضوع الطلب بالتفصيل: إجازة سنوية / مهمة عمل رسمية / مباشرة عمل / تعريف بالراتب / عهدة عينية... مع ذكر المبررات والتواريخ المحددة].</p></div></div>` },
        { top: '215mm', left: '15mm', width: '75mm', html: `<p style="font-size:11px; color:#6b7280;">توقيع الموظف واعتماد الإدارة،،</p><br><p style="font-size:12px; font-weight:bold;">[مدير الموارد البشرية]</p>` }
      ];
    }

    applyTemplateDataToCanvas({
      paperSize: paperSize,
      pptBoxes: boxes,
      hasPage2: false
    });
  }

  document.getElementById('lhHeaderUpload').addEventListener('change', function(e) {
    handleFileUpload(e, 'lhHeaderLayer');
  });
  document.getElementById('lhFooterUpload').addEventListener('change', function(e) {
    handleFileUpload(e, 'lhFooterLayer');
  });
  document.getElementById('lhStampUpload').addEventListener('change', function(e) {
    handleStampUpload(e, 'letterheadPage');
  });

  // ==========================================
  // 1.5 محرك المغلفات الرسمية والبريدية (Envelope Studio Engine)
  // ==========================================
  let currentEnvelopeSize = 'dl';
  let currentEnvelopeScale = 0.72;
  const ENVELOPE_STORAGE_KEY = 'alfa_envelope_custom_templates';

  // 1. ملاءمة ومعاينة المغلف الذكية ضمن مساحة العرض (Fit to View / Preview)
  function fitEnvelopeScale() {
    const container = document.getElementById('envelopeCanvasContainer');
    const env = document.getElementById('envelopePage');
    if(!container || !env) return;

    let wMm = 220;
    let hMm = 110;
    if(currentEnvelopeSize === 'c5') { wMm = 229; hMm = 162; }
    else if(currentEnvelopeSize === 'c4') { wMm = 324; hMm = 229; }

    const envPxWidth = wMm * 3.7795;
    const availWidth = Math.max(280, container.clientWidth - 48);

    // حساب المقياس ليتناسب مع العرض بدون أن ينقطع أو يقص
    let targetScale = availWidth / envPxWidth;
    targetScale = Math.min(1.0, Math.max(0.42, targetScale * 0.95));

    currentEnvelopeScale = Math.round(targetScale * 100) / 100;
    env.style.transform = `scale(${currentEnvelopeScale})`;

    // تعويض الفراغ السفلي الناجم عن التحجيم
    const rawHeight = hMm * 3.7795;
    const scaledHeight = rawHeight * currentEnvelopeScale;
    const diff = rawHeight - scaledHeight;
    env.style.marginBottom = `-${Math.max(0, Math.round(diff - 25))}px`;

    const label = document.getElementById('envZoomDisplayLabel');
    if(label) label.innerText = `${Math.round(currentEnvelopeScale * 100)}%`;
  }

  // 2. تبديل مقاس المغلف (DL / C5 / C4)
  function setEnvelopeSize(size) {
    currentEnvelopeSize = size;
    const env = document.getElementById('envelopePage');
    const badge = document.getElementById('envelopeDocBadge');
    const desc = document.getElementById('envSizeDescLabel');
    const btnDL = document.getElementById('btnEnvDL');
    const btnC5 = document.getElementById('btnEnvC5');
    const btnC4 = document.getElementById('btnEnvC4');

    [btnDL, btnC5, btnC4].forEach(b => {
      if(b) {
        b.classList.remove('bg-[#f5b700]', 'text-black', 'font-black');
        b.classList.add('bg-[#181b22]', 'text-gray-300');
      }
    });

    if(!env) return;

    if(size === 'c5') {
      env.style.width = '229mm';
      env.style.height = '162mm';
      env.style.minHeight = '162mm';
      if(btnC5) {
        btnC5.classList.add('bg-[#f5b700]', 'text-black', 'font-black');
        btnC5.classList.remove('bg-[#181b22]', 'text-gray-300');
      }
      if(badge) badge.innerText = 'مغلف متوسط C5 (229×162 مم) - لأوراق A5 أو A4 مطوية نصفين';
      if(desc) desc.innerText = 'C5 (229×162 مم) للورق A5 أو A4 مطوي نصفين';
    } else if(size === 'c4') {
      env.style.width = '324mm';
      env.style.height = '229mm';
      env.style.minHeight = '229mm';
      if(btnC4) {
        btnC4.classList.add('bg-[#f5b700]', 'text-black', 'font-black');
        btnC4.classList.remove('bg-[#181b22]', 'text-gray-300');
      }
      if(badge) badge.innerText = 'مغلف كبير C4 (324×229 مم) - للأوراق والكتالوجات A4 كاملة مفرودة';
      if(desc) desc.innerText = 'C4 (324×229 مم) للمستندات والكتالوجات A4 كاملة مفرودة';
    } else {
      env.style.width = '220mm';
      env.style.height = '110mm';
      env.style.minHeight = '110mm';
      if(btnDL) {
        btnDL.classList.add('bg-[#f5b700]', 'text-black', 'font-black');
        btnDL.classList.remove('bg-[#181b22]', 'text-gray-300');
      }
      if(badge) badge.innerText = 'مغلف مكتبي قياسي DL (220×110 مم) - للخطابات والمراسلات المطوية';
      if(desc) desc.innerText = 'DL (220×110 مم) للمراسلات والخطابات المطوية';
    }

    setTimeout(fitEnvelopeScale, 30);
  }

  // 3. التحكم بالتكبير والتصغير لكانفاس المغلف
  function zoomEnvelopeCanvas(dir) {
    if(dir === 0) {
      fitEnvelopeScale();
      return;
    }
    const env = document.getElementById('envelopePage');
    if(!env) return;

    if(dir > 0) currentEnvelopeScale = Math.min(1.35, currentEnvelopeScale + 0.08);
    else currentEnvelopeScale = Math.max(0.40, currentEnvelopeScale - 0.08);

    currentEnvelopeScale = Math.round(currentEnvelopeScale * 100) / 100;
    env.style.transform = `scale(${currentEnvelopeScale})`;

    let hMm = currentEnvelopeSize === 'c4' ? 229 : (currentEnvelopeSize === 'c5' ? 162 : 110);
    const rawHeight = hMm * 3.7795;
    const scaledHeight = rawHeight * currentEnvelopeScale;
    const diff = rawHeight - scaledHeight;
    env.style.marginBottom = `-${Math.max(0, Math.round(diff - 25))}px`;

    const label = document.getElementById('envZoomDisplayLabel');
    if(label) label.innerText = `${Math.round(currentEnvelopeScale * 100)}%`;
  }

  // 4. مزامنة الهوية من الورق المروس (Brand & Logo Sync)
  function syncEnvelopeBrandingFromLetterhead() {
    const page = document.getElementById('envelopePage');
    if(!page) return;

    // استخراج الشعار من ترويسة الورق المروس إذا تم رفعه
    const lhHeader = document.getElementById('lhHeaderLayer');
    const lhImg = lhHeader ? lhHeader.querySelector('img') : null;

    page.querySelectorAll('.active-company-text').forEach(el => {
      el.innerText = activeCompany;
    });

    const boxes = page.querySelectorAll('.ppt-box');
    if(boxes.length > 0) {
      const senderContent = boxes[0].querySelector('.ppt-content');
      if(senderContent) {
        let logoHTML = `<div style="width:24px; height:24px; border-radius:4px; background:#f5b700; color:#000; font-weight:900; display:flex; align-items:center; justify-content:center; font-size:14px;">α</div>`;
        if(lhImg && lhImg.src) {
          logoHTML = `<img src="${lhImg.src}" style="max-height:28px; max-width:65px; object-fit:contain; border-radius:2px;" />`;
        }
        senderContent.innerHTML = `
          <div class="flex items-center gap-2 mb-1">
            ${logoHTML}
            <div>
              <h4 class="active-company-text font-black text-[13px] text-gray-900 leading-none">${activeCompany}</h4>
              <p class="text-[9px] text-gray-500 font-bold">المراسلات الرسمية والإدارية المعتمدة</p>
            </div>
          </div>
          <p class="text-[10px] text-gray-600 m-0">[ص.ب: .... - الرمز البريدي: .... | الهاتف الموحد: +000 00 000 0000]</p>
          <p class="text-[10px] text-gray-600 m-0">[اكتب الدولة / المدينة - الحي - اسم الشارع] | info@scor-alfa.com</p>
        `;
      }
    }
    alert(`⚡ تم استيراد وتوحيد هوية [${activeCompany}] بنجاح إلى المغلف!`);
  }

  // 5. قوالب سريعة جاهزة للمغلف (نفس مبدأ قوالب المراسلات)
  function applyEnvelopeTemplate(type) {
    const page = document.getElementById('envelopePage');
    const topBar = document.getElementById('envTopAccentBar');
    if(!page) return;

    if(type === 'formal') {
      setEnvelopeSize('dl');
      if(topBar) topBar.style.background = 'linear-gradient(90deg, #f5b700 0%, #b4860b 100%)';
      applyFontFamily("'Cairo', sans-serif");
      resetEnvelopeToDefault();
    } else if(type === 'commercial') {
      setEnvelopeSize('dl');
      if(topBar) topBar.style.background = 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)';
      applyFontFamily("'Tajawal', sans-serif");
      const boxes = page.querySelectorAll('.ppt-box');
      if(boxes.length >= 3) {
        applyPresetToBox(boxes[0], 'env_sender_branch');
        applyPresetToBox(boxes[2], 'env_recipient_corp');
      }
    } else if(type === 'confidential') {
      setEnvelopeSize('c5');
      if(topBar) topBar.style.background = 'linear-gradient(90deg, #991b1b 0%, #dc2626 100%)';
      applyFontFamily("'Amiri', serif");
      const boxes = page.querySelectorAll('.ppt-box');
      if(boxes.length >= 3) {
        applyPresetToBox(boxes[0], 'env_sender_hq');
        applyPresetToBox(boxes[2], 'env_recipient_tender');
      }
    } else if(type === 'courier') {
      setEnvelopeSize('c4');
      if(topBar) topBar.style.background = 'linear-gradient(90deg, #065f46 0%, #10b981 100%)';
      applyFontFamily("'Cairo', sans-serif");
      const boxes = page.querySelectorAll('.ppt-box');
      if(boxes.length >= 3) {
        applyPresetToBox(boxes[0], 'env_sender_hq');
        applyPresetToBox(boxes[1], 'env_postage');
        applyPresetToBox(boxes[2], 'env_recipient_gov');
      }
    }

    setTimeout(fitEnvelopeScale, 50);
  }

  // 6. إدراج كتل عناصر المغلف (مستلم / طابع / نص)
  function insertEnvelopeBlock(type) {
    const page = document.getElementById('envelopePage');
    if(!page) return;

    const box = document.createElement('div');
    box.className = 'ppt-box';

    if(type === 'recipient') {
      box.style.top = '52mm';
      box.style.right = '70mm';
      box.style.width = '125mm';
      box.innerHTML = `
        <div class="ppt-action-bar no-print">
          <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩</span>
          <div class="relative">
            <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
            <div class="ppt-presets-dropdown">
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_corp')">🤝 مخاطبة شركة وعميل تجاري</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_gov')">🏛️ مخاطبة وزارة وهيئة رسمية</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_tender')">📋 لجنة فتح المظاريف والمناقصات</div>
            </div>
          </div>
          <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">✖</span>
        </div>
        <div class="ppt-content text-[12px]" contenteditable="true">
          ${PPT_PRESETS['env_recipient_corp']}
        </div>
        <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
        <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
      `;
    } else if(type === 'postage') {
      box.style.top = '10mm';
      box.style.left = '12mm';
      box.style.width = '44mm';
      box.style.height = '32mm';
      box.innerHTML = `
        <div class="ppt-action-bar no-print">
          <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩</span>
          <div class="relative">
            <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
            <div class="ppt-presets-dropdown">
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_postage')">📮 طابع خلوص بريد رسمي</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_urgent')">⚡ بريد مسجل عاجل</div>
            </div>
          </div>
          <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">✖</span>
        </div>
        <div class="ppt-content text-center h-full flex flex-col justify-center items-center" contenteditable="true">
          ${PPT_PRESETS['env_postage']}
        </div>
        <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
        <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
      `;
    }

    box.onclick = (e) => selectPPTBox(box, e);
    page.appendChild(box);
    initPPTBoxInteractions(box);
    selectPPTBox(box);
  }

  // 7. حفظ واسترجاع قوالب المغلفات المخصصة
  function getStoredEnvelopeTemplates() {
    try {
      const d = localStorage.getItem(ENVELOPE_STORAGE_KEY);
      return d ? JSON.parse(d) : {};
    } catch(e) { return {}; }
  }

  function refreshSavedEnvelopeTemplatesDropdown() {
    const dd = document.getElementById('savedEnvTemplatesDropdown');
    if(!dd) return;
    const t = getStoredEnvelopeTemplates();
    dd.innerHTML = '<option value="">-- اختر قالباً محفوظاً --</option>';
    for(const name in t) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.innerText = `${name} (${(t[name].size || 'dl').toUpperCase()})`;
      dd.appendChild(opt);
    }
  }

  function saveCustomEnvelopeTemplate() {
    const input = document.getElementById('customEnvTemplateNameInput');
    const name = (input.value || '').trim();
    if(!name) {
      alert('يرجى إدخال اسم لقالب المغلف (مثال: مغلف مراسلات رسمي كحلي)');
      input.focus();
      return;
    }

    const env = document.getElementById('envelopePage');
    const boxes = [];
    env.querySelectorAll('.ppt-box').forEach(b => {
      const c = b.querySelector('.ppt-content');
      boxes.push({
        top: b.style.top,
        left: b.style.left,
        bottom: b.style.bottom,
        right: b.style.right,
        width: b.style.width,
        height: b.style.height,
        fontFamily: c ? c.style.fontFamily : '',
        fontSize: c ? c.style.fontSize : '',
        html: c ? c.innerHTML : ''
      });
    });

    const data = {
      name: name,
      size: currentEnvelopeSize,
      topBarBackground: document.getElementById('envTopAccentBar') ? document.getElementById('envTopAccentBar').style.background : '',
      boxes: boxes,
      savedAt: new Date().toLocaleDateString('ar')
    };

    const templates = getStoredEnvelopeTemplates();
    templates[name] = data;
    localStorage.setItem(ENVELOPE_STORAGE_KEY, JSON.stringify(templates));
    refreshSavedEnvelopeTemplatesDropdown();
    document.getElementById('savedEnvTemplatesDropdown').value = name;
    alert(`تم حفظ قالب المغلف "${name}" بنجاح!`);
    input.value = '';
  }

  function loadSelectedEnvelopeTemplate() {
    const dd = document.getElementById('savedEnvTemplatesDropdown');
    const name = dd.value;
    if(!name) {
      alert('يرجى اختيار قالب مغلف من القائمة أولاً');
      return;
    }

    const templates = getStoredEnvelopeTemplates();
    const t = templates[name];
    if(!t) return;

    setEnvelopeSize(t.size || 'dl');
    const topBar = document.getElementById('envTopAccentBar');
    if(topBar && t.topBarBackground) topBar.style.background = t.topBarBackground;

    const env = document.getElementById('envelopePage');
    env.querySelectorAll('.ppt-box').forEach(b => b.remove());

    if(t.boxes) {
      t.boxes.forEach(b => {
        const box = document.createElement('div');
        box.className = 'ppt-box';
        if(b.top) box.style.top = b.top;
        if(b.left) box.style.left = b.left;
        if(b.bottom) box.style.bottom = b.bottom;
        if(b.right) box.style.right = b.right;
        if(b.width) box.style.width = b.width;
        if(b.height) box.style.height = b.height;

        box.innerHTML = `
          <div class="ppt-action-bar no-print">
            <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩</span>
            <div class="relative">
              <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
              <div class="ppt-presets-dropdown">
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_sender_hq')">🏢 المرسل: المقر الرئيسي</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_corp')">🤝 المرسل إليه: شركة تجارية</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_gov')">🏛️ المرسل إليه: جهة حكومية</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_postage')">📮 طابع بريد رسمي</div>
                <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_confidential')">🔒 ختم: سري وشخصي</div>
              </div>
            </div>
            <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">✖</span>
          </div>
          <div class="ppt-content" contenteditable="true">
            ${b.html}
          </div>
          <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
          <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
        `;
        const content = box.querySelector('.ppt-content');
        if(b.fontFamily && content) content.style.fontFamily = b.fontFamily;
        if(b.fontSize && content) content.style.fontSize = b.fontSize;

        box.onclick = (e) => selectPPTBox(box, e);
        env.appendChild(box);
        initPPTBoxInteractions(box);
      });
    }
    setTimeout(fitEnvelopeScale, 50);
    alert(`تم تحميل قالب المغلف "${name}" بنجاح!`);
  }

  function deleteSelectedEnvelopeTemplate() {
    const dd = document.getElementById('savedEnvTemplatesDropdown');
    const name = dd.value;
    if(!name) return;
    if(confirm(`هل أنت متأكد من حذف قالب المغلف "${name}"؟`)) {
      const templates = getStoredEnvelopeTemplates();
      delete templates[name];
      localStorage.setItem(ENVELOPE_STORAGE_KEY, JSON.stringify(templates));
      refreshSavedEnvelopeTemplatesDropdown();
    }
  }

  // 8. إعادة ضبط المغلف للوضع الافتراضي
  function resetEnvelopeToDefault() {
    const env = document.getElementById('envelopePage');
    if(!env) return;
    setEnvelopeSize('dl');
    env.innerHTML = `
      <div id="envTopAccentBar" style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, #f5b700 0%, #b4860b 100%);"></div>

      <!-- 1. صندوق المرسل والشعار -->
      <div class="ppt-box" style="top: 10mm; right: 12mm; width: 88mm;" onclick="selectPPTBox(this, event)">
        <div class="ppt-action-bar no-print">
          <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩</span>
          <div class="relative">
            <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
            <div class="ppt-presets-dropdown">
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_sender_hq')">🏢 المرسل: المقر الرئيسي</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_sender_branch')">📍 المرسل: فرع المشاريع والعمليات</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_corp')">🤝 المرسل إليه: شركة وعميل</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_gov')">🏛️ المرسل إليه: جهة حكومية</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_postage')">📮 طابع بريد رسمي</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_confidential')">🔒 ختم: سري وشخصي</div>
            </div>
          </div>
          <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">✖</span>
        </div>
        <div class="ppt-content text-[11px] leading-snug" contenteditable="true">
          <div class="flex items-center gap-2 mb-1">
            <div style="width:24px; height:24px; border-radius:4px; background:#f5b700; color:#000; font-weight:900; display:flex; align-items:center; justify-content:center; font-size:14px;">α</div>
            <div>
              <h4 class="active-company-text font-black text-[13px] text-gray-900 leading-none">${activeCompany}</h4>
              <p class="text-[9px] text-gray-500 font-bold">المراسلات الرسمية والإدارية المعتمدة</p>
            </div>
          </div>
          <p class="text-[10px] text-gray-600 m-0">[ص.ب: .... - الرمز البريدي: .... | الهاتف الموحد: +000 00 000 0000]</p>
          <p class="text-[10px] text-gray-600 m-0">[اكتب الدولة / المدينة - الحي - اسم الشارع] | info@scor-alfa.com</p>
        </div>
        <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
        <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
      </div>

      <!-- 2. صندوق طابع البريد -->
      <div class="ppt-box" style="top: 10mm; left: 12mm; width: 44mm; height: 32mm;" onclick="selectPPTBox(this, event)">
        <div class="ppt-action-bar no-print">
          <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩</span>
          <div class="relative">
            <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
            <div class="ppt-presets-dropdown">
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_postage')">📮 طابع خلوص بريد رسمي</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_urgent')">⚡ بريد مسجل عاجل</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_confidential')">🔒 ختم: سري وشخصي</div>
            </div>
          </div>
          <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">✖</span>
        </div>
        <div class="ppt-content text-center h-full flex flex-col justify-center items-center" contenteditable="true" style="border: 1.5px dashed #9ca3af; border-radius: 4px; padding: 4px; background: #f9fafb;">
          <span style="font-size: 8px; color: #6b7280; font-weight: bold;">خلوص البريد الرسمي</span>
          <span style="font-size: 15px; margin: 1px 0;">📮</span>
          <span style="font-size: 8px; color: #9ca3af; font-family: monospace;">POSTAGE PAID</span>
        </div>
        <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
        <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
      </div>

      <!-- 3. صندوق المستلم -->
      <div class="ppt-box" style="top: 48mm; right: 75mm; width: 125mm;" onclick="selectPPTBox(this, event)">
        <div class="ppt-action-bar no-print">
          <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩</span>
          <div class="relative">
            <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
            <div class="ppt-presets-dropdown">
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_corp')">🤝 مخاطبة شركة وعميل تجاري</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_gov')">🏛️ مخاطبة وزارة وهيئة رسمية</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_recipient_tender')">📋 لجنة فتح المظاريف والمناقصات</div>
            </div>
          </div>
          <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">✖</span>
        </div>
        <div class="ppt-content text-[12px]" contenteditable="true">
          <div style="border-right: 3px solid #f5b700; padding-right: 10px;">
            <span style="font-size: 11px; color: #6b7280; font-weight: bold; display: block;">إلى السادة المحترمين:</span>
            <h3 style="font-size: 15px; font-weight: 800; color: #111827; margin: 2px 0;">[اسم الشركة أو الجهة المرسل إليها]</h3>
            <p style="font-size: 11px; color: #374151; margin: 1px 0;"><strong>عناية:</strong> [الإدارة المعنية / اسم المسؤول الموجه إليه الخطاب]</p>
            <p style="font-size: 11px; color: #6b7280; margin: 1px 0;">[العنوان: الدولة - المدينة - الحي / اسم الشارع - الرمز البريدي أو ص.ب]</p>
          </div>
        </div>
        <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
        <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
      </div>

      <!-- 4. صندوق ختم سري وشخصي -->
      <div class="ppt-box" style="top: 86mm; left: 12mm; width: 55mm;" onclick="selectPPTBox(this, event)">
        <div class="ppt-action-bar no-print">
          <span class="ppt-drag-icon" title="اسحب لتحريك الصندوق">☩</span>
          <div class="relative">
            <span class="ppt-preset-btn" onclick="togglePresetsMenu(this, event)">📑 نص جاهز ▾</span>
            <div class="ppt-presets-dropdown">
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_confidential')">🔒 سري وشخصي</div>
              <div class="ppt-preset-item" onclick="applyPresetToBox(this, 'env_urgent')">⚡ عاجل جداً</div>
            </div>
          </div>
          <span class="ppt-del-btn" onclick="deletePPTBox(this)" title="حذف هذا الصندوق">✖</span>
        </div>
        <div class="ppt-content" contenteditable="true">
          <span style="border: 1.5px solid #dc2626; color: #dc2626; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 900; letter-spacing: 0.5px; display: inline-block;">
            سري وشخصي | CONFIDENTIAL
          </span>
        </div>
        <div class="ppt-handle tl"></div><div class="ppt-handle tr"></div><div class="ppt-handle bl"></div><div class="ppt-handle br"></div>
        <div class="ppt-handle tm"></div><div class="ppt-handle bm"></div><div class="ppt-handle lm"></div><div class="ppt-handle rm"></div>
      </div>
    `;
    initAllPPTBoxes();
    setTimeout(fitEnvelopeScale, 50);
  }

  // ==========================================
  // 2. المحرك المالي والمحاسبي (Financial Script)
  // ==========================================
  let currentCurrency = "$";

  function updateFinDocType(type) {
    document.getElementById('pageFinDocTitle').innerText = type;
  }

  function updateCurrency(curr) {
    currentCurrency = curr;
    document.querySelectorAll('.currency-symbol').forEach(el => el.innerText = curr);
    calculateFinTotals();
  }

  function addFinTableRow(desc = 'حفارة هيدروليكية مجنزرة موديل 2026 محرك Cummins', qty = 1, price = 48500, imgSrc = '') {
    const tbody = document.getElementById('finItemsTableBody');
    const rowCount = tbody.rows.length + 1;
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td class="text-center font-bold text-gray-700 row-index">${rowCount}</td>
      <td class="text-center">
        <div class="product-thumb-container" onclick="triggerImgUpload(this)">
          ${imgSrc ? `<img src="${imgSrc}">` : `<span class="text-[9px] text-gray-500 font-bold">+ صورة</span>`}
          <input type="file" accept="image/*" class="hidden-file-input" onchange="previewThumb(this)" style="display:none">
        </div>
      </td>
      <td><input type="text" value="${desc}" class="font-bold text-gray-900" placeholder="وصف الآلة أو المعدة..."></td>
      <td><input type="number" value="${qty}" min="1" oninput="calculateFinTotals()" class="text-center font-bold"></td>
      <td><input type="number" value="${price}" min="0" oninput="calculateFinTotals()" class="text-center font-bold"></td>
      <td class="row-total-val text-center font-black text-gray-900">$0</td>
      <td class="text-center no-print"><button onclick="deleteFinRow(this)" class="text-red-500 font-black hover:text-red-700 text-base">×</button></td>
    `;
    tbody.appendChild(tr);
    recalcIndices();
    calculateFinTotals();
  }

  function deleteFinRow(btn) {
    btn.closest('tr').remove();
    recalcIndices();
    calculateFinTotals();
  }

  function recalcIndices() {
    document.querySelectorAll('#finItemsTableBody tr').forEach((r, idx) => {
      r.querySelector('.row-index').innerText = idx + 1;
    });
  }

  function calculateFinTotals() {
    let subTotal = 0;
    document.querySelectorAll('#finItemsTableBody tr').forEach(row => {
      const inputs = row.querySelectorAll('input');
      const qty = parseFloat(inputs[1].value) || 0;
      const price = parseFloat(inputs[2].value) || 0;
      const total = qty * price;
      row.querySelector('.row-total-val').innerText = `${currentCurrency}${total.toLocaleString()}`;
      subTotal += total;
    });

    const taxPercent = parseFloat(document.getElementById('finTaxRate').value) || 0;
    document.getElementById('finTaxPercentText').innerText = taxPercent;
    const taxVal = (subTotal * taxPercent) / 100;
    const grandTotal = subTotal + taxVal;

    document.getElementById('finSubTotalVal').innerText = `${currentCurrency}${subTotal.toLocaleString()}`;
    document.getElementById('finTaxVal').innerText = `${currentCurrency}${taxVal.toLocaleString()}`;
    document.getElementById('finGrandTotalVal').innerText = `${currentCurrency}${grandTotal.toLocaleString()}`;
  }

  function triggerImgUpload(container) {
    const input = container.querySelector('.hidden-file-input');
    if(input) input.click();
  }

  function previewThumb(input) {
    const file = input.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const container = input.parentElement;
        let img = container.querySelector('img');
        if(!img) {
          container.innerHTML = `<img src=""><input type="file" accept="image/*" class="hidden-file-input" onchange="previewThumb(this)" style="display:none">`;
          img = container.querySelector('img');
        }
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function addFinNoteItem(text = '') {
    const input = document.getElementById('newFinNoteInput');
    const val = text || input.value;
    if(!val) return;
    const container = document.getElementById('finNotesContainer');
    const count = container.children.length + 1;
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center note-row text-[11px] text-gray-800';
    div.innerHTML = `<span>${count}. ${val}</span><button onclick="this.parentElement.remove(); recalcNotes();" class="text-red-500 font-bold ml-2 no-print">×</button>`;
    container.appendChild(div);
    if(!text) input.value = '';
  }

  function recalcNotes() {
    document.querySelectorAll('#finNotesContainer .note-row').forEach((item, i) => {
      const span = item.querySelector('span');
      const text = span.innerText.replace(/^\d+\.\s*/, '');
      span.innerText = `${i + 1}. ${text}`;
    });
  }

  function saveFinancialTemplate() {
    const items = [];
    document.querySelectorAll('#finItemsTableBody tr').forEach(row => {
      const inputs = row.querySelectorAll('input');
      const img = row.querySelector('.product-thumb-container img');
      items.push({
        desc: inputs[0].value,
        qty: inputs[1].value,
        price: inputs[2].value,
        img: img ? img.src : ''
      });
    });

    const notes = [];
    document.querySelectorAll('#finNotesContainer .note-row span').forEach(s => {
      notes.push(s.innerText.replace(/^\d+\.\s*/, ''));
    });

    const data = {
      client: document.getElementById('finClientName').value,
      docNum: document.getElementById('finDocNum').value,
      docType: document.getElementById('finDocTypeSelect').value,
      currency: currentCurrency,
      taxRate: document.getElementById('finTaxRate').value,
      items: items,
      notes: notes
    };

    localStorage.setItem('alfa_financial_template', JSON.stringify(data));
    alert('تم حفظ القالب المالي بنجاح في ذاكرة النظام!');
  }

  function loadFinancialTemplate() {
    const saved = localStorage.getItem('alfa_financial_template');
    if(!saved) { alert('لا يوجد قالب مالي محفوظ مسبقاً!'); return; }
    const data = JSON.parse(saved);

    document.getElementById('finClientName').value = data.client || '';
    document.getElementById('lblFinClient').innerText = data.client || '-';
    document.getElementById('finDocNum').value = data.docNum || '';
    document.getElementById('lblFinDocNum').innerText = data.docNum || '-';
    document.getElementById('finDocTypeSelect').value = data.docType || 'عرض سعر (Quotation)';
    document.getElementById('pageFinDocTitle').innerText = data.docType || 'عرض سعر (Quotation)';
    document.getElementById('finTaxRate').value = data.taxRate || 0;
    if(data.currency) {
      document.getElementById('finCurrencySelect').value = data.currency;
      updateCurrency(data.currency);
    }

    document.getElementById('finItemsTableBody').innerHTML = '';
    if(data.items && data.items.length) {
      data.items.forEach(it => addFinTableRow(it.desc, it.qty, it.price, it.img));
    } else {
      addFinTableRow();
    }

    document.getElementById('finNotesContainer').innerHTML = '';
    if(data.notes && data.notes.length) {
      data.notes.forEach(n => addFinNoteItem(n));
    }

    alert('تم استرجاع القالب المالي بنجاح!');
  }

  // ==========================================
  // 3. محرك العقود الشامل (Contracts Script)
  // ==========================================
  const initialContractClauses = {
    terms: [
      "يعتبر هذا التمهيد وجداول المواصفات الفنية الملحقة جزءاً لا يتجزأ من العقد.",
      "تخضع كافة الالتزامات والشروط للأنظمة والقوانين التجارية المعتمدة دولياً."
    ],
    obligations: [
      "يلتزم الطرف الأول بتوريد المعدات المحددة جديدة 100% وبأعلى المواصفات القياسية.",
      "يلتزم الطرف الثاني بتأمين موقع التشغيل وتجهيز الفنيين المؤهلين للعمليات."
    ],
    payments: [
      "الدفعة الأولى: 40% دفعة مقدمة عند توقيع هذا العقد.",
      "الدفعة الثانية: 40% عند إشعار جهوزية الآليات والشحن المينائي.",
      "الدفعة الثالثة: 20% بعد التركيب ومحضر الفحص الفني والاستلام النهائي (PDI)."
    ],
    delivery: [
      "يتم التسليم في موقع العميل المتفق عليه ضمن المدة الهندسية المحددة.",
      "يخضع استلام المعدات لاختبار التشغيل الفعلي وإصدار شهادة الاستلام الرسمية."
    ]
  };

  function initContracts() {
    renderContractSections(initialContractClauses);
  }

  function renderContractSections(data) {
    for(let key in data) {
      const container = document.getElementById('contract' + capitalize(key) + 'List');
      if(!container) continue;
      container.innerHTML = '';
      data[key].forEach((text, i) => {
        appendContractClauseRow(container, key, text, i + 1);
      });
    }
  }

  function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

  function appendContractClauseRow(container, key, text, num) {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center clause-item border-b border-gray-100 pb-0.5 text-[10px] text-gray-800';
    div.innerHTML = `
      <span class="w-[95%]"><strong>${num}.</strong> <input type="text" value="${text}" class="w-[92%] border-none outline-none bg-transparent font-medium"></span>
      <button onclick="this.closest('.clause-item').remove()" class="text-red-500 font-bold ml-1 no-print">×</button>
    `;
    container.appendChild(div);
  }

  function addContractClause() {
    const pillar = document.getElementById('targetContractPillar').value;
    const input = document.getElementById('newContractClauseText');
    if(!input.value) return;
    const container = document.getElementById('contract' + capitalize(pillar) + 'List');
    const count = container.children.length + 1;
    appendContractClauseRow(container, pillar, input.value, count);
    input.value = '';
  }

  function updateContractType(type) {
    document.getElementById('pageContractTitleText').innerText = type;
  }

  function saveContractTemplate() {
    const data = {
      party1: document.getElementById('contractParty1').value,
      party2: document.getElementById('contractParty2').value,
      contractType: document.getElementById('contractTypeSelect').value,
      terms: getContractPillarArray('contractTermsList'),
      obligations: getContractPillarArray('contractObligationsList'),
      payments: getContractPillarArray('contractPaymentsList'),
      delivery: getContractPillarArray('contractDeliveryList')
    };
    localStorage.setItem('alfa_contract_template', JSON.stringify(data));
    alert('تم حفظ العقد القانوني بنجاح!');
  }

  function getContractPillarArray(id) {
    const arr = [];
    document.querySelectorAll(`#${id} .clause-item input`).forEach(inp => arr.push(inp.value));
    return arr;
  }

  function loadContractTemplate() {
    const saved = localStorage.getItem('alfa_contract_template');
    if(!saved) { alert('لا يوجد عقد محفوظ مسبقاً!'); return; }
    const data = JSON.parse(saved);

    document.getElementById('contractParty1').value = data.party1;
    document.getElementById('lblContractParty1').innerText = data.party1;
    document.getElementById('contractParty2').value = data.party2;
    document.getElementById('lblContractParty2').innerText = data.party2;
    document.getElementById('contractTypeSelect').value = data.contractType;
    document.getElementById('pageContractTitleText').innerText = data.contractType;

    renderContractSections({
      terms: data.terms, obligations: data.obligations,
      payments: data.payments, delivery: data.delivery
    });
    alert('تم استرجاع العقد بنجاح!');
  }

  // ==========================================
  // 4. استوديو الكتالوجات (Technical Studio Engine)
  // ==========================================
  let ktlgZoom = 1.0;

  // قواعد بيانات المواصفات الهندسية الشاملة
  const KTLG_DATABASE = {
    'engine': [
      {k: 'طراز المحرك الهندسي', v: 'Cummins QSM11 Turbocharged'},
      {k: 'القدرة التشغيلية الحصانية', v: '335 HP (250 kW) @ 2100 RPM'},
      {k: 'سعة الأسطوانات الكلية', v: '10.8 Liters - 6 Cylinders In-line'},
      {k: 'أقصى عزم دوران تشغيلي', v: '1,420 N.m @ 1400 RPM'},
      {k: 'معايير الانبعاثات البيئية', v: 'EPA Tier 3 / EU Stage IIIA'},
      {k: 'نظام حقن الوقود', v: 'High Pressure Common Rail (HPCR)'}
    ],
    'dimensions': [
      {k: 'الطول الكلي للمعدة (نقل)', v: '10,500 mm'},
      {k: 'العرض الكلي للجنازير', v: '3,200 mm'},
      {k: 'ارتفاع الكابينة القياسي', v: '3,400 mm'},
      {k: 'الخلوص الأرضي الأدنى', v: '500 mm'},
      {k: 'عرض شوز الجنزير القياسي', v: '600 mm (Heavy Triple Grouser)'},
      {k: 'نصف قطر الدوران الخلفي', v: '3,550 mm'}
    ],
    'work_range': [
      {k: 'أقصى عمق حفر أرضي (A)', v: '7,350 mm'},
      {k: 'أقصى مدى وصول أفقي (B)', v: '10,200 mm'},
      {k: 'أقصى ارتفاع قطع وتفريغ (C)', v: '7,100 mm'},
      {k: 'أقصى ارتفاع حفر إجمالي', v: '10,150 mm'},
      {k: 'أقصى قوة قطع للمغرفة (ISO)', v: '227 kN'}
    ],
    'weights': [
      {k: 'الوزن التشغيلي القياسي', v: '34,500 kg'},
      {k: 'سعة المغرفة القياسية (SAE)', v: '1.6 - 1.9 m³ (Heavy Duty)'},
      {k: 'سعة خزان الوقود الإجمالية', v: '580 Liters'},
      {k: 'سعة خزان الزيت الهيدروليكي', v: '320 Liters'},
      {k: 'الضغط النوعي على الأرض', v: '65.2 kPa'}
    ],
    'hydraulics': [
      {k: 'طراز المضخات الرئيسية', v: 'Kawasaki Variable Displacement (2x)'},
      {k: 'أقصى معدل تدفق زيت', v: '2 × 300 L/min'},
      {k: 'أقصى ضغط تشغيلي (Main)', v: '34.3 MPa (350 bar)'},
      {k: 'ضغط دائرة الدوران (Swing)', v: '27.5 MPa'},
      {k: 'طراز صمام التحكم الرئيسي', v: 'Kawasaki Multi-spool Advanced Valve'}
    ],
    'parts': [
      {k: 'فلتر زيت المحرك (Lube Filter)', v: 'Part No: LF-9009-QSM | دورية: 250h'},
      {k: 'فلتر فاصل مياه وسولار', v: 'Part No: FS-19732-SEP | دورية: 500h'},
      {k: 'فلتر راجع الهيدروليك', v: 'Part No: HF-6820-HYD | دورية: 1000h'},
      {k: 'طقم أسنان المغرفة الصخرية', v: 'Part No: BT-350-HD-T | OEM Approved'},
      {k: 'طقم حشوات سلندر البوم', v: 'Part No: SK-CYL-350-BM | 2000h'}
    ]
  };

  // بيانات المعدات النموذجية (Presets)
  const EQUIPMENT_PRESETS = {
    'excavator_350': {
      title: 'حفارة هيدروليكية مجنزرة - طراز SCOR PRO-350',
      subtitle: 'محرك Cummins QSM11 Turbo بقوة 335 حصان | أقصى عمق حفر 7.35 متر | جاهزية الخدمة الشاقة',
      ref: 'REF: KTLG-2026-PRO350',
      power: '335 HP', weight: '34,500 kg', depth: '7.35 m', bucket: '1.8 m³',
      engineName: 'Cummins QSM11 Turbo',
      engineSpec: '335 HP (250 kW) @ 2100 rpm',
      vectorTitle: 'SCOR PRO-350'
    },
    'loader_500': {
      title: 'جرافة ولودر شاق - طراز SCOR LOAD-500',
      subtitle: 'محرك Weichai/Cummins بقوة 240 حصان | سعة مغرفة 3.5 م³ | كفاءة تعدين وتحميل فائقة',
      ref: 'REF: KTLG-2026-LD500',
      power: '240 HP', weight: '18,500 kg', depth: '4.20 m (Dump)', bucket: '3.5 m³',
      engineName: 'Weichai WD10G240',
      engineSpec: '240 HP @ 2000 rpm',
      vectorTitle: 'SCOR LOAD-500'
    },
    'bulldozer_420': {
      title: 'بلدوزر تسوية وتمهيد شاق - طراز SCOR BULL-420',
      subtitle: 'محرك ديزل تيربو بقوة 420 حصان | نصل نصف كروي هيدروليكي | نظام دفع جنازير صلب',
      ref: 'REF: KTLG-2026-BL420',
      power: '420 HP', weight: '42,000 kg', depth: '1.45 m (Ripper)', bucket: '11.8 m³ Blade',
      engineName: 'Cummins QSX15 Tier 3',
      engineSpec: '420 HP @ 1800 rpm',
      vectorTitle: 'SCOR BULL-420'
    },
    'crane_150': {
      title: 'رافعة مجنزرة شاقة - طراز SCOR CRANE-150',
      subtitle: 'قدرة رفع قصوى 150 طن | ذراع شبكي بطول 72 متر | محرك ديزل هيدروليكي متطور',
      ref: 'REF: KTLG-2026-CR150',
      power: '310 HP', weight: '135,000 kg', depth: '72 m (Boom)', bucket: '150 Ton Max',
      engineName: 'Cummins QSL9-C310',
      engineSpec: '310 HP @ 2000 rpm',
      vectorTitle: 'SCOR CR-150'
    },
    'generator_800': {
      title: 'مولد ديزل صناعي صامت - طراز SCOR POWER-800',
      subtitle: 'قدرة إنتاجية 800 kVA / 640 kW | محرك Cummins ثقيل | كابينة عازلة للصوت والحرارة',
      ref: 'REF: KTLG-2026-GEN800',
      power: '800 kVA', weight: '7,800 kg', depth: '50 Hz / 400V', bucket: '1200 L Tank',
      engineName: 'Cummins KTA38-G2A',
      engineSpec: '640 kW Continuous @ 1500 rpm',
      vectorTitle: 'POWER-800'
    }
  };

  // تطبيق نموذج الكتالوج
  function applyKtlgTemplate(templateType) {
    const p2 = document.getElementById('ktlgPage2');
    const badge = document.getElementById('ktlgDocTitleBadge');

    if(templateType === 'parts') {
      if(badge) badge.innerText = '🔧 كتالوج قطع الغيار والأرقام المرجعية';
      setKtlgPageTab('p2');
    } else if(templateType === 'brochure') {
      if(badge) badge.innerText = '📄 بروشور المنتج الهندسي (2 صفحة)';
      setKtlgPageTab('both');
    } else if(templateType === 'category') {
      if(badge) badge.innerText = '📑 كتالوج فئة المعدات المتخصصة';
      setKtlgPageTab('p1');
    } else if(templateType === 'spec_card') {
      if(badge) badge.innerText = '⚙️ بطاقة مواصفات المعدة والقدرات';
      setKtlgPageTab('p1');
    } else {
      if(badge) badge.innerText = '📖 كتالوج المنتجات والمعدات الرئيسي';
      setKtlgPageTab('p1');
    }
  }

  // تطبيق بيانات المعدة
  function applyEquipmentPreset(presetKey) {
    const data = EQUIPMENT_PRESETS[presetKey];
    if(!data) return;

    const t = document.getElementById('ktlgModelTitle');
    const st = document.getElementById('ktlgModelSubtitle');
    const ref = document.getElementById('ktlgDocRefText');
    const bp = document.getElementById('badgePower');
    const bw = document.getElementById('badgeWeight');
    const bd = document.getElementById('badgeDepth');
    const bb = document.getElementById('badgeBucket');

    if(t) t.innerText = data.title;
    if(st) st.innerText = data.subtitle;
    if(ref) ref.innerText = data.ref;
    if(bp) bp.innerText = data.power;
    if(bw) bw.innerText = data.weight;
    if(bd) bd.innerText = data.depth;
    if(bb) bb.innerText = data.bucket;

    // تحديث نص SVG
    const svgText = document.querySelector('#ktlgMainImage svg text');
    if(svgText) svgText.textContent = data.vectorTitle;
  }

  // تبديل عرض الصفحات
  function setKtlgPageTab(tab) {
    const p1 = document.getElementById('ktlgPage1');
    const p2 = document.getElementById('ktlgPage2');
    const b1 = document.getElementById('ktlgTabP1');
    const b2 = document.getElementById('ktlgTabP2');
    const bBoth = document.getElementById('ktlgTabBoth');

    [b1, b2, bBoth].forEach(b => {
      if(b) {
        b.classList.remove('bg-[#f5b700]', 'text-black');
        b.classList.add('text-gray-300');
      }
    });

    if(tab === 'p1') {
      if(p1) p1.classList.remove('hidden');
      if(p2) p2.classList.add('hidden');
      if(b1) { b1.classList.add('bg-[#f5b700]', 'text-black'); b1.classList.remove('text-gray-300'); }
    } else if(tab === 'p2') {
      if(p1) p1.classList.add('hidden');
      if(p2) p2.classList.remove('hidden');
      if(b2) { b2.classList.add('bg-[#f5b700]', 'text-black'); b2.classList.remove('text-gray-300'); }
    } else {
      if(p1) p1.classList.remove('hidden');
      if(p2) p2.classList.remove('hidden');
      if(bBoth) { bBoth.classList.add('bg-[#f5b700]', 'text-black'); bBoth.classList.remove('text-gray-300'); }
    }
  }

  // تحكم التكبير والتصغير
  function zoomKtlgCanvas(delta) {
    ktlgZoom = Math.min(1.5, Math.max(0.4, Math.round((ktlgZoom + delta) * 10) / 10));
    updateKtlgZoomDisplay();
  }

  function resetKtlgZoom() {
    ktlgZoom = 1.0;
    updateKtlgZoomDisplay();
  }

  function updateKtlgZoomDisplay() {
    const wrapper = document.getElementById('ktlgZoomWrapper');
    const label = document.getElementById('ktlgZoomLabel');
    if(wrapper) wrapper.style.transform = `scale(${ktlgZoom})`;
    if(label) label.innerText = `${Math.round(ktlgZoom * 100)}%`;
  }

  // إدراج جدول مواصفات هندسي في الصفحة
  function insertKtlgTable(customType) {
    const type = customType || document.getElementById('ktlgDataSourceSelect').value;
    const target = document.getElementById('ktlgCanvasContent');
    const rows = KTLG_DATABASE[type] || [];

    const titlesMap = {
      'engine': 'المواصفات الفنية للمحرك ومجموعة الحركة',
      'dimensions': 'الأبعاد والقياسات الهندسية المعتمدة',
      'work_range': 'نطاقات الحفر والعمل والرفع التشغيلية',
      'weights': 'الأوزان التشغيلية وسعات الخزانات',
      'hydraulics': 'النظام الهيدروليكي والمضخات وضغوط التشغيل',
      'parts': 'جدول قطع الغيار والأرقام المرجعية'
    };

    const container = document.createElement('div');
    container.className = 'free-container';
    container.style.width = '194mm';
    container.style.top = '145mm';
    container.style.left = '8mm';

    const dragBar = document.createElement('div');
    dragBar.className = 'drag-bar no-print';
    dragBar.innerHTML = `<span class="drag-title font-bold">☩ سحب جدول: ${titlesMap[type] || 'المواصفات'}</span><button onclick="this.closest('.free-container').remove()" class="text-red-500 font-bold">✖</button>`;
    container.appendChild(dragBar);

    const block = document.createElement('div');
    block.className = 'spec-block flex-1';
    block.innerHTML = `
      <div class="spec-header flex justify-between items-center">
        <span contenteditable="true">${titlesMap[type] || 'جدول المواصفات'}</span>
        <span class="text-[10px] text-amber-300 font-mono">SPEC-BLOCK</span>
      </div>
    `;

    const rowsWrap = document.createElement('div');
    rowsWrap.className = 'p-2 bg-white flex flex-col divide-y divide-gray-100 text-xs';
    rows.forEach(row => {
      const r = document.createElement('div');
      r.className = 'spec-row flex justify-between py-1 px-2';
      r.innerHTML = `<span class="spec-key font-bold text-gray-700" contenteditable="true">${row.k}:</span><span class="spec-val font-black text-gray-900" contenteditable="true">${row.v}</span>`;
      rowsWrap.appendChild(r);
    });
    block.appendChild(rowsWrap);
    container.appendChild(block);

    ['t', 'b', 'l', 'r', 'br'].forEach(p => {
      const res = document.createElement('div');
      res.className = `resizer ${p}`;
      container.appendChild(res);
    });

    target.appendChild(container);
    makeDraggable(container, dragBar);
    makeBoxResizable(container);
  }

  // بناء حاوية شبكية مرنة
  function addKtlgGrid(cols) {
    const target = document.getElementById('ktlgCanvasContent');
    const container = document.createElement('div');
    container.className = 'free-container';
    container.style.width = '194mm';
    container.style.height = '40mm';
    container.style.top = '120mm';
    container.style.left = '8mm';

    const dragBar = document.createElement('div');
    dragBar.className = 'drag-bar no-print';
    dragBar.innerHTML = `<span class="drag-title font-bold">☩ سحب حاوية شبكية (${cols} أعمدة)</span><button onclick="this.closest('.free-container').remove()" class="text-red-500 font-bold">✖</button>`;
    container.appendChild(dragBar);

    const row = document.createElement('div');
    row.className = 'grid-row flex h-full';
    for(let i=0; i<cols; i++) {
      const col = document.createElement('div');
      col.className = 'grid-col bg-white border border-gray-200 rounded p-2 flex flex-col justify-center';
      col.innerHTML = `
        <div contenteditable="true" class="w-full h-full outline-none text-xs text-gray-800">
          <strong class="text-gray-900 block font-black mb-1">العمود ${i+1}: الميزة أو البيان</strong>
          اكتب تفاصيل المواصفة أو الميزة الهندسية هنا...
        </div>
      `;
      row.appendChild(col);
      if(i < cols - 1) {
        const gut = document.createElement('div');
        gut.className = 'col-resizer';
        row.appendChild(gut);
        makeColumnResizable(col, gut, row);
      }
    }
    container.appendChild(row);

    ['t', 'b', 'l', 'r', 'br'].forEach(p => {
      const res = document.createElement('div');
      res.className = `resizer ${p}`;
      container.appendChild(res);
    });

    target.appendChild(container);
    makeDraggable(container, dragBar);
    makeBoxResizable(container);
  }

  // إضافة شريط مؤشرات أداء
  function addKtlgBadgesRow() {
    const target = document.getElementById('ktlgCanvasContent');
    const container = document.createElement('div');
    container.className = 'free-container';
    container.style.width = '194mm';
    container.style.height = '22mm';
    container.style.top = '115mm';
    container.style.left = '8mm';

    const dragBar = document.createElement('div');
    dragBar.className = 'drag-bar no-print';
    dragBar.innerHTML = `<span class="drag-title font-bold">☩ سحب كروت مؤشرات الأداء</span><button onclick="this.closest('.free-container').remove()" class="text-red-500 font-bold">✖</button>`;
    container.appendChild(dragBar);

    container.innerHTML += `
      <div class="grid grid-cols-4 gap-2 h-full p-1 bg-white">
        <div class="bg-gray-50 border border-gray-200 rounded p-1 text-center"><span class="text-[9px] text-gray-500 block">عزم الدوران</span><strong contenteditable="true" class="text-sm font-black text-gray-900">1420 N.m</strong></div>
        <div class="bg-gray-50 border border-gray-200 rounded p-1 text-center"><span class="text-[9px] text-gray-500 block">سرعة الدوران</span><strong contenteditable="true" class="text-sm font-black text-gray-900">9.8 RPM</strong></div>
        <div class="bg-gray-50 border border-gray-200 rounded p-1 text-center"><span class="text-[9px] text-gray-500 block">سرعة الحركة</span><strong contenteditable="true" class="text-sm font-black text-gray-900">5.4 km/h</strong></div>
        <div class="bg-gray-50 border border-gray-200 rounded p-1 text-center"><span class="text-[9px] text-gray-500 block">قابلية الصعود</span><strong contenteditable="true" class="text-sm font-black text-gray-900">70% (35°)</strong></div>
      </div>
      <div class="resizer br"></div><div class="resizer b"></div><div class="resizer r"></div>
    `;

    target.appendChild(container);
    makeDraggable(container, container.querySelector('.drag-bar'));
    makeBoxResizable(container);
  }

  // إضافة عنوان وموديل فخم
  function addKtlgFreeTitle() {
    const target = document.getElementById('ktlgCanvasContent');
    const wrap = document.createElement('div');
    wrap.className = 'draggable-wrapper p-2 bg-gray-900 text-white rounded-lg shadow-md';
    wrap.style.top = '160mm';
    wrap.style.left = '8mm';
    wrap.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="no-print cursor-grab drag-btn text-[#f5b700] font-bold">☩</span>
        <h2 contenteditable="true" class="text-xl font-black text-[#f5b700] outline-none">عنوان هندسي فخم وموديل معتمد</h2>
        <button onclick="this.closest('.draggable-wrapper').remove()" class="no-print text-red-400 font-bold text-xs ml-2">×</button>
      </div>
    `;
    target.appendChild(wrap);
    makeDraggable(wrap, wrap.querySelector('.drag-btn') || wrap);
  }

  // رفع صورة حرة
  function loadKtlgFreeImage(input) {
    const file = input.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const target = document.getElementById('ktlgCanvasContent');
        const wrap = document.createElement('div');
        wrap.className = 'draggable-wrapper';
        wrap.style.width = '85mm';
        wrap.style.top = '170mm';
        wrap.style.left = '8mm';
        wrap.innerHTML = `
          <img src="${e.target.result}" style="width:100%; height:auto; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          <div class="stamp-resizer"></div>
          <button onclick="this.closest('.draggable-wrapper').remove()" class="no-print absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">×</button>
        `;
        target.appendChild(wrap);
        makeDraggable(wrap, wrap);
        makeStampResizable(wrap, wrap.querySelector('.stamp-resizer'));
      };
      reader.readAsDataURL(file);
    }
  }

  // استبدال الصورة الرئيسية في الواجهة
  function replaceKtlgHeroImage(input, targetId) {
    const file = input.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const target = document.getElementById(targetId);
        if(target) {
          target.innerHTML = `<img src="${e.target.result}" class="max-h-full max-w-full object-contain rounded drop-shadow-md">`;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // إضافة ختم فحص معتمد
  function addKtlgStamp(type) {
    const target = document.getElementById('ktlgCanvasContent');
    const wrap = document.createElement('div');
    wrap.className = 'draggable-stamp';
    wrap.style.width = '120px';
    wrap.style.bottom = '40mm';
    wrap.style.right = '20mm';
    wrap.innerHTML = `
      <div style="border: 3px double #15803d; color:#15803d; border-radius:8px; padding:6px; text-align:center; transform:rotate(-6deg); font-weight:900; background:rgba(240,253,244,0.85); box-shadow:0 2px 6px rgba(0,0,0,0.1);">
        <div style="font-size:12px; letter-spacing:1px;">PDI APPROVED</div>
        <div style="font-size:9px; border-top:1px dashed #15803d; margin-top:2px; padding-top:2px;">تم الفحص الفني المعتمد</div>
        <div style="font-size:8px; font-family:monospace;">PASSED 100%</div>
      </div>
      <div class="stamp-resizer"></div>
      <button onclick="this.closest('.draggable-stamp').remove()" class="no-print absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">×</button>
    `;
    target.appendChild(wrap);
    makeDraggable(wrap, wrap);
    makeStampResizable(wrap, wrap.querySelector('.stamp-resizer'));
  }

  // إضافة رابط تواصل تفاعلي
  function addKtlgContactChip() {
    const select = document.getElementById('ktlgContactPreset');
    const opt = select.options[select.selectedIndex];
    const target = document.getElementById('ktlgCanvasContent');

    const wrap = document.createElement('div');
    wrap.className = 'draggable-wrapper bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-[#f5b700] flex items-center gap-2 text-xs font-bold shadow';
    wrap.style.top = '240mm';
    wrap.style.left = '15mm';
    wrap.innerHTML = `
      <span class="no-print cursor-grab drag-btn text-[#f5b700]">☩</span>
      <a href="${opt.value}" target="_blank" class="text-white hover:text-[#f5b700] outline-none" contenteditable="true">${opt.text}</a>
      <button onclick="this.closest('.draggable-wrapper').remove()" class="no-print text-red-400 font-bold ml-1">×</button>
    `;
    target.appendChild(wrap);
    makeDraggable(wrap, wrap.querySelector('.drag-btn') || wrap);
  }

  // ==========================================
  // دوال عامة للتوقيع والرفع والتحريك (Utilities)
  // ==========================================
  function handleFileUpload(e, targetId) {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        document.getElementById(targetId).innerHTML = `<img src="${ev.target.result}">`;
      };
      reader.readAsDataURL(file);
    }
  }

  function handleStampUpload(e, pageId) {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (ev) => addStampToPage(ev.target.result, pageId);
      reader.readAsDataURL(file);
    }
  }

  function addStampToPage(imgSrc, pageId) {
    const page = document.getElementById(pageId);
    const wrap = document.createElement('div');
    wrap.className = 'draggable-stamp';
    wrap.style.width = '130px';
    wrap.style.bottom = '35mm';
    wrap.style.right = '20mm';
    wrap.innerHTML = `<img src="${imgSrc}"><div class="stamp-resizer"></div>`;
    page.appendChild(wrap);
    makeDraggable(wrap, wrap);
    makeStampResizable(wrap, wrap.querySelector('.stamp-resizer'));
  }

  // إعداد لوحات رسم التواقيع
  function initSigPad(canvasId) {
    const canvas = document.getElementById(canvasId);
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let painting = false;

    function getCoords(e) {
      const r = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      return { x: clientX - r.left, y: clientY - r.top };
    }

    function start(e) {
      painting = true;
      const c = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      e.preventDefault();
    }
    function draw(e) {
      if(!painting) return;
      const c = getCoords(e);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000080';
      ctx.lineTo(c.x, c.y);
      ctx.stroke();
      e.preventDefault();
    }
    function end() { painting = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', end);
  }

  function clearSignature(canvasId) {
    const canvas = document.getElementById(canvasId);
    if(canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function addDrawnSignature(canvasId, targetPageId) {
    const canvas = document.getElementById(canvasId);
    if(canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      addStampToPage(dataUrl, targetPageId);
      clearSignature(canvasId);
    }
  }

  // تحريك العناصر بالسحب الحر (Draggable)
  function makeDraggable(el, handle) {
    let isDragging = false, startX, startY, initL, initT;
    handle.addEventListener('mousedown', dragStart);
    handle.addEventListener('touchstart', dragStart);

    function dragStart(e) {
      if(e.target.classList.contains('stamp-resizer') || e.target.classList.contains('resizer') || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
      isDragging = true;
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      startX = clientX; startY = clientY;
      initL = el.offsetLeft; initT = el.offsetTop;
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchmove', dragMove);
      document.addEventListener('touchend', dragEnd);
    }
    function dragMove(e) {
      if(!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const dx = (clientX - startX) / 0.64;
      const dy = (clientY - startY) / 0.64;
      el.style.left = `${initL + dx}px`;
      el.style.top = `${initT + dy}px`;
      el.style.bottom = 'auto'; el.style.right = 'auto';
    }
    function dragEnd() {
      isDragging = false;
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('touchend', dragEnd);
    }
  }

  // تحجيم الختم
  function makeStampResizable(wrapper, resizer) {
    let isR = false, sx, sw;
    resizer.addEventListener('mousedown', (e) => {
      e.stopPropagation(); isR = true; sx = e.clientX; sw = wrapper.offsetWidth;
      const rMove = (ev) => {
        if(!isR) return;
        wrapper.style.width = `${Math.max(40, sw + (sx - ev.clientX)/0.64)}px`;
      };
      const rUp = () => { isR = false; document.removeEventListener('mousemove', rMove); };
      document.addEventListener('mousemove', rMove);
      document.addEventListener('mouseup', rUp, {once:true});
    });
  }

  // تحجيم الصناديق
  function makeBoxResizable(box) {
    box.querySelectorAll('.resizer').forEach(res => {
      res.addEventListener('mousedown', (e) => {
        e.stopPropagation(); e.preventDefault();
        let startX = e.clientX, startY = e.clientY, sw = box.offsetWidth, sh = box.offsetHeight;
        const doResize = (ev) => {
          let dx = (ev.clientX - startX) / 0.64;
          let dy = (ev.clientY - startY) / 0.64;
          if(res.classList.contains('r') || res.classList.contains('br')) box.style.width = `${Math.max(80, sw + dx)}px`;
          if(res.classList.contains('b') || res.classList.contains('br')) box.style.height = `${Math.max(40, sh + dy)}px`;
        };
        const stopResize = () => { document.removeEventListener('mousemove', doResize); };
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize, {once:true});
      });
    });
  }

  // تحجيم الأعمدة
  function makeColumnResizable(leftCol, gutter, row) {
    gutter.addEventListener('mousedown', (e) => {
      e.preventDefault(); e.stopPropagation();
      const rowRect = row.getBoundingClientRect();
      const move = (ev) => {
        const mouseXFromRight = rowRect.right - ev.clientX;
        const pct = (mouseXFromRight / rowRect.width) * 100;
        if(pct > 5 && pct < 95) leftCol.style.flex = `0 0 ${pct}%`;
      };
      const stop = () => { document.removeEventListener('mousemove', move); };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', stop, {once:true});
    });
  }

  // تهيئة النظام عند الفتح
  window.addEventListener('DOMContentLoaded', () => {
    initSigPad('lhSigCanvas');
    initSigPad('envSigCanvas');
    initSigPad('finSigCanvas');
    initSigPad('contractSigCanvas');
    initContracts();
    refreshSavedTemplatesDropdown();
    refreshSavedEnvelopeTemplatesDropdown();
    initAllPPTBoxes();
    restoreAutoDraft();

    // إضافة بنود مالية افتراضية أولية
    addFinTableRow('حفارة هيدروليكية مجنزرة موديل 2026 - محرك Cummins QSM11', 1, 62000);
    addFinTableRow('شاكوش هيدروليكي ثقيل (Hydraulic Breaker) مع ملحقاته', 1, 8500);
    addFinNoteItem('مدة التوريد: خلال 30 يوم عمل من تاريخ سداد الدفعة المقدمة.');
    addFinNoteItem('الضمان: سنة كاملة أو 2000 ساعة تشغيل أيهما أسبق ضد عيوب التصنيع.');
    addFinNoteItem('التسليم في موقع العميل بعد الفحص الفني المعتمد (PDI).');

    // تفعيل رفع الملفات للفاتورة والعقد والمغلف
    document.getElementById('finHeaderUpload').addEventListener('change', (e) => handleFileUpload(e, 'finHeaderLayer'));
    document.getElementById('finFooterUpload').addEventListener('change', (e) => handleFileUpload(e, 'finFooterLayer'));
    document.getElementById('finStampUpload').addEventListener('change', (e) => handleStampUpload(e, 'invoiceA4Page'));

    document.getElementById('contractHeaderUpload').addEventListener('change', (e) => handleFileUpload(e, 'contractHeaderLayer'));
    document.getElementById('contractFooterUpload').addEventListener('change', (e) => handleFileUpload(e, 'contractFooterLayer'));
    document.getElementById('contractStampUpload').addEventListener('change', (e) => handleStampUpload(e, 'contractA4Page'));

    const envLogo = document.getElementById('envLogoUpload');
    if(envLogo) envLogo.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const page = document.getElementById('envelopePage');
        if(page) {
          const senderBox = page.querySelector('.ppt-box');
          if(senderBox) {
            const c = senderBox.querySelector('.ppt-content');
            if(c) {
              const iconDiv = c.querySelector('div[style*="border-radius:4px"]');
              const newImg = `<img src="${ev.target.result}" style="max-height:30px; max-width:65px; object-fit:contain; border-radius:2px;" />`;
              if(iconDiv) iconDiv.outerHTML = newImg;
              else c.insertAdjacentHTML('afterbegin', newImg);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    });

    const envStamp = document.getElementById('envStampUpload');
    if(envStamp) envStamp.addEventListener('change', (e) => handleStampUpload(e, 'envelopePage'));

    window.addEventListener('resize', () => {
      const envView = document.getElementById('view-envelope');
      if(envView && !envView.classList.contains('hidden')) {
        fitEnvelopeScale();
      }
    });
  });

  // ==========================================
  // محرك المعاينة الفائقة (Document Preview Engine)
  // ==========================================
  let isPreviewMode = false;
  let modalPreviewZoom = 1.0;

  function togglePreviewMode() {
    isPreviewMode = !isPreviewMode;
    document.body.classList.toggle('preview-mode', isPreviewMode);

    // تحديث زر الشريط العلوي
    const btn = document.getElementById('topTogglePreviewBtn');
    const icon = document.getElementById('topTogglePreviewIcon');
    const text = document.getElementById('topTogglePreviewText');
    if(btn && icon && text) {
      if(isPreviewMode) {
        btn.classList.add('bg-[#f5b700]', 'text-black');
        btn.classList.remove('bg-[#1f2937]', 'text-[#f5b700]');
        icon.innerText = '✏️';
        text.innerText = 'العودة للتحرير';
      } else {
        btn.classList.remove('bg-[#f5b700]', 'text-black');
        btn.classList.add('bg-[#1f2937]', 'text-[#f5b700]');
        icon.innerText = '👁️';
        text.innerText = 'معاينة المستند';
      }
    }

    // تحديث زر محرر المغلف
    const envBtn = document.getElementById('btnEnvPreviewToggle');
    if(envBtn) {
      envBtn.innerHTML = isPreviewMode ? '<span>✏️ نمط التعديل</span>' : '<span>👁️ معاينة المغلف</span>';
      if(isPreviewMode) {
        envBtn.classList.add('bg-[#f5b700]', 'text-black');
        envBtn.classList.remove('bg-[#1f2937]', 'text-[#f5b700]');
      } else {
        envBtn.classList.remove('bg-[#f5b700]', 'text-black');
        envBtn.classList.add('bg-[#1f2937]', 'text-[#f5b700]');
      }
    }

    // تحديث زر محرر الورقة الرسمية
    const lhBtn = document.getElementById('btnLhPreviewToggle');
    if(lhBtn) {
      lhBtn.innerHTML = isPreviewMode ? '<span>✏️ نمط التعديل</span>' : '<span>👁️ معاينة الورقة</span>';
      if(isPreviewMode) {
        lhBtn.classList.add('bg-[#f5b700]', 'text-black');
        lhBtn.classList.remove('bg-[#1f2937]', 'text-[#f5b700]');
      } else {
        lhBtn.classList.remove('bg-[#f5b700]', 'text-black');
        lhBtn.classList.add('bg-[#1f2937]', 'text-[#f5b700]');
      }
    }

    // تحديث زر استوديو الكتالوجات
    const ktlgBtn = document.getElementById('btnKtlgPreviewToggle');
    if(ktlgBtn) {
      ktlgBtn.innerHTML = isPreviewMode ? '<span id="ktlgPreviewBtnIcon">✏️</span> <span id="ktlgPreviewBtnText">نمط التعديل</span>' : '<span id="ktlgPreviewBtnIcon">👁️</span> <span id="ktlgPreviewBtnText">معاينة الكتالوج</span>';
      if(isPreviewMode) {
        ktlgBtn.classList.add('bg-[#f5b700]', 'text-black');
        ktlgBtn.classList.remove('bg-[#1f2937]', 'text-[#f5b700]');
      }
    }
    // تحديث كافة أزرار المعاينة الموحدة عبر جميع الشاشات
    document.querySelectorAll('.unified-preview-btn').forEach(b => {
      if(isPreviewMode) {
        b.classList.add('bg-[#f5b700]', 'text-black');
        b.classList.remove('bg-[#1f2937]', 'text-[#f5b700]');
        b.innerHTML = '<span>✏️</span> <span>العودة للتحرير</span>';
      } else {
        b.classList.remove('bg-[#f5b700]', 'text-black');
        b.classList.add('bg-[#1f2937]', 'text-[#f5b700]');
        b.innerHTML = '<span>👁️</span> <span>معاينة المستند</span>';
      }
    });

    // إلغاء تحديد الصناديق لتنظيف المستند تماماً
    if(activePPTBox) {
      activePPTBox.classList.remove('selected');
      const dd = activePPTBox.querySelector('.ppt-presets-dropdown');
      if(dd) dd.classList.remove('show');
      activePPTBox = null;
    }

    // الشريط العائم للمعاينة
    const floatBar = document.getElementById('previewFloatingBar');
    if(floatBar) {
      floatBar.style.display = isPreviewMode ? 'flex' : 'none';
    }
  }

  // فتح نافذة المعاينة الكاملة الشاملة للطباعة
  
  // ==========================================================
  // محرك المعاينة الموحد الشامل لكافة شاشات ومستندات المنظومة
  // (Standardized Universal Document Preview Engine)
  // ==========================================================
  let modalPageMode = 'both'; // 'p1', 'p2', 'both', 'spread'

  function switchModalPageView(mode) {
    modalPageMode = mode;
    const btnP1 = document.getElementById('btnModalViewP1');
    const btnP2 = document.getElementById('btnModalViewP2');
    const btnBoth = document.getElementById('btnModalViewBoth');
    const btnSpread = document.getElementById('btnModalViewSpread');
    const wrapper = document.getElementById('previewModalCanvasWrapper');
    const c1 = document.getElementById('modalCloneP1');
    const c2 = document.getElementById('modalCloneP2');

    [btnP1, btnP2, btnBoth, btnSpread].forEach(b => {
      if(b) {
        b.classList.remove('bg-[#f5b700]', 'text-black');
        b.classList.add('text-gray-300');
      }
    });

    if(mode === 'p1') {
      if(btnP1) { btnP1.classList.add('bg-[#f5b700]', 'text-black'); btnP1.classList.remove('text-gray-300'); }
      if(c1) c1.style.display = 'block';
      if(c2) c2.style.display = 'none';
      if(wrapper) { wrapper.classList.remove('preview-spread-wrapper'); }
    } else if(mode === 'p2') {
      if(btnP2) { btnP2.classList.add('bg-[#f5b700]', 'text-black'); btnP2.classList.remove('text-gray-300'); }
      if(c1) c1.style.display = 'none';
      if(c2) c2.style.display = 'block';
      if(wrapper) { wrapper.classList.remove('preview-spread-wrapper'); }
    } else if(mode === 'spread') {
      if(btnSpread) { btnSpread.classList.add('bg-[#f5b700]', 'text-black'); btnSpread.classList.remove('text-gray-300'); }
      if(c1) c1.style.display = 'block';
      if(c2) c2.style.display = 'block';
      if(wrapper) { wrapper.classList.add('preview-spread-wrapper'); }
    } else { // both vertical
      if(btnBoth) { btnBoth.classList.add('bg-[#f5b700]', 'text-black'); btnBoth.classList.remove('text-gray-300'); }
      if(c1) c1.style.display = 'block';
      if(c2) c2.style.display = 'block';
      if(wrapper) { wrapper.classList.remove('preview-spread-wrapper'); }
    }
  }

  function resetModalPreviewZoom() {
    modalPreviewZoom = 1.0;
    updateModalZoomDisplay();
  }

  function fitModalPreviewWidth() {
    modalPreviewZoom = 0.8;
    updateModalZoomDisplay();
  }

  // المعاينة العامة لأي عنصر في البوابة بمجرد النقر على زر المعاينة
  function openGenericQuickPreview(btn) {
    const item = btn.closest('.sub-item');
    if(!item) return;
    const onclickAttr = item.getAttribute('onclick');
    if(!onclickAttr) return;
    const match = onclickAttr.match(/openDocInEditor\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);
    if(match) {
      const type = match[1];
      const name = match[2];
      openTemplateQuickPreview(type, name);
    }
  }


  function openFullDocumentPreviewModal() {
    const modal = document.getElementById('docPreviewModal');
    const wrapper = document.getElementById('previewModalCanvasWrapper');
    const title = document.getElementById('previewModalTitle');
    const subtitle = document.getElementById('previewModalSubtitle');
    if(!modal || !wrapper) return;

    modalPreviewZoom = 1.0;
    updateModalZoomDisplay();

    // معرفة أي محرر نشط حالياً
    let activeView = 'letterhead';
    ['quotations', 'letterhead', 'envelope', 'financial', 'contracts', 'technical'].forEach(v => {
      const el = document.getElementById('view-' + v);
      if(el && !el.classList.contains('hidden')) activeView = v;
    });

    wrapper.innerHTML = '';

    if(activeView === 'letterhead') {
      const p1 = document.getElementById('letterheadPage');
      if(p1) {
        title.innerText = 'معاينة الورقة الرسمية المروّسة';
        const badge = document.getElementById('letterheadDocTitleBadge');
        subtitle.innerText = (badge ? badge.innerText : 'الورق الرسمي الموحد') + ' - مقاس A4 المعتمد (210 × 297 مم)';
        const clone1 = p1.cloneNode(true);
        cleanCloneForPreview(clone1);
        clone1.style.transform = 'scale(1)';
        clone1.style.margin = '0 auto';
        wrapper.appendChild(clone1);

        const p2 = document.getElementById('page2Continuation');
        if(p2 && !p2.classList.contains('hidden')) {
          const clone2 = p2.cloneNode(true);
          cleanCloneForPreview(clone2);
          clone2.style.transform = 'scale(1)';
          clone2.style.margin = '20px auto 0 auto';
          wrapper.appendChild(clone2);
        }
      }
    } else if(activeView === 'envelope') {
      const env = document.getElementById('envelopePage');
      if(env) {
        title.innerText = 'معاينة المغلف الرسمي المعتمد';
        const badge = document.getElementById('envelopeDocBadge');
        subtitle.innerText = (badge ? badge.innerText : 'مغلف رسمي') + ` - مقاس ${currentEnvelopeSize.toUpperCase()} المعتمد`;
        const clone = env.cloneNode(true);
        cleanCloneForPreview(clone);
        clone.style.transform = 'scale(1)';
        clone.style.margin = '0 auto';
        wrapper.appendChild(clone);
      }
    } else if(activeView === 'quotations') {
      const qPage = document.getElementById('quotationA4Page');
      if(qPage) {
        title.innerText = 'معاينة عرض السعر الرسمي المعتمد';
        subtitle.innerText = 'عرض سعر رسمي متكامل A4 - جاهز للطباعة والاعتماد والأرشفة';
        const clone = qPage.cloneNode(true);
        cleanCloneForPreview(clone);
        clone.style.transform = 'scale(1)';
        clone.style.margin = '0 auto';
        wrapper.appendChild(clone);
      }
    } else if(activeView === 'financial') {
      const fin = document.getElementById('invoiceA4Page');
      if(fin) {
        const titleEl = document.getElementById('pageFinDocTitle');
        title.innerText = 'معاينة المستند المالي والمحاسبي';
        subtitle.innerText = (titleEl ? titleEl.innerText : 'مستند مالي معتمد') + ' - مقاس A4 (210 × 297 مم)';
        const clone = fin.cloneNode(true);
        cleanCloneForPreview(clone);
        clone.style.transform = 'scale(1)';
        clone.style.margin = '0 auto';
        wrapper.appendChild(clone);
      }
    } else if(activeView === 'contracts') {
      const cPage = document.getElementById('contractA4Page');
      if(cPage) {
        const titleEl = document.getElementById('pageContractTitleText');
        title.innerText = 'معاينة العقد والاتفاقية القانونية';
        subtitle.innerText = (titleEl ? titleEl.innerText : 'عقد رسمي موثق') + ' - مقاس A4 (210 × 297 مم)';
        const clone = cPage.cloneNode(true);
        cleanCloneForPreview(clone);
        clone.style.transform = 'scale(1)';
        clone.style.margin = '0 auto';
        wrapper.appendChild(clone);
      }
    } else if(activeView === 'technical') {
      const p1 = document.getElementById('ktlgPage1');
      const p2 = document.getElementById('ktlgPage2');
      title.innerText = 'معاينة كتالوج المعدات والمطبوعات الفنية المعتمد (2 صفحة)';
      subtitle.innerText = 'كتالوج متكامل بصفحتين: غلاف ومؤشرات أداء + مواصفات هندسية وجداول أبعاد دقيقة';
      
      const pageControls = document.getElementById('modalPageSpreadControls');
      if(pageControls) pageControls.classList.remove('hidden');

      if(p1) {
        const clone1 = p1.cloneNode(true);
        cleanCloneForPreview(clone1);
        clone1.id = 'modalCloneP1';
        clone1.style.transform = 'scale(1)';
        clone1.style.margin = '0 auto';
        wrapper.appendChild(clone1);
      }
      if(p2) {
        const clone2 = p2.cloneNode(true);
        cleanCloneForPreview(clone2);
        clone2.id = 'modalCloneP2';
        clone2.style.transform = 'scale(1)';
        clone2.style.margin = '25px auto 0 auto';
        wrapper.appendChild(clone2);
      }
      switchModalPageView('both'); } else {
      const p1 = document.getElementById('letterheadPage');
      if(p1) {
        title.innerText = 'معاينة الورقة الرسمية المروّسة';
        subtitle.innerText = 'الورق الرسمي الموحد A4 (210 × 297 مم)';
        const clone1 = p1.cloneNode(true);
        cleanCloneForPreview(clone1);
        clone1.style.transform = 'scale(1)';
        wrapper.appendChild(clone1);
      }
    }

    modal.style.display = 'flex';
  }

  function cleanCloneForPreview(element) {
    element.id = element.id + '_previewClone';
    element.classList.remove('selected');
    element.querySelectorAll('.ppt-action-bar, .ppt-handle, .ppt-presets-dropdown, .ppt-drag-icon, .ppt-del-btn, .ppt-preset-btn, .ppt-dup-btn, .envelope-window-guide, .resizer, .drag-bar, .col-resizer, .stamp-resizer, .no-print').forEach(el => el.remove());
    element.querySelectorAll('.ppt-box').forEach(box => {
      box.classList.remove('selected');
      box.style.border = 'none';
      box.style.background = 'transparent';
      box.style.boxShadow = 'none';
      box.style.cursor = 'default';
      const content = box.querySelector('.ppt-content');
      if(content) content.removeAttribute('contenteditable');
    });
    element.querySelectorAll('.free-container').forEach(c => {
      c.style.border = 'none';
      c.style.background = 'transparent';
      c.style.boxShadow = 'none';
    });
    element.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    // تحويل حقول الإدخال إلى نصوص نظيفة تماماً
    element.querySelectorAll('input').forEach(input => {
      const span = document.createElement('span');
      span.innerText = input.value || '';
      span.className = input.className;
      span.style.cssText = input.style.cssText;
      span.style.border = 'none';
      span.style.background = 'transparent';
      span.style.boxShadow = 'none';
      input.parentNode.replaceChild(span, input);
    });
    // تحويل القوائم المنسدلة إلى نص الخيار المختار
    element.querySelectorAll('select').forEach(sel => {
      const span = document.createElement('span');
      span.innerText = (sel.options && sel.selectedIndex >= 0) ? sel.options[sel.selectedIndex].text : '';
      span.className = sel.className;
      span.style.cssText = sel.style.cssText;
      span.style.border = 'none';
      span.style.background = 'transparent';
      sel.parentNode.replaceChild(span, sel);
    });
    // تحويل نصوص Textarea إلى كتل نصية نظيفة
    element.querySelectorAll('textarea').forEach(ta => {
      const div = document.createElement('div');
      div.innerText = ta.value || '';
      div.className = ta.className;
      div.style.cssText = ta.style.cssText;
      div.style.border = 'none';
      div.style.background = 'transparent';
      div.style.whiteSpace = 'pre-wrap';
      ta.parentNode.replaceChild(div, ta);
    });
    element.querySelectorAll('.product-thumb-container').forEach(c => {
      c.style.border = 'none';
      const span = c.querySelector('span');
      if(span && !c.querySelector('img')) span.style.display = 'none';
    });
  }

  function closeFullDocumentPreviewModal() {
    const modal = document.getElementById('docPreviewModal');
    if(modal) modal.style.display = 'none';
  }

  function handlePreviewModalBackdropClick(e) {
    if(e.target.id === 'docPreviewModal') {
      closeFullDocumentPreviewModal();
    }
  }

  function zoomModalPreview(delta) {
    modalPreviewZoom = Math.min(1.6, Math.max(0.4, Math.round((modalPreviewZoom + delta) * 10) / 10));
    updateModalZoomDisplay();
  }

  function updateModalZoomDisplay() {
    const wrapper = document.getElementById('previewModalCanvasWrapper');
    const label = document.getElementById('previewModalZoomLabel');
    if(wrapper) wrapper.style.transform = `scale(${modalPreviewZoom})`;
    if(label) label.innerText = `${Math.round(modalPreviewZoom * 100)}%`;
  }

      if(modal) modal.classList.remove('hidden');
  }
