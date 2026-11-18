---
name: vlog-ab-director
description: Direct MiniMax H3 Ref2VA/T2VA cinematic Vlog prompts using an Auto routing step that chooses Classic AB, Adaptive AB, or Cinematic-led. Preserve strict 6-shot 2.5s Classic timing when explicitly requested, with right-hand camera logic, prop continuity, no-BGM audio, Chinese voiceovers, and six-section prompts. Current complete templates support 15s/30s Classic; T02 defines adaptive timing and multipart 15–120s planning, while full adaptive/multipart H3 templates remain staged for T05.
---

# Vlog AB Director (电影感 Vlog 双轨视听导演)

`vlog-ab-director` 是专为生成**高质量、高完播率、抗畸变的电影感生活 Vlog 提示词（特别是 MiniMax H3 全参考 Ref2VA 及 T2VA 模式）**而设计的专业导演 Skill。

它以**“主观自拍（A镜）+ 客观电影拍摄（B镜）”**交替为核心语法，通过**右手专职持机法则、硬切省略哲学、道具守恒定律、2.5 秒黄金节拍器**以及**AI 自动代写地道口语台词**，彻底解决 AI 视频人物动作穿模、手部多指变形、道具瞬移及语速失控等痛点。

---

## v2 / T01：Auto 导演策略路由（默认启用）

**执行优先级：用户明确的镜头/模式要求 > 片长与模型可用能力 > 题材和叙事意图 > Classic 保守回退。** 在制作任何分镜前，必须先读取 [`references/director_strategy.md`](references/director_strategy.md)，根据作品主要叙事目标与用户约束选择唯一策略。**只有 Classic AB 强制固定六镜与严格交替；不能把旧规则套用到所有模式。**

| 结果 | 选用依据 | 执行重点 |
|---|---|---|
| **Classic AB** | 用户指定严格 AB、固定 6 镜、每镜 2.5s，或其他题材信号不足以判断 | 保留 A1-B1-A2-B2-A3-B3、6×2.500s 和旧模板完整兼容性 |
| **Adaptive AB** | 旅行探索、互动、微剧情、自拍与环境镜头需灵活分配；聊天/陪伴侧重 A 镜 | A/B 都有明确职责，比例与排列随故事决定，不把六镜当普遍硬规则 |
| **Cinematic-led** | 人物美学、氛围混剪、景观展示、明确尽量少自拍/口播 | B 镜主导，保留适当 Vlog 叙事在场感，不强迫开场打招呼 |

**补充约束**：
- 古风、仙侠及明确没有手机的世界观，A 镜使用合理的主观近景/随行跟拍，**不生成现代手机**；该约束独立于模式，不强制改为 Classic。
- `POV-led` 仅预留：当前聊天/陪伴类请求先路由到 **Adaptive AB（A 镜优先）**，不要声称第四种模式已完成。
- 用户明确指定 Classic 时，**固定六镜、时间边界、顺序不得被 Auto 覆盖**。互斥要求（如同时指定六镜严格 AB 与完全禁止 A 镜）应指出冲突，而不是暗中丢弃其中一条。
- **生成视频始终无 BGM**，只保留环境声、人声与 Foley，`non_diegetic_music: N/A`；用户要求音乐氛围时只允许另提后期配乐建议。
- **特殊跨 Part 转场不是必需项**。没有合适叙事理由时正常硬切；T03B 才实现依场景推荐与镜头成对设计，不能为增加「神转场」而硬塞镜头。
- 最终成片上限规划为 **120 秒（最多 8 个独立 15 秒 Part）**，；**T02 已补齐多段规划与可变分镜的文字时序规则**，实际人物/道具状态交接留给 T03，Adaptive/Cinematic 完整 Prompt 模板与 3–8 Part 装配留给 T05。**不得误称已能一次生成 120 秒视频或 H3 已实测精确非等长切镜**。
- 默认仍向用户交付可复制的 MiniMax H3 六段式 Prompt，不强制展示内部策略表/QC；当前仅完成策略路由，对未完成的动态模板不得宣称已经实机验证。
- 用户报告已成功的**中文自然语言画外音 + `<d>[Chinese] ...</d>` + `while her lips remain completely closed.`** 是有效兼容写法；完整语音规范在 T04 继续统一，不得仅因没有固定英文短语而误判失败。

---

## v2 / T02：时长、分镜预算与 120 秒多 Part 规划

**步骤 0 确定模式后、正式撰写镜头前，必须读取 [`references/timing_engine.md`](references/timing_engine.md)。** T02 负责可执行的**文字时间轴规划**，不是自动剪辑工具或真实视频生成程序。

- **Classic AB**：单 Part 始终 15.000 秒、六镜、每镜 2.500 秒、A1-B1-A2-B2-A3-B3。原有 15s/30s 模板的镜序和切点不可被 Auto 或节奏优化覆盖。
- **Adaptive AB / Cinematic-led**：先按故事列镜头职责，再决定 A/B 比例、镜数和每镜持续时间，允许连续 A-A 或 B-B，**每个 15s Part 的全部镜长必须精确合计 15.000s**。镜头时长要容纳主要动作、对白窗口与情绪留白，不强制六镜或 2.5s；24fps 时可用整数帧预算再换算毫秒时间码。
- **长片分段**：目标净时长 `0<T≤120s`；用 `ceil(T/15)` 规划 1–8 个独立 **15s 生成任务**。每个 Part 镜头局部时间从 `00:00.000` 重置；另维护全片名义素材位置和剪后累计时间。**本期不支持一次生成 120s**，也不宣称 H3 原生可以一次生成 8/10/12s；这些是预留的未来单任务时长。
- **先算净时长再承诺交付**：逐 Part 用 `edit_out−edit_in` 计算保留时长，再累计成片净时长，需考虑已知裁切/实际重叠。**8×15s=120s 只是素材名义长度**；如果剪辑裁掉部分画面，不能保证剪后仍恰好 120s；遇到不可满足的精确时长应明确指出并给出可行选择。
- **不因长片强制转场**：任意 Part 边界都可 `none` / 自然硬切；本轮**不实现 T03B 特殊转场技巧的成对镜头设计**，也不预设转场损耗。
- **声音与交付**：生成仍无 BGM，`non_diegetic_music: N/A`；台词时长随镜头实际可说话窗口调整（Classic 既有字数规则保留）。**T02 只落地分镜预算与长片规划规则；T05 才交付 Adaptive/Cinematic 的正式六段式完整模板及多 Part Prompt 装配**。时间码是导演意图，不保证 H3 实际逐帧命中。

---

## 核心视听哲学：A 镜与 B 镜

| 维度 | **A 镜：主观自拍 Vlog 视角** | **B 镜：客观电影拍摄视角** |
| :--- | :--- | :--- |
| **机位本质** | 主角右手持机自拍，相机在画面外，无镜像翻转 | 专业外部摄影机第三人称构图，机位客观稳定或电影平移跟拍 |
| **视听心理** | **亲密感与陪伴感**（面对面交流、眼神对视） | **审美感与纵深感**（欣赏人物在环境中的身姿、动态与光影） |
| **景别偏好** | 胸部以上近景、微俯拍自拍、脸颊微距特写 | 全身大景别、低角度仰拍、环境全景、侧颜与背影轮廓 |
| **动态语言** | 带有真实有机的手持呼吸微晃（`Handheld Shake Slightly`） | 电影级横移、低角跟拍、航拍后拉、稳定光栅景深 |
| **核心表达** | 眼神直视镜头、挑眉浅笑、被逗乐笑场、亲昵互动 | 身材比例、衣服流动质感、光影雕刻、从容的步伐与动作定格 |

---

## 5 步工作流（包含步骤 0 Auto 路由）

当用户提出 Vlog 创作需求时，首先执行步骤 0 的 Auto 导演路由，再依次完成后面 4 步；**Classic AB 才强制固定六镜**：

```
[步骤 0: Auto 导演模式选择] ──> [步骤 1: 需求定位与分类] ──> [步骤 2: 状态机与资产锁定] ──> [步骤 3: 节奏与台词规划] ──> [步骤 4: 六段式装配]
```

### 步骤 1：需求定位与分类
1. **画幅选择**：
   - `9:16` 竖屏（1080×1920）：适合抖音、小红书、Reels 手机端爆款；
   - `16:9` 横屏（1920×1080）：适合 B站、YouTube 横屏电影感微短片。
2. **时长模式分类**：
   - **Classic 15 秒单片**：六镜 A-B-A-B-A-B、每镜 2.500 秒；
   - **Classic 30 秒双段**：两个独立 15s 视频生成任务，每段遵循严格 Classic AB；
   - **v2 长片目标**：成片最多 120 秒，由 1–8 个独立 15s Part 规划；T02 已提供逐段时间轴与剪辑净时长账本，**T05 才负责将其装配为完整多段 H3 Prompt**。
3. **角色模式**：
   - **单人模式**：专注单人情绪转换与环境互动；
   - **双人模式**：强调红白双生、前后辈默契、闺蜜反差与视线互动。

### 步骤 2：状态机与资产锁定（五大抗畸变铁律）
*详细规则参阅 `references/rules_state_machine.md`*
1. **右手持机唯一性 / 免持道具浮空随行原则**：
   - **现代自拍**：`<Subject 1>` **右手专职持机**（A 镜举起自拍，B 镜放低贴身侧），**左手专职交互**（撩发、推门、拿咖啡），杜绝双手逻辑混乱；
   - **仙侠/古风无道具**：启用**免持道具浮空随行模式**，A 镜为灵气/第一人称主观近景，双手完全解放拂袖理簪，保留直视对白陪伴感，杜绝突兀镜子道具。
2. **硬切省略哲学（Cut Ellipsis）**：
   - 繁琐动作（脱鞋、穿鞋、装包、掏口袋）**统一在切镜瞬间省略**，切入即为“已完成”状态，避免模型生成肢体穿模。
3. **道具守恒与场景锚点（Prop Conservation & Anchors）**：
   - 场景锚点：脱下的鞋、放下的包、插在伞桶的雨伞固定在场景同一干燥位置，作为背景参照物；
   - 道具闭环：贝壳、拍立得、相纸、黑胶唱片、书籍等关键道具遵循“引入→使用→收纳→复现”的完整物理链。
4. **单段任务资产独立紧凑编号铁律（Per-Task Asset Re-indexing Rule）**：
   - **核心原理**：在 30 秒两段式（Part 1 + Part 2）中，每一段在 MiniMax H3 中都是一个**完全独立的视频生成任务（Task）**。AI 模型是根据该任务实际上传的参考图数量，从 1 开始按顺序匹配 `<Picture 1>`、`<Picture 2>`...；
   - **重编号约束**：若全局有图1人物、图2车库、图3超市，Part 1 上传图1和图2（`<Picture 1>`/`<Picture 2>`）；Part 2 仅上传图1和图3，**则图3在 Part 2 提示词中必须重编号为 `<Picture 2>`**！严禁出现未上传的空编号（如跳写 `<Picture 3>`），彻底杜绝 `Unresolved Reference Label` 报错。
5. **绝对画面防字幕与防UI负向铁律（Zero-Text & Clean Screen Enforcement）**：
   - 彻底解决 AI 视频因包含 `<d>` 对白标签而容易在画面中“烧录字幕、生成乱码水印与虚假UI”的通病；
   - 在提示词的 `detailed_description` 结尾必须永久强制注入（严格遵循空行格式）：
     ```text
     【禁止项】

     文字/UI/水印/Logo/角标/可读文字/真实UI

     【强制声明】

     无背景音乐,仅保留环境音与人声和音效;画面禁字幕/文字/水印/Logo;禁止可读文字(指画面字幕文字,不含人声台词)
     ```

### 步骤 3：黄金节拍器与 AI 台词代写（Mode B）
*详细时序与台词预算参阅 `references/metronome_dialogue_timings.md`*
1. **Classic AB 2.5 秒节拍器（仅此模式强制）**：
   - 15 秒六镜，起点 0.000、2.500、5.000、7.500、10.000、12.500 秒，15.000 秒结束；30 秒的两个 Part 各自局部重置为 0 秒。
   - **Adaptive AB / Cinematic-led**：先决定 A/B 职责与镜数，再按 [`references/timing_engine.md`](references/timing_engine.md) 给每镜分配正数时长，**每段合计 15.000s**；可变时间预算已在 T02 定义，**正式模板仍由 T05 交付**。分镜时间戳不等于模型已实测逐帧执行。
2. **AI 智能代写台词（全自动口语化编排）**：
   - **出镜直言（A镜）**：直视镜头说话，嘴唇同步，生活感强；
   - **闭嘴画外音（B镜）**：允许用户实测有效的自然中文表述，例如 `此时她以画外音心声说道：<d>[Chinese] 果然如入深谷，甚是清净。</d> while her lips remain completely closed.`；英文 `says in an off-screen voiceover:` 可用但**不是必须出现的字面短语**。说话人、声音来源与嘴唇闭合要求必须清楚，T04 将同步完善语音细则。
   - **跨镜延续（L-Cut）**：A 镜说完前半句，B 镜画面切走声音不中断，使用 `<scenetrans>` 跨镜连接；
   - **Classic 2.5s 台词预算**：每镜中文 6–12 字、英文 4–8 词；15 秒内推荐只有 2–3 镜说话，其余镜头留给环境音与动作。**Adaptive/Cinematic 根据每镜可说话窗口预算台词**：先扣除停顿/动作，再以约 3–4 中文字/秒作为审慎的起算建议；T04 再统一完善声音语法。

### 步骤 4：标准化提示词装配输出
输出完整且严密的六段式提示词（默认按照用户要求输出纯中文或英文版本）：
1. `subject_definitions:`
2. `summary:`
3. `retention_analysis:`
4. `detailed_description:`
5. `overall_soundscape:`
6. `non_diegetic_music:`

---

## 模板与参考资源导航

- **默认 Auto 模式与优先级（T01）**：[`references/director_strategy.md`](references/director_strategy.md)
- **T02 已落地分镜时间预算与多 Part 净时长规划**：[`references/timing_engine.md`](references/timing_engine.md)。
- **注意**：现有 15s/30s 模板目前仍仅为 Classic AB 兼容模板；Adaptive/Cinematic 的**正式完整 Prompt 模板及 3–8 Part 装配留给 T05**，不得把 T02 的时间规划示例当成真实 H3 成品模板。


- 状态机与防穿帮法则：`references/rules_state_machine.md`
- 运镜景别与机位词库：`references/camera_ab_grammar.md`
- 黄金节拍器与台词预算规范：`references/metronome_dialogue_timings.md`
- 15 秒单片标准模板：`templates/template_15s_single.md`
- 30 秒双段接力模板：`templates/template_30s_twopart.md`
