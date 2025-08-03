// 區塊鏈技術進階挑戰
export type Level = {
    id: number;
    title: string;
    description: string;
    hint: string;
    inputType: "text" | "select";
    example: string;
    status: "locked" | "unlocked" | "completed";
    answer: string;
    storyBg?: string; // 技術背景
    emotion: string; // 主題色調
    narrator: string; // 技術說明
};

export const levels: Level[] = [
    {
        id: 1,
        title: "雜湊函數特性",
        emotion: "tech-blue",
        narrator: "區塊鏈的核心基礎在於密碼學雜湊函數，它們提供了資料完整性和不可逆性的保證。",
        description: "雜湊函數（Hash Function）是區塊鏈技術的重要基石，它具有四個核心特性：<br /><br />請列出雜湊函數的四個主要特性。答案請用中文回答，每個特性用空格分隔。<br /><br />提示：<br />• 相同輸入總是產生相同輸出，不同輸入幾乎不可能產生相同輸出<br />• 無法從雜湊值推算出原始資料<br />• 輸入的微小改變會導致輸出完全不同<br />• 無論輸入資料大小，輸出長度始終相同<br /><br />答案順序不限，只要包含這四個特性即可通關。",
        hint: "思考上課說到雜湊函數的四個核心特性。用中文回答，空格分隔。三個字的兩個 6個字的兩個 共四個特性",
        inputType: "text",
        example: "通人性 伸縮自如 我可以逆 長度很長",
        status: "unlocked",
        answer: "唯一性|不可逆|小變化大差異|固定輸出長度",
        storyBg: "# 雜湊函數是區塊鏈資料完整性的基石",
    },
    {
        id: 2,
        title: "工作量證明機制",
        emotion: "mining-orange",
        narrator: "比特幣的工作量證明（Proof of Work）是維護網路安全的關鍵機制，需要大量計算資源來產生有效區塊。",
        description: "在比特幣挖礦中，礦工需要找到一個 nonce 值，使得區塊標頭的 SHA-256 雜湊值符合難度目標。<br />假設當前難度要求雜湊值最後4位必須為0222，現在有以下區塊資料：<br />• 前一區塊雜湊：000abc123def<br />• 交易資料雜湊：xyz789uvw<br />• 時間戳：1609459200<br />• nonce：需要找出<br />將這些資料按順序串接並計算 SHA-256，找出使結果後4位為0222的最小 nonce 值(1000-2000）。<br />串接格式：{前一區塊雜湊}{交易資料雜湊}{時間戳}{nonce}",
        hint: "將資料按格式串接：000abc123defxyz7891609459200{nonce}，計算SHA-256直到前4位為0222。從nonce=1000開始嘗試。",
        inputType: "text",
        example: "1903(nonce值)",
        status: "locked",
        answer: "1314",
        storyBg: "⛏️ 挖礦是維護區塊鏈安全的計算競賽",
    },
    {
        id: 3,
        title: "Merkle 樹結構",
        emotion: "tree-green",
        narrator: "Merkle 樹是區塊鏈中用於高效驗證大量交易的重要資料結構，它利用雜湊樹的特性提供快速且安全的資料驗證。",
        description: "給定4筆交易的雜湊值，請計算其 Merkle Root：<br />• 交易1：a1b2c3d4e5f6<br />• 交易2：1a2b3c4d5e6f<br />• 交易3：f6e5d4c3b2a1<br />• 交易4：6f5e4d3c2b1a<br /><br />Merkle 樹構建規則：<br />1. 將相鄰交易雜湊值串接後計算 SHA-256<br />2. Hash(交易1+交易2) = 第一層左節點<br />3. Hash(交易3+交易4) = 第一層右節點<br />4. Hash(左節點+右節點) = Merkle Root<br /><br />請計算最終的 Merkle Root 並取前12位字元。",
        hint: "很簡單了，這是假的。",
        inputType: "text",
        example: "abc123def456",
        status: "locked",
        answer: "fef2f3adf2b8",
        storyBg: "🌳 Merkle 樹提供了高效的資料完整性驗證",
    },
    {
        id: 4,
        title: "區塊鏈分叉機制",
        emotion: "fork-purple",
        narrator: "區塊鏈分叉是協議升級和網路演進的重要機制，理解不同類型分叉的特性對於掌握區塊鏈技術至關重要。",
        description: "區塊鏈分叉依據其性質可分為三種類型：<br /><br /><b>軟分叉（Soft Fork）：</b><br />• 向後相容的協議升級<br />• 收緊或增加新規則<br />• 舊節點仍可驗證新區塊<br />• 範例：比特幣的 SegWit 升級<br /><br /><b>硬分叉（Hard Fork）：</b><br />• 不向後相容的協議變更<br />• 放寬規則或根本性改變<br />• 舊節點無法驗證新區塊<br />• 範例：以太坊的 DAO 分叉<br /><br /><b>暫時性分叉（Temporary Fork）：</b><br />• 網路中同時出現多個有效區塊<br />• 通常由網路延遲或同時出塊造成<br />• 透過最長鏈原則自動解決<br /><br />問題：軟分叉和硬分叉主要是透過什麼來區分？",
        hint: "三個字",
        inputType: "text",
        example: "?",
        status: "locked",
        answer: "相容性",
        storyBg: "🔀 分叉是區塊鏈協議演進的核心機制",
    },
    {
        id: 5,
        title: "區塊鏈網路博弈論分析",
        emotion: "consensus-cyan",
        narrator: "區塊鏈的共識機制本質上是一個複雜的博弈論問題，需要透過邏輯推理來分析參與者的策略選擇。",
        description: "某區塊鏈網路有100個驗證者，每個驗證者都是理性的經濟人，會選擇對自己最有利的策略。網路規則如下：<br /><br /><b>基本規則：</b><br />• 每輪需要至少51個驗證者同意才能產生新區塊<br />• 參與驗證的驗證者平分區塊獎勵100個代幣<br />• 不參與驗證不會獲得獎勵，但也不會有任何成本<br />• 參與驗證需要消耗1個代幣的成本（電力、硬體等）<br /><br /><b>收益計算：</b><br />如果有N個人參與驗證：<br />• 每人獲得 100/N 個代幣獎勵<br />• 扣除1個代幣成本後，淨收益 = 100/N - 1<br />• 只有當淨收益 > 0 時，理性人才會參與<br /><br /><b>邏輯推理：</b><br />• 當 100/N - 1 > 0 時，即 N < 100，理性人會參與<br />• 當 100/N - 1 ≤ 0 時，即 N ≥ 100，理性人不會參與<br />• 但至少需要51人才能產生區塊<br /><br /><b>關鍵問題：</b><br />考慮到必須至少51人參與才能出塊，理性的驗證者在什麼情況下會選擇參與？根據邏輯推理，最終會有多少人參與驗證？<br /><br />網路狀態代碼規則：<br />• 如果參與人數≥80：狀態為\"HIGH\"<br />• 如果參與人數在52-79：狀態為\"MID\"  <br />• 如果參與人數=51：狀態為\"MIN\"<br />• 如果參與人數<51：狀態為\"FAIL\"<br /><br />請以\"狀態代碼+參與人數\"的格式回答。",
        hint: "只要你可以賺到錢...",
        inputType: "text",
        example: "MID67",
        status: "locked",
        answer: "HIGH99",
        storyBg: "博弈論是理解區塊鏈激勵機制的關鍵",
    },
    {
        id: 6,
        title: "區塊鏈時空悖論推理",
        emotion: "security-red",
        narrator: "區塊鏈的時間戳機制看似簡單，但在複雜網路環境下會產生有趣的邏輯悖論，需要深度推理來解決。",
        description: "某區塊鏈網路分布在三個時區，每個時區有不同的出塊節點。網路規則要求區塊時間戳必須嚴格遞增，但網路延遲造成了時間順序的混亂：<br /><br /><b>時區分布：</b><br />• 東京時區：領先UTC +9小時，節點代號T1-T3<br />• 倫敦時區：UTC +0小時，節點代號L1-L4<br />• 紐約時區：滯後UTC -5小時，節點代號N1-N3<br /><br /><b>出塊順序和網路延遲：</b><br />某天發生以下事件（均為當地時間）：<br />• 09:00 東京節點T1產生區塊1<br />• 09:15 東京節點T2收到區塊1，立即產生區塊2<br />• 02:00 倫敦節點L1收到區塊1（延遲2小時），產生區塊3<br />• 02:10 倫敦節點L2收到區塊2，產生區塊4<br />• 22:30 紐約節點N1收到區塊3（延遲30分鐘），產生區塊5<br /><br /><b>衝突情況：</b><br />由於網路延遲和時區差異，節點們對「正確的區塊鏈」產生了不同的理解。<br /><br /><b>關鍵問題：</b><br />如果所有節點最終同步並採用「最長鏈原則」，最終被接受的主鏈包含哪些區塊？<br /><br />請以\"CHAIN+區塊數量+最後一個區塊的產生節點代號\"格式回答。",
        hint: "將所有時間轉換為UTC，分析每個區塊的實際產生時間和依賴關係。",
        inputType: "text",
        example: "CHAIN4L2",
        status: "locked",
        answer: "CHAIN3N1",
        storyBg: "⏰ 時間和共識的哲學思辨",
    },
    {
        id: 7,
        title: "區塊鏈遞歸治理悖論",
        emotion: "trilemma-gold",
        narrator: "區塊鏈的去中心化治理看似民主，但深入分析會發現權力分配的遞歸悖論，需要多層次的邏輯思維來解析。",
        description: "某DAO使用代幣投票進行治理決策，但治理機制本身也可以被投票修改，形成了有趣的遞歸結構：<br /><br /><b>初始設定：</b><br />• 總代幣供應量：1000萬枚<br />• 大戶Alice持有：30%（代號A30）<br />• 大戶Bob持有：25%（代號B25）<br />• 其餘1000個小戶平均持有：45%（代號S45）<br />• 投票通過需要：超過50%支持<br /><br /><b>治理層級：</b><br />第1層：普通提案（修改協議參數）<br />第2層：治理提案（修改投票規則）<br />第3層：憲法提案（修改治理結構）<br /><br /><b>複雜情境：</b><br />Alice提出提案A：「將投票門檻改為需要66%支持，但大戶（持有>20%）的投票權重減半」<br /><br />Bob提出提案B：「將投票門檻改為需要40%支持，但每個地址最多只能投總量的10%」<br /><br />小戶們分化為：<br />• 30%支持Alice（15%代幣，代號SA15）<br />• 20%支持Bob（9%代幣，代號SB9）<br />• 50%棄權（21%代幣，代號SX21）<br /><br /><b>關鍵問題：</b><br />在當前50%門檻下，兩個提案的投票結果是什麼？<br /><br />請以\"VOTE+提案結果+決定性投票群體代號\"格式回答。提案結果：PASS（通過）、FAIL（失敗）、NONE（都不通過）。",
        hint: "決定性群體是那些讓所有提案都無法通過的群體。",
        inputType: "text",
        example: "VOTEPASSSA15",
        status: "locked",
        answer: "VOTENONESX21",
        storyBg: "去中心化治理的哲學思辨",
    },
];
