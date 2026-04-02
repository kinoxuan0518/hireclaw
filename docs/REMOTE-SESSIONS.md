# 杩滅▼浼氳瘽浣跨敤鎸囧崡

HireClaw 鏀寔瀵煎嚭瀵硅瘽浼氳瘽锛屽彲浠ュ湪鍏朵粬骞冲彴锛堝 claude.ai锛夌户缁璇濄€?

---

## 鍔熻兘姒傝

- **瀵煎嚭浼氳瘽** - 灏嗗綋鍓嶅璇濆鍑轰负 Markdown + JSON
- **鍒楀嚭浼氳瘽** - 鏌ョ湅鎵€鏈夊凡瀵煎嚭鐨勪細璇?
- **鎵撳紑浼氳瘽** - 鍦ㄦ祻瑙堝櫒涓煡鐪嬩細璇?
- **澶嶅埗浼氳瘽** - 澶嶅埗鍒板壀璐存澘锛坢acOS锛?
- **璺ㄥ钩鍙颁娇鐢?* - 鍦?claude.ai 缁х画瀵硅瘽

---

## 蹇€熷紑濮?

### 1. 瀵煎嚭褰撳墠瀵硅瘽

鍦ㄥ璇濅腑杈撳叆锛?

```
/export
```

鎴栨寚瀹氭爣棰橈細

```
/export 鎴戠殑鎷涜仒绛栫暐璁ㄨ
```

杈撳嚭绀轰緥锛?

```
鉁?浼氳瘽宸插鍑?
   ID: a1b2c3d4e5f67890
   鏍囬: 鎴戠殑鎷涜仒绛栫暐璁ㄨ
   娑堟伅: 15 鏉?
   Markdown: file:///path/to/sessions/a1b2c3d4e5f67890.md
   JSON: file:///path/to/sessions/a1b2c3d4e5f67890.json

鎻愮ず: 浣犲彲浠ュ皢 Markdown 鏂囦欢澶嶅埗鍒?claude.ai 缁х画瀵硅瘽
```

### 2. 鏌ョ湅鎵€鏈変細璇?

```
/sessions
```

杈撳嚭绀轰緥锛?

```
浼氳瘽鍒楄〃锛?

1. 鎴戠殑鎷涜仒绛栫暐璁ㄨ
   ID: a1b2c3d4e5f67890
   鏃堕棿: 2024-01-20 14:30:00
   娑堟伅: 15 鏉?
   鏂囦欢: file:///path/to/sessions/a1b2c3d4e5f67890.md

2. 鍓嶇宸ョ▼甯堝€欓€変汉鍒嗘瀽
   ID: b2c3d4e5f6a78901
   鏃堕棿: 2024-01-19 10:15:00
   娑堟伅: 23 鏉?
   鏂囦欢: file:///path/to/sessions/b2c3d4e5f6a78901.md
```

---

## 浣跨敤鍦烘櫙

### 鍦烘櫙 1锛氳法璁惧缁х画瀵硅瘽

**闂**锛氬湪鐢佃剳涓婂拰 HireClaw 鑱婁簡寰堜箙锛屾兂鍦ㄦ墜鏈轰笂缁х画锛?

**瑙ｅ喅**锛?

1. 瀵煎嚭浼氳瘽锛歚/export 鎵嬫満缁х画`
2. 鎵撳紑瀵煎嚭鐨?Markdown 鏂囦欢
3. 澶嶅埗鍏ㄩ儴鍐呭
4. 鍦ㄦ墜鏈烘祻瑙堝櫒鎵撳紑 [claude.ai](https://claude.ai)
5. 绮樿创瀵硅瘽鍘嗗彶
6. 缁х画鑱婂ぉ

### 鍦烘櫙 2锛氬垎浜璇濈粰鍚屼簨

**闂**锛氭兂鎶婂拰 HireClaw 鐨勮璁哄垎浜粰鍥㈤槦锛?

**瑙ｅ喅**锛?

1. 瀵煎嚭浼氳瘽锛歚/export 鎷涜仒绛栫暐璁ㄨ`
2. 鎵惧埌 Markdown 鏂囦欢锛堣矾寰勫湪杈撳嚭涓級
3. 鍙戦€佺粰鍚屼簨
4. 鍚屼簨鍙互鐩存帴闃呰鎴栧鍏ュ埌 claude.ai

### 鍦烘櫙 3锛氬綊妗ｉ噸瑕佸璇?

**闂**锛氭煇浜涘璇濆緢鏈変环鍊硷紝鎯充繚瀛樹笅鏉ワ紵

**瑙ｅ喅**锛?

1. 瀵煎嚭浼氳瘽锛歚/export 閲嶈-鍊欓€変汉璇勪及妗嗘灦`
2. 浼氳瘽鑷姩淇濆瓨鍦?`workspace/sessions/`
3. 鍙互澶囦唤鍒颁簯鐩樻垨 Git 浠撳簱

### 鍦烘櫙 4锛氭仮澶嶄箣鍓嶇殑璁ㄨ

**闂**锛氬嚑澶╁墠璁ㄨ鐨勫唴瀹规兂閲嶆柊鐪嬬湅锛?

**瑙ｅ喅**锛?

1. 鏌ョ湅浼氳瘽鍒楄〃锛歚/sessions`
2. 鎵惧埌瀵瑰簲鐨勪細璇?ID
3. 浣跨敤宸ュ叿鎵撳紑锛歚open_session(session_id)`
4. 鎴栫洿鎺ユ墦寮€ Markdown 鏂囦欢

---

## 瀵煎嚭鏍煎紡

### Markdown 鏍煎紡锛?md锛?

浜虹被鍙鐨勬牸寮忥紝閫傚悎锛?
- 鍦ㄧ紪杈戝櫒涓槄璇?
- 澶嶅埗鍒?claude.ai
- 鍒嗕韩缁欎粬浜?
- 鐢熸垚鏂囨。

绀轰緥锛?

```markdown
# 鎴戠殑鎷涜仒绛栫暐璁ㄨ

**鍒涘缓鏃堕棿**: 2024-01-20 14:30:00
**娑堟伅鏁?*: 15

---

## 馃懁 鐢ㄦ埛

甯垜鍒跺畾鏈懆鐨勬嫑鑱樼瓥鐣?

---

## 馃 AI

濂界殑锛岃鎴戝府浣犲垎鏋愪竴涓?..

[鍐呭鐣

---

## 馃懁 鐢ㄦ埛

閭?BOSS鐩磋仒鍜岃剦鑴夎濡備綍鍒嗛厤绮惧姏锛?

---

## 馃 AI

鏍规嵁鍘嗗彶鏁版嵁鍒嗘瀽...

[鍐呭鐣
```

### JSON 鏍煎紡锛?json锛?

鏈哄櫒鍙鐨勬牸寮忥紝閫傚悎锛?
- 閲嶆柊瀵煎叆鍒?HireClaw
- 绋嬪簭鍖栧鐞?
- 鏁版嵁鍒嗘瀽
- 澶囦唤鎭㈠

绀轰緥锛?

```json
{
  "title": "鎴戠殑鎷涜仒绛栫暐璁ㄨ",
  "createdAt": "2024-01-20T14:30:00.000Z",
  "messageCount": 15,
  "messages": [
    {
      "role": "user",
      "content": "甯垜鍒跺畾鏈懆鐨勬嫑鑱樼瓥鐣?
    },
    {
      "role": "assistant",
      "content": "濂界殑锛岃鎴戝府浣犲垎鏋愪竴涓?.."
    }
  ]
}
```

---

## 瀵硅瘽宸ュ叿

闄や簡鍛戒护锛坄/export`, `/sessions`锛夛紝杩樺彲浠ヤ娇鐢ㄥ璇濆伐鍏凤細

### 1. list_sessions

鍒楀嚭鎵€鏈変細璇?

```
浣? 鍒楀嚭鎵€鏈変細璇?

AI: [璋冪敤 list_sessions]
    浼氳瘽鍒楄〃锛?
    1. 鎴戠殑鎷涜仒绛栫暐璁ㄨ
    2. 鍓嶇宸ョ▼甯堝€欓€変汉鍒嗘瀽
    ...
```

### 2. open_session

鍦ㄦ祻瑙堝櫒鎵撳紑浼氳瘽

```
浣? 鎵撳紑浼氳瘽 a1b2c3d4e5f67890

AI: [璋冪敤 open_session]
    鉁?宸插湪娴忚鍣ㄤ腑鎵撳紑浼氳瘽
```

### 3. copy_session

澶嶅埗浼氳瘽鍒板壀璐存澘锛堜粎 macOS锛?

```
浣? 澶嶅埗浼氳瘽 a1b2c3d4e5f67890 鍒板壀璐存澘

AI: [璋冪敤 copy_session]
    鉁?宸插鍒跺埌鍓创鏉?

[鐜板湪鍙互鐩存帴绮樿创鍒?claude.ai]
```

---

## 楂樼骇鐢ㄦ硶

### 1. 鑷姩瀵煎嚭锛圚ook锛?

鍦ㄦ瘡娆″璇濈粨鏉熸椂鑷姩瀵煎嚭锛?

```bash
# 娣诲姞 post-chat hook锛堥渶瑕佽嚜宸卞疄鐜拌Е鍙戠偣锛?
浣? 娣诲姞 hook锛屽湪瀵硅瘽缁撴潫鏃惰嚜鍔ㄥ鍑轰細璇?

AI: [璋冪敤 add_hook]
    hook_name: post-chat
    command: echo "瀵硅瘽宸茶嚜鍔ㄥ鍑?
```

### 2. 鎵归噺瀵煎嚭

瀵煎嚭鎵€鏈夐噸瑕佸璇濓細

```bash
# 鍦?shell 涓?
cd workspace/sessions
ls *.md | wc -l  # 鏌ョ湅浼氳瘽鏁伴噺
```

### 3. Git 鐗堟湰鎺у埗

灏嗕細璇濈撼鍏ョ増鏈帶鍒讹細

```bash
# 鍦?hireclaw 鐩綍
git add workspace/sessions/
git commit -m "docs: archive recruitment discussions"
git push
```

### 4. 浜戠鍚屾

鍚屾鍒颁簯鐩橈細

```bash
# 鍒涘缓杞摼鎺ュ埌 Dropbox/iCloud
ln -s ~/hireclaw/workspace/sessions ~/Dropbox/HireClaw-Sessions
```

---

## 鏂囦欢缁撴瀯

```
workspace/
鈹斺攢鈹€ sessions/
    鈹溾攢鈹€ a1b2c3d4e5f67890.md      # Markdown 鏍煎紡
    鈹溾攢鈹€ a1b2c3d4e5f67890.json    # JSON 鏍煎紡
    鈹溾攢鈹€ b2c3d4e5f6a78901.md
    鈹溾攢鈹€ b2c3d4e5f6a78901.json
    鈹斺攢鈹€ ...
```

姣忎釜浼氳瘽鏈変袱涓枃浠讹細
- `.md` - 浜虹被闃呰
- `.json` - 鏈哄櫒澶勭悊

---

## 璺ㄥ钩鍙颁娇鐢ㄦ楠?

### 鏂规硶 1锛氭墜鍔ㄥ鍒讹紙鎺ㄨ崘锛?

1. **瀵煎嚭浼氳瘽**
   ```
   /export 鎴戠殑瀵硅瘽
   ```

2. **鎵撳紑 Markdown 鏂囦欢**
   - macOS: `open workspace/sessions/xxx.md`
   - Linux: `xdg-open workspace/sessions/xxx.md`
   - Windows: 鍦ㄦ枃浠剁鐞嗗櫒涓墦寮€

3. **澶嶅埗鍐呭**
   - 鍏ㄩ€夛紙Cmd/Ctrl + A锛?
   - 澶嶅埗锛圕md/Ctrl + C锛?

4. **绮樿创鍒?claude.ai**
   - 鎵撳紑 [claude.ai](https://claude.ai)
   - 鏂板缓瀵硅瘽
   - 绮樿创鍐呭
   - 缁х画鑱婂ぉ

### 鏂规硶 2锛氫娇鐢ㄥ壀璐存澘锛坢acOS锛?

1. **瀵煎嚭骞跺鍒?*
   ```
   /export
   /sessions  # 鏌ョ湅浼氳瘽 ID
   ```

2. **鍦ㄥ璇濅腑璋冪敤宸ュ叿**
   ```
   浣? 澶嶅埗浼氳瘽 xxx 鍒板壀璐存澘
   AI: 鉁?宸插鍒?
   ```

3. **鐩存帴绮樿创鍒?claude.ai**

---

## 鏁呴殰鎺掗櫎

### 闂 1锛氭壘涓嶅埌瀵煎嚭鐨勬枃浠?

**鍘熷洜**锛氳矾寰勪笉瀵?

**瑙ｅ喅**锛?
```bash
# 鏌ユ壘浼氳瘽鏂囦欢
find ~/hireclaw -name "*.md" -path "*/sessions/*"

# 鎴栫洿鎺ヨ繘鍏ョ洰褰?
cd ~/hireclaw/workspace/sessions
ls -la
```

### 闂 2锛氬鍒跺埌鍓创鏉垮け璐ワ紙闈?macOS锛?

**鍘熷洜**锛氬壀璐存澘鍔熻兘浠呮敮鎸?macOS

**瑙ｅ喅**锛?
1. 鎵嬪姩鎵撳紑 Markdown 鏂囦欢
2. 鍏ㄩ€夊鍒?
3. 鎴栦娇鐢?Linux 鐨?`xclip`:
   ```bash
   cat workspace/sessions/xxx.md | xclip -selection clipboard
   ```

### 闂 3锛歝laude.ai 鎻愮ず鍐呭杩囬暱

**鍘熷洜**锛氬璇濆巻鍙插お闀?

**瑙ｅ喅**锛?
1. 鍙鍒舵渶杩戠殑鍑犺疆瀵硅瘽
2. 鎴栦娇鐢?HireClaw 鐨勪笂涓嬫枃鍘嬬缉鍔熻兘
3. 鍒嗘绮樿创

---

## 鏈€浣冲疄璺?

### 1. 鍛藉悕瑙勮寖

浣跨敤鎻忚堪鎬ф爣棰橈細

```
鉁?濂界殑鍛藉悕锛?
/export 2024-Q1鎷涜仒绛栫暐
/export 鍓嶇鍊欓€変汉璇勪及-寮犱笁
/export 閲嶈-骞村害鎷涜仒璁″垝

鉂?涓嶅ソ鐨勫懡鍚嶏細
/export 瀵硅瘽
/export test
/export 123
```

### 2. 瀹氭湡褰掓。

姣忓懆鎴栨瘡鏈堝鍑洪噸瑕佸璇濓細

```
/export 2024-01-绗笁鍛?鎷涜仒鎬荤粨
```

### 3. 鍒嗙被绠＄悊

鍒涘缓瀛愮洰褰曪細

```bash
cd workspace/sessions
mkdir strategy candidates plans
mv *绛栫暐* strategy/
mv *鍊欓€変汉* candidates/
```

### 4. 澶囦唤

瀹氭湡澶囦唤浼氳瘽锛?

```bash
# 鎵撳寘澶囦唤
tar -czf sessions-backup-2024-01.tar.gz workspace/sessions/

# 涓婁紶鍒颁簯绔?
# ...
```

---

## 鏈潵澧炲己锛堣鍒掍腑锛?

- [ ] 鐩存帴鎺ㄩ€佸埌 claude.ai锛堥渶瑕?API 鏀寔锛?
- [ ] 鐢熸垚鍏紑鍒嗕韩閾炬帴
- [ ] 浼氳瘽鍚堝苟鍔熻兘
- [ ] 鏅鸿兘鎽樿鐢熸垚
- [ ] 浼氳瘽鎼滅储鍔熻兘

---

## 涓?HireCoder 瀵规瘮

| 鍔熻兘 | HireCoder | HireClaw |
|------|-------------|----------|
| 瀵煎嚭浼氳瘽 | 鉁?| 鉁?|
| 鎺ㄩ€佸埌 claude.ai | 鉁?鑷姩 | 鈿狅笍 鎵嬪姩 |
| 鏈湴淇濆瓨 | 鉁?| 鉁?|
| Markdown 鏍煎紡 | 鉁?| 鉁?|
| JSON 鏍煎紡 | 鉁?| 鉁?|
| 璺ㄨ澶囧悓姝?| 鉁?鑷姩 | 鈿狅笍 鎵嬪姩 |

**HireClaw 浼樺娍**锛?
- 瀹屽叏鏈湴鎺у埗
- 鏀寔 Markdown 鍜?JSON 鍙屾牸寮?
- 鍙互绾冲叆 Git 鐗堟湰鎺у埗
- 鏄撲簬澶囦唤鍜屽垎浜?

**鏈潵鏀硅繘**锛?
- 瀹炵幇鑷姩鎺ㄩ€佸埌 claude.ai
- 鎻愪緵浜戠鍚屾鏈嶅姟

---

## 鎬荤粨

杩滅▼浼氳瘽鍔熻兘璁?HireClaw 鐨勫璇濆彲浠ヨ法骞冲彴銆佽法璁惧缁х画锛屽悓鏃朵繚鎸佸畬鍏ㄧ殑鏈湴鎺у埗鍜岄殣绉佸畨鍏ㄣ€?

**鏍稿績鍛戒护**锛?
- `/export` - 瀵煎嚭浼氳瘽
- `/sessions` - 鏌ョ湅浼氳瘽

**鍏稿瀷鐢ㄦ硶**锛?
```
HireClaw 瀵硅瘽 鈫?/export 鈫?澶嶅埗 Markdown 鈫?绮樿创鍒?claude.ai 鈫?缁х画瀵硅瘽
```

绠€鍗曘€侀珮鏁堛€佸畨鍏紒馃
