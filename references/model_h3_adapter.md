# MiniMax H3 Adapter — T05 六字段装配规则

本文件是 Skill 的自然语言装配规范，不是 H3 官方 API/schema 或自动剪辑程序。实际模型版本、输入限制、语法与生成质量仍需 T07 验证。T00–T04 的规则优先于样例习惯。

## 1. 从计划到成品：执行顺序

1. 读取 director_strategy、timing_engine、continuity_handoff、transition_director、audio_director，依次得到唯一导演模式、每 Part 镜头表、首尾状态、边界决策及声音事件。
2. 根据 [素材预算](editing/footage_planning.md) 与实际剧情，目标0<T≤300，明确有限N个独立15秒任务；ceil(T/15)仅为新素材无损下界；任何任务内时间从 0 重置到 15.000。名义素材 15×N，不是剪后时长。非整倍数目标列出裁切区间；若余量不足，不承诺精确时长。
3. 为每 Part 单独维护实际上传 manifest，按上传顺序从 Picture 1 编号。先锁定全局人物/道具身份，再转换任务内局部编号，不能用全局序号替代。
4. 选择下表的路径，重新撰写每个字段；样例仅作为结构和镜头表达参考，不默认采用相同人物、地点、道具、风格、分辨率或对白。
5. 逐 Part 生成独立完整六字段文本；禁止“其余同上”“参见前一 Part”代替本次任务的身份、场景、声画、首尾状态或缺失字段。
6. 对 planned_pair 同时改写两端镜头内容，按实际素材选择剪点；suggest_only 不改任何成品 Prompt，建议放在外部；none 自然硬切。重新校对 T02 时长和 T03 状态。
7. 执行本文件 §6 的交付前自检。失败先修正；冲突不可自行解决则说明，不交付含错误的假成品。

## 2. 路径与模板

| 路径 | 模板 |
|---|---|
| 15s Classic AB | [template_15s_single.md](../templates/template_15s_single.md) |
| 30s Classic AB | [template_30s_twopart.md](../templates/template_30s_twopart.md) |
| 15s Adaptive AB | [template_15s_adaptive.md](../templates/template_15s_adaptive.md) |
| 30s Adaptive AB | [template_30s_adaptive_twopart.md](../templates/template_30s_adaptive_twopart.md) |
| Cinematic-led 单段 | [template_15s_cinematic.md](../templates/template_15s_cinematic.md) |
| 多任务任意已选模式 | [template_multipart_15s_sequence.md](../templates/template_multipart_15s_sequence.md) |

Classic 的单 Part 严格六镜 2.500s，A-B-A-B-A-B；允许全片 A/B 镜号连续而每次 Shot 及时间码重置。Adaptive 不强制六镜与 A/B 交替；Cinematic-led 可全 B、零台词、无手机。

## 3. 输入模式与素材

- Ref2VA：只有用户提供或明确计划实际上传的图片才能成为引用。输出 Prompt 外附每段实际上传顺序：局部 Picture N → 全局资产名称。不附图的示例明确写为需提供的输入，而不是声称已上传。
- T2VA：无图时不用任何 <Picture N>、不写 [reference generation]；以文字完整定义 S1/S2 身份、衣着、空间等。六字段是本 Skill 的输出约定，不虚构官方 T2VA 标记。
- 混合场景可以只引用真实存在的角色图，其他内容文字描述；不因为需要场景图就虚构素材。
- 有图/无图都独立定义角色声线、当前状态与物理关系。跨任务文字描述一致不等于模型的实际身份锁定。
- 用户要求明确人物或上传参考时尊重输入；不要无条件加手机或默认女性、贝壳、海边或治愈主题。

## 4. 六字段装配

按固定顺序输出，每字段一次且有实质内容：

| 字段 | 内容 |
|---|---|
| subject_definitions: | 角色身份、服装/声线、道具、当前场景和必要的本任务参考图 |
| summary: | 本次独立生成 15 秒、构图比例/FPS（用户指定优先）、叙事目标和镜头策略，不宣称模型保证精确切点 |
| retention_analysis: | 人物/道具的保留或合法变化；T2VA 用纯文字描述，不凭空宣称参考保留 |
| detailed_description: | 按局部时间码写 Shot 1..N，主体、机位、动作、入/出镜状态、声音和硬切；如选用转场，只写两端真正能拍到的动作；结尾加防字幕/无 BGM 声明 |
| overall_soundscape: | 只有环境声、人声与 Foley；不要求音乐或自动配乐 |
| non_diegetic_music: | 下一行固定 N/A |

时间格式：[Shot 1] 0.000–00:02.500；随后 [Shot 2] At 00:02.500, HARD CUT TO: …（至00:05.000）。非 Classic 根据实际镜长换算。不要在 15 秒任务中引用 20 秒等全片时间码。

内部 entry/action/exit、handoff、Audio Plan、transition_id 等用于规划，而非新 H3 顶层键。可在自然语言中描述必要物理事件。保留用户实测中文 VO：此时她以画外音心声说道：<d>[Chinese] 果然如入深谷，甚是清净。</d> while her lips remain completely closed. 英文固定短语非必填；<scenetrans> 非必需且待实测。跨独立任务 J/L-Cut 在后期处理。

### 4.1 负向块与真实场景文字例外

默认沿用以下原块（空行保留）：

【禁止项】

文字/UI/水印/Logo/角标/可读文字/真实UI

【强制声明】

无背景音乐,仅保留环境音与人声和音效;画面禁字幕/文字/水印/Logo;禁止可读文字(指画面字幕文字,不含人声台词)

**只有用户明确需要真实场景文字**时，改用下面的限定版本，明确仅允许指定实体上的文字，并把具体文字与位置写入镜头，不与默认全禁可读文字同时使用。模型文字准确性未实测，不承诺：

【禁止项】

生成字幕/浮层文字/UI/水印/Logo/角标/虚假UI；非指定实体上的可读文字

【强制声明】

无背景音乐,仅保留环境音与人声和音效;禁止画面叠加字幕/文字/水印/Logo;仅允许镜头中明确指定的实体场景文字，不将人声台词生成字幕

## 5. 输出视图

- Standard（默认单段）：一个完整可复制 text 代码块；有图时附必要的上传清单。不强制展示路由推理、内部表或 QC。
- Multi-Part（默认多段）：按顺序输出 N 个独立 text 代码块，每段之前只列当前上传顺序（无图则说明）、必要的首尾交接和名义时长；片尾按需给净时长/裁切说明。不能以省略号替代完整任务；若用户选择分批则明确总任务、当前批次、待交付，不称已完整。
- Director Detail（用户要求）：额外展示完整时间表、状态表、声音/转场计划、风险与 QC；成品 Prompt 仍独立可复制。
- suggest_only 可选转场、后期 BGM/节拍建议、实际剪点待确认提示，都在代码块之外。planned_pair 的双端摄影动作在各自 Prompt 内，剪辑方法与选择条件在外部。
- 所有进入成品的示例方括号占位符必须替换；合法的 [Shot N]、[Chinese] 等语言标记、Ref2VA 的 [reference generation] 例外。不允许“[AI代写]”“[场景名称]”“[如：…]”或虚构模型参数。

## 6. 交付前自检（T06 统一门禁）

- 本批任务清单与代码块数量相符；每块恰好六字段且顺序一致；无未替换占位符。
- 每块时间从 0 到 15.000、镜头无空隙重叠，Classic 六镜/固定切点；镜头数与描述一致。
- 当前上传 manifest 所有引用有效；无图不写 Picture；每个独立 Part 的 Shot / 时间重新起算。
- 连续边界按T03实际保留点承接；其他边界按事件/时期版本、因果和线索；声源不串。
- T03B 选用状态与实际 Prompt 一致；planned_pair 两端齐备，suggest_only 不修改，none 不要求技巧；净时长不作无凭据保证。
- 每块 non_diegetic_music 值严格 N/A、声场无 BGM 指令、防字幕块齐备；指定真实场景文字仅用限定例外。
- 看见硬性冲突先修正；模型实机能力仍未验证时说明。不把本规则描述成可执行软件编译器或模型端自动视频剪辑。

正式交付前须执行 [T06 统一质量门禁](quality_control.md)，本节不替代完整 H01–H15 与 S01–S10 审查。

Edited Film View：非顺序、插入、裁切、复用等提供 [EDL](editing/editing_timeline.md) 与 [后期计划](editing/post_production_plan.md)，简单连续保持原输出；预剪点不冒充实际。执行 [Editing QC](editing/editing_quality_control.md)。
