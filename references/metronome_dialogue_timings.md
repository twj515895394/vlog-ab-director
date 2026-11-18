# Vlog AB Director: 节拍器时序与 AI 代写台词规范

> **v2 / T02 范围注记**：本文件下方原始 **2.5 秒 / 6 镜规范是 Classic AB 的兼容资料，不是 Adaptive AB 或 Cinematic-led 的通用强制规则。** 15 秒非等长时间预算与 1–8 Part（最长 120 秒）规划请以 [`references/timing_engine.md`](timing_engine.md) 为准。  
> **VO 兼容提示**：下文旧版把英文 `says in an off-screen voiceover:` 写为强制短语，现已知**用户实测有效的中文自然语言画外音**可以不含该固定短语（仍须 `<d>` 与闭嘴语义）。当前 `SKILL.md` / `SKILL.cn.md` 已接纳中文语义；T04 再统一改写该段语音规范。本轮仅为时序兼容，不重写其他声音规则。

本文件保存 **Classic AB 的 2.5 秒节拍器时间戳**、**该模式 AI 代写台词的字数预算与历史三类语音范例**；其他模式应先遵循 T01 路由与 T02 时间预算。

---

## 一、 2.5 秒黄金节拍器时序表（The 2.5s Metronome）

经过实测，在 15 秒短片中，**6 镜（每镜严格 2.500 秒）**是保证 AI 视频（MiniMax H3）动作插值平滑、表情不崩、节奏紧凑的最佳甜点位。

### 单段 15.00 秒标准时间轴分配（严格递增硬切点）：

| 镜头编号 | 视点类型 | 时间码范围 | 单镜时长 | 核心视听职能与叙事作用 |
| :--- | :--- | :--- | :--- | :--- |
| **[Shot 1]** | **A1 (自拍)** | `0.00 – 00:02.500` | 2.500s | **开场建立**：自拍近景，交代当前情绪与期待，出镜说第一句台词打招呼； |
| **[Shot 2]** | **B1 (大片)** | `At 00:02.500, HARD CUT TO:` (至 00:05.000) | 2.500s | **环境与状态切换**：硬切外部全身全景，展示环境大景深与卸下负担的动作； |
| **[Shot 3]** | **A2 (自拍)** | `At 00:05.000, HARD CUT TO:` (至 00:07.500) | 2.500s | **发现与趣味互动**：自拍特写，向镜头展示核心道具或与同伴打趣欢笑； |
| **[Shot 4]** | **B2 (大片)** | `At 00:07.500, HARD CUT TO:` (至 00:10.000) | 2.500s | **动态高光**：外部运镜大片，大长腿走秀迈步、衣摆翻飞、逆光回眸； |
| **[Shot 5]** | **A3 (自拍)** | `At 00:10.000, HARD CUT TO:` (至 00:12.500) | 2.500s | **情感沉淀**：自拍特写，彻底放松的长舒一口气、撩发或心满意足的眼神； |
| **[Shot 6]** | **B3 (大片)** | `At 00:12.500, HARD CUT TO:` (至 00:15.000) | 2.500s | **电影终局定格**：外部经典终局景别（看海背影/远景大航拍/杂志封面定格），不淡出收尾。 |

---

## 二、 AI 智能口语台词代写（Mode B）

本 Skill 强制启用 **Mode B（AI 智能代写）**，根据用户设定的故事氛围自动编排地道、生活化、富有感染力的 Vlog 台词。

### 1. 2.5 秒单镜字数预算器（Pacing Budget）
* **中文（Chinese）**：单镜台词严格限制在 **6 ~ 12 个汉字以内**（语速约 3~4 字/秒，留出 0.5 秒起止呼吸空隙）；
* **英文（English）**：单镜台词严格限制在 **4 ~ 8 个单词以内**；
* **留白法则（The Silence Rule）**：15 秒（6 个镜头）中，**仅在 2~3 个镜头安排台词**。其余 3~4 个镜头必须留给环境声（风声、浪声、脚步声）、人物被逗乐的短促轻笑或长舒一口气的放松呼吸声，绝对杜绝“从头说到尾”的机械喧嚣。

---

### 2. 三种核心台词形态与 H3 标准语法

#### 形态一：出镜直言（Direct-to-Camera Speech，主观 A 镜专用）
主角直视手机镜头讲话，口型与面部肌肉必须高度对齐。
* **规则**：必须在 `<d>` 标签外描述说话人的身份、音色、语调与表情，台词内容置于 `<d>` 内且保留原始语言。
* **标准范例**：
  ```text
  The young woman with a clear, cheerful voice (S1) smiles warmly into the lens and says: <d>[Chinese] 今天终于下班来到海边啦！</d>
  ```

#### 形态二：心声画外音（Cinematic Closed-Lips Voiceover，客观 B 镜专用）
B 镜展现唯美远景或人物背影，主角**嘴唇完全闭合**，声音作为内心独白在画面外流淌。
* **规则**：必须使用固定短语 `says in an off-screen voiceover:`，并在 `<d>` 标签之后立即强制跟上 **`while her lips remain completely closed.`**
* **标准范例**：
  ```text
  The woman (S1) says in an off-screen voiceover: <d>[Chinese] 迎面吹来的海风，把一整天的疲惫都吹散了。</d> while her lips remain completely closed.
  ```

#### 形态三：跨镜延续（L-Cut / Cross-Cut Continuity，AB 剪辑绝杀技巧）
在 A 镜自拍时说出前半句，画面硬切到 B 镜大片展示风景时，声音不中断、跨镜头持续念完后半句。
* **规则**：切镜连接处两端均使用 `<scenetrans>`，并明确声明 `continues seamlessly across the cut`。
* **标准范例**：
  ```text
  [Shot 1] ...The woman (S1) says: <d>[Chinese] 你看——</d><scenetrans>
  [Shot 2] At 00:02.500, the camera cuts to a cinematic wide shot of the glowing horizon while her speech continues seamlessly across the cut: <scenetrans><d>[Chinese] ——这里的晚霞多美。</d> while her lips remain completely closed.
  ```

---

### 3. 双人 Vlog 台词交互规范（Dual Dialogue）
* `<Subject 1>` 绑定发言人 ID `(S1)`；
* `<Subject 2>` 绑定发言人 ID `(S2)`；
* 两人在自拍镜头前齐声欢呼时，使用复合 ID `(S1,S2)`：
  ```text
  The two young women (S1,S2) shout cheerfully together into the lens: <d>[Chinese] 祝大家周末愉快！</d>
  ```

---

## 三、v2/T02 自适应镜头时长说明（Classic 基线不变）

以下规则**仅**用于选择了 `Adaptive AB` 或 `Cinematic-led` 的时间规划，不得把上文「六镜每镜 2.500 秒」继续当作所有模式的硬约束。

1. **先镜头职责，后时长**：按叙事分配 A/B 镜头及动作、情绪和对白任务，再分配正数镜长，所有镜头总和等于每个独立生成任务的 **15.000 秒**。
2. **不同镜头可不同长度**：例如 Adaptive 五镜时长 `2.0 + 3.0 + 2.5 + 3.5 + 4.0 = 15.0`，B 镜可以连续出现；Cinematic-led 四镜 `3.5 + 4.0 + 3.5 + 4.0 = 15.0`，以 B 镜为主。以上是**导演文字规划样例，非模型实测支持承诺**。
3. **对白窗口按镜长实际可说话时间估算**：先扣除呼吸、停顿与动作时间；新模式中文约 3–4 字/秒仅为谨慎的起算参考，不能误读为固定模型上限或用它覆盖 Classic 的 6–12 字历史范式。
4. **每次生成任务的时间码独立起算**：2–8 Part 仍逐段使用 `0.000–15.000` 的本地时间码，并另建剪辑全局时间；成片最长 120 秒，不代表单次 H3 能生成 120 秒。
5. **先算素材、再算净时长**：剪辑中按 `retained = out−in` 统计每段真实保留长度；精确 120 秒由 8×15 秒素材构成时，若裁切造成损失，不得仍声称剪后必然是 120 秒。
6. **无 BGM / 不强制神转场**：生成声音字段保持 `non_diegetic_music: N/A`；跨 Part 技巧性转场由 T03B 按叙事可选，不影响 T02 的基本时间轴正确性。

操作顺序与完整校验：见 [`references/timing_engine.md`](timing_engine.md)。Adaptive/Cinematic 的完整 MiniMax H3 提示词模板仍由 T05 交付，本阶段只完善时间与台词预算规范。
