---
name: vlog-ab-director
description: 以人物为主体的短视频题材与轻剧情创意共创、MiniMax H3导演Skill。从零点子、人设或模糊想法发散题材与故事，多轮融合、确认Creative Brief；明确需求可直接进入Classic/Adaptive/Cinematic策略，最长300秒成片、有限独立15秒任务，人物道具连续性、可选转场、中文VO、无BGM及QC。
---

# Vlog AB Director (电影感 Vlog 双轨视听导演)

`vlog-ab-director` 是面向 **以人物为主体的15–300秒轻剧情、弱剧情及非剧情审美短视频** 的创意策划与视听导演 Skill，支持从零点子多轮共创，也支持直接制作 MiniMax H3 Ref2VA/T2VA 提示词。

它以**“主观视点（A镜）+ 客观电影运镜（B镜）”**交替为底层视听语法，通过**右手专职持机法则、免持物浮空随行模式、硬切省略哲学、道具守恒定律、2.5 秒黄金节拍器、AI 口语化台词代写**以及**空行级绝对防字幕负向约束**，降低 AI 视频人物动作穿模、手部多指变形、道具瞬移、台词语速失控与画面乱码烧录字幕等问题的发生风险。

---

## v2.1 / CE：创意策划与轻剧情共创（先于步骤 0）

收到短视频创作需求时，**必须先读取 [Creative Director](references/creative/creative_director.md)**，识别 idea_maturity 和 request_goal。定位以人物为主体的轻剧情、弱剧情与非剧情审美短视频，Vlog 只是其中一种表现形式。

- **ZERO / CHARACTER_ONLY**（没有点子 / 只有人设或参考图）：主动提供3–5个真正不同、可拍的创意提案（用户指定数量优先）。读取 [题材库](references/creative/genre_library.md) 和按需的 [组合引擎](references/creative/creative_combination_engine.md)、[叙事结构](references/creative/micro_story_structures.md)、[种子库](references/creative/creative_seed_library.md)、[关系](references/creative/character_interaction_library.md)、[情绪](references/creative/emotional_arc_library.md)。素材未知不虚构，少量聚焦提问而非问卷。每条有具体人物行为/视觉主题、记忆点、时长及难度，不只列题材名。
- **VAGUE**（模糊想法）：保留用户的创意核心，按需细化或提出多个变体；不强迫情节、冲突或反转。
- **READY**（明确任务/完整剧本）：用户已要求直接生成时，构建最小 Creative Brief 后跳过发散，确认类型为 direct_ready；不要求重复确认。用户只要创意、剧本或简案则停止在对应产物。
- **多轮讨论**必须遵循 [共创协议](references/creative/collaborative_discussion.md)：保留已锁定约束、候选ID、排除项、修订版本；支持比较、融合、改结局、否决与重新发散。用户说“喜欢B”或只回答偏好问题的“OK”不是授权生成；确认当前简案并要求制作，或明确委托直接出成品，才能交接。核心变化撤销旧确认，若用户同时授权新版本则可直接推进；仅修改执行细节走原导演层。
- **制作门禁**：先按 [Creative Brief](references/creative/creative_brief.md) 形成简案，执行 [Creative QC](references/creative/creative_quality_control.md) 九项硬门禁、十项软检查。只有当前revision获确认/委托、制作意图明确且硬项已解决才进入 ED 叙事组织及 T01。未授权或仅讨论阶段不得输出最终H3六字段。非剧情审美可保持无冲突、无对白；人物旅拍以体验为主，不堆空镜。
- 进入制作后，先执行ED叙事组织再遵循T01–T06；用户明确的Classic/画幅/逐字台词/无手机等硬约束不变，最长300秒成片、有限独立15s素材任务、净时长预算、真实参考资产、中文VO、无BGM、转场默认仅建议均保留。既有导演策略不按题材机械映射。简案是内部交接，不是第七个H3字段。

---

## v2.2 / ED：叙事组织与 Editing Auto（创意确认后、T01之前）

**必须读取 [Editing Director](references/editing/editing_director.md)、[Narrative Architect](references/narrative/narrative_architect.md) 及 [Editing Auto](references/editing/editing_auto_strategy.md)**，根据真实剧本选择叙事组织，而非替换原轻剧情Vlog。

- **CONTINUOUS**：连续轻剧情、日常/情侣互动等有顺序动作链时优先；故事、生成依赖、播放可同序，逐镜及跨任务严格消费T03出入状态，简单输出不强制重排/蒙太奇。
- **EDITED**：故事需要省略、回忆、平行、蒙太奇等，按真实事件组织素材并在后期选择/重排；其中连续边界仍严格承接。
- **HYBRID**：局部连续场景按T03承接，章间有理由的时间/地点跳跃、插入等按Story状态及观众线索核对。
- 三者与Classic/Adaptive/Cinematic摄影策略独立，用户明确连续或剪辑约束优先，不按题材/时长强制分流。15秒可蒙太奇，300秒可全部连续。技术上独立生成不代表剧情解耦。连续链记录依赖，实机按真正保留切点修订后续Prompt。
- 普通剪法由Agent自主选择，按[决策机制](references/editing/editing_decision_engine.md)检索八类59张剪辑卡，现有46种特殊转场仍按[T03B适配](references/editing/transition_adapter.md)授权；只建议不改Prompt，不为炫技强制手法。
- [素材预算](references/editing/footage_planning.md)：成片0<T≤300秒、单任务15秒不变，20任务仅为300秒无损新素材下界，不是总任务上限；按用户预算给有限N、主素材/覆盖/备选。已有素材仅使用真实登记。
- [三轴EDL](references/editing/editing_timeline.md)及[后期方案](references/editing/post_production_plan.md)：单段/简单连续多段原样；复杂重排、插镜、裁切、声画拆分才给具体预剪表。未生成只能给计划，不能声称实测。分批交付必须如实标总任务与待交付。
- 所有成品最终执行 [Editing QC](references/editing/editing_quality_control.md) 与T06；创意未获确认或只要建议时不得越权制作。改变核心剧情返回REOPEN。

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
- 最终成片上限为300秒；每次H3独立15秒，有限素材预算，不承诺一次生成长片。原120秒八段示例保留，连续Vlog不因扩容而重排。
- 默认仍向用户交付可复制的 MiniMax H3 六段式 Prompt，不强制展示内部策略表/QC；当前仅完成策略路由，对未完成的动态模板不得宣称已经实机验证。
- 用户报告已成功的**中文自然语言画外音 + `<d>[Chinese] ...</d>` + `while her lips remain completely closed.`** 是有效兼容写法；完整语音规范已在 T04 统一，不得仅因没有固定英文短语而误判失败。

---

## v2 / T02：时长、分镜预算与300秒成片规划

**步骤 0 确定模式后、正式撰写镜头前，必须读取 [`references/timing_engine.md`](references/timing_engine.md)。** T02 负责可执行的**文字时间轴规划**，不是自动剪辑工具或真实视频生成程序。

- **Classic AB**：单 Part 始终 15.000 秒、六镜、每镜 2.500 秒、A1-B1-A2-B2-A3-B3。原有 15s/30s 模板的镜序和切点不可被 Auto 或节奏优化覆盖。
- **Adaptive AB / Cinematic-led**：先按故事列镜头职责，再决定 A/B 比例、镜数和每镜持续时间，允许连续 A-A 或 B-B，**每个 15s Part 的全部镜长必须精确合计 15.000s**。镜头时长要容纳主要动作、对白窗口与情绪留白，不强制六镜或 2.5s；24fps 时可用整数帧预算再换算毫秒时间码。
- **长片分段**：0<T≤300秒；无复用新素材无损下界ceil(T/15)，实际任务按有限素材预算。每任务0–15s局部闭合；故事、生成、剪辑三轴可以同序也可不同。不能声称H3一次生成长片或已支持原生8/10/12秒。
- **先算净时长再承诺交付**：按实际保留区间与EDL计算净时长，普通硬切无预设损耗；20×15=300秒零余量，裁切需补镜或短版。额外素材显式预算，复用须叙事理由，声音重叠不扣画面长度。
- **不因长片强制转场**：任意 Part 边界都可 `none` / 自然硬切；T03B 已实现**按场景可选的导演决策与被采纳时的双端镜头规划规则**；未选用时不预设转场损耗。
- **声音与交付**：生成仍无 BGM，`non_diegetic_music: N/A`；台词时长随镜头实际可说话窗口调整（Classic 既有字数规则保留）。**T02 只落地分镜预算与长片规划规则；T05 已交付 Adaptive/Cinematic 六段式模板与多 Part 装配规则**。时间码是导演意图，不保证 H3 实际逐帧命中。

---

## v2 / T03：镜头状态机与多 Part 连续性交接

**在 T01 选定导演策略、T02 分配好每镜时长后，编写镜头和跨 Part Prompt 前，必须读取 [`references/continuity_handoff.md`](references/continuity_handoff.md)，并结合 [`references/rules_state_machine.md`](references/rules_state_machine.md)。**

- **每镜三态闭合**：内部先列 `entry_state → visible_action → exit_state`。锁定 `character_id`、身份/服饰、姿态/位置、`camera_mode`、各角色左右手、`prop_id` 与唯一所在位置、`scene_id`、固定锚点和光照；镜内只安排时长允许的真实动作。
- **镜间切点事件**：如果下一镜切入时已经收伞、装包、进门或举起自拍手机，明确 `cut_event` 的 `before → after`。**合法硬切省略是允许的，但不能把同一道具无事件瞬移、变色或复制**。
- **手部资源约束**：有实际现代自拍手机的主角通常右手持机、左手交互；同手不能同时拿两个互斥道具。纯第三人称 Cinematic、古风或用户明确不要手机时，**不编造手机**；配角分别建自己的手部状态。肩背包不当然占用手。
- **逐边界承接**：CONTINUOUS及HYBRID连续链严格T03，前段保留出点→后段入点；独立时域/联想/回忆按Story状态版本与合法事件核对，禁止无事件瞬移。每个实际播放边界或生成连续依赖都需检查；不因编号相邻强制承接，也不因任务独立强制断开。
- **场景锚点不瞬移**：放在唱片店伞桶的伞必须留在唱片店；湖边镜头无需显示旧店伞桶。相同人物跨场景可改变光照、姿势和衣着，但**改变必须有可解释事件**，身份与关键道具外观不能凭空替换。
- **参考图逐任务重编号**：为每个独立 15s Part 建立实际上传的 `asset_id → <Picture N>` 映射；所引用的图必须存在于**当前任务**，编号从 1 起连续。P2 只上传全局角色图 A 与场景图 C 时，C 必须是 `<Picture 2>`，绝不能沿用全局资产序号写 `<Picture 3>`。无图的 T2VA 不伪造 Picture 引用。
- **不强制特殊转场**：T03 负责合法物理/叙事交接，T03B 已增加按场景评估的 `none / suggest_only / planned_pair` 路由；只有用户明确采纳或明确授权导演实际安排时才成对改写镜头，**不是每个 Part 的固定要求**。
- **输出边界**：上述状态表属于 Skill 的内部规划，**不是 H3 的新增顶层字段**。用户默认仍拿到完整六段式 Prompt，必要时附当前 Part 的上传清单和交接摘要，详细状态表仅按需展示。生成阶段继续**无 BGM**；多段完整 H3 装配已在 T05 接入，真实模型动作/口型效果需在 T07 验证。

**状态交接样例**：[`templates/segment_handoff_example.md`](templates/segment_handoff_example.md)；**正反测试**：[`tests/continuity-cases.md`](tests/continuity-cases.md)。

---

## v2 / T03B：场景驱动的可选创意转场（按需推荐）

**每个实际播放边界的状态规划完成后，必须读取 [`references/transition_director.md`](references/transition_director.md)，并按需查询 [`docs/transition-techniques-library-v2.md`](docs/transition-techniques-library-v2.md) 的 46 种拍摄/剪辑技巧。** T03B 的转场是**导演建议和授权使用后的成对镜头设计**，不是固定模板效果，也不是每个 Part 的必需动作。

- **先比较普通硬切**：如果对话连贯、情绪需要留白、动作/地点切换自然，直接 `none`；不用因片长或任务数强制安排神转场。
- **Auto 默认仅建议**：场景中真实存在可匹配的树干/人物遮挡、同向运镜、连续动作、同形物体、水面/门洞/倒影等，且对叙事有价值时，通常使用 `suggest_only`，在完整 Prompt **之外**给出简短可选技巧与理由，**不修改任意 Part 的尾镜和首镜**。
- **只在用户明确选用或授权导演直接应用时才 `planned_pair`**：同时设计前 Part **最后一镜 outgoing**、后 Part **第一镜 incoming**，确保摄影机高度、方向/速度、画面遮挡/纹理、动作相位、实际硬切剪点、人物道具/参考资产交接、编辑裁切预算、风险与失败回退都相容。
- **典型技巧**：遮挡擦镜 OC、运镜甩镜 CM、动作接力 AC、构图/形状匹配 GM、水面/门框/镜面穿越 PT、真实失焦/倒影 OT。**排除淡入淡出、交叉叠化、软件预设闪白/故障效果**；不将纯音频 J/L Cut 伪装成拍摄神转场。
- **高风险与固定约束**：像水池穿越 PT01 这种复杂技巧，需要两段独立镜头在水纹覆盖处真正硬切，不能声称 H3 自动跨空间一镜到底。Classic 的六镜、2.5s 时点和用户指定内容不能强改；若会破坏物理连续性或剪后精确目标时长的预算，回退为 `suggest_only` 或 `none`。
- **始终不生成 BGM**：只允许环境音、人声、Foley；`non_diegetic_music: N/A`。人物画外音的合法中文自然写法继续保留，不为转场更改已验证口型语义。
- **能力边界**：本阶段已定义转场选择及双端规划契约，**多任务 H3 Prompt 模板装配已在 T05 接入**；效果还未经过 MiniMax H3 实机验证。默认输出仍以可复制 Prompt 为主，详细状态与 QC 按需给出。

**内部交接必须符合**：[`references/continuity_handoff.md`](references/continuity_handoff.md) 第 10 节；参考案例：[T03B 转场边界规划样例](templates/transition_boundary_examples.md)；回归测试：[T03B 转场用例](tests/transition-cases.md)。

---

## v2 / T04：声画/对白导演（中文 VO、L/J-Cut 与无 BGM）

**在 T02 镜头时间预算、T03 人物/道具状态和 T03B 可选转场决策确定后，写 H3 Prompt 的声音部分前必须读取 [`references/audio_director.md`](references/audio_director.md)，并参考 [`references/metronome_dialogue_timings.md`](references/metronome_dialogue_timings.md)。**

- **先绑定发言者再排台词**：每句确定 `S1/S2`、镜头位置、发声起止、声源与嘴唇要求；画内嘴部可见且说话应 `sync_lips`，画外心声且嘴部可见应 `closed_lips`，嘴部不可见则 `not_visible`。同一发言者同一时刻不能既张口说话又完全闭嘴，**B 镜也允许角色正常画内对话**。
- **保留中文实测 VO**：`此时她以画外音心声说道：<d>[Chinese] 果然如入深谷，甚是清净。</d> while her lips remain completely closed.` 是用户报告已实测有效的兼容句式。英文 `says in an off-screen voiceover:` **不是必需的固定短语**；不能只因缺少该英文句就拒绝中文 VO。
- **L-Cut/J-Cut 是明确的声音时间关系**：L-Cut 为声音延续到后镜；J-Cut 为后镜声音提前进入前镜。要写清谁发声、哪一镜可见、视觉切点及声音起止，防止重复发声或口型串人。`<scenetrans>` 仅是尚待 T07 验证的历史候选标签，**不强制插入**。
- **跨独立 Part 不能假装自动续音**：两个 15 秒 H3 任务互不共享生成音轨，跨 Part 的 J/L-Cut 需要在**后期混音/重配声**，不可仅靠 Prompt 承诺无缝。T03 的 `audio_carry` 记录 speaker_id、事件和剪辑要求，T05 已接入装配规则。
- **对白按时间预算**：Classic 2.5s 中文 6–12 字、2–3 镜发言是旧版经验参考；Adaptive/Cinematic 按实际说话窗口减去动作与停顿，再以约 3–4 字/秒作保守起始估算。允许全片零台词。多人按轮次绑定 S1/S2，不自动齐声讲话。
- **绝对无 BGM（D3）**：每个 Part 的 `detailed_description` 保留原「无背景音乐」与防字幕负向块；`overall_soundscape` 只写环境音、人声和 Foley；`non_diegetic_music: N/A`。用户要求音乐卡点时，仅在 **Prompt 外**提供后期剪辑/配乐建议，**不能向生成模型要求配乐**。
- **阶段边界**：T04 已接入文本声画规则与静态回归例，**并不代表 H3 实机已实现口型同步、跨镜标签可靠或跨任务自动混音**；Adaptive/Cinematic 多段完整成品 Prompt 已在 T05 接入装配，T07 再实际渲染验证。

**回归测试**：[T04 Audio Cases](tests/audio-cases.md)。此内部声画计划不增加 H3 顶层第七个字段，仍输出现有六段式 Prompt。

---

## 核心视听哲学：A 镜与 B 镜

| 维度 | **A 镜：主观视角 (POV / Selfie)** | **B 镜：客观电影视角 (Cinematic External)** |
| :--- | :--- | :--- |
| **机位本质** | **现代**：主角右手持机自拍；<br>**古风/仙侠**：仙灵/第一人称浮空随行跟拍 | 专业外部摄影机第三人称构图，机位客观稳定或电影级平移跟拍 |
| **心理价值** | **陪伴感与亲密感**（眼神直视对白、面对面分享秘密、生活呼吸感） | **审美感与纵深感**（欣赏人物身姿比例、环境全景纵深、电影级光影雕刻） |
| **景别偏好** | 胸部以上近景、微仰角、微俯角、眼颊微距特写 | 外部全身中全景、低角度仰拍全身、侧颜走廊、大远景航拍 |
| **动态语言** | `带有微弱自然的呼吸起伏与手持微晃 (Handheld Shake Slightly)` | `平稳水平横移 (Trucks)`、`低角度推近跟拍 (Pushes In)`、`大远景后拉 (Pulls Out)` |
| **核心表达** | 眼神直视镜头、挑眉浅笑、被逗乐笑场、喝茶轻叹 | 身材比例、裙摆/发丝流动质感、迈步力量感、从容背影定格 |

---

## 工作流：Creative Engine → Editing Auto → 步骤 0–5

```text
[CE: 创意讨论 / 已明确任务直通 → 当前简案QC及制作授权] ──> [步骤 0: Auto 导演模式选择] ──> [步骤 1: 需求定位与分类] ──> [步骤 2: 状态机与资产锁定] ──> [步骤 3: 节奏与台词规划] ──> [步骤 4: 六段式装配] ──> [步骤 5: 统一QC]
```

### 步骤 1：需求定位与分类
1. **画幅选择**：
   - `9:16` 竖屏（1080×1920）：适配抖音、小红书、Reels 手机端爆款；
   - `16:9` 横屏（1920×1080）：适配 B站、YouTube 横屏电影感微短片。
2. **时长模式分类**：
   - **Classic 15 秒单片**：六镜 A-B-A-B-A-B、每镜 2.500 秒；
   - **Classic 30 秒双段**：两个独立 15s 视频生成任务，每段遵循严格 Classic AB；
   - **v2 长片目标**：成片最多300秒，每任务独立15秒，有限素材预算；T02 已提供逐段时间轴与剪辑净时长账本，**T05 已接入完整多段 H3 Prompt 装配规则**。
3. **角色模式**：
   - **单人模式**：专注单人情绪转换与生活环境交互；
   - **双人模式**：强调默契互动、闺蜜反差与视线交流。

### 步骤 2：状态机与资产锁定（五大抗畸变铁律）
*详细规则参阅 [`references/rules_state_machine.md`](references/rules_state_machine.md) 及 [`references/continuity_handoff.md`](references/continuity_handoff.md)；**先建立每镜 entry/action/exit 和跨段 handoff，再将合理的可见动作写进 Prompt**。*
1. **右手持机唯一性 / 免持道具浮空随行原则**：
   - **现代自拍**：`<Subject 1>` **右手专职持机**（A 镜举起自拍，B 镜放低贴身侧），**左手专职交互**（撩发、推门、拿咖啡），杜绝双手逻辑抢占；
   - **仙侠/古风无道具**：启用**免持道具浮空随行模式**，A 镜为灵气/第一人称主观近景，双手完全解放拂袖理簪，保留直视对白陪伴感，杜绝突兀镜子道具。
2. **硬切省略哲学（Cut Ellipsis）**：
   - 繁琐动作（脱鞋、穿鞋、装包、掏口袋）**统一在切镜瞬间省略**，切入即为“已完成”状态，避免模型生成肢体穿模。
3. **道具守恒与场景锚点（Prop Conservation & Anchors）**：
   - 场景锚点：脱下的鞋、放下的包、插在伞桶的雨伞固定在场景同一干燥位置，作为背景参照物；
   - 道具闭环：贝壳、拍立得、相纸、黑胶唱片、书籍等关键道具遵循“引入→使用→收纳→复现”的完整物理链。
4. **单段任务资产独立紧凑编号铁律（Per-Task Asset Re-indexing Rule）**：
   - **核心原理**：在 30–300秒多任务规划中，每一段在 MiniMax H3 中都是一个**完全独立的 15 秒视频生成任务（Task）**，30 秒两段式只是经典兼容示例。AI 模型是根据该任务实际上传的参考图数量，从 1 开始按顺序匹配 `<Picture 1>`、`<Picture 2>`...；
   - **重编号约束**：若全局有图1人物、图2车库、图3超市，Part 1 上传图1和图2（`<Picture 1>`/`<Picture 2>`）；Part 2 仅上传图1和图3，**则图3在 Part 2 提示词中必须重编号为 `<Picture 2>`**！不得引用本次未上传的 `<Picture 3>`；无图的任务不编造 Picture 引用。完整映射和检查见 [`references/continuity_handoff.md`](references/continuity_handoff.md)。
5. **绝对画面防字幕与防UI负向铁律（Zero-Text & Clean Screen Enforcement）**：
   - 降低 AI 视频因包含 `<d>` 对白标签而容易在画面中“烧录字幕、生成乱码水印与虚假UI”的通病；
   - 默认在提示词的 `detailed_description` 结尾必须注入（严格遵循独立空行排版格式）：
     ```text
     【禁止项】

     文字/UI/水印/Logo/角标/可读文字/真实UI

     【强制声明】

     无背景音乐,仅保留环境音与人声和音效;画面禁字幕/文字/水印/Logo;禁止可读文字(指画面字幕文字,不含人声台词)
     ```
   - 若用户明确要求实体场景文字，仅按 H3 Adapter 4.1 替换为限定负向块，仍禁止字幕/浮层/UI/水印；不要同时全禁可读文字。

### 步骤 3：黄金节拍器与 AI 台词代写（Mode B）
*详细时序与台词预算参阅 [`references/metronome_dialogue_timings.md`](references/metronome_dialogue_timings.md)；声音与口型统一遵循 [`references/audio_director.md`](references/audio_director.md)。*
1. **Classic AB 2.5 秒节拍器（仅此模式强制）**：
   - 15 秒六镜，起点 0.000、2.500、5.000、7.500、10.000、12.500 秒，15.000 秒结束；30 秒的两个 Part 各自局部重置为 0 秒。
   - **Adaptive AB / Cinematic-led**：先决定 A/B 职责与镜数，再按 [`references/timing_engine.md`](references/timing_engine.md) 给每镜分配正数时长，**每段合计 15.000s**；可变时间预算已在 T02 定义，**正式模板已由 T05 交付**。分镜时间戳不等于模型已实测逐帧执行。
2. **AI 智能代写台词（全自动口语化编排）**：
   - **画内直言（A 镜常见、B 镜也合法）**：清楚绑定 S1/S2，说话时嘴型同步，其他人自然倾听，不得把所有 B 镜画内对白误判为画外音；
   - **闭嘴画外音（B 镜常见）**：用户报告已实测有效的 `此时她以画外音心声说道：<d>[Chinese] 果然如入深谷，甚是清净。</d> while her lips remain completely closed.` 是合法格式；英文 `says in an off-screen voiceover:` **非必填**。可见嘴部才要求闭嘴，不入画时不强求同步口型；不能与同镜画内说话冲突。
   - **L-Cut / J-Cut**：L-Cut 是前镜声音切到后镜仍继续；J-Cut 是后镜声音提前在前镜出现。两者要明确发言者、起止、视觉切点、可见口型；旧标签 `<scenetrans>` 仅兼容候选，**不能当作必需或实测保证**。**跨两个独立 Part 的声音桥必须依赖后期混音/接声**。
   - **对白/留白**：Classic 2.5s 旧版经验约中文 6–12 字/英文 4–8 词、15 秒约 2–3 镜开口；但并非强制台词数量。Adaptive/Cinematic 先扣除动作和停顿，按实际可讲话时间预算（中文约 3–4 字/秒作估算）；**可以全段不说台词**，也不擅自改用户指定的逐字台词。

### 步骤 4：T05 MiniMax H3 六字段装配与输出视图

**必须读取 [H3 Adapter](references/model_h3_adapter.md)**，按步骤 0–3 已确认的策略、每个 Part 的时间轴、人物状态、资产、转场决策及声音计划，逐任务装配以下六字段，每字段仅一次：

1. `subject_definitions:`
2. `summary:`
3. `retention_analysis:`
4. `detailed_description:`
5. `overall_soundscape:`
6. `non_diegetic_music:`（下一行严格 N/A）

- **模板路由**：15s/30s Classic 使用兼容模板，Adaptive 使用 15s/30s 自适应模板；Cinematic-led 使用独立全 B / 可无台词示例；3–8 Part 统一使用多段动态装配规则，按实际导演模式重新组织每段，不照搬示例故事。
- **Ref2VA/T2VA**：有图时按当前实际上传顺序定义 Picture N，外部附实际上传清单；无图时完整文字定义，不使用 Picture 引用或 reference generation 标记。每个独立任务局部 Shot 与时间码重置，从 0 到15s。
- **完整交付**：不含未替换示例占位符，不用“同上”或省略号代替任何字段/Part；每段重新描述身份、服装、道具、场景、声画与出入镜状态。合法 Shot、语言标签与实际素材引用不属于占位符。跨 Part 参考图不是自动继承。
- **负向规则**：默认原防字幕/无 BGM 块；仅用户明确需要实体招牌等真实场景文字时，按 Adapter 4.1 使用限定例外，仍禁浮层字幕/UI/水印/Logo，提示生成文字失真风险。所有模式无 BGM。
- **边界选择**：planned_pair 经授权后将两端摄影动作分别写入实际 Prompt；suggest_only 仅外部备注，不修改任何 Prompt；none 正常剪接，保持 T03 handoff 与 T02 净时长账本。
- **输出视图**：Standard 单段完整可复制 text 块；Multi-Part 逐段独立 text 块、必要上传顺序与交接提示；Director Detail 仅按需附详细时间/状态/声音/转场/QC。后期音乐、剪切、风险与未采纳建议在代码块外。
- **交付前必须执行步骤 5 的统一 QC**；不能把文本合规当作模型实际渲染通过。

---

### 步骤 5：T06 统一质量门禁（所有模式、所有 Part 必须执行）

**必须读取 [quality_control.md](references/quality_control.md)**。以实际用户约束及 T01–T05 的导演计划、状态表、当前任务上传清单和最终 Prompt 为依据，执行 H01–H15 硬门禁、S01–S10 软风险检查。硬性失败先修复再复核受影响镜头和相邻 Part，不能用软性评分抵消错误；缺必要输入或互斥约束未解时明确指出，不能编造通过结论。

重点：局部 15 秒时间闭合、Classic 六镜兼容、独立资产编号、人物/手/道具守恒、中文 VO 音画语义、无 BGM、六字段完整、真实场景文字的限定例外、≤300秒成片、有限任务预算与净时长账本。none/suggest_only 不强制特殊转场；planned_pair 才检查双端、剪点、授权与回退。Cinematic 全 B、零台词均合法。

默认只交付通过文本 QC 的完整 Prompt 与必要上传/交接/重要风险提示；详细 QC 仅按需展示。区分 S（结构）、L（语义审查）、E（用户单例经验）、V（真实视频）。仓库可执行静态回归脚本 `node tests/qc-check.mjs`；不把该结果当成任意自然语言或 H3 渲染的可靠性证明。T07 实机须按 [验证协议](docs/h3-validation-protocol.md) 提供真实样本才可升级正式版本。

---

## 模板与参考资源导航

- **ED 叙事组织及剪辑**：[Narrative Architect](references/narrative/narrative_architect.md)、[Editing Auto](references/editing/editing_auto_strategy.md)、[素材预算](references/editing/footage_planning.md)、[EDL](references/editing/editing_timeline.md)、[Editing QC](references/editing/editing_quality_control.md)；[详细设计](docs/design-v2.2-editing-director.md) / [实施计划](docs/implementation-plan-v2.2-editing-director.md)。

- **CE 创意入口与讨论**：[creative_director.md](references/creative/creative_director.md)、[collaborative_discussion.md](references/creative/collaborative_discussion.md)；[Creative Brief](references/creative/creative_brief.md)、[创意QC](references/creative/creative_quality_control.md)。
- **CE 资料与组合**：[题材](references/creative/genre_library.md)、[叙事](references/creative/micro_story_structures.md)、[种子](references/creative/creative_seed_library.md)、[人物关系](references/creative/character_interaction_library.md)、[情绪](references/creative/emotional_arc_library.md)、[组合机制](references/creative/creative_combination_engine.md)。[设计](docs/design-v2.1-creative-engine.md) / [计划](docs/implementation-plan-v2.1-creative-engine.md) / [创意回归](tests/creative-cases.md)。

- **默认 Auto 模式与优先级（T01）**：[`references/director_strategy.md`](references/director_strategy.md)
- **T02 分镜时间预算与多 Part 净时长规划**：[`references/timing_engine.md`](references/timing_engine.md)。
- **T03 每镜状态/道具守恒/跨 Part handoff**：[`references/continuity_handoff.md`](references/continuity_handoff.md)。
- **T03 交接样例与正反测试**：[`templates/segment_handoff_example.md`](templates/segment_handoff_example.md)、[`tests/continuity-cases.md`](tests/continuity-cases.md)。
- **T03B 可选转场导演（只有选用才成对改写镜头）**：[`references/transition_director.md`](references/transition_director.md)；[46 种技巧库](docs/transition-techniques-library-v2.md)；[回归测试](tests/transition-cases.md)。
- **T04 声画与对白导演（无 BGM、中文 VO、J/L-Cut）**：[`references/audio_director.md`](references/audio_director.md)；[回归用例](tests/audio-cases.md)。
- **T05 H3 装配器**：[model_h3_adapter.md](references/model_h3_adapter.md)；[15s Adaptive](templates/template_15s_adaptive.md)、[30s Adaptive](templates/template_30s_adaptive_twopart.md)、[15s Cinematic-led](templates/template_15s_cinematic.md)、[多任务装配及120秒八段兼容示例](templates/template_multipart_15s_sequence.md)。旧 Classic 模板保留固定六镜并改用无占位符完整样例。


- **T06 质量门禁与测试**：[quality_control.md](references/quality_control.md)、[qc-check.mjs](tests/qc-check.mjs)；[T07 实机验收协议](docs/h3-validation-protocol.md)。
- 状态机与防穿帮法则：[`references/rules_state_machine.md`](references/rules_state_machine.md)
- 运镜景别与机位词库：[`references/camera_ab_grammar.md`](references/camera_ab_grammar.md)
- 黄金节拍器与台词预算规范：[`references/metronome_dialogue_timings.md`](references/metronome_dialogue_timings.md)
- 15 秒单片标准模板：[`templates/template_15s_single.md`](templates/template_15s_single.md)
- 30 秒双段接力模板：[`templates/template_30s_twopart.md`](templates/template_30s_twopart.md)
