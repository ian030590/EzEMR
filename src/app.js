// The styling fork is export-only; imports must use the patched reader.
if (window.XLSX) XLSX.read = XLSX.readFile = XLSX.readFileSync = () => { throw new Error(ui('Excel 匯入請使用內嵌的新版讀取元件。')); };
let language = 'zh-TW';
try { if (localStorage.getItem('ezrehab-language') === 'en') language = 'en'; } catch (_) {}
const UI_EN = {
  "說明": "Help",
  "快速上手": "Quick start",
  "鍵盤快速鍵": "Keyboard shortcuts",
  "開始記錄病歷": "Start keeping records",
  "病歷保存在這台電腦的資料夾中，不會透過網路傳送。": "Records stay in a folder on this computer and are never sent over the internet.",
  "選擇要存放病歷的資料夾。": "Choose where to keep your records.",
  "瀏覽器詢問時，允許編輯資料夾。": "Allow editing when the browser asks.",
  "新增個案，開始填寫紀錄。": "Add a client and start a record.",
  "我已經有病歷資料夾": "I already have a record folder",
  "選擇原有資料夾，繼續使用裡面的個案與紀錄。": "Choose your existing folder to continue with its clients and records.",
  "第一次使用，幫我建立": "First time: help me set up",
  "新增個案並儲存時，再選擇要建立病歷資料夾的位置。": "When you save your first client, choose where to create the record folder.",
  "每次開啟都要先連接病歷資料夾，才能讀取和儲存病歷。": "Connect your record folder each time you open the app to read and save records.",
  "換電腦時，先備份全部資料，將備份與程式複製到另一台電腦，再匯入還原。": "To move to another computer, back up all data, copy the backup and the app to that computer, then import the backup to restore it.",
  "檔案存在哪裡（進階）": "Where files are kept (advanced)",
  "這個瀏覽器無法直接存入資料夾，每次儲存會下載一份檔案，請自行保存；建議在桌上型或筆記型電腦使用 Chrome 或 Edge。": "This browser cannot save straight to a folder, so each save downloads a file for you to keep; we recommend Chrome or Edge on a desktop or laptop computer.",
  "將這筆紀錄與可列印的副本儲存至個案資料夾（CSV、PDF、TXT）。": "Save this record and a printable copy in the client's folder (CSV, PDF, TXT).",
  "將這筆紀錄留在此瀏覽器，並下載一份含可列印副本的檔案，請自行保存（ZIP，內含 CSV、PDF）。": "Keep this record in this browser and download a file with a printable copy for you to keep (ZIP containing CSV and PDF).",
  "快速鍵：Ctrl+S／⌘S": "Shortcut: Ctrl+S / Cmd+S",
  "查看或更換病歷存放的資料夾。": "View or change the folder where records are kept.",
  "重新載入資料夾內的個案與病歷，讀取你在程式外做的修改。": "Read the clients and records in the folder again, including changes made outside the app.",
  "匯出個案名單": "Export client list",
  "下載個案名單（CSV），不含每次病歷。": "Download the client list (CSV), without visit records.",
  "備份全部資料": "Back up all data",
  "備份全部資料（加上密碼）": "Back up all data (with a password)",
  "下載所有已儲存的個案、病歷與欄位設定，供日後還原（JSON）。": "Download all saved clients, records and field settings to restore later (JSON).",
  "下載需密碼才能還原的完整備份（加密 JSON）。請另存密碼。": "Download a full backup that needs a password to restore (encrypted JSON). Keep the password separately.",
  "設定同步副本資料夾": "Set up a synced copy folder",
  "同步副本資料夾": "Synced copy folder",
  "同步副本：": "Synced copy: ",
  "重新連接同步副本資料夾": "Reconnect synced copy folder",
  "選擇同步副本資料夾": "Choose a synced copy folder",
  "副本會跟著主資料夾更新，包含刪除，不能用來保留過去版本；請另做備份。": "This second copy follows changes in the main folder, including deletions. Make separate backups to keep past versions.",
  "已將病歷與可列印副本存入「{0}」（CSV、PDF、TXT）。": "Saved the record and printable copies in {0} (CSV, PDF, TXT).",
  "已開始下載病歷與可列印副本，請在下載位置確認並保存（ZIP，內含 CSV、PDF）。": "Started downloading the record and a printable copy. Check your download location and keep the file (ZIP containing CSV and PDF).",
  "已將 Excel 儲存至「{0}」：{1}": "Saved the Excel file in {0}: {1}",
  "已開始下載 Excel，請在下載位置確認並保存。": "Started downloading the Excel file. Check your download location and keep it.",
  "已開始下載個案名單，請在下載位置確認並保存（CSV）。": "Started downloading the client list. Check your download location and keep it (CSV).",
  "已開始下載完整備份，請在下載位置確認並保存（JSON）。": "Started downloading a full backup. Check your download location and keep it (JSON).",
  "已開始下載密碼保護的完整備份，請在下載位置確認並保存（加密 JSON）。": "Started downloading a password-protected full backup. Check your download location and keep it (encrypted JSON).",
  "從「檔案」連接病歷資料夾，並在瀏覽器詢問時允許編輯。": "Connect a record folder from File and allow editing when the browser asks.",
  "按「新增個案」，填寫姓名與病歷號，再儲存個案。": "Choose New client, enter the name and medical record number, then save the client.",
  "在個案畫面按「新增紀錄」，填寫日期與本次情況。": "Choose New record on the client's page, then enter the date and visit details.",
  "勾選本次評估或復健項目，在開啟的視窗填寫，按「完成填寫」或「完成」。": "Select an assessment or rehabilitation item, fill in the dialog, then choose Done.",
  "按「儲存」保存這筆病歷；若瀏覽器下載檔案，請確認並保存。": "Choose Save to keep the record. If your browser downloads a file, check and keep it.",
  "下次在上方搜尋姓名或病歷號；點入空白搜尋可選「最近開啟」的個案。": "Later, search by name or medical record number at the top. Focus the empty search to choose a recently opened client.",
  "先儲存病歷，再從「匯出」選「備份全部資料」，並保存下載的備份。": "Save your record, then choose Export > Back up all data and keep the downloaded backup.",
  "Ctrl／⌘+S：儲存正在填寫的紀錄。": "Ctrl / Cmd+S: Save the record you are writing.",
  "Ctrl／⌘+O：選擇並開啟病歷資料夾。": "Ctrl / Cmd+O: Choose and open a record folder.",
  "搜尋個案時，用上下方向鍵選取，Enter 開啟，Escape 關閉搜尋結果。": "In client search, use the up and down arrows to select, Enter to open, and Escape to close the results.",
  "Escape 可關閉對話框；若正在查看 ? 說明，會先隱藏說明。": "Escape closes dialogs. If a ? tooltip is showing, it hides that tooltip first.",
  "尚未備份": "No backup yet",
  "上次備份：{0} 天前（{1}）": "Last backup: {0} days ago ({1})",
  "上次備份：1 天前（{0}）": "Last backup: 1 day ago ({0})",
  "僅記錄從此瀏覽器開始下載備份的時間，請自行確認檔案已保存。": "This records only when a backup download was started from this browser. Check that you kept the file.",
  "此瀏覽器尚未製作備份，可另存一份完整備份。": "No backup has been made from this browser yet. You can keep a full backup.",
  "此瀏覽器已超過 14 天沒有製作備份，可另存一份完整備份。": "It has been over 14 days since a backup was made from this browser. You can keep a full backup.",
  "7 天後再提醒": "Remind me in 7 days",
  "完成": "Done",
  "視野": "Visual field",
  "從既有模板開始，或建立空白項目。停用項目仍保留歷史結果；新增個案時可複用這份設定。": "Start from an existing template or create a blank item. Disabling an item keeps historical results. New clients can reuse these settings.",
  "說明：{0}": "Help: {0}",
  "先前紀錄的項目": "Items from previous records",
  "本次已施測": "Assessed this visit",
  "此復健項目已連結下列問題，請在問題內解除連結。": "This rehabilitation item is linked to these problems. Remove the links in the problems first.",
  "尚未填寫結果，可選擇「編輯」補填。": "No results recorded. Choose Edit to fill them in.",
  "請核對標示的欄位後再完成復健紀錄。": "Check the indicated fields before completing the rehabilitation item.",
  "找到上次沒有儲存的紀錄": "Found an unsaved record from last time",
  "繼續填寫": "Continue writing",
  "不需要，捨棄": "Discard this copy",
  "自動暫存時間：{0}": "Safety copy kept: {0}",
  "這份暫存只在此裝置的瀏覽器中，尚未儲存為病歷。": "This safety copy is only in this browser on this device. It has not been saved as a record.",
  "原本的病歷後來有更新。繼續填寫會開啟這份暫存，請先核對內容，再決定是否儲存。": "The saved record has changed since this copy was started. Continue writing opens the safety copy. Check its contents before saving.",
  "已自動暫存 {0}": "Safety copy kept at {0}",
  "無法自動暫存，請定期儲存。": "Automatic safekeeping is unavailable. Please save regularly.",
  "最近開啟": "Recently opened",
  "操作未完成": "The action did not finish",
  "技術細節": "Technical details",
  "關閉錯誤訊息": "Dismiss error message",
  "請重新連接病歷資料夾，並允許編輯，再試一次。": "Reconnect the record folder and allow editing, then try again.",
  "資料夾或檔案可能已移動、改名或刪除。請重新連接或選擇病歷資料夾。": "The folder or file may have been moved, renamed or deleted. Reconnect or choose the record folder again.",
  "檔案可能正由 Excel 或其他程式開啟。請關閉該檔案，再儲存一次。": "The file may be open in Excel or another program. Close that file, then save again.",
  "裝置或瀏覽器的儲存空間已滿。請先騰出空間，再試一次。": "The device or browser storage is full. Free some space, then try again.",
  "請再試一次；若仍未成功，請保留此視窗，並備份資料。": "Try again. If it still fails, keep this window open and make a backup.",
  "你填寫的內容仍在畫面上，沒有遺失。": "What you typed is still on screen and has not been lost.",
  "重新連接病歷資料夾": "Reconnect record folder",
  "副本資料夾未更新": "The copy folder was not updated",
  "無法複製資料夾": "The folder could not be copied",
  "無法開啟資料夾": "The folder could not be opened",
  "無法儲存設定": "Settings could not be saved",
  "無法儲存項目": "The item could not be saved",
  "結果尚未更新": "The results have not been updated",
  "無法更新量測欄位": "The measurement fields could not be updated",
  "無法解鎖備份": "The backup could not be unlocked",
  "匯入失敗": "Import failed",
  "無法儲存 Excel": "Excel could not be saved",
  "無法儲存 Excel 表單": "The Excel form could not be saved",
  "無法匯出資料": "The data could not be exported",
  "無法建立備份": "The backup could not be created",
  "編輯結果": "Edit results",
  "完成填寫": "Done",
  "表現變化": "Performance change",
  "滿意度變化": "Satisfaction change",
  "編輯 {0} 的結果": "Edit results for {0}",
  "尚未填寫結果，可選擇「編輯結果」補填。": "No results entered. Choose Edit results to add them.",
  "勾選後在視窗填寫，完成後顯示文字結果。取消勾選會保留結果，並排除本次報告。": "Select an assessment to enter results in a dialog. Completed results appear below as text. Deselecting retains results and excludes them from this visit's report.",
  "已取消本次施測；既有結果保留，但不列入報告。": "Assessment excluded from this visit's report; existing results are retained.",
  "請核對標示的欄位後再完成填寫。": "Check the indicated fields before completing the assessment.",
  "結果尚未更新：{0}": "Results have not been updated: {0}",
  "此指標將在完成填寫後加入本次紀錄及此個案的後續模板，既有病歷不變。": "After you complete this assessment, this measure will be added to this record and the client's template for future visits. Existing records are kept.",
  "病歷填寫導覽": "Record navigation",
  "訪談與目標": "Interview and goals",
  "施測前": "Before testing",
  "相關活動": "Related activities",
  "施測後": "After testing",
  "反應與恢復": "Response and recovery",
  "判斷與計畫": "Reasoning and plan",
  "本次已選項目": "Selected assessments",
  "選擇定位項目": "Choose an assessment to navigate",
  "回到剛才填寫處": "Return to previous entry",
  "尚未修改": "No changes",
  "未儲存變更": "Unsaved changes",
  "收合欄位": "Collapse fields",
  "展開欄位": "Expand fields",
  "清除結果": "Clear results",
  "清除 {0} 的本次結果與備註？項目設定與其他病歷不變。": "Clear results and notes for {0} in this record? Item settings and other records are kept.",
  "此結果正被其他項目引用，請先取消引用。": "Another assessment references this result. Remove that reference first.",
  "此測驗正被活動表現引用，請先改為自行填寫或選擇另一筆來源。": "An activity references this test. Switch to manual entry or choose another source before removing it.",
  "{0}的表現來源": "Result source for {0}",
  "已取消本次施測；既有結果保留，但不列入報告。收合欄位請使用「收合欄位」。": "Excluded from this visit's report; existing results are retained. Use Collapse fields to hide fields without excluding results.",
  "已取消本次活動；原有表現保留，可再次勾選查看。": "Activity excluded for this visit; its previous performance is retained and can be shown by selecting it again.",
  "勾選表示本次施測。收合不影響結果；取消勾選保留既有結果並排除報告。": "Select assessments performed this visit. Collapsing preserves results; deselecting retains existing results and excludes them from reports.",
  "勾選本次活動，逐項記錄表現與單位；例如 85%、12 次或 40 秒。": "Select activities performed this visit and record performance with units, such as 85%, 12 repetitions or 40 seconds.",
  "難度自評使用 0 至 10；請與個案確認一致的端點定義。耐受度另填。": "Rate difficulty from 0 to 10 using endpoints agreed with the client. Record tolerance separately.",
  "儲存 CSV、PDF 與 TXT": "Save CSV, PDF and TXT",
  "CSV、PDF 與 TXT": "CSV, PDF and TXT",
  "CSV、PDF 與 TXT 已儲存至個案資料夾。": "CSV, PDF and TXT saved to the client folder.",
  "clients.csv 個案總表；每位個案的復健紀錄以 CSV、PDF 與 TXT 儲存。": "clients.csv client roster; each client's rehabilitation records are saved as CSV, PDF and TXT.",
  "儲存 CSV、PDF 與 TXT（Ctrl+S／⌘S）": "Save CSV, PDF and TXT (Ctrl+S / Cmd+S)",
  "沿用主訴建立問題": "Create a problem from the subjective note",
  "改為自行填寫問題": "Enter the problem manually",
  "先填寫主觀描述，再建立問題連結。": "Enter the subjective note before creating a problem link.",
  "問題由主觀描述建立；後續推理與處置在此填寫，不需另抄到整體補充。": "Problem created from the subjective note. Record its reasoning and intervention here; general notes do not need a duplicate.",
  "查看完整評估依據": "Show full assessment evidence",
  "前往相關問題": "Go to linked problem",
  "此策略已連結下列問題，請在問題內解除連結。": "This strategy is linked to the following problems. Remove the link in the problem.",
  "缺席不記錄實際治療時間與服務型態；切回出席仍保留原草稿。": "Absences do not report treatment time or service mode; the draft is retained when switching back to an attended visit.",
  "其他基本資料（選填）": "Other profile details (optional)",
  "勾選的欄位為所有病人的必填資料；其他欄位可在個案表單選填，既有內容會保留。": "Checked fields are required for every patient. Other fields remain optional in the client form, and existing values are retained.",
  "此列已有日期或備註，請填寫手術名稱，或移除此列。": "This row has a date or notes. Enter the surgery name or remove the row.",
  "之後也要追蹤（加入此個案模板）": "Track in future records too (add to this client's template)",
  "此指標將加入本次紀錄及此個案的後續模板，既有病歷不變。": "This measure will be added to this record and this client's template for future records. Existing records stay unchanged.",
  "此歷史項目不在目前模板；如需持續追蹤，請先在項目設定建立。": "This historical item is not in the current template. Create it in Item settings before tracking it in future records.",
  "沿用前次問題、目標與條件": "Reuse previous problems, goals and conditions",
  "沿用來源：{0}，請重新核對本次適用性。": "Reused from {0}. Confirm it applies to this visit.",
  "逐項選擇仍適用的內容，只補入本次空白欄位；不沿用量測分數、症狀、已執行勾選或實際治療時間。": "Select the content that still applies. Only blank fields are filled; measurements, symptom scores, completion selections and actual treatment durations are not copied.",
  "前次問題": "Previous problems",
  "前次環境條件": "Previous environmental conditions",
  "前次作業需求與目標": "Previous occupational needs and goals",
  "前次後續計畫（本次須重新確認）": "Previous follow-up plan (review for this visit)",
  "前次居家安排（本次須重新確認）": "Previous home programme (review for this visit)",
  "評估條件：{0}": "Assessment conditions: {0}",
  "活動工具與設定：{0}": "Training tools and settings: {0}",
  "沒有可沿用的問題或條件。": "There are no problems or conditions to reuse.",
  "請先選擇要沿用的內容。": "Select the content to reuse.",
  "加入本次草稿": "Add to current draft",
  "沿用內容來源格式錯誤": "Invalid reused-context source",
  "已評 {0}/5": "Rated {0}/5",
  "評分項目不同，未計算合計差異。": "Rated symptoms differ; total change was not calculated.",
  "症狀合計：{0} → {1}；評分項目不同，未計算差異。": "Symptom total: {0} → {1}; rated symptoms differ, so change was not calculated.",
  "基準活動": "Baseline activity",
  "本次活動": "Current activity",
  "基準日期": "Baseline date",
  "已評表現 {0} 項，滿意度 {1} 項": "Performance rated: {0}; satisfaction rated: {1}",
  "活動或評分項目不一致，未計算基準差異。": "Activities or rated items differ; baseline change was not calculated.",
  "尚無可比較的基準評估。": "No comparable baseline assessment is available.",
  "基準／本次活動核對": "Compare baseline and current activities",
  "{0}：總漏答 {1} 與左右合計 {2} 不一致，請核對計分規則。": "{0}: total omissions ({1}) differ from left plus right ({2}). Check the scoring rules.",
  "缺席原因為未通知，通知狀態不能填已通知。": "The absence reason says no notice was given; notification cannot be marked as received.",
  "核對提醒": "Review reminder",
  "結果來源": "Result source",
  "自行填寫（保留目前數值）": "Manual entry (keep current values)",
  "引用本次短期量測": "Use a short-term measurement from this record",
  "僅引用對應結果欄位；其他欄位仍可自行填寫。": "Only matching result fields are linked; other fields remain editable.",
  "請先勾選並填寫本次對應的短期評估。": "Select and complete the corresponding short-term assessment first.",
  "來源已移除或本次未施測": "Source removed or not assessed this visit",
  "引用：{0}／{1}": "Source: {0} / {1}",
  "引用的量測來源無法使用，請重新選擇來源或改為自行填寫。": "The linked measurement is unavailable. Choose a source or switch to manual entry.",
  "量測引用格式錯誤": "Invalid measurement reference",
  "已確認來源閱讀速度使用字／分": "I confirmed the source reading speed uses characters/min",
  "引用閱讀速度前，請確認來源使用字／分；words/min 請使用相同單位的自訂指標。": "Before linking reading speed, confirm the source uses characters/min; use a matching custom measure for words/min.",
  "活動表現來源": "Activity result source",
  "自行填寫": "Manual entry",
  "測驗紀錄 {0}：{1}{2}": "Test run {0}: {1}{2}",
  "引用測驗紀錄 {0}": "Linked test run {0}",
  "開啟來源測驗": "Open source test run",
  "此活動的來源測驗已移除，請重新選擇或改為自行填寫。": "This activity's source run was removed. Choose a source or switch to manual entry.",
  "短期成效": "Short-term outcomes",
  "長期評估": "Long-term assessments",
  "短期指標": "Short-term measures",
  "長期指標": "Long-term measures",
  "指標期程": "Outcome period",
  "功能分類": "Function category",
  "動作功能": "Motor function",
  "日常生活功能": "Daily living function",
  "認知功能": "Cognitive function",
  "新增短期指標": "Add short-term measure",
  "新增長期評估": "Add long-term assessment",
  "尚未設定短期指標。": "No short-term measures configured.",
  "尚未設定長期評估。": "No long-term assessments configured.",
  "功能分類或指標期程格式錯誤。": "Invalid function category or outcome period.",
  "新增方案": "Add plan",
  "請分別勾選跳視訓練與凝視訓練。": "Select saccade training and fixation training separately.",
  "新增欄位": "Add field",
  "新增恢復後評分": "Add recovery rating",
  "新增手術紀錄": "Add surgery record",
  "輸入方案名稱": "Enter plan name",
  "新增{0}方案": "Add {0} plan",
  "方案名稱最多 200 字。": "Plan names can contain up to 200 characters.",
  "自訂方案最多 100 項。": "A record can contain up to 100 custom plans.",
  "自訂介入方案格式錯誤": "Invalid custom intervention plan",
  "整體補充（選填）": "General notes (optional)",
  "各症狀已於上方分別記錄；此處補充跨症狀的資訊。": "Each symptom is recorded above. Add information shared across symptoms here.",
  "本次反應": "Session response",
  "症狀合計：{0} → {1}（變化 {2}）": "Symptom total: {0} → {1} (change {2})",
  "尚未填寫症狀評分；可回到評估區填寫。": "Symptoms have not been rated. Enter ratings in the assessment section.",
  "編輯症狀評分": "Edit symptom ratings",
  "整體耐受度為選填自評，與短期成效中的症狀自評分開記錄，不互相換算。": "Overall tolerance is an optional self-rating, recorded separately from symptom self-ratings in short-term outcomes without conversion.",
  "變更服務型態": "Change service mode",
  "尚未指定服務型態，以下列出兩種型態的處置。": "Service mode is not specified; interventions for both modes are shown below.",
  "症狀推理摘要": "Symptom reasoning summary",
  "症狀處置摘要": "Symptom intervention summary",
  "編輯症狀連結 {0}": "Edit symptom link {0}",
  "此處置已連結症狀，請先在症狀連結中移除。": "This intervention is linked to a symptom. Remove it from the symptom link first.",
  "儲存紀錄": "Save record",
  "匯入資料": "Import data",
  "本次量測": "Current measurements",
  "評估依據": "Assessment evidence",
  "相關面向：": "Related domains: ",
  "新增指標": "Add measure",
  "為 {0} 新增指標": "Add measure to {0}",
  "指標名稱": "Measure name",
  "此指標只加入本次紀錄；其他病歷與項目設定不變。": "This measure is added to this record only; other records and item settings stay unchanged.",
  "請填寫指標名稱。": "Enter a measure name.",
  "功能表現": "Functional performance",
  "評估分類必須為視覺功能或功能表現。": "Assessment category must be visual function or functional performance.",
  "測量時點": "Measurement stage",
  "測驗條件與備註": "Test conditions and notes",
  "視覺相關症狀自評（選填）": "Vision-related symptom self-ratings (optional)",
  "可左右捲動查看更多指標與測量時間。": "Scroll horizontally for more measures and measurement times.",
  "症狀與耐受性": "Symptoms and tolerability",
  "症狀分數為 0–10；屬耐受性結果。": "Symptom scores range from 0–10 and describe tolerability.",
  "短期結果為摘要；完整條件與測量時間請開啟此筆紀錄。": "Short-term results are summarised here. Open this record for full conditions and measurement times.",
  "短期成效指標與施測流程": "Short-term outcomes and measurement workflow",
  "功能成效與耐受性分開記錄。立即成效為訓練後即刻至約 30 分鐘；短期追蹤可納入 24–72 小時。各時點請填實際測量時間，訓練後註明距訓練結束幾分鐘，追蹤註明日期與時間。": "Record functional efficacy and tolerability separately. Immediate outcomes cover the end of training to about 30 minutes; short-term follow-up may include 24–72 hours. Enter the actual measurement time at each stage, minutes since training ended for post-training tests, and date/time for follow-up.",
  "先選一項與訓練目標直接對應的客觀主要指標，再選次要指標及症狀。新個案已包含短期模板；舊個案可按「新增評估項目」，從模板選取。": "Choose one objective primary outcome that matches the training goal, then secondary measures and symptoms. New clients include short-term templates; for existing clients, use Add assessment and choose a template.",
  "訓練前 1 → 訓練前 2（建議使用等值題型，估計波動與練習效應）→ 訓練（記錄內容、時間、難度、休息與不適）→ 訓練後立即 → 恢復期 15–30 分鐘及／或 24–72 小時追蹤。空白表示未測，不當成 0。": "Pre 1 > Pre 2 (recommended: equivalent forms to estimate variability and practice effects) > training (record content, duration, difficulty, breaks and adverse events) > immediate post > recovery at 15–30 minutes and/or follow-up at 24–72 hours. Blank means unmeasured, not zero.",
  "建議主要／次要／耐受性組合": "Suggested primary / secondary / tolerability measures",
  "搜尋：完成時間或漏答數／正確率與左右漏答／眼睛疲勞、頭痛。忽略：刪除測驗漏答數／時間與線段平分偏差／頭痛、暈眩、不適。": "Search: time or omissions / accuracy and left-right omissions / eye fatigue and headache. Neglect: cancellation omissions / time and bisection deviation / headache, dizziness and discomfort.",
  "閱讀：速度／錯誤率與理解／眼睛疲勞。集合：NPC 或 PFV／另一項雙眼視覺指標／眼部不適、頭痛。視覺動作：命中率或時間／反應時間與誤差／疲勞與不適。": "Reading: speed / error rate and comprehension / eye fatigue. Convergence: NPC or PFV / the other binocular measure / eye discomfort and headache. Visual–motor: hit rate or time / reaction time and error / fatigue and discomfort.",
  "搜尋可採 Bells、Star／Letter Cancellation 或固定找物任務；時間、正確率與反應時間可能只是任務表現指標，須完整記錄流程與計分規則，不能當作已標準化量表。": "Search may use Bells, Star/Letter Cancellation or a fixed object-search task. Time, accuracy and reaction time may be task performance measures; document procedures and scoring rather than assuming they are standardised scales.",
  "Barthel Index、FIM、NEI VFQ-25、CBS、MVPT 不宜作單次立即成效主要指標；視力、視野與對比敏感度應依疾病及訓練目標決定。施測方便不代表對單次變化敏感。": "Barthel Index, FIM, NEI VFQ-25, CBS and MVPT are not preferred primary measures of immediate single-session outcomes. Select acuity, visual field and contrast sensitivity according to the disease and training target. Convenience does not establish sensitivity to single-session change.",
  "症狀下降不能單獨證明療效；功能改善與暫時不適可能同時存在。固定負荷症狀誘發量＝負荷後分數－該次負荷前分數。VOMS 是篩檢工具。": "Symptom reduction alone does not prove efficacy; improved function and temporary discomfort may coexist. Fixed-load symptom provocation = score after the load minus score before that load. VOMS is a screening tool.",
  "改善方向依族群、疾病與測試條件而定。研究須查核信效度、MDC、MCID（如有）及授權，不能假設都有單次 MCID；若要推論介入造成改善，宜加入休息、常規治療等合理對照。此整理不是臨床指引或系統性回顧。": "Improvement direction depends on population, disease and test conditions. Research requires checking validity, reliability, MDC, MCID (if available) and licensing; do not assume a single-session MCID exists. Use a reasonable comparison such as rest or usual care to support causal inference. This summary is not a clinical guideline or systematic review.",
  "{0}：{1}": "{0}: {1}",
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
  "姓名／病歷號／診斷": "Name/ID/diagnosis",
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
  "症狀自評（0 至 10）：": "Symptom self-ratings (0 to 10): ",
  "症狀、與前次的變化、日常活動表現": "Symptoms, changes since last visit, and daily activity performance",
  "症狀自評（0 至 10，評估現在的感受）": "Symptom self-ratings (0 to 10, rate how you feel now)",
  "症狀評分（0 至 10）": "Symptom rating (0 to 10)",
  "症狀自評（0 至 10）": "Symptom self-ratings (0 to 10)",
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
  "設定副本資料夾": "Set copy folder",
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
  "開啟病歷資料夾": "Open record folder",
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
  "前後差異": "Pre/post change",
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
  "編輯目前個案": "Edit current client",
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
  "匯入舊版 SOAP 資料夾": "Import legacy SOAP folder",
  "症狀圖表，可左右捲動": "Symptom chart, scroll horizontally",
  "症狀評分表，可左右捲動": "Symptom ratings, scroll horizontally",
  "表格可左右捲動，或聚焦後使用左右方向鍵。": "Scroll the table horizontally, or focus it and use the left and right arrow keys.",
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
  "測驗分數檔請與 EzEMR 的 CSV 或 JSON 備份分開匯入。": "Import test score files separately from EzEMR CSV files and JSON backups.",
  "搜尋病歷文字": "Search record text",
  "主訴、評估、介入或計畫": "Symptoms, assessments, interventions or plans",
  "請調整搜尋文字、類型或日期，或清除篩選以查看所有紀錄。": "Change the search text, type or dates, or clear the filters to see all records.",
  "加密備份全部資料（JSON）": "Back up all data with a password (JSON)",
  "設定備份密碼": "Set a backup password",
  "解鎖備份": "Unlock backup",
  "備份密碼": "Backup password",
  "再次輸入密碼": "Confirm password",
  "請使用至少 12 個字元的密碼，並另行妥善保存。密碼遺失後無法還原這份備份。": "Use at least 12 characters and keep the password separately. This backup cannot be restored if the password is lost.",
  "密碼只用於這份備份，程式不會保存密碼。本機 CSV、PDF、TXT 與一般 JSON 備份仍是未加密檔案。": "The app uses the password only for this backup and does not save it. Local CSV, PDF, TXT and regular JSON backups remain unencrypted.",
  "請輸入建立這份備份時的密碼。": "Enter the password used to create this backup.",
  "密碼至少需要 12 個字元。": "The password must contain at least 12 characters.",
  "兩次輸入的密碼不同。": "The passwords do not match.",
  "請輸入備份密碼。": "Enter the backup password.",
  "加密並下載": "Encrypt and download",
  "解鎖並核對": "Unlock and review",
  "正在加密備份…": "Encrypting backup...",
  "正在解鎖備份…": "Unlocking backup...",
  "已開始下載加密備份，請確認檔案已保存。": "Encrypted backup download started. Check that the file was saved.",
  "此瀏覽器無法加密或解鎖備份，請使用新版桌面 Chrome 或 Edge。": "This browser cannot encrypt or unlock backups. Use a current desktop version of Chrome or Edge.",
  "加密備份格式或版本不受支援。": "Unsupported encrypted backup format or version.",
  "密碼不正確或備份已損壞，請檢查後重試。": "The password is incorrect or the backup is damaged. Check and try again.",
  "備份版本不受支援。": "Unsupported backup version.",
  "備份個案識別碼與現有病歷號不符：{0}": "The backup client ID belongs to a different medical record number: {0}",
  "還原前核對": "Review before restoring",
  "備份檔案": "Backup file",
  "備份內有 {0} 位個案、{1} 筆紀錄。": "Clients in backup: {0}. Records: {1}.",
  "將覆寫 {0} 位現有個案的基本資料及 {1} 筆同識別碼紀錄。": "This will overwrite {0} existing client profiles and {1} records with matching IDs.",
  "備份以外的現有紀錄仍會保留。": "Existing records outside this backup will be retained.",
  "這份備份也會還原基本資料欄位設定。": "This backup will also restore profile field settings.",
  "此備份沒有個案或紀錄。": "This backup has no clients or records.",
  "我已核對並同意覆寫上述資料": "I have reviewed and agree to overwrite the data above",
  "確認還原": "Restore backup",
  "正在還原備份…": "Restoring backup...",
  "資料已變更，請重新匯入備份並核對。": "The data has changed. Import the backup again and review it.",
  "請先儲存或取消目前的病歷編輯，再還原備份。": "Save or cancel the current record edit before restoring a backup.",
  "目前有資料正在處理，請稍後再試。": "Data is being processed. Try again when it finishes."
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
  const inputType = field.type === 'date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value) ? 'text' : field.type || 'text';
  const attributes = `id="${id}" ${appSettings.requiredFields.includes(field.key) ? 'required' : ''} aria-label="${esc(field.label())}"`;
  const control = field.options ? `<select ${attributes}><option value="">${ui('請選擇')}</option>${value && !field.options().some(([key]) => key === value) ? `<option value="${val(value)}" selected>${esc(value)}</option>` : ''}${field.options().map(([key, label]) => `<option value="${key}" ${value === key ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select>`
    : field.type === 'textarea' ? `<textarea ${attributes}>${val(value)}</textarea>` : `<input type="${inputType}" ${attributes} value="${val(value)}">`;
  return `<label class="f" for="${id}">${esc(field.label())}${control}</label>`;
}
function profileIncompleteHTML(c) {
  const missing = missingProfileFields(c);
  return missing.length ? ui`<section class="profile-incomplete" id="profileIncomplete" role="status"><div><strong>基本資料未齊全</strong><span>${esc(ui('尚缺：{0}', missing.map(field => field.label()).join(ui('、'))))}</span></div><button type="button" class="btn small" data-action="edit-client">補齊資料</button></section>` : '';
}
function profileDetailsHTML(c, identity = false) {
  const fields = PROFILE_FIELDS.filter(field => (identity ? ['dob', 'sex'].includes(field.key) : !['name', 'ref', 'dob', 'sex'].includes(field.key)) && String(c[field.key] ?? '').trim());
  return fields.length ? `<dl class="${identity ? 'client-demographics' : 'profile-facts'}">${fields.map(field => {
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
const SHORT_PHASES = { pre: 'Pre 1', pre2: 'Pre 2 (optional)', post: 'Immediate post', recovery: 'Recovery (optional)', followup: '24–72 h follow-up (optional)' };
const shortFields = measures => [
  ...Object.entries(SHORT_PHASES).flatMap(([phase]) => [
    { id: phase + '_context', label: 'Measurement time / equivalent form', type: 'text', phase },
    ...measures.map(field => ({ ...field, id: phase + '_' + field.id, phase }))
  ]),
  ...[{ id: 'protocol', label: 'Tool / procedure / scoring / test conditions', type: 'textarea' },
    { id: 'primary', label: 'Primary outcome (choose one)', type: 'text' },
    { id: 'intervention', label: 'Training / duration / difficulty / breaks / comparison condition', type: 'textarea' }
  ].map(asSetting)
];
const SHORT_TERM_ITEMS = [
  { id: 'st_search', category: 'visual', domain: 'Short-term functional outcomes', name: 'Visual search (short-term)',
    outcome: 'Generally seek less time, more accuracy and fewer omissions/errors. Report time and accuracy together. Keep difficulty fixed and use equivalent stimuli to reduce recall and speed–accuracy trade-offs.',
    measures: [numField('time_s', 'Completion time (s)', { min: 0 }), numField('correct', 'Correct targets (n)', { min: 0, step: 1 }),
      numField('omissions', 'Omissions (n)', { min: 0, step: 1 }), numField('errors', 'Errors (n)', { min: 0, step: 1 }), numField('accuracy', 'Accuracy (%)', { min: 0, max: 100 })] },
  { id: 'st_neglect', category: 'visual', domain: 'Short-term functional outcomes', name: 'Spatial neglect / attention (short-term)',
    outcome: 'Record cancellation omissions, left/right distribution and time. Record signed bisection deviation and its direction; less absolute deviation is generally better. Bisection alone does not describe all neglect.',
    measures: [numField('omissions', 'Omissions (n)', { min: 0, step: 1 }), numField('left', 'Left-side omissions (n)', { min: 0, step: 1 }),
      numField('right', 'Right-side omissions (n)', { min: 0, step: 1 }), numField('time_s', 'Completion time (s)', { min: 0 }), numField('bisection_mm', 'Signed line-bisection deviation (mm)')] },
  { id: 'st_reading', category: 'functional', domain: 'Short-term functional outcomes', name: 'Reading performance (short-term)',
    outcome: 'Use MNREAD or equivalent passages. Specify characters/min or words/min; keep font, size, contrast and lighting constant. Generally seek faster reading with fewer errors; report both.',
    measures: [numField('speed', 'Reading speed (characters/min or words/min)', { min: 0 }), numField('errors', 'Reading errors (n)', { min: 0, step: 1 }),
      numField('error_rate', 'Reading error rate (%)', { min: 0, max: 100 }), numField('comprehension', 'Comprehension (%)', { min: 0, max: 100 })] },
  { id: 'st_npc', category: 'visual', domain: 'Short-term functional outcomes', name: 'Near point of convergence (short-term NPC)',
    outcome: 'Record repeated NPC trials and their mean with symptoms. A shorter distance is generally better for convergence goals; use a consistent target and procedure.',
    measures: [{ id: 'trials', label: 'Repeated trials / procedure', type: 'text' }, numField('break_cm', 'Mean NPC break (cm)', { min: 0 }), numField('recovery_cm', 'Mean NPC recovery (cm)', { min: 0 })] },
  { id: 'st_pfv', category: 'visual', domain: 'Short-term functional outcomes', name: 'Positive fusional vergence (short-term PFV)',
    outcome: 'Keep test distance and blur, break and recovery criteria consistent. Greater PFV may be better when it matches the training goal; monitor symptoms separately.',
    measures: [numField('blur', 'PFV blur (Δ)', { min: 0 }), numField('break', 'PFV break (Δ)', { min: 0 }), numField('recovery', 'PFV recovery (Δ)', { min: 0 })] },
  { id: 'st_coordination', category: 'functional', domain: 'Short-term functional outcomes', name: 'Visual–motor coordination (short-term)',
    outcome: 'Use the same relevant pointing or eye–hand task. Generally seek shorter time, fewer errors and more hits; control familiarisation and device latency.',
    measures: [numField('time_s', 'Completion time (s)', { min: 0 }), numField('rt_ms', 'Reaction time (ms)', { min: 0 }),
      numField('hit_rate', 'Hit rate (%)', { min: 0, max: 100 }), numField('error', 'Task error (specify unit)', { min: 0 })] },
  { id: 'st_gaze', category: 'visual', domain: 'Short-term functional outcomes', name: 'Fixation / saccade control (short-term)',
    outcome: 'Eye-tracker measures require suitable equipment and need not be the first outpatient choice. Record parameter definitions and units; improvement depends on the chosen parameter.',
    measures: [{ id: 'stability', label: 'Fixation stability (specify parameter / unit)', type: 'text' }, numField('latency_ms', 'Saccade latency (ms)', { min: 0 }),
      { id: 'precision', label: 'Saccade precision (specify parameter / unit)', type: 'text' }] },
  ...[
    ['st_tug', 'Timed Up and Go (short-term TUG)', 'Generally seek a shorter completion time; keep chair, walking aid, assistance and procedure consistent.', [numField('time_s', 'Completion time (s)', { min: 0 })]],
    ['st_10mwt', '10-Meter Walk Test (short-term 10MWT)', 'Generally seek faster walking speed. Keep pace instructions, timed distance, walking aid and assistance consistent.', [numField('speed_ms', 'Walking speed (m/s)', { min: 0 })]],
    ['st_bbt', 'Box and Block Test (short-term BBT)', 'Record blocks transferred in 60 seconds and the tested hand. More blocks is generally better; keep the protocol consistent.', [numField('blocks', 'Blocks transferred in 60 s (n)', { min: 0, step: 1 }), { id: 'hand', label: 'Tested hand', type: 'text' }]],
    ['st_9hpt', 'Nine-Hole Peg Test (short-term 9HPT)', 'Record completion time and the tested hand. A shorter time is generally better; keep the protocol consistent.', [numField('time_s', 'Completion time (s)', { min: 0 }), { id: 'hand', label: 'Tested hand', type: 'text' }]],
    ['st_cop', 'Postural control (short-term COP)', 'Requires measurement equipment. Define the task, device, units and parameter; improvement direction depends on the task.', [numField('distance', 'COP sway distance (specify unit)', { min: 0 }), numField('velocity', 'COP sway velocity (specify unit)', { min: 0 })]]
  ].map(([id, name, outcome, measures]) => ({ id, name, outcome, measures, category: 'functional', domain: 'Short-term functional outcomes' })),
  { id: 'st_tolerance', category: 'visual', domain: 'Short-term tolerability / safety', name: 'Symptoms / recovery (short-term tolerability)',
    outcome: 'Rate each current symptom from 0–10 for tolerability/safety, separately from functional efficacy. Symptoms can rise while function improves. Record baseline symptoms, adverse events and recovery to a predefined baseline range; VOMS is screening, not a validated single-session efficacy test.',
    measures: ['Eye fatigue', 'Headache', 'Eye soreness', 'Dizziness', 'Nausea', 'Pain'].map((label, i) => numField('symptom_' + i, label, { min: 0, max: 10 })),
    extra: [{ id: 'baseline_range', label: 'Predefined symptom baseline range', type: 'text' }, numField('recovery_min', 'Time to baseline range (min)', { min: 0 }), { id: 'events', label: 'Adverse events / symptom context', type: 'textarea' }] },
  { id: 'st_load', category: 'visual', domain: 'Short-term tolerability / safety', name: 'Fixed-load symptom provocation (short-term tolerability)',
    outcome: 'Provocation = symptom score after a fixed load minus score before that load. Specify the symptom and identical load. A smaller increase alone does not prove efficacy; consider baseline, ceiling, natural recovery and retesting.',
    measures: [numField('before_load', 'Symptom before fixed load (0–10)', { min: 0, max: 10 }), numField('after_load', 'Symptom after fixed load (0–10)', { min: 0, max: 10 })],
    extra: [{ id: 'symptom', label: 'Symptom and fixed-load protocol', type: 'textarea' }] }
].map(({ measures, extra = [], ...item }) => ({ ...item, timing: 'session', fields: [...shortFields(measures), ...extra] }));
const LEGACY_FUNCTIONAL_ITEM = { id: 'func', category: 'functional', domain: 'Functional vision (work related)', name: 'Work-related functional vision task', timing: 'milestone', fields: ['Task / measure', 'Result'], outcome: '' };
const FUNCTIONAL_ASSESSMENTS = [
  { id: 'reading_speed', name: 'Reading speed', fields: [numField('value', 'Reading speed (characters/min)', { min: 0 })] },
  { id: 'search_time', name: 'Visual search completion time', fields: [numField('value', 'Completion time (s)', { min: 0 })] },
  { id: 'coordination_time', name: 'Eye–hand reaction time', fields: [numField('value', 'Reaction time (ms)', { min: 0 })] }
].map(item => ({ ...item, category: 'functional', domain: 'Functional vision', timing: 'milestone' }));
const DEFAULT_PLAN = [
  { id: 'copm', category: 'functional', domain: 'Occupational performance & satisfaction', name: 'COPM', timing: 'bp', copm: true,
    outcome: 'Performance and satisfaction ratings for the same priority occupations; change scores' },
  ...DEVICE_ITEMS.slice(0, 4),
  { id: 'npc', domain: 'Basic visual function – convergence', name: 'Clinical convergence assessment (NPC)', timing: 'milestone',
    fields: ['NPC break (cm)', 'NPC recovery (cm)', 'Positive fusional vergence (Δ)', 'Binocular eye-tracking measures'], outcome: 'NPC, positive fusional vergence and selected binocular eye-tracking measures' },
  ...DEVICE_ITEMS.slice(4).map(item => ({ ...item, category: 'functional' })),
  ...FUNCTIONAL_ASSESSMENTS,
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
  { id: 'self_report', category: 'functional', domain: 'Functional performance', name: 'Self-report questionnaire', timing: 'milestone',
    fields: [{ id: 'questionnaire', label: 'Questionnaire', type: 'text' }, { id: 'score', label: 'Score', type: 'text' }, { id: 'findings', label: 'Key findings', type: 'textarea' }] },
  { id: 'ot_assessment', category: 'functional', domain: 'Functional performance', name: 'OT assessment', timing: 'assessment',
    fields: [{ id: 'method', label: 'Tool / method', type: 'text' }, { id: 'findings', label: 'Findings', type: 'textarea' }] },
  { id: 'daily_task', category: 'functional', domain: 'Functional performance', name: 'Daily task performance', timing: 'assessment',
    fields: [{ id: 'task', label: 'Task / measure', type: 'text' }, { id: 'performance', label: 'Performance / observation', type: 'textarea' }] },
  { id: 'participation', category: 'functional', domain: 'Functional performance', name: 'Participation needs', timing: 'assessment',
    fields: [{ id: 'needs', label: 'Needs and roles', type: 'textarea' }, { id: 'priority', label: 'Priority', type: 'text' }] },
  ...SHORT_TERM_ITEMS
];
const OLD_DEFAULT_NAMES = ['VOMS (Vestibular/Ocular Motor Screening)', 'Near point of convergence (NPC)', 'King-Devick test', 'DEM (Developmental Eye Movement)'];
const ASSESSMENT_TITLES = {
  pursuit: 'Pursuit assessment', fixation: 'Fixation assessment', saccade: 'Saccade assessment', vor: 'Vestibulo-ocular reflex assessment', periph: 'Peripheral field assessment',
  npc: 'Convergence assessment', ufov: 'UFOV', ufov_speed: 'UFOV processing speed assessment', ufov_divided: 'UFOV divided attention assessment', ufov_selective: 'UFOV selective attention assessment',
  func: 'Legacy functional vision assessment', ot_record: 'OT record review', va: 'Distance visual acuity',
  src_va: 'Distance visual acuity', src_near: 'Near visual acuity', src_vf: 'Visual field', src_cs: 'Contrast sensitivity', src_color: 'Color vision', src_stereo: 'Stereopsis', src_ufov: 'UFOV',
  st_search: 'Visual search', st_neglect: 'Spatial attention', st_reading: 'Reading performance', st_npc: 'Convergence assessment (NPC)', st_pfv: 'Positive fusional vergence (PFV)',
  st_coordination: 'Visuomotor coordination', st_gaze: 'Eye movement control', st_tug: 'Mobility (TUG)', st_10mwt: 'Walking speed (10MWT)',
  st_bbt: 'Gross dexterity (BBT)', st_9hpt: 'Fine dexterity (9HPT)', st_cop: 'Postural control (COP)', st_tolerance: 'Symptoms and recovery', st_load: 'Fixed-load tolerance'
};
const LEGACY_ASSESSMENTS = {
  saccade: 'Eye tracker – structured saccade task (computer based)', fixation: 'Eye tracker – fixation task (computer based)',
  pursuit: 'Eye tracker – moving-target pursuit task (computer based)', periph: 'Structured peripheral-stimulus task with eye tracking (computer based)', ufov: 'UFOV'
};
const LEGACY_ASSESSMENT_IDS = { sacc: 'saccade', fix: 'fixation', purs: 'pursuit' };
const VISUAL_ASSESSMENT_ORDER = ['va', 'near_va', 'refraction', 'vf', 'cs', 'color', 'stereo', 'saccade', 'fixation', 'pursuit', 'periph', 'vor', 'npc'];
const TRAIN_TITLES = {
  'Computer-based oculomotor training': 'Eye movement training', 'Peripheral awareness': 'Peripheral field training',
  'Smooth pursuit tracking': 'Pursuit training', 'Fixation': 'Fixation training', 'Saccades': 'Saccade training'
};

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
const BLOCK_SUGGEST = ['Saccade task (eye tracker)', 'Fixation task (eye tracker)', 'Smooth-pursuit task (eye tracker)', 'Peripheral-stimulus task', 'Convergence (NPC) testing', 'UFOV', ...FUNCTIONAL_ASSESSMENTS.map(item => item.name), ...TRAIN.map(t => t.label)];
const LABELS = {
  'Functional vision': '功能性視覺', 'Reading speed': '閱讀速度', 'Reading speed (characters/min)': '閱讀速度（字／分）',
  'Visual search completion time': '視覺搜尋完成時間', 'Eye–hand reaction time': '手眼反應時間',
  'Legacy functional vision assessment': '舊版功能性視覺評估',
  'Pursuit assessment': '追視評估', 'Fixation assessment': '凝視評估', 'Saccade assessment': '跳視評估',
  'Vestibulo-ocular reflex assessment': '前庭眼反射評估', 'Peripheral field assessment': '周邊視野評估', 'Convergence assessment': '輻輳評估',
  'UFOV processing speed assessment': 'UFOV 處理速度', 'UFOV divided attention assessment': 'UFOV 分散注意力', 'UFOV selective attention assessment': 'UFOV 選擇性注意力',
  'Distance visual acuity': '遠距離視力', 'Reading, search and eye–hand tasks': '閱讀、搜尋與手眼協調作業',
  'Task type': '作業類型', 'Reading task': '閱讀作業', 'Visual search task': '視覺搜尋作業', 'Eye–hand coordination task': '手眼協調作業',
  'Eye movement training': '眼動訓練', 'Peripheral field training': '周邊視野訓練', 'Pursuit training': '追視訓練', 'Fixation training': '凝視訓練', 'Saccade training': '跳視訓練',
  'Work-related vision task': '工作視覺作業', 'OT record review': '職能評估紀錄',
  'Smooth pursuit (OcuTrain)': '追視控制（OcuTrain）', 'Fixation control (OcuTrain)': '凝視控制（OcuTrain）', 'Saccade control (OcuTrain)': '跳視控制（OcuTrain）', 'Vestibulo-ocular reflex (OcuTrain)': '前庭眼反射（OcuTrain）',
  'Convergence assessment (NPC)': '集合功能（NPC）', 'Processing speed (UFOV 1)': '處理速度（UFOV 1）', 'Divided attention (UFOV 2)': '分散注意（UFOV 2）', 'Selective attention (UFOV 3)': '選擇注意（UFOV 3）',
  'Spatial attention': '空間注意', 'Reading performance': '閱讀表現', 'Positive fusional vergence (PFV)': '正融像輻輳（PFV）', 'Visuomotor coordination': '視動協調', 'Eye movement control': '眼動控制',
  'Mobility (TUG)': '起身行走（TUG）', 'Walking speed (10MWT)': '步行速度（10MWT）', 'Gross dexterity (BBT)': '手部靈巧（BBT）', 'Fine dexterity (9HPT)': '手指靈巧（9HPT）',
  'Postural control (COP)': '姿勢控制（COP）', 'Symptoms and recovery': '症狀恢復', 'Fixed-load tolerance': '負荷耐受',
  'Pre 1': '訓練前 1', 'Pre 2 (optional)': '訓練前 2（選用）', 'Immediate post': '訓練後立即', 'Recovery (optional)': '恢復期（選用）', '24–72 h follow-up (optional)': '24–72 小時追蹤（選用）',
  'Short-term functional outcomes': '短期功能成效', 'Short-term tolerability / safety': '短期耐受性／安全性',
  'Visual search (short-term)': '視覺搜尋（短期）', 'Spatial neglect / attention (short-term)': '空間忽略／注意（短期）',
  'Reading performance (short-term)': '閱讀表現（短期）', 'Near point of convergence (short-term NPC)': '集合近點（短期 NPC）',
  'Positive fusional vergence (short-term PFV)': '正融像輻輳（短期 PFV）', 'Visual–motor coordination (short-term)': '視覺動作協調（短期）',
  'Fixation / saccade control (short-term)': '注視／掃視控制（短期）', 'Timed Up and Go (short-term TUG)': '計時起走測試（短期 TUG）',
  '10-Meter Walk Test (short-term 10MWT)': '十公尺步行測試（短期 10MWT）', 'Box and Block Test (short-term BBT)': '盒子與積木測試（短期 BBT）',
  'Nine-Hole Peg Test (short-term 9HPT)': '九孔插棒測試（短期 9HPT）', 'Postural control (short-term COP)': '姿勢控制（短期 COP）',
  'Symptoms / recovery (short-term tolerability)': '症狀／恢復（短期耐受性）', 'Fixed-load symptom provocation (short-term tolerability)': '固定負荷症狀誘發（短期耐受性）',
  'Measurement time / equivalent form': '實際測量時間／等值題型', 'Tool / procedure / scoring / test conditions': '工具／流程／計分規則／測試條件',
  'Primary outcome (choose one)': '主要結果指標（擇一）', 'Training / duration / difficulty / breaks / comparison condition': '訓練內容／時間／難度／休息／對照條件',
  'Completion time (s)': '完成時間（秒）', 'Correct targets (n)': '正確目標數', 'Omissions (n)': '漏答數', 'Errors (n)': '錯誤數',
  'Accuracy (%)': '正確率（%）', 'Left-side omissions (n)': '左側漏答數', 'Right-side omissions (n)': '右側漏答數', 'Signed line-bisection deviation (mm)': '線段平分偏移（mm，含正負方向）',
  'Reading speed (characters/min or words/min)': '閱讀速度（字／分或 words/min）', 'Reading errors (n)': '閱讀錯誤數', 'Reading error rate (%)': '閱讀錯誤率（%）', 'Comprehension (%)': '理解正確率（%）',
  'Repeated trials / procedure': '重複測量各次結果／流程', 'Mean NPC break (cm)': 'NPC 破裂點平均（cm）', 'Mean NPC recovery (cm)': 'NPC 恢復點平均（cm）',
  'PFV blur (Δ)': 'PFV 模糊點（Δ）', 'PFV break (Δ)': 'PFV 破裂點（Δ）', 'PFV recovery (Δ)': 'PFV 恢復點（Δ）',
  'Reaction time (ms)': '反應時間（ms）', 'Hit rate (%)': '命中率（%）', 'Task error (specify unit)': '任務誤差（請註明單位）',
  'Fixation stability (specify parameter / unit)': '注視穩定度（請註明參數／單位）', 'Saccade latency (ms)': '掃視潛時（ms）', 'Saccade precision (specify parameter / unit)': '掃視精準度（請註明參數／單位）',
  'Walking speed (m/s)': '步行速度（m/s）', 'Blocks transferred in 60 s (n)': '60 秒搬移方塊數', 'Tested hand': '施測手側',
  'COP sway distance (specify unit)': 'COP 擺動距離（請註明單位）', 'COP sway velocity (specify unit)': 'COP 擺動速度（請註明單位）',
  'Eye fatigue': '眼睛疲勞', 'Headache': '頭痛', 'Eye soreness': '眼睛痠痛', 'Dizziness': '暈眩', 'Nausea': '噁心', 'Pain': '疼痛',
  'Predefined symptom baseline range': '預設症狀基線範圍', 'Time to baseline range (min)': '回到基線範圍的時間（分鐘）', 'Adverse events / symptom context': '不適事件／症狀背景',
  'Symptom before fixed load (0–10)': '固定負荷前症狀（0–10）', 'Symptom after fixed load (0–10)': '固定負荷後症狀（0–10）', 'Symptom and fixed-load protocol': '症狀名稱與固定負荷施測流程',
  'Generally seek less time, more accuracy and fewer omissions/errors. Report time and accuracy together. Keep difficulty fixed and use equivalent stimuli to reduce recall and speed–accuracy trade-offs.': '完成時間通常下降、正確率上升、漏答／錯誤下降；時間與準確性應一起報告。固定難度並使用等值刺激，減少記憶與速度、準確度取捨的影響。',
  'Record cancellation omissions, left/right distribution and time. Record signed bisection deviation and its direction; less absolute deviation is generally better. Bisection alone does not describe all neglect.': '記錄刪除測驗的漏答數、左右分布與完成時間。線段平分記錄含方向的偏移，通常絕對偏移減少較佳；不能單獨代表所有忽略症狀。',
  'Use MNREAD or equivalent passages. Specify characters/min or words/min; keep font, size, contrast and lighting constant. Generally seek faster reading with fewer errors; report both.': '使用 MNREAD 或等難度短文，註明字／分或 words/min；固定字體、字級、對比與照明。速度通常上升、錯誤下降，兩者一起記錄。',
  'Record repeated NPC trials and their mean with symptoms. A shorter distance is generally better for convergence goals; use a consistent target and procedure.': '記錄 NPC 多次測量及平均，搭配症狀評分。集合訓練通常以距離縮短為改善方向；固定目標及測量流程。',
  'Keep test distance and blur, break and recovery criteria consistent. Greater PFV may be better when it matches the training goal; monitor symptoms separately.': '固定測試距離與模糊、破裂、恢復判定標準。符合訓練目標時 PFV 增加可能較佳；症狀另作耐受性監測。',
  'Use the same relevant pointing or eye–hand task. Generally seek shorter time, fewer errors and more hits; control familiarisation and device latency.': '使用相同且與訓練相關的點按或眼手協調任務。通常時間／誤差下降、命中率上升；控制熟悉度與設備延遲。',
  'Eye-tracker measures require suitable equipment and need not be the first outpatient choice. Record parameter definitions and units; improvement depends on the chosen parameter.': '眼動儀指標需要適合的設備；記錄參數定義與單位，改善方向依參數而定，一般門診不必優先選用。',
  'Generally seek a shorter completion time; keep chair, walking aid, assistance and procedure consistent.': '完成時間通常下降；固定椅子、輔具、協助程度與施測流程。',
  'Generally seek faster walking speed. Keep pace instructions, timed distance, walking aid and assistance consistent.': '步行速度通常上升；固定速度指示、計時距離、輔具與協助程度。',
  'Record blocks transferred in 60 seconds and the tested hand. More blocks is generally better; keep the protocol consistent.': '記錄 60 秒搬移方塊數與施測手側；數量通常上升較佳，固定施測流程。',
  'Record completion time and the tested hand. A shorter time is generally better; keep the protocol consistent.': '記錄完成時間與施測手側；時間通常下降較佳，固定施測流程。',
  'Requires measurement equipment. Define the task, device, units and parameter; improvement direction depends on the task.': '需量測設備；註明任務、設備、單位與參數，改善方向依任務而定。',
  'Rate each current symptom from 0–10 for tolerability/safety, separately from functional efficacy. Symptoms can rise while function improves. Record baseline symptoms, adverse events and recovery to a predefined baseline range; VOMS is screening, not a validated single-session efficacy test.': '各症狀以 0–10 分別記錄，作為耐受性／安全性而非功能療效。功能改善時症狀仍可能暫增；記錄原有症狀、不適事件與回到預設基線範圍的時間。VOMS 屬篩檢，不能直接視為已驗證的單次療效測試。',
  'Provocation = symptom score after a fixed load minus score before that load. Specify the symptom and identical load. A smaller increase alone does not prove efficacy; consider baseline, ceiling, natural recovery and retesting.': '症狀誘發量＝固定負荷後分數－該次負荷前分數。註明症狀並固定相同負荷；誘發量較小不能單獨證明療效，須考量基線、天花板效應、自然恢復與重測。',
  'Oculomotor training (Sol)': '眼球動作訓練（Sol）', 'Visual perception': '視覺知覺', 'Paper-based visual exercises': '紙本視覺練習',
  'Oculomotor training (Tobii / webcam)': '眼球動作訓練（Tobii／網路攝影機）', 'Visual processing training': '視覺處理訓練', 'Home-based practice modules': '居家視覺練習模組',
  'Visual function': '視覺功能', 'Functional vision': '功能性視覺', 'Functional performance': '功能表現',
  'Medical record review': '病歷資料', 'Optometry record': '視光紀錄', 'OT assessment record': '職能治療評估紀錄',
  'Visual acuity': '視力', 'Near visual acuity': '近距離視力', 'Refraction': '屈光', 'Visual field': '視野',
  'Contrast sensitivity': '對比敏感度', 'Color vision': '色覺', 'Stereopsis': '立體視覺',
  'Self-report questionnaire': '自填問卷', 'OT assessment': '職能治療評估', 'Daily task performance': '日常作業表現', 'Participation needs': '參與需求',
  'Source / date': '來源／日期', 'Summary': '摘要', 'Chart / notation': '視力表／記法', 'Correction': '矯正狀態',
  'Uncorrected': '未矯正', 'Habitual': '慣用矯正', 'Best corrected': '最佳矯正', 'Test distance (cm)': '測驗距離（cm）',
  'Add': '近用附加度數', 'Source': '來源', 'Test / method': '測驗／方法', 'Result (arcsec)': '結果（角秒）',
  'Questionnaire': '問卷', 'Score': '分數', 'Key findings': '主要發現', 'Tool / method': '工具／方法', 'Findings': '評估發現',
  'Performance / observation': '表現／觀察', 'Needs and roles': '需求與角色', 'Priority': '優先順序',
  'Workstation setup': '桌椅與螢幕調整',
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
  'Fixation': '凝視訓練', 'Saccades': '跳視訓練', 'Gaze stabilisation (VOR)': '凝視穩定（VOR）',
  'Saccadic control': '跳視控制', 'Fixation control': '凝視控制', 'Smooth-pursuit control': '平滑追視控制',
  'Peripheral awareness': '周邊視野訓練', 'Basic visual function – convergence': '基本視覺功能：輻輳',
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
  'Computer-based oculomotor training': '眼動訓練', 'Visual attention': '視覺注意力', 'Visual search': '視覺搜尋',
  'Saccadic fixation': '跳視與凝視', 'Smooth pursuit tracking': '追視訓練',
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
const labelText = text => language === 'zh-TW' && Object.hasOwn(LABELS, text) ? LABELS[text] : Object.hasOwn(TRAIN_TITLES, text) ? TRAIN_TITLES[text] : text || '';
const ADD_ICON = '<svg class="add-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2v12M2 8h12"/></svg>';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const val = v => v == null ? '' : esc(v);
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
let helpSequence = 0, activeHelp = null, helpLeaveTimer = 0;
const helpTooltipHTML = (id, text) => `<span class="help-tooltip" id="${id}" role="tooltip" popover="manual" hidden>${esc(text)}</span>`;
function helpHTML(subject, text) {
  const id = 'help-' + ++helpSequence;
  return `<span class="help"><button type="button" class="btn help-trigger" aria-label="${esc(ui('說明：{0}', subject))}" aria-describedby="${id}" data-help="${id}">?</button>${helpTooltipHTML(id, text)}</span>`;
}
function commandHelp(button, text) {
  let tooltip = document.getElementById(button.dataset.help);
  if (!tooltip) {
    const id = 'help-' + ++helpSequence;
    button.dataset.help = id; button.setAttribute('aria-describedby', id);
    button.insertAdjacentHTML('afterend', helpTooltipHTML(id, text));
    tooltip = document.getElementById(id);
  }
  tooltip.textContent = text;
}
function hideHelp() {
  clearTimeout(helpLeaveTimer);
  if (!activeHelp) return;
  const { tooltip } = activeHelp;
  if (tooltip.matches(':popover-open')) tooltip.hidePopover();
  tooltip.hidden = true; activeHelp = null;
}
function positionHelp() {
  if (!activeHelp) return;
  const { trigger, tooltip } = activeHelp;
  if (!trigger.isConnected || !trigger.getClientRects().length) { hideHelp(); return; }
  const rect = trigger.getBoundingClientRect(), bounds = tooltip.getBoundingClientRect(), edge = 8;
  const viewport = window.visualViewport, width = viewport?.width || innerWidth, height = viewport?.height || innerHeight;
  const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
  tooltip.style.left = Math.max(left + edge, Math.min(rect.left, left + width - bounds.width - edge)) + 'px';
  tooltip.style.top = Math.max(top + edge, Math.min(rect.bottom + 2 + bounds.height <= top + height - edge ? rect.bottom + 2 : rect.top - bounds.height - 2, top + height - bounds.height - edge)) + 'px';
}
function showHelp(trigger, pinned = false) {
  clearTimeout(helpLeaveTimer);
  if (activeHelp?.trigger !== trigger) {
    hideHelp();
    const tooltip = document.getElementById(trigger.dataset.help); if (!tooltip) return;
    tooltip.hidden = false;
    if (tooltip.showPopover) tooltip.showPopover();
    activeHelp = { trigger, tooltip, pinned: false };
  }
  activeHelp.pinned ||= pinned; positionHelp();
}
function leaveHelp() {
  clearTimeout(helpLeaveTimer);
  helpLeaveTimer = setTimeout(() => {
    if (activeHelp && !activeHelp.trigger.matches(':hover, :focus') && !activeHelp.tooltip.matches(':hover')) hideHelp();
  }, 140);
}
document.addEventListener('pointerover', event => {
  const trigger = event.target.closest('[data-help]');
  if (trigger && !trigger.contains(event.relatedTarget)) showHelp(trigger);
  if (event.target.closest('.help-tooltip')) clearTimeout(helpLeaveTimer);
});
document.addEventListener('pointerout', event => { if (event.target.closest('.help, [data-help], .help-tooltip')) leaveHelp(); });
document.addEventListener('focusin', event => {
  const trigger = event.target.closest('[data-help]');
  if (trigger) showHelp(trigger);
  else if (activeHelp && !activeHelp.trigger.matches(':hover') && !activeHelp.tooltip.matches(':hover')) hideHelp();
  else leaveHelp();
});
document.addEventListener('focusout', leaveHelp);
document.addEventListener('click', event => {
  const trigger = event.target.closest('.help-trigger'); if (!trigger) return;
  event.preventDefault(); event.stopImmediatePropagation();
  if (activeHelp?.trigger === trigger && activeHelp.pinned) hideHelp(); else showHelp(trigger, true);
}, true);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activeHelp) {
    const command = activeHelp.trigger.matches('[role^="menuitem"]');
    hideHelp();
    if (!command) { event.preventDefault(); event.stopImmediatePropagation(); }
  }
}, true);
window.addEventListener('scroll', positionHelp, true);
window.addEventListener('resize', positionHelp);
const clone = o => JSON.parse(JSON.stringify(o));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const fmtDate = d => { if (!d) return '-'; const t = new Date(d + 'T00:00:00'); return isNaN(t) ? esc(d) : t.toLocaleDateString(language, { day: 'numeric', month: 'numeric', year: 'numeric' }); };
const nrs = v => (v === '' || v == null || isNaN(+v)) ? null : Math.max(0, Math.min(10, Math.round(+v)));
const numOrNull = v => (v === '' || v == null || isNaN(+v)) ? null : +v;
const signed = d => (d > 0 ? '+' : '') + (Math.round(d * 10) / 10);
let toastTimer = 0;
function toast(msg) {
  const host = $('#toastHost'); host.replaceChildren();
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; host.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { if (t.isConnected) t.remove(); }, 5000);
}
let failureSequence = 0;
const failures = [];
function errorGuidance(error) {
  const text = [error?.name, error?.message, String(error)].join(' ');
  const kind = ['NotAllowedError', 'SecurityError'].includes(error?.name) ? 'permission' : error?.name === 'NotFoundError' ? 'missing'
    : ['NoModificationAllowedError', 'InvalidStateError'].includes(error?.name) ? 'locked' : error?.name === 'QuotaExceededError' ? 'quota' : '';
  if (kind === 'locked' || !kind && /NoModificationAllowedError|InvalidStateError|invalid state|\blocked\b|in use|being used|cannot be modified|can not be modified|modifications are not allowed|EBUSY|鎖定/i.test(text)) return { text: ui('檔案可能正由 Excel 或其他程式開啟。請關閉該檔案，再儲存一次。') };
  if (kind === 'permission' || !kind && /NotAllowedError|SecurityError|permission|not allowed|insecure|access.*denied|denied.*access|EACCES|EPERM|權限|拒絕存取/i.test(text)) return { text: ui('請重新連接病歷資料夾，並允許編輯，再試一次。'), reconnect: true };
  if (kind === 'missing' || !kind && /NotFoundError|ENOENT|not found|could not be found|does not exist|找不到|不存在/i.test(text)) return { text: ui('資料夾或檔案可能已移動、改名或刪除。請重新連接或選擇病歷資料夾。'), reconnect: true };
  if (kind === 'quota' || !kind && /QuotaExceededError|ENOSPC|quota|disk.*full|storage.*full/i.test(text)) return { text: ui('裝置或瀏覽器的儲存空間已滿。請先騰出空間，再試一次。') };
  return { text: ui('請再試一次；若仍未成功，請保留此視窗，並備份資料。') };
}
const failureSource = text => Object.keys(UI_EN).find(key => UI_EN[key] === text) || text;
function showFailure(error, headline = ui('操作未完成'), options = {}) {
  const raw = error?.message || String(error), source = failureSource(headline);
  let failure = failures.find(item => item.headline === source && item.raw === raw);
  if (!failure) { failure = { id: ++failureSequence, error, raw, headline: source, ...options }; failures.push(failure); }
  renderFailures();
  const node = [...document.querySelectorAll('.failure-message')][failures.indexOf(failure)];
  node?.scrollIntoView({ block: 'start', behavior: 'instant' });
}
function renderFailures() {
  document.querySelectorAll('.failure-message').forEach(node => node.remove());
  const host = $('#layer .modal') || $('#failureHost');
  if (!host) return;
  for (const failure of failures) {
    const guidance = errorGuidance(failure.error), node = document.createElement('section');
    node.className = 'failure-message'; node.setAttribute('role', 'alert');
    node.innerHTML = `<strong>${esc(ui(failure.headline))}</strong><p>${esc(guidance.text)}</p>
      ${failure.recordSave ? `<p>${esc(ui('你填寫的內容仍在畫面上，沒有遺失。'))}</p>` : ''}
      <details><summary>${ui('技術細節')}</summary><pre>${esc(failure.raw)}</pre></details>
      <div class="row">${guidance.reconnect && window.showDirectoryPicker ? `<button type="button" class="btn" data-failure-reconnect ${failure.reconnecting ? 'disabled' : ''}>${failure.copy ? ui('重新連接同步副本資料夾') : ui('重新連接病歷資料夾')}</button>` : ''}<button type="button" class="btn" data-failure-dismiss>${ui('關閉錯誤訊息')}</button></div>`;
    const dismiss = () => {
      failures.splice(failures.indexOf(failure), 1);
      const nextFocus = $('#layer .modal') || ($('#toolbarSave')?.getClientRects().length ? $('#toolbarSave') : $('#clientSearch'));
      node.remove(); nextFocus?.focus({ preventScroll: true });
    };
    node.querySelector('[data-failure-dismiss]').onclick = dismiss;
    node.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dismiss(); } });
    const reconnect = node.querySelector('[data-failure-reconnect]');
    if (reconnect) reconnect.onclick = async () => {
      failure.reconnecting = true; reconnect.disabled = true;
      try {
        if (failure.copy) await pickCopyFolder();
        else await connectFolder(pendingHandle || (store?.root?.requestPermission ? store.root : null), true);
      } catch (error) { showFailure(error, ui('無法開啟資料夾')); }
      finally { failure.reconnecting = false; renderFailures(); }
    };
    host.appendChild(node);
  }
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
let modalDismiss = null, modalFocus = null, modalBackground = [];
const modalControls = m => [...m.querySelectorAll('button, input, select, textarea, a[href], summary, [tabindex]')].filter(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length);
function modal(html, onDismiss = null) {
  hideHelp();
  const layer = $('#layer');
  if (layer.firstChild) closeModal();
  modalDismiss = onDismiss; modalFocus = document.activeElement;
  layer.innerHTML = `<div class="overlay"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  modalBackground = [...document.body.children].filter(el => el !== layer).map(el => ({ el, inert: el.inert }));
  for (const { el } of modalBackground) el.inert = true;
  document.body.style.setProperty('--modal-scrollbar-width', (innerWidth - document.documentElement.clientWidth) + 'px');
  document.body.classList.add('modal-open');
  $('#languageSelect').disabled = true;
  const heading = layer.querySelector('h3');
  if (heading) { heading.id = 'dialogTitle'; layer.querySelector('.modal').setAttribute('aria-labelledby', heading.id); }
  const dialog = layer.querySelector('.modal'); dialog.tabIndex = -1;
  renderFailures();
  (modalControls(dialog)[0] || dialog).focus({ preventScroll: true });
  return layer.querySelector('.modal');
}
const closeModal = (result = false) => {
  hideHelp();
  const done = modalDismiss; modalDismiss = null; $('#layer').innerHTML = '';
  for (const { el, inert } of modalBackground) el.inert = inert;
  modalBackground = []; document.body.classList.remove('modal-open');
  $('#languageSelect').disabled = savingSession || savingItems;
  modalFocus?.focus({ preventScroll: true }); if (done) done(result);
  renderFailures();
};
document.addEventListener('keydown', e => {
  const m = $('#layer .modal'); if (!m) return;
  if (e.key === 'Escape') { e.preventDefault(); if (!assessmentDialog?.saving) closeModal(); }
  if (e.key === 'Tab') {
    const controls = modalControls(m);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { e.preventDefault(); m.focus(); }
    else if (e.shiftKey && (document.activeElement === first || document.activeElement === m)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || document.activeElement === m)) { e.preventDefault(); first.focus(); }
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
    if (!id(key) || used.has(key) || typeof name !== 'string' || !name.trim() || item.templateId !== undefined && !id(item.templateId)) throw new Error(ui('項目名稱或識別碼格式錯誤'));
    used.add(key);
    if (kind === 'assessment' && (!Object.hasOwn(TIMING, item.timing || 'assessment') || (item.copm && key !== 'copm'))) throw new Error(ui('評估時機或 COPM 模板格式錯誤'));
    if (kind === 'assessment' && item.category !== undefined && !['visual', 'functional'].includes(item.category)) throw new Error(ui('評估分類必須為視覺功能或功能表現。'));
    if (kind === 'assessment' && (item.functionCategory !== undefined && !ASSESSMENT_FUNCTIONS.includes(item.functionCategory) || item.outcomePeriod !== undefined && !['short', 'long'].includes(item.outcomePeriod))) throw new Error(ui('功能分類或指標期程格式錯誤。'));
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
function strategyLabel(approach, id, s) {
  for (const catalog of Object.values(INTERVENTIONS)) if (Object.hasOwn(catalog[approach], id)) return labelText(catalog[approach][id]);
  return s?.interventions?.[approach]?.custom?.find(item => item.id === id)?.name || id;
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
  if (s.contextSource !== undefined && (!object(s.contextSource) || !id(s.contextSource.sessionId) || typeof s.contextSource.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s.contextSource.date) ||
    !Array.isArray(s.contextSource.parts) || s.contextSource.parts.some(part => typeof part !== 'string' || !part.trim()))) throw new Error(ui('沿用內容來源格式錯誤'));
  if ([...Object.keys(s.assess), ...Object.keys(s.training)].some(key => !id(key))) throw new Error(ui('評估或復健項目識別碼格式錯誤'));
  if (s.mode != null && !['inperson', 'telerehab'].includes(s.mode)) throw new Error(ui('服務型態格式錯誤'));
  if (s.peo != null && (!object(s.peo) || ['person', 'environment', 'occupation'].some(key => s.peo[key] !== undefined && typeof s.peo[key] !== 'string'))) throw new Error(ui('PEO 架構欄位格式錯誤'));
  if (s.interventions != null) {
    if (!object(s.interventions)) throw new Error(ui('介入策略欄位格式錯誤'));
    for (const key of ['adaptation', 'compensation']) {
      const d = s.interventions[key];
      if (d != null && (!object(d) || !Array.isArray(d.picks) || d.picks.some(pick => !id(pick)) || (d.notes !== undefined && typeof d.notes !== 'string'))) throw new Error(ui('介入策略欄位格式錯誤'));
      if (d?.custom != null && (!Array.isArray(d.custom) || d.custom.length > 100 || d.custom.some(item => !object(item) || !id(item.id) || typeof item.name !== 'string' || !item.name.trim() || item.name.length > 200) || new Set(d.custom.map(item => item.id)).size !== d.custom.length)) throw new Error(ui('自訂介入方案格式錯誤'));
    }
  }
  if (s.clinicalLinks !== undefined) {
    const used = new Set();
    if (!Array.isArray(s.clinicalLinks) || s.clinicalLinks.length > 100) throw new Error(ui('臨床連結欄位格式錯誤'));
    for (const link of s.clinicalLinks) {
      if (!object(link) || !id(link.id) || used.has(link.id) || !['visual', 'functional'].includes(link.category) ||
        (link.subjectiveRef !== undefined && typeof link.subjectiveRef !== 'boolean') ||
        ['symptom', 'reasoning', 'evidenceNotes', 'interventionNotes'].some(key => typeof link[key] !== 'string') || (s.visit !== 'absent' && !link.symptom.trim()) ||
        !Array.isArray(link.peo) || link.peo.some(key => !['person', 'environment', 'occupation'].includes(key)) ||
        ['evidence', 'interventions'].some(key => !Array.isArray(link[key]) || link[key].some(value => !id(value) && !(key === 'interventions' && typeof value === 'string' && /^rehab:[A-Za-z0-9_-]{1,120}$/.test(value))))) throw new Error(ui('臨床連結欄位格式錯誤'));
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
  validateMeasurementReferences(c, s);
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
let copyRoot = null, pendingCopy = null, copyLastError = '';
async function mirror(fn) {
  copyLastError = '';
  if (!copyRoot) return;
  try { await fn(copyRoot); }
  catch (e) { copyLastError = ui('副本資料夾未更新'); showFailure(e, copyLastError, { copy: true }); }
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
  if (copyRoot) b.textContent = ui('同步副本：') + copyRoot.name;
  else if (pendingCopy) b.textContent = ui('重新連接同步副本資料夾');
  else b.textContent = ui('設定同步副本資料夾');
  b.removeAttribute('title');
  commandHelp(b, ui('副本會跟著主資料夾更新，包含刪除，不能用來保留過去版本；請另做備份。'));
}
async function syncCopyNow() {
  try { const n = await store.syncCopy(); toast(ui('已將 {0} 位個案的資料夾複製到「{1}」。', n, copyRoot.name)); }
  catch (e) { showFailure(e, ui('無法複製資料夾'), { copy: true }); }
}
async function pickCopyFolder() {
  let h;
  try {
    h = await window.showDirectoryPicker({ id: 'progress-copy', mode: 'readwrite', startIn: 'documents' });
    if (await h.isSameEntry(store.root)) { toast(ui('副本資料夾必須與主要病歷資料夾不同。')); return; }
    if (await h.requestPermission({ mode: 'readwrite' }) !== 'granted') { showFailure(new DOMException(ui('請允許編輯副本資料夾。'), 'NotAllowedError'), ui('無法開啟資料夾'), { copy: true }); return; }
  } catch (e) { if (e.name !== 'AbortError') showFailure(e, ui('無法開啟資料夾'), { copy: true }); return; }
  copyRoot = h; pendingCopy = null; await idbSet('copy', h); renderCopyBtn(); closeModal();
  await syncCopyNow();
}
async function copyFolderClick() {
  if (!copyRoot && pendingCopy) {
    let permissionError;
    try { if (await pendingCopy.requestPermission({ mode: 'readwrite' }) === 'granted') { copyRoot = pendingCopy; pendingCopy = null; renderCopyBtn(); await syncCopyNow(); return; } }
    catch (e) { permissionError = e; }
    showFailure(permissionError || new DOMException(ui('尚未取得權限，請重新選擇副本資料夾。'), 'NotAllowedError'), ui('無法開啟資料夾'), { copy: true });
  }
  if (!copyRoot) { modalCopyIntro(); return; }
  const m = modal(ui`<h3>同步副本資料夾</h3>
    <p style="margin:0">${ui('儲存在 {0} 的個案資料夾與病歷，也會以相同結構複製到 {1}。編輯、重新命名及刪除也會套用至副本。', `<b>${esc(store.root.name)}</b>`, `<b>${esc(copyRoot.name)}</b>`)}</p>
    <p class="note">副本會跟著主資料夾更新，包含刪除，不能用來保留過去版本；請另做備份。</p>
    <div class="row"><button class="btn app-primary" id="cpSync">立即複製全部資料</button><button class="btn" id="cpPick">選擇其他資料夾</button><button class="btn danger" id="cpStop">停止更新副本</button></div>
    <div class="row" style="justify-content:flex-end"><button class="btn" id="cpClose">關閉</button></div>`);
  m.querySelector('#cpClose').onclick = closeModal;
  m.querySelector('#cpSync').onclick = async () => { closeModal(); await syncCopyNow(); };
  m.querySelector('#cpPick').onclick = () => pickCopyFolder();
  m.querySelector('#cpStop').onclick = async () => { copyRoot = null; pendingCopy = null; await idbSet('copy', null); renderCopyBtn(); closeModal(); toast(ui('已停止更新副本，既有副本檔案仍保留。')); };
}
function modalCopyIntro() {
  const m = modal(ui`<h3>設定同步副本資料夾</h3>
    <p style="margin:0">選擇另一個本機資料夾保存副本。現有個案資料會立即複製，之後每次儲存也會更新副本。</p>
    <p class="note">副本會跟著主資料夾更新，包含刪除，不能用來保留過去版本；請另做備份。</p>
    <p class="note" style="margin:0">瀏覽器出現權限提示時，請允許編輯檔案。</p>
    <div class="row" style="justify-content:flex-end"><button class="btn" id="ciCancel">取消</button><button class="btn app-primary" id="ciPick">選擇同步副本資料夾</button></div>`);
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
    } catch (e) { failed.push(clientLabel(client)); showFailure(e, ui('無法匯出資料')); }
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
      <h2>開始記錄病歷</h2>
      <p>病歷保存在這台電腦的資料夾中，不會透過網路傳送。</p>
      <ol class="connect-steps"><li>選擇要存放病歷的資料夾。</li><li>瀏覽器詢問時，允許編輯資料夾。</li><li>新增個案，開始填寫紀錄。</li></ol>
      ${pending ? `<p><b>${ui('此瀏覽器有先前在瀏覽器模式儲存的紀錄。連接病歷資料夾後會自動存入對應個案的資料夾；資料夾中較新的版本不會被覆蓋。')}</b></p>` : ''}
    </div>
    <div class="connect-options">
      <h3>選擇適合您的儲存方式</h3>
      ${pendingHandle ? ui`<button class="btn app-primary" data-action="reconnect">重新連接「${esc(pendingHandle.name)}」</button>` : ''}
      <div><button class="btn ${pendingHandle ? '' : 'app-primary'}" data-action="pick-folder" aria-describedby="existingFolderHint">我已經有病歷資料夾</button><p class="note" id="existingFolderHint">選擇原有資料夾，繼續使用裡面的個案與紀錄。</p></div>
      <div><button class="btn" data-action="use-default" aria-describedby="newFolderHint">第一次使用，幫我建立</button><p class="note" id="newFolderHint">新增個案並儲存時，再選擇要建立病歷資料夾的位置。</p></div>
    </div>
    <div class="connect-notes">
      <p>每次開啟都要先連接病歷資料夾，才能讀取和儲存病歷。</p>
      <p class="note">換電腦時，先備份全部資料，將備份與程式複製到另一台電腦，再匯入還原。</p>
    </div>
    <details class="connect-advanced">
      <summary>檔案存在哪裡（進階）</summary>
      <p>將 EzEMR.html 放在電腦的本機資料夾，直接用 Chrome 或 Edge 開啟。選擇病歷儲存位置後，個案總表會儲存為 clients.csv，每次紀錄會以 CSV、PDF 與 TXT 存入該個案的資料夾。</p>
      <p>${pendingHandle ? ui('每次開啟 EzEMR 都要先連接「{0}」。連接後，按「儲存」就會直接寫入該個案的資料夾，不會下載檔案。', esc(pendingHandle.name)) : ui('每次開啟 EzEMR 都要先連接病歷資料夾。連接後，按「儲存」就會直接寫入該個案的資料夾，不會下載檔案。')}</p>
      <p>首次使用 Data 時，儲存前請選擇 HTML 所在的本機資料夾，程式會在其中建立 Data。已有病歷時，請選擇包含 clients.csv 的資料夾；也可指定其他本機位置。</p>
      <aside class="storage-preview" aria-label="本機資料夾結構">
      <h3>本機資料夾結構</h3>
      <pre class="storage-path">EzEMR /
  EzEMR.html
  Data /
    clients.csv
    個案資料夾 / 每次紀錄的 CSV、PDF 與 TXT</pre>
      <p class="note">資料夾中的檔案可直接開啟、複製與備份。</p>
      </aside>
      <p class="note">瀏覽器需要你選擇一次資料夾並允許編輯。需要換電腦時，先匯出完整 JSON 備份，再將備份與 HTML 複製到另一台電腦還原。</p>
      ${window.showDirectoryPicker ? '' : ui`<p class="note">此瀏覽器無法使用資料夾功能時，可<button class="btn link" data-action="use-browser">暫用瀏覽器與 ZIP 下載</button>。原有 JSON 病歷仍可讀取。</p>`}
    </details></section>`;
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
    <p class="note">勾選的欄位為所有病人的必填資料；其他欄位可在個案表單選填，既有內容會保留。</p>
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
      message.textContent = ui('無法儲存設定') + ' ' + errorGuidance(error).text; message.hidden = false;
      showFailure(error, ui('無法儲存設定'));
    } finally { savingItems = false; controls.forEach(control => control.disabled = false); renderCommands(); }
  };
}
async function connectFolder(h, preserveEditor = false) {
  if (!window.showDirectoryPicker) { toast(ui('此瀏覽器無法直接選擇資料夾，請使用 Chrome 或 Edge。')); return; }
  const draft = preserveEditor && view === 'edit' && editing ? { session: collectSession(), storage: deviceStorage(), clientId: curId, dirty } : null;
  if (draft) keepDraftNow();
  try {
    if (!h) h = await window.showDirectoryPicker({ id: 'progress-notes', mode: 'readwrite', startIn: 'documents' });
    if (await h.requestPermission({ mode: 'readwrite' }) !== 'granted') { showFailure(new DOMException(ui('儲存病歷需要資料夾編輯權限。'), 'NotAllowedError'), ui('無法開啟資料夾')); return; }
    h = await recordFolder(h);
  } catch (e) { if (e.name !== 'AbortError') showFailure(e, ui('無法開啟資料夾')); return; }
  await idbSet('root', h); pendingHandle = null;
  closeModal(); store = folderStore(h); await finishBoot({ offerRecovery: !draft });
  if (draft && sameDeviceStorage(draft.storage, deviceStorage()) && clients.some(client => client.id === draft.clientId)) {
    curId = draft.clientId; await loadSessions(); editing = draft.session; dirty = draft.dirty; view = 'edit'; editorWorkflow = null;
    renderClients(); renderMain();
  }
}
async function safe(fn, failMsg, options = {}) {
  try { return await fn(); }
  catch (e) {
    if (e && e.code === 'unavailable') { await new Promise(r => setTimeout(r, 600 + Math.random() * 600)); try { return await fn(); } catch (e2) { e = e2; } }
    showFailure(e, failMsg, options);
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

const DRAFT_KEY = 'ezrehab-draft-v1', RECENT_CLIENTS_KEY = 'ezrehab-recent-clients-v1';
const deviceStorage = () => store?.kind === 'local' ? { kind: 'local' } : store?.kind === 'folder' && !store.root.deferred ? { kind: 'folder', name: store.root.name } : null;
const sameDeviceStorage = (a, b) => !!a && !!b && a.kind === b.kind && a.name === b.name;
const deviceStorageKey = (storage = deviceStorage()) => JSON.stringify(storage);
let draftTimer = 0, draftBaseUpdated = null, draftRecordId = null, draftKeptAt = null, draftUnavailable = false, draftWarned = false, draftLastJSON = null;
function beginDraftSession(record, copy = null) {
  clearTimeout(draftTimer);
  draftBaseUpdated = copy ? copy.baseUpdated : record?.updated || null;
  draftRecordId = copy ? copy.recordId : record?.id || null;
  draftKeptAt = copy?.copiedAt || null; draftUnavailable = false; draftWarned = false; draftLastJSON = null;
}
function draftStatus() {
  return [dirty ? ui('未儲存變更') : ui('尚未修改'), dirty && draftKeptAt ? ui('已自動暫存 {0}', new Date(draftKeptAt).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false })) : '', draftUnavailable ? ui('無法自動暫存，請定期儲存。') : ''].filter(Boolean).join(' · ');
}
function refreshDraftStatus() {
  const node = $('#workflowDirty'), text = draftStatus();
  if (node && node.textContent !== text) node.textContent = text;
}
function validDraftCopy(copy) {
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const id = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value) && !['__proto__', 'constructor', 'prototype'].includes(value);
  const s = copy?.session;
  const valid = object(copy) && object(copy.storage) && ['folder', 'local'].includes(copy.storage.kind) &&
    (copy.storage.kind !== 'folder' || typeof copy.storage.name === 'string') && id(copy.clientId) &&
    (copy.recordId === null || id(copy.recordId)) && (copy.baseUpdated === null || typeof copy.baseUpdated === 'string') &&
    typeof copy.copiedAt === 'string' && Number.isFinite(Date.parse(copy.copiedAt)) && object(s) &&
    (s.id === null || id(s.id)) &&
    typeof s.date === 'string' && VISITS.some(visit => visit.k === s.visit) && copy.date === s.date && copy.visit === s.visit &&
    (!copy.recordId || copy.recordId === s.id) && Array.isArray(s.sym) && object(s.assess) && object(s.training) &&
    s.sym.every(row => object(row) && id(row.id) && typeof row.kind === 'string' && object(row.scores)) &&
    [...Object.keys(s.assess), ...Object.keys(s.training)].every(id) &&
    Object.values(s.assess).every(a => object(a) && (a.values == null || object(a.values)) && (a.copm == null || Array.isArray(a.copm) && a.copm.every(object))) &&
    Object.values(s.training).every(t => object(t) && (t.acts == null || Array.isArray(t.acts)) && (t.runs == null || Array.isArray(t.runs) && t.runs.every(object)) && (t.eyedot == null || Array.isArray(t.eyedot) && t.eyedot.every(object))) &&
    ['subjective', 'objective', 'feedback', 'otherTx', 'assessment', 'plan', 'clinician', 'nextDate'].every(key => s[key] == null || typeof s[key] === 'string') &&
    (s.peo == null || object(s.peo) && Object.values(s.peo).every(value => typeof value === 'string')) &&
    (s.absence == null || object(s.absence) && Object.values(s.absence).every(value => typeof value === 'string')) &&
    (s.clinicalLinks === undefined || Array.isArray(s.clinicalLinks) && s.clinicalLinks.every(link => object(link) && id(link.id) && ['visual', 'functional'].includes(link.category) && ['symptom', 'reasoning', 'evidenceNotes', 'interventionNotes'].every(key => typeof link[key] === 'string') && ['peo', 'evidence', 'interventions'].every(key => Array.isArray(link[key])))) &&
    (s.assessmentPlan === undefined || Array.isArray(s.assessmentPlan)) && (s.trainingPlan === undefined || Array.isArray(s.trainingPlan));
  if (!valid) return false;
  try {
    if (s.assessmentPlan) validateItems(s.assessmentPlan, 'assessment');
    if (s.trainingPlan) validateItems(s.trainingPlan, 'training');
    return true;
  } catch (_) { return false; }
}
function writeDraftCopies(copies) {
  if (copies.length) localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, copies }));
  else localStorage.removeItem(DRAFT_KEY);
}
function readDraftCopies() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (raw === null) return [];
  let data;
  try { data = JSON.parse(raw); } catch (_) { localStorage.removeItem(DRAFT_KEY); return []; }
  if (data?.version !== 1 || !Array.isArray(data.copies)) { localStorage.removeItem(DRAFT_KEY); return []; }
  const copies = data.copies.filter(validDraftCopy);
  if (copies.length !== data.copies.length) writeDraftCopies(copies);
  return copies;
}
function keepDraftNow() {
  clearTimeout(draftTimer);
  if (!dirty || view !== 'edit' || !editing || !$('#soapForm') || !deviceStorage()) return;
  try {
    const session = collectSession(), storage = deviceStorage();
    const json = JSON.stringify({ storage, clientId: curId, session });
    if (json === draftLastJSON) return;
    const copiedAt = new Date().toISOString();
    const copy = { storage, clientId: curId, recordId: draftRecordId, date: session.date, visit: session.visit, copiedAt, baseUpdated: draftBaseUpdated, session };
    const copies = readDraftCopies().filter(entry => !sameDeviceStorage(entry.storage, storage) || entry.clientId !== curId || entry.recordId !== draftRecordId);
    writeDraftCopies([...copies, copy]);
    draftLastJSON = json; draftKeptAt = copiedAt; draftUnavailable = false; refreshDraftStatus();
  } catch (_) {
    draftUnavailable = true; refreshDraftStatus();
    if (!draftWarned) { draftWarned = true; toast(ui('無法自動暫存，請定期儲存。')); }
  }
}
function queueDraftCopy() {
  clearTimeout(draftTimer);
  refreshDraftStatus();
  if (dirty && view === 'edit' && editing) draftTimer = setTimeout(keepDraftNow, 1500);
}
function removeCurrentDraft() {
  clearTimeout(draftTimer);
  try { writeDraftCopies(readDraftCopies().filter(copy => !sameDeviceStorage(copy.storage, deviceStorage()) || copy.clientId !== curId || copy.recordId !== draftRecordId)); } catch (_) {}
  draftKeptAt = null; draftLastJSON = null;
}
async function offerDraftRecovery() {
  let copy;
  try { copy = readDraftCopies().sort((a, b) => stamp(b.copiedAt) - stamp(a.copiedAt)).find(entry => sameDeviceStorage(entry.storage, deviceStorage()) && clients.some(client => client.id === entry.clientId)); } catch (_) { return; }
  if (!copy) return;
  const client = clients.find(entry => entry.id === copy.clientId), source = store;
  const records = copy.clientId === curId ? sessions : await safe(() => source.listSessions(copy.clientId), ui('無法載入復健紀錄'));
  if (store !== source) return;
  const saved = records.find(record => record.id === copy.recordId);
  const newer = saved && stamp(saved.updated) > stamp(copy.baseUpdated);
  const m = modal(`<h3>${ui('找到上次沒有儲存的紀錄')}</h3>
    <p>${esc(clientLabel(client))} · ${esc(copy.date)} · ${esc(visitLabel(copy.visit))}</p>
    <p>${esc(ui('自動暫存時間：{0}', new Date(copy.copiedAt).toLocaleString(language)))}</p>
    <p class="note">${ui('這份暫存只在此裝置的瀏覽器中，尚未儲存為病歷。')}</p>
    ${newer ? `<p class="note">${ui('原本的病歷後來有更新。繼續填寫會開啟這份暫存，請先核對內容，再決定是否儲存。')}</p>` : ''}
    <div class="row"><button type="button" class="btn app-primary" id="draftResume">${ui('繼續填寫')}</button><button type="button" class="btn" id="draftDiscard">${ui('不需要，捨棄')}</button></div>`);
  m.querySelector('#draftDiscard').onclick = () => {
    try { writeDraftCopies(readDraftCopies().filter(entry => !(sameDeviceStorage(entry.storage, copy.storage) && entry.clientId === copy.clientId && entry.copiedAt === copy.copiedAt))); } catch (_) {}
    closeModal();
  };
  m.querySelector('#draftResume').onclick = () => {
    closeModal(); curId = copy.clientId; sessions = records; patientReady = true;
    editing = clone(copy.session); beginDraftSession(editing, copy); dirty = true; view = 'edit'; editorWorkflow = null;
    rememberClient(curId); renderClients(); renderMain(); window.scrollTo(0, 0);
  };
}
function recentClientIds() {
  if (!deviceStorage()) return [];
  try {
    const data = JSON.parse(localStorage.getItem(RECENT_CLIENTS_KEY) || '{}'), key = deviceStorageKey();
    const prior = Array.isArray(data[key]) ? data[key] : [];
    const ids = [...new Set(prior.filter(id => typeof id === 'string' && clients.some(client => client.id === id)))].slice(0, 8);
    if (JSON.stringify(ids) !== JSON.stringify(prior)) { data[key] = ids; try { localStorage.setItem(RECENT_CLIENTS_KEY, JSON.stringify(data)); } catch (_) {} }
    return ids;
  } catch (_) { return []; }
}
function rememberClient(id) {
  if (!deviceStorage() || !clients.some(client => client.id === id)) return;
  const ids = [id, ...recentClientIds().filter(prior => prior !== id)].slice(0, 8);
  try {
    let data = JSON.parse(localStorage.getItem(RECENT_CLIENTS_KEY) || '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) data = {};
    data[deviceStorageKey()] = ids; localStorage.setItem(RECENT_CLIENTS_KEY, JSON.stringify(data));
  } catch (_) {}
}

const BACKUP_STATUS_KEY = 'ezrehab-backup-status-v1', BACKUP_DAY = 86400000;
function deviceBackupStatus(storage = deviceStorage()) {
  if (!storage && !store) return {};
  try {
    const data = JSON.parse(localStorage.getItem(BACKUP_STATUS_KEY) || '{}');
    const entry = data?.[deviceStorageKey(storage)];
    return { startedAt: stamp(entry?.startedAt) ? entry.startedAt : null, dismissedAt: stamp(entry?.dismissedAt) ? entry.dismissedAt : null };
  } catch (_) { return {}; }
}
function updateDeviceBackupStatus(patch, storage = deviceStorage()) {
  if (!storage && !store) return;
  try {
    let data = JSON.parse(localStorage.getItem(BACKUP_STATUS_KEY) || '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) data = {};
    data[deviceStorageKey(storage)] = { ...deviceBackupStatus(storage), ...patch };
    localStorage.setItem(BACKUP_STATUS_KEY, JSON.stringify(data));
  } catch (_) {}
}
function renderBackupStatus() {
  const status = deviceBackupStatus(), node = $('#lastBackupStatus');
  if (!status.startedAt) { node.textContent = ui('尚未備份'); return; }
  const days = Math.max(0, Math.floor((Date.now() - stamp(status.startedAt)) / BACKUP_DAY)), date = new Date(status.startedAt).toLocaleDateString(language);
  node.textContent = days === 1 ? ui('上次備份：1 天前（{0}）', date) : ui('上次備份：{0} 天前（{1}）', days, date);
}
function backupReminderDue() {
  const status = deviceBackupStatus(), now = Date.now();
  return (!status.startedAt || now - stamp(status.startedAt) > 14 * BACKUP_DAY) && (!status.dismissedAt || now - stamp(status.dismissedAt) >= 7 * BACKUP_DAY);
}
async function renderBackupReminder() {
  const slot = $('#backupReminderSlot'), source = store, clientId = curId;
  if (!slot || !deviceStorage() || !backupReminderDue()) return;
  let saved = sessions.length > 0;
  if (!saved) {
    try {
      for (const client of clients.filter(client => client.id !== clientId)) {
        if ((await source.listSessions(client.id)).length) { saved = true; break; }
      }
    } catch (_) { return; }
  }
  if (!saved || !slot.isConnected || source !== store || curId !== clientId || view !== 'dashboard' || !backupReminderDue()) return;
  slot.innerHTML = `<div class="backup-reminder" id="backupReminder"><p>${deviceBackupStatus().startedAt ? ui('此瀏覽器已超過 14 天沒有製作備份，可另存一份完整備份。') : ui('此瀏覽器尚未製作備份，可另存一份完整備份。')}</p><div class="row"><button type="button" class="btn small" data-action="backup-options">${ui('備份全部資料')}</button><button type="button" class="btn small" data-action="dismiss-backup-reminder">${ui('7 天後再提醒')}</button></div></div>`;
}
function rememberBackupDownload(storage) {
  updateDeviceBackupStatus({ startedAt: new Date().toISOString() }, storage);
  if (deviceStorageKey(storage) === deviceStorageKey()) { renderBackupStatus(); $('#backupReminder')?.remove(); }
}

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
  renderFailures();
  if (store) { renderStorageStatus(); renderCopyBtn(); renderClients(); renderMain(); }
  else renderConnect();
  window.scrollTo(0, position);
  try { localStorage.setItem('ezrehab-language', language); } catch (error) { showFailure(error, ui('語言已切換，但此瀏覽器無法記住設定。')); }
});
renderLanguage();

let commandTrigger = null, menuScroll = null, menuLast = false;
const menuItems = menu => [...menu.querySelectorAll('[role^="menuitem"]')].filter(b => !b.disabled && !b.hidden);
function closeCommandMenu(restoreFocus = false) {
  if (!commandTrigger) return;
  hideHelp();
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
        renderBackupStatus();
        commandTrigger = trigger; menuScroll = { x: scrollX, y: scrollY };
        menu.hidden = false; trigger.setAttribute('aria-expanded', 'true');
        positionCommandMenu(trigger, menu);
        const items = menuItems(menu); (menuLast ? items.at(-1) : items[0])?.focus();
        menuLast = false;
      },
      onUp() {
        hideHelp();
        menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
        if (commandTrigger === trigger) commandTrigger = null;
      }
    });
  })));
}
function renderCommands() {
  $('#languageSelect').disabled = savingSession || savingItems || !!$('#layer').firstChild;
  $('#toolbarSave').title = saveRecordHint() + ' ' + ui('快速鍵：Ctrl+S／⌘S');
  $('#fileMenu [data-action="save-session"]').title = saveRecordHint();
  commandHelp($('#fileMenu [data-action="storage-settings"]'), ui('查看或更換病歷存放的資料夾。'));
  commandHelp($('#reloadStorage'), ui('重新載入資料夾內的個案與病歷，讀取你在程式外做的修改。'));
  renderBackupStatus();
  if (!savingSession) {
    $('#toolbarSave [data-label]').textContent = ui('儲存');
    $('#fileMenu [data-action="save-session"] [data-label]').textContent = ui('儲存紀錄');
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
function saveRecordHint() {
  return store?.kind === 'folder' ? ui('將這筆紀錄與可列印的副本儲存至個案資料夾（CSV、PDF、TXT）。') : ui('將這筆紀錄留在此瀏覽器，並下載一份含可列印副本的檔案，請自行保存（ZIP，內含 CSV、PDF）。');
}
function helpDialog(shortcuts = false) {
  const contents = shortcuts ? ui`<ul class="help-steps">
    <li>Ctrl／⌘+S：儲存正在填寫的紀錄。</li>
    <li>Ctrl／⌘+O：選擇並開啟病歷資料夾。</li>
    <li>搜尋個案時，用上下方向鍵選取，Enter 開啟，Escape 關閉搜尋結果。</li>
    <li>Escape 可關閉對話框；若正在查看 ? 說明，會先隱藏說明。</li>
  </ul>` : ui`<ol class="help-steps">
    <li>從「檔案」連接病歷資料夾，並在瀏覽器詢問時允許編輯。</li>
    <li>按「新增個案」，填寫姓名與病歷號，再儲存個案。</li>
    <li>在個案畫面按「新增紀錄」，填寫日期與本次情況。</li>
    <li>勾選本次評估或復健項目，在開啟的視窗填寫，按「完成填寫」或「完成」。</li>
    <li>按「儲存」保存這筆病歷；若瀏覽器下載檔案，請確認並保存。</li>
    <li>下次在上方搜尋姓名或病歷號；點入空白搜尋可選「最近開啟」的個案。</li>
    <li>先儲存病歷，再從「匯出」選「備份全部資料」，並保存下載的備份。</li>
  </ol>`;
  const m = modal(`<h3>${shortcuts ? ui('鍵盤快速鍵') : ui('快速上手')}</h3>${contents}<div class="row"><button type="button" class="btn" id="helpClose">${ui('關閉')}</button></div>`);
  m.querySelector('#helpClose').onclick = closeModal;
}
new ResizeObserver(([entry]) => {
  document.documentElement.style.setProperty('--chrome-height', entry.target.getBoundingClientRect().height + 'px');
}).observe($('#applicationBar'));
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
    if (OLD_DEFAULT_NAMES.some(n => plan.includes(n))) return clone([...DEFAULT_PLAN.filter(p => p.copm || p.id === 'npc' || deviceItem(p.id)), LEGACY_FUNCTIONAL_ITEM]).map(({ category, ...p }) => p);
    return plan.map(p => ({ id: uid('p'), domain: '', name: p, timing: 'assessment', fields: ['Result'] }));
  }
  return plan.map(p => typeof p === 'string' ? { id: uid('p'), domain: '', name: p, timing: 'assessment', fields: ['Result'] } : p.copm ? { ...p, timing: 'bp' } : p);
}
const FIELD_TYPES = { text: '文字', number: '數值', textarea: '長文字', select: '選單' };
const trainingPlan = c => Array.isArray(c.trainingPlan) ? c.trainingPlan : TRAIN;
const itemKey = (item, kind) => kind === 'assessment' ? item.id : item.k;
const assessmentCategory = item => isUFOVAssessment(item) || item.copm || item.id === 'copm' ? 'functional'
  : item.category || (['func', 'self_report', 'ot_assessment', 'daily_task', 'participation'].includes(item.id) ? 'functional' : 'visual');
const assessmentCategoryLabel = category => category === 'functional' ? ui('功能表現') : ui('視覺功能');
// Keep the original two-category values readable in older CSVs and snapshots.
const ASSESSMENT_FUNCTIONS = ['visual', 'functional', 'motor', 'daily', 'cognitive'];
const assessmentFunctionLabel = category => ({ visual: ui('視覺功能'), functional: ui('功能性視覺'), motor: ui('動作功能'), daily: ui('日常生活功能'), cognitive: ui('認知功能') })[category];
const assessmentPeriodLabel = period => period === 'short' ? ui('短期指標') : ui('長期指標');
function assessmentFunction(item) {
  if (isUFOVAssessment(item)) return 'functional';
  if (item.functionCategory) return item.functionCategory;
  if (item.copm || ['copm', 'self_report', 'ot_assessment', 'daily_task', 'participation', 'ot_record'].includes(item.id)) return 'daily';
  if (['st_tug', 'st_10mwt', 'st_bbt', 'st_9hpt', 'st_cop'].includes(item.id)) return 'motor';
  if (item.id === 'st_neglect') return 'cognitive';
  if (['func', 'reading_speed', 'search_time', 'coordination_time', 'st_search', 'st_reading', 'st_coordination'].includes(item.id)) return 'functional';
  return assessmentCategory(item);
}
const assessmentPeriod = item => item.outcomePeriod || (fieldsFor(item).some(field => field.phase) ? 'short' : 'long');
const sourceNameMatches = (name, source) => typeof name === 'string' && typeof source === 'string' && (name === source || name === LABELS[source] || !!LABELS[source] && name === UI_EN[LABELS[source]]);
const isRetiredCombinedActivity = text => sourceNameMatches(text, 'Saccadic fixation');
const trainingActivityKey = text => ['Gaze stabilisation (VOR)', 'Gaze stabilisation (VOR ×1)'].some(source => sourceNameMatches(text, source)) ? 'Gaze stabilisation (VOR)' : text;
const activityLabel = text => labelText(trainingActivityKey(text));
function trainingActivityGroups(names, selected = [], scores = {}) {
  const groups = new Map();
  for (const name of names.flatMap(name => isRetiredCombinedActivity(name) ? ['Saccades', 'Fixation'] : [name])) {
    const key = activityLabel(name);
    if (!groups.has(key)) groups.set(key, []);
    if (!groups.get(key).includes(name)) groups.get(key).push(name);
  }
  return [...groups].map(([key, names]) => {
    const members = selected.filter(name => activityLabel(name) === key);
    const name = members.find(name => scores[name] != null && scores[name] !== '') || members[0] || names[0];
    return { name, members: members.length ? members : [name] };
  });
}
function assessmentSourceId(item) {
  const savedId = item.templateId || item.id;
  const key = Object.hasOwn(LEGACY_ASSESSMENT_IDS, savedId) ? LEGACY_ASSESSMENT_IDS[savedId] : savedId;
  const seeds = [...DEFAULT_PLAN, ...SOURCE_ASSESSMENTS, LEGACY_FUNCTIONAL_ITEM];
  const direct = seeds.find(seed => seed.id === key && sourceNameMatches(item.name, seed.name));
  if (direct) return direct.id;
  if (Object.hasOwn(LEGACY_ASSESSMENTS, key) && sourceNameMatches(item.name, LEGACY_ASSESSMENTS[key])) return key;
  if (key === 'func' && sourceNameMatches(item.name, 'Reading, search and eye–hand tasks')) return 'func';
  const ids = (item.fields || []).map(field => typeof field === 'string' ? field : field.id);
  const matched = seeds.find(seed => sourceNameMatches(item.name, seed.name) &&
    (sourceNameMatches(item.domain, seed.domain) || (seed.fields || []).some(field => ids.includes(typeof field === 'string' ? field : field.id))));
  if (matched) return matched.id;
  return [...SOURCE_ASSESSMENTS, LEGACY_FUNCTIONAL_ITEM].find(seed => sourceNameMatches(item.name, seed.name))?.id ||
    Object.entries(LEGACY_ASSESSMENTS).find(([, name]) => sourceNameMatches(item.name, name))?.[0] || null;
}
const isBuiltInAssessment = item => !!assessmentSourceId(item);
const isUFOVAssessment = item => ['ufov', 'src_ufov', 'ufov_speed', 'ufov_divided', 'ufov_selective'].includes(assessmentSourceId(item));
const assessmentIdentity = item => isBuiltInAssessment(item) ? ({ src_va: 'va', src_near: 'near_va', src_vf: 'vf', src_cs: 'cs', src_color: 'color', src_stereo: 'stereo', src_ufov: 'ufov' })[assessmentSourceId(item)] || assessmentSourceId(item) : item.id;
const assessmentTemplateLabel = item => {
  return labelText(ASSESSMENT_TITLES[assessmentSourceId(item)] || item.name);
};
const assessmentGroupKey = item => [assessmentPeriod(item), assessmentFunction(item), assessmentIdentity(item)].join('/');
function assessmentEditorGroups(c, s) {
  const groups = new Map();
  for (const item of assessmentItems(c, s)) {
    if (item.active === false && !hasAssessmentData(s.assess?.[item.id]) || item.copm && !COPM_VISITS.includes(s.visit) || ['src_other', 'func'].includes(assessmentSourceId(item))) continue;
    const key = assessmentGroupKey(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups].map(([key, items]) => {
    const preferred = editorWorkflow?.key === workflowKey() ? editorWorkflow.assessmentPrimaries?.get(key) : null;
    const selected = items.find(item => s.assess?.[item.id]?.done);
    const primary = items.find(item => item.id === preferred && (!selected || s.assess?.[item.id]?.done)) || selected || items.find(item => hasAssessmentData(s.assess?.[item.id])) || items[0];
    return { key, primary, members: items.filter(item => item === primary || hasAssessmentData(s.assess?.[item.id])), planned: items.some(item => isPlanned(item, s.visit)) };
  });
}
const visualAssessmentRank = item => {
  const rank = isBuiltInAssessment(item) ? VISUAL_ASSESSMENT_ORDER.indexOf(assessmentIdentity(item)) : -1;
  return rank < 0 ? VISUAL_ASSESSMENT_ORDER.length : rank;
};
const hasAssessmentData = a => !!(a && (a.done || a.notes || a.resultRef || a.copm?.length || Object.keys(a.values || {}).length));
const hasTrainingData = d => !!(d && (d.on || d.acts?.length || d.eyedot?.length || d.program || d.dur != null || d.level || d.perf || d.diff != null || d.notes || Object.keys(d.values || {}).length || Object.keys(d.actScores || {}).length || Object.keys(d.actScoreRefs || {}).length || d.runs?.length));
// Items without an explicit choice stay in the initial assessment, as before this setting existed.
const isInitial = item => item.initial !== false;
// Baseline lists the initial items; later assessment visits list the initial items that are due by timing.
const isPlanned = (item, visit) => visit === 'baseline' ? isInitial(item)
  : isDue(item.timing || 'assessment', visit) && (!isAssessVisit(visit) || isInitial(item));
// One score per activity, e.g. "Saccadic fixation: 74%".
const actSummary = d => (d.acts || []).map(a => { const v = d.actScores?.[a], run = d.actScoreRefs?.[a], index = d.runs?.findIndex(r => r.id === run) ?? -1;
  return labelText(a) + (v != null && v !== '' ? ui('：') + v : '') + (run ? ' (' + (index >= 0 ? ui('引用測驗紀錄 {0}', index + 1) : ui('來源已移除或本次未施測')) + ')' : ''); }).join(ui('、'));
const VF_FIELDS = ['OD', 'OS', 'OU'].flatMap(eye => ['superior', 'inferior', ...(eye === 'OU' ? ['left', 'right'] : ['nasal', 'temporal'])]
  .map(direction => ({ id: eye.toLowerCase() + '_' + direction, label: eye + ' ' + direction, type: 'text' })));
const isVisualField = item => (item.id === 'vf' && item.name === 'Visual field') || (item.id === 'src_vf' && item.name === 'Visual field (source workbook)');
function fieldsFor(item) {
  const fields = (item.fields || []).map(f => typeof f === 'string' ? { id: f, label: f, type: 'text' } : f);
  return item.id === 'vf' && isVisualField(item) ? [...fields, ...VF_FIELDS.filter(f => !fields.some(existing => existing.id === f.id))] : fields;
}
const phaseLabel = phase => labelText(SHORT_PHASES[phase] || phase);
const fieldLabel = f => (f.phase ? ui('{0}：{1}', phaseLabel(f.phase), labelText(f.label)) : labelText(f.label)) + (f.unit ? `（${f.unit}）` : '');
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
function assessmentItems(c, s) {
  const items = itemsFor(c, s, 'assessment');
  if (items.some(item => assessmentSourceId(item) === 'func')) for (const seed of FUNCTIONAL_ASSESSMENTS) {
    if (!items.some(item => assessmentSourceId(item) === seed.id)) items.push({ ...clone(seed), initial: false });
  }
  return items;
}
const trainingItems = (c, s) => itemsFor(c, s, 'training');
const trainingEditorItems = (c, s) => trainingItems(c, s).filter(t => t.active !== false || hasTrainingData(s.training?.[t.k]));
const trainingLinkId = key => 'rehab:' + key;
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
    const accessible = f.phase ? `aria-label="${esc(fieldLabel(f))}"` : '';
    let input;
    if (type === 'textarea') input = `<textarea id="${id}" ${accessible}>${val(value)}</textarea>`;
    else if (type === 'select') {
      const options = [...new Set([...(f.options || []), ...(hasValue(value) ? [String(value)] : [])])];
      input = ui`<select id="${id}" ${accessible}><option value="">請選擇</option>${options.map(option => `<option value="${esc(option)}" ${String(value) === option ? 'selected' : ''}>${esc(labelText(option))}</option>`).join('')}</select>`;
    } else input = `<input type="${type === 'number' ? 'number' : 'text'}" id="${id}" ${accessible} value="${val(value)}" ${type === 'number' ? `step="${val(f.step ?? 'any')}" ${f.min != null ? `min="${val(f.min)}"` : ''} ${f.max != null ? `max="${val(f.max)}"` : ''}` : ''}>`;
    return { f, html: `<label class="f" for="${id}">${esc(fieldLabel({ ...f, phase: undefined }))}${input}</label>` };
  });
  const directions = isVisualField(item) ? boxes.filter(b => VF_FIELDS.some(f => f.label === b.f.label)) : [];
  const cross = directions.length === 12 ? `<div class="vf-entry"><div class="vf-eyes">${[
    ['OD', ui('右眼（OD）'), 'temporal', 'nasal'], ['OS', ui('左眼（OS）'), 'nasal', 'temporal'], ['OU', ui('雙眼（OU）'), 'right', 'left']
  ].map(([eye, name, left, right]) => `<fieldset class="vf-eye"><legend>${esc(name)}${eye === 'OD' ? helpHTML(ui('視野'), ui('依面對病人的方向排列；雙眼的左、右以病人為準。可填角度或質性描述，空白代表未記錄。')) : ''}</legend><div class="vf-cross">${[
    ['superior', 'top'], [left, 'left'], [right, 'right'], ['inferior', 'bottom']
  ].map(([direction, position]) => directions.find(b => b.f.label === eye + ' ' + direction).html.replace('class="f"', `class="f vf-${position}"`)).join('')}<span class="vf-center" aria-hidden="true">${eye}</span></div></fieldset>`).join('')}</div></div>` : '';
  const settings = boxes.filter(b => b.f.group === 'setting');
  const phases = [...new Set(boxes.filter(b => b.f.phase && b.f.group !== 'setting').map(b => b.f.phase))];
  const stages = phases.map(phase => {
    const contents = `<div class="grid">${boxes.filter(b => b.f.phase === phase && b.f.group !== 'setting').map(b => b.html).join('')}</div>`;
    return ['pre', 'post'].includes(phase)
      ? `<fieldset class="short-stage"><legend>${esc(phaseLabel(phase))}</legend>${contents}</fieldset>`
      : `<details class="settings short-stage" ${boxes.some(b => b.f.phase === phase && hasValue(values[b.f.id])) ? 'open' : ''}><summary>${esc(phaseLabel(phase))}</summary>${contents}</details>`;
  }).join('');
  const count = settings.filter(b => hasValue(values[b.f.id])).length;
  return cross + stages + boxes.filter(b => !b.f.phase && b.f.group !== 'setting' && (!cross || !directions.includes(b))).map(b => b.html).join('') + (settings.length
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
const MEASUREMENT_REFERENCES = {
  npc: { source: 'st_npc', fields: [['NPC break (cm)', 'Mean NPC break (cm)'], ['NPC recovery (cm)', 'Mean NPC recovery (cm)']] },
  reading_speed: { source: 'st_reading', fields: [['Reading speed (characters/min)', 'Reading speed (characters/min or words/min)']] },
  search_time: { source: 'st_search', fields: [['Completion time (s)', 'Completion time (s)']] },
  coordination_time: { source: 'st_coordination', fields: [['Reaction time (ms)', 'Reaction time (ms)']] }
};
function measurementReferenceFields(target, source, phase) {
  const mapping = MEASUREMENT_REFERENCES[assessmentSourceId(target)];
  if (!mapping || assessmentSourceId(source) !== mapping.source || !Object.hasOwn(SHORT_PHASES, phase)) return [];
  return mapping.fields.map(([to, from]) => [fieldsFor(target).find(f => !f.phase && sourceNameMatches(f.label, to)),
    fieldsFor(source).find(f => f.phase === phase && sourceNameMatches(f.label, from))]).filter(([to, from]) => to && from);
}
function measurementReferenceText(c, s, item) {
  const ref = s.assess?.[item.id]?.resultRef;
  if (!ref) return '';
  const source = assessmentItems(c, s).find(p => p.id === ref.item);
  const contextField = source && fieldsFor(source).find(f => f.phase === ref.phase && sourceNameMatches(f.label, 'Measurement time / equivalent form'));
  const context = contextField && s.assess[source.id]?.values?.[contextField.id];
  return source ? ui('引用：{0}／{1}', assessmentTemplateLabel(source), phaseLabel(ref.phase)) + (context ? ' · ' + context : '') : ui('來源已移除或本次未施測');
}
function measurementReferenceHTML(c, s, item) {
  const mapping = MEASUREMENT_REFERENCES[assessmentSourceId(item)];
  if (!mapping) return '';
  const ref = s.assess?.[item.id]?.resultRef;
  const options = assessmentItems(c, s).filter(p => assessmentSourceId(p) === mapping.source && s.assess?.[p.id]?.done)
    .flatMap(source => Object.keys(SHORT_PHASES).filter(phase => measurementReferenceFields(item, source, phase).length)
      .map(phase => ({ value: source.id + '/' + phase, text: ui('引用：{0}／{1}', assessmentTemplateLabel(source), phaseLabel(phase)) })));
  const selected = ref ? ref.item + '/' + ref.phase : '';
  return ui`<div class="measurement-reference"><div class="f"><div class="field-label"><label for="measure-ref-${item.id}">結果來源</label>${helpHTML(ui('結果來源'), options.length ? ui('僅引用對應結果欄位；其他欄位仍可自行填寫。') : ui('請先勾選並填寫本次對應的短期評估。'))}</div><select id="measure-ref-${item.id}" data-measurement-ref="${item.id}">
    <option value="">自行填寫（保留目前數值）</option>${selected && !options.some(option => option.value === selected) ? `<option value="${esc(selected)}" selected>${ui('來源已移除或本次未施測')}</option>` : ''}
    ${options.map(option => `<option value="${esc(option.value)}" ${option.value === selected ? 'selected' : ''}>${esc(option.text)}</option>`).join('')}</select></div>
    ${assessmentSourceId(item) === 'reading_speed' && selected ? `<label class="pick"><input type="checkbox" data-reference-unit="${item.id}" ${ref?.unit === 'characters/min' ? 'checked' : ''}>${ui('已確認來源閱讀速度使用字／分')}</label>` : ''}
    <p class="note" data-measurement-status="${item.id}" aria-live="polite"></p></div>`;
}
function applyMeasurementReferences(c, s) {
  const items = assessmentItems(c, s);
  for (const target of items) {
    const data = s.assess?.[target.id], ref = data?.resultRef;
    if (!ref) continue;
    const source = items.find(p => p.id === ref.item), available = source && s.assess[source.id]?.done;
    if (!source) continue;
    data.values = { ...data.values };
    for (const [to, from] of measurementReferenceFields(target, source, ref.phase)) {
      const value = s.assess[source.id]?.values?.[from.id];
      if (available && hasValue(value) && (to.type !== 'number' || Number.isFinite(Number(value)))) data.values[to.id] = to.type === 'number' ? Number(value) : String(value);
      else delete data.values[to.id];
    }
  }
  for (const data of Object.values(s.training || {})) for (const [act, runId] of Object.entries(data.actScoreRefs || {})) {
    const run = data.runs?.find(r => r.id === runId), value = run && run.values?.[run.item.startsWith('ufov_') ? 'final_threshold_rt_ms' : 'accuracy_rate'];
    data.actScores = { ...data.actScores };
    if (hasValue(value) && Number.isFinite(Number(value)) && Number(value) >= 0 && (run.item.startsWith('ufov_') || Number(value) <= 100)) data.actScores[act] = value + (run.item.startsWith('ufov_') ? ' ms' : '%');
    else delete data.actScores[act];
  }
  return s;
}
function validateMeasurementReferences(c, s) {
  const id = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value);
  const items = assessmentItems(c, s);
  for (const target of items) {
    const data = s.assess?.[target.id], ref = data?.resultRef;
    if (ref === undefined) continue;
    if (!ref || typeof ref !== 'object' || Array.isArray(ref) || !id(ref.item) || !Object.hasOwn(SHORT_PHASES, ref.phase) || ref.unit !== undefined && ref.unit !== 'characters/min') throw new Error(ui('量測引用格式錯誤'));
    if (s.visit !== 'absent' && data.done && assessmentSourceId(target) === 'reading_speed' && ref.unit !== 'characters/min') throw new Error(ui('引用閱讀速度前，請確認來源使用字／分；words/min 請使用相同單位的自訂指標。'));
    const source = items.find(p => p.id === ref.item);
    if (!source || !measurementReferenceFields(target, source, ref.phase).length || (s.visit !== 'absent' && data.done && !s.assess[source.id]?.done)) throw new Error(ui('引用的量測來源無法使用，請重新選擇來源或改為自行填寫。'));
    if (measurementReferenceFields(target, source, ref.phase).some(([to, from]) => to.type === 'number' && hasValue(s.assess[source.id]?.values?.[from.id]) && !Number.isFinite(Number(s.assess[source.id].values[from.id])))) throw new Error(ui('量測引用格式錯誤'));
  }
  for (const data of Object.values(s.training || {})) {
    if (data.actScoreRefs === undefined) continue;
    if (!data.actScoreRefs || typeof data.actScoreRefs !== 'object' || Array.isArray(data.actScoreRefs) || Object.entries(data.actScoreRefs).some(([act, runId]) => !act.trim() || !id(runId))) throw new Error(ui('量測引用格式錯誤'));
    for (const [act, runId] of Object.entries(data.actScoreRefs)) {
      const run = data.runs?.find(r => r.id === runId);
      const value = run?.values?.[run.item.startsWith('ufov_') ? 'final_threshold_rt_ms' : 'accuracy_rate'];
      if (hasValue(value) && (!Number.isFinite(Number(value)) || Number(value) < 0 || (!run.item.startsWith('ufov_') && Number(value) > 100))) throw new Error(ui('量測引用格式錯誤'));
      if (s.visit !== 'absent' && data.on && data.acts?.includes(act) && (!run || !sourceNameMatches(act, RUN_ACTS[run.item]))) throw new Error(ui('此活動的來源測驗已移除，請重新選擇或改為自行填寫。'));
    }
  }
  applyMeasurementReferences(c, s);
}
function setupMeasurementReferences(form = $('#soapForm'), read = collectSession) {
  if (!form) return;
  const refresh = event => {
    if (!form.isConnected || !editing || view !== 'edit') return;
    const s = read(), items = assessmentItems(cur(), s);
    for (const target of items) {
      const select = form.querySelector(`[data-measurement-ref="${target.id}"]`);
      if (!select) continue;
      const focused = document.activeElement === select;
      const ref = s.assess?.[target.id]?.resultRef, source = items.find(p => p.id === ref?.item);
      if ((!focused && document.activeElement?.dataset.referenceUnit !== target.id) || event?.target === select) {
        const holder = document.createElement('div'); holder.innerHTML = measurementReferenceHTML(cur(), s, target);
        select.closest('.measurement-reference').replaceWith(holder.firstElementChild);
        if (focused) form.querySelector(`[data-measurement-ref="${target.id}"]`).focus({ preventScroll: true });
      }
      for (const [to] of source ? measurementReferenceFields(target, source, ref.phase) : []) {
        const input = $('#af-' + target.id + '-' + fieldsFor(target).findIndex(f => f.id === to.id));
        if (input) input.value = s.assess[target.id].values?.[to.id] ?? '';
      }
      for (const [label] of MEASUREMENT_REFERENCES[assessmentSourceId(target)].fields) {
        const index = fieldsFor(target).findIndex(f => sourceNameMatches(f.label, label));
        const input = $('#af-' + target.id + '-' + index); if (input) input.readOnly = !!ref;
      }
      const status = form.querySelector(`[data-measurement-status="${target.id}"]`);
      if (status) status.textContent = ref && !s.assess?.[ref.item]?.done ? ui('引用的量測來源無法使用，請重新選擇來源或改為自行填寫。') : measurementReferenceText(cur(), s, target);
    }
    for (const t of trainingItems(cur(), s).filter(t => RUN_ITEMS[t.k])) {
      const data = s.training[t.k] || {}, runs = data.runs || [];
      for (const chip of form.querySelectorAll(`#tx-${t.k}-acts [data-act]`)) {
        const act = chip.dataset.act, row = $('#' + chip.dataset.score), input = row?.querySelector('input'); if (!row || !input) continue;
        let sourceBox = document.getElementById(row.id + '-source');
        if (!sourceBox) { sourceBox = document.createElement('div'); sourceBox.id = row.id + '-source'; sourceBox.className = 'activity-source'; row.after(sourceBox); }
        sourceBox.hidden = !chip.checked;
        const selected = data.actScoreRefs?.[act] || '', options = runs.filter(r => sourceNameMatches(act, RUN_ACTS[r.item]));
        const selectId = row.id + '-source-select';
        const focused = document.activeElement?.id === selectId;
        if (!sourceBox.contains(document.activeElement) || event?.target?.id === selectId) sourceBox.innerHTML = ui`<label class="f" for="${selectId}">活動表現來源<select id="${selectId}" aria-label="${esc(ui('{0}的表現來源', activityLabel(act)))}" data-activity-ref="${esc(act)}" data-training="${t.k}"><option value="">自行填寫</option>
          ${selected && !options.some(run => run.id === selected) ? `<option value="${esc(selected)}" selected>${ui('來源已移除或本次未施測')}</option>` : ''}
          ${options.map(run => `<option value="${esc(run.id)}" ${run.id === selected ? 'selected' : ''}>${esc(ui('測驗紀錄 {0}：{1}{2}', runs.indexOf(run) + 1, labelText(deviceItem(run.item).name), run.time ? ' ' + run.time : ''))}</option>`).join('')}</select></label>
          ${selected ? `<button type="button" class="btn small" data-open-result-run="${esc(selected)}">${ui('開啟來源測驗')}</button>` : ''}`;
        if (focused) document.getElementById(selectId).focus({ preventScroll: true });
        input.readOnly = !!selected;
        if (selected) input.value = data.actScores?.[act] ?? '';
      }
    }
  };
  if (!form.dataset.measurementReferences) {
    form.dataset.measurementReferences = 'true';
    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    form.addEventListener('click', event => {
      const button = event.target.closest('[data-open-result-run]'); if (!button) return;
      const run = form.querySelector(`[data-run="${button.dataset.openResultRun}"]`);
      if (run) navigateEditor(run);
    });
  }
  refresh();
}
function setSectionEnabled(box, enabled) {
  box.hidden = !enabled;
  box.querySelectorAll('input, select, textarea').forEach(el => {
    if (enabled && el.dataset.sectionDisabled) { el.disabled = false; delete el.dataset.sectionDisabled; }
    else if (!enabled && !el.disabled) { el.disabled = true; el.dataset.sectionDisabled = 'true'; }
  });
}

const rowTotal = r => { let t = 0, h = false; for (const k of SK) { const v = r?.scores?.[k]; if (v != null) { t += v; h = true; } } return h ? t : null; };
const symRatedCount = r => SK.filter(k => r?.scores?.[k] != null).length;
const sameSymptomSet = (a, b) => symRatedCount(a) > 0 && SK.every(k => (a?.scores?.[k] != null) === (b?.scores?.[k] != null));
const symptomChange = (a, b) => sameSymptomSet(a, b) ? rowTotal(b) - rowTotal(a) : null;
const symptomRatingText = r => `${rowTotal(r) ?? '–'} · ${ui('已評 {0}/5', symRatedCount(r))}`;
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
    const c = s.assess?.copm; if (c?.done) { const a = copmAvg(c.copm); if (a.perf != null || a.sat != null) found = { ...a, date: s.date, rows: c.copm || [] }; }
  }
  return found;
}
function copmComparison(rows, baseline) {
  const current = (rows || []).filter(r => r.occ?.trim() || r.perf != null || r.sat != null), prior = (baseline?.rows || []).filter(r => r.occ?.trim() || r.perf != null || r.sat != null);
  const counts = items => ({ perf: items.filter(r => r.perf != null).length, sat: items.filter(r => r.sat != null).length });
  const signature = (items, metric) => items.map(r => JSON.stringify([r.occ?.trim() || '', metric ? r[metric] != null : true])).sort().join('|');
  const activitiesMatch = !!baseline && current.length > 0 && current.every(r => r.occ?.trim()) && signature(current) === signature(prior);
  const average = copmAvg(current), rated = counts(current), baseRated = counts(prior);
  const compatible = activitiesMatch && ['perf', 'sat'].every(metric => signature(current, metric) === signature(prior, metric));
  const delta = metric => compatible && rated[metric] > 0
    ? Math.round((average[metric] - baseline[metric]) * 10) / 10 : null;
  const perf = delta('perf'), sat = delta('sat');
  const warning = baseline && !compatible ? ui('活動或評分項目不一致，未計算基準差異。') : '';
  return { perf, sat, warning, rated, baseRated };
}
const COPM_VISITS = ['baseline', 'post'];

const LEGACY_REMEDIATION_LABELS = {
  inperson: { ocular_sol: 'Oculomotor training (Sol)', visual_perception: 'Visual perception', paper_exercises: 'Paper-based visual exercises' },
  telerehab: { ocular_remote: 'Oculomotor training (Tobii / webcam)', visual_processing: 'Visual processing training', home_modules: 'Home-based practice modules' }
};
const peoLabel = key => ({ person: ui('個人'), environment: ui('環境'), occupation: ui('作業') })[key] || key;
function clinicalInterventionLabel(id, s) {
  for (const [mode, approaches] of Object.entries(INTERVENTIONS)) for (const [approach, items] of Object.entries({ remediation: LEGACY_REMEDIATION_LABELS[mode], ...approaches })) {
    if (Object.hasOwn(items, id)) return [serviceModeLabel(mode), approach === 'remediation' ? ui('復能') : approachLabel(approach), labelText(items[id])].join(' / ');
  }
  if (id === 'eyedot_trainer') return ui('復能') + ' / EyeDot Trainer';
  if (id.startsWith('rehab:')) {
    const key = id.slice(6), item = (s?.trainingPlan || []).find(t => t.k === key) || trainingItems(cur(), s).find(t => t.k === key);
    return ui('復能') + ' / ' + labelText(item?.label || key);
  }
  const approach = ['adaptation', 'compensation'].find(key => s?.interventions?.[key]?.custom?.some(item => item.id === id));
  return approach ? approachLabel(approach) + ' / ' + strategyLabel(approach, id, s) : id;
}
function clinicalEvidenceText(c, s, ids, compact = false) {
  const items = assessmentItems(c, s);
  return ids.map(id => {
    const item = items.find(item => item.id === id), data = s.assess?.[id];
    if (!item) return id + ui('：') + ui('本次紀錄找不到此評估');
    const name = assessmentTemplateLabel(item);
    if (!data?.done) return name + ui('：') + ui('本次未勾選施測');
    let results = item.copm ? (data.copm || []).map(row => [row.occ, ui('表現') + ' ' + (row.perf ?? '-'), ui('滿意度') + ' ' + (row.sat ?? '-')].join(' / '))
      : resultEntries(item, data.values).map(([label, value]) => label + ui('：') + value);
    const fields = fieldsFor(item);
    if (compact && fields.some(f => f.phase)) {
      const measures = fields.filter(f => f.phase && f.group !== 'setting' && f.label !== 'Measurement time / equivalent form' && f.label !== LABELS['Measurement time / equivalent form'] && hasValue(data.values?.[f.id]));
      results = [...new Set(measures.map(f => f.phase))].map(phase => phaseLabel(phase) + ui('：') + measures.filter(f => f.phase === phase)
        .map(f => fieldLabel({ ...f, phase: undefined }) + ui('：') + shownValue(f, data.values[f.id])).join(ui('、')));
      const extra = Object.fromEntries(Object.entries(data.values || {}).filter(([id]) => !fields.some(f => f.id === id && (f.phase || f.group === 'setting'))));
      results.push(...resultEntries({ fields: fields.filter(f => !f.phase && f.group !== 'setting') }, extra).map(([label, value]) => label + ui('：') + value));
    }
    const reference = measurementReferenceText(c, s, item);
    if (reference) results.push(reference);
    const notes = clinicalAssessmentNotes(data, s);
    if (notes) results.push(ui('備註') + ui('：') + notes);
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
    ui('介入處置') + ui('：') + (link.interventions.length ? link.interventions.map(id => clinicalInterventionLabel(id, s)).join(ui('；')) : link.interventionNotes ? '' : ui('尚未記錄介入處置')),
    ...(link.interventionNotes ? [link.interventionNotes] : []), ''
  ]);
}
function readClinicalLinks() {
  return [...document.querySelectorAll('#clinicalLinks [data-clinical-link]')].map(row => {
    const text = key => row.querySelector(`[data-clinical="${key}"]`).value;
    const prior = editing.clinicalLinks?.find(link => link.id === row.dataset.id);
    const picks = key => {
      const checked = [...row.querySelectorAll(`[data-clinical="${key}"]:checked`)].map(input => input.value);
      return [...(prior?.[key] || []).filter(id => checked.includes(id)), ...checked.filter(id => !prior?.[key]?.includes(id))];
    };
    return { ...clone(prior || {}), id: row.dataset.id, category: text('category'), symptom: prior?.subjectiveRef ? $('#s-subj').value : text('symptom'), reasoning: text('reasoning'),
      ...(prior?.subjectiveRef ? { subjectiveRef: true } : {}),
      peo: picks('peo'), evidence: picks('evidence'), evidenceNotes: text('evidenceNotes'), interventions: picks('interventions'), interventionNotes: text('interventionNotes') };
  });
}
const clinicalLinkOpenState = () => new Map([...document.querySelectorAll('#clinicalLinks [data-clinical-link]')].map(row => [row.dataset.id, [...row.querySelectorAll(':scope > details')].map(details => details.open)]));
function renderClinicalLinks(s, open = clinicalLinkOpenState()) {
  const c = cur(), links = s.clinicalLinks || [];
  const periods = ['short', 'long'].map(period => ({ period, groups: ASSESSMENT_FUNCTIONS.map(category => ({ category, groups: assessmentChoices(c, s, category, period) })).filter(group => group.groups.length) }));
  const choices = periods.flatMap(period => period.groups.flatMap(group => group.groups.map(g => g.primary)));
  const training = trainingEditorItems(c, s);
  const strategies = Object.fromEntries(['adaptation', 'compensation'].map(approach => [approach, strategyChoices(s.mode, approach, s.interventions?.[approach]?.picks, s)]));
  const available = [...training.map(t => trainingLinkId(t.k)), ...Object.values(strategies).flat().map(item => item.id)];
  const box = $('#clinicalLinks');
  box.innerHTML = links.length ? links.map((link, index) => {
    const prefix = 'cl-' + index;
    const check = (key, id, label, status = '') => `<label class="pick"><input type="checkbox" data-clinical="${key}" value="${esc(id)}" ${link[key].includes(id) ? 'checked' : ''}><span data-choice-label>${esc(label)}</span>${status ? `<small data-evidence-state><span aria-hidden="true">✓ </span>${esc(status)}</small>` : ''}</label>`;
    const legacy = (key, ids, label) => ids.length ? `<section class="clinical-legacy" data-legacy="${key}"><h4>${ui('先前紀錄的項目')}</h4><div class="pick-group">${ids.map(id => check(key, id, label(id))).join('')}</div></section>` : '';
    return ui`<fieldset class="clinical-link" data-clinical-link data-index="${index}" data-id="${esc(link.id)}">
      <legend>${ui('症狀連結 {0}', index + 1)}</legend>
      <div class="row"><button type="button" class="btn small danger" data-action="clinical-link-del" data-index="${index}" aria-label="${esc(ui('移除症狀連結 {0}', index + 1))}">移除</button></div>
      <div class="clinical-link-grid">
        <div class="f"><div class="field-label"><label for="${prefix}-symptom">主要症狀／功能困難</label>${link.subjectiveRef ? helpHTML(ui('主觀描述'), ui('問題由主觀描述建立；後續推理與處置在此填寫，不需另抄到整體補充。')) : ''}</div><input id="${prefix}-symptom" type="text" data-clinical="symptom" value="${val(link.subjectiveRef ? s.subjective : link.symptom)}" ${link.subjectiveRef ? 'readonly' : ''} ${s.visit === 'absent' ? '' : 'required'} placeholder="記錄病人的症狀或受影響的日常活動"></div>
        ${link.subjectiveRef ? ui`<div class="subjective-reference"><button type="button" class="btn small" data-needs="draft" data-unlink-subjective="${esc(link.id)}">改為自行填寫問題</button></div>` : ''}
        <label class="f" for="${prefix}-category">症狀分類<select id="${prefix}-category" data-clinical="category">${['visual', 'functional'].map(category => `<option value="${category}" ${link.category === category ? 'selected' : ''}>${assessmentCategoryLabel(category)}</option>`).join('')}</select></label>
        <fieldset class="clinical-domain"><legend>推理面向</legend><div class="pick-group">${['person', 'environment', 'occupation'].map(key => check('peo', key, peoLabel(key))).join('')}</div></fieldset>
        <label class="f clinical-link-reasoning" for="${prefix}-reasoning">針對此症狀的臨床推理<textarea id="${prefix}-reasoning" data-clinical="reasoning" placeholder="說明評估發現如何影響個人、環境與作業的契合">${val(link.reasoning)}</textarea></label>
      </div>
      <details ${open.get(link.id)?.[0] ? 'open' : ''}><summary>連結本次評估 (${ui('已選 {0} 項', link.evidence.length)})</summary>
        ${periods.filter(p => p.groups.length).map(({ period, groups }) => `<section data-evidence-period="${period}"><h5>${period === 'short' ? ui('短期成效') : ui('長期評估')}</h5>${groups.map(({ category }) => `<section data-evidence-function="${category}"><h6>${assessmentFunctionLabel(category)}</h6>${pickGroups(assessmentSelectionGroups(c, s, category, period).map(group => ({ ...group, id: prefix + '-' + group.id, items: group.groups.map(({ primary: p }) => check('evidence', p.id, assessmentTemplateLabel(p), s.assess?.[p.id]?.done ? ui('本次已施測') : '')) })))}</section>`).join('')}</section>`).join('')}
        ${legacy('evidence', link.evidence.filter(id => !choices.some(p => p.id === id)), id => { const item = assessmentItems(c, s).find(p => p.id === id); return item ? labelText(item.name) : id; })}
        <label class="f" for="${prefix}-evidenceNotes">其他依據與觀察<textarea id="${prefix}-evidenceNotes" data-clinical="evidenceNotes" placeholder="記錄主訴、觀察、來源日期或推理依據">${val(link.evidenceNotes)}</textarea></label>
      </details>
      <div class="clinical-evidence-preview" aria-live="polite"></div>
      <details ${open.get(link.id)?.[1] ? 'open' : ''}><summary>選擇介入處置 (${ui('已選 {0} 項', link.interventions.length)})</summary>
        <div class="row"><span>${ui('服務型態')}${ui('：')}${esc(serviceModeLabel(s.mode))}</span><button type="button" class="btn small" data-clinical-focus="s-mode">變更服務型態</button></div>
        <section class="clinical-approach" data-link-approach="remediation"><h4>${ui('復能')}</h4><div class="pick-group">${training.map(t => check('interventions', trainingLinkId(t.k), labelText(t.label))).join('')}</div></section>
        ${['adaptation', 'compensation'].map(approach => `<section class="clinical-approach" data-link-approach="${approach}"><h4>${approachLabel(approach)}</h4><div class="pick-group">${strategies[approach].map(item => check('interventions', item.id, item.label)).join('')}</div></section>`).join('')}
        ${legacy('interventions', link.interventions.filter(id => !available.includes(id)), id => clinicalInterventionLabel(id, s))}
      </details>
      <label class="f" for="${prefix}-interventionNotes">此症狀的處置內容與目標<textarea id="${prefix}-interventionNotes" data-clinical="interventionNotes" placeholder="記錄實際處置、劑量、居家安排或待確認的計畫">${val(link.interventionNotes)}</textarea></label>
    </fieldset>`;
  }).join('') : '';
  $('[data-action="clinical-link-add"]').disabled = links.length >= 100;
  updateClinicalEvidence();
}
function syncClinicalSelections(source) {
  if (source.dataset.clinical === 'interventions' && source.checked) {
    const item = trainingEditorItems(cur(), editing).find(t => trainingLinkId(t.k) === source.value);
    if (item) {
      $('#tx-' + item.k + '-on').checked = true;
      editing = collectSession();
      $('#tx-summary-' + item.k).outerHTML = trainingSummaryHTML(item, editing);
    }
    for (const approach of ['adaptation', 'compensation']) {
      const picks = interventionPicks(approach);
      const available = [...$('#' + approach + 'Picks').querySelectorAll('[data-strategy]')].some(input => input.dataset.strategy === source.value);
      if (available && !picks.includes(source.value)) $('#' + approach + 'Picks').innerHTML = interventionHTML($('#s-mode').value, approach, [...picks, source.value], collectSession());
    }
  } else if (source.dataset.strategy && !source.checked) {
    if (blockLinkedUntick(source.dataset.strategy, source)) return;
  }
  if (source.dataset.strategy) renderClinicalLinks(collectSession());
  else if (!source.checked && source.closest('[data-legacy]')) { editing = collectSession(); renderClinicalLinks(editing); }
  else updateClinicalEvidence();
}
function blockLinkedUntick(id, source, training = false) {
  const rows = [...document.querySelectorAll('#clinicalLinks [data-clinical-link]')].filter(row => [...row.querySelectorAll('[data-clinical="interventions"]:checked')].some(input => input.value === id));
  if (!rows.length) return false;
  source.checked = true;
  const m = modal(`<h3>${ui('前往相關問題')}</h3><p>${training ? ui('此復健項目已連結下列問題，請在問題內解除連結。') : ui('此策略已連結下列問題，請在問題內解除連結。')}</p><div class="linked-problems">${rows.map(row => `<button type="button" class="btn" data-linked-problem="${esc(row.querySelector('[data-clinical="symptom"]').id)}">${esc(row.querySelector('[data-clinical="symptom"]').value || row.querySelector('legend').textContent)}</button>`).join('')}</div>`);
  m.querySelectorAll('[data-linked-problem]').forEach(button => button.onclick = () => { const target = button.dataset.linkedProblem; closeModal(); navigateEditor(document.getElementById(target)); });
  return true;
}
function updateClinicalEvidence() {
  if (!$('#clinicalLinks')) return;
  const s = collectSession();
  document.querySelectorAll('#clinicalLinks [data-clinical-link]').forEach((row, index) => {
    const link = s.clinicalLinks[index], lines = clinicalEvidenceText(cur(), s, link.evidence);
    if (link.subjectiveRef) row.querySelector('[data-clinical="symptom"]').value = s.subjective;
    const preview = row.querySelector('.clinical-evidence-preview'), wasOpen = preview.querySelector('details')?.open;
    const summariesText = clinicalEvidenceText(cur(), s, link.evidence, true);
    preview.innerHTML = lines.length ? `<ul>${summariesText.map(line => `<li>${esc(line.length > 220 ? line.slice(0, 220) + '…' : line)}</li>`).join('')}</ul><details ${wasOpen ? 'open' : ''}><summary>${ui('查看完整評估依據')}</summary><ul>${lines.map(line => `<li>${esc(line)}</li>`).join('')}</ul></details>` : '';
    const summaries = row.querySelectorAll(':scope > details > summary');
    summaries[0].textContent = ui('連結本次評估') + ' (' + ui('已選 {0} 項', link.evidence.length) + ')';
    summaries[1].textContent = ui('選擇介入處置') + ' (' + ui('已選 {0} 項', link.interventions.length) + ')';
  });
}
document.addEventListener('click', e => {
  const button = e.target.closest('[data-clinical-focus]'); if (!button) return;
  document.getElementById(button.dataset.clinicalFocus)?.focus();
});
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
      text(link.reasoning, ui('尚未填寫推理')) + (link.peo.length ? `<p class="clinical-domains">${ui('相關面向：')}${link.peo.map(key => esc(peoLabel(key))).join(' / ')}</p>` : '') +
        `<div class="clinical-evidence"><h5>${ui('評估依據')}</h5>${link.evidence.length ? ul(clinicalEvidenceText(c, s, link.evidence, true)) : link.evidenceNotes ? '' : text('', ui('尚未連結評估依據'))}${link.evidenceNotes ? text(link.evidenceNotes) : ''}</div>`,
      (link.interventions.length ? ul(link.interventions.map(id => clinicalInterventionLabel(id, s))) : link.interventionNotes ? '' : text('', ui('尚未記錄介入處置'))) + (link.interventionNotes ? text(link.interventionNotes) : ''), link.id)).join('');
  } else {
    const reasoning = ['person', 'environment', 'occupation'].filter(key => s.peo?.[key]).map(key => peoLabel(key) + ui('：') + s.peo[key]);
    const interventions = trainingItems(c, s).filter(t => s.training?.[t.k]?.on).map(t => ui('復能') + ' / ' + labelText(t.label));
    for (const approach of ['adaptation', 'compensation']) {
      interventions.push(...(s.interventions?.[approach]?.picks || []).map(id => approachLabel(approach) + ' / ' + strategyLabel(approach, id, s)));
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
  const tolerability = assessments.filter(item => (item.id === 'st_tolerance' || item.domain === 'Short-term tolerability / safety' || item.domain === LABELS['Short-term tolerability / safety']) &&
    fieldsFor(item).some(f => f.phase && f.min === 0 && f.max === 10 && hasValue(s.assess[item.id].values?.[f.id])));
  const showTolerability = !ratings.length && tolerability.length;
  const latest = byDate(sessions).at(-1);
  box.innerHTML = ui`<section class="panel dashboard" id="patientDashboard">
    <div class="dashboard-head"><h3>本次狀態</h3>
      <label class="f" for="dashboard-session"><span class="sr-only">本次紀錄</span><select id="dashboard-session">${records.map(record => `<option value="${esc(record.id)}" ${record.id === s.id ? 'selected' : ''}>${esc(fmtDate(record.date))} / ${visitLabel(record.visit)} / ${record.num ?? '-'}</option>`).join('')}</select></label>
      <button class="btn small" data-action="open-session" data-id="${esc(s.id)}">開啟此筆紀錄</button>
    </div>
    <div class="dashboard-context"><span class="record-state ${s !== records[0] ? 'historical' : ''}">${s === records[0] ? ui('最近出席') : ui('歷次紀錄')}</span><span>${serviceModeLabel(s.mode)}${s.clinician ? ' / ' + esc(s.clinician) : ''}</span>${s.tolerance != null ? `<span>${ui('耐受度')} ${esc(s.tolerance)}/10</span>` : ''}${s.nextDate ? `<span>${ui('下次復健')} ${esc(fmtDate(s.nextDate))}</span>` : ''}${!s.clinicalLinks?.length ? ui('<span class="clinical-missing" role="status">尚未逐項連結</span>') : ''}${latest?.visit === 'absent' ? `<span class="clinical-missing" role="status">${ui('最近一次紀錄為缺席：{0}', esc(fmtDate(latest.date)))}</span>` : ''}</div>
    <section aria-label="症狀分數"><div class="dashboard-score-head"><h4>${showTolerability ? ui('症狀與耐受性') : ui('症狀分數')}${helpHTML(ui('症狀分數'), (showTolerability ? ui('症狀分數為 0–10；屬耐受性結果。') : '') + ui('分數越低，症狀越少'))}</h4>${ratings.length ? `<span class="note">${esc(tpName(first))}${last !== first ? ' → ' + esc(tpName(last)) + ' · ' + ui('本次變化') : ''}</span>` : ''}</div>
      ${ratings.length ? `<dl class="dashboard-ratings">${ratings.map(sym => {
        const from = first.scores?.[sym.k], to = last.scores?.[sym.k];
        const change = last !== first && from != null && to != null ? to - from : null;
        return `<div><dt>${language === 'en' ? sym.en : sym.zh}</dt><dd><span>${esc(from ?? '-')}${last !== first ? ' → ' + esc(to ?? '-') : ''}</span>${change != null ? `<span class="rating-change ${change > 0 ? 'bad' : change < 0 ? 'good' : ''}" title="${esc(ui('本次變化') + ' ' + signed(change))}" aria-label="${esc(ui('本次變化') + ' ' + signed(change))}">${signed(change)}</span>` : ''}</dd></div>`;
      }).join('')}</dl>` : showTolerability ? `<div id="dashboardTolerability">${ul(clinicalEvidenceText(c, s, tolerability.map(item => item.id), true))}</div>` : ui('<p class="note" style="margin:0">尚未填寫症狀評分</p>')}
    </section>
    <div id="clinicalMap" class="clinical-map">${map}</div>
    <section aria-label="本次量化與評估摘要">
      ${assessments.length ? ['visual', 'functional'].map(category => {
        const items = assessments.filter(p => assessmentCategory(p) === category);
        return items.length ? `<details class="dashboard-findings"><summary>${assessmentCategoryLabel(category)} (${items.length})${items.some(item => fieldsFor(item).some(f => f.phase)) ? helpHTML(ui('短期成效'), ui('短期結果為摘要；完整條件與測量時間請開啟此筆紀錄。')) : ''}</summary>${clinicalEvidenceText(c, s, items.map(p => p.id), true).map(line => `<div class="clinical-note">${esc(line)}</div>`).join('')}</details>` : '';
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
  const recent = !query && document.activeElement === $('#clientSearch') ? recentClientIds().slice(0, 5).map(id => clients.find(client => client.id === id)) : [];
  if (!query && !recent.length) { list.innerHTML = ''; $('#clientSearchStatus').textContent = ''; closeClientSearch(); return; }
  const shown = query ? clients.filter(c => [clientLabel(c), c.id, c.ref, c.nationalId, ...(c.refAliases || []), c.dx].join(' ').toLocaleLowerCase().includes(query)) : recent;
  $('#clientSearchStatus').textContent = !query ? ui('最近開啟') : shown.length > 8 ? ui('顯示前 {0} 筆，共 {1} 筆；請縮小搜尋範圍。', 8, shown.length) : ui('找到 {0} 位個案', shown.length);
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
      ${store?.kind === 'local' ? ui`<p class="browser-save-guidance">這個瀏覽器無法直接存入資料夾，每次儲存會下載一份檔案，請自行保存；建議在桌上型或筆記型電腦使用 Chrome 或 Edge。</p>` : ''}
      <div class="row">
        <button class="btn app-primary" data-action="new-client">${ADD_ICON}新增個案</button>
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
        <div class="client-heading"><div class="client-identity"><span class="eyebrow sr-only">個案</span><div class="client-title"><h2>${esc(clientLabel(c))}</h2>${c.ref ? `<span class="client-ref">${esc(c.ref)}</span>` : ''}</div>${c.dx ? `<p class="client-diagnosis" title="${esc(c.dx)}"><span class="eyebrow">${ui('診斷')}</span>${esc(c.dx)}</p>` : ''}</div>${profileDetailsHTML(c, true)}</div>
        <div class="patient-actions"><button class="btn small" data-action="edit-client" data-needs="client">編輯資料</button><button class="btn app-primary" data-action="new-session" data-needs="client">${ADD_ICON}新增紀錄</button></div>
      </div>
      <div class="patient-meta"><dl class="client-stats">
        <div><dt>最近紀錄</dt><dd>${latest ? fmtDate(latest.date) : ui('尚無紀錄')}</dd></div>
        <div><dt>下次復健</dt><dd>${latest?.nextDate ? fmtDate(latest.nextDate) : ui('尚未指定')}</dd></div>
      </dl>
      <div class="patient-details">${facts || profileDetailsHTML(c) ? ui`<details class="patient-background"><summary>病史與基本資料</summary>${profileDetailsHTML(c)}<div class="facts">${facts}</div></details>` : ''}${medicalHistoryHTML(c)}</div></div>
    </section>
    ${profileIncompleteHTML(c)}
    ${view === 'dashboard' ? '<div id="backupReminderSlot"></div>' : ''}
    <div class="tabs" role="tablist" aria-label="個案工作區">
      <button class="tab" id="tab-dashboard" role="tab" aria-controls="tabBody" tabindex="${view === 'dashboard' ? 0 : -1}" aria-selected="${view === 'dashboard'}" data-action="tab" data-tab="dashboard">病人總覽</button>
      <button class="tab" id="tab-sessions" role="tab" aria-controls="tabBody" tabindex="${view === 'sessions' ? 0 : -1}" aria-selected="${view === 'sessions'}" data-action="tab" data-tab="sessions">復健紀錄 (${sessions.length})</button>
      <button class="tab" id="tab-outcomes" role="tab" aria-controls="tabBody" tabindex="${view === 'outcomes' ? 0 : -1}" aria-selected="${view === 'outcomes'}" data-action="tab" data-tab="outcomes">進度追蹤</button>
      <button class="tab" id="tab-plan" role="tab" aria-controls="tabBody" tabindex="${view === 'plan' ? 0 : -1}" aria-selected="${view === 'plan'}" data-action="tab" data-tab="plan">項目設定</button>
    </div>
    ${['plan', 'dashboard'].includes(view) ? '' : sessionFiltersHTML()}
    <div id="tabBody" role="tabpanel" aria-labelledby="tab-${view}"></div>`;
  for (const key of ['visit', 'from', 'to', 'text']) {
    const el = $('#filter-' + key); if (!el) continue;
    el.addEventListener(key === 'text' ? 'input' : 'change', () => {
      const from = $('#filter-from'), to = $('#filter-to');
      to.setCustomValidity(from.value && to.value && from.value > to.value ? ui('結束日期不可早於起始日期') : '');
      if (!to.reportValidity()) return;
      sessionFilter = { visit: $('#filter-visit').value, from: from.value, to: to.value, text: $('#filter-text').value };
      $('#filterCount').textContent = ui`顯示 ${filteredSessions().length} / ${sessions.length} 筆`;
      if (view === 'outcomes') renderOutcomes(); else renderSessions();
    });
  }
  if (view === 'dashboard') renderDashboard(); else if (view === 'plan') renderPlan(); else if (view === 'outcomes') renderOutcomes(); else renderSessions();
  if (view === 'dashboard') renderBackupReminder();
}
function filteredSessions() {
  const query = (sessionFilter.text || '').normalize('NFKC').toLocaleLowerCase().trim();
  return sessions.filter(s => (!sessionFilter.visit || s.visit === sessionFilter.visit) &&
    (!sessionFilter.from || s.date >= sessionFilter.from) && (!sessionFilter.to || s.date <= sessionFilter.to) &&
    (!query || noteText(cur(), s).normalize('NFKC').toLocaleLowerCase().includes(query)));
}
function sessionFiltersHTML() {
  return ui`<section class="panel filters" aria-label="篩選復健紀錄">
    <label class="f record-search" for="filter-text">搜尋病歷文字<input type="search" id="filter-text" value="${val(sessionFilter.text)}" placeholder="主訴、評估、介入或計畫" autocomplete="off"></label>
    <label class="f" for="filter-visit">紀錄類型<select id="filter-visit"><option value="">全部類型</option>${VISITS.map(v => `<option value="${v.k}" ${sessionFilter.visit === v.k ? 'selected' : ''}>${ui(v.label)}</option>`).join('')}</select></label>
    <label class="f" for="filter-from">起始日期<input type="date" id="filter-from" value="${val(sessionFilter.from)}"></label>
    <label class="f" for="filter-to">結束日期<input type="date" id="filter-to" value="${val(sessionFilter.to)}"></label>
    <div><button class="btn" data-action="clear-filters">清除篩選</button><div class="note" id="filterCount" role="status">顯示 ${filteredSessions().length} / ${sessions.length} 筆</div></div>
  </section>`;
}

function renderSessions() {
  const body = $('#tabBody');
  if (!sessions.length) {
    body.innerHTML = ui`<section class="panel empty"><h3>尚無復健紀錄</h3><p>新增第一筆 SOAP 病歷，記錄復健前後的症狀、評估與訓練結果。可先到「項目設定」調整評估與復健模板。</p><button class="btn app-primary" data-action="new-session">${ADD_ICON}新增復健紀錄</button></section>`;
    return;
  }
  const asc = byDate(filteredSessions());
  if (!asc.length) { body.innerHTML = ui('<section class="panel empty"><h3>沒有符合條件的復健紀錄</h3><p>請調整搜尋文字、類型或日期，或清除篩選以查看所有紀錄。</p><button class="btn" data-action="clear-filters">清除篩選</button></section>'); return; }
  body.innerHTML = ui`<div class="records-layout">
    <section class="panel chart">
      <div class="spread"><h3>每次復健的症狀評分</h3>
        <div class="row">
          <select id="chartSym" aria-label="圖表顯示的症狀" style="width:auto">
            <option value="total">五項症狀總分（0 至 50）</option>
            ${SYMS.map(s => `<option value="${s.k}" ${chartSym === s.k ? 'selected' : ''}>${language === 'en' ? s.en : s.zh}</option>`).join('')}
          </select>
        </div></div>
      <div class="row" style="margin:8px 0"><span class="chip pre">● 復健前</span><span><span class="chip acc">● 復健後</span>${helpHTML(ui('症狀分數'), ui('分數越低，症狀越輕。'))}</span></div>
      <div class="chart-plot" tabindex="0" role="region" aria-label="${ui('症狀圖表，可左右捲動')}">${chartSVG(asc.filter(s => s.visit !== 'absent'))}</div>
    </section>
    <div class="record-history">
      <div class="section-heading"><h3 id="recordHistoryHeading" aria-label="紀錄歷程">紀錄歷程${helpHTML(ui('紀錄歷程'), ui('由新到舊排列'))}</h3></div>
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
    <button class="btn small" data-action="export-session" data-id="${esc(s.id)}" title="${esc(store.kind === 'folder' ? ui('CSV、PDF 與 TXT') : ui('CSV 與 PDF'))}">匯出檔案</button>
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
  const before = findRow(s, 'pre'), after = findRow(s, 'end'), pre = rowTotal(before), end = rowTotal(after), rec = findRow(s, 'rec');
  const d = symptomChange(before, after);
  const tx = trainingItems(cur(), s).filter(t => s.training?.[t.k]?.on).map(t => `<li>${esc(labelText(t.label))}</li>`).join('');
  const nAs = Object.values(s.assess || {}).filter(a => a.done).length;
  return ui`<article class="sess">
    <div class="session-content">${sessionHeading(s)}
      <dl class="session-metrics">
        <div class="metric-pre"><dt>復健前</dt><dd>${esc(pre ?? '-')}</dd><small class="note">${ui('已評 {0}/5', symRatedCount(before))}</small></div>
        <div class="metric-end"><dt>復健後</dt><dd>${esc(end ?? '-')}</dd><small class="note">${ui('已評 {0}/5', symRatedCount(after))}</small></div>
        <div class="metric-change ${d > 0 ? 'bad' : d < 0 ? 'good' : ''}"><dt>前後差異</dt><dd>${d != null ? signed(d) : '-'}</dd></div>
      </dl>
      ${pre != null && end != null && d == null ? `<p class="note">${ui('評分項目不同，未計算合計差異。')}</p>` : ''}
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
    const row = p => k === 'pre' ? firstRated(p.s.sym) : findRow(p.s, 'end');
    const d = seg.map((p, j) => `${j && (chartSym !== 'total' || sameSymptomSet(row(seg[j - 1]), row(p))) ? 'L' : 'M'}${x(p.i)},${y(p[k])}`).join(' ');
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2.25" stroke-linejoin="round"/>` +
      seg.map((p, j) => `<circle cx="${x(p.i)}" cy="${y(p[k])}" r="${j === seg.length - 1 ? 5 : 3.5}" fill="${col}" stroke="var(--surface)" stroke-width="1.5"><title>${k === 'pre' ? ui('首次評分') : ui('復健後')}：${p[k]} · ${ui('已評 {0}/5', symRatedCount(row(p)))}</title></circle>`).join('');
  };
  return ui`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="每次復健的首次與復健後症狀評分">${g}${line('pre', 'var(--pre)')}${line('end', 'var(--accent)')}</svg>`;
}

function stagedOutcomesHTML(item, rows, definition) {
  const recordHTML = rows.map(s => {
    const current = definition(s), fields = fieldsFor(current), a = s.assess[item.id], values = a.values || {};
    const isContext = f => f.label === 'Measurement time / equivalent form' || f.label === LABELS['Measurement time / equivalent form'];
    const measureLabel = f => fieldLabel({ ...f, phase: undefined });
    const phases = [...new Set(fields.filter(f => f.phase && f.group !== 'setting' && hasValue(values[f.id])).map(f => f.phase))];
    const measured = new Set(fields.filter(f => f.phase && hasValue(values[f.id])).map(measureLabel));
    const metrics = [...new Map(fields.filter(f => f.phase && f.group !== 'setting' && !isContext(f) && measured.has(measureLabel(f))).map(f => [measureLabel(f), f])).values()];
    const hasContext = fields.some(f => f.phase && isContext(f) && hasValue(values[f.id]));
    const extra = resultEntries({ fields: fields.filter(f => !f.phase || f.group === 'setting') },
      Object.fromEntries(Object.entries(values).filter(([key, value]) => hasValue(value) && !fields.some(f => f.id === key && f.phase && f.group !== 'setting'))));
    const clinicalNotes = clinicalAssessmentNotes(a, s);
    if (clinicalNotes) extra.push([ui('備註'), clinicalNotes]);
    const facts = extra.length ? `<dl class="short-facts">${extra.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>` : '';
    const table = phases.length ? ui`<div class="scroll" tabindex="0" role="region" aria-label="${esc(labelText(current.name) + ' / ' + fmtDate(s.date))}"><table class="out short-out"><thead><tr><th scope="col">測量時點${metrics.length + Number(hasContext) > 1 ? helpHTML(ui('測量時點'), ui('可左右捲動查看更多指標與測量時間。')) : ''}</th>${metrics.map(f => `<th scope="col">${esc(measureLabel(f))}</th>`).join('')}${hasContext ? `<th scope="col">${esc(labelText('Measurement time / equivalent form'))}</th>` : ''}</tr></thead><tbody>
      ${phases.map(phase => {
        const stageFields = fields.filter(f => f.phase === phase && f.group !== 'setting');
        const context = stageFields.find(isContext);
        return `<tr><th scope="row">${esc(phaseLabel(phase))}</th>${metrics.map(metric => {
          const f = stageFields.find(f => !isContext(f) && measureLabel(f) === measureLabel(metric));
          return `<td>${esc(f ? shownValue(f, values[f.id]) : '-')}</td>`;
        }).join('')}${hasContext ? `<td class="short-context">${esc(context ? shownValue(context, values[context.id]) : '-')}</td>` : ''}</tr>`;
      }).join('')}</tbody></table></div>` : !fields.some(f => f.phase) && facts ? '' : ui('<p class="note">尚未填寫結果</p>');
    const notes = facts ? fields.some(f => f.phase) ? ui`<details class="short-notes"><summary>測驗條件與備註</summary>${facts}</details>` : facts : '';
    return `<article class="short-record"><h4>${fmtDate(s.date)} · ${esc(visitLabel(s.visit))}</h4>${table}${notes}</article>`;
  }).join('');
  return `<section class="panel short-outcomes" data-item-id="${esc(item.id)}"><h3>${esc(labelText(item.name))}</h3><p class="note">${esc(labelText(item.domain))}</p>${recordHTML}</section>`;
}
function renderOutcomes() {
  const c = cur(), asc = byDate(filteredSessions());
  const parts = [];
  // Symptoms summary
  const symRows = asc.filter(s => (s.sym || []).some(r => rowTotal(r) != null || r.kind === 'rec' && r.recMin != null));
  if (symRows.length) {
    parts.push(ui`<section class="panel"><h3 aria-label="症狀評分（0 至 10）">症狀評分（0 至 10）${helpHTML(ui('症狀評分（0 至 10）'), ui('復健前 → 復健後；有記錄時另顯示恢復時間。'))}</h3>
      <div class="scroll"><table class="out"><thead><tr><th>日期</th>${SYMS.map(s => `<th>${language === 'en' ? s.en : s.zh}</th>`).join('')}<th>總分</th><th>恢復時間</th></tr></thead><tbody>
      ${symRows.map(s => { const p = firstRated(s.sym), e = findRow(s, 'end') || lastRated(s.sym), r = findRow(s, 'rec');
        const cell = k => { const a = symVal(p, k), b = symVal(e, k); return `${esc(a ?? '–')} → ${esc(b ?? '–')}`; };
        return `<tr><td>${fmtDate(s.date)}</td>${SK.map(k => `<td>${cell(k)}</td>`).join('')}<td><b>${esc(symptomRatingText(p))} → ${esc(symptomRatingText(e))}</b>${rowTotal(p) != null && rowTotal(e) != null && !sameSymptomSet(p, e) ? `<br><span class="note">${ui('評分項目不同，未計算合計差異。')}</span>` : ''}</td><td>${r ? (r.recMin != null ? esc(r.recMin) + ui(' 分鐘') : ui('已記錄')) : '-'}</td></tr>`; }).join('')}
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
      parts.push(ui`<section class="panel"><h3>${esc(labelText(item.name))}${helpHTML(labelText(item.name), ui('· 基準與療程後評估；療程後分數與先前基準比較。'))}</h3><p class="note" style="margin:4px 0 10px">${esc(labelText(item.domain))}</p>
        <div class="scroll"><table class="out"><thead><tr><th>日期</th><th>紀錄類型</th><th>表現平均</th><th>與基準差異</th><th>滿意度平均</th><th>與基準差異</th></tr></thead><tbody>
        ${copmRows.map(s => { const rows = s.assess[item.id].copm, a = copmAvg(rows), base = copmBaseline(s.id, s.date, s.visit), comparison = copmComparison(rows, base);
          const ch = delta => delta != null ? `<span class="delta ${delta > 0 ? 'down' : delta < 0 ? 'up' : ''}">${signed(delta)}</span>` : '–';
          return `<tr><td>${fmtDate(s.date)}</td><td>${visitLabel(s.visit)}</td><td>${a.perf ?? '–'}</td><td>${ch(comparison.perf)}${comparison.warning ? `<br><span class="note">${esc(comparison.warning)}</span>` : ''}</td><td>${a.sat ?? '–'}</td><td>${ch(comparison.sat)}</td></tr>`; }).join('')}
        </tbody></table></div></section>`);
    } else {
      const def = s => assessmentItems(c, s).find(p => p.id === item.id) || item;
      if (rows.some(s => fieldsFor(def(s)).some(f => f.phase))) { parts.push(stagedOutcomesHTML(item, rows, def)); continue; }
      const fields = [...new Map(rows.flatMap(s => fieldsFor(def(s))).map(f => [f.id, f])).values()].filter(f => f.group !== 'setting');
      const settings = rows.some(s => settingSummary(def(s), s.assess[item.id].values));
      parts.push(ui`<section class="panel"><h3>${esc(labelText(item.name))}</h3><p class="note" style="margin:4px 0 10px">${esc(labelText(item.domain))}</p>
        <div class="scroll"><table class="out"><thead><tr><th>日期</th><th>紀錄類型</th>${fields.map(f => `<th>${esc(fieldLabel(f))}</th>`).join('')}${settings ? ui('<th>測驗設定</th>') : ''}<th>備註</th></tr></thead><tbody>
        ${rows.map(s => { const a = s.assess[item.id]; return `<tr><td>${fmtDate(s.date)}</td><td>${visitLabel(s.visit)}</td>${fields.map(f => `<td>${esc(shownValue(f, a.values?.[f.id]))}</td>`).join('')}${settings ? `<td style="text-align:left;font-family:var(--f-body)">${esc(settingSummary(def(s), a.values))}</td>` : ''}<td style="text-align:left;font-family:var(--f-body)">${esc(clinicalAssessmentNotes(a, s))}</td></tr>`; }).join('')}
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
    parts.push(ui`<section class="panel"><h3>${esc(labelText(item.label))}${acts.length ? helpHTML(labelText(item.label), ui('活動欄顯示該次的分數；✓ 表示有做但未填分數。')) : ''}</h3><div class="scroll" style="margin-top:10px"><table class="out"><thead><tr><th>日期</th>${acts.map(a => `<th>${esc(a)}</th>`).join('')}<th>設備／程式</th><th>時間（分鐘）</th><th>設定</th>${perf ? ui('<th>表現</th>') : ''}<th>難度</th>${fields.map(f => `<th>${esc(fieldLabel(f))}</th>`).join('')}<th>觀察</th></tr></thead><tbody>
      ${rows.map(s => { const d = s.training[item.k]; return `<tr><td>${fmtDate(s.date)}</td>${acts.map(a => `<td>${esc(actCell(d, a))}</td>`).join('')}<td>${esc(d.program)}</td><td>${esc(d.dur ?? '-')}</td><td>${esc(d.level)}</td>${perf ? `<td>${esc(d.perf)}</td>` : ''}<td>${esc(d.diff ?? '-')}</td>${fields.map(f => `<td>${esc(d.values?.[f.id] ?? '-')}</td>`).join('')}<td>${esc(d.notes)}</td></tr>`; }).join('')}</tbody></table></div></section>`);
  }
  const runRows = asc.flatMap(s => Object.values(s.training || {}).flatMap(d => d?.on ? (d.runs || []).map(r => ({ s, r })) : []));
  for (const id of new Set(runRows.map(x => x.r.item))) {
    const item = deviceItem(id); if (!item) continue;
    const list = runRows.filter(x => x.r.item === id);
    const fields = fieldsFor(item).filter(f => f.group !== 'setting' && list.some(x => hasValue(x.r.values?.[f.id])));
    parts.push(ui`<section class="panel"><h3>${esc(labelText(item.name))}（復健測驗紀錄）${helpHTML(labelText(item.name), ui('復健時的每次測驗，各自顯示當次設定。'))}</h3>
      <div class="scroll"><table class="out"><thead><tr><th>日期</th><th>時間</th>${fields.map(f => `<th>${esc(fieldLabel(f))}</th>`).join('')}<th>測驗設定</th></tr></thead><tbody>
      ${list.map(({ s, r }) => `<tr><td>${fmtDate(s.date)}</td><td>${esc(r.time || '-')}</td>${fields.map(f => `<td>${esc(shownValue(f, r.values?.[f.id]))}</td>`).join('')}<td style="text-align:left;font-family:var(--f-body)">${esc(settingSummary(item, r.values))}</td></tr>`).join('')}
      </tbody></table></div></section>`);
  }
  const edRows = asc.flatMap(s => s.training?.ocular?.on ? (s.training.ocular.eyedot || []).map(r => ({ s, r })) : []);
  if (edRows.length) {
    parts.push(ui`<section class="panel"><h3>EyeDot Trainer 訓練紀錄${helpHTML(ui('EyeDot Trainer 訓練紀錄'), ui('按日期顯示眼球運動訓練中的每筆紀錄。'))}</h3>
      <div class="scroll"><table class="out"><thead><tr><th>日期</th><th>模式</th><th>速度</th><th>時間</th><th>設定</th><th>次數</th><th>最佳表現</th><th>備註</th></tr></thead><tbody>
      ${edRows.map(({ s, r }) => `<tr><td>${fmtDate(s.date)}</td><td>${esc(labelText(r.mode))}</td><td>${esc(edSpeedLabel(r.mode, r.speed) || '')}</td><td>${esc(labelText(r.dur))}</td>
        <td>${esc([labelText(r.dir), r.trail ? ui('軌跡') + ui('：') + labelText(r.trail) : null, labelText(r.dot), r.full === 'Yes' ? ui('全螢幕') : null].filter(Boolean).join(ui('、')))}</td>
        <td>${r.count != null ? esc(r.count) + ' ' + edCountLabel(r.mode) : '–'}</td><td>${esc(r.best || '–')}</td><td style="text-align:left;font-family:var(--f-body)">${esc(r.notes || '')}</td></tr>`).join('')}
      </tbody></table></div></section>`);
  }
  $('#tabBody').innerHTML = parts.join('') || ui`<section class="panel empty"><h3>尚無追蹤結果</h3><p>在復健紀錄中填寫症狀評分、評估或復健結果並儲存後，即可在此比較。</p></section>`;
  for (const region of $('#tabBody').querySelectorAll('.scroll')) {
    region.tabIndex = 0; region.setAttribute('role', 'region');
    const hint = ui('表格可左右捲動，或聚焦後使用左右方向鍵。');
    const heading = region.closest('section').querySelector('h3'), title = heading.cloneNode(true);
    title.querySelectorAll('.help').forEach(node => node.remove());
    const subject = title.textContent, tooltip = heading.querySelector('[role="tooltip"]');
    region.setAttribute('aria-label', subject + ': ' + hint);
    if (tooltip) { if (!tooltip.textContent.includes(hint)) tooltip.textContent += '\n\n' + hint; }
    else heading.insertAdjacentHTML('beforeend', helpHTML(subject, hint));
  }
}

function renderPlan() {
  const c = cur();
  const section = (kind, title, items) => ui`<section class="panel">
    <div class="spread"><h3>${title}${helpHTML(title, kind === 'assessment' ? ui('設定評估時機與結果欄位；符合本次紀錄類型的項目會標示「本次應評估」。') : ui('每項包含活動、設備、時間、設定、表現、難度與觀察，也能自行增加結果欄位。'))}</h3><button class="btn app-primary" data-action="${kind === 'assessment' ? 'plan-add' : 'training-add'}">${ADD_ICON}${kind === 'assessment' ? ui('新增評估項目') : ui('新增復健項目')}</button></div>
    <div class="plan-edit" id="${kind === 'assessment' ? 'planEdit' : 'trainingEdit'}">${items.map(item => {
      const key = itemKey(item, kind), name = kind === 'assessment' ? assessmentTemplateLabel(item) : labelText(item.label), active = item.active !== false;
      return ui`<article class="template-row" data-item-id="${key}"><div class="template-info"><h4>${esc(name)}${!active ? ui(' <span class="chip">已停用</span>') : ''}</h4>
        <p class="note">${kind === 'assessment' ? esc(ui(TIMING[item.timing] || TIMING.assessment)) + ' · ' : ''}${item.copm ? ui('COPM：最多 5 項職能活動，表現與滿意度 1 至 10 分') : esc(fieldsFor(item).map(fieldLabel).join(ui('、')) || (kind === 'training' ? ui('通用復健紀錄欄位') : ui('尚未設定結果欄位')))}</p>
        ${kind === 'training' && item.acts?.length ? ui`<p class="note">活動：${esc(item.acts.map(labelText).join(ui('、')))}</p>` : ''}</div>
        <div class="row"><button class="btn small" data-action="item-edit" data-kind="${kind}" data-id="${key}" aria-label="${esc(ui('編輯 {0}', name))}">編輯</button>
          ${item.copm ? '' : ui`<button class="btn small" data-action="item-copy" data-kind="${kind}" data-id="${key}" aria-label="${esc(ui('複製 {0}', name))}">複製</button>`}
          <button class="btn small" data-action="item-toggle" data-kind="${kind}" data-id="${key}" aria-label="${esc(active ? ui('停用 {0}', name) : ui('啟用 {0}', name))}">${active ? ui('停用') : ui('啟用')}</button></div></article>`;
    }).join('') || ui('<p class="note">尚無項目，請按新增項目，選擇現有模板或建立空白模板。</p>')}</div></section>`;
  const selectable = c.plan.filter(p => !['src_other', 'func'].includes(assessmentSourceId(p)));
  const initialItems = selectable.filter(p => p.active !== false);
  const initialPanel = ui`<section class="panel" aria-labelledby="initialHeading"><h3 id="initialHeading" aria-label="初次評估項目">初次評估項目${helpHTML(ui('初次評估項目'), ui('勾選初次評估（基準評估）要施測的項目。填寫基準評估時，這些項目列在最前面；療程後與追蹤評估只列出其中依評估時機應再評估的項目。實際施測後，再於病歷中勾選並填寫。'))}</h3>
    ${initialItems.length ? `<div class="pick-group" id="initialPicks" role="group" aria-labelledby="initialHeading" style="margin-top:12px">${initialItems.map(p => `<label class="pick"><input type="checkbox" data-initial="${p.id}" ${isInitial(p) ? 'checked' : ''}>${esc(assessmentTemplateLabel(p))}</label>`).join('')}</div>` : ui('<p class="note">尚無啟用的評估項目。</p>')}</section>`;
  $('#tabBody').innerHTML = ui`<div class="plan-edit"><div><h3>評估與復健項目設定${helpHTML(ui('評估與復健項目設定'), ui('從既有模板開始，或建立空白項目。停用項目仍保留歷史結果；新增個案時可複用這份設定。'))}</h3><p class="note">${esc(clientLabel(c))}</p></div>
    ${initialPanel}${section('assessment', ui('評估項目'), selectable)}${section('training', ui('復健項目'), trainingPlan(c))}</div>`;
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
function itemForm(kind, key = null, fromEditor = false, duplicate = false, category = null, period = null) {
  const c = cur(), assessment = kind === 'assessment', listKey = assessment ? 'plan' : 'trainingPlan';
  const list = assessment ? c.plan : trainingPlan(c), old = list.find(item => itemKey(item, kind) === key);
  if (fromEditor) editing = collectSession();
  const creating = !old || duplicate, newKey = creating ? uid(assessment ? 'p' : 't') : key;
  const blankDraft = () => assessment ? { name: '', domain: '', timing: period === 'short' ? 'session' : 'assessment',
    functionCategory: ASSESSMENT_FUNCTIONS.includes(category) ? category : 'visual', outcomePeriod: period || 'long',
    fields: period === 'short' ? shortFields([{ id: 'result', label: 'Result', type: 'text' }]) : [{ id: uid('f'), label: ui('結果'), type: 'text' }] } : { label: '', acts: [], fields: [] };
  let draft = old ? clone(old) : blankDraft();
  if (assessment) {
    draft.functionCategory = !old && ASSESSMENT_FUNCTIONS.includes(category) ? category : assessmentFunction(draft);
    draft.category = old ? assessmentCategory(draft) : draft.functionCategory === 'visual' ? 'visual' : 'functional';
    draft.outcomePeriod = !old && ['short', 'long'].includes(period) ? period : assessmentPeriod(draft);
  }
  draft.fields = fieldsFor(draft);
  if (assessment && creating && !duplicate && isBuiltInAssessment(draft)) draft.templateId = assessmentSourceId(draft);
  draft[assessment ? 'id' : 'k'] = newKey;
  if (duplicate) { draft[assessment ? 'name' : 'label'] = labelText(draft.name || draft.label) + ui('（副本）'); draft.active = true; }
  const seeds = assessment ? DEFAULT_PLAN.filter(item => !item.copm) : TRAIN;
  let base = '';
  const heading = assessment ? (creating ? ui('新增評估項目') : ui('編輯評估項目')) : (creating ? ui('新增復健項目') : ui('編輯復健項目'));
  const m = modal(`<h3>${heading}</h3><form id="itemForm" class="item-form"></form>`);
  m.style.width = 'min(760px, 100%)';
  const form = m.querySelector('form');
  const readLabel = (value, previous) => value.trim() === labelText(previous) ? previous || '' : value.trim();
  const read = () => {
    const nameKey = assessment ? 'name' : 'label';
    const displayedName = assessment && assessmentPeriod(draft) === 'long' ? assessmentTemplateLabel(draft) : labelText(draft[nameKey]);
    if ($('#item-name').value.trim() !== displayedName) draft[nameKey] = readLabel($('#item-name').value, draft[nameKey]);
    if (assessment) {
      draft.functionCategory = draft.copm ? 'daily' : $('#item-category').value;
      if (draft.functionCategory !== assessmentFunction(old || {})) draft.category = draft.functionCategory === 'visual' ? 'visual' : 'functional';
      draft.outcomePeriod = draft.copm ? 'long' : $('#item-period').value;
      draft.domain = readLabel($('#item-domain').value, draft.domain); draft.timing = draft.copm ? 'bp' : $('#item-timing').value; draft.outcome = readLabel($('#item-outcome').value, draft.outcome);
    }
    else draft.acts = [...new Set($('#item-acts').value.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(text => draft.acts.find(act => labelText(act) === text) || text))];
    draft.fields = [...form.querySelectorAll('.field-editor')].map((row, i) => {
      const get = suffix => $('#item-field-' + i + '-' + suffix)?.value || '';
      const field = { id: draft.fields[i].id, label: readLabel(get('label'), draft.fields[i].label), type: get('type'), unit: get('unit').trim(), ...(draft.fields[i].group ? { group: draft.fields[i].group } : {}), ...(draft.fields[i].phase ? { phase: draft.fields[i].phase } : {}) };
      if (field.type === 'select') field.options = [...new Set(get('options').split(/\r?\n/).map(s => s.trim()).filter(Boolean))];
      if (field.type === 'number') for (const prop of ['min', 'max', 'step']) if (get(prop).trim()) field[prop] = Number(get(prop));
      return field;
    });
  };
  const draw = () => {
    const options = entries => entries.map(({ item, i }) => `<option value="${i}" ${base === String(i) ? 'selected' : ''}>${esc(assessment ? assessmentTemplateLabel(item) : labelText(item.label))}</option>`).join('');
    const templateOptions = assessment ? ASSESSMENT_FUNCTIONS.map(category => ['short', 'long'].map(period => {
      const entries = seeds.map((item, i) => ({ item, i })).filter(({ item }) => assessmentFunction(item) === category && assessmentPeriod(item) === period);
      return entries.length ? `<optgroup label="${esc(assessmentFunctionLabel(category) + ' · ' + assessmentPeriodLabel(period))}">${options(entries)}</optgroup>` : '';
    }).join('')).join('') : options(seeds.map((item, i) => ({ item, i })));
    form.innerHTML = ui`${creating && !duplicate ? ui`<label class="f" for="item-base">從模板開始<select id="item-base"><option value="">空白模板</option>${templateOptions}</select></label>` : ''}
      <div class="f"><div class="field-label"><label for="item-name">項目名稱</label>${draft.copm ? helpHTML(labelText(draft.name), ui('COPM 保留專用的職能活動、表現與滿意度表格，以及基準比較。評估時機固定為基準與療程後。')) : ''}</div><input type="text" id="item-name" value="${val(assessment && assessmentPeriod(draft) === 'long' ? assessmentTemplateLabel(draft) : labelText(draft.name || draft.label))}" maxlength="180" required></div>
      ${assessment ? ui`<div class="grid"><label class="f" for="item-category">功能分類<select id="item-category" aria-label="功能分類" ${draft.copm ? 'disabled' : ''}>${ASSESSMENT_FUNCTIONS.map(category => `<option value="${category}" ${assessmentFunction(draft) === category ? 'selected' : ''}>${esc(assessmentFunctionLabel(category))}</option>`).join('')}</select></label>
        <label class="f" for="item-period">指標期程<select id="item-period" ${draft.copm ? 'disabled' : ''}>${['short', 'long'].map(period => `<option value="${period}" ${assessmentPeriod(draft) === period ? 'selected' : ''}>${esc(assessmentPeriodLabel(period))}</option>`).join('')}</select></label></div>
        <div class="grid"><label class="f" for="item-domain">評估領域<input type="text" id="item-domain" value="${val(labelText(draft.domain))}"></label>
        <label class="f" for="item-timing">評估時機<select id="item-timing" ${draft.copm ? 'disabled' : ''}>${Object.entries(TIMING).map(([k, text]) => `<option value="${k}" ${draft.timing === k ? 'selected' : ''}>${ui(text)}</option>`).join('')}</select></label></div>
        <label class="f" for="item-outcome">填寫說明<input type="text" id="item-outcome" value="${val(labelText(draft.outcome))}"></label>`
        : ui`<label class="f" for="item-acts">可選活動（每行一項）<textarea id="item-acts">${esc((draft.acts || []).map(labelText).join('\n'))}</textarea></label>`}
      ${draft.copm ? '' : ui`<div><h4>${assessment ? ui('結果欄位') : ui('其他結果欄位')}${assessment ? '' : helpHTML(ui('其他結果欄位'), ui('已包含設備、時間、設定、表現、難度與觀察。下方可增加其他欄位。'))}</h4><div id="item-fields">${draft.fields.map((f, i) => ui`<div class="field-editor" data-i="${i}">
        ${f.phase ? `<strong>${esc(phaseLabel(f.phase))}</strong>` : ''}<div class="field-top"><label class="f field-name" for="item-field-${i}-label">欄位名稱<input type="text" id="item-field-${i}-label" value="${val(labelText(f.label))}" required></label>
        <label class="f" for="item-field-${i}-type">類型<select id="item-field-${i}-type" data-field-type>${Object.entries(FIELD_TYPES).map(([k, text]) => `<option value="${k}" ${(f.type || 'text') === k ? 'selected' : ''}>${ui(text)}</option>`).join('')}</select></label>
        <label class="f" for="item-field-${i}-unit">單位（選填）<input type="text" id="item-field-${i}-unit" value="${val(f.unit)}"></label>
        <button type="button" class="btn small danger" data-item-action="remove" data-i="${i}" aria-label="${esc(ui('移除第 {0} 個欄位', i + 1))}">移除</button></div>
        ${f.type === 'number' ? `<div class="grid">${[['min', ui('最小值')], ['max', ui('最大值')], ['step', ui('間隔')]].map(([prop, text]) => ui`<label class="f" for="item-field-${i}-${prop}">${text}（選填）<input type="number" step="any" id="item-field-${i}-${prop}" value="${val(f[prop])}"></label>`).join('')}</div>` : ''}
        ${f.type === 'select' ? ui`<label class="f" for="item-field-${i}-options">選項（每行一項）<textarea id="item-field-${i}-options" required>${esc((f.options || []).join('\n'))}</textarea></label>` : ''}
        </div>`).join('')}</div><button type="button" class="btn small" data-item-action="add" style="margin-top:10px">${ADD_ICON}新增欄位</button></div>`}
      <p id="item-error" role="alert" style="margin:0;color:var(--bad)" hidden></p>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-item-action="cancel">取消</button><button type="submit" class="btn app-primary">儲存項目</button></div>`;
  };
  form.addEventListener('change', e => {
    if (e.target.id === 'item-base') {
      base = e.target.value;
      draft = base === '' ? blankDraft() : clone(seeds[Number(base)]);
      if (assessment) { draft.functionCategory = assessmentFunction(draft); draft.category = assessmentCategory(draft); draft.outcomePeriod = assessmentPeriod(draft); if (base !== '') draft.templateId = draft.id; }
      draft.fields = fieldsFor(draft).map(f => ({ ...f, id: uid('f') })); draft[assessment ? 'id' : 'k'] = newKey; draw(); $('#item-name').focus();
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
        dirty = true; renderEditor(); $('#' + (assessment ? 'as-' : 'tx-summary-') + newKey)?.scrollIntoView({ block: 'center' });
        if (creating && assessment) assessmentResultForm(newKey, { selecting: true, newItem: true });
        if (creating && !assessment) { $('#tx-' + newKey + '-on').checked = true; trainingResultForm(newKey, { selecting: true }); }
      } else renderMain();
      toast(ui('項目已儲存，可在復健紀錄中填寫。'));
    } catch (err) { error.hidden = false; error.textContent = ui('無法儲存項目') + ' ' + errorGuidance(err).text; showFailure(err, ui('無法儲存項目')); }
  };
  draw(); $('#item-name').focus();
}

function carryForwardHTML() {
  const source = byDate(sessions).filter(s => s.visit !== 'absent').at(-1);
  return (editing?.contextSource?.date ? `<p class="note">${esc(ui('沿用來源：{0}，請重新核對本次適用性。', fmtDate(editing.contextSource.date)))}</p>` : '') +
    (!editing?.id && source ? ui('<button type="button" class="btn small" data-action="carry-context">沿用前次問題、目標與條件</button>') : '');
}
function carryContextForm() {
  if (!editing || editing.id) return;
  editing = collectSession();
  const source = byDate(sessions).filter(s => s.visit !== 'absent').at(-1), c = cur();
  if (!source) return;
  const entries = [];
  for (const [index, link] of (source.clinicalLinks || []).entries()) entries.push({ key: 'problem-' + index, label: ui('前次問題') + ui('：') + link.symptom, apply() {
    editing.clinicalLinks ||= [];
    if (!editing.clinicalLinks.some(current => current.symptom === link.symptom)) editing.clinicalLinks.push({ id: uid('cl'), category: link.category, symptom: link.symptom, reasoning: '', peo: clone(link.peo || []), evidence: [], evidenceNotes: '', interventions: [], interventionNotes: '' });
  } });
  for (const [key, label] of [['environment', ui('前次環境條件')], ['occupation', ui('前次作業需求與目標')]]) if (source.peo?.[key]) entries.push({ key, label: label + ui('：') + source.peo[key], apply() {
    editing.peo ||= {}; if (!editing.peo[key]?.trim()) editing.peo[key] = source.peo[key];
  } });
  for (const [key, label] of [['plan', ui('前次後續計畫（本次須重新確認）')], ['otherTx', ui('前次居家安排（本次須重新確認）')]]) if (source[key]) entries.push({ key, label: label + ui('：') + source[key], apply() {
    if (!editing[key]?.trim()) editing[key] = source[key];
  } });
  for (const item of assessmentItems(c, source)) {
    const current = assessmentItems(c, editing).find(p => p.id === item.id);
    if (!current) continue;
    const fields = fieldsFor(item).filter(field => field.group === 'setting' && !field.phase && !sourceNameMatches(field.label, 'Training / duration / difficulty / breaks / comparison condition') && fieldsFor(current).some(f => f.id === field.id) && hasValue(source.assess?.[item.id]?.values?.[field.id]));
    if (!fields.length) continue;
    entries.push({ key: 'assessment-' + item.id, label: ui('評估條件：{0}', assessmentTemplateLabel(item)), apply() {
      const target = editing.assess[item.id] ||= { done: false, notes: '', values: {} };
      target.values ||= {};
      for (const field of fields) if (!hasValue(target.values[field.id])) target.values[field.id] = source.assess[item.id].values[field.id];
    } });
  }
  for (const item of trainingItems(c, source)) {
    const previous = source.training?.[item.k];
    if (!previous || ![previous.program, previous.level].some(Boolean) || !trainingItems(c, editing).some(t => t.k === item.k)) continue;
    entries.push({ key: 'training-' + item.k, label: ui('活動工具與設定：{0}', labelText(item.label)), apply() {
      const target = editing.training[item.k] ||= { on: false, acts: [] };
      for (const key of ['program', 'level']) if (!target[key]?.trim() && previous[key]) target[key] = previous[key];
    } });
  }
  const m = modal(ui`<h3>沿用前次問題、目標與條件</h3><form id="carryContextForm" class="item-form">
    <p class="note">${esc(ui('沿用來源：{0}，請重新核對本次適用性。', fmtDate(source.date)))}</p>
    <p>逐項選擇仍適用的內容，只補入本次空白欄位；不沿用量測分數、症狀、已執行勾選或實際治療時間。</p>
    ${entries.length ? `<div>${entries.map((entry, index) => `<label class="pick"><input type="checkbox" name="carryContext" value="${index}">${esc(entry.label)}</label>`).join('')}</div>` : ui('<p class="note">沒有可沿用的問題或條件。</p>')}
    <p id="carry-error" role="alert" hidden></p><div class="row"><button type="button" class="btn" id="carry-cancel">取消</button><button type="submit" class="btn app-primary" ${entries.length ? '' : 'disabled'}>加入本次草稿</button></div>
  </form>`);
  $('#carry-cancel').onclick = closeModal;
  m.querySelector('form').onsubmit = event => {
    event.preventDefault();
    const selected = [...m.querySelectorAll('[name="carryContext"]:checked')].map(input => entries[Number(input.value)]);
    if (!selected.length) { $('#carry-error').textContent = ui('請先選擇要沿用的內容。'); $('#carry-error').hidden = false; return; }
    selected.forEach(entry => entry.apply());
    editing.contextSource = { sessionId: source.id, date: source.date, parts: selected.map(entry => entry.key) };
    dirty = true; closeModal(); renderEditor();
  };
}
let editorWorkflow = null, workflowEvents = null, workflowResize = null;
const workflowKey = () => curId + '/' + (editing?.id || 'new');
function editorWorkflowHTML(c, s) {
  return ui`<nav class="workflow-bar" id="editorWorkflow" aria-label="病歷填寫導覽">
    <div class="workflow-identity"><strong>${esc(clientLabel(c))}</strong><span>${esc(c.ref || c.id)}</span><span id="workflowVisit">${esc(s.date)} · ${visitLabel(s.visit)}</span><span id="workflowDirty" role="status">${esc(draftStatus())}</span></div>
    <div class="workflow-controls" ${s.visit === 'absent' ? 'hidden' : ''}><div class="workflow-steps">
      <button type="button" class="btn small" data-workflow-go="interview">訪談與目標</button>
      ${COPM_VISITS.includes(s.visit) ? '<button type="button" class="btn small" data-workflow-go="copm">COPM</button>' : ''}
      <button type="button" class="btn small" data-workflow-go="pre">施測前</button>
      <button type="button" class="btn small" data-workflow-go="activity">相關活動</button>
      <button type="button" class="btn small" data-workflow-go="post">施測後</button>
      <button type="button" class="btn small" data-workflow-go="response">反應與恢復</button>
      <button type="button" class="btn small" data-workflow-go="reasoning">判斷與計畫</button>
      <button type="button" class="btn small" data-workflow-go="plan">後續計畫</button>
    </div><label class="workflow-picker" for="workflowAssessment"><span>本次已選項目</span><select id="workflowAssessment"><option value="">選擇定位項目</option></select></label>
    <button type="button" class="btn small" id="workflowBack" disabled>回到剛才填寫處</button></div>
    <p id="workflowPath" class="workflow-path" aria-live="polite"></p><p id="workflowNotice" class="note" role="status" hidden></p>
  </nav>`;
}
function captureEditorPosition() {
  if (trainingDialog && document.activeElement?.closest('#trainingResultForm')) return { id: document.activeElement.id, training: trainingDialog.item.k };
  const element = document.activeElement?.closest('#soapForm [id]');
  if (element?.closest('.tx') && editorWorkflow?.trainingPosition?.training === element.closest('.tx').dataset.id) return editorWorkflow.trainingPosition;
  return element ? { id: element.id, offset: element.getBoundingClientRect().top, scroll: scrollY } : editorWorkflow?.position || null;
}
function revealEditorTarget(element) {
  if (!element) return;
  for (let parent = element; parent && parent.id !== 'soapForm'; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
}
function workflowTop() {
  return ($('#applicationBar')?.getBoundingClientRect().bottom || 0) + ($('#editorWorkflow')?.getBoundingClientRect().height || 0) + 12;
}
function updateWorkflowPath(element) {
  if (!$('#workflowPath') || !element) return;
  const section = element.closest('.soap-sec'), item = element.closest('.as, .tx'), stage = element.closest('.short-stage');
  const heading = section?.querySelector('.sec-title h3');
  const parts = [section ? section.querySelector('.letter').textContent + ' ' + (heading.getAttribute('aria-label') || heading.textContent) : trainingDialog && element.closest('#trainingResultForm') ? 'P ' + ui('介入與計畫') : ui('基本資料')];
  if (item) parts.push(item.querySelector('.as-head b, .tx-head')?.textContent || '');
  if (stage) parts.push(stage.querySelector('legend, summary')?.textContent || '');
  if (element.closest('#visualSymptoms')) parts.push(ui('症狀自評（0 至 10）'));
  const run = element.closest('.run'), link = element.closest('.clinical-link');
  if (run) parts.push(run.querySelector('.run-head h5')?.textContent || '');
  if (link) parts.push(link.querySelector('legend')?.textContent || '');
  $('#workflowPath').textContent = parts.filter(Boolean).join(' › ');
  document.querySelectorAll('#soapForm .workflow-active').forEach(node => node.classList.remove('workflow-active'));
  (item || section)?.classList.add('workflow-active');
  if (item?.classList.contains('as') && $('#workflowAssessment option[value="' + item.dataset.id + '"]')) {
    editorWorkflow.assessment = item.dataset.id; $('#workflowAssessment').value = item.dataset.id;
  }
  if (item?.classList.contains('tx')) editorWorkflow.activity = 'tx-summary-' + (item.dataset.id || trainingDialog?.item.k);
  const letter = section?.querySelector('.letter').textContent || (trainingDialog && element.closest('#trainingResultForm') ? 'P' : '');
  const currentStep = letter === 'S' ? 'interview' : letter === 'A' ? 'reasoning' : letter === 'P' ? item ? 'activity' : 'plan'
    : element.closest('#as-copm') ? 'copm' : element.closest('#sessionResponse, #visualSymptoms') ? 'response' : stage ? stage.querySelector('legend, summary')?.textContent === phaseLabel('pre') || stage.querySelector('legend, summary')?.textContent === phaseLabel('pre2') ? 'pre' : 'post' : '';
  document.querySelectorAll('[data-workflow-go]').forEach(button => {
    const active = button.dataset.workflowGo === currentStep;
    if (active) button.setAttribute('aria-current', 'location'); else button.removeAttribute('aria-current');
  });
}
function navigateEditor(element, remember = true) {
  if (!element) return;
  if (remember) { editorWorkflow.back = captureEditorPosition() || { scroll: scrollY }; $('#workflowBack').disabled = false; }
  if (element.matches('.tx') && !trainingDialog) { trainingResultForm(element.dataset.id); return; }
  if (element.closest('#trainingResultForm')) {
    revealEditorTarget(element); element.scrollIntoView({ block: 'center' });
    const focus = element.matches('input, select, textarea, button') ? element : element.querySelector('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)');
    focus?.focus({ preventScroll: true }); updateWorkflowPath(focus || element); return;
  }
  revealEditorTarget(element);
  const anchor = element.matches('input, select, textarea') ? element.closest('label') || element : element;
  window.scrollTo({ top: Math.max(0, scrollY + anchor.getBoundingClientRect().top - workflowTop()), behavior: 'instant' });
  const focus = element.matches('input, select, textarea, button') ? element : element.querySelector('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)');
  focus?.focus({ preventScroll: true }); updateWorkflowPath(focus || element);
}
function updateWorkflowItems() {
  const select = $('#workflowAssessment'); if (!select || !cur() || !editing) return;
  const picked = assessmentItems(cur(), editing).filter(item => $('#ac-' + item.id)?.checked);
  select.innerHTML = `<option value="">${ui('選擇定位項目')}</option>` + picked.map(item => `<option value="${esc(item.id)}">${esc(assessmentTemplateLabel(item))}</option>`).join('');
  const chosen = picked.some(item => item.id === editorWorkflow.assessment) ? editorWorkflow.assessment : picked.find(item => assessmentPeriod(item) === 'short')?.id || picked[0]?.id || '';
  select.value = chosen; editorWorkflow.assessment = chosen;
}
function setupEditorWorkflow(position) {
  workflowEvents?.abort(); workflowResize?.disconnect();
  const key = workflowKey();
  if (editorWorkflow?.key !== key) editorWorkflow = { key, assessment: '', activity: '', position: null, back: null };
  editorWorkflow.assessmentPrimaries ||= new Map();
  for (const group of assessmentEditorGroups(cur(), editing)) editorWorkflow.assessmentPrimaries.set(group.key, group.primary.id);
  const events = workflowEvents = new AbortController(), form = $('#soapForm'), bar = $('#editorWorkflow');
  const options = { signal: events.signal };
  let pointerFocus = false;
  form.addEventListener('pointerdown', () => { pointerFocus = true; }, { ...options, capture: true });
  form.addEventListener('keydown', () => { pointerFocus = false; }, { ...options, capture: true });
  updateWorkflowItems();
  const refreshStatus = () => {
    if (!bar.isConnected) return;
    refreshDraftStatus();
    $('#workflowVisit').textContent = $('#s-date').value + ' · ' + visitLabel($('#s-visit').value);
  };
  form.addEventListener('input', refreshStatus, options);
  form.addEventListener('change', () => { refreshStatus(); updateWorkflowItems(); }, options);
  form.addEventListener('focusin', event => {
    updateWorkflowPath(event.target); editorWorkflow.position = captureEditorPosition();
    const fromPointer = pointerFocus; pointerFocus = false;
    requestAnimationFrame(() => {
      if (!fromPointer && event.target.isConnected && document.activeElement === event.target && event.target.getBoundingClientRect().top < workflowTop()) navigateEditor(event.target, false);
    });
  }, options);
  form.addEventListener('invalid', event => { revealEditorTarget(event.target); navigateEditor(event.target, false); }, { ...options, capture: true });
  $('#workflowAssessment').addEventListener('change', event => {
    editorWorkflow.assessment = event.target.value; navigateEditor($('#as-' + event.target.value));
  }, options);
  $('#workflowBack').disabled = !editorWorkflow.back;
  $('#workflowBack').addEventListener('click', () => {
    const previous = editorWorkflow.back;
    if (previous?.training) { trainingResultForm(previous.training, { focusId: previous.id }); return; }
    if (previous?.id && document.getElementById(previous.id)) {
      const target = document.getElementById(previous.id); navigateEditor(target, false);
      window.scrollTo(0, scrollY + target.getBoundingClientRect().top - Math.max(workflowTop() + 20, previous.offset));
    }
    else if (previous) window.scrollTo(0, previous.scroll);
  }, options);
  bar.addEventListener('click', event => {
    const go = event.target.closest('[data-workflow-go]')?.dataset.workflowGo; if (!go) return;
    let target = ({ interview: $('#s-subj'), copm: $('#as-copm:not([hidden])') || $('#ac-copm'), activity: document.getElementById(editorWorkflow.activity) || form.querySelector('.tx:not([hidden])') || $('#remediation'), response: $('#sessionResponse'), reasoning: $('#clinicalLinks'), plan: $('#s-plan') })[go];
    if (go === 'pre' || go === 'post') {
      const item = $('#as-' + editorWorkflow.assessment), phase = go === 'pre' ? 'pre' : 'post';
      if (item) {
        editorWorkflow.back = captureEditorPosition() || { scroll: scrollY }; $('#workflowBack').disabled = false;
        navigateEditor(item, false); assessmentResultForm(editorWorkflow.assessment, { phase }); return;
      } else target = $('#assessList');
    }
    navigateEditor(target);
  }, options);
  form.addEventListener('click', async event => {
    if (!form.isConnected || !editing || view !== 'edit') return;
    if (event.target.closest('#useSubjectiveProblem')) {
      if (savingSession || savingItems) return;
      editing = collectSession();
      if (!editing.subjective.trim()) { toast(ui('先填寫主觀描述，再建立問題連結。')); navigateEditor($('#s-subj')); return; }
      editing.clinicalLinks ||= [];
      let link = editing.clinicalLinks.find(link => link.subjectiveRef);
      if (!link) {
        if (editing.clinicalLinks.length >= 100) { toast(ui('症狀連結最多 100 項。')); return; }
        link = { id: uid('cl'), category: 'functional', symptom: editing.subjective, subjectiveRef: true, reasoning: '', peo: [], evidence: [], evidenceNotes: '', interventions: [], interventionNotes: '' };
        editing.clinicalLinks.push(link);
      }
      dirty = true; renderClinicalLinks(editing);
      navigateEditor([...form.querySelectorAll('[data-clinical-link]')].find(row => row.dataset.id === link.id)?.querySelector('[data-clinical="reasoning"]'));
      refreshStatus(); return;
    }
    const unlink = event.target.closest('[data-unlink-subjective]');
    if (unlink) {
      if (savingSession || savingItems) return;
      editing = collectSession();
      const link = editing.clinicalLinks.find(link => link.id === unlink.dataset.unlinkSubjective);
      if (link) delete link.subjectiveRef;
      dirty = true; renderClinicalLinks(editing); refreshStatus(); return;
    }
    const clear = event.target.closest('[data-workflow-clear]');
    if (clear) {
      if (savingSession || savingItems) return;
      const item = document.getElementById(clear.dataset.workflowClear), id = item.dataset.id || item.id.slice(3);
      const recordKey = workflowKey();
      editing = collectSession();
      if (item.classList.contains('as') && Object.values(editing.assess).some(data => data.resultRef?.item === id)) { toast(ui('此結果正被其他項目引用，請先取消引用。')); return; }
      const label = item.querySelector('.as-head b, .tx-head').textContent;
      if (!await ask(ui('清除 {0} 的本次結果與備註？項目設定與其他病歷不變。', label), ui('清除結果'))) return;
      if (!editing || view !== 'edit' || savingSession || savingItems || workflowKey() !== recordKey) return;
      if (item.classList.contains('as')) delete editing.assess[id];
      else if ((editing.clinicalLinks || []).some(link => link.interventions.includes(trainingLinkId(id)))) editing.training[id] = { on: true };
      else delete editing.training[id];
      dirty = true; renderEditor();
      navigateEditor(document.getElementById((item.classList.contains('as') ? 'ac-' : 'tx-') + id + (item.classList.contains('as') ? '' : '-on')), false);
    }
  }, options);
  let frame = null;
  window.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = null; if (!bar.isConnected) return;
      const line = workflowTop() + 20;
      const nodes = [...form.querySelectorAll('.soap-sec, .as:not([hidden]), .tx:not([hidden]), .short-stage, .run, .clinical-link')].filter(node => {
        const rect = node.getBoundingClientRect(); return rect.top <= line && rect.bottom > line && node.getClientRects().length;
      });
      const active = document.activeElement;
      const activeRect = form.contains(active) ? active.getBoundingClientRect() : null;
      if (activeRect && activeRect.top >= workflowTop() && activeRect.bottom <= innerHeight) updateWorkflowPath(active);
      else if (nodes.length) updateWorkflowPath(nodes.at(-1));
      if (form.contains(active) && active.id) editorWorkflow.position = { id: active.id, offset: active.getBoundingClientRect().top, scroll: scrollY };
    });
  }, { ...options, passive: true });
  workflowResize = new ResizeObserver(() => {
    if (bar.isConnected) document.documentElement.style.setProperty('--workflow-height', bar.getBoundingClientRect().height + 'px');
  });
  workflowResize.observe(bar);
  updateWorkflowPath($('#s-date'));
  if (position) requestAnimationFrame(() => {
    if (!bar.isConnected) return;
    const target = document.getElementById(position.id);
    if (target && (!document.activeElement || document.activeElement === document.body || !form.contains(document.activeElement))) {
      revealEditorTarget(target); window.scrollTo(0, scrollY + target.getBoundingClientRect().top - Math.max(workflowTop(), position.offset)); updateWorkflowPath(target);
    }
  });
}
function blankSession() {
  const nums = sessions.map(s => +s.num || 0);
  const last = byDate(sessions).slice(-1)[0];
  const visit = sessions.some(session => session.visit !== 'absent') ? 'treatment' : 'baseline';
  return { id: null, date: today(), num: (nums.length ? Math.max(...nums) : 0) + 1, visit, mode: 'inperson', clinician: last?.clinician || '', duration: null,
    subjective: '', feedback: '',
    sym: shapeSym([], visit),
    assess: {}, training: {}, otherTx: '', tolerance: null, assessment: '', plan: '', nextDate: '' };
}

function symptomRowApplies(row) {
  if (row.kind !== 'sub' || rowTotal(row) != null) return true;
  return assessmentItems(cur(), editing).some(item => assessmentSourceId(item) === row.test && ($('#ac-' + item.id)?.checked ?? editing.assess?.[item.id]?.done));
}
function symTableHTML() {
  const rows = editing.sym.filter(symptomRowApplies);
  const base = firstRated(rows);
  return ui`<table class="sym"><thead><tr><th style="text-align:left;padding-left:10px">評分時點</th>
    ${SYMS.map(s => `<th><span data-symptom-label>${language === 'en' ? s.en : s.zh}</span>${helpHTML(language === 'en' ? s.en : s.zh, ui(s.q))}</th>`).join('')}
    <th>總分</th><th>與首次<br>評分差異</th><th><span class="sr" style="position:absolute;left:-9999px">移除</span></th></tr></thead><tbody>
    ${rows.map(r => {
      const cls = { pre: 'pre', sub: 'pre', end: 'end', rec: 'rec', blk: 'blk' }[r.kind];
      const tp = `<div class="tpname">${esc(tpName(r, false))}</div>${r.kind === 'rec' ? ui`<div class="tpsub"><label for="syr-${r.id}">恢復時間</label><input type="number" min="0" id="syr-${r.id}" value="${val(r.recMin)}"> 分鐘</div>` : ''}`;
      return `<tr class="${cls}" data-row="${r.id}"><td class="tp">${tp}</td>
        ${SYMS.map(s => { const v = r.scores?.[s.k]; const b = base?.scores?.[s.k];
          const flag = base && r.id !== base.id && v != null && b != null && v - b >= 2;
          return ui`<td><input class="num ${flag ? 'flag' : ''}" type="number" min="0" max="10" step="1" inputmode="numeric" id="sy-${r.id}-${s.k}" value="${val(v)}" aria-label="${esc(tpName(r) + '，' + s.en)}，0 至 10 分"></td>`; }).join('')}
        <td><span class="tot" id="syt-${r.id}">–</span><span class="note" id="syc-${r.id}"></span></td><td><span class="delta" id="syd-${r.id}">–</span></td>
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
function rerenderSym() { editing.sym = readSym(); $('#symWrap').innerHTML = symTableHTML(); updateSym(); }
function updateSym() {
  const rows = readSym();
  const base = firstRated(rows); const bt = rowTotal(base);
  for (const r of rows) {
    const total = $('#syt-' + r.id); if (!total) continue;
    const t = rowTotal(r); total.textContent = t ?? '–';
    $('#syc-' + r.id).textContent = ' · ' + ui('已評 {0}/5', symRatedCount(r));
    const d = $('#syd-' + r.id);
    const x = symptomChange(base, r);
    if (base && r.id !== base.id && x != null) { d.textContent = signed(x); d.className = 'delta ' + (x > 0 ? 'up' : x < 0 ? 'down' : ''); }
    else if (base && r.id !== base.id && t != null && bt != null) { d.textContent = ui('評分項目不同，未計算合計差異。'); d.className = 'delta note'; }
    else { d.textContent = '–'; d.className = 'delta'; }
    for (const k of SK) {
      const el = $(`#sy-${r.id}-${k}`); const v = r.scores[k], b = base?.scores?.[k];
      const flag = base && r.id !== base.id && v != null && b != null && v - b >= 2;
      el.classList.toggle('flag', flag); el.title = flag ? ui('比首次評分增加至少 2 分') : '';
    }
  }
  const rec = rows.find(r => r.kind === 'rec');
  $('#symSummary').innerHTML = rows.filter(r => r.kind !== 'rec' && rowTotal(r) != null)
    .map(r => `<div class="${r.kind === 'end' ? 'metric-end' : r.kind === 'pre' ? 'metric-pre' : ''}"><dt>${esc(tpName(r))}</dt><dd>${rowTotal(r)}</dd><small class="note">${ui('已評 {0}/5', symRatedCount(r))}</small></div>`).join('') +
    (() => { const l = lastRated(rows), change = symptomChange(base, l); return base && l && l.id !== base.id ? ui`<div class="metric-change ${change > 0 ? 'bad' : change < 0 ? 'good' : ''}"><dt>變化</dt><dd>${change == null ? ui('評分項目不同，未計算合計差異。') : signed(change)}</dd></div>` : ''; })() +
    (rec && rec.recMin != null ? ui`<div><dt>恢復時間</dt><dd>${rec.recMin} 分鐘</dd></div>` : '');
  $('#addRec').hidden = !!rec;
  const response = $('#sessionSymptomSummary'), last = lastRated(rows);
  if (response) response.textContent = base && last
    ? (sameSymptomSet(base, last) ? ui('症狀合計：{0} → {1}（變化 {2}）', bt, rowTotal(last), signed(symptomChange(base, last)))
      : ui('症狀合計：{0} → {1}；評分項目不同，未計算差異。', bt, rowTotal(last))) + ' · ' + ui('已評 {0}/5', symRatedCount(base)) + ' → ' + ui('已評 {0}/5', symRatedCount(last))
    : ui('尚未填寫症狀評分；可回到評估區填寫。');
  updateClinicalConsistency();
}

// Assessment selection opens a draft; only completed drafts become the text shown in the record.
function pickGroups(groups) {
  return groups.filter(g => g.items.length).map(g => g.title
    ? `<div class="pick-label" id="${g.id}">${esc(g.title)}</div><div class="pick-group" role="group" aria-labelledby="${g.id}">${g.items.join('')}</div>`
    : `<div class="pick-group" role="group" aria-label="${esc(g.label)}">${g.items.join('')}</div>`).join('');
}
function assessmentChoices(c, s, category, period) {
  const shown = assessmentEditorGroups(c, s).filter(group => assessmentFunction(group.primary) === category && assessmentPeriod(group.primary) === period);
  const orderedVisual = category === 'visual' && period === 'long';
  if (orderedVisual) shown.sort((a, b) => visualAssessmentRank(a.primary) - visualAssessmentRank(b.primary));
  return orderedVisual ? shown : [...shown.filter(group => group.planned), ...shown.filter(group => !group.planned)];
}
function assessmentSelectionGroups(c, s, category, period) {
  const shown = assessmentChoices(c, s, category, period), planned = shown.filter(group => group.planned);
  if (category === 'visual' && period === 'long' || !planned.length) return [{ label: assessmentFunctionLabel(category), groups: shown }];
  return [{ id: 'assessPlanned-' + period + '-' + category, title: s.visit === 'baseline' ? ui('初次評估項目') : ui('本次應評估'), groups: planned },
    { id: 'assessOther-' + period + '-' + category, title: ui('其他項目'), groups: shown.filter(group => !group.planned) }];
}
function assessHTML(c, s, category, period) {
  const shown = assessmentChoices(c, s, category, period);
  if (!shown.length) return '';
  const orderedVisual = category === 'visual' && period === 'long';
  const planned = shown.filter(group => group.planned), others = shown.filter(group => !group.planned);
  const chip = ({ primary: p, members, planned }) => `<label class="pick"${orderedVisual && planned ? ` title="${s.visit === 'baseline' ? ui('初次評估項目') : ui('本次應評估')}"` : ''}><input type="checkbox" id="ac-${p.id}" data-assessment-members="${members.map(item => item.id).join(',')}" data-planned="${planned}" ${s.assess?.[p.id]?.done ? 'checked' : ''}>${esc(assessmentTemplateLabel(p))}</label>`;
  const picks = pickGroups(assessmentSelectionGroups(c, s, category, period).map(group => ({ ...group, items: group.groups.map(chip) })));
  return picks + '<div class="picked">' + (orderedVisual ? shown : [...planned, ...others]).flatMap(group => group.members.map(p => {
    const a = s.assess?.[p.id] || {};
    const detail = isBuiltInAssessment(p) ? '' : labelText(p.domain);
    const mirror = p === group.primary ? '' : `<input type="checkbox" id="ac-${p.id}" data-assessment-parent="${group.primary.id}" hidden ${a.done ? 'checked' : ''}>`;
    const title = p === group.primary ? assessmentTemplateLabel(p) : ui('本次量測');
    return `${mirror}<section class="as" id="as-${p.id}" data-id="${p.id}" aria-labelledby="as-${p.id}-h" ${a.done ? '' : 'hidden'}>
      <div class="as-head"><b id="as-${p.id}-h">${esc(title)}</b>${detail ? `<span>${esc(detail)}</span>` : ''}<div class="item-workflow-controls">
        <button type="button" class="btn small" data-action="assessment-edit" data-id="${p.id}" aria-label="${esc(ui('編輯 {0} 的結果', assessmentTemplateLabel(p)))}">${ui('編輯結果')}</button>
        <button type="button" class="btn small" data-needs="draft" data-workflow-clear="as-${p.id}">${ui('清除結果')}</button></div></div>
      <div class="as-body">${assessmentResultHTML(c, s, p)}</div></section>`;
  })).join('') + '</div>';
}
function assessmentResultHTML(c, s, item) {
  const data = s.assess?.[item.id] || {}, notes = clinicalAssessmentNotes(data, s);
  const entries = item.copm ? (data.copm || []).map(row => [row.occ || ui('優先職能活動'), ui('表現') + ui('：') + (row.perf ?? '-') + ' / ' + ui('滿意度') + ui('：') + (row.sat ?? '-')])
    : resultEntries(item, data.values).filter(([, value]) => hasValue(value));
  if (item.copm && entries.length) {
    const avg = copmAvg(data.copm), comparison = copmComparison(data.copm, copmBaseline(s.id, s.date, s.visit));
    entries.push([ui('表現平均'), avg.perf ?? '-'], [ui('滿意度平均'), avg.sat ?? '-']);
    if (comparison.perf != null) entries.push([ui('表現變化'), signed(comparison.perf)]);
    if (comparison.sat != null) entries.push([ui('滿意度變化'), signed(comparison.sat)]);
  }
  const reference = measurementReferenceText(c, s, item);
  if (reference) entries.push([ui('結果來源'), reference]);
  if (notes) entries.push([ui('備註'), notes]);
  const warnings = assessmentConsistencyWarnings(item, data.values);
  if (data.resultRef && !s.assess?.[data.resultRef.item]?.done) warnings.push(ui('引用的量測來源無法使用，請重新選擇來源或改為自行填寫。'));
  if (item.copm && s.visit === 'post') {
    const comparison = copmComparison(data.copm, copmBaseline(s.id, s.date, s.visit));
    if (comparison.warning) warnings.push(comparison.warning);
  }
  return (entries.length ? `<dl class="assessment-results">${entries.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`
    : `<p class="note assessment-empty">${ui('尚未填寫結果，可選擇「編輯結果」補填。')}</p>`) +
    `<p class="clinical-missing" data-consistency-warning role="status" ${warnings.length ? '' : 'hidden'}>${esc(warnings.join(' '))}</p>`;
}
function assessmentEntryHTML(c, s, item) {
  const data = s.assess[item.id];
  let body;
  if (item.copm) {
    const previous = byDate(sessions).filter(record => record.id !== s.id && record.assess?.copm?.copm?.some(row => row.occ)).at(-1)?.assess.copm.copm;
    const rows = (data.copm?.length ? data.copm : previous || []).map(row => ({ occ: row.occ, perf: data.copm ? row.perf : null, sat: data.copm ? row.sat : null }));
    while (rows.length < 5) rows.push({ occ: '', perf: null, sat: null });
    body = ui`<div class="copm"><span class="h">優先職能活動</span><span class="h">表現 1 至 10</span><span class="h">滿意度 1 至 10</span>
      ${rows.slice(0, 5).map((row, i) => `<input type="text" id="copm-occ-${i}" value="${val(row.occ)}" aria-label="${esc(ui('第 {0} 項職能活動', i + 1))}">
        <input type="number" min="1" max="10" id="copm-p-${i}" value="${val(row.perf)}" aria-label="${esc(ui('第 {0} 項活動表現', i + 1))}">
        <input type="number" min="1" max="10" id="copm-s-${i}" value="${val(row.sat)}" aria-label="${esc(ui('第 {0} 項活動滿意度', i + 1))}">`).join('')}</div>
      <dl class="score-summary" id="copmSum" aria-label="COPM 評分摘要"></dl>
      ${previous && !data.copm ? ui('<p class="note">已帶入上次 COPM 的職能活動，請對相同活動重新評分。</p>') : ''}`;
  } else body = measurementReferenceHTML(c, s, item) + `<div class="grid">${fieldInputs(item, 'af-' + item.id, data.values)}</div>` +
    `<div class="row"><button type="button" class="btn small" data-action="measure-add" data-id="${item.id}" aria-label="${esc(ui('為 {0} 新增指標', assessmentTemplateLabel(item)))}">${ADD_ICON}${ui('新增指標')}</button></div>`;
  return `<section class="assessment-entry" data-entry="${item.id}"><h4>${esc(assessmentTemplateLabel(item))}${item.outcome ? helpHTML(assessmentTemplateLabel(item), labelText(item.outcome)) : ''}</h4>${body}
    <label class="f" for="an-${item.id}">${ui('備註')}<textarea id="an-${item.id}">${val(clinicalAssessmentNotes(data, s))}</textarea></label>
    <p class="clinical-missing" data-entry-warning="${item.id}" role="status" hidden></p></section>`;
}
function readAssessmentEntry(item, previous, session) {
  const data = { ...clone(previous), done: true, notes: $('#an-' + item.id).value.trim() };
  if (!data.notes && previous.notes && !clinicalAssessmentNotes(previous, session)) data.notes = previous.notes;
  if (!data.notes && !Object.hasOwn(previous, 'notes')) delete data.notes;
  if (item.copm) data.copm = [0, 1, 2, 3, 4].map(i => ({ occ: $('#copm-occ-' + i).value.trim(), perf: numOrNull($('#copm-p-' + i).value), sat: numOrNull($('#copm-s-' + i).value) })).filter(row => row.occ || row.perf != null || row.sat != null);
  else {
    data.values = readFields(item, 'af-' + item.id, previous.values || {});
    if (!Object.keys(data.values).length && !Object.hasOwn(previous, 'values')) delete data.values;
  }
  const ref = document.querySelector(`[data-measurement-ref="${item.id}"]`);
  if (ref) {
    if (ref.value) {
      const [source, phase] = ref.value.split('/');
      data.resultRef = { item: source, phase, ...(document.querySelector(`[data-reference-unit="${item.id}"]`)?.checked ? { unit: 'characters/min' } : {}) };
    } else delete data.resultRef;
  }
  return data;
}
let assessmentDialog = null;
function assessmentResultForm(id, { selecting = false, newItem = false, phase = null } = {}) {
  if (!editing || view !== 'edit' || savingItems || savingSession || $('#layer').firstChild) return;
  const c = cur(), group = assessmentEditorGroups(c, editing).find(group => group.members.some(item => item.id === id));
  if (!group) return;
  const baseline = collectSession();
  if (selecting) for (const item of group.members) {
    if (newItem && item.id === id) delete baseline.assess[item.id];
    else if (editing.assess?.[item.id]) baseline.assess[item.id] = clone(editing.assess[item.id]);
    else delete baseline.assess[item.id];
  }
  editing = baseline;
  const state = { draft: clone(baseline), items: clone(group.members.filter(item => newItem ? item.id === id : selecting || item.id === id || baseline.assess?.[item.id]?.done)), followup: new Map(), key: workflowKey() };
  state.draft.assess ||= {};
  for (const item of state.items) state.draft.assess[item.id] = { ...state.draft.assess[item.id], done: true };
  const m = modal(`<h3>${esc(ui('編輯 {0} 的結果', assessmentTemplateLabel(group.primary)))}</h3>
    <form id="assessmentResultForm" class="item-form" novalidate><div id="assessmentEntries"></div>
      <p id="assessment-error" class="clinical-missing" role="alert" hidden></p><div class="row assessment-dialog-actions">
      <button type="button" class="btn" id="assessment-cancel">${ui('取消')}</button><button type="submit" class="btn app-primary" id="assessment-done">${ui('完成填寫')}</button></div></form>`, () => {
    assessmentDialog = null;
    if (view !== 'edit' || !editing || workflowKey() !== state.key) return;
    renderEditor();
    const target = $('#as-' + id + ':not([hidden]) [data-action="assessment-edit"]') || $('#ac-' + group.primary.id);
    target?.focus({ preventScroll: true });
  });
  assessmentDialog = state; state.modal = m; m.classList.add('assessment-dialog');
  state.read = () => {
    for (const item of state.items) state.draft.assess[item.id] = readAssessmentEntry(item, state.draft.assess[item.id], state.draft);
    applyMeasurementReferences(c, state.draft);
  };
  state.refresh = event => {
    state.read();
    for (const item of state.items) {
      const data = state.draft.assess[item.id], source = assessmentItems(c, state.draft).find(p => p.id === data.resultRef?.item);
      const select = m.querySelector(`[data-measurement-ref="${item.id}"]`);
      if (select && event?.target === select) {
        const holder = document.createElement('div'); holder.innerHTML = measurementReferenceHTML(c, state.draft, item);
        select.closest('.measurement-reference').replaceWith(holder.firstElementChild);
        m.querySelector(`[data-measurement-ref="${item.id}"]`).focus({ preventScroll: true });
      }
      const linkedFields = source ? measurementReferenceFields(item, source, data.resultRef.phase).map(([field]) => field.id) : [];
      fieldsFor(item).forEach((field, index) => {
        const input = $('#af-' + item.id + '-' + index); if (!input) return;
        input.readOnly = linkedFields.includes(field.id);
        if (input.readOnly) input.value = data.values?.[field.id] ?? '';
      });
      const status = m.querySelector(`[data-measurement-status="${item.id}"]`);
      if (status) status.textContent = data.resultRef && !state.draft.assess[data.resultRef.item]?.done ? ui('引用的量測來源無法使用，請重新選擇來源或改為自行填寫。') : measurementReferenceText(c, state.draft, item);
      const warning = m.querySelector(`[data-entry-warning="${item.id}"]`), lines = assessmentConsistencyWarnings(item, data.values);
      warning.textContent = lines.join(' '); warning.hidden = !lines.length;
    }
    updateCopm();
  };
  state.draw = () => {
    m.querySelector('#assessmentEntries').innerHTML = state.items.map(item => assessmentEntryHTML(c, state.draft, item)).join('');
    state.refresh();
  };
  const form = m.querySelector('#assessmentResultForm');
  form.addEventListener('input', state.refresh); form.addEventListener('change', state.refresh);
  m.querySelector('#assessment-cancel').onclick = () => closeModal();
  m.addEventListener('keydown', event => { if (savingItems && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); } });
  form.onsubmit = async event => {
    event.preventDefault(); if (savingItems) return;
    const error = m.querySelector('#assessment-error'); error.hidden = true;
    const invalid = [...form.querySelectorAll('input, select, textarea')].find(input => !input.validity.valid);
    if (invalid) {
      for (let parent = invalid.parentElement; parent !== form; parent = parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
      error.textContent = ui('請核對標示的欄位後再完成填寫。'); error.hidden = false; invalid.focus(); invalid.reportValidity(); return;
    }
    state.read();
    try {
      validateMeasurementReferences(c, state.draft);
      if (state.followup.size) {
        const next = preserveLegacyTemplates(clone(cur()), cur());
        for (const [id, fields] of state.followup) {
          const template = next.plan.find(item => item.id === id);
          template.fields = [...fieldsFor(template), ...fields];
          if (new Set(template.fields.map(fieldLabel)).size !== template.fields.length) throw new Error(ui('欄位名稱與單位不可重複。'));
        }
        validateItems(next.plan, 'assessment');
        savingItems = true; state.saving = true; form.inert = true; form.setAttribute('aria-busy', 'true'); m.querySelector('#assessment-done').textContent = ui('正在儲存…'); renderCommands();
        try { await store.saveClient(next); } finally { savingItems = false; state.saving = false; form.inert = false; form.removeAttribute('aria-busy'); m.querySelector('#assessment-done').textContent = ui('完成填寫'); renderCommands(); }
        clients[clients.findIndex(client => client.id === next.id)] = next;
      }
      if (assessmentDialog !== state || workflowKey() !== state.key) return;
      state.draft.assessmentPlan = [...(state.draft.assessmentPlan || []).filter(item => !state.items.some(entry => entry.id === item.id)), ...state.items];
      dirty ||= JSON.stringify(state.draft.assess) !== JSON.stringify(baseline.assess) || state.followup.size > 0 ||
        state.items.some(item => JSON.stringify(item) !== JSON.stringify(assessmentItems(c, baseline).find(previous => previous.id === item.id)));
      if (newItem) editorWorkflow.assessmentPrimaries.set(assessmentGroupKey(state.items.find(item => item.id === id)), id);
      editing = state.draft; closeModal();
    } catch (err) { error.textContent = ui('結果尚未更新') + ' ' + errorGuidance(err).text; error.hidden = false; showFailure(err, ui('結果尚未更新')); }
  };
  state.draw();
  const stage = phase && [...m.querySelectorAll('.short-stage')].find(stage => stage.querySelector('legend, summary').textContent === phaseLabel(phase));
  if (stage?.tagName === 'DETAILS') stage.open = true;
  (stage?.querySelector('input, select, textarea') || m.querySelector('input, select, textarea') || m.querySelector('#assessment-done')).focus();
}
function measureForm(id) {
  const state = assessmentDialog, c = cur(), item = state?.items.find(p => p.id === id);
  if (!item || item.copm) return;
  state.read();
  const m = state.modal, resultForm = m.querySelector('#assessmentResultForm'); resultForm.hidden = true;
  const panel = document.createElement('div'); panel.innerHTML = ui`<h4>${esc(ui('為 {0} 新增指標', assessmentTemplateLabel(item)))}</h4>
    <form id="measureForm" class="item-form">
      <p class="note" id="measure-scope">此指標只加入本次紀錄；其他病歷與項目設定不變。</p>
      <label class="f" for="measure-name">指標名稱<input id="measure-name" type="text" maxlength="180" required></label>
      <div class="grid"><label class="f" for="measure-type">類型<select id="measure-type"><option value="text">文字</option><option value="number">數值</option></select></label>
        <label class="f" for="measure-unit">單位（選填）<input id="measure-unit" type="text" maxlength="40"></label></div>
      <label class="pick"><input id="measure-followup" type="checkbox" ${c.plan.some(p => p.id === id) ? '' : 'disabled'}>之後也要追蹤（加入此個案模板）</label>
      ${c.plan.some(p => p.id === id) ? '' : ui('<p class="note">此歷史項目不在目前模板；如需持續追蹤，請先在項目設定建立。</p>')}
      <p id="measure-error" role="alert" hidden></p>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn" id="measure-cancel">取消</button><button type="submit" class="btn app-primary">${ADD_ICON}新增指標</button></div>
    </form>`; m.append(panel);
  const back = () => { panel.remove(); resultForm.hidden = false; resultForm.querySelector(`[data-action="measure-add"][data-id="${id}"]`).focus(); };
  const escape = event => { if (event.key === 'Escape' && panel.isConnected) { event.preventDefault(); event.stopPropagation(); back(); } };
  panel.addEventListener('keydown', escape);
  panel.querySelector('#measure-cancel').onclick = back;
  panel.querySelector('#measure-followup').onchange = event => { $('#measure-scope').textContent = event.target.checked ? ui('此指標將在完成填寫後加入本次紀錄及此個案的後續模板，既有病歷不變。') : ui('此指標只加入本次紀錄；其他病歷與項目設定不變。'); };
  panel.querySelector('form').onsubmit = event => {
    event.preventDefault();
    const draft = clone(item), field = { id: uid('f'), label: $('#measure-name').value.trim(), type: $('#measure-type').value, unit: $('#measure-unit').value.trim() };
    try {
      if (!field.label) throw new Error(ui('請填寫指標名稱。'));
      draft.fields = [...fieldsFor(item), field];
      if (new Set(draft.fields.map(f => fieldLabel(f))).size !== draft.fields.length) throw new Error(ui('欄位名稱與單位不可重複。'));
      validateItems([draft], 'assessment');
      if ($('#measure-followup').checked) {
        state.followup.set(id, [...(state.followup.get(id) || []), field]);
      }
      state.items[state.items.findIndex(p => p.id === id)] = draft;
      state.draft.assessmentPlan = [...(state.draft.assessmentPlan || []).filter(p => p.id !== id), draft];
      back(); state.draw(); $('#af-' + id + '-' + (draft.fields.length - 1)).focus();
    } catch (error) { $('#measure-error').hidden = false; $('#measure-error').textContent = ui('無法更新量測欄位') + ' ' + errorGuidance(error).text; showFailure(error, ui('無法更新量測欄位')); }
  };
  $('#measure-name').focus();
}
function updateCopm() {
  const box = $('#copmSum'); if (!box) return;
  const rows = [0, 1, 2, 3, 4].map(i => ({ occ: $('#copm-occ-' + i).value, perf: numOrNull($('#copm-p-' + i).value), sat: numOrNull($('#copm-s-' + i).value) }));
  const a = copmAvg(rows), b = copmBaseline(editing.id, ($('#s-date') || {}).value, ($('#s-visit') || {}).value);
  const comparison = copmComparison(rows, b);
  const ch = delta => delta != null ? ui` <span class="delta ${delta > 0 ? 'down' : delta < 0 ? 'up' : ''}">（${signed(delta)}，相較 ${fmtDate(b.date)}）</span>` : '';
  box.innerHTML = ui`<div><dt>表現平均</dt><dd>${a.perf ?? '-'}${ch(comparison.perf)}</dd></div><div><dt>滿意度平均</dt><dd>${a.sat ?? '-'}${ch(comparison.sat)}</dd></div>`;
  let details = $('#copmComparison');
  if (!details) { details = document.createElement('div'); details.id = 'copmComparison'; details.className = 'sub'; details.setAttribute('aria-live', 'polite'); box.after(details); }
  details.hidden = $('#s-visit').value !== 'post';
  const current = rows.filter(r => r.occ.trim() || r.perf != null || r.sat != null), prior = b?.rows || [];
  details.innerHTML = b ? ui`<p class="note">基準日期${ui('：')}${esc(fmtDate(b.date))} · ${esc(ui('已評表現 {0} 項，滿意度 {1} 項', comparison.baseRated.perf, comparison.baseRated.sat))}</p>
    <p class="note">${esc(ui('已評表現 {0} 項，滿意度 {1} 項', comparison.rated.perf, comparison.rated.sat))}</p>
    <div class="scroll"><table class="out" aria-label="基準／本次活動核對"><thead><tr><th>基準活動</th><th>本次活動</th></tr></thead><tbody>${Array.from({ length: Math.max(prior.length, current.length) }, (_, i) => `<tr><td>${esc(prior[i]?.occ || '–')}</td><td>${esc(current[i]?.occ || '–')}</td></tr>`).join('')}</tbody></table></div>
    ${comparison.warning ? `<p class="clinical-missing" role="status">${esc(comparison.warning)}</p>` : ''}` : `<p class="note">${ui('尚無可比較的基準評估。')}</p>`;
}
function assessmentConsistencyWarnings(item, values) {
  if (assessmentSourceId(item) !== 'st_neglect') return [];
  const fields = fieldsFor(item), warnings = [];
  for (const phase of Object.keys(SHORT_PHASES)) {
    const value = label => { const field = fields.find(f => f.phase === phase && sourceNameMatches(f.label, label)); return field ? values?.[field.id] : null; };
    const total = value('Omissions (n)'), left = value('Left-side omissions (n)'), right = value('Right-side omissions (n)');
    if ([total, left, right].every(v => hasValue(v) && Number.isFinite(Number(v))) && Number(total) !== Number(left) + Number(right))
      warnings.push(ui('{0}：總漏答 {1} 與左右合計 {2} 不一致，請核對計分規則。', phaseLabel(phase), total, Number(left) + Number(right)));
  }
  return warnings;
}
function updateClinicalConsistency() {
  if (!$('#soapForm') || !editing) return;
  for (const item of assessmentItems(cur(), editing)) {
    const section = $('#as-' + item.id); if (!section || assessmentSourceId(item) !== 'st_neglect') continue;
    let warning = section.querySelector('[data-consistency-warning]');
    if (!warning) { warning = document.createElement('p'); warning.dataset.consistencyWarning = ''; warning.className = 'clinical-missing'; warning.setAttribute('role', 'status'); section.querySelector('.as-body').append(warning); }
    const lines = assessmentConsistencyWarnings(item, editing.assess?.[item.id]?.values);
    warning.hidden = !$('#ac-' + item.id).checked || !lines.length; warning.textContent = lines.join(' ');
  }
  const notified = $('#abs-notified');
  const contradiction = $('#s-visit').value === 'absent' && $('#abs-reason').value === ABSENCE_REASONS[0] && NOTIFIED.slice(0, 2).includes(notified.value);
  const message = contradiction ? ui('缺席原因為未通知，通知狀態不能填已通知。') : '';
  notified.setCustomValidity(message);
  let warning = $('#absenceConsistency');
  if (!warning) { warning = document.createElement('p'); warning.id = 'absenceConsistency'; warning.className = 'clinical-missing'; warning.setAttribute('role', 'status'); notified.closest('.grid').after(warning); }
  warning.hidden = !message; warning.textContent = message;
}
document.addEventListener('input', e => { if (/^af-/.test(e.target.id)) updateClinicalConsistency(); });
document.addEventListener('change', e => { if (/^(abs-|ac-)/.test(e.target.id) || e.target.id === 's-visit') updateClinicalConsistency(); });

function interventionPicks(approach) {
  return [...document.querySelectorAll(`#${approach}Picks input:checked`)].map(input => input.dataset.strategy);
}
function strategyChoices(mode, approach, picks = [], s) {
  const currentMode = mode || 'inperson', catalog = INTERVENTIONS[currentMode][approach];
  const ids = [...new Set([...Object.keys(catalog), ...picks, ...(s?.interventions?.[approach]?.custom || []).map(item => item.id)])];
  return ids.map(id => {
    const otherMode = Object.keys(INTERVENTIONS).find(key => key !== currentMode && Object.hasOwn(INTERVENTIONS[key][approach], id));
    const label = strategyLabel(approach, id, s) + (otherMode ? ` (${serviceModeLabel(otherMode)})` : '');
    return { id, label };
  });
}
function interventionHTML(mode, approach, picks = [], s) {
  return pickGroups([{ label: approachLabel(approach), items: strategyChoices(mode, approach, picks, s).map(({ id, label }) => {
    return `<label class="pick"><input type="checkbox" data-strategy="${esc(id)}" ${picks.includes(id) ? 'checked' : ''}>${esc(label)}</label>`;
  }) }]);
}
function symptomsHTML(c, s) {
  const optional = !assessmentItems(c, s).some(p => assessmentFunction(p) === 'visual' && p.active !== false) && !(s.sym || []).some(r => rowTotal(r) != null || r.kind === 'rec' && r.recMin != null);
  return ui`<section class="sub" id="visualSymptoms">
    ${optional ? ui('<details class="script" id="optionalVisualSymptoms"><summary>視覺相關症狀自評（選填）</summary><div class="body">') : ''}
    <div class="spread"><h4 aria-label="症狀自評（0 至 10）">症狀自評（0 至 10）${helpHTML(ui('症狀自評（0 至 10）'), [ui('各症狀分別評估「現在」的感受，0 分表示沒有症狀，10 分表示能想像最嚴重的程度。每次復健前後評分；評估時另在追視、凝視、跳視測驗前評分。需要時可加入恢復後評分。比首次增加至少 2 分時，欄位會標紅並顯示提示。'),
      ui('給個案的評分說明'), ui('請用 0 到 10 分，告訴我您現在有多不舒服。0 分就是完全沒有這個症狀；10 分就是您能想像最嚴重、最不舒服的程度。請評「現在」的感覺，不是今天最嚴重的時候，也不是只評比剛才多了多少不舒服。如果現在沒有這個症狀，就給 0 分。'),
      ...SYMS.map(x => (language === 'en' ? x.en : x.zh) + ui('：') + ui(x.q)), ui('療程後／下一項測驗前：') + ui('我們再評一次。請照您現在的感覺給分，跟剛才一樣也沒關係，沒有不舒服就給 0 分。'),
      ui('每次使用相同說明與分數端點；各項症狀分開記錄。「疲勞」指眼睛疲勞，不是全身疲倦。'), ui('表格可左右捲動，或聚焦後使用左右方向鍵。')].join('\n\n'))}</h4>
      <div class="row"><button type="button" class="btn small" data-action="sym-rec" id="addRec">${ADD_ICON}新增恢復後評分</button></div></div>
    <div class="scroll" id="symWrap" tabindex="0" role="region" aria-label="${ui('症狀評分表，可左右捲動')}">${symTableHTML()}</div>
    <dl class="score-summary" id="symSummary" aria-label="症狀分數"></dl>
    ${optional ? '</div></details>' : ''}
  </section>`;
}
function sessionResponseHTML(s) {
  return ui`<div class="sub" id="sessionResponse"><h4>本次反應</h4><p class="note" id="sessionSymptomSummary" aria-live="polite"></p><button type="button" class="btn small" data-action="edit-symptoms">編輯症狀評分</button>
    <label class="f" for="s-tol">個案自評整體耐受度（0 分最差，10 分最佳）<input type="number" min="0" max="10" step="1" inputmode="numeric" id="s-tol" value="${val(s.tolerance)}"></label></div>`;
}
function trainingEntryHTML(t, s) {
  const d = s.training?.[t.k] || {};
  const custom = [...new Set([...sessions.flatMap(x => x.training?.[t.k]?.acts || []), ...(d.acts || [])])].filter(a => !(t.acts || []).some(existing => labelText(existing) === labelText(a)));
  const groups = trainingActivityGroups([...(t.acts || []), ...(t.k === 'ocular' ? ['EyeDot Trainer'] : []), ...custom, ...(d.acts || [])], d.acts || [], d.actScores || {});
  const selected = a => (d.acts || []).find(x => x === a) ?? (d.acts || []).find(x => activityLabel(x) === activityLabel(a)) ?? (a === 'EyeDot Trainer' && d.eyedot?.length ? a : undefined);
  return ui`<section class="tx" id="tx-${t.k}" aria-labelledby="tx-${t.k}-h">
    <h4 class="tx-head" id="tx-${t.k}-h">${esc(labelText(t.label))}</h4><div class="tx-body">
      <div class="acts" id="tx-${t.k}-acts">${groups.map((group, i) => actChip(t.k, i, group.name, selected(group.name) != null, group.members)).join('')}</div>
      <div class="row"><input type="text" id="tx-${t.k}-new" data-k="${t.k}" placeholder="輸入活動名稱" style="flex:1;min-width:0" aria-label="新增${esc(labelText(t.label))}活動"><button type="button" class="btn small" data-action="act-add" data-k="${t.k}">${ADD_ICON}加入活動</button></div>
      <div class="act-score-box"><div class="pick-label">各活動表現（一項一個分數）${helpHTML(ui('各活動表現（一項一個分數）'), ui('勾選本次活動，逐項記錄表現與單位；例如 85%、12 次或 40 秒。'))}</div>
        <div class="act-scores" id="tx-${t.k}-scores">${groups.map((group, i) => actScoreRow(t.k, i, group.name, selected(group.name) != null, d.actScores?.[selected(group.name) ?? group.name])).join('')}</div></div>
      ${RUN_ITEMS[t.k] ? runsHTML(t.k, d.runs || []) : ''}
      ${t.k === 'ocular' ? ui`<div class="sub" id="eyeDotRecords" ${selected('EyeDot Trainer') != null || d.eyedot?.length ? '' : 'hidden'} style="border-top:0;padding-top:4px">
        <div class="spread"><h4>EyeDot Trainer 訓練紀錄${helpHTML(ui('模式說明'), ui('此程式不會開啟外部網站。若需要線上說明，請自行複製以下網址。') + '\nhttps://eyedottrainer.com/#modes\n\n' + ui('表格可左右捲動，或聚焦後使用左右方向鍵。'))}</h4><div class="row">
          <button type="button" class="btn small" data-action="ed-add">${ADD_ICON}新增紀錄</button></div></div>
        <div id="edWrap">${eyedotHTML(d.eyedot || [])}</div></div>` : ''}
      <div class="grid">
        <label class="f" for="tx-${t.k}-program">程式／設備<input type="text" id="tx-${t.k}-program" value="${val(d.program)}" placeholder="使用的軟體或工具"></label>
        <label class="f" for="tx-${t.k}-dur">時間（分鐘）<input type="number" min="0" step="any" id="tx-${t.k}-dur" value="${val(d.dur)}"></label>
        <label class="f" for="tx-${t.k}-level">級別／設定<input type="text" id="tx-${t.k}-level" value="${val(d.level)}" placeholder="速度、目標大小、視野範圍"></label>
        ${!groups.length || d.perf ? ui`<label class="f" for="tx-${t.k}-perf">${groups.length ? ui('整體表現') : ui('表現')}<input type="text" id="tx-${t.k}-perf" value="${val(d.perf)}" placeholder="正確率、反應時間、得分"></label>` : ''}
        <div class="f"><div class="field-label"><label for="tx-${t.k}-diff">個案自評難度（0 至 10）</label>${helpHTML(ui('個案自評難度（0 至 10）'), ui('難度自評使用 0 至 10；請與個案確認一致的端點定義。耐受度另填。'))}</div>
          <input type="number" min="0" max="10" step="1" inputmode="numeric" id="tx-${t.k}-diff" value="${val(d.diff)}"></div>
      </div>
      ${fieldsFor(t).length ? `<div class="grid">${fieldInputs(t, 'tf-' + t.k, d.values)}</div>` : ''}
      <label class="f" for="tx-${t.k}-notes">觀察紀錄<textarea id="tx-${t.k}-notes" style="min-height:60px">${val(d.notes)}</textarea></label>
    </div></section>`;
}
function trainingDetailLines(t, d) {
  return [
    ...(d.acts?.length ? [ui`活動：${actSummary(d)}`] : []),
    ...(d.eyedot || []).map((r, i) => `EyeDot Trainer ${i + 1}：${edSummary(r)}${r.notes ? '，' + r.notes : ''}`),
    ...(d.runs || []).map(r => ui('測驗紀錄：') + runLine(r)),
    ...(d.program ? [ui`程式／設備：${d.program}`] : []),
    ...(d.level ? [ui`級別／設定：${d.level}`] : []),
    ...(d.perf ? [ui`表現：${d.perf}`] : []),
    ...(d.diff != null ? [ui`個案自評難度：${d.diff}/10`] : []),
    ...resultEntries(t, d.values).map(([label, value]) => `${label}：${value}`),
    ...(d.notes ? [ui`觀察：${d.notes}`] : [])
  ];
}
const trainingHeadingText = (t, d) => labelText(t.label) + (d.dur != null ? '：' + d.dur + ui(' 分鐘') : '');
function trainingSummaryHTML(t, s) {
  const d = s.training?.[t.k] || {}, lines = trainingDetailLines(t, d);
  return `<section class="tx" id="tx-summary-${t.k}" data-id="${t.k}" aria-labelledby="tx-summary-${t.k}-h" ${d.on ? '' : 'hidden'}>
    <div class="as-head"><b class="tx-head" id="tx-summary-${t.k}-h">${esc(trainingHeadingText(t, d))}</b><div class="item-workflow-controls">
      <button type="button" class="btn small" data-action="training-edit" data-id="${t.k}" aria-label="${esc(ui('編輯 {0} 的結果', labelText(t.label)))}">${ui('編輯')}</button>
      <button type="button" class="btn small" data-needs="draft" data-workflow-clear="tx-summary-${t.k}">${ui('清除結果')}</button></div></div>
    ${lines.length || d.dur != null ? `<div class="training-results">${esc(lines.join('\n'))}</div>` : `<p class="note assessment-empty">${ui('尚未填寫結果，可選擇「編輯」補填。')}</p>`}</section>`;
}
function readTrainingEntry(t, s) {
  const prior = s.training?.[t.k] || {}, g = key => $(`#tx-${t.k}-${key}`)?.value ?? '';
  const chips = [...document.querySelectorAll(`#tx-${t.k}-acts input[data-act]`)];
  const members = chip => JSON.parse(chip.dataset.actMembers || JSON.stringify([chip.dataset.act]));
  const selected = [...new Set(chips.filter(chip => chip.checked).flatMap(members))];
  const acts = (prior.acts || []).some(isRetiredCombinedActivity)
    ? [...prior.acts.filter(name => isRetiredCombinedActivity(name) || selected.includes(name)), ...selected.filter(name => !prior.acts.includes(name))] : selected;
  const actScores = { ...prior.actScores }, actScoreRefs = { ...prior.actScoreRefs };
  for (const chip of chips) {
    const value = $('#' + chip.dataset.score.replace(/-r(\d+)$/, '-s$1'))?.value.trim() ?? '';
    if (value) actScores[chip.dataset.act] = value; else delete actScores[chip.dataset.act];
  }
  for (const select of document.querySelectorAll(`[data-activity-ref][data-training="${t.k}"]`)) {
    if (select.value) actScoreRefs[select.dataset.activityRef] = select.value; else delete actScoreRefs[select.dataset.activityRef];
  }
  const data = { ...prior, on: true, acts, ...(t.k === 'ocular' ? { eyedot: readEyedot(s) } : {}),
    program: g('program').trim(), dur: numOrNull(g('dur')), level: g('level').trim(), perf: g('perf').trim(), diff: numOrNull(g('diff')), notes: g('notes') };
  const values = readFields(t, 'tf-' + t.k, prior.values || {});
  for (const [key, value] of Object.entries({ actScores, actScoreRefs, values })) { if (Object.keys(value).length) data[key] = value; else delete data[key]; }
  if (RUN_ITEMS[t.k]) { const runs = readRuns(t.k, s); if (runs.length) data.runs = runs; else delete data.runs; }
  return data;
}
let trainingDialog = null;
function trainingResultForm(id, { selecting = false, focusId = null } = {}) {
  if (!editing || view !== 'edit' || savingItems || savingSession || $('#layer').firstChild) return;
  const c = cur(), item = trainingItems(c, editing).find(t => t.k === id); if (!item) return;
  const baseline = collectSession();
  if (selecting) {
    if (editing.training?.[id]) baseline.training[id] = clone(editing.training[id]); else delete baseline.training[id];
  }
  editing = baseline;
  const state = { draft: clone(baseline), item, key: workflowKey() };
  state.draft.training[id] = { ...state.draft.training[id], on: true };
  const m = modal(`<h3>${esc(ui('編輯 {0} 的結果', labelText(item.label)))}</h3><form id="trainingResultForm" class="item-form" novalidate>
    ${trainingEntryHTML(item, state.draft)}<p id="training-notice" class="note" role="status" hidden></p><p id="training-error" class="clinical-missing" role="alert" hidden></p>
    <div class="row training-dialog-actions"><button type="button" class="btn" id="training-cancel">${ui('取消')}</button><button type="submit" class="btn app-primary" id="training-done">${ui('完成')}</button></div></form>`, () => {
    trainingDialog = null;
    if (view !== 'edit' || !editing || workflowKey() !== state.key) return;
    renderEditor();
    ($('#tx-summary-' + id + ':not([hidden]) [data-action="training-edit"]') || $('#tx-' + id + '-on'))?.focus({ preventScroll: true });
  });
  trainingDialog = state; state.modal = m; m.classList.add('training-dialog');
  state.read = () => { state.draft.training[id] = readTrainingEntry(item, state.draft); return applyMeasurementReferences(c, state.draft); };
  const form = m.querySelector('form');
  form.addEventListener('change', event => {
    if (event.target.dataset.act != null) {
      showActScore(event.target);
      if (!event.target.checked) { const notice = m.querySelector('#training-notice'); notice.textContent = ui('已取消本次活動；原有表現保留，可再次勾選查看。'); notice.hidden = false; }
    }
    if (/^ed-.+-mode$/.test(event.target.id)) rerenderEd();
  });
  form.addEventListener('keydown', event => { if (event.key === 'Enter' && event.target.id === 'tx-' + id + '-new') { event.preventDefault(); addActivity(id); } });
  form.addEventListener('focusin', event => { updateWorkflowPath(event.target); if (event.target.id && event.target.matches('input, select, textarea')) editorWorkflow.position = editorWorkflow.trainingPosition = { id: event.target.id, training: id }; });
  m.querySelector('#training-cancel').onclick = () => closeModal();
  form.onsubmit = event => {
    event.preventDefault(); const error = m.querySelector('#training-error'); error.hidden = true;
    const invalid = [...form.querySelectorAll('input, select, textarea')].find(input => !input.validity.valid);
    if (invalid) { revealEditorTarget(invalid); error.textContent = ui('請核對標示的欄位後再完成復健紀錄。'); error.hidden = false; invalid.focus(); invalid.reportValidity(); return; }
    try {
      state.read(); validateMeasurementReferences(c, state.draft);
      dirty ||= JSON.stringify(state.draft.training) !== JSON.stringify(baseline.training);
      editing = state.draft; closeModal();
    } catch (err) { error.textContent = ui('結果尚未更新') + ' ' + err.message; error.hidden = false; }
  };
  setupMeasurementReferences(form, state.read);
  const target = focusId && document.getElementById(focusId);
  revealEditorTarget(target);
  (target || form.querySelector('input, select, textarea') || m.querySelector('#training-done')).focus();
}
function renderEditor() {
  hideHelp();
  const c = cur(), s = editing;
  applyMeasurementReferences(c, s);
  const previousPosition = editorWorkflow?.key === workflowKey() ? captureEditorPosition() : null;
  const previousClinicalOpen = editorWorkflow?.key === workflowKey() ? clinicalLinkOpenState() : new Map();
  const assessmentSections = ['short', 'long'].map(period => {
    const groups = ASSESSMENT_FUNCTIONS.map(category => {
      const content = assessHTML(c, s, category, period);
      return content ? `<section class="assessment-group" data-function="${category}" aria-labelledby="assess-${period}-${category}-h"><h4 id="assess-${period}-${category}-h">${esc(assessmentFunctionLabel(category))}</h4>${content}</section>` : '';
    }).join('');
    return ui`<section class="assessment-period sub" id="assess-${period}" aria-labelledby="assess-${period}-h"><div class="spread"><h3 id="assess-${period}-h">${period === 'short' ? ui('短期成效') : ui('長期評估')}</h3><button type="button" class="btn small" data-action="plan-add" data-editor="true" data-period="${period}">${ADD_ICON}${period === 'short' ? ui('新增短期指標') : ui('新增長期評估')}</button></div>${groups || (period === 'long' ? ui('<p class="note assessment-empty">尚未設定長期評估。</p>') : '')}</section>`;
  }).join('');
  s.training = s.training || {};
  s.training.ocular = s.training.ocular || {};
  s.training.ocular.eyedot = (s.training.ocular.eyedot || []).map(r => ({ id: r.id || uid('e'), ...r }));
  const txItems = trainingEditorItems(c, s);
  const txPicks = pickGroups([{ label: ui('本次復健項目'), items: txItems.map(t => `<label class="pick"><input type="checkbox" id="tx-${t.k}-on" ${s.training?.[t.k]?.on ? 'checked' : ''}>${esc(labelText(t.label))}</label>`) }]);
  const txBlocks = txItems.map(t => trainingSummaryHTML(t, s)).join('');

  $('#main').innerHTML = ui`
    <div class="editor-head">
      <div class="spread"><div class="client-identity"><span class="eyebrow">${s.id ? ui('編輯復健紀錄') : ui('新增復健紀錄')}</span><h2>${esc(clientLabel(c))}</h2></div><span class="chip acc">編輯中</span></div>
      <p class="note save-hint">${store.kind === 'folder' ? ui('儲存到：') + esc(storageName()) + ' / ' + esc(store.folderOf?.(c.id) || safeName(c.ref || c.name || c.id)) + ui('。本次紀錄使用同名的 CSV、PDF 與 TXT。') : ui('瀏覽器模式：儲存後會下載 ZIP，內含個案資料夾與本次 CSV、PDF。若要直接寫入固定資料夾，請使用支援資料夾存取的 Chrome／Edge。')}</p>
    </div>
    ${carryForwardHTML()}
    ${profileIncompleteHTML(c)}
    ${editorWorkflowHTML(c, s)}
    <form class="panel soap" id="soapForm" autocomplete="off">
      <datalist id="blockList">${BLOCK_SUGGEST.map(b => `<option value="${esc(labelText(b))}"></option>`).join('')}</datalist>
      <div class="grid">
        <label class="f" for="s-date">復健日期<input type="date" id="s-date" value="${val(s.date)}" required></label>
        <label class="f" for="s-num">復健次數<input type="number" min="1" id="s-num" value="${val(s.num)}"></label>
        <label class="f" for="s-visit">紀錄類型<select id="s-visit">${VISITS.map(v => `<option value="${v.k}" ${s.visit === v.k ? 'selected' : ''}>${ui(v.label)}</option>`).join('')}</select></label>
        <label class="f" for="s-mode">服務型態<select id="s-mode" aria-label="服務型態" ${s.visit === 'absent' ? 'disabled' : ''}>${s.mode == null ? ui('<option value="" selected>未指定</option>') : ''}<option value="inperson" ${s.mode === 'inperson' ? 'selected' : ''}>面對面</option><option value="telerehab" ${s.mode === 'telerehab' ? 'selected' : ''}>遠距復健</option></select></label>
        <label class="f" for="s-clin">治療師<input type="text" id="s-clin" value="${val(s.clinician)}"></label>
        <label class="f" for="s-dur">復健時間（分鐘）<input type="number" min="0" step="any" id="s-dur" value="${val(s.duration)}" ${s.visit === 'absent' ? 'disabled' : ''}></label>
      </div>

      <section id="absBlock" class="sub" style="border-top:0;padding-top:0" ${s.visit === 'absent' ? '' : 'hidden'}>
        <div class="sec-title"><h3>缺席紀錄${helpHTML(ui('缺席紀錄'), ui('缺席不記錄實際治療時間與服務型態；切回出席仍保留原草稿。'))}</h3><span class="note">本次未出席，不填寫 SOAP 或症狀評分。</span></div>
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
        <button type="button" class="btn small" data-needs="draft" id="useSubjectiveProblem">沿用主訴建立問題</button>
        <label class="f" for="s-fb">個案對本次復健的回饋<textarea id="s-fb" style="min-height:60px" placeholder="訓練進行中與結束後的感受">${val(s.feedback)}</textarea></label>
      </div></section>

      <section class="soap-sec"><div class="letter">O</div><div class="sec-body">
        <div class="sec-title"><h3 aria-label="評估">評估${helpHTML(ui('評估'), ui('勾選後在視窗填寫，完成後顯示文字結果。取消勾選會保留結果，並排除本次報告。'))}</h3></div>
        <label class="f" for="s-obj">觀察與客觀描述<textarea id="s-obj" style="min-height:80px">${val(s.objective)}</textarea></label>
        ${symptomsHTML(c, s)}${sessionResponseHTML(s)}

        <div class="sub" style="border-top:0;padding-top:0">
          <div class="row" style="justify-content:flex-end"><button type="button" class="btn small" data-action="plan-add" data-editor="true">${ADD_ICON}新增評估項目</button></div>
        </div>
        <div id="assessList">
        ${assessmentSections}
        </div>
      </div></section>

      <section class="soap-sec"><div class="letter">A</div><div class="sec-body">
        <div class="sec-title"><h3>PEO 臨床推理</h3></div>
        <div class="sub" style="border-top:0;padding-top:0">
          <div class="spread"><h4>症狀、推理與介入連結</h4><button type="button" class="btn small" data-action="clinical-link-add">${ADD_ICON}新增症狀連結</button></div>
          <div class="clinical-links" id="clinicalLinks"></div>
        </div>
        <details class="supplemental-notes" ${!s.clinicalLinks?.length || s.assessment || Object.values(s.peo || {}).some(Boolean) ? 'open' : ''}><summary>整體補充（選填）</summary>
        <div class="grid">
          <label class="f" for="s-person">個人<textarea id="s-person" placeholder="視覺功能、症狀、個人因素">${val(s.peo?.person)}</textarea></label>
          <label class="f" for="s-environment">環境<textarea id="s-environment" placeholder="居家、工作、數位環境、照明與設備">${val(s.peo?.environment)}</textarea></label>
          <label class="f" for="s-occupation">作業<textarea id="s-occupation" placeholder="日常作業表現、參與需求、COPM 目標">${val(s.peo?.occupation)}</textarea></label>
        </div>
        <label class="f" for="s-ass">臨床判斷與介入規劃<textarea id="s-ass">${val(s.assessment)}</textarea></label>
        </details>
      </div></section>

      <section class="soap-sec"><div class="letter">P</div><div class="sec-body">
        <div class="sec-title"><h3>介入與計畫</h3></div>
        <div class="sub" id="remediation" style="border-top:0;padding-top:0">
          <div class="spread"><h4>復能${helpHTML(ui('復能'), ui('勾選後在視窗填寫，完成後顯示文字結果。取消勾選會保留結果，並排除本次報告。'))}</h4><button type="button" class="btn small" data-action="training-add" data-editor="true">${ADD_ICON}新增復健項目</button></div>
          ${txPicks}
          <div class="picked">${txBlocks}</div>
          <label class="f" for="s-otx">其他治療／居家計畫<textarea id="s-otx" style="min-height:60px">${val(s.otherTx)}</textarea></label>
        </div>
        ${['adaptation', 'compensation'].map(approach => ui`<div class="sub">
          <h4>${esc(approachLabel(approach))}</h4>
          <div id="${approach}Picks">${interventionHTML(s.mode, approach, s.interventions?.[approach]?.picks, s)}</div>
          <div class="row strategy-entry"><input type="text" id="${approach}-new" maxlength="200" placeholder="輸入方案名稱" aria-label="${esc(ui('新增{0}方案', approachLabel(approach)))}"><button type="button" class="btn small" data-action="strategy-add" data-approach="${approach}">${ADD_ICON}新增方案</button></div>
          <label class="f" for="s-${approach}-notes">${approach === 'adaptation' ? ui('調適備註') : ui('代償備註')}<textarea id="s-${approach}-notes">${val(s.interventions?.[approach]?.notes)}</textarea></label>
        </div>`).join('')}
        <label class="f" for="s-plan">後續計畫<textarea id="s-plan">${val(s.plan)}</textarea></label>
        <div class="grid"><label class="f" for="s-next">下次復健日期<input type="date" id="s-next" value="${val(s.nextDate)}"></label></div>
      </div></section>
      </div>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn editor-copy-action" data-action="copy-editing">複製病歷</button><button type="button" class="btn" data-action="cancel-edit">取消</button><button type="button" class="btn app-primary" data-action="save-session" title="${esc(saveRecordHint())}">儲存紀錄</button></div>
    </form>`;

  const form = $('#soapForm');
  form.onsubmit = e => e.preventDefault();
  form.addEventListener('input', e => {
    if (!editing || view !== 'edit' || !form.isConnected) return;
    const t = e.target;
    if (t.id.startsWith('ac-') || /^tx-.*-on$/.test(t.id)) return;
    dirty = true;
    if (t.id.startsWith('sy')) updateSym();
    if (t.id.startsWith('copm-') || t.id === 's-date') updateCopm();
    if (t.dataset.clinical || /^(af-|an-|copm-|s-subj|s-person|s-environment|s-occupation|s-ass)/.test(t.id)) updateClinicalEvidence();
  });
  form.addEventListener('change', e => {
    if (!editing || view !== 'edit' || !form.isConnected) return;
    const t = e.target;
    if (t.id.startsWith('ac-') && t.checked) { assessmentResultForm(t.id.slice(3), { selecting: true }); return; }
    const trainingPick = t.id.match(/^tx-([A-Za-z0-9_-]+)-on$/);
    if (trainingPick) {
      if (!t.checked && blockLinkedUntick(trainingLinkId(trainingPick[1]), t, true)) return;
      if (t.checked) { trainingResultForm(trainingPick[1], { selecting: true }); return; }
      dirty = true; editing = collectSession(); renderEditor();
      $('#workflowNotice').textContent = ui('已取消本次施測；既有結果保留，但不列入報告。'); $('#workflowNotice').hidden = false; return;
    }
    dirty = true;
    if (t.id === 's-mode') {
      for (const approach of ['adaptation', 'compensation']) {
        const picks = interventionPicks(approach);
        $('#' + approach + 'Picks').innerHTML = interventionHTML(t.value, approach, picks, editing);
      }
      renderClinicalLinks(collectSession());
    }
    if (t.id.startsWith('ac-')) for (const id of (t.dataset.assessmentMembers || t.id.slice(3)).split(',')) {
      $('#ac-' + id).checked = t.checked;
      setSectionEnabled($('#as-' + id), t.checked);
    }
    if (t.id.startsWith('ac-')) {
      editing = collectSession(); renderEditor();
      $('#workflowNotice').textContent = ui('已取消本次施測；既有結果保留，但不列入報告。'); $('#workflowNotice').hidden = false;
      return;
    }
    if (!t.checked && (t.id.startsWith('ac-') || /^tx-.*-on$/.test(t.id) || t.dataset.act != null)) {
      $('#workflowNotice').textContent = t.dataset.act != null ? ui('已取消本次活動；原有表現保留，可再次勾選查看。') : ui('已取消本次施測；既有結果保留，但不列入報告。');
      $('#workflowNotice').hidden = false;
    }
    if (t.dataset.strategy || t.dataset.clinical === 'interventions') syncClinicalSelections(t);
    if (t.dataset.clinical || /^(ac-|af-)/.test(t.id)) updateClinicalEvidence();
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
    if (e.key === 'Enter' && /^(adaptation|compensation)-new$/.test(e.target.id)) { e.preventDefault(); addStrategy(e.target.id.split('-')[0]); }
  });
  form.querySelectorAll('.as, .tx').forEach(box => setSectionEnabled(box, !box.hidden));
  renderClinicalLinks(s, previousClinicalOpen);
  updateSym(); updateCopm();
  setupEditorWorkflow(previousPosition);
  setupMeasurementReferences();
  updateClinicalConsistency();
  queueDraftCopy();
}

function actChip(k, i, a, on, members = [a]) {
  return `<label class="act"><input type="checkbox" id="tx-${k}-a${i}" data-act="${esc(a)}" data-act-members="${esc(JSON.stringify(members))}" data-score="tx-${k}-r${i}" ${on ? 'checked' : ''}>${esc(activityLabel(a))}</label>`;
}
// Activity visibility is independent of its retained result.
function actScoreRow(k, i, a, on, value) {
  return `<label class="f" id="tx-${k}-r${i}" for="tx-${k}-s${i}" ${on ? '' : 'hidden'}>${esc(activityLabel(a))}<input type="text" id="tx-${k}-s${i}" value="${val(value)}" placeholder="${esc(ui('例：85%、12 次、40 秒'))}" aria-label="${esc(ui('{0}的表現', activityLabel(a)))}"></label>`;
}
function showActScore(chip) {
  const row = document.getElementById(chip.dataset.score); if (row) row.hidden = !chip.checked;
  if (chip.dataset.act === 'EyeDot Trainer' && $('#eyeDotRecords')) $('#eyeDotRecords').hidden = !chip.checked;
}
function addStrategy(approach) {
  const input = $('#' + approach + '-new'), name = input.value.trim();
  if (!name) { input.focus(); return; }
  if (name.length > 200) { toast(ui('方案名稱最多 200 字。')); return; }
  editing = collectSession();
  const data = editing.interventions[approach]; data.custom ||= [];
  const existing = [...Object.values(INTERVENTIONS).flatMap(mode => Object.keys(mode[approach])), ...data.custom.map(item => item.id)]
    .find(id => strategyLabel(approach, id, editing).toLocaleLowerCase() === name.toLocaleLowerCase());
  const id = existing || uid('strategy');
  if (!existing && data.custom.length >= 100) { toast(ui('自訂方案最多 100 項。')); return; }
  if (!existing) data.custom.push({ id, name });
  if (!data.picks.includes(id)) data.picks.push(id);
  $('#' + approach + 'Picks').innerHTML = interventionHTML(editing.mode, approach, data.picks, editing);
  input.value = ''; input.focus(); dirty = true;
  renderClinicalLinks(editing);
}
function addActivity(k) {
  const inp = $(`#tx-${k}-new`), v = inp.value.trim(); if (!v) { inp.focus(); return; }
  if (isRetiredCombinedActivity(v)) { toast(ui('請分別勾選跳視訓練與凝視訓練。')); inp.focus(); return; }
  const box = $(`#tx-${k}-acts`);
  const existing = [...box.querySelectorAll('input')].find(i => activityLabel(i.dataset.act).toLocaleLowerCase() === activityLabel(v).toLocaleLowerCase());
  if (existing) { existing.checked = true; showActScore(existing); }
  else {
    const i = box.querySelectorAll('input').length;
    box.insertAdjacentHTML('beforeend', actChip(k, i, v, true));
    $(`#tx-${k}-scores`).insertAdjacentHTML('beforeend', actScoreRow(k, i, v, true, null));
  }
  inp.value = ''; inp.focus();
  if (!trainingDialog) dirty = true;
}

// One card per test run, using the same result and setting boxes as the matching assessment item.
function runsHTML(k, runs) {
  return ui`<div class="runs" id="tx-${k}-runs"><div class="pick-label">測驗紀錄（每次測驗一筆，各自記錄設定）</div>
    ${runs.length ? runs.map(r => runCard(k, r)).join('') : ui('<p class="note" style="margin:0">尚無測驗紀錄。可匯入 OcuTrain 或周邊視野訓練的分數檔，或在下方新增。</p>')}
    <div class="row"><select id="tx-${k}-run-item" aria-label="測驗紀錄項目" style="flex:1;min-width:0">${RUN_ITEMS[k].map(id => `<option value="${id}">${esc(labelText(deviceItem(id).name))}</option>`).join('')}</select>
      <button type="button" class="btn small" data-action="run-add" data-k="${k}">${ADD_ICON}新增測驗紀錄</button></div></div>`;
}
function runCard(k, r) {
  const item = deviceItem(r.item) || { fields: [] }, title = labelText(item.name || r.item);
  return `<section class="run" data-run="${esc(r.id)}" aria-labelledby="rn-${esc(r.id)}-h"><div class="run-head"><h5 id="rn-${esc(r.id)}-h">${esc(title)}${r.time ? ' · ' + esc(r.time) : ''}</h5>
    <button type="button" class="btn x" data-action="run-del" data-k="${k}" data-id="${esc(r.id)}" aria-label="${esc(ui('移除{0}測驗紀錄', title))}">×</button></div>
    <div class="grid">${fieldInputs(item, 'rn-' + esc(r.id), r.values)}</div></section>`;
}
function readRuns(k, s = trainingDialog?.draft || editing) {
  return (s?.training?.[k]?.runs || []).map(r => ({ ...r, values: readFields(deviceItem(r.item) || { fields: [] }, 'rn-' + r.id, r.values || {}) }));
}
function rerenderRuns(k, runs) {
  const s = trainingDialog?.draft || editing;
  s.training[k] = { ...(s.training[k] || {}), runs };
  $('#tx-' + k + '-runs').outerHTML = runsHTML(k, runs);
  if (trainingDialog) setupMeasurementReferences($('#trainingResultForm'), trainingDialog.read); else setupMeasurementReferences();
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
  return ui`<div class="scroll" tabindex="0" role="region" aria-label="EyeDot Trainer 訓練紀錄"><table class="sym ed"><thead><tr><th>模式</th><th>速度</th><th>時間</th><th>方向${rows.some(r => r.mode !== 'Circle') ? helpHTML(ui('方向'), ui('僅圓形模式可選方向')) : ''}</th><th>軌跡${rows.some(r => r.mode === 'Saccade') ? helpHTML(ui('軌跡'), ui('跳視模式無軌跡')) : ''}</th><th>圓點大小</th><th>全螢幕</th><th>圈數／<br>目標數</th><th>最佳表現</th><th>備註</th><th></th></tr></thead><tbody>
    ${rows.map(r => ui`<tr data-ed="${r.id}">
      <td><select id="ed-${r.id}-mode" aria-label="EyeDot 模式">${opt(ED_MODES, r.mode)}</select></td>
      <td><select id="ed-${r.id}-speed" aria-label="速度">${opt(['Slow', 'Medium', 'Fast'], r.speed, x => edSpeedLabel(r.mode, x))}</select></td>
      <td><select id="ed-${r.id}-dur" aria-label="時間">${opt(ED_DUR, r.dur)}</select></td>
      <td><select id="ed-${r.id}-dir" aria-label="方向" ${r.mode === 'Circle' ? '' : 'disabled'}>${opt(['Clockwise', 'Counterclockwise'], r.dir)}</select></td>
      <td><select id="ed-${r.id}-trail" aria-label="軌跡" ${r.mode === 'Saccade' ? 'disabled' : ''}>${opt(['On', 'Off'], r.trail)}</select></td>
      <td><select id="ed-${r.id}-dot" aria-label="圓點大小">${opt(ED_DOT, r.dot)}</select></td>
      <td><select id="ed-${r.id}-full" aria-label="全螢幕">${opt(['No', 'Yes'], r.full)}</select></td>
      <td><input class="num" type="number" min="0" id="ed-${r.id}-count" value="${val(r.count)}" aria-label="${edCountLabel(r.mode)}數" title="${edCountLabel(r.mode)}" style="width:4.2em"></td>
      <td><input type="text" id="ed-${r.id}-best" value="${val(r.best)}" aria-label="最佳表現" style="width:5.5em"></td>
      <td><input type="text" id="ed-${r.id}-notes" value="${val(r.notes)}" aria-label="備註" placeholder="記錄凝視偏離、頭部動作等觀察" style="min-width:180px"></td>
      <td style="white-space:nowrap"><button type="button" class="btn x" data-action="ed-del" data-id="${r.id}" aria-label="移除此訓練紀錄">×</button></td>
    </tr>`).join('')}</tbody></table></div>`;
}
function readEyedot(s = trainingDialog?.draft || editing) {
  const rows = s?.training?.ocular?.eyedot || [];
  return rows.map(r => {
    const g = k => { const el = $(`#ed-${r.id}-${k}`); return el ? el.value : r[k]; };
    const mode = g('mode');
    return { id: r.id, mode, speed: g('speed'), dur: g('dur'), dir: mode === 'Circle' ? g('dir') : null, trail: mode === 'Saccade' ? null : g('trail'),
      dot: g('dot'), full: g('full'), count: numOrNull(g('count')), best: (g('best') || '').trim(), notes: (g('notes') || '').trim() };
  });
}
function rerenderEd() { const s = trainingDialog?.draft || editing; s.training.ocular.eyedot = readEyedot(s); $('#edWrap').innerHTML = eyedotHTML(s.training.ocular.eyedot); }
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
  s.interventions = Object.fromEntries(['adaptation', 'compensation'].map(approach => [approach, { ...s.interventions?.[approach], picks: interventionPicks(approach), notes: $('#s-' + approach + '-notes').value }]));
  s.clinician = $('#s-clin').value.trim(); s.duration = numOrNull($('#s-dur').value);
  s.subjective = $('#s-subj').value; s.objective = $('#s-obj').value; s.feedback = $('#s-fb').value;
  const links = readClinicalLinks();
  if (links.length || Object.hasOwn(editing, 'clinicalLinks')) s.clinicalLinks = links;
  s.sym = readSym();
  s.assess = clone(editing.assess || {});
  for (const p of assessmentItems(c, editing)) {
    const cb = $('#ac-' + p.id); if (!cb) continue;
    const a = { ...clone(editing.assess?.[p.id] || {}), done: assessmentDialog ? !!editing.assess?.[p.id]?.done : cb.checked };
    // Only items ticked as assessed are recorded; results saved earlier for an unticked item are kept.
    if (a.done || hasAssessmentData(a) || hasAssessmentData(editing.assess?.[p.id])) s.assess[p.id] = a;
    else delete s.assess[p.id];
  }
  const rv = id => numOrNull($('#' + id).value);
  s.training = clone(editing.training || {});
  for (const t of trainingItems(c, editing)) {
    if (!$('#tx-' + t.k + '-on')) continue;
    const on = trainingDialog ? !!editing.training?.[t.k]?.on : $(`#tx-${t.k}-on`).checked;
    if (on || hasTrainingData(s.training[t.k])) s.training[t.k] = { ...s.training[t.k], on };
    else delete s.training[t.k];
  }
  s.assessmentPlan = clone(assessmentItems(c, editing).filter(p => hasAssessmentData(s.assess[p.id])));
  s.trainingPlan = clone(trainingItems(c, editing).filter(t => hasTrainingData(s.training[t.k])));
  s.otherTx = $('#s-otx').value; s.tolerance = rv('s-tol');
  s.assessment = $('#s-ass').value; s.plan = $('#s-plan').value; s.nextDate = $('#s-next').value;
  s.absence = { reason: $('#abs-reason').value, notified: $('#abs-notified').value, contact: $('#abs-contact').value.trim() };
  if (s.visit === 'absent') s.nextDate = $('#abs-next').value;
  else if (!s.absence.reason && !s.absence.notified && !s.absence.contact) delete s.absence;
  return applyMeasurementReferences(c, s);
}

function noteText(c, s, list = sessions) {
  const L = [];
  L.push(ui`復健病歷：${c.name || c.ref || c.id}${c.name && c.ref ? '（' + c.ref + '）' : ''}`);
  L.push(ui`日期：${s.date || '-'}   次數：${s.num ?? '-'}   類型：${visitLabel(s.visit)}   治療師：${s.clinician || '-'}${s.visit !== 'absent' && s.duration != null ? ui('   時間：') + s.duration + ui(' 分鐘') : ''}`);
  if (s.visit !== 'absent') L[L.length - 1] += ui('   服務型態：') + serviceModeLabel(s.mode);
  if (c.dx) L.push(ui`診斷：${c.dx}`);
  if (c.medicalHistory) L.push(ui('醫療史：') + c.medicalHistory);
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
    L.push(ui('症狀自評（0 至 10）：') + SYMS.map(x => x.en).join(' / '));
    for (const r of rows) {
      const name = tpName(r, false);
      const t = rowTotal(r);
      const change = symptomChange(base, r);
      L.push(ui`  ${name}：${SK.map(k => r.scores?.[k] ?? '-').join(' / ')}，總分 ${t ?? '-'}${base && r.id !== base.id && change != null ? ui('（與首次差異 ') + signed(change) + '）' : ''}${r.kind === 'rec' && r.recMin != null ? ui('，恢復時間 ') + r.recMin + ui(' 分鐘') : ''}` + ' · ' + ui('已評 {0}/5', symRatedCount(r)));
      if (base && r.id !== base.id && t != null && bt != null && change == null) L.push('  ' + ui('評分項目不同，未計算合計差異。'));
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
      const reference = measurementReferenceText(c, s, p); if (reference) L.push('      ' + reference);
      if (p.copm) {
        (a.copm || []).forEach(r => L.push(ui`      ${r.occ || ui('（職能活動）')}：表現 ${r.perf ?? '-'}，滿意度 ${r.sat ?? '-'}`));
        const av = copmAvg(a.copm), b = copmBaseline(s.id, s.date, s.visit, list), comparison = copmComparison(a.copm, b);
        L.push(ui`      平均：表現 ${av.perf ?? '-'}${comparison.perf != null ? '（' + signed(comparison.perf) + ui('，相較 ') + b.date + '）' : ''}，滿意度 ${av.sat ?? '-'}${comparison.sat != null ? '（' + signed(comparison.sat) + ui('，相較 ') + b.date + '）' : ''}`);
        if (comparison.warning) L.push('      ' + comparison.warning);
      } else {
        resultLines(p, a.values).forEach(([label, value]) => L.push(`      ${label}${ui("：")}${value}`));
      }
      const notes = clinicalAssessmentNotes(a, s);
      if (notes) L.push(ui`      備註：${notes}`);
    }
  }
  if (s.tolerance != null) L.push('', ui('本次反應'), ui`個案自評整體耐受度：${s.tolerance}/10`);
  L.push('', ui('A：PEO 臨床推理'));
  for (const [key, label] of [['person', ui('個人')], ['environment', ui('環境')], ['occupation', ui('作業')]]) if (s.peo?.[key]) L.push(label + ui('：') + s.peo[key]);
  L.push(ui('臨床判斷與介入規劃'), s.assessment || '-');
  L.push(...clinicalLinkLines(c, s), '', ui('P：介入與計畫'));
  const tx = trainingItems(c, s).filter(t => s.training?.[t.k]?.on);
  if (tx.length || s.otherTx) {
    L.push('', ui('復能'));
    tx.forEach(t => {
      const d = s.training[t.k];
      L.push('  • ' + trainingHeadingText(t, d));
      trainingDetailLines(t, d).forEach(line => L.push('      ' + line));
    });
    if (s.otherTx) L.push(ui('  其他治療／居家計畫：') + s.otherTx);
  }
  for (const approach of ['adaptation', 'compensation']) {
    const d = s.interventions?.[approach];
    if (d?.picks?.length || d?.notes) {
      L.push('', approachLabel(approach));
      (d.picks || []).forEach(id => L.push('  [x] ' + strategyLabel(approach, id, s)));
      if (d.notes) L.push(ui('備註') + ui('：') + d.notes);
    }
  }
  L.push('', ui('後續計畫'), s.plan || '-');
  if (s.nextDate) L.push(ui('下次復健：') + s.nextDate);
  return L.join('\n');
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast(ui('病歷已複製')); }
  catch (e) {
    const m = modal(ui`<h3 aria-label="複製病歷">複製病歷${helpHTML(ui('複製病歷'), ui('請全選並按 Ctrl+C／⌘C 複製。'))}</h3><textarea id="copyBox" aria-label="病歷內容" style="min-height:300px">${esc(text)}</textarea><div class="row" style="justify-content:flex-end"><button class="btn" id="cClose">關閉</button></div>`);
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
    toast(copyLastError || ui('已將病歷與可列印副本存入「{0}」（CSV、PDF、TXT）。', `${storageName()} / ${store.folderOf(curId)}`));
  } else {
    await saveFile(`${safeName(cur().ref || cur().name || cur().id)}_${sessionBaseName(s)}.zip`, await sessionZIP(cur(), s));
    toast(ui('已開始下載病歷與可列印副本，請在下載位置確認並保存（ZIP，內含 CSV、PDF）。'));
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
      ${PROFILE_FIELDS.some(field => !appSettings.requiredFields.includes(field.key)) ? `<details ${PROFILE_FIELDS.some(field => !appSettings.requiredFields.includes(field.key) && String(c[field.key] ?? '').trim()) ? 'open' : ''}><summary>${ui('其他基本資料（選填）')}</summary><div class="grid">${PROFILE_FIELDS.filter(field => !appSettings.requiredFields.includes(field.key)).map(field => profileFieldHTML(field, c)).join('')}</div></details>` : ''}
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
        <div><button type="button" class="btn small" id="esAdd">${ADD_ICON}新增手術紀錄</button></div>
      </fieldset>
      ${isNew ? ui`<div class="f"><div class="field-label"><label for="cf-template-source">評估與復健項目模板</label>${helpHTML(ui('評估與復健項目模板'), ui('僅複製項目定義，建立個案後可在「項目設定」調整。'))}</div><select id="cf-template-source"><option value="">標準模板（目前內建項目）</option>${clients.map(other => `<option value="${other.id}">${esc(ui('複用 {0} 的項目設定', clientLabel(other)))}</option>`).join('')}</select></div>` : ''}
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
  $('#es-none').onchange = () => { if (!$('#es-none').checked && !esRows.length) esRows = [{ eye: 'OD', proc: '', date: '', notes: '' }]; else if ($('#es-none').checked) esRows = readEs(); drawEs(); };
  $('#esAdd').onclick = () => { esRows = readEs(); esRows.push({ eye: 'OD', proc: '', date: '', notes: '' }); drawEs(); $('#es-proc-' + (esRows.length - 1)).focus(); };
  $('#esRows').onclick = e => { const b = e.target.closest('[data-es-del]'); if (!b) return; esRows = readEs(); esRows.splice(+b.dataset.esDel, 1); drawEs(); };
  m.querySelector('#cCancel').onclick = closeModal;
  if (!isNew) m.querySelector('#cDel').onclick = async () => {
    const name = clientLabel(c); closeModal();
    if (!(await ask(ui`確定刪除 ${name} 與全部 ${sessions.length} 筆復健紀錄嗎？刪除後無法復原。`))) return;
    await safe(() => store.deleteClient(c.id), ui('無法刪除個案'));
    keepDraftNow();
    clients = clients.filter(x => x.id !== c.id); curId = recentClientIds()[0] || clients[0]?.id || null; view = 'sessions'; await loadSessions(); rememberClient(curId); renderClients(); renderMain(); toast(ui('個案已刪除'));
  };
  m.querySelector('#cForm').onsubmit = async e => {
    e.preventDefault();
    const profile = Object.fromEntries(PROFILE_FIELDS.map(field => [field.key, $('#cf-' + field.key).value.trim()]));
    const missing = requiredProfileFields().find(field => !profile[field.key]);
    if (missing) { const control = $('#cf-' + missing.key); control.setCustomValidity(ui('請填寫{0}', missing.label())); control.reportValidity(); control.oninput = () => control.setCustomValidity(''); return; }
    if (!$('#es-none').checked) {
      esRows.forEach((row, index) => $('#es-proc-' + index).setCustomValidity(''));
      const incomplete = readEs().findIndex(row => !row.proc && (row.date || row.notes));
      if (incomplete >= 0) { const control = $('#es-proc-' + incomplete); control.setCustomValidity(ui('此列已有日期或備註，請填寫手術名稱，或移除此列。')); control.reportValidity(); control.oninput = () => control.setCustomValidity(''); return; }
    }
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
    if (isNew) { curId = obj.id; view = 'dashboard'; dashboardSessionId = null; await loadSessions(); rememberClient(curId); }
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
  const S = { 'Clients': [], 'Attendance 缺席': [], 'Eye surgery history': [], 'Data collection plan': [], 'SOAP notes': [], 'Symptoms': [], 'Assessments': [], 'COPM': [], 'Training': [], 'Training results': [], 'EyeDot Trainer': [], 'Interventions': [], 'Clinical links': [] };
  const blank = v => v == null ? '' : v;
  const asNum = v => v == null || v === '' ? '' : (isNaN(+v) ? v : +v);
  for (const { c, ss } of list) {
    const id = { 'Client ID': c.ref || c.id, 'Client name': c.name };
    const asc = byDate(ss);
    (c.eyeSurgery?.list || []).forEach(r => S['Eye surgery history'].push({ ...id, 'Eye': r.eye, 'Procedure': r.proc, 'Date': r.date || '', 'Notes': r.notes || '' }));
    S['Clients'].push({ ...id, 'Date of birth': c.dob || '', 'Date of injury / onset': c.doi || '', 'Diagnosis': c.dx || '', 'Medical history': c.medicalHistory || '', 'Referral': c.referral || '',
      'Eye surgery history': eyeSurgerySummary(c) || 'Not recorded',
      'Sessions': asc.length, 'Attended 出席': attendance(asc).attended, 'Did not attend 缺席': attendance(asc).absent,
      'Attendance rate %': attendance(asc).rate ?? '', 'First session': asc[0]?.date || '', 'Last session': asc[asc.length - 1]?.date || '' });
    asc.filter(s => s.visit === 'absent').forEach(s => S['Attendance 缺席'].push({ ...id, 'Date': s.date || '', 'Reason 原因': s.absence?.reason || '',
      'Notified 通知': s.absence?.notified || '', 'Rescheduled to 改約': s.nextDate || '', 'Contact / follow-up 聯絡紀錄': s.absence?.contact || '' }));
    for (const p of c.plan || []) S['Data collection plan'].push({ ...id, 'Domain': labelText(p.domain), 'Instrument / assessment': labelText(p.name), 'Timing': ui(TIMING[p.timing] || ''), 'Outcomes recorded': p.copm ? ui('職能活動表現與滿意度（1 至 10）') : fieldsFor(p).map(fieldLabel).join(ui('、')), 'Enabled': p.active !== false, 'Category': assessmentCategoryLabel(assessmentCategory(p)) });
    for (const record of asc) {
      const s = record.visit === 'absent' ? { ...record, duration: null, mode: null, subjective: '', objective: '', feedback: '', assessment: '', plan: '',
        sym: [], assess: {}, training: {}, otherTx: '', tolerance: null, peo: {}, interventions: {}, clinicalLinks: [] } : record;
      const sid = { ...id, 'Date': s.date || '', 'Session no.': blank(s.num), 'Visit': visitLabel(s.visit) };
      const pre = rowTotal(firstRated(s.sym)), end = rowTotal(findRow(s, 'end')), rec = findRow(s, 'rec');
      const note = noteText(c, s, ss).split('\n');
      const oStart = note.indexOf(ui('O：評估')), aStart = note.indexOf(ui('A：PEO 臨床推理'));
      const objective = oStart >= 0 && aStart > oStart ? note.slice(oStart + 1, aStart).join('\n').trim() : '';
      const subjective = [s.subjective, s.feedback ? 'Client feedback: ' + s.feedback : ''].filter(Boolean).join('\n');
      S['SOAP notes'].push({ ...sid, 'Attendance': s.visit === 'absent' ? ui('缺席 Did not attend') : ui('出席 Attended'), 'Clinician': s.clinician || '', 'Length (min)': blank(s.duration),
        'S – Subjective': subjective, 'O – Objective': objective, 'A – Assessment': s.assessment || '', 'P – Plan': s.plan || '', 'Next session': s.nextDate || '',
        'First rating total': blank(pre), ...Object.fromEntries(SUBTESTS.map(t => ['Before ' + t.en.toLowerCase() + ' total', blank(rowTotal((s.sym || []).find(r => r.kind === 'sub' && r.test === t.k)))])),
        'After session total': blank(end), 'Change (after session − before session)': blank(symptomChange(firstRated(s.sym), findRow(s, 'end'))),
        'Recovery time (min)': blank(rec?.recMin), 'Session tolerance (0–10)': blank(s.tolerance),
        'Training': trainingItems(c, s).filter(t => s.training?.[t.k]?.on).map(t => labelText(t.label)).join(ui('、')),
        'Other treatment / home program': s.otherTx || '', 'Service mode': s.visit === 'absent' ? '' : serviceModeLabel(s.mode),
        'PEO – Person': s.peo?.person || '', 'PEO – Environment': s.peo?.environment || '', 'PEO – Occupation': s.peo?.occupation || '',
        'Adaptation': (s.interventions?.adaptation?.picks || []).map(id => strategyLabel('adaptation', id, s)).join(ui('、')), 'Adaptation notes': s.interventions?.adaptation?.notes || '',
        'Compensation': (s.interventions?.compensation?.picks || []).map(id => strategyLabel('compensation', id, s)).join(ui('、')), 'Compensation notes': s.interventions?.compensation?.notes || '' });
      for (const approach of ['adaptation', 'compensation']) for (const strategy of s.interventions?.[approach]?.picks || []) {
        S['Interventions'].push({ ...sid, 'Service mode': serviceModeLabel(s.mode), 'Approach': approachLabel(approach), 'Strategy ID': strategy, 'Strategy label': strategyLabel(approach, strategy, s) });
      }
      for (const link of s.visit === 'absent' ? [] : s.clinicalLinks || []) {
        const peo = { person: ui('個人'), environment: ui('環境'), occupation: ui('作業') };
        S['Clinical links'].push({ ...sid, 'Link ID': link.id, 'Category': assessmentCategoryLabel(link.category), 'Symptom': link.symptom,
          'PEO': link.peo.map(key => peo[key]).join(ui('、')), 'Reasoning': link.reasoning,
          'Evidence IDs': link.evidence.join('; '), 'Evidence': clinicalEvidenceText(c, s, link.evidence).join('\n'), 'Evidence notes': link.evidenceNotes,
          'Intervention IDs': link.interventions.join('; '), 'Interventions': link.interventions.map(id => clinicalInterventionLabel(id, s)).join(ui('、')), 'Intervention notes': link.interventionNotes });
      }
      const base = firstRated(s.sym), bt = rowTotal(base);
      for (const r of s.sym || []) {
        const t = rowTotal(r);
        const row = { ...sid, 'Timepoint': tpName(r, false) };
        SYMS.forEach(x => { row[x.en] = blank(r.scores?.[x.k]); });
        Object.assign(row, { 'Total (0–50)': blank(t), 'Change vs first rating': base && r.id !== base.id ? blank(symptomChange(base, r)) : '', 'Recovery time (min)': r.kind === 'rec' ? blank(r.recMin) : '',
          'Rated symptoms (of 5)': symRatedCount(r), 'Comparison note': base && r.id !== base.id && t != null && bt != null && !sameSymptomSet(base, r) ? ui('評分項目不同，未計算合計差異。') : '' });
        S['Symptoms'].push(row);
      }
      for (const p of assessmentItems(c, s)) {
        const a = s.assess?.[p.id]; if (!a?.done) continue;
        if (p.copm) {
          if (!COPM_VISITS.includes(s.visit)) continue;
          (a.copm || []).forEach(r => S['COPM'].push({ ...sid, 'Occupation': r.occ || '', 'Performance (1–10)': blank(r.perf), 'Satisfaction (1–10)': blank(r.sat), 'Change in performance vs baseline': '', 'Change in satisfaction vs baseline': '' }));
          const av = copmAvg(a.copm), bl = copmBaseline(s.id, s.date, s.visit, ss), comparison = copmComparison(a.copm, bl);
          S['COPM'].push({ ...sid, 'Occupation': 'AVERAGE', 'Performance (1–10)': blank(av.perf), 'Satisfaction (1–10)': blank(av.sat),
            'Change in performance vs baseline': blank(comparison.perf), 'Change in satisfaction vs baseline': blank(comparison.sat), 'Comparison note': comparison.warning });
        } else {
          resultEntries(p, a.values).forEach(([label, value]) => S['Assessments'].push({ ...sid, 'Domain': labelText(p.domain), 'Instrument / assessment': labelText(p.name), 'Measure': label, 'Value': asNum(value), 'Category': assessmentCategoryLabel(assessmentCategory(p)) }));
          const reference = measurementReferenceText(c, s, p);
          if (reference) S['Assessments'].push({ ...sid, 'Domain': labelText(p.domain), 'Instrument / assessment': labelText(p.name), 'Measure': ui('結果來源'), 'Value': reference, 'Category': assessmentCategoryLabel(assessmentCategory(p)) });
          const notes = clinicalAssessmentNotes(a, s);
          if (notes) S['Assessments'].push({ ...sid, 'Domain': labelText(p.domain), 'Instrument / assessment': labelText(p.name), 'Measure': ui('備註'), 'Value': notes, 'Category': assessmentCategoryLabel(assessmentCategory(p)) });
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
  catch (e) { showFailure(e, ui('無法讀取病歷')); return; }
  const data = XLSX.write(buildWorkbook(list), { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fname = all ? `All clients_records_${today()}.xlsx` : `${safeName(c.ref || c.name || c.id)}_records_${today()}.xlsx`;
  if (store.kind === 'folder') {
    try { const where = await store.writeExport(all ? null : c.id, fname, blob); toast(ui('已將 Excel 儲存至「{0}」：{1}', where, fname)); }
    catch (e) { showFailure(e, ui('無法儲存 Excel')); }
    return;
  }
  await saveFile(fname, blob);
  toast(ui('已開始下載 Excel，請在下載位置確認並保存。'));
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
  add([ui('轉介原因'), c.referral || ''], 'kv', [[1, W - 1]]);
  { const es = eyeSurgerySummary(c, '\n') || ui('未記錄'); add([ui('眼科手術史'), es], 'kv', [[1, W - 1]], Math.max(18, es.split('\n').length * 15 + 4)); }
  kv(ui('復健日期'), s.date || '', ui('復健次數'), s.num ?? '');
  kv(ui('紀錄類型'), visitLabel(s.visit), ui('治療師'), s.clinician || '');
  if (s.visit !== 'absent') {
    add([ui('服務型態'), serviceModeLabel(s.mode)], 'kv', [[1, W - 1]]);
    kv(ui('復健時間（分鐘）'), s.duration ?? '', ui('下次復健'), s.nextDate || '');
  }
  gap();

  if (s.visit === 'absent') {
    const a = s.absence || {};
    add([ui('出席紀錄：缺席')], 'section', [[0, W - 1]], 20);
    add([ui('缺席原因'), absenceLabel(a.reason, ABSENCE_REASONS) || '-'], 'kv', [[1, W - 1]]);
    add([ui('是否通知'), absenceLabel(a.notified, NOTIFIED) || '-'], 'kv', [[1, W - 1]]);
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
    add([ui('症狀自評（0 至 10，評估現在的感受）')], 'sub', [[0, W - 1]]);
    add([ui('評分時點'), ...SYMS.map(x => x.en), ui('總分（0 至 50）'), ui('與首次差異')], 'th', [], 32);
    const base = firstRated(s.sym), bt = rowTotal(base);
    for (const r of sym) {
      const t = rowTotal(r);
      const name = tpName(r) + ' · ' + ui('已評 {0}/5', symRatedCount(r)), change = symptomChange(base, r);
      add([name, ...SK.map(k => r.scores?.[k] ?? ''), t ?? '', base && r.id !== base.id && change != null ? signed(change) : ''], 'td');
      if (base && r.id !== base.id && t != null && bt != null && change == null) text(ui('評分項目不同，未計算合計差異。'));
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
        const av = copmAvg(a.copm), b = copmBaseline(s.id, s.date, s.visit, list), comparison = copmComparison(a.copm, b);
        add([ui('平均'), '', '', '', (av.perf ?? '') + (comparison.perf != null ? ui`（${signed(comparison.perf)}，相較 ${b.date}）` : ''), '',
          (av.sat ?? '') + (comparison.sat != null ? ui`（${signed(comparison.sat)}，相較 ${b.date}）` : ''), ''], 'tdb', [[0, 3], [4, 5], [6, 7]]);
        if (comparison.warning) text(comparison.warning);
      } else {
        add([`${labelText(p.name)}${p.domain ? '：' + labelText(p.domain) : ''}`, '', '', '', ui('結果'), '', '', ''], 'th', [[0, 3], [4, 7]]);
        resultLines(p, a.values).forEach(([label, value]) => add([label, '', '', '', value, '', '', ''], 'td', [[0, 3], [4, 7]], textH(value)));
        const reference = measurementReferenceText(c, s, p); if (reference) text(reference);
        const notes = clinicalAssessmentNotes(a, s);
        if (notes) add([ui('備註'), '', '', '', notes, '', '', ''], 'td', [[0, 3], [4, 7]], textH(notes));
      }
    }
  }
  gap();
  if (s.tolerance != null) {
    add([ui('本次反應')], 'sub', [[0, W - 1]]);
    add([ui('個案自評整體耐受度（0 至 10）'), s.tolerance], 'kv', [[1, W - 1]]);
  }
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
      (d.picks || []).forEach(id => text('[x] ' + strategyLabel(approach, id, s)));
      if (d.notes) { add([ui('備註')], 'sub', [[0, W - 1]]); text(d.notes); }
    }
  }
  gap();
  add([ui('後續計畫')], 'sub', [[0, W - 1]]);
  text(s.plan);
  if (s.nextDate) add([ui('下次復健'), s.nextDate], 'kv', [[1, W - 1]]);
  }
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
    try { const where = await store.writeExport(c.id, b + '.xlsx', blob); toast(ui('已將 Excel 儲存至「{0}」：{1}', where, b + '.xlsx')); }
    catch (e) { showFailure(e, ui('無法儲存 Excel 表單')); }
    return;
  }
  await saveFile(`${fileSafe(c.ref || c.name || c.id)}_${s.date || 'undated'}_S${sessionNumberName(s.num)}_SOAP.xlsx`, blob);
  toast(ui('已開始下載 Excel，請在下載位置確認並保存。'));
}

// Imported notes keep the canonical label so re-importing in either language compares equal.
function sourceLabel(source, display = true) {
  const format = display ? ui : (text, ...values) => text.replace(/\{(\d+)\}/g, (match, i) => values[i]);
  const pages = source.pages?.join(display ? ui('、') : '、');
  return [source.file, source.sheet, source.row != null ? format(SOURCE_WORKBOOK.row, source.row) : '', pages ? format(SOURCE_WORKBOOK.pages, pages) : ''].filter(Boolean).join(' · ');
}
function clinicalAssessmentNotes(data, s) {
  const notes = data?.notes || '';
  // Older Excel imports put the file, sheet and row label into the clinical notes field.
  return (s.sourceRecords || []).some(source => notes === sourceLabel(source, false)) ? '' : notes;
}
function medicalHistoryHTML(c) {
  const sections = [[ui('轉介原因'), c.referral], [ui('眼科手術史'), eyeSurgerySummary(c)], [ui('醫療史'), c.medicalHistory]].filter(([, text]) => text);
  if (!sections.length) return '';
  return ui`<details class="script medical-history"><summary>醫療史</summary><div class="body">${sections.map(([label, text]) => `<p style="white-space:pre-wrap;overflow-wrap:anywhere"><b>${esc(label)}</b><br>${esc(text)}</p>`).join('')}</div></details>`;
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
        s.assess[item.id] = { done: true, notes: '', values };
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

async function backupData(target = store) {
  const out = { app: 'vision-rehab-notes', version: 2, exported: new Date().toISOString(), settings: await target.getSettings(), clients: [] };
  for (const c of await target.listClients()) out.clients.push({ ...c, sessions: await target.listSessions(c.id) });
  return out;
}
async function exportAll() {
  const storage = deviceStorage(), out = await backupData();
  await saveFile(`EzEMR-backup-${today()}.json`, JSON.stringify(out, null, 2));
  rememberBackupDownload(storage);
  toast(ui('已開始下載完整備份，請在下載位置確認並保存（JSON）。'));
}
const BACKUP_CRYPTO = { app: 'EzEMR-encrypted-backup', version: 1, cipher: 'AES-GCM', kdf: 'PBKDF2-SHA-256', iterations: 600000 };
function requireBackupCrypto() {
  if (!globalThis.crypto?.subtle) throw new Error(ui('此瀏覽器無法加密或解鎖備份，請使用新版桌面 Chrome 或 Edge。'));
}
function backupBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return btoa(binary);
}
function backupBytes(text) {
  if (typeof text !== 'string' || text.length % 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(text)) throw new Error(ui('加密備份格式或版本不受支援。'));
  return Uint8Array.from(atob(text), char => char.charCodeAt(0));
}
function encryptedBackupParts(data) {
  if (!data || Object.entries(BACKUP_CRYPTO).some(([key, value]) => data[key] !== value) ||
    typeof data.salt !== 'string' || data.salt.length !== 24 || typeof data.iv !== 'string' || data.iv.length !== 16 ||
    typeof data.data !== 'string' || data.data.length < 24) throw new Error(ui('加密備份格式或版本不受支援。'));
  const salt = backupBytes(data.salt), iv = backupBytes(data.iv), bytes = backupBytes(data.data);
  if (salt.length !== 16 || iv.length !== 12 || bytes.length < 16) throw new Error(ui('加密備份格式或版本不受支援。'));
  return { salt, iv, bytes };
}
async function backupKey(password, salt, usage) {
  requireBackupCrypto();
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: BACKUP_CRYPTO.iterations }, material,
    { name: 'AES-GCM', length: 256 }, false, [usage]);
}
const backupCipher = iv => ({ name: 'AES-GCM', iv, tagLength: 128, additionalData: new TextEncoder().encode('EzEMR-encrypted-backup:1') });
async function encryptBackup(data, password) {
  requireBackupCrypto();
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await backupKey(password, salt, 'encrypt');
  const encrypted = await crypto.subtle.encrypt(backupCipher(iv), key, new TextEncoder().encode(JSON.stringify(data)));
  return { ...BACKUP_CRYPTO, salt: backupBase64(salt), iv: backupBase64(iv), data: backupBase64(new Uint8Array(encrypted)) };
}
async function decryptBackup(data, password) {
  requireBackupCrypto();
  const { salt, iv, bytes } = encryptedBackupParts(data);
  const key = await backupKey(password, salt, 'decrypt');
  try {
    const decrypted = await crypto.subtle.decrypt(backupCipher(iv), key, bytes);
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(decrypted));
  } catch (_) { throw new Error(ui('密碼不正確或備份已損壞，請檢查後重試。')); }
}
function backupPasswordDialog(create, encrypted = null) {
  requireBackupCrypto();
  return new Promise(resolve => {
    const m = modal(ui`<form id="backupPasswordForm" class="backup-form" novalidate>
      <h3>${create ? ui('設定備份密碼') : ui('解鎖備份')}</h3>
      ${create ? `<p class="note" id="backupPasswordHint">${ui('請使用至少 12 個字元的密碼，並另行妥善保存。密碼遺失後無法還原這份備份。')}</p>` : ''}
      <div class="f"><div class="field-label"><label for="backupPassword">備份密碼</label>${create ? '' : `<span id="backupPasswordHint">${helpHTML(ui('備份密碼'), ui('請輸入建立這份備份時的密碼。'))}</span>`}</div><input id="backupPassword" type="password" autocomplete="off" spellcheck="false" aria-describedby="backupPasswordHint backupPasswordError"></div>
      ${create ? ui`<label class="f" for="backupPasswordConfirm">再次輸入密碼<input id="backupPasswordConfirm" type="password" autocomplete="off" spellcheck="false" aria-describedby="backupPasswordError"></label>
      <p class="note">密碼只用於這份備份，程式不會保存密碼。本機 CSV、PDF、TXT 與一般 JSON 備份仍是未加密檔案。</p>` : ''}
      <p id="backupPasswordError" role="alert" hidden></p><p class="note" id="backupPasswordProgress" role="status" hidden></p>
      <div class="row"><button type="button" class="btn" id="backupPasswordCancel">取消</button><button type="submit" class="btn app-primary">${create ? ui('加密並下載') : ui('解鎖並核對')}</button></div>
    </form>`, resolve);
    const form = m.querySelector('form'), input = m.querySelector('#backupPassword'), error = m.querySelector('#backupPasswordError');
    m.querySelector('#backupPasswordCancel').onclick = () => closeModal(false);
    form.onsubmit = async event => {
      event.preventDefault();
      if (form.getAttribute('aria-busy') === 'true') return;
      const password = input.value;
      const message = !password ? ui('請輸入備份密碼。') : create && Array.from(password).length < 12 ? ui('密碼至少需要 12 個字元。') :
        create && password !== m.querySelector('#backupPasswordConfirm').value ? ui('兩次輸入的密碼不同。') : '';
      error.hidden = !message; error.textContent = message;
      input.setAttribute('aria-invalid', String(!!message));
      if (message) { input.focus(); return; }
      if (create) { closeModal(password); return; }
      form.setAttribute('aria-busy', 'true');
      input.disabled = true; form.querySelector('[type="submit"]').disabled = true;
      const progress = m.querySelector('#backupPasswordProgress'); progress.hidden = false; progress.textContent = ui('正在解鎖備份…');
      try {
        const data = await decryptBackup(encrypted, password);
        if (m.isConnected) closeModal(data);
      } catch (err) {
        if (m.isConnected) { error.textContent = ui('無法解鎖備份') + ' ' + errorGuidance(err).text; error.hidden = false; input.setAttribute('aria-invalid', 'true'); showFailure(err, ui('無法解鎖備份')); }
      } finally {
        if (m.isConnected) {
          form.removeAttribute('aria-busy'); input.disabled = false; form.querySelector('[type="submit"]').disabled = false;
          progress.hidden = true; input.focus(); input.select();
        }
      }
    };
  });
}
async function exportEncryptedBackup() {
  if (savingSession || savingItems) throw new Error(ui('目前有資料正在處理，請稍後再試。'));
  savingSession = true; renderCommands();
  try {
    const password = await backupPasswordDialog(true);
    if (password === false) return;
    toast(ui('正在加密備份…'));
    const storage = deviceStorage(), encrypted = await encryptBackup(await backupData(), password);
    await saveFile(`EzEMR-backup-${today()}.encrypted.json`, JSON.stringify(encrypted));
    rememberBackupDownload(storage);
    toast(ui('已開始下載密碼保護的完整備份，請在下載位置確認並保存（加密 JSON）。'));
  } finally { savingSession = false; renderCommands(); }
}
function validateBackup(data) {
  if (!data || !Array.isArray(data.clients) || data.app !== undefined && data.app !== 'vision-rehab-notes') throw new Error(ui('這不是 EzEMR 的備份檔。'));
  if (data.version !== undefined && ![1, 2].includes(data.version)) throw new Error(ui('備份版本不受支援。'));
  const settings = data.settings === undefined ? null : validateAppSettings(data.settings);
  const clientIds = new Set();
  const records = data.clients.map(raw => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error(ui('這不是 EzEMR 的備份檔。'));
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
  return { records, settings };
}
async function inspectBackupRestore(records, target) {
  const existing = await target.listClients(), refs = new Map();
  const refKey = c => safeName(c.ref || c.id).toLocaleLowerCase();
  let existingClients = 0, existingSessions = 0;
  for (const { c, ss } of records) {
    const ref = refKey(c);
    if (refs.has(ref) || existing.some(other => other.id !== c.id && refKey(other) === ref)) throw new Error(ui('病歷號重複：{0}', c.ref || c.id));
    refs.set(ref, c.id);
    const prior = existing.find(other => other.id === c.id);
    if (!prior) continue;
    if (refKey(prior) !== ref) throw new Error(ui('備份個案識別碼與現有病歷號不符：{0}', c.ref || c.id));
    existingClients++;
    const ids = new Set((await target.listSessions(c.id)).map(s => s.id));
    existingSessions += ss.filter(s => ids.has(s.id)).length;
  }
  return { clients: records.length, sessions: records.reduce((n, r) => n + r.ss.length, 0), existingClients, existingSessions };
}
function confirmBackupRestore(filename, counts, settings) {
  return new Promise(resolve => {
    const conflicts = counts.existingClients > 0 || counts.existingSessions > 0;
    const m = modal(ui`<form id="restoreBackupForm" class="backup-form">
      <h3>還原前核對</h3><p class="note">備份檔案: ${esc(filename || '')}</p>
      <p id="restoreBackupCounts">${ui('備份內有 {0} 位個案、{1} 筆紀錄。', counts.clients, counts.sessions)}</p>
      ${!counts.clients ? ui('<p class="note">此備份沒有個案或紀錄。</p>') : ''}
      ${conflicts ? `<p id="restoreBackupConflicts">${ui('將覆寫 {0} 位現有個案的基本資料及 {1} 筆同識別碼紀錄。', counts.existingClients, counts.existingSessions)}</p>` : ''}
      <p class="note">備份以外的現有紀錄仍會保留。</p>
      ${settings ? ui('<p class="note">這份備份也會還原基本資料欄位設定。</p>') : ''}
      ${conflicts ? ui('<label class="pick" for="restoreBackupOverwrite"><input id="restoreBackupOverwrite" type="checkbox">我已核對並同意覆寫上述資料</label>') : ''}
      <div class="row"><button type="button" class="btn" id="restoreBackupCancel">取消</button><button type="submit" class="btn app-primary" id="restoreBackupConfirm" ${conflicts || !counts.clients && !settings ? 'disabled' : ''}>確認還原</button></div>
    </form>`, resolve);
    m.querySelector('#restoreBackupCancel').onclick = () => closeModal(false);
    const checkbox = m.querySelector('#restoreBackupOverwrite');
    if (checkbox) checkbox.onchange = () => { m.querySelector('#restoreBackupConfirm').disabled = !checkbox.checked; };
    m.querySelector('form').onsubmit = event => {
      event.preventDefault();
      if (!m.querySelector('#restoreBackupConfirm').disabled) closeModal(true);
    };
  });
}
async function importAll(file, preview = false) {
  if (savingSession || savingItems) throw new Error(ui('目前有資料正在處理，請稍後再試。'));
  if (preview && dirty) throw new Error(ui('請先儲存或取消目前的病歷編輯，再還原備份。'));
  const target = store;
  savingSession = true; renderCommands();
  try {
    let data;
    try { data = JSON.parse((await file.text()).replace(/^\ufeff/, '')); } catch (_) { throw new Error(ui('這不是有效的 JSON 備份。')); }
    if (data?.app === BACKUP_CRYPTO.app) {
      encryptedBackupParts(data);
      data = await backupPasswordDialog(false, data);
      if (data === false) return;
    }
    const { records, settings } = validateBackup(data);
    const counts = await inspectBackupRestore(records, target);
    if (preview && !await confirmBackupRestore(file.name, counts, settings)) return;
    if (store !== target || JSON.stringify(await inspectBackupRestore(records, target)) !== JSON.stringify(counts)) throw new Error(ui('資料已變更，請重新匯入備份並核對。'));
    toast(ui('正在還原備份…'));
    for (const { c, ss } of records) {
      await safe(() => target.saveClient(c), ui('還原已停止'));
      for (const s of ss) await safe(() => target.saveSession(c.id, s), ui('還原已停止'));
    }
    if (settings) { await safe(() => target.saveSettings(settings), ui('還原已停止')); appSettings = clone(settings); }
    await loadClients();
    if (!clients.some(c => c.id === curId)) curId = clients[0]?.id || null;
    editing = null; dirty = false; view = 'sessions'; sessionFilter = { visit: '', from: '', to: '' };
    await loadSessions(); renderClients(); renderMain(); toast(ui`已還原 ${counts.clients} 位個案。`);
  } finally { savingSession = false; renderCommands(); }
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
    const m = modal(ui`<h3 aria-label="匯入測驗分數">匯入測驗分數${helpHTML(ui('匯入測驗分數'), ui('「評估」寫入同名的評估項目；「復健訓練」寫入復健項目的測驗紀錄，並把主要分數填入對應活動。該日沒有紀錄時會新增一筆。'))}</h3>
      <p style="margin:0">${ui('匯入到 {0}。檔案中的受試者代號：{1}', `<b>${esc(clientLabel(c))}</b>${c.ref ? ui('（{0}）', esc(c.ref)) : ''}`, esc(subjects))}</p>
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
        const activity = d.acts.find(a => labelText(a) === labelText(act));
        if (r.score && !sessions.find(prior => prior.id === s.id)?.training?.[k]?.actScoreRefs?.[activity]) {
          d.actScores = { ...(d.actScores || {}), [activity]: r.score };
          d.actScoreRefs = { ...(d.actScoreRefs || {}), [activity]: d.runs.at(-1).id };
        }
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
  if (files.length === 1 && files[0].name.toLowerCase().endsWith('.json')) { await importAll(files[0], true); return; }
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
  $('#main').innerHTML = ui`<section class="panel empty" role="alert"><h2>無法讀取病歷</h2><p>請確認資料夾權限或檔案內容後重新讀取。現有檔案未被修改。</p><button class="btn app-primary" data-action="retry-load">重新讀取資料夾</button></section>`;
  if (!error.reported) showFailure(error, ui('無法讀取病歷'));
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
  rememberClient(clientId);
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
    try { localStorage.setItem('ezrehab-theme', theme); } catch (error) { showFailure(error, ui('外觀已切換，但此瀏覽器無法記住設定。')); }
    return;
  }
  if (a === 'help-start' || a === 'help-shortcuts') { $('#helpMenuButton').focus(); helpDialog(a === 'help-shortcuts'); return; }
  if (a === 'backup-options') {
    openCommandMenu($('#exportMenuButton'));
    $('#exportMenu [data-action="export-all"]').focus(); return;
  }
  if (a === 'dismiss-backup-reminder') {
    updateDeviceBackupStatus({ dismissedAt: new Date().toISOString() });
    $('#backupReminder')?.remove(); return;
  }
  if (dirty && ['pick-folder', 'change-folder', 'reconnect', 'use-default', 'use-browser', 'reload-storage', 'retry-load', 'pick', 'new-session', 'new-client', 'example', 'cancel-edit', 'import-records', 'import-soap-folder'].includes(a)) {
    if (!(await ask(ui('目前的病歷尚未儲存，確定放棄修改嗎？'), ui('放棄修改')))) return;
    removeCurrentDraft(); dirty = false;
  }
  if (a === 'pick-folder' || a === 'change-folder') { await connectFolder(null); return; }
  if (a === 'reconnect') { await connectFolder(pendingHandle); return; }
  if (a === 'storage-settings') { storageSettings(); return; }
  if (a === 'strategy-add') { addStrategy(b.dataset.approach); return; }
  if (a === 'edit-symptoms') {
    const optional = $('#optionalVisualSymptoms'); if (optional) optional.open = true;
    $('#symWrap input')?.focus(); return;
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
  if (!trainingDialog && ['act-add', 'ed-add', 'ed-del', 'run-add', 'run-del', 'sym-rec', 'sym-del', 'clinical-link-add', 'clinical-link-del'].includes(a)) dirty = true;
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
    rememberClient(curId); renderClients(); closeClientSearch(); renderMain();
  }
  else if (a === 'clear-filters') { sessionFilter = { visit: '', from: '', to: '' }; renderMain(); }
  else if (a === 'tab') { view = b.dataset.tab; renderMain(); }
  else if (a === 'new-session') {
    if (missingProfileFields(c).length) { clientForm(c); toast(ui('請先補齊必填基本資料。')); return; }
    editorWorkflow = null; dirty = false; editing = blankSession(); beginDraftSession(editing); view = 'edit'; renderMain(); window.scrollTo(0, 0);
  }
  else if (a === 'open-session') {
    editorWorkflow = null;
    editing = clone(sessions.find(s => s.id === b.dataset.id));
    editing.sym = shapeSym(Array.isArray(editing.sym) ? editing.sym : [], editing.visit || 'treatment');
    editing.visit = editing.visit || 'treatment';
    beginDraftSession(editing); dirty = false; view = 'edit'; renderMain(); window.scrollTo(0, 0);
  }
  else if (a === 'cancel-edit') { removeCurrentDraft(); dirty = false; editing = null; view = 'sessions'; renderMain(); }
  else if (a === 'carry-context') carryContextForm();
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
    updateClinicalConsistency();
    if (!$('#soapForm').reportValidity()) return;
    keepDraftNow();
    const s = collectSession(); if (!s.id) s.id = uid('s'); s.updated = new Date().toISOString();
    editing.id = s.id;
    const buttons = [...document.querySelectorAll('[data-action="save-session"]')].map(button => ({ button, label: button.querySelector('[data-label]') || button }));
    buttons.forEach(entry => { entry.text = entry.label.textContent; entry.button.disabled = true; entry.label.textContent = ui('正在儲存…'); });
    savingSession = true; renderCommands();
    try {
      const zip = store.kind === 'folder' ? null : await sessionZIP(c, s, [...sessions.filter(x => x.id !== s.id), s]);
      await safe(() => store.saveSession(curId, s), ui('病歷儲存失敗'), { recordSave: true });
      if (zip) await saveFile(`${safeName(c.ref || c.name || c.id)}_${sessionBaseName(s)}.zip`, zip);
    } finally { savingSession = false; buttons.forEach(entry => { entry.button.disabled = false; entry.label.textContent = entry.text; }); renderCommands(); }
    const i = sessions.findIndex(x => x.id === s.id); if (i >= 0) sessions[i] = s; else sessions.push(s);
    removeCurrentDraft(); dirty = false; editing = null; view = 'sessions'; sessionFilter = { visit: '', from: '', to: '' }; renderMain();
    toast(store.kind === 'folder' ? copyLastError || ui('已將病歷與可列印副本存入「{0}」（CSV、PDF、TXT）。', `${storageName()} / ${store.folderOf(curId)}`) : ui('已開始下載病歷與可列印副本，請在下載位置確認並保存（ZIP，內含 CSV、PDF）。'));
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
    (trainingDialog?.draft || editing).training.ocular.eyedot = rows; $('#edWrap').innerHTML = eyedotHTML(rows);
  }
  else if (a === 'run-add') {
    const k = b.dataset.k, runs = readRuns(k), run = { id: uid('r'), item: $('#tx-' + k + '-run-item').value, values: {} };
    rerenderRuns(k, [...runs, run]);
    $(`[data-run="${run.id}"] input`)?.focus();
  }
  else if (a === 'run-del') {
    const k = b.dataset.k;
    const s = trainingDialog ? trainingDialog.read() : collectSession();
    if (Object.values(s.training[k]?.actScoreRefs || {}).includes(b.dataset.id)) {
      const message = ui('此測驗正被活動表現引用，請先改為自行填寫或選擇另一筆來源。');
      if (trainingDialog) { const notice = $('#training-notice'); notice.textContent = message; notice.hidden = false; } else toast(message);
      return;
    }
    rerenderRuns(k, readRuns(k).filter(r => r.id !== b.dataset.id)); $('#tx-' + k + '-run-item').focus();
  }
  else if (a === 'ed-del') { const s = trainingDialog?.draft || editing; s.training.ocular.eyedot = readEyedot(s).filter(r => r.id !== b.dataset.id); $('#edWrap').innerHTML = eyedotHTML(s.training.ocular.eyedot); }
  else if (a === 'sym-rec') { editing.sym = readSym(); if (!editing.sym.some(r => r.kind === 'rec')) editing.sym.push({ id: uid('r'), kind: 'rec', scores: {}, recMin: null }); rerenderSym(); }
  else if (a === 'sym-del') { editing.sym = readSym().filter(r => r.id !== b.dataset.id); rerenderSym(); }
  else if (a === 'plan-add') itemForm('assessment', null, b.dataset.editor === 'true', false, b.dataset.category, b.dataset.period);
  else if (a === 'assessment-edit') assessmentResultForm(b.dataset.id);
  else if (a === 'training-edit') trainingResultForm(b.dataset.id);
  else if (a === 'measure-add') measureForm(b.dataset.id);
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
  else if (a === 'export-encrypted') await exportEncryptedBackup();
  else if (a === 'export-roster') {
    const list = await store.listClients();
    const csv = clientsCSV(list.map(client => ({ client, folder: (store.kind === 'folder' && store.folderOf(client.id)) || safeName(client.ref || client.name || client.id) })));
    await saveFile('clients.csv', csv);
    toast(ui('已開始下載個案名單，請在下載位置確認並保存（CSV）。'));
  }
  else if (a === 'xlsx-client') await exportExcel(false);
  else if (a === 'xlsx-session') await exportSessionForm(b.dataset.id);
  else if (a === 'xlsx-all') await exportExcel(true);
  } catch (error) {
    if (!error.reported) showFailure(error, a === 'save-session' ? ui('病歷儲存失敗') : a === 'export-all' || a === 'export-encrypted' ? ui('無法建立備份') : a.startsWith('xlsx-') || a.startsWith('export-') ? ui('無法匯出資料') : ui('操作未完成'), { recordSave: a === 'save-session' });
  } finally { queueDraftCopy(); }
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
  try { await importRecords(files); } catch (error) { if (!error.reported) showFailure(error, ui('匯入失敗')); }
});
$('#importSOAPFolder').addEventListener('change', async e => {
  const files = [...e.target.files]; e.target.value = ''; if (!files.length) return;
  try { const parsed = await readSOAPFolder(files); await importSourceBundles(parsed.bundles, parsed.warnings); }
  catch (error) { if (!error.reported) showFailure(error, ui('匯入失敗')); }
});
document.addEventListener('input', queueDraftCopy);
document.addEventListener('change', queueDraftCopy);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') keepDraftNow(); });
window.addEventListener('pagehide', keepDraftNow);
window.addEventListener('beforeunload', e => { if (dirty || savingSession || savingItems || assessmentDialog || trainingDialog) { e.preventDefault(); e.returnValue = ''; } });

function renderStorageStatus() {
  const st = $('#storeStatus');
  $('#integratedDataNotice').hidden = store.kind !== 'local' || !$('#integratedRecords');
  $('#integratedDataConnect').hidden = !window.showDirectoryPicker;
  $('#changeFolder').hidden = !window.showDirectoryPicker;
  $('#reloadStorage').hidden = store.kind !== 'folder' || store.root.deferred;
  $('#copyBtn').hidden = store.kind !== 'folder' || store.root.deferred;
  if (store.kind === 'folder') {
    st.textContent = ui('病歷資料夾 · ') + storageName();
    st.className = 'status cloud'; st.title = ui('clients.csv 個案總表；每位個案的復健紀錄以 CSV、PDF 與 TXT 儲存。');
  } else {
    st.textContent = $('#integratedRecords') ? ui('病歷副本 · 尚未連接資料夾') : ui('瀏覽器暫存 · 儲存時下載 ZIP'); st.className = 'status local'; st.title = ui('清除瀏覽器資料會移除暫存紀錄，請保留下載檔。');
  }
}
async function finishBoot({ offerRecovery = true } = {}) {
  closeCommandMenu();
  renderStorageStatus();
  if (store.kind === 'folder') { await loadCopyHandle(); renderCopyBtn(); }
  clearTimeout(draftTimer); workflowEvents?.abort(); workflowResize?.disconnect();
  dirty = false; editing = null; view = 'dashboard';
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
  curId = recentClientIds()[0] || clients[0]?.id || null; view = 'dashboard'; dashboardSessionId = null; editing = null;
  await loadSessions();
  rememberClient(curId); renderClients(); renderMain();
  if (offerRecovery) await offerDraftRecovery();
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
