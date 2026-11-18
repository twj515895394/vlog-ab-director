---
name: vlog-ab-director
description: Generate production-grade cinematic Vlog video prompts (MiniMax H3 Ref2VA/T2VA) using the proprietary AB-Camera alternating perspective engine. Combines intimate handheld selfie vlogging (A-cam) with cinematic third-person external shots (B-cam), featuring strict right-hand phone-holding logic, hard-cut ellipsis transitions, prop lifecycle tracking, 2.5s metronome pacing, and automatic AI-scripted colloquial dialogue with closed-lips voiceovers and cross-cut audio continuity for 15s single clips or 30s two-part continuous series.
---

# Vlog AB Director (电影感 Vlog 双轨视听导演)

`vlog-ab-director` 是专为生成**高质量、高完播率、抗畸变的电影感生活 Vlog 提示词（特别是 MiniMax H3 全参考 Ref2VA 及 T2VA 模式）**而设计的专业导演 Skill。

它以**“主观自拍（A镜）+ 客观电影拍摄（B镜）”**交替为核心语法，通过**右手专职持机法则、硬切省略哲学、道具守恒定律、2.5 秒黄金节拍器**以及**AI 自动代写地道口语台词**，彻底解决 AI 视频人物动作穿模、手部多指变形、道具瞬移及语速失控等痛点。

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

## 4 步标准化工作流 (Workflow)

当用户提出 Vlog 创作需求时，按以下 4 步进行标准化构建：

```
[步骤 1: 需求定位与分类] ──> [步骤 2: 状态机与资产锁定] ──> [步骤 3: 黄金节拍器与台词代写] ──> [步骤 4: 标准化提示词装配]
```

### 步骤 1：需求定位与分类
1. **画幅选择**：
   - `9:16` 竖屏（1080×1920）：适合抖音、小红书、Reels 手机端爆款；
   - `16:9` 横屏（1920×1080）：适合 B站、YouTube 横屏电影感微短片。
2. **时长模式分类**：
   - **类型一：15 秒灵动单片（15s Single-Clip Mode）**：恒定 6 镜，单镜 2.500 秒，单片即高潮；
   - **类型二：30 秒叙事长篇（30s Two-Part Continuity Mode）**：分为 Part 1 与 Part 2 两个独立 15s 视频（各 6 镜），带跨段状态继承与光影自然流转。
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
1. **2.5 秒黄金节拍器**：
   - 单段 15.00 秒恒定切分为 6 镜，严格递增时间戳：`0.00–02.500`、`At 00:02.500`、`At 00:05.000`、`At 00:07.500`、`At 00:10.000`、`At 00:12.500`。
2. **AI 智能代写台词（全自动口语化编排）**：
   - **出镜直言（A镜）**：直视镜头说话，嘴唇同步，生活感强；
   - **闭嘴画外音（B镜）**：必须标注 `says in an off-screen voiceover: <d>[Language] ...</d> while her lips remain completely closed.`；
   - **跨镜延续（L-Cut）**：A 镜说完前半句，B 镜画面切走声音不中断，使用 `<scenetrans>` 跨镜连接；
   - **严格字数预算**：2.5 秒内中文台词**严格控制在 6~12 个汉字以内**（英文 4~8 词），保证语速舒缓自然；15 秒内仅安排 2~3 镜说话，其余镜头保留呼吸声、欢笑与环境音。

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

- 状态机与防穿帮法则：`references/rules_state_machine.md`
- 运镜景别与机位词库：`references/camera_ab_grammar.md`
- 黄金节拍器与台词预算规范：`references/metronome_dialogue_timings.md`
- 15 秒单片标准模板：`templates/template_15s_single.md`
- 30 秒双段接力模板：`templates/template_30s_twopart.md`
