# Git 鑷姩鍖栦娇鐢ㄦ寚鍗?

HireClaw 鏀寔 Git 鑷姩鍖栧姛鑳斤紝鍙互鍦ㄥ璇濇ā寮忎腑鐩存帴绠＄悊浠ｇ爜鐗堟湰鎺у埗銆?

## 鍔熻兘姒傝

- 鏌ョ湅 Git 鐘舵€?
- 鎻愪氦浠ｇ爜鏇存敼
- 鍒涘缓鏂板垎鏀?
- 鎺ㄩ€佸埌杩滅▼浠撳簱
- 鍒涘缓 GitHub Pull Request

## 鍓嶇疆瑕佹眰

### 鍩虹鍔熻兘锛堟煡鐪嬬姸鎬併€佹彁浜ゃ€佸垎鏀€佹帹閫侊級

- 椤圭洰蹇呴』鏄?git 浠撳簱
- 宸查厤缃?git 鐢ㄦ埛淇℃伅

```bash
git config --global user.name "浣犵殑鍚嶅瓧"
git config --global user.email "your@email.com"
```

### PR 鍒涘缓鍔熻兘

- 杩滅▼浠撳簱蹇呴』鏄?GitHub
- 瀹夎 GitHub CLI锛歚brew install gh`
- 宸茬櫥褰?gh CLI锛歚gh auth login`

## 浣跨敤绀轰緥

### 1. 鏌ョ湅 Git 鐘舵€?

```
浣? 鏌ョ湅涓€涓?git 鐘舵€?

AI: [鑷姩璋冪敤 git_status 宸ュ叿]
褰撳墠鍒嗘敮锛歮ain

宸蹭慨鏀?(2):
  M src/chat.ts
  M README.md

鏈窡韪?(1):
  ? src/git-helper.ts
```

### 2. 鎻愪氦浠ｇ爜

**鎻愪氦鎵€鏈夋洿鏀癸細**
```
浣? 鎶婃墍鏈夋敼鍔ㄦ彁浜や竴涓嬶紝娑堟伅鏄?feat: add git automation support"

AI: [鑷姩璋冪敤 git_commit 宸ュ叿]
鎻愪氦鎴愬姛锛?
SHA: a1b2c3d4
鍒嗘敮: main
鎻愪氦淇℃伅: feat: add git automation support
```

**鎻愪氦鎸囧畾鏂囦欢锛?*
```
浣? 鍙彁浜?src/chat.ts锛屾秷鎭槸"fix: update chat tools"

AI: [鑷姩璋冪敤 git_commit 宸ュ叿锛屾寚瀹?files 鍙傛暟]
鎻愪氦鎴愬姛锛?
```

### 3. 鍒涘缓鍒嗘敮

**浠庡綋鍓嶅垎鏀垱寤猴細**
```
浣? 鍒涘缓涓€涓柊鍒嗘敮鍙?feature/git-tools

AI: [鑷姩璋冪敤 git_create_branch 宸ュ叿]
宸插垱寤哄苟鍒囨崲鍒版柊鍒嗘敮锛歠eature/git-tools
```

**浠庢寚瀹氬垎鏀垱寤猴細**
```
浣? 鍩轰簬 main 鍒涘缓涓€涓垎鏀彨 hotfix/urgent-fix

AI: [鑷姩璋冪敤 git_create_branch 宸ュ叿锛屾寚瀹?baseBranch]
宸插垱寤哄苟鍒囨崲鍒版柊鍒嗘敮锛歨otfix/urgent-fix
```

### 4. 鎺ㄩ€佸埌杩滅▼

**鏅€氭帹閫侊細**
```
浣? 鎺ㄩ€佸埌杩滅▼

AI: [鑷姩璋冪敤 git_push 宸ュ叿]
宸叉帹閫佸垎鏀?feature/git-tools 鍒拌繙绋嬩粨搴?
```

**寮哄埗鎺ㄩ€侊紙璋ㄦ厧浣跨敤锛夛細**
```
浣? 寮哄埗鎺ㄩ€佸埌杩滅▼

AI: [鑷姩璋冪敤 git_push 宸ュ叿锛宖orce=true]
宸叉帹閫佸垎鏀?feature/git-tools 鍒拌繙绋嬩粨搴?
```

### 5. 鍒涘缓 Pull Request

**鍩虹 PR锛?*
```
浣? 鍒涘缓涓€涓?PR锛屾爣棰樻槸"Add Git automation support"

AI: [鑷姩璋冪敤 git_create_pr 宸ュ叿]
PR 鍒涘缓鎴愬姛锛?
鍒嗘敮: feature/git-tools -> main
URL: https://github.com/user/hireclaw/pull/123
```

**甯︽弿杩扮殑 PR锛?*
```
浣? 鍒涘缓 PR锛屾爣棰?Add Git automation"锛屾弿杩?瀹炵幇浜?5 涓?git 鐩稿叧宸ュ叿"

AI: [鑷姩璋冪敤 git_create_pr 宸ュ叿锛屾寚瀹?body]
PR 鍒涘缓鎴愬姛锛?
```

**鑽夌 PR锛?*
```
浣? 鍒涘缓涓€涓崏绋?PR

AI: [鑷姩璋冪敤 git_create_pr 宸ュ叿锛宒raft=true]
PR 鍒涘缓鎴愬姛锛侊紙鑽夌妯″紡锛?
```

**鎸囧畾鐩爣鍒嗘敮锛?*
```
浣? 鍒涘缓 PR 鍒?develop 鍒嗘敮

AI: [鑷姩璋冪敤 git_create_pr 宸ュ叿锛宐aseBranch="develop"]
PR 鍒涘缓鎴愬姛锛?
鍒嗘敮: feature/git-tools -> develop
```

## 鍏稿瀷宸ヤ綔娴?

### 鍦烘櫙 1锛氫慨澶?Bug

```
浣? 鏌ョ湅 git 鐘舵€?
鈫?鐪嬪埌鏈変慨鏀圭殑鏂囦欢

浣? 鍒涘缓涓€涓垎鏀彨 fix/candidate-search
鈫?鍒涘缓骞跺垏鎹㈠埌鏂板垎鏀?

浣? 鎻愪氦鎵€鏈夋敼鍔紝娑堟伅"fix: improve candidate search logic"
鈫?鎻愪氦鎴愬姛

浣? 鎺ㄩ€佸埌杩滅▼
鈫?鎺ㄩ€佹垚鍔?

浣? 鍒涘缓 PR锛屾爣棰?Fix candidate search"
鈫?PR 鍒涘缓鎴愬姛锛岃繑鍥?URL
```

### 鍦烘櫙 2锛氭坊鍔犳柊鍔熻兘

```
浣? 鍩轰簬 main 鍒涘缓鍒嗘敮 feature/mcp-support
鈫?鍒涘缓鏂板垎鏀?

[寮€鍙戣繃绋嬩腑...]

浣? 鏌ョ湅 git 鐘舵€?
鈫?鐪嬪埌鏂板鍜屼慨鏀圭殑鏂囦欢

浣? 鎻愪氦鏀瑰姩锛屾秷鎭?feat: add MCP protocol support"
鈫?鎻愪氦鎴愬姛

浣? 鎺ㄩ€佸埌杩滅▼
鈫?鎺ㄩ€佹垚鍔?

浣? 鍒涘缓 PR锛屾爣棰?Add MCP support"锛屾弿杩?鏀寔 MCP 鍗忚闆嗘垚"
鈫?PR 鍒涘缓鎴愬姛
```

### 鍦烘櫙 3锛氬揩閫熸彁浜わ紙鍗曟潯鍛戒护锛?

濡傛灉浣犳兂涓€娆℃€у畬鎴愬涓搷浣滐紝鍙互鍦ㄥ璇濅腑渚濇璇存槑锛?

```
浣? 甯垜鎶婃墍鏈夋敼鍔ㄦ彁浜ゅ埌鏂板垎鏀?feature/quick-fix锛岀劧鍚庢帹閫佸苟鍒涘缓 PR

AI: [渚濇鎵ц]
1. 鍒涘缓鍒嗘敮 feature/quick-fix
2. 鎻愪氦鎵€鏈夋敼鍔?
3. 鎺ㄩ€佸埌杩滅▼
4. 鍒涘缓 PR
```

## 瀹夊叏鎻愮ず

### 鈿狅笍 寮哄埗鎺ㄩ€?

寮哄埗鎺ㄩ€佷細瑕嗙洊杩滅▼鍒嗘敮鍘嗗彶锛屽彲鑳藉鑷村叾浠栦汉鐨勫伐浣滀涪澶便€傚彧鍦ㄤ互涓嬫儏鍐典娇鐢細
- 纭娌℃湁鍏朵粬浜哄湪浣跨敤杩欎釜鍒嗘敮
- 闇€瑕佷慨姝ｅ凡鎺ㄩ€佺殑閿欒鎻愪氦
- 閲嶅啓浜嗘彁浜ゅ巻鍙诧紙濡?rebase锛?

### 鈿狅笍 鏁忔劅淇℃伅

鎻愪氦鍓嶇‘淇濓細
- 娌℃湁鍖呭惈 API keys銆佸瘑鐮佺瓑鏁忔劅淇℃伅
- `.gitignore` 宸叉纭厤缃?
- 妫€鏌?`.env` 绛夐厤缃枃浠舵槸鍚﹁蹇界暐

### 鈿狅笍 鎻愪氦淇℃伅瑙勮寖

寤鸿浣跨敤璇箟鍖栨彁浜や俊鎭細
- `feat:` - 鏂板姛鑳?
- `fix:` - Bug 淇
- `docs:` - 鏂囨。鏇存柊
- `refactor:` - 閲嶆瀯
- `test:` - 娴嬭瘯鐩稿叧
- `chore:` - 鏋勫缓/宸ュ叿鏇存柊

## 鏁呴殰鎺掗櫎

### 闂锛氭湭瀹夎 gh CLI

**閿欒**锛歚鏈畨瑁?gh CLI锛岃杩愯: brew install gh`

**瑙ｅ喅**锛?
```bash
brew install gh
gh auth login
```

### 闂锛氫笉鏄?git 浠撳簱

**閿欒**锛歚褰撳墠鐩綍涓嶆槸 git 浠撳簱`

**瑙ｅ喅**锛?
```bash
cd /path/to/your/git/repo
# 鎴栧垵濮嬪寲鏂颁粨搴?
git init
```

### 闂锛氫笉鏄?GitHub 浠撳簱

**閿欒**锛歚褰撳墠浠撳簱涓嶆槸 GitHub 浠撳簱`

**瑙ｅ喅**锛?
PR 鍔熻兘浠呮敮鎸?GitHub 浠撳簱銆傚鏋滀綘鐨勮繙绋嬩粨搴撳湪 GitLab銆丅itbucket 绛夊钩鍙帮紝闇€瑕佷娇鐢ㄥ搴旂殑 CLI 宸ュ叿銆?

### 闂锛氭帹閫佽鎷掔粷

**閿欒**锛歚鎺ㄩ€佸け璐? Updates were rejected`

**鍘熷洜**锛氳繙绋嬪垎鏀湁鏂版彁浜わ紝鏈湴鍒嗘敮钀藉悗

**瑙ｅ喅**锛?
```bash
# 鍏堟媺鍙栬繙绋嬫洿鏂?
git pull origin <branch-name>
# 瑙ｅ喅鍐茬獊鍚庡啀鎺ㄩ€?
```

### 闂锛歡h auth 鏈櫥褰?

**閿欒**锛歚gh: To get started with GitHub CLI, please run: gh auth login`

**瑙ｅ喅**锛?
```bash
gh auth login
# 鎸夋彁绀哄畬鎴?GitHub 鐧诲綍
```

## 闄愬埗鍜屾敞鎰忎簨椤?

1. **褰撳墠宸ヤ綔鐩綍**锛欸it 鎿嶄綔鍦?HireClaw 褰撳墠宸ヤ綔鐩綍鎵ц锛堥€氬父鏄?`hireclaw/`锛?
2. **鍒嗘敮淇濇姢**锛氬鏋滅洰鏍囧垎鏀湁淇濇姢瑙勫垯锛孭R 鍒涘缓鍙兘闇€瑕侀澶栧鎵?
3. **鏉冮檺瑕佹眰**锛氭帹閫佸拰鍒涘缓 PR 闇€瑕佹湁浠撳簱鐨勫啓鏉冮檺
4. **gh CLI 鐗堟湰**锛氬缓璁娇鐢ㄦ渶鏂扮増鏈殑 gh CLI

## 涓?HireCoder 瀵规瘮

| 鍔熻兘 | HireClaw | HireCoder |
|------|----------|-------------|
| 鏌ョ湅 git 鐘舵€?| 鉁?| 鉁?|
| 鎻愪氦浠ｇ爜 | 鉁?| 鉁?|
| 鍒涘缓鍒嗘敮 | 鉁?| 鉁?|
| 鎺ㄩ€佽繙绋?| 鉁?| 鉁?|
| 鍒涘缓 PR | 鉁?(GitHub) | 鉁?|
| 澶勭悊鍐茬獊 | 鎵嬪姩 | 鎵嬪姩 |
| Git rebase | 鎵嬪姩 | 鎵嬪姩 |

## 涓嬩竴姝?

- 浜嗚В [MCP 闆嗘垚](./MCP-GUIDE.md) 杩炴帴鏇村澶栭儴鏈嶅姟
- 鏌ョ湅 [瀵硅瘽妯″紡](../README.md#瀵硅瘽妯″紡) 浜嗚В鍏朵粬鍙敤宸ュ叿
- 瀛︿範 [浠诲姟绠＄悊](../README.md#浠诲姟绠＄悊) 绯荤粺
