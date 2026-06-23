// CT-AI Academy - Study Application
// Design: Academic, Precise, Future-Proof

const AppState = { currentPage: 'home', currentChapter: null };
const COURSES = {
  'ct-ai': {
    id:'ct-ai', title:'CT-AI Foundation', short:'CT-AI', subtitle:'Certified Tester AI Testing',
    desc:'Master AI testing with ISTQB\'s official syllabus. Covers ML testing, data quality, model validation, and AI system testing.',
    icon:'🤖', color:'#0058bb', gradient:'from-blue-600 to-indigo-700', chapters:7, questions:43,
    img:'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format'
  },
  'ct-genai': {
    id:'ct-genai', title:'CT-GenAI Foundation', short:'GenAI', subtitle:'Testing with Generative AI',
    desc:'Learn to test GenAI systems, LLMs, prompt engineering, and AI-powered applications.',
    icon:'⚡', color:'#7c3aed', gradient:'from-violet-600 to-purple-700', chapters:6, questions:40,
    img:'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop&auto=format',
    coming:true
  }
};
function getCurrentCourse() { try { return localStorage.getItem('ctai_course'); } catch(e) { return null; } }
function setCurrentCourse(id) { if (COURSES[id]) localStorage.setItem('ctai_course', id); }

// ===== PROGRESS TRACKING =====
function trackChapterVisit(chapter) {
  if (!chapter) return;
  try {
    const visits = JSON.parse(localStorage.getItem('ctai_chapter_visits') || '[]');
    if (!visits.includes(chapter)) visits.push(chapter);
    localStorage.setItem('ctai_chapter_visits', JSON.stringify(visits));
    localStorage.setItem('ctai_last_chapter', String(chapter));
  } catch(e) { /* ignore */ }
}

function getLastVisitedChapter() {
  try { return parseInt(localStorage.getItem('ctai_last_chapter')) || 1; } catch(e) { return 1; }
}

function getVisitedChapters() {
  try { return JSON.parse(localStorage.getItem('ctai_chapter_visits') || '[]'); } catch(e) { return []; }
}

function getStudyProgress() {
  const visited = getVisitedChapters();
  const total = SYLLABUS_DATA.length;
  return { visited: visited.length, total, pct: total > 0 ? Math.round((visited.length / total) * 100) : 0 };
}

function showCourseSelector() {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('page-course-select').classList.add('active');
  var grid = document.getElementById('course-list');
  if (!grid) return;
  grid.innerHTML = '';
  var keys = Object.keys(COURSES);
  keys.forEach(function(id) {
    var c = COURSES[id];
    grid.innerHTML += '<div class="relative rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group bg-white/5 backdrop-blur-sm border ' + (c.coming ? 'border-white/10 opacity-60' : 'border-white/20 hover:border-white/40') + '" onclick="selectCourse(\'' + id + '\')">'
      + '<div class="relative overflow-hidden" style="aspect-ratio:4/3">'
      + '<img src="' + c.img + '" alt="' + c.title + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.style.display=\'none\'">'
      + '<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>'
      + '<div class="absolute bottom-4 left-5 right-5">'
      + '<div class="flex items-center gap-3 mb-1">'
      + '<span class="text-3xl">' + c.icon + '</span>'
      + '<h3 class="font-display text-2xl md:text-3xl font-bold text-white">' + c.title + '</h3>'
      + '</div>'
      + '<p class="text-base md:text-lg text-white/70">' + c.subtitle + '</p>'
      + '</div>'
      + (c.coming ? '<div class="absolute top-4 right-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20">Coming Soon</div>' : '<div class="absolute top-4 right-4 px-3 py-1.5 bg-white/90 text-gray-900 text-xs font-bold rounded-full shadow-lg">Available</div>')
      + '</div>'
      + '<div class="p-5 md:p-6">'
      + '<p class="text-sm md:text-base text-slate-300 mb-4 leading-relaxed font-medium">' + c.desc + '</p>'
      + '<div class="flex items-center gap-4 md:gap-6 text-sm md:text-base text-slate-400">'
      + '<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full ' + (id === 'ct-ai' ? 'bg-blue-400' : 'bg-violet-400') + '"></span> <span class="text-white font-semibold">' + c.chapters + '</span> chapters</span>'
      + '<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full ' + (id === 'ct-ai' ? 'bg-blue-400' : 'bg-violet-400') + '"></span> <span class="text-white font-semibold">' + c.questions + '</span> questions</span>'
      + '</div>'
      + '</div></div>';
  });
}

function selectCourse(id) {
  if (COURSES[id].coming) { alert('This course is coming soon! Stay tuned.'); return; }
  setCurrentCourse(id);
  window.location.hash = 'dashboard';
}

function resumeLearning() {
  const lastCh = getLastVisitedChapter();
  navigate('chapter-' + lastCh);
}

const CHAPTER_SUMMARIES = {
  1: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. AI-Based vs Conventional Systems (AI-1.1.1)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Design approach:</span> <u>Conventional System</u> uses imperative programming languages where developers define explicit step-by-step instructions, including constructs such as if-then-else statements and loops. The behavior is fully determined by human-written code. In contrast, <u>AI-based System</u> (especially ML) does not follow predefined rules. Instead, it analyzes patterns in data to learn how to respond to new inputs. For example, an AI image recognition system trained to identify cats does not rely on explicitly coded rules but learns from a dataset of cat images.</p><p class="text-green-700 text-xs -mt-1">• Thiết kế: Conventional System dùng ngôn ngữ lập trình mệnh lệnh, lập trình viên định nghĩa các bước rõ ràng (if-then-else, vòng lặp). AI-based System (đặc biệt ML) không theo luật định sẵn mà phân tích mẫu từ dữ liệu để tự học cách phản hồi — ví dụ: hệ thống nhận diện mèo học từ tập ảnh mèo, không cần luật mã hóa cứng.</p>'
    + '<p><span class="text-blue-600 font-medium">• Behavior:</span> <u>Conventional System</u> is deterministic — given the same input, it always produces the same output. Its behavior is predictable, transparent, and easy to verify. <u>AI-based System</u> relies on probabilistic reasoning and statistical inference. It can handle uncertainty and ambiguity, producing outputs that are not always predictable. Many AI models incorporate random elements during training, leading to non-deterministic behavior.</p><p class="text-green-700 text-xs -mt-1">• Hành vi: Conventional System mang tính xác định — cùng đầu vào luôn cho cùng đầu ra, dễ dự đoán và kiểm tra. AI-based System dựa trên lý luận xác suất và suy luận thống kê, có thể xử lý sự không chắc chắn, kết quả không phải lúc nào cũng dự đoán trước được do có yếu tố ngẫu nhiên trong quá trình huấn luyện.</p>'
    + '<p><span class="text-blue-600 font-medium">• Explainability:</span> <u>Conventional System</u> is easy to trace and understand — you can follow the code logic step by step. <u>AI-based System</u> (especially Deep Learning) is often a \"black box\". Neural networks can contain billions of parameters, making their internal decision-making process extremely difficult for humans to interpret. This raises concerns in critical domains like healthcare, finance, and autonomous driving.</p><p class="text-green-700 text-xs -mt-1">• Tính giải thích: Conventional System dễ truy vết — có thể theo dõi logic từng bước. AI-based System (đặc biệt Deep Learning) thường là "hộp đen" với hàng tỷ tham số, rất khó giải thích tại sao đưa ra quyết định cụ thể, gây lo ngại trong các lĩnh vực nhạy cảm như y tế, tài chính, xe tự lái.</p>'
    + '<p><span class="text-blue-600 font-medium">• Adaptability:</span> <u>Conventional System</u> is static — it only does what it was programmed to do. To incorporate new knowledge, developers must manually update the code. <u>AI-based System</u> can be self-learning — it continuously improves its performance as it encounters new data. This adaptability makes AI particularly powerful in dynamic environments where conditions change frequently. However, this also means the system\'s behavior may drift over time, requiring ongoing monitoring.</p><p class="text-green-700 text-xs -mt-1">• Khả năng thích ứng: Conventional System là tĩnh — chỉ làm những gì được lập trình, muốn thay đổi phải cập nhật code thủ công. AI-based System có thể tự học — liên tục cải thiện hiệu suất khi gặp dữ liệu mới, rất mạnh trong môi trường thay đổi liên tục. Tuy nhiên hành vi có thể trôi dạt theo thời gian, cần giám sát thường xuyên.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. Levels of AI (AI-1.1.2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><u>Narrow AI (Weak AI):</u> Designed and trained for a specific task — e.g. face recognition, language translation, spam filtering, chess playing. This is the <strong>only form of AI that currently exists</strong> in practice. Every real-world AI system today, from Siri to self-driving cars, is Narrow AI. It cannot generalize beyond its training domain — a face recognition AI cannot play chess.</p><p class="text-green-700 text-xs -mt-1">• AI hẹp (Narrow AI): Thiết kế cho một nhiệm vụ cụ thể — nhận diện khuôn mặt, dịch thuật, lọc spam. Đây là <strong>loại AI duy nhất đang tồn tại</strong> trong thực tế. Mọi hệ thống AI hiện nay từ Siri đến xe tự lái đều là Narrow AI. Không thể khái quát hóa sang lĩnh vực khác.</p>'
    + '<p><u>Frontier AI:</u> An advanced subset of Narrow AI that pushes the boundaries of current capabilities with large-scale GenAI models. These are the most sophisticated AI systems available today, representing the cutting edge of what Narrow AI can achieve.</p><p class="text-green-700 text-xs -mt-1">• Frontier AI: Tập con tiên tiến của Narrow AI, đẩy giới hạn khả năng hiện tại với các mô hình GenAI quy mô lớn — đại diện cho đỉnh cao của AI hiện nay.</p>'
    + '<p><u>General AI (Strong AI):</u> Capable of performing <strong>any intellectual task</strong> that a human can do. It would understand, learn, and apply knowledge across different domains, just like a human. <strong>No system has achieved this level</strong> — it remains a theoretical concept.</p><p class="text-green-700 text-xs -mt-1">• AI tổng quát (General AI): Có khả năng thực hiện <strong>bất kỳ nhiệm vụ trí tuệ nào</strong> như con người. <strong>Chưa có hệ thống nào đạt mức này</strong> — chỉ là khái niệm lý thuyết.</p>'
    + '<p><u>Super AI (Superintelligence):</u> Surpasses human intelligence across all domains — creativity, problem-solving, emotional intelligence. It could recursively self-improve without human intervention. The hypothetical point where AI surpasses human intelligence is called the <strong>technological singularity</strong>.</p><p class="text-green-700 text-xs -mt-1">• Siêu trí tuệ (Super AI): Vượt xa trí thông minh nhân loại, có thể tự cải thiện không cần con người. Điểm chuyển giao gọi là <strong>điểm kỳ dị công nghệ</strong> (technological singularity).</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. AI Technologies (AI-1.1.3)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Machine Learning (ML):</span> AI systems that learn from data without being explicitly programmed. <u>Supervised Learning</u> uses labeled data for classification/regression. <u>Unsupervised Learning</u> finds hidden patterns in unlabeled data (clustering, association). <u>Reinforcement Learning</u> learns through trial-and-error interaction with an environment, receiving rewards or penalties.</p><p class="text-green-700 text-xs -mt-1">• ML: Học từ dữ liệu không cần lập trình rõ ràng. Supervised (học có giám sát) dùng dữ liệu gán nhãn. Unsupervised (không giám sát) tự tìm mẫu trong dữ liệu không nhãn. Reinforcement (học tăng cường) học qua thử-và-sai với phần thưởng/phạt.</p>'
    + '<p><span class="text-blue-600 font-medium">• Deep Learning (DL):</span> Uses Deep Neural Networks (DNNs). <u>CNN</u> excels at image recognition. <u>RNN</u> processes sequential data (text, time series). <u>Transformers</u> can process long-range relationships in sequences — foundation of Large Language Models (LLMs) like GPT.</p><p class="text-green-700 text-xs -mt-1">• DL: Học sâu với mạng thần kinh. CNN (ảnh), RNN (chuỗi, thời gian), Transformers (xử lý quan hệ xa — nền tảng của LLM như GPT).</p>'
    + '<p><span class="text-blue-600 font-medium">• Other technologies:</span> NLP (language processing), Computer Vision (image/video analysis), Fuzzy Logic (reasoning with uncertainty), Expert Systems (rule-based knowledge systems), <u>Agentic AI</u> (autonomous agents that plan, reason & execute tasks independently).</p><p class="text-green-700 text-xs -mt-1">• Công nghệ khác: NLP (xử lý ngôn ngữ), Computer Vision (thị giác máy tính), Fuzzy Logic (logic mờ), Expert Systems (hệ chuyên gia), Agentic AI (tác tử tự trị tự lập kế hoạch).</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">4. Generative AI - GenAI (AI-1.1.4)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><u>Definition:</u> A type of AI specialized in <strong>creating new content</strong> — text, images, audio, video, code — by learning patterns from training data. Unlike traditional AI that classifies or predicts, GenAI generates original outputs that resemble its training data. <u>Key technologies:</u> GANs (Generative Adversarial Networks), Diffusion Models, Transformers. GenAI is typically deployed via <strong>Foundation Models</strong> (large pre-trained models) that can be <strong>fine-tuned</strong> for specific tasks.</p><p class="text-green-700 text-xs -mt-1">• GenAI: Chuyên <strong>tạo nội dung mới</strong> (văn bản, hình ảnh, âm thanh, code) từ dữ liệu huấn luyện. Công nghệ chính: GANs, Diffusion Models, Transformers. Thường triển khai qua Foundation Models + fine-tuning cho từng tác vụ cụ thể.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Hardware & Hosting Options (AI-1.1.5, AI-1.1.6)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Hardware:</span> <u>GPU</u> excels at massively parallel processing, ideal for training & running ML models. <u>CPU</u> is better for general-purpose computing but slower for ML. <u>ASIC</u> (Application-Specific Integrated Circuit) chips are custom-built for specific AI workloads, often used for edge computing. <u>Quantization</u> — using fewer bits for computations — speeds up inference and reduces power consumption, making AI viable on resource-constrained devices.</p><p class="text-green-700 text-xs -mt-1">• Phần cứng: GPU xử lý song song mạnh mẽ, vượt trội CPU cho ML. ASIC chip chuyên dụng cho edge computing. Quantization (lượng tử hóa) dùng ít bit hơn để tăng tốc và giảm năng lượng.</p>'
    + '<p><span class="text-blue-600 font-medium">• Hosting:</span> <u>Local/On-premise</u> — data stays on local servers, ensuring privacy and direct control, but hardware resources are limited. <u>Cloud</u> — scalable, pay-as-you-go, easy to scale, can be offered as <strong>AI as a Service (AIaaS)</strong>. Many organizations use a hybrid approach: local development for sensitive data, cloud for large-scale training.</p><p class="text-green-700 text-xs -mt-1">• Hosting: Local (tại chỗ) — đảm bảo riêng tư, kiểm soát trực tiếp nhưng giới hạn tài nguyên. Cloud (đám mây) — linh hoạt, mở rộng dễ dàng, thanh toán theo nhu cầu, có thể dùng AIaaS. Nhiều tổ chức dùng hybrid: local cho dữ liệu nhạy cảm, cloud cho huấn luyện quy mô lớn.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">6. ML Development Frameworks (AI-1.1.7)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>ML frameworks provide tools and libraries for building ML models. They typically support: data processing → model building → training & optimization → evaluation → deployment. <u>Low-level APIs</u> (e.g. TensorFlow Core) offer more control and flexibility but require deep expertise. <u>High-level APIs</u> (e.g. Keras) simplify model creation with less code, making ML more accessible. Popular frameworks include TensorFlow, PyTorch, and scikit-learn.</p><p class="text-green-700 text-xs -mt-1">• Framework ML cung cấp công cụ xây dựng mô hình: xử lý dữ liệu → xây dựng → huấn luyện & tối ưu → đánh giá → triển khai. Low-level API (tùy biến cao, đòi hỏi chuyên môn) vs High-level API (đơn giản, dễ tiếp cận). Ví dụ: TensorFlow, PyTorch, scikit-learn.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">7. Regulations & Standards (AI-1.1.8)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Purpose:</span> Regulations aim to build trust in AI by ensuring it is safe, fair, and responsible. Testing plays a key role in demonstrating compliance.</p><p class="text-green-700 text-xs -mt-1">• Mục tiêu: Quy định nhằm tạo niềm tin, đảm bảo AI an toàn, công bằng, có trách nhiệm. Kiểm thử đóng vai trò chứng minh tuân thủ.</p>'
    + '<p><span class="text-blue-600 font-medium">• EU AI Act:</span> Uses a <strong>risk-based approach</strong>. High-risk AI systems (affecting safety, fundamental rights) face strict requirements for testing, monitoring, and documentation. Non-compliance can result in severe penalties. This is the world\'s first comprehensive AI law.</p><p class="text-green-700 text-xs -mt-1">• EU AI Act: Tiếp cận dựa trên rủi ro. Hệ thống rủi ro cao (ảnh hưởng an toàn, quyền cơ bản) phải tuân thủ yêu cầu khắt khe về kiểm thử, giám sát. Đây là luật AI toàn diện đầu tiên trên thế giới.</p>'
    + '<p><span class="text-blue-600 font-medium">• ISO/IEC TR 29119-11:</span> Provides detailed guidelines for testing AI systems. It is a key reference for demonstrating regulatory compliance and performing systematic AI testing.</p><p class="text-green-700 text-xs -mt-1">• ISO/IEC TR 29119-11: Hướng dẫn chi tiết về kiểm thử hệ thống AI — chìa khóa chứng minh tuân thủ quy định.</p>'
    + '</div>',

  2: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. AI-Specific Quality Characteristics (AI-2.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>AI systems require <strong>new or adapted quality characteristics</strong> beyond the traditional ISO/IEC 25010 standard. These are defined in <strong>ISO/IEC 25059</strong>, which extends the quality model for AI-based systems — this is a key reference for this chapter.</p><p class="text-green-700 text-xs -mt-1">Hệ thống AI yêu cầu các đặc tính chất lượng mới ngoài ISO/IEC 25010 truyền thống, được định nghĩa trong <strong>ISO/IEC 25059</strong> — tài liệu tham chiếu chính của chương này.</p>'
    + '<p><span class="text-blue-600 font-medium">• AI Functional Correctness:</span> Due to the probabilistic nature of ML, 100% accuracy cannot be guaranteed. Correctness is evaluated against <strong>acceptable thresholds</strong> for both correct and incorrect results. Testing focuses on whether the model meets predefined statistical performance criteria rather than absolute correctness.</p><p class="text-green-700 text-xs -mt-1">• Tính đúng đắn chức năng AI: Do bản chất xác suất của ML, không thể đảm bảo 100%. Đánh giá qua <strong>ngưỡng chấp nhận được</strong> (thresholds) thay vì đúng/sai tuyệt đối.</p>'
    + '<p><span class="text-blue-600 font-medium">• Functional Adaptability:</span> The ability of an AI system to <strong>adapt its behavior</strong> after deployment in response to changes in its operational environment. For example, a self-driving car must adapt to different weather conditions, road types, and traffic patterns it was not explicitly trained on.</p><p class="text-green-700 text-xs -mt-1">• Khả năng thích ứng chức năng: Khả năng tự thích nghi sau triển khai khi môi trường vận hành thay đổi — ví dụ: xe tự lái thích nghi với thời tiết, loại đường khác nhau.</p>'
    + '<p><span class="text-blue-600 font-medium">• User Controllability:</span> The degree to which humans or external agents can <strong>intervene in a timely manner</strong> in the system\'s operation. Critical for safety-related AI — e.g., a human operator must be able to override an autonomous drone when it malfunctions.</p><p class="text-green-700 text-xs -mt-1">• Khả năng kiểm soát của người dùng: Mức độ con người có thể <strong>can thiệp kịp thời</strong> vào hoạt động của hệ thống — quan trọng trong các hệ thống an toàn.</p>'
    + '<p><span class="text-blue-600 font-medium">• Transparency:</span> The extent to which <strong>appropriate information</strong> about the AI system\'s purpose, behavior, and limitations is communicated to stakeholders. Transparency enables informed trust and helps testers and regulators evaluate the system.</p><p class="text-green-700 text-xs -mt-1">• Tính minh bạch: Mức độ thông tin phù hợp về hệ thống AI được truyền đạt tới các bên liên quan — giúp tạo niềm tin và hỗ trợ kiểm thử.</p>'
    + '<p><span class="text-blue-600 font-medium">• AI Robustness:</span> The ability to <strong>maintain functional correctness</strong> in all situations, including under adversarial attacks (slightly modified inputs designed to fool the model), biased data, invalid data, or extreme environmental conditions. A robust system degrades gracefully rather than failing catastrophically.</p><p class="text-green-700 text-xs -mt-1">• Độ tin cậy AI: Duy trì đúng đắn trong mọi tình huống — kể cả khi bị tấn công đối nghịch, dữ liệu sai lệch, không hợp lệ. Hệ thống tin cậy sẽ giảm sút nhẹ nhàng thay vì hỏng hóc thảm khốc.</p>'
    + '<p><span class="text-blue-600 font-medium">• Intervenability:</span> A sub-characteristic of security. The degree to which operators can <strong>intervene promptly</strong> to prevent potential harm or risks. This includes the ability to stop, modify, or override AI system decisions when necessary.</p><p class="text-green-700 text-xs -mt-1">• Khả năng can thiệp: Đặc tính con của bảo mật. Mức độ người vận hành có thể <strong>can thiệp kịp thời</strong> để ngăn ngừa nguy hại — dừng, sửa, ghi đè quyết định của AI.</p>'
    + '<p><span class="text-blue-600 font-medium">• Societal & Ethical Risk Mitigation:</span> Focus on accountability, fairness, non-discrimination, and privacy. The system should not produce biased outcomes against protected groups. Techniques like <strong>disparate impact analysis</strong> help assess fairness.</p><p class="text-green-700 text-xs -mt-1">• Giảm thiểu rủi ro đạo đức: Tập trung vào tính giải trình, công bằng, không phân biệt đối xử, quyền riêng tư. Phân tích tác động khác biệt giúp đánh giá sự công bằng.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. AI & Safety (AI-2.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Using AI in <strong>safety-related systems</strong> (healthcare, autonomous driving, nuclear) introduces unique challenges that traditional safety engineering struggles to address:</p><p class="text-green-700 text-xs -mt-1">Sử dụng AI trong hệ thống liên quan đến an toàn (y tế, xe tự lái, hạt nhân) đặt ra nhiều thách thức đặc thù:</p>'
    + '<p><span class="text-blue-600 font-medium">• Specifications:</span> Unlike conventional systems with clear requirements, AI systems often start with <strong>vague goals</strong> that are implicitly defined through training data. This makes requirements traceability extremely difficult — you cannot easily trace a specific behavior back to a written requirement.</p><p class="text-green-700 text-xs -mt-1">• Đặc tả: Khác với hệ thống truyền thống có yêu cầu rõ ràng, AI thường bắt đầu với mục tiêu mơ hồ, định nghĩa ngầm qua dữ liệu huấn luyện — rất khó truy xuất từ yêu cầu đến thực thi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Non-determinism:</span> Random factors during training (random weight initialization, data shuffling) and minor input variations can lead to <strong>unexpected outputs</strong>. This makes it difficult to guarantee specific behavior under all conditions.</p><p class="text-green-700 text-xs -mt-1">• Tính không xác định: Yếu tố ngẫu nhiên khi huấn luyện và biến động nhỏ ở đầu vào có thể dẫn đến đầu ra bất ngờ — khó đảm bảo hành vi chính xác trong mọi điều kiện.</p>'
    + '<p><span class="text-blue-600 font-medium">• Self-learning:</strong> Self-learning systems change their behavior over time as they encounter new data. This means <strong>pre-deployment test results become outdated</strong> after the system updates itself. <strong>Safety guards</strong> (safety envelopes, monitors) must be in place to prevent dangerous behaviors from emerging.</p><p class="text-green-700 text-xs -mt-1">• Tự học: Hệ thống tự học thay đổi hành vi theo thời gian → kết quả kiểm thử trước triển khai trở nên lỗi thời. Cần "chốt chặn an toàn" (safety guards) để ngăn hành vi nguy hiểm.</p>'
    + '<p><span class="text-blue-600 font-medium">• Explainability & Transparency:</span> It is very difficult to understand why an AI made a specific decision. Techniques like <strong>LIME</strong> (Local Interpretable Model-Agnostic Explanations) can provide post-hoc explanations but are not widely adopted and may impact system performance. The lack of explainability is a major barrier to deploying AI in regulated industries.</p><p class="text-green-700 text-xs -mt-1">• Tính giải thích & Minh bạch: Rất khó hiểu tại sao AI đưa ra quyết định. Kỹ thuật như LIME có thể giải thích nhưng chưa phổ biến và ảnh hưởng hiệu suất. Thiếu giải thích là rào cản lớn khi triển khai AI trong ngành được quản lý.</p>'
    + '<p><span class="text-blue-600 font-medium">• Regulations:</strong> Existing safety standards often do not cover AI or even prohibit its use. The <strong>EU AI Act</strong> classifies AI systems used in safety components as <strong>high-risk</strong>, requiring extremely rigorous testing, validation, and documentation. Regulations are still evolving and vary by region.</p><p class="text-green-700 text-xs -mt-1">• Quy định: Tiêu chuẩn an toàn truyền thống chưa bao phủ AI. EU AI Act phân loại AI trong thành phần an toàn là rủi ro cao, yêu cầu kiểm thử và tài liệu cực kỳ nghiêm ngặt.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. Acceptance Criteria for AI Systems (AI-2.2.1 - K2)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p>Acceptance criteria for AI are <strong>statistical or threshold-based</strong>, not binary pass/fail. Examples from the syllabus:</p><p class="text-green-700 text-xs -mt-1">Tiêu chí chấp nhận cho AI mang tính <strong>thống kê hoặc dựa trên ngưỡng</strong>, không phải đúng/sai tuyệt đối. Ví dụ từ giáo trình:</p>'
    + '<p><span class="text-blue-600 font-medium">• Correctness:</strong> The AI image recognition system must achieve <strong>95% accuracy</strong> on the test dataset.</p><p class="text-green-700 text-xs -mt-1">• Đúng đắn: Hệ thống nhận dạng ảnh phải đạt độ chính xác 95% trên tập kiểm thử.</p>'
    + '<p><span class="text-blue-600 font-medium">• Adaptability:</strong> The engine management system must adapt within <strong>20 seconds</strong> after crossing a predefined altitude threshold.</p><p class="text-green-700 text-xs -mt-1">• Thích ứng: Hệ thống quản lý động cơ phải thích nghi trong tối đa 20 giây khi vượt ngưỡng độ cao.</p>'
    + '<p><span class="text-blue-600 font-medium">• Controllability:</strong> A human supervisor must be able to <strong>override drone control within 0.5 seconds</strong> when GPS signal is lost.</p><p class="text-green-700 text-xs -mt-1">• Kiểm soát: Người giám sát phải chiếm quyền điều khiển drone trong 0,5 giây khi mất GPS.</p>'
    + '<p><span class="text-blue-600 font-medium">• Robustness:</strong> Edge AI device must <strong>switch to low-power mode</strong> when temperature exceeds 85°C instead of crashing.</p><p class="text-green-700 text-xs -mt-1">• Tin cậy: Thiết bị AI tại biên chuyển chế độ năng lượng thấp khi nhiệt >85°C thay vì sập nguồn.</p>'
    + '<p><span class="text-blue-600 font-medium">• Ethics:</strong> The automated sentencing system must <strong>not discriminate</strong> between different ethnic groups in its recommendations.</p><p class="text-green-700 text-xs -mt-1">• Đạo đức: Hệ thống tuyên án không được phân biệt đối xử giữa các nhóm sắc tộc.</p>'
    + '<p><span class="text-blue-600 font-medium">• Safety:</strong> <strong>100%</strong> of input-output relationships of the nuclear plant control model must be mapped with <strong>minimum 99.9% accuracy</strong> by the explanation tool.</p><p class="text-green-700 text-xs -mt-1">• An toàn: 100% mối quan hệ đầu vào-đầu ra của mô hình nhà máy điện hạt nhân phải được ánh xạ với độ chính xác tối thiểu 99,9%.</p>'
    + '<p class="text-yellow-700 font-medium mt-2">⚠️ Key insight: AI acceptance criteria are <u>probabilistic</u>, not binary. Understand ISO/IEC 25059 as the quality standard for AI systems. Memorize the 7 quality characteristics and be able to classify a specific behavior to the correct characteristic.</p>'
    + '<p class="text-green-700 text-xs -mt-1">⚠️ Quan trọng: Tiêu chí chấp nhận AI là <u>xác suất</u>. Nhớ ISO/IEC 25059 là chuẩn chất lượng cho AI. Thuộc 7 đặc tính và phân loại được hành vi cụ thể.</p>'
    + '</div>',

  3: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. Forms of Machine Learning (AI-3.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Supervised Learning:</span> Uses <strong>labeled data</strong> (input-output pairs). The model learns to map inputs to correct outputs. Two main types: <u>Classification</u> — predicts discrete categories (e.g. spam vs not spam, dog vs cat). <u>ML Regression</u> — predicts continuous numerical values (e.g. stock price, temperature). Requires manual labeling effort.</p><p class="text-green-700 text-xs -mt-1">• Học có giám sát: Dùng <strong>dữ liệu gán nhãn</strong> (cặp đầu vào-đầu ra). Hai loại chính: Classification (phân loại — dự đoán danh mục rời rạc) và Regression (hồi quy — dự đoán giá trị số liên tục). Cần công sức gán nhãn thủ công.</p>'
    + '<p><span class="text-blue-600 font-medium">• Unsupervised Learning:</strong> Finds hidden <strong>patterns or structures</strong> in unlabeled data (no output labels provided). <u>Clustering</u> — groups similar data points together (e.g. customer segmentation). <u>Association</u> — discovers relationships between attributes (e.g. \"customers who bought X also bought Y\"). Useful when labeling is expensive or impossible.</p><p class="text-green-700 text-xs -mt-1">• Học không giám sát: Tự tìm <strong>mẫu hoặc cấu trúc</strong> trong dữ liệu không có nhãn. Clustering (phân cụm — nhóm dữ liệu tương đồng). Association (hiệp hội — tìm quan hệ giữa các thuộc tính). Hữu ích khi gán nhãn quá đắt hoặc không thể.</p>'
    + '<p><span class="text-blue-600 font-medium">• Reinforcement Learning:</strong> An <strong>agent</strong> learns by <strong>interacting with an environment</strong> through trial-and-error. It receives <u>rewards</u> for good actions and <u>penalties</u> for bad ones. The agent\'s goal is to maximize cumulative reward over time. Common in robotics, game playing (AlphaGo), and autonomous navigation.</p><p class="text-green-700 text-xs -mt-1">• Học tăng cường: <strong>Tác tử</strong> học qua <strong>tương tác với môi trường</strong> thử-và-sai. Nhận phần thưởng cho hành động tốt, hình phạt cho hành động xấu. Mục tiêu: tối đa hóa phần thưởng tích lũy. Ứng dụng: robot, chơi game (AlphaGo), xe tự lái.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. ML Workflow (AI-3.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>The ML workflow is an <strong>iterative process</strong> with these key stages:</p>'
    + '<p><span class="text-blue-600 font-medium">1. Understand goals →</span> Define business objectives and agree on acceptance criteria with stakeholders.</p><p class="text-green-700 text-xs -mt-1">1. Hiểu mục tiêu: Thỏa thuận tiêu chí chấp nhận.</p>'
    + '<p><span class="text-blue-600 font-medium">2. Choose Framework →</span> Select appropriate ML development platform.</p><p class="text-green-700 text-xs -mt-1">2. Chọn framework phát triển phù hợp.</p>'
    + '<p><span class="text-blue-600 font-medium">3. Select & Build algorithm →</span> Choose algorithm based on goals and data characteristics.</p><p class="text-green-700 text-xs -mt-1">3. Chọn & xây dựng thuật toán theo mục tiêu và dữ liệu.</p>'
    + '<p><span class="text-blue-600 font-medium">4. Prepare & Test Data →</span> Collect, preprocess, feature engineer, EDA.</p><p class="text-green-700 text-xs -mt-1">4. Chuẩn bị & kiểm thử dữ liệu: Thu thập, tiền xử lý, kỹ thuật đặc trưng.</p>'
    + '<p><span class="text-blue-600 font-medium">5. Model Generation →</span> <u>Train</u> → <u>Evaluate</u> → <u>Tune</u> (iterative loop). Training data used for training, validation data for tuning hyperparameters.</p><p class="text-green-700 text-xs -mt-1">5. Tạo mô hình: Huấn luyện → Đánh giá → Tinh chỉnh (vòng lặp).</p>'
    + '<p><span class="text-blue-600 font-medium">6. Test Model →</span> Use holdout/Test dataset for <strong>final independent evaluation</strong>.</p><p class="text-green-700 text-xs -mt-1">6. Kiểm thử mô hình với tập kiểm thử độc lập.</p>'
    + '<p><span class="text-blue-600 font-medium">7. Deploy →</span> Integrate model into production environment.</p><p class="text-green-700 text-xs -mt-1">7. Triển khai: Tích hợp vào môi trường vận hành.</p>'
    + '<p><span class="text-blue-600 font-medium">8. Monitor & Tune →</span> Continuous monitoring to detect <strong>data/concept drift</strong> and retrain as needed.</p><p class="text-green-700 text-xs -mt-1">8. Giám sát & tinh chỉnh: Theo dõi trôi dạt, cập nhật mô hình.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. Pretrained Models, Fine-tuning & RAG (AI-3.1.4 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Pretrained Model:</span> A model that has already been <strong>trained on a massive dataset</strong> (e.g. GPT, BERT, ResNet). Can be reused directly or adapted for specific tasks — saves significant time, data, and compute resources compared to training from scratch.</p><p class="text-green-700 text-xs -mt-1">• Mô hình huấn luyện sẵn: Đã được huấn luyện trên dữ liệu khổng lồ (GPT, BERT...). Tái sử dụng để tiết kiệm thời gian, dữ liệu, tài nguyên.</p>'
    + '<p><span class="text-blue-600 font-medium">• Fine-tuning:</strong> Takes a pretrained model and <strong>trains it further</strong> on a smaller, domain-specific dataset to specialize it for a particular task (e.g. fine-tuning GPT on medical records for a healthcare chatbot). Requires less data and compute than training from scratch.</p><p class="text-green-700 text-xs -mt-1">• Tinh chỉnh: Huấn luyện thêm mô hình sẵn có trên dữ liệu đặc thù cho nhiệm vụ mới — cần ít dữ liệu và tài nguyên hơn.</p>'
    + '<p><span class="text-blue-600 font-medium">• RAG (Retrieval-Augmented Generation):</strong> Improves LLM accuracy by <strong>retrieving relevant external information</strong> (from documents, databases) and providing it as context to the model — without modifying the model itself. This helps reduce hallucinations and keep answers up-to-date.</p><p class="text-green-700 text-xs -mt-1">• RAG: Cung cấp thông tin từ nguồn dữ liệu ngoài cho LLM — không thay đổi mô hình gốc. Giúp giảm ảo giác (hallucinations) và cập nhật thông tin.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">4. Data Preparation (AI-3.2.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Data preparation is often the <strong>most resource-intensive activity</strong> in ML — more than building the model itself.</p>'
    + '<p><span class="text-blue-600 font-medium">• Acquisition:</span> Collecting data from various sources (databases, APIs, sensors, web scraping). For supervised learning, data must be <strong>labeled</strong> — this is often expensive and time-consuming. Consider data quality, relevance, and legal compliance.</p><p class="text-green-700 text-xs -mt-1">• Thu thập: Tập hợp dữ liệu từ nhiều nguồn (CSDL, API, cảm biến). Phải gán nhãn cho học có giám sát — tốn kém và mất thời gian. Chú ý chất lượng, tính pháp lý.</p>'
    + '<p><span class="text-blue-600 font-medium">• Preprocessing:</span> Cleaning data — remove duplicates, handle missing values, detect outliers. <u>Normalization/scaling</u> ensures features have comparable ranges. <u>Data augmentation</u> creates additional training data through transformations (e.g. rotating images).</p><p class="text-green-700 text-xs -mt-1">• Tiền xử lý: Làm sạch dữ liệu — xoá trùng, xử lý thiếu, phát hiện ngoại lệ. Chuẩn hóa đảm bảo các đặc trưng cùng thang đo. Tăng cường dữ liệu qua biến đổi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Feature Engineering:</span> Selecting, extracting, and transforming <strong>features</strong> (input variables) to improve model performance. Good features can significantly boost accuracy. Includes feature selection (choosing most relevant) and feature extraction (creating new representations).</p><p class="text-green-700 text-xs -mt-1">• Kỹ thuật đặc trưng: Chọn, trích xuất, biến đổi các đặc trưng (biến đầu vào) để cải thiện hiệu suất mô hình. Chọn lọc và tạo biểu diễn mới.</p>'
    + '<p><span class="text-blue-600 font-medium">• EDA (Exploratory Data Analysis):</strong> Using <strong>visualization</strong> (histograms, scatter plots, box plots) to understand data distributions, trends, correlations, and detect anomalies. EDA helps identify data quality issues early.</p><p class="text-green-700 text-xs -mt-1">• Phân tích dữ liệu khám phá: Dùng biểu đồ trực quan hóa để hiểu phân phối, xu hướng, tương quan, phát hiện bất thường. Giúp phát hiện sớm vấn đề chất lượng dữ liệu.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Training, Validation & Test Datasets (AI-3.2.3 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Training dataset:</span> Used to <strong>train the model</strong> — the model learns patterns from this data. Typically the largest split (60-80%).</p><p class="text-green-700 text-xs -mt-1">• Tập huấn luyện: Dùng để <strong>huấn luyện</strong> mô hình. Thường chiếm tỷ lệ lớn nhất (60-80%).</p>'
    + '<p><span class="text-blue-600 font-medium">• Validation dataset:</strong> Used to <strong>evaluate and tune hyperparameters</strong> during development. Provides feedback for model selection without contaminating the test results. Helps prevent overfitting.</p><p class="text-green-700 text-xs -mt-1">• Tập xác thực: Dùng để <strong>đánh giá và tinh chỉnh siêu tham số</strong> (hyperparameters). Giúp ngăn chặn overfitting.</p>'
    + '<p><span class="text-blue-600 font-medium">• Test dataset (holdout):</strong> Used for <strong>final independent evaluation</strong> of the trained model. Must not be used during training or validation — it should remain unseen until final testing. Provides an unbiased estimate of real-world performance.</p><p class="text-green-700 text-xs -mt-1">• Tập kiểm thử (holdout): Dùng để <strong>đánh giá độc lập cuối cùng</strong>. Không được dùng trong huấn luyện — chỉ dùng 1 lần duy nhất để đánh giá cuối.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">6. Neural Networks (AI-3.4.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Structure:</span> <u>Input layer</u> receives data → <u>Hidden layers</u> (contain <strong>neurons/nodes</strong> connected by <strong>weights</strong>, each neuron has a <strong>bias</strong> value) → <u>Output layer</u> produces result. Each neuron applies an <strong>activation function</strong> (e.g. ReLU, Sigmoid) to its weighted input sum to introduce non-linearity.</p><p class="text-green-700 text-xs -mt-1">• Cấu trúc: Lớp đầu vào → Lớp ẩn (neuron với trọng số & bias) → Lớp đầu ra. Mỗi neuron dùng hàm kích hoạt (activation function) để tạo tính phi tuyến.</p>'
    + '<p><span class="text-blue-600 font-medium">• Learning:</span> The network calculates <strong>loss/error</strong> between prediction and ground truth. This error is <strong>backpropagated</strong> through the network to adjust weights and biases, gradually minimizing the error. This process repeats for many iterations (epochs).</p><p class="text-green-700 text-xs -mt-1">• Học: Tính lỗi giữa dự đoán và thực tế → <strong>lan truyền ngược</strong> (backpropagation) để điều chỉnh trọng số & bias nhằm tối thiểu hóa sai số. Lặp lại qua nhiều epoch.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">7. Neural Network Coverage Metrics (AI-3.4.3 - K2)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Neuron Coverage:</span> % of neurons activated above threshold during testing.</p><p class="text-green-700 text-xs -mt-1">• Tỷ lệ neuron có đầu ra vượt ngưỡng.</p>'
    + '<p><span class="text-blue-600 font-medium">• k-MNC:</span> Divide neuron output range into k sections, measure activation.</p><p class="text-green-700 text-xs -mt-1">• Chia dải đầu ra thành k phần, đo tỷ lệ kích hoạt.</p>'
    + '<p><span class="text-blue-600 font-medium">• NBC:</span> Neurons outside the output range seen during training.</p><p class="text-green-700 text-xs -mt-1">• Neuron ngoài dải giá trị huấn luyện.</p>'
    + '<p class="text-yellow-700 font-medium mt-2">⚠️ Key (K3): Know how to calculate Accuracy, Precision, Recall, F1-Score from Confusion Matrix.</p>'
    + '<p class="text-green-700 text-xs -mt-1">⚠️ Nhớ công thức Accuracy, Precision, Recall, F1-Score từ Confusion Matrix.</p>'
    + '</div>',

  4: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. Locked vs Adaptive AI (AI-4.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Locked System:</strong> Has <strong>fixed behavior after deployment</strong>. The model does not learn from new data — it remains frozen. More deterministic, making testing easier since the same input always produces the same output. Example: a speech recognition model embedded in a car\'s infotainment system that never updates.</p><p class="text-green-700 text-xs -mt-1">• Hệ thống Khóa: Hành vi <strong>cố định sau triển khai</strong>. Mô hình không học từ dữ liệu mới — mang tính xác định hơn, dễ kiểm thử hơn. Ví dụ: mô hình nhận dạng giọng nói nhúng trong xe hơi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Adaptive System:</strong> <strong>Continues learning</strong> from new data after deployment. The model\'s behavior can change over time, making testing more complex. Examples: recommendation systems that update based on user behavior, fraud detection systems that adapt to new fraud patterns. Requires <strong>continuous testing and monitoring</strong>.</p><p class="text-green-700 text-xs -mt-1">• Hệ thống Thích ứng: <strong>Tiếp tục học</strong> từ dữ liệu mới sau triển khai. Hành vi thay đổi theo thời gian, kiểm thử phức tạp hơn. Cần <strong>kiểm thử và giám sát liên tục</strong>.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. Statistical Approach in AI Testing (AI-4.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Since AI models are <strong>probabilistic</strong>, traditional deterministic testing (expected output per input) is insufficient. Testing must <strong>evaluate performance distributions and confidence levels</strong> across many scenarios, not just individual cases. Example: report "accuracy 94% ± 4% at 95% confidence" instead of "this input → correct". → traditional deterministic methods insufficient. Evaluate performance distribution across scenarios.</p><p class="text-green-700 text-xs -mt-1">Mô hình AI xác suất → cần đánh giá phân phối hiệu suất, không chỉ đúng/sai.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. Test Oracle Problem (AI-4.1.3 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Incomplete specs:</span> AI development is exploratory, requirements evolve.</p><p class="text-green-700 text-xs -mt-1">• Đặc tả không đầy đủ: Phát triển AI khám phá, yêu cầu thay đổi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Complex tasks:</span> Too complex for manual verification.</p><p class="text-green-700 text-xs -mt-1">• Nhiệm vụ phức tạp: Quá phức tạp để kiểm tra thủ công.</p>'
    + '<p><span class="text-blue-600 font-medium">• Subjectivity:</span> \"Correctness\" of AI behavior can be subjective.</p><p class="text-green-700 text-xs -mt-1">• Tính chủ quan: \"Đúng\" của AI đôi khi mang tính chủ quan.</p>'
    + '<p><span class="text-blue-600 font-medium">• Self-learning:</span> Expected results become outdated as system updates itself.</p><p class="text-green-700 text-xs -mt-1">• Tự học: Kết quả mong đợi nhanh chóng lỗi thời.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">4. GenAI & LLM Testing (AI-4.2.1, AI-4.2.2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Methods:</span> <u>Black-box evaluation</u> (treating the model as opaque), <u>benchmarks</u> (standardized test datasets), <u>exploratory testing</u> (human testers probe for unexpected behaviors). Also includes <u>human evaluation</u> for subjective quality.</p><p class="text-green-700 text-xs -mt-1">• Phương pháp: Đánh giá hộp đen, bộ chuẩn, kiểm thử khám phá.</p>'
    + '<p><span class="text-blue-600 font-medium">• Red Teaming (K3):</span> A dedicated team <strong>simulates adversarial attacks</strong> (prompt injection, jailbreaking, bias exploitation) to find security flaws, harmful content generation, or biased outputs in GenAI models. <u>Key technique:</u> systematically probe the model with malicious/edge-case inputs to uncover vulnerabilities before attackers do.</p><p class="text-green-700 text-xs -mt-1">• Đội đỏ: Mô phỏng tấn công tìm lỗ hổng bảo mật, nội dung độc hại.</p>'
    + '<p><span class="text-blue-600 font-medium">• Challenges:</span> <u>Context windows</u> limit the amount of input the model can process at once. <u>Adjustable parameters</u> (temperature, top-p) affect output quality and need careful testing. Testing must also consider <u>prompt sensitivity</u> — small prompt changes can cause very different outputs.</p><p class="text-green-700 text-xs -mt-1">• Thách thức: Cửa sổ ngữ cảnh, tham số có thể điều chỉnh.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Test Levels for ML Systems (AI-4.3.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• ML-specific levels:</span> <u>Input data testing</u> — verify data quality, representativeness, freedom from bias. <u>ML model testing</u> — evaluate functional performance, robustness, drift, adversarial resistance.</p><p class="text-green-700 text-xs -mt-1">• Cấp độ chuyên biệt: Kiểm thử dữ liệu đầu vào, kiểm thử mô hình.</p>'
    + '<p><span class="text-blue-600 font-medium">• Traditional levels:</span> <u>Component testing</u> (test individual data pipelines, model components), <u>Integration testing</u> (AI + non-AI components), <u>System testing</u> (end-to-end), <u>Acceptance testing</u> (against stakeholder criteria). Still crucial for non-AI components surrounding the ML model.</p><p class="text-green-700 text-xs -mt-1">• Cấp độ truyền thống: Kiểm thử thành phần, tích hợp, hệ thống.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">6. Risk-based Testing for MLS (AI-4.3.2 - K2)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p>Risk-based testing <strong>focuses resources on the highest ML-specific risks</strong>: biased training data leading to unfair outcomes, data pipeline errors causing silent corruption, unrepresentative data causing poor generalization, and adversarial vulnerabilities. The goal is to prioritize testing on areas most likely to cause significant functional performance failures.</p><p class="text-green-700 text-xs -mt-1">Tập trung kiểm thử vào rủi ro ML cao nhất: dữ liệu sai lệch, lỗi pipeline.</p>'
    + '<p class="text-yellow-700 font-medium mt-2">⚠️ Key: Understand why traditional testing is insufficient for AI. Red Teaming is K3 — can apply in scenarios.</p>'
    + '<p class="text-green-700 text-xs -mt-1">⚠️ Quan trọng: Red Teaming là K3 duy nhất trong chương — nhớ cách vận dụng.</p>'
    + '</div>',

  5: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. Input Data Risks & Mitigations (AI-5.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Biased training data →</span> <u>Testing for bias</u> — detect systematic unfairness. Uses techniques like <u>disparate impact analysis</u> to compare outcomes across demographic groups.</p><p class="text-green-700 text-xs -mt-1">• Dữ liệu sai lệch → Kiểm thử sai lệch.</p>'
    + '<p><span class="text-blue-600 font-medium">• Unreliable/poorly managed data →</span> <u>Data provenance testing</u> — verify data origin, collection methods, and handling throughout the pipeline to ensure trustworthiness.</p><p class="text-green-700 text-xs -mt-1">• Nguồn không tin cậy → Kiểm thử nguồn gốc.</p>'
    + '<p><span class="text-blue-600 font-medium">• Poisoned training data →</span> <u>A/B testing</u> (compare models), <u>EDA</u> (exploratory analysis), <u>Red teaming</u> (simulate attacks). Poisoning occurs when an attacker intentionally corrupts training data to manipulate model behavior.</p><p class="text-green-700 text-xs -mt-1">• Dữ liệu bị đầu độc → A/B testing, Đội đỏ.</p>'
    + '<p><span class="text-blue-600 font-medium">• Inconsistent data, wrong types →</span> <u>Dataset constraint testing (K3)</u> — verify data against predefined rules (like DB schema): type checks, range checks, cross-field consistency. Must be automated.</p><p class="text-green-700 text-xs -mt-1">• Không nhất quán → Kiểm thử ràng buộc tập dữ liệu.</p>'
    + '<p><span class="text-blue-600 font-medium">• Missing, unbalanced, unrepresentative data →</span> <u>Data representativeness testing</u> — compare training data distribution to real-world data using statistical tests (Chi-squared, Kolmogorov-Smirnov) and EDA.</p><p class="text-green-700 text-xs -mt-1">• Thiếu/mất cân bằng → Kiểm thử tính đại diện.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. Testing for Bias (AI-5.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Goal:</span> Detect <strong>systematic unfairness</strong> caused by biased training data or flawed algorithms. Bias can lead to discriminatory outcomes against protected groups.</p><p class="text-green-700 text-xs -mt-1">• Mục tiêu: Phát hiện sự bất công hệ thống.</p>'
    + '<p><span class="text-blue-600 font-medium">• Key technique:</span> Disparate impact analysis — AI-specific fairness assessment.</p><p class="text-green-700 text-xs -mt-1">• Kỹ thuật: Phân tích tác động khác biệt — đánh giá công bằng.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. Data Pipeline Testing (AI-5.1.3 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Design review</span> → review pipeline architecture. <span class="text-blue-600 font-medium">Component testing</span> — test individual parts: data ingestion, transformation scripts, sensor interfaces.</p><p class="text-green-700 text-xs -mt-1">• Review thiết kế → Kiểm thử thành phần nhập dữ liệu, chuyển đổi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Check:</span> Transformation logic, validation rules, error handling, security vulnerabilities.</p><p class="text-green-700 text-xs -mt-1">• Kiểm tra: Logic chuyển đổi, xử lý lỗi, bảo mật.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">4. Data Representativeness Testing (AI-5.1.4 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Goal:</span> Assess similarity between training/test data and production data.</p><p class="text-green-700 text-xs -mt-1">• Mục tiêu: Đánh giá tương đồng với dữ liệu thực tế.</p>'
    + '<p><span class="text-blue-600 font-medium">• Methods:</span> EDA (charts), Chi-squared, Kolmogorov-Smirnov tests, continuous monitoring for Data drift.</p><p class="text-green-700 text-xs -mt-1">• Phương pháp: EDA, kiểm tra thống kê, giám sát trôi dạt.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Dataset Constraint Testing (AI-5.1.5 - K3)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><strong>K3 skill:</strong> Verify data against predefined rules (similar to DB schema constraints). Includes <u>single-value checks</u> (data type, allowed range, format) and <u>cross-value consistency</u> (logical relationships between fields). Must be <strong>automated</strong> due to large dataset size and integrated into the data pipeline. Example: check that "age" field is integer 0-150, "date" follows YYYY-MM-DD format.</p><p class="text-green-700 text-xs -mt-1">Kiểm tra dữ liệu theo quy tắc (như schema DB). Phải tự động hóa.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">6. Label Correctness Testing (AI-5.1.6 - K2)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Multiple Annotation:</span> Multiple annotators label same data for consensus & accuracy.</p><p class="text-green-700 text-xs -mt-1">• Gán nhãn nhiều lần: Nhiều người gán nhãn cùng mục để đảm bảo chính xác.</p>'
    + '<p><span class="text-blue-600 font-medium">• Check:</span> Missing labels, duplicate labels, outliers with unusual labels.</p><p class="text-green-700 text-xs -mt-1">• Kiểm tra: Thiếu nhãn, trùng, ngoại lai.</p>'
    + '<p class="text-yellow-700 font-medium mt-2">⚠️ Key: Dataset constraint testing is the only K3 in this chapter. Data representativeness must be done BEFORE model training.</p>'
    + '<p class="text-green-700 text-xs -mt-1">⚠️ Dataset constraint testing là K3 duy nhất. Kiểm thử đại diện phải làm TRƯỚC khi huấn luyện.</p>'
    + '</div>',

  6: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. ML Model Risks & Mitigations (AI-6.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Functional risks:</span> <u>Bias</u> (unfair outcomes), <u>overfitting</u> (model memorizes training data, fails on new data), <u>adversarial vulnerabilities</u> (small input perturbations fool the model).</p><p class="text-green-700 text-xs -mt-1">• Rủi ro chức năng: Sai lệch, quá khớp, lỗ hổng đối nghịch.</p>'
    + '<p><span class="text-blue-600 font-medium">• Non-functional risks:</span> Lack of robustness, performance issues.</p><p class="text-green-700 text-xs -mt-1">• Rủi ro phi chức năng: Thiếu độ tin cậy, hiệu suất.</p>'
    + '<p><span class="text-blue-600 font-medium">• Mitigations:</span> <u>Adversarial/Fuzz testing</u> → improve robustness. <u>Back-to-back testing</u> → detect update errors. <u>A/B testing</u> → catch performance drops. <u>Red teaming</u> → prevent harmful output.</p><p class="text-green-700 text-xs -mt-1">• Giảm thiểu: Adversarial, Back-to-back, A/B, Red teaming.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. Model Documentation Evaluation (AI-6.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Documentation is key for transparency — AI code is "black box". Enables stakeholders to trace model behavior, decision logic, data lineage.</p><p class="text-green-700 text-xs -mt-1">Tài liệu là công cụ chính để hiểu hệ thống AI (hộp đen). Minh bạch cho phép truy xuất hành vi.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. ML Functional Performance Testing (AI-6.1.3 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Statistical approach: Test on large dataset, report with confidence intervals (e.g. \"94% ±4% at 95% confidence\"). Metrics: Accuracy, Recall, Precision, F1-score.</p><p class="text-green-700 text-xs -mt-1">Tiếp cận thống kê: Báo cáo với độ tin cậy. Chỉ số: Accuracy, Recall, Precision, F1.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">4. Adversarial Testing (AI-6.1.4 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Slightly perturbed inputs (imperceptible to humans) to fool the model. Black-box or White-box approaches. Goal: find vulnerabilities, build safeguards.</p><p class="text-green-700 text-xs -mt-1">Đầu vào xáo trộn nhẹ để đánh lừa mô hình. Hộp đen hoặc hộp trắng. Mục tiêu: tìm lỗ hổng.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Metamorphic Testing (AI-6.1.5 - K3)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><strong>K3 — key exam topic.</strong> Solves the <u>oracle problem</u> (unknown expected output). Creates <u>follow-up</u> test cases from a known <u>source</u> test case using <u>Metamorphic Relations (MR)</u> — properties that should hold between input-output pairs.</p><p class="text-green-700 text-xs -mt-1">Giải quyết vấn đề bộ máy kiểm thử. Dùng Quan hệ biến đổi (MR).</p>'
    + '<p><span class="text-blue-600 font-medium">• Monotonicity:</span> More cigarettes → predicted lifespan must decrease.</p><p class="text-green-700 text-xs -mt-1">• Tính đơn điệu: Đầu vào tăng → đầu ra giảm tương ứng.</p>'
    + '<p><span class="text-blue-600 font-medium">• Consistency:</span> Similar inputs → similar outputs.</p><p class="text-green-700 text-xs -mt-1">• Tính nhất quán: Đầu vào tương đồng → đầu ra tương đồng.</p>'
    + '<p><span class="text-blue-600 font-medium">• Invariance:</span> Output unchanged despite small input perturbations.</p><p class="text-green-700 text-xs -mt-1">• Tính bất biến: Đầu ra giữ nguyên dù đầu vào xáo trộn nhẹ.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">6. Drift Testing (AI-6.1.7 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Data drift:</span> Input statistical properties change (e.g. spam filter sees new attack types).</p><p class="text-green-700 text-xs -mt-1">• Trôi dạt dữ liệu: Thuộc tính đầu vào thay đổi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Concept drift:</span> Input-output relationship changes (e.g. new regulations change risk classification).</p><p class="text-green-700 text-xs -mt-1">• Trôi dạt khái niệm: Mối quan hệ đầu vào-đầu ra thay đổi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Technique:</span> Compare distributions (Kolmogorov-Smirnov test).</p><p class="text-green-700 text-xs -mt-1">• Kỹ thuật: So sánh phân phối thống kê.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">7. Overfitting & Underfitting (AI-6.1.8 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Overfitting:</span> Model memorizes training data (including noise), fails on new data. Detect via unseen test data + learning curves.</p><p class="text-green-700 text-xs -mt-1">• Quá khớp: Học thuộc lòng dữ liệu huấn luyện, không khái quát hóa.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">8. A/B Testing & Back-to-Back Testing (AI-6.1.9, AI-6.1.10 - K2)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• A/B Testing:</span> Compare two variants (A vs B) on performance metrics. Used for updates/self-learning systems.</p><p class="text-green-700 text-xs -mt-1">• A/B: So sánh hiệu suất giữa hai biến thể.</p>'
    + '<p><span class="text-blue-600 font-medium">• Back-to-Back Testing:</span> Use another version as pseudo-oracle to compare outputs — focuses on defect detection.</p><p class="text-green-700 text-xs -mt-1">• Back-to-back: Dùng phiên bản khác làm bộ máy kiểm thử giả — tập trung phát hiện lỗi.</p>'
    + '<p class="text-yellow-700 font-medium mt-2">⚠️ Key: Metamorphic Testing (K3) — practice setting up MRs. Distinguish A/B vs Back-to-Back testing.</p>'
    + '<p class="text-green-700 text-xs -mt-1">⚠️ Quan trọng: Metamorphic Testing là K3. Phân biệt A/B vs Back-to-Back.</p>'
    + '</div>',

  7: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. ML Development Risks & Mitigations (AI-7.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Wrong API usage of library/framework →</span> <u>API testing</u> — verify correct API calls (e.g. TensorFlow, PyTorch).</p><p class="text-green-700 text-xs -mt-1">• Sai API → API testing.</p>'
    + '<p><span class="text-blue-600 font-medium">• Unsuitable framework choice →</span> <u>Framework suitability review</u> — evaluate if the ML framework meets project requirements (performance, compatibility, community support).</p><p class="text-green-700 text-xs -mt-1">• Framework không phù hợp → Đánh giá tính phù hợp.</p>'
    + '<p><span class="text-blue-600 font-medium">• Broken framework installation →</span> <u>Smoke testing</u> — basic checks that the framework installed and runs correctly.</p><p class="text-green-700 text-xs -mt-1">• Cài đặt lỗi → Smoke testing.</p>'
    + '<p><span class="text-blue-600 font-medium">• Buggy library or algorithm implementation →</span> <u>ML functional performance testing</u> — verify model accuracy and other metrics to catch implementation errors.</p><p class="text-green-700 text-xs -mt-1">• Thư viện/ thuật toán lỗi → Kiểm thử hiệu suất chức năng ML.</p>'
    + '<p><span class="text-blue-600 font-medium">• Suboptimal hyperparameter selection →</span> <u>ML functional performance testing</u> (evaluate different configurations) or <u>A/B testing</u> (compare variants).</p><p class="text-green-700 text-xs -mt-1">• Siêu tham số không tối ưu → A/B testing.</p>'
    + '<p><span class="text-blue-600 font-medium">• Wrong training/validation/test data split →</span> <u>Data allocation review</u> — verify correct distribution of data across sets.</p><p class="text-green-700 text-xs -mt-1">• Phân bổ dữ liệu sai → Đánh giá phân bổ.</p>'
    + '<p><span class="text-blue-600 font-medium">• Deployment error →</span> Smoke / ML functional / A/B testing.</p><p class="text-green-700 text-xs -mt-1">• Lỗi triển khai → Smoke, ML functional, A/B testing.</p>'
    + '<p><span class="text-blue-600 font-medium">• New model shows no improvement →</span> <u>Shadow testing</u> — run new model parallel to current, compare performance on real traffic without impacting users.</p><p class="text-green-700 text-xs -mt-1">• Không cải thiện → Shadow testing (kiểm thử bóng).</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. Deployment Testing Types (AI-7.1.2 - K2)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Installability testing:</span> Verify the ML system can be <strong>installed, configured, and removed</strong> successfully. Includes checking system dependencies (GPU drivers, CUDA) and different installation scenarios (clean install, upgrade).</p><p class="text-green-700 text-xs -mt-1">• Kiểm thử cài đặt: Xác minh cài đặt, cấu hình, gỡ bỏ.</p>'
    + '<p><span class="text-blue-600 font-medium">• Rollback testing:</span> Verify the ability to <strong>revert to a previous stable version</strong> if the new deployment fails. Critical for ML systems where new models may perform worse. Must be tested <strong>before</strong> production deployment.</p><p class="text-green-700 text-xs -mt-1">• Kiểm thử khôi phục: Quay lại trạng thái ổn định trước đó.</p>'
    + '<p><span class="text-blue-600 font-medium">• Canary testing:</span> Gradually release the updated model to a <strong>small subset of users</strong> (e.g. 5%). Monitor real-time metrics (latency, accuracy, error rates) and roll back if issues detected before full rollout. <u>Real user responses ARE used.</u></p><p class="text-green-700 text-xs -mt-1">• Canary: Phát hành cho nhóm nhỏ, theo dõi chỉ số thời gian thực.</p>'
    + '<p><span class="text-blue-600 font-medium">• Shadow testing:</span> New model runs <strong>in parallel</strong> with the current production model. <u>Both receive real requests</u>, but <u>only the current model&#39;s response is sent to users</u>. This allows comparing performance on real data without risking user experience. <u>No impact on users.</u></p><p class="text-green-700 text-xs -mt-1">• Shadow: Chạy song song, chỉ phản hồi mô hình cũ đến người dùng.</p>'
    + '<p><span class="text-blue-600 font-medium">• Model conversion testing:</span> Verify the model maintains accuracy and efficiency after <strong>format conversion</strong> (e.g. TensorFlow → TensorFlow Lite for mobile, ONNX for cross-platform). Conversion may introduce precision loss.</p><p class="text-green-700 text-xs -mt-1">• Chuyển đổi mô hình: Kiểm tra độ chính xác sau chuyển đổi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Cross-device testing:</span> Verify the ML system works correctly across <strong>all target deployment devices</strong> — from cloud servers to edge devices, mobile phones, and IoT sensors. Different hardware may produce different results due to numerical precision variations.</p><p class="text-green-700 text-xs -mt-1">• Đa thiết bị: Hoạt động chính xác trên tất cả mục tiêu.</p>'
    + '<p><span class="text-blue-600 font-medium">• API testing:</span> Verify system interfaces comply with standards, handle correct input/output, and return proper error messages. Tests include input validation, rate limiting, authentication, and response format compliance.</p><p class="text-green-700 text-xs -mt-1">• API: Xác minh giao diện tuân thủ tiêu chuẩn.</p>'
    + '<p class="text-yellow-700 font-medium mt-2">⚠️ All LOs are K2. Focus: distinguish Canary vs Shadow testing. Risks here are from TOOLS & DEPLOYMENT, not algorithms or data.</p>'
    + '<p class="text-green-700 text-xs -mt-1">⚠️ Tất cả K2. Phân biệt Canary vs Shadow. Rủi ro từ CÔNG CỤ & TRIỂN KHAI.</p>'
    + '</div>'
};

function resetProgress() {
  if (confirm('Reset all study progress? This will clear visited chapters, quiz history, and exam attempts.')) {
    localStorage.removeItem('ctai_chapter_visits');
    localStorage.removeItem('ctai_last_chapter');
    localStorage.removeItem('ctai_quiz_history');
    localStorage.removeItem('ctai_exam_history');
    renderHomePage();
  }
}

// ===== NAVIGATION =====
function navigate(page) { window.location.hash = page; }
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

function handleRoute() {
  const hash = window.location.hash.slice(1) || 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('border-secondary', 'text-secondary'));
  document.querySelectorAll('.fab-quiz-btn').forEach(b => b.classList.add('hidden'));
  window.scrollTo(0,0);

  if (hash === 'home') { showCourseSelector(); return; }
  if (hash === 'dashboard') {
    if (!getCurrentCourse()) { navigate('home'); return; }
    document.getElementById('page-home').classList.add('active');
    document.querySelector('.nav-link[href="#dashboard"]')?.classList.add('border-secondary', 'text-secondary');
    AppState.currentPage = 'home'; AppState.currentChapter = null;
    renderHomePage(); return;
  }
  const cm = hash.match(/^chapter-(\d+)$/);
  const qm = hash.match(/^quiz-(\d+)$/);
  if (cm) {
    document.getElementById('page-chapter').classList.add('active');
    document.querySelector('.nav-link[href="#chapter-1"]')?.classList.add('border-secondary', 'text-secondary');
    updateSidebar(hash);
    AppState.currentPage = 'chapter'; AppState.currentChapter = parseInt(cm[1]);
    trackChapterVisit(parseInt(cm[1]));
    renderChapter(AppState.currentChapter);
    document.getElementById('fab-quiz')?.classList.remove('hidden');
    document.getElementById('fab-quiz').onclick = () => navigate(`quiz-${cm[1]}`);
    return;
  }
  if (qm) {
    document.getElementById('page-quiz').classList.add('active');
    document.querySelector('.nav-link[href="#quiz-1"]')?.classList.add('border-secondary', 'text-secondary');
    AppState.currentPage = 'quiz'; AppState.currentChapter = parseInt(qm[1]);
    trackChapterVisit(parseInt(qm[1]));
    renderQuiz(AppState.currentChapter); return;
  }
  if (hash === 'course-select') { showCourseSelector(); return; }
  if (hash === 'full-exam') {
    document.getElementById('page-full-exam').classList.add('active');
    document.querySelector('.nav-link[href="#full-exam"]')?.classList.add('border-secondary', 'text-secondary');
    AppState.currentPage = 'full-exam'; AppState.currentChapter = null;
    renderFullExam(); return;
  }
  if (hash === 'practice') {
    window.location.hash = 'home';
    setTimeout(showQuickPractice, 100);
    return;
  }
  window.location.hash = 'home';
}

function setActiveNav(el) {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('border-secondary', 'text-secondary'));
  el?.classList.add('border-secondary', 'text-secondary');
}

// ===== SIDEBAR =====
function buildSidebar() {
  var sidebar = document.getElementById('sidebar');
  // Hide sidebar if no course selected
  var courseId = getCurrentCourse();
  if (!courseId) { sidebar.style.display = 'none'; return; }
  sidebar.style.display = ''; // show sidebar
  var course = COURSES[courseId];
  if (course) {
    var titleEl = document.getElementById('sidebar-title');
    var subEl = document.getElementById('sidebar-sub');
    if (titleEl) titleEl.textContent = course.title;
    if (subEl) subEl.textContent = course.subtitle + ' · Syllabus v2.0';
  }

  const icons = ['info','psychology','biotech','quiz','database','model_training','deployed_code'];
  document.getElementById('chapter-list').innerHTML = SYLLABUS_DATA.map(ch =>
    `<a href="#chapter-${ch.chapter}" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant text-sm font-medium no-underline border-l-[3px] border-transparent" data-chapter="${ch.chapter}">
      <span class="material-symbols-outlined text-secondary/70" style="font-size:20px;">${icons[ch.chapter-1]||'article'}</span>
      <span>Ch ${ch.chapter}: ${ch.title}</span>
    </a>`
  ).join('');

  // Add Full Exam link after chapters
  const sidebarNav = document.getElementById('chapter-list');
  sidebarNav.insertAdjacentHTML('beforeend',
    `<div class="border-t border-outline-variant my-2 pt-2">
      <a href="#full-exam" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant text-sm font-medium no-underline border-l-[3px] border-transparent" data-chapter="full">
        <span class="material-symbols-outlined text-secondary" style="font-size:20px;">assignment</span>
        <span class="font-bold text-secondary">📋 Full Practice Exam</span>
      </a>
    </div>`
  );

  document.getElementById('sidebar-toggle').onclick = () => document.getElementById('sidebar').classList.toggle('open');
  document.querySelectorAll('.sidebar-link').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth < 768) document.getElementById('sidebar')?.classList.remove('open');
  }));
  // Tap main content to close sidebar on mobile
  document.getElementById('main-content')?.addEventListener('click', () => {
    if (window.innerWidth < 768) document.getElementById('sidebar')?.classList.remove('open');
  });
  document.getElementById('btn-quick-quiz')?.addEventListener('click', () => showQuickPractice());
}

function updateSidebar(hash) {
  document.querySelectorAll('.sidebar-link').forEach(a => {
    a.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'font-bold', 'border-secondary');
  });
  if (hash.startsWith('chapter-') || hash.startsWith('quiz-')) {
    const ch = hash.split('-')[1];
    const link = document.querySelector(`.sidebar-link[data-chapter="${ch}"]`);
    if (link) link.classList.add('bg-secondary-container', 'text-on-secondary-container', 'font-bold', 'border-secondary');
  }
  if (hash === 'full-exam') {
    const link = document.querySelector('.sidebar-link[data-chapter="full"]');
    if (link) link.classList.add('bg-secondary-container', 'text-on-secondary-container', 'font-bold', 'border-secondary');
  }
}

// ===== HOME =====
function renderHomePage() {
  const grid = document.getElementById('home-chapters');
  var chImgs = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80'
  ];
  var icons = ['🧠','✨','🤖','🔍','💾','🧪','⚡'];
  var gradients = ['from-violet-900 to-indigo-800','from-emerald-800 to-teal-700','from-blue-800 to-indigo-900','from-sky-800 to-blue-800','from-purple-800 to-fuchsia-700','from-rose-800 to-pink-700','from-teal-800 to-cyan-700'];
  grid.innerHTML = SYLLABUS_DATA.map(ch => {
    const idx = ch.chapter - 1;
    const qs = QUESTIONS_DATA.filter(q => q.chapter === ch.chapter).length;
    return `<div class="col-span-12 md:col-span-6 lg:col-span-4 cursor-pointer group" onclick="navigate('chapter-${ch.chapter}')">
      <div class="rounded-xl overflow-hidden border border-outline-variant hover:border-secondary hover:shadow-lg transition-all duration-300">
        <div class="relative overflow-hidden" style="aspect-ratio:1">
          <img src="${chImgs[idx]}" alt="" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.parentElement.style.background='linear-gradient(135deg, #1e1b4b, #3730a3)'">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div class="absolute top-3 left-3 flex items-center gap-2">
            <span class="text-xl">${icons[idx]}</span>
            <span class="text-xs font-bold text-white/80 uppercase tracking-wider">Ch ${ch.chapter}</span>
          </div>
          <div class="absolute bottom-3 left-3 right-3">
            <h4 class="text-white font-bold text-sm md:text-base leading-tight">${ch.title.length > 40 ? ch.title.slice(0,40)+'…' : ch.title}</h4>
            <div class="flex items-center gap-3 mt-1 text-xs text-white/60">
              <span>⏱ ${getDuration(ch.chapter)}</span>
              <span>${qs} questions</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const fullExamCountEl = document.getElementById('full-exam-count');
  if (fullExamCountEl) fullExamCountEl.textContent = QUESTIONS_DATA.length;

  // Progress ring + resume button
  const prog = getStudyProgress();
  const ring = document.getElementById('hero-progress-ring');
  if (ring) {
    const circ = 2 * Math.PI * 42; // r=42
    const offset = circ - (prog.pct / 100) * circ;
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = offset;
    ring.parentElement.nextElementSibling.textContent = prog.pct + '%';
  }
  const btnResume = document.getElementById('btn-resume');
  if (btnResume) {
    btnResume.onclick = resumeLearning;
    const lastCh = getLastVisitedChapter();
    const chTitle = SYLLABUS_DATA.find(c => c.chapter === lastCh)?.title || '';
    btnResume.innerHTML = 'Ch.' + lastCh + ' <span class="text-xs font-normal opacity-70">' + (chTitle.length > 35 ? chTitle.slice(0,35)+'…' : chTitle) + '</span> <span class="material-symbols-outlined text-[18px]">arrow_forward</span>';
  }
  // Stats
  const visited = getVisitedChapters();
  const completedEl = document.getElementById('completed-chapters');
  if (completedEl) completedEl.textContent = visited.length + '/' + SYLLABUS_DATA.length;
  let totalQuizzes = 0;
  for (let i = 1; i <= 7; i++) {
    try {
      const h = JSON.parse(localStorage.getItem('ctai_quiz_history') || '{}');
      totalQuizzes += (h['ch' + i] || []).length;
    } catch(e) {}
  }
  const quizEl = document.getElementById('quiz-attempts');
  if (quizEl) quizEl.textContent = totalQuizzes;
}

function getDuration(c) { return ({1:'120 min',2:'45 min',3:'375 min',4:'195 min',5:'180 min',6:'225 min',7:'30 min'})[c]||''; }

// ===== CHAPTER =====
function renderChapter(n) {
  const ch = SYLLABUS_DATA.find(c => c.chapter === n);
  if (!ch) { document.getElementById('chapter-content').innerHTML = '<p class="text-on-surface-variant">Chapter not found.</p>'; return; }
  const qs = QUESTIONS_DATA.filter(q => q.chapter === n).length;
  const pageMap = {1:14, 2:21, 3:26, 4:38, 5:46, 6:54, 7:63};

  var icons = ['🧠','✨','🤖','🔍','💾','🧪','⚡'];
  var chImgs = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80'
  ];
  let html = '<div class="relative overflow-hidden rounded-xl mb-6 text-white min-h-[160px] md:min-h-[180px] flex items-end" style="background:#0a1628">'
    + '<img src="' + chImgs[n-1] + '" alt="" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display=\'none\'">'
    + '<div class="absolute inset-0 bg-gradient-to-t from-[#0a1628]/95 via-[#0a1628]/40 to-transparent"></div>'
    + '<div class="relative z-10 p-5 md:p-7 w-full">'
    + '<div class="flex items-center gap-3 mb-2">'
    + '<span class="text-3xl">' + icons[n-1] + '</span>'
    + '<span class="text-xs font-semibold uppercase tracking-widest text-white/60">Chapter ' + n + ' · ' + getDuration(n) + '</span>'
    + '</div>'
    + '<h1 class="font-display text-2xl md:text-3xl font-bold">' + ch.title + '</h1>'
    + '<div class="flex gap-4 mt-1 text-sm text-white/60">'
    + '<span>📄 Page ' + (pageMap[n] || '?') + '</span>'
    + '<span>❓ ' + qs + ' questions</span>'
    + '</div></div></div>';

  if (ch.keywords && ch.keywords.length) {
    const kw = ch.keywords.join(',').split(',').map(k=>k.trim()).filter(k=>k);
    if (kw.length) {
      html += '<div class="flex flex-wrap gap-1.5 mb-4">' + kw.slice(0,12).map(k=>'<span class="px-2.5 py-0.5 bg-surface-container rounded-full text-xs text-on-surface-variant">' + k + '</span>').join('') + (kw.length > 12 ? '<span class="px-2.5 py-0.5 text-xs text-on-surface-variant">+'+(kw.length-12)+'</span>' : '') + '</div>';
    }
  }

  if (ch.learningObjectives && ch.learningObjectives.length) {
    html += '<details open class="bg-amber-50 border border-amber-200 rounded-lg mb-5 overflow-hidden">'
      + '<summary class="text-sm font-semibold text-amber-800 px-4 py-3 cursor-pointer hover:bg-amber-100/50 transition-colors select-none flex items-center gap-2">'
      + '<span class="material-symbols-outlined text-[18px]">emoji_objects</span> Learning Objectives (' + ch.learningObjectives.length + ')'
      + '<span class="ml-auto text-xs text-amber-600 font-normal">click to expand</span>'
      + '</summary>'
      + '<div class="px-4 pb-3 pt-1"><ul class="space-y-1">';
    ch.learningObjectives.forEach(lo => {
      const m = lo.match(/^(AI-\S+)\s+(\(K\d\))\s+(.+)/);
      html += '<li class="text-sm text-on-surface-variant">' + (m ? '<span class="font-semibold text-on-surface">' + m[1] + '</span> ' + m[3] + ' <em class="text-xs text-amber-700">' + m[2] + '</em>' : lo) + '</li>';
    });
    html += '</ul></div></details>';
  }

  // Study buttons - open PDF in new window
  html += '<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 mb-5 text-center">'
    + '<h3 class="font-semibold mb-4">📖 Study Content</h3>'
    + '<p class="text-sm text-on-surface-variant mb-5">Open the syllabus PDF to read with original formatting, images, and tables.</p>'
    + '<div class="flex justify-center gap-4 flex-wrap">'
    + '<a class="btn inline-flex items-center bg-secondary text-on-secondary px-6 py-3 rounded-lg font-bold scale-98-active no-underline" href="/ISTQB-_CTAI_Syllabus_v2.0_Release.pdf?ch=' + n + '#page=' + (pageMap[n] || 13) + '" target="_blank" rel="noopener noreferrer" onclick="this.href=this.href.split(\'&\')[0]+\'&\'+Date.now()+\'#\'+this.href.split(\'#\')[1]">📘 Học với English</a>'
    + '<a class="btn inline-flex items-center border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-bold hover:bg-secondary hover:text-on-secondary transition-all scale-98-active no-underline" href="songngu.html?ch=' + n + '&page=1" target="_blank" rel="noopener noreferrer">📖 Học với Song ngữ</a>'
    + '</div></div>';

  // Chapter summary (if available)
  var summaries = CHAPTER_SUMMARIES[n];
  if (summaries) {
    html += '<details open class="bg-blue-50 border border-blue-200 rounded-lg mb-5 overflow-hidden">'
      + '<summary class="text-sm font-semibold text-blue-800 px-4 py-3 cursor-pointer hover:bg-blue-100/50 transition-colors select-none flex items-center gap-2">'
      + '<span class="material-symbols-outlined text-[18px]">summarize</span> 📝 Tóm tắt ý chính'
      + '<span class="ml-auto text-xs text-blue-600 font-normal">click to toggle</span>'
      + '</summary>'
      + '<div class="px-4 pb-3 pt-1"><div class="text-sm text-on-surface leading-relaxed space-y-2">' + summaries + '</div></div>'
      + '</details>';
  }

  html += '<div class="flex justify-center mt-8">'
    + '<button class="btn bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold scale-98-active" onclick="navigate(\'quiz-' + n + '\')">📝 Take Chapter ' + n + ' Quiz (' + qs + ')</button>'
    + '</div>';

  document.getElementById('chapter-content').innerHTML = html;
}

// ===== BILINGUAL =====
function toggleBilingualPdf(ch) {
  window.open('songngu.html?ch=' + ch + '&page=1', '_blank');
}

function getKLevel(qId) {
  try {
    var a = ANSWERS_DATA[qId];
    if (!a || !a.kLevel) return null;
    var k = a.kLevel;
    var names = {K1:'📖 Nhớ', K2:'📗 Hiểu', K3:'🔧 Áp dụng', K4:'📊 Phân tích'};
    var colors = {K1:'#6b7280', K2:'#2563eb', K3:'#d97706', K4:'#7c3aed'};
    return {level: k, name: names[k] || k, color: colors[k] || '#6b7280'};
  } catch(e) { return null; }
}

// ===== QUIZ =====
let quizState = {};

function renderQuiz(n) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  const questions = QUESTIONS_DATA.filter(q => q.chapter === n);
  if (!questions.length) {
    document.getElementById('quiz-questions-area').innerHTML = '<p class="text-on-surface-variant">No questions.</p>';
    document.getElementById('quiz-sidebar').innerHTML = '';
    return;
  }

  quizState = { chapterNum: n, questions, userAnswers: {}, submitted: false, score: null, flagged: new Set() };

  // Reset sidebar for new quiz
  var sideBar = document.getElementById('quiz-sidebar');
  if (sideBar) sideBar.style.display = '';

  // Sidebar
  document.getElementById('quiz-sidebar').innerHTML = `
    <div class="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <div class="text-center mb-4">
        <p class="text-caption font-caption text-on-surface-variant tracking-wider uppercase">Time Remaining</p>
        <p class="text-[32px] font-bold text-secondary font-display" id="quiz-timer">45:00</p>
        <div class="h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-2">
          <div class="h-full bg-secondary rounded-full" id="timer-bar" style="width:100%"></div>
        </div>
      </div>
      <div class="text-sm font-semibold mb-2">Question Navigator</div>
      <div class="grid grid-cols-5 gap-1.5" id="q-nav-grid"></div>
      <div class="flex justify-center gap-3 text-xs text-on-surface-variant mt-3">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-secondary-container rounded-sm"></span> Answered</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-error rounded-sm"></span> Flagged</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-surface-container-highest rounded-sm"></span> Unseen</span>
      </div>
      <div class="flex justify-center gap-2 text-xs text-on-surface-variant mt-2 border-t border-outline-variant pt-2">
        <span class="flex items-center gap-1"><span class="px-1 rounded text-[10px] font-bold" style="background:#2563eb20;color:#2563eb">K2</span> Hiểu</span>
        <span class="flex items-center gap-1"><span class="px-1 rounded text-[10px] font-bold" style="background:#d9770620;color:#d97706">K3</span> Áp dụng</span>
      </div>
      <button class="btn w-full bg-primary text-on-primary py-2.5 rounded-lg font-bold mt-4 scale-98-active" id="btn-submit" onclick="submitQuiz()">Submit All</button>
      <p class="text-caption font-caption text-on-surface-variant text-center mt-2">Auto-save enabled</p>
    </div>
  `;

  // Questions
  let html = `<div class="mb-4">
    <h1 class="font-display text-headline-lg text-primary">Chapter ${n} Quiz</h1>
    <p class="text-on-surface-variant text-body-md">${questions.length} questions</p>
  </div>
  ${renderQuizHistory(n)}`;

  questions.forEach((q, idx) => {
    const qid = `q${q.id}`;
    const inputType = q.selectType === 'multiple' ? 'checkbox' : 'radio';
    const name = inputType === 'checkbox' ? `q${q.id}` : qid;

    var kInfo = getKLevel(q.id);
    html += `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-4" id="card-${qid}">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm font-semibold text-secondary">Q${q.id} · ${q.lo || ''} ${kInfo ? '<span class="ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-bold" style="background:'+kInfo.color+'20;color:'+kInfo.color+'">'+kInfo.level+' '+kInfo.name+'</span>' : ''}</span>
        <div class="flex items-center gap-2">
          <span class="text-caption font-caption text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full">${q.points} pt</span>
          <button class="text-on-surface-variant hover:text-secondary transition-all bg-transparent border-none cursor-pointer p-0.5" onclick="toggleFlag(${q.id})" title="Flag for review">
            <span class="material-symbols-outlined text-[18px]" id="flag-${qid}">flag</span>
          </button>
        </div>
      </div>
      <div class="text-sm mb-3 leading-relaxed" style="white-space:pre-wrap">${q.text}</div>
      ${q.selectType === 'multiple' ? `<div class="text-xs text-on-surface-variant italic mb-2">Select ${q.selectCount} answers</div>` : ''}
      <div class="space-y-2">`;

    q.choices.forEach(c => {
      const inputName = inputType === 'checkbox' ? `q${q.id}-${c.key}` : `q${q.id}`;
      html += `<label class="option-card flex items-start gap-3 p-3 border ${inputType==='checkbox'?'':'has-[:checked]:border-2 has-[:checked]:border-secondary has-[:checked]:bg-secondary/5'} border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all text-sm" id="label-${qid}-${c.key}">
        <input type="${inputType}" name="${inputName}" value="${c.key}" data-qid="${q.id}" data-key="${c.key}" class="peer mt-0.5 accent-secondary" onchange="onQuizChange()" style="accent-color:#0058bb">
        <span class="font-semibold text-on-surface-variant shrink-0 w-4">${c.key})</span>
        <span>${c.text}</span>
      </label>`;
    });

    html += `</div><div class="mt-3 hidden space-y-1 text-sm text-on-surface-variant" id="rationale-${qid}"></div></div>`;
  });

  document.getElementById('quiz-questions-area').innerHTML = html;

  // Init nav grid
  renderNavGrid();
  startTimer();
}

function renderNavGrid() {
  const grid = document.getElementById('q-nav-grid');
  if (!grid) return;
  const qs = quizState.questions;
  grid.innerHTML = qs.map((q, i) =>
    `<button class="question-nav-btn w-8 h-8 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant border-none" id="nav-${q.id}" data-idx="${i}" onclick="document.querySelectorAll('.question-card, [id^=card-q]')?.forEach?.(c => c.style.display??''); document.getElementById('card-q${q.id}')?.scrollIntoView({behavior:'smooth'})">${i+1}</button>`
  ).join('');
}

function toggleFlag(qId) {
  if (quizState.flagged.has(qId)) quizState.flagged.delete(qId);
  else quizState.flagged.add(qId);
  const el = document.getElementById(`flag-q${qId}`);
  if (el) {
    el.style.fontVariationSettings = quizState.flagged.has(qId) ? "'FILL'1" : "'FILL'0";
    el.style.color = quizState.flagged.has(qId) ? '#ba1a1a' : '';
  }
  const nav = document.getElementById(`nav-${qId}`);
  if (nav) {
    if (quizState.flagged.has(qId)) { nav.classList.add('bg-error', 'text-white'); nav.classList.remove('bg-surface-container-highest', 'bg-secondary-container'); }
    else { nav.classList.remove('bg-error', 'text-white'); nav.classList.add('bg-surface-container-highest'); }
  }
}

let timerInterval = null;
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  let secs = 2700;
  timerInterval = setInterval(() => {
    secs--;
    const m = Math.floor(secs/60), s = secs%60;
    const timer = document.getElementById('quiz-timer');
    if (timer) {
      timer.textContent = `${m}:${s.toString().padStart(2,'0')}`;
      if (secs <= 300) { timer.className = 'text-[32px] font-bold text-error font-display'; }
    }
    const bar = document.getElementById('timer-bar');
    if (bar) bar.style.width = `${(secs/2700)*100}%`;
    if (secs <= 300 && bar) bar.className = 'h-full bg-error rounded-full';
    if (secs <= 0) { clearInterval(timerInterval); alert('Time is up!'); submitQuiz(); }
  }, 1000);
}

function onQuizChange() {
  if (quizState.submitted) return;
  let answered = 0;
  const navGrid = document.getElementById('q-nav-grid');
  quizState.questions.forEach(q => {
    const checked = document.querySelectorAll(`input[data-qid="${q.id}"]:checked`).length;
    if (checked > 0) {
      answered++;
      const nav = document.getElementById(`nav-${q.id}`);
      if (nav && !quizState.flagged.has(q.id)) {
        nav.classList.remove('bg-surface-container-highest');
        nav.classList.add('bg-secondary-container', 'text-on-secondary-container');
      }
    }
  });
  // update progress
  const progressFill = document.querySelector('#quiz-questions-area .progress-fill');
  if (progressFill) progressFill.style.width = `${(answered/quizState.questions.length)*100}%`;
}

function submitQuiz() {
  if (quizState.submitted) return;
  if (timerInterval) clearInterval(timerInterval);

  const userAns = {};
  let allAnswered = true;
  quizState.questions.forEach(q => {
    const keys = Array.from(document.querySelectorAll(`input[data-qid="${q.id}"]:checked`)).map(i=>i.value);
    userAns[q.id] = keys;
    if (!keys.length) allAnswered = false;
  });
  if (!allAnswered && !confirm('Not all answered. Submit?')) return;

  quizState.submitted = true;
  document.getElementById('btn-submit')?.remove();

  let correct = 0, totalPts = 0, earned = 0;

  quizState.questions.forEach(q => {
    const ans = ANSWERS_DATA[q.id];
    if (!ans) return;
    totalPts += q.points;
    const u = (userAns[q.id]||[]).map(k=>k.trim().toLowerCase()).sort();
    const c = ans.correct.map(k=>k.trim().toLowerCase()).sort();
    const isCorrect = u.join(',') === c.join(',');
    if (isCorrect) { correct++; earned += q.points; }

    const qid = `q${q.id}`;
    const card = document.getElementById(`card-${qid}`);
    if (!card) return;
    card.className = `rounded-xl p-5 mb-4 border-2 ${isCorrect ? 'border-success bg-success-container' : 'border-error bg-error-container'}`;

    q.choices.forEach(choice => {
      const label = document.getElementById(`label-${qid}-${choice.key}`);
      if (!label) return;
      label.style.cursor = 'default';
      const input = label.querySelector('input');
      if (input) input.disabled = true;

      const isUser = u.includes(choice.key);
      const isRight = c.includes(choice.key);
      const icon = document.createElement('span');
      icon.className = 'result-icon ml-auto text-sm';
      if (isRight && isUser) { icon.textContent = '✅'; label.style.borderColor = '#2e7d32'; label.style.background = '#e8f5e9'; }
      else if (isRight && !isUser) { icon.textContent = '✅'; label.style.borderColor = '#2e7d32'; }
      else if (!isRight && isUser) { icon.textContent = '❌'; label.style.borderColor = '#ba1a1a'; label.style.background = '#ffebee'; }
      const existing = label.querySelector('.result-icon');
      if (existing) existing.remove();
      label.appendChild(icon);
    });

    showRationale(q, ans, u, c);
  });

  const pct = Math.round((earned/totalPts)*100);
  const pass = pct >= 65;

  // Save quiz history
  const wrongIds = quizState.questions.filter(q => {
    const ans = ANSWERS_DATA[q.id];
    if (!ans) return false;
    const u = (userAns[q.id]||[]).map(k=>k.trim().toLowerCase()).sort();
    const c = ans.correct.map(k=>k.trim().toLowerCase()).sort();
    return u.join(',') !== c.join(',');
  }).map(q => q.id);
  saveQuizHistory(quizState.chapterNum, { correct, total: quizState.questions.length, pct, wrong: wrongIds, date: new Date().toISOString() });
  const historyHtml = renderQuizHistory(quizState.chapterNum);

  // Results summary
  const ringCirc = 2*Math.PI*38;
  const offset = ringCirc - (pct/100)*ringCirc;

  const summary = `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-6 items-center">
      <div class="text-center shrink-0">
        <svg class="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#e6e8ea" stroke-width="8"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="${pass ? '#2e7d32' : '#ba1a1a'}" stroke-width="8" stroke-dasharray="${ringCirc}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
        </svg>
        <div class="text-2xl font-bold font-display -mt-16">${pct}%</div>
        <span class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold" style="${pass ? 'background:#e8f5e9;color:#2e7d32' : 'background:#ffebee;color:#ba1a1a'}">${pass ? 'PASS' : 'FAIL'}</span>
        <p class="text-caption font-caption text-on-surface-variant mt-1">Required: 65%</p>
      </div>
      <div class="flex-1">
        <h2 class="font-display text-headline-lg">${pass ? '🎉 Great job!' : '📖 Keep studying!'}</h2>
        <p class="text-on-surface-variant">You got <strong>${correct}/${quizState.questions.length}</strong> correct (${earned}/${totalPts} points)</p>
        <div class="mt-3 space-y-2">
          ${['AI Fundamentals','Testing AI Systems','Ethics & Governance','Quality Assurance'].map((topic, i) =>
            `<div class="flex items-center gap-3"><span class="text-xs w-32 shrink-0">${topic}</span>
            <div class="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div class="h-full bg-secondary rounded-full" style="width:${60 + Math.random()*35}%"></div>
            </div>
            <span class="text-xs font-medium w-8 text-right">${Math.round(60 + Math.random()*35)}%</span></div>`
          ).join('')}
        </div>
      </div>
    </div>
    <div class="flex justify-center gap-3 mt-4">
      <button class="btn bg-secondary text-on-secondary px-5 py-2 rounded-lg font-bold scale-98-active" onclick="retryQuiz()">🔄 Retry</button>
    </div>
  </div>`;

  document.getElementById('quiz-questions-area').insertAdjacentHTML('afterbegin', summary);
  if (historyHtml) {
    document.getElementById('quiz-questions-area').insertAdjacentHTML('beforeend', historyHtml);
  }
  var qs = document.getElementById('quiz-sidebar');
  if (qs) qs.style.display = 'none';
}

function showRationale(q, ans, userK, correctK) {
  const qid = `q${q.id}`;
  const div = document.getElementById(`rationale-${qid}`);
  if (!div) return;
  let html = '<div class="p-3 bg-surface-container rounded-lg space-y-1">';
  if (ans.rationale && Object.keys(ans.rationale).length > 0) {
    Object.entries(ans.rationale).forEach(function(e) {
      var k = e[0], t = e[1];
      var cls = correctK.includes(k) ? 'text-success font-medium' : (userK.includes(k) ? 'text-error font-medium' : '');
      html += '<div class="' + cls + '"><strong>' + k + ')</strong> ' + t + '</div>';
    });
  } else {
    html += '<p class="text-on-surface-variant italic text-xs">(No detailed explanation available from official answer key)</p>';
  }
  html += '</div>';
  div.innerHTML = html;
  div.classList.remove('hidden');
}

function retryQuiz() {
  if (quizState.chapterNum) {
    var ch = quizState.chapterNum;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    window.location.hash = 'home';
    setTimeout(function() { window.location.hash = 'quiz-' + ch; }, 50);
  }
}

// ===== FULL EXAM =====
function renderFullExam() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  const allQuestions = QUESTIONS_DATA;

  if (!allQuestions.length) {
    document.getElementById('exam-questions-area').innerHTML = '<p class="text-on-surface-variant">No questions available.</p>';
    document.getElementById('exam-sidebar').innerHTML = '';
    return;
  }

  quizState = { chapterNum: 'full', questions: allQuestions, userAnswers: {}, submitted: false, score: null, flagged: new Set() };

  // Sidebar
  var sideBar = document.getElementById('exam-sidebar');
  if (sideBar) sideBar.style.display = '';

  document.getElementById('exam-sidebar').innerHTML = `
    <div class="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <div class="text-center mb-4">
        <p class="text-caption font-caption text-on-surface-variant tracking-wider uppercase">Time Remaining</p>
        <p class="text-[32px] font-bold text-secondary font-display" id="exam-timer">90:00</p>
        <div class="h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-2">
          <div class="h-full bg-secondary rounded-full" id="exam-timer-bar" style="width:100%"></div>
        </div>
      </div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold">Question Navigator</span>
        <span class="text-xs text-on-surface-variant" id="exam-answered-count">0/${allQuestions.length}</span>
      </div>
      <div class="grid grid-cols-5 gap-1.5" id="exam-nav-grid"></div>
      <div class="flex justify-center gap-3 text-xs text-on-surface-variant mt-3">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-secondary-container rounded-sm"></span> Answered</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-error rounded-sm"></span> Flagged</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-surface-container-highest rounded-sm"></span> Unseen</span>
      </div>
      <div class="flex justify-center gap-2 text-xs text-on-surface-variant mt-2 border-t border-outline-variant pt-2">
        <span class="flex items-center gap-1"><span class="px-1 rounded text-[10px] font-bold" style="background:#2563eb20;color:#2563eb">K2</span> Hiểu</span>
        <span class="flex items-center gap-1"><span class="px-1 rounded text-[10px] font-bold" style="background:#d9770620;color:#d97706">K3</span> Áp dụng</span>
      </div>
      <button class="btn w-full bg-primary text-on-primary py-2.5 rounded-lg font-bold mt-4 scale-98-active" id="btn-exam-submit" onclick="submitFullExam()">Submit Exam</button>
      <p class="text-caption font-caption text-on-surface-variant text-center mt-2">All 7 chapters · ${allQuestions.length} questions</p>
    </div>
  `;

  // Questions header + chapter breakdown
  const chCounts = {};
  allQuestions.forEach(q => { chCounts[q.chapter] = (chCounts[q.chapter] || 0) + 1; });
  const chLabels = Object.keys(chCounts).sort().map(ch =>
    `<span class="text-xs px-2 py-0.5 bg-surface-container rounded-full">Ch ${ch}: ${chCounts[ch]}</span>`
  ).join('');

  let html = `<div class="mb-4">
    <h1 class="font-display text-headline-lg text-primary">📋 Full Practice Exam</h1>
    <p class="text-on-surface-variant text-body-md">${allQuestions.length} questions across all chapters · 90 minutes · Passing score: 65%</p>
    <div class="flex flex-wrap gap-1.5 mt-2">${chLabels}</div>
  </div>
  ${renderExamHistory()}`;

  allQuestions.forEach((q, idx) => {
    const qid = `exam-q${q.id}`;
    const inputType = q.selectType === 'multiple' ? 'checkbox' : 'radio';

    var kInfo = getKLevel(q.id);
    html += `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-4" id="exam-card-${qid}">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm font-semibold text-secondary">Q${idx+1} (Ch.${q.chapter}) · ${q.lo || ''} ${kInfo ? '<span class="ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-bold" style="background:'+kInfo.color+'20;color:'+kInfo.color+'">'+kInfo.level+' '+kInfo.name+'</span>' : ''}</span>
        <div class="flex items-center gap-2">
          <span class="text-caption font-caption text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full">${q.points} pt</span>
          <button class="text-on-surface-variant hover:text-secondary transition-all bg-transparent border-none cursor-pointer p-0.5" onclick="toggleExamFlag(${q.id})" title="Flag for review">
            <span class="material-symbols-outlined text-[18px]" id="exam-flag-${qid}">flag</span>
          </button>
        </div>
      </div>
      <div class="text-sm mb-3 leading-relaxed" style="white-space:pre-wrap">${q.text}</div>
      ${q.selectType === 'multiple' ? `<div class="text-xs text-on-surface-variant italic mb-2">Select ${q.selectCount} answers</div>` : ''}
      <div class="space-y-2">`;

    q.choices.forEach(c => {
      const inputName = inputType === 'checkbox' ? `exam-q${q.id}-${c.key}` : `exam-q${q.id}`;
      html += `<label class="option-card flex items-start gap-3 p-3 border ${inputType==='checkbox'?'':'has-[:checked]:border-2 has-[:checked]:border-secondary has-[:checked]:bg-secondary/5'} border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all text-sm" id="exam-label-${qid}-${c.key}">
        <input type="${inputType}" name="${inputName}" value="${c.key}" data-qid="${q.id}" data-exam="1" class="peer mt-0.5 accent-secondary" onchange="onExamChange()" style="accent-color:#0058bb">
        <span class="font-semibold text-on-surface-variant shrink-0 w-4">${c.key})</span>
        <span>${c.text}</span>
      </label>`;
    });

    html += `</div><div class="mt-3 hidden space-y-1 text-sm text-on-surface-variant" id="exam-rationale-${qid}"></div></div>`;
  });

  document.getElementById('exam-questions-area').innerHTML = html;

  // Init nav grid
  renderExamNavGrid();
  startExamTimer();
}

function renderExamNavGrid() {
  const grid = document.getElementById('exam-nav-grid');
  if (!grid) return;
  const qs = quizState.questions;
  grid.innerHTML = qs.map((q, i) =>
    `<button class="question-nav-btn w-8 h-8 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant border-none" id="exam-nav-${q.id}" data-idx="${i}" onclick="document.getElementById('exam-card-exam-q${q.id}')?.scrollIntoView({behavior:'smooth'})">${i+1}</button>`
  ).join('');
}

function toggleExamFlag(qId) {
  if (quizState.flagged.has(qId)) quizState.flagged.delete(qId);
  else quizState.flagged.add(qId);
  const el = document.getElementById(`exam-flag-exam-q${qId}`);
  if (el) {
    el.style.fontVariationSettings = quizState.flagged.has(qId) ? "'FILL'1" : "'FILL'0";
    el.style.color = quizState.flagged.has(qId) ? '#ba1a1a' : '';
  }
  const nav = document.getElementById(`exam-nav-${qId}`);
  if (nav) {
    if (quizState.flagged.has(qId)) {
      nav.classList.add('bg-error', 'text-white');
      nav.classList.remove('bg-surface-container-highest', 'bg-secondary-container');
    } else {
      nav.classList.remove('bg-error', 'text-white');
      nav.classList.add('bg-surface-container-highest');
    }
  }
}

function onExamChange() {
  if (quizState.submitted) return;
  let answered = 0;
  quizState.questions.forEach(q => {
    const checked = document.querySelectorAll(`input[data-qid="${q.id}"][data-exam="1"]:checked`).length;
    if (checked > 0) {
      answered++;
      const nav = document.getElementById(`exam-nav-${q.id}`);
      if (nav && !quizState.flagged.has(q.id)) {
        nav.classList.remove('bg-surface-container-highest');
        nav.classList.add('bg-secondary-container', 'text-on-secondary-container');
      }
    }
  });
  const countEl = document.getElementById('exam-answered-count');
  if (countEl) countEl.textContent = `${answered}/${quizState.questions.length}`;
}

let examTimerInterval = null;
function startExamTimer() {
  if (examTimerInterval) clearInterval(examTimerInterval);
  let secs = 5400; // 90 minutes
  examTimerInterval = setInterval(() => {
    secs--;
    const m = Math.floor(secs/60), s = secs%60;
    const timer = document.getElementById('exam-timer');
    if (timer) {
      timer.textContent = `${m}:${s.toString().padStart(2,'0')}`;
      if (secs <= 300) { timer.className = 'text-[32px] font-bold text-error font-display'; }
    }
    const bar = document.getElementById('exam-timer-bar');
    if (bar) bar.style.width = `${(secs/5400)*100}%`;
    if (secs <= 300 && bar) bar.className = 'h-full bg-error rounded-full';
    if (secs <= 0) {
      clearInterval(examTimerInterval);
      examTimerInterval = null;
      alert('⏰ Time is up! Submitting your exam...');
      submitFullExam();
    }
  }, 1000);
}

function submitFullExam() {
  if (quizState.submitted) return;
  if (examTimerInterval) { clearInterval(examTimerInterval); examTimerInterval = null; }

  const userAns = {};
  let allAnswered = true;
  quizState.questions.forEach(q => {
    const keys = Array.from(document.querySelectorAll(`input[data-qid="${q.id}"][data-exam="1"]:checked`)).map(i=>i.value);
    userAns[q.id] = keys;
    if (!keys.length) allAnswered = false;
  });
  if (!allAnswered && !confirm('⚠️ You have not answered all questions. Submit anyway?')) return;

  quizState.submitted = true;
  document.getElementById('btn-exam-submit')?.remove();

  let correct = 0, totalPts = 0, earned = 0;
  const chapterStats = {};

  quizState.questions.forEach(q => {
    const ans = ANSWERS_DATA[q.id];
    if (!ans) return;
    totalPts += q.points;
    const u = (userAns[q.id]||[]).map(k=>k.trim().toLowerCase()).sort();
    const c = ans.correct.map(k=>k.trim().toLowerCase()).sort();
    const isCorrect = u.join(',') === c.join(',');
    if (isCorrect) { correct++; earned += q.points; }

    // Per-chapter stats
    if (!chapterStats[q.chapter]) chapterStats[q.chapter] = { correct: 0, total: 0, points: 0, earned: 0 };
    chapterStats[q.chapter].total++;
    chapterStats[q.chapter].points += q.points;
    if (isCorrect) {
      chapterStats[q.chapter].correct++;
      chapterStats[q.chapter].earned += q.points;
    }

    const qid = `exam-q${q.id}`;
    const card = document.getElementById(`exam-card-${qid}`);
    if (!card) return;
    card.className = `rounded-xl p-5 mb-4 border-2 ${isCorrect ? 'border-success bg-success-container' : 'border-error bg-error-container'}`;

    q.choices.forEach(choice => {
      const label = document.getElementById(`exam-label-${qid}-${choice.key}`);
      if (!label) return;
      label.style.cursor = 'default';
      const input = label.querySelector('input');
      if (input) input.disabled = true;

      const isUser = u.includes(choice.key);
      const isRight = c.includes(choice.key);
      const icon = document.createElement('span');
      icon.className = 'result-icon ml-auto text-sm';
      if (isRight && isUser) { icon.textContent = '✅'; label.style.borderColor = '#2e7d32'; label.style.background = '#e8f5e9'; }
      else if (isRight && !isUser) { icon.textContent = '✅'; label.style.borderColor = '#2e7d32'; }
      else if (!isRight && isUser) { icon.textContent = '❌'; label.style.borderColor = '#ba1a1a'; label.style.background = '#ffebee'; }
      const existing = label.querySelector('.result-icon');
      if (existing) existing.remove();
      label.appendChild(icon);
    });

    showExamRationale(q, ans, u, c);
  });

  const pct = Math.round((earned/totalPts)*100);
  const pass = pct >= 65;

  // Save exam history
  const wrongIds = quizState.questions.filter(q => {
    const ans = ANSWERS_DATA[q.id];
    if (!ans) return false;
    const u = (userAns[q.id]||[]).map(k=>k.trim().toLowerCase()).sort();
    const c = ans.correct.map(k=>k.trim().toLowerCase()).sort();
    return u.join(',') !== c.join(',');
  }).map(q => q.id);
  saveExamHistory({ correct, total: quizState.questions.length, pct, wrong: wrongIds, date: new Date().toISOString() });
  const historyHtml = renderExamHistory();

  // Results summary
  const ringCirc = 2*Math.PI*38;
  const offset = ringCirc - (pct/100)*ringCirc;

  // Build chapter breakdown bars
  const chBars = Object.keys(chapterStats).sort().map(ch => {
    const s = chapterStats[ch];
    const cPct = s.total > 0 ? Math.round((s.correct/s.total)*100) : 0;
    const chTitle = SYLLABUS_DATA.find(d => d.chapter === parseInt(ch))?.title || `Chapter ${ch}`;
    return `<div class="flex items-center gap-3">
      <span class="text-xs w-8 shrink-0 font-semibold">Ch ${ch}</span>
      <div class="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all" style="width:${cPct}%;background:${cPct >= 65 ? '#2e7d32' : '#ba1a1a'}"></div>
      </div>
      <span class="text-xs font-medium w-16 text-right text-on-surface-variant">${s.correct}/${s.total}</span>
    </div>`;
  }).join('');

  const summary = `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-6 items-center">
      <div class="text-center shrink-0">
        <svg class="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#e6e8ea" stroke-width="8"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="${pass ? '#2e7d32' : '#ba1a1a'}" stroke-width="8" stroke-dasharray="${ringCirc}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
        </svg>
        <div class="text-2xl font-bold font-display -mt-16">${pct}%</div>
        <span class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold" style="${pass ? 'background:#e8f5e9;color:#2e7d32' : 'background:#ffebee;color:#ba1a1a'}">${pass ? 'PASS' : 'FAIL'}</span>
        <p class="text-caption font-caption text-on-surface-variant mt-1">Required: 65%</p>
      </div>
      <div class="flex-1">
        <h2 class="font-display text-headline-lg">${pass ? '🎉 Congratulations!' : '📖 Keep studying!'}</h2>
        <p class="text-on-surface-variant">You got <strong>${correct}/${quizState.questions.length}</strong> correct (${earned}/${totalPts} points)</p>
        <div class="mt-3 space-y-1.5">${chBars}</div>
      </div>
    </div>
    <div class="flex justify-center gap-3 mt-4">
      <button class="btn bg-secondary text-on-secondary px-5 py-2 rounded-lg font-bold scale-98-active" onclick="retryFullExam()">🔄 Retry Exam</button>
      <button class="btn border-2 border-outline-variant text-on-surface px-5 py-2 rounded-lg font-bold scale-98-active" onclick="navigate('home')">🏠 Back to Dashboard</button>
    </div>
  </div>`;

  document.getElementById('exam-questions-area').insertAdjacentHTML('afterbegin', summary);
  if (historyHtml) {
    document.getElementById('exam-questions-area').insertAdjacentHTML('beforeend', historyHtml);
  }
  var es = document.getElementById('exam-sidebar');
  if (es) es.style.display = 'none';
}

function showExamRationale(q, ans, userK, correctK) {
  const qid = `exam-q${q.id}`;
  const div = document.getElementById(`exam-rationale-${qid}`);
  if (!div) return;
  let html = '<div class="p-3 bg-surface-container rounded-lg space-y-1">';
  if (ans.rationale && Object.keys(ans.rationale).length > 0) {
    Object.entries(ans.rationale).forEach(function(e) {
      var k = e[0], t = e[1];
      var cls = correctK.includes(k) ? 'text-success font-medium' : (userK.includes(k) ? 'text-error font-medium' : '');
      html += '<div class="' + cls + '"><strong>' + k + ')</strong> ' + t + '</div>';
    });
  } else {
    html += '<p class="text-on-surface-variant italic text-xs">(No detailed explanation from official answer key)</p>';
  }
  html += '</div>';
  div.innerHTML = html;
  div.classList.remove('hidden');
}

function retryFullExam() {
  if (examTimerInterval) { clearInterval(examTimerInterval); examTimerInterval = null; }
  window.location.hash = 'home';
  setTimeout(function() { window.location.hash = 'full-exam'; }, 50);
}

// ===== EXAM HISTORY =====
function getExamHistory() {
  try {
    const data = JSON.parse(localStorage.getItem('ctai_exam_history') || '[]');
    return data;
  } catch(e) { return []; }
}

function saveExamHistory(entry) {
  try {
    const data = getExamHistory();
    data.push(entry);
    if (data.length > 10) data = data.slice(-10);
    localStorage.setItem('ctai_exam_history', JSON.stringify(data));
  } catch(e) { console.warn('Could not save exam history:', e); }
}

function renderExamHistory() {
  const history = getExamHistory();
  if (!history.length) return '';
  let html = '<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-4"><h3 class="text-sm font-semibold mb-2">📋 Exam Attempt History</h3><div class="space-y-1.5">';
  history.slice().reverse().forEach(h => {
    const d = new Date(h.date);
    const ds = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const ws = h.wrong.length ? '❌ Q' + h.wrong.join(', Q') : '🎯 All correct!';
    html += '<div class="flex items-center justify-between text-xs py-1.5 px-2 bg-surface-container rounded">'
      + '<span class="text-on-surface-variant">' + ds + '</span>'
      + '<span class="font-medium ' + (h.pct >= 65 ? 'text-success' : 'text-error') + '">' + h.correct + '/' + h.total + ' (' + h.pct + '%)</span>'
      + '<span class="text-on-surface-variant">' + ws + '</span></div>';
  });
  html += '</div></div>';
  return html;
}

// ===== QUIZ HISTORY (localStorage) =====
function getQuizHistory(chapterNum) {
  try {
    const data = JSON.parse(localStorage.getItem('ctai_quiz_history') || '{}');
    return data['ch' + chapterNum] || [];
  } catch(e) { return []; }
}

function saveQuizHistory(chapterNum, entry) {
  try {
    const data = JSON.parse(localStorage.getItem('ctai_quiz_history') || '{}');
    const key = 'ch' + chapterNum;
    if (!data[key]) data[key] = [];
    data[key].push(entry);
    if (data[key].length > 10) data[key] = data[key].slice(-10);
    localStorage.setItem('ctai_quiz_history', JSON.stringify(data));
  } catch(e) { console.warn('Could not save history:', e); }
}

function renderQuizHistory(chapterNum) {
  const history = getQuizHistory(chapterNum);
  if (!history.length) return '';
  let html = '<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-4"><h3 class="text-sm font-semibold mb-2">📋 Attempt History</h3><div class="space-y-1.5">';
  history.slice().reverse().forEach(h => {
    const d = new Date(h.date);
    const ds = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const ws = h.wrong.length ? '❌ Q' + h.wrong.join(', Q') : '🎯 All correct!';
    html += '<div class="flex items-center justify-between text-xs py-1.5 px-2 bg-surface-container rounded">'
      + '<span class="text-on-surface-variant">' + ds + '</span>'
      + '<span class="font-medium ' + (h.pct >= 65 ? 'text-success' : 'text-error') + '">' + h.correct + '/' + h.total + ' (' + h.pct + '%)</span>'
      + '<span class="text-on-surface-variant">' + ws + '</span></div>';
  });
  html += '</div></div>';
  return html;
}

// ===== QUICK PRACTICE =====
function showQuickPractice() {
  var old = document.getElementById('qp-overlay');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'qp-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:300;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center';

  var items = '';
  for (var ci = 0; ci < SYLLABUS_DATA.length; ci++) {
    var ch = SYLLABUS_DATA[ci];
    var cnt = 0;
    for (var qi = 0; qi < QUESTIONS_DATA.length; qi++) {
      if (QUESTIONS_DATA[qi].chapter === ch.chapter) cnt++;
    }
    items += '<div class="flex items-center justify-between p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all" onclick="navigate(\'quiz-' + ch.chapter + '\');var el=document.getElementById(\'qp-overlay\');if(el)el.remove()">'
      + '<div><span class="font-semibold text-sm">Ch ' + ch.chapter + ':</span> <span class="text-sm">' + ch.title + '</span></div>'
      + '<span class="text-xs text-secondary font-medium">' + cnt + ' questions &rarr;</span></div>';
  }

  overlay.innerHTML = '<div class="bg-surface-container-lowest rounded-xl shadow-xl p-6 max-w-md w-full mx-4" style="max-height:80vh;overflow-y-auto">'
    + '<div class="flex items-center justify-between mb-4">'
    + '<h2 class="font-display text-xl font-semibold">📝 Quick Practice</h2>'
    + '<button class="bg-transparent border-none text-on-surface-variant cursor-pointer text-xl p-1" onclick="document.getElementById(\'qp-overlay\').remove()">✕</button>'
    + '</div>'
    + '<p class="text-sm text-on-surface-variant mb-4">Select a chapter to practice:</p>'
    + '<div class="space-y-2">' + items + '</div></div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

// ===== AI POPUP (removed) =====

// ===== SEARCH =====
function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  const results = document.createElement('div');
  results.className = 'absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-h-72 overflow-y-auto z-50 hidden';
  input.parentElement.appendChild(results);
  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { results.classList.add('hidden'); return; }
      const hits = [];
      SYLLABUS_DATA.forEach(ch => {
        if (ch.title.toLowerCase().includes(q)) hits.push({title: ch.title, ch: ch.chapter, preview: `Chapter ${ch.chapter}`});
        (ch.sections||[]).forEach(sec => {
          if (sec.title.toLowerCase().includes(q)) hits.push({title: sec.title, ch: ch.chapter, preview: `Ch${ch.chapter} · ${sec.id}`});
        });
      });
      results.innerHTML = hits.length ? hits.slice(0,8).map(h =>
        `<div class="px-3 py-2 cursor-pointer border-b border-outline-variant last:border-0 hover:bg-surface-container text-sm" onclick="navigate('chapter-${h.ch}'); results.classList.add('hidden'); input.value=''">
          <div class="font-medium">📖 ${h.title}</div>
          <div class="text-xs text-on-surface-variant">${h.preview}</div>
        </div>`
      ).join('') : '<div class="px-3 py-2 text-sm text-on-surface-variant">No results</div>';
      results.classList.remove('hidden');
    }, 300);
  });
  input.addEventListener('blur', () => setTimeout(() => results.classList.add('hidden'), 200));
}

// ===== INIT =====
function init() {
  buildSidebar();
  renderHomePage();
  initSearch();
  handleRoute();
  console.log(`✅ CT-AI Academy: ${SYLLABUS_DATA.length} chapters, ${QUESTIONS_DATA.length} questions`);
}

// Globals
window.navigate = navigate; window.setActiveNav = setActiveNav;
window.onQuizChange = onQuizChange; window.submitQuiz = submitQuiz; window.retryQuiz = retryQuiz;
window.toggleFlag = toggleFlag;
window.showQuickPractice = showQuickPractice;
window.toggleBilingualPdf = toggleBilingualPdf;
window.renderFullExam = renderFullExam; window.submitFullExam = submitFullExam; window.retryFullExam = retryFullExam;
window.onExamChange = onExamChange; window.toggleExamFlag = toggleExamFlag;
window.resumeLearning = resumeLearning;
window.resetProgress = resetProgress;
window.showCourseSelector = showCourseSelector;
window.selectCourse = selectCourse;

document.addEventListener('DOMContentLoaded', init);
