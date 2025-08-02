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
        hint: "思考雜湊函數的四個核心特性：獨特性、不可逆轉性、敏感性、固定性。用中文回答，空格分隔。",
        inputType: "text",
        example: "通人性 伸縮自如 我可以逆 長度很長",
        status: "unlocked",
        answer: "唯一性|不可逆|小變化大差異|長度固定",
        storyBg: "# 雜湊函數是區塊鏈資料完整性的基石",
    },
    {
        id: 2,
        title: "工作量證明機制",
        emotion: "mining-orange",
        narrator: "比特幣的工作量證明（Proof of Work）是維護網路安全的關鍵機制，需要大量計算資源來產生有效區塊。",
        description: "在比特幣挖礦中，礦工需要找到一個 nonce 值，使得區塊標頭的 SHA-256 雜湊值符合難度目標。<br />假設當前難度要求雜湊值前4位必須為0000，現在有以下區塊資料：<br />• 前一區塊雜湊：000abc123def<br />• 交易資料雜湊：xyz789uvw<br />• 時間戳：1609459200<br />• nonce：需要找出<br />將這些資料按順序串接並計算 SHA-256，找出使結果前4位為0000的最小 nonce 值（0-9999範圍）。<br />串接格式：{前一區塊雜湊}{交易資料雜湊}{時間戳}{nonce}",
        hint: "將資料按格式串接：000abc123defxyz7891609459200{nonce}，計算SHA-256直到前4位為0000。從nonce=0開始嘗試。",
        inputType: "text",
        example: "0034(nonce值)",
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
        hint: "先計算 SHA-256(a1b2c3d4e5f61a2b3c4d5e6f) 和 SHA-256(f6e5d4c3b2a16f5e4d3c2b1a)，再將兩結果串接計算最終雜湊。",
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
        hint: "思考軟分叉和硬分叉的根本差異在於對舊版本節點的相容性。關鍵詞是「相容性」的概念。",
        inputType: "text",
        example: "?",
        status: "locked",
        answer: "相容性",
        storyBg: "🔀 分叉是區塊鏈協議演進的核心機制",
    },
    {
        id: 5,
        title: "共識機制深度分析",
        emotion: "consensus-cyan",
        narrator: "區塊鏈的共識機制決定了網路如何達成一致性，深入理解各種機制的特性對於區塊鏈技術應用至關重要。",
        description: "共識機制是區塊鏈網路中所有節點就網路狀態達成一致的協議。除了常見的 PoW、PoS、DPoS 外，還有許多其他創新機制：<br /><br /><b>實用拜占庭容錯（PBFT）：</b><br />• 適用於許可鏈環境<br />• 可容忍 1/3 的惡意節點<br />• 交易確認快速且最終性強<br /><br /><b>權威證明（Proof of Authority, PoA）：</b><br />• 基於身份驗證的共識<br />• 由預先批准的權威節點驗證<br />• 高效但去中心化程度較低<br /><br /><b>燃燒證明（Proof of Burn, PoB）：</b><br />• 礦工銷毀代幣來獲得挖礦權<br />• 節能且防止集中化<br />• 創新的經濟激勵模型<br /><br />問題：在拜占庭將軍問題中，PBFT 共識機制最多能容忍多少比例的惡意節點？請用分數表示。",
        hint: "拜占庭容錯的經典理論表明，要在 n 個節點中達成共識，最多只能容忍特定比例的惡意節點。",
        inputType: "text",
        example: "1/4",
        status: "locked",
        answer: "1/3",
        storyBg: "🤝 共識機制是分散式系統的核心挑戰",
    },
    {
        id: 6,
        title: "51% 攻擊臨界點分析",
        emotion: "security-red",
        narrator: "理解51%攻擊的臨界條件有助於評估不同區塊鏈網路的安全性，這需要深入的邏輯推理。",
        description: "某小型區塊鏈網路目前有以下礦池分布：<br /><br /><b>當前算力分布：</b><br />• 礦池 Alpha：28%<br />• 礦池 Beta：23%<br />• 礦池 Gamma：19%<br />• 礦池 Delta：15%<br />• 散戶礦工：15%<br /><br /><b>潛在威脅情境分析：</b><br /><br />現在考慮一個攻擊者想要獲得51%控制權。假設攻擊者可以：<br />1. 收購現有礦池的控制權<br />2. 與其他礦池達成秘密聯盟<br />3. 部署自己的挖礦設備<br /><br /><b>限制條件：</b><br />• 收購礦池需要該礦池同意（可能被拒絕）<br />• 聯盟可能不穩定，隨時背叛<br />• 部署新設備需要6個月時間<br />• 散戶礦工無法被收購或聯盟<br /><br /><b>關鍵問題：</b><br />在這種情況下，攻擊者要達成51%控制最少需要控制幾個現有礦池？<br /><br />請分析各種組合的可行性，給出最少需要控制的礦池數量。",
        hint: "計算各種礦池組合的算力總和，找出超過51%的最小組合。記住散戶無法控制，需要至少51%才能攻擊。",
        inputType: "text",
        example: "3",
        status: "locked",
        answer: "2",
        storyBg: "⚡ 算力集中度是區塊鏈安全的關鍵指標",
    },
    {
        id: 7,
        title: "Layer 2 擴容方案",
        emotion: "layer2-gold",
        narrator: "Layer 2 解決方案是解決區塊鏈可擴展性問題的重要技術，它們在不犧牲安全性的前提下大幅提升交易效能。",
        description: "Layer 2 擴容技術有多種實現方式，各有其技術特點：<br /><br /><b>狀態通道（State Channels）：</b><br />• 參與者在鏈下進行多次交易<br />• 只需在開啟和關閉時上鏈<br />• 代表：Lightning Network<br /><br /><b>側鏈（Sidechains）：</b><br />• 獨立的區塊鏈與主鏈並行運行<br />• 透過跨鏈橋進行資產轉移<br />• 代表：Polygon、Optimism<br /><br /><b>Rollups：</b><br />• 將多筆交易打包後提交主鏈<br />• 分為 Optimistic Rollups 和 ZK-Rollups<br />• 代表：Arbitrum、zkSync<br /><br />問題：在 Layer 2 方案中，哪種技術最適合需要即時小額支付的應用場景？",
        hint: "考慮哪種方案能夠實現接近即時的交易確認，且適合頻繁的小額交易。",
        inputType: "text",
        example: "狀態通道",
        status: "locked",
        answer: "狀態通道",
        storyBg: "🚀 Layer 2 是區塊鏈大規模應用的關鍵",
    },
];
