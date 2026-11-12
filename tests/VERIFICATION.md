# 驗證紀錄

## 2026-11-12：評估視窗、文字結果與自訂欄位架構

依本次 antislop during 指示及使用者提供的現有畫面，保留 Noto Sans TC、深色文字、青綠操作色與明暗主題，ENERGY 1／RHYTHM 1／MOTION 1。評估勾選開啟獨立草稿視窗，完成後下方顯示文字結果；短期、長期、COPM、視野與自訂評估共用填寫、取消及完成流程。復健項目的原有欄位流程維持既有用途。

原本 `collectSession` 直接讀頁面上的評估輸入框，改為讀取已完成的評估狀態。`fieldsFor` 定義欄位，`assessmentEntryHTML`／`readAssessmentEntry` 處理輸入，`assessmentResultHTML` 產生跳脫後的文字摘要，`assessmentResultForm` 管理獨立草稿。新增指標先留在草稿，完成時才按使用者選擇加入後續模板；寫入失敗保留原結果與可重試的表單。分組入口在同筆編輯期間保持穩定，編輯已選項目不會啟用排除中的歷史結果，新增同模板項目也不會將舊空白項目標為已施測。架構、資料契約與流程圖見 `DATA_FORMAT.md`。

設計理由：文字摘要便於回讀與比對，移除已完成項目的重複輸入框；輸入集中於可捲動視窗，欄位依可用寬度排列；沿用字體與色彩以維持臨床工作區識別；16px 表單間距分隔不同量測，摘要用欄名與數值層級區分內容；青綠只標示操作及目前位置，摘要外框採中性色；沿用加號表示新增指標，沒有新增圖片、圖示庫、裝飾或動畫。

`assessment-modal.cjs` 為新增測試，`tests/lib/assessments.cjs` 為既有測試的實際開啟／完成操作工具。既有語言、群組、期程、初次評估、模板、指標、量測引用、比較、匯入、視野、病人總覽及治療師工作流程測試改走視窗操作，保留原有資料往返與輸出斷言。根目錄新 `.cjs` 由 `tests/run-ci.cjs` 自動探索，helper 由這些測試引用，不另建排除規則。所有快照與輸出均在忽略的 `.tmp/`，測試不覆寫發布檔。

最終 `git hook run pre-push` 以退出碼 0 完成 `node scripts/build.cjs` 與完整 `node tests/run-ci.cjs`，44 支測試腳本全部通過，包含 1,078 個翻譯片段及雙語瀏覽器檢查。完整輸出為 `.tmp/assessment-modal/pre-push-delivery.log`。發布的 `EzEMR.html`、隔離 `.tmp/ci/EzEMR.html` 與重新讀取本機來源產生的內容逐位元組一致，SHA-256 為 `55a1845f3d076bcf5ba593cc252b36d619c95607d6fff08ea72defc25c2308c6`。沒有略過測試或繞過 hook。

實際點擊與鍵盤證據：勾選／Space 開啟視窗；完成顯示文字；編輯回填原值；取消／Escape 還原；Tab 在視窗循環並還原焦點；新增指標返回結果視窗且保留草稿；重複名稱與超出範圍顯示驗證；後續模板寫入失敗可重試，寫入中顯示雙語狀態且 Escape 不關閉視窗；量測引用跟隨來源，解除後可自行填寫；施測前／後導覽開啟對應時點；取消勾選保留結果並排除報告；清除先確認並保護引用來源。原本展開的臨床依據在評估視窗關閉後仍保持展開。

畫面證據在 `.tmp/verification/assessment-modal/`。已實際檢視繁中亮色桌面視窗與文字摘要，以及英文深色手機視窗；瀏覽器測試涵蓋兩種語言、明暗色與 320／360／640／768／1024／1280px。專項對比計算：亮色輔助文字 5.46:1、深色輔助文字 6.65:1、亮色青綠文字 6.31:1、深色主要按鈕文字 8.67:1、深色焦點色 9.62:1。測試使用合成資料，行動裝置鍵盤與原生檔案權限視窗未以實機驗證。

### 本次 antislop Delivery Gate

| 項目 | 結果與證據 |
| --- | --- |
| R-02 文案 | PASS：新增來源文案使用具體操作文字，沒有 em dash。 |
| R-03 響應式 | PASS：雙語、明暗色、320 至 1280px 無橫向溢出，表單用滿視窗可用寬度，控制項至少 44px。 |
| R-17 數據 | PASS：摘要只呈現原有或使用者輸入的結果，空白與零值分開保留。 |
| R-18 見證 | PASS：未新增人物或見證內容，測試個案明確標為合成資料。 |
| R-23 資產 | PASS：沿用使用者截圖與既有介面，未新增品牌、照片或虛構導航。 |
| R-24 導覽 | PASS：施測前／後實際開啟對應時點，其他既有導覽回歸通過。 |
| R-25 對比 | PASS：文字與焦點實算如上，所有列出的文字色組超過 4.5:1。 |
| R-26 操作 | PASS：勾選、完成、編輯、取消、新增指標、引用、清除與錯誤重試均實際操作。 |
| R-27 狀態 | PASS：空結果有編輯提示，寫入中有 Saving 狀態與 aria-busy，失敗有雙語錯誤並保留重試。 |
| R-28 FAQ | PASS：沒有新增 FAQ。 |
| R-32 鍵盤 | PASS：Space、Tab、Escape、視窗焦點循環及還原皆由瀏覽器驗證。 |
| R-33 來源 | PASS：直接修改 `src/app.js` 與 `src/styles.css`，使用正式建置產生發布檔。 |
| R-34 主題 | PASS：明暗主題均跑過視窗、摘要、尺寸與焦點檢查。 |
| R-35 實際執行 | PASS：上述點擊清單、雙語專項、歷史輸出與視野／COPM 回歸已在瀏覽器執行。 |
| R-36 宣稱 | PASS：未新增安全、合規、效能或臨床成效宣稱。 |
| R-37 方向 | PASS：依現有產品與使用者截圖定義方向，修改前已宣告三個 dials。 |
| R-38 內容 | PASS：使用原始結果與明確標記的合成測試資料，沒有假資料裝成正式紀錄。 |
| R-01 漸層 | PASS：既有青綠表示操作與選取，沒有新增漸層或光暈。 |
| R-04 圖示 | PASS：只沿用表示新增的加號，編輯與完成使用文字名稱。 |
| R-06 字體 | PASS：沿用 Noto Sans TC 與本機後備字體，維持中英文可讀性。 |
| R-07 背景 | PASS：純色表單與摘要，沒有裝飾網格。 |
| R-08 箭頭 | PASS：新增操作未使用裝飾箭頭。 |
| R-09 徽章 | PASS：沒有新增膠囊標籤或重複的狀態徽章。 |
| R-10 毛玻璃 | PASS：沒有新增 backdrop blur。 |
| R-12 陰影 | PASS：只沿用對話框的層級陰影，結果摘要平放於病歷內。 |
| R-13 發光 | PASS：沒有新增發光效果。 |
| R-14 重複卡片 | PASS：摘要大小由實際欄位決定，無固定高度的裝飾卡片。 |
| R-19 動態 | PASS：沒有新增自動動畫，MOTION 1。 |
| R-22 插圖 | PASS：沒有新增插圖。 |
| Dials | PASS：ENERGY 1／RHYTHM 1／MOTION 1，維持安靜且固定順序的臨床填寫流程。 |
| 焦點 | PASS：視窗以本項評估與完成操作為重點，背景 inert。 |
| 留白 | PASS：16px 間距區分量測欄位，摘要去除空輸入框。 |
| 重點色 | PASS：既有青綠標示操作與目前位置，中性外框區分結果。 |
| 產品識別 | PASS：SOAP、評估期程、單位、測量時點與雙語臨床標籤延續產品用途。 |
| Design Read | PASS：修改前已依治療師的輸入及回讀需求宣告方向。 |
| C-1 意圖 | PASS：配色、字體、排列、間距與圖示理由已記錄。 |
| C-2 完整性 | PASS：所有新增控制均有實際行為與瀏覽器操作證據。 |
| C-3 內容 | PASS：新增內容只處理本次要求的評估填寫與自訂欄位。 |
| C-4 韌性 | PASS：取消、錯誤、寫入中、雙語、主題、尺寸、歷史結果與引用均有驗證。 |
| C-5 證據 | PASS：結果由測試輸出與實際畫面支持，沒有捏造使用者資料。 |
| R-05 結構 | PASS：選擇、填寫、回讀的順序直接服務評估工作，無套版區塊。 |
| R-11 圓角 | PASS：沿用既有控制項與對話框的不同圓角，沒有改為膠囊外觀。 |
| R-15 操作名稱 | PASS：「編輯結果」「完成填寫」「新增指標」說明具體動作。 |
| R-16 措辭 | PASS：新文案沒有行銷詞或未經證實的效果。 |
| R-20 識別 | PASS：保留復健量測、SOAP 與個案模板語彙。 |
| R-21 主題選擇 | PASS：沿用系統及手動明暗切換，兩種模式皆通過。 |
| R-29 配色 | PASS：既有中性色與青綠操作色，紅色只用於實際驗證訊息。 |
| R-30 原創性 | PASS：沿用本專案工作流程與使用者截圖，沒有仿作其他產品。 |
| R-31 理由 | PASS：本節已逐項記錄主要設計決策的用途。 |

## 2026-11-12：依五篇文獻改善搜尋與備份還原

依使用者提供的五篇不同 PDF，新增目前個案的病歷全文搜尋、離線密碼加密備份、還原核對及覆寫同意。備份在任何寫入前檢查完整資料、病歷號及個案識別碼；未知版本及加密參數會拒絕。保留一般 JSON、舊版備份、CSV 與既有檔名，更新中英文 README、使用手冊、`DATA_FORMAT.md` 及 `RESEARCH_IMPROVEMENTS.zh-TW.md`。加密僅涵蓋加密備份檔；本機病歷仍未加密，多個個案還原也不是整批交易。

新增 `backup-safety.cjs`、`record-search.cjs`，並擴充 `language.cjs` 的新選單、密碼、驗證、核對、衝突、空資料與搜尋狀態。更新 `assessment-groups.cjs`、`clinical-flow.cjs`、`record-security.cjs`、`offline-privacy.cjs`、`templates.cjs`，使既有還原案例實際操作核對畫面；保留其原始資料往返斷言。全部由 `tests/run-ci.cjs` 根目錄 `.cjs` 自動探索規則納入，沒有排除測試或繞過 hook。

聚焦的 `check_i18n.cjs`、`language.cjs`、新搜尋及備份測試均通過。最終 `git hook run pre-push` 以退出碼 0 完成 `node scripts/build.cjs` 與完整 `node tests/run-ci.cjs`，43 支測試腳本全部通過，包含 1,055 個翻譯片段。首輪因一個舊測試仍假設匯入即寫入而停在核對視窗，hook 以退出碼 1 阻擋；補上實際確認操作後重跑整套。兩次輸出分別保留於 `.tmp/paper-review/pre-push-first.log` 與 `.tmp/paper-review/pre-push.log`。發布的 `EzEMR.html` 與 `.tmp/ci/EzEMR.html` 的 SHA-256 相同。

備份測試使用 Node 的獨立 AES-GCM／PBKDF2 實作解讀實際下載，也用 Node 產生輸入讓瀏覽器解密；驗證原始中文、零值、自訂欄位及設定。涵蓋錯密碼重試、解密中的取消與延遲結果隔離、密文修改、無效參數／版本、身分衝突、覆寫同意、寫入失敗及重試、不支援加密時的提示，以及直接 file URL、零對外請求。搜尋驗證連續詞句、大小寫及全半形、SOAP／PEO／評估／介入／反應、日期與類型、空結果、其他個案隔離、排除未施測及缺席草稿，並核對儲存資料未改寫。

新畫面以兩種語言、明暗色及 320／360／768／1280px 檢查；畫面位於 `.tmp/verification/backup-safety/` 與 `.tmp/verification/record-search/`。已實際檢視繁中亮色桌面密碼視窗、英文深色桌面搜尋、英文深色手機密碼、繁中亮色手機還原及英文深色手機搜尋。測試使用合成資料；不代表實際醫療環境或臨床成效驗證。

| 交付檢查 | 結果與證據 |
| --- | --- |
| Hard Gate | PASS：43 支腳本、雙語、明暗色、窄螢幕、鍵盤、既有對比檢查及離線隱私檢查通過；新畫面無橫向溢出、無對外請求或應用程式錯誤。 |
| Purpose Gate | PASS：搜尋置於既有篩選區，還原前先核對實際筆數與衝突；新控制項共用既有字型、色彩及焦點樣式，沒有新增視覺資產。 |
| Liveliness | PASS：沿用 Noto Sans TC、青綠操作色與既有閱讀層級，ENERGY 1／RHYTHM 2／MOTION 1；已檢視桌面及手機畫面。 |
| Craftsmanship | PASS：實際點擊加密下載、密碼錯誤重試、取消、還原確認及覆寫；以鍵盤切換同意並取消解密。獨立密碼學互通、寫入失敗重試、CSV／PDF／TXT 與舊資料回歸均通過。 |

## 2026-11-12：恢復一般病歷身分與聯絡欄位

依使用者更正，恢復身分證字號、宗教、聯絡電話、聯絡地址的雙語標籤、表單、摘要顯示與全域必填選擇；基本資料回到十四項。還原設定驗證，資料夾、瀏覽器、尚未建立的預設資料夾及 JSON 備份中的四項必填選擇會完整保留，不再被過濾。身分證字號可再次搜尋個案。既有值直接回填，電話保留前導零與分機，地址可分行；出生日期、性別仍顯示在姓名旁，匯入來源精簡保留。

更新 `clinical-fields.cjs`、`profile-settings.cjs`、`language.cjs`、`metro-ui.cjs`，繼續由 `tests/run-ci.cjs` 自動探索並透過 `.githooks/pre-push` 執行。雙語聚焦檢查已通過四欄位顯示、必填設定與舊備份、原值回填、編輯存檔、重開、身分證搜尋、語言切換不改資料，以及匯入來源仍不出現在臨床報告。README 與使用手冊同步恢復十四項欄位說明。完整驗證輸出使用 `.tmp/profile-fields-restored-pre-push.log`。

`git hook run pre-push` 以退出碼 0 完成離線建置與完整 `node tests/run-ci.cjs`，全部 41 支測試腳本通過，包含 1,016 個翻譯片段及雙語瀏覽器檢查。發布的 `EzEMR.html` 與隔離測試快照 SHA-256 相同。已檢視 `.tmp/verification/clinical-fields/zh-TW-summary.png`，四項欄位正常顯示，出生日期與性別仍在姓名旁。

| 交付檢查 | 結果與證據 |
| --- | --- |
| Hard Gate | PASS：完整 CI、雙語、亮暗色、320–1920px、鍵盤、文字對比及離線隱私檢查通過。 |
| Purpose Gate | PASS：恢復一般病歷身分與聯絡欄位，保留姓名旁的出生日期／性別及匯入來源精簡。 |
| Liveliness | PASS：沿用既有字體、青綠操作色與版面層級，ENERGY 1／RHYTHM 2／MOTION 1；繁中桌面摘要已實際檢視。 |
| Craftsmanship | PASS：十四項表單、四項原值與必填選擇、編輯存檔、重新開啟、身分證搜尋、CSV／JSON 往返及語言切換皆有驗證。 |

## 2026-11-12：個案摘要與非臨床欄位精簡

本節保留上一輪的修改與驗證歷程；其中四項一般病歷欄位的移除及必填過濾已由上節修正撤回。

出生日期、性別移到姓名與病歷號旁，從下方基本資料摺疊區移除重複欄位。摘要移除紀錄總數及重複診斷，保留最近紀錄、下次復健、受傷／發病日期與出席情況。醫療史只顯示轉介原因、眼科手術史及醫療史；沒有臨床內容時不產生空白摺疊區。版面沿用 Noto Sans TC、明暗主題與青綠操作色，ENERGY 1／RHYTHM 2／MOTION 1：姓名是主標，身分資訊同組掃讀，病史依內容展開，沒有新增動畫。

移除病歷來源、原始收案資料、測驗卡的匯入檔名，以及 TXT／PDF／Excel 報告中的匯入檔案、工作表、列號與原始收案附錄；Excel 不再建立 Source roster／Source records 工作表或 Medical sources 欄。匯入結果不另以匯入方式命名。新的 Excel 匯入不再把來源標籤填入臨床備註；舊備註只有在完整等於同次來源標籤時才排除顯示，人工補述及自行寫入的檔名全部保留。量測引用、檢查報告來源／日期及測試條件仍保留。

基本資料與必填設定精簡為十項，移除身分證字號、宗教、電話、地址；保留職業、慢性病、過敏史及健康習慣。開啟舊資料夾設定、瀏覽器設定、尚未建立的預設資料夾設定與 JSON 備份時，忽略已移除欄位的必填要求；編輯個案及病歷保留舊欄位、檔名及來源陣列，CSV 結構不變。

新增 `clinical-fields.cjs`，並更新 `patient-summary.cjs`、`profile-settings.cjs`、`profile-storage.cjs`、`language.cjs`、`workspace.cjs`、`assessment-display.cjs`、`imports.cjs`、`score-imports.cjs`、`metro-ui.cjs` 與 `offline-privacy.cjs` 的相關驗證。所有腳本由 `tests/run-ci.cjs` 的根目錄 `.cjs`／`.py` 自動探索規則納入 `.githooks/pre-push`，未修改探索規則或跳過測試。原有行政欄位中的 HTML 注入測例改放到保留的慢性病欄，繼續驗證原始文字與安全顯示。

`patient-summary.cjs` 在修改前先因出生日期與性別未位於姓名旁失敗。修改後涵蓋雙語、亮暗色、320／360／640／768／1280／1920px、四種病史展開組合、鍵盤焦點及 Enter／Space、AA 文字對比、欄位位置與資料不變。`clinical-fields.cjs` 驗證行政欄位及來源不出現在介面與臨床報告、實際 PDF 繪製文字、零值、原始臨床備註、舊必填要求、表單存檔、CSV 往返、語言切換、無資料狀態及零對外請求。畫面位於 `.tmp/verification/clinical-fields/` 與 `.tmp/verification/patient-summary/`，已檢視繁中桌面及英文深色手機畫面。完整 pre-push 輸出記錄於 `.tmp/clinical-fields-pre-push.log`。

最終 `git hook run pre-push` 以退出碼 0 完成 `node scripts/build.cjs` 與完整 `node tests/run-ci.cjs`，全部 41 支測試腳本通過，包含 1,012 個翻譯片段、雙語瀏覽器、所有新改測試、匯入匯出、儲存、隱私及既有臨床流程。首輪 hook 曾因仍預期十四項基本資料的舊斷言以退出碼 1 阻擋，紀錄保留於 `.tmp/clinical-fields-pre-push-first.log`；更新舊預期、補上實際醫療史測例後重新執行完整套件，沒有繞過 hook。發布檔與 `.tmp/ci/EzEMR.html` 的 SHA-256 相同。

| 交付檢查 | 結果與證據 |
| --- | --- |
| Hard Gate | PASS：完整 CI、雙語、亮暗色、320–1920px、AA 文字對比、可見鍵盤焦點及零對外請求均通過，瀏覽器沒有應用程式錯誤。 |
| Purpose Gate | PASS：出生日期與性別和姓名同組，避免另開基本資料；移除行政資料、來源附錄及重複內容，臨床備註、引用與測試條件仍可讀取。 |
| Liveliness | PASS：沿用既有 Noto Sans TC、青綠操作色與明暗主題，ENERGY 1／RHYTHM 2／MOTION 1；已檢視繁中桌面與英文深色手機，姓名及臨床資訊的閱讀層級清楚。 |
| Craftsmanship | PASS：實際操作基本資料設定、個案／病歷存檔、病史 Enter／Space 展開、測驗卡增刪及語言切換；TXT、實際 PDF、Excel、CSV 往返、舊備份與資料隔離均有驗證。 |

## 2026-11-11：依治療師走查改善病歷流程

依 `THERAPIST_WORKFLOW_REVIEW.zh-TW.md` 的建議加入固定個案身份與欄位路徑、訪談／前測／活動／後測／判斷／計畫導覽、返回原欄位、項目獨立收合，以及需確認的結果清除。取消本次施測保留資料但排除報告；同次短期評估與活動測驗卡可明確指定為結果來源，解除引用保留當前數值。另加入 S 到問題的來源連結、推理摘要與策略問題定位、症狀及 COPM 可比性檢查、漏答合計提示、缺席資料檢查、選填基本資料、逐項沿用前次條件及後續追蹤指標。

新增 `therapist-workflow.cjs`、`comparison-integrity.cjs`、`measurement-references.cjs`、`workflow-entry.cjs`；四者均由 `tests/run-ci.cjs` 的根目錄 `.cjs` 自動探索規則納入。同步更新受影響的既有測試，保留匯入匯出、儲存、歷史資料與安全性驗證，未跳過測試或繞過 hook。

`git hook run pre-push` 以退出碼 0 完成 `node scripts/build.cjs` 及完整 `node tests/run-ci.cjs`，最後輸出 `PASS: Full CI completed.`，包含 1,027 個翻譯片段與雙語瀏覽器檢查。涵蓋明暗色、窄螢幕、鍵盤定位、標籤不被固定列遮擋、引用更新與解除、錯誤輸入、儲存失敗重試、CSV／TXT／Excel 輸出、取消編輯後事件隔離及零對外請求。

走查測試載入隨附八位個案的 24 次紀錄，前後核對原始 `Data/` 檔案雜湊不變。完整輸出位於 `.tmp/workflow-pre-push.log`；畫面證據位於 `.tmp/verification/therapist-workflow/`，已檢視繁中亮色桌面及英文深色窄螢幕。使用方式與剩餘項目已更新於使用手冊及走查報告第 10 節；可搜尋 PDF、任意項目共用測量等仍列為後續工作。

## 2026-11-11：個案摘要字級與展開對齊

統計列與病史摺疊區改為各自滿寬的直向排列，所有摺疊標題共用左側起點；展開病史不再將統計列推往垂直中央。摘要內文統一使用既有 14px 字級與行高，欄位及摺疊標題使用同一字重、輔助文字色，姓名保留標題層級；醫療史段落移除預設外距及額外縮排。沿用 Noto Sans TC 字族、明暗色變數與青綠焦點色，ENERGY 1／RHYTHM 2／MOTION 1，以固定閱讀順序及一致留白服務病歷掃讀。

新增 `patient-summary.cjs`，由 `run-ci.cjs` 根目錄 `.cjs` 自動探索規則納入。修正前先因「病史未位於統計列下方」失敗，修正後以直接開啟隔離 file URL 驗證：中英文、明暗色、320／360／640／768／1280／1920px，以及兩個區塊的四種展開組合。640px 另覆蓋 1280px 視窗放大兩倍時的等效排版寬度。實測字族、字級、行高、標籤字重與顏色、段落間距、位置穩定、無橫向溢出、AA 文字對比及 Enter／Space 操作；補測基本資料與匯入來源展開，確保原始病歷、中文值、來源檔名未被改寫且無對外請求。

畫面證據位於 `.tmp/verification/patient-summary/`，已檢視繁中桌面與英文深色手機的同時展開畫面；修正前截圖保留為 `before-closed.png`。`check_i18n.cjs`、`language.cjs` 及新增測試已單獨通過。

`git hook run pre-push` 以退出碼 0 完成離線建置及完整 `node tests/run-ci.cjs`，包含自動探索到的 `patient-summary.cjs`、915 個翻譯片段與既有匯入匯出、儲存、隱私及介面檢查。完整輸出為 `.tmp/patient-summary-pre-push.log`；未跳過測試或繞過 hook，產出的 `EzEMR.html` 與本機來源一致。

| 交付檢查 | 結果與證據 |
| --- | --- |
| Hard Gate | PASS：雙語、亮暗色、320–1920px、AA 文字對比、可見鍵盤焦點與 Enter／Space 展開收合均通過，沒有對外請求或瀏覽器錯誤。 |
| Purpose Gate | PASS：統計及各病史區塊各自滿寬，避免展開內容影響其他列的位置；統一字級、字重與間距以便掃讀欄位。 |
| Liveliness | PASS：沿用既有字體、主題色及青綠焦點色，姓名維持視覺重點，固定的左側起點與留白區隔資料層級；已檢視實際桌面與手機畫面。 |
| Craftsmanship | PASS：四種展開組合的位置、基本資料、原始匯入欄位及中文值皆有瀏覽器驗證，語言與版面切換保留病歷資料。 |

## 2026-11-11：根目錄 Data 虛構試用資料

`Data/clients.csv` 包含八位明確標示為虛構的個案：中風、腦傷、複視、單側視覺受損、視野受損、忽略、動作障礙及脊髓損傷。每位三次病歷，均由目前應用程式的資料夾儲存流程產生 CSV、PDF、TXT，未將個案內嵌到 HTML。中英文 README 與 Data 內的雙語說明提供開啟既有資料夾、搜尋 `DEMO-`、編輯及追蹤步驟。Git 僅納入指定示範檔案，其他本機資料仍被忽略。

新增 `demo-data.cjs`，由 `run-ci.cjs` 的根目錄 `.cjs` 自動探索規則納入；測試不改寫隨附病歷。獨立解析 24 份 PDF，驗證 CSV BOM、八類情境、SOAP、欄位與數值、活動分數、臨床連結、CSV 往返及 Git 排除規則。兩種語言分別將實際 CSV／TXT 複製到隔離 OPFS 資料夾，透過開啟資料夾的介面載入、搜尋八位個案、檢視總覽與進度、編輯各一筆並存檔重開。脊髓損傷不含步行測試，忽略項目的左右漏答數與合計一致。

`git hook run pre-push` 以退出碼 0 完成離線建置及完整 `node tests/run-ci.cjs`，包含新測試、915 個翻譯片段、全英文 README、語言、匯入匯出、儲存、隱私與版面回歸，未跳過測試或繞過 hook。完整輸出為 `.tmp/demo-data-pre-push.log`。雙語總覽及實際複視案例 PDF 首頁畫面在 `.tmp/verification/demo-data/`，已檢視中文顯示與紀錄內容。

| 交付檢查 | 結果與證據 |
| --- | --- |
| Hard Gate | PASS：完整 pre-push、雙語、離線、儲存及 PDF 解析檢查通過。 |
| Purpose Gate | PASS：八類虛構個案各三次病歷，直接以目前資料夾格式試用系統。 |
| Liveliness | PASS：沿用 README 的操作步驟與表格，以固定示範病歷號協助搜尋，不修改介面樣式。 |
| Craftsmanship | PASS：案例專屬評估、原始分數、PDF／TXT、CSV 往返、存檔重開與非示範檔案排除均有驗證。 |

## 2026-11-11：停用「跳視與凝視」合併活動

舊範本或歷史紀錄中的 `Saccadic fixation`／「跳視與凝視」會被當成自訂活動回帶。現在選單只顯示跳視訓練、凝視訓練兩個獨立選項；舊範本若只有合併項目，亦提供這兩個選項，初始均不勾選。原有合併活動及分數保留在原紀錄，不代填到獨立活動，也不帶入新紀錄。手動再次加入舊名稱時，顯示雙語提示，請分別勾選。

`assessment-display.cjs` 先加入會重現截圖的斷言，確認修正前因選單包含「跳視與凝視」失敗，再驗證中英文舊名稱、只有舊合併項目的範本、獨立活動與 VOR 並存、歷史結果與數字 0、語言切換、CSV／存檔重開、新紀錄隔離及手動加入的提示。`assessment-picks.cjs` 同時驗證原共用表現保留，新的跳視分數獨立記錄。

`git hook run pre-push` 以退出碼 0 完成離線建置及完整 `node tests/run-ci.cjs`，包含兩項修改過的測試、915 個翻譯片段與雙語版面檢查。完整輸出為 `.tmp/retired-combined-training-pre-push.log`；畫面證據為 `.tmp/verification/retired-combined-row.png`，已實際檢視。未跳過測試或繞過 hook。

| 交付檢查 | 結果與證據 |
| --- | --- |
| Hard Gate | PASS：雙語、離線隱私、鍵盤、明暗色與多尺寸完整回歸通過。 |
| Purpose Gate | PASS：移除重複的舊合併入口，獨立項目各自勾選、記分；原始合併分數保留。 |
| Liveliness | PASS：沿用現有字體、青綠選取色與版型，ENERGY 1／RHYTHM 2／MOTION 1；已檢視實際選項列。 |
| Craftsmanship | PASS：英中兩種舊名稱、舊範本、零值、新舊分數隔離、CSV／存檔重開與手動加入提示均有瀏覽器驗證。 |

## 2026-11-11：舊範本辨識、獨立數值指標與 SOAP 位置修正

上一輪僅以新識別碼與英文原始名稱建立主要範例，漏掉 `sacc／fix／purs` 舊識別碼，以及名稱已儲存成中文、識別碼重新產生的資料表項目。改以已知來源名稱、中文對照與範本欄位辨識，名稱、排序、去重、UFOV 分類及來源標題共用同一辨識結果；自訂名稱與原始資料不改寫。

短期成效已有症狀自評，不再顯示「尚未設定短期指標」。原混合的功能性視覺作業退出新評估入口，改為閱讀速度（字／分）、視覺搜尋完成時間（秒）、手眼反應時間（ms），每項各一個數值。舊混合項目的值仍保留，不推定它屬於任何新指標。

VOR 與舊 VOR ×1 只顯示一個活動選項與一個分數欄；儲存保留原有活動鍵與分數，包括兩種名稱曾各有不同分數的紀錄。「工作站設置」改為「桌椅與螢幕調整」。移除 A 區重複的說明與空白提示；本次反應及耐受度移至 O 的短期成效，TXT／PDF 與 Excel SOAP 表也將耐受度列於 O。

`assessment-display.cjs` 直接測試舊識別碼、中文匯入名稱、重新產生的匯入識別碼、錯誤的舊 UFOV 功能分類、三個獨立數值與單一 VOR 選項，並檢查原值、0、不同活動分數、回復時間、耐受度、CSV 與存檔重開。雙語畫面仍涵蓋亮暗色與 360／1280px；`language.cjs` 涵蓋 320／360／768／1280px。`clinical-flow.cjs` 另明確檢查 O 中的本次反應與耐受度，及 TXT／PDF、Excel 的 SOAP 順序。

最終 `git hook run pre-push` 以退出碼 0 完成離線建置與完整 `node tests/run-ci.cjs`，包含本次修改的所有測試、914 個翻譯片段、六個合成個案、舊資料、匯入匯出、離線隱私、儲存與版面回歸。完整輸出為 `.tmp/clinical-ui-corrections-pre-push.log`；未跳過測試或繞過 hook。

| 交付檢查 | 結果與證據 |
| --- | --- |
| Hard Gate | PASS：完整 CI、雙語、離線隱私、鍵盤及 320–1440px 相關版面測試通過。 |
| Purpose Gate | PASS：每個新功能性視覺指標各一個數值；已知舊名稱共用同一辨識方式，不從任意自訂名稱刪除字串。 |
| Liveliness | PASS：沿用既有字體、青綠選取色與 SOAP 層級，ENERGY 1／RHYTHM 2／MOTION 1；已檢視桌面長期評估與手機 P 區畫面。 |
| Craftsmanship | PASS：舊識別碼及中文匯入名稱、單一 VOR 控制、原始分數保存、獨立數值、精簡 A 區及 O 區本次反應均有雙語瀏覽器與存檔重開驗證。 |

## 2026-11-11：評估名稱、功能分類與新增按鈕

病歷中的內建長期評估改用精簡名稱，移除設備前綴與括號來源；視覺功能依視力、視野、對比敏感度、色覺、立體視覺及眼動功能排序，不在介面加入排序說明。標準與資料表的相同評估共用勾選入口，已記錄的兩組欄位仍各自保留。UFOV 歸於功能性視覺，原有泛稱的作業可指定閱讀、搜尋或手眼協調，並填寫時間、錯誤與正確率。「其他評估結果」不另列編輯入口，但既有結果保留。

症狀改稱「症狀自評（0 至 10）」並移入短期成效；介入區保留「復能」單一標題，與調適、代償對應。選單移除刪節號，新增操作共用同一 SVG 加號。英文搜尋提示縮為 `Name/ID/diagnosis`，保留三種搜尋條件並避免新增加號後在 320px 被擠到。從內建模板新增的評估以 `templateId` 保留來源，讓精簡雙語名稱與原始儲存名稱分開，改過名稱的自訂項目保持原文。

`assessment-display.cjs` 直接以 file URL 開啟隔離 bundle，使用合成的舊版與匯入紀錄，驗證排序、去重、兩份原始結果、0、自訂名稱、症狀恢復時間、模板新增及 CSV／存檔重開。`language.cjs` 補上兩種語言的選單、加號、分類與症狀位置檢查；`vf-entry.cjs` 驗證單一視野入口能同時開關一般與匯入欄位，並保存各自的方向、原文與 0。這些測試皆由 `run-ci.cjs` 自動探索。畫面證據在 `.tmp/verification/assessment-display/`，未寫入真實病歷。

沿用現有青綠重點色、字體與表單版型，ENERGY 1／RHYTHM 2／MOTION 1；加號辨識新增操作，單一復能標題消除重複層級，合併入口縮短評估清單並保留量測來源。

| 交付檢查 | 結果與證據 |
| --- | --- |
| Hard Gate | PASS：新測試拒絕 HTTP(S) 請求；雙語檢查涵蓋標籤與無障礙名稱，320／360／768／1280px 無頁面橫向溢出。 |
| Purpose Gate | PASS：沿用既有樣式；同一 SVG 加號對應新增操作，排序與共用入口服務評估填寫。 |
| Liveliness | PASS：沿用既有三項設計值；已檢視繁中桌面長期評估及手機介入畫面，保留 SOAP 標記、青綠選取狀態與區段留白。 |
| Craftsmanship | PASS：中英文、明暗色、鍵盤勾選、合併項目的開關與結果保存、原始名稱及 CSV／存檔重開均有瀏覽器驗證。 |

最終 `git hook run pre-push` 以退出碼 0 完成 `node scripts/build.cjs` 與完整 `node tests/run-ci.cjs`，包含新增測試及本次修改過的所有測試、915 個翻譯片段、六個合成個案、離線隱私、匯入匯出與儲存回歸。完整輸出為 `.tmp/assessment-display-pre-push-final.log`。舊名稱、舊分組斷言與加號造成的窄螢幕搜尋提示裁切均在驗證中修正，未跳過測試或繞過 hook。

## 2026-11-11：短長期評估分區、模板分類與間距

病歷 O 區分開呈現「短期成效」「長期評估」，各依視覺功能、功能性視覺、動作功能、日常生活功能、認知功能分組。短期模板提供訓練前、立即後、恢復與追蹤的實際欄位；舊個案可從新增短期指標入口加入，空白模板亦帶入分時點欄位。模板選單以原生 optgroup 標示功能與期程，縮短中英文名稱並保留工具縮寫；實際名稱、結果及既有 CSV 結構保持原樣。新增功能／期程設定經驗證並隨病歷快照保存，舊模板只於顯示時分類。

移除編輯器內重複的症狀推理／處置摘要與回到來源按鈕，保留上方症狀連結作為單一編輯位置；施測教學保留於 README，不再出現在病歷。紀錄卡標題、分數、評估數量與訓練以 12px 間隔排列；介入群組標題與選項統一為 8px，群組另留 16px，SOAP 區段移除重複疊加的 margin。新增群組使用可縮小的 grid 欄，避免手機被表格最小寬度撐開。

`assessment-periods.cjs` 驗證舊個案新增、空白模板回切、功能／期程錯誤訊息、實際前後測、負值與 0、雙語原文保存、CSV 與存檔重開；`assessment-groups.cjs`、`assessment-picks.cjs`、`language.cjs` 更新五類／期程分組的斷言。`record-hierarchy.cjs` 與 `clinical-links-usability.cjs` 實際量測間距、檢查單一編輯位置與亮暗色 360／1280px；其餘雙語版面檢查涵蓋 320–1440px。截圖留在忽略的 `.tmp/verification/assessment-periods/`、`record-hierarchy/`、`clinical-links-usability/`。

`git hook run pre-push` 已以退出碼 0 完成離線建置與完整 `node tests/run-ci.cjs`，包含新測試的自動探索、雙語、六個合成個案 19 筆紀錄、舊病歷、PDF／CSV／Excel／JSON、鍵盤與無對外請求檢查。完整輸出為 `.tmp/ui-spacing-pre-push-final.log`；所有測試使用隔離 bundle。首次完整驗證在舊評估勾選測試的畫面選擇器處正確阻擋，更新分組斷言後重跑全套通過，未跳過測試或繞過 hook。

## 2026-11-10：臨床三段直式排列與縮短搜尋欄

依使用者指定，「症狀與功能」「推理與依據」「介入與計畫」在所有尺寸一律上下排列，每段保留自身標題；移除桌面三欄的 container 規則與重複表頭，不改動病歷資料或匯出內容。

搜尋欄的標籤容器上限為 224px，輸入框可隨空間縮短。桌面工具列優先保留完整的一列；861–1199px 編輯時將整組命令移至第二列。561–860px 將搜尋留在首列，命令集中於第二列；極窄視窗依控制所需寬度換行，維持至少 44px 的點擊範圍。另縮減工具群之間的內距，讓保留實體捲軸的 768px 英文畫面仍能容納同列工具。

Playwright MCP 已實際連接 Brave，檢查中英文、亮暗色、360／600／768／900／1024／1100／1280／1440px 共 32 組畫面。三段均垂直，沒有頁面橫向溢出；瀏覽時搜尋輸入約 130–222px。768px 瀏覽／編輯頁首均為 109px；900–1100px 瀏覽為 61px、編輯為 113px；1280／1440px 均維持 61px 單列。截圖與量測位於 `.tmp/verification/ui-review/mcp/vertical-search-*`、`.tmp/vertical-search-mcp-results.log`。

`patient-dashboard.cjs` 改為在 11 種尺寸嚴格檢查三段垂直、滿寬與可見標題；同一次 DOM 讀取量測父子幾何，避免視窗縮放時跨呼叫讀到不同版面。`toolbar.cjs` 加入搜尋上限、900–1100px 命令不拆列、平板兩列與保留捲軸的測試。`language.cjs` 驗證有病歷資料時的三段雙語標題。三項單獨測試及 `check_i18n.cjs` 已通過，保留原有資料完整性、隱私與匯出檢查。

使用者提供真實窄視窗截圖後，確認先前 MCP 的 `page.setViewportSize(900)` 仍固定模擬尺寸，實體視窗約 694px，造成畫面裁切。已關閉該模擬頁，改用新分頁的原生視窗（`page.viewportSize() === null`），不再覆寫尺寸；在真實 694px 視窗中直接點選搜尋欄、輸入 `DEMO-001`、顯示結果並開啟正確個案。搜尋欄位於 x=266、y=9，大小 222×44px，中心點命中輸入框。原生截圖為 `.tmp/verification/ui-review/mcp/native-narrow-{search-results,dashboard}.png`。

最終 `git hook run pre-push` 已執行 `node scripts/build.cjs` 與完整 `node tests/run-ci.cjs`，包含以上修改過的測試及 `ui-usability.cjs`，結束碼為 0；完整輸出為 `.tmp/vertical-search-pre-push.log`。

## 2026-11-10：Playwright MCP 畫面與操作修復

透過官方 `@playwright/mcp` 的 extension 模式，使用本機 MCP client 連接 Brave 中的 Playwright Extension，實際操作獨立測試副本與既有示範個案。擴充功能未允許 file URL，因此 MCP 畫面檢查使用只監聽 `127.0.0.1` 的暫存伺服器；自動化回歸則直接開啟 `tests/lib/app.cjs` 產生的離線 HTML，並攔截、拒絕所有 HTTP(S) 請求。連線 token 僅由程序環境傳入，未寫入檔案。

已重現並修復：

- 窄視窗工具列將匯入／匯出直排，造成頁首過高。360px 的 MCP 瀏覽畫面由 265px 降為 157px，編輯頁首為 209px；桌面維持單列。繁中與英文編輯畫面另掃描 320、350、360、480、560、600、768、860、900、1024、1100、1200、1280、1440、1920px，無頁面橫向溢出。
- Metro `.row > *` 的 `flex: 0 0 100%` 將操作按鈕撐滿整列，讓編輯、複製與啟停按鈕各佔一行，且移除按鈕內距。應用程式動作列恢復自然寬度、按鈕內距與至少 44px 的點擊範圍。
- 對話框開啟後，滑動遮罩會捲動背景。背景現會鎖定捲動並設為 inert；Escape 還原焦點及原捲動位置，Tab／Shift+Tab 包含 select 與 summary。
- 固定頁首高度隨尺寸改變，原本寫死的捲動留白無法跟隨。改為量測實際頁首，確保捲至欄位時不被遮住。
- 進度表格在窄視窗欄寬過小，缺乏明確的捲動操作。保留可讀欄寬，加入雙語提示、具名 region、鍵盤焦點與左右鍵捲動。
- Metro 的 `.scroll` 工具類別強制顯示兩個方向的捲軸，表格高度已足夠時仍出現無作用的垂直捲軸。改為只在內容超出時顯示捲軸。

`ui-usability.cjs` 使用獨立示範資料，驗證中英文、亮暗色、320／360／768／1280px、背景捲動、對話框焦點還原、操作按鈕排列、表格鍵盤操作與個案資料不變；`language.cjs` 加入新提示與 accessible name 的雙語檢查。新測試由 `run-ci.cjs` 的 `.cjs` 自動探索納入，因此也經由 `.githooks/pre-push` 執行。截圖位於忽略目錄 `.tmp/verification/ui-review/mcp/` 與 `.tmp/verification/ui-usability/`。

MCP 的八組中英文／亮暗色／360、1280px 實際流程涵蓋四個分頁、項目與基本資料欄位對話框、表格左右鍵及取消編輯確認；沒有對外 HTTP(S) 請求，示範個案內容保持不變。複查中一次瀏覽器錯誤來源為已安裝的 Zotero 擴充功能 `chrome-extension://ekhagklcjbdpajgpjgmbionohlpdbjgc/zotero.js`，同頁重載複測未再出現；隔離瀏覽器測試另檢查應用程式錯誤。

完整套件另重現既有 `offline-privacy.cjs` 在兩個 animation frame 後尚未收到 `form-action` 違規事件的時序問題；同一產物單獨執行即通過。測試改為等待實際 `securitypolicyviolation` 紀錄後再取樣，保留全部 CSP、原生 API 與零對外路由斷言，未改動應用程式的隱私限制。

`score-imports.cjs` 新增第二位個案時原先只等背景中已存在的個案摘要，使搜尋在新增對話框尚未關閉時就執行。補上對話框關閉及新個案就緒的等待條件，原有跨個案匯入隔離、資料不覆寫與雙語斷言全部保留。

`clinical-samples.cjs` 在完整執行中曾出現一次 10 秒儲存等待逾時，同一版本的 19 筆病歷獨立重跑通過。僅 CSV／PDF／TXT 儲存完成的等待上限調為 30 秒，並補上失敗時的儲存旗標、畫面狀態、錯誤與完整截圖；全部六個個案及原本的資料斷言仍會執行。

## 2026-11-10：一般復健假病歷與瀏覽器實查

新增 `clinical-samples.cjs`，建立六位明確標示為虛構的個案、共 19 筆紀錄：中風偏癱與忽略、腦傷注意／動作協調、脊髓損傷輪椅移位、低視能閱讀、雙眼視覺及術後步行。各個案只啟用適合的評估與訓練，脊髓損傷個案沒有步行測驗結果，採自訂輪椅移位任務，未宣稱為標準化量表。實際操作建立個案、切換病人、開啟及儲存病歷、進度追蹤、雙語／亮暗／360–1440px、鍵盤展開、備份與本機檔案輸出。

修正前以 Playwright 重現：搜尋表 34 欄、症狀耐受性表 41 欄，表頭擠成直排；脊髓損傷與一般步行個案出現完全未評分的症狀表；繁中症狀表頭仍為英文。「功能性視覺」分類名稱不適合一般復健，內建模板直接儲存時也會把顯示用譯文寫回標準名稱與欄位。

修正後短期結果逐次病歷、逐時點呈現，只列有值的指標，搜尋表降為最多 6 欄；條件與備註可收合。保留空白與 0、負向偏移、實際追蹤時間、各次病歷欄位定義，以及複製模板的獨立欄位識別碼。沒有填分的症狀不產生空表；沒有啟用視覺項目且未填視覺症狀時，視覺症狀區收合為選填。分類顯示改為「功能表現」，識別碼仍為 `functional`，不改寫舊病歷。未改動的標準名稱與欄位保留 canonical 文字，自訂名稱維持原文。

總覽的短期依據改用時點摘要，避免將測量時間、設定與每個時點的重複欄名堆成長文；只有畫面摘要採精簡模式，TXT／PDF／Excel 仍保留完整條件與結果。原有視覺症狀空白但短期耐受性已有評分時，總覽顯示已填的疼痛／耐受性，不再顯示缺漏評分。`clinical-samples.cjs` 驗證繁中及英文的疼痛摘要與長文精簡；`patient-dashboard.cjs` 驗證既有連結、缺漏、原文與匯出維持相同資料。

PASS，操作與資料：六個案逐一開啟、儲存；中英文新表頭、條件／備註、功能分類與選填區驗證；未測值、0、負值、追蹤日期與複製模板的獨立識別碼通過。原有模板與語言測試亦通過，無瀏覽器錯誤或對外請求。

PASS，排版與目的：沿用既有臨床表單、字體與配色，ENERGY 1／RHYTHM 1／MOTION 1；以時點列與已測指標減少橫向閱讀負擔，數值先於測量時間，手機第一項結果不需橫向捲動即可讀取，其餘欄位有捲動提示。條件及備註保留原生展開標記，原有一般評估表維持原格式。已人工檢視中風短期比較、脊髓損傷疼痛比較與選填視覺區的桌面／手機畫面。

假資料、修正前後截圖及表格量測位於忽略的 `.tmp/verification/clinical-samples/before/` 與 `after/`；`after/synthetic-records.json` 可匯入，`after/records/` 包含可直接開啟的本機資料夾（六個案、19 組 CSV／PDF／TXT）。`clinical-samples.cjs` 與本輪更新的測試均由 `node tests/run-ci.cjs` 自動納入，正式 hook 輸出為 `.tmp/v-full-ci-clinical-samples.log`。未將假病歷嵌入發佈 HTML。

最後版本實際執行 `git hook run pre-push`，建置及完整 `node tests/run-ci.cjs` 全部通過，原生退出碼為 0；包含 `clinical-samples.cjs`、`short-outcomes.cjs`、`language.cjs` 與 `patient-dashboard.cjs`。`after/synthetic-records-folder.zip` 已打包並核對含 20 個 CSV（含名冊）、19 個 PDF、19 個 TXT；個案與畫面索引為 `after/個案說明.md`。未提交或推送。

## 2026-11-10：單次與短期成效指標

依提供的指標整理增加 14 個每次復健模板，涵蓋視覺搜尋、忽略、閱讀、NPC／PFV、視覺動作與眼動控制、TUG／10MWT／BBT／9HPT／COP，以及獨立的症狀恢復與固定負荷耐受性紀錄。每個模板提供訓練前 1、訓練前 2、立即後、恢復與 24–72 小時追蹤，並記錄實際時間、等值題型、施測條件、主要指標與介入／對照條件。既有個案從模板新增，原有設定與病歷快照不自動改寫。中英文 README 同步說明操作與解讀限制。

`short-outcomes.cjs` 使用 `tests/lib/app.cjs` 的獨立產物，實際操作兩種語言的本機資料夾病歷：驗證 0 與負向偏移、未測空白、數值範圍、取消勾選、切換語言保留原文、存檔重開、CSV／TXT／Excel、歷史快照、舊個案新增模板，以及寫入失敗後保留設定並重試。`language.cjs` 增加全部 14 個模板、五個時點與說明的雙語及可及名稱檢查；`check_i18n.cjs` 將新模板與時點列入原有內建標籤檢查。評估群組、勾選與匯入測試同步驗證 38 項標準模板及每次復健時機。

交付檢查：

- PASS，功能與可及性：勾選展開、取消勾選停用輸入、三個選用時點與設定區可展開，超出 0–10 不得存檔，寫入失敗可重試；兩語、亮暗模式、320／360／768／1280px 無頁面溢出，輸入控制項至少 44px，瀏覽器無錯誤且無對外請求。
- PASS，視覺目的：沿用原表單的字體、色彩、邊框與操作方式。以時點分組減少辨識負擔，實際時間獨占一列以保留描述空間，選用時點收合以減少單次前後測的填寫長度。
- PASS，設計方向：沿用既有臨床表單，ENERGY 1／RHYTHM 1／MOTION 1；不增加視覺素材或動畫，以結果欄位為主要焦點。
- PASS，資料與解讀：功能成效與耐受性使用不同模板／領域，不依症狀下降自動判定療效、不假設 MCID。空白與 0 分開保存，時點與單位隨病歷快照及匯出保留。

新增及修改的測試均由 `node tests/run-ci.cjs` 自動發現，`.githooks/pre-push` 使用相同入口，任何失敗都阻擋推送。畫面留在忽略的 `.tmp/verification/short-outcomes/`；完整 hook 輸出留在 `.tmp/v-full-ci-short-outcomes.log`。

本輪獨立 `check_i18n.cjs`、`language.cjs` 及實際 `git hook run pre-push` 執行的完整 `node tests/run-ci.cjs` 全部通過，hook 原生退出碼為 0，輸出確認包含 `short-outcomes.cjs`。`node scripts/build.cjs --check` 通過，發佈檔與來源一致。已人工檢視繁中淺色桌面及深色手機的分時點表單；沒有提交或推送。

## 2026-11-10：分離開發來源、離線 Metro UI 與全域基本資料設定

開發來源改為 `src/index.html`、`src/styles.css`、`src/app.js` 與獨立的隱私／主題／Excel／Metro 初始化程式；外部套件、授權與校驗資訊放在 `vendor/`。`EzEMR.html` 為建置產物。`node scripts/build.cjs` 不需安裝套件或連網，會檢查本地套件完整性，再合併 HTML、CSS、JavaScript、字型與圖示。開發頁與產物皆可直接以 `file://` 開啟。

`.githooks/pre-push` 先建置根目錄的發佈檔，再執行完整 `node tests/run-ci.cjs`；GitHub Actions 採相同流程，成功後上傳單一 HTML artifact。測試透過 `tests/lib/app.cjs` 讀取獨立暫存產物；完整 runner 共用新建的 `.tmp/ci/EzEMR.html`，單獨測試不覆寫發佈檔。`build.cjs` 測試涵蓋來源修改、唯讀檢查、暫存預覽、LF／CRLF 一致性、禁止外部資源、套件遭修改或授權缺失，以及開發／發佈頁的離線啟動。`ci-runner.cjs` 在隔離 Git 專案執行真實 hook，證明失敗會阻擋後續流程。

採用本地固定版本 Metro UI 5.1.20 的 app-bar、Input、dropdown 與按鈕樣式，保留鍵盤選單、焦點、原生表單與既有病歷內容。互動文字 13px、共用內距 2px／10px、相鄰操作同尺寸與 8px 間隔；桌面頂部高 61px，控制項外保留 8px，上下不貼邊。主要操作使用應用程式強調色，避免套件 `.primary` 的紅色覆蓋；刪除與確認刪除維持警示色，雙主題皆驗證實際顏色與 hover。資料夾狀態不占畫面欄位，於設定內查看。原有病人搜尋、無側欄、主區新增紀錄及語意化紀錄分組均保留。

基本資料設定有 14 欄：姓名、病歷號、身分證字號、生日、性別、抽菸／飲酒／嚼檳榔、職業、宗教、慢性病、電話、地址與過敏史。勾選欄位為所有病人的必填資料；未勾選欄位不顯示於填寫畫面，保留既有值。新增要求不改寫舊資料，已有紀錄可讀，缺漏時先補資料才可儲存新紀錄。設定與 SOAP 草稿互不覆蓋；設定儲存失敗保留原政策與可編輯對話框。資料夾模式以 `settings.json` 儲存，瀏覽器模式獨立保存；備份可還原設定，無姓名／病歷號時仍使用穩定識別碼且不把翻譯文字寫成姓名。

發佈檔的 CSP 禁止外部腳本、連線、表單提交、frame、worker 與 base URI；最早執行的隱私程式另封鎖 fetch、XHR、beacon、WebSocket、EventSource、WebRTC 等傳輸介面。Metro／Excel／字型與圖示全數本地內嵌，不使用 CDN、外部字型或宿主下載橋接。`metro-init.js` 保留暫存文件解析，省略上游解析器插入的 base；不修改套件、不放寬 CSP，並驗證單一標籤、選擇器、混合文字與 script 的解析契約。EyeDot 說明網址以本地對話框供複製。`offline-privacy.cjs` 用合成識別字串測試填寫、儲存、重開、匯入、下載及備份，要求零 HTTP／WebSocket 請求及正常操作時零 CSP 違規；另外以捕獲的原生 API 證明 CSP 仍會阻擋傳輸，不只依賴 JavaScript 封鎖。

新增的 `build.cjs`、`metro-ui.cjs`、`offline-privacy.cjs`、`profile-settings.cjs` 與 `profile-storage.cjs` 均由 runner 自動發現。瀏覽器檢查涵蓋雙語、亮暗模式、320–1280px、無溢出、按鈕間距、全域必填驗證、設定儲存與病歷原文保留。人工檢視包含繁中桌面工具列、病人總覽、基本資料設定及英文深色設定／手機畫面；截圖與結果位於忽略的 `.tmp/verification/metro-ui/`、`patient-dashboard/`、`profile-settings/`、`profile-storage/`、`offline-privacy/` 與 `build/`。

最終 `node tests/check_i18n.cjs`、`node tests/language.cjs` 與實際 `git hook run pre-push` 執行的完整 `node tests/run-ci.cjs` 全部通過，原生程序退出碼為 0。完整輸出為 `.tmp/v-full-ci-metro-source.log`，退出碼為 `.tmp/verification/metro-source/hook-result.json`；`node scripts/build.cjs --check` 也通過。先前抓到的鍵盤焦點、儲存按鈕配色與上游暫存 base 問題均已修正，未略過失敗測試或放寬 CSP。未提交或推送；GitHub Actions 流程已設定，尚未在遠端執行。

## 2026-11-10：頂部個案搜尋、紀錄卡片分組與 ponytail-audit 修正

依本輪需求移除完整側欄、收合按鈕、收合偏好與隱藏的 command-context。個案搜尋移至固定頂部，空白時不列名冊；依姓名、病歷號或診斷搜尋，最多顯示八筆並提供總數，支援上下鍵、Enter、Escape 及草稿確認。紀錄卡片以 `session-metrics` 定義清單對齊復健前、復健後與差異，各測驗分數、評估／恢復／耐受度、復健項目另行分組；出席與缺席卡片共用標題和操作。編輯器的 `symSummary` 與 `copmSum` 也改為 `score-summary` 定義清單，保留原有值與比較規則。互動文字使用 13px，維持至少 44px 操作範圍，正文不縮小。

ponytail-audit 實際以合成資料重現並修正：同名但病歷號不同的病人被誤合併、備份內重複識別碼覆蓋資料、舊版 JSON 讀取失敗被當成不存在，以及病人切換的舊回應覆蓋目前紀錄。另刪除 `saveClient` 不可能成立的資料夾重新命名／刪除分支與未使用變數，減少六行，沿用既有固定資料夾政策；沒有新增執行期套件或儲存層。完整稽核位於忽略的 `.tmp/verification/ponytail-audit.md`，修正前反例為 `ponytail-audit-probes.json`。

新增 `tests/import-identity.cjs`，兩語皆通過：不同病歷號分開、相同病歷號與缺少號碼的既有備援合併、舊資料的空白或純空格號碼補入第一個已知病歷號後不被另一號碼誤用、同名歧義與生日衝突、整份備份寫入前拒絕重複個案／病歷識別碼、舊版 JSON 格式或權限錯誤顯示檔名且不修改檔案、遺失 JSON 的備援與 BOM 相容性，以及修改病歷號仍保留既有資料夾與檔案。結果存於 `.tmp/verification/import-identity/results.json`；`imports.cjs`、`storage.cjs` 已通過相關回歸。

`run-ci.cjs` 自動發現 `tests/` 下的新 `.cjs`，故新測試已包含於 `.githooks/pre-push` 執行的完整入口，無須調整 runner。`vf-entry.cjs` 的重載流程亦改由 header 搜尋選取病人，保留全部視野與儲存驗證。最終 `node tests/check_i18n.cjs`、`node tests/language.cjs` 與實際 `git hook run pre-push` 執行的完整 `node tests/run-ci.cjs` 全部通過，原生程序退出碼為 0；失敗阻擋反例亦通過。輸出為 `.tmp/v-full-ci-header-search.log`，退出碼為 `.tmp/verification/header-search/hook-result.json`。未提交或推送。

交付檢查：

- PASS，操作與可及性：繁中／英文、亮暗模式、320–1920px、鍵盤搜尋、無符合結果、八筆上限及草稿確認由瀏覽器測試通過；13px 互動文字與 44px 操作範圍均有實測。
- PASS，排列目的：復健前／後／差異使用固定三欄，測驗、恢復、評估與訓練依資料意義分組；標籤、顏色與正負值同時保留。移除 `.line`、所有 `chip mono`、側欄及其狀態，出席／缺席共用標題與操作。
- PASS，設計方向：沿用本次高密度臨床工作區的 ENERGY 1／RHYTHM 1／MOTION 1；正文維持原尺寸，未新增視覺素材或動畫。
- PASS，人工檢視：已檢視 1366px 繁中／英文紀錄、搜尋結果、英文症狀／COPM 編輯摘要及英文深色 320px 畫面；截圖位於 `.tmp/verification/header-search/` 與 `workspace-*.png`。1366px 實測頂部 49px、主區全寬 1366px、輸入字體 13px、正文 16px。

## 2026-11-10：緊湊工作區與病人狀態層級

桌面版標題、選單、工具、儲存狀態與語言選擇器合為一列；「新增紀錄」移至病人主區。左側個案名單可收合，瀏覽器記住選擇，草稿不受影響。主區優先顯示病人身分與診斷、紀錄日期及症狀分數，再呈現症狀／推理依據／介入計畫；病史與來源細節收合。總覽以可用內容寬度決定三欄或依序堆疊，減少重複標題與內距，控制項保留至少 44px 操作範圍。

總覽只讀取所選出席紀錄，標示最近或歷次出席；最新紀錄若為缺席，包含只有缺席紀錄的個案，都顯示日期提示。分數正負差異只比較同次紀錄的首末評分，以「本次變化／Visit change」標明；降低為綠、升高為紅，相同或缺少比較值使用中性色，不推定嚴重程度。

本輪驗證範圍為 `patient-dashboard.cjs`、`toolbar.cjs`、`workspace.cjs` 與 `language.cjs`：兩語、亮暗模式、桌面緊湊高度、手機無溢出、收合後空間與重載記憶、鍵盤／焦點、切換語言與收合時保留草稿、最新缺席及不完整評分。這些既有測試由 `node tests/run-ci.cjs` 自動發現，`.githooks/pre-push` 執行同一入口；失敗必須阻擋推送。畫面與結果留在忽略的 `.tmp/verification/`，總覽截圖位於其 `patient-dashboard/` 子目錄。

1280px 視窗實測，頂部高度由 130px 降至 49px；名單由 272px 改為 224px，收合為 52px，主區可用寬度由 1008px 增至 1228px。量測以本輪開始時的 HTML 副本對照，結果存於 `.tmp/verification/density-metrics.json`。

交付檢查：

- PASS，操作與可及性：雙語、亮暗模式、320–1920px 無水平溢出；44px 控制項、鍵盤與焦點由上述瀏覽器測試驗證。
- PASS，視覺目的：沿用原字體與青綠操作色，診斷提前、低優先資料收合、每項症狀的關係對齊；顏色配合正負值，不單靠顏色傳達資訊。
- PASS，設計方向：依本次臨床資料密度要求採 ENERGY 1／RHYTHM 1／MOTION 1，以一列工具和資料欄位建立層級，未新增視覺素材或動畫。
- PASS，人工畫面檢視：已檢視繁中淺色 1280px 展開／收合、英文深色 1280px 與 360px 收合畫面；病人資訊、來源日期與完整臨床原文保留。

本輪 `node tests/check_i18n.cjs`、`node tests/language.cjs` 與上述工作區測試通過。實際 `git hook run pre-push` 執行完整 `node tests/run-ci.cjs`，全部測試通過且原生程序退出碼為 0；失敗阻擋反例亦通過。完整輸出為 `.tmp/v-full-ci-density-native.log`，退出碼紀錄為 `.tmp/verification/density-hook-result.json`。未提交或推送。

## 2026-11-10：症狀變化標示與五項加總來源

復健紀錄卡片的症狀差異改用「與首次差異／Change from first」與正負數值，不再使用眼科稜鏡度數符號；正融像輻輳欄位的原始名稱、單位及既有結果鍵保持不變。`workspace.cjs` 在兩種語言檢查差異標籤與稜鏡度數欄位，仍由 runner 自動納入。

追溯最初應用程式 commit `af3ec91`，五項症狀與加總方式已存在；原始註解提到的症狀評分說明未附於儲存庫，也沒有此五項組合的量表引用。提供的簡報未指定這五項。雙語 README 記錄此來源限制與目前略過空白後直接加總的算法；本輪未改動症狀項目、既有評分或加總算法。

雙語工作區、`check_i18n.cjs`、`language.cjs` 與實際 pre-push hook 執行的完整 `node tests/run-ci.cjs` 均通過；未推送。

## 2026-11-10：總覽可用寬度與臨床閱讀排版

原本以整個視窗 1200px 啟用三欄，扣除側欄與內距後，症狀欄只剩約 180px 文字寬度。改以 Dashboard 的內容寬度作容器查詢，至少 72rem 才並排；不足時，每個症狀的「主要症狀／推理與依據／介入」依序各占完整一列，維持症狀到介入的閱讀順序。

依醫療人員閱讀情境，正文保留 16px、一般字重，繁中／英文行距由 1.8／1.6 改為 1.45／1.4；標題使用 700 字重與 1.25 行距。總覽區段標題改為主文字色與 16px 粗體，症狀文字維持正文格式；段落與清單間距縮小，填寫標籤加粗，欄位仍保留 44px 操作高度。雙語瀏覽器回歸同時檢查標題比正文粗、正文行距不超過 1.5。

`tests/patient-dashboard.cjs` 先在原始版面重現 1200px 三欄問題，再驗證修正後的繁中／英文與亮暗模式：320／360／768／1024／1200／1280／1366／1440px 為直排，1600／1680／1920px 有足夠欄寬才並排；大視窗內將 Dashboard 限制為 900px 也會直排。回歸檢查實際座標、欄寬與順序，補足原本僅檢查無溢出的不足。截圖為 `.tmp/verification/patient-dashboard/{zh-TW,en}-{light,dark}-{1280,1440,1680}.png`。

本輪 `check_i18n.cjs`、`language.cjs`、Dashboard 檢查與實際 `git hook run pre-push` 執行的完整 `node tests/run-ci.cjs` 均通過；未推送。已人工檢視繁中 1280px 與英文深色 360px 的緊湊排版，以及 1680px 並排畫面。

## 2026-11-10：病人總覽與逐項症狀、推理、介入連結

最終完整 `node tests/run-ci.cjs` 與實際 `git hook run pre-push` 均通過，包含新增的 Dashboard、VF 測試及所有既有 `.cjs`／`.py` 測試。hook 的失敗阻擋反例也通過；未進行推送。檢查輸出與合成資料僅寫入忽略的 `.tmp/`。

依《視覺復健服務架構》的一張架構投影片，新增每位病人的預設「病人總覽」。評估沿用「視覺功能／功能性視覺」，推理標記個人、環境與作業面向，處置分面對面／遠距復健的復能、調適與代償。簡報沒有獨立症狀分類或自動推理規則，因此關係由治療人員逐項填寫。面對面復能「視覺知覺」的英文採中文原意 Visual perception，沒有沿用簡報中不一致的 Visual field training。

新增 `tests/patient-dashboard.cjs`，既有 `tests/workspace.cjs` 與 `tests/language.cjs` 加入預設總覽及分頁檢查。`tests/run-ci.cjs` 自動發現 `tests/` 下的 `.cjs`，不需另外登錄；`.githooks/pre-push` 直接執行同一 runner，失敗會阻擋推送。下列項目已以合成資料執行 `node tests/patient-dashboard.cjs` 與 `node tests/workspace.cjs`，兩語皆通過：

- PASS：從本機 HTML 離線開啟，新增與切換病人預設進入總覽；空白與只有缺席紀錄的病人不混入其他病人的資料。
- PASS：預設選最近出席紀錄，可切換歷次出席紀錄，缺席不列入選單；逐筆顯示症狀、推理與依據、介入，保留各筆對應關係。
- PASS：依據使用該筆紀錄與當時的評估定義；草稿結果變更立即更新依據預覽，未施測的評估明確提示；閱讀總覽不修改已存資料。
- PASS：沒有逐項連結的舊紀錄依原欄位顯示，沒有虛構的連結識別碼或自動推理。
- PASS：編輯器新增、刪除連結，切換服務型態保留其他型態已選策略；切換中英文保留分類識別碼、勾選、病人原文與草稿。
- PASS：儲存、CSV 往返、病歷文字與連結文字報告保留內容；舊紀錄不被補上原本不存在的 `clinicalLinks`。
- PASS：實際序列化及重讀 Excel 的 Clinical links 工作表與 SOAP 表單，保留連結 ID、評估／介入 ID、翻譯後標籤、PEO、該次結果及原文備註；以 `=` 開頭的備註維持文字，不產生公式。
- PASS：錯誤結構、重複連結 ID、不合法分類與 PEO 面向、危險識別碼皆以雙語錯誤拒絕；未知但格式正確的識別碼可保留。文字中的 HTML 原樣顯示，不產生標記。
- PASS：亮色與深色、中英文、320／360／768／1280px 無水平溢出；總覽控制項至少 44px，鍵盤焦點可見；既有工作區的四分頁鍵盤切換與病歷操作通過。
- PASS：未完成的空白症狀連結切換為缺席後可儲存，草稿推理與處置不消失，也不混入缺席病歷文字；CSV 與重載後保留草稿，改回出席時重新要求症狀欄位。

結果與合成資料快照為 `.tmp/verification/patient-dashboard/results.json`、`zh-TW-clinical-links.json`、`en-clinical-links.json`；畫面包含空白、舊紀錄、編輯器，以及兩語亮／深色 360／1280px 總覽截圖。原生資料夾選擇對話框與臨床適用性未由這些自動化測試驗證。

視野填寫參考 NTUHLowvision `index.html` 的十字欄位：OD 在觀看者左側、OS 在右側，鼻側朝中間、顳側朝外；OU 在下方，病人右側位於畫面左側。共十二個自由文字欄位，空白表示未記錄，角度、質性描述及 `0` 均保留；沒有新增視野判讀或臨床推論。既有測驗方法、OD／OS 記載、摘要、自訂欄位及來源資料表的原始欄位識別碼均維持相容。顯示方向欄位不會改寫已儲存的模板。

新增 `tests/vf-entry.cjs`，由同一 runner 與 pre-push hook 自動納入。已實際執行 `node tests/vf-entry.cjs`，繁體中文與英文皆通過：

- PASS：內建視野與來源資料表各有十二個附標籤欄位；OD／OS 的鼻顳方向、OU 的病人左右方向正確，舊欄位及自訂欄位仍可填寫。
- PASS：空白維持空白，自由文字、含引號與 HTML 字元的描述、文字 `0` 均可輸入；取消勾選再展開及切換語言保留草稿，英文標籤與提示無漏翻。
- PASS：中英文、亮色及深色、320／390／768／1280px 無水平溢出，方向欄位至少 44px 且有可用標籤；Tab 可移至下一欄，焦點可見。
- PASS：儲存與重載、病歷文字、CSV 往返保留全部方向結果及舊有／自訂內容；已載入的數字 `0` 在欄位未修改時保留數字型別；自訂評估不會被套入視野排列。

結果存於 `.tmp/verification/vf-entry-results.json`。兩語、亮／深色、390／1280px 截圖為 `.tmp/verification/vf-{zh-TW|en}-{light|dark}-{390|1280}.png`；已人工檢視英文亮色 1280px 與繁中深色 390px。參考介面截圖存於 `.tmp/reference-ui/ntuh-vf.png` 及 `ntuh-clinic-vf-desktop.png`，以本機原始 HTML／CSS 呈現後擷取，沒有連接正式 Apps Script 服務或使用真實病歷。

Antislop 使用 during 模式，設計讀取設定為 ENERGY 1／RHYTHM 2／MOTION 1。沿用青綠色只標示選取與操作；Noto／系統繁中字體支援雙語臨床閱讀。一個實際症狀對應一列，寬螢幕為三欄、窄螢幕依序堆疊；症狀欄的淡底與列分隔線用於辨識關係。只收合來源細節與選擇清單，沒有新增視覺素材或虛構的真實病歷。分類依來源簡報，VF 方位依 NTUHLowvision 的參考介面。交付檢查以實際操作、上述截圖與結果檔為據；已人工檢視繁中淺色 1280px、英文深色 360px、VF 來源與實作畫面。

## 2026-11-05：OcuTrain 與周邊視野訓練分數匯入

電腦化視覺測驗改依 OcuTrain 的模組設定：平滑追視（PURSUIT）、凝視（FIXATION）、跳視（SACCADE）與前庭眼反射（VOR）各是一個評估項目，原本合併的追視、凝視項目不再列入新個案的預設清單。周邊視野訓練程式的三個 UFOV 子測驗也各自獨立。每個項目以主要分數為第一欄（OcuTrain 為注視正確率，UFOV 為 80% 正確門檻），測驗設定收合在「測驗設定」區，欄位代碼沿用程式匯出檔的鍵名。「電腦眼球運動訓練」與「周邊覺察」新增「測驗紀錄」，每次測驗一張卡片，各自記錄結果與設定。既有個案保留原本存好的項目與結果。

「匯入」可辨識 OcuTrain 的 JSON、CSV 匯出檔，以及 UFOV 的統計成績 CSV。預覽每次測驗一張卡片，可逐筆選擇匯入為評估、復健訓練或不匯入；OcuTrain 依測驗模式、UFOV 依當天是否有評估紀錄決定預設，未完成、練習模式與已匯入過的測驗預設不匯入。不覆蓋已有的不同結果；受試者代號屬於其他個案時停止匯入。UFOV 原始分數 CSV、UFOV JSON 與只有複視問卷的檔案只列說明、不匯入。

測試資料全為虛構，依兩個程式的檔案格式產生，不含任何個案資料。新增 `tests/score-imports.cjs`，由 `run-ci.cjs` 自動納入：

- PASS：追視、凝視、跳視、VOR 與三個 UFOV 子測驗為獨立項目，各有設定，主要分數排第一。
- PASS：預覽每次測驗列一筆，顯示日期、項目、主要分數與預設去向；未完成、練習、原始分數與重複檔案有說明；320 至 1280px 無水平溢出。
- PASS：評估測驗填入對應項目與各自設定；復健測驗成為測驗紀錄並寫入活動分數；沿用前次的複視問卷與缺少的欄位保持空白。
- PASS：病歷逐行列出結果，各項目設定合為一行，復健測驗另列一行；CSV 往返保留所有匯入值。
- PASS：匯入值在編輯畫面顯示於對應欄位，設定收合且選單顯示翻譯後的名稱；儲存後數值不變。
- PASS：復健測驗紀錄顯示來源與時間，可手動新增（各自設定）或移除，並隨紀錄儲存。
- PASS：重新匯入標示為已匯入；結果不同的第二次測驗不覆蓋已存結果。
- PASS：其他個案的檔案、與 EzEMR 紀錄混選的分數檔、未知模組與只有原始分數的檔案皆拒絕並說明，不寫入任何資料。
- PASS：進度追蹤每個項目顯示結果欄與一欄設定，另有復健測驗紀錄表。
- PASS：英文介面的預覽、報告、設定、測驗紀錄、病歷與進度表無未翻譯文字。

既有測試調整：`assessment-picks.cjs` 改用新的項目代碼（10 個預設評估項目）；`templates.cjs` 的舊個案改為明確保留舊跳視項目；`language.cjs` 加入英文的測驗紀錄與測驗設定檢查；`check_i18n.cjs` 新增內建項目、欄位、選項與活動名稱必須有中英對照的檢查，並將 OcuTrain、Tobii、WebGazer 列為共用名稱。截圖為 `.tmp/verification/score-import-preview-dark-360.png`、`score-import-preview-light-1280.png`、`score-runs-dark-360.png` 與 `score-runs-light-1280.png`；結果寫入 `.tmp/verification/score-imports-results.json`。未以兩個程式的實際輸出檔做端對端測試，臨床適用性仍需醫療人員試用確認。

## 2026-11-05：初次評估項目、勾選展開與各活動分數

依醫療人員的填寫流程調整：評估與復健項目改用 NTUHLowvision 門診評估的勾選展開方式（勾選本次施測項目，展開對應的紀錄欄位）。「項目設定」新增「初次評估項目」，基準評估先列出這些項目，療程後與追蹤評估只把其中依評估時機應再評估的項目列為「本次應評估」。未勾選的項目不存入紀錄；舊紀錄已存有的結果保留。

復健項目內每個勾選的活動各有一個分數（`actScores`，以活動原值為鍵），寫入病歷、PDF、TXT、CSV、Excel 的 Training results，並在進度追蹤每個活動各占一欄。原本共用的「表現」欄只在項目沒有活動清單，或舊紀錄已有內容時顯示（後者標為「整體表現」）。自評難度與整體耐受度由滑桿改為 0 至 10 數字欄，空白表示未評分，超出範圍時阻擋儲存。範例個案改用各活動分數。

新增 `tests/assessment-picks.cjs`，由 `run-ci.cjs` 自動納入：

- PASS：初次評估項目勾選後立即儲存，重新載入仍保留；模擬寫入失敗時恢復原勾選並顯示錯誤。
- PASS：基準評估先列初次評估項目，未列入者在「其他項目」；勾選展開、取消勾選收合並停用欄位，草稿保留。
- PASS：只有勾選的評估與復健項目存入紀錄；各活動分數（含 0 與自訂活動）經磁碟、病歷文字與 CSV 完整還原；難度填 11 時阻擋儲存。
- PASS：進度追蹤每個活動一欄並顯示該次分數。
- PASS：一般復健無應評估群組；療程後評估依評估時機列出初次評估項目；320／360／768／1280px 無水平溢出，另存亮色桌面與深色手機畫面。
- PASS：英文介面的初次評估設定、勾選群組、活動分數名稱與提示、進度欄位；切換語言保留草稿。
- PASS：舊紀錄中未勾選的結果與共用表現欄保留，並可加入各活動分數。

既有測試調整：`templates.cjs` 的難度改以數字欄填 0；`imports.cjs` 的來源評估名稱現在同時出現在初次評估項目與項目清單，改為分別檢查兩處。完整 `node tests/run-ci.cjs` 通過。截圖為 `.tmp/verification/picks-editor-light-1280.png` 與 `picks-editor-dark-360.png`。臨床適用性仍需醫療人員實際試用確認。

## 2026-11-04：公開版同步

公開版 `EzEMR.html` 已移除內附個案快照；`rehab-note.cjs`、`workspace.cjs` 與 `imports.cjs` 會確認 HTML 不含 `integratedRecords`。上傳前另以原始快照中的姓名、病歷號、生日與病歷文字，比對所有待上傳檔案，未發現相符內容；比對腳本只輸出命中數量，不輸出原值，也不納入儲存庫。

測試與文件改以目前的 HTML 為準：每次儲存寫入 CSV、PDF 與 TXT；個案工作區分為「復健紀錄／進度追蹤／項目設定」三個分頁，個案名單常駐「篩選個案」欄位。

匯入流程補齊雙語：錯誤、警告、匯入報告與來源標籤改走 `ui()`。來源資料表的工作表名稱、欄位名稱與寫入病歷的來源標記集中於 `SOURCE_WORKBOOK`，兩種語言下都保持原值，因此以任一語言重新匯入時比對一致；`imports.cjs` 驗證畫面標籤隨語言切換、病歷內的來源備註維持原格式。來源評估項目以英文識別名稱搭配 `LABELS` 中文。

介面修正：固定工具列取得焦點後的延遲 scroll 事件不再關閉選單（`toolbar.cjs`、`rehab-note.cjs`）；進度追蹤面板間距為 20px（`language.cjs`）；小螢幕分頁可換行，英文標籤不會藏在橫向捲動中（`workspace.cjs`）。

PDF 字體：電腦未安裝 Noto Sans TC、HTML 旁也沒有 `EzEMR-assets/NotoSansTC-VF.ttf` 時，Chromium 的 `document.fonts.load` 會失敗，原本會中斷每次儲存（首次 GitHub Actions 即因此失敗）。現改由系統字體備援繪製 PDF；`rehab-note.cjs` 在首次儲存時模擬字體載入失敗，確認 CSV、PDF 與 TXT 仍會寫入。

新增 `.githooks/pre-push` 與 `.github/workflows/check-i18n.yml`（Windows runner），兩者都執行 `node tests/run-ci.cjs`。`.gitignore` 另排除 HTML 旁的 `Data/`，避免將真實病歷提交到儲存庫。

## 2026-11-02：內嵌資料與匯入流程的推送檢查

`check_i18n.cjs` 依腳本類型排除 JSON 資料；HTML 內嵌 SheetJS Community Edition 0.20.3（Apache-2.0）讀取 Excel 匯入檔，以及 xlsx-js-style 1.2.0 產生含樣式的 Excel 匯出檔，兩者僅在符合各自固定 SHA-256 時排除介面掃描。原有漏翻反例仍執行，另驗證 JSON 不會被當成 JavaScript、可執行腳本不會因 `data-type` 被略過，以及修改任一第三方元件會失敗；讀取元件的初始化腳本仍須通過介面掃描。匯入用的原始工作表／欄位識別值保留不變，介面文案走 `ui()`，新增內建評估標籤由 `LABELS` 提供雙語。

公開版 HTML 不含內附個案資料，各測試會確認此點。`imports.cjs` 測試空白啟動與直接離線開啟，再以獨立資料夾測試合成資料：中英文 Excel 匯入、原始欄位與病歷保存、日期與數值 0、匯入報告與錯誤、舊版 SOAP 去重、`_archive` 排除，以及缺少 `client.json` 時不寫入資料。語言切換不改寫已儲存的資料與檔名。

`imports.cjs` 與所有既有 `.cjs`／`.py` 測試均由 `run-ci.cjs` 自動發現；pre-push 繼續執行同一入口，任何失敗都會阻止推送。所有合成資料、HTML 測試副本與產物置於忽略的 `.tmp/`。

`excel-libraries.cjs` 驗證讀取／匯出版本分離、舊讀取 API 拒絕執行、XLSB 匯入，以及總表與 SOAP 匯出檔的字型、填色、換行與 SOAP 框線；另以雙語驗證讀取元件缺失時的錯誤且不觸發 CDN 備援。使用 `xlsx.core.min.js`，因 `xlsx.mini.min.js` 讀取合成 XLSB 時出現 `parse_sty_bin is not defined`。

選單回歸檢查另涵蓋固定工具列取得焦點後的延遲捲動事件；事件對應的頁面位置未變時不關閉選單，實際捲動仍會關閉。寬螢幕的工具列固定在畫面上方，編輯長表單時仍可儲存；窄螢幕的工具列隨頁面捲動。元件雜湊以 LF 正規化，並驗證 LF／CRLF checkout 都可通過。

測試資料均為標記的測試個案。產品名稱統一為 `EzEMR`，主程式為 `EzEMR.html`，是單一 HTML，沒有新增執行期套件。

瀏覽器測試使用 Node.js、Playwright 與 Chromium；原始碼雙語檢查使用 Acorn；`check_exports.py` 使用 pypdf、PyMuPDF。測試依賴不影響 HTML 的使用。以下指令在儲存庫根目錄以 PowerShell 執行。

首次設定測試環境：

```powershell
npm install --prefix .tmp/test-tools --no-save --package-lock=false playwright@1.63.0 acorn@8.19.0
$env:PLAYWRIGHT_MODULE = (Resolve-Path .tmp/test-tools/node_modules/playwright).Path
node .tmp/test-tools/node_modules/playwright/cli.js install chromium
python -m pip install pypdf==6.16.2 PyMuPDF==1.28.2
git config --local core.hooksPath .githooks
```

完整測試入口會自動讀取 `.tmp/test-tools` 的 Playwright，因此使用此安裝位置時不需要手動設定 `PLAYWRIGHT_MODULE`。若使用其他位置，可指定該環境變數；`BROWSER_PATH` 可指定既有 Chromium 執行檔，`PYTHON` 可指定 Python 執行檔。

執行驗證：

```powershell
node tests/run-ci.cjs
```

`.githooks/pre-push` 與 GitHub Actions 都使用這個入口，每次執行完整測試，不依變更檔案略過項目。先檢查雙語與 Python 依賴，再執行病歷流程、獨立 PDF／ZIP 解析及其他測試腳本；任一步驟失敗立即結束，保留非零結束碼，Git 會停止推送。新增的 `.cjs` 與 `.py` 測試會自動納入，`run-ci.cjs` 本身不會遞迴執行。

首次執行會下載固定版本的 Excel 測試元件到 `.tmp/xlsx.bundle.js`，之後重複使用；可用 `XLSX_SCRIPT` 指定既有元件。套件或 Chromium 未安裝、Python 依賴缺少，以及元件下載失敗，都會使檢查失敗，不會跳過測試。套件與元件保留在 Git 忽略的 `.tmp/`，供後續推送使用。

`ci-runner.cjs` 以合成步驟驗證非零結束碼、失敗後停止後續步驟及無法啟動執行檔時的錯誤處理，另透過 `git hook run pre-push` 配合不存在的測試 Python 執行檔，確認實際 hook 會回傳失敗；此反例不會連接遠端或推送任何資料。`.gitattributes` 固定 hook 使用 LF，hook 的執行權限也納入 Git。新的 clone 需重新執行一次 `git config --local core.hooksPath .githooks`。

需要個別執行時：

```powershell
$env:PLAYWRIGHT_MODULE = (Resolve-Path .tmp/test-tools/node_modules/playwright).Path
node tests/check_i18n.cjs
node tests/rehab-note.cjs
python tests/check_exports.py
node tests/storage.cjs
node tests/toolbar.cjs
node tests/language.cjs

# 模板與外觀切換測試；沿用應用程式既有的固定版本 Excel 元件，下載至測試暫存。
curl.exe -sS -f https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js -o .tmp/xlsx.bundle.js
node tests/templates.cjs
```

測試會建立 `.tmp/verification`，匯出解析檢查需在 `rehab-note.cjs` 完成後執行。`.tmp/` 已由 Git 忽略，包含畫面、JSON 結果、CSV、PDF、ZIP、測試套件與下載的 Excel 元件；這些產物不隨儲存庫提供，以下產物路徑指執行對應測試後生成的本機檔案。

2026-11-01 文件與清理驗證：瀏覽器測試入口已改為現有的 `EzEMR.html`。`rehab-note.cjs`、`storage.cjs`、`toolbar.cjs`、`templates.cjs` 與 `check_exports.py` 全數通過；兩份 README 的相對連結與檔案樹也已核對。測試使用既有 Chromium 與固定版本的 Excel 元件，本次完成後清除 `.tmp/`，不保留生成產物。

## 語言切換驗證

`check_i18n.cjs` 解析 HTML 內的 JavaScript，以實際翻譯函式驗證內建文字，並拒絕未經 `ui()`／`ui` 樣板處理的中文、新增的單一語言介面標籤、缺少中文的內建項目與英文 README 的中文字。腳本另以故意漏翻的範例確認檢查會失敗。`.github/workflows/check-i18n.yml` 在推送與 PR 時執行完整 CI，其中包含此檢查及雙語瀏覽器測試；`AGENTS.md` 要求新功能同時增加中英文介面與相應畫面測試。

`language.cjs` 檢查繁體中文／English 切換、語言偏好重載、英文內建文字、無法保存偏好時的提示，以及 320／360／768／1280px 版面。以合成個案驗證切換時保留 SOAP 草稿、中文姓名與病歷原文、活動勾選、缺席選項的儲存值，以及既有 CSV／PDF 檔名。開啟對話框或儲存期間暫停語言切換，避免打斷尚未完成的表單。

## EzEMR 工作區介面

本次重構採用 stageshow 的資訊層級、間距、字級與單一重點色原則，直接改造現有應用程式。主程式維持單一 HTML，沒有加入 React、展示用假控制項或額外執行期依賴。頁首、瀏覽器標題、PDF 抬頭、匯入錯誤與中英文文件統一使用 EzEMR；既有瀏覽器儲存識別、備份格式與病歷檔案命名仍相容。

設計取捨：

- 青綠色只強調選取個案、目前分頁與主要操作，原有的警示色仍表示臨床分數或錯誤狀態。
- 固定個案側欄與精簡工具列保留操作脈絡；寬螢幕並排呈現紀錄歷程與症狀圖表，窄螢幕改為單欄。
- 延用 Noto Sans TC 與離線系統字體，透過字級、留白與細分隔線建立層級。
- 病歷摘要、篩選與紀錄各自分組；SOAP 以字母標記與分隔線分段，浮層陰影只用於選單與對話框。
- 動態效果限於操作回饋，沿用減少動態效果偏好。

`workspace.cjs` 阻擋外部網路，直接以 `file://` 開啟 `EzEMR.html`，驗證繁體中文與英文的首次儲存設定、空白工作區、個案建立與編輯捷徑、個案數、未填與已填紀錄摘要、時間排序、篩選與摘要的獨立性、鍵盤分頁、明暗模式及 320／768／1280／1440px 版面。寬螢幕的編輯器另確認捲動後仍可使用儲存工具。截圖寫入 `.tmp/verification/workspace-*.png`，均使用合成個案。

`language.cjs` 另檢查新版首次設定、空白工作區、個案摘要與紀錄標題的英文翻譯及中文標籤。`workspace.cjs` 與其他新增 `.cjs` 一樣，由 `run-ci.cjs` 自動探索，透過 `.githooks/pre-push` 與 GitHub Actions 執行，失敗即阻擋推送。原生作業系統資料夾視窗仍不在自動測試範圍。

2026-11-01 雙語更新驗證：原始碼雙語檢查、語言切換、病歷流程、儲存、工具列、模板及獨立 PDF／ZIP 檢查全數通過。英文版的初始頁面、空白 SOAP 表單、個案對話框、評估與復健設定、數值與選單欄位皆檢查內建文字；儲存後切換語言會更新按鈕及缺席紀錄。另檢查缺少翻譯、單語按鈕、英文單語提示與無障礙名稱、僅有英文的評估時機等反例，確認檢查會失敗。GitHub workflow 的 YAML、觸發條件及指令已在本機檢查。

## 病歷流程驗證

- PASS：開啟頁面說明電腦上的本機病歷資料夾；病歷流程沒有傳送資料的網路請求或未捕捉的 JavaScript 錯誤。網頁字型下載在自動化測試中以空樣式回應，驗證離線備援。
- PASS：新增個案及 SOAP 紀錄，在個案資料夾中寫入一份 CSV、PDF 與 TXT。
- PASS：編輯同一筆紀錄更新原檔案；重新建立儲存介面與重新載入頁面後，可讀回病歷與 COPM。
- PASS：不同個案的資料夾、次數、評估與復健歷程保持分開。
- PASS：CSV 完整還原中文、逗號、引號、換行、空值、零、布林值及巢狀資料；Excel 公式文字經可逆處理。
- PASS：錯誤 CSV 格式、引號及數值均拒絕讀取；匯入失敗保留現有畫面資料。
- PASS：模擬第二份檔案寫入失敗，原 CSV 與 PDF 逐位元還原。
- PASS：個案搜尋、紀錄類型、日期篩選與無結果狀態；錯誤的日期範圍顯示驗證訊息。
- PASS：症狀選擇器會更新圖表；只顯示療程後紀錄時，COPM 仍顯示與先前基準值的變化。
- PASS：自訂訓練、EyeDot 次數、恢復時間、評估計畫編輯及結果表仍可操作與保存。
- PASS：缺席紀錄產生 CSV、PDF 與 TXT；取消刪除保留紀錄，確認刪除移除該筆檔案。
- PASS：舊 JSON 紀錄可載入並另存 CSV、PDF；原始 JSON 保留，重新讀取不會重複計算。
- PASS：第二資料夾可複製個案資料與 CSV、PDF；整體 JSON 備份仍會下載。
- PASS：CSV 匯入按鈕可建立個案與紀錄；無資料夾 API 的瀏覽器模式會下載 ZIP，重新載入後仍有瀏覽器暫存。
- PASS：Escape 關閉對話框；未儲存病歷有放棄修改確認，Escape 保留草稿。
- PASS：360、768、1280px 的亮／暗色版面沒有頁面水平溢出；窄螢幕表格在各自容器內捲動。
- PASS：亮／暗色的主要文字色對比達 4.5:1，輸入框邊界達 3:1；直接以 file:// 開啟 HTML 可執行並使用資料夾 API。
- PASS：獨立 PDF 解析器及渲染器開啟七頁 A4 中文紀錄；ZIP 通過 CRC 檢查，中文資料夾名稱與 CSV 內容正確。

介面保留日式和紙方向的灰白紙色、靛藍重點與細分隔線；依使用者最新要求，標題、按鈕與表單統一使用 Noto Sans TC。個案名單定位個案，SOAP 字母區隔填寫區，開放列表呈現歷程；保留顯示評分變化的語意狀態色。ENERGY 1／RHYTHM 2／MOTION 1。沒有製作圖像或變更原有 COPM、症狀評分與 EyeDot 的臨床記錄規則。

測試以 Chromium 的原生檔案控制代碼，寫入瀏覽器的 OPFS 資料夾；不會開啟或修改使用者的真實病歷。原生作業系統的選擇資料夾對話框與權限提示仍需使用者實際操作。未進行真實病歷內容或臨床適用性驗證。

## 自訂項目與外觀驗證

`templates.cjs` 直接操作 GUI，使用獨立的合成測試個案。Excel 測試由 Playwright 攔截既有 CDN 請求，使用上述暫存元件；核心流程沒有新增連線需求。可用 `XLSX_SCRIPT` 指定另一份相同版本的本機元件路徑。

- PASS：初次跟隨系統深淺色；未連接病歷資料夾也能手動切換，重新載入後保留選擇。
- PASS：中文操作介面、英文症狀欄名；切換外觀保留 SOAP 草稿。
- PASS：從未儲存的病歷新增評估，使用文字、數值、長文字、選單四種類型；驗證單位、數值範圍、停用欄位及原草稿。
- PASS：從內建復健模板新增項目與活動；模擬磁碟寫入失敗，表單與已儲存設定維持完整，可重試。
- PASS：自訂數值 0、選單與多行文字可由磁碟與 CSV 完整讀回。
- PASS：改名、移除欄位與停用後，歷史病歷全文不變；新紀錄使用目前設定。
- PASS：重新載入後保留模板與歷史定義；複製項目取得新的識別碼，停用項目可再次啟用。
- PASS：實際產生並讀取 Excel 活頁簿，驗證自訂評估、復健結果與 SOAP 表單中的名稱及數值 0；JSON 備份包含模板。
- PASS：在全新的瀏覽器儲存區匯入 CSV、還原 JSON，再次載入仍保留模板與結果。
- PASS：新增個案可複用另一個案的項目定義，復健紀錄數量為 0。
- PASS：舊版無定義快照的病歷，修改既有標準模板、停用及重新讀取磁碟後，歷史病歷全文不變。
- PASS：CSV 拒絕錯誤的模板時機、空選單與不安全的項目識別碼。
- PASS：亮暗色、360／768／1280px 的設定頁及編輯對話框無水平溢出；Tab 保留在對話框內，Escape 可關閉；禁止瀏覽器儲存時仍可切換外觀並顯示中文提示。

具體執行結果保存在 `.tmp/verification/browser-results.json` 與 `.tmp/verification/template-results.json`。畫面證據為 `desktop-editor.png`、`mobile-editor.png` 及 `templates-{light,dark}-{360,1280}.png`。

## CSV 總表與本機資料夾驗證

`storage.cjs` 使用原生 OPFS 測試本機資料夾的檔案讀寫。HTML 與病歷存在同一個模擬本機資料夾，未使用真實病歷。

- PASS：使用預設位置時不立即建立資料夾；第一次儲存才呼叫位置選擇並在 HTML 旁建立 `Data/clients.csv`，HTML 檔案不變，重新開啟同一 OPFS 資料夾可讀回個案。
- PASS：`clients.csv` 一位個案一列，保存所有基本資料、手術史、模板及額外欄位；中文、多行、引號、零、布林值與公式樣式文字完整還原。檔案及下載都驗證 UTF-8 BOM。
- PASS：總表匯出按鈕下載 `clients.csv`；匯入總表後可讀回個案。重複個案、不合法資料夾路徑及損壞總表會拒絕，不靜默覆寫。
- PASS：舊版 `client.json` 在儲存時轉入 CSV 總表，原始 JSON 保留；損壞的總表不會被靜默覆寫。
- PASS：在選定的本機資料夾儲存並讀回 SOAP 的 CSV 與 PDF，期間沒有傳送病歷的網路請求。
- PASS：可透過「儲存位置」指定另一個資料夾，讓 HTML 與 `clients.csv` 直接放在同一層；「重新讀取」會載入外部修改後的同一份 CSV。
- PASS：Noto Sans TC 是標題、按鈕及搜尋欄計算樣式的第一個字體；Google Fonts stylesheet URL 與回退字體均已檢查。
- PASS：儲存設定與 Escape、亮暗色 360／768／1360px 均可操作且無水平溢出或未捕捉的瀏覽器錯誤。既有寫入失敗還原與 CSV／PDF 測試仍通過。

執行結果在 `.tmp/verification/storage-results.json`；總表示例為 `.tmp/verification/clients.csv`，畫面為 `washi-storage-light.png`、`washi-roster-light.png`、`washi-roster-dark.png`。測試未執行 Google 字型下載或原生權限視窗；字型來源無法連線時已驗證病歷仍可操作。自動化重新載入 OPFS 時直接取得同一目錄，不測試作業系統控制代碼權限還原。

## 選單與工具列驗證

沿用現有和紙紙色、靛藍、Noto Sans TC 與細分隔線，將基本操作改為桌面應用程式的選單列及工具列。ENERGY 1／RHYTHM 2／MOTION 1。文件、磁碟與匯入匯出圖示分別對應新增、儲存及資料方向；下拉箭頭表示可以展開選單。

`toolbar.cjs` 使用獨立 OPFS 測試資料，結果位於 `.tmp/verification/toolbar-results.json`；亮暗色桌面及手機畫面為 `toolbar-{light,dark}-{1280,360}.png`。

- PASS：標題列沒有操作按鈕；個案及編輯標題只顯示內容與儲存提示，常用操作位於固定工具列。
- PASS：無個案或未編輯時停用相關操作；檔案、個案、檢視與匯出一次只開啟一個選單，點外側、Escape 及 Tab 均可關閉。
- PASS：選單實測上下左右鍵、Home／End、Enter、Escape、Tab；工具列方向鍵略過停用項目，對話框焦點仍正常。
- PASS：從個案選單新增及編輯個案；Ctrl+S 產生 CSV／PDF；從檔案選單儲存失敗後保留草稿、圖示與快捷鍵文字。取消時的放棄確認可用 Escape 保留草稿。
- PASS：⌘S 可重試儲存；儲存期間再次按快捷鍵不會重複寫入。工具列匯入確實開啟檔案選擇器並匯入 CSV，匯出選單下載總表。Ctrl+O 取消開啟資料夾後保留個案。
- PASS：亮暗色各測 320、360、768、1280px，四個選單均在視窗內、無水平溢出，工具列點擊範圍至少 44px，捲動後仍能看見儲存。
- PASS：既有病歷、模板與儲存測試通過，包含 Excel、JSON 備份、CSV 匯入、寫入失敗還原及未儲存提醒；獨立解析器仍可開啟七頁 A4 PDF，ZIP 通過 CRC 檢查。

未測試真實 Windows／macOS 檔案對話框與權限視窗；此處實作的是 HTML 內的應用程式選單與工具列。快捷鍵由瀏覽器鍵盤事件驗證，未使用真實病歷。

## Antislop 交付檢查

採用修改時持續檢視（使用者本次選擇），保留 japanese-style-ppt-skill 的紙色與細線方向，字型依最新指示統一為 Noto Sans TC。ENERGY 1／RHYTHM 2／MOTION 1。以下證據以實際瀏覽器測試、來源檢視及畫面檢視為準；原生權限視窗與真實行動裝置鍵盤未納入自動化驗證。

| 檢查 | 結果與證據 |
| --- | --- |
| R-01 色彩目的 | PASS：#2C3E50 靛藍來自指定和紙風格，用於儲存與選取重點；無漸層或發光背景。 |
| R-02 文案 | PASS：介面、病歷與 SOAP 表單使用具體中文操作文字；症狀欄名維持英文，來源沒有破折號字元。 |
| R-03 響應式 | PASS：亮暗色各測 360、768、1280px；設定頁及對話框均檢查頁面與容器寬度。 |
| R-04 圖示 | PASS：工具列文件、磁碟與匯入匯出圖示表示實際操作；加號表示新增、叉號表示移除，均搭配中文名稱；下拉箭頭表示展開選單。 |
| R-05 內容結構 | PASS：個案、SOAP、追蹤及項目設定皆依病歷工作區分，未新增行銷區塊。 |
| R-06 字體 | PASS：依使用者最新要求，標題與表單皆優先使用 Noto Sans TC，透過字重區分層次，等寬數值便於比較。 |
| R-07 背景 | PASS：純色病歷工作區，沒有裝飾網格。 |
| R-08 箭頭 | PASS：工具列箭頭表示資料匯入匯出及展開選單；追蹤表箭頭表示前後評分，均有實際用途。 |
| R-09 狀態標記 | PASS：「本次應評估」「已停用」均由實際評估時機或項目狀態產生。 |
| R-10 毛玻璃 | PASS：未使用透明模糊面板。 |
| R-11 圓角 | PASS：開放面板與列表無外框圓角；輸入框、按鈕及狀態使用 2px 小圓角，移除膠囊形狀。 |
| R-12 陰影 | PASS：移除編輯列浮動陰影，僅保留選取個案及評分時點的內側狀態線。 |
| R-13 發光 | PASS：來源無發光效果。 |
| R-14 重複卡片 | PASS：項目設定使用列表，重複列是同一種可編輯臨床項目。 |
| R-15 操作名稱 | PASS：「新增評估項目」「新增復健項目」「儲存項目」對應實際 GUI 操作測試。 |
| R-16 行銷措辭 | PASS：新文案只描述填寫、儲存與管理，不含行銷宣稱。 |
| R-17 數字 | PASS：顯示的個案數、紀錄數、症狀及結果均來自現有儲存資料；測試值已標記為測試個案。 |
| R-18 見證 | PASS：未新增評論、人物或客戶見證。 |
| R-19 動態 | PASS：僅保留操作狀態的短轉場，遵守 reduced-motion。 |
| R-20 識別性 | PASS：沿用病歷名單與 SOAP 字母區分、症狀時點及評估時機，服務復健記錄用途。 |
| R-21 主題 | PASS：初次跟隨系統，手動亮暗色切換及重載保存均通過；不依賴已連接的資料夾。 |
| R-22 插圖 | PASS：未新增插圖。 |
| R-23 視覺資產 | PASS：保留文字品牌；新增的儲存位置與總表操作均來自使用者要求，沒有生成視覺資產。 |
| R-24 導覽 | PASS：病歷、進度追蹤、項目設定皆切換至實際內容；測試直接操作三個頁籤。 |
| R-25 對比 | PASS：亮暗色文字色組由測試計算達 4.5:1；輸入框邊界達 3:1。 |
| R-26 可操作性 | PASS：新增、編輯、複製、停用、再次啟用、移除欄位及儲存均有實際點擊測試；儲存設定、選取本機資料夾、重新讀取及總表匯入匯出皆測試。 |
| R-27 狀態 | PASS：空資料、讀取中與寫入失敗均有中文提示；失敗時保留表單並提供重試。 |
| R-28 FAQ | PASS：未新增 FAQ。 |
| R-29 配色 | PASS：紙色、中性色與單一靛藍重點；紅、綠、棕僅保留於病歷狀態與評分比較，皆搭配文字或數值。 |
| R-30 原創性 | PASS：沿用現有復健病歷工具，沒有套用他站版型。 |
| R-31 設計理由 | PASS：紙色與靛藍呼應指定和紙風格；Noto Sans TC 依使用者指示統一中文字型；開放列表便於掃讀歷程；細線與留白區隔名單、病歷及操作。 |
| R-32 鍵盤 | PASS：模板對話框實測 Tab／Shift+Tab 循環與 Escape；選單及工具列實測方向鍵、Home／End、Enter、Escape、Tab，Ctrl+S／⌘S 儲存與 Ctrl+O 開啟；來源保留可見 focus-visible 邊框。 |
| R-33 原始碼 | PASS：所有功能直接修改 HTML 內的來源；沒有外掛來源改寫腳本。 |
| R-34 主題一致性 | PASS：新欄位、對話框及設定頁使用共用 CSS 變數，亮暗色多尺寸畫面已檢視。 |
| R-35 執行證據 | PASS：執行既有與新增的 Playwright 流程；以獨立 PDF 解析器及 ZIP CRC 檢查匯出。 |
| R-36 誠實性 | PASS：沒有新增安全、合規、效能或臨床成效宣稱。 |
| R-37 方向 | PASS：依使用者指定的日式和紙風格；修改介面前已宣告 ENERGY 1／RHYTHM 2／MOTION 1。 |
| R-38 資料 | PASS：不產生看似真實的新病歷；測試僅使用合成且已標記的個案。 |
| Liveliness | PASS：字重與 SOAP 字母建立閱讀層次；儲存位置以目錄說明呈現、名單為窄欄、病歷為開放長表單；靛藍定位主要動作，以細線與留白形成閱讀節奏。 |
| C-1 意圖 | PASS：配色、字體、列表與間距的理由已記錄於 R-31。 |
| C-2 完整性 | PASS：本機資料夾可從選取、儲存、重新讀取到刪除，並驗證錯誤重試；既有模板與匯出流程回歸通過。 |
| C-3 內容 | PASS：新增功能直接服務指定本機資料夾與完整個案 CSV 的要求。 |
| C-4 韌性 | PASS：涵蓋雙主題、多尺寸、鍵盤、儲存失敗、禁用瀏覽器儲存與舊版病歷；真實裝置鍵盤仍需實機確認。 |
| C-5 證據 | PASS：結果由記錄檔、匯出檔與畫面證據支持，不以臆測代替。 |
