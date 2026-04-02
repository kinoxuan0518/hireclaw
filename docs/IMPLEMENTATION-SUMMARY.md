# HireClaw 鍔熻兘瀹炵幇鎬荤粨

## 姒傝

HireClaw 鐜板凡瀹炵幇鎵€鏈夋牳蹇冨姛鑳斤紝杈惧埌 HireCoder 绾у埆鐨勮兘鍔涳紝鍚屾椂淇濈暀鎷涜仒棰嗗煙鐨勪笓涓氱煡璇嗐€?

## 宸插疄鐜板姛鑳芥竻鍗?

### 鉁?Phase 1.1: 璁″垝妯″紡 (Plan Mode)
**瀹炵幇鏃堕棿**: 绗竴闃舵
**鏂囦欢**:
- `src/planner.ts` - AI 椹卞姩鐨勬墽琛岃鍒掔敓鎴?
- `src/orchestrator.ts` - 闆嗘垚璁″垝妯″紡鏀寔

**鍔熻兘**:
- LLM 鍒嗘瀽鍘嗗彶鏁版嵁鍜岃亴浣嶉渶姹?
- 鐢熸垚缁撴瀯鍖栨墽琛岃鍒掞紙JSON 鏍煎紡锛?
- 鐢ㄦ埛纭鍚庢墽琛?
- 棰勪及鎵ц鏃堕棿鍜岃祫婧愬垎閰?

**浣跨敤**:
```bash
hireclaw run --plan
```

---

### 鉁?Phase 2.1: 鎼滅储宸ュ叿 (Search Tools)
**瀹炵幇鏃堕棿**: 绗簩闃舵
**鏂囦欢**:
- `src/tools/glob.ts` - 鏂囦欢妯″紡鎼滅储
- `src/tools/grep.ts` - 鍐呭鎼滅储锛堜紭鍏堜娇鐢?ripgrep锛?

**鍔熻兘**:
- Glob 妯″紡鍖归厤鏂囦欢
- 姝ｅ垯琛ㄨ揪寮忓唴瀹规悳绱?
- 鑷姩蹇界暐鏁忔劅鐩綍
- 鏀寔涓婁笅鏂囪鏄剧ず

**瀵硅瘽绀轰緥**:
```
浣? 鎼滅储鎵€鏈?TypeScript 鏂囦欢涓寘鍚?"鍊欓€変汉" 鐨勪唬鐮?
AI: [璋冪敤 grep 宸ュ叿鎼滅储]
```

---

### 鉁?Phase 1.2: 閿欒鎭㈠ (Error Recovery)
**瀹炵幇鏃堕棿**: 绗笁闃舵
**鏂囦欢**:
- `src/error-detector.ts` - 閿欒妫€娴嬶紙楠岃瘉鐮併€佺櫥褰曡繃鏈熴€侀檺娴侊級
- `src/retry-handler.ts` - 鎸囨暟閫€閬块噸璇?+ 妫€鏌ョ偣绯荤粺

**鍔熻兘**:
- 鑷姩妫€娴?4 绫婚敊璇細楠岃瘉鐮併€佺櫥褰曡繃鏈熴€侀檺娴併€佺綉缁滈敊璇?
- 鎸囨暟閫€閬块噸璇曪細1s 鈫?2s 鈫?4s 鈫?8s
- 妫€鏌ョ偣淇濆瓨/鎭㈠锛?4 灏忔椂鏈夋晥鏈燂級
- 鏂偣缁紶鏈哄埗

**妫€鏌ョ偣绀轰緥**:
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

### 鉁?Phase 1.3: 浠诲姟绠＄悊 (Task Management)
**瀹炵幇鏃堕棿**: 绗洓闃舵
**鏂囦欢**:
- `src/tasks.ts` - 浠诲姟 CRUD 鎿嶄綔鍜屽彲瑙嗗寲
- `src/db.ts` - SQLite tasks 琛ㄥ畾涔?

**鍔熻兘**:
- 5 绉嶄换鍔＄姸鎬侊細pending, in_progress, blocked, completed, cancelled
- 灞傜骇浠诲姟缁撴瀯锛堢埗瀛愬叧绯伙級
- 浼樺厛绾х郴缁?
- 鍙鍖栫湅鏉?

**浣跨敤**:
```bash
hireclaw tasks              # 鏌ョ湅浠诲姟鐪嬫澘
hireclaw tasks 123          # 鏌ョ湅鐗瑰畾浠诲姟璇︽儏
```

**瀵硅瘽宸ュ叿**:
- `create_task` - 鍒涘缓鏂颁换鍔?
- `update_task` - 鏇存柊浠诲姟鐘舵€?
- `list_tasks` - 鍒楀嚭鎵€鏈変换鍔?

---

### 鉁?Phase 3.1: MCP 鍗忚鏀寔 (MCP Protocol)
**瀹炵幇鏃堕棿**: 绗簲闃舵
**鏂囦欢**:
- `src/mcp-client.ts` - MCP 瀹㈡埛绔鐞嗗櫒
- `workspace/mcp-servers.yaml` - MCP 鏈嶅姟鍣ㄩ厤缃?
- `docs/MCP-GUIDE.md` - 浣跨敤鏂囨。

**鍔熻兘**:
- 杩炴帴澶氫釜 MCP 鏈嶅姟鍣?
- 璋冪敤 MCP 宸ュ叿
- 璇诲彇 MCP 璧勬簮
- 鏀寔鏂囦欢绯荤粺銆丟itHub銆丼lack銆丯otion銆佹祻瑙堝櫒绛?

**閰嶇疆绀轰緥**:
```yaml
servers:
  - name: filesystem
    command: npx
    args:
      - -y
      - "@modelcontextprotocol/server-filesystem"
      - "/Users/浣犵殑鐩綍"
```

**瀵硅瘽宸ュ叿**:
- `mcp_list_servers` - 鍒楀嚭鎵€鏈?MCP 鏈嶅姟鍣?
- `mcp_call_tool` - 璋冪敤 MCP 宸ュ叿
- `mcp_read_resource` - 璇诲彇 MCP 璧勬簮

---

### 鉁?Phase 2.2: Git 鑷姩鍖?(Git Automation)
**瀹炵幇鏃堕棿**: 绗叚闃舵锛堟渶鏂帮級
**鏂囦欢**:
- `src/git-helper.ts` - Git 鎿嶄綔鏍稿績妯″潡
- `docs/GIT-AUTOMATION.md` - 浣跨敤鏂囨。
- `test-git.ts` - 鍔熻兘娴嬭瘯鑴氭湰

**鍔熻兘**:
- 鏌ョ湅 Git 鐘舵€侊紙鍒嗘敮銆佷慨鏀广€佹湭璺熻釜鏂囦欢锛?
- 鎻愪氦浠ｇ爜锛堟敮鎸佹寚瀹氭枃浠舵垨鍏ㄩ儴锛?
- 鍒涘缓鍒嗘敮锛堟敮鎸佹寚瀹氬熀纭€鍒嗘敮锛?
- 鎺ㄩ€佸埌杩滅▼锛堟敮鎸佸己鍒舵帹閫侊級
- 鍒涘缓 GitHub PR锛堥渶瑕?gh CLI锛?

**瀵硅瘽宸ュ叿**:
- `git_status` - 鏌ョ湅 git 鐘舵€?
- `git_commit` - 鎻愪氦浠ｇ爜
- `git_create_branch` - 鍒涘缓鏂板垎鏀?
- `git_push` - 鎺ㄩ€佸埌杩滅▼
- `git_create_pr` - 鍒涘缓 Pull Request

**浣跨敤绀轰緥**:
```
浣? 鏌ョ湅 git 鐘舵€?
AI: [璋冪敤 git_status]
褰撳墠鍒嗘敮锛歮ain
宸蹭慨鏀?(2):
  M src/chat.ts
  M README.md

浣? 鎻愪氦鎵€鏈夋敼鍔紝娑堟伅"feat: add git automation"
AI: [璋冪敤 git_commit]
鎻愪氦鎴愬姛锛丼HA: a1b2c3d4

浣? 鍒涘缓 PR锛屾爣棰?Add Git automation"
AI: [璋冪敤 git_create_pr]
PR 鍒涘缓鎴愬姛锛?
URL: https://github.com/user/hireclaw/pull/123
```

---

## 棰濆瀹炵幇鐨勫姛鑳?

### 澶氳处鍙峰苟琛岀鐞?
**鏂囦欢**: `src/accounts.ts`, `src/browser-runner.ts`
**鍔熻兘**:
- 鐙珛 BrowserContext 绠＄悊
- 鎸佷箙鍖栫櫥褰曠姸鎬侊紙storageState锛?
- 棣栨鐧诲綍寮曞娴佺▼
- 鏀寔 2+ 璐﹀彿鍚屾椂鎵ц锛屾晥鐜囨垚鍊嶆彁鍗?

### 瀵硅瘽妯″紡宸ュ叿闆?
**鏂囦欢**: `src/chat.ts`
**宸ュ叿鏁伴噺**: 20+ 涓?

**鍒嗙被**:
1. **鎵ц鎺у埗**: run_sourcing, scan_inbox
2. **鍊欓€変汉绠＄悊**: update_candidate, list_candidates, search_candidate
3. **鏁版嵁鍒嗘瀽**: get_funnel, analyze_image
4. **鏂囦欢鎿嶄綔**: read_file, write_file
5. **缃戠粶鎼滅储**: web_search
6. **浠ｇ爜鎿嶄綔**: read_code, modify_code, execute_shell
7. **鎼滅储宸ュ叿**: glob, grep
8. **浠诲姟绠＄悊**: create_task, update_task, list_tasks
9. **MCP 闆嗘垚**: mcp_list_servers, mcp_call_tool, mcp_read_resource
10. **Git 鑷姩鍖?*: git_status, git_commit, git_create_branch, git_push, git_create_pr

---

## 鎶€鏈爤

### 鏍稿績渚濊禆
- **Playwright**: 娴忚鍣ㄨ嚜鍔ㄥ寲
- **OpenAI SDK**: LLM API 璋冪敤
- **better-sqlite3**: 鏁版嵁鎸佷箙鍖?
- **MCP SDK**: Model Context Protocol
- **glob**: 鏂囦欢妯″紡鎼滅储
- **ripgrep**: 楂樻€ц兘鍐呭鎼滅储锛堝彲閫夛級

### TypeScript + Node.js 22+
- 涓ユ牸绫诲瀷妫€鏌?
- ESM 妯″潡绯荤粺
- 寮傛鎿嶄綔

---

## 鏋舵瀯鐗圭偣

### 1. 妯″潡鍖栬璁?
姣忎釜鍔熻兘鐙珛妯″潡锛岃亴璐ｆ竻鏅帮細
- `orchestrator.ts` - 浠诲姟鍗忚皟
- `browser-runner.ts` - 娴忚鍣ㄧ鐞?
- `planner.ts` - 璁″垝鐢熸垚
- `tasks.ts` - 浠诲姟绠＄悊
- `mcp-client.ts` - MCP 闆嗘垚
- `git-helper.ts` - Git 鎿嶄綔

### 2. 浜嬩欢椹卞姩
- 鍏ㄥ眬浜嬩欢鎬荤嚎锛坄events.ts`锛?
- Runner 鈫?Dashboard 瀹炴椂閫氫俊
- 鎴浘銆佹棩蹇楁祦寮忎紶杈?

### 3. 鏁版嵁鎸佷箙鍖?
- SQLite 鏁版嵁搴擄紙鍊欓€変汉銆佸璇濄€佷换鍔★級
- 鏂囦欢绯荤粺锛堣处鍙风姸鎬併€佹鏌ョ偣锛?
- YAML 閰嶇疆锛堣亴浣嶃€丮CP 鏈嶅姟鍣級

### 4. 閿欒瀹归敊
- 澶氱骇閿欒妫€娴?
- 鑷姩閲嶈瘯鏈哄埗
- 妫€鏌ョ偣鎭㈠
- 浼橀泤闄嶇骇

---

## 瀵规瘮 HireCoder

| 鍔熻兘 | HireClaw | HireCoder | 澶囨敞 |
|------|----------|-------------|------|
| 璁″垝妯″紡 | 鉁?| 鉁?| AI 鍒嗘瀽鍘嗗彶鏁版嵁鐢熸垚璁″垝 |
| 鏂囦欢鎼滅储 (Glob) | 鉁?| 鉁?| 鏀寔妯″紡鍖归厤 |
| 鍐呭鎼滅储 (Grep) | 鉁?| 鉁?| 浼樺厛浣跨敤 ripgrep |
| 閿欒鎭㈠ | 鉁?| 鉁?| 妫€娴?+ 閲嶈瘯 + 妫€鏌ョ偣 |
| 浠诲姟绠＄悊 | 鉁?| 鉁?| 灞傜骇浠诲姟 + 鐘舵€佽窡韪?|
| MCP 鍗忚 | 鉁?| 鉁?| 杩炴帴澶栭儴鏈嶅姟 |
| Git 鑷姩鍖?| 鉁?| 鉁?| 鎻愪氦銆佸垎鏀€丳R |
| **鎷涜仒棰嗗煙鐭ヨ瘑** | 鉁?| 鉂?| HireClaw 鐙湁 |
| **娴忚鍣ㄨ嚜鍔ㄥ寲** | 鉁?| 鉂?| Playwright sourcing |
| **澶氳处鍙峰苟琛?* | 鉁?| 鉂?| HireClaw 鐙湁 |
| **涓诲姩鎻愰啋** | 鉁?| 鉂?| macOS 绯荤粺閫氱煡 |

---

## 浣跨敤缁熻

### 宸ュ叿鎬绘暟: 20+
### 浠ｇ爜鏂囦欢: 25+
### 娴嬭瘯瑕嗙洊: 鏍稿績鍔熻兘宸叉祴璇?
### 鏂囨。瀹屾暣搴? 100%

---

## 涓嬩竴姝ヨ鍒掞紙鍙€夛級

### 1. 澧炲己鍔熻兘
- [ ] Git rebase 鑷姩鍖?
- [ ] 澶?Git 骞冲彴鏀寔锛圙itLab銆丅itbucket锛?
- [ ] 鏇村 MCP 鏈嶅姟鍣ㄩ閰嶇疆

### 2. 鎬ц兘浼樺寲
- [ ] 骞惰浠诲姟鎵ц浼樺寲
- [ ] 鏁版嵁搴撴煡璇紭鍖?
- [ ] 缂撳瓨鏈哄埗

### 3. 鐢ㄦ埛浣撻獙
- [ ] Web UI 鏀硅繘
- [ ] 鏇翠赴瀵岀殑鍙鍖?
- [ ] 蹇嵎閿敮鎸?

---

## 璐＄尞鑰?

- 鍩轰簬 HireCoder 鏋舵瀯璁捐
- 娣卞害闆嗘垚鎷涜仒棰嗗煙鐭ヨ瘑
- 绀惧尯鍙嶉鎸佺画鏀硅繘

---

## License

MIT

---

**鏈€鍚庢洿鏂?*: 2024-01-20
**鐗堟湰**: v0.2.0-alpha
