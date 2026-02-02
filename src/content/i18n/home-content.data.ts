
// Full localized data for Home Page and Pledge Flow

// --- ZH-TW (Source) ---
const ZH = {
    hero: {
        badge: '早鳥募資中',
        headline: { line1: '讓每個人都能', line2: '掌握 AI 的力量' },
        subheadline: '我們正在打造台灣最完整的 AI 學習社群——結合課程、導師、社群與實戰。成為早鳥贊助者，一起定義 AI 教育的未來。',
        primaryCta: '成為早鳥贊助者',
        secondaryCta: '看創辦人的故事',
        trustText: '已有 127 位贊助者加入我們的旅程',
    },
    heroVideoId: 'dLRdaUda8Ho',
    stats: [
        { value: '127', label: '早鳥贊助者' },
        { value: '10+', label: 'AI 課程' },
        { value: '100 萬', label: '募資目標' },
        { value: '5/23', label: '邀請制發佈會' },
    ],
    founder: {
        badge: '創辦人的話',
        headline: '10 分鐘，了解我們的願景',
        subheadline: '為什麼我們要打造 nuvaClub？這個平台將如何改變人類 AI 學習的方式？',
        videoId: 'zy4_L9JbMFQ',
        duration: '10:23',
        chapterTitle: '影片章節',
        chapters: [
            { time: '0:00', title: '嘿嘿' },
            { time: '0:33', title: '最一開始是怎麼接觸 AI 的？' },
            { time: '2:10', title: '第一步棋：線上免費講座' },
            { time: '3:09', title: '第二步棋：實體工作坊' },
            { time: '4:27', title: '第三步棋：nuva Academy' },
            { time: '6:03', title: '第四步棋：AI SAGA' },
            { time: '7:03', title: '第五步棋：nuvaClub' },
        ],
    },
    funding: {
        badge: '早鳥限定方案',
        headline: '選擇你的贊助方案',
        subheadline: '7/1 解鎖所有平台功能（早鳥預購只到 02/28）',
        basePlanName: 'Voyager',
        progressLabel: '募資進度',
        goalLabel: '目標',
        achievedLabel: '達成',
        remainingLabel: '還差',
        tierCard: {
            inputLabel: '輸入金額',
            minAmount: '最低',
            getMembership: '獲得會員',
            months: '個月',
            avgMonthly: '平均每月',
            exclusivePerks: '限定贈品',
            selectAmount: '選擇此金額',
            selectPlan: '選擇此方案',
            payMonths: '支付',
            getMonths: '獲得',
            save: '省',
            limited: '限量',
            limitedUnit: '組',
            easterEgg: '上哲會叫你一聲爸爸',
        }
    },
    tiers: [
        {
            id: 'tier-1', name: '買 2 送 1', subtitle: '入門體驗', payMonths: 2, getMonths: 3, price: 1980, originalValue: 2970,
            perks: ['完整課程存取權', '社群討論區參與', '專案挑戰投稿權', '12 級 AI 能力測驗', '五月後每月一堂新課程'],
            highlight: false, badge: null, limitedQty: null, exclusivePerks: []
        },
        {
            id: 'tier-2', name: '買 3 送 3', subtitle: '深度學習', payMonths: 3, getMonths: 6, price: 2970, originalValue: 5940,
            perks: ['完整課程存取權', '社群討論區參與', '專案挑戰投稿權', '12 級 AI 能力測驗', '五月後每月一堂新課程'],
            highlight: false, badge: '熱門選擇', limitedQty: null,
            exclusivePerks: [{ icon: '🎒', title: 'nuva 限定帆布袋' }]
        },
        {
            id: 'tier-3', name: '買 5 送 7', subtitle: '一年完整旅程', payMonths: 5, getMonths: 12, price: 4950, originalValue: 11880,
            perks: ['完整課程存取權', '社群討論區參與', '專案挑戰投稿權', '12 級 AI 能力測驗', '五月後每月一堂新課程'],
            highlight: true, badge: '最佳價值', limitedQty: null,
            exclusivePerks: [{ icon: '🎒', title: 'nuva 限定帆布袋' }, { icon: '🎟️', title: '產品發佈會入場門票' }]
        },
    ],
    customTier: {
        name: '自訂金額', subtitle: '支持我們的夢想', minPrice: 10000,
        perks: ['完整課程存取權', '社群討論區參與', '專案挑戰投稿權', '12 級 AI 能力測驗', '五月後每月一堂新課程'],
        exclusivePerks: [
            { icon: '🎒', title: 'nuva 限定帆布袋', color: 'amber' },
            { icon: '🎟️', title: '產品發佈會 VIP 門票', color: 'red' },
            { icon: '🎁', title: '神秘夢想者徽章', color: 'red' },
        ]
    },
    checkout: {
        title: '填寫贊助資訊',
        fields: {
            name: { label: '姓名', placeholder: '請輸入您的姓名' },
            email: { label: '電子信箱', placeholder: 'example@email.com' },
            phone: { label: '手機號碼', placeholder: '0912345678' },
            cardNumber: { label: '信用卡號', placeholder: '1234 5678 9012 3456' },
            cardExpiry: { label: '有效期限', placeholder: 'MM/YY' },
            cardCvc: { label: '安全碼', placeholder: 'CVC' },
        },
        submitButton: '確認付款',
        cancelButton: '取消',
    },
    faq: { headline: '常見問題', subheadline: '關於早鳥贊助的疑問，我們都幫你整理好了' },
    faqItems: [
        { question: '贊助後什麼時候可以開始使用？', answer: '您現在就可以預覽平台的各項功能模組！預計 7/1 全平台開放，3/1 開始會有 Learn 可以使用。' },
        { question: '買 X 送 Y 是什麼意思？', answer: '這是我們的早鳥限定優惠！例如「買 3 送 3」表示您支付 3 個月的費用，但可以獲得 6 個月的完整使用權。' },
        { question: '2026年5月23號邀請制產品發佈會是什麼？', answer: '這是專屬於「買 5 送 7」方案及自訂金額贊助者的邀請制實體活動。您將有機會與創辦人面對面交流、認識其他早期支持者，並獲得獨家的平台搶先體驗。' },
        { question: '我可以送給朋友嗎？', answer: '可以！您可以在正式上線後將您的贊助資格轉移給指定的朋友。轉移功能將在會員後台提供，操作簡單且免費。' },
        { question: '如果我不滿意可以退款嗎？', answer: '我們提供 14 天無條件退款保證。如果您在贊助後 14 天內對任何原因不滿意，只需聯繫我們即可獲得全額退款，無需說明理由。' },
        { question: '我需要有 AI 或程式背景嗎？', answer: '完全不需要！nuvaClub 的課程從零基礎開始設計。只要您會使用電腦和網路，就能跟著我們的課程學習 AI。' },
        { question: '可以開立公司發票打統編嗎？', answer: '可以！我們支援開立三聯式發票。在結帳時選擇「公司發票」，填入公司名稱及統一編號即可。' },
        { question: '贊助後的發票什麼時候會開立？', answer: '電子發票預計將於 03/09 - 03/13 期間統一開立，並寄送至您填寫的電子信箱。' },
    ],
    finalCta: {
        headline: 'AI 時代已經來臨', headlineHighlight: '你準備好了嗎？',
        subheadline: '成為 nuvaClub 的早鳥贊助者，與我們一起打造 AI 學習的未來。',
        primaryCta: '立即成為贊助者',
        trustPoints: ['14 天無條件退款', '限量早鳥優惠', '正式上線優先存取'],
    },
    celebration: {
        title: '謝謝你支持我們的夢想',
        subtitle: '您已成為 nuvaClub 早鳥贊助者',
        description: '我們會透過 Email 通知您最新進度，敬請期待！',
        closeButton: '關閉',
        progressLabel: '募資進度更新',
        membershipLabel: 'MEMBERSHIP',
        earlyBackerLabel: 'EARLY BACKER',
        memberNoLabel: 'MEMBER NO.',
        downloading: '下載中...',
        downloadCards: '下載會員卡',
        downloadCardsPlural: '下載會員卡 ({count}張)',
        copySuccess: '已複製連結！',
        shareText: '我剛剛成為了 nuvaClub 的第 {number} 號贊助者！一起來支持 AI 學習社群吧！',
        prevCard: '上一張卡片',
        nextCard: '下一張卡片',
        cardAria: '卡片 {index}',
        iosSaveNote: '請長按圖片以儲存到相簿',
        downloadFailed: '圖片下載失敗，請長按圖片以儲存',
    },
    toast: {
        pledgeSuccess: { title: '感謝您的贊助！', description: '您已成功加入早鳥贊助者的行列。我們會透過 Email 通知您最新進度。' },
        pledgeError: { title: '贊助失敗', description: '很抱歉，發生了一些問題。請稍後再試或聯繫客服。' }
    },
    comingSoon: {
        headline: 'nuvaClub 即將啟程',
        subheadline: '2026 年 7 月 1 日，與你一起開啟 AI 學習新紀元',
        backToHome: '返回首頁',
        badge: '正式上線倒數',
        footerDate: '預定上線日期：2026/07/01'
    },
    preview: { badge: '平台功能預覽', headline: '探索 nuvaClub 的世界', subheadline: '點擊預覽各功能模組。完整功能將於 7/1 正式上線後開放，感謝你的耐心等候！', cardBadge: '03/01開放預覽' },
    modules: [
        {
            icon: '📚', title: 'Learn', subtitle: '結構化課程', description: '從 ChatGPT 基礎到進階自動化，系統化學習 AI 實戰技能',
            href: '/learn', color: 'from-blue-500/20 to-blue-600/10', borderColor: 'border-blue-500/30', status: 'preview'
        },
        {
            icon: '🧪', title: 'Test', subtitle: 'AI 能力測驗', description: '12 級認證系統，測試你的 AI 能力並獲得證書',
            href: '/test', color: 'from-green-500/20 to-green-600/10', borderColor: 'border-green-500/30', status: 'preview'
        },
        {
            icon: '💬', title: 'Forum', subtitle: '社群討論', description: '與其他學習者交流，獲得專家解答與資源分享',
            href: '/forum', color: 'from-yellow-500/20 to-yellow-600/10', borderColor: 'border-yellow-500/30', status: 'preview'
        },
        {
            icon: '🤝', title: 'Space', subtitle: '導師配對', description: '尋找你的 Nunu 導師，獲得一對一指導與支持',
            href: '/space', color: 'from-purple-500/20 to-purple-600/10', borderColor: 'border-purple-500/30', status: 'preview'
        },
        {
            icon: '🚀', title: 'Sprint', subtitle: '專案挑戰', description: '參與季度挑戰，打造作品集並獲得社群回饋',
            href: '/sprint', color: 'from-orange-500/20 to-orange-600/10', borderColor: 'border-orange-500/30', status: 'preview'
        },
        {
            icon: '🛒', title: 'Shop', subtitle: '商店與活動', description: '獨家工作坊、實體活動與限量周邊商品',
            href: '/shop', color: 'from-pink-500/20 to-pink-600/10', borderColor: 'border-pink-500/30', status: 'preview'
        },
    ],
    countdown: {
        label: '募資倒數',
        ended: '募資已結束',
        days: '天',
        hours: '時',
        minutes: '分',
        seconds: '秒',
    },
    attendeeSelection: {
        title: '選擇人數',
        subtitle: '您要為幾位參加者購買此方案？',
        planLabel: '方案',
        periodLabel: '會員期間',
        monthsLabel: '個月',
        selectLabel: '選擇人數',
        customLabel: '自訂',
        customPlaceholder: '請輸入人數（1-99）',
        cancelLabel: '取消',
        processingLabel: '處理中...',
        labels: {
            person: '位',
            perPerson: '每人',
            total: '總計',
            continue: '繼續結帳',
        },
    }
};

// --- EN (Translation) ---
const EN = {
    hero: {
        badge: 'Early Bird Crowdfunding',
        headline: { line1: 'Empowering Everyone', line2: 'To Master AI' },
        subheadline: 'We are building the most comprehensive AI learning community—combining courses, mentors, and real-world projects. Become an early bird backer and define the future of AI education.',
        primaryCta: 'Become a Backer',
        secondaryCta: 'Founder Story',
        trustText: '127 backers have already joined our journey',
    },
    heroVideoId: 'dLRdaUda8Ho',
    stats: [
        { value: '127', label: 'Backers' },
        { value: '10+', label: 'Courses' },
        { value: '1M', label: 'Goal' },
        { value: '5/23', label: 'Launch Event' },
    ],
    founder: {
        badge: 'Founder\'s Message',
        headline: 'Our Vision in 10 Minutes',
        subheadline: 'Why did we build nuvaClub? How will this platform change the way we learn AI?',
        videoId: 'zy4_L9JbMFQ',
        duration: '10:23',
        chapterTitle: 'Video Chapters',
        chapters: [
            { time: '0:00', title: 'Hey Hey' },
            { time: '0:33', title: 'How I first encountered AI' },
            { time: '2:10', title: 'Step 1: Free Online Seminar' },
            { time: '3:09', title: 'Step 2: Physical Workshop' },
            { time: '4:27', title: 'Step 3: nuva Academy' },
            { time: '6:03', title: 'Step 4: AI SAGA' },
            { time: '7:03', title: 'Step 5: nuvaClub' },
        ],
    },
    funding: {
        badge: 'Limited Time Offer',
        headline: 'Choose Your Plan',
        subheadline: 'Unlock all features on July 1st (Early bird offer ends 02/28)',
        basePlanName: 'Voyager',
        progressLabel: 'Progress',
        goalLabel: 'Goal',
        achievedLabel: 'Funded',
        remainingLabel: 'To Go',
        tierCard: {
            inputLabel: 'Enter Amount',
            minAmount: 'Minimum',
            getMembership: 'Get Membership',
            months: 'Months',
            avgMonthly: 'Avg Monthly',
            exclusivePerks: 'Exclusive Gifts',
            selectAmount: 'Select Amount',
            selectPlan: 'Select Plan',
            payMonths: 'Pay',
            getMonths: 'Get',
            save: 'Save',
            limited: 'Limited',
            limitedUnit: 'Sets',
            easterEgg: 'Shang-Che will call you Daddy',
        }
    },
    tiers: [
        {
            id: 'tier-1', name: 'Buy 2 Get 1 Free', subtitle: 'Starter', payMonths: 2, getMonths: 3, price: 1980, originalValue: 2970,
            perks: ['Full Course Access', 'Community Forum', 'Project Challenges', 'AI Skill Assessment', 'New Course Monthly (May+)'],
            highlight: false, badge: null, limitedQty: null, exclusivePerks: []
        },
        {
            id: 'tier-2', name: 'Buy 3 Get 3 Free', subtitle: 'Deep Dive', payMonths: 3, getMonths: 6, price: 2970, originalValue: 5940,
            perks: ['Full Course Access', 'Community Forum', 'Project Challenges', 'AI Skill Assessment', 'New Course Monthly (May+)'],
            highlight: false, badge: 'Most Popular', limitedQty: null,
            exclusivePerks: [{ icon: '🎒', title: 'Limited Canvas Bag' }]
        },
        {
            id: 'tier-3', name: 'Buy 5 Get 7 Free', subtitle: 'Full Journey', payMonths: 5, getMonths: 12, price: 4950, originalValue: 11880,
            perks: ['Full Course Access', 'Community Forum', 'Project Challenges', 'AI Skill Assessment', 'New Course Monthly (May+)'],
            highlight: true, badge: 'Best Value', limitedQty: null,
            exclusivePerks: [{ icon: '🎒', title: 'Limited Canvas Bag' }, { icon: '🎟️', title: 'Launch Event Ticket' }]
        },
    ],
    customTier: {
        name: 'Custom Amount', subtitle: 'Support Our Dream', minPrice: 10000,
        perks: ['Full Course Access', 'Community Forum', 'Project Challenges', 'AI Skill Assessment', 'New Course Monthly (May+)'],
        exclusivePerks: [
            { icon: '🎒', title: 'Limited Canvas Bag', color: 'amber' },
            { icon: '🎟️', title: 'VIP Event Ticket', color: 'red' },
            { icon: '🎁', title: 'Mystery Dreamer Badge', color: 'red' },
        ]
    },
    checkout: {
        title: 'Pledge Information',
        fields: {
            name: { label: 'Name', placeholder: 'Your Name' },
            email: { label: 'Email', placeholder: 'example@email.com' },
            phone: { label: 'Phone', placeholder: '0912345678' },
            cardNumber: { label: 'Card Number', placeholder: '1234 5678 9012 3456' },
            cardExpiry: { label: 'Expiry', placeholder: 'MM/YY' },
            cardCvc: { label: 'CVC', placeholder: 'CVC' },
        },
        submitButton: 'Checkout',
        cancelButton: 'Cancel',
    },
    faq: { headline: 'FAQ', subheadline: 'Common questions about early bird pledging' },
    faqItems: [
        { question: 'When can I start using it after pledging?', answer: 'You can preview platform features now! Full access opens July 1st, with Learn module available March 1st. Early adopters will get priority access to the official release and enjoy instant early bird benefits.' },
        { question: 'What does Buy X Get Y mean?', answer: 'This is our early bird limited offer! For example, "Buy 3 Get 3" means you pay for 3 months but get 6 months of full access. This is a special plan to thank early supporters.' },
        { question: 'What is the invite-only product launch on May 23, 2026?', answer: 'This is an invite-only physical event exclusively for "Buy 5 Get 7 Free" plan and Custom Amount backers. You will have the opportunity to meet the founders, connect with other early supporters, and get exclusive early access to platform features. The event will be held in Taipei.' },
        { question: 'Can I gift this to a friend?', answer: 'Yes! You can transfer your sponsorship qualification to a designated friend after the official launch. The transfer function will be provided in the member dashboard, simple and free.' },
        { question: 'Can I get a refund if I\'m not satisfied?', answer: 'We offer a 14-day unconditional refund guarantee. If you are unsatisfied for any reason within 14 days of pledging, simply contact us for a full refund, no questions asked.' },
        { question: 'Do I need an AI or programming background?', answer: 'Absolutely not! nuvaClub courses are designed from scratch. As long as you can use a computer and the internet, you can learn AI with us. Many successful students started with zero technical background.' },
        { question: 'Can I issue a company invoice with a Tax ID?', answer: 'Yes! We support issuing tri-plicate invoices. When checking out, select "Company Invoice" and enter the company name and Tax ID. The electronic invoice will be sent to your email after payment.' },
        { question: 'When will the invoice be issued after my pledge?', answer: 'Electronic invoices are expected to be issued between 03/09 and 03/13 and will be sent to your registered email address.' },
    ],
    finalCta: {
        headline: 'The AI Era is Here', headlineHighlight: 'Are you ready?',
        subheadline: 'Become a nuvaClub early backer and build the future of AI learning with us.',
        primaryCta: 'Pledge Now',
        trustPoints: ['14-Day Refund', 'Limited Offer', 'Priority Access'],
    },
    celebration: {
        title: 'Thank You for Supporting Our Dream',
        subtitle: 'You are now a nuvaClub Early Backer',
        description: 'We will notify you of the latest progress via email, stay tuned!',
        closeButton: 'Close',
        progressLabel: 'Funding Progress Update',
        membershipLabel: 'MEMBERSHIP',
        earlyBackerLabel: 'EARLY BACKER',
        memberNoLabel: 'MEMBER NO.',
        downloading: 'Downloading...',
        downloadCards: 'Download Card',
        downloadCardsPlural: 'Download Cards ({count})',
        copySuccess: 'Link copied!',
        shareText: 'I just became backer #{number} of nuvaClub! Join me in supporting the AI learning community!',
        prevCard: 'Previous Card',
        nextCard: 'Next Card',
        cardAria: 'Card {index}',
        iosSaveNote: 'Please long-press the image to save to your album',
        downloadFailed: 'Download failed, please long-press the image to save',
    },
    toast: {
        pledgeSuccess: { title: 'Thank you!', description: 'You have successfully joined as an early bird backer. Check your email for updates.' },
        pledgeError: { title: 'Pledge Failed', description: 'Sorry, something went wrong. Please try again or contact support.' }
    },
    comingSoon: {
        headline: 'nuvaClub is launching soon',
        subheadline: 'July 1, 2026, starting a new era of AI learning with you',
        backToHome: 'Back to Home',
        badge: 'Official Launch Countdown',
        footerDate: 'Scheduled Launch Date: 2026/07/01'
    },
    preview: { badge: 'Platform Preview', headline: 'Explore nuvaClub', subheadline: 'Click to preview modules. Full features launch July 1st.', cardBadge: 'Preview on 03/01' },
    modules: [
        {
            icon: '📚', title: 'Learn', subtitle: 'Structured Courses', description: 'Master AI from ChatGPT basics to advanced automation with our systematic curriculum.',
            href: '/learn', color: 'from-blue-500/20 to-blue-600/10', borderColor: 'border-blue-500/30', status: 'preview'
        },
        {
            icon: '🧪', title: 'Test', subtitle: 'AI Assessment', description: '12-Level Certification System to validate your AI skills.',
            href: '/test', color: 'from-green-500/20 to-green-600/10', borderColor: 'border-green-500/30', status: 'preview'
        },
        {
            icon: '💬', title: 'Forum', subtitle: 'Community Forum', description: 'Connect with other learners, get expert answers, and share resources.',
            href: '/forum', color: 'from-yellow-500/20 to-yellow-600/10', borderColor: 'border-yellow-500/30', status: 'preview'
        },
        {
            icon: '🤝', title: 'Space', subtitle: 'Mentor Match', description: 'Find your Nunu mentor for 1-on-1 guidance.',
            href: '/space', color: 'from-purple-500/20 to-purple-600/10', borderColor: 'border-purple-500/30', status: 'preview'
        },
        {
            icon: '🚀', title: 'Sprint', subtitle: 'Project Challenges', description: 'Join quarterly challenges to build your portfolio and get feedback.',
            href: '/sprint', color: 'from-orange-500/20 to-orange-600/10', borderColor: 'border-orange-500/30', status: 'preview'
        },
        {
            icon: '🛒', title: 'Shop', subtitle: 'Shop & Events', description: 'Exclusive workshops, offline events, and limited merchandise.',
            href: '/shop', color: 'from-pink-500/20 to-pink-600/10', borderColor: 'border-pink-500/30', status: 'preview'
        },
    ],
    countdown: {
        label: 'Countdown',
        ended: 'Ended',
        days: 'd',
        hours: 'h',
        minutes: 'm',
        seconds: 's',
    },
    attendeeSelection: {
        title: 'Select Attendees',
        subtitle: 'How many people are you purchasing for?',
        planLabel: 'Plan',
        periodLabel: 'Duration',
        monthsLabel: 'Months',
        selectLabel: 'Attendees',
        customLabel: 'Custom',
        customPlaceholder: '1-99',
        cancelLabel: 'Cancel',
        processingLabel: 'Processing...',
        labels: {
            person: '',
            perPerson: '/person',
            total: 'Total',
            continue: 'Checkout',
        },
    }
};

// --- JA/KO (Placeholders) ---
const COMING_SOON_JA = {
    hero: { badge: '近日公開', headline: { line1: '準備中', line2: 'Coming Soon' }, subheadline: 'Nuva Clubは現在準備中です。', primaryCta: '近日公開', secondaryCta: '近日公開', trustText: 'Coming Soon' },
    heroVideoId: '', stats: [],
    founder: { badge: '', headline: '', subheadline: '', videoId: '', duration: '', chapterTitle: '', chapters: [] },
    funding: {
        badge: '', headline: '', subheadline: '', basePlanName: '', progressLabel: '', goalLabel: '', achievedLabel: '', remainingLabel: '',
        tierCard: { inputLabel: '', minAmount: '', getMembership: '', months: '', avgMonthly: '', exclusivePerks: '', selectAmount: '', selectPlan: '', payMonths: '', getMonths: '', save: '', limited: '', limitedUnit: '', easterEgg: '' }
    },
    tiers: [],
    customTier: { name: '', subtitle: '', minPrice: 0, perks: [], exclusivePerks: [] },
    checkout: { title: 'Coming Soon', fields: { name: { label: '', placeholder: '' }, email: { label: '', placeholder: '' }, phone: { label: '', placeholder: '' }, cardNumber: { label: '', placeholder: '' }, cardExpiry: { label: '', placeholder: '' }, cardCvc: { label: '', placeholder: '' } }, submitButton: '', cancelButton: '' },
    faq: { headline: '', subheadline: '' }, faqItems: [],
    finalCta: { headline: '', headlineHighlight: '', subheadline: '', primaryCta: '', trustPoints: [] },
    toast: { pledgeSuccess: { title: '', description: '' }, pledgeError: { title: '', description: '' } },
    celebration: {
        title: '', subtitle: '', description: '', closeButton: '', progressLabel: '', membershipLabel: '', earlyBackerLabel: '', memberNoLabel: '', downloading: '', downloadCards: '', downloadCardsPlural: '', copySuccess: '', shareText: '', prevCard: '', nextCard: '', cardAria: '', iosSaveNote: '', downloadFailed: '', shareButtons: []
    },
    preview: { badge: '', headline: '', subheadline: '', cardBadge: '' }, modules: [],
    countdown: { label: '', ended: '', days: '', hours: '', minutes: '', seconds: '' },
    attendeeSelection: { title: '', subtitle: '', planLabel: '', periodLabel: '', monthsLabel: '', selectLabel: '', customLabel: '', customPlaceholder: '', cancelLabel: '', processingLabel: '', labels: { person: '', perPerson: '', total: '', continue: '' } }
};

const COMING_SOON_KO = {
    hero: { badge: '곧 출시 예정', headline: { line1: '준비 중', line2: 'Coming Soon' }, subheadline: 'Nuva Club은 현재 준비 중입니다.', primaryCta: '곧 출시 예정', secondaryCta: '곧 출시 예정', trustText: 'Coming Soon' },
    heroVideoId: '', stats: [],
    founder: { badge: '', headline: '', subheadline: '', videoId: '', duration: '', chapterTitle: '', chapters: [] },
    funding: {
        badge: '', headline: '', subheadline: '', basePlanName: '', progressLabel: '', goalLabel: '', achievedLabel: '', remainingLabel: '',
        tierCard: { inputLabel: '', minAmount: '', getMembership: '', months: '', avgMonthly: '', exclusivePerks: '', selectAmount: '', selectPlan: '', payMonths: '', getMonths: '', save: '', limited: '', limitedUnit: '', easterEgg: '' }
    },
    tiers: [],
    customTier: { name: '', subtitle: '', minPrice: 0, perks: [], exclusivePerks: [] },
    checkout: { title: 'Coming Soon', fields: { name: { label: '', placeholder: '' }, email: { label: '', placeholder: '' }, phone: { label: '', placeholder: '' }, cardNumber: { label: '', placeholder: '' }, cardExpiry: { label: '', placeholder: '' }, cardCvc: { label: '', placeholder: '' } }, submitButton: '', cancelButton: '' },
    faq: { headline: '', subheadline: '' }, faqItems: [],
    finalCta: { headline: '', headlineHighlight: '', subheadline: '', primaryCta: '', trustPoints: [] },
    toast: { pledgeSuccess: { title: '', description: '' }, pledgeError: { title: '', description: '' } },
    celebration: {
        title: '', subtitle: '', description: '', closeButton: '', progressLabel: '', membershipLabel: '', earlyBackerLabel: '', memberNoLabel: '', downloading: '', downloadCards: '', downloadCardsPlural: '', copySuccess: '', shareText: '', prevCard: '', nextCard: '', cardAria: '', iosSaveNote: '', downloadFailed: '', shareButtons: []
    },
    preview: { badge: '', headline: '', subheadline: '', cardBadge: '' }, modules: [],
    countdown: { label: '', ended: '', days: '', hours: '', minutes: '', seconds: '' },
    attendeeSelection: { title: '', subtitle: '', planLabel: '', periodLabel: '', monthsLabel: '', selectLabel: '', customLabel: '', customPlaceholder: '', cancelLabel: '', processingLabel: '', labels: { person: '', perPerson: '', total: '', continue: '' } }
};


export const LOCALES_DATA = {
    'zh-TW': ZH,
    'en': EN,
    'ja': COMING_SOON_JA,
    'ko': COMING_SOON_KO,
};

// Also export individual for usage
export const HOME_CONTENT_ZH = ZH;
