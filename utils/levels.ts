// 區塊鏈闖關任務題目資料
export type Level = {
  id: number;
  title: string;
  description: string;
  hint: string;
  inputType: 'text' | 'select';
  example: string;
  status: 'locked' | 'unlocked' | 'completed';
  answer: number | string;
};

export const levels: Level[] = [
  {
    id: 1,
    title: '啟動序列｜SHA-256 起始碼',
    description: '請使用 sha256("約法二章")，並取其結果的第 12 個十六進位字元（從0開始算）。請輸出該字元的大寫形式。',
    hint: '可用 CyberChef 或 sha256 online 工具。',
    inputType: 'text',
    example: 'E',
    status: 'unlocked',
    answer: '98a450efc183e',
  },
  {
    id: 2,
    title: '共識密語｜結合與散列',
    description: '將上題結果與 "hello" 字串用 - 連接，形成新字串，如：E-hello，請取其 sha256 後的前 4 碼（十六進位字串）。',
    hint: '類似形成共識前導碼或驗證碼。',
    inputType: 'text',
    example: '9fbc',
    status: 'locked',
    answer: 'd8c2',
  },
  {
    id: 3,
    title: '工作量證明｜Hash 開頭為雙 0',
    description: '請暴力嘗試找出一個「英文單字」（4～6個字母），將其與上題 hash 結果拼接（不加符號），例如：9fbcstone，並找出一組組合，使其 sha256 結果開頭為 00。',
    hint: '可用 Python、JS brute force。',
    inputType: 'text',
    example: 'stone',
    status: 'locked',
    answer: 'stone',
  },
  {
    id: 4,
    title: '權益權能｜PoS 計票轉換',
    description: '將你上題找到的單字，依照 A=1, B=2, ..., Z=26（不區分大小寫）換算「權益點數」，加總後轉為二進位。',
    hint: '建構 PoS 權益值並轉成驗證 seed。',
    inputType: 'text',
    example: '1001001',
    status: 'locked',
    answer: '1001001',
  },
  {
    id: 5,
    title: 'Merkle Root 尋寶（中高難度）',
    description: '你收到四筆交易（tx）hash：a1b2, c3d4, e5f6, 7890。請用 Merkle Tree 計算，最終 root 的前 6 碼。',
    hint: '建議提供簡化工具或直接給出 sha256(x) 計算器。',
    inputType: 'text',
    example: 'a94d32',
    status: 'locked',
    answer: 'a94d32',
  },
  {
    id: 6,
    title: '拜占庭將軍的決斷（高難度邏輯題）',
    description: '你與另外 5 位節點收到回報：A：YES、B：YES、C：NO、D：YES、E：YES。最多有 1 位節點說謊，你是指揮官，該下什麼命令？並簡述理由。',
    hint: '此題不計算 hash，但強化區塊鏈共識理解。',
    inputType: 'text',
    example: 'YES - 多數回報一致',
    status: 'locked',
    answer: 'YES - 多數回報一致',
  },
  {
    id: 7,
    title: '通關密碼｜區塊鏈驗證碼生成',
    description: '將關卡1結果、關卡3英文單字、關卡5 Merkle root 前6碼合併（用-），再取 sha256 的最後6碼，即為最終驗證碼。',
    hint: '三資料合併後取 sha256 最後6碼。',
    inputType: 'text',
    example: '52d129',
    status: 'locked',
    answer: '26d11b',
  },
];
