// CT-AI Academy - Study Application
// Design: Academic, Precise, Future-Proof

const AppState = { currentPage: 'home', currentChapter: null };

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

function resumeLearning() {
  const lastCh = getLastVisitedChapter();
  navigate('chapter-' + lastCh);
}

const CHAPTER_SUMMARIES = {
  1: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. AI-Based vs Conventional Systems (AI-1.1.1)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Design:</span> Conventional → explicit instructions (if-then-else). AI → learns patterns from data.</p><p class="text-green-700 text-xs -mt-1">• Thiết kế: Truyền thống dùng mệnh lệnh rõ ràng. AI phân tích mẫu từ dữ liệu.</p>'
    + '<p><span class="text-blue-600 font-medium">• Behavior:</span> Conventional → deterministic, predictable. AI → probabilistic, non-deterministic.</p><p class="text-green-700 text-xs -mt-1">• Hành vi: Truyền thống xác định, AI dựa trên xác suất.</p>'
    + '<p><span class="text-blue-600 font-medium">• Explainability:</span> AI (DL) is a "black box", hard to interpret.</p><p class="text-green-700 text-xs -mt-1">• Tính giải thích: AI thường là hộp đen.</p>'
    + '<p><span class="text-blue-600 font-medium">• Adaptability:</span> Conventional is static. AI is self-learning, improves continuously.</p><p class="text-green-700 text-xs -mt-1">• Khả năng thích ứng: AI tự học và cải thiện liên tục.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. Levels of AI (AI-1.1.2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Narrow AI:</span> Specific tasks (face recognition, translation). The only AI deployed today.</p><p class="text-green-700 text-xs -mt-1">• AI hẹp: Nhiệm vụ cụ thể. Loại duy nhất đang triển khai.</p>'
    + '<p><span class="text-blue-600 font-medium">• General AI:</span> Human-level intelligence. Not yet achieved.</p><p class="text-green-700 text-xs -mt-1">• AI tổng quát: Như con người. Chưa có.</p>'
    + '<p><span class="text-blue-600 font-medium">• Super AI:</span> Surpasses human intelligence. Technological singularity.</p><p class="text-green-700 text-xs -mt-1">• Siêu trí tuệ: Vượt xa con người. Điểm kỳ dị.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. AI Technologies (AI-1.1.3)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• ML:</span> Supervised, Unsupervised, Reinforcement Learning.</p><p class="text-green-700 text-xs -mt-1">• ML: Học có giám sát, không giám sát, tăng cường.</p>'
    + '<p><span class="text-blue-600 font-medium">• DL:</span> CNN (images), RNN (sequences), Transformers (LLMs).</p><p class="text-green-700 text-xs -mt-1">• DL: Học sâu với CNN, RNN, Transformers.</p>'
    + '<p><span class="text-blue-600 font-medium">• Others:</span> NLP, Computer Vision, Fuzzy Logic, Expert Systems, Agentic AI.</p><p class="text-green-700 text-xs -mt-1">• Công nghệ khác: NLP, thị giác máy tính, logic mờ...</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">4. Generative AI (GenAI) (AI-1.1.4)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Creates new content (text, images, audio) from training data. Uses GANs, Diffusion models, Transformers + Foundation Models + fine-tuning.</p><p class="text-green-700 text-xs -mt-1">Tạo nội dung mới từ dữ liệu huấn luyện.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Hardware & Hosting (AI-1.1.5, AI-1.1.6)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Hardware:</span> GPU > CPU for ML. ASIC for edge. Quantization for speed.</p><p class="text-green-700 text-xs -mt-1">• GPU vượt trội CPU cho ML. ASIC cho edge computing.</p>'
    + '<p><span class="text-blue-600 font-medium">• Hosting:</span> Local (privacy, control) vs Cloud (scalable, AIaaS).</p><p class="text-green-700 text-xs -mt-1">• Local (riêng tư) vs Cloud (linh hoạt).</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">6. ML Frameworks (AI-1.1.7)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Data processing → Model building → Training → Evaluation → Deployment. Low-level vs High-level APIs.</p><p class="text-green-700 text-xs -mt-1">Xử lý dữ liệu → Xây dựng → Huấn luyện → Đánh giá → Triển khai.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">7. Regulations & Standards (AI-1.1.8)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• EU AI Act:</span> Risk-based approach. High-risk systems require strict testing.</p><p class="text-green-700 text-xs -mt-1">• Tiếp cận dựa trên rủi ro. Hệ thống rủi ro cao kiểm thử nghiêm ngặt.</p>'
    + '<p><span class="text-blue-600 font-medium">• ISO/IEC TR 29119-11:</span> AI testing guidelines.</p><p class="text-green-700 text-xs -mt-1">• Hướng dẫn kiểm thử hệ thống AI.</p>'
    + '</div>',

  2: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. AI-Specific Quality Characteristics (AI-2.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• AI Functional Correctness:</span> Cannot guarantee 100% accuracy (probabilistic). Evaluated via acceptable thresholds.</p><p class="text-green-700 text-xs -mt-1">• Tính đúng đắn chức năng AI: Không thể đảm bảo 100%, đánh giá qua ngưỡng.</p>'
    + '<p><span class="text-blue-600 font-medium">• Functional Adaptability:</span> System adapts to changing operational environment after deployment.</p><p class="text-green-700 text-xs -mt-1">• Khả năng thích ứng: Tự thích nghi với môi trường thay đổi.</p>'
    + '<p><span class="text-blue-600 font-medium">• User Controllability:</span> Humans can intervene in system operation.</p><p class="text-green-700 text-xs -mt-1">• Kiểm soát người dùng: Con người có thể can thiệp.</p>'
    + '<p><span class="text-blue-600 font-medium">• Transparency:</span> Appropriate info about AI system conveyed to stakeholders.</p><p class="text-green-700 text-xs -mt-1">• Tính minh bạch: Thông tin phù hợp đến các bên liên quan.</p>'
    + '<p><span class="text-blue-600 font-medium">• AI Robustness:</span> Maintains correctness under adversarial, biased or invalid data.</p><p class="text-green-700 text-xs -mt-1">• Độ tin cậy: Duy trì đúng đắn khi gặp dữ liệu tấn công/sai lệch.</p>'
    + '<p><span class="text-blue-600 font-medium">• Intervenability:</span> Operators can intervene to prevent harm/risk (sub-characteristic of security).</p><p class="text-green-700 text-xs -mt-1">• Khả năng can thiệp: Người vận hành can thiệp kịp thời.</p>'
    + '<p><span class="text-blue-600 font-medium">• Societal & Ethical Risk Mitigation:</span> Fairness, non-discrimination, privacy, accountability.</p><p class="text-green-700 text-xs -mt-1">• Giảm thiểu rủi ro đạo đức: Công bằng, không phân biệt, riêng tư.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. AI & Safety (AI-2.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Specifications:</span> AI goals are often vague, defined implicitly via training data (hard to trace).</p><p class="text-green-700 text-xs -mt-1">• Đặc tả: Mục tiêu AI thường mơ hồ, khó truy xuất.</p>'
    + '<p><span class="text-blue-600 font-medium">• Non-determinism:</span> Random factors/small input changes can cause unexpected outputs.</p><p class="text-green-700 text-xs -mt-1">• Tính không xác định: Đầu vào thay đổi nhỏ → đầu ra bất ngờ.</p>'
    + '<p><span class="text-blue-600 font-medium">• Self-learning:</span> Systems change behavior over time → pre-deployment tests become outdated. Need safety guards.</p><p class="text-green-700 text-xs -mt-1">• Tự học: Hành vi thay đổi, cần chốt chặn an toàn.</p>'
    + '<p><span class="text-blue-600 font-medium">• Explainability:</span> Hard to understand AI decisions. LIME helps but may impact performance.</p><p class="text-green-700 text-xs -mt-1">• Tính giải thích: Khó hiểu quyết định AI. LIME hỗ trợ nhưng ảnh hưởng hiệu suất.</p>'
    + '<p><span class="text-blue-600 font-medium">• Regulations:</span> EU AI Act classifies AI in safety components as high-risk.</p><p class="text-green-700 text-xs -mt-1">• EU AI Act: AI trong thành phần an toàn là rủi ro cao.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. Acceptance Criteria for AI (AI-2.2.1 - K2)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Correctness:</span> Accuracy 95% for image recognition.</p><p class="text-green-700 text-xs -mt-1">• Đúng đắn: Độ chính xác 95%.</p>'
    + '<p><span class="text-blue-600 font-medium">• Adaptability:</span> Adapt within 20s when altitude threshold exceeded.</p><p class="text-green-700 text-xs -mt-1">• Thích ứng: Thích nghi trong 20 giây.</p>'
    + '<p><span class="text-blue-600 font-medium">• Controllability:</span> Override drone within 0.5s when GPS lost.</p><p class="text-green-700 text-xs -mt-1">• Kiểm soát: Chiếm quyền drone trong 0.5 giây.</p>'
    + '<p><span class="text-blue-600 font-medium">• Robustness:</span> Switch to low-power mode when temp > 85°C.</p><p class="text-green-700 text-xs -mt-1">• Tin cậy: Chuyển chế độ thấp khi nhiệt >85°C.</p>'
    + '<p><span class="text-blue-600 font-medium">• Ethics:</span> No discrimination between ethnic groups (sentencing AI).</p><p class="text-green-700 text-xs -mt-1">• Đạo đức: Không phân biệt sắc tộc.</p>'
    + '<p><span class="text-blue-600 font-medium">• Safety:</span> 99.9% accuracy of input-output mapping (nuclear plant).</p><p class="text-green-700 text-xs -mt-1">• An toàn: Ánh xạ đầu vào-đầu ra với độ chính xác 99.9%.</p>'
    + '<p class="text-yellow-700 font-medium mt-2">⚠️ Key: AI acceptance criteria are statistical/threshold-based, not binary pass/fail.</p>'
    + '<p class="text-green-700 text-xs -mt-1">⚠️ Quan trọng: Tiêu chí chấp nhận cho AI là xác suất, không phải đúng/sai tuyệt đối.</p>'
    + '</div>',

  3: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. Forms of Machine Learning (AI-3.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Supervised Learning:</span> Uses labeled data. <span class="italic">Classification</span> (e.g. spam detection) + <span class="italic">ML Regression</span> (e.g. stock price).</p><p class="text-green-700 text-xs -mt-1">• Học có giám sát: Dùng dữ liệu gán nhãn. Phân loại + Hồi quy.</p>'
    + '<p><span class="text-blue-600 font-medium">• Unsupervised Learning:</span> Finds patterns in unlabeled data. <span class="italic">Clustering</span> (grouping) + <span class="italic">Association</span> (relationships).</p><p class="text-green-700 text-xs -mt-1">• Học không giám sát: Tìm mẫu trong dữ liệu không nhãn. Phân cụm + Hiệp hội.</p>'
    + '<p><span class="text-blue-600 font-medium">• Reinforcement Learning:</span> Agent learns via trial-and-error (reward/penalty) interacting with environment.</p><p class="text-green-700 text-xs -mt-1">• Học tăng cường: Tác tử học qua thử-và-sai với phần thưởng/hình phạt.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. ML Workflow (AI-3.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Understand goals</span> → <span class="text-blue-600 font-medium">Choose Framework</span> → <span class="text-blue-600 font-medium">Select Algorithm</span> → <span class="text-blue-600 font-medium">Prepare & Test Data</span></p>'
    + '<p class="text-green-700 text-xs -mt-1">Hiểu mục tiêu → Chọn Framework → Chọn thuật toán → Chuẩn bị dữ liệu</p>'
    + '<p><span class="text-blue-600 font-medium">• Model Generation:</span> Train → Evaluate → Tune (iterative).</p><p class="text-green-700 text-xs -mt-1">• Tạo mô hình: Huấn luyện → Đánh giá → Tinh chỉnh.</p>'
    + '<p><span class="text-blue-600 font-medium">• Test Model</span> (with holdout dataset) → <span class="text-blue-600 font-medium">Deploy</span> → <span class="text-blue-600 font-medium">Monitor</span> (detect drift).</p><p class="text-green-700 text-xs -mt-1">Kiểm thử → Triển khai → Giám sát (phát hiện trôi dạt).</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. Pretrained Models, Fine-tuning & RAG (AI-3.1.4 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Pretrained Model:</span> Trained on massive data, reusable to save time.</p><p class="text-green-700 text-xs -mt-1">• Mô hình huấn luyện sẵn: Tiết kiệm thời gian, tái sử dụng.</p>'
    + '<p><span class="text-blue-600 font-medium">• Fine-tuning:</span> Additional training on domain-specific data.</p><p class="text-green-700 text-xs -mt-1">• Tinh chỉnh: Huấn luyện thêm trên dữ liệu đặc thù.</p>'
    + '<p><span class="text-blue-600 font-medium">• RAG:</span> External data sources retrieved for LLM, improves accuracy without modifying the model.</p><p class="text-green-700 text-xs -mt-1">• RAG: Truy xuất nguồn ngoài giúp LLM trả lời chính xác hơn.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">4. Data Preparation (AI-3.2.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Acquisition:</span> Collect from sources, label for supervised learning.</p><p class="text-green-700 text-xs -mt-1">• Thu thập: Tập hợp từ nhiều nguồn, gán nhãn.</p>'
    + '<p><span class="text-blue-600 font-medium">• Preprocessing:</span> Clean (dedup, outliers), normalize, augment data.</p><p class="text-green-700 text-xs -mt-1">• Tiền xử lý: Làm sạch, chuẩn hóa, tăng cường dữ liệu.</p>'
    + '<p><span class="text-blue-600 font-medium">• Feature Engineering:</span> Select & extract important features to improve performance.</p><p class="text-green-700 text-xs -mt-1">• Kỹ thuật đặc trưng: Chọn thuộc tính quan trọng nhất.</p>'
    + '<p><span class="text-blue-600 font-medium">• EDA:</span> Use charts to understand trends, detect anomalies.</p><p class="text-green-700 text-xs -mt-1">• Phân tích khám phá: Biểu đồ hiểu xu hướng, phát hiện bất thường.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Training, Validation & Test Datasets (AI-3.2.3 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Training:</span> Used to train the model.</p><p class="text-green-700 text-xs -mt-1">• Tập huấn luyện: Dùng để huấn luyện mô hình.</p>'
    + '<p><span class="text-blue-600 font-medium">• Validation:</span> Evaluate & tune hyperparameters.</p><p class="text-green-700 text-xs -mt-1">• Tập xác thực: Đánh giá & tinh chỉnh siêu tham số.</p>'
    + '<p><span class="text-blue-600 font-medium">• Test (holdout):</span> Final independent testing of the model.</p><p class="text-green-700 text-xs -mt-1">• Tập kiểm thử: Kiểm thử mô hình cuối độc lập.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">6. Neural Networks (AI-3.4.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Structure:</span> Input layer → Hidden layers (neurons with weights & bias) → Output layer. Activation functions.</p><p class="text-green-700 text-xs -mt-1">• Cấu trúc: Lớp đầu vào → Lớp ẩn (neuron với trọng số & bias) → Lớp đầu ra.</p>'
    + '<p><span class="text-blue-600 font-medium">• Learning:</span> Error (loss) backpropagated to adjust weights & bias, minimizing error.</p><p class="text-green-700 text-xs -mt-1">• Học: Lỗi phản hồi ngược để điều chỉnh trọng số.</p>'
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
    + '<p><span class="text-blue-600 font-medium">• Locked System:</span> Fixed behavior after deployment, deterministic, easier to test.</p><p class="text-green-700 text-xs -mt-1">• Hệ thống Khóa: Hành vi cố định sau triển khai, dễ kiểm thử.</p>'
    + '<p><span class="text-blue-600 font-medium">• Adaptive System:</span> Continues learning from new data post-deployment, behavior changes unpredictably.</p><p class="text-green-700 text-xs -mt-1">• Hệ thống Thích ứng: Tiếp tục học, hành vi khó dự đoán.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. Statistical Approach in AI Testing (AI-4.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>AI models are probabilistic → traditional deterministic methods insufficient. Evaluate performance distribution across scenarios.</p><p class="text-green-700 text-xs -mt-1">Mô hình AI xác suất → cần đánh giá phân phối hiệu suất, không chỉ đúng/sai.</p>'
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
    + '<p><span class="text-blue-600 font-medium">• Methods:</span> Black-box evaluation, benchmarks, exploratory testing.</p><p class="text-green-700 text-xs -mt-1">• Phương pháp: Đánh giá hộp đen, bộ chuẩn, kiểm thử khám phá.</p>'
    + '<p><span class="text-blue-600 font-medium">• Red Teaming (K3):</span> Simulate adversarial attacks to find security flaws, harmful content, bias in GenAI.</p><p class="text-green-700 text-xs -mt-1">• Đội đỏ: Mô phỏng tấn công tìm lỗ hổng bảo mật, nội dung độc hại.</p>'
    + '<p><span class="text-blue-600 font-medium">• Challenges:</span> Context windows, adjustable model parameters.</p><p class="text-green-700 text-xs -mt-1">• Thách thức: Cửa sổ ngữ cảnh, tham số có thể điều chỉnh.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Test Levels for ML Systems (AI-4.3.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• ML-specific:</span> Input data testing, ML model testing.</p><p class="text-green-700 text-xs -mt-1">• Cấp độ chuyên biệt: Kiểm thử dữ liệu đầu vào, kiểm thử mô hình.</p>'
    + '<p><span class="text-blue-600 font-medium">• Traditional:</span> Component, integration, system, acceptance (still important for non-AI parts).</p><p class="text-green-700 text-xs -mt-1">• Cấp độ truyền thống: Kiểm thử thành phần, tích hợp, hệ thống.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">6. Risk-based Testing for MLS (AI-4.3.2 - K2)</strong></div>'
    + '<div class="pl-3 text-sm space-y-1.5">'
    + '<p>Focus resources on highest ML risks: biased training data, data pipeline errors, unrepresentative data.</p><p class="text-green-700 text-xs -mt-1">Tập trung kiểm thử vào rủi ro ML cao nhất: dữ liệu sai lệch, lỗi pipeline.</p>'
    + '<p class="text-yellow-700 font-medium mt-2">⚠️ Key: Understand why traditional testing is insufficient for AI. Red Teaming is K3 — can apply in scenarios.</p>'
    + '<p class="text-green-700 text-xs -mt-1">⚠️ Quan trọng: Red Teaming là K3 duy nhất trong chương — nhớ cách vận dụng.</p>'
    + '</div>',

  5: '<div class="mb-2 border-b border-blue-100 pb-1"><span class="text-xs font-bold text-blue-500 uppercase tracking-wider">ENGLISH</span> <span class="text-xs text-blue-400">/</span> <span class="text-xs font-bold text-green-600 uppercase tracking-wider">TIẾNG VIỆT</span></div>'
    + '<div class="mb-2"><strong class="text-blue-700">1. Input Data Risks & Mitigations (AI-5.1.1 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Biased training data →</span> Testing for bias.</p><p class="text-green-700 text-xs -mt-1">• Dữ liệu sai lệch → Kiểm thử sai lệch.</p>'
    + '<p><span class="text-blue-600 font-medium">• Unreliable sources →</span> Data provenance testing.</p><p class="text-green-700 text-xs -mt-1">• Nguồn không tin cậy → Kiểm thử nguồn gốc.</p>'
    + '<p><span class="text-blue-600 font-medium">• Poisoned data →</span> A/B testing, EDA, Red teaming.</p><p class="text-green-700 text-xs -mt-1">• Dữ liệu bị đầu độc → A/B testing, Đội đỏ.</p>'
    + '<p><span class="text-blue-600 font-medium">• Inconsistent/wrong types →</span> Dataset constraint testing.</p><p class="text-green-700 text-xs -mt-1">• Không nhất quán → Kiểm thử ràng buộc tập dữ liệu.</p>'
    + '<p><span class="text-blue-600 font-medium">• Missing/unbalanced data →</span> Data representativeness testing.</p><p class="text-green-700 text-xs -mt-1">• Thiếu/mất cân bằng → Kiểm thử tính đại diện.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">2. Testing for Bias (AI-5.1.2 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Goal:</span> Detect systematic unfairness from data or algorithms.</p><p class="text-green-700 text-xs -mt-1">• Mục tiêu: Phát hiện sự bất công hệ thống.</p>'
    + '<p><span class="text-blue-600 font-medium">• Key technique:</span> Disparate impact analysis — AI-specific fairness assessment.</p><p class="text-green-700 text-xs -mt-1">• Kỹ thuật: Phân tích tác động khác biệt — đánh giá công bằng.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">3. Data Pipeline Testing (AI-5.1.3 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Design review</span> → <span class="text-blue-600 font-medium">Component testing</span> (ingestion, transformation, sensors).</p><p class="text-green-700 text-xs -mt-1">• Review thiết kế → Kiểm thử thành phần nhập dữ liệu, chuyển đổi.</p>'
    + '<p><span class="text-blue-600 font-medium">• Check:</span> Transformation logic, validation rules, error handling, security vulnerabilities.</p><p class="text-green-700 text-xs -mt-1">• Kiểm tra: Logic chuyển đổi, xử lý lỗi, bảo mật.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">4. Data Representativeness Testing (AI-5.1.4 - K2)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p><span class="text-blue-600 font-medium">• Goal:</span> Assess similarity between training/test data and production data.</p><p class="text-green-700 text-xs -mt-1">• Mục tiêu: Đánh giá tương đồng với dữ liệu thực tế.</p>'
    + '<p><span class="text-blue-600 font-medium">• Methods:</span> EDA (charts), Chi-squared, Kolmogorov-Smirnov tests, continuous monitoring for Data drift.</p><p class="text-green-700 text-xs -mt-1">• Phương pháp: EDA, kiểm tra thống kê, giám sát trôi dạt.</p>'
    + '</div>'
    + '<div class="mb-2"><strong class="text-blue-700">5. Dataset Constraint Testing (AI-5.1.5 - K3)</strong></div>'
    + '<div class="pl-3 mb-3 text-sm space-y-1.5">'
    + '<p>Check data against predefined rules (like DB schema). Single-value checks (type, range) and cross-value consistency. Must be automated due to large dataset size.</p><p class="text-green-700 text-xs -mt-1">Kiểm tra dữ liệu theo quy tắc (như schema DB). Phải tự động hóa.</p>'
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
    + '<p><span class="text-blue-600 font-medium">• Functional risks:</span> Bias, overfitting, adversarial vulnerabilities.</p><p class="text-green-700 text-xs -mt-1">• Rủi ro chức năng: Sai lệch, quá khớp, lỗ hổng đối nghịch.</p>'
    + '<p><span class="text-blue-600 font-medium">• Non-functional risks:</span> Lack of robustness, performance issues.</p><p class="text-green-700 text-xs -mt-1">• Rủi ro phi chức năng: Thiếu độ tin cậy, hiệu suất.</p>'
    + '<p><span class="text-blue-600 font-medium">• Mitigations:</span> Adversarial/Fuzz testing → Robustness. Back-to-back → Update errors. A/B → Performance drop. Red teaming → Harmful output.</p><p class="text-green-700 text-xs -mt-1">• Giảm thiểu: Adversarial, Back-to-back, A/B, Red teaming.</p>'
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
    + '<p>Solves the oracle problem. Creates <span class="italic">follow-up</span> test cases from a <span class="italic">source</span> case using <span class="italic">Metamorphic Relations (MR)</span>.</p><p class="text-green-700 text-xs -mt-1">Giải quyết vấn đề bộ máy kiểm thử. Dùng Quan hệ biến đổi (MR).</p>'
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

  if (hash === 'home') {
    document.getElementById('page-home').classList.add('active');
    document.querySelector('.nav-link[href="#home"]')?.classList.add('border-secondary', 'text-secondary');
    AppState.currentPage = 'home'; AppState.currentChapter = null;
    renderHomePage(); return;
  }
  const cm = hash.match(/^chapter-(\d+)$/);
  const qm = hash.match(/^quiz-(\d+)$/);
  if (cm) {
    document.getElementById('page-chapter').classList.add('active');
    document.querySelector('.nav-link[href="#chapter-1"]')?.classList.add('border-secondary', 'text-secondary');
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
  const themes = [
    { gradient: 'linear-gradient(135deg, #1e1b4b, #3730a3, #312e81)', icon: 'psychology', accent: '#c084fc', tag: 'Fundamentals' },
    { gradient: 'linear-gradient(135deg, #064e3b, #047857, #065f46)', icon: 'verified', accent: '#34d399', tag: 'Quality' },
    { gradient: 'linear-gradient(135deg, #7c2d12, #9a3412, #c2410c)', icon: 'neurology', accent: '#fb923c', tag: 'Algorithms' },
    { gradient: 'linear-gradient(135deg, #0c4a6e, #075985, #0e7490)', icon: 'bug_report', accent: '#38bdf8', tag: 'Testing' },
    { gradient: 'linear-gradient(135deg, #4c1d95, #6d28d9, #7c3aed)', icon: 'database', accent: '#a78bfa', tag: 'Data' },
    { gradient: 'linear-gradient(135deg, #831843, #9d174d, #be185d)', icon: 'model_training', accent: '#f472b6', tag: 'Model' },
    { gradient: 'linear-gradient(135deg, #164e63, #155e75, #0e7490)', icon: 'developer_mode', accent: '#22d3ee', tag: 'DevOps' }
  ];
  grid.innerHTML = SYLLABUS_DATA.map(ch => {
    const t = themes[ch.chapter - 1] || themes[0];
    const qs = QUESTIONS_DATA.filter(q => q.chapter === ch.chapter).length;
    return `<div class="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden cursor-pointer hover:border-[${t.accent}] hover:shadow-lg transition-all duration-300 group" onclick="navigate('chapter-${ch.chapter}')">
      <div class="h-28 relative overflow-hidden flex items-center justify-center" style="background:${t.gradient}">
        <!-- Decorative glow blobs -->
        <div class="absolute w-24 h-24 rounded-full opacity-25" style="background:${t.accent};top:-30px;right:-10px;filter:blur(28px)"></div>
        <div class="absolute w-20 h-20 rounded-full opacity-15" style="background:white;bottom:-25px;left:-15px;filter:blur(20px)"></div>
        <div class="absolute w-12 h-12 rounded-full opacity-20" style="background:${t.accent};bottom:5px;right:15px;filter:blur(16px)"></div>
        <!-- Icon -->
        <span class="material-symbols-outlined relative z-10 text-white/85 transition-transform duration-300 group-hover:scale-110" style="font-size:46px;font-variation-settings:'FILL'1">${t.icon}</span>
        <!-- Tag label -->
        <span class="absolute bottom-1.5 left-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">${t.tag}</span>
      </div>
      <div class="p-4">
        <h4 class="font-semibold text-base mb-0.5">${ch.chapter}. ${ch.title}</h4>
        <p class="text-sm text-on-surface-variant">${ch.learningObjectives.length} learning objectives</p>
        <div class="flex justify-between items-center mt-3 text-xs">
          <span>⏱ ${getDuration(ch.chapter)}</span>
          <span class="font-medium" style="color:${t.accent}">${qs} questions →</span>
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

  let html = '<div class="mb-5 pb-4 border-b border-outline-variant">'
    + '<span class="text-caption font-caption text-secondary font-semibold tracking-wider">CHAPTER ' + n + ' · ' + getDuration(n) + '</span>'
    + '<h1 class="font-display text-2xl md:text-3xl font-bold mt-1">' + ch.title + '</h1>'
    + '<div class="flex gap-4 mt-2 text-sm text-on-surface-variant">'
    + '<span>📄 ' + (pageMap[n] ? 'From page ' + pageMap[n] : '') + '</span>'
    + '<span>❓ ' + qs + ' quiz questions</span></div></div>';

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

document.addEventListener('DOMContentLoaded', init);
