# Vlog AB Director v2 分阶段实施计划

> 状态：**In Progress / 分阶段实施中**（2026-11-18：T00、T01、T02、T03、T03B、T04、T05 已提交；T06–T07 尚未实施；H3 实机尚未验证）  
> 制定日期：2026-11-18  
> 设计依据：[v2 详细设计（已确认）](design-v2-director-engine.md)  
> 目标仓库：`twj515895394/vlog-ab-director` / `main`  
> 本计划既是阶段实施依据，也记录已完成阶段的进展；代码库当前已按 T01–T03B 修改 Skill 入口与参考规则，但尚未执行视频实机验证。  
> 优先级：**保持 v1 已验证有效行为 > 新功能扩展 > 表述美化**。

## 1. 决策冻结基线与范围

| ID | 决策 | 必须遵守的验收口径 |
|---|---|---|
| D1 | Auto 为默认导演模式 | 根据题材选择 Classic AB / Adaptive AB / Cinematic-led；用户可显式选择 Classic |
| D2 | 15s 生成单元、最长 120s 成片（追加扩展） | 15/30 秒兼容；最多 8 个独立 15s Part，规划 45–120 秒长片；不宣称 H3 一次生成 120 秒或原生支持任意时长 |
| D3 | 生成阶段一律无 BGM | 允许环境音、人声、画外音和 Foley；`non_diegetic_music: N/A`；需要音乐时，仅给后期剪辑建议 |
| D4 | 默认输出完整 Prompt | 多段只附必要任务清单/交接信息，状态表及 QC 详情按需展开 |
| D5 | Part 边界转场仅按场景可选建议 | 可为 none / suggest_only / planned_pair；绝不因 Part 数量强制使用神转场，不推荐淡入淡出、叠化或模板特效 |

**画外音专项回归基线**：保留用户已实测可用的中文表达：
`此时她以画外音心声说道：<d>[Chinese] 果然如入深谷，甚是清净。</d> while her lips remain completely closed.`

不允许将是否出现固定英文 `says in an off-screen voiceover:` 作为唯一通过标准。

## 2. 实施策略与提交约束

- 以当前 `main` 上的 v1 为基线；**小步、可验证、可回退**，不一次性重写所有 Markdown 文件。
- 每个 Ticket 只处理明确范围，完成前跑对应文本回归并核对 D1–D5；建议每 Ticket 单独提交或 PR，验收后进入下一 Ticket。
- `SKILL.md` 为执行入口，`SKILL.cn.md` 保持语义同步；`references/` 放约束与决策依据；`templates/` 放可复制的模型模板；`examples/` 和 `tests/` 记录标准测试。
- 对外不声称 H3 精确按帧执行镜头、自动识别所有题材或彻底消除穿模；视频生成效果依赖实机。
- 后续测试/验收以文本静态 QC 为第一道门，真实生成视频为第二道门；前者通过不等于后者必然通过。
- 首期仅文档型 Prompt Skill，不引入依赖、前端、后端或视频生成 API；如实际实施发现需要程序化校验，另行评审。

## 3. 依赖顺序

`T00 基线与样例冻结 → T01 Auto 策略路由 → T02 15–120 秒分段与时间轴 → T03 状态机与多段交接 → T03B 可选转场导演 → T04 声画/对白 → T05 H3 模板与多段装配 → T06 QC/回归 → T07 实机验收`

各 Ticket 不建议跨越依赖直接合并；允许在审查时迭代文档，但应更新变更记录。

## 4. Ticket 详细清单

### T00 — 冻结 v1 兼容基线与最小测试清单

**目标**：在改动前保留现有可运行范式，避免 v2 实施破坏已实测有效的提示词。

**计划涉及文件**
- 新增 `examples/classic-ab-15s.md`：v1 严格 6 镜的完整参考样例；
- 新增 `examples/voiceover-verified.md`：用户实测的中文画外音语义样例（不把单个案例等同于全面模型验证）；
- 新增 `tests/regression-matrix.md`：列举输入、期望策略、必须满足的规则与人工实机检查项；
- 不修改任何 `SKILL*.md` 和现有模板。

**完成标准**
- 至少记录 Classic 15 秒、30 秒两个任务、中文 VO、图片重新编号四类兼容基线；
- 测试区分「文本规范检查」和「真实视频效果」；
- 确认 D3：所有生成 Prompt 均无 BGM。

**风险/回退**：完全新增文件，失败可独立撤销。

### T01 — Auto 导演策略识别与路由

**目标**：Skill 默认由用户创意识别题材和目标，决定拍摄策略；用户指定 Classic 时直接锁定。

**计划涉及文件**
- 新增 `references/director_strategy.md`；
- 更新 `SKILL.md`、`SKILL.cn.md`（入口、参数缺省、策略覆盖优先级）；
- 扩展 `tests/regression-matrix.md` 的题材/策略测试。

**具体任务**
1. 明确输入维度：题材、叙事重点、角色数量、场景、画幅、时长、声音要求、素材；
2. 设计 Auto 选择矩阵：Classic、Adaptive、Cinematic-led；POV-led 可预留，不必首期作为独立可用模式；
3. 写出优先级：用户显式要求 > 模型/时长能力约束 > 题材推荐 > 默认回退；
4. 无把握时以稳健策略完成，不为微小歧义无端提问；
5. 用户指定严格 AB 切法时，后续模块不能暗中改成非等长镜头。

**验收场景**
- 明确「六镜每镜 2.5s」→ Classic；
- 「15 秒旅行片，有几个自拍也要多展现风景」→ Adaptive；
- 「纯人物质感电影混剪、尽量少口播」→ Cinematic-led；
- 「古风无手机」→ 不引入现代手机且保持 POV/主观近景语义。

**完成标准**：同一输入可解释地选择策略，输出模式符合 D1；v1 Classic 路径仍可调用。

### T02 — 时间轴引擎与自适应镜头预算

**目标**：Classic 2.5 秒不变；Adaptive 基于镜头职责和动作难度安排非等长时长；成片规划最多 120 秒（最多 8 个 15 秒独立生成任务）。

**计划涉及文件**
- 新增 `references/timing_engine.md`；
- 扩展 `references/metronome_dialogue_timings.md`；
- 依实际设计更新 `SKILL*.md` 的时长说明；
- 新增 `tests/timing-cases.md`，并更新 `tests/regression-matrix.md` 的时间边界用例与测试状态。

**具体任务**
1. 区分「目标视频总时长」「当前任务局部时长」「成片全局时长」；
2. Classic 继续采用 15 秒六镜、0/2.5/5/7.5/10/12.5/15 秒边界；
3. Adaptive 先规划镜头职责，再分配时长；总时长等于 15 秒；
4. 30 秒为两个 Part，45–120 秒为 3–8 个 Part；每段局部时间轴 0–15s，并建立对应的名义全局时间映射；
5. 台词时长从每个镜头的实际预算计算，不再把 Classic 的单镜字数规则应用于所有时长；
6. 为每段建立素材名义时长/预计可剪冗余/累计成片净时长账本：特别是 120 秒名义素材经裁切后可能不足 120 秒；用户要求精确成片长度时明确余量与额外素材计划，不虚构无损对齐。
7. 保留 8/10/12 秒等其他**单次生成任务**时长的扩展挂点，暂不作为正式可用规格宣传；最长成片仍不得超过 120 秒。

**完成标准**
- 无负时长、无镜头区间重叠或空档，总时长精准闭合；
- Classic 输出不退化；Adaptive 至少通过 15 秒不同镜头数与不同节奏的文本样例；
- 任何 Part 都不被错误当作一次生成 30–120 秒的任务；完成 15/30/45/60/75/90/105/120 秒名义规划与时长上限文本测试；
- 对需要精确 120 秒、同时要求剪裁冗余的输入，不错误保证 8×15 秒素材剪后仍足 120 秒。

**T02 当前实现记录（2026-11-18）**：已新增 `references/timing_engine.md`，扩展 Classic 节拍器参考文件，更新中英文 Skill 入口与 T01 路由文件；新增 `tests/timing-cases.md`（22 个用例），更新回归矩阵。完成范围仅为**文本时间规划、预算和静态算术核对**，Adaptive/Cinematic 的完整成品 Prompt 模板仍由 T05 实现，非等长切镜的实际模型准确性待 T07 验证。

### T03 — 形式化状态机、道具守恒与段间交接

**目标**：将「手分工、道具、空间锚点、场景、身份」从口头规则提升为可检查的镜头状态迁移。

**计划涉及文件**
- 扩展 `references/rules_state_machine.md`；
- 新增 `references/continuity_handoff.md`（段间字段与规则）；
- 新增 `templates/segment_handoff_example.md`（供内部规划，不作为模型输入强制段落）；
- 新增 `tests/continuity-cases.md`（手、道具、场景跳跃、参考图与多 Part 交接的正反案例）；
- 扩展 `tests/regression-matrix.md`。

**具体任务**
1. 定义每镜 `entry_state / action / exit_state`；
2. 状态字段至少包含人物姿势/衣着/位置、持机者、左右手、道具持有人/位置、场景锚点、时间和光照；
3. 区分硬切省略的动作和镜内必须真实执行的动作；
4. 2–8 Part 的任意相邻边界都由前段尾镜导出交接契约，后段首镜消费；允许合理的时间/地点跳跃，不强迫无缝连续；
5. 参考图由全局 `asset_id` 映射为每个任务内部的连续 `Picture N`，按实际上传清单编号；
6. 古风/无实体持机时允许相应机位特例，不强迫手持手机。

**完成标准**
- 同一只手不能同时持有互斥道具；
- 同一枚核心道具不会无事件变更位置或持有人；
- 任意相邻 Part 的服装、道具、空间和人物状态交接清晰；
- 每个 Part 未上传资产不得被引用、无编号跳号。

**T03 当前实现记录（2026-11-18）**：已将镜头 `entry_state / visible_action / exit_state`、道具/手资源及 `cut_event / jump_event` 写入 `references/rules_state_machine.md` 与新建的 `references/continuity_handoff.md`；新增内部三 Part 交接样例及 32 个正反回归用例，已接入中英文 Skill 入口。已明确从任意相邻 Part 传递状态、按当前任务重编号参考图、场景锚点不瞬移。**这是文字规则与样例的实施；不代表存在自动语义检测程序，也未验证 MiniMax H3 实际生成连续性。**

### T03B — 场景驱动的可选跨 Part 创意转场导演

**目标**：建立可复用的拍摄/剪辑技巧推荐能力。**特殊转场是选项，不是多 Part 的义务**；作品没有适合的衔接机会时，所有边界可直接硬切。

**设计参考**
- [docs/transition-techniques-library-v2.md](transition-techniques-library-v2.md)：46 种技法、应用场景、两端摄影机配合、实际剪辑点、禁忌和失败回退。

**计划涉及文件**
- 新增 `references/transition_director.md`，使 Skill 能按场景判断 `none / suggest_only / planned_pair`；
- 在 `references/continuity_handoff.md` 中增加**仅对已采用转场**才启用的 outgoing/incoming 镜头字段；
- 根据需要更新 `SKILL.md`、`SKILL.cn.md` 的 Auto 创作流程；
- 新增 `templates/transition_boundary_examples.md`（内部规划正例，不冒充完整 H3 Prompt）；
- 新增 `tests/transition-cases.md`（36 个正反用例），并扩展 `tests/regression-matrix.md` 的跨 Part 推荐/不用转场案例。

**具体任务**
1. 每个边界先判断叙事类型、情绪节奏和正常硬切是否已经足够；
2. 没有合适动因就选择 `none`，不得为了 120 秒或 8 Part 而凑转场数量；
3. 合适时从**遮挡、甩镜/运镜、动作匹配、图形匹配、水面/门洞/镜面穿越、失焦/倒影**等技法选择最多少数真正贴合的候选；
4. 只有采纳的 `planned_pair` 才改变前 Part 尾镜与后 Part 首镜；`suggest_only` 不修改默认 Prompt；
5. 设计两端摄影机动作、方向、遮挡/形状、切点、剪辑余量、角色道具一致性、风险与失败回退；
6. 排除淡入淡出、交叉叠化、软件一键特效及无动因的闪白；
7. 不把「转场建议」与「背景音乐」绑定，D3 仍然禁止生成 BGM。

**验收场景**
- 30 秒同一场景两人对话 → `none`，不打断；
- 60 秒街头旅行、明确有前景树干 → 可建议遮挡转场，但未选用时不强加；
- 90 秒慢节奏情绪 Vlog → 可以所有边界都不用神转场；
- 120 秒多场景、包含水池穿越 → 仅该场景推荐对应技巧，若选用必须有出镜/入镜两端和剪辑点；
- 用户说「只推荐，不改原 Prompt」 → `suggest_only`；
- 用户说「不要转场」 → 全部 `none`。

**完成标准**
- 选择依据是剧情/拍摄可行性而非分段数量；
- none 是完全合格结果，QC 不因缺少技巧性转场报错；
- planned_pair 双端配合完整，且有剪辑成本/风险与失败回退；
- v1 Classic 镜头模式不被无意更改。

**T03B 当前实现记录（2026-11-18）**：已新增 `references/transition_director.md`，在 `references/continuity_handoff.md` 加入**仅选中 planned_pair 才启用的** outgoing/incoming 双端镜头与剪点字段；中英文 `SKILL.md` 均接入场景判断与默认 suggest_only 行为；已有 46 技巧目录正式挂接，新增六个内部边界示例与 `tests/transition-cases.md`（36 个正反场景）。保持 `none` 合法，`suggest_only` 不改 Prompt，`planned_pair` 仅用户选用/明确授权且可行时应用。仅为**文字 Skill 执行规则和静态案例**，未开发自动剪辑器、未验证实际 H3 转场视频；完整多 Part H3 模板装配留 T05。

### T04 — 台词、已验证画外音与无 BGM 规则

**目标**：保留已验证 VO 写法，扩展对白预算和跨镜音频，同时落实 D3。

**计划涉及文件**
- 扩展 `references/metronome_dialogue_timings.md`；
- 新增 `references/audio_director.md`；
- 更新相关 `SKILL*.md` 规则；
- 新增 `templates/audio_plan_examples.md`（15 秒 L/J-Cut 声画时间及跨 Part 后期示例）；
- 新增 `tests/audio-cases.md`（36 条正反例），并更新 `tests/regression-matrix.md` 的对白/无 BGM 断言。

**具体任务**
1. 区分对镜直言、画外音、L-Cut、无台词；
2. 用户已验证的中文 VO 写法作为正例；英文固定短语是兼容备选而非强制；
3. 根据镜头长度分配对白字数和呼吸留白；
4. 双人/多发言者明确 `S1`/`S2` 与嘴型要求；
5. 所有模型 Prompt 保留「无背景音乐」明确负向约束；
6. `non_diegetic_music: N/A` 固定；`overall_soundscape` 不写 BGM；
7. 如用户要求卡音乐节奏，只在可选**后期配乐/剪辑建议**描述节拍，不向生成模型要求配乐。

**完成标准**
- 用户中文 VO 用例通过语义检查，不能因为缺英文固定语句被拒绝；
- 跨镜声音接续在镜头描述里明确起止关系；
- Classic/Adaptive/Cinematic-led 三种策略均不能在模型声音字段生成 BGM；
- 对白和画外音的嘴型要求不冲突。

**T04 当前实现记录（2026-11-18）**：已新增 `references/audio_director.md` 并接入中英文 `SKILL.md`；在 `references/metronome_dialogue_timings.md` 纠正「必须包含英文固定 VO 短语」「L-Cut 两端必须写 `<scenetrans>`」的旧规则。保留用户报告已实测成功的中文自然闭嘴画外音、明确 S1/S2 说话者与口型、J/L-Cut 声画时间关系、跨独立 Part 的声音必须使用后期音轨衔接，以及所有模式生成阶段禁 BGM。新增 `templates/audio_plan_examples.md` 和 `tests/audio-cases.md`（36 条正反例）。**本轮是 Skill 规则与静态测试实施，不等于真实声音生成/混音系统或 MiniMax H3 实机音画验证。**

### T05 — MiniMax H3 装配器规则与模板落地

**目标**：将前述导演计划转换为可以直接复制使用的 H3 六段式 Prompt，兼容有图与无图、单片、双段及最长八段的多 Part 成片。

**计划涉及文件**
- 新增 `references/model_h3_adapter.md`；
- 保留并更新 `templates/template_15s_single.md`、`templates/template_30s_twopart.md` 为 Classic 兼容模板；
- 新增 `templates/template_15s_adaptive.md`；
- 新增 `templates/template_30s_adaptive_twopart.md`；
- 新增 `templates/template_15s_cinematic.md`（Cinematic-led 全 B 镜无图成品示例）；
- 新增 `tests/adapter-cases.md`（26 条预期用例与成品静态核验）；
- 新增 `templates/template_multipart_15s_sequence.md`：用于 3–8 Part 的动态规划/独立任务装配，而非一次生成 120 秒；
- 更新 `SKILL.md` / `SKILL.cn.md` 的装配流程。

**具体任务**
1. 六字段保持：`subject_definitions`、`summary`、`retention_analysis`、`detailed_description`、`overall_soundscape`、`non_diegetic_music`；
2. 模型语法与导演说明解耦，不引入未经验证的新标签作为强制字段；
3. 有参考图时使用当前任务上传顺序的 `Picture N`，无参考图时不伪造引用；
4. Classic 模板保留固定 2.5 秒、A-B 交替和 VO 已验证语言；Adaptive 模板依动态节奏装配；
5. 所有模板具备防字幕/防 UI 约束，声音字段固定无 BGM；
6. 默认只输出完整 Prompt；多段仅加必要的上传清单/交接说明，详细状态表和 QC 仅按需展示；
7. 避免把「海边贝壳、女性主角、治愈笑容」当成所有题材的默认故事内容；
8. 对选用 planned_pair 的边界装配两端成对镜头；对 suggest_only 仅附建议而不改 Prompt；对 none 保持自然切镜；
9. 支持最长八个 15 秒的独立 Prompt，并核查每 Part 单独的参考图上传顺序和时间轴；未采纳特殊转场不要求新增镜头。

**完成标准**
- 四种兼容路径可用：15s Classic、15s Adaptive、30s Classic 双段、30s Adaptive 双段；扩展路径支持 3–8 Part 的长片规划；
- 所有路径遵守 D1–D5（含最长 120s 和可选转场）；
- 可从模板复制可运行文本，且不包含未替换的示例方括号占位符。

**T05 当前实现记录（2026-11-18）**：新增 `references/model_h3_adapter.md`、Adaptive 单/双段、Cinematic-led 单段及 3–8 Part 动态装配和八段完整样例；中英文 Skill 接入六字段装配、Ref2VA/T2VA、逐任务素材、三种输出视图、选用转场及真实实体文字例外。Classic 两个模板使用 T00 冻结完整 Prompt 原文取代原占位符脚手架，固定六镜与基线原文件保持。临时静态回读检查共 15 份完整 Prompt、69 镜、每份 8 项断言（120 项）通过；包括字段顺序、内容非空、时间轴、模式、占位符、图引用、无音乐要求与负向块。仅针对样例的结构检查；26 条语义预期并未全部执行，不是 H3 实机或自动编译程序。T06 做完整 QC，T07 做真实视频验证。

### T06 — 结构化 QC、测试矩阵与静态回归

**目标**：让 Skill 在输出前完成自检，区分硬错误和可以解释的软风险。

**计划涉及文件**
- 新增 `references/quality_control.md`；
- 完成 `tests/regression-matrix.md` 和必要的测试提示词；
- 视需要微调 `SKILL*.md`、`templates/` 的 QC 调用说明。

**硬性检查**
- 时间轴区间正确且总时长吻合；
- 参考图引用连续且属于当前任务；
- 持机、双手、人物、道具状态没有明显冲突；
- 画外音声源、闭嘴与对白标签语义自洽；
- H3 六段式字段存在、无多余伪标签；
- 所有生成 Prompt 无 BGM，`non_diegetic_music: N/A`；
- 用户指定 Classic 必须严格符合 v1 镜头结构；
- 默认输出完整 Prompt，不强迫披露全部内部状态表；
- 成片最长 120 秒，各独立 Part 有有效局部时间轴，编辑账本区分素材时长和净时长；
- 对 none/suggest_only 的边界不能硬性要求特殊转场；planned_pair 需有出/入镜头、切点与回退。

**软性检查**
- 镜头动作难度是否超出预算；
- AB 切换是否只是机械凑数；
- 视觉风格与情绪是否随镜头无理由跳变；
- 是否存在无信息增量的重复镜头；
- 是否过度堆叠大型运镜和环境描述；
- 是否为了炫技而滥用转场，特殊技巧与题材情绪是否相容。

**建议回归矩阵（保留至少原 16 个主题，并补充长片与转场案例）**
1. Classic 15 秒单人自拍；
2. 15 秒双人互动；
3. 左右手占用冲突；
4. 核心道具引入/收纳/复现；
5. 雨中收伞入店的硬切省略；
6. 30 秒跨段光照与道具继承；
7. Part 2 参考图紧凑重编号；
8. 用户提供的中文画外音；
9. L-Cut 跨镜台词；
10. 无对白氛围 Vlog；
11. Cinematic-led 人物展示；
12. 古风无手机场景；
13. T2VA 无参考图输入；
14. 场景真实文字与字幕禁令的区分；
15. 用户指定固定六镜、固定切点；
16. 音乐驱动的后期剪辑需求，生成阶段仍无 BGM；
17. 45/60/90/120 秒多 Part 生成计划及每段局部时间轴；
18. 120 秒名义素材剪接后净时长减少的余量提示；
19. 同场景对话与情绪延续，多 Part 全部不安排技巧性转场；
20. 有遮挡物时只建议，不修改原 Prompt；
21. 用户主动选用水池穿越，成对端点及剪点/失败回退；
22. 甩镜方向和速度匹配；用户指定 Classic 时不破坏固定镜数。

**完成标准**：所有硬性项 100% 合规；软性风险可解释；失败案例有对应修改或风险说明。

### T07 — 文档、实机验证与版本发布准备

**目标**：核验 Prompt 在 H3 的实际表现，准备将 v2 正式作为用户默认 Skill。

**计划涉及文件**
- 新增 `README.md`（用法、适用范围、输入示例）；
- 更新 `meta.yaml`（版本号仅在真正通过验收时再调整）；
- 补充 `examples/` 的典型场景与实际结果记录；
- 按需要完善 `docs/` 中的变更记录、验收报告。

**真实视频重点观察**
- A 镜手机机位真实性、B 镜外部摄影机稳定性；
- 中文画外音是否正常、不强制人物张嘴；
- 人物身份与衣着一致性、手部与道具稳定性；
- 多镜切点、2–8 个独立视频任务拼接的可用程度；针对已选用的转场检查真实剪点和余量，不对普通硬切强制设计神转场；
- 无 BGM 是否被模型按预期执行；字幕/乱码/UI 是否减少；
- Adaptive 路径是否比 Classic 更适合目标题材（仅定性或有样本后再量化）；
- 45–120 秒的分段人物/道具一致性，以及遮挡/甩镜/水池穿越等**实际选用**技巧的成功与失败示例。

**完成标准**
- 记录测试输入、使用模型/模式、参考素材配置、提示词、样本结果及失败原因；
- 重要失败有可复现说明；如模型能力不支持某项，回退或降级而不是虚假宣称；
- v1 Classic 兼容性未破坏；更新版本信息前确认验收已过；
- 生成完成的 Prompt 默认可直接复制；实现文档与测试证据一致。

## 5. 执行检查点与风险

| 阶段检查点 | 条件 | 未通过时处理 |
|---|---|---|
| Gate A（T00–T01） | 兼容样例冻结，Auto 路由可解释 | 回退至 Classic，修正策略 |
| Gate B（T02–T03B） | 最长 120 秒分段/净时长预算正确，状态/参考图合法，跨段交接完整；特殊转场可选择 none | 简化镜头与动作，取消不合适的技巧性转场 |
| Gate C（T04–T05） | VO 兼容，无 BGM，H3 字段和模板完整 | 恢复已验证 VO/Classic 写法 |
| Gate D（T06–T07） | 静态 QC 通过，关键实机样本可审查 | 暂缓对外宣称 v2 已稳定 |

**重点风险及处置**：
- Auto 不可解释或容易路由错题材 → 明确优先级并有 Classic 回退；
- 自适应镜头无法按提示词精确切换 → 将时间点定位为剪辑意图，保守限制复杂镜头；
- 多个独立任务无法 100% 连续 → 使用交接字段、参考帧和后期处理，不宣称无缝保证；
- 转场过多或无叙事意义 → `none` 是允许且推荐的回退；不规定每个 Part 必须用技巧性转场；
- 120 秒名义素材被裁切后不足精确 120 秒 → 提前说明净时长预算或增加合法素材余量，而非承诺必然无损衔接；
- 复杂 VO / L-Cut 语法不稳定 → 以已验证中文 VO 为基线，超出部分注明待实测；
- 「音乐混剪」与 D3 冲突 → 只输出无 BGM 生成 Prompt，音乐时序属于后期建议；
- 文档重复且中英文版本分叉 → 保持 SKILL 两份入口同步，细则优先引用统一 references。

## 6. 建议的执行方式（后续会话）

1. **优先从 T00 开始**，只创建回归样例，不更改已有 Skill 的行为；
2. 用户验收 T00 后进入 T01，逐个 Ticket 确认是否符合已批准设计；
3. **已确认最长 120 秒成片与可选跨 Part 转场**，作为本计划内已批准范围；如超出 120 秒、改变 D3、强制新模型语法或一次性替换兼容模板，先变更设计决策，而非直接实施；
4. 每个 Ticket 产出应至少报告：实际改动文件、符合的验收项、未验证的模型行为、Git 提交记录；
5. 不预设实施工期；后续按照实际测试结果调整次序和分工。

### 历史启动指令（已执行；不再作为当前下一步）

> 按 `docs/implementation-plan-v2.md` 实施 T00：先冻结 v1 Classic AB、中文画外音与资产重编号回归基线。只修改 T00 允许的文件，完成自检并提交；不要开始 T01，也不要修改现有 Skill 入口或模板。

---

**文件性质**：已确认设计下的实施计划；该句最初写于文档创建日，当前阶段执行状态以第 7 节的已提交记录为准。

## 7. 阶段进度记录（2026-11-18）

| Ticket | 阶段状态 | 证据与交付边界 |
|---|---|---|
| **T00** | 已完成文本基线 | `examples/classic-ab-15s.md`、`examples/classic-ab-30s.md`、`examples/voiceover-verified.md` 及 `tests/regression-matrix.md`；无 H3 实机视频 |
| **T01** | 已实施规范/入口 | `references/director_strategy.md`、`SKILL.md`、`SKILL.cn.md`、路由预期用例；真实加载 Skill 的语言模型行为尚待验收 |
| **T02** | 已实施时间规划/预算 | `references/timing_engine.md`、Classic 节拍器兼容注记、`tests/timing-cases.md`；仅静态时间算术与文档一致性验证 |
| **T03** | 已实施规则/入口 | `references/continuity_handoff.md`、扩展 `rules_state_machine.md`、`templates/segment_handoff_example.md`、`tests/continuity-cases.md`（32 例）；语言模型行为及 H3 视频待验证 |
| **T03B** | 已实施规则/入口 | `references/transition_director.md`、46 技巧库、T03 交接选用字段、`templates/transition_boundary_examples.md`、`tests/transition-cases.md`（36 例）；模型行为和 H3 结果仍未实测 |
| **T04** | 已实施规则/入口 | `references/audio_director.md`、旧节拍器语音规则修正、中英文 Skill 入口、`templates/audio_plan_examples.md`、`tests/audio-cases.md`（36 例）；真实音画表现待验证 |
| **T05** | 已实施装配规范与完整模板 | H3 Adapter、六种模板共15份完整 Prompt、26条装配回归预期；15份样例静态结构通过，H3 实机及加载 Skill 行为仍待验证 |
| **T06 / T07** | 未实施 | 完整静态 QC 与真实 H3 实机视频回归 |

**后续执行从 T06 开始**；T05 已接入完整 H3 文本模板与装配规范，未实现自动视频剪辑、模型执行保证或完整语义 QC。
