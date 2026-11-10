// The styling fork is export-only; imports must use the patched reader.
if (window.XLSX) XLSX.read = XLSX.readFile = XLSX.readFileSync = () => { throw new Error(ui('Excel 匯入請使用內嵌的新版讀取元件。')); };
let language = 'zh-TW';
try { if (localStorage.getItem('ezrehab-language') === 'en') language = 'en'; } catch (_) {}
const UI_EN = {
  "模式說明": "Mode details",
  "模式說明網址": "Mode documentation URL",
  "複製網址": "Copy URL",
  "關閉視窗": "Close",
  "網址已複製": "URL copied",
  "此程式不會開啟外部網站。若需要線上說明，請自行複製以下網址。": "This app does not open external websites. Copy this URL if you need the online documentation.",
  "Excel 匯出元件無法使用，請重新開啟完整的 EzEMR.html。": "The embedded Excel exporter is unavailable. Reopen the complete EzEMR.html file.",
  "基本資料欄位…": "Profile fields...",
  "基本資料欄位": "Profile fields",
  "勾選的欄位為所有病人的必填資料；未勾選的欄位不必填寫，既有內容會保留。": "Checked fields are required for every patient. Unchecked fields are hidden; existing values are retained.",
  "套用於目前病歷資料夾的所有病人。": "Applies to every patient in this record folder.",
  "套用於此瀏覽器的所有病人。": "Applies to every patient stored in this browser.",
  "儲存設定": "Save settings",
  "取消設定": "Cancel",
  "基本資料設定已儲存": "Profile settings saved",
  "無法儲存基本資料設定：{0}": "Unable to save profile settings: {0}",
  "身分證字號": "National ID number",
  "性別": "Sex",
  "女性": "Female",
  "男性": "Male",
  "不詳": "Unknown",
  "抽菸習慣": "Smoking",
  "飲酒習慣": "Alcohol use",
  "嚼檳榔習慣": "Betel nut use",
  "從不": "Never",
  "目前有": "Current",
  "以前有": "Former",
  "職業": "Occupation",
  "宗教": "Religion",
  "慢性病": "Chronic conditions",
  "聯絡電話": "Phone",
  "聯絡地址": "Address",
  "過敏史": "Allergies",
  "未具名個案 {0}": "Unnamed client {0}",
  "基本資料未齊全": "Incomplete profile",
  "尚缺：{0}": "Missing: {0}",
  "補齊資料": "Complete profile",
  "請先補齊必填基本資料。": "Complete the required profile fields first.",
  "基本資料": "Profile",
  "必填欄位": "Required fields",
  "請填寫{0}": "Enter {0}",
  "基本資料欄位設定格式錯誤": "Invalid basic-profile field settings",
  "個案基本資料欄位格式錯誤": "Invalid client profile field data",
  "個案識別碼": "Client identifier",
  "編輯資料": "Edit details",
  "開啟紀錄": "Open record",
  "匯出表單": "Export form",
  "匯出檔案": "Export files",
  "CSV 與 PDF": "CSV and PDF",
  "刪除紀錄": "Delete record",
  "新增紀錄": "New record",
  "搜尋個案": "Find a client",
  "搜尋結果": "Search results",
  "各測驗症狀分數": "Symptom scores by test",
  "COPM 評分摘要": "COPM rating summary",
  "改約": "Rescheduled",
  "原因": "Reason",
  "通知": "Notified",
  "恢復時間": "Recovery time",
  "EyeDot 次數": "EyeDot trials",
  "找到 {0} 位個案": "Matches: {0}",
  "顯示前 {0} 筆，共 {1} 筆；請縮小搜尋範圍。": "Showing {0} of {1} matches. Refine your search.",
  "病史與基本資料": "History and details",
  "本次狀態": "Visit status",
  "最近出席": "Latest attended visit",
  "歷次紀錄": "Previous visit",
  "症狀與功能": "Symptoms and function",
  "推理與依據": "Reasoning and evidence",
  "介入與計畫": "Interventions and plan",
  "症狀分數": "Symptom scores",
  "本次變化": "Visit change",
  "分數越低，症狀越少": "Lower scores indicate fewer symptoms",
  "尚未逐項連結": "No symptom links recorded",
  "最近一次紀錄為缺席：{0}": "Latest record was an absence: {0}",
  "尚無出席紀錄": "No attended visits",
  "新增紀錄，開始整理症狀、推理與處置。": "Add a record to document symptoms, reasoning and interventions.",
  "滿意度": "Satisfaction",
  "病人總覽": "Patient dashboard",
  "主要症狀與功能困難": "Main symptoms and functional difficulties",
  "臨床推理與依據": "Clinical reasoning and evidence",
  "介入處置": "Interventions",
  "症狀、推理與介入連結": "Link symptoms, reasoning and interventions",
  "每項症狀各自連結推理、評估依據與介入處置。": "Link each symptom to its reasoning, assessment evidence and interventions.",
  "新增症狀連結": "Add symptom link",
  "移除症狀連結 {0}": "Remove symptom link {0}",
  "症狀連結 {0}": "Symptom link {0}",
  "主要症狀／功能困難": "Main symptom / functional difficulty",
  "記錄病人的症狀或受影響的日常活動": "Describe the symptom or affected daily activity",
  "症狀分類": "Symptom category",
  "推理面向": "Reasoning domains",
  "針對此症狀的臨床推理": "Clinical reasoning for this symptom",
  "說明評估發現如何影響個人、環境與作業的契合": "Explain how findings affect the fit between person, environment and occupation",
  "連結本次評估": "Link assessments from this record",
  "其他依據與觀察": "Other evidence and observations",
  "記錄主訴、觀察、來源日期或推理依據": "Record complaints, observations, source dates or supporting evidence",
  "選擇介入處置": "Select interventions",
  "此症狀的處置內容與目標": "Intervention details and goals for this symptom",
  "記錄實際處置、劑量、居家安排或待確認的計畫": "Record treatment, dose, home practice or plans awaiting confirmation",
  "已選 {0} 項": "{0} selected",
  "尚未建立症狀連結。新增一項，記錄它的推理與處置。": "No symptom links yet. Add one to document its reasoning and interventions.",
  "尚未填寫推理": "Reasoning not documented",
  "尚未連結評估依據": "No assessment evidence linked",
  "尚未記錄介入處置": "Interventions not documented",
  "本次未勾選施測": "Not marked as assessed in this record",
  "尚未填寫結果": "No results recorded",
  "本次紀錄找不到此評估": "Assessment not found in this record",
  "其他服務型態的已選處置會保留。": "Selected interventions from other service modes are retained.",
  "選擇服務型態後，顯示對應處置；既有選項仍保留。": "Choose a service mode to show its interventions; existing selections are retained.",
  "本次紀錄": "Record shown",
  "僅顯示所選日期的紀錄，不混合不同次的推理與依據。": "Shows the selected record only, keeping reasoning and evidence from the same visit together.",
  "尚無可顯示的復健紀錄。新增紀錄，開始整理症狀、推理與處置。": "No rehabilitation record to show yet. Add a record to document symptoms, reasoning and interventions.",
  "本次未建立逐項連結。下方依原有欄位呈現，請開啟紀錄補上症狀、推理與處置的關係。": "This record has no individual links. The original fields are shown below; open the record to link symptoms, reasoning and interventions.",
  "開啟此筆紀錄": "Open this record",
  "本次量化與評估摘要": "Measures and assessment findings from this record",
  "症狀評分摘要": "Symptom ratings",
  "尚未填寫症狀評分": "No symptom ratings recorded",
  "尚無已勾選的評估結果": "No assessments marked as completed",
  "尚未填寫主要症狀": "Main symptoms not documented",
  "來源紀錄": "Source record",
  "症狀連結最多 100 項。": "A record can contain up to 100 symptom links.",
  "眼球動作訓練（Sol）": "Oculomotor training (Sol)",
  "視覺知覺": "Visual perception",
  "紙本視覺練習": "Paper-based visual exercises",
  "眼球動作訓練（Tobii／網路攝影機）": "Oculomotor training (Tobii / webcam)",
  "視覺處理訓練": "Visual processing training",
  "居家視覺練習模組": "Home-based practice modules",
  "視覺功能": "Visual function",
  "依面對病人的方向排列；雙眼的左、右以病人為準。可填角度或質性描述，空白代表未記錄。": "Arranged as you face the patient; binocular left and right follow the patient's perspective. Enter degrees or a qualitative description. Blank means not recorded.",
  "功能性視覺": "Functional vision",
  "分類": "Category",
  "評估分類必須為視覺功能或功能性視覺。": "Assessment category must be visual function or functional vision.",
  "服務型態": "Service mode",
  "   服務型態：": "   Service mode: ",
  "面對面": "In-person",
  "遠距復健": "Telerehab",
  "未指定": "Not specified",
  "服務型態格式錯誤": "Invalid service mode",
  "PEO 架構欄位格式錯誤": "Invalid PEO framework fields",
  "介入策略欄位格式錯誤": "Invalid intervention strategy fields",
  "臨床連結欄位格式錯誤": "Invalid clinical link fields",
  "評估": "Assessment",
  "PEO 臨床推理": "PEO clinical reasoning",
  "依據評估結果進行介入規劃": "Assessment findings guide intervention planning",
  "個人": "Person",
  "環境": "Environment",
  "作業": "Occupation",
  "視覺功能、症狀、個人因素": "Visual function, symptoms, personal factors",
  "居家、工作、數位環境、照明與設備": "Home, work, digital environments, lighting and equipment",
  "日常作業表現、參與需求、COPM 目標": "Daily task performance, participation needs, COPM goals",
  "臨床判斷與介入規劃": "Clinical judgement and intervention planning",
  "介入與計畫": "Intervention and plan",
  "以 PEO 架構為指引": "Guided by the PEO Framework",
  "復能": "Remediation",
  "調適": "Adaptation",
  "代償": "Compensation",
  "調適備註": "Adaptation notes",
  "代償備註": "Compensation notes",
  "O：評估": "O: Assessment",
  "A：PEO 臨床推理": "A: PEO clinical reasoning",
  "P：介入與計畫": "P: Intervention and plan",
  "Excel 匯入請使用內嵌的新版讀取元件。": "Use the embedded updated reader for Excel imports.",
  "Excel 匯入元件無法使用，請重新開啟完整的 EzEMR.html。": "The Excel import component is unavailable. Reopen the complete EzEMR.html file.",
  "目前顯示病歷副本。連接病歷資料夾後可讀取最新檔案並直接儲存。": "You are viewing a copy of the records. Connect the record folder to read the latest files and save changes directly.",
  "連接病歷資料夾": "Connect record folder",
  "病歷副本 · 尚未連接資料夾": "Record copy · Folder not connected",
  "這個資料夾沒有個案總表 clients.csv，瀏覽器中的紀錄尚未存入。請連接存放病歷的資料夾。": "This folder has no clients.csv roster, so the records kept in this browser were not saved. Connect the folder that holds your records.",
  "瀏覽器中的紀錄已存入病歷資料夾": "Records kept in this browser were saved to the record folder",
  "瀏覽器中的紀錄尚未存入病歷資料夾": "Records kept in this browser are not in the record folder yet",
  "以下個案的紀錄未能存入，仍保留在此瀏覽器，下次連接資料夾時會再試一次：": "These clients' records could not be saved. They stay in this browser and will be tried again the next time you connect the folder:",
  "每次開啟 EzEMR 都要先連接「{0}」。連接後，按「儲存」就會直接寫入該個案的資料夾，不會下載檔案。": "Each time you open EzEMR, connect \"{0}\" first. After that, Save writes straight into the client's folder; nothing is downloaded.",
  "此瀏覽器有先前在瀏覽器模式儲存的紀錄。連接病歷資料夾後會自動存入對應個案的資料夾；資料夾中較新的版本不會被覆蓋。": "This browser holds records saved in browser mode. Connecting the record folder saves them to each client's folder; newer versions already in the folder are kept.",
  "每次開啟 EzEMR 都要先連接病歷資料夾。連接後，按「儲存」就會直接寫入該個案的資料夾，不會下載檔案。": "Each time you open EzEMR, connect your record folder first. After that, Save writes straight into the client's folder; nothing is downloaded.",
  "這些個案不在此資料夾，紀錄未存入（已保留在瀏覽器備份）：": "These clients are not in this folder, so their records were not saved (kept in a browser backup):",
  "紀錄已存入：": "Record saved to: ",
  "。本次紀錄使用同名的 CSV、PDF 與 TXT。": ". This record uses matching CSV, PDF and TXT filenames.",
  "病歷號（新個案的資料夾名稱）": "Medical record number (folder name for a new client)",
  "觀察與客觀描述": "Observations and objective findings",
  "病歷工作區": "Clinical workspace",
  "個案資料、SOAP 病歷與復健進度，集中整理。": "Client details, SOAP notes and rehabilitation progress in one place.",
  "開始使用": "Getting started",
  "選擇適合您的儲存方式": "Choose where to keep your records",
  "本機資料夾結構": "Your local folder",
  "資料夾中的檔案可直接開啟、複製與備份。": "Open, copy and back up the files directly from your folder.",
  "從這裡開始記錄復健歷程。": "Start a rehabilitation record here.",
  "個案資料與病歷": "Clients and clinical notes",
  "建立個案、填寫 SOAP，將每次評估與訓練留在同一份歷程。": "Create a client and write SOAP notes to keep assessments and training together over time.",
  "症狀與進度": "Symptoms and progress",
  "比較復健前後的症狀評分，追蹤評估結果與出席紀錄。": "Compare symptom scores before and after sessions, and track assessment results and attendance.",
  "個案工作區": "Client workspace",
  "紀錄總數": "Total records",
  "最近紀錄": "Latest record",
  "尚無紀錄": "No records yet",
  "編輯個案資料": "Edit client details",
  "紀錄歷程": "Record history",
  "由新到舊排列": "Newest first",
  "編輯中": "Editing",
  "，0 至 10 分": ", 0 to 10",
  "，恢復時間": ", recovery time",
  "，相較": ", compared with",
  "，滿意度": ", satisfaction",
  "，總分": ", total",
  "；未完成的寫入已還原，請重試。": "; the incomplete write was rolled back. Please retry.",
  "；請檢查此筆 CSV 與 PDF 是否完整後重試。": "; check that this record's CSV and PDF are complete, then retry.",
  "：表現": ": performance",
  ".csv 與 .pdf": ".csv and .pdf",
  ".xlsx 至": ".xlsx to",
  "。本次紀錄使用同名的 CSV 與 PDF。": ". This record uses matching CSV and PDF filenames.",
  "。原有 JSON 病歷仍可讀取。": ". Legacy JSON records can still be read.",
  "。從既有模板開始，或建立空白項目。停用項目仍保留歷史結果；新增個案時可複用這份設定。": ". Start with an existing template or create a blank item. Disabled items retain their historical results. New clients can reuse these settings.",
  "。編輯、重新命名及刪除也會套用至副本。": ". Edits, renames, and deletions also apply to the copy.",
  "· 缺席": "- Absent",
  "· 基準與療程後評估；療程後分數與先前基準比較。": "- Baseline and post-rehabilitation assessments; post-rehabilitation scores are compared with the earlier baseline.",
  "· 第": "- Session ",
  "· 編輯復健紀錄": "- Editing rehabilitation record",
  "（副本）": " (copy)",
  "（與首次差異": " (change from first rating",
  "（選填）": " (optional)",
  "（職能活動）": " (occupation)",
  "」已存在，請使用不同的病歷號，以免混入其他人的資料。": "\" already exists. Use a different medical record number to keep clients' records separate.",
  "」已屬於其他個案，未匯入。": "\" belongs to another client and was not imported.",
  "」未更新：": "\" was not updated: ",
  "＋ 新增": "+ Add",
  "＋ 新增 EyeDot 紀錄": "+ Add EyeDot record",
  "＋ 新增手術紀錄": "+ Add surgery record",
  "＋ 新增恢復後評分": "+ Add recovery rating",
  "＋ 新增個案": "+ New client",
  "＋ 新增復健紀錄": "+ New rehabilitation record",
  "＋ 新增復健項目": "+ Add rehabilitation item",
  "＋ 新增評估項目": "+ Add assessment",
  "＋ 新增欄位": "+ Add field",
  "● 復健前": "Before session",
  "● 復健後": "After session",
  "1 分鐘": "1 minute",
  "2 分鐘": "2 minutes",
  "3 分鐘": "3 minutes",
  "30 秒": "30 seconds",
  "八字形": "Figure 8",
  "下次復健": "Next session",
  "下次復健：": "Next session: ",
  "下次復健日期": "Next session date",
  "大 · 18px": "Large - 18px",
  "小 · 8px": "Small - 8px",
  "工作因素": "Work commitments",
  "工作相關功能性視覺": "Work-related functional vision",
  "工作相關功能性視覺作業": "Work-related functional vision task",
  "工作與日常生活中的功能問題": "Difficulties at work and in daily activities",
  "已下載 ZIP，解壓縮後將個案資料夾合併至您的病歷資料夾。": "ZIP downloaded. Extract it and merge the client folder into your record folder.",
  "ZIP 檔案名稱不合法": "Invalid ZIP member name",
  "已包含設備、時間、設定、表現、難度與觀察。下方可增加其他欄位。": "Equipment, duration, settings, performance, difficulty, and observations are included. Add other fields below.",
  "已記錄": "Recorded",
  "已停止更新副本，既有副本檔案仍保留。": "Copy updates stopped. Existing copied files remain in place.",
  "已停用": "Disabled",
  "已將": "Copied",
  "已帶入上次 COPM 的職能活動，請對相同活動重新評分。": "Occupations from the previous COPM have been filled in. Rate the same occupations again.",
  "已匯入": "Imported",
  "已新增範例個案（示範資料），可在「編輯個案」中刪除。": "Example client added using demonstration data. Delete it through Edit client.",
  "已儲存": "Saved",
  "已還原": "Restored",
  "干擾物搜尋": "Search with distractors",
  "不確定": "Unsure",
  "中": "Medium",
  "中 · 1.2 秒": "Medium - 1.2 seconds",
  "中 · 12px": "Medium - 12px",
  "中 · 7 秒": "Medium - 7 seconds",
  "中央與周邊雙重作業": "Central-peripheral dual task",
  "中斷次數": "Interruptions",
  "五項症狀總分（0 至 50）": "Total symptom score (0 to 50)",
  "分配性注意力": "Divided attention",
  "分配性注意力（ms）": "Divided attention (ms)",
  "分數越低，症狀越輕。": "Lower scores indicate milder symptoms.",
  "分鐘": "minutes",
  "分鐘）": "minutes)",
  "分鐘後恢復": "minutes until recovery",
  "切換位置後，從新位置讀取個案。原位置的檔案會保留；需要搬移時，請先備份，再於新位置還原。": "Switching locations loads clients from the new folder and leaves the old files in place. To move records, back up the data first and restore it at the new location.",
  "切換為深色": "Switch to dark mode",
  "切換為淺色": "Switch to light mode",
  "反向跳視": "Anti-saccades",
  "反應時間（ms）": "Response time (ms)",
  "天候": "Weather",
  "手術日期": "Surgery date",
  "手術名稱": "Surgery name",
  "手術眼別": "Eye operated on",
  "手術備註": "Surgery notes",
  "文字": "Text",
  "方向": "Direction",
  "日期": "Date",
  "日期：": "Date: ",
  "比首次評分增加至少 2 分": "At least 2 points above the first rating",
  "主資料夾已儲存，但副本「": "The main folder was saved, but the copy in \"",
  "主觀描述": "Subjective",
  "以下設定適用於": "These settings apply to",
  "出生日期": "Date of birth",
  "出席": "Attended",
  "出席 Attended": "Attended",
  "出席紀錄：缺席": "Attendance: absent",
  "加入活動": "Add activity",
  "可選活動（每行一項）": "Available activities (one per line)",
  "右眼（OD）": "Right eye (OD)",
  "外觀已切換，但此瀏覽器無法記住設定。": "Appearance changed, but this browser cannot remember the setting.",
  "左眼（OS）": "Left eye (OS)",
  "平均": "Average",
  "平均：表現": "Average: performance",
  "平滑追視": "Smooth pursuit",
  "平滑追視控制": "Smooth-pursuit control",
  "未記錄": "Not recorded",
  "未通知": "No notification",
  "未通知、未出席（no-show）": "No notice, did not attend (no-show)",
  "本次未出席，不填寫 SOAP 或症狀評分。": "This appointment was missed. SOAP notes and symptom ratings are not required.",
  "本次沒有可填寫的評估項目，可按「新增評估項目」建立。COPM 僅在基準與療程後評估顯示。": "No assessments are available for this visit. Use Add assessment to create one. COPM appears only for baseline and post-rehabilitation assessments.",
  "本次應評估": "Due this visit",
  "正在連接資料夾…": "Connecting to folder...",
  "正在載入個案…": "Loading clients...",
  "正在載入病歷…": "Loading records...",
  "正在儲存…": "Saving...",
  "正在讀取個案…": "Reading clients...",
  "正在讀取個案總表與病歷…": "Reading client roster and records...",
  "正確率、反應時間、得分": "Accuracy, response time, score",
  "正確率（%）": "Accuracy (%)",
  "正融像輻輳（Δ）": "Positive fusional vergence (prism diopters)",
  "白內障手術（超音波乳化＋人工水晶體）": "Cataract surgery (phaco + IOL)",
  "目前：": "Current: ",
  "目前的病歷尚未儲存，確定放棄修改嗎？": "The current record has unsaved changes. Discard them?",
  "目前個案": "Current client",
  "目前環境不支援儲存檔案，請使用「複製病歷」。": "Saving files is unavailable in this environment. Use Copy note instead.",
  "目標": "targets",
  "目標數": "Target count",
  "立即複製全部資料": "Copy all data now",
  "交通因素": "Transport difficulties",
  "交替性注意力": "Alternating attention",
  "全部個案": "All clients",
  "全部類型": "All types",
  "全螢幕": "Full screen",
  "各症狀分別評估「現在」的感受，0 分表示沒有症狀，10 分表示能想像最嚴重的程度。每次復健前後評分；評估時另在追視、凝視、跳視測驗前評分。需要時可加入恢復後評分。比首次增加至少 2 分時，欄位會標紅並顯示提示。": "Rate each symptom as it feels now: 0 means no symptoms and 10 means the worst imaginable. Rate before and after every session. For assessment visits, also rate before pursuit, fixation, and saccade tests. Add a recovery rating when needed. Increases of at least 2 points from the first rating are highlighted in red with a notice.",
  "在復健紀錄中填寫症狀評分、評估或復健結果並儲存後，即可在此比較。": "Save symptom ratings, assessment results, or rehabilitation results in a record to compare them here.",
  "字母／數字刪除": "Letter / number cancellation",
  "年份或年月": "Year or year-month",
  "有效視野": "Useful field of view",
  "次": "times",
  "次數": "Count",
  "次數：": "Session number: ",
  "此病歷號已被使用，請輸入不同的病歷號。": "This medical record number is already in use. Enter a different number.",
  "此瀏覽器無法使用資料夾功能時，可": "If folder access is unavailable in this browser, you can",
  "此瀏覽器無法直接建立資料夾，請使用 Chrome 或 Edge。": "This browser cannot create folders directly. Use Chrome or Edge.",
  "此瀏覽器無法直接選擇資料夾，請使用 Chrome 或 Edge。": "This browser cannot select folders directly. Use Chrome or Edge.",
  "自訂結果欄位格式錯誤": "Invalid custom result field format",
  "至": "to",
  "位個案。": "clients.",
  "位個案的資料夾複製到「": "client folders to",
  "作業／量測指標": "Task / measure",
  "刪除": "Delete",
  "刪除個案": "Delete client",
  "否": "No",
  "快": "Fast",
  "快 · 0.8 秒": "Fast - 0.8 seconds",
  "快 · 4 秒": "Fast - 4 seconds",
  "我們再評一次。請照您現在的感覺給分，跟剛才一樣也沒關係，沒有不舒服就給 0 分。": "Let us rate again. Rate how you feel now. It is fine if your score is unchanged; use 0 if you have no discomfort.",
  "改約：": "Rescheduled: ",
  "改約日期": "Rescheduled date",
  "改約日期：": "Rescheduled date: ",
  "每次使用相同說明與分數端點；各項症狀分開記錄。「疲勞」指眼睛疲勞，不是全身疲倦。": "Use the same instructions and scale endpoints each time. Record symptoms separately. Fatigue refers to eye fatigue, rather than general tiredness.",
  "每次復健": "Every session",
  "每次復健的首次與復健後症狀評分": "First and post-session symptom ratings for each session",
  "每次復健的症狀評分": "Symptom ratings for every session",
  "每次評估": "Every assessment",
  "每筆儲存的紀錄也會複製到此資料夾": "Every saved record is also copied to this folder",
  "每項包含活動、設備、時間、設定、表現、難度與觀察，也能自行增加結果欄位。": "Each item includes activities, equipment, duration, settings, performance, difficulty, and observations. You can also add result fields.",
  "沒有符合條件的個案，請修改搜尋文字。": "No matching clients. Change your search text.",
  "沒有符合條件的復健紀錄": "No matching rehabilitation records",
  "角膜交聯術": "Corneal cross-linking",
  "角膜表層雷射手術（PRK／LASEK）": "PRK / LASEK",
  "角膜移植（PK／DSAEK／DMEK）": "Corneal transplant (PK / DSAEK / DMEK)",
  "身體不適": "Unwell",
  "事先請假": "Leave requested in advance",
  "使用 HTML 旁的 Data": "Use Data beside the HTML",
  "使用 HTML 旁的 Data 資料夾": "Use a Data folder beside the HTML",
  "使用的軟體或工具": "Software or tools used",
  "其他": "Other",
  "其他治療／居家計畫": "Other treatment / home program",
  "其他治療／居家計畫：": "Other treatment / home program: ",
  "其他結果欄位": "Additional result fields",
  "取消": "Cancel",
  "取消編輯": "Cancel editing",
  "受傷／發病日期": "Date of injury / onset",
  "周邊目標偵測": "Peripheral target detection",
  "周邊提示與動作反應": "Peripheral cue with motor response",
  "周邊燈板": "Peripheral light board",
  "周邊覺察": "Peripheral awareness",
  "姓名": "Name",
  "姓名、病歷號或診斷": "Name, medical record number, or diagnosis",
  "尚未改約": "Not rescheduled",
  "尚未取得權限，請重新選擇副本資料夾。": "Permission has not been granted. Select the copy folder again.",
  "尚未指定": "Not selected",
  "尚未記錄症狀評分，填寫復健紀錄後即可查看圖表。": "No symptom ratings recorded. Fill in a rehabilitation record to view the chart.",
  "尚未設定結果欄位": "No result fields configured",
  "尚未設定儲存位置": "Storage location not configured",
  "尚未填寫基本資料": "No basic information entered",
  "尚未選擇個案": "No client selected",
  "尚無 EyeDot 紀錄。每次執行一種模式，可新增一筆紀錄。": "No EyeDot records yet. Add a record for each run of a mode.",
  "尚無可匯出的個案。": "No clients available to export.",
  "尚無個案，請先新增個案。": "No clients yet. Add a client first.",
  "尚無追蹤結果": "No progress results yet",
  "尚無復健紀錄": "No rehabilitation records yet",
  "尚無項目，請按新增項目，選擇現有模板或建立空白模板。": "No items yet. Add an item using an existing template or a blank template.",
  "放棄修改": "Discard changes",
  "治療師": "Therapist",
  "治療師：": "Therapist: ",
  "治療師簽名：": "Therapist signature: ",
  "的個案資料夾與病歷，也會以相同結構複製到": "will have its client folders and records copied with the same structure to",
  "的復健紀錄嗎？刪除後無法復原。": "rehabilitation record? This cannot be undone.",
  "的項目設定": "item settings",
  "空白模板": "Blank template",
  "表現": "Performance",
  "整體表現": "Overall performance",
  "初次評估項目": "Initial assessment items",
  "其他項目": "Other items",
  "本次復健項目": "Rehabilitation items this visit",
  "各活動表現（一項一個分數）": "Activity performance (one score per activity)",
  "例：85%、12 次、40 秒": "e.g. 85%, 12 reps, 40 s",
  "{0}的表現": "{0} performance",
  "勾選本次施測的項目，展開對應的紀錄欄位；未勾選的項目不會存入紀錄。初次評估項目可在「項目設定」調整。": "Tick the items tested this visit to open their fields. Unticked items are not saved. Change the initial assessment items under Item settings.",
  "勾選本次進行的項目，再勾選做過的活動，每個活動填一個分數。": "Tick the items done this visit, then tick each activity performed and enter one score for it.",
  "活動欄顯示該次的分數；✓ 表示有做但未填分數。": "Activity columns show that visit's score; ✓ means the activity was done but no score was entered.",
  "勾選初次評估（基準評估）要施測的項目。填寫基準評估時，這些項目列在最前面；療程後與追蹤評估只列出其中依評估時機應再評估的項目。實際施測後，再於病歷中勾選並填寫。": "Tick the items to test at the initial (baseline) assessment. Baseline records list these items first; post-rehabilitation and follow-up assessments list only those due again by their timing. Once an item has been tested, tick it in the record and fill it in.",
  "尚無啟用的評估項目。": "No assessments are enabled.",
  "已列入初次評估項目。": "Added to the initial assessment items.",
  "已移出初次評估項目。": "Removed from the initial assessment items.",
  "表現 1 至 10": "Performance 1 to 10",
  "表現：": "Performance: ",
  "表現（1 至 10）": "Performance (1 to 10)",
  "表現平均": "Average performance",
  "長文字": "Long text",
  "青光眼手術（小樑切除／引流管／MIGS）": "Glaucoma surgery (trabeculectomy / tube / MIGS)",
  "客觀紀錄": "Objective",
  "建立個案": "Create client",
  "建立第一位個案": "Create the first client",
  "後": "after",
  "後續計畫": "Next steps",
  "恢復後": "After recovery",
  "恢復時間": "Recovery time",
  "恢復時間：": "Recovery time: ",
  "持續": "Continuous",
  "持續性注意力": "Sustained attention",
  "按日期顯示眼球運動訓練中的每筆紀錄。": "Shows each oculomotor training record by date.",
  "是": "Yes",
  "是，事先通知": "Yes, notified in advance",
  "是否通知": "Notification",
  "活動": "Activity",
  "活動：": "Activity: ",
  "玻璃體內注射": "Intravitreal injections",
  "玻璃體切除術": "Vitrectomy",
  "紀錄已存在此瀏覽器，並已下載內含 CSV 與 PDF 的 ZIP。": "The record was saved in this browser, and a ZIP containing its CSV and PDF was downloaded.",
  "紀錄類型": "Record type",
  "耐受度": "Tolerance",
  "耐受度須為 0 至 10 的數字": "Tolerance must be a number from 0 to 10",
  "軌跡": "Trail",
  "重新允許複製到「": "Allow copying again to \"",
  "重新連接「": "Reconnect to \"",
  "重新連接副本資料夾": "Reconnect copy folder",
  "重新讀取資料夾": "Reload folder",
  "重複的復健紀錄：": "Duplicate rehabilitation record: ",
  "首次使用 Data 時，儲存前請選擇 HTML 所在的本機資料夾，程式會在其中建立 Data。已有病歷時，請選擇包含 clients.csv 的資料夾；也可指定其他本機位置。": "When first using Data, select the local folder containing the HTML before saving. The app creates Data inside it. For existing records, select the folder containing clients.csv, or choose another local location.",
  "首次評分": "First rating",
  "個案": "Client",
  "個案已刪除": "Client deleted",
  "個案已建立": "Client created",
  "個案名單": "Client list",
  "個案回饋：": "Client feedback: ",
  "個案自評整體耐受度：": "Client-rated overall tolerance: ",
  "個案自評整體耐受度（0 分最差，10 分最佳）": "Client-rated overall tolerance (0 worst, 10 best)",
  "個案自評整體耐受度（0 至 10）": "Client-rated overall tolerance (0 to 10)",
  "個案自評難度：": "Client-rated difficulty: ",
  "個案自評難度（0 至 10）": "Client-rated difficulty (0 to 10)",
  "個案基本資料或評估計畫格式錯誤": "Invalid client information or assessment plan format",
  "個案資料已儲存": "Client information saved",
  "個案對本次復健的回饋": "Client feedback on this session",
  "個欄位": "fields",
  "原因：": "Reason: ",
  "時間": "Duration",
  "時間：": "Duration: ",
  "時間（分鐘）": "Duration (minutes)",
  "病歷已複製": "Note copied",
  "病歷內容": "Note content",
  "病歷文字欄位格式錯誤": "Invalid note text field format",
  "病歷會直接儲存在選定的本機資料夾。請選取包含 clients.csv 的病歷資料夾，或在 HTML 旁使用 Data。": "Records are saved directly in the selected local folder. Select the record folder containing clients.csv, or use Data beside the HTML.",
  "病歷號": "Medical record number",
  "個案資料夾 / 每次紀錄的 CSV、PDF 與 TXT": "Client folder / CSV, PDF and TXT for each record",
  "病歷號（個案資料夾名稱）": "Medical record number (client folder name)",
  "病歷號「": "Medical record number \"",
  "病歷號已被其他個案使用。": "This medical record number is already used by another client.",
  "病歷資料夾 ·": "Record folder - ",
  "病歷儲存失敗": "Failed to save record",
  "症狀 NRS（0 至 10）：": "Symptom NRS (0 to 10): ",
  "症狀、與前次的變化、日常活動表現": "Symptoms, changes since last visit, and daily activity performance",
  "症狀評分 NRS（0 至 10，評估現在的感受）": "Symptom NRS (0 to 10, rate how you feel now)",
  "症狀評分（0 至 10）": "Symptom rating (0 to 10)",
  "症狀評分（NRS，0 至 10）": "Symptom rating (NRS, 0 to 10)",
  "症狀評分格式錯誤": "Invalid symptom rating format",
  "級別／設定": "Level / settings",
  "級別／設定：": "Level / settings: ",
  "缺席": "Absent",
  "缺席 Did not attend": "Did not attend",
  "缺席紀錄": "Absence record",
  "缺席原因": "Reason for absence",
  "訓練紀錄格式錯誤": "Invalid training record format",
  "訓練進行中與結束後的感受": "Feelings during and after training",
  "訓練項目": "Training item",
  "訓練調整、居家活動、下次追蹤": "Training adjustments, home activities, and next follow-up",
  "記錄 NPC、正融像輻輳與雙眼眼動指標": "Record NPC, positive fusional vergence, and binocular eye-tracking measures",
  "記錄相同優先職能活動的表現、滿意度及分數變化": "Rate performance and satisfaction for the same priority occupations and record score changes",
  "記錄個案的主訴": "Record the client's main concerns",
  "記錄追視正確率與中斷次數": "Record pursuit accuracy and interruptions",
  "記錄偵測正確率、反應時間與凝視遵從率": "Record detection accuracy, response time, and fixation compliance",
  "記錄視線轉移時間、正確率與錯誤次數": "Record gaze-shift timing, accuracy, and task errors",
  "記錄凝視偏離、頭部動作等觀察": "Record observations such as gaze departures and head movements",
  "記錄凝視穩定度與偏離目標次數": "Record fixation stability and departures from target",
  "記錄聯絡方式、回覆與後續安排": "Record contact methods, responses, and follow-up arrangements",
  "起始日期": "Start date",
  "追視": "Pursuit",
  "追視正確率": "Tracking accuracy",
  "追蹤評估": "Follow-up assessment",
  "逆時針": "Counterclockwise",
  "偏離目標次數": "Departures from target",
  "停止更新副本": "Stop updating copy",
  "停用": "Disable",
  "偵測正確率（%）": "Detection accuracy (%)",
  "副本：": "Copy: ",
  "副本資料夾": "Copy folder",
  "副本資料夾必須與主要病歷資料夾不同。": "The copy folder must differ from the main record folder.",
  "圈": "laps",
  "圈數／": "Laps /",
  "基本視覺功能": "Basic visual function",
  "基本視覺功能：輻輳": "Basic visual function: convergence",
  "基準、療程後與追蹤": "Baseline, post-rehabilitation, and follow-up",
  "基準評估": "Baseline assessment",
  "基準與療程後": "Baseline and post-rehabilitation",
  "將 EzEMR.html 放在電腦的本機資料夾，直接用 Chrome 或 Edge 開啟。選擇病歷儲存位置後，個案總表會儲存為 clients.csv，每次紀錄會以 CSV、PDF 與 TXT 存入該個案的資料夾。": "Put EzEMR.html in a local folder on your computer and open it in Chrome or Edge. After you choose where records are stored, the client roster is saved as clients.csv and each record is saved to the client's folder as CSV, PDF and TXT.",
  "將每筆紀錄複製到另一個本機資料夾": "Copy every record to another local folder",
  "常用工具": "Common tools",
  "從模板開始": "Start from a template",
  "您現在有多想吐？0 到 10 分，您會給幾分？": "How nauseous do you feel now? What score would you give from 0 to 10?",
  "您現在有多頭暈？0 到 10 分，您會給幾分？沒有頭暈就給 0 分。": "How dizzy do you feel now? What score would you give from 0 to 10? Use 0 if you have no dizziness.",
  "您現在看東西有多模糊？0 到 10 分，您會給幾分？": "How blurred is your vision now? What score would you give from 0 to 10?",
  "您現在眼睛有多累？0 到 10 分，您會給幾分？": "How tired do your eyes feel now? What score would you give from 0 to 10?",
  "您現在頭有多痛？0 到 10 分，您會給幾分？": "How bad is your headache now? What score would you give from 0 to 10?",
  "啟用": "Enable",
  "斜視手術": "Strabismus surgery",
  "淚道手術（DCR）": "Lacrimal surgery (DCR)",
  "清除篩選": "Clear filters",
  "清除瀏覽器資料會移除暫存紀錄，請保留下載檔。": "Clearing browser data removes cached records. Keep the downloaded files.",
  "眼科手術史": "Eye surgery history",
  "眼科手術史：": "Eye surgery history: ",
  "醫療史": "Medical history",
  "醫療史：": "Medical history: ",
  "醫療史與病歷來源": "Medical history and sources",
  "病歷來源：": "Medical sources: ",
  "眼動儀：移動目標追視測驗": "Eye tracker: moving-target pursuit task",
  "眼動儀：結構化周邊刺激測驗": "Eye tracker: structured peripheral-stimulus task",
  "眼動儀：結構化跳視測驗": "Eye tracker: structured saccade task",
  "眼動儀：凝視測驗": "Eye tracker: fixation task",
  "眼眶骨折修復": "Orbital fracture repair",
  "眼睛疲勞": "Eye fatigue",
  "眼瞼／眼瞼下垂手術": "Eyelid / ptosis surgery",
  "視網膜剝離修復": "Retinal detachment repair",
  "視網膜雷射（PRP／局部）": "Retinal laser (PRP / focal)",
  "視線模糊": "Blurred vision",
  "視線轉移潛時（ms）": "Gaze-shift latency (ms)",
  "視覺注意力": "Visual attention",
  "視覺搜尋": "Visual search",
  "視覺廣度／速示訓練": "Visual span / tachistoscope",
  "移除": "Remove",
  "移除此手術紀錄": "Remove this surgery record",
  "移除此訓練紀錄": "Remove this training record",
  "移除此評分時點": "Remove this rating time point",
  "移除第": "Remove item ",
  "第": "No. ",
  "處理速度（ms）": "Processing speed (ms)",
  "設定": "Settings",
  "設定副本資料夾…": "Set copy folder...",
  "設定第二個病歷資料夾": "Set a second record folder",
  "設定評估時機與結果欄位；符合本次紀錄類型的項目會標示「本次應評估」。": "Configure assessment timing and result fields. Items matching the current record type are marked Due this visit.",
  "設定儲存位置後，即可載入或新增個案。": "Select a storage location to load or create clients.",
  "設備／程式": "Equipment / program",
  "這不是 EzEMR 的 CSV 紀錄": "This is not an EzEMR CSV record",
  "這不是 EzEMR 的備份檔。": "This is not an EzEMR backup file.",
  "這不是有效的 JSON 備份。": "This is not a valid JSON backup.",
  "通用復健紀錄欄位": "Shared rehabilitation record fields",
  "通知：": "Notification: ",
  "速度": "Speed",
  "速度、目標大小、視野範圍": "Speed, target size, and visual field range",
  "備份中的復健紀錄格式錯誤": "Invalid rehabilitation record format in backup",
  "備份全部資料（JSON）": "Back up all data (JSON)",
  "備註": "Notes",
  "備註、併發症": "Notes, complications",
  "備註：": "Notes: ",
  "最大值": "Maximum",
  "最小值": "Minimum",
  "最佳表現": "Best performance",
  "最佳表現：": "Best performance: ",
  "單位（選填）": "Unit (optional)",
  "復健": "Treatment",
  "復健日期": "Session date",
  "復健次數": "Session number",
  "復健次數須為 0 以上的數字": "Session number must be a number of 0 or more",
  "復健前": "Before session",
  "復健前 → 復健後；有記錄時另顯示恢復時間。": "Before session to After session; recovery time is shown when recorded.",
  "復健後": "After session",
  "復健活動清單格式錯誤": "Invalid rehabilitation activity list format",
  "復健紀錄 (": "Rehabilitation records (",
  "復健紀錄已刪除": "Rehabilitation record deleted",
  "復健紀錄缺少有效的日期、類型或評估資料": "The rehabilitation record needs a valid date, type, and assessment data",
  "復健時間（分鐘）": "Session duration (minutes)",
  "復健時間須為 0 以上的數字": "Session length must be a number of 0 or more",
  "復健病歷：": "Rehabilitation note: ",
  "復健病歷（SOAP）": "Rehabilitation note (SOAP)",
  "復健病歷填寫": "Rehabilitation notes",
  "復健項目": "Rehabilitation item",
  "復健項目：": "Rehabilitation items: ",
  "植入式隱形眼鏡（ICL）": "Implantable contact lens (ICL)",
  "測驗前": "before test",
  "無法刪除個案": "Cannot delete client",
  "無法刪除復健紀錄": "Cannot delete rehabilitation record",
  "無法建立 PDF，瀏覽器不支援 Canvas": "Cannot create PDF: this browser does not support Canvas",
  "無法建立範例紀錄": "Cannot create example record",
  "無法建立範例個案": "Cannot create example client",
  "無法開啟資料夾：": "Cannot open folder: ",
  "無法載入復健紀錄": "Cannot load rehabilitation records",
  "無法複製到「": "Cannot copy to \"",
  "無法儲存 Excel 表單：": "Cannot save Excel form: ",
  "無法儲存 Excel：": "Cannot save Excel: ",
  "無法儲存個案": "Cannot save client",
  "無法儲存檔案": "Cannot save file",
  "無法讀取": "Cannot read",
  "無法讀取病歷": "Cannot read records",
  "無法讀取病歷：": "Cannot read records: ",
  "無眼科手術史": "No eye surgery history",
  "程式／設備": "Program / equipment",
  "程式／設備：": "Program / equipment: ",
  "筆": "records",
  "筆 CSV，": "CSV files,",
  "筆復健紀錄嗎？刪除後無法復原。": "rehabilitation records? This cannot be undone.",
  "結束日期": "End date",
  "結束日期不可早於起始日期": "The end date cannot be before the start date",
  "結果": "Result",
  "結果欄位": "Result fields",
  "結果欄位名稱或類型格式錯誤": "Invalid result field name or type",
  "結果欄位重複": "Duplicate result field",
  "結果欄位格式錯誤": "Invalid result field format",
  "結構化視覺掃描": "Structured visual scanning",
  "給個案的評分說明": "Rating instructions for the client",
  "診斷": "Diagnosis",
  "診斷：": "Diagnosis: ",
  "評分差異": "Rating change",
  "評分時點": "Rating time point",
  "評估": "Assessment",
  "評估或復健項目識別碼格式錯誤": "Invalid assessment or rehabilitation item identifier",
  "評估時機": "Assessment timing",
  "評估時機或 COPM 模板格式錯誤": "Invalid assessment timing or COPM template format",
  "評估結果格式錯誤": "Invalid assessment result format",
  "評估項目": "Assessment items",
  "評估項目：": "Assessment items: ",
  "評估項目至少需要一個結果欄位。": "Assessments need at least one result field.",
  "評估與復健項目設定": "Assessment and rehabilitation item settings",
  "評估與復健項目模板": "Assessment and rehabilitation templates",
  "評估領域": "Assessment domain",
  "進度追蹤": "Progress tracking",
  "開放性眼球傷修復": "Open globe repair",
  "開啟": "Open",
  "開啟本機病歷資料夾": "Open local record folder",
  "開啟既有病歷資料夾": "Open an existing record folder",
  "開啟病歷資料夾…": "Open record folder...",
  "間隔": "Step",
  "項目": "Item",
  "項目已停用，歷史結果仍保留。": "Item disabled. Historical results are retained.",
  "項目已啟用。": "Item enabled.",
  "項目已儲存，可在復健紀錄中填寫。": "Item saved. It is now available in rehabilitation records.",
  "項目未儲存：": "Item not saved: ",
  "項目名稱": "Item name",
  "項目名稱或識別碼格式錯誤": "Invalid item name or identifier",
  "項目設定": "Item settings",
  "項目設定儲存失敗": "Failed to save item settings",
  "項目模板必須為清單": "Item templates must be a list",
  "項目模板格式錯誤": "Invalid item template format",
  "項活動表現": "activity performance",
  "項活動滿意度": "activity satisfaction",
  "項評估": "assessments",
  "項職能活動": "occupations",
  "順時針": "Clockwise",
  "僅圓形模式可選方向": "Direction is available only in Circle mode",
  "僅複製項目定義，建立個案後可在「項目設定」調整。": "Only item definitions are copied. Adjust them through Item settings after creating the client.",
  "匯入": "Import",
  "匯入 CSV 或還原 JSON 備份": "Import CSV or restore JSON backup",
  "匯入 CSV／還原備份…": "Import CSV / Restore backup...",
  "匯入失敗：": "Import failed: ",
  "匯入紀錄失敗": "Failed to import records",
  "匯入個案失敗": "Failed to import client",
  "匯出": "Export",
  "匯出全部個案 Excel": "Export all clients Excel",
  "匯出個案 Excel": "Export client Excel",
  "匯出個案總表 CSV": "Export client roster CSV",
  "圓形": "Circle",
  "圓點大小": "Dot size",
  "填寫說明": "Instructions",
  "微創角膜透鏡取出術（SMILE）": "SMILE",
  "新增": "Add",
  "新增紀錄": "New record",
  "新增個案": "New client",
  "新增個案…": "New client...",
  "新增個案後，即可填寫 SOAP 病歷、記錄症狀評分、評估與訓練結果，並追蹤每次復健的變化。": "Create a client to write SOAP notes, record symptom ratings, assessments, and training results, and track changes across sessions.",
  "新增第一筆 SOAP 病歷，記錄復健前後的症狀、評估與訓練結果。可先到「項目設定」調整評估與復健模板。": "Add the first SOAP note to record symptoms before and after the session, assessments, and training results. You can configure templates in Item settings first.",
  "新增復健紀錄": "New rehabilitation record",
  "當天通知": "Notified on the day",
  "當天臨時取消": "Cancelled on the day",
  "資料夾「": "Folder \"",
  "路徑": "Path",
  "跳視": "Saccade",
  "跳視控制": "Saccadic control",
  "跳視與凝視": "Saccadic fixation",
  "跳視模式無軌跡": "Trail is unavailable in Saccade mode",
  "載入範例個案（示範資料）": "Load example client (demonstration data)",
  "雷射原位角膜重塑術（LASIK）": "LASIK",
  "電腦眼球運動訓練": "Computer-based oculomotor training",
  "圖地辨識／視覺完形": "Figure-ground / visual closure",
  "圖表顯示的症狀": "Symptom shown in chart",
  "慢": "Slow",
  "慢 · 1.8 秒": "Slow - 1.8 seconds",
  "慢 · 10 秒": "Slow - 10 seconds",
  "滿意度 1 至 10": "Satisfaction 1 to 10",
  "滿意度（1 至 10）": "Satisfaction (1 to 10)",
  "滿意度平均": "Average satisfaction",
  "聚散運動（輻輳／開散）": "Vergence (convergence / divergence)",
  "與全部": "and all",
  "與首次": "compared with first",
  "與首次差異": "Change from first",
  "與基準差異": "Change from baseline",
  "噁心": "Nausea",
  "數": " count",
  "數值": "Number",
  "暫用瀏覽器與 ZIP 下載": "Use browser storage and ZIP downloads",
  "標準模板（目前內建項目）": "Standard template (current built-in items)",
  "模式": "Mode",
  "模式說明（另開分頁）": "Mode guide (opens a new tab)",
  "確定刪除": "Delete",
  "確認操作": "Confirm action",
  "編輯": "Edit",
  "編輯目前個案…": "Edit current client...",
  "編輯個案": "Edit client",
  "編輯復健紀錄": "Edit rehabilitation record",
  "複用": "Reuse",
  "複製": "Duplicate",
  "複製病歷": "Copy note",
  "調節靈活度": "Accommodative facility",
  "請允許編輯副本資料夾。": "Please allow editing of the copy folder.",
  "請用 0 到 10 分，告訴我您現在有多不舒服。0 分就是完全沒有這個症狀；10 分就是您能想像最嚴重、最不舒服的程度。請評「現在」的感覺，不是今天最嚴重的時候，也不是只評比剛才多了多少不舒服。如果現在沒有這個症狀，就給 0 分。": "Tell me how uncomfortable you feel now on a scale from 0 to 10. Zero means no symptoms at all; 10 means the worst discomfort you can imagine. Rate how you feel now, rather than the worst you felt today or only the change since the last rating. If you have no symptoms now, use 0.",
  "請先選擇病歷資料夾，或使用瀏覽器模式。": "Select a record folder first, or use browser mode.",
  "請全選並按 Ctrl+C／⌘C 複製。": "Select all and press Ctrl+C / Cmd+C to copy.",
  "請填寫項目名稱。": "Enter an item name.",
  "請確認資料夾權限或檔案內容後重新讀取。現有檔案未被修改。": "Check folder permissions or file contents, then reload. Existing files have not been changed.",
  "請確認數值範圍：最小值不可大於最大值，間隔須大於 0。": "Check the numeric range: the minimum cannot exceed the maximum, and the step must be greater than 0.",
  "請調整類型或日期，或清除篩選以查看所有紀錄。": "Adjust the type or dates, or clear the filters to see all records.",
  "請選擇": "Please select",
  "請選擇多份 CSV，或單一 JSON 備份。": "Select multiple CSV files or a single JSON backup.",
  "閱讀行追蹤": "Reading line tracking",
  "凝視": "Fixation",
  "凝視控制": "Fixation control",
  "凝視遵從率（%）": "Fixation compliance (%)",
  "凝視穩定（VOR ×1）": "Gaze stabilisation (VOR x1)",
  "凝視穩定度": "Fixation stability",
  "歷史復健項目（": "Historical rehabilitation item (",
  "歷史評估項目（": "Historical assessment item (",
  "篩選個案": "Filter clients",
  "篩選復健紀錄": "Filter rehabilitation records",
  "輸入活動名稱": "Enter activity name",
  "選單": "Dropdown",
  "選單至少需要一個非空白選項。": "A dropdown needs at least one nonempty option.",
  "選項（每行一項）": "Options (one per line)",
  "選擇另一個本機資料夾保存副本。現有個案資料會立即複製，之後每次儲存也會更新副本。": "Choose another local folder for a copy. Existing client data is copied immediately, and each subsequent save updates the copy.",
  "選擇其他資料夾": "Choose another folder",
  "選擇性注意力": "Selective attention",
  "選擇性注意力（ms）": "Selective attention (ms)",
  "選擇病歷資料夾": "Choose record folder",
  "選擇副本資料夾": "Choose copy folder",
  "錯誤次數": "Task errors",
  "隨機路徑": "Random Path",
  "頭痛": "Headache",
  "頭暈": "Dizziness",
  "優先職能活動": "Priority occupations",
  "儲存": "Save",
  "儲存 CSV + PDF": "Save CSV + PDF",
  "儲存 CSV 與 PDF": "Save CSV and PDF",
  "儲存 CSV 與 PDF（Ctrl+S／⌘S）": "Save CSV and PDF (Ctrl+S / Cmd+S)",
  "儲存在": "Saved in",
  "儲存位置": "Storage location",
  "儲存位置…": "Storage location...",
  "儲存到：": "Save to: ",
  "儲存病歷需要資料夾編輯權限。": "Saving records requires permission to edit the folder.",
  "儲存項目": "Save item",
  "應用程式選單": "Application menu",
  "檔案": "File",
  "檔案已儲存": "File saved",
  "檢視": "View",
  "療程後／下一項測驗前：": "After session / before next test: ",
  "療程後評估": "Post-rehabilitation assessment",
  "總分": "Total",
  "總分（0 至 50）": "Total (0 to 50)",
  "翼狀贅肉切除": "Pterygium excision",
  "聯絡紀錄與後續": "Contact and follow-up",
  "聯絡紀錄與後續：": "Contact and follow-up: ",
  "臨床判斷與目標達成情形": "Clinical judgment and progress toward goals",
  "臨床評估": "Assessment",
  "臨床輻輳評估（NPC）": "Clinical convergence assessment (NPC)",
  "還原已停止": "Restore stopped",
  "瀏覽器出現權限提示時，請允許編輯檔案。": "Allow file editing when the browser requests permission.",
  "瀏覽器需要你選擇一次資料夾並允許編輯。需要換電腦時，先匯出完整 JSON 備份，再將備份與 HTML 複製到另一台電腦還原。": "The browser needs you to select a folder and allow editing once. To move to another computer, export a full JSON backup, then copy the backup and HTML to that computer and restore it there.",
  "瀏覽器暫存 · 儲存時下載 ZIP": "Browser storage - Save downloads ZIP",
  "瀏覽器模式：儲存後會下載 ZIP，內含個案資料夾與本次 CSV、PDF。若要直接寫入固定資料夾，請使用支援資料夾存取的 Chrome／Edge。": "Browser mode: saving downloads a ZIP containing the client folder and this session's CSV and PDF. To write directly to a fixed folder, use Chrome or Edge with folder access support.",
  "職能表現與滿意度": "Occupational performance and satisfaction",
  "職能活動表現與滿意度（1 至 10）": "Occupational performance and satisfaction (1 to 10)",
  "轉介原因": "Referral reason",
  "轉介原因：": "Referral reason: ",
  "轉介原因／目前困難": "Referral reason / current difficulties",
  "雙眼（OU）": "Both eyes (OU)",
  "雙眼眼動量測": "Binocular eye-tracking measures",
  "關閉": "Close",
  "難度": "Difficulty",
  "類別": "Category",
  "類型": "Type",
  "類型：": "Type: ",
  "欄位名稱": "Field name",
  "欄位名稱與單位不可重複。": "Field names and units must be unique.",
  "變化": "Change",
  "顯示": "Show",
  "觀察": "Observation",
  "觀察：": "Observation: ",
  "觀察紀錄": "Observations",
  "A：臨床評估": "A: Assessment",
  "Attendance 缺席": "Attendance",
  "Attended 出席": "Attended",
  "clients.csv 含有不合法或重複的個案／資料夾": "clients.csv contains invalid or duplicate clients or folders",
  "clients.csv 個案總表；每位個案的復健紀錄以 CSV 與 PDF 儲存。": "clients.csv client roster; each client's rehabilitation records are saved as CSV and PDF.",
  "clients.csv 額外資訊格式錯誤": "Invalid extra information in clients.csv",
  "clients.csv 欄位格式不正確": "Invalid clients.csv columns",
  "clients.csv 欄位數量不正確": "Incorrect number of columns in clients.csv",
  "Contact / follow-up 聯絡紀錄": "Contact / follow-up",
  "COPM 保留專用的職能活動、表現與滿意度表格，以及基準比較。評估時機固定為基準與療程後。": "COPM retains its dedicated occupation, performance, and satisfaction table and baseline comparison. Assessment timing is fixed to baseline and post-rehabilitation.",
  "COPM：最多 5 項職能活動，表現與滿意度 1 至 10 分": "COPM: up to 5 occupations; performance and satisfaction from 1 to 10",
  "CSV 上層欄位格式錯誤": "Invalid parent field in CSV",
  "CSV 引號格式錯誤": "Invalid CSV quotation format",
  "CSV 含有重複欄位": "CSV contains duplicate fields",
  "CSV 版本或欄位格式錯誤": "Unsupported CSV version or invalid field format",
  "CSV 的個案與所在資料夾不一致": "The client in the CSV does not match the containing folder",
  "CSV 根節點必須為物件": "The CSV root must be an object",
  "CSV 缺少上層欄位": "CSV is missing a parent field",
  "CSV 陣列索引錯誤": "Invalid CSV array index",
  "CSV 資料型別錯誤": "Invalid CSV data type",
  "CSV 與 PDF 已儲存至個案資料夾。": "CSV and PDF saved to the client folder.",
  "CSV 欄位缺少結束引號": "CSV field has no closing quotation mark",
  "CSV 欄位路徑錯誤": "Invalid CSV field path",
  "CSV／PDF 匯出失敗": "CSV / PDF export failed",
  "Data（首次儲存時建立）": "Data (created on first save)",
  "Did not attend 缺席": "Did not attend",
  "Excel 表單": "Excel form",
  "Excel 匯出需要連線載入元件；CSV 與 PDF 可離線使用。": "Excel export needs a connection to load its component. CSV and PDF work offline.",
  "EyeDot 模式": "EyeDot mode",
  "EyeDot Trainer 訓練紀錄": "EyeDot Trainer records",
  "EzEMR · 復健紀錄": "EzEMR - Rehabilitation record",
  "Notified 通知": "Notified",
  "NPC 分離點（cm）": "NPC break (cm)",
  "NPC 恢復點（cm）": "NPC recovery (cm)",
  "O：客觀紀錄": "O: Objective",
  "P：後續計畫": "P: Plan",
  "PDF 頁面建立失敗": "Failed to create PDF page",
  "Reason 原因": "Reason",
  "Rescheduled to 改約": "Rescheduled to",
  "S：主觀描述": "S: Subjective",
  "SLT／YAG 雷射": "SLT / YAG laser",
  "語言": "Language",
  "EzEMR | 復健病歷": "EzEMR | Rehabilitation records",
  "語言已切換，但此瀏覽器無法記住設定。": "Language changed, but this browser cannot remember the setting.",
  "編輯評估項目": "Edit assessment",
  "編輯復健項目": "Edit rehabilitation item",
  "新增評估項目": "Add assessment",
  "新增復健項目": "Add rehabilitation item",
  "：": ": ",
  "，": ", ",
  "。": ". ",
  "（": " (",
  "）": ")",
  "／": " / ",
  "、": ", ",
  "「": "\"",
  "」": "\"",
  "第 {0} 次": "Session {0}",
  "{0}後": "After {0}",
  "已將 {0} 位個案的資料夾複製到「{1}」。": "Copied {0} client folders to \"{1}\".",
  "儲存在 {0} 的個案資料夾與病歷，也會以相同結構複製到 {1}。編輯、重新命名及刪除也會套用至副本。": "Client folders and records in {0} are copied with the same structure to {1}. Edits, renames, and deletions also apply to the copy.",
  "複用 {0} 的項目設定": "Reuse item settings from {0}",
  "編輯 {0}": "Edit {0}",
  "複製 {0}": "Duplicate {0}",
  "停用 {0}": "Disable {0}",
  "啟用 {0}": "Enable {0}",
  "移除第 {0} 個欄位": "Remove field {0}",
  "第 {0} 項職能活動": "Priority occupation {0}",
  "第 {0} 項活動表現": "Performance for activity {0}",
  "第 {0} 項活動滿意度": "Satisfaction for activity {0}",
  "匯入 CSV、評估復能 Excel、JSON 備份或測驗分數檔": "Import CSV, assessment and rehabilitation Excel, JSON backup, or test score files",
  "匯入 CSV／評估復能 Excel／備份／測驗分數…": "Import CSV / assessment and rehabilitation Excel / backup / test scores...",
  "匯入舊版 SOAP 資料夾…": "Import legacy SOAP folder...",
  "症狀圖表，可左右捲動": "Symptom chart, scroll horizontally",
  "症狀評分表，可左右捲動": "Symptom ratings, scroll horizontally",
  "資料來源：": "Source records: ",
  "資料來源": "Source records",
  "收案資料（依來源保留）：": "Intake data (as in source): ",
  "收案資料（依來源保留）": "Intake data (as in source)",
  "匯入的收案資料與來源": "Imported intake data and sources",
  "第 {0} 列": "row {0}",
  "第 {0} 頁": "page {0}",
  "無法辨識 Excel 日期：{0}": "Unrecognized Excel date: {0}",
  "需要包含「評估及復能收案名單、評估紀錄、復能紀錄」的資料表；舊版 SOAP 請使用「匯入舊版 SOAP 資料夾」。": "The workbook must contain the intake roster, assessment records and rehabilitation records sheets. For legacy SOAP records, use Import legacy SOAP folder.",
  "個案編號 {0} 對應不同姓名，已停止匯入。": "Client ID {0} is linked to different names. Import stopped.",
  "個案編號或姓名無效：{0}": "Invalid client ID or name: {0}",
  "找不到收案名單欄位。": "Intake roster columns not found.",
  "{0}：年齡原值 {1}，未代為修正。": "{0}: the original age value {1} was kept unchanged.",
  "{0} 缺少看診日期。": "{0} is missing a visit date.",
  "找不到評估紀錄欄位。": "Assessment record columns not found.",
  "{0} {1}：已讀取評估頁右側無標題資料區；收案資料未記載。": "{0} {1}: read from the untitled block to the right of the assessment sheet; no intake data is recorded.",
  "找不到復能紀錄欄位。": "Rehabilitation record columns not found.",
  "JSON 格式錯誤：{0}": "Invalid JSON: {0}",
  "無法辨識舊版 SOAP JSON：{0}": "Unrecognized legacy SOAP JSON: {0}",
  "找不到舊版 SOAP JSON，請選擇包含個案子資料夾及 client.json 的資料夾。": "No legacy SOAP JSON found. Select the folder that contains the client subfolders and their client.json files.",
  "SOAP 復健紀錄缺少同資料夾的 client.json，無法核對個案。": "A SOAP record is missing client.json in the same folder, so its client cannot be verified.",
  "已略過 _archive 封存版本，未計為目前就診紀錄。": "Archived versions in _archive were skipped and not counted as current visits.",
  "{0} 對應多位個案，無法自動合併。": "{0} matches more than one client and cannot be merged automatically.",
  "{0} 的姓名或出生日期與既有個案不一致，已停止匯入。": "The name or date of birth of {0} differs from the existing client. Import stopped.",
  "{0} 的病歷號與既有個案不一致，已停止匯入。": "The medical record number of {0} differs from the existing client. Import stopped.",
  "備份含有重複的個案識別碼：{0}": "The backup contains a duplicate client ID: {0}",
  "備份含有重複的紀錄識別碼：{0}": "The backup contains a duplicate record ID: {0}",
  "病歷號重複：{0}": "Duplicate medical record number: {0}",
  "{0} {1} {2}：兩份記載已並列保留。": "{0} {1} {2}: both entries were kept together.",
  "相同病歷識別碼的日期不同：{0} {1}": "Records with the same ID have different dates: {0} {1}",
  "{0} {1} 的 {2} 有不同結果，已停止匯入。": "{0} {1}: {2} has different results. Import stopped.",
  "正在儲存資料，請等候完成後再匯入。": "Saving is in progress. Import again after it finishes.",
  "正在整合 {0} 位個案，產生 CSV 與 PDF…": "Merging {0} clients and creating CSV and PDF files...",
  "已整合 {0} 位個案。": "Merged {0} clients.",
  "請分別匯入 Excel、CSV 或 JSON 備份。": "Import Excel, CSV and JSON backups separately.",
  "測驗設定（已填 {0} 項）": "Test settings ({0} filled)",
  "測驗設定": "Test settings",
  "；": "; ",
  "測驗紀錄（每次測驗一筆，各自記錄設定）": "Test records (one per test run, each with its own settings)",
  "尚無測驗紀錄。可匯入 OcuTrain 或周邊視野訓練的分數檔，或在下方新增。": "No test records yet. Import score files from OcuTrain or the peripheral field training program, or add one below.",
  "測驗紀錄項目": "Test record item",
  "新增測驗紀錄": "Add test record",
  "來源：": "Source: ",
  "移除{0}測驗紀錄": "Remove the {0} test record",
  "測驗紀錄：": "Test record: ",
  "測驗紀錄": "Test record",
  "（復健測驗紀錄）": " (rehabilitation test records)",
  "復健時的每次測驗，各自顯示當次設定。": "Each test run during rehabilitation, shown with the settings used that time.",
  "無法辨識 OcuTrain 模組：{0}": "Unrecognized OcuTrain module: {0}",
  "缺少測驗日期。": "The test date is missing.",
  "無法辨識周邊視野訓練的子測驗：{0}": "Unrecognized peripheral field training subtest: {0}",
  "匯入測驗分數": "Import test scores",
  "匯入到 {0}。檔案中的受試者代號：{1}": "Importing into {0}. Subject IDs in the files: {1}",
  "「評估」寫入同名的評估項目；「復健訓練」寫入復健項目的測驗紀錄，並把主要分數填入對應活動。該日沒有紀錄時會新增一筆。": "\"Assessment\" fills in the assessment item of the same name. \"Rehabilitation training\" adds a test record under the rehabilitation item and puts the main score on the matching activity. A new record is created when that day has none.",
  "匯入為": "Import as",
  "復健訓練": "Rehabilitation training",
  "不匯入": "Do not import",
  "（{0}）": " ({0})",
  "請先選擇要匯入測驗分數的個案。": "Select the client to import the test scores into first.",
  "{0}：原始分數檔只有逐題資料，請匯入同一次的統計成績 CSV。": "{0}: the raw score file has only per-trial data; import the statistics CSV from the same run.",
  "{0}：此 JSON 沒有記錄測驗模式與正式題，請匯入同一次的統計成績 CSV。": "{0}: this JSON does not record the test mode or which trials were formal; import the statistics CSV from the same run.",
  "{0}：只有複視問卷，沒有測驗分數，未匯入。": "{0}: contains only the diplopia questionnaire and no test scores; not imported.",
  "{0} 與 {1} 是同一次測驗，只列出一筆。": "{0} and {1} are the same test run; it is listed once.",
  "沒有可匯入的測驗分數。": "There are no test scores to import.",
  "受試者代號 {0} 屬於個案 {1}，請先開啟該個案再匯入。": "Subject ID {0} belongs to client {1}. Open that client before importing.",
  "已匯入過，預設不匯入。": "Already imported; set to not import.",
  "測驗未完成（{0}），預設不匯入。": "Test not completed ({0}); set to not import.",
  "不是正式紀錄（{0}），預設不匯入。": "Not a formal run ({0}); set to not import.",
  "沒有匯入任何測驗分數。": "No test scores were imported.",
  "已新增 {0} 的{1}紀錄。": "Added a new record on {0} ({1}).",
  "{0} {1}：已有不同的結果，未覆蓋（{2}）。": "{0} {1}: different results are already recorded and were not overwritten ({2}).",
  "已匯入 {0} 筆測驗分數。": "Imported {0} test scores.",
  "測驗分數檔請與 EzEMR 的 CSV 或 JSON 備份分開匯入。": "Import test score files separately from EzEMR CSV files and JSON backups."
};
const uiPattern = new RegExp(Object.keys(UI_EN).sort((a, b) => b.length - a.length).map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') || '(?!)', 'g');
// Translate source literals only; interpolated names, notes and result values stay untouched.
function ui(source, ...values) {
  const translate = text => language === 'en' ? text.replace(uiPattern, key => UI_EN[key]) : text;
  return Array.isArray(source) ? source.reduce((out, part, i) => out + translate(part) + (i < values.length ? values[i] : ''), '')
    : translate(source).replace(/\{(\d+)\}/g, (match, index) => index < values.length ? values[index] : match);
}
// Symptom wording follows 症狀評分說明.
const SYMS = [
  { k: 'ef', en: 'Eye fatigue', zh: '眼睛疲勞', q: '您現在眼睛有多累？0 到 10 分，您會給幾分？' },
  { k: 'bv', en: 'Blurred vision', zh: '視線模糊', q: '您現在看東西有多模糊？0 到 10 分，您會給幾分？' },
  { k: 'dz', en: 'Dizziness', zh: '頭暈', q: '您現在有多頭暈？0 到 10 分，您會給幾分？沒有頭暈就給 0 分。' },
  { k: 'ha', en: 'Headache', zh: '頭痛', q: '您現在頭有多痛？0 到 10 分，您會給幾分？' },
  { k: 'na', en: 'Nausea', zh: '噁心', q: '您現在有多想吐？0 到 10 分，您會給幾分？' }
];
const PROFILE_FIELDS = [
  { key: 'name', label: () => ui('姓名') },
  { key: 'ref', label: () => ui('病歷號') },
  { key: 'nationalId', label: () => ui('身分證字號') },
  { key: 'dob', label: () => ui('出生日期'), type: 'date' },
  { key: 'sex', label: () => ui('性別'), options: () => [['female', ui('女性')], ['male', ui('男性')], ['other', ui('其他')], ['unknown', ui('不詳')]] },
  ...['smoking', 'alcohol', 'betel'].map((key, index) => ({ key, label: [() => ui('抽菸習慣'), () => ui('飲酒習慣'), () => ui('嚼檳榔習慣')][index],
    options: () => [['never', ui('從不')], ['current', ui('目前有')], ['former', ui('以前有')], ['unknown', ui('不詳')]] })),
  { key: 'occupation', label: () => ui('職業') },
  { key: 'religion', label: () => ui('宗教') },
  { key: 'chronicConditions', label: () => ui('慢性病'), type: 'textarea' },
  { key: 'phone', label: () => ui('聯絡電話'), type: 'tel' },
  { key: 'address', label: () => ui('聯絡地址'), type: 'textarea' },
  { key: 'allergies', label: () => ui('過敏史'), type: 'textarea' }
];
const DEFAULT_APP_SETTINGS = { version: 1, requiredFields: ['name', 'ref'] };
let appSettings = { version: 1, requiredFields: ['name', 'ref'] };
const clientLabel = c => c.name || c.ref || ui('未具名個案 {0}', c.id);
const requiredProfileFields = () => PROFILE_FIELDS.filter(field => appSettings.requiredFields.includes(field.key));
const missingProfileFields = c => requiredProfileFields().filter(field => !String(c[field.key] ?? '').trim());
function profileFieldHTML(field, c) {
  const id = 'cf-' + field.key, value = c[field.key] ?? '';
  const attributes = `id="${id}" required aria-label="${esc(field.label())}"`;
  const control = field.options ? `<select ${attributes}><option value="">${ui('請選擇')}</option>${value && !field.options().some(([key]) => key === value) ? `<option value="${val(value)}" selected>${esc(value)}</option>` : ''}${field.options().map(([key, label]) => `<option value="${key}" ${value === key ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select>`
    : field.type === 'textarea' ? `<textarea ${attributes}>${val(value)}</textarea>` : `<input type="${field.type || 'text'}" ${attributes} value="${val(value)}">`;
  return `<label class="f" for="${id}">${esc(field.label())}${control}</label>`;
}
function profileIncompleteHTML(c) {
  const missing = missingProfileFields(c);
  return missing.length ? ui`<section class="profile-incomplete" id="profileIncomplete" role="status"><div><strong>基本資料未齊全</strong><span>${esc(ui('尚缺：{0}', missing.map(field => field.label()).join(ui('、'))))}</span></div><button type="button" class="btn small" data-action="edit-client">補齊資料</button></section>` : '';
}
function profileDetailsHTML(c) {
  const fields = requiredProfileFields().filter(field => !['name', 'ref'].includes(field.key) && String(c[field.key] ?? '').trim());
  return fields.length ? `<dl class="profile-facts">${fields.map(field => {
    const value = field.options ? field.options().find(([key]) => key === c[field.key])?.[1] || c[field.key] : field.type === 'date' ? fmtDate(c[field.key]) : c[field.key];
    return `<div><dt>${esc(field.label())}</dt><dd>${esc(value)}</dd></div>`;
  }).join('')}</dl>` : '';
}
const SK = SYMS.map(s => s.k);
const TP_LABEL = { pre: '復健前', end: '復健後', rec: '恢復後' };
// Assessment visits: rate before each eye-tracking subtest, in this order.
const SUBTESTS = [{ k: 'pursuit', en: 'Pursuit', zh: '追視' }, { k: 'fixation', en: 'Fixation', zh: '凝視' }, { k: 'saccade', en: 'Saccade', zh: '跳視' }];
const isAssessVisit = v => ['assessment', 'baseline', 'post', 'followup'].includes(v);
const ABSENCE_REASONS = ['未通知、未出席（no-show）', '事先請假', '當天臨時取消', '身體不適', '工作因素', '交通因素', '天候', '其他'];
const NOTIFIED = ['是，事先通知', '當天通知', '未通知', '不確定'];
const absenceLabel = (value, options) => options.includes(value) ? ui(value) : value || '';
function tpName(r, withMin = true) {
  if (r.kind === 'sub') { const t = SUBTESTS.find(x => x.k === r.test); return language === 'en' ? 'Before ' + (t ? t.en.toLowerCase() : r.test) : (t ? t.zh : r.test) + ui('測驗前'); }
  if (r.kind === 'blk') return ui('{0}後', r.label || ui('訓練項目'));
  return ui(TP_LABEL[r.kind] || r.kind) + (withMin && r.kind === 'rec' && r.recMin != null ? ui`（${r.recMin} 分鐘）` : '');
}
const ratedRows = rows => (rows || []).filter(r => r.kind !== 'rec' && rowTotal(r) != null);
const firstRated = rows => ratedRows(rows)[0] || (rows || []).find(r => r.kind !== 'rec') || null;
const lastRated = rows => { const l = ratedRows(rows); return l[l.length - 1] || null; };
// Every session: Before session … After session. Assessment visits also rate before each eye-tracking subtest.
// Rows that already hold ratings are always kept.
function shapeSym(rows, visit) {
  rows = rows || [];
  if (visit === 'absent') return rows.filter(r => rowTotal(r) != null);   // no ratings for a missed appointment; keep any already entered
  const pre = rows.find(r => r.kind === 'pre') || { id: uid('r'), kind: 'pre', scores: {} };
  const end = rows.find(r => r.kind === 'end') || { id: uid('r'), kind: 'end', scores: {} };
  const subs = isAssessVisit(visit)
    ? SUBTESTS.map(t => rows.find(r => r.kind === 'sub' && r.test === t.k) || { id: uid('r'), kind: 'sub', test: t.k, scores: {} })
    : rows.filter(r => r.kind === 'sub' && rowTotal(r) != null);
  const fixed = new Set([pre.id, end.id, ...subs.map(r => r.id)]);
  const others = rows.filter(r => !fixed.has(r.id) && r.kind !== 'rec' && rowTotal(r) != null);
  const rec = rows.filter(r => r.kind === 'rec');
  return [pre, ...subs, ...others, end, ...rec];
}

const TIMING = {
  session: '每次復健',
  assessment: '每次評估',
  bp: '基準與療程後',
  milestone: '基準、療程後與追蹤'
};
const VISITS = [
  { k: 'treatment', label: '復健' },
  { k: 'assessment', label: '評估' },
  { k: 'baseline', label: '基準評估' },
  { k: 'post', label: '療程後評估' },
  { k: 'followup', label: '追蹤評估' },
  { k: 'absent', label: '缺席' }
];
const visitLabel = k => ui((VISITS.find(v => v.k === k) || VISITS[0]).label);
const isDue = (timing, visit) => timing === 'session' ||
  (timing === 'assessment' && isAssessVisit(visit)) ||
  (timing === 'bp' && ['baseline', 'post'].includes(visit)) ||
  (timing === 'milestone' && ['baseline', 'post', 'followup'].includes(visit));
// OcuTrain modules and UFOV subtests: one item per module or subtest, each with its own settings.
// Field ids follow the keys in the programs' exported files so imported scores land in the same boxes.
const numField = (id, label, extra = {}) => ({ id, label, type: 'number', ...extra });
const asSetting = field => ({ ...field, group: 'setting' });
const OT_OPTIONS = {
  mode: ['Evaluation', 'Predictable', 'Random'],
  stimulus: ['White dot', 'Red in White', 'Numbers dot'],
  tracker: ['Tobii', 'WebGazer', 'None'],
  vorAxis: ['Horizontal', 'Vertical']
};
const otResults = (extra = []) => [
  numField('accuracy_rate', 'Gaze accuracy rate (%)', { min: 0, max: 100 }), ...extra,
  numField('in_threshold_sec', 'On-target time (s)', { min: 0 }), numField('valid_sec', 'Valid gaze time (s)', { min: 0 }),
  numField('actual_duration_sec', 'Test duration (s)', { min: 0 }),
  { id: 'diplopia', label: 'Diplopia onset by direction (× = none)', type: 'text' }
];
const otSettings = (extra = []) => [
  { id: 'mode', label: 'Test mode', type: 'select', options: OT_OPTIONS.mode },
  { id: 'stimulusType', label: 'Stimulus type', type: 'select', options: OT_OPTIONS.stimulus },
  numField('ballArcmin', 'Stimulus size (arcmin)', { min: 0 }), ...extra,
  numField('horizontalSpanArcmin', 'Horizontal target span (arcmin)', { min: 0 }), numField('verticalSpanArcmin', 'Vertical target span (arcmin)', { min: 0 }),
  { id: 'directions', label: 'Enabled directions', type: 'text' },
  numField('threshold_deg', 'Hit distance threshold (deg)', { min: 0 }), numField('viewingDistanceCm', 'Viewing distance (cm)', { min: 0 }),
  { id: 'eye_tracker', label: 'Eye tracker', type: 'select', options: OT_OPTIONS.tracker }
].map(asSetting);
const completedTargets = numField('completed_targets', 'Completed targets (n)', { min: 0 });
const ufovFields = peripheral => [
  numField('final_threshold_rt_ms', 'Threshold at 80% correct (ms)', { min: 0 }),
  numField('accuracy_rate_percent', 'Overall accuracy (%)', { min: 0, max: 100 }),
  ...(peripheral ? [numField('central_accuracy_percent', 'Central accuracy (%)', { min: 0, max: 100 }), numField('peripheral_accuracy_percent', 'Peripheral accuracy (%)', { min: 0, max: 100 })] : []),
  numField('mean_response_time_ms', 'Mean response time (ms)', { min: 0 }),
  numField('formal_trials_total', 'Formal trials (n)', { min: 0 }), numField('formal_trials_correct', 'Correct trials (n)', { min: 0 }),
  numField('fastest_correct_duration_ms', 'Fastest correct duration (ms)', { min: 0 }),
  ...(peripheral ? [{ id: 'direction_accuracy', label: 'Accuracy by direction', type: 'text' }] : []),
  ...[{ id: 'stop_condition', label: 'Stop condition', type: 'select', options: ['Adaptive 80%', 'Fixed trials'] },
    numField('contrast_percent', 'Contrast (%)', { min: 0, max: 100 }),
    ...(peripheral ? [numField('target_visual_angle_deg', 'Peripheral eccentricity (deg)', { min: 0 })] : []),
    numField('vehicle_visual_angle_deg', 'Vehicle size (deg)', { min: 0 }), numField('viewing_distance_cm', 'Viewing distance (cm)', { min: 0 }),
    ...(peripheral ? [{ id: 'enabled_direction_list', label: 'Enabled directions', type: 'text' }] : []),
    numField('refresh_rate_hz', 'Refresh rate (Hz)', { min: 0 })].map(asSetting)
];
const UFOV_OUTCOME = 'Presentation-time threshold at 80% correct from the adaptive staircase.';
const DEVICE_ITEMS = [
  { id: 'pursuit', domain: 'Smooth-pursuit control', name: 'Smooth pursuit (OcuTrain PURSUIT)', timing: 'assessment',
    outcome: 'Accuracy counts the outward and return movement only; the central cross is excluded.',
    fields: [...otResults([completedTargets]), ...otSettings([asSetting(numField('speedArcminSec', 'Movement speed (arcmin/s)', { min: 0 }))])] },
  { id: 'fixation', domain: 'Fixation control', name: 'Fixation (OcuTrain FIXATION)', timing: 'assessment',
    outcome: 'Accuracy counts the edge hold only; the central cross and movement are excluded.',
    fields: [...otResults([completedTargets]), ...otSettings([asSetting(numField('speedArcminSec', 'Movement speed (arcmin/s)', { min: 0 })), asSetting(numField('holdSec', 'Edge hold time (s)', { min: 0 }))])] },
  { id: 'saccade', domain: 'Saccadic control', name: 'Saccade (OcuTrain SACCADE)', timing: 'assessment',
    outcome: 'Accuracy excludes the first 200 ms of each target; time to first fixation (TFF) is recorded separately.',
    fields: [...otResults([numField('tff_mean_ms', 'Mean time to first fixation (ms)', { min: 0 }), numField('tff_detected_targets', 'TFF detected targets (n)', { min: 0 }), numField('tff_total_targets', 'TFF total targets (n)', { min: 0 }), completedTargets]),
      ...otSettings([asSetting(numField('dwellMs', 'Target dwell time (ms)', { min: 0 }))])] },
  { id: 'vor', domain: 'Vestibulo-ocular control', name: 'Vestibulo-ocular reflex (OcuTrain VOR)', timing: 'assessment',
    outcome: 'Accuracy counts all valid tracking time while the head moves.',
    fields: [...otResults(), ...[numField('vorGain', 'VOR multiplier (×)', { min: 1, max: 2, step: 0.1 }), { id: 'vorAxis', label: 'VOR direction', type: 'select', options: OT_OPTIONS.vorAxis },
      numField('ballArcmin', 'Stimulus size (arcmin)', { min: 0 }), numField('threshold_deg', 'Hit distance threshold (deg)', { min: 0 }),
      numField('viewingDistanceCm', 'Viewing distance (cm)', { min: 0 }), { id: 'eye_tracker', label: 'Eye tracker', type: 'select', options: OT_OPTIONS.tracker }].map(asSetting)] },
  { id: 'ufov_speed', domain: 'Useful field of view', name: 'UFOV subtest 1 – processing speed', timing: 'milestone', outcome: UFOV_OUTCOME, fields: ufovFields(false) },
  { id: 'ufov_divided', domain: 'Useful field of view', name: 'UFOV subtest 2 – divided attention', timing: 'milestone', outcome: UFOV_OUTCOME, fields: ufovFields(true) },
  { id: 'ufov_selective', domain: 'Useful field of view', name: 'UFOV subtest 3 – selective attention', timing: 'milestone', outcome: UFOV_OUTCOME, fields: ufovFields(true) }
];
const deviceItem = id => DEVICE_ITEMS.find(item => item.id === id);
// Test runs recorded under a training item: OcuTrain modules under oculomotor training, UFOV subtests under peripheral training.
const RUN_ITEMS = { ocular: ['pursuit', 'fixation', 'saccade', 'vor'], periph: ['ufov_speed', 'ufov_divided', 'ufov_selective'] };
// The training activity each test run counts toward; the activity keeps the latest run's main score.
const RUN_ACTS = { pursuit: 'Smooth pursuit tracking', fixation: 'Fixation', saccade: 'Saccades', vor: 'Gaze stabilisation (VOR)',
  ufov_speed: 'UFOV subtest 1 – processing speed', ufov_divided: 'UFOV subtest 2 – divided attention', ufov_selective: 'UFOV subtest 3 – selective attention' };
const DEFAULT_PLAN = [
  { id: 'copm', category: 'functional', domain: 'Occupational performance & satisfaction', name: 'COPM', timing: 'bp', copm: true,
    outcome: 'Performance and satisfaction ratings for the same priority occupations; change scores' },
  ...DEVICE_ITEMS.slice(0, 4),
  { id: 'npc', domain: 'Basic visual function – convergence', name: 'Clinical convergence assessment (NPC)', timing: 'milestone',
    fields: ['NPC break (cm)', 'NPC recovery (cm)', 'Positive fusional vergence (Δ)', 'Binocular eye-tracking measures'], outcome: 'NPC, positive fusional vergence and selected binocular eye-tracking measures' },
  ...DEVICE_ITEMS.slice(4),
  { id: 'func', category: 'functional', domain: 'Functional vision (work related)', name: 'Work-related functional vision task', timing: 'milestone',
    fields: ['Task / measure', 'Result'], outcome: '' },
  ...[{ id: 'record_review', name: 'Medical record review' }, { id: 'optometry_record', name: 'Optometry record' }, { id: 'ot_record', name: 'OT assessment record' }].map(item => ({ ...item, category: 'visual', domain: 'Visual function', timing: 'milestone',
    fields: [{ id: 'source_date', label: 'Source / date', type: 'text' }, { id: 'summary', label: 'Summary', type: 'textarea' }] })),
  ...[{ id: 'va', name: 'Visual acuity' }, { id: 'near_va', name: 'Near visual acuity' }].map((item, i) => ({ ...item, category: 'visual', domain: 'Visual function', timing: 'assessment',
    fields: ['OD', 'OS', 'OU'].map(eye => ({ id: eye.toLowerCase(), label: eye, type: 'text' })).concat([
      { id: 'notation', label: 'Chart / notation', type: 'text' },
      { id: 'correction', label: 'Correction', type: 'select', options: ['Uncorrected', 'Habitual', 'Best corrected'] },
      ...(i ? [{ id: 'distance_cm', label: 'Test distance (cm)', type: 'number', min: 0 }] : [])]) })),
  { id: 'refraction', category: 'visual', domain: 'Visual function', name: 'Refraction', timing: 'assessment',
    fields: ['OD', 'OS', 'Add', 'Source'].map(label => ({ id: label.toLowerCase(), label, type: 'text' })) },
  { id: 'vf', category: 'visual', domain: 'Visual function', name: 'Visual field', timing: 'assessment',
    fields: [{ id: 'method', label: 'Test / method', type: 'text' }, ...['OD', 'OS'].map(eye => ({ id: eye.toLowerCase(), label: eye, type: 'text' })),
      { id: 'summary', label: 'Summary', type: 'textarea' }] },
  ...[{ id: 'cs', name: 'Contrast sensitivity' }, { id: 'color', name: 'Color vision' }].map(item => ({ ...item, category: 'visual', domain: 'Visual function', timing: 'assessment',
    fields: [...['OU', 'OD', 'OS'].map(eye => ({ id: eye.toLowerCase(), label: eye, type: 'text' })), { id: 'test', label: 'Test type (as recorded)', type: 'text' }] })),
  { id: 'stereo', category: 'visual', domain: 'Visual function', name: 'Stereopsis', timing: 'assessment',
    fields: [{ id: 'arcsec', label: 'Result (arcsec)', type: 'number', min: 0 }, { id: 'test', label: 'Test type (as recorded)', type: 'text' }] },
  { id: 'self_report', category: 'functional', domain: 'Functional vision', name: 'Self-report questionnaire', timing: 'milestone',
    fields: [{ id: 'questionnaire', label: 'Questionnaire', type: 'text' }, { id: 'score', label: 'Score', type: 'text' }, { id: 'findings', label: 'Key findings', type: 'textarea' }] },
  { id: 'ot_assessment', category: 'functional', domain: 'Functional vision', name: 'OT assessment', timing: 'assessment',
    fields: [{ id: 'method', label: 'Tool / method', type: 'text' }, { id: 'findings', label: 'Findings', type: 'textarea' }] },
  { id: 'daily_task', category: 'functional', domain: 'Functional vision', name: 'Daily task performance', timing: 'assessment',
    fields: [{ id: 'task', label: 'Task / measure', type: 'text' }, { id: 'performance', label: 'Performance / observation', type: 'textarea' }] },
  { id: 'participation', category: 'functional', domain: 'Functional vision', name: 'Participation needs', timing: 'assessment',
    fields: [{ id: 'needs', label: 'Needs and roles', type: 'textarea' }, { id: 'priority', label: 'Priority', type: 'text' }] }
];
const OLD_DEFAULT_NAMES = ['VOMS (Vestibular/Ocular Motor Screening)', 'Near point of convergence (NPC)', 'King-Devick test', 'DEM (Developmental Eye Movement)'];

const TRAIN = [
  { k: 'ocular', label: 'Computer-based oculomotor training',
    acts: ['Smooth pursuit tracking', 'Fixation', 'Saccades', 'Gaze stabilisation (VOR)', 'Vergence (convergence / divergence)', 'Accommodative facility', 'Anti-saccades'] },
  { k: 'periph', label: 'Peripheral awareness',
    acts: ['UFOV subtest 1 – processing speed', 'UFOV subtest 2 – divided attention', 'UFOV subtest 3 – selective attention', 'Peripheral light board', 'Central–peripheral dual task', 'Peripheral target detection', 'Peripheral cue with motor response'] },
  { k: 'attn', label: 'Visual attention',
    acts: ['Sustained attention', 'Selective attention', 'Divided attention', 'Alternating attention', 'Visual span / tachistoscope'] },
  { k: 'search', label: 'Visual search',
    acts: ['Letter / number cancellation', 'Structured visual scanning', 'Search with distractors', 'Figure-ground / visual closure', 'Reading line tracking'] }
];
const BLOCK_SUGGEST = ['Saccade task (eye tracker)', 'Fixation task (eye tracker)', 'Smooth-pursuit task (eye tracker)', 'Peripheral-stimulus task', 'Convergence (NPC) testing', 'UFOV', 'Work-related functional vision task', ...TRAIN.map(t => t.label)];
const LABELS = {
  'Oculomotor training (Sol)': '眼球動作訓練（Sol）', 'Visual perception': '視覺知覺', 'Paper-based visual exercises': '紙本視覺練習',
  'Oculomotor training (Tobii / webcam)': '眼球動作訓練（Tobii／網路攝影機）', 'Visual processing training': '視覺處理訓練', 'Home-based practice modules': '居家視覺練習模組',
  'Visual function': '視覺功能', 'Functional vision': '功能性視覺',
  'Medical record review': '病歷資料', 'Optometry record': '視光紀錄', 'OT assessment record': '職能治療評估紀錄',
  'Visual acuity': '視力', 'Near visual acuity': '近距離視力', 'Refraction': '屈光', 'Visual field': '視野',
  'Contrast sensitivity': '對比敏感度', 'Color vision': '色覺', 'Stereopsis': '立體視',
  'Self-report questionnaire': '自填問卷', 'OT assessment': '職能治療評估', 'Daily task performance': '日常作業表現', 'Participation needs': '參與需求',
  'Source / date': '來源／日期', 'Summary': '摘要', 'Chart / notation': '視力表／記法', 'Correction': '矯正狀態',
  'Uncorrected': '未矯正', 'Habitual': '慣用矯正', 'Best corrected': '最佳矯正', 'Test distance (cm)': '測驗距離（cm）',
  'Add': '近用附加度數', 'Source': '來源', 'Test / method': '測驗／方法', 'Result (arcsec)': '結果（角秒）',
  'Questionnaire': '問卷', 'Score': '分數', 'Key findings': '主要發現', 'Tool / method': '工具／方法', 'Findings': '評估發現',
  'Performance / observation': '表現／觀察', 'Needs and roles': '需求與角色', 'Priority': '優先順序',
  'Workstation setup': '工作站設置',
  'Environmental modification': '環境調整',
  'Task setup adjustment': '作業任務型態調整',
  'Scanning strategies': '掃視搜尋策略',
  'Head-turning strategies': '頭部動態調整',
  'Pacing and rest breaks': '活動節律與休息安排',
  'Home/work environment consultation': '居家／工作環境諮詢',
  'Remote task modification': '遠距作業任務調整',
  'Digital support tools': '數位輔具工具應用',
  'Self-management strategies': '自我管理策略',
  'Pacing and fatigue management': '活動節律與任務管理',
  'Stepwise task strategies': '分階段作業策略',
  'Occupational performance & satisfaction': '職能表現與滿意度',
  'Smooth pursuit (OcuTrain PURSUIT)': '平滑追視（OcuTrain PURSUIT）', 'Fixation (OcuTrain FIXATION)': '凝視（OcuTrain FIXATION）',
  'Saccade (OcuTrain SACCADE)': '跳視（OcuTrain SACCADE）', 'Vestibulo-ocular reflex (OcuTrain VOR)': '前庭眼反射（OcuTrain VOR）',
  'Vestibulo-ocular control': '前庭眼動控制',
  'UFOV subtest 1 – processing speed': 'UFOV 子測驗 1：處理速度', 'UFOV subtest 2 – divided attention': 'UFOV 子測驗 2：分散注意力',
  'UFOV subtest 3 – selective attention': 'UFOV 子測驗 3：選擇性注意力',
  'Accuracy counts the outward and return movement only; the central cross is excluded.': '正確率只計算往外與返回的移動段，不含中央十字。',
  'Accuracy counts the edge hold only; the central cross and movement are excluded.': '正確率只計算邊緣停留段，不含中央十字與移動段。',
  'Accuracy excludes the first 200 ms of each target; time to first fixation (TFF) is recorded separately.': '正確率不計每個目標的前 200 ms；首次凝視時間（TFF）另外記錄。',
  'Accuracy counts all valid tracking time while the head moves.': '正確率計算頭部轉動期間的全部有效追蹤時間。',
  'Presentation-time threshold at 80% correct from the adaptive staircase.': '以自適應階梯求得答對率 80% 的呈現時間門檻。',
  'Gaze accuracy rate (%)': '注視正確率（%）', 'On-target time (s)': '落在目標內時間（秒）', 'Valid gaze time (s)': '有效注視時間（秒）',
  'Test duration (s)': '測驗時間（秒）', 'Diplopia onset by direction (× = none)': '各方向複視起始角度（× 表示無複視）',
  'Completed targets (n)': '完成目標數', 'Mean time to first fixation (ms)': '平均首次凝視時間（ms）',
  'TFF detected targets (n)': 'TFF 偵測到的目標數', 'TFF total targets (n)': 'TFF 目標總數',
  'Test mode': '測驗模式', 'Stimulus type': '刺激種類', 'Stimulus size (arcmin)': '刺激大小（arcmin）',
  'Movement speed (arcmin/s)': '移動速度（arcmin/s）', 'Edge hold time (s)': '邊緣停留時間（秒）', 'Target dwell time (ms)': '目標停留時間（ms）',
  'Horizontal target span (arcmin)': '水平目標間距（arcmin）', 'Vertical target span (arcmin)': '垂直目標間距（arcmin）',
  'Enabled directions': '啟用方向', 'Hit distance threshold (deg)': '命中距離門檻（度）', 'Viewing distance (cm)': '觀看距離（cm）',
  'Eye tracker': '眼動儀', 'VOR multiplier (×)': 'VOR 倍率（×）', 'VOR direction': 'VOR 方向',
  'Evaluation': '評估', 'Predictable': '可預期', 'Random': '隨機', 'White dot': '白點', 'Red in White': '白圈紅心', 'Numbers dot': '數字點',
  'None': '無', 'Horizontal': '水平', 'Vertical': '垂直',
  'Threshold at 80% correct (ms)': '80% 正確門檻（ms）', 'Overall accuracy (%)': '整體正確率（%）', 'Central accuracy (%)': '中央目標正確率（%）',
  'Peripheral accuracy (%)': '周邊目標正確率（%）', 'Mean response time (ms)': '平均作答反應時間（ms）', 'Formal trials (n)': '正式題數',
  'Correct trials (n)': '答對題數', 'Fastest correct duration (ms)': '最快正確呈現時間（ms）', 'Accuracy by direction': '各方向正確率',
  'Stop condition': '終止條件', 'Adaptive 80%': '80% 自適應階梯', 'Fixed trials': '固定題數', 'Contrast (%)': '對比度（%）',
  'Peripheral eccentricity (deg)': '周邊偏心視角（度）', 'Vehicle size (deg)': '車輛大小視角（度）', 'Refresh rate (Hz)': '螢幕更新率（Hz）',
  'Fixation': '凝視', 'Saccades': '跳視', 'Gaze stabilisation (VOR)': '凝視穩定（VOR）',
  'Saccadic control': '跳視控制', 'Fixation control': '凝視控制', 'Smooth-pursuit control': '平滑追視控制',
  'Peripheral awareness': '周邊覺察', 'Basic visual function – convergence': '基本視覺功能：輻輳',
  'Basic visual function': '基本視覺功能', 'Functional vision (work related)': '工作相關功能性視覺',
  'Eye tracker – structured saccade task (computer based)': '眼動儀：結構化跳視測驗',
  'Eye tracker – fixation task (computer based)': '眼動儀：凝視測驗',
  'Eye tracker – moving-target pursuit task (computer based)': '眼動儀：移動目標追視測驗',
  'Structured peripheral-stimulus task with eye tracking (computer based)': '眼動儀：結構化周邊刺激測驗',
  'Clinical convergence assessment (NPC)': '臨床輻輳評估（NPC）',
  'Work-related functional vision task': '工作相關功能性視覺作業',
  'Gaze-shift latency (ms)': '視線轉移潛時（ms）', 'Accuracy (%)': '正確率（%）', 'Task errors (n)': '錯誤次數',
  'Fixation stability': '凝視穩定度', 'Departures from target (n)': '偏離目標次數',
  'Tracking accuracy': '追視正確率', 'Interruptions (n)': '中斷次數', 'Detection accuracy (%)': '偵測正確率（%）',
  'Response time (ms)': '反應時間（ms）', 'Fixation compliance (%)': '凝視遵從率（%）',
  'NPC break (cm)': 'NPC 分離點（cm）', 'NPC recovery (cm)': 'NPC 恢復點（cm）',
  'Positive fusional vergence (Δ)': '正融像輻輳（Δ）', 'Binocular eye-tracking measures': '雙眼眼動量測',
  'Processing speed (ms)': '處理速度（ms）', 'Divided attention (ms)': '分配性注意力（ms）',
  'Selective attention (ms)': '選擇性注意力（ms）', 'Task / measure': '作業／量測指標', 'Result': '結果',
  'Performance and satisfaction ratings for the same priority occupations; change scores': '記錄相同優先職能活動的表現、滿意度及分數變化',
  'Gaze-shift timing, accuracy and task-error measures': '記錄視線轉移時間、正確率與錯誤次數',
  'Fixation-stability and departures-from-target measures': '記錄凝視穩定度與偏離目標次數',
  'Tracking-accuracy and interruption measures': '記錄追視正確率與中斷次數',
  'Detection accuracy, response time and fixation compliance': '記錄偵測正確率、反應時間與凝視遵從率',
  'NPC, positive fusional vergence and selected binocular eye-tracking measures': '記錄 NPC、正融像輻輳與雙眼眼動指標',
  'Computer-based oculomotor training': '電腦眼球運動訓練', 'Visual attention': '視覺注意力', 'Visual search': '視覺搜尋',
  'Saccadic fixation': '跳視與凝視', 'Smooth pursuit tracking': '平滑追視',
  'Vergence (convergence / divergence)': '聚散運動（輻輳／開散）', 'Accommodative facility': '調節靈活度',
  'Anti-saccades': '反向跳視', 'Gaze stabilisation (VOR ×1)': '凝視穩定（VOR ×1）',
  'Peripheral light board': '周邊燈板', 'Central–peripheral dual task': '中央與周邊雙重作業',
  'Peripheral target detection': '周邊目標偵測', 'Useful field of view': '有效視野',
  'Peripheral cue with motor response': '周邊提示與動作反應', 'Sustained attention': '持續性注意力',
  'Selective attention': '選擇性注意力', 'Divided attention': '分配性注意力', 'Alternating attention': '交替性注意力',
  'Visual span / tachistoscope': '視覺廣度／速示訓練', 'Letter / number cancellation': '字母／數字刪除',
  'Structured visual scanning': '結構化視覺掃描', 'Search with distractors': '干擾物搜尋',
  'Figure-ground / visual closure': '圖地辨識／視覺完形', 'Reading line tracking': '閱讀行追蹤',
  'Circle': '圓形', 'Figure 8': '八字形', 'Saccade': '跳視', 'Smooth Pursuit': '平滑追視', 'Random Path': '隨機路徑',
  '30 seconds': '30 秒', '1 minute': '1 分鐘', '2 minutes': '2 分鐘', '3 minutes': '3 分鐘', 'Continuous': '持續',
  'Slow': '慢', 'Medium': '中', 'Fast': '快', 'Clockwise': '順時針', 'Counterclockwise': '逆時針',
  'On': '開啟', 'Off': '關閉', 'No': '否', 'Yes': '是',
  'Small · 8px': '小 · 8px', 'Medium · 12px': '中 · 12px', 'Large · 18px': '大 · 18px',
  'Cataract surgery (phaco + IOL)': '白內障手術（超音波乳化＋人工水晶體）',
  'LASIK': '雷射原位角膜重塑術（LASIK）', 'PRK / LASEK': '角膜表層雷射手術（PRK／LASEK）',
  'SMILE': '微創角膜透鏡取出術（SMILE）', 'ICL (implantable contact lens)': '植入式隱形眼鏡（ICL）',
  'Strabismus surgery': '斜視手術', 'Retinal detachment repair': '視網膜剝離修復', 'Vitrectomy': '玻璃體切除術',
  'Intravitreal injection(s)': '玻璃體內注射', 'Retinal laser (PRP / focal)': '視網膜雷射（PRP／局部）',
  'Glaucoma surgery (trabeculectomy / tube / MIGS)': '青光眼手術（小樑切除／引流管／MIGS）',
  'SLT / YAG laser': 'SLT／YAG 雷射', 'Corneal transplant (PK / DSAEK / DMEK)': '角膜移植（PK／DSAEK／DMEK）',
  'Corneal cross-linking': '角膜交聯術', 'Pterygium excision': '翼狀贅肉切除', 'Orbital fracture repair': '眼眶骨折修復',
  'Eyelid / ptosis surgery': '眼瞼／眼瞼下垂手術', 'Open globe repair': '開放性眼球傷修復', 'Lacrimal surgery (DCR)': '淚道手術（DCR）',
  'Distance visual acuity (source workbook)': '遠距離視力（資料表）', 'Near visual acuity (source workbook)': '近距離視力（資料表）', 'Visual field (source workbook)': '視野（資料表）',
  'Contrast sensitivity (source workbook)': '對比敏感度（資料表）', 'Color vision (source workbook)': '色覺（資料表）', 'Stereopsis (source workbook)': '立體視覺（資料表）',
  'UFOV (source workbook)': 'UFOV（資料表）', 'Other assessment results (source workbook)': '其他評估結果（資料表）', 'Source visual function assessment': '原始視覺功能評估',
  'Acuity type (as recorded)': '視力種類（原文）', 'Test distance / original entry': '測驗距離／原始記載', 'Test type (as recorded)': '測驗種類（原文）',
  'Result (as recorded)': '結果（原文）', 'Original entry': '原始記載', 'OU superior': 'OU 上',
  'OU inferior': 'OU 下', 'OU left': 'OU 左', 'OU right': 'OU 右',
  'OD superior': 'OD 上', 'OD inferior': 'OD 下', 'OD nasal': 'OD 鼻側',
  'OD temporal': 'OD 顳側', 'OS superior': 'OS 上', 'OS inferior': 'OS 下',
  'OS temporal': 'OS 顳側', 'OS nasal': 'OS 鼻側', 'UFOV processing speed': '處理速度',
  'UFOV divided attention': '分散注意', 'UFOV selective attention': '選擇注意'
};
const labelText = text => language === 'zh-TW' && Object.hasOwn(LABELS, text) ? LABELS[text] : text || '';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const val = v => v == null ? '' : esc(v);
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clone = o => JSON.parse(JSON.stringify(o));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const fmtDate = d => { if (!d) return '-'; const t = new Date(d + 'T00:00:00'); return isNaN(t) ? esc(d) : t.toLocaleDateString(language, { day: 'numeric', month: 'numeric', year: 'numeric' }); };
const nrs = v => (v === '' || v == null || isNaN(+v)) ? null : Math.max(0, Math.min(10, Math.round(+v)));
const numOrNull = v => (v === '' || v == null || isNaN(+v)) ? null : +v;
const signed = d => (d > 0 ? '+' : '') + (Math.round(d * 10) / 10);
function toast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), 6500);
}
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : systemTheme.matches;
function renderTheme() {
  const button = $('#themeToggle');
  button.textContent = isDark() ? ui('切換為淺色') : ui('切換為深色');
  button.setAttribute('aria-checked', String(isDark()));
}
systemTheme.addEventListener('change', renderTheme);
renderTheme();
let modalDismiss = null, modalFocus = null;
function modal(html, onDismiss = null) {
  const layer = $('#layer');
  if (layer.firstChild) closeModal();
  modalDismiss = onDismiss; modalFocus = document.activeElement;
  layer.innerHTML = `<div class="overlay"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  $('#languageSelect').disabled = true;
  const heading = layer.querySelector('h3');
  if (heading) { heading.id = 'dialogTitle'; layer.querySelector('.modal').setAttribute('aria-labelledby', heading.id); }
  const first = layer.querySelector('input, textarea, button'); if (first) first.focus();
  return layer.querySelector('.modal');
}
const closeModal = (result = false) => { const done = modalDismiss; modalDismiss = null; $('#layer').innerHTML = ''; $('#languageSelect').disabled = savingSession || savingItems; modalFocus?.focus(); if (done) done(result); };
document.addEventListener('keydown', e => {
  const m = $('#layer .modal'); if (!m) return;
  if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
  if (e.key === 'Tab') {
    const controls = [...m.querySelectorAll('button, input, select, textarea, a[href]')].filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }
});
function ask(message, okLabel = ui('刪除')) {
  return new Promise(res => {
    const m = modal(ui`<h3>確認操作</h3><p style="margin:0">${esc(message)}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" id="askNo">取消</button><button class="btn danger solid" id="askYes">${esc(okLabel)}</button></div>`, res);
    m.querySelector('#askNo').onclick = () => closeModal(false);
    m.querySelector('#askYes').onclick = () => closeModal(true);
  });
}

function validateAppSettings(raw) {
  const fields = PROFILE_FIELDS.map(field => field.key);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== 1 || !Array.isArray(raw.requiredFields) ||
    raw.requiredFields.some(key => typeof key !== 'string' || !fields.includes(key)) || new Set(raw.requiredFields).size !== raw.requiredFields.length) throw new Error(ui('基本資料欄位設定格式錯誤'));
  return { version: 1, requiredFields: [...raw.requiredFields] };
}
function localStore() {
  const KEY = 'vision-rehab-notes-v1';
  let mem = { clients: {}, sessions: {} };
  let raw = null;
  try { raw = localStorage.getItem(KEY); } catch (_) {}
  if (raw) mem = JSON.parse(raw);
  if ((!raw || (!Object.keys(mem.clients).length && !mem.initialRecordsLoaded)) && $('#integratedRecords')) {
    const initial = JSON.parse($('#integratedRecords').textContent);
    for (const { sessions: ss = [], ...c } of initial.clients) {
      mem.clients[c.id] = c;
      mem.sessions[c.id] = Object.fromEntries(ss.map(s => [s.id, s]));
    }
    mem.initialRecordsLoaded = true;
  }
  if ($('#integratedRecords')) {
    const initial = JSON.parse($('#integratedRecords').textContent);
    if (initial.revision && mem.initialRecordsRevision !== initial.revision) {
      for (const update of initial.updates || []) {
        const c = mem.clients[update.id]; if (!c) continue;
        for (const [field, value] of Object.entries(update.after)) {
          if (JSON.stringify(c[field]) === JSON.stringify(update.before[field])) c[field] = clone(value);
        }
      }
      mem.initialRecordsRevision = initial.revision;
      try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (_) {}
    }
  }
  const persist = change => { const next = clone(mem); change(next); localStorage.setItem(KEY, JSON.stringify(next)); mem = next; };
  return {
    kind: 'local',
    async getSettings() { return validateAppSettings(mem.settings === undefined ? DEFAULT_APP_SETTINGS : mem.settings); },
    async saveSettings(settings) { const next = validateAppSettings(settings); persist(m => { m.settings = next; }); },
    async listClients() { return Object.values(mem.clients); },
    async saveClient(c) { persist(m => { m.clients[c.id] = clone(c); }); },
    async deleteClient(cid) { persist(m => { delete m.clients[cid]; delete m.sessions[cid]; }); },
    async listSessions(cid) { return Object.values(mem.sessions[cid] || {}); },
    async saveSession(cid, s) { persist(m => { (m.sessions[cid] = m.sessions[cid] || {})[s.id] = clone(s); }); },
    async deleteSession(cid, sid) { persist(m => { if (m.sessions[cid]) delete m.sessions[cid][sid]; }); }
  };
}
// clients.csv is the roster; legacy client.json and session JSON remain readable.
function idbOpen() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('vision-rehab-notes', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
async function idbGet(k) {
  try { const db = await idbOpen(); return await new Promise(res => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }); }
  catch (e) { return null; }
}
async function idbSet(k, v) {
  try { const db = await idbOpen(); await new Promise(res => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = res; tx.onerror = res; }); }
  catch (e) {}
}
const safeName = s => {
  let name = String(s || '').normalize('NFC').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim().slice(0, 80).replace(/[. ]+$/, '') || 'client';
  return /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name) ? '_' + name : name;
};
async function readJSON(dir, name) {
  try { const fh = await dir.getFileHandle(name); return JSON.parse((await (await fh.getFile()).text()).replace(/^\ufeff/, '')); }
  catch (e) { if (e.name === 'NotFoundError') return null; throw new Error(ui`無法讀取 ${dir.name + '/' + name}: ${e.message || e}`); }
}
async function writeFile(dir, name, data) {
  const fh = await dir.getFileHandle(name, { create: true }); const w = await fh.createWritable();
  try { await w.write(data); await w.close(); }
  catch (e) { try { await w.abort(); } catch (_) {} throw e; }
}
async function writeSessionPair(dir, base, csv, pdf, txt) {
  const files = [[base + '.pdf', pdf], ...(txt == null ? [] : [[base + '.txt', txt]]), [base + '.csv', csv]], before = new Map(), attempted = [];
  for (const [name] of files) {
    try {
      const file = await (await dir.getFileHandle(name)).getFile();
      before.set(name, new Blob([await file.arrayBuffer()], { type: file.type }));
    }
    catch (e) { if (e.name !== 'NotFoundError') throw e; before.set(name, null); }
  }
  try {
    for (const [name, data] of files) { attempted.push(name); await writeFile(dir, name, data); }
  } catch (error) {
    let restored = true;
    for (const name of attempted) {
      try { if (before.get(name)) await writeFile(dir, name, before.get(name)); else await dir.removeEntry(name); }
      catch (e) { if (e.name !== 'NotFoundError' || before.get(name)) restored = false; }
    }
    throw new Error(`${error.message || error}${restored ? ui('；未完成的寫入已還原，請重試。') : ui('；請檢查此筆 CSV 與 PDF 是否完整後重試。')}`);
  }
}
function sessionCSV(client, session) {
  const rows = [['schema_version', 'section', 'field', 'type', 'value']];
  const walk = (section, path, value) => {
    const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    if (type === 'undefined') return;
    let text = type === 'object' || type === 'array' || type === 'null' ? '' : String(value);
    // Excel must treat user text as text; the reader removes this reversible prefix.
    if (type === 'string' && (/^[\s]*[=+\-@']/.test(text) || /^[\t\r\n]/.test(text))) text = "'" + text;
    rows.push(['1', section, path, type, text]);
    if (type === 'object' || type === 'array') {
      for (const [key, child] of Object.entries(value)) walk(section, path + '/' + key.replace(/~/g, '~0').replace(/\//g, '~1'), child);
    }
  };
  walk('client', '', client); walk('session', '', session);
  const cell = value => /[",\r\n]/.test(value) ? '"' + value.replace(/"/g, '""') + '"' : value;
  return '\ufeff' + rows.map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}
function parseCSV(text) {
  text = text.replace(/^\ufeff/, '');
  const rows = []; let row = [], cell = '', quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; } }
      else cell += char;
    } else if (char === ',' || char === '\r' || char === '\n') {
      row.push(cell); cell = ''; closed = false;
      if (char !== ',') { if (char === '\r' && text[i + 1] === '\n') i++; rows.push(row); row = []; }
    } else if (char === '"' && !cell && !closed) quoted = true;
    else { if (closed || char === '"') throw new Error(ui('CSV 引號格式錯誤')); cell += char; }
  }
  if (quoted) throw new Error(ui('CSV 欄位缺少結束引號'));
  if (cell || closed || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const CLIENT_COLUMNS = ['schema_version', 'id', 'folder', 'name', 'ref', 'dob', 'doi', 'dx', 'referral', 'eye_surgery', 'assessment_plan', 'training_plan', 'legacy_templates', 'created', 'extra_fields'];
function clientsCSV(rows) {
  const cell = value => {
    let text = String(value ?? '');
    if (/^[\s]*[=+\-@']/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
    return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  };
  return '\ufeff' + [CLIENT_COLUMNS, ...rows.map(({ client: c, folder }) => {
    const { id, name, ref, dob, doi, dx, referral, eyeSurgery, plan, trainingPlan, legacyTemplates, created, ...extra } = c;
    return ['1', id, folder, name, ref, dob, doi, dx, referral, JSON.stringify(eyeSurgery ?? null), JSON.stringify(plan), JSON.stringify(trainingPlan ?? null), JSON.stringify(legacyTemplates ?? null), created, JSON.stringify(extra)];
  })].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}
function readClientsCSV(text) {
  const rows = parseCSV(text), header = rows.shift(), ids = new Set(), folders = new Set();
  if (header?.join(',') !== CLIENT_COLUMNS.join(',')) throw new Error(ui('clients.csv 欄位格式不正確'));
  return rows.filter(row => !(row.length === 1 && row[0] === '')).map(row => {
    if (row.length !== CLIENT_COLUMNS.length) throw new Error(ui('clients.csv 欄位數量不正確'));
    const [version, id, folder, name, ref, dob, doi, dx, referral, eye, plan, training, legacy, created, extra] = row.map(value => value.startsWith("'") ? value.slice(1) : value);
    if (version !== '1' || !folder || /[/\\\x00-\x1f]/.test(folder) || ['.', '..'].includes(folder) || ids.has(id) || folders.has(folder.toLocaleLowerCase())) throw new Error(ui('clients.csv 含有不合法或重複的個案／資料夾'));
    const other = JSON.parse(extra);
    if (!other || typeof other !== 'object' || Array.isArray(other)) throw new Error(ui('clients.csv 額外資訊格式錯誤'));
    const client = { ...other, id, name, ref, dob, doi, dx, referral, eyeSurgery: JSON.parse(eye), plan: JSON.parse(plan), created };
    if (training !== 'null') client.trainingPlan = JSON.parse(training);
    if (legacy !== 'null') client.legacyTemplates = JSON.parse(legacy);
    validateRecord(client, { id: 'validation', date: today(), visit: 'treatment', sym: [], assess: {}, training: {} });
    ids.add(id); folders.add(folder.toLocaleLowerCase());
    return { client, folder };
  });
}
function readRecordCSV(text) {
  const rows = parseCSV(text), header = rows.shift();
  if (header?.join(',') !== 'schema_version,section,field,type,value') throw new Error(ui('這不是 EzEMR 的 CSV 紀錄'));
  const record = {}, seen = new Set();
  for (const row of rows) {
    if (row.length === 1 && row[0] === '') continue;
    const [version, section, path, type, raw] = row;
    if (row.length !== 5 || version !== '1' || !['client', 'session'].includes(section)) throw new Error(ui('CSV 版本或欄位格式錯誤'));
    const key = section + ':' + path;
    if (seen.has(key)) throw new Error(ui('CSV 含有重複欄位'));
    seen.add(key);
    let value;
    if (type === 'object') value = {};
    else if (type === 'array') value = [];
    else if (type === 'null') value = null;
    else if (type === 'boolean' && /^(true|false)$/.test(raw)) value = raw === 'true';
    else if (type === 'number' && raw.trim() !== '' && Number.isFinite(Number(raw))) value = Number(raw);
    else if (type === 'string') value = raw.startsWith("'") ? raw.slice(1) : raw;
    else throw new Error(ui('CSV 資料型別錯誤'));
    if (path === '') { if (type !== 'object') throw new Error(ui('CSV 根節點必須為物件')); record[section] = value; continue; }
    if (!path.startsWith('/')) throw new Error(ui('CSV 欄位路徑錯誤'));
    const parts = path.slice(1).split('/').map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'));
    let parent = record[section];
    for (const part of parts.slice(0, -1)) {
      if (!parent || !Object.hasOwn(parent, part)) throw new Error(ui('CSV 缺少上層欄位'));
      parent = parent[part];
    }
    if (!parent || typeof parent !== 'object') throw new Error(ui('CSV 上層欄位格式錯誤'));
    const last = parts[parts.length - 1];
    if (Array.isArray(parent) && (!/^(0|[1-9]\d*)$/.test(last) || Number(last) > 100000)) throw new Error(ui('CSV 陣列索引錯誤'));
    Object.defineProperty(parent, last, { value, enumerable: true, writable: true, configurable: true });
  }
  validateRecord(record.client, record.session);
  return record;
}
function validateItems(items, kind) {
  const id = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value) && !['__proto__', 'constructor', 'prototype'].includes(value);
  const used = new Set();
  if (!Array.isArray(items)) throw new Error(ui('項目模板必須為清單'));
  for (const item of items) {
    if (!item || typeof item !== 'object') throw new Error(ui('項目模板格式錯誤'));
    const key = itemKey(item, kind), name = kind === 'assessment' ? item.name : item.label;
    if (!id(key) || used.has(key) || typeof name !== 'string' || !name.trim()) throw new Error(ui('項目名稱或識別碼格式錯誤'));
    used.add(key);
    if (kind === 'assessment' && (!Object.hasOwn(TIMING, item.timing || 'assessment') || (item.copm && key !== 'copm'))) throw new Error(ui('評估時機或 COPM 模板格式錯誤'));
    if (kind === 'assessment' && item.category !== undefined && !['visual', 'functional'].includes(item.category)) throw new Error(ui('評估分類必須為視覺功能或功能性視覺。'));
    if (kind === 'training' && (item.acts != null && (!Array.isArray(item.acts) || item.acts.some(a => typeof a !== 'string')))) throw new Error(ui('復健活動清單格式錯誤'));
    if (item.fields != null && !Array.isArray(item.fields)) throw new Error(ui('結果欄位格式錯誤'));
    const fieldIds = new Set();
    for (const field of item.fields || []) {
      if (typeof field === 'string') { if (fieldIds.has(field)) throw new Error(ui('結果欄位重複')); fieldIds.add(field); continue; }
      if (!field || typeof field.id !== 'string' || !field.id.trim() || field.id.length > 240 || fieldIds.has(field.id) || typeof field.label !== 'string' || !field.label.trim() || !Object.hasOwn(FIELD_TYPES, field.type) || (field.unit != null && typeof field.unit !== 'string')) throw new Error(ui('結果欄位名稱或類型格式錯誤'));
      fieldIds.add(field.id);
      if (field.type === 'number' && (['min', 'max', 'step'].some(prop => field[prop] != null && (typeof field[prop] !== 'number' || !Number.isFinite(field[prop]))) || (field.min != null && field.max != null && field.min > field.max) || (field.step != null && field.step <= 0))) throw new Error(ui('請確認數值範圍：最小值不可大於最大值，間隔須大於 0。'));
      if (field.type === 'select' && (!Array.isArray(field.options) || !field.options.length || field.options.some(option => typeof option !== 'string' || !option.trim()))) throw new Error(ui('選單至少需要一個非空白選項。'));
    }
  }
}
// Strategy labels use the same bilingual LABELS catalog as the built-in training items.
const INTERVENTIONS = {
  inperson: {
    adaptation: { workstation_setup: 'Workstation setup', environment_mod: 'Environmental modification', task_setup: 'Task setup adjustment' },
    compensation: { scanning: 'Scanning strategies', head_turning: 'Head-turning strategies', pacing_rest: 'Pacing and rest breaks' }
  },
  telerehab: {
    adaptation: { env_consult: 'Home/work environment consultation', remote_task: 'Remote task modification', digital_tools: 'Digital support tools' },
    compensation: { self_management: 'Self-management strategies', pacing_fatigue: 'Pacing and fatigue management', stepwise: 'Stepwise task strategies' }
  }
};
function serviceModeLabel(mode) { return mode === 'inperson' ? ui('面對面') : mode === 'telerehab' ? ui('遠距復健') : ui('未指定'); }
function approachLabel(approach) { return approach === 'adaptation' ? ui('調適') : ui('代償'); }
function strategyLabel(approach, id) {
  for (const catalog of Object.values(INTERVENTIONS)) if (Object.hasOwn(catalog[approach], id)) return labelText(catalog[approach][id]);
  return id;
}
function validateRecord(c, s) {
  const id = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value) && !['__proto__', 'constructor', 'prototype'].includes(value);
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const optionalText = value => value == null || typeof value === 'string';
  if (!object(c) || !id(c.id) || typeof c.name !== 'string' || !optionalText(c.ref) || !Array.isArray(c.plan)) throw new Error(ui('個案基本資料或評估計畫格式錯誤'));
  if (PROFILE_FIELDS.some(field => !optionalText(c[field.key]))) throw new Error(ui('個案基本資料欄位格式錯誤'));
  validateItems(c.plan, 'assessment');
  if (c.trainingPlan != null) validateItems(c.trainingPlan, 'training');
  if (c.legacyTemplates != null) { validateItems(c.legacyTemplates.assessment, 'assessment'); validateItems(c.legacyTemplates.training, 'training'); }
  if (!object(s) || !id(s.id) || typeof s.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s.date) ||
    !VISITS.some(v => v.k === s.visit) || !Array.isArray(s.sym) || !object(s.assess) || !object(s.training)) throw new Error(ui('復健紀錄缺少有效的日期、類型或評估資料'));
  if ([...Object.keys(s.assess), ...Object.keys(s.training)].some(key => !id(key))) throw new Error(ui('評估或復健項目識別碼格式錯誤'));
  if (s.mode != null && !['inperson', 'telerehab'].includes(s.mode)) throw new Error(ui('服務型態格式錯誤'));
  if (s.peo != null && (!object(s.peo) || ['person', 'environment', 'occupation'].some(key => s.peo[key] !== undefined && typeof s.peo[key] !== 'string'))) throw new Error(ui('PEO 架構欄位格式錯誤'));
  if (s.interventions != null) {
    if (!object(s.interventions)) throw new Error(ui('介入策略欄位格式錯誤'));
    for (const key of ['adaptation', 'compensation']) {
      const d = s.interventions[key];
      if (d != null && (!object(d) || !Array.isArray(d.picks) || d.picks.some(pick => !id(pick)) || (d.notes !== undefined && typeof d.notes !== 'string'))) throw new Error(ui('介入策略欄位格式錯誤'));
    }
  }
  if (s.clinicalLinks !== undefined) {
    const used = new Set();
    if (!Array.isArray(s.clinicalLinks) || s.clinicalLinks.length > 100) throw new Error(ui('臨床連結欄位格式錯誤'));
    for (const link of s.clinicalLinks) {
      if (!object(link) || !id(link.id) || used.has(link.id) || !['visual', 'functional'].includes(link.category) ||
        ['symptom', 'reasoning', 'evidenceNotes', 'interventionNotes'].some(key => typeof link[key] !== 'string') || (s.visit !== 'absent' && !link.symptom.trim()) ||
        !Array.isArray(link.peo) || link.peo.some(key => !['person', 'environment', 'occupation'].includes(key)) ||
        ['evidence', 'interventions'].some(key => !Array.isArray(link[key]) || link[key].some(value => !id(value)))) throw new Error(ui('臨床連結欄位格式錯誤'));
      used.add(link.id);
    }
  }
  if (s.assessmentPlan != null) validateItems(s.assessmentPlan, 'assessment');
  if (s.trainingPlan != null) validateItems(s.trainingPlan, 'training');
  for (const key of ['subjective', 'objective', 'feedback', 'otherTx', 'assessment', 'plan', 'clinician', 'nextDate']) if (!optionalText(s[key])) throw new Error(ui('病歷文字欄位格式錯誤'));
  if (typeof s.tolerance === 'string') {
    const tolerance = s.tolerance.trim();
    if (!tolerance) s.tolerance = null;
    else if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(tolerance)) s.tolerance = Number(tolerance);
  }
  if (s.tolerance != null && (typeof s.tolerance !== 'number' || !Number.isFinite(s.tolerance) || s.tolerance < 0 || s.tolerance > 10)) throw new Error(ui('耐受度須為 0 至 10 的數字'));
  for (const [key, message] of [['duration', ui('復健時間須為 0 以上的數字')], ['num', ui('復健次數須為 0 以上的數字')]]) {
    if (typeof s[key] === 'string') {
      const value = s[key].trim();
      if (!value) s[key] = null;
      else if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) s[key] = Number(value);
    }
    if (s[key] != null && (typeof s[key] !== 'number' || !Number.isFinite(s[key]) || s[key] < 0)) throw new Error(message);
  }
  for (const row of s.sym) {
    if (!object(row) || !id(row.id) || typeof row.kind !== 'string' || !object(row.scores) ||
      Object.values(row.scores).some(v => v != null && (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 10)) ||
      (row.recMin != null && (typeof row.recMin !== 'number' || !Number.isFinite(row.recMin) || row.recMin < 0))) throw new Error(ui('症狀評分格式錯誤'));
  }
  for (const a of Object.values(s.assess)) if (!object(a) || (a.copm != null && (!Array.isArray(a.copm) || a.copm.some(r => !object(r) || !optionalText(r.occ) ||
    [r.perf, r.sat].some(v => v != null && (typeof v !== 'number' || !Number.isFinite(v) || v < 1 || v > 10)))))) throw new Error(ui('評估結果格式錯誤'));
  for (const t of trainingItems(c, s)) {
    const d = s.training[t.k]; if (!d) continue;
    if (!object(d) || ['dur', 'diff'].some(key => d[key] != null && (typeof d[key] !== 'number' || !Number.isFinite(d[key]) || d[key] < 0 || (key === 'diff' && d[key] > 10))) ||
      (d.acts != null && (!Array.isArray(d.acts) || d.acts.some(a => typeof a !== 'string'))) ||
      (d.actScores != null && (!object(d.actScores) || Object.values(d.actScores).some(v => typeof v !== 'string' && !(typeof v === 'number' && Number.isFinite(v))))) ||
      (d.eyedot != null && (!Array.isArray(d.eyedot) || d.eyedot.some(r => !object(r) || !id(r.id) ||
        (r.count != null && (typeof r.count !== 'number' || !Number.isFinite(r.count) || r.count < 0))))) ||
      (d.runs != null && (!Array.isArray(d.runs) || d.runs.some(r => !object(r) || !id(r.id) || !id(r.item) || !optionalText(r.time) || !optionalText(r.file) ||
        !object(r.values) || Object.values(r.values).some(v => typeof v !== 'string' && !(typeof v === 'number' && Number.isFinite(v))))))) throw new Error(ui('訓練紀錄格式錯誤'));
  }
  for (const item of [...assessmentItems(c, s), ...trainingItems(c, s)]) {
    const values = (item.id ? s.assess[item.id] : s.training[item.k])?.values;
    if (values == null) continue;
    if (!object(values) || Object.values(values).some(value => value != null && typeof value !== 'string' && !(typeof value === 'number' && Number.isFinite(value)))) throw new Error(ui('自訂結果欄位格式錯誤'));
  }
}
async function sessionPDF(c, s, list = sessions) {
  const width = 1190, height = 1684, margin = 80, lineHeight = language === 'en' ? 36 : 40;
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error(ui('無法建立 PDF，瀏覽器不支援 Canvas'));
  const font = getComputedStyle(document.body).fontFamily;
  // Noto Sans TC is optional; when it cannot load, the canvas uses the fallback fonts instead of failing the save.
  await document.fonts.load('24px "Noto Sans TC"').catch(() => {});
  ctx.font = `24px ${font}`;
  const lines = [];
  for (const source of noteText(c, s, list).split(/\r\n|\n|\r/)) {
    if (!source) { lines.push(''); continue; }
    let line = '';
    for (const char of source) {
      if (line && ctx.measureText(line + char).width > width - margin * 2) {
        const space = line.lastIndexOf(' ');
        if (space > line.length / 2) { lines.push(line.slice(0, space)); line = line.slice(space + 1); }
        else { lines.push(line); line = ''; }
      }
      line += char === '\t' ? '    ' : char;
    }
    lines.push(line);
  }
  const perPage = Math.floor((height - 230) / lineHeight), pageCount = Math.max(1, Math.ceil(lines.length / perPage)), images = [];
  for (let page = 0; page < pageCount; page++) {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#176b65'; ctx.font = `bold 34px ${font}`; ctx.fillText(ui('EzEMR · 復健紀錄'), margin, 66);
    ctx.strokeStyle = '#245f93'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(margin, 91); ctx.lineTo(width - margin, 91); ctx.stroke();
    ctx.fillStyle = '#16232b'; ctx.font = `24px ${font}`;
    const chunk = lines.slice(page * perPage, (page + 1) * perPage);
    chunk.forEach((line, i) => ctx.fillText(line, margin, 133 + i * lineHeight));
    ctx.fillStyle = '#5a6b76'; ctx.font = `20px ${font}`;
    ctx.fillText(`${s.date} · ${c.ref || c.name}`, margin, height - 52, width - margin * 2 - 170);
    ctx.textAlign = 'right'; ctx.fillText(`${page + 1} / ${pageCount}`, width - margin, height - 52); ctx.textAlign = 'left';
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .94));
    if (!blob) throw new Error(ui('PDF 頁面建立失敗'));
    images.push(new Uint8Array(await blob.arrayBuffer()));
  }
  // Raster pages preserve Chinese glyphs on PDF readers without the font installed.
  const encode = text => new TextEncoder().encode(text), chunks = [], offsets = [0]; let length = 0;
  const push = part => { const bytes = typeof part === 'string' ? encode(part) : part; chunks.push(bytes); length += bytes.length; };
  const object = (id, parts) => { offsets[id] = length; push(`${id} 0 obj\n`); for (const part of parts) push(part); push('\nendobj\n'); };
  push('%PDF-1.4\n');
  object(1, ['<< /Type /Catalog /Pages 2 0 R >>']);
  object(2, [`<< /Type /Pages /Count ${images.length} /Kids [${images.map((_, i) => `${3 + i * 3} 0 R`).join(' ')}] >>`]);
  images.forEach((bytes, i) => {
    const id = 3 + i * 3, content = 'q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ';
    object(id, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${id + 1} 0 R >> >> /Contents ${id + 2} 0 R >>`]);
    object(id + 1, [`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`, bytes, '\nendstream']);
    object(id + 2, [`<< /Length ${encode(content).length} >>\nstream\n${content}\nendstream`]);
  });
  const xref = length;
  push(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  for (const offset of offsets.slice(1)) push(`${String(offset).padStart(10, '0')} 00000 n \n`);
  push(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(chunks, { type: 'application/pdf' });
}
async function sessionZIP(c, s, list = sessions) {
  const base = sessionBaseName(s), prefix = safeName(c.ref || c.name || c.id) + '/', encoder = new TextEncoder();
  const files = [[prefix + base + '.csv', new Blob([sessionCSV(c, s)])], [prefix + base + '.pdf', await sessionPDF(c, s, list)]];
  const chunks = [], central = []; let offset = 0, centralSize = 0;
  const crc32 = bytes => { let crc = -1; for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ -1) >>> 0; };
  for (const [filename, blob] of files) {
    const member = filename.slice(prefix.length);
    if (!filename.startsWith(prefix) || !member || /[/\\\x00-\x1f\x7f-\x9f]/.test(member) || ['.', '..'].includes(member)) throw new Error(ui('ZIP 檔案名稱不合法'));
    const name = encoder.encode(filename), bytes = new Uint8Array(await blob.arrayBuffer()), crc = crc32(bytes);
    const local = new Uint8Array(30), lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x800, true); lv.setUint16(12, 33, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, bytes.length, true); lv.setUint32(22, bytes.length, true); lv.setUint16(26, name.length, true);
    chunks.push(local, name, bytes);
    const entry = new Uint8Array(46), cv = new DataView(entry.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x800, true); cv.setUint16(14, 33, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, bytes.length, true); cv.setUint32(24, bytes.length, true); cv.setUint16(28, name.length, true); cv.setUint32(42, offset, true);
    central.push(entry, name); centralSize += entry.length + name.length; offset += local.length + name.length + bytes.length;
  }
  const end = new Uint8Array(22), ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true); ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true);
  return new Blob([...chunks, ...central, end], { type: 'application/zip' });
}
function sessionNumberName(value) {
  const numeric = typeof value === 'number' || (typeof value === 'string' && value === value.trim() && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value));
  return numeric && Number.isFinite(Number(value)) && Number(value) >= 0 ? String(value).padStart(2, '0') : '00';
}
function sessionBaseName(s) { return `${s.date || 'undated'}_S${sessionNumberName(s.num)}_${safeName(visitLabel(s.visit)).replace(/\s+/g, '-')}`; }
async function removeQuiet(dir, name) { try { await dir.removeEntry(name); } catch (e) {} }
async function fileNames(dir) { const out = []; for await (const [n, h] of dir.entries()) if (h.kind === 'file') out.push(n); return out; }
// In the copy folder, remove only the files this app wrote; the folder itself goes only if nothing else is left in it.
async function removeOwnFiles(r, dirName, names) {
  let d; try { d = await r.getDirectoryHandle(dirName); } catch (e) { return; }
  for (const n of names) await removeQuiet(d, n);
  try { await r.removeEntry(dirName); } catch (e) {}
}
async function copyDir(src, dst) { for await (const [n, h] of src.entries()) if (h.kind === 'file') await writeFile(dst, n, await h.getFile()); }
/* Every write, rename and delete in the main folder is repeated in the selected local copy folder. */
let copyRoot = null, pendingCopy = null, copyWarned = 0, copyLastError = '';
async function mirror(fn) {
  copyLastError = '';
  if (!copyRoot) return;
  try { await fn(copyRoot); }
  catch (e) { copyLastError = ui`主資料夾已儲存，但副本「${copyRoot.name}」未更新：${e.message || e}`; if (Date.now() - copyWarned > 5000) { copyWarned = Date.now(); toast(copyLastError); } }
}
function folderStore(root) {
  const clientDir = {};   // client id -> folder name
  const sessFile = {};    // client id -> { session id -> file base name }
  const sessCache = {};   // client id -> { session id -> record }, so notes compare with that client's own sessions
  const legacyFiles = {};
  const known = {};       // client id -> latest client record, for the .txt notes
  const dirOf = cid => root.getDirectoryHandle(clientDir[cid]);
  const readRoster = async () => {
    let file;
    try { file = await root.getFileHandle('clients.csv'); }
    catch (e) { if (e.name === 'NotFoundError') return null; throw e; }
    return readClientsCSV(await (await file.getFile()).text());
  };
  const writeRoster = async rows => {
    const csv = clientsCSV(rows);
    await writeFile(root, 'clients.csv', csv);
    await mirror(r => writeFile(r, 'clients.csv', csv));
  };
  return {
    kind: 'folder', root,
    async getSettings() { const raw = await readJSON(root, 'settings.json'); return validateAppSettings(raw === null ? DEFAULT_APP_SETTINGS : raw); },
    async saveSettings(settings) {
      const text = JSON.stringify(validateAppSettings(settings), null, 2) + '\n';
      await writeFile(root, 'settings.json', text);
      await mirror(r => writeFile(r, 'settings.json', text));
    },
    async listClients() {
      for (const id of Object.keys(known)) { delete known[id]; delete clientDir[id]; }
      const roster = await readRoster();
      if (roster) {
        for (const { client: c, folder } of roster) { clientDir[c.id] = folder; known[c.id] = c; }
        return roster.map(row => row.client);
      }
      const out = [];
      for await (const [name, h] of root.entries()) {
        if (h.kind !== 'directory') continue;
        const c = await readJSON(h, 'client.json');
        if (c && c.id) {
          c.plan = normalizePlan(c.plan);
          try { validateRecord(c, { id: 'validation', date: today(), visit: 'treatment', sym: [], assess: {}, training: {} }); }
          catch (e) { throw new Error(ui`無法讀取 ${name + '/client.json'}: ${e.message}`); }
          clientDir[c.id] = name; known[c.id] = c; out.push(c);
        }
      }
      return out;
    },
    async saveClient(c) {
      validateRecord(c, { id: 'validation', date: today(), visit: 'treatment', sym: [], assess: {}, training: {} });
      await this.listClients();
      const roster = await readRoster() || Object.values(known).map(client => ({ client, folder: clientDir[client.id] }));
      // An existing client keeps its folder (named by case number); only a new client gets one from its 病歷號.
      const had = clientDir[c.id], want = had || safeName(c.ref || c.id);
      if (roster.some(row => row.client.id !== c.id && row.folder.toLocaleLowerCase() === want.toLocaleLowerCase())) throw new Error(ui('病歷號已被其他個案使用。'));
      if (!had) {
        let exists = null; try { exists = await root.getDirectoryHandle(want); } catch (e) {}
        if (exists) {
          const other = await readJSON(exists, 'client.json');
          let occupied = false; for await (const entry of exists.entries()) { occupied = true; break; }
          if (occupied && (!other || other.id !== c.id)) throw new Error(ui`資料夾「${want}」已存在，請使用不同的病歷號，以免混入其他人的資料。`);
        }
        await root.getDirectoryHandle(want, { create: true });
      }
      await writeRoster([...roster.filter(row => row.client.id !== c.id), { client: c, folder: want }]);
      clientDir[c.id] = want;
      known[c.id] = clone(c);
      await mirror(r => r.getDirectoryHandle(want, { create: true }));
    },
    async deleteClient(cid) {
      const name = clientDir[cid];
      const roster = await readRoster() || Object.values(known).map(client => ({ client, folder: clientDir[client.id] }));
      await writeRoster(roster.filter(row => row.client.id !== cid));
      if (name) {
        let own;
        try {
          own = await fileNames(await root.getDirectoryHandle(name));
          await root.removeEntry(name, { recursive: true });
        } catch (error) { await writeRoster(roster); throw error; }
        await mirror(r => removeOwnFiles(r, name, own));
      }
      delete clientDir[cid]; delete sessFile[cid]; delete sessCache[cid]; delete known[cid];
    },
    async listSessions(cid) {
      if (!clientDir[cid]) return [];
      const d = await dirOf(cid), map = {}, cache = {}, legacy = {}, csvRecords = [];
      for await (const [n, h] of d.entries()) {
        if (h.kind !== 'file') continue;
        if (n.endsWith('.csv')) {
          const text = await (await h.getFile()).text();
          if (!text.replace(/^\ufeff/, '').startsWith('schema_version,section,field,type,value')) continue;
          try {
            const record = readRecordCSV(text);
            if (record.client.id !== cid) throw new Error(ui('CSV 的個案與所在資料夾不一致'));
            csvRecords.push({ name: n, session: record.session });
          } catch (e) { throw new Error(ui`無法讀取 ${n}: ${e.message}`); }
          continue;
        }
        if (!n.endsWith('.json') || n === 'client.json') continue;
        const data = await readJSON(d, n);
        if (!data || !data.id) continue;
        const s = { sym: [], assess: {}, training: {}, visit: 'treatment', ...data };
        try { validateRecord(known[cid], s); }
        catch (e) { throw new Error(ui`無法讀取 ${n}: ${e.message}`); }
        (legacy[s.id] ||= []).push(n.slice(0, -5));
        // a leftover copy of a renamed session can share its id (e.g. after syncing): keep the most recently saved one
        if (cache[s.id] && String(cache[s.id].updated || '') > String(s.updated || '')) continue;
        map[s.id] = n.slice(0, -5); cache[s.id] = s;
      }
      const csvSeen = new Set();
      for (const { name, session: s } of csvRecords) {
        if (csvSeen.has(s.id)) throw new Error(ui`重複的復健紀錄：${name}`);
        csvSeen.add(s.id);
        map[s.id] = name.slice(0, -4); cache[s.id] = s;
      }
      sessFile[cid] = map; sessCache[cid] = cache; legacyFiles[cid] = legacy;
      return Object.values(cache);
    },
    async saveSession(cid, s) {
      if (!sessCache[cid]) await this.listSessions(cid);
      const d = await dirOf(cid), map = sessFile[cid] = sessFile[cid] || {}, cache = sessCache[cid] = sessCache[cid] || {};
      const c = known[cid] || clients.find(x => x.id === cid);
      const list = [...Object.values(cache).filter(x => x.id !== s.id), s];
      const base = map[s.id] || sessionBaseName(s);
      const taken = new Set(Object.entries(map).filter(([id]) => id !== s.id).map(([, b]) => b));
      for (const name of await fileNames(d)) if (/\.(csv|pdf|txt)$/.test(name) && name.slice(0, -4) !== map[s.id]) taken.add(name.slice(0, -4));
      let b = base, i = 2; while (taken.has(b)) b = base + '_' + (i++);
      const old = map[s.id];
      // The .txt beside each CSV/PDF is the same note as plain text; rewrite it so it never goes stale.
      const csv = sessionCSV(c, s), pdf = await sessionPDF(c, s, list), txt = noteText(c, s, list);
      await writeSessionPair(d, b, csv, pdf, txt);
      const stale = old && old !== b ? [old + '.csv', old + '.pdf', old + '.txt'] : [];
      for (const n of stale) await removeQuiet(d, n);
      map[s.id] = b; cache[s.id] = clone(s);
      const dirName = clientDir[cid];
      await mirror(async r => {
        const md = await r.getDirectoryHandle(dirName, { create: true });
        await writeSessionPair(md, b, csv, pdf, txt);
        for (const n of stale) await removeQuiet(md, n);
      });
    },
    sessionBase(cid, sid) { return (sessFile[cid] || {})[sid]; },
    folderOf(cid) { return clientDir[cid]; },
    async writeExport(cid, name, blob) {
      const d = cid ? await dirOf(cid) : root;
      await writeFile(d, name, blob);
      const dirName = cid ? clientDir[cid] : null;
      await mirror(async r => writeFile(dirName ? await r.getDirectoryHandle(dirName, { create: true }) : r, name, blob));
      return cid ? clientDir[cid] : root.name;
    },
    async deleteSession(cid, sid) {
      const d = await dirOf(cid), b = (sessFile[cid] || {})[sid];
      if (b) {
        const bases = new Set([b, ...(legacyFiles[cid]?.[sid] || [])]);
        const names = [...bases].flatMap(base => ['.csv', '.pdf', '.json', '.txt', '.xlsx'].map(ext => base + ext));
        for (const n of names) { try { await d.removeEntry(n); } catch (e) { if (e.name !== 'NotFoundError') throw e; } }
        const dirName = clientDir[cid];
        await mirror(async r => { let md; try { md = await r.getDirectoryHandle(dirName); } catch (e) { return; } for (const n of names) await removeQuiet(md, n); });
        delete sessFile[cid][sid]; if (sessCache[cid]) delete sessCache[cid][sid];
      }
    },
    // copy every client folder into the copy folder (used when the copy folder is first connected)
    async syncCopy() {
      if (!copyRoot) return 0;
      let n = 0;
      for (const c of await this.listClients()) {
        const name = clientDir[c.id], h = await root.getDirectoryHandle(name);
        await copyDir(h, await copyRoot.getDirectoryHandle(name, { create: true })); n++;
      }
      await writeFile(copyRoot, 'clients.csv', clientsCSV(Object.values(known).map(client => ({ client, folder: clientDir[client.id] }))));
      await writeFile(copyRoot, 'settings.json', JSON.stringify(await this.getSettings(), null, 2) + '\n');
      return n;
    }
  };
}
async function loadCopyHandle() {
  copyRoot = null; pendingCopy = null;
  if (store.root.deferred) return;
  const h = await idbGet('copy');
  if (!h) return;
  // the main folder can never also be its own copy folder (e.g. after switching the main folder to the old copy)
  try { if (await h.isSameEntry(store.root)) { await idbSet('copy', null); return; } } catch (e) {}
  try { if (await h.queryPermission({ mode: 'readwrite' }) === 'granted') { copyRoot = h; pendingCopy = null; } else pendingCopy = h; }
  catch (e) { pendingCopy = h; }
}
function renderCopyBtn() {
  const b = $('#copyBtn'); if (!b) return;
  b.hidden = store?.kind !== 'folder' || store.root.deferred;
  if (copyRoot) { b.textContent = ui('副本：') + copyRoot.name; b.title = ui('每筆儲存的紀錄也會複製到此資料夾'); }
  else if (pendingCopy) { b.textContent = ui('重新連接副本資料夾'); b.title = ui('重新允許複製到「') + pendingCopy.name + '」'; }
  else { b.textContent = ui('設定副本資料夾…'); b.title = ui('將每筆紀錄複製到另一個本機資料夾'); }
}
async function syncCopyNow() {
  try { const n = await store.syncCopy(); toast(ui('已將 {0} 位個案的資料夾複製到「{1}」。', n, copyRoot.name)); }
  catch (e) { toast(ui`無法複製到「${copyRoot.name}」：${e.message || e}`); }
}
async function pickCopyFolder() {
  let h;
  try {
    h = await window.showDirectoryPicker({ id: 'progress-copy', mode: 'readwrite', startIn: 'documents' });
    if (await h.isSameEntry(store.root)) { toast(ui('副本資料夾必須與主要病歷資料夾不同。')); return; }
    if (await h.requestPermission({ mode: 'readwrite' }) !== 'granted') { toast(ui('請允許編輯副本資料夾。')); return; }
  } catch (e) { if (e.name !== 'AbortError') toast(ui('無法開啟資料夾：') + e.message); return; }
  copyRoot = h; pendingCopy = null; await idbSet('copy', h); renderCopyBtn(); closeModal();
  await syncCopyNow();
}
async function copyFolderClick() {
  if (!copyRoot && pendingCopy) {
    try { if (await pendingCopy.requestPermission({ mode: 'readwrite' }) === 'granted') { copyRoot = pendingCopy; pendingCopy = null; renderCopyBtn(); await syncCopyNow(); return; } }
    catch (e) {}
    toast(ui('尚未取得權限，請重新選擇副本資料夾。'));
  }
  if (!copyRoot) { modalCopyIntro(); return; }
  const m = modal(ui`<h3>副本資料夾</h3>
    <p style="margin:0">${ui('儲存在 {0} 的個案資料夾與病歷，也會以相同結構複製到 {1}。編輯、重新命名及刪除也會套用至副本。', `<b>${esc(store.root.name)}</b>`, `<b>${esc(copyRoot.name)}</b>`)}</p>
    <div class="row"><button class="btn app-primary" id="cpSync">立即複製全部資料</button><button class="btn" id="cpPick">選擇其他資料夾</button><button class="btn danger" id="cpStop">停止更新副本</button></div>
    <div class="row" style="justify-content:flex-end"><button class="btn" id="cpClose">關閉</button></div>`);
  m.querySelector('#cpClose').onclick = closeModal;
  m.querySelector('#cpSync').onclick = async () => { closeModal(); await syncCopyNow(); };
  m.querySelector('#cpPick').onclick = () => pickCopyFolder();
  m.querySelector('#cpStop').onclick = async () => { copyRoot = null; pendingCopy = null; await idbSet('copy', null); renderCopyBtn(); closeModal(); toast(ui('已停止更新副本，既有副本檔案仍保留。')); };
}
function modalCopyIntro() {
  const m = modal(ui`<h3>設定第二個病歷資料夾</h3>
    <p style="margin:0">選擇另一個本機資料夾保存副本。現有個案資料會立即複製，之後每次儲存也會更新副本。</p>
    <p class="note" style="margin:0">瀏覽器出現權限提示時，請允許編輯檔案。</p>
    <div class="row" style="justify-content:flex-end"><button class="btn" id="ciCancel">取消</button><button class="btn app-primary" id="ciPick">選擇副本資料夾</button></div>`);
  m.querySelector('#ciCancel').onclick = closeModal;
  m.querySelector('#ciPick').onclick = () => pickCopyFolder();
}
let pendingHandle = null;
// Chrome/Edge always save into the record folder. Browser storage is only for browsers without folder access.
async function initStore() {
  if (!window.showDirectoryPicker) return localStore();
  const h = await idbGet('root');
  if (h) {
    let granted = false;
    try { granted = await h.queryPermission({ mode: 'readwrite' }) === 'granted'; } catch (e) {}
    if (granted) return folderStore(h);
    pendingHandle = h;
  }
  return null;
}
const BROWSER_KEY = 'vision-rehab-notes-v1';
// The 2026-11-02 build copied its bundled records into browser storage; sessions saved after that copy exist only in the browser.
const BUNDLED_COPY_AT = '2026-11-02T06:28:51Z';
const stamp = v => Date.parse(v || '') || 0;
// Sessions saved in browser mode (older builds) that may still be missing from the record folder.
function browserOnlyRecords() {
  let mem = null;
  try { mem = JSON.parse(localStorage.getItem(BROWSER_KEY) || 'null'); } catch (_) {}
  if (!mem?.clients) return [];
  const since = mem.initialRecordsLoaded ? stamp(BUNDLED_COPY_AT) : 0;
  return Object.entries(mem.clients).map(([cid, client]) => ({ client, sessions: Object.values(mem.sessions?.[cid] || {}).filter(s => stamp(s.updated) > since) }))
    .filter(r => r.sessions.length);
}
// Write browser-only sessions into each client's folder. A folder copy saved later is kept.
async function moveBrowserRecords() {
  const pending = browserOnlyRecords();
  if (!pending.length) return;
  const inFolder = new Set((await store.listClients()).map(c => c.id));
  if (!inFolder.size) { toast(ui('這個資料夾沒有個案總表 clients.csv，瀏覽器中的紀錄尚未存入。請連接存放病歷的資料夾。')); return; }
  const moved = [], skipped = [], failed = [];
  for (const { client, sessions } of pending) {
    if (!inFolder.has(client.id)) { skipped.push(client.name); continue; }
    try {
      const current = new Map((await store.listSessions(client.id)).map(s => [s.id, s]));
      for (const s of byDate(sessions)) {
        if (stamp(s.updated) <= stamp(current.get(s.id)?.updated)) continue;
        await store.saveSession(client.id, s);
        moved.push(`${client.name} · ${s.date} · ${visitLabel(s.visit)} → ${store.folderOf(client.id)} / ${store.sessionBase(client.id, s.id)}`);
      }
    } catch (e) { failed.push(`${client.name}：${e.message || e}`); }
  }
  if (!failed.length) {
    try { localStorage.setItem(BROWSER_KEY + '-moved-' + today(), localStorage.getItem(BROWSER_KEY)); } catch (_) {}
    try { localStorage.removeItem(BROWSER_KEY); } catch (_) {}
  }
  if (!moved.length && !failed.length && !skipped.length) return;
  const list = items => `<ul style="margin:0;padding-left:1.2em">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const m = modal(`<h3>${moved.length ? ui('瀏覽器中的紀錄已存入病歷資料夾') : ui('瀏覽器中的紀錄尚未存入病歷資料夾')}</h3>
    ${moved.length ? list(moved) : ''}
    ${skipped.length ? `<p class="note" style="margin:0">${ui('這些個案不在此資料夾，紀錄未存入（已保留在瀏覽器備份）：')}</p>` + list(skipped) : ''}
    ${failed.length ? ui`<p class="note" style="margin:0">以下個案的紀錄未能存入，仍保留在此瀏覽器，下次連接資料夾時會再試一次：</p>` + list(failed) : ''}
    <div class="row" style="justify-content:flex-end"><button class="btn app-primary" id="movedOk">${ui('關閉')}</button></div>`);
  m.querySelector('#movedOk').onclick = closeModal;
}
// Picking the folder that holds EzEMR.html opens the one record folder (with clients.csv) inside it.
async function recordFolder(h) {
  const hasRoster = async d => { try { await d.getFileHandle('clients.csv'); return true; } catch (e) { return false; } };
  if (await hasRoster(h)) return h;
  const found = [];
  for await (const [, child] of h.entries()) if (child.kind === 'directory' && await hasRoster(child)) found.push(child);
  return found.length === 1 ? found[0] : h;
}
function renderConnect() {
  renderCommands();
  const st = $('#storeStatus'); st.textContent = ui('尚未設定儲存位置'); st.className = 'status local';
  $('#clientSearch').value = ''; $('#clientList').innerHTML = '';
  closeClientSearch();
  const pending = browserOnlyRecords().length;
  $('#main').innerHTML = ui`<section class="panel storage-connect">
    <div class="connect-intro">
      <span class="eyebrow">開始使用</span>
      <h2>開啟本機病歷資料夾</h2>
      <p>將 EzEMR.html 放在電腦的本機資料夾，直接用 Chrome 或 Edge 開啟。選擇病歷儲存位置後，個案總表會儲存為 clients.csv，每次紀錄會以 CSV、PDF 與 TXT 存入該個案的資料夾。</p>
      <p>${pendingHandle ? ui('每次開啟 EzEMR 都要先連接「{0}」。連接後，按「儲存」就會直接寫入該個案的資料夾，不會下載檔案。', esc(pendingHandle.name)) : ui('每次開啟 EzEMR 都要先連接病歷資料夾。連接後，按「儲存」就會直接寫入該個案的資料夾，不會下載檔案。')}</p>
      ${pending ? `<p><b>${ui('此瀏覽器有先前在瀏覽器模式儲存的紀錄。連接病歷資料夾後會自動存入對應個案的資料夾；資料夾中較新的版本不會被覆蓋。')}</b></p>` : ''}
    </div>
    <div class="connect-options">
      <h3>選擇適合您的儲存方式</h3>
      ${pendingHandle ? ui`<button class="btn app-primary" data-action="reconnect">重新連接「${esc(pendingHandle.name)}」</button>` : ''}
      <button class="btn ${pendingHandle ? '' : 'app-primary'}" data-action="pick-folder">開啟既有病歷資料夾</button>
      <button class="btn" data-action="use-default">使用 HTML 旁的 Data 資料夾</button>
      <p class="note">首次使用 Data 時，儲存前請選擇 HTML 所在的本機資料夾，程式會在其中建立 Data。已有病歷時，請選擇包含 clients.csv 的資料夾；也可指定其他本機位置。</p>
    </div>
    <aside class="storage-preview" aria-label="本機資料夾結構">
      <h3>本機資料夾結構</h3>
      <pre class="storage-path">EzEMR /
  EzEMR.html
  Data /
    clients.csv
    個案資料夾 / 每次紀錄的 CSV、PDF 與 TXT</pre>
      <p class="note">資料夾中的檔案可直接開啟、複製與備份。</p>
    </aside>
    <div class="connect-notes">
      <p class="note">瀏覽器需要你選擇一次資料夾並允許編輯。需要換電腦時，先匯出完整 JSON 備份，再將備份與 HTML 複製到另一台電腦還原。</p>
      ${window.showDirectoryPicker ? '' : ui`<p class="note">此瀏覽器無法使用資料夾功能時，可<button class="btn link" data-action="use-browser">暫用瀏覽器與 ZIP 下載</button>。原有 JSON 病歷仍可讀取。</p>`}
    </div></section>`;
}
function defaultFolderStore() {
  const key = 'ezrehab-default-profile-settings';
  const pending = () => {
    let text; try { text = localStorage.getItem(key); } catch (_) { return null; }
    if (text === null) return null;
    let raw; try { raw = JSON.parse(text); } catch (_) { throw new Error(ui('基本資料欄位設定格式錯誤')); }
    return validateAppSettings(raw);
  };
  return {
    kind: 'folder', root: { name: ui('Data（首次儲存時建立）'), deferred: true },
    async getSettings() { return pending() || validateAppSettings(DEFAULT_APP_SETTINGS); },
    async saveSettings(settings) { localStorage.setItem(key, JSON.stringify(validateAppSettings(settings))); },
    async listClients() { return []; },
    async listSessions() { return []; },
    async saveClient(c) {
      if (!window.showDirectoryPicker) throw new Error(ui('此瀏覽器無法直接建立資料夾，請使用 Chrome 或 Edge。'));
      const parent = await window.showDirectoryPicker({ id: 'progress-default', mode: 'readwrite', startIn: 'documents' });
      const root = await parent.getDirectoryHandle('Data', { create: true });
      const next = folderStore(root), existing = await next.listClients();
      await next.saveClient(c);
      const settings = pending();
      if (settings) await next.saveSettings(settings);
      store = next; clients = existing; copyRoot = null; pendingCopy = null;
      if (settings) { try { localStorage.removeItem(key); } catch (_) {} }
      await idbSet('root', root); renderStorageStatus();
    }
  };
}
function storageSettings() {
  const m = modal(ui`<h3>儲存位置</h3><p style="margin:0">目前：${esc(storageName())}</p>
    <p class="note" style="margin:0">病歷會直接儲存在選定的本機資料夾。請選取包含 clients.csv 的病歷資料夾，或在 HTML 旁使用 Data。</p>
    <p class="note" style="margin:0">切換位置後，從新位置讀取個案。原位置的檔案會保留；需要搬移時，請先備份，再於新位置還原。</p>
    <div class="row"><button class="btn" data-action="pick-folder">選擇病歷資料夾</button><button class="btn" data-action="use-default">使用 HTML 旁的 Data</button></div>
    <div><button class="btn" id="storageClose">關閉</button></div>`);
  m.querySelector('#storageClose').onclick = closeModal;
}
function globalSettings() {
  if (view === 'edit' && editing) editing = collectSession();
  const position = scrollY;
  const m = modal(ui`<h3>基本資料欄位</h3><form id="appSettingsForm">
    <p class="note">${store.kind === 'folder' ? ui('套用於目前病歷資料夾的所有病人。') : ui('套用於此瀏覽器的所有病人。')}</p>
    <p class="note">勾選的欄位為所有病人的必填資料；未勾選的欄位不必填寫，既有內容會保留。</p>
    <fieldset class="profile-fields"><legend>必填欄位</legend>${PROFILE_FIELDS.map(field => `<label class="pick"><input type="checkbox" name="requiredField" value="${field.key}" ${appSettings.requiredFields.includes(field.key) ? 'checked' : ''}>${esc(field.label())}</label>`).join('')}</fieldset>
    <p id="settingsError" class="clinical-missing" role="alert" hidden></p>
    <div class="row"><button type="button" class="btn" id="settingsCancel">取消設定</button><button type="submit" class="btn app-primary" id="settingsSave">儲存設定</button></div>
  </form>`);
  m.querySelector('#settingsCancel').onclick = closeModal;
  m.addEventListener('keydown', e => { if (savingItems && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); } });
  m.querySelector('#appSettingsForm').onsubmit = async e => {
    e.preventDefault();
    if (savingItems) return;
    const next = validateAppSettings({ version: 1, requiredFields: [...m.querySelectorAll('[name="requiredField"]:checked')].map(input => input.value) });
    savingItems = true; renderCommands();
    const controls = [...m.querySelectorAll('button, input')]; controls.forEach(control => control.disabled = true);
    m.querySelector('#settingsError').hidden = true;
    try {
      await store.saveSettings(next);
      appSettings = next;
      savingItems = false; closeModal(); renderMain(); scrollTo(0, position);
      toast(ui('基本資料設定已儲存'));
    } catch (error) {
      const message = m.querySelector('#settingsError');
      message.textContent = ui('無法儲存基本資料設定：{0}', error.message || error); message.hidden = false;
    } finally { savingItems = false; controls.forEach(control => control.disabled = false); renderCommands(); }
  };
}
async function connectFolder(h) {
  if (!window.showDirectoryPicker) { toast(ui('此瀏覽器無法直接選擇資料夾，請使用 Chrome 或 Edge。')); return; }
  try {
    if (!h) h = await window.showDirectoryPicker({ id: 'progress-notes', mode: 'readwrite', startIn: 'documents' });
    if (await h.requestPermission({ mode: 'readwrite' }) !== 'granted') { toast(ui('儲存病歷需要資料夾編輯權限。')); return; }
    h = await recordFolder(h);
  } catch (e) { if (e.name !== 'AbortError') toast(ui('無法開啟資料夾：') + e.message); return; }
  await idbSet('root', h); pendingHandle = null;
  closeModal(); store = folderStore(h); await finishBoot();
}
async function safe(fn, failMsg) {
  try { return await fn(); }
  catch (e) {
    if (e && e.code === 'unavailable') { await new Promise(r => setTimeout(r, 600 + Math.random() * 600)); try { return await fn(); } catch (e2) { e = e2; } }
    toast(failMsg + (e && e.message ? ': ' + e.message : ''));
    e.reported = true;
    throw e;
  }
}

let store, clients = [], curId = null, sessions = [], view = 'dashboard', editing = null, chartSym = 'total';
let dashboardSessionId = null;
let sessionFilter = { visit: '', from: '', to: '' }, savingSession = false, savingItems = false, dirty = false, patientReady = true;
const cur = () => clients.find(c => c.id === curId);
const storageName = () => store?.root?.deferred ? ui('Data（首次儲存時建立）') : store?.root?.name || ui('尚未指定');
const byDate = list => [...list].sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.num || 0) - (b.num || 0));

const staticUI = [];
const staticWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (staticWalker.nextNode()) {
  const node = staticWalker.currentNode;
  if (!node.parentElement.closest('script, style, [data-language-names]')) staticUI.push({ node, text: node.nodeValue });
}
const staticAttributes = [...document.body.querySelectorAll('[title], [aria-label], [placeholder]')].flatMap(node =>
  ['title', 'aria-label', 'placeholder'].filter(name => node.hasAttribute(name)).map(name => ({ node, name, text: node.getAttribute(name) })));
function renderLanguage() {
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant';
  document.title = ui('EzEMR | 復健病歷');
  for (const { node, text } of staticUI) if (node.isConnected) node.nodeValue = ui(text);
  for (const { node, name, text } of staticAttributes) if (node.isConnected) node.setAttribute(name, ui(text));
  $('#languageSelect').value = language;
  renderTheme();
}
$('#languageSelect').addEventListener('change', () => {
  if (savingSession || savingItems || $('#layer').firstChild) { $('#languageSelect').value = language; return; }
  if (view === 'edit' && editing) editing = collectSession();
  const position = window.scrollY;
  closeCommandMenu();
  language = $('#languageSelect').value === 'en' ? 'en' : 'zh-TW';
  renderLanguage();
  if (store) { renderStorageStatus(); renderCopyBtn(); renderClients(); renderMain(); }
  else renderConnect();
  window.scrollTo(0, position);
  try { localStorage.setItem('ezrehab-language', language); } catch (_) { toast(ui('語言已切換，但此瀏覽器無法記住設定。')); }
});
renderLanguage();

let commandTrigger = null, menuScroll = null, menuLast = false;
const menuItems = menu => [...menu.querySelectorAll('[role^="menuitem"]')].filter(b => !b.disabled && !b.hidden);
function closeCommandMenu(restoreFocus = false) {
  if (!commandTrigger) return;
  const trigger = commandTrigger;
  Metro.getPlugin('#' + trigger.getAttribute('aria-controls'), 'dropdown').close(true);
  if (restoreFocus) trigger.focus();
}
function positionCommandMenu(trigger, menu) {
  menu.classList.remove('drop-up', 'drop-as-dialog', 'place-right');
  const rect = trigger.getBoundingClientRect();
  menu.style.left = Math.max(8, Math.min(rect.left, innerWidth - menu.offsetWidth - 8)) + 'px';
  menu.style.top = rect.bottom + 4 + 'px';
  menu.style.maxHeight = Math.max(44, innerHeight - rect.bottom - 12) + 'px';
}
function openCommandMenu(trigger, last = false) {
  closeCommandMenu(); menuLast = last;
  const menu = $('#' + trigger.getAttribute('aria-controls'));
  menu.hidden = false;
  Metro.getPlugin(menu, 'dropdown').open(true);
}
function initMetroUI() {
  Metro.makePlugin('#applicationBar', 'app-bar', { expand: true, duration: 0 });
  Metro.makePlugin('#clientSearch', 'input', { clearButton: false, revealButton: false, history: false, autocomplete: null });
  const styleButtons = node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('button')) node.classList.add('button');
    node.querySelectorAll('button').forEach(button => button.classList.add('button'));
  };
  styleButtons(document.body);
  // Dynamic forms need Metro styling without activating unrelated widget features.
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(styleButtons))).observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.tool-button').forEach(button => button.classList.add('text-button'));
  return Promise.all([...document.querySelectorAll('.menu-trigger')].map(trigger => new Promise(resolve => {
    if (trigger.closest('.menubar')) trigger.classList.add('no-dropdown-caret');
    const menu = $('#' + trigger.getAttribute('aria-controls'));
    Metro.makePlugin(menu, 'dropdown', {
      toggleElement: trigger,
      onDropdownCreate: resolve,
      onDrop() {
        if (commandTrigger && commandTrigger !== trigger) closeCommandMenu();
        commandTrigger = trigger; menuScroll = { x: scrollX, y: scrollY };
        menu.hidden = false; trigger.setAttribute('aria-expanded', 'true');
        positionCommandMenu(trigger, menu);
        const items = menuItems(menu); (menuLast ? items.at(-1) : items[0])?.focus();
        menuLast = false;
      },
      onUp() {
        menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
        if (commandTrigger === trigger) commandTrigger = null;
      }
    });
  })));
}
function renderCommands() {
  $('#languageSelect').disabled = savingSession || savingItems || !!$('#layer').firstChild;
  if (!savingSession) {
    $('#toolbarSave [data-label]').textContent = ui('儲存');
    $('#fileMenu [data-action="save-session"] [data-label]').textContent = ui('儲存 CSV 與 PDF');
  }
  const c = cur(), draft = !!c && view === 'edit' && !!editing;
  $('#saveTools').hidden = !draft;
  for (const b of document.querySelectorAll('[data-needs]')) {
    b.disabled = savingSession || savingItems || !(b.dataset.needs === 'client' ? c && patientReady : b.dataset.needs === 'draft' ? draft && patientReady : store);
  }
  $('#draftTools').hidden = !draft;
  const tools = [...document.querySelectorAll('.command-toolbar button')].filter(b => !b.disabled && b.getClientRects().length);
  const tabStop = tools.find(b => b === document.activeElement) || tools.find(b => b.tabIndex === 0) || tools[0];
  for (const b of tools) b.tabIndex = b === tabStop ? 0 : -1;
}
for (const key of document.querySelectorAll('[data-shortcut]')) {
  key.textContent = (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl+') + key.dataset.shortcut;
}
document.addEventListener('pointerdown', e => {
  if (!e.target.closest('.command-menu, .menu-trigger')) closeCommandMenu();
});
document.addEventListener('focusin', e => {
  if (commandTrigger && e.target !== commandTrigger && !e.target.closest('.command-menu')) closeCommandMenu();
});
window.addEventListener('resize', () => closeCommandMenu());
// Focusing the sticky toolbar can fire a late scroll event without moving the page; close only on real scrolling.
window.addEventListener('scroll', () => { if (menuScroll && (scrollX !== menuScroll.x || scrollY !== menuScroll.y)) closeCommandMenu(); }, { passive: true });
document.addEventListener('keydown', e => {
  // Metro owns dropdown state; this adapter supplies keyboard navigation.
  const tab = e.target.closest('[role="tab"]');
  if (tab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    e.preventDefault();
    const tabs = [...tab.parentElement.querySelectorAll('[role="tab"]')], i = tabs.indexOf(tab);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    const id = tabs[next].id;
    tabs[next].click();
    document.getElementById(id)?.focus();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && ['s', 'o'].includes(e.key.toLowerCase())) {
    e.preventDefault();
    if ($('#layer .modal')) return;
    closeCommandMenu();
    (e.key.toLowerCase() === 's' ? $('#toolbarSave') : $('#changeFolder')).click();
    return;
  }
  const trigger = e.target.closest('.menu-trigger'), menu = e.target.closest('.command-menu');
  if (e.key === 'Escape' && commandTrigger) { e.preventDefault(); closeCommandMenu(true); return; }
  const toolbar = e.target.closest('.command-toolbar');
  if (toolbar && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    e.preventDefault();
    const tools = [...toolbar.querySelectorAll('button')].filter(b => !b.disabled && b.getClientRects().length), i = tools.indexOf(document.activeElement);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tools.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tools.length) % tools.length;
    tools.forEach((b, index) => b.tabIndex = index === next ? 0 : -1); tools[next]?.focus();
  }
  if (trigger && ['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); openCommandMenu(trigger, e.key === 'ArrowUp'); }
  if (menu && commandTrigger) {
    const items = menuItems(menu), i = items.indexOf(document.activeElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    }
    if (e.key === 'Tab') closeCommandMenu(true);
  }
  const menuTrigger = trigger || (menu ? commandTrigger : null);
  if (menuTrigger?.closest('.menubar') && ['ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    const triggers = [...document.querySelectorAll('.menubar .menu-trigger')], i = triggers.indexOf(menuTrigger);
    const next = triggers[(i + (e.key === 'ArrowRight' ? 1 : -1) + triggers.length) % triggers.length];
    if (commandTrigger) openCommandMenu(next); else next.focus();
  }
});

const metroReady = initMetroUI();
const newClientPlan = () => clone(DEFAULT_PLAN).map(item => ({ ...item, initial: false }));
function normalizePlan(plan) {
  if (!Array.isArray(plan)) return clone(DEFAULT_PLAN);
  if (plan.every(p => typeof p === 'string')) {
    // Preserve the pre-grouping battery when converting an old name-only default template.
    if (OLD_DEFAULT_NAMES.some(n => plan.includes(n))) return clone(DEFAULT_PLAN.filter(p => p.copm || p.id === 'func' || p.id === 'npc' || deviceItem(p.id))).map(({ category, ...p }) => p);
    return plan.map(p => ({ id: uid('p'), domain: '', name: p, timing: 'assessment', fields: ['Result'] }));
  }
  return plan.map(p => typeof p === 'string' ? { id: uid('p'), domain: '', name: p, timing: 'assessment', fields: ['Result'] } : p.copm ? { ...p, timing: 'bp' } : p);
}
const FIELD_TYPES = { text: '文字', number: '數值', textarea: '長文字', select: '選單' };
const trainingPlan = c => Array.isArray(c.trainingPlan) ? c.trainingPlan : TRAIN;
const itemKey = (item, kind) => kind === 'assessment' ? item.id : item.k;
const assessmentCategory = item => item.copm || item.id === 'copm' ? 'functional'
  : item.category || (['func', 'self_report', 'ot_assessment', 'daily_task', 'participation'].includes(item.id) ? 'functional' : 'visual');
const assessmentCategoryLabel = category => category === 'functional' ? ui('功能性視覺') : ui('視覺功能');
const hasAssessmentData = a => !!(a && (a.done || a.notes || a.copm?.length || Object.keys(a.values || {}).length));
const hasTrainingData = d => !!(d && (d.on || d.acts?.length || d.eyedot?.length || d.program || d.dur != null || d.level || d.perf || d.diff != null || d.notes || Object.keys(d.values || {}).length || Object.keys(d.actScores || {}).length || d.runs?.length));
// Items without an explicit choice stay in the initial assessment, as before this setting existed.
const isInitial = item => item.initial !== false;
// Baseline lists the initial items; later assessment visits list the initial items that are due by timing.
const isPlanned = (item, visit) => visit === 'baseline' ? isInitial(item)
  : isDue(item.timing || 'assessment', visit) && (!isAssessVisit(visit) || isInitial(item));
// One score per activity, e.g. "Saccadic fixation: 74%".
const actSummary = d => (d.acts || []).map(a => { const v = d.actScores?.[a]; return labelText(a) + (v != null && v !== '' ? ui('：') + v : ''); }).join(ui('、'));
const VF_FIELDS = ['OD', 'OS', 'OU'].flatMap(eye => ['superior', 'inferior', ...(eye === 'OU' ? ['left', 'right'] : ['nasal', 'temporal'])]
  .map(direction => ({ id: eye.toLowerCase() + '_' + direction, label: eye + ' ' + direction, type: 'text' })));
const isVisualField = item => (item.id === 'vf' && item.name === 'Visual field') || (item.id === 'src_vf' && item.name === 'Visual field (source workbook)');
function fieldsFor(item) {
  const fields = (item.fields || []).map(f => typeof f === 'string' ? { id: f, label: labelText(f), type: 'text' } : f);
  return item.id === 'vf' && isVisualField(item) ? [...fields, ...VF_FIELDS.filter(f => !fields.some(existing => existing.id === f.id))] : fields;
}
const fieldLabel = f => labelText(f.label) + (f.unit ? `（${f.unit}）` : '');
function resultEntries(item, values) {
  const fields = fieldsFor(item);
  // Canonical select values such as "Evaluation" are shown in the interface language.
  return Object.entries(values || {}).map(([key, value]) => { const f = fields.find(f => f.id === key); return [f ? fieldLabel(f) : labelText(key), f?.type === 'select' ? labelText(value) : value]; });
}
function itemsFor(c, s, kind) {
  const items = kind === 'assessment' ? c.plan : trainingPlan(c);
  const data = (kind === 'assessment' ? s?.assess : s?.training) || {};
  const legacy = s?.id ? (c.legacyTemplates?.[kind] || []).filter(item => (kind === 'assessment' ? hasAssessmentData : hasTrainingData)(data[itemKey(item, kind)])) : [];
  const snapshot = (kind === 'assessment' ? s?.assessmentPlan : s?.trainingPlan) || legacy;
  const result = new Map(items.map(item => [itemKey(item, kind), item]));
  // Session definitions keep historical labels and fields intact when templates change.
  for (const item of snapshot) result.set(itemKey(item, kind), item);
  for (const [key, value] of Object.entries(data)) {
    if (result.has(key)) continue;
    result.set(key, kind === 'assessment'
      ? { id: key, name: ui('歷史評估項目（') + key + '）', timing: 'assessment', fields: Object.keys(value.values || {}) }
      : { k: key, label: ui('歷史復健項目（') + key + '）', acts: [], fields: Object.keys(value.values || {}) });
  }
  return [...result.values()];
}
const assessmentItems = (c, s) => itemsFor(c, s, 'assessment');
const trainingItems = (c, s) => itemsFor(c, s, 'training');
function preserveLegacyTemplates(next, c) {
  if (!next.legacyTemplates && sessions.some(s => !s.assessmentPlan || !s.trainingPlan)) next.legacyTemplates = { assessment: clone(c.plan), training: clone(trainingPlan(c)) };
  return next;
}
const hasValue = value => value != null && value !== '';
const shownValue = (f, value) => !hasValue(value) ? '-' : f.type === 'select' ? labelText(value) : value;
// Result boxes come first; test settings (field.group === 'setting') fold into one section below them.
function fieldInputs(item, prefix, values = {}) {
  values = values || {};
  const boxes = fieldsFor(item).map((f, i) => {
    const id = prefix + '-' + i, value = Object.hasOwn(values, f.id) ? values[f.id] : null, type = f.type || 'text';
    let input;
    if (type === 'textarea') input = `<textarea id="${id}">${val(value)}</textarea>`;
    else if (type === 'select') {
      const options = [...new Set([...(f.options || []), ...(hasValue(value) ? [String(value)] : [])])];
      input = ui`<select id="${id}"><option value="">請選擇</option>${options.map(option => `<option value="${esc(option)}" ${String(value) === option ? 'selected' : ''}>${esc(labelText(option))}</option>`).join('')}</select>`;
    } else input = `<input type="${type === 'number' ? 'number' : 'text'}" id="${id}" value="${val(value)}" ${type === 'number' ? `step="${val(f.step ?? 'any')}" ${f.min != null ? `min="${val(f.min)}"` : ''} ${f.max != null ? `max="${val(f.max)}"` : ''}` : ''}>`;
    return { f, html: `<label class="f" for="${id}">${esc(fieldLabel(f))}${input}</label>` };
  });
  const directions = isVisualField(item) ? boxes.filter(b => VF_FIELDS.some(f => f.label === b.f.label)) : [];
  const cross = directions.length === 12 ? `<div class="vf-entry"><p class="note">${ui('依面對病人的方向排列；雙眼的左、右以病人為準。可填角度或質性描述，空白代表未記錄。')}</p><div class="vf-eyes">${[
    ['OD', ui('右眼（OD）'), 'temporal', 'nasal'], ['OS', ui('左眼（OS）'), 'nasal', 'temporal'], ['OU', ui('雙眼（OU）'), 'right', 'left']
  ].map(([eye, name, left, right]) => `<fieldset class="vf-eye"><legend>${esc(name)}</legend><div class="vf-cross">${[
    ['superior', 'top'], [left, 'left'], [right, 'right'], ['inferior', 'bottom']
  ].map(([direction, position]) => directions.find(b => b.f.label === eye + ' ' + direction).html.replace('class="f"', `class="f vf-${position}"`)).join('')}<span class="vf-center" aria-hidden="true">${eye}</span></div></fieldset>`).join('')}</div></div>` : '';
  const settings = boxes.filter(b => b.f.group === 'setting');
  const count = settings.filter(b => hasValue(values[b.f.id])).length;
  return cross + boxes.filter(b => b.f.group !== 'setting' && (!cross || !directions.includes(b))).map(b => b.html).join('') + (settings.length
    ? `<details class="settings" id="${prefix}-settings"><summary>${count ? ui('測驗設定（已填 {0} 項）', count) : ui('測驗設定')}</summary><div class="grid">${settings.map(b => b.html).join('')}</div></details>` : '');
}
// Settings of one result as a short line, e.g. "Evaluation · White dot · 60 arcmin".
const settingSummary = (item, values = {}) => fieldsFor(item).filter(f => f.group === 'setting' && hasValue(values?.[f.id]))
  .map(f => f.type === 'select' ? labelText(values[f.id]) : fieldLabel(f) + ui('：') + values[f.id]).join(' · ');
function readFields(item, prefix, previous = {}) {
  const values = new Map(Object.entries(previous));
  fieldsFor(item).forEach((f, i) => {
    const el = $('#' + prefix + '-' + i); if (!el) return;
    if (Object.hasOwn(previous, f.id) && el.value === String(previous[f.id])) return;
    if (!el.value.trim()) values.delete(f.id);
    else values.set(f.id, f.type === 'number' ? Number(el.value) : el.value.trim());
  });
  return Object.fromEntries(values);
}
function setSectionEnabled(box, enabled) {
  box.hidden = !enabled;
  box.querySelectorAll('input, select, textarea').forEach(el => {
    if (enabled && el.dataset.sectionDisabled) { el.disabled = false; delete el.dataset.sectionDisabled; }
    else if (!enabled && !el.disabled) { el.disabled = true; el.dataset.sectionDisabled = 'true'; }
  });
}

const rowTotal = r => { let t = 0, h = false; for (const k of SK) { const v = r?.scores?.[k]; if (v != null) { t += v; h = true; } } return h ? t : null; };
const findRow = (s, kind) => (s?.sym || []).find(r => r.kind === kind);
function symVal(r, which) { if (!r) return null; return which === 'total' ? rowTotal(r) : (r.scores?.[which] ?? null); }
function copmAvg(rows) {
  const p = (rows || []).map(r => r.perf).filter(v => v != null), s = (rows || []).map(r => r.sat).filter(v => v != null);
  const a = arr => arr.length ? Math.round(arr.reduce((x, y) => x + y, 0) / arr.length * 10) / 10 : null;
  return { perf: a(p), sat: a(s) };
}
// COPM is measured at Baseline and Post-rehabilitation only; a post-rehabilitation COPM is compared with the latest earlier baseline COPM.
function copmBaseline(excludeId, date, visit, list = sessions) {
  if (visit !== 'post') return null;
  let found = null;
  for (const s of byDate(list || [])) {
    if (s.id === excludeId || s.visit !== 'baseline') continue;
    if (date && s.date && s.date > date) break;
    const c = s.assess?.copm; if (c?.done) { const a = copmAvg(c.copm); if (a.perf != null || a.sat != null) found = { ...a, date: s.date }; }
  }
  return found;
}
const COPM_VISITS = ['baseline', 'post'];

const SERVICE_REMEDIATION = {
  inperson: { ocular_sol: 'Oculomotor training (Sol)', visual_perception: 'Visual perception', paper_exercises: 'Paper-based visual exercises' },
  telerehab: { ocular_remote: 'Oculomotor training (Tobii / webcam)', visual_processing: 'Visual processing training', home_modules: 'Home-based practice modules' }
};
const peoLabel = key => ({ person: ui('個人'), environment: ui('環境'), occupation: ui('作業') })[key] || key;
function clinicalInterventions() {
  return Object.entries(INTERVENTIONS).flatMap(([mode, approaches]) => Object.entries({ remediation: SERVICE_REMEDIATION[mode], ...approaches })
    .flatMap(([approach, items]) => Object.entries(items).map(([id, label]) => ({ id, mode, approach, label: labelText(label) }))));
}
function clinicalInterventionLabel(id) {
  const item = clinicalInterventions().find(item => item.id === id);
  return item ? [serviceModeLabel(item.mode), item.approach === 'remediation' ? ui('復能') : approachLabel(item.approach), item.label].join(' / ') : id;
}
function clinicalEvidenceText(c, s, ids) {
  const items = assessmentItems(c, s);
  return ids.map(id => {
    const item = items.find(item => item.id === id), data = s.assess?.[id];
    if (!item) return id + ui('：') + ui('本次紀錄找不到此評估');
    const name = labelText(item.name);
    if (!data?.done) return name + ui('：') + ui('本次未勾選施測');
    const results = item.copm ? (data.copm || []).map(row => [row.occ, ui('表現') + ' ' + (row.perf ?? '-'), ui('滿意度') + ' ' + (row.sat ?? '-')].join(' / '))
      : resultEntries(item, data.values).map(([label, value]) => label + ui('：') + value);
    if (data.notes) results.push(ui('備註') + ui('：') + data.notes);
    return name + ui('：') + (results.length ? results.join(ui('；')) : ui('尚未填寫結果'));
  });
}
function clinicalLinkLines(c, s) {
  return (s.clinicalLinks || []).flatMap((link, index) => [
    ui('症狀連結 {0}', index + 1) + ' / ' + assessmentCategoryLabel(link.category),
    ui('主要症狀／功能困難') + ui('：') + link.symptom,
    ...(link.peo.length ? [ui('推理面向') + ui('：') + link.peo.map(peoLabel).join(ui('、'))] : []),
    ui('臨床推理與依據') + ui('：') + (link.reasoning || ui('尚未填寫推理')),
    ...clinicalEvidenceText(c, s, link.evidence),
    ...(link.evidenceNotes ? [ui('其他依據與觀察') + ui('：') + link.evidenceNotes] : []),
    ui('介入處置') + ui('：') + (link.interventions.length ? link.interventions.map(clinicalInterventionLabel).join(ui('；')) : link.interventionNotes ? '' : ui('尚未記錄介入處置')),
    ...(link.interventionNotes ? [link.interventionNotes] : []), ''
  ]);
}
function readClinicalLinks() {
  return [...document.querySelectorAll('#clinicalLinks [data-clinical-link]')].map(row => {
    const text = key => row.querySelector(`[data-clinical="${key}"]`).value;
    const picks = key => [...row.querySelectorAll(`[data-clinical="${key}"]:checked`)].map(input => input.value);
    return { id: row.dataset.id, category: text('category'), symptom: text('symptom'), reasoning: text('reasoning'),
      peo: picks('peo'), evidence: picks('evidence'), evidenceNotes: text('evidenceNotes'), interventions: picks('interventions'), interventionNotes: text('interventionNotes') };
  });
}
function renderClinicalLinks(s) {
  const c = cur(), links = s.clinicalLinks || [], catalog = clinicalInterventions();
  const choices = assessmentItems(c, s).filter(p => p.active !== false || links.some(link => link.evidence.includes(p.id)) || s.assess?.[p.id]?.done);
  const box = $('#clinicalLinks');
  box.innerHTML = links.length ? links.map((link, index) => {
    const prefix = 'cl-' + index;
    const check = (key, id, label) => `<label class="pick"><input type="checkbox" data-clinical="${key}" value="${esc(id)}" ${link[key].includes(id) ? 'checked' : ''}>${esc(label)}</label>`;
    const selectedIds = [...new Set([...choices.map(p => p.id), ...link.evidence])];
    return ui`<fieldset class="clinical-link" data-clinical-link data-index="${index}" data-id="${esc(link.id)}">
      <legend>${ui('症狀連結 {0}', index + 1)}</legend>
      <div class="row"><button type="button" class="btn small danger" data-action="clinical-link-del" data-index="${index}" aria-label="${esc(ui('移除症狀連結 {0}', index + 1))}">移除</button></div>
      <div class="clinical-link-grid">
        <label class="f" for="${prefix}-symptom">主要症狀／功能困難<input id="${prefix}-symptom" type="text" data-clinical="symptom" value="${val(link.symptom)}" ${s.visit === 'absent' ? '' : 'required'} placeholder="記錄病人的症狀或受影響的日常活動"></label>
        <label class="f" for="${prefix}-category">症狀分類<select id="${prefix}-category" data-clinical="category">${['visual', 'functional'].map(category => `<option value="${category}" ${link.category === category ? 'selected' : ''}>${assessmentCategoryLabel(category)}</option>`).join('')}</select></label>
        <fieldset class="clinical-domain"><legend>推理面向</legend><div class="pick-group">${['person', 'environment', 'occupation'].map(key => check('peo', key, peoLabel(key))).join('')}</div></fieldset>
        <label class="f clinical-link-reasoning" for="${prefix}-reasoning">針對此症狀的臨床推理<textarea id="${prefix}-reasoning" data-clinical="reasoning" placeholder="說明評估發現如何影響個人、環境與作業的契合">${val(link.reasoning)}</textarea></label>
      </div>
      <details><summary>連結本次評估 (${ui('已選 {0} 項', link.evidence.length)})</summary>
        <div class="pick-group">${selectedIds.map(id => check('evidence', id, labelText(choices.find(p => p.id === id)?.name || id))).join('')}</div>
        <label class="f" for="${prefix}-evidenceNotes">其他依據與觀察<textarea id="${prefix}-evidenceNotes" data-clinical="evidenceNotes" placeholder="記錄主訴、觀察、來源日期或推理依據">${val(link.evidenceNotes)}</textarea></label>
      </details>
      <div class="clinical-evidence-preview" aria-live="polite"></div>
      <details><summary>選擇介入處置 (${ui('已選 {0} 項', link.interventions.length)})</summary>
        ${!s.mode ? ui('<p class="note">選擇服務型態後，顯示對應處置；既有選項仍保留。</p>') : ''}
        ${['remediation', 'adaptation', 'compensation'].map(approach => {
          const visible = catalog.filter(item => item.approach === approach && (item.mode === s.mode || link.interventions.includes(item.id)));
          return visible.length ? `<h4>${approach === 'remediation' ? ui('復能') : approachLabel(approach)}</h4><div class="pick-group">${visible.map(item => check('interventions', item.id, item.label + (item.mode !== s.mode ? ' (' + serviceModeLabel(item.mode) + ')' : ''))).join('')}</div>` : '';
        }).join('')}
        <div class="pick-group">${link.interventions.filter(id => !catalog.some(item => item.id === id)).map(id => check('interventions', id, id)).join('')}</div>
        <p class="note">其他服務型態的已選處置會保留。</p>
      </details>
      <label class="f" for="${prefix}-interventionNotes">此症狀的處置內容與目標<textarea id="${prefix}-interventionNotes" data-clinical="interventionNotes" placeholder="記錄實際處置、劑量、居家安排或待確認的計畫">${val(link.interventionNotes)}</textarea></label>
    </fieldset>`;
  }).join('') : ui('<p class="note">尚未建立症狀連結。新增一項，記錄它的推理與處置。</p>');
  $('[data-action="clinical-link-add"]').disabled = links.length >= 100;
  updateClinicalEvidence();
}
function updateClinicalEvidence() {
  if (!$('#clinicalLinks')) return;
  const s = collectSession();
  document.querySelectorAll('#clinicalLinks [data-clinical-link]').forEach((row, index) => {
    const link = s.clinicalLinks[index], lines = clinicalEvidenceText(cur(), s, link.evidence);
    row.querySelector('.clinical-evidence-preview').innerHTML = lines.length ? `<ul>${lines.map(line => `<li>${esc(line)}</li>`).join('')}</ul>` : '';
    const summaries = row.querySelectorAll('details > summary');
    summaries[0].textContent = ui('連結本次評估') + ' (' + ui('已選 {0} 項', link.evidence.length) + ')';
    summaries[1].textContent = ui('選擇介入處置') + ' (' + ui('已選 {0} 項', link.interventions.length) + ')';
  });
}
function renderDashboard() {
  const c = cur(), records = byDate(sessions.filter(s => s.visit !== 'absent')).reverse(), box = $('#tabBody');
  if (!records.length) {
    const latest = byDate(sessions).at(-1);
    box.innerHTML = ui`<section id="patientDashboard" class="panel empty"><h3>${sessions.length ? ui('尚無出席紀錄') : ui('尚無復健紀錄')}</h3>${latest?.visit === 'absent' ? `<p class="clinical-missing" role="status">${ui('最近一次紀錄為缺席：{0}', esc(fmtDate(latest.date)))}</p>` : ''}<p>新增紀錄，開始整理症狀、推理與處置。</p></section>`;
    return;
  }
  const s = records.find(s => s.id === dashboardSessionId) || records[0];
  dashboardSessionId = s.id;
  const text = (content, fallback) => `<p class="${content ? 'clinical-note' : 'clinical-missing'}">${esc(content || fallback)}</p>`;
  const ul = lines => `<ul>${lines.map(line => `<li class="clinical-note">${esc(line)}</li>`).join('')}</ul>`;
  const row = (symptom, reasoning, intervention, id = '') => ui`<article class="clinical-map-row" data-clinical-row data-id="${esc(id)}">
    <section class="clinical-map-cell"><h4>症狀與功能</h4>${symptom}</section>
    <section class="clinical-map-cell"><h4>推理與依據</h4>${reasoning}</section>
    <section class="clinical-map-cell"><h4>介入與計畫</h4>${intervention}</section></article>`;
  let map;
  if (s.clinicalLinks?.length) {
    map = s.clinicalLinks.map(link => row(
      `<span class="eyebrow">${esc(assessmentCategoryLabel(link.category))}</span><p class="clinical-symptom clinical-note">${esc(link.symptom)}</p>`,
      (link.peo.length ? `<span class="eyebrow">${link.peo.map(key => esc(peoLabel(key))).join(' / ')}</span>` : '') + text(link.reasoning, ui('尚未填寫推理')) +
        (link.evidence.length ? ul(clinicalEvidenceText(c, s, link.evidence)) : link.evidenceNotes ? '' : text('', ui('尚未連結評估依據'))) + (link.evidenceNotes ? text(link.evidenceNotes) : ''),
      (link.interventions.length ? ul(link.interventions.map(clinicalInterventionLabel)) : link.interventionNotes ? '' : text('', ui('尚未記錄介入處置'))) + (link.interventionNotes ? text(link.interventionNotes) : ''), link.id)).join('');
  } else {
    const reasoning = ['person', 'environment', 'occupation'].filter(key => s.peo?.[key]).map(key => peoLabel(key) + ui('：') + s.peo[key]);
    const interventions = trainingItems(c, s).filter(t => s.training?.[t.k]?.on).map(t => ui('復能') + ' / ' + labelText(t.label));
    for (const approach of ['adaptation', 'compensation']) {
      interventions.push(...(s.interventions?.[approach]?.picks || []).map(id => approachLabel(approach) + ' / ' + strategyLabel(approach, id)));
      if (s.interventions?.[approach]?.notes) interventions.push(approachLabel(approach) + ui('：') + s.interventions[approach].notes);
    }
    if (s.otherTx) interventions.push(s.otherTx);
    map = row(text(s.subjective, ui('尚未填寫主要症狀')),
      text(s.assessment, ui('尚未填寫推理')) + (reasoning.length ? ul(reasoning) : '') + (s.objective ? text(s.objective) : ''),
      (interventions.length ? ul(interventions) : text('', ui('尚未記錄介入處置'))) + (s.plan ? text(s.plan) : ''));
  }
  const rated = ratedRows(s.sym), first = rated[0], last = rated.at(-1);
  const ratings = SYMS.filter(sym => rated.some(row => row.scores?.[sym.k] != null));
  const assessments = assessmentItems(c, s).filter(p => s.assess?.[p.id]?.done);
  const latest = byDate(sessions).at(-1);
  box.innerHTML = ui`<section class="panel dashboard" id="patientDashboard">
    <div class="dashboard-head"><h3>本次狀態</h3>
      <label class="f" for="dashboard-session"><span class="sr-only">本次紀錄</span><select id="dashboard-session">${records.map(record => `<option value="${esc(record.id)}" ${record.id === s.id ? 'selected' : ''}>${esc(fmtDate(record.date))} / ${visitLabel(record.visit)} / ${record.num ?? '-'}</option>`).join('')}</select></label>
      <button class="btn small" data-action="open-session" data-id="${esc(s.id)}">開啟此筆紀錄</button>
    </div>
    <div class="dashboard-context"><span class="record-state ${s !== records[0] ? 'historical' : ''}">${s === records[0] ? ui('最近出席') : ui('歷次紀錄')}</span><span>${serviceModeLabel(s.mode)}${s.clinician ? ' / ' + esc(s.clinician) : ''}</span>${s.tolerance != null ? `<span>${ui('耐受度')} ${esc(s.tolerance)}/10</span>` : ''}${s.nextDate ? `<span>${ui('下次復健')} ${esc(fmtDate(s.nextDate))}</span>` : ''}${!s.clinicalLinks?.length ? ui('<span class="clinical-missing" role="status">尚未逐項連結</span>') : ''}${latest?.visit === 'absent' ? `<span class="clinical-missing" role="status">${ui('最近一次紀錄為缺席：{0}', esc(fmtDate(latest.date)))}</span>` : ''}</div>
    <section aria-label="症狀分數"><div class="dashboard-score-head"><h4>症狀分數</h4><span class="note">${ratings.length ? esc(tpName(first)) + (last !== first ? ' → ' + esc(tpName(last)) + ' · ' + ui('本次變化') : '') + ' · ' : ''}分數越低，症狀越少</span></div>
      ${ratings.length ? `<dl class="dashboard-ratings">${ratings.map(sym => {
        const from = first.scores?.[sym.k], to = last.scores?.[sym.k];
        const change = last !== first && from != null && to != null ? to - from : null;
        return `<div><dt>${language === 'en' ? sym.en : sym.zh}</dt><dd><span>${esc(from ?? '-')}${last !== first ? ' → ' + esc(to ?? '-') : ''}</span>${change != null ? `<span class="rating-change ${change > 0 ? 'bad' : change < 0 ? 'good' : ''}" title="${esc(ui('本次變化') + ' ' + signed(change))}" aria-label="${esc(ui('本次變化') + ' ' + signed(change))}">${signed(change)}</span>` : ''}</dd></div>`;
      }).join('')}</dl>` : ui('<p class="note" style="margin:0">尚未填寫症狀評分</p>')}
    </section>
    <div id="clinicalMap" class="clinical-map"><div class="clinical-map-head" aria-hidden="true"><span>症狀與功能</span><span>推理與依據</span><span>介入與計畫</span></div>${map}</div>
    <section aria-label="本次量化與評估摘要">
      ${assessments.length ? ['visual', 'functional'].map(category => {
        const items = assessments.filter(p => assessmentCategory(p) === category);
        return items.length ? `<details class="dashboard-findings"><summary>${assessmentCategoryLabel(category)} (${items.length})</summary>${clinicalEvidenceText(c, s, items.map(p => p.id)).map(line => `<div class="clinical-note">${esc(line)}</div>`).join('')}</details>` : '';
      }).join('') : ui('<p class="note">尚無已勾選的評估結果</p>')}
    </section>
  </section>`;
  $('#dashboard-session').onchange = e => { dashboardSessionId = e.target.value; renderDashboard(); };
}

let clientSearchIndex = -1;
function closeClientSearch() {
  $('#clientSearchPopup').hidden = true;
  $('#clientSearch').setAttribute('aria-expanded', 'false');
  $('#clientSearch').removeAttribute('aria-activedescendant');
  clientSearchIndex = -1;
}
function renderClients() {
  const list = $('#clientList');
  const query = $('#clientSearch').value.trim().toLocaleLowerCase();
  clientSearchIndex = -1;
  $('#clientSearch').removeAttribute('aria-activedescendant');
  if (!query) { list.innerHTML = ''; $('#clientSearchStatus').textContent = ''; closeClientSearch(); return; }
  const shown = clients.filter(c => [clientLabel(c), c.id, c.ref, c.nationalId, ...(c.refAliases || []), c.dx].join(' ').toLocaleLowerCase().includes(query));
  $('#clientSearchStatus').textContent = shown.length > 8 ? ui('顯示前 {0} 筆，共 {1} 筆；請縮小搜尋範圍。', 8, shown.length) : ui('找到 {0} 位個案', shown.length);
  list.innerHTML = !shown.length ? ui('<span class="muted">沒有符合條件的個案，請修改搜尋文字。</span>') : shown.slice(0, 8).map((c, index) => `
    <button class="client-btn" id="client-result-${index}" role="option" tabindex="-1" data-action="pick" data-id="${esc(c.id)}" aria-selected="false" aria-current="${c.id === curId}">
      <span class="nm">${esc(clientLabel(c))}</span>
      <span class="meta">${esc(c.ref || c.id)}</span>
    </button>`).join('');
  const open = $('#patientSearch').contains(document.activeElement);
  $('#clientSearchPopup').hidden = !open;
  $('#clientSearch').setAttribute('aria-expanded', String(open));
}

function renderMain() {
  renderCommands();
  const main = $('#main');
  const c = cur();
  if (!c) {
    main.innerHTML = ui`<section class="panel welcome">
      <span class="eyebrow">病歷工作區</span>
      <h2>從這裡開始記錄復健歷程。</h2>
      <p>新增個案後，即可填寫 SOAP 病歷、記錄症狀評分、評估與訓練結果，並追蹤每次復健的變化。</p>
      <div class="row">
        <button class="btn app-primary" data-action="new-client">＋ 新增個案</button>
        <button class="btn" data-action="example">載入範例個案（示範資料）</button>
      </div>
      <div class="welcome-content">
        <div><h3>個案資料與病歷</h3><p>建立個案、填寫 SOAP，將每次評估與訓練留在同一份歷程。</p></div>
        <div><h3>症狀與進度</h3><p>比較復健前後的症狀評分，追蹤評估結果與出席紀錄。</p></div>
      </div></section>`;
    return;
  }
  if (view === 'edit' && editing) { renderEditor(); return; }
  const facts = [
    c.doi && ui`<span>受傷／發病日期 <b>${fmtDate(c.doi)}</b></span>`,
    sessions.length && (() => { const a = attendance(sessions); return ui`<span>出席 <b>${a.attended}</b> · 缺席 <b class="${a.absent ? 'bad' : ''}">${a.absent}</b>${a.rate != null ? ` (${a.rate}%)` : ''}</span>`; })()
  ].filter(Boolean).join('');
  const latest = byDate(sessions).at(-1);
  main.innerHTML = ui`
    <section class="panel client-summary ${view === 'dashboard' ? 'dashboard-summary' : ''}">
      <div class="client-head">
        <div class="client-identity"><span class="eyebrow sr-only">個案</span><div class="client-title"><h2>${esc(clientLabel(c))}</h2>${c.ref ? `<span class="client-ref">${esc(c.ref)}</span>` : ''}</div>${c.dx ? `<p class="client-diagnosis" title="${esc(c.dx)}"><span class="eyebrow">${ui('診斷')}</span>${esc(c.dx)}</p>` : ''}</div>
        <div class="patient-actions"><button class="btn small" data-action="edit-client" data-needs="client">編輯資料</button><button class="btn app-primary" data-action="new-session" data-needs="client">新增紀錄</button></div>
      </div>
      <div class="patient-meta"><dl class="client-stats">
        <div><dt>紀錄總數</dt><dd>${sessions.length}</dd></div>
        <div><dt>最近紀錄</dt><dd>${latest ? fmtDate(latest.date) : ui('尚無紀錄')}</dd></div>
        <div><dt>下次復健</dt><dd>${latest?.nextDate ? fmtDate(latest.nextDate) : ui('尚未指定')}</dd></div>
      </dl>
      <div class="patient-details">${facts || profileDetailsHTML(c) ? ui`<details class="patient-background"><summary>病史與基本資料</summary>${profileDetailsHTML(c)}<div class="facts">${facts}</div></details>` : ''}${medicalHistoryHTML(c)}${sourceRosterHTML(c)}</div></div>
    </section>
    ${profileIncompleteHTML(c)}
    <div class="tabs" role="tablist" aria-label="個案工作區">
      <button class="tab" id="tab-dashboard" role="tab" aria-controls="tabBody" tabindex="${view === 'dashboard' ? 0 : -1}" aria-selected="${view === 'dashboard'}" data-action="tab" data-tab="dashboard">病人總覽</button>
      <button class="tab" id="tab-sessions" role="tab" aria-controls="tabBody" tabindex="${view === 'sessions' ? 0 : -1}" aria-selected="${view === 'sessions'}" data-action="tab" data-tab="sessions">復健紀錄 (${sessions.length})</button>
      <button class="tab" id="tab-outcomes" role="tab" aria-controls="tabBody" tabindex="${view === 'outcomes' ? 0 : -1}" aria-selected="${view === 'outcomes'}" data-action="tab" data-tab="outcomes">進度追蹤</button>
      <button class="tab" id="tab-plan" role="tab" aria-controls="tabBody" tabindex="${view === 'plan' ? 0 : -1}" aria-selected="${view === 'plan'}" data-action="tab" data-tab="plan">項目設定</button>
    </div>
    ${['plan', 'dashboard'].includes(view) ? '' : sessionFiltersHTML()}
    <div id="tabBody" role="tabpanel" aria-labelledby="tab-${view}"></div>`;
  for (const key of ['visit', 'from', 'to']) {
    const el = $('#filter-' + key); if (!el) continue;
    el.addEventListener('change', () => {
      const from = $('#filter-from'), to = $('#filter-to');
      to.setCustomValidity(from.value && to.value && from.value > to.value ? ui('結束日期不可早於起始日期') : '');
      if (!to.reportValidity()) return;
      sessionFilter = { visit: $('#filter-visit').value, from: from.value, to: to.value };
      $('#filterCount').textContent = ui`顯示 ${filteredSessions().length} / ${sessions.length} 筆`;
      if (view === 'outcomes') renderOutcomes(); else renderSessions();
    });
  }
  if (view === 'dashboard') renderDashboard(); else if (view === 'plan') renderPlan(); else if (view === 'outcomes') renderOutcomes(); else renderSessions();
}
function filteredSessions() {
  return sessions.filter(s => (!sessionFilter.visit || s.visit === sessionFilter.visit) &&
    (!sessionFilter.from || s.date >= sessionFilter.from) && (!sessionFilter.to || s.date <= sessionFilter.to));
}
function sessionFiltersHTML() {
  return ui`<section class="panel filters" aria-label="篩選復健紀錄">
    <label class="f" for="filter-visit">紀錄類型<select id="filter-visit"><option value="">全部類型</option>${VISITS.map(v => `<option value="${v.k}" ${sessionFilter.visit === v.k ? 'selected' : ''}>${ui(v.label)}</option>`).join('')}</select></label>
    <label class="f" for="filter-from">起始日期<input type="date" id="filter-from" value="${val(sessionFilter.from)}"></label>
    <label class="f" for="filter-to">結束日期<input type="date" id="filter-to" value="${val(sessionFilter.to)}"></label>
    <div><button class="btn" data-action="clear-filters">清除篩選</button><div class="note" id="filterCount" role="status">顯示 ${filteredSessions().length} / ${sessions.length} 筆</div></div>
  </section>`;
}

function renderSessions() {
  const body = $('#tabBody');
  if (!sessions.length) {
    body.innerHTML = ui`<section class="panel empty"><h3>尚無復健紀錄</h3><p>新增第一筆 SOAP 病歷，記錄復健前後的症狀、評估與訓練結果。可先到「項目設定」調整評估與復健模板。</p><button class="btn app-primary" data-action="new-session">＋ 新增復健紀錄</button></section>`;
    return;
  }
  const asc = byDate(filteredSessions());
  if (!asc.length) { body.innerHTML = ui('<section class="panel empty"><h3>沒有符合條件的復健紀錄</h3><p>請調整類型或日期，或清除篩選以查看所有紀錄。</p><button class="btn" data-action="clear-filters">清除篩選</button></section>'); return; }
  body.innerHTML = ui`<div class="records-layout">
    <section class="panel chart">
      <div class="spread"><h3>每次復健的症狀評分</h3>
        <div class="row">
          <select id="chartSym" aria-label="圖表顯示的症狀" style="width:auto">
            <option value="total">五項症狀總分（0 至 50）</option>
            ${SYMS.map(s => `<option value="${s.k}" ${chartSym === s.k ? 'selected' : ''}>${language === 'en' ? s.en : s.zh}</option>`).join('')}
          </select>
        </div></div>
      <div class="row" style="margin:8px 0"><span class="chip pre">● 復健前</span><span class="chip acc">● 復健後</span><span class="note">分數越低，症狀越輕。</span></div>
      <div class="chart-plot" tabindex="0" role="region" aria-label="${ui('症狀圖表，可左右捲動')}">${chartSVG(asc.filter(s => s.visit !== 'absent'))}</div>
    </section>
    <div class="record-history">
      <div class="section-heading"><h3 id="recordHistoryHeading">紀錄歷程</h3><span class="note">由新到舊排列</span></div>
      <section class="sess-list" aria-labelledby="recordHistoryHeading">${[...asc].reverse().map(sessCard).join('')}</section>
    </div></div>`;
  $('#chartSym').value = chartSym;
  $('#chartSym').onchange = e => { chartSym = e.target.value; renderSessions(); };
}

function attendance(list) {
  const absent = list.filter(s => s.visit === 'absent').length, attended = list.length - absent;
  return { attended, absent, rate: list.length ? Math.round(attended / list.length * 100) : null };
}
function sessionHeading(s) {
  return ui`<header class="session-meta"><h4 class="when">${fmtDate(s.date)}${s.num ? ' · ' + ui('第 {0} 次', esc(s.num)) : ''}</h4><span class="session-kind ${s.visit === 'absent' ? 'absent' : ''}">${visitLabel(s.visit)}</span>${s.clinician ? `<span class="muted">${esc(s.clinician)}</span>` : ''}</header>`;
}
function sessionActions(s) {
  return ui`<div class="session-actions">
    <button class="btn small" data-action="open-session" data-id="${esc(s.id)}">開啟紀錄</button>
    <button class="btn small" data-action="copy-session" data-id="${esc(s.id)}">複製病歷</button>
    ${s.visit !== 'absent' ? ui`<button class="btn small" data-action="xlsx-session" data-id="${esc(s.id)}" title="Excel 表單">匯出表單</button>` : ''}
    <button class="btn small" data-action="export-session" data-id="${esc(s.id)}" title="CSV 與 PDF">匯出檔案</button>
    <button class="btn small danger" data-action="del-session" data-id="${esc(s.id)}">刪除紀錄</button>
  </div>`;
}
function absentCard(s) {
  const a = s.absence || {};
  return ui`<article class="sess session-absent"><div class="session-content">${sessionHeading(s)}
    <dl class="session-context">
      ${a.reason ? ui`<div><dt>原因</dt><dd>${esc(absenceLabel(a.reason, ABSENCE_REASONS))}</dd></div>` : ''}
      ${a.notified ? ui`<div><dt>通知</dt><dd>${esc(absenceLabel(a.notified, NOTIFIED))}</dd></div>` : ''}
      <div><dt>改約</dt><dd>${s.nextDate ? fmtDate(s.nextDate) : ui('尚未改約')}</dd></div>
    </dl>${a.contact ? `<p class="session-note">${esc(a.contact.length > 220 ? a.contact.slice(0, 220) + '…' : a.contact)}</p>` : ''}
  </div>${sessionActions(s)}</article>`;
}
function sessCard(s) {
  if (s.visit === 'absent') return absentCard(s);
  const pre = rowTotal(firstRated(s.sym)), end = rowTotal(findRow(s, 'end')), rec = findRow(s, 'rec');
  const d = pre != null && end != null ? end - pre : null;
  const tx = trainingItems(cur(), s).filter(t => s.training?.[t.k]?.on).map(t => `<li>${esc(labelText(t.label))}</li>`).join('');
  const nAs = Object.values(s.assess || {}).filter(a => a.done).length;
  return ui`<article class="sess">
    <div class="session-content">${sessionHeading(s)}
      <dl class="session-metrics">
        <div class="metric-pre"><dt>復健前</dt><dd>${esc(rowTotal(findRow(s, 'pre')) ?? '-')}</dd></div>
        <div class="metric-end"><dt>復健後</dt><dd>${esc(end ?? '-')}</dd></div>
        <div class="metric-change ${d > 0 ? 'bad' : d < 0 ? 'good' : ''}"><dt>與首次差異</dt><dd>${d != null ? signed(d) : '-'}</dd></div>
      </dl>
      ${(s.sym || []).some(r => r.kind === 'sub') ? `<dl class="session-stages" aria-label="${ui('各測驗症狀分數')}">${SUBTESTS.map(t => { const r = (s.sym || []).find(x => x.kind === 'sub' && x.test === t.k); return `<div><dt>${language === 'en' ? t.en : t.zh}</dt><dd>${esc(rowTotal(r) ?? '-')}</dd></div>`; }).join('')}</dl>` : ''}
      <dl class="session-context">
        <div><dt>評估</dt><dd>${nAs}</dd></div>
        ${rec ? ui`<div><dt>恢復時間</dt><dd>${rec.recMin != null ? esc(rec.recMin) + ui(' 分鐘') : ui('已記錄')}</dd></div>` : ''}
        ${s.tolerance != null ? ui`<div><dt>耐受度</dt><dd>${esc(s.tolerance)}/10</dd></div>` : ''}
        ${s.training?.ocular?.on && s.training.ocular.eyedot?.length ? `<div><dt>${ui('EyeDot 次數')}</dt><dd>${s.training.ocular.eyedot.length}</dd></div>` : ''}
      </dl>
      ${tx ? `<ul class="session-training" aria-label="${ui('復健項目')}">${tx}</ul>` : ''}
      ${s.assessment ? `<p class="session-note">${esc(s.assessment.length > 220 ? s.assessment.slice(0, 220) + '…' : s.assessment)}</p>` : ''}
    </div>
    ${sessionActions(s)}</article>`;
}

function chartSVG(list) {
  const pts = list.map((s, i) => ({ i, s, pre: symVal(firstRated(s.sym), chartSym), end: symVal(findRow(s, 'end'), chartSym) }));
  const vals = pts.flatMap(p => [p.pre, p.end]).filter(v => v != null);
  if (!vals.length) return ui('<p class="muted">尚未記錄症狀評分，填寫復健紀錄後即可查看圖表。</p>');
  const W = 440, H = 230, L = 40, R = 28, T = 14, B = 46;
  const maxV = chartSym === 'total' ? Math.max(10, Math.ceil(Math.max(...vals) / 10) * 10) : 10;
  const n = pts.length;
  const x = i => n === 1 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (n - 1);
  const y = v => T + (H - T - B) * (1 - v / maxV);
  let g = '';
  const step = maxV <= 10 ? 2 : maxV <= 20 ? 5 : 10;
  for (let v = 0; v <= maxV; v += step) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  const every = Math.ceil(n / 6);
  pts.forEach(p => { if (p.i % every === 0 || p.i === n - 1) g += `<text x="${x(p.i)}" y="${H - B + 18}" text-anchor="middle">${esc(p.s.num ? 'S' + p.s.num : '#' + (p.i + 1))}</text><text x="${x(p.i)}" y="${H - B + 32}" text-anchor="middle" font-size="10">${esc((p.s.date || '').slice(5))}</text>`; });
  const line = (k, col) => {
    const seg = pts.filter(p => p[k] != null);
    if (!seg.length) return '';
    const d = seg.map((p, j) => `${j ? 'L' : 'M'}${x(p.i)},${y(p[k])}`).join(' ');
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2.25" stroke-linejoin="round"/>` +
      seg.map((p, j) => `<circle cx="${x(p.i)}" cy="${y(p[k])}" r="${j === seg.length - 1 ? 5 : 3.5}" fill="${col}" stroke="var(--surface)" stroke-width="1.5"><title>${k === 'pre' ? ui('首次評分') : ui('復健後')}：${p[k]}</title></circle>`).join('');
  };
  return ui`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="每次復健的首次與復健後症狀評分">${g}${line('pre', 'var(--pre)')}${line('end', 'var(--accent)')}</svg>`;
}

function renderOutcomes() {
  const c = cur(), asc = byDate(filteredSessions());
  const parts = [];
  // Symptoms summary
  const symRows = asc.filter(s => (s.sym || []).length);
  if (symRows.length) {
    parts.push(ui`<section class="panel"><h3>症狀評分（0 至 10）</h3><p class="note" style="margin:4px 0 10px">復健前 → 復健後；有記錄時另顯示恢復時間。</p>
      <div class="scroll"><table class="out"><thead><tr><th>日期</th>${SYMS.map(s => `<th>${s.en}</th>`).join('')}<th>總分</th><th>恢復時間</th></tr></thead><tbody>
      ${symRows.map(s => { const p = firstRated(s.sym), e = findRow(s, 'end') || lastRated(s.sym), r = findRow(s, 'rec');
        const cell = k => { const a = symVal(p, k), b = symVal(e, k); return `${esc(a ?? '–')} → ${esc(b ?? '–')}`; };
        return `<tr><td>${fmtDate(s.date)}</td>${SK.map(k => `<td>${cell(k)}</td>`).join('')}<td><b>${cell('total')}</b></td><td>${r ? (r.recMin != null ? esc(r.recMin) + ui(' 分鐘') : ui('已記錄')) : '-'}</td></tr>`; }).join('')}
      </tbody></table></div></section>`);
  }
  const allAssessments = new Map([...c.plan, ...asc.flatMap(s => assessmentItems(c, s))].map(item => [item.id, item]));
  for (const category of ['visual', 'functional']) {
  const items = [...allAssessments.values()].filter(item => assessmentCategory(item) === category && asc.some(s => s.assess?.[item.id]?.done && (!item.copm || COPM_VISITS.includes(s.visit))));
  if (items.length) parts.push(`<div class="section-heading"><h3>${esc(assessmentCategoryLabel(category))}</h3></div>`);
  for (const item of items) {
    const rows = asc.filter(s => s.assess?.[item.id]?.done);
    if (!rows.length) continue;
    if (item.copm) {
      const copmRows = rows.filter(s => COPM_VISITS.includes(s.visit));
      if (!copmRows.length) continue;
      parts.push(ui`<section class="panel"><h3>${esc(labelText(item.name))}</h3><p class="note" style="margin:4px 0 10px">${esc(labelText(item.domain))} · 基準與療程後評估；療程後分數與先前基準比較。</p>
        <div class="scroll"><table class="out"><thead><tr><th>日期</th><th>紀錄類型</th><th>表現平均</th><th>與基準差異</th><th>滿意度平均</th><th>與基準差異</th></tr></thead><tbody>
        ${copmRows.map(s => { const a = copmAvg(s.assess[item.id].copm), base = copmBaseline(s.id, s.date, s.visit);
          const ch = (v, b) => v != null && b != null ? `<span class="delta ${v - b > 0 ? 'down' : v - b < 0 ? 'up' : ''}">${signed(v - b)}</span>` : '–';
          return `<tr><td>${fmtDate(s.date)}</td><td>${visitLabel(s.visit)}</td><td>${a.perf ?? '–'}</td><td>${ch(a.perf, base?.perf)}</td><td>${a.sat ?? '–'}</td><td>${ch(a.sat, base?.sat)}</td></tr>`; }).join('')}
        </tbody></table></div></section>`);
    } else {
      const def = s => assessmentItems(c, s).find(p => p.id === item.id) || item;
      const fields = [...new Map(rows.flatMap(s => fieldsFor(def(s))).map(f => [f.id, f])).values()].filter(f => f.group !== 'setting');
      const settings = rows.some(s => settingSummary(def(s), s.assess[item.id].values));
      parts.push(ui`<section class="panel"><h3>${esc(labelText(item.name))}</h3><p class="note" style="margin:4px 0 10px">${esc(labelText(item.domain))}</p>
        <div class="scroll"><table class="out"><thead><tr><th>日期</th><th>紀錄類型</th>${fields.map(f => `<th>${esc(fieldLabel(f))}</th>`).join('')}${settings ? ui('<th>測驗設定</th>') : ''}<th>備註</th></tr></thead><tbody>
        ${rows.map(s => { const a = s.assess[item.id]; return `<tr><td>${fmtDate(s.date)}</td><td>${visitLabel(s.visit)}</td>${fields.map(f => `<td>${esc(shownValue(f, a.values?.[f.id]))}</td>`).join('')}${settings ? `<td style="text-align:left;font-family:var(--f-body)">${esc(settingSummary(def(s), a.values))}</td>` : ''}<td style="text-align:left;font-family:var(--f-body)">${esc(a.notes || '')}</td></tr>`; }).join('')}
        </tbody></table></div></section>`);
    }
  }
  }
  const allTraining = new Map(asc.flatMap(s => trainingItems(c, s)).map(item => [item.k, item]));
  for (const item of allTraining.values()) {
    const rows = asc.filter(s => s.training?.[item.k]?.on); if (!rows.length) continue;
    const fields = [...new Map(rows.flatMap(s => fieldsFor(trainingItems(c, s).find(t => t.k === item.k) || item)).map(f => [f.id, f])).values()];
    // One column per activity, so each activity's score can be followed across visits.
    const acts = [...new Set(rows.flatMap(s => (s.training[item.k].acts || []).map(labelText)))];
    const actCell = (d, label) => { const a = (d.acts || []).find(x => labelText(x) === label); return a == null ? '-' : d.actScores?.[a] ?? '✓'; };
    const perf = rows.some(s => s.training[item.k].perf);
    parts.push(ui`<section class="panel"><h3>${esc(labelText(item.label))}</h3>${acts.length ? ui('<p class="note" style="margin:4px 0 0">活動欄顯示該次的分數；✓ 表示有做但未填分數。</p>') : ''}<div class="scroll" style="margin-top:10px"><table class="out"><thead><tr><th>日期</th>${acts.map(a => `<th>${esc(a)}</th>`).join('')}<th>設備／程式</th><th>時間（分鐘）</th><th>設定</th>${perf ? ui('<th>表現</th>') : ''}<th>難度</th>${fields.map(f => `<th>${esc(fieldLabel(f))}</th>`).join('')}<th>觀察</th></tr></thead><tbody>
      ${rows.map(s => { const d = s.training[item.k]; return `<tr><td>${fmtDate(s.date)}</td>${acts.map(a => `<td>${esc(actCell(d, a))}</td>`).join('')}<td>${esc(d.program)}</td><td>${esc(d.dur ?? '-')}</td><td>${esc(d.level)}</td>${perf ? `<td>${esc(d.perf)}</td>` : ''}<td>${esc(d.diff ?? '-')}</td>${fields.map(f => `<td>${esc(d.values?.[f.id] ?? '-')}</td>`).join('')}<td>${esc(d.notes)}</td></tr>`; }).join('')}</tbody></table></div></section>`);
  }
  const runRows = asc.flatMap(s => Object.values(s.training || {}).flatMap(d => d?.on ? (d.runs || []).map(r => ({ s, r })) : []));
  for (const id of new Set(runRows.map(x => x.r.item))) {
    const item = deviceItem(id); if (!item) continue;
    const list = runRows.filter(x => x.r.item === id);
    const fields = fieldsFor(item).filter(f => f.group !== 'setting' && list.some(x => hasValue(x.r.values?.[f.id])));
    parts.push(ui`<section class="panel"><h3>${esc(labelText(item.name))}（復健測驗紀錄）</h3><p class="note" style="margin:4px 0 10px">復健時的每次測驗，各自顯示當次設定。</p>
      <div class="scroll"><table class="out"><thead><tr><th>日期</th><th>時間</th>${fields.map(f => `<th>${esc(fieldLabel(f))}</th>`).join('')}<th>測驗設定</th></tr></thead><tbody>
      ${list.map(({ s, r }) => `<tr><td>${fmtDate(s.date)}</td><td>${esc(r.time || '-')}</td>${fields.map(f => `<td>${esc(shownValue(f, r.values?.[f.id]))}</td>`).join('')}<td style="text-align:left;font-family:var(--f-body)">${esc(settingSummary(item, r.values))}</td></tr>`).join('')}
      </tbody></table></div></section>`);
  }
  const edRows = asc.flatMap(s => s.training?.ocular?.on ? (s.training.ocular.eyedot || []).map(r => ({ s, r })) : []);
  if (edRows.length) {
    parts.push(ui`<section class="panel"><h3>EyeDot Trainer 訓練紀錄</h3><p class="note" style="margin:4px 0 10px">按日期顯示眼球運動訓練中的每筆紀錄。</p>
      <div class="scroll"><table class="out"><thead><tr><th>日期</th><th>模式</th><th>速度</th><th>時間</th><th>設定</th><th>次數</th><th>最佳表現</th><th>備註</th></tr></thead><tbody>
      ${edRows.map(({ s, r }) => `<tr><td>${fmtDate(s.date)}</td><td>${esc(labelText(r.mode))}</td><td>${esc(edSpeedLabel(r.mode, r.speed) || '')}</td><td>${esc(labelText(r.dur))}</td>
        <td>${esc([labelText(r.dir), r.trail ? ui('軌跡') + ui('：') + labelText(r.trail) : null, labelText(r.dot), r.full === 'Yes' ? ui('全螢幕') : null].filter(Boolean).join(ui('、')))}</td>
        <td>${r.count != null ? esc(r.count) + ' ' + edCountLabel(r.mode) : '–'}</td><td>${esc(r.best || '–')}</td><td style="text-align:left;font-family:var(--f-body)">${esc(r.notes || '')}</td></tr>`).join('')}
      </tbody></table></div></section>`);
  }
  $('#tabBody').innerHTML = parts.join('') || ui`<section class="panel empty"><h3>尚無追蹤結果</h3><p>在復健紀錄中填寫症狀評分、評估或復健結果並儲存後，即可在此比較。</p></section>`;
}

function renderPlan() {
  const c = cur();
  const section = (kind, title, items) => ui`<section class="panel">
    <div class="spread"><h3>${title}</h3><button class="btn app-primary" data-action="${kind === 'assessment' ? 'plan-add' : 'training-add'}">＋ ${kind === 'assessment' ? ui('新增評估項目') : ui('新增復健項目')}</button></div>
    <p class="note">${kind === 'assessment' ? ui('設定評估時機與結果欄位；符合本次紀錄類型的項目會標示「本次應評估」。') : ui('每項包含活動、設備、時間、設定、表現、難度與觀察，也能自行增加結果欄位。')}</p>
    <div class="plan-edit" id="${kind === 'assessment' ? 'planEdit' : 'trainingEdit'}">${items.map(item => {
      const key = itemKey(item, kind), name = labelText(item.name || item.label), active = item.active !== false;
      return ui`<article class="template-row" data-item-id="${key}"><div class="template-info"><h4>${esc(name)}${!active ? ui(' <span class="chip">已停用</span>') : ''}</h4>
        <p class="note">${kind === 'assessment' ? esc(ui(TIMING[item.timing] || TIMING.assessment)) + ' · ' : ''}${item.copm ? ui('COPM：最多 5 項職能活動，表現與滿意度 1 至 10 分') : esc(fieldsFor(item).map(fieldLabel).join(ui('、')) || (kind === 'training' ? ui('通用復健紀錄欄位') : ui('尚未設定結果欄位')))}</p>
        ${kind === 'training' && item.acts?.length ? ui`<p class="note">活動：${esc(item.acts.map(labelText).join(ui('、')))}</p>` : ''}</div>
        <div class="row"><button class="btn small" data-action="item-edit" data-kind="${kind}" data-id="${key}" aria-label="${esc(ui('編輯 {0}', name))}">編輯</button>
          ${item.copm ? '' : ui`<button class="btn small" data-action="item-copy" data-kind="${kind}" data-id="${key}" aria-label="${esc(ui('複製 {0}', name))}">複製</button>`}
          <button class="btn small" data-action="item-toggle" data-kind="${kind}" data-id="${key}" aria-label="${esc(active ? ui('停用 {0}', name) : ui('啟用 {0}', name))}">${active ? ui('停用') : ui('啟用')}</button></div></article>`;
    }).join('') || ui('<p class="note">尚無項目，請按新增項目，選擇現有模板或建立空白模板。</p>')}</div></section>`;
  const initialItems = c.plan.filter(p => p.active !== false);
  const initialPanel = ui`<section class="panel" aria-labelledby="initialHeading"><h3 id="initialHeading">初次評估項目</h3>
    <p class="note">勾選初次評估（基準評估）要施測的項目。填寫基準評估時，這些項目列在最前面；療程後與追蹤評估只列出其中依評估時機應再評估的項目。實際施測後，再於病歷中勾選並填寫。</p>
    ${initialItems.length ? `<div class="pick-group" id="initialPicks" role="group" aria-labelledby="initialHeading" style="margin-top:12px">${initialItems.map(p => `<label class="pick"><input type="checkbox" data-initial="${p.id}" ${isInitial(p) ? 'checked' : ''}>${esc(labelText(p.name))}</label>`).join('')}</div>` : ui('<p class="note">尚無啟用的評估項目。</p>')}</section>`;
  $('#tabBody').innerHTML = ui`<div class="plan-edit"><div><h3>評估與復健項目設定</h3><p class="note">以下設定適用於 ${esc(clientLabel(c))}。從既有模板開始，或建立空白項目。停用項目仍保留歷史結果；新增個案時可複用這份設定。</p></div>
    ${initialPanel}${section('assessment', ui('評估項目'), c.plan)}${section('training', ui('復健項目'), trainingPlan(c))}</div>`;
  $('#initialPicks')?.addEventListener('change', e => setInitial(e.target));
}
// Saves one item's place in the initial assessment right away, like enabling or disabling an item.
async function setInitial(box) {
  const c = cur(), id = box.dataset.initial;
  if (!c || !id) return;
  if (savingItems) { box.checked = !box.checked; return; }
  const next = preserveLegacyTemplates(clone(c), c);
  next.plan.find(p => p.id === id).initial = box.checked;
  savingItems = true;
  try { await safe(() => store.saveClient(next), ui('項目設定儲存失敗')); }
  catch (_) { box.checked = !box.checked; return; }
  finally { savingItems = false; }
  clients[clients.findIndex(client => client.id === c.id)] = next;
  toast(box.checked ? ui('已列入初次評估項目。') : ui('已移出初次評估項目。'));
}
function itemForm(kind, key = null, fromEditor = false, duplicate = false) {
  const c = cur(), assessment = kind === 'assessment', listKey = assessment ? 'plan' : 'trainingPlan';
  const list = assessment ? c.plan : trainingPlan(c), old = list.find(item => itemKey(item, kind) === key);
  if (fromEditor) editing = collectSession();
  const creating = !old || duplicate, newKey = creating ? uid(assessment ? 'p' : 't') : key;
  let draft = old ? clone(old) : assessment ? { name: '', domain: '', timing: 'assessment', fields: [{ id: uid('f'), label: ui('結果'), type: 'text' }] } : { label: '', acts: [], fields: [] };
  if (assessment) draft.category = assessmentCategory(draft);
  draft[assessment ? 'id' : 'k'] = newKey;
  if (duplicate) { draft[assessment ? 'name' : 'label'] = labelText(draft.name || draft.label) + ui('（副本）'); draft.active = true; }
  draft.fields = fieldsFor(draft);
  const seeds = assessment ? DEFAULT_PLAN.filter(item => !item.copm) : TRAIN;
  let base = '';
  const heading = assessment ? (creating ? ui('新增評估項目') : ui('編輯評估項目')) : (creating ? ui('新增復健項目') : ui('編輯復健項目'));
  const m = modal(`<h3>${heading}</h3><form id="itemForm" class="item-form"></form>`);
  m.style.width = 'min(760px, 100%)';
  const form = m.querySelector('form');
  const read = () => {
    draft[assessment ? 'name' : 'label'] = $('#item-name').value.trim();
    if (assessment) { draft.category = draft.copm ? 'functional' : $('#item-category').value; draft.domain = $('#item-domain').value.trim(); draft.timing = draft.copm ? 'bp' : $('#item-timing').value; draft.outcome = $('#item-outcome').value.trim(); }
    else draft.acts = [...new Set($('#item-acts').value.split(/\r?\n/).map(s => s.trim()).filter(Boolean))];
    draft.fields = [...form.querySelectorAll('.field-editor')].map((row, i) => {
      const get = suffix => $('#item-field-' + i + '-' + suffix)?.value || '';
      const field = { id: draft.fields[i].id, label: get('label').trim(), type: get('type'), unit: get('unit').trim(), ...(draft.fields[i].group ? { group: draft.fields[i].group } : {}) };
      if (field.type === 'select') field.options = [...new Set(get('options').split(/\r?\n/).map(s => s.trim()).filter(Boolean))];
      if (field.type === 'number') for (const prop of ['min', 'max', 'step']) if (get(prop).trim()) field[prop] = Number(get(prop));
      return field;
    });
  };
  const draw = () => {
    form.innerHTML = ui`${creating && !duplicate ? ui`<label class="f" for="item-base">從模板開始<select id="item-base"><option value="">空白模板</option>${seeds.map((item, i) => `<option value="${i}" ${base === String(i) ? 'selected' : ''}>${esc(labelText(item.name || item.label))}</option>`).join('')}</select></label>` : ''}
      <label class="f" for="item-name">項目名稱<input type="text" id="item-name" value="${val(labelText(draft.name || draft.label))}" maxlength="180" required></label>
      ${assessment ? ui`<label class="f" for="item-category">分類<select id="item-category" aria-label="分類" ${draft.copm ? 'disabled' : ''}>${['visual', 'functional'].map(category => `<option value="${category}" ${assessmentCategory(draft) === category ? 'selected' : ''}>${esc(assessmentCategoryLabel(category))}</option>`).join('')}</select></label>
        <div class="grid"><label class="f" for="item-domain">評估領域<input type="text" id="item-domain" value="${val(labelText(draft.domain))}"></label>
        <label class="f" for="item-timing">評估時機<select id="item-timing" ${draft.copm ? 'disabled' : ''}>${Object.entries(TIMING).map(([k, text]) => `<option value="${k}" ${draft.timing === k ? 'selected' : ''}>${ui(text)}</option>`).join('')}</select></label></div>
        <label class="f" for="item-outcome">填寫說明<input type="text" id="item-outcome" value="${val(labelText(draft.outcome))}"></label>`
        : ui`<label class="f" for="item-acts">可選活動（每行一項）<textarea id="item-acts">${esc((draft.acts || []).map(labelText).join('\n'))}</textarea></label><p class="note" style="margin:0">已包含設備、時間、設定、表現、難度與觀察。下方可增加其他欄位。</p>`}
      ${draft.copm ? ui('<p class="note">COPM 保留專用的職能活動、表現與滿意度表格，以及基準比較。評估時機固定為基準與療程後。</p>') : ui`<div><h4>${assessment ? ui('結果欄位') : ui('其他結果欄位')}</h4><div id="item-fields">${draft.fields.map((f, i) => ui`<div class="field-editor" data-i="${i}">
        <div class="field-top"><label class="f field-name" for="item-field-${i}-label">欄位名稱<input type="text" id="item-field-${i}-label" value="${val(labelText(f.label))}" required></label>
        <label class="f" for="item-field-${i}-type">類型<select id="item-field-${i}-type" data-field-type>${Object.entries(FIELD_TYPES).map(([k, text]) => `<option value="${k}" ${(f.type || 'text') === k ? 'selected' : ''}>${ui(text)}</option>`).join('')}</select></label>
        <label class="f" for="item-field-${i}-unit">單位（選填）<input type="text" id="item-field-${i}-unit" value="${val(f.unit)}"></label>
        <button type="button" class="btn small danger" data-item-action="remove" data-i="${i}" aria-label="${esc(ui('移除第 {0} 個欄位', i + 1))}">移除</button></div>
        ${f.type === 'number' ? `<div class="grid">${[['min', ui('最小值')], ['max', ui('最大值')], ['step', ui('間隔')]].map(([prop, text]) => ui`<label class="f" for="item-field-${i}-${prop}">${text}（選填）<input type="number" step="any" id="item-field-${i}-${prop}" value="${val(f[prop])}"></label>`).join('')}</div>` : ''}
        ${f.type === 'select' ? ui`<label class="f" for="item-field-${i}-options">選項（每行一項）<textarea id="item-field-${i}-options" required>${esc((f.options || []).join('\n'))}</textarea></label>` : ''}
        </div>`).join('')}</div><button type="button" class="btn small" data-item-action="add" style="margin-top:10px">＋ 新增欄位</button></div>`}
      <p id="item-error" role="alert" style="margin:0;color:var(--bad)" hidden></p>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-item-action="cancel">取消</button><button type="submit" class="btn app-primary">儲存項目</button></div>`;
  };
  form.addEventListener('change', e => {
    if (e.target.id === 'item-base') {
      base = e.target.value;
      draft = base === '' ? (assessment ? { name: '', timing: 'assessment', fields: [{ id: uid('f'), label: ui('結果'), type: 'text' }] } : { label: '', acts: [], fields: [] }) : clone(seeds[Number(base)]);
      if (assessment) draft.category = assessmentCategory(draft);
      draft[assessment ? 'id' : 'k'] = newKey; draft.fields = fieldsFor(draft).map(f => ({ ...f, id: uid('f') })); draw(); $('#item-name').focus();
    } else if (e.target.hasAttribute('data-field-type')) { read(); draw(); $('#item-field-' + e.target.closest('.field-editor').dataset.i + '-type').focus(); }
  });
  form.addEventListener('click', e => {
    const button = e.target.closest('[data-item-action]'); if (!button) return;
    if (button.dataset.itemAction === 'cancel') { closeModal(); return; }
    read();
    if (button.dataset.itemAction === 'add') draft.fields.push({ id: uid('f'), label: '', type: 'text' });
    else draft.fields.splice(Number(button.dataset.i), 1);
    draw();
    if (button.dataset.itemAction === 'add') $('#item-field-' + (draft.fields.length - 1) + '-label').focus();
  });
  form.onsubmit = async e => {
    e.preventDefault(); if (savingItems) return; read();
    const error = $('#item-error');
    try {
      if (!draft[assessment ? 'name' : 'label']) throw new Error(ui('請填寫項目名稱。'));
      if (assessment && !draft.copm && !draft.fields.length) throw new Error(ui('評估項目至少需要一個結果欄位。'));
      if (new Set(draft.fields.map(f => fieldLabel(f))).size !== draft.fields.length) throw new Error(ui('欄位名稱與單位不可重複。'));
      validateItems([draft], kind);
      const next = preserveLegacyTemplates(clone(c), c); next[listKey] = clone(list);
      if (creating) next[listKey].push(draft); else next[listKey][list.findIndex(item => itemKey(item, kind) === key)] = draft;
      const submit = form.querySelector('[type="submit"]'), controls = [...form.querySelectorAll('input, select, textarea, button')].filter(control => !control.disabled);
      controls.forEach(control => { control.disabled = true; }); submit.textContent = ui('正在儲存…'); savingItems = true;
      try { await store.saveClient(next); } finally { savingItems = false; controls.forEach(control => { control.disabled = false; }); submit.textContent = ui('儲存項目'); }
      clients[clients.findIndex(client => client.id === c.id)] = next;
      closeModal();
      if (fromEditor) {
        if (creating && assessment) editing.assess[newKey] = { done: true, values: {} };
        if (creating && !assessment) editing.training[newKey] = { on: true, acts: [] };
        dirty = true; renderEditor(); $('#' + (assessment ? 'as-' : 'tx-') + newKey)?.scrollIntoView({ block: 'center' });
      } else renderMain();
      toast(ui('項目已儲存，可在復健紀錄中填寫。'));
    } catch (err) { error.hidden = false; error.textContent = ui('項目未儲存：') + (err.message || err); }
  };
  draw(); $('#item-name').focus();
}

function blankSession() {
  const nums = sessions.map(s => +s.num || 0);
  const last = byDate(sessions).slice(-1)[0];
  const visit = sessions.length ? 'treatment' : 'baseline';
  return { id: null, date: today(), num: (nums.length ? Math.max(...nums) : 0) + 1, visit, mode: 'inperson', clinician: last?.clinician || '', duration: null,
    subjective: '', feedback: '',
    sym: shapeSym([], visit),
    assess: {}, training: {}, otherTx: '', tolerance: null, assessment: '', plan: '', nextDate: '' };
}

function symTableHTML() {
  const rows = editing.sym;
  const base = firstRated(rows);
  return ui`<table class="sym"><thead><tr><th style="text-align:left;padding-left:10px">評分時點</th>
    ${SYMS.map(s => `<th title="${esc(ui(s.q))}">${language === 'en' ? s.en : s.zh}</th>`).join('')}
    <th>總分</th><th>與首次<br>評分差異</th><th><span class="sr" style="position:absolute;left:-9999px">移除</span></th></tr></thead><tbody>
    ${rows.map(r => {
      const cls = { pre: 'pre', sub: 'pre', end: 'end', rec: 'rec', blk: 'blk' }[r.kind];
      const tp = `<div class="tpname">${esc(tpName(r, false))}</div>${r.kind === 'rec' ? ui`<div class="tpsub"><label for="syr-${r.id}">恢復時間</label><input type="number" min="0" id="syr-${r.id}" value="${val(r.recMin)}"> 分鐘</div>` : ''}`;
      return `<tr class="${cls}" data-row="${r.id}"><td class="tp">${tp}</td>
        ${SYMS.map(s => { const v = r.scores?.[s.k]; const b = base?.scores?.[s.k];
          const flag = base && r.id !== base.id && v != null && b != null && v - b >= 2;
          return ui`<td><input class="num ${flag ? 'flag' : ''}" type="number" min="0" max="10" step="1" inputmode="numeric" id="sy-${r.id}-${s.k}" value="${val(v)}" aria-label="${esc(tpName(r) + '，' + s.en)}，0 至 10 分"></td>`; }).join('')}
        <td><span class="tot" id="syt-${r.id}">–</span></td><td><span class="delta" id="syd-${r.id}">–</span></td>
        <td>${r.kind === 'blk' || r.kind === 'rec' ? ui`<button type="button" class="btn x" data-action="sym-del" data-id="${r.id}" aria-label="移除此評分時點">×</button>` : ''}</td></tr>`;
    }).join('')}</tbody></table>`;
}
function readSym() {
  return editing.sym.map(r => {
    const o = { id: r.id, kind: r.kind, scores: {} };
    for (const k of SK) { const el = $(`#sy-${r.id}-${k}`); o.scores[k] = el ? nrs(el.value) : (r.scores?.[k] ?? null); }
    for (const k of Object.keys(r.scores || {})) if (!SK.includes(k)) o.scores[k] = r.scores[k];   // keep retired items (e.g. double vision) in the record
    if (r.kind === 'sub') o.test = r.test;
    if (r.kind === 'blk') o.label = r.label || '';
    if (r.kind === 'rec') { const el = $('#syr-' + r.id); o.recMin = el ? numOrNull(el.value) : r.recMin ?? null; }
    return o;
  });
}
function rerenderSym() { $('#symWrap').innerHTML = symTableHTML(); updateSym(); }
function updateSym() {
  const rows = readSym();
  const base = firstRated(rows); const bt = rowTotal(base);
  for (const r of rows) {
    const t = rowTotal(r); $('#syt-' + r.id).textContent = t ?? '–';
    const d = $('#syd-' + r.id);
    if (base && r.id !== base.id && t != null && bt != null) { const x = t - bt; d.textContent = signed(x); d.className = 'delta ' + (x > 0 ? 'up' : x < 0 ? 'down' : ''); }
    else { d.textContent = '–'; d.className = 'delta'; }
    for (const k of SK) {
      const el = $(`#sy-${r.id}-${k}`); const v = r.scores[k], b = base?.scores?.[k];
      const flag = base && r.id !== base.id && v != null && b != null && v - b >= 2;
      el.classList.toggle('flag', flag); el.title = flag ? ui('比首次評分增加至少 2 分') : '';
    }
  }
  const rec = rows.find(r => r.kind === 'rec');
  $('#symSummary').innerHTML = rows.filter(r => r.kind !== 'rec' && rowTotal(r) != null)
    .map(r => `<div class="${r.kind === 'end' ? 'metric-end' : r.kind === 'pre' ? 'metric-pre' : ''}"><dt>${esc(tpName(r))}</dt><dd>${rowTotal(r)}</dd></div>`).join('') +
    (() => { const l = lastRated(rows); return base && l && l.id !== base.id ? ui`<div class="metric-change ${rowTotal(l) - bt > 0 ? 'bad' : rowTotal(l) - bt < 0 ? 'good' : ''}"><dt>變化</dt><dd>${signed(rowTotal(l) - bt)}</dd></div>` : ''; })() +
    (rec && rec.recMin != null ? ui`<div><dt>恢復時間</dt><dd>${rec.recMin} 分鐘</dd></div>` : '');
  $('#addRec').hidden = !!rec;
}

// Chip pickers follow the NTUHLowvision outpatient form: tick what was done, then only those items open for entry.
function pickGroups(groups) {
  return groups.filter(g => g.items.length).map(g => g.title
    ? `<div class="pick-label" id="${g.id}">${esc(g.title)}</div><div class="pick-group" role="group" aria-labelledby="${g.id}">${g.items.join('')}</div>`
    : `<div class="pick-group" role="group" aria-label="${esc(g.label)}">${g.items.join('')}</div>`).join('');
}
function assessHTML(c, s, category) {
  const shown = assessmentItems(c, s).filter(p => assessmentCategory(p) === category && (p.active !== false || hasAssessmentData(s.assess?.[p.id])) && (!p.copm || COPM_VISITS.includes(s.visit)));
  if (!shown.length) return '';
  const prevCopm = (() => { for (const x of byDate(sessions).reverse()) { if (x.id !== s.id && x.assess?.copm?.copm?.some(r => r.occ)) return x.assess.copm.copm; } return null; })();
  const planned = shown.filter(p => isPlanned(p, s.visit)), others = shown.filter(p => !isPlanned(p, s.visit));
  const chip = p => `<label class="pick"><input type="checkbox" id="ac-${p.id}" ${s.assess?.[p.id]?.done ? 'checked' : ''}>${esc(labelText(p.name))}</label>`;
  const picks = planned.length
    ? pickGroups([{ id: 'assessPlanned-' + category, title: s.visit === 'baseline' ? ui('初次評估項目') : ui('本次應評估'), items: planned.map(chip) },
      { id: 'assessOther-' + category, title: ui('其他項目'), items: others.map(chip) }])
    : pickGroups([{ label: assessmentCategoryLabel(category), items: others.map(chip) }]);
  return picks + '<div class="picked">' + [...planned, ...others].map(p => {
    const a = s.assess?.[p.id] || {};
    const detail = [p.domain, p.outcome].filter(Boolean).map(labelText).join(' · ');
    let inner;
    if (p.copm) {
      const rows = (a.copm && a.copm.length ? a.copm : (prevCopm || [])).map(r => ({ occ: r.occ, perf: a.copm ? r.perf : null, sat: a.copm ? r.sat : null }));
      while (rows.length < 5) rows.push({ occ: '', perf: null, sat: null });
      inner = ui`<div class="copm"><span class="h">優先職能活動</span><span class="h">表現 1 至 10</span><span class="h">滿意度 1 至 10</span>
        ${rows.slice(0, 5).map((r, i) => `<input type="text" id="copm-occ-${i}" value="${val(r.occ)}" aria-label="${esc(ui('第 {0} 項職能活動', i + 1))}">
          <input type="number" min="1" max="10" id="copm-p-${i}" value="${val(r.perf)}" aria-label="${esc(ui('第 {0} 項活動表現', i + 1))}">
          <input type="number" min="1" max="10" id="copm-s-${i}" value="${val(r.sat)}" aria-label="${esc(ui('第 {0} 項活動滿意度', i + 1))}">`).join('')}</div>
        <dl class="score-summary" id="copmSum" aria-label="COPM 評分摘要"></dl>
        ${prevCopm && !a.copm ? ui('<p class="note" style="margin:0">已帶入上次 COPM 的職能活動，請對相同活動重新評分。</p>') : ''}`;
    } else {
      inner = `<div class="grid">${fieldInputs(p, 'af-' + p.id, a.values)}</div>`;
    }
    inner += ui`<label class="f" for="an-${p.id}">備註<input type="text" id="an-${p.id}" value="${val(a.notes)}"></label>`;
    return `<section class="as" id="as-${p.id}" data-id="${p.id}" aria-labelledby="as-${p.id}-h" ${a.done ? '' : 'hidden'}>
      <div class="as-head"><b id="as-${p.id}-h">${esc(labelText(p.name))}</b>${detail ? `<span>${esc(detail)}</span>` : ''}</div>
      <div class="as-body">${inner}</div></section>`;
  }).join('') + '</div>';
}
function updateCopm() {
  const box = $('#copmSum'); if (!box) return;
  const rows = [0, 1, 2, 3, 4].map(i => ({ perf: numOrNull($('#copm-p-' + i).value), sat: numOrNull($('#copm-s-' + i).value) }));
  const a = copmAvg(rows), b = copmBaseline(editing.id, ($('#s-date') || {}).value, ($('#s-visit') || {}).value);
  const ch = (v, bv) => v != null && bv != null ? ui` <span class="delta ${v - bv > 0 ? 'down' : v - bv < 0 ? 'up' : ''}">（${signed(v - bv)}，相較 ${fmtDate(b.date)}）</span>` : '';
  box.innerHTML = ui`<div><dt>表現平均</dt><dd>${a.perf ?? '-'}${ch(a.perf, b?.perf)}</dd></div><div><dt>滿意度平均</dt><dd>${a.sat ?? '-'}${ch(a.sat, b?.sat)}</dd></div>`;
}

function interventionPicks(approach) {
  return [...document.querySelectorAll(`#${approach}Picks input:checked`)].map(input => input.dataset.strategy);
}
function interventionHTML(mode, approach, picks = []) {
  const currentMode = mode || 'inperson', catalog = INTERVENTIONS[currentMode][approach];
  const ids = [...new Set([...Object.keys(catalog), ...picks])];
  return pickGroups([{ label: approachLabel(approach), items: ids.map(id => {
    const otherMode = Object.keys(INTERVENTIONS).find(key => key !== currentMode && Object.hasOwn(INTERVENTIONS[key][approach], id));
    const label = strategyLabel(approach, id) + (otherMode ? ` (${serviceModeLabel(otherMode)})` : '');
    return `<label class="pick"><input type="checkbox" data-strategy="${esc(id)}" ${picks.includes(id) ? 'checked' : ''}>${esc(label)}</label>`;
  }) }]);
}
function renderEditor() {
  const c = cur(), s = editing;
  const visualAssess = assessHTML(c, s, 'visual'), functionalAssess = assessHTML(c, s, 'functional');
  // 0–10 ratings use the same number boxes as the symptom table; an empty box means not rated.
  const rate = (id, v, label) => `<label class="f" for="${id}">${label}<input type="number" min="0" max="10" step="1" inputmode="numeric" id="${id}" value="${val(v)}"></label>`;
  s.training = s.training || {};
  s.training.ocular = s.training.ocular || {};
  s.training.ocular.eyedot = (s.training.ocular.eyedot || []).map(r => ({ id: r.id || uid('e'), ...r }));
  const txItems = trainingItems(c, s).filter(t => t.active !== false || hasTrainingData(s.training?.[t.k]));
  const txPicks = pickGroups([{ label: ui('本次復健項目'), items: txItems.map(t => `<label class="pick"><input type="checkbox" id="tx-${t.k}-on" ${s.training?.[t.k]?.on ? 'checked' : ''}>${esc(labelText(t.label))}</label>`) }]);
  const txBlocks = txItems.map(t => {
    const d = s.training?.[t.k] || {};
    // the client's own typed activities from earlier sessions come back as options
    const custom = [...new Set([...sessions.flatMap(x => x.training?.[t.k]?.acts || []), ...(d.acts || [])])].filter(a => !(t.acts || []).some(existing => labelText(existing) === labelText(a)));
    const allActs = [...new Map([...(t.acts || []), ...custom].map(a => [labelText(a), a])).values()];
    const selected = a => (d.acts || []).find(x => labelText(x) === labelText(a));
    return ui`<section class="tx" id="tx-${t.k}" aria-labelledby="tx-${t.k}-h" ${d.on ? '' : 'hidden'}>
      <h4 class="tx-head" id="tx-${t.k}-h">${esc(labelText(t.label))}</h4>
      <div class="tx-body">
        <div class="acts" id="tx-${t.k}-acts">${allActs.map((a, i) => actChip(t.k, i, a, selected(a) != null)).join('')}</div>
        <div class="row"><input type="text" id="tx-${t.k}-new" data-k="${t.k}" placeholder="輸入活動名稱" style="flex:1;min-width:0" aria-label="新增${esc(labelText(t.label))}活動"><button type="button" class="btn small" data-action="act-add" data-k="${t.k}">加入活動</button></div>
        <div class="act-score-box"><div class="pick-label">各活動表現（一項一個分數）</div>
          <div class="act-scores" id="tx-${t.k}-scores">${allActs.map((a, i) => actScoreRow(t.k, i, a, selected(a) != null, d.actScores?.[selected(a)])).join('')}</div></div>
        ${RUN_ITEMS[t.k] ? runsHTML(t.k, d.runs || []) : ''}
        ${t.k === 'ocular' ? ui`<div class="sub" style="border-top:0;padding-top:4px">
          <div class="spread"><h4>EyeDot Trainer 訓練紀錄</h4><div class="row"><button type="button" class="btn small" data-action="eye-help">模式說明</button>
            <button type="button" class="btn small" data-action="ed-add">新增紀錄</button></div></div>
          <div id="edWrap">${eyedotHTML(s.training.ocular.eyedot)}</div></div>` : ''}
        <div class="grid">
          <label class="f" for="tx-${t.k}-program">程式／設備<input type="text" id="tx-${t.k}-program" value="${val(d.program)}" placeholder="使用的軟體或工具"></label>
          <label class="f" for="tx-${t.k}-dur">時間（分鐘）<input type="number" min="0" step="any" id="tx-${t.k}-dur" value="${val(d.dur)}"></label>
          <label class="f" for="tx-${t.k}-level">級別／設定<input type="text" id="tx-${t.k}-level" value="${val(d.level)}" placeholder="速度、目標大小、視野範圍"></label>
          ${!allActs.length || d.perf ? ui`<label class="f" for="tx-${t.k}-perf">${allActs.length ? ui('整體表現') : ui('表現')}<input type="text" id="tx-${t.k}-perf" value="${val(d.perf)}" placeholder="正確率、反應時間、得分"></label>` : ''}
          ${rate(`tx-${t.k}-diff`, d.diff, ui('個案自評難度（0 至 10）'))}
        </div>
        ${fieldsFor(t).length ? `<div class="grid">${fieldInputs(t, 'tf-' + t.k, d.values)}</div>` : ''}
        <label class="f" for="tx-${t.k}-notes">觀察紀錄<textarea id="tx-${t.k}-notes" style="min-height:60px">${val(d.notes)}</textarea></label>
      </div></section>`;
  }).join('');

  $('#main').innerHTML = ui`
    <div class="editor-head">
      <div class="spread"><div class="client-identity"><span class="eyebrow">${s.id ? ui('編輯復健紀錄') : ui('新增復健紀錄')}</span><h2>${esc(clientLabel(c))}</h2></div><span class="chip acc">編輯中</span></div>
      <p class="note save-hint">${store.kind === 'folder' ? ui('儲存到：') + esc(storageName()) + ' / ' + esc(store.folderOf?.(c.id) || safeName(c.ref || c.name || c.id)) + ui('。本次紀錄使用同名的 CSV、PDF 與 TXT。') : ui('瀏覽器模式：儲存後會下載 ZIP，內含個案資料夾與本次 CSV、PDF。若要直接寫入固定資料夾，請使用支援資料夾存取的 Chrome／Edge。')}</p>
    </div>
    ${profileIncompleteHTML(c)}
    <form class="panel soap" id="soapForm" autocomplete="off">
      <datalist id="blockList">${BLOCK_SUGGEST.map(b => `<option value="${esc(labelText(b))}"></option>`).join('')}</datalist>
      <div class="grid">
        <label class="f" for="s-date">復健日期<input type="date" id="s-date" value="${val(s.date)}" required></label>
        <label class="f" for="s-num">復健次數<input type="number" min="1" id="s-num" value="${val(s.num)}"></label>
        <label class="f" for="s-visit">紀錄類型<select id="s-visit">${VISITS.map(v => `<option value="${v.k}" ${s.visit === v.k ? 'selected' : ''}>${ui(v.label)}</option>`).join('')}</select></label>
        <label class="f" for="s-mode">服務型態<select id="s-mode" aria-label="服務型態">${s.mode == null ? ui('<option value="" selected>未指定</option>') : ''}<option value="inperson" ${s.mode === 'inperson' ? 'selected' : ''}>面對面</option><option value="telerehab" ${s.mode === 'telerehab' ? 'selected' : ''}>遠距復健</option></select></label>
        <label class="f" for="s-clin">治療師<input type="text" id="s-clin" value="${val(s.clinician)}"></label>
        <label class="f" for="s-dur">復健時間（分鐘）<input type="number" min="0" step="any" id="s-dur" value="${val(s.duration)}"></label>
      </div>

      <section id="absBlock" class="sub" style="border-top:0;padding-top:0" ${s.visit === 'absent' ? '' : 'hidden'}>
        <div class="sec-title"><h3>缺席紀錄</h3><span class="note">本次未出席，不填寫 SOAP 或症狀評分。</span></div>
        <div class="grid">
          <label class="f" for="abs-reason">缺席原因<select id="abs-reason"><option value="">請選擇</option>${ABSENCE_REASONS.map(r => `<option value="${esc(r)}" ${s.absence?.reason === r ? 'selected' : ''}>${esc(ui(r))}</option>`).join('')}</select></label>
          <label class="f" for="abs-notified">是否通知<select id="abs-notified"><option value="">請選擇</option>${NOTIFIED.map(r => `<option value="${esc(r)}" ${s.absence?.notified === r ? 'selected' : ''}>${esc(ui(r))}</option>`).join('')}</select></label>
          <label class="f" for="abs-next">改約日期<input type="date" id="abs-next" value="${val(s.nextDate)}"></label>
        </div>
        <label class="f" for="abs-contact">聯絡紀錄與後續<textarea id="abs-contact" style="min-height:80px" placeholder="記錄聯絡方式、回覆與後續安排">${val(s.absence?.contact)}</textarea></label>
      </section>

      <div id="soapBlock" ${s.visit === 'absent' ? 'hidden' : ''}>
      <section class="soap-sec"><div class="letter">S</div><div class="sec-body">
        <div class="sec-title"><h3>主觀描述</h3><span class="note">症狀、與前次的變化、日常活動表現</span></div>
        <textarea id="s-subj" aria-label="主觀描述" placeholder="記錄個案的主訴">${val(s.subjective)}</textarea>
        <label class="f" for="s-fb">個案對本次復健的回饋<textarea id="s-fb" style="min-height:60px" placeholder="訓練進行中與結束後的感受">${val(s.feedback)}</textarea></label>
      </div></section>

      <section class="soap-sec"><div class="letter">O</div><div class="sec-body">
        <div class="sec-title"><h3>評估</h3></div>
        <label class="f" for="s-obj">觀察與客觀描述<textarea id="s-obj" style="min-height:80px">${val(s.objective)}</textarea></label>

        <div class="sub" style="border-top:0;padding-top:0">
          <div class="row" style="justify-content:flex-end"><button type="button" class="btn small" data-action="plan-add" data-editor="true">＋ 新增評估項目</button></div>
          <p class="note" style="margin:0">勾選本次施測的項目，展開對應的紀錄欄位；未勾選的項目不會存入紀錄。初次評估項目可在「項目設定」調整。</p>
        </div>
        <div id="assessList">
        <section class="sub" style="border-top:0;padding-top:0" id="assess-visual" aria-labelledby="assess-visual-h">
          <h3 id="assess-visual-h">視覺功能</h3>
          <div class="sub" style="border-top:0;padding-top:0">
          <div class="spread"><h4>症狀評分（NRS，0 至 10）</h4>
            <div class="row"><button type="button" class="btn small" data-action="sym-rec" id="addRec">＋ 新增恢復後評分</button></div></div>
          <p class="note" style="margin:0">各症狀分別評估「現在」的感受，0 分表示沒有症狀，10 分表示能想像最嚴重的程度。每次復健前後評分；評估時另在追視、凝視、跳視測驗前評分。需要時可加入恢復後評分。比首次增加至少 2 分時，欄位會標紅並顯示提示。</p>
          <details class="script"><summary>給個案的評分說明</summary><div class="body">
            <p style="margin:0">請用 0 到 10 分，告訴我您現在有多不舒服。0 分就是完全沒有這個症狀；10 分就是您能想像最嚴重、最不舒服的程度。請評「現在」的感覺，不是今天最嚴重的時候，也不是只評比剛才多了多少不舒服。如果現在沒有這個症狀，就給 0 分。</p>
            <dl>${SYMS.map(x => `<dt>${language === 'en' ? x.en : x.zh}</dt><dd>${esc(ui(x.q))}</dd>`).join('')}</dl>
            <p style="margin:0"><b>療程後／下一項測驗前：</b>我們再評一次。請照您現在的感覺給分，跟剛才一樣也沒關係，沒有不舒服就給 0 分。</p>
            <p class="note" style="margin:0">每次使用相同說明與分數端點；各項症狀分開記錄。「疲勞」指眼睛疲勞，不是全身疲倦。</p>
          </div></details>
          <div class="scroll" id="symWrap" tabindex="0" role="region" aria-label="${ui('症狀評分表，可左右捲動')}">${symTableHTML()}</div>
          <dl class="score-summary" id="symSummary" aria-label="症狀分數"></dl>
          </div>
          ${visualAssess}
        </section>
        <section class="sub" id="assess-functional" aria-labelledby="assess-functional-h">
          <h3 id="assess-functional-h">功能性視覺</h3>
          ${functionalAssess}
        </section>
        <div class="sub" style="border-top:0;padding-top:0">
          ${!visualAssess && !functionalAssess ? ui('<span class="muted">本次沒有可填寫的評估項目，可按「新增評估項目」建立。COPM 僅在基準與療程後評估顯示。</span>') : ''}
        </div>
        </div>
      </div></section>

      <section class="soap-sec"><div class="letter">A</div><div class="sec-body">
        <div class="sec-title"><h3>PEO 臨床推理</h3><span class="note">依據評估結果進行介入規劃</span></div>
        <div class="sub" style="border-top:0;padding-top:0">
          <div class="spread"><h4>症狀、推理與介入連結</h4><button type="button" class="btn small" data-action="clinical-link-add">新增症狀連結</button></div>
          <p class="note">每項症狀各自連結推理、評估依據與介入處置。</p>
          <div class="clinical-links" id="clinicalLinks"></div>
        </div>
        <div class="grid">
          <label class="f" for="s-person">個人<textarea id="s-person" placeholder="視覺功能、症狀、個人因素">${val(s.peo?.person)}</textarea></label>
          <label class="f" for="s-environment">環境<textarea id="s-environment" placeholder="居家、工作、數位環境、照明與設備">${val(s.peo?.environment)}</textarea></label>
          <label class="f" for="s-occupation">作業<textarea id="s-occupation" placeholder="日常作業表現、參與需求、COPM 目標">${val(s.peo?.occupation)}</textarea></label>
        </div>
        <label class="f" for="s-ass">臨床判斷與介入規劃<textarea id="s-ass">${val(s.assessment)}</textarea></label>
      </div></section>

      <section class="soap-sec"><div class="letter">P</div><div class="sec-body">
        <div class="sec-title"><h3>介入與計畫</h3><span class="note">以 PEO 架構為指引</span></div>
        <h4>${ui('復能')}</h4>

        <div class="sub" style="border-top:0;padding-top:0">
          <div class="spread"><h3 style="font-size:1rem">復健項目</h3><button type="button" class="btn small" data-action="training-add" data-editor="true">＋ 新增復健項目</button></div>
          <p class="note" style="margin:0">勾選本次進行的項目，再勾選做過的活動，每個活動填一個分數。</p>
          ${txPicks}
          <div class="picked">${txBlocks}</div>
          <label class="f" for="s-otx">其他治療／居家計畫<textarea id="s-otx" style="min-height:60px">${val(s.otherTx)}</textarea></label>
        </div>
        ${['adaptation', 'compensation'].map(approach => ui`<div class="sub">
          <h4>${esc(approachLabel(approach))}</h4>
          <div id="${approach}Picks">${interventionHTML(s.mode, approach, s.interventions?.[approach]?.picks)}</div>
          <label class="f" for="s-${approach}-notes">${approach === 'adaptation' ? ui('調適備註') : ui('代償備註')}<textarea id="s-${approach}-notes">${val(s.interventions?.[approach]?.notes)}</textarea></label>
        </div>`).join('')}
        <div class="grid">${rate('s-tol', s.tolerance, ui('個案自評整體耐受度（0 分最差，10 分最佳）'))}</div>
        <label class="f" for="s-plan">後續計畫<textarea id="s-plan">${val(s.plan)}</textarea></label>
        <div class="grid"><label class="f" for="s-next">下次復健日期<input type="date" id="s-next" value="${val(s.nextDate)}"></label></div>
      </div></section>
      </div>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-action="cancel-edit">取消</button><button type="button" class="btn app-primary" data-action="save-session">儲存 CSV + PDF</button></div>
    </form>`;

  const form = $('#soapForm');
  form.onsubmit = e => e.preventDefault();
  form.addEventListener('input', e => {
    dirty = true;
    const t = e.target;
    if (t.id.startsWith('sy')) updateSym();
    if (t.id.startsWith('copm-') || t.id === 's-date') updateCopm();
    if (t.dataset.clinical || /^(af-|an-|copm-)/.test(t.id)) updateClinicalEvidence();
  });
  form.addEventListener('change', e => {
    dirty = true;
    const t = e.target;
    if (t.id === 's-mode') {
      for (const approach of ['adaptation', 'compensation']) {
        const picks = interventionPicks(approach);
        $('#' + approach + 'Picks').innerHTML = interventionHTML(t.value, approach, picks);
      }
      renderClinicalLinks(collectSession());
    }
    if (t.id.startsWith('ac-')) setSectionEnabled($('#as-' + t.id.slice(3)), t.checked);
    if (t.dataset.clinical || /^(ac-|af-)/.test(t.id)) updateClinicalEvidence();
    const m = t.id.match(/^tx-([A-Za-z0-9_-]+)-on$/);
    if (m) setSectionEnabled($('#tx-' + m[1]), t.checked);
    if (t.dataset.act != null) showActScore(t);
    if (t.id === 's-visit') {
      const was = editing.visit;
      editing = collectSession(); editing.sym = shapeSym(editing.sym, editing.visit);
      // a missed appointment does not use up a session number
      if (editing.visit === 'absent') editing.num = null;
      else if (was === 'absent' && editing.num == null) { const nums = sessions.filter(x => x.id !== editing.id).map(x => +x.num || 0); editing.num = (nums.length ? Math.max(...nums) : 0) + 1; }
      const scrollY = window.scrollY; renderEditor(); window.scrollTo(0, scrollY); }
    if (/^ed-.+-mode$/.test(t.id)) rerenderEd();
  });
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id && /^tx-[A-Za-z0-9_-]+-new$/.test(e.target.id)) { e.preventDefault(); addActivity(e.target.dataset.k); }
  });
  form.querySelectorAll('.as, .tx').forEach(box => setSectionEnabled(box, !box.hidden));
  renderClinicalLinks(s);
  updateSym(); updateCopm();
}

function actChip(k, i, a, on) {
  return `<label class="act"><input type="checkbox" id="tx-${k}-a${i}" data-act="${esc(a)}" data-score="tx-${k}-r${i}" ${on ? 'checked' : ''}>${esc(labelText(a))}</label>`;
}
// Each ticked activity shows its own score box; unticked activities keep no score.
function actScoreRow(k, i, a, on, value) {
  return `<label class="f" id="tx-${k}-r${i}" for="tx-${k}-s${i}" ${on ? '' : 'hidden'}>${esc(labelText(a))}<input type="text" id="tx-${k}-s${i}" value="${val(value)}" placeholder="${esc(ui('例：85%、12 次、40 秒'))}" aria-label="${esc(ui('{0}的表現', labelText(a)))}"></label>`;
}
function showActScore(chip) { const row = document.getElementById(chip.dataset.score); if (row) row.hidden = !chip.checked; }
function addActivity(k) {
  const inp = $(`#tx-${k}-new`), v = inp.value.trim(); if (!v) { inp.focus(); return; }
  const box = $(`#tx-${k}-acts`);
  const existing = [...box.querySelectorAll('input')].find(i => labelText(i.dataset.act).toLocaleLowerCase() === labelText(v).toLocaleLowerCase());
  if (existing) { existing.checked = true; showActScore(existing); }
  else {
    const i = box.querySelectorAll('input').length;
    box.insertAdjacentHTML('beforeend', actChip(k, i, v, true));
    $(`#tx-${k}-scores`).insertAdjacentHTML('beforeend', actScoreRow(k, i, v, true, null));
  }
  inp.value = ''; inp.focus();
  dirty = true;
}

// One card per test run, using the same result and setting boxes as the matching assessment item.
function runsHTML(k, runs) {
  return ui`<div class="runs" id="tx-${k}-runs"><div class="pick-label">測驗紀錄（每次測驗一筆，各自記錄設定）</div>
    ${runs.length ? runs.map(r => runCard(k, r)).join('') : ui('<p class="note" style="margin:0">尚無測驗紀錄。可匯入 OcuTrain 或周邊視野訓練的分數檔，或在下方新增。</p>')}
    <div class="row"><select id="tx-${k}-run-item" aria-label="測驗紀錄項目" style="flex:1;min-width:0">${RUN_ITEMS[k].map(id => `<option value="${id}">${esc(labelText(deviceItem(id).name))}</option>`).join('')}</select>
      <button type="button" class="btn small" data-action="run-add" data-k="${k}">新增測驗紀錄</button></div></div>`;
}
function runCard(k, r) {
  const item = deviceItem(r.item) || { fields: [] }, title = labelText(item.name || r.item);
  return `<section class="run" data-run="${esc(r.id)}" aria-labelledby="rn-${esc(r.id)}-h"><div class="run-head"><h5 id="rn-${esc(r.id)}-h">${esc(title)}${r.time ? ' · ' + esc(r.time) : ''}${r.file ? `<span class="note">${esc(ui('來源：') + r.file)}</span>` : ''}</h5>
    <button type="button" class="btn x" data-action="run-del" data-k="${k}" data-id="${esc(r.id)}" aria-label="${esc(ui('移除{0}測驗紀錄', title))}">×</button></div>
    <div class="grid">${fieldInputs(item, 'rn-' + esc(r.id), r.values)}</div></section>`;
}
function readRuns(k) {
  return (editing?.training?.[k]?.runs || []).map(r => ({ ...r, values: readFields(deviceItem(r.item) || { fields: [] }, 'rn-' + r.id, r.values || {}) }));
}
function rerenderRuns(k, runs) {
  editing.training[k] = { ...(editing.training[k] || {}), runs };
  $('#tx-' + k + '-runs').outerHTML = runsHTML(k, runs);
}
// Result lines first, then the test settings on one line.
function resultLines(item, values) {
  const fields = fieldsFor(item), settings = new Set(fields.filter(f => f.group === 'setting').map(f => f.id));
  const order = new Map(fields.map((f, i) => [f.id, i])), rank = key => order.get(key) ?? fields.length;
  const results = resultEntries(item, Object.fromEntries(Object.entries(values || {}).filter(([key]) => !settings.has(key)).sort(([a], [b]) => rank(a) - rank(b))));
  const summary = settingSummary(item, values);
  return [...results, ...(summary ? [[ui('測驗設定'), summary]] : [])];
}
const runLine = r => { const item = deviceItem(r.item) || { fields: [] }; return `${labelText(item.name || r.item)}${r.time ? ' ' + r.time : ''}：${resultLines(item, r.values).map(([label, value]) => label + ui('：') + value).join(ui('；'))}`; };
// EyeDot mode and setting names match eyedottrainer.com.
const ED_MODES = ['Circle', 'Figure 8', 'Saccade', 'Smooth Pursuit', 'Random Path'];
const ED_DUR = ['30 seconds', '1 minute', '2 minutes', '3 minutes', 'Continuous'];
const ED_DOT = ['Small · 8px', 'Medium · 12px', 'Large · 18px'];
const edSpeedLabel = (mode, sp) => mode === 'Saccade'
  ? { Slow: ui('慢 · 1.8 秒'), Medium: ui('中 · 1.2 秒'), Fast: ui('快 · 0.8 秒') }[sp]
  : { Slow: ui('慢 · 10 秒'), Medium: ui('中 · 7 秒'), Fast: ui('快 · 4 秒') }[sp];
const edCountLabel = mode => mode === 'Saccade' ? ui('目標') : mode === 'Random Path' ? ui('路徑') : ui('圈');
function eyedotHTML(rows) {
  if (!rows.length) return ui('<p class="note" style="margin:0">尚無 EyeDot 紀錄。每次執行一種模式，可新增一筆紀錄。</p>');
  const opt = (list, v, lab = labelText) => list.map(x => `<option value="${esc(x)}" ${x === v ? 'selected' : ''}>${esc(lab(x))}</option>`).join('');
  return ui`<div class="scroll"><table class="sym ed"><thead><tr><th>模式</th><th>速度</th><th>時間</th><th>方向</th><th>軌跡</th><th>圓點大小</th><th>全螢幕</th><th>圈數／<br>目標數</th><th>最佳表現</th><th>備註</th><th></th></tr></thead><tbody>
    ${rows.map(r => ui`<tr data-ed="${r.id}">
      <td><select id="ed-${r.id}-mode" aria-label="EyeDot 模式">${opt(ED_MODES, r.mode)}</select></td>
      <td><select id="ed-${r.id}-speed" aria-label="速度">${opt(['Slow', 'Medium', 'Fast'], r.speed, x => edSpeedLabel(r.mode, x))}</select></td>
      <td><select id="ed-${r.id}-dur" aria-label="時間">${opt(ED_DUR, r.dur)}</select></td>
      <td><select id="ed-${r.id}-dir" aria-label="方向" ${r.mode === 'Circle' ? '' : ui('disabled title="僅圓形模式可選方向"')}>${opt(['Clockwise', 'Counterclockwise'], r.dir)}</select></td>
      <td><select id="ed-${r.id}-trail" aria-label="軌跡" ${r.mode === 'Saccade' ? ui('disabled title="跳視模式無軌跡"') : ''}>${opt(['On', 'Off'], r.trail)}</select></td>
      <td><select id="ed-${r.id}-dot" aria-label="圓點大小">${opt(ED_DOT, r.dot)}</select></td>
      <td><select id="ed-${r.id}-full" aria-label="全螢幕">${opt(['No', 'Yes'], r.full)}</select></td>
      <td><input class="num" type="number" min="0" id="ed-${r.id}-count" value="${val(r.count)}" aria-label="${edCountLabel(r.mode)}數" title="${edCountLabel(r.mode)}" style="width:4.2em"></td>
      <td><input type="text" id="ed-${r.id}-best" value="${val(r.best)}" aria-label="最佳表現" style="width:5.5em"></td>
      <td><input type="text" id="ed-${r.id}-notes" value="${val(r.notes)}" aria-label="備註" placeholder="記錄凝視偏離、頭部動作等觀察" style="min-width:180px"></td>
      <td style="white-space:nowrap"><button type="button" class="btn x" data-action="ed-del" data-id="${r.id}" aria-label="移除此訓練紀錄">×</button></td>
    </tr>`).join('')}</tbody></table></div>`;
}
function readEyedot() {
  const rows = editing?.training?.ocular?.eyedot || [];
  return rows.map(r => {
    const g = k => { const el = $(`#ed-${r.id}-${k}`); return el ? el.value : r[k]; };
    const mode = g('mode');
    return { id: r.id, mode, speed: g('speed'), dur: g('dur'), dir: mode === 'Circle' ? g('dir') : null, trail: mode === 'Saccade' ? null : g('trail'),
      dot: g('dot'), full: g('full'), count: numOrNull(g('count')), best: (g('best') || '').trim(), notes: (g('notes') || '').trim() };
  });
}
function rerenderEd() { editing.training.ocular.eyedot = readEyedot(); $('#edWrap').innerHTML = eyedotHTML(editing.training.ocular.eyedot); }
function edSummary(r) {
  return [labelText(r.mode), edSpeedLabel(r.mode, r.speed), labelText(r.dur), labelText(r.dir), r.trail ? ui('軌跡') + ui('：') + labelText(r.trail) : null, labelText(r.dot),
    r.full === 'Yes' ? ui('全螢幕') : null, r.count != null ? r.count + ' ' + edCountLabel(r.mode) : null, r.best ? ui('最佳表現 ') + r.best : null].filter(Boolean).join(ui('、'));
}

function collectSession() {
  const c = cur();
  const s = clone(editing);
  s.date = $('#s-date').value; s.num = numOrNull($('#s-num').value); s.visit = $('#s-visit').value;
  if ($('#s-mode').value) s.mode = $('#s-mode').value; else delete s.mode;
  s.peo = { person: $('#s-person').value, environment: $('#s-environment').value, occupation: $('#s-occupation').value };
  s.interventions = Object.fromEntries(['adaptation', 'compensation'].map(approach => [approach, { picks: interventionPicks(approach), notes: $('#s-' + approach + '-notes').value }]));
  s.clinician = $('#s-clin').value.trim(); s.duration = numOrNull($('#s-dur').value);
  s.subjective = $('#s-subj').value; s.objective = $('#s-obj').value; s.feedback = $('#s-fb').value;
  const links = readClinicalLinks();
  if (links.length || Object.hasOwn(editing, 'clinicalLinks')) s.clinicalLinks = links;
  s.sym = readSym();
  s.assess = clone(editing.assess || {});
  for (const p of assessmentItems(c, editing)) {
    const cb = $('#ac-' + p.id); if (!cb) continue;
    const a = { done: cb.checked, notes: $('#an-' + p.id).value.trim() };
    if (p.copm) {
      a.copm = [0, 1, 2, 3, 4].map(i => ({ occ: $('#copm-occ-' + i).value.trim(), perf: numOrNull($('#copm-p-' + i).value), sat: numOrNull($('#copm-s-' + i).value) })).filter(r => r.occ || r.perf != null || r.sat != null);
    } else {
      a.values = readFields(p, 'af-' + p.id, editing.assess?.[p.id]?.values);
    }
    // Only items ticked as assessed are recorded; results saved earlier for an unticked item are kept.
    if (a.done || hasAssessmentData(editing.assess?.[p.id])) s.assess[p.id] = a;
    else delete s.assess[p.id];
  }
  const rv = id => numOrNull($('#' + id).value);
  s.training = clone(editing.training || {});
  for (const t of trainingItems(c, editing)) {
    if (!$('#tx-' + t.k + '-on')) continue;
    const g = k => $(`#tx-${t.k}-${k}`)?.value ?? '';
    const on = $(`#tx-${t.k}-on`).checked;
    if (!on && !hasTrainingData(editing.training?.[t.k])) { delete s.training[t.k]; continue; }
    const chips = [...document.querySelectorAll(`#tx-${t.k}-acts input:checked`)];
    const actScores = Object.fromEntries(chips.map(i => [i.dataset.act, $('#' + i.dataset.score.replace(/-r(\d+)$/, '-s$1'))?.value.trim() ?? '']).filter(([, v]) => v));
    s.training[t.k] = { ...s.training[t.k], on,
      acts: chips.map(i => i.dataset.act),
      ...(t.k === 'ocular' ? { eyedot: readEyedot() } : {}),
      ...(RUN_ITEMS[t.k] ? { runs: readRuns(t.k) } : {}),
      program: g('program').trim(), dur: numOrNull(g('dur')), level: g('level').trim(), perf: g('perf').trim(),
      diff: rv(`tx-${t.k}-diff`), notes: g('notes')
    };
    if (Object.keys(actScores).length) s.training[t.k].actScores = actScores; else delete s.training[t.k].actScores;
    if (!s.training[t.k].runs?.length) delete s.training[t.k].runs;
    const values = readFields(t, 'tf-' + t.k, editing.training?.[t.k]?.values);
    if (Object.keys(values).length) s.training[t.k].values = values; else delete s.training[t.k].values;
  }
  s.assessmentPlan = clone(assessmentItems(c, editing).filter(p => hasAssessmentData(s.assess[p.id])));
  s.trainingPlan = clone(trainingItems(c, editing).filter(t => hasTrainingData(s.training[t.k])));
  s.otherTx = $('#s-otx').value; s.tolerance = rv('s-tol');
  s.assessment = $('#s-ass').value; s.plan = $('#s-plan').value; s.nextDate = $('#s-next').value;
  s.absence = { reason: $('#abs-reason').value, notified: $('#abs-notified').value, contact: $('#abs-contact').value.trim() };
  if (s.visit === 'absent') s.nextDate = $('#abs-next').value;
  else if (!s.absence.reason && !s.absence.notified && !s.absence.contact) delete s.absence;
  return s;
}

function noteText(c, s, list = sessions) {
  const L = [];
  L.push(ui`復健病歷：${c.name || c.ref || c.id}${c.name && c.ref ? '（' + c.ref + '）' : ''}`);
  L.push(ui`日期：${s.date || '-'}   次數：${s.num ?? '-'}   類型：${visitLabel(s.visit)}   治療師：${s.clinician || '-'}${s.duration != null ? ui('   時間：') + s.duration + ui(' 分鐘') : ''}`);
  L[L.length - 1] += ui('   服務型態：') + serviceModeLabel(s.mode);
  if (c.dx) L.push(ui`診斷：${c.dx}`);
  if (c.medicalHistory) L.push(ui('醫療史：') + c.medicalHistory);
  if (c.sourceMedical?.length) L.push(ui('病歷來源：'), ...c.sourceMedical.map(r => sourceLabel(r)));
  if (c.referral) L.push(ui`轉介原因：${c.referral}`);
  if (eyeSurgerySummary(c)) L.push(ui`眼科手術史：${eyeSurgerySummary(c)}`);
  if (s.visit === 'absent') {
    const a = s.absence || {};
    L.push('', ui('出席紀錄：缺席'), ui`原因：${absenceLabel(a.reason, ABSENCE_REASONS) || '-'}`, ui`通知：${absenceLabel(a.notified, NOTIFIED) || '-'}`,
      ui`改約日期：${s.nextDate || ui('尚未改約')}`, '', ui('聯絡紀錄與後續：'), a.contact || '-');
    return L.join('\n');
  }
  L.push('', ui('S：主觀描述'), s.subjective || '-');
  if (s.feedback) L.push(ui('個案回饋：') + s.feedback);
  L.push('', ui('O：評估'));
  if (s.objective) L.push(s.objective);
  const rows = s.sym || [];
  if (rows.length) {
    const base = firstRated(rows), bt = rowTotal(base);
    L.push(ui('症狀 NRS（0 至 10）：') + SYMS.map(x => x.en).join(' / '));
    for (const r of rows) {
      const name = tpName(r, false);
      const t = rowTotal(r);
      L.push(ui`  ${name}：${SK.map(k => r.scores?.[k] ?? '-').join(' / ')}，總分 ${t ?? '-'}${base && r.id !== base.id && t != null && bt != null ? ui('（與首次差異 ') + signed(t - bt) + '）' : ''}${r.kind === 'rec' && r.recMin != null ? ui('，恢復時間 ') + r.recMin + ui(' 分鐘') : ''}`);
    }
  }
  const done = assessmentItems(c, s).filter(p => s.assess?.[p.id]?.done);
  for (const category of ['visual', 'functional']) {
    const items = done.filter(p => assessmentCategory(p) === category);
    if (!items.length) continue;
    L.push('', assessmentCategoryLabel(category) + ui('：'));
    for (const p of items) {
      const a = s.assess[p.id];
      L.push(`  [x] ${labelText(p.name)}${p.domain ? '：' + labelText(p.domain) : ''}`);
      if (p.copm) {
        (a.copm || []).forEach(r => L.push(ui`      ${r.occ || ui('（職能活動）')}：表現 ${r.perf ?? '-'}，滿意度 ${r.sat ?? '-'}`));
        const av = copmAvg(a.copm), b = copmBaseline(s.id, s.date, s.visit, list);
        L.push(ui`      平均：表現 ${av.perf ?? '-'}${av.perf != null && b?.perf != null ? '（' + signed(av.perf - b.perf) + ui('，相較 ') + b.date + '）' : ''}，滿意度 ${av.sat ?? '-'}${av.sat != null && b?.sat != null ? '（' + signed(av.sat - b.sat) + ui('，相較 ') + b.date + '）' : ''}`);
      } else {
        resultLines(p, a.values).forEach(([label, value]) => L.push(`      ${label}${ui("：")}${value}`));
      }
      if (a.notes) L.push(ui`      備註：${a.notes}`);
    }
  }
  L.push('', ui('A：PEO 臨床推理'));
  for (const [key, label] of [['person', ui('個人')], ['environment', ui('環境')], ['occupation', ui('作業')]]) if (s.peo?.[key]) L.push(label + ui('：') + s.peo[key]);
  L.push(ui('臨床判斷與介入規劃'), s.assessment || '-');
  L.push(...clinicalLinkLines(c, s), '', ui('P：介入與計畫'));
  const tx = trainingItems(c, s).filter(t => s.training?.[t.k]?.on);
  if (tx.length || s.otherTx) {
    L.push('', ui('復能'), ui('復健項目：'));
    tx.forEach(t => {
      const d = s.training[t.k];
      L.push(`  • ${labelText(t.label)}${d.dur != null ? '：' + d.dur + ui(' 分鐘') : ''}`);
      if (d.acts?.length) L.push(ui`      活動：${actSummary(d)}`);
      (d.eyedot || []).forEach((r, i) => L.push(`      EyeDot Trainer ${i + 1}：${edSummary(r)}${r.notes ? '，' + r.notes : ''}`));
      (d.runs || []).forEach(r => L.push('      ' + ui('測驗紀錄：') + runLine(r)));
      if (d.program) L.push(ui`      程式／設備：${d.program}`);
      if (d.level) L.push(ui`      級別／設定：${d.level}`);
      if (d.perf) L.push(ui`      表現：${d.perf}`);
      if (d.diff != null) L.push(ui`      個案自評難度：${d.diff}/10`);
      resultEntries(t, d.values).forEach(([label, value]) => L.push(`      ${label}：${value}`));
      if (d.notes) L.push(ui`      觀察：${d.notes}`);
    });
    if (s.otherTx) L.push(ui('  其他治療／居家計畫：') + s.otherTx);
  }
  for (const approach of ['adaptation', 'compensation']) {
    const d = s.interventions?.[approach];
    if (d?.picks?.length || d?.notes) {
      L.push('', approachLabel(approach));
      (d.picks || []).forEach(id => L.push('  [x] ' + strategyLabel(approach, id)));
      if (d.notes) L.push(ui('備註') + ui('：') + d.notes);
    }
  }
  if (s.tolerance != null) L.push(ui`個案自評整體耐受度：${s.tolerance}/10`);
  L.push('', ui('後續計畫'), s.plan || '-');
  if (s.nextDate) L.push(ui('下次復健：') + s.nextDate);
  if (s.sourceRecords?.length) L.push('', ui('資料來源：'), ...s.sourceRecords.map(r => sourceLabel(r)));
  if (c.sourceRoster?.length) L.push('', ui('收案資料（依來源保留）：'), ...c.sourceRoster.flatMap(r => [sourceLabel(r), ...Object.entries(r.fields).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}：${v}`)]));
  return L.join('\n');
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast(ui('病歷已複製')); }
  catch (e) {
    const m = modal(ui`<h3>複製病歷</h3><p class="note" style="margin:0">請全選並按 Ctrl+C／⌘C 複製。</p><textarea id="copyBox" aria-label="病歷內容" style="min-height:300px">${esc(text)}</textarea><div class="row" style="justify-content:flex-end"><button class="btn" id="cClose">關閉</button></div>`);
    const b = m.querySelector('#copyBox'); b.focus(); b.select(); m.querySelector('#cClose').onclick = closeModal;
  }
}
async function saveFile(filename, data) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: filename.endsWith('.csv') ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
async function exportSessionPair(s) {
  if (store.kind === 'folder') {
    await safe(() => store.saveSession(curId, s), ui('CSV／PDF 匯出失敗'));
    toast(copyLastError || ui`已儲存 ${store.sessionBase(curId, s.id)}.csv 與 .pdf`);
  } else {
    await saveFile(`${safeName(cur().ref || cur().name || cur().id)}_${sessionBaseName(s)}.zip`, await sessionZIP(cur(), s));
    toast(ui('已下載 ZIP，解壓縮後將個案資料夾合併至您的病歷資料夾。'));
  }
}
const fileSafe = s => String(s || 'client').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'client';

const EYES = [['OD', '右眼（OD）'], ['OS', '左眼（OS）'], ['OU', '雙眼（OU）']];
const EYE_PROCS = ['Cataract surgery (phaco + IOL)', 'LASIK', 'PRK / LASEK', 'SMILE', 'ICL (implantable contact lens)', 'Strabismus surgery',
  'Retinal detachment repair', 'Vitrectomy', 'Intravitreal injection(s)', 'Retinal laser (PRP / focal)', 'Glaucoma surgery (trabeculectomy / tube / MIGS)',
  'SLT / YAG laser', 'Corneal transplant (PK / DSAEK / DMEK)', 'Corneal cross-linking', 'Pterygium excision', 'Orbital fracture repair',
  'Eyelid / ptosis surgery', 'Open globe repair', 'Lacrimal surgery (DCR)'];
function eyeSurgerySummary(c, sep = '; ') {
  const e = c.eyeSurgery;
  if (!e) return '';
  if (e.none) return ui('無眼科手術史');
  return (e.list || []).map(r => [r.eye, labelText(r.proc), r.date ? `(${r.date})` : '', r.notes ? '：' + r.notes : ''].filter(Boolean).join(' ')).join(sep);
}
function clientForm(c) {
  if (view === 'edit' && editing) editing = collectSession();
  const isNew = !c; c = c || { name: '', ref: '', dob: '', doi: '', dx: '' };
  const m = modal(ui`<h3>${isNew ? ui('新增個案') : ui('編輯個案')}</h3>
    <form id="cForm" novalidate style="display:flex;flex-direction:column;gap:12px">
      <div class="grid">${requiredProfileFields().map(field => profileFieldHTML(field, c)).join('')}</div>
      <div class="grid">
        <label class="f" for="cf-doi">受傷／發病日期<input type="date" id="cf-doi" value="${val(c.doi)}"></label>
      </div>
      <label class="f" for="cf-dx">診斷<textarea id="cf-dx" style="min-height:90px">${val(c.dx)}</textarea></label>
      <label class="f" for="cf-history">醫療史<textarea id="cf-history" style="min-height:120px">${val(c.medicalHistory)}</textarea></label>
      <label class="f" for="cf-referral">轉介原因／目前困難<textarea id="cf-referral" style="min-height:70px" placeholder="工作與日常生活中的功能問題">${val(c.referral)}</textarea></label>
      <fieldset class="es">
        <legend>眼科手術史</legend>
        <label class="row" style="font-size:.9rem;cursor:pointer"><input type="checkbox" id="es-none" ${c.eyeSurgery?.none ? 'checked' : ''}>無眼科手術史</label>
        <div id="esRows" style="display:flex;flex-direction:column;gap:6px"></div>
        <datalist id="esProcList">${EYE_PROCS.map(p => `<option value="${esc(labelText(p))}"></option>`).join('')}</datalist>
        <div><button type="button" class="btn small" id="esAdd">＋ 新增手術紀錄</button></div>
      </fieldset>
      ${isNew ? ui`<label class="f" for="cf-template-source">評估與復健項目模板<select id="cf-template-source"><option value="">標準模板（目前內建項目）</option>${clients.map(other => `<option value="${other.id}">${esc(ui('複用 {0} 的項目設定', clientLabel(other)))}</option>`).join('')}</select></label><p class="note" style="margin:0">僅複製項目定義，建立個案後可在「項目設定」調整。</p>` : ''}
      <div class="spread">${isNew ? '<span></span>' : ui('<button type="button" class="btn danger" id="cDel">刪除個案</button>')}
        <div class="row"><button type="button" class="btn" id="cCancel">取消</button><button type="submit" class="btn app-primary">${isNew ? ui('建立個案') : ui('儲存')}</button></div></div>
    </form>`);
  m.style.width = 'min(680px, 100%)';
  let esRows = clone(c.eyeSurgery?.list || []);
  const readEs = () => esRows.map((r, i) => ({ eye: $('#es-eye-' + i).value, proc: $('#es-proc-' + i).value.trim(), date: $('#es-date-' + i).value.trim(), notes: $('#es-notes-' + i).value.trim() }));
  const drawEs = () => {
    const none = $('#es-none').checked;
    $('#esRows').innerHTML = none ? '' : esRows.map((r, i) => ui`<div class="es-row">
      <select id="es-eye-${i}" aria-label="手術眼別">${EYES.map(([k, l]) => `<option value="${k}" ${r.eye === k ? 'selected' : ''}>${ui(l)}</option>`).join('')}</select>
      <input type="text" id="es-proc-${i}" list="esProcList" value="${val(r.proc)}" placeholder="手術名稱" aria-label="手術名稱">
      <input type="text" id="es-date-${i}" value="${val(r.date)}" placeholder="年份或年月" aria-label="手術日期">
      <input type="text" id="es-notes-${i}" value="${val(r.notes)}" placeholder="備註、併發症" aria-label="手術備註">
      <button type="button" class="btn x" data-es-del="${i}" aria-label="移除此手術紀錄">×</button></div>`).join('');
    $('#esAdd').hidden = none;
  };
  drawEs();
  $('#es-none').onchange = () => { if (!$('#es-none').checked && !esRows.length) esRows = [{ eye: 'OD', proc: '', date: '', notes: '' }]; else if ($('#es-none').checked) esRows = readEs().filter(r => r.proc); drawEs(); };
  $('#esAdd').onclick = () => { esRows = readEs(); esRows.push({ eye: 'OD', proc: '', date: '', notes: '' }); drawEs(); $('#es-proc-' + (esRows.length - 1)).focus(); };
  $('#esRows').onclick = e => { const b = e.target.closest('[data-es-del]'); if (!b) return; esRows = readEs(); esRows.splice(+b.dataset.esDel, 1); drawEs(); };
  m.querySelector('#cCancel').onclick = closeModal;
  if (!isNew) m.querySelector('#cDel').onclick = async () => {
    const name = clientLabel(c); closeModal();
    if (!(await ask(ui`確定刪除 ${name} 與全部 ${sessions.length} 筆復健紀錄嗎？刪除後無法復原。`))) return;
    await safe(() => store.deleteClient(c.id), ui('無法刪除個案'));
    clients = clients.filter(x => x.id !== c.id); curId = clients[0]?.id || null; view = 'sessions'; await loadSessions(); renderClients(); renderMain(); toast(ui('個案已刪除'));
  };
  m.querySelector('#cForm').onsubmit = async e => {
    e.preventDefault();
    const profile = Object.fromEntries(requiredProfileFields().map(field => [field.key, $('#cf-' + field.key).value.trim()]));
    const missing = requiredProfileFields().find(field => !profile[field.key]);
    if (missing) { const control = $('#cf-' + missing.key); control.setCustomValidity(ui('請填寫{0}', missing.label())); control.reportValidity(); control.oninput = () => control.setCustomValidity(''); return; }
    if (!m.querySelector('#cForm').reportValidity()) return;
    const ref = profile.ref ?? c.ref ?? '';
    if (ref && clients.some(other => other.id !== c.id && safeName(other.ref || other.id).toLocaleLowerCase() === safeName(ref).toLocaleLowerCase())) { toast(ui('此病歷號已被使用，請輸入不同的病歷號。')); $('#cf-ref')?.focus(); return; }
    const source = isNew ? clients.find(other => other.id === $('#cf-template-source').value) : null;
    const obj = isNew ? { id: uid('c'), plan: source ? clone(source.plan) : newClientPlan(), trainingPlan: clone(source ? trainingPlan(source) : TRAIN), created: today() } : clone(c);
    Object.assign(obj, { name: c.name || '', ref: c.ref || '', dob: c.dob || '', ...profile, doi: $('#cf-doi').value, dx: $('#cf-dx').value.trim(), medicalHistory: $('#cf-history').value.trim(), referral: $('#cf-referral').value.trim(),
      eyeSurgery: $('#es-none').checked ? { none: true, list: [] } : { none: false, list: readEs().filter(r => r.proc) } });
    const submit = $('#cForm button[type="submit"]'); submit.disabled = true;
    try { await safe(() => store.saveClient(obj), ui('無法儲存個案')); }
    catch (_) { submit.disabled = false; return; }
    if (isNew) clients.push(obj); else clients[clients.findIndex(x => x.id === obj.id)] = obj;
    clients.sort((a, b) => a.name.localeCompare(b.name));
    closeModal();
    if (isNew) { curId = obj.id; view = 'dashboard'; dashboardSessionId = null; await loadSessions(); }
    renderClients(); renderMain(); toast(isNew ? ui('個案已建立') : ui('個案資料已儲存'));
  };
}

async function loadExample() {
  const c = { id: uid('c'), name: 'Example client (sample data)', ref: 'DEMO-001', dob: '1984-04-12', doi: '2026-07-20', dx: 'Post-concussion visual symptoms; return-to-work', eyeSurgery: { none: false, list: [{ eye: 'OU', proc: 'LASIK', date: '2015', notes: 'No complications' }] }, plan: clone(DEFAULT_PLAN), created: today() };
  const row = (kind, arr, extra) => Object.assign({ id: uid('r'), kind, scores: Object.fromEntries(SK.map((k, i) => [k, arr[i]])) }, extra || {});
  const occ = ['Computer work > 1 h', 'Reading reports', 'Driving to work', 'Grocery shopping', 'Reading to children'];
  const copm = (p, s) => occ.map((o, i) => ({ occ: o, perf: p[i], sat: s[i] }));
  const base = { clinician: 'A. Clinician', mode: 'inperson', duration: 60, otherTx: '', nextDate: '',
    peo: { person: 'Visual fatigue with sustained screen use', environment: 'Office screen and desk lighting', occupation: 'Reading reports and returning to computer work' },
    interventions: { adaptation: { picks: ['workstation_setup', 'environment_mod'], notes: 'Adjust screen height and reduce glare.' }, compensation: { picks: ['pacing_rest'], notes: 'Schedule short breaks during screen work.' } } };
  const s1 = Object.assign({ id: uid('s'), num: 1, date: '2026-09-01', visit: 'baseline', ...base,
    subjective: 'Eye strain and headache after 30 min of screen work. Avoids driving on highways. Off work part-time.', feedback: 'Saccade task made eyes tired; peripheral task was hard to keep fixation.',
    sym: [row('pre', [4, 2, 1, 3, 0]), row('sub', [4, 2, 1, 3, 0], { test: 'pursuit' }), row('sub', [5, 3, 2, 4, 1], { test: 'fixation' }), row('sub', [7, 4, 3, 5, 2], { test: 'saccade' }), row('end', [6, 3, 2, 5, 1]), row('rec', [4, 2, 1, 3, 0], { recMin: 20 })],
    assess: { copm: { done: true, notes: '', copm: copm([3, 4, 3, 6, 4], [2, 3, 2, 5, 3]) },
      pursuit: { done: true, values: { accuracy_rate: 71.2, completed_targets: 16, mode: 'Evaluation', stimulusType: 'White dot', ballArcmin: 60, speedArcminSec: 300, eye_tracker: 'Tobii', viewingDistanceCm: 60 }, notes: 'Catch-up saccades on the return path' },
      fixation: { done: true, values: { accuracy_rate: 64.5, completed_targets: 16, mode: 'Evaluation', stimulusType: 'White dot', ballArcmin: 60, speedArcminSec: 300, holdSec: 2, eye_tracker: 'Tobii', viewingDistanceCm: 60 }, notes: '' },
      saccade: { done: true, values: { accuracy_rate: 68.4, tff_mean_ms: 312, tff_detected_targets: 20, tff_total_targets: 24, completed_targets: 24, mode: 'Evaluation', stimulusType: 'White dot', ballArcmin: 60, dwellMs: 500, eye_tracker: 'Tobii', viewingDistanceCm: 60 }, notes: 'Hypometric saccades to the right' },
      ufov_divided: { done: true, values: { final_threshold_rt_ms: 180, accuracy_rate_percent: 72, central_accuracy_percent: 90, peripheral_accuracy_percent: 72, mean_response_time_ms: 640, stop_condition: 'Adaptive 80%', contrast_percent: 100, target_visual_angle_deg: 10, vehicle_visual_angle_deg: 2, viewing_distance_cm: 60 }, notes: '' },
      npc: { done: true, values: { 'NPC break (cm)': '12', 'NPC recovery (cm)': '15', 'Positive fusional vergence (Δ)': 'x/12/6' }, notes: '' } },
    training: {}, tolerance: 5, assessment: 'Reduced saccadic accuracy, peripheral detection and convergence, with symptom provocation during visual tasks limiting computer work.', plan: 'Weekly sessions: computer-based oculomotor and peripheral awareness training. Re-assess in 4 weeks.' });
  const s2 = Object.assign({ id: uid('s'), num: 2, date: '2026-09-08', visit: 'treatment', ...base, duration: 45,
    subjective: 'Headaches a little less. Still tired eyes by midday.', feedback: 'Found vergence work tiring; peripheral board was okay.',
    sym: [row('pre', [3, 2, 1, 2, 0]), row('end', [4, 2, 2, 3, 0])],
    assess: {}, training: { ocular: { on: true, acts: ['Smooth pursuit tracking', 'Fixation', 'Vergence (convergence / divergence)'], actScores: { 'Smooth pursuit tracking': '74%', 'Fixation': '66%', 'Vergence (convergence / divergence)': '8 reps' }, program: 'OcuTrain, EyeDot Trainer', dur: 15, level: '', perf: '', diff: 7, notes: 'Two rest breaks.',
        runs: [{ id: uid('r'), item: 'pursuit', time: '10:12', values: { accuracy_rate: 74, actual_duration_sec: 45, mode: 'Random', stimulusType: 'White dot', ballArcmin: 60, speedArcminSec: 240, eye_tracker: 'Tobii' } },
          { id: uid('r'), item: 'fixation', time: '10:20', values: { accuracy_rate: 66, actual_duration_sec: 60, mode: 'Predictable', stimulusType: 'Red in White', ballArcmin: 45, speedArcminSec: 300, holdSec: 3, eye_tracker: 'Tobii' } }],
        eyedot: [{ id: uid('e'), mode: 'Smooth Pursuit', speed: 'Slow', dur: '1 minute', dir: null, trail: 'On', dot: 'Large · 18px', full: 'No', count: 6, best: '', notes: 'Catch-up saccades at turns' },
          { id: uid('e'), mode: 'Saccade', speed: 'Slow', dur: '1 minute', dir: null, trail: null, dot: 'Large · 18px', full: 'No', count: 33, best: '', notes: 'Undershoots to the right' }] },
      periph: { on: true, acts: ['Peripheral light board'], actScores: { 'Peripheral light board': '38 hits / 60 s' }, program: 'Light board', dur: 10, level: '60 s trials, static', perf: '', diff: 5, notes: '' } },
    tolerance: 6, assessment: 'Tolerating graded training; symptom rise settles by session end.', plan: 'Progress oculomotor level when difficulty ≤ 5.' });
  const s3 = Object.assign({ id: uid('s'), num: 3, date: '2026-09-22', visit: 'treatment', ...base, duration: 45,
    mode: 'telerehab', peo: { person: 'Mild fatigue late in the day', environment: 'Home workstation with video consultation', occupation: 'Working six hours with planned breaks' },
    interventions: { adaptation: { picks: ['env_consult', 'digital_tools'], notes: 'Review home lighting and display settings remotely.' }, compensation: { picks: ['self_management', 'pacing_fatigue', 'stepwise'], notes: 'Split reports into shorter tasks and monitor fatigue.' } },
    subjective: 'Working 6 h with breaks. Mild headache late afternoon.', feedback: 'Search tasks were easy; attention with distractors was harder.',
    sym: [row('pre', [2, 1, 0, 1, 0]), row('end', [2, 1, 1, 2, 0])],
    assess: {}, training: { attn: { on: true, acts: ['Selective attention', 'Divided attention'], actScores: { 'Selective attention': 'RT 540 ms', 'Divided attention': 'RT 610 ms' }, program: 'Attention tasks', dur: 12, level: 'Moderate distractors', perf: '', diff: 6, notes: '' },
      search: { on: true, acts: ['Letter / number cancellation', 'Search with distractors'], actScores: { 'Letter / number cancellation': '96%, 74 s', 'Search with distractors': '88%' }, program: 'Cancellation tasks', dur: 10, level: 'Dense array', perf: '', diff: 3, notes: '' } },
    tolerance: 8, assessment: 'Minimal symptom provocation. Ready for re-assessment.', plan: 'Assessment visit next session.' });
  const s4 = Object.assign({ id: uid('s'), num: 4, date: '2026-10-06', visit: 'post', ...base,
    subjective: 'Back at work full days. Driving on highways again.', feedback: 'Tasks felt manageable today.',
    sym: [row('pre', [1, 1, 0, 1, 0]), row('sub', [1, 1, 0, 1, 0], { test: 'pursuit' }), row('sub', [1, 1, 0, 1, 0], { test: 'fixation' }), row('sub', [2, 1, 1, 1, 0], { test: 'saccade' }), row('end', [2, 1, 1, 1, 0])],
    assess: { copm: { done: true, notes: '', copm: copm([7, 7, 6, 8, 7], [7, 6, 6, 8, 8]) },
      pursuit: { done: true, values: { accuracy_rate: 86.9, completed_targets: 16, mode: 'Evaluation', stimulusType: 'White dot', ballArcmin: 60, speedArcminSec: 300, eye_tracker: 'Tobii', viewingDistanceCm: 60 }, notes: '' },
      fixation: { done: true, values: { accuracy_rate: 82.3, completed_targets: 16, mode: 'Evaluation', stimulusType: 'White dot', ballArcmin: 60, speedArcminSec: 300, holdSec: 2, eye_tracker: 'Tobii', viewingDistanceCm: 60 }, notes: '' },
      saccade: { done: true, values: { accuracy_rate: 88.1, tff_mean_ms: 241, tff_detected_targets: 23, tff_total_targets: 24, completed_targets: 24, mode: 'Evaluation', stimulusType: 'White dot', ballArcmin: 60, dwellMs: 500, eye_tracker: 'Tobii', viewingDistanceCm: 60 }, notes: '' },
      ufov_divided: { done: true, values: { final_threshold_rt_ms: 90, accuracy_rate_percent: 88, central_accuracy_percent: 96, peripheral_accuracy_percent: 88, mean_response_time_ms: 515, stop_condition: 'Adaptive 80%', contrast_percent: 100, target_visual_angle_deg: 10, vehicle_visual_angle_deg: 2, viewing_distance_cm: 60 }, notes: '' },
      npc: { done: true, values: { 'NPC break (cm)': '6', 'NPC recovery (cm)': '8', 'Positive fusional vergence (Δ)': 'x/20/12' }, notes: '' } },
    training: {}, tolerance: 9, assessment: 'Clinically meaningful COPM gains; improved saccadic accuracy, peripheral detection and NPC.', plan: 'Discharge with home program. Follow-up in 3 months.' });
  c.plan.forEach(item => { item.initial = s1.assess[item.id]?.done === true; });
  await safe(() => store.saveClient(c), ui('無法建立範例個案'));
  for (const s of [s1, s2, s3, s4]) await safe(() => store.saveSession(c.id, s), ui('無法建立範例紀錄'));
  clients.push(c); clients.sort((a, b) => a.name.localeCompare(b.name)); curId = c.id; view = 'dashboard'; dashboardSessionId = null;
  await loadSessions(); renderClients(); renderMain(); toast(ui('已新增範例個案（示範資料），可在「編輯個案」中刪除。'));
}

function excelCellValue(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return value;
  if (Array.isArray(value) || (typeof value === 'object' && [Object.prototype, null].includes(Object.getPrototypeOf(value)))) {
    try { return JSON.stringify(value) ?? String(value); } catch (_) {}
  }
  return String(value);
}
function buildWorkbook(list) {
  const S = { 'Clients': [], 'Attendance 缺席': [], 'Eye surgery history': [], 'Data collection plan': [], 'SOAP notes': [], 'Symptoms': [], 'Assessments': [], 'COPM': [], 'Training': [], 'Training results': [], 'EyeDot Trainer': [], 'Source roster': [], 'Source records': [], 'Interventions': [], 'Clinical links': [] };
  const blank = v => v == null ? '' : v;
  const asNum = v => v == null || v === '' ? '' : (isNaN(+v) ? v : +v);
  for (const { c, ss } of list) {
    const id = { 'Client ID': c.ref || c.id, 'Client name': c.name };
    for (const r of c.sourceRoster || []) for (const [field, value] of Object.entries(r.fields)) S['Source roster'].push({ ...id, Source: sourceLabel(r), Field: field, Value: value ?? '' });
    const asc = byDate(ss);
    (c.eyeSurgery?.list || []).forEach(r => S['Eye surgery history'].push({ ...id, 'Eye': r.eye, 'Procedure': r.proc, 'Date': r.date || '', 'Notes': r.notes || '' }));
    S['Clients'].push({ ...id, 'Date of birth': c.dob || '', 'Date of injury / onset': c.doi || '', 'Diagnosis': c.dx || '', 'Medical history': c.medicalHistory || '', 'Medical sources': (c.sourceMedical || []).map(r => sourceLabel(r)).join('\n'), 'Referral': c.referral || '',
      'Eye surgery history': eyeSurgerySummary(c) || 'Not recorded',
      'Sessions': asc.length, 'Attended 出席': attendance(asc).attended, 'Did not attend 缺席': attendance(asc).absent,
      'Attendance rate %': attendance(asc).rate ?? '', 'First session': asc[0]?.date || '', 'Last session': asc[asc.length - 1]?.date || '' });
    asc.filter(s => s.visit === 'absent').forEach(s => S['Attendance 缺席'].push({ ...id, 'Date': s.date || '', 'Reason 原因': s.absence?.reason || '',
      'Notified 通知': s.absence?.notified || '', 'Rescheduled to 改約': s.nextDate || '', 'Contact / follow-up 聯絡紀錄': s.absence?.contact || '' }));
    for (const p of c.plan || []) S['Data collection plan'].push({ ...id, 'Domain': labelText(p.domain), 'Instrument / assessment': labelText(p.name), 'Timing': ui(TIMING[p.timing] || ''), 'Outcomes recorded': p.copm ? ui('職能活動表現與滿意度（1 至 10）') : fieldsFor(p).map(fieldLabel).join(ui('、')), 'Enabled': p.active !== false, 'Category': assessmentCategoryLabel(assessmentCategory(p)) });
    for (const s of asc) {
      const sid = { ...id, 'Date': s.date || '', 'Session no.': blank(s.num), 'Visit': visitLabel(s.visit) };
      for (const r of s.sourceRecords || []) for (const [field, value] of Object.entries(r.fields || { file: r.file })) S['Source records'].push({ ...sid, Source: sourceLabel(r), Field: field, Value: value ?? '' });
      const pre = rowTotal(firstRated(s.sym)), end = rowTotal(findRow(s, 'end')), rec = findRow(s, 'rec');
      const note = noteText(c, s, ss).split('\n');
      const oStart = note.indexOf(ui('O：評估')), aStart = note.indexOf(ui('A：PEO 臨床推理'));
      const objective = oStart >= 0 && aStart > oStart ? note.slice(oStart + 1, aStart).join('\n').trim() : '';
      const subjective = [s.subjective, s.feedback ? 'Client feedback: ' + s.feedback : ''].filter(Boolean).join('\n');
      S['SOAP notes'].push({ ...sid, 'Attendance': s.visit === 'absent' ? ui('缺席 Did not attend') : ui('出席 Attended'), 'Clinician': s.clinician || '', 'Length (min)': blank(s.duration),
        'S – Subjective': subjective, 'O – Objective': objective, 'A – Assessment': s.assessment || '', 'P – Plan': s.plan || '', 'Next session': s.nextDate || '',
        'First rating total': blank(pre), ...Object.fromEntries(SUBTESTS.map(t => ['Before ' + t.en.toLowerCase() + ' total', blank(rowTotal((s.sym || []).find(r => r.kind === 'sub' && r.test === t.k)))])),
        'After session total': blank(end), 'Change (after session − before session)': pre != null && end != null ? end - pre : '',
        'Recovery time (min)': blank(rec?.recMin), 'Session tolerance (0–10)': blank(s.tolerance),
        'Training': trainingItems(c, s).filter(t => s.training?.[t.k]?.on).map(t => labelText(t.label)).join(ui('、')),
        'Other treatment / home program': s.otherTx || '', 'Service mode': serviceModeLabel(s.mode),
        'PEO – Person': s.peo?.person || '', 'PEO – Environment': s.peo?.environment || '', 'PEO – Occupation': s.peo?.occupation || '',
        'Adaptation': (s.interventions?.adaptation?.picks || []).map(id => strategyLabel('adaptation', id)).join(ui('、')), 'Adaptation notes': s.interventions?.adaptation?.notes || '',
        'Compensation': (s.interventions?.compensation?.picks || []).map(id => strategyLabel('compensation', id)).join(ui('、')), 'Compensation notes': s.interventions?.compensation?.notes || '' });
      for (const approach of ['adaptation', 'compensation']) for (const strategy of s.interventions?.[approach]?.picks || []) {
        S['Interventions'].push({ ...sid, 'Service mode': serviceModeLabel(s.mode), 'Approach': approachLabel(approach), 'Strategy ID': strategy, 'Strategy label': strategyLabel(approach, strategy) });
      }
      for (const link of s.visit === 'absent' ? [] : s.clinicalLinks || []) {
        const peo = { person: ui('個人'), environment: ui('環境'), occupation: ui('作業') };
        S['Clinical links'].push({ ...sid, 'Link ID': link.id, 'Category': assessmentCategoryLabel(link.category), 'Symptom': link.symptom,
          'PEO': link.peo.map(key => peo[key]).join(ui('、')), 'Reasoning': link.reasoning,
          'Evidence IDs': link.evidence.join('; '), 'Evidence': clinicalEvidenceText(c, s, link.evidence).join('\n'), 'Evidence notes': link.evidenceNotes,
          'Intervention IDs': link.interventions.join('; '), 'Interventions': link.interventions.map(clinicalInterventionLabel).join(ui('、')), 'Intervention notes': link.interventionNotes });
      }
      const base = firstRated(s.sym), bt = rowTotal(base);
      for (const r of s.sym || []) {
        const t = rowTotal(r);
        const row = { ...sid, 'Timepoint': tpName(r, false) };
        SYMS.forEach(x => { row[x.en] = blank(r.scores?.[x.k]); });
        Object.assign(row, { 'Total (0–50)': blank(t), 'Change vs first rating': base && r.id !== base.id && t != null && bt != null ? t - bt : '', 'Recovery time (min)': r.kind === 'rec' ? blank(r.recMin) : '' });
        S['Symptoms'].push(row);
      }
      for (const p of assessmentItems(c, s)) {
        const a = s.assess?.[p.id]; if (!a?.done) continue;
        if (p.copm) {
          if (!COPM_VISITS.includes(s.visit)) continue;
          (a.copm || []).forEach(r => S['COPM'].push({ ...sid, 'Occupation': r.occ || '', 'Performance (1–10)': blank(r.perf), 'Satisfaction (1–10)': blank(r.sat), 'Change in performance vs baseline': '', 'Change in satisfaction vs baseline': '' }));
          const av = copmAvg(a.copm), bl = copmBaseline(s.id, s.date, s.visit, ss);
          S['COPM'].push({ ...sid, 'Occupation': 'AVERAGE', 'Performance (1–10)': blank(av.perf), 'Satisfaction (1–10)': blank(av.sat),
            'Change in performance vs baseline': av.perf != null && bl?.perf != null ? Math.round((av.perf - bl.perf) * 10) / 10 : '',
            'Change in satisfaction vs baseline': av.sat != null && bl?.sat != null ? Math.round((av.sat - bl.sat) * 10) / 10 : '' });
        } else {
          resultEntries(p, a.values).forEach(([label, value]) => S['Assessments'].push({ ...sid, 'Domain': labelText(p.domain), 'Instrument / assessment': labelText(p.name), 'Measure': label, 'Value': asNum(value), 'Category': assessmentCategoryLabel(assessmentCategory(p)) }));
          if (a.notes) S['Assessments'].push({ ...sid, 'Domain': labelText(p.domain), 'Instrument / assessment': labelText(p.name), 'Measure': ui('備註'), 'Value': a.notes, 'Category': assessmentCategoryLabel(assessmentCategory(p)) });
        }
      }
      for (const t of trainingItems(c, s)) {
        const d = s.training?.[t.k]; if (!d?.on) continue;
        S['Training'].push({ ...sid, 'Category': labelText(t.label), 'Activities': actSummary(d), 'Program / equipment': d.program || '', 'Duration (min)': blank(d.dur),
          'Level / settings': d.level || '', 'Performance': d.perf || '', 'Client-rated difficulty (0–10)': blank(d.diff), 'Observations': d.notes || '' });
        (d.acts || []).filter(act => d.actScores?.[act] != null).forEach(act => S['Training results'].push({ ...sid, 'Category': labelText(t.label), 'Measure': labelText(act), 'Value': asNum(d.actScores[act]) }));
        resultEntries(t, d.values).forEach(([label, value]) => S['Training results'].push({ ...sid, 'Category': labelText(t.label), 'Measure': label, 'Value': asNum(value) }));
        (d.runs || []).forEach(r => { const item = deviceItem(r.item) || { fields: [] };
          resultEntries(item, r.values).forEach(([label, value]) => S['Training results'].push({ ...sid, 'Category': labelText(t.label), 'Measure': `${labelText(item.name || r.item)}${r.time ? ' ' + r.time : ''} · ${label}`, 'Value': asNum(value) })); });
        if (t.k === 'ocular') (d.eyedot || []).forEach((r, i) => S['EyeDot Trainer'].push({ ...sid, 'Trial': i + 1, 'Mode': r.mode, 'Speed': edSpeedLabel(r.mode, r.speed) || '', 'Duration': r.dur || '',
          'Direction': r.dir || '', 'Trail': r.trail || '', 'Dot size': r.dot || '', 'Fullscreen': r.full || '', 'Count': blank(r.count), 'Count unit': edCountLabel(r.mode), 'Best': asNum(r.best), 'Notes': r.notes || '' }));
      }
    }
  }
  const wb = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(S)) {
    const ws = XLSX.utils.json_to_sheet((rows.length ? rows : [{ 'No records': '' }]).map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, excelCellValue(value)]))));
    const keys = Object.keys(rows[0] || { 'No records': '' });
    ws['!cols'] = keys.map(k => ({ wch: Math.min(50, Math.max(k.length, ...rows.map(r => String(r[k] ?? '').length)) + 2) }));
    if (rows.length) ws['!autofilter'] = { ref: ws['!ref'] };
    const wide = new Set(['S – Subjective', 'O – Objective', 'A – Assessment', 'P – Plan', 'Observations', 'Notes', 'Other treatment / home program', 'PEO – Person', 'PEO – Environment', 'PEO – Occupation', 'Adaptation', 'Adaptation notes', 'Compensation', 'Compensation notes']);
    ws['!cols'] = keys.map((k, i) => wide.has(k) ? { wch: k === 'O – Objective' ? 90 : 60 } : ws['!cols'][i]);
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; R++) for (let C = range.s.c; C <= range.e.c; C++) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })]; if (!cell) continue;
      cell.s = { font: { name: 'Noto Sans TC', sz: 12, bold: R === 0 }, alignment: { vertical: 'top', wrapText: true }, ...(R === 0 ? { fill: { fgColor: { rgb: 'E3EDF6' } } } : {}) };
    }
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  }
  return wb;
}
async function ensureExcel() {
  if (!window.XLSX) throw new Error(ui('Excel 匯出元件無法使用，請重新開啟完整的 EzEMR.html。'));
}
async function exportExcel(all) {
  await ensureExcel();
  const c = cur();
  if (!all && !c) return;
  if (all && !clients.length) { toast(ui('尚無可匯出的個案。')); return; }
  let list;
  try { list = all ? await Promise.all(clients.map(async x => ({ c: x, ss: x.id === curId ? sessions : await store.listSessions(x.id) }))) : [{ c, ss: sessions }]; }
  catch (e) { toast(ui('無法讀取病歷：') + (e.message || e)); return; }
  const data = XLSX.write(buildWorkbook(list), { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fname = all ? `All clients_records_${today()}.xlsx` : `${safeName(c.ref || c.name || c.id)}_records_${today()}.xlsx`;
  if (store.kind === 'folder') {
    try { const where = await store.writeExport(all ? null : c.id, fname, blob); toast(ui`已儲存 ${fname} 至 ${where}`); }
    catch (e) { toast(ui('無法儲存 Excel：') + (e.message || e)); }
    return;
  }
  await saveFile(fname, blob);
}

function soapFormSheet(c, s, list = sessions) {
  const W = 8, rows = [], kinds = [], merges = [], heights = [];
  const add = (cells, kind, mergeSpans = [], hpt) => {
    const r = rows.length;
    const line = cells.slice(0, W); while (line.length < W) line.push('');
    rows.push(line.map(v => v == null ? '' : v)); kinds.push(kind); heights.push(hpt || null);
    mergeSpans.forEach(([a, b]) => merges.push({ s: { r, c: a }, e: { r, c: b } }));
    return r;
  };
  const textH = t => { const n = String(t || '').split('\n').reduce((x, p) => x + Math.max(1, Math.ceil(p.length / 115)), 0); return Math.max(20, n * 15 + 6); };
  const text = t => add([t || '-'], 'text', [[0, W - 1]], textH(t));
  const gap = () => add([], 'gap', [], 8);
  const kv = (l1, v1, l2, v2) => add([l1, v1, '', '', l2, v2, '', ''], 'kv', [[1, 3], [5, 7]]);

  add([ui('復健病歷（SOAP）')], 'title', [[0, W - 1]], 26);
  kv(ui('姓名'), c.name, ui('病歷號'), c.ref || '');
  if (!c.name && !c.ref) add([ui('個案識別碼'), c.id], 'kv', [[1, W - 1]]);
  kv(ui('出生日期'), c.dob || '', ui('受傷／發病日期'), c.doi || '');
  { const dx = c.dx || ''; add([ui('診斷'), dx], 'kv', [[1, W - 1]], Math.max(18, Math.ceil(dx.length / 110) * 15 + 4)); }
  if (c.medicalHistory) { add([ui('醫療史')], 'sub', [[0, W - 1]]); text(c.medicalHistory); }
  if (c.sourceMedical?.length) { add([ui('病歷來源：')], 'sub', [[0, W - 1]]); c.sourceMedical.forEach(r => text(sourceLabel(r))); }
  add([ui('轉介原因'), c.referral || ''], 'kv', [[1, W - 1]]);
  { const es = eyeSurgerySummary(c, '\n') || ui('未記錄'); add([ui('眼科手術史'), es], 'kv', [[1, W - 1]], Math.max(18, es.split('\n').length * 15 + 4)); }
  kv(ui('復健日期'), s.date || '', ui('復健次數'), s.num ?? '');
  kv(ui('紀錄類型'), visitLabel(s.visit), ui('治療師'), s.clinician || '');
  add([ui('服務型態'), serviceModeLabel(s.mode)], 'kv', [[1, W - 1]]);
  kv(ui('復健時間（分鐘）'), s.duration ?? '', ui('下次復健'), s.nextDate || '');
  gap();

  if (s.visit === 'absent') {
    const a = s.absence || {};
    add([ui('出席紀錄：缺席')], 'section', [[0, W - 1]], 20);
    add([ui('缺席原因'), a.reason || '-'], 'kv', [[1, W - 1]]);
    add([ui('是否通知'), a.notified || '-'], 'kv', [[1, W - 1]]);
    add([ui('改約日期'), s.nextDate || ui('尚未改約')], 'kv', [[1, W - 1]]);
    add([ui('聯絡紀錄與後續')], 'sub', [[0, W - 1]]);
    text(a.contact);
  } else {
  add([ui('S：主觀描述')], 'section', [[0, W - 1]], 20);
  text(s.subjective);
  if (s.feedback) { add([ui('個案對本次復健的回饋')], 'sub', [[0, W - 1]]); text(s.feedback); }
  gap();

  add([ui('O：評估')], 'section', [[0, W - 1]], 20);
  if (s.objective) text(s.objective);
  const sym = s.sym || [];
  if (sym.length) {
    add([ui('症狀評分 NRS（0 至 10，評估現在的感受）')], 'sub', [[0, W - 1]]);
    add([ui('評分時點'), ...SYMS.map(x => x.en), ui('總分（0 至 50）'), ui('與首次差異')], 'th', [], 32);
    const base = firstRated(s.sym), bt = rowTotal(base);
    for (const r of sym) {
      const t = rowTotal(r);
      const name = tpName(r);
      add([name, ...SK.map(k => r.scores?.[k] ?? ''), t ?? '', base && r.id !== base.id && t != null && bt != null ? signed(t - bt) : ''], 'td');
    }
  }
  const done = assessmentItems(c, s).filter(p => s.assess?.[p.id]?.done);
  for (const category of ['visual', 'functional']) {
    const items = done.filter(p => assessmentCategory(p) === category);
    if (!items.length) continue;
    add([assessmentCategoryLabel(category)], 'sub', [[0, W - 1]]);
    for (const p of items) {
      const a = s.assess[p.id];
      if (p.copm) {
        add([`${labelText(p.name)}：${labelText(p.domain)}`, '', '', '', ui('表現（1 至 10）'), '', ui('滿意度（1 至 10）'), ''], 'th', [[0, 3], [4, 5], [6, 7]]);
        (a.copm || []).forEach(r => add([r.occ || '', '', '', '', r.perf ?? '', '', r.sat ?? '', ''], 'td', [[0, 3], [4, 5], [6, 7]]));
        const av = copmAvg(a.copm), b = copmBaseline(s.id, s.date, s.visit, list);
        add([ui('平均'), '', '', '', (av.perf ?? '') + (av.perf != null && b?.perf != null ? ui`（${signed(av.perf - b.perf)}，相較 ${b.date}）` : ''), '',
          (av.sat ?? '') + (av.sat != null && b?.sat != null ? ui`（${signed(av.sat - b.sat)}，相較 ${b.date}）` : ''), ''], 'tdb', [[0, 3], [4, 5], [6, 7]]);
      } else {
        add([`${labelText(p.name)}${p.domain ? '：' + labelText(p.domain) : ''}`, '', '', '', ui('結果'), '', '', ''], 'th', [[0, 3], [4, 7]]);
        resultLines(p, a.values).forEach(([label, value]) => add([label, '', '', '', value, '', '', ''], 'td', [[0, 3], [4, 7]], textH(value)));
        if (a.notes) add([ui('備註'), '', '', '', a.notes, '', '', ''], 'td', [[0, 3], [4, 7]], textH(a.notes));
      }
    }
  }
  gap();
  add([ui('A：PEO 臨床推理')], 'section', [[0, W - 1]], 20);
  for (const [key, label] of [['person', ui('個人')], ['environment', ui('環境')], ['occupation', ui('作業')]]) if (s.peo?.[key]) { add([label], 'sub', [[0, W - 1]]); text(s.peo[key]); }
  add([ui('臨床判斷與介入規劃')], 'sub', [[0, W - 1]]);
  text(s.assessment);
  clinicalLinkLines(c, s).forEach(text);
  gap();
  add([ui('P：介入與計畫')], 'section', [[0, W - 1]], 20);
  const tx = trainingItems(c, s).filter(t => s.training?.[t.k]?.on);
  if (tx.length || s.otherTx) {
    add([ui('復能')], 'sub', [[0, W - 1]]);
    add([ui('復健項目')], 'sub', [[0, W - 1]]);
    if (tx.length) add([ui('類別'), ui('活動'), '', ui('程式／設備'), ui('時間（分鐘）'), ui('級別／設定'), ui('表現'), ui('個案自評難度（0 至 10）')], 'th', [[1, 2]], 32);
    for (const t of tx) {
      const d = s.training[t.k], acts = actSummary(d);
      add([labelText(t.label), acts, '', d.program || '', d.dur ?? '', d.level || '', d.perf || '', d.diff ?? ''], 'td', [[1, 2]], Math.max(20, Math.ceil(acts.length / 28) * 15 + 6));
      resultEntries(t, d.values).forEach(([label, value]) => add([label, value], 'td', [[1, 7]], textH(value)));
      (d.runs || []).forEach(r => { const line = runLine(r); add([ui('測驗紀錄'), line], 'td', [[1, 7]], textH(line)); });
      if (d.notes) add([ui('觀察'), d.notes], 'td', [[1, 7]], textH(d.notes));
    }
    const ed = s.training?.ocular?.on ? (s.training.ocular.eyedot || []) : [];
    if (ed.length) {
      add([ui('EyeDot Trainer 訓練紀錄')], 'sub', [[0, W - 1]]);
      add([ui('模式'), ui('速度'), ui('時間'), ui('方向'), ui('軌跡'), ui('圓點大小'), ui('全螢幕'), ui('次數')], 'th');
      ed.forEach(r => {
        add([labelText(r.mode), edSpeedLabel(r.mode, r.speed) || '', labelText(r.dur), labelText(r.dir) || '-', labelText(r.trail) || '-', labelText(r.dot), labelText(r.full), r.count != null ? `${r.count} ${edCountLabel(r.mode)}` : ''], 'td');
        const extra = [r.best ? ui('最佳表現：') + r.best : '', r.notes].filter(Boolean).join(' · ');
        if (extra) add([ui('備註'), extra], 'td', [[1, 7]]);
      });
    }
    if (s.otherTx) { add([ui('其他治療／居家計畫')], 'sub', [[0, W - 1]]); text(s.otherTx); }
  }
  for (const approach of ['adaptation', 'compensation']) {
    const d = s.interventions?.[approach];
    if (d?.picks?.length || d?.notes) {
      add([approachLabel(approach)], 'sub', [[0, W - 1]]);
      (d.picks || []).forEach(id => text('[x] ' + strategyLabel(approach, id)));
      if (d.notes) { add([ui('備註')], 'sub', [[0, W - 1]]); text(d.notes); }
    }
  }
  if (s.tolerance != null) add([ui('個案自評整體耐受度（0 至 10）'), s.tolerance], 'kv', [[1, W - 1]]);
  gap();
  add([ui('後續計畫')], 'sub', [[0, W - 1]]);
  text(s.plan);
  if (s.nextDate) add([ui('下次復健'), s.nextDate], 'kv', [[1, W - 1]]);
  }
  if (s.sourceRecords?.length) { gap(); add([ui('資料來源')], 'sub', [[0, W - 1]]); s.sourceRecords.forEach(r => text(sourceLabel(r))); }
  if (c.sourceRoster?.length) { gap(); add([ui('收案資料（依來源保留）')], 'sub', [[0, W - 1]]); c.sourceRoster.forEach(r => { text(sourceLabel(r)); Object.entries(r.fields).filter(([, v]) => v != null && v !== '').forEach(([k, v]) => text(`${k}：${v}`)); }); }
  gap(); gap();
  add([ui('治療師簽名：'), '', '', '', ui('日期：'), '', '', ''], 'sign', [[1, 3], [5, 7]], 28);

  const ws = XLSX.utils.aoa_to_sheet(rows.map(row => row.map(excelCellValue)));
  const line = { style: 'thin', color: { rgb: 'C9D3DA' } }, box = { top: line, bottom: line, left: line, right: line };
  const base = { alignment: { vertical: 'top', wrapText: true }, font: { name: 'Noto Sans TC', sz: 12 } };
  const st = {
    title: { font: { bold: true, sz: 16, color: { rgb: '245F93' } }, alignment: { vertical: 'center' } },
    section: { font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '245F93' } }, alignment: { vertical: 'center' } },
    sub: { font: { bold: true, color: { rgb: '245F93' } }, fill: { fgColor: { rgb: 'E3EDF6' } }, alignment: { vertical: 'center' } },
    th: { font: { bold: true, sz: 10 }, fill: { fgColor: { rgb: 'F1F4F6' } }, border: box, alignment: { vertical: 'center', horizontal: 'center', wrapText: true } },
    td: { border: box, alignment: { vertical: 'top', wrapText: true } },
    tdb: { border: box, font: { bold: true }, alignment: { vertical: 'top', wrapText: true } },
    text: { border: box, alignment: { vertical: 'top', wrapText: true } },
    kv: { border: { bottom: line }, alignment: { vertical: 'top', wrapText: true } },
    sign: { font: { bold: true }, border: { bottom: line }, alignment: { vertical: 'bottom' } },
    gap: {}
  };
  rows.forEach((row, r) => {
    for (let ci = 0; ci < W; ci++) {
      const ref = XLSX.utils.encode_cell({ r, c: ci });
      if (!ws[ref]) ws[ref] = { t: 's', v: '' };
      const k = kinds[r];
      let sty = { ...base, ...st[k] };
      if ((k === 'kv' || k === 'sign') && (ci === 0 || (ci === 4 && row[4] !== ''))) sty = { ...sty, font: { bold: true, color: { rgb: '5A6B76' } } };
      if ((k === 'td' || k === 'tdb') && ci === 0) sty = { ...sty, font: { bold: true } };
      ws[ref].s = { ...sty, font: { ...base.font, ...sty.font } };
    }
  });
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: W - 1 } });
  ws['!merges'] = merges;
  ws['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 16 }, { wch: 16 }, { wch: 17 }];
  ws['!rows'] = heights.map(h => h ? { hpt: h } : null);
  ws['!margins'] = { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 };
  return ws;
}
function soapFormBlob(c, s, list = sessions) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, soapFormSheet(c, s, list), 'SOAP note');
  return new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
async function exportSessionForm(sid) {
  await ensureExcel();
  const c = cur(), s = sessions.find(x => x.id === sid); if (!c || !s) return;
  const blob = soapFormBlob(c, s);
  if (store.kind === 'folder') {
    const b = store.sessionBase(c.id, s.id) || `${s.date || 'undated'}_S${sessionNumberName(s.num)}`;
    try { const where = await store.writeExport(c.id, b + '.xlsx', blob); toast(ui`已儲存 ${b}.xlsx 至 ${where}`); }
    catch (e) { toast(ui('無法儲存 Excel 表單：') + (e.message || e)); }
    return;
  }
  await saveFile(`${fileSafe(c.ref || c.name || c.id)}_${s.date || 'undated'}_S${sessionNumberName(s.num)}_SOAP.xlsx`, blob);
}

// Imported notes keep the canonical label so re-importing in either language compares equal.
function sourceLabel(source, display = true) {
  const format = display ? ui : (text, ...values) => text.replace(/\{(\d+)\}/g, (match, i) => values[i]);
  const pages = source.pages?.join(display ? ui('、') : '、');
  return [source.file, source.sheet, source.row != null ? format(SOURCE_WORKBOOK.row, source.row) : '', pages ? format(SOURCE_WORKBOOK.pages, pages) : ''].filter(Boolean).join(' · ');
}
function medicalHistoryHTML(c) {
  const sections = [[ui('診斷'), c.dx], [ui('轉介原因'), c.referral], [ui('眼科手術史'), eyeSurgerySummary(c)], [ui('醫療史'), c.medicalHistory]].filter(([, text]) => text);
  if (!sections.length && !c.sourceMedical?.length) return '';
  return ui`<details class="script medical-history"><summary>醫療史與病歷來源</summary><div class="body">${sections.map(([label, text]) => `<p style="white-space:pre-wrap;overflow-wrap:anywhere"><b>${esc(label)}</b><br>${esc(text)}</p>`).join('')}${(c.sourceMedical || []).map(r => `<p class="note">${esc(sourceLabel(r))}</p>`).join('')}</div></details>`;
}
function sourceRosterHTML(c) {
  if (!c.sourceRoster?.length) return '';
  return ui`<details class="script"><summary>匯入的收案資料與來源</summary><div class="body">${c.sourceRoster.map(r => `<p>${esc(sourceLabel(r))}</p><dl>${Object.entries(r.fields).filter(([, v]) => v != null && v !== '').map(([k, v]) => `<dt>${esc(k)}</dt><dd style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(v)}</dd>`).join('')}</dl>`).join('')}</div></details>`;
}
function workbookDate(value, date1904 = false) {
  if (value == null || value === '') return '';
  // Excel serials represent calendar dates; converting through UTC shifts Taiwan dates back a day.
  if (typeof value === 'number') {
    const d = XLSXReader.SSF.parse_date_code(value, { date1904 });
    if (d) return `${String(d.y).padStart(4, '0')}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
  }
  const match = String(value).trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (match) return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
  throw new Error(ui('無法辨識 Excel 日期：{0}', value));
}
// Sheet names, column headers and note markers of the source workbook are data identifiers, not interface text.
const SOURCE_WORKBOOK = {
  sheets: ['評估及復能收案名單', '評估紀錄', '復能紀錄'],
  roster: { ref: '復能編號', name: '姓名', dob: '生日', intake: '收案日期', injury: '職災日期', dx: '眼科診斷', referral: '視覺主訴', age: '年齡' },
  therapy: { ref: '個案編號', name: '姓名', date: '看診日期', num: '看診次數' },
  clinician: '治療師',
  rightBlock: '右側無標題資料區',
  row: '第 {0} 列', pages: '第 {0} 頁',
  supplement: '補充來源', importedData: '匯入資料'
};
// LABELS supplies the Chinese names of these assessments.
const SOURCE_ASSESSMENTS = [
  ['src_va', 'Distance visual acuity', [['va_ou', 'OU'], ['va_od', 'OD'], ['va_os', 'OS'], ['va_type', 'Acuity type (as recorded)']]],
  ['src_near', 'Near visual acuity', [['near_ou', 'OU'], ['near_distance', 'Test distance / original entry']]],
  ['src_vf', 'Visual field', [['vf_ou_up', 'OU superior'], ['vf_ou_bottom', 'OU inferior'], ['vf_ou_left', 'OU left'], ['vf_ou_right', 'OU right'], ['vf_od_up', 'OD superior'], ['vf_od_bottom', 'OD inferior'], ['vf_od_nasal', 'OD nasal'], ['vf_od_temperal', 'OD temporal'], ['vf_os_up', 'OS superior'], ['vf_os_bottom', 'OS inferior'], ['vf_os_temporal', 'OS temporal'], ['vf_os_nasal', 'OS nasal']]],
  ['src_cs', 'Contrast sensitivity', [['logcs_ou', 'OU'], ['logcs_od', 'OD'], ['logcs_os', 'OS'], ['logcs_type', 'Test type (as recorded)']]],
  ['src_color', 'Color vision', [['color_ou', 'OU'], ['color_od', 'OD'], ['color_os', 'OS'], ['color_type', 'Test type (as recorded)']]],
  ['src_stereo', 'Stereopsis', [['stereo', 'Result (as recorded)'], ['stereo_type', 'Test type (as recorded)']]],
  ['src_ufov', 'UFOV', [['ufov_ps', 'UFOV processing speed'], ['ufov_da', 'UFOV divided attention'], ['ufov_sa', 'UFOV selective attention']]],
  ['src_other', 'Other assessment results', [['other_assessment', 'Original entry']]]
].map(([id, name, fields]) => ({ id, name: name + ' (source workbook)', domain: 'Source visual function assessment', timing: 'assessment', fields: fields.map(([id, label]) => ({ id, label, type: id === 'other_assessment' ? 'textarea' : 'text' })) }));
async function readAssessmentWorkbook(file) {
  if (typeof XLSXReader === 'undefined' || !XLSXReader?.read) throw new Error(ui('Excel 匯入元件無法使用，請重新開啟完整的 EzEMR.html。'));
  const wb = XLSXReader.read(await file.arrayBuffer(), { type: 'array', cellDates: false });
  const date1904 = !!wb.Workbook?.WBProps?.date1904;
  const names = SOURCE_WORKBOOK.sheets, R = SOURCE_WORKBOOK.roster, T = SOURCE_WORKBOOK.therapy;
  if (names.some(name => !wb.Sheets[name])) throw new Error(ui('需要包含「評估及復能收案名單、評估紀錄、復能紀錄」的資料表；舊版 SOAP 請使用「匯入舊版 SOAP 資料夾」。'));
  const bundles = [], warnings = [];
  const rowsOf = sheet => {
    const ws = wb.Sheets[sheet], start = XLSXReader.utils.decode_range(ws['!ref']).s.r;
    return XLSXReader.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true }).map((values, i) => ({ values, row: start + i + 1 }));
  };
  const present = v => v != null && String(v).trim() !== '';
  const text = v => v == null ? '' : String(v);
  const source = (sheet, row, fields) => ({ file: file.name, sheet, row, fields });
  const getClient = (ref, name) => {
    let b = bundles.find(b => b.client.ref === ref);
    if (b && b.client.name !== name) throw new Error(ui('個案編號 {0} 對應不同姓名，已停止匯入。', ref));
    if (!b) {
      if (!/^[A-Za-z0-9_-]+$/.test(ref) || !name.trim()) throw new Error(ui('個案編號或姓名無效：{0}', ref));
      b = { client: { id: 'c_import_' + ref, ref, name, dob: '', doi: '', dx: '', referral: '', plan: newClientPlan(), created: today() }, sessions: [] };
      bundles.push(b);
    }
    return b;
  };
  const rosterRows = rowsOf(names[0]), rosterHeader = rosterRows.find(r => r.values.includes(R.ref) && r.values.includes(R.name));
  if (!rosterHeader) throw new Error(ui('找不到收案名單欄位。'));
  for (const { values, row } of rosterRows.filter(r => r.row > rosterHeader.row)) {
    const raw = Object.fromEntries(rosterHeader.values.map((key, i) => [key, values[i]]).filter(([key]) => key));
    if (!present(raw[R.name]) && !present(raw[R.ref])) continue;
    const c = getClient(text(raw[R.ref]).trim(), text(raw[R.name]).trim()).client;
    const fields = { ...raw };
    for (const key of [R.dob, R.intake, R.injury]) fields[key] = workbookDate(fields[key], date1904);
    Object.assign(c, { dob: fields[R.dob], doi: fields[R.injury], dx: text(raw[R.dx]), referral: text(raw[R.referral]), sourceRoster: [source(names[0], row, fields)] });
    if (raw[R.age] === 126 || (raw[R.age] === 0 && !fields[R.dob])) warnings.push(ui('{0}：年齡原值 {1}，未代為修正。', c.name, raw[R.age]));
  }
  const visit = (b, date, num, kind) => {
    if (!date) throw new Error(ui('{0} 缺少看診日期。', b.client.name));
    let s = b.sessions.find(s => s.date === date && s.num === num);
    if (!s) {
      s = { id: `s_import_${b.client.ref}_${date.replace(/-/g, '')}_${num ?? 0}`, date, num, visit: kind, sym: [], assess: {}, training: {}, subjective: '', objective: '', assessment: '', plan: '', clinician: '', sourceRecords: [] };
      b.sessions.push(s);
    }
    return s;
  };
  const assessmentRows = rowsOf(names[1]), assessmentHeader = assessmentRows.find(r => r.values.includes('patient_no') && r.values.includes('visit_date'));
  if (!assessmentHeader) throw new Error(ui('找不到評估紀錄欄位。'));
  const offset = assessmentHeader.values.indexOf('patient_no'), width = assessmentHeader.values.indexOf(SOURCE_WORKBOOK.clinician, offset) - offset + 1;
  const headers = assessmentHeader.values.slice(offset, offset + width).map(key => text(key).trim());
  for (const { values, row } of assessmentRows.filter(r => r.row > assessmentHeader.row)) {
    // One legacy sheet places a second, headerless patient block to the right of the table.
    const starts = [offset];
    for (let i = offset + width; i < values.length; i++) if (/^(RH\d+|WI\d+)$/.test(text(values[i])) && present(values[i + 1]) && present(values[i + 2]) && typeof values[i + 3] === 'number') starts.push(i);
    for (const start of starts) {
      if (!present(values[start])) continue;
      const raw = Object.fromEntries(headers.map((key, i) => [key, values[start + i] ?? null]));
      const b = getClient(text(raw.patient_no).trim(), text(raw.name).trim());
      const s = visit(b, workbookDate(raw.visit_date, date1904), raw.visit_time ?? null, raw.visit_time > 1 ? 'assessment' : 'baseline');
      s.clinician = text(raw[SOURCE_WORKBOOK.clinician]);
      const record = source(names[1], row, { ...raw, visit_date: s.date });
      if (start !== offset) { record.block = SOURCE_WORKBOOK.rightBlock; warnings.push(ui('{0} {1}：已讀取評估頁右側無標題資料區；收案資料未記載。', b.client.ref, b.client.name)); }
      s.sourceRecords.push(record);
      for (const item of SOURCE_ASSESSMENTS) {
        const values = Object.fromEntries(item.fields.filter(f => present(raw[f.id])).map(f => [f.id, raw[f.id]]));
        if (!Object.keys(values).length) continue;
        if (!b.client.plan.some(p => p.id === item.id)) b.client.plan.push({ ...clone(item), initial: false });
        s.assess[item.id] = { done: true, notes: sourceLabel(record, false), values };
      }
    }
  }
  const therapyRows = rowsOf(names[2]), therapyHeader = therapyRows.find(r => r.values.includes(T.ref) && r.values.includes(T.date));
  if (!therapyHeader) throw new Error(ui('找不到復能紀錄欄位。'));
  for (const { values, row } of therapyRows.filter(r => r.row > therapyHeader.row)) {
    const raw = Object.fromEntries(therapyHeader.values.map((key, i) => [key, values[i]]).filter(([key]) => key));
    if (!present(raw[T.ref])) continue;
    const b = getClient(text(raw[T.ref]).trim(), text(raw[T.name]).trim());
    const s = visit(b, workbookDate(raw[T.date], date1904), raw[T.num] ?? null, 'treatment');
    for (const [to, from] of [['subjective', 'subject'], ['objective', 'objective'], ['assessment', 'assessment'], ['plan', 'plan'], ['clinician', SOURCE_WORKBOOK.clinician]]) s[to] = text(raw[from]) || s[to] || '';
    s.sourceRecords.push(source(names[2], row, { ...raw, [T.date]: s.date }));
  }
  for (const b of bundles) for (const s of b.sessions) validateRecord(b.client, s);
  return { bundles, warnings };
}
async function readSOAPFolder(files) {
  const groups = new Map(), warnings = [];
  for (const file of files) {
    const path = (file.webkitRelativePath || file.name).replace(/\\/g, '/'), parts = path.split('/');
    if (parts.includes('_archive') || !file.name.toLowerCase().endsWith('.json')) continue;
    const parent = parts.slice(0, -1).join('/');
    let data; try { data = JSON.parse((await file.text()).replace(/^\ufeff/, '')); } catch (_) { throw new Error(ui('JSON 格式錯誤：{0}', path)); }
    if (!groups.has(parent)) groups.set(parent, { client: null, sessions: [] });
    const group = groups.get(parent);
    if (file.name === 'client.json') { group.client = data; data.plan = normalizePlan(data.plan); }
    else if (data?.id && data?.date) group.sessions.push({ sym: [], assess: {}, training: {}, visit: 'treatment', ...data, sourceRecords: [...(data.sourceRecords || []), { file: path, updated: data.updated || '' }] });
    else throw new Error(ui('無法辨識舊版 SOAP JSON：{0}', path));
  }
  const bundles = [...groups.values()];
  if (!bundles.length) throw new Error(ui('找不到舊版 SOAP JSON，請選擇包含個案子資料夾及 client.json 的資料夾。'));
  for (const b of bundles) {
    if (!b.client) throw new Error(ui('SOAP 復健紀錄缺少同資料夾的 client.json，無法核對個案。'));
    const unique = new Map();
    for (const s of b.sessions) {
      validateRecord(b.client, s);
      if (!unique.has(s.id) || String(s.updated || '') > String(unique.get(s.id).updated || '')) unique.set(s.id, s);
    }
    b.sessions = [...unique.values()];
    validateRecord(b.client, b.sessions[0] || { id: 'validation', date: today(), visit: 'treatment', sym: [], assess: {}, training: {} });
  }
  if (files.some(f => (f.webkitRelativePath || '').split('/').includes('_archive'))) warnings.push(ui('已略過 _archive 封存版本，未計為目前就診紀錄。'));
  return { bundles, warnings };
}
function mergeImportBundles(incoming, existing = []) {
  const bundles = clone(existing), warnings = [], affected = new Set();
  const union = (a = [], b = []) => [...new Map([...a, ...b].map(v => [JSON.stringify(v), v])).values()];
  const ref = c => (c.ref || '').trim().toLocaleLowerCase();
  for (const raw of incoming) {
    const c = clone(raw.client), name = c.name.replace(/\s/g, '');
    const sameId = bundles.filter(b => b.client.id === c.id);
    const matches = sameId.length ? sameId : bundles.filter(b => name && b.client.name.replace(/\s/g, '') === name && (!ref(b.client) || !ref(c) || ref(b.client) === ref(c)));
    if (matches.length > 1) throw new Error(ui('{0} 對應多位個案，無法自動合併。', c.name));
    let target = matches[0];
    if (target && ref(target.client) && ref(c) && ref(target.client) !== ref(c)) throw new Error(ui('{0} 的病歷號與既有個案不一致，已停止匯入。', c.name));
    if (target && ((target.client.dob && c.dob && target.client.dob !== c.dob) || target.client.name.replace(/\s/g, '') !== name)) throw new Error(ui('{0} 的姓名或出生日期與既有個案不一致，已停止匯入。', c.name));
    if (!target) { target = { client: c, sessions: [] }; bundles.push(target); }
    const tc = target.client;
    if (bundles.some(b => b !== target && safeName(b.client.ref || b.client.id).toLowerCase() === safeName(tc.ref || tc.id).toLowerCase())) throw new Error(ui('病歷號重複：{0}', tc.ref));
    if (!ref(tc) && ref(c)) tc.ref = c.ref;
    for (const key of ['dob', 'doi', 'dx', 'referral', 'eyeSurgery']) if (!tc[key] && c[key]) tc[key] = c[key];
    tc.sourceRoster = union(tc.sourceRoster, c.sourceRoster);
    tc.plan = [...new Map([...c.plan, ...tc.plan].map(item => [item.id, item])).values()];
    affected.add(tc.id);
    for (const input of raw.sessions || []) {
      const s = clone(input);
      let prior = target.sessions.find(p => p.id === s.id);
      if (!prior) {
        const sameDay = target.sessions.filter(p => p.date === s.date);
        prior = sameDay.find(p => p.num === s.num) || (sameDay.length === 1 && (sameDay[0].num == null || s.num == null) ? sameDay[0] : null);
      }
      if (!prior) { target.sessions.push(s); continue; }
      if (prior.date !== s.date) throw new Error(ui('相同病歷識別碼的日期不同：{0} {1}', tc.name, s.id));
      if (s.clinicalLinks !== undefined) {
        validateRecord(c, s);
        const links = new Map((prior.clinicalLinks || []).map(link => [link.id, link]));
        for (const link of s.clinicalLinks) {
          if (links.has(link.id) && JSON.stringify(links.get(link.id)) !== JSON.stringify(link)) throw new Error(ui('{0} {1} 的 {2} 有不同結果，已停止匯入。', tc.name, s.date, 'clinicalLinks/' + link.id));
          links.set(link.id, link);
        }
        if (links.size > 100) throw new Error(ui('臨床連結欄位格式錯誤'));
        prior.clinicalLinks = [...links.values()];
      }
      if (s.sourceRecords?.length && s.sourceRecords.every(r => prior.sourceRecords?.some(p => JSON.stringify(p) === JSON.stringify(r)))) continue;
      const label = (s.sourceRecords || []).map(r => sourceLabel(r, false)).join('；') || SOURCE_WORKBOOK.importedData;
      for (const key of ['subjective', 'objective', 'feedback', 'assessment', 'plan', 'otherTx']) {
        if (!s[key] || prior[key] === s[key]) continue;
        if (prior[key]) { prior[key] += `\n\n[${SOURCE_WORKBOOK.supplement}：${label}]\n${s[key]}`; warnings.push(ui('{0} {1} {2}：兩份記載已並列保留。', tc.name, s.date, key)); }
        else prior[key] = s[key];
      }
      if (!prior.clinician) prior.clinician = s.clinician || '';
      for (const key of ['duration', 'tolerance', 'nextDate']) if (prior[key] == null || prior[key] === '') prior[key] = s[key] ?? prior[key];
      if (!prior.sym.length) prior.sym = s.sym;
      for (const key of ['assess', 'training']) for (const [id, value] of Object.entries(s[key] || {})) {
        if (prior[key][id] && JSON.stringify(prior[key][id]) !== JSON.stringify(value)) throw new Error(ui('{0} {1} 的 {2} 有不同結果，已停止匯入。', tc.name, s.date, `${key}/${id}`));
        prior[key][id] = value;
      }
      prior.sourceRecords = union(prior.sourceRecords, s.sourceRecords);
      if (s.assessmentPlan) prior.assessmentPlan = [...new Map([...(prior.assessmentPlan || []), ...s.assessmentPlan].map(item => [item.id, item])).values()];
      if (s.trainingPlan) prior.trainingPlan = [...new Map([...(prior.trainingPlan || []), ...s.trainingPlan].map(item => [item.k, item])).values()];
    }
  }
  for (const b of bundles) {
    validateRecord(b.client, b.sessions[0] || { id: 'validation', date: today(), visit: 'treatment', sym: [], assess: {}, training: {} });
    for (const s of b.sessions) validateRecord(b.client, s);
  }
  return { bundles, warnings, affected: [...affected] };
}
async function importSourceBundles(incoming, warnings = []) {
  if (savingSession || savingItems) throw new Error(ui('正在儲存資料，請等候完成後再匯入。'));
  savingSession = true; renderCommands();
  try {
  const existing = [];
  for (const c of clients) existing.push({ client: c, sessions: await store.listSessions(c.id) });
  const merged = mergeImportBundles(incoming, existing);
  warnings = [...warnings, ...merged.warnings];
  toast(ui('正在整合 {0} 位個案，產生 CSV 與 PDF…', merged.affected.length));
  for (const b of merged.bundles.filter(b => merged.affected.includes(b.client.id))) {
    await safe(() => store.saveClient(b.client), ui('匯入個案失敗'));
    for (const s of b.sessions) await safe(() => store.saveSession(b.client.id, s), ui('匯入紀錄失敗'));
  }
  await loadClients(); curId = merged.affected[0] || curId; view = 'sessions'; sessionFilter = { visit: '', from: '', to: '' };
  await loadSessions(); renderClients(); renderMain();
  const summary = ui('已整合 {0} 位個案。', merged.affected.length);
  if (warnings.length) modal(ui`<h3>${esc(summary)}</h3><ul>${warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul><button class="btn app-primary" id="importReportClose">關閉</button>`).querySelector('#importReportClose').onclick = closeModal;
  else toast(summary);
  return merged;
  } finally { savingSession = false; renderCommands(); }
}

async function exportAll() {
  const out = { app: 'vision-rehab-notes', version: 2, exported: new Date().toISOString(), settings: await store.getSettings(), clients: [] };
  for (const c of clients) out.clients.push({ ...c, sessions: await store.listSessions(c.id) });
  await saveFile(`EzEMR-backup-${today()}.json`, JSON.stringify(out, null, 2));
}
async function importAll(file) {
  let data; try { data = JSON.parse(await file.text()); } catch (e) { toast(ui('這不是有效的 JSON 備份。')); return; }
  if (!data || !Array.isArray(data.clients)) { toast(ui('這不是 EzEMR 的備份檔。')); return; }
  const settings = data.settings === undefined ? null : validateAppSettings(data.settings);
  const clientIds = new Set();
  const records = data.clients.map(raw => {
    const { sessions: ss = [], ...c } = raw; c.plan = normalizePlan(c.plan);
    if (!Array.isArray(ss)) throw new Error(ui('備份中的復健紀錄格式錯誤'));
    const normalized = ss.map(s => ({ sym: [], assess: {}, training: {}, visit: 'treatment', ...s }));
    const sessionIds = new Set();
    for (const s of normalized) {
      validateRecord(c, s);
      if (sessionIds.has(s.id)) throw new Error(ui('備份含有重複的紀錄識別碼：{0}', s.id));
      sessionIds.add(s.id);
    }
    if (!normalized.length) validateRecord(c, { id: 'validation', date: today(), visit: 'treatment', sym: [], assess: {}, training: {} });
    if (clientIds.has(c.id)) throw new Error(ui('備份含有重複的個案識別碼：{0}', c.id));
    clientIds.add(c.id);
    return { c, ss: normalized };
  });
  let n = 0;
  for (const { c, ss } of records) {
    await safe(() => store.saveClient(c), ui('還原已停止'));
    for (const s of ss) if (s.id) await safe(() => store.saveSession(c.id, s), ui('還原已停止'));
    n++;
  }
  if (settings) { await safe(() => store.saveSettings(settings), ui('還原已停止')); appSettings = clone(settings); }
  await loadClients();
  if (!curId && clients.length) curId = clients[0].id;
  await loadSessions(); renderClients(); renderMain(); toast(ui`已還原 ${n} 位個案。`);
}
// Score files from OcuTrain and the UFOV-style peripheral field training program.
// SCORE_FORMATS holds each program's own file vocabulary; it is matched as data and never translated.
const SCORE_FORMATS = {
  otModules: { VOR: 'vor', PURSUIT: 'pursuit', SACCADE: 'saccade', FIXATION: 'fixation' },
  otModes: { evaluation: 'Evaluation', predictable: 'Predictable', random: 'Random' },
  otStimuli: { white_dot: 'White dot', red_in_white: 'Red in White', numbers_dot: 'Numbers dot' },
  otTrackers: { tobii: 'Tobii', webgazer: 'WebGazer', off: 'None' },
  otDirections: { rightUp: ['↗', 'Top-Right'], leftUp: ['↖', 'Top-Left'], rightDown: ['↘', 'Bottom-Right'], leftDown: ['↙', 'Bottom-Left'],
    middleUp: ['↑', 'Up'], middleDown: ['↓', 'Down'], leftMiddle: ['←', 'Left'], rightMiddle: ['→', 'Right'], center: ['·', 'Center'] },
  otComplete: ['duration_complete', 'evaluation_complete'],
  ufovItems: { 1: 'ufov_speed', 2: 'ufov_divided', 3: 'ufov_selective' },
  // Peripheral axes 0 to 7, clockwise from up, as numbered by the program.
  ufovArrows: ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'],
  ufovStop: { adaptive_80: 'Adaptive 80%', fixed_trials: 'Fixed trials' }
};
const leadNumber = value => { const m = String(value ?? '').match(/-?\d+(?:\.\d+)?/); return m ? Number(m[0]) : null; };
const pad2 = n => String(n).padStart(2, '0');
const localDate = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const localTime = d => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
// Directions and diplopia are written with arrows so the text reads the same in both languages.
const otDirectionText = keys => Array.isArray(keys) && keys.length ? keys.map(k => SCORE_FORMATS.otDirections[k]?.[0] || k).join(' ') : null;
const otDiplopiaText = (q, sessionId) => q && q.source_session_id === sessionId && Array.isArray(q.responses) && q.responses.length
  ? q.responses.map(r => `${SCORE_FORMATS.otDirections[r.direction]?.[0] || r.direction} ${r.no_diplopia ? '×' : Number.isFinite(r.onset_angle_deg) ? Math.round(r.onset_angle_deg * 10) / 10 + '°' : '-'}`).join(' · ') : null;
function scoreRecord(program, item, file, info) {
  const def = deviceItem(item), fields = fieldsFor(def), ids = new Set(fields.map(f => f.id));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(info.date || '')) throw new Error(ui('缺少測驗日期。'));
  const values = Object.fromEntries(Object.entries(info.values).filter(([k, v]) => ids.has(k) && hasValue(v) && !(typeof v === 'number' && !Number.isFinite(v))));
  const main = fields[0].id;
  return { program, item, file, ...info, values, score: hasValue(values[main]) ? values[main] + (program === 'UFOV' ? ' ms' : '%') : '' };
}
function ocuTrainJSONRecord(d, file) {
  const item = SCORE_FORMATS.otModules[String(d.module || '').toUpperCase()];
  if (!item) throw new Error(ui('無法辨識 OcuTrain 模組：{0}', d.module));
  const st = d.settings || {}, ended = new Date(d.ended_at || '');
  return scoreRecord('OcuTrain', item, file, {
    key: 'OcuTrain:' + d.session_id, subject: String(d.subject_id ?? ''), date: isNaN(ended) ? '' : localDate(ended), time: isNaN(ended) ? '' : localTime(ended),
    mode: item === 'vor' ? null : SCORE_FORMATS.otModes[st.mode || d.mode] || null, complete: SCORE_FORMATS.otComplete.includes(d.end_reason), reason: d.end_reason || '',
    values: {
      accuracy_rate: numOrNull(d.accuracy_rate), in_threshold_sec: numOrNull(d.in_threshold_sec), valid_sec: numOrNull(d.valid_sec),
      actual_duration_sec: d.actual_duration_ms != null ? Math.round(d.actual_duration_ms / 10) / 100 : null, completed_targets: numOrNull(d.completed_targets),
      tff_mean_ms: numOrNull(d.tff_mean_ms), tff_detected_targets: numOrNull(d.tff_detected_targets), tff_total_targets: numOrNull(d.tff_total_targets),
      diplopia: otDiplopiaText(d.diplopia_questionnaire, d.session_id),
      mode: SCORE_FORMATS.otModes[st.mode || d.mode], stimulusType: SCORE_FORMATS.otStimuli[d.stimulus?.type || st.stimulusType],
      ballArcmin: numOrNull(d.stimulus?.arcmin ?? st.ballArcmin), speedArcminSec: numOrNull(st.speedArcminSec), holdSec: numOrNull(st.holdSec), dwellMs: numOrNull(st.dwellMs),
      horizontalSpanArcmin: numOrNull(st.horizontalSpanArcmin), verticalSpanArcmin: numOrNull(st.verticalSpanArcmin),
      directions: otDirectionText(d.stimulus?.selected_directions || st.directions), threshold_deg: numOrNull(d.threshold_deg),
      viewingDistanceCm: numOrNull(d.calibration?.viewingDistanceCm), eye_tracker: SCORE_FORMATS.otTrackers[d.eye_tracking?.source],
      vorGain: numOrNull(st.vorGain), vorAxis: { horizontal: 'Horizontal', vertical: 'Vertical' }[st.vorAxis]
    }
  });
}
function ocuTrainCSVRecord(text, file) {
  const meta = {};
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith('#')) { if (line.trim()) break; continue; }
    const m = line.match(/^#\s*([^:]+?):\s?(.*)$/); if (m && !Object.hasOwn(meta, m[1].trim())) meta[m[1].trim()] = m[2].trim();
  }
  const item = SCORE_FORMATS.otModules[(meta['Training Module'] || '').match(/\(([A-Z]+)\)\s*$/)?.[1]];
  if (!item) throw new Error(ui('無法辨識 OcuTrain 模組：{0}', meta['Training Module'] || '-'));
  const json = value => { try { return JSON.parse(value || 'null'); } catch (_) { return null; } };
  const st = json(meta['Module Settings']) || {}, tff = (meta['TFF Detected Targets'] || '').match(/(\d+)\s*\/\s*(\d+)/), hardware = meta['Eye Tracker Hardware'] || '';
  const names = Object.fromEntries(Object.entries(SCORE_FORMATS.otDirections).map(([key, [, name]]) => [name, key]));
  const listed = meta['Enabled Directions'] && meta['Enabled Directions'] !== 'All' ? meta['Enabled Directions'].split(/,\s*/).map(name => names[name] || name) : st.directions;
  const stimulus = Object.values(SCORE_FORMATS.otStimuli).includes(meta['Stimulus Type']) ? meta['Stimulus Type'] : SCORE_FORMATS.otStimuli[st.stimulusType];
  return scoreRecord('OcuTrain', item, file, {
    key: 'OcuTrain:' + meta['Session ID'], subject: meta['Subject ID'] || '', date: meta['Test Date'] || '', time: meta['Test Time'] || '',
    mode: item === 'vor' ? null : SCORE_FORMATS.otModes[st.mode] || null, complete: SCORE_FORMATS.otComplete.includes(meta['Test Termination Reason']), reason: meta['Test Termination Reason'] || '',
    values: {
      accuracy_rate: leadNumber(meta['Gaze Accuracy Rate']), in_threshold_sec: leadNumber(meta['On-Target Duration (Numerator)']),
      valid_sec: leadNumber(meta['Valid Gaze Duration (Denominator)']), actual_duration_sec: leadNumber(meta['Total Test Duration']),
      completed_targets: leadNumber(meta['Completed Targets']), tff_mean_ms: leadNumber(meta['Mean Time To First Fixation (TFF)']),
      tff_detected_targets: tff ? Number(tff[1]) : null, tff_total_targets: tff ? Number(tff[2]) : null,
      diplopia: otDiplopiaText(json(meta['Diplopia Questionnaire']), meta['Session ID']),
      mode: SCORE_FORMATS.otModes[st.mode], stimulusType: stimulus, ballArcmin: leadNumber(meta['Stimulus Size']) ?? numOrNull(st.ballArcmin),
      speedArcminSec: numOrNull(st.speedArcminSec), holdSec: numOrNull(st.holdSec), dwellMs: numOrNull(st.dwellMs),
      horizontalSpanArcmin: leadNumber(meta['Horizontal Target Span']) ?? numOrNull(st.horizontalSpanArcmin),
      verticalSpanArcmin: leadNumber(meta['Vertical Target Span']) ?? numOrNull(st.verticalSpanArcmin),
      directions: otDirectionText(listed), threshold_deg: leadNumber(meta['Hit Distance Threshold']), viewingDistanceCm: leadNumber(meta['Viewing Distance']),
      eye_tracker: /tobii/i.test(hardware) ? 'Tobii' : /webgazer/i.test(hardware) ? 'WebGazer' : /untracked|none/i.test(hardware) ? 'None' : null,
      vorGain: leadNumber(meta['VOR Multiplier']) ?? numOrNull(st.vorGain),
      vorAxis: /vertical/i.test(meta['VOR Direction'] || '') ? 'Vertical' : /horizontal/i.test(meta['VOR Direction'] || '') ? 'Horizontal' : null
    }
  });
}
// The program's statistics CSV lists one parameter per row: name, code, value, unit, details.
function ufovRecord(text, file) {
  const rows = parseCSV(text), by = Object.fromEntries(rows.filter(r => r.length >= 3).map(r => [r[1], { value: r[2], detail: r[4] || '' }]));
  const subtest = leadNumber(by.subtest_code?.value), item = SCORE_FORMATS.ufovItems[subtest];
  if (!item) throw new Error(ui('無法辨識周邊視野訓練的子測驗：{0}', by.subtest_code?.value ?? '-'));
  const arrows = SCORE_FORMATS.ufovArrows;
  const directions = rows.filter(r => /^spatial_dir_\d_/.test(r[1] || '')).map(r => {
    const percent = leadNumber(r[2]), counts = (r[4] || '').match(/(\d+)\D+(\d+)/);
    return percent == null ? null : `${arrows[Number(r[1].match(/^spatial_dir_(\d)/)[1])]} ${percent}%${counts ? ` (${counts[2]}/${counts[1]})` : ''}`;
  }).filter(Boolean);
  const enabled = (by.enabled_direction_list?.detail || '').split(/,\s*/).filter(a => /^[0-7]$/.test(a)).map(a => arrows[Number(a)]);
  const mode = by.test_mode?.detail || '', aborted = /aborted/i.test(by.test_aborted?.value || '');
  const number = code => leadNumber(by[code]?.value);
  return scoreRecord('UFOV', item, file, {
    key: ['UFOV', by.subject_id?.value, by.test_date?.value, by.test_time?.value, subtest].join(':'), subject: by.subject_id?.value || '',
    date: by.test_date?.value || '', time: by.test_time?.value || '', mode: null, formal: mode === 'formal', testMode: mode, complete: !aborted, reason: aborted ? 'aborted' : '',
    values: {
      ...Object.fromEntries(['final_threshold_rt_ms', 'accuracy_rate_percent', 'central_accuracy_percent', 'peripheral_accuracy_percent', 'mean_response_time_ms',
        'formal_trials_total', 'formal_trials_correct', 'fastest_correct_duration_ms', 'contrast_percent', 'target_visual_angle_deg', 'vehicle_visual_angle_deg',
        'viewing_distance_cm', 'refresh_rate_hz'].map(code => [code, number(code)])),
      direction_accuracy: directions.join(' · '), enabled_direction_list: enabled.join(' '), stop_condition: SCORE_FORMATS.ufovStop[by.stop_condition?.detail]
    }
  });
}
// Recognizes score files by content, so the usual Import command accepts them.
function scoreFormat(name, text) {
  const body = text.replace(/^﻿/, '');
  if (/\.json$/i.test(name)) {
    let data; try { data = JSON.parse(body); } catch (_) { return null; }
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.record_type === 'diplopia_questionnaire') return { kind: 'ot-diplopia' };
    if (first && typeof first.module === 'string' && first.session_id) return { kind: 'ot-json', data: [].concat(data) };
    if (typeof first?.experiment === 'string' && /^UFOV/.test(first.experiment)) return { kind: 'ufov-json' };
    return null;
  }
  if (/^# -- Oculomotor/.test(body) || /^# Training Module:/m.test(body.slice(0, 4000))) return { kind: 'ot-csv', text: body };
  if (/^(?:[^,\r\n]*,){3}Subtest/.test(body)) return { kind: 'ufov-raw' };
  if (/(^|\n)"?[^",\r\n]*"?,"?subtest_code"?,/.test(body)) return { kind: 'ufov-stats', text: body };
  return null;
}
function scorePreview(c, records, notes) {
  return new Promise(resolve => {
    const subjects = [...new Set(records.map(r => r.subject).filter(Boolean))].join(ui('、')) || '-';
    const dest = [['assess', ui('評估')], ['training', ui('復健訓練')], ['skip', ui('不匯入')]];
    const m = modal(ui`<h3>匯入測驗分數</h3>
      <p style="margin:0">${ui('匯入到 {0}。檔案中的受試者代號：{1}', `<b>${esc(clientLabel(c))}</b>${c.ref ? ui('（{0}）', esc(c.ref)) : ''}`, esc(subjects))}</p>
      <p class="note" style="margin:0">「評估」寫入同名的評估項目；「復健訓練」寫入復健項目的測驗紀錄，並把主要分數填入對應活動。該日沒有紀錄時會新增一筆。</p>
      <ol class="import-list">${records.map((r, i) => `<li class="import-row"><div class="import-info">
        <div class="import-title"><b class="import-name" id="score-name-${i}">${esc(labelText(deviceItem(r.item).name))}</b>${r.mode ? `<span class="chip import-mode">${esc(labelText(r.mode))}</span>` : ''}<span class="import-score">${esc(r.score || '-')}</span></div>
        <span class="note import-when" id="score-when-${i}">${esc(r.date + (r.time ? ' ' + r.time : ''))}</span><span class="note import-file">${esc(r.file)}</span>${r.status ? `<span class="import-status">${esc(r.status)}</span>` : ''}</div>
        <label class="f" for="score-dest-${i}"><span id="score-dest-${i}-l">${ui('匯入為')}</span><select id="score-dest-${i}" aria-labelledby="score-dest-${i}-l score-name-${i} score-when-${i}">${dest.map(([v, text]) => `<option value="${v}" ${r.dest === v ? 'selected' : ''}>${esc(text)}</option>`).join('')}</select></label></li>`).join('')}</ol>
      ${notes.length ? `<ul class="note" style="margin:0">${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
      <div class="row" style="justify-content:flex-end"><button class="btn" id="scoreCancel">取消</button><button class="btn app-primary" id="scoreImport">匯入</button></div>`, result => resolve(result || null));
    m.style.width = 'min(900px, 100%)';
    m.querySelector('#scoreCancel').onclick = () => closeModal(false);
    m.querySelector('#scoreImport').onclick = () => closeModal(records.map((r, i) => m.querySelector('#score-dest-' + i).value));
  });
}
async function importScoreFiles(entries) {
  const c = cur();
  if (!c) throw new Error(ui('請先選擇要匯入測驗分數的個案。'));
  const records = [], notes = [], order = { 'ot-json': 0, 'ot-csv': 1 };
  // JSON goes first so that, for a run exported as both JSON and CSV, the JSON copy is listed.
  for (const e of [...entries].sort((a, b) => (order[a.kind] ?? 2) - (order[b.kind] ?? 2))) {
    const name = e.file.name;
    try {
      if (e.kind === 'ot-json') records.push(...e.data.map(d => ocuTrainJSONRecord(d, name)));
      else if (e.kind === 'ot-csv') records.push(ocuTrainCSVRecord(e.text, name));
      else if (e.kind === 'ufov-stats') records.push(ufovRecord(e.text, name));
      else if (e.kind === 'ufov-raw') notes.push(ui('{0}：原始分數檔只有逐題資料，請匯入同一次的統計成績 CSV。', name));
      else if (e.kind === 'ufov-json') notes.push(ui('{0}：此 JSON 沒有記錄測驗模式與正式題，請匯入同一次的統計成績 CSV。', name));
      else notes.push(ui('{0}：只有複視問卷，沒有測驗分數，未匯入。', name));
    } catch (err) { throw new Error(`${name}: ${err.message || err}`); }
  }
  const unique = [];
  for (const r of records) {
    const twin = unique.find(u => u.key === r.key);
    if (twin) notes.push(ui('{0} 與 {1} 是同一次測驗，只列出一筆。', r.file, twin.file)); else unique.push(r);
  }
  if (!unique.length) throw new Error(notes.join(' ') || ui('沒有可匯入的測驗分數。'));
  const same = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
  for (const r of unique) {
    const owner = clients.find(x => x.id !== c.id && x.ref && same(x.ref, r.subject));
    if (owner) throw new Error(ui('受試者代號 {0} 屬於個案 {1}，請先開啟該個案再匯入。', r.subject, owner.name));
  }
  const imported = new Set(sessions.flatMap(s => (s.sourceRecords || []).map(x => x.fields?.import_key).filter(Boolean)));
  for (const r of unique) {
    const status = imported.has(r.key) ? ui('已匯入過，預設不匯入。')
      : !r.complete ? ui('測驗未完成（{0}），預設不匯入。', r.reason || '-')
      : r.program === 'UFOV' && !r.formal ? ui('不是正式紀錄（{0}），預設不匯入。', r.testMode || '-') : '';
    r.status = status;
    r.dest = status ? 'skip' : r.program === 'OcuTrain' ? (r.mode === 'Evaluation' ? 'assess' : 'training')
      : sessions.some(s => s.date === r.date && isAssessVisit(s.visit)) ? 'assess' : 'training';
  }
  unique.sort((a, b) => (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time));
  const choices = await scorePreview(c, unique, notes);
  if (!choices) return;
  unique.forEach((r, i) => { r.dest = choices[i]; });
  await applyScores(c, unique.filter(r => r.dest !== 'skip'));
}
async function applyScores(c, records) {
  if (!records.length) { toast(ui('沒有匯入任何測驗分數。')); return; }
  if (savingSession || savingItems) throw new Error(ui('正在儲存資料，請等候完成後再匯入。'));
  savingSession = true; renderCommands();
  try {
    const next = preserveLegacyTemplates(clone(c), c), list = clone(sessions), changed = new Set(), lines = [], warnings = [];
    let planChanged = false;
    for (const r of records) {
      const assess = r.dest === 'assess', def = deviceItem(r.item), name = labelText(def.name);
      const day = list.filter(s => s.date === r.date && s.visit !== 'absent');
      let s = day.find(x => isAssessVisit(x.visit) === assess) || day[0];
      if (!s) {
        s = { id: uid('s'), date: r.date, num: null, visit: assess ? 'assessment' : 'treatment', clinician: '', duration: null, subjective: '', feedback: '',
          sym: [], assess: {}, training: {}, otherTx: '', tolerance: null, assessment: '', plan: '', nextDate: '' };
        list.push(s); warnings.push(ui('已新增 {0} 的{1}紀錄。', r.date, visitLabel(s.visit)));
      }
      if (assess) {
        const prev = s.assess[r.item];
        if (Object.entries(r.values).some(([k, v]) => hasValue(prev?.values?.[k]) && String(prev.values[k]) !== String(v))) {
          warnings.push(ui('{0} {1}：已有不同的結果，未覆蓋（{2}）。', r.date, name, r.file)); continue;
        }
        if (!next.plan.some(p => p.id === r.item)) { next.plan.push(clone(def)); planChanged = true; }
        s.assess[r.item] = { ...(prev || {}), done: true, notes: prev?.notes || '', values: { ...(prev?.values || {}), ...r.values } };
        if (Array.isArray(s.assessmentPlan) && !s.assessmentPlan.some(p => p.id === r.item)) s.assessmentPlan.push(clone(def));
      } else {
        const k = RUN_ITEMS.ocular.includes(r.item) ? 'ocular' : 'periph', act = RUN_ACTS[r.item];
        if (Array.isArray(next.trainingPlan) && !next.trainingPlan.some(t => t.k === k)) { next.trainingPlan.push(clone(TRAIN.find(t => t.k === k))); planChanged = true; }
        const d = s.training[k] = { ...(s.training[k] || {}), on: true };
        d.runs = [...(d.runs || []), { id: uid('r'), item: r.item, ...(r.time ? { time: r.time } : {}), file: r.file, values: r.values }];
        if (!(d.acts || []).some(a => labelText(a) === labelText(act))) d.acts = [...(d.acts || []), act];
        // Runs are applied in time order, so the activity ends up with the latest run's score.
        if (r.score) d.actScores = { ...(d.actScores || {}), [d.acts.find(a => labelText(a) === labelText(act))]: r.score };
        if (!d.program) d.program = r.program;
        if (Array.isArray(s.trainingPlan) && !s.trainingPlan.some(t => t.k === k)) s.trainingPlan.push(clone(trainingPlan(next).find(t => t.k === k)));
      }
      s.sourceRecords = [...(s.sourceRecords || []), { file: r.file, sheet: r.program, fields: { import_key: r.key, subject_id: r.subject, test_date: r.date, test_time: r.time || '', item: r.item, imported_as: assess ? 'assessment' : 'training' } }];
      s.updated = new Date().toISOString();
      changed.add(s);
      lines.push(`${r.date}${r.time ? ' ' + r.time : ''} · ${name}${r.score ? ' ' + r.score : ''} → ${assess ? ui('評估') : ui('復健訓練')}`);
    }
    for (const s of changed) validateRecord(next, s);
    if (planChanged) { await safe(() => store.saveClient(next), ui('匯入個案失敗')); clients[clients.findIndex(x => x.id === c.id)] = next; }
    for (const s of changed) await safe(() => store.saveSession(c.id, s), ui('匯入紀錄失敗'));
    editing = null; view = 'sessions'; sessionFilter = { visit: '', from: '', to: '' };
    await loadSessions(); renderClients(); renderMain();
    const summary = ui('已匯入 {0} 筆測驗分數。', lines.length);
    modal(ui`<h3>${esc(summary)}</h3><ul>${[...lines, ...warnings].map(w => `<li>${esc(w)}</li>`).join('')}</ul><button class="btn app-primary" id="importReportClose">關閉</button>`).querySelector('#importReportClose').onclick = closeModal;
  } finally { savingSession = false; renderCommands(); }
}
async function importRecords(files) {
  if (files.some(f => /\.(xlsb|xlsx)$/i.test(f.name))) {
    if (files.some(f => !/\.(xlsb|xlsx)$/i.test(f.name))) throw new Error(ui('請分別匯入 Excel、CSV 或 JSON 備份。'));
    const bundles = [], warnings = [];
    for (const file of files) { const parsed = await readAssessmentWorkbook(file); bundles.push(...parsed.bundles); warnings.push(...parsed.warnings); }
    await importSourceBundles(bundles, warnings); return;
  }
  // OcuTrain and peripheral field training score files are recognized by their content.
  const scores = [];
  for (const file of files) scores.push(/\.(csv|json)$/i.test(file.name) ? scoreFormat(file.name, await file.text()) : null);
  if (scores.some(Boolean)) {
    if (scores.some(x => !x)) throw new Error(ui('測驗分數檔請與 EzEMR 的 CSV 或 JSON 備份分開匯入。'));
    await importScoreFiles(files.map((file, i) => ({ file, ...scores[i] }))); return;
  }
  if (files.length === 1 && files[0].name.toLowerCase().endsWith('.json')) { await importAll(files[0]); return; }
  if (files.some(f => !f.name.toLowerCase().endsWith('.csv'))) throw new Error(ui('請選擇多份 CSV，或單一 JSON 備份。'));
  const records = [];
  for (const file of files) {
    try {
      const text = await file.text();
      if (text.replace(/^\ufeff/, '').startsWith(CLIENT_COLUMNS.join(','))) records.push(...readClientsCSV(text).map(row => ({ client: row.client })));
      else records.push(readRecordCSV(text));
    }
    catch (e) { throw new Error(`${file.name}: ${e.message}`); }
  }
  const updated = new Map(clients.map(c => [c.id, c]));
  for (const record of records) {
    const c = record.client;
    if ([...updated.values()].some(other => other.id !== c.id && safeName(other.ref || other.name).toLocaleLowerCase() === safeName(c.ref || c.name).toLocaleLowerCase())) throw new Error(ui`病歷號「${c.ref || c.name}」已屬於其他個案，未匯入。`);
    if (!updated.has(c.id)) updated.set(c.id, c);
  }
  const imported = new Set();
  for (const { client: c, session: s } of records) {
    if (!imported.has(c.id)) { await safe(() => store.saveClient(updated.get(c.id)), ui('匯入個案失敗')); imported.add(c.id); }
    if (s) await safe(() => store.saveSession(c.id, s), ui('匯入紀錄失敗'));
  }
  await loadClients(); curId = records[0]?.client.id || curId;
  sessionFilter = { visit: '', from: '', to: '' }; view = 'sessions';
  await loadSessions(); renderClients(); renderMain(); toast(ui`已匯入 ${records.length} 筆 CSV，${imported.size} 位個案。`);
}
function renderLoadError(error) {
  patientReady = false; renderCommands();
  $('#main').innerHTML = ui`<section class="panel empty" role="alert"><h2>無法讀取病歷</h2><p>${esc(error.message || error)}</p><p>請確認資料夾權限或檔案內容後重新讀取。現有檔案未被修改。</p><button class="btn app-primary" data-action="retry-load">重新讀取資料夾</button></section>`;
}

async function loadClients() {
  clients = (await store.listClients()).map(c => ({ ...c, plan: normalizePlan(c.plan) })).sort((a, b) => a.name.localeCompare(b.name));
}
let sessionLoadVersion = 0;
async function loadSessions() {
  const request = ++sessionLoadVersion, clientId = curId, source = store;
  patientReady = false;
  const loaded = clientId ? await safe(async () => {
    try { return await source.listSessions(clientId); }
    catch (error) {
      if (request !== sessionLoadVersion || clientId !== curId || source !== store) return null;
      throw error;
    }
  }, ui('無法載入復健紀錄')) : [];
  if (request !== sessionLoadVersion || clientId !== curId || source !== store) return false;
  sessions = loaded;
  patientReady = true;
  return true;
}

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-action]'); if (!b) return;
  if (b.disabled) return;
  closeCommandMenu(true);
  const a = b.dataset.action, c = cur();
  try {
  if (savingSession || savingItems) return;
  if (a === 'toggle-theme') {
    const theme = isDark() ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; renderTheme();
    try { localStorage.setItem('ezrehab-theme', theme); } catch (_) { toast(ui('外觀已切換，但此瀏覽器無法記住設定。')); }
    return;
  }
  if (dirty && ['pick-folder', 'change-folder', 'reconnect', 'use-default', 'use-browser', 'reload-storage', 'retry-load', 'pick', 'new-session', 'new-client', 'cancel-edit', 'import-records', 'import-soap-folder'].includes(a)) {
    if (!(await ask(ui('目前的病歷尚未儲存，確定放棄修改嗎？'), ui('放棄修改')))) return;
    dirty = false;
  }
  if (a === 'pick-folder' || a === 'change-folder') { await connectFolder(null); return; }
  if (a === 'reconnect') { await connectFolder(pendingHandle); return; }
  if (a === 'storage-settings') { storageSettings(); return; }
  if (a === 'eye-help') {
    const m = modal(ui`<h3>模式說明</h3><p class="note">此程式不會開啟外部網站。若需要線上說明，請自行複製以下網址。</p><input id="modeDocURL" type="text" readonly aria-label="模式說明網址" value="https://eyedottrainer.com/#modes"><div class="row"><button type="button" class="btn" id="modeCopy">複製網址</button><button type="button" class="btn" id="modeClose">關閉視窗</button></div>`);
    m.querySelector('#modeCopy').onclick = async () => {
      try { await navigator.clipboard.writeText($('#modeDocURL').value); toast(ui('網址已複製')); }
      catch (_) { $('#modeDocURL').focus(); $('#modeDocURL').select(); }
    };
    m.querySelector('#modeClose').onclick = closeModal;
    return;
  }
  if (a === 'global-settings') {
    if (!store) { store = window.showDirectoryPicker ? defaultFolderStore() : localStore(); await finishBoot(); }
    globalSettings(); return;
  }
  if (a === 'use-default') {
    if (!window.showDirectoryPicker) { toast(ui('此瀏覽器無法直接建立資料夾，請使用 Chrome 或 Edge。')); return; }
    closeModal(); copyRoot = null; store = defaultFolderStore(); await finishBoot(); return;
  }
  if (a === 'use-browser') { closeModal(); copyRoot = null; store = localStore(); await finishBoot(); return; }
  if (!store && ['new-client', 'example', 'import-records', 'import-soap-folder'].includes(a) && window.showDirectoryPicker) {
    if (pendingHandle) { await connectFolder(pendingHandle); if (!store) return; }
    else { store = defaultFolderStore(); await finishBoot(); }
  }
  if (!store) { renderConnect(); toast(ui('請先選擇病歷資料夾，或使用瀏覽器模式。')); return; }
  if (a === 'retry-load' || a === 'reload-storage') { await finishBoot(); return; }
  if (a === 'copy-folder') { await copyFolderClick(); return; }
  if (a === 'import-records') { $('#importFile').click(); return; }
  if (a === 'import-soap-folder') { $('#importSOAPFolder').click(); return; }
  if (['act-add', 'ed-add', 'ed-del', 'run-add', 'run-del', 'sym-rec', 'sym-del', 'clinical-link-add', 'clinical-link-del'].includes(a)) dirty = true;
  if (a === 'new-client') clientForm(null);
  else if (a === 'edit-client') clientForm(c);
  else if (a === 'example') await loadExample();
  else if (a === 'pick') {
    curId = b.dataset.id; view = 'dashboard'; dashboardSessionId = null; editing = null; sessionFilter = { visit: '', from: '', to: '' };
    sessions = []; patientReady = false; renderCommands();
    $('#clientSearch').value = ''; closeClientSearch();
    $('#main').innerHTML = ui('<section class="panel loading-state" role="status">正在讀取個案總表與病歷…</section>');
    const clientId = curId, source = store;
    try { if (!await loadSessions()) return; }
    catch (err) { if (curId === clientId && store === source) renderLoadError(err); return; }
    renderClients(); renderMain();
  }
  else if (a === 'clear-filters') { sessionFilter = { visit: '', from: '', to: '' }; renderMain(); }
  else if (a === 'tab') { view = b.dataset.tab; renderMain(); }
  else if (a === 'new-session') {
    if (missingProfileFields(c).length) { clientForm(c); toast(ui('請先補齊必填基本資料。')); return; }
    dirty = false; editing = blankSession(); view = 'edit'; renderMain(); window.scrollTo(0, 0);
  }
  else if (a === 'open-session') {
    editing = clone(sessions.find(s => s.id === b.dataset.id));
    editing.sym = shapeSym(Array.isArray(editing.sym) ? editing.sym : [], editing.visit || 'treatment');
    editing.visit = editing.visit || 'treatment';
    dirty = false; view = 'edit'; renderMain(); window.scrollTo(0, 0);
  }
  else if (a === 'cancel-edit') { dirty = false; editing = null; view = 'sessions'; renderMain(); }
  else if (a === 'clinical-link-add' || a === 'clinical-link-del') {
    editing = collectSession();
    editing.clinicalLinks ||= [];
    if (a === 'clinical-link-add') {
      if (editing.clinicalLinks.length >= 100) { toast(ui('症狀連結最多 100 項。')); return; }
      editing.clinicalLinks.push({ id: uid('cl'), category: 'visual', symptom: '', reasoning: '', peo: [], evidence: [], evidenceNotes: '', interventions: [], interventionNotes: '' });
    } else editing.clinicalLinks.splice(Number(b.dataset.index), 1);
    renderClinicalLinks(editing);
    if (a === 'clinical-link-add') $('#clinicalLinks [data-clinical-link]:last-child [data-clinical="symptom"]').focus();
    else $('[data-action="clinical-link-add"]').focus();
  }
  else if (a === 'save-session') {
    if (missingProfileFields(c).length) { clientForm(c); toast(ui('請先補齊必填基本資料。')); return; }
    if (!$('#soapForm').reportValidity()) return;
    const s = collectSession(); if (!s.id) s.id = uid('s'); s.updated = new Date().toISOString();
    editing.id = s.id;
    const buttons = [...document.querySelectorAll('[data-action="save-session"]')].map(button => ({ button, label: button.querySelector('[data-label]') || button }));
    buttons.forEach(entry => { entry.text = entry.label.textContent; entry.button.disabled = true; entry.label.textContent = ui('正在儲存…'); });
    savingSession = true; renderCommands();
    try {
      const zip = store.kind === 'folder' ? null : await sessionZIP(c, s, [...sessions.filter(x => x.id !== s.id), s]);
      await safe(() => store.saveSession(curId, s), ui('病歷儲存失敗'));
      if (zip) await saveFile(`${safeName(c.ref || c.name || c.id)}_${sessionBaseName(s)}.zip`, zip);
    } finally { savingSession = false; buttons.forEach(entry => { entry.button.disabled = false; entry.label.textContent = entry.text; }); renderCommands(); }
    const i = sessions.findIndex(x => x.id === s.id); if (i >= 0) sessions[i] = s; else sessions.push(s);
    dirty = false; editing = null; view = 'sessions'; sessionFilter = { visit: '', from: '', to: '' }; renderMain();
    toast(store.kind === 'folder' ? copyLastError || ui('紀錄已存入：') + `${storageName()} / ${store.folderOf(curId)} / ${store.sessionBase(curId, s.id)}` : ui('紀錄已存在此瀏覽器，並已下載內含 CSV 與 PDF 的 ZIP。'));
  }
  else if (a === 'copy-editing') copyText(noteText(c, collectSession()));
  else if (a === 'copy-session') copyText(noteText(c, sessions.find(s => s.id === b.dataset.id)));
  else if (a === 'export-session') { await exportSessionPair(sessions.find(x => x.id === b.dataset.id)); }
  else if (a === 'del-session') {
    const s = sessions.find(x => x.id === b.dataset.id);
    if (!(await ask(ui`確定刪除 ${fmtDate(s.date)} 的復健紀錄嗎？刪除後無法復原。`))) return;
    await safe(() => store.deleteSession(curId, s.id), ui('無法刪除復健紀錄'));
    sessions = sessions.filter(x => x.id !== s.id); renderMain(); toast(ui('復健紀錄已刪除'));
  }
  else if (a === 'act-add') addActivity(b.dataset.k);
  else if (a === 'ed-add') {
    const rows = readEyedot(); const last = rows[rows.length - 1];
    rows.push({ id: uid('e'), mode: 'Circle', speed: last?.speed || 'Medium', dur: last?.dur || '1 minute', dir: 'Clockwise', trail: 'On', dot: last?.dot || 'Medium · 12px', full: 'No', count: null, best: '', notes: '' });
    editing.training.ocular.eyedot = rows; $('#edWrap').innerHTML = eyedotHTML(rows);
    const oc = $('#tx-ocular-on'); if (!oc.checked) { oc.checked = true; oc.dispatchEvent(new Event('change', { bubbles: true })); }
  }
  else if (a === 'run-add') {
    const k = b.dataset.k, runs = readRuns(k), run = { id: uid('r'), item: $('#tx-' + k + '-run-item').value, values: {} };
    rerenderRuns(k, [...runs, run]);
    $(`[data-run="${run.id}"] input`)?.focus();
  }
  else if (a === 'run-del') { const k = b.dataset.k; rerenderRuns(k, readRuns(k).filter(r => r.id !== b.dataset.id)); $('#tx-' + k + '-run-item').focus(); }
  else if (a === 'ed-del') { editing.training.ocular.eyedot = readEyedot().filter(r => r.id !== b.dataset.id); $('#edWrap').innerHTML = eyedotHTML(editing.training.ocular.eyedot); }
  else if (a === 'sym-rec') { editing.sym = readSym(); if (!editing.sym.some(r => r.kind === 'rec')) editing.sym.push({ id: uid('r'), kind: 'rec', scores: {}, recMin: null }); rerenderSym(); }
  else if (a === 'sym-del') { editing.sym = readSym().filter(r => r.id !== b.dataset.id); rerenderSym(); }
  else if (a === 'plan-add') itemForm('assessment', null, b.dataset.editor === 'true');
  else if (a === 'training-add') itemForm('training', null, b.dataset.editor === 'true');
  else if (a === 'item-edit' || a === 'item-copy') itemForm(b.dataset.kind, b.dataset.id, false, a === 'item-copy');
  else if (a === 'item-toggle') {
    const next = preserveLegacyTemplates(clone(c), c), kind = b.dataset.kind, listKey = kind === 'assessment' ? 'plan' : 'trainingPlan';
    next[listKey] = clone(kind === 'assessment' ? c.plan : trainingPlan(c));
    const item = next[listKey].find(item => itemKey(item, kind) === b.dataset.id);
    item.active = item.active === false;
    savingItems = true; b.disabled = true;
    try { await safe(() => store.saveClient(next), ui('項目設定儲存失敗')); } finally { savingItems = false; b.disabled = false; }
    clients[clients.findIndex(client => client.id === c.id)] = next; renderMain(); toast(item.active ? ui('項目已啟用。') : ui('項目已停用，歷史結果仍保留。'));
  }
  else if (a === 'export-all') await exportAll();
  else if (a === 'export-roster') {
    const list = await store.listClients();
    const csv = clientsCSV(list.map(client => ({ client, folder: (store.kind === 'folder' && store.folderOf(client.id)) || safeName(client.ref || client.name || client.id) })));
    await saveFile('clients.csv', csv);
  }
  else if (a === 'xlsx-client') await exportExcel(false);
  else if (a === 'xlsx-session') await exportSessionForm(b.dataset.id);
  else if (a === 'xlsx-all') await exportExcel(true);
  } catch (error) { if (!error.reported) toast(error.message || String(error)); }
});
$('#clientSearch').addEventListener('input', renderClients);
$('#clientSearch').addEventListener('focus', renderClients);
$('#clientSearch').addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') e.preventDefault(); closeClientSearch(); return; }
  if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return;
  if ($('#clientSearchPopup').hidden) {
    if (e.key === 'Enter') return;
    renderClients();
  }
  const options = [...$('#clientList').querySelectorAll('.client-btn')];
  if (!options.length) return;
  e.preventDefault();
  if (e.key === 'Enter') { options[clientSearchIndex]?.click(); return; }
  clientSearchIndex = e.key === 'ArrowDown' ? (clientSearchIndex + 1) % options.length : (clientSearchIndex < 0 ? options.length - 1 : (clientSearchIndex - 1 + options.length) % options.length);
  options.forEach((option, index) => option.setAttribute('aria-selected', String(index === clientSearchIndex)));
  $('#clientSearch').setAttribute('aria-activedescendant', options[clientSearchIndex].id);
  options[clientSearchIndex].scrollIntoView({ block: 'nearest' });
});
document.addEventListener('pointerdown', e => { if (!$('#patientSearch').contains(e.target)) closeClientSearch(); });
document.addEventListener('focusin', e => { if (!$('#patientSearch').contains(e.target)) closeClientSearch(); });
$('#importFile').addEventListener('change', async e => {
  const files = [...e.target.files]; e.target.value = ''; if (!files.length) return;
  try { await importRecords(files); } catch (error) { if (!error.reported) toast(ui('匯入失敗：') + (error.message || error)); }
});
$('#importSOAPFolder').addEventListener('change', async e => {
  const files = [...e.target.files]; e.target.value = ''; if (!files.length) return;
  try { const parsed = await readSOAPFolder(files); await importSourceBundles(parsed.bundles, parsed.warnings); }
  catch (error) { if (!error.reported) toast(ui('匯入失敗：') + (error.message || error)); }
});
window.addEventListener('beforeunload', e => { if (dirty || savingSession || savingItems) { e.preventDefault(); e.returnValue = ''; } });

function renderStorageStatus() {
  const st = $('#storeStatus');
  $('#integratedDataNotice').hidden = store.kind !== 'local' || !$('#integratedRecords');
  $('#integratedDataConnect').hidden = !window.showDirectoryPicker;
  $('#changeFolder').hidden = !window.showDirectoryPicker;
  $('#reloadStorage').hidden = store.kind !== 'folder' || store.root.deferred;
  $('#copyBtn').hidden = store.kind !== 'folder' || store.root.deferred;
  if (store.kind === 'folder') {
    st.textContent = ui('病歷資料夾 · ') + storageName();
    st.className = 'status cloud'; st.title = ui('clients.csv 個案總表；每位個案的復健紀錄以 CSV 與 PDF 儲存。');
  } else {
    st.textContent = $('#integratedRecords') ? ui('病歷副本 · 尚未連接資料夾') : ui('瀏覽器暫存 · 儲存時下載 ZIP'); st.className = 'status local'; st.title = ui('清除瀏覽器資料會移除暫存紀錄，請保留下載檔。');
  }
}
async function finishBoot() {
  closeCommandMenu();
  renderStorageStatus();
  if (store.kind === 'folder') { await loadCopyHandle(); renderCopyBtn(); }
  dirty = false;
  clients = []; sessions = []; curId = null;
  closeClientSearch();
  renderCommands();
  $('#main').innerHTML = ui('<section class="panel loading-state" role="status">正在讀取個案總表與病歷…</section>');
  $('#clientList').textContent = ui('正在讀取個案…');
  try {
  appSettings = clone(DEFAULT_APP_SETTINGS);
  appSettings = await store.getSettings();
  if (store.kind === 'folder' && !store.root.deferred) await moveBrowserRecords();
  await loadClients();
  curId = clients[0]?.id || null; view = 'dashboard'; dashboardSessionId = null; editing = null;
  await loadSessions();
  renderClients(); renderMain();
  } catch (error) { renderLoadError(error); }
  document.documentElement.dataset.ready = 'true';
}
(async function boot() {
  $('#main').innerHTML = ui('<section class="panel loading-state" role="status">正在載入病歷…</section>');
  try {
    await metroReady;
    store = await initStore();
    if (!store) { renderConnect(); document.documentElement.dataset.ready = 'true'; return; }
    await finishBoot();
  } catch (error) { renderLoadError(error); document.documentElement.dataset.ready = 'true'; }
})();
