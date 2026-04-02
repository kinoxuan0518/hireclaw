# HireCoder 鍔熻兘瀹炵幇鏂囨。

HireClaw 鐜板凡瀹炵幇 HireCoder 鐨勬墍鏈夋牳蹇冨姛鑳斤紝骞跺鍔犱簡鎷涜仒棰嗗煙鐨勪笓涓氳兘鍔涖€?

---

## 鍔熻兘瀵规瘮鎬昏

| 鍔熻兘鍒嗙被 | HireCoder | HireClaw | 鐘舵€?|
|---------|-------------|----------|------|
| **鍩虹鑳藉姏** |||
| 瀵硅瘽妯″紡 | 鉁?| 鉁?| 瀹屽叏瀹炵幇 |
| 宸ュ叿璋冪敤 | 鉁?| 鉁?| 30+ 宸ュ叿 |
| 鏂囦欢璇诲啓 | 鉁?| 鉁?| 瀹屽叏瀹炵幇 |
| **鎼滅储涓庡鑸?* |||
| Glob 鏂囦欢鎼滅储 | 鉁?| 鉁?| 瀹屽叏瀹炵幇 |
| Grep 鍐呭鎼滅储 | 鉁?| 鉁?| 浼樺厛 ripgrep |
| **璁″垝涓庝换鍔?* |||
| Plan Mode | 鉁?| 鉁?| AI 绛栫暐鍒嗘瀽 |
| Task Management | 鉁?| 鉁?| 灞傜骇浠诲姟 |
| **璁板繂绯荤粺** |||
| Auto Memory | 鉁?| 鉁?| 璺ㄤ細璇濆涔?|
| 瀵硅瘽鍘嗗彶 | 鉁?| 鉁?| 鑷姩淇濆瓨 |
| **浜や簰鏂瑰紡** |||
| AskUserQuestion | 鉁?| 鉁?| 缁撴瀯鍖栭棶绛?|
| Skill System | 鉁?| 鉁?| /鎶€鑳藉悕璋冪敤 |
| **鏂囦欢澶勭悊** |||
| PDF Reading | 鉁?| 鉁?| 绠€鍘嗗垎鏋?|
| Image Analysis | 鉁?| 鉁?| Vision 妯″瀷 |
| Notebook Edit | 鉁?| 鉂?| 鎷涜仒鐢ㄤ笉涓?|
| **鐗堟湰鎺у埗** |||
| Git Status | 鉁?| 鉁?| 瀹屽叏瀹炵幇 |
| Git Commit | 鉁?| 鉁?| 鏅鸿兘鎻愪氦 |
| Git Branch | 鉁?| 鉁?| 鍒嗘敮绠＄悊 |
| Git Push | 鉁?| 鉁?| 杩滅▼鎺ㄩ€?|
| Create PR | 鉁?| 鉁?| GitHub PR |
| **闆嗘垚鑳藉姏** |||
| MCP Protocol | 鉁?| 鉁?| 澶氭湇鍔￠泦鎴?|
| Web Search | 鉁?| 鉁?| 澶氬紩鎿庢敮鎸?|
| **閿欒澶勭悊** |||
| Error Recovery | 鉁?| 鉁?| 鏅鸿兘閲嶈瘯 |
| Checkpoints | 鉁?| 鉁?| 鏂偣缁紶 |
| **绯荤粺鍔熻兘** |||
| Permission System | 鉁?| 鈴?| 璁″垝涓?|
| Hook System | 鉁?| 鈴?| 璁″垝涓?|
| Remote Sessions | 鉁?| 鈴?| 璁″垝涓?|
| Context Compression | 鉁?| 鈴?| 璁″垝涓?|
| **HireClaw 鐙湁** |||
| 娴忚鍣ㄨ嚜鍔ㄥ寲 | 鉂?| 鉁?| Playwright |
| 澶氳处鍙峰苟琛?| 鉂?| 鉁?| 鏁堢巼缈诲€?|
| 鎷涜仒鐭ヨ瘑搴?| 鉂?| 鉁?| 涓撲笟棰嗗煙 |
| 鍊欓€変汉绠＄悊 | 鉂?| 鉁?| 鐘舵€佽拷韪?|
| 瀹炴椂鎺у埗鍙?| 鉂?| 鉁?| Web Dashboard |
| 涓诲姩鎻愰啋 | 鉂?| 鉁?| macOS 閫氱煡 |

---

## 璇︾粏鍔熻兘璇存槑

### 1. Auto Memory锛堣嚜鍔ㄨ蹇嗙郴缁燂級猸愨瓙猸?

**瀹炵幇鏂囦欢**锛歚src/auto-memory.ts`

**鍔熻兘**锛?
- 璺ㄤ細璇濇寔涔呭寲瀛︿範
- 鑷姩璁板綍鐢ㄦ埛鍋忓ソ銆佹嫑鑱樼粡楠屻€佹垚鍔熸ā寮?
- `MEMORY.md` 娉ㄥ叆绯荤粺鎻愮ず锛堟渶澶?200 琛岋級
- 涓婚鏂囦欢鍒嗙被瀛樺偍璇︾粏绗旇

**鏂囦欢缁撴瀯**锛?
```
workspace/memory/
鈹溾攢鈹€ MEMORY.md                    # 涓昏蹇嗘枃浠讹紙鑷姩娉ㄥ叆锛?
鈹溾攢鈹€ recruiting-patterns.md       # 鎷涜仒妯″紡
鈹溾攢鈹€ candidate-preferences.md     # 鍊欓€変汉鍋忓ソ
鈹溾攢鈹€ debugging.md                 # 璋冭瘯缁忛獙
鈹斺攢鈹€ workflow.md                  # 宸ヤ綔娴佸亸濂?
```

**瀵硅瘽宸ュ叿**锛?
- `remember` - 淇濆瓨璁板繂
- `forget` - 鍒犻櫎璁板繂
- `recall_memory` - 鏌ョ湅璁板繂
- `search_past_context` - 鎼滅储鍘嗗彶瀵硅瘽

**浣跨敤绀轰緥**锛?
```
浣? 璁颁綇锛氳繖涓叕鍙哥殑鍊欓€変汉閫氬父鎶€鏈爤鏄?React + Node.js

AI: [璋冪敤 remember]
    宸茶浣忥紙涓婚: candidate-preferences锛夛細
    杩欎釜鍏徃鐨勫€欓€変汉閫氬父鎶€鏈爤鏄?React + Node.js

浣? 鍥炲繂涓€涓嬫垜涔嬪墠鐨勫亸濂?

AI: [璋冪敤 recall_memory]
    # 褰撳墠璁板繂

    ## MEMORY.md
    [鏄剧ず鎵€鏈夎法浼氳瘽璁板繂]
```

---

### 2. AskUserQuestion锛堢粨鏋勫寲闂瓟锛夆瓙猸?

**瀹炵幇鏂囦欢**锛歚src/ask-user.ts`

**鍔熻兘**锛?
- 缁撴瀯鍖栧閫?鍗曢€夐棶棰橈紙2-4 涓€夐」锛?
- 姣忎釜閫夐」甯﹁缁嗘弿杩?
- 鑷姩娣诲姞"鍏朵粬"閫夐」
- 鍙嬪ソ鐨勫懡浠よ鐣岄潰

**瀵硅瘽宸ュ叿**锛歚ask_user_question`

**浣跨敤绀轰緥**锛?
```
浣? 甯垜鎵惧墠绔伐绋嬪笀鍊欓€変汉

AI: 鎴戦渶瑕佷簡瑙ｄ竴浜涚粏鑺?
    [璋冪敤 ask_user_question]

鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣
闂 1/1
鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣

浼樺厛鐪嬮噸鍝柟闈紵
[鎶€鏈爤]

1. 澶у巶鑳屾櫙
   BAT銆佸瓧鑺傜瓑澶у巶缁忛獙锛屽熀纭€鎵庡疄

2. 鍒涗笟缁忓巻
   鍒涗笟鍏徃缁忛獙锛岄€傚簲蹇€熻凯浠?

3. 鎶€鏈繁搴?
   寮€婧愯础鐚€佹妧鏈崥瀹€丟itHub

4. 鍏朵粬
   鑷畾涔夎緭鍏?

璇烽€夋嫨 (1-4): _
```

---

### 3. PDF Reading锛圥DF 闃呰锛夆瓙猸?

**瀹炵幇鏂囦欢**锛歚src/pdf-reader.ts`

**鍔熻兘**锛?
- 璇诲彇 PDF 鏂囦欢骞舵彁鍙栨枃鏈?
- 鏀寔椤电爜鑼冨洿锛堝 "1-5", "10-20"锛?
- 澶ф枃浠朵繚鎶わ紙>10 椤靛繀椤绘寚瀹氳寖鍥达紝鏈€澶?20 椤碉級

**瀵硅瘽宸ュ叿**锛歚read_pdf`

**浣跨敤绀轰緥**锛?
```
浣? 璇诲彇杩欎唤绠€鍘?/path/to/寮犱笁_绠€鍘?pdf 鐨勫墠 3 椤?

AI: [璋冪敤 read_pdf]
    # PDF 鏂囦欢: 寮犱笁_绠€鍘?pdf

    **椤垫暟**: 5
    **璇诲彇鑼冨洿**: 绗?1-3 椤碉紙鍏?5 椤碉級

    ---

    濮撳悕锛氬紶涓?
    鑱旂郴鏂瑰紡锛?3800138000
    閭锛歾hangsan@example.com

    宸ヤ綔缁忛獙锛?
    2019-2024 瀛楄妭璺冲姩 - 鍓嶇宸ョ▼甯?
    - 璐熻矗浠婃棩澶存潯 Web 绔紑鍙?
    - 鎶€鏈爤锛歊eact, TypeScript, Webpack
    ...
```

---

### 4. Skill System锛堟妧鑳界郴缁燂級猸愨瓙

**瀹炵幇鏂囦欢**锛歚src/skill-system.ts`

**鍔熻兘**锛?
- 蹇嵎鍛戒护璋冪敤锛堝 `/鎵惧€欓€変汉`锛?
- 鎶€鑳藉畾涔夋枃浠讹紙Markdown 鏍煎紡锛?
- 鍙傛暟浼犻€掓敮鎸?
- 鑷姩鍒濆鍖栭粯璁ゆ妧鑳?

**榛樿鎶€鑳?*锛?
- `/鎵惧€欓€変汉` - 鑷姩 sourcing
- `/鍒嗘瀽绠€鍘哷 - PDF 绠€鍘嗗垎鏋?
- `/鍊欓€変汉婕忔枟` - 鏌ョ湅鎷涜仒鏁版嵁
- `/commit` - Git 鎻愪氦

**鎶€鑳藉畾涔夌ず渚?*锛?
```markdown
# 鎵惧€欓€変汉

> 鑷姩鎵ц sourcing 浠诲姟锛屽湪鍚勪釜鎷涜仒娓犻亾瀵绘壘鍊欓€変汉

## 鍙傛暟

- 鑱屼綅鍚嶇О锛堝彲閫夛級锛氬"鍓嶇宸ョ▼甯?銆?浜у搧缁忕悊"

## 鎵ц娴佺▼

1. 璇诲彇鑱屼綅閰嶇疆
2. 纭畾瑕佹悳绱㈢殑娓犻亾
3. 璋冪敤 run_sourcing 宸ュ叿鎵ц
4. 杩斿洖鎵惧埌鐨勫€欓€変汉鏁伴噺
```

**浣跨敤绀轰緥**锛?
```
浣? /鎵惧€欓€変汉 鍓嶇宸ョ▼甯?

AI: [鎵ц鎶€鑳? /鎵惧€欓€変汉]
    寮€濮嬩负銆屽墠绔伐绋嬪笀銆嶈亴浣嶅鎵惧€欓€変汉...

    [璋冪敤 run_sourcing 宸ュ叿]

    鉁?瀹屾垚锛?
    - BOSS鐩磋仒锛氭壘鍒?15 浜?
    - 鑴夎剦锛氭壘鍒?8 浜?
```

---

### 5. Git Automation锛圙it 鑷姩鍖栵級猸愨瓙

**瀹炵幇鏂囦欢**锛歚src/git-helper.ts`

**鍔熻兘**锛?
- 鏌ョ湅 Git 鐘舵€?
- 鎻愪氦浠ｇ爜锛堟敮鎸佹寚瀹氭枃浠讹級
- 鍒涘缓/鍒囨崲鍒嗘敮
- 鎺ㄩ€佸埌杩滅▼锛堝惈寮哄埗鎺ㄩ€侊級
- 鍒涘缓 GitHub PR锛堥渶 gh CLI锛?

**瀵硅瘽宸ュ叿**锛?
- `git_status` - 鏌ョ湅鐘舵€?
- `git_commit` - 鎻愪氦浠ｇ爜
- `git_create_branch` - 鍒涘缓鍒嗘敮
- `git_push` - 鎺ㄩ€佽繙绋?
- `git_create_pr` - 鍒涘缓 PR

**浣跨敤绀轰緥**锛?
```
浣? 鏌ョ湅 git 鐘舵€?

AI: [璋冪敤 git_status]
    褰撳墠鍒嗘敮锛歮ain

    宸蹭慨鏀?(2):
      M src/chat.ts
      M README.md

    鏈窡韪?(1):
      ? src/auto-memory.ts

浣? 鎻愪氦鎵€鏈夋敼鍔紝娑堟伅"feat: add auto memory system"

AI: [璋冪敤 git_commit]
    鎻愪氦鎴愬姛锛?
    SHA: a1b2c3d4
    鍒嗘敮: main
    鎻愪氦淇℃伅: feat: add auto memory system

浣? 鍒涘缓 PR锛屾爣棰?Add auto memory"

AI: [璋冪敤 git_create_pr]
    PR 鍒涘缓鎴愬姛锛?
    鍒嗘敮: main -> main
    URL: https://github.com/user/hireclaw/pull/123
```

---

### 6. Plan Mode锛堣鍒掓ā寮忥級猸?

**瀹炵幇鏂囦欢**锛歚src/planner.ts`

**鍔熻兘**锛?
- AI 鍒嗘瀽鍘嗗彶鏁版嵁鍜岃亴浣嶉渶姹?
- 鐢熸垚缁撴瀯鍖栨墽琛岃鍒掞紙JSON锛?
- 鐢ㄦ埛纭鍚庢墽琛?
- 棰勪及鎵ц鏃堕棿鍜岃祫婧?

**浣跨敤鏂瑰紡**锛?
```bash
hireclaw run --plan
```

**鎵ц娴佺▼**锛?
1. 鍒嗘瀽鍘嗗彶 sourcing 鏁版嵁
2. 璇勪及鍚勬笭閬撴晥鏋?
3. 鐢熸垚浠婃棩鎵ц璁″垝
4. 鐢ㄦ埛纭
5. 鎵ц浠诲姟

---

### 7. Search Tools锛堟悳绱㈠伐鍏凤級猸?

**瀹炵幇鏂囦欢**锛?
- `src/tools/glob.ts` - 鏂囦欢鎼滅储
- `src/tools/grep.ts` - 鍐呭鎼滅储

**鍔熻兘**锛?
- **Glob**锛氭ā寮忓尮閰嶆枃浠讹紙濡?`**/*.ts`锛?
- **Grep**锛氭鍒欒〃杈惧紡鍐呭鎼滅储锛堜紭鍏?ripgrep锛?
- 鑷姩蹇界暐 node_modules銆?git 绛?
- 鏀寔涓婁笅鏂囪銆佽鏁版ā寮?

**瀵硅瘽宸ュ叿**锛?
- `glob` - 鏂囦欢鎼滅储
- `grep` - 鍐呭鎼滅储

**浣跨敤绀轰緥**锛?
```
浣? 鎼滅储鎵€鏈?TypeScript 鏂囦欢

AI: [璋冪敤 glob]
    鎵惧埌 34 涓枃浠讹細
    - src/chat.ts
    - src/config.ts
    ...

浣? 鍦?src 鐩綍鎼滅储鍖呭惈 "memory" 鐨勪唬鐮?

AI: [璋冪敤 grep]
    src/auto-memory.ts:10: export function loadMemory()
    src/chat.ts:156:   const { getMemoryContext } = require('./auto-memory');
    ...
```

---

### 8. Task Management锛堜换鍔＄鐞嗭級猸?

**瀹炵幇鏂囦欢**锛歚src/tasks.ts`

**鍔熻兘**锛?
- 5 绉嶇姸鎬侊細pending, in_progress, blocked, completed, cancelled
- 灞傜骇浠诲姟缁撴瀯锛堢埗瀛愬叧绯伙級
- 浼樺厛绾х郴缁?
- 鍙鍖栫湅鏉?

**瀵硅瘽宸ュ叿**锛?
- `create_task` - 鍒涘缓浠诲姟
- `update_task` - 鏇存柊浠诲姟
- `list_tasks` - 鍒楀嚭浠诲姟

**浣跨敤绀轰緥**锛?
```
浣? 鍒涘缓涓€涓换鍔★細浼樺寲 BOSS鐩磋仒鐨勮Е杈捐瘽鏈?

AI: [璋冪敤 create_task]
    浠诲姟宸插垱寤猴紒
    ID: 7
    鏍囬: 浼樺寲 BOSS鐩磋仒鐨勮Е杈捐瘽鏈?
    鐘舵€? pending

浣? 鏌ョ湅鎵€鏈変换鍔?

AI: [璋冪敤 list_tasks]
    鈹佲攣鈹佲攣 Pending (3) 鈹佲攣鈹佲攣
    #7 浼樺寲 BOSS鐩磋仒鐨勮Е杈捐瘽鏈?
    #8 鍒嗘瀽鍊欓€変汉鍥炲鐜?
    #9 鏇存柊鑱屼綅 JD

    鈹佲攣鈹佲攣 In Progress (1) 鈹佲攣鈹佲攣
    #6 瀹炵幇鑷姩璁板繂鍔熻兘

    鈹佲攣鈹佲攣 Completed (2) 鈹佲攣鈹佲攣
    #4 娣诲姞 Git 鑷姩鍖?
    #5 MCP 鍗忚闆嗘垚
```

---

### 9. Error Recovery锛堥敊璇仮澶嶏級猸?

**瀹炵幇鏂囦欢**锛?
- `src/error-detector.ts` - 閿欒妫€娴?
- `src/retry-handler.ts` - 閲嶈瘯閫昏緫

**鍔熻兘**锛?
- 鑷姩妫€娴?4 绫婚敊璇細楠岃瘉鐮併€佺櫥褰曡繃鏈熴€侀檺娴併€佺綉缁?
- 鎸囨暟閫€閬块噸璇曪細1s 鈫?2s 鈫?4s 鈫?8s
- 妫€鏌ョ偣淇濆瓨/鎭㈠锛?4 灏忔椂鏈夋晥锛?
- 鏂偣缁紶

**妫€鏌ョ偣绀轰緥**锛?
```json
{
  "jobId": "default",
  "channel": "boss",
  "accountId": "boss_1",
  "lastProcessedIndex": 15,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

### 10. MCP Protocol锛圡CP 鍗忚锛夆瓙

**瀹炵幇鏂囦欢**锛歚src/mcp-client.ts`

**鍔熻兘**锛?
- 杩炴帴澶氫釜 MCP 鏈嶅姟鍣?
- 璋冪敤 MCP 宸ュ叿
- 璇诲彇 MCP 璧勬簮
- 鏀寔甯歌鏈嶅姟锛氭枃浠剁郴缁熴€丟itHub銆丼lack銆丯otion 绛?

**瀵硅瘽宸ュ叿**锛?
- `mcp_list_servers` - 鍒楀嚭鏈嶅姟鍣?
- `mcp_call_tool` - 璋冪敤宸ュ叿
- `mcp_read_resource` - 璇诲彇璧勬簮

**閰嶇疆绀轰緥**锛坄workspace/mcp-servers.yaml`锛夛細
```yaml
servers:
  - name: filesystem
    command: npx
    args:
      - -y
      - "@modelcontextprotocol/server-filesystem"
      - "/Users/浣犵殑鐩綍"
```

---

## 瀵硅瘽宸ュ叿瀹屾暣鍒楄〃

### 鎵ц鎺у埗锛? 涓級
- `run_sourcing` - 鎵ц sourcing
- `scan_inbox` - 鎵弿鏀朵欢绠?

### 鍊欓€変汉绠＄悊锛? 涓級
- `update_candidate` - 鏇存柊鐘舵€?
- `list_candidates` - 鍒楀嚭鍊欓€変汉
- `search_candidate` - 鎼滅储鍊欓€変汉
- `get_funnel` - 鏌ョ湅婕忔枟

### 鏂囦欢鎿嶄綔锛? 涓級
- `read_file` - 璇诲彇鏂囦欢
- `write_file` - 鍐欏叆鏂囦欢
- `read_pdf` - 璇诲彇 PDF

### 缃戠粶涓庢悳绱紙3 涓級
- `web_search` - 缃戠粶鎼滅储
- `glob` - 鏂囦欢鎼滅储
- `grep` - 鍐呭鎼滅储

### 浠ｇ爜鎿嶄綔锛? 涓級
- `read_code` - 璇诲彇浠ｇ爜
- `modify_code` - 淇敼浠ｇ爜
- `execute_shell` - 鎵ц鍛戒护

### Git 鑷姩鍖栵紙5 涓級
- `git_status` - 鏌ョ湅鐘舵€?
- `git_commit` - 鎻愪氦浠ｇ爜
- `git_create_branch` - 鍒涘缓鍒嗘敮
- `git_push` - 鎺ㄩ€佽繙绋?
- `git_create_pr` - 鍒涘缓 PR

### MCP 闆嗘垚锛? 涓級
- `mcp_list_servers` - 鍒楀嚭鏈嶅姟鍣?
- `mcp_call_tool` - 璋冪敤宸ュ叿
- `mcp_read_resource` - 璇诲彇璧勬簮

### 浠诲姟绠＄悊锛? 涓級
- `create_task` - 鍒涘缓浠诲姟
- `update_task` - 鏇存柊浠诲姟
- `list_tasks` - 鍒楀嚭浠诲姟

### 鑷姩璁板繂锛? 涓級
- `remember` - 璁颁綇鍐呭
- `forget` - 蹇樿鍐呭
- `recall_memory` - 鍥炲繂璁板繂
- `search_past_context` - 鎼滅储鍘嗗彶

### 浜や簰宸ュ叿锛? 涓級
- `ask_user_question` - 缁撴瀯鍖栭棶绛?
- `analyze_image` - 鍥剧墖鍒嗘瀽

**鎬昏锛?0+ 宸ュ叿**

---

## 浣跨敤鏂瑰紡

### 瀵硅瘽妯″紡
```bash
hireclaw
```

### 璁″垝妯″紡
```bash
hireclaw run --plan
```

### 浠诲姟鐪嬫澘
```bash
hireclaw tasks
```

### 鎶€鑳借皟鐢?
```bash
# 鍦ㄥ璇濅腑浣跨敤
/鎵惧€欓€変汉 鍓嶇宸ョ▼甯?
/鍒嗘瀽绠€鍘?/path/to/resume.pdf
/鍊欓€変汉婕忔枟
/commit
```

---

## 鏂囨。绱㈠紩

- [Git 鑷姩鍖栦娇鐢ㄦ寚鍗梋(./GIT-AUTOMATION.md)
- [MCP 鍗忚浣跨敤鎸囧崡](./MCP-GUIDE.md)
- [鍔熻兘瀹炵幇鎬荤粨](./IMPLEMENTATION-SUMMARY.md)
- [涓?README](../README.md)

---

## 涓?HireCoder 鐨勪紭鍔?

| 缁村害 | HireClaw 浼樺娍 |
|------|--------------|
| **棰嗗煙涓撲笟鎬?* | 鍐呯疆鎷涜仒鐭ヨ瘑搴撱€佸€欓€変汉璇勪及妗嗘灦 |
| **鑷姩鍖栬兘鍔?* | 娴忚鍣ㄨ嚜鍔ㄥ寲 sourcing |
| **骞惰鏁堢巼** | 澶氳处鍙峰苟琛岋紝鏁堢巼缈诲€?|
| **瀹炴椂鐩戞帶** | Web Dashboard 瀹炴椂鎺у埗鍙?|
| **涓诲姩鎬?* | 鑷姩鎻愰啋銆佷富鍔ㄦ鏌?|
| **瀹屾暣鎬?* | 瑕嗙洊 HireCoder 鎵€鏈夋牳蹇冨姛鑳?|

---

**HireClaw = HireCoder + 鎷涜仒涓撲笟鑳藉姏** 馃
