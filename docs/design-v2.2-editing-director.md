# v2.2 人物叙事短片与 Auto Editing Director 详细设计

> 批准范围：最长300秒成片、片段剪辑叙事、完整故事、专业剪辑手法库与自动选择。基线 main 38885b2a228c6a06221a1d0519e7b9d8c95c7065，含用户 CRLF 修复。2026-11-18。开发候选版本，正式 meta.version 仍为1.0.0。本文取代 v2/v2.1 设计中 120s/8 段的旧上限，历史记录及冻结范例不代表现行限制。

## 1. 产品定位与范围

以人物为主体的15–300秒电影感叙事、轻剧情、弱剧情、旅拍、人物纪录、情绪和人物审美短片。既保留原有连续轻剧情 Vlog（可自然承接动作/场景/人物状态），也支持剪辑型叙事及两者混合。所有H3任务技术上独立，剧情上是否连续由剧本决定；绝不默认所有片段互相解耦。两分钟可以表现完整一生的关键选择，五分钟可含多章节、并行行动及回忆。叙事时间不由播放时间限制。无需每片强加剧情、反转、快切或特效；人物审美短片仍可保持无事件/零台词。用户明确的非人物题材仍可支持。

目标：从已确认 Creative Brief 发展叙事架构，按情绪、故事、信息和节奏自主选择剪辑方法，反推镜头覆盖、H3独立生成素材和后期时间轴。对已有素材可提供真实素材约束下的剪辑方案；未生成时只提供预剪计划，绝不把剪点/视频表现称为已验证。非目标：实现视频播放器、实际NLE工程、自动渲染、模型帧级控制、真实素材自动识别、完整长剧导演、无限生成预算。本Skill仍是自然语言策划与提示词规范。

## 2. 决策与兼容性

| 决策 | 规则 |
|---|---|
| ED-D1 最终长度 | 0 < target_final_s ≤ 300；主要创作15–300，默认15；用户明确短于15则保留原T02裁切路径。超300报告能力边界，不暗中截断 |
| ED-D2 生成预算 | 每任务仍独立15秒；ceil(T/15)仅是无损、无复用、只用新素材的预算下界。20任务是300秒无损基线，不是总任务硬上限。明确N、补镜数、损耗/可用率假设、用户任务/成本上限，预算不足报告冲突；不承诺无限任务或执行实机 |
| ED-D3 三时间轴 | Story真实事件序；Generation任务/本地范围；Edit观众播放次序。分离ID，不假定三者排序相同，也不强制三者不同 |
| ED-D4 自主剪辑 | 普通剪法（省略、蒙太奇、插入、反应、声画关系等）可以依据已确认创意自动规划，不要求用户逐项点名。改变核心故事/锁定内容需重新确认 |
| ED-D5 特殊转场 | 保留T03B的none/suggest_only/planned_pair；凡需要双端特殊匹配、刻意改变两端摄影动作的创意转场，仅明确选用/明确委托实际安排才启用。未授权不改稿，默认建议；普通动作连续性和视线覆盖不等同特殊转场授权 |
| ED-D6 原硬约束 | Classic每任务严格6×2.5s ABABAB；用户锁定最终六镜顺序/时点时不能通过后期更改；若只锁定生成结构，另行获得明确剪辑许可才裁切/重排其六镜。A/B策略不按题材机械映射；无BGM生成、中文VO、真实参考图、物理状态、六字段不变 |
| ED-D7 证据 | proposed/approved plan != actual；生成后按真实帧、声音、素材时长核对；实际素材缺失记UNKNOWN/NOT_RUN。S/L/E/V证据仍沿用T06 |

优先级：用户明确冲突/硬约束检查 > 物理与模型/预算可行性 > 情绪/故事 > 信息与节奏 > 视线/空间连贯 > 风格/技巧。Walter Murch的六原则是审美判断参考，不是将物理硬门禁降级的评分器。创意阶段未确认不得提前制作；明确成品需求仍可直通。

### 2.1 独立的叙事组织 Auto 路由（用户补充，优先于剪辑手法）

| organization_mode | 适用条件 | 生成/剪辑承接 |
|---|---|---|
| CONTINUOUS | 连续日常、同场互动、连续动作、明确要求连贯的轻剧情Vlog | 按剧情因果顺序组织；相邻需要承接的镜头/Part严格消费T03出入状态，实际保留剪点一致；可正常硬切，不强制素材重排 |
| EDITED | 片段式完整故事、成长、回忆、视觉诗、剪辑型叙事 | 按真实事件建立状态，各片段可独立规划，按实际需要省略/重排/插入；不是所有边界都独立，仍逐边界判定 |
| HYBRID | 旅拍、跨场景生活、微纪录、多章节中含连续互动 | 章节或连续动作链内部严格承接；章间允许有理由的时空跳跃、蒙太奇或回忆，保留持久身份 |

默认 AUTO 根据实际剧本、用户明确要求、角色动作/对话、时空和信息需求选择组织，不按题材、时长、任务数或摄影模式机械映射。普通连续故事无重排需求优先 CONTINUOUS；用户明确组织方式优先，但不能破坏剧情和物理硬约束。允许每章/边界独立选择；三轴是数据表示而非强制不连续。Classic AB / Adaptive AB / Cinematic-led 是摄影策略，与此组织维度正交。长达300秒也可以连续叙事，15秒也可以蒙太奇。

先定义 continuity_group_id / dependency edges，再安排任务。连续动作链需生成/核对前段实际保留状态并传递给后段（计划阶段使用明确的预期状态并标待实机校验）；如果独立生成不匹配，重生成、调整合法剪点或使用有理由的省略/插镜，不能假设帧级连续或在未授权时把连续剧情改成非线性。剧情边界与技术任务彼此独立：同场切镜有严格连续性，跨章节可合法变化，任何片段都不得无事件串道具。用户要求连续剧情时，剪辑手法仍可增强表演、节奏、声画、景别与覆盖，不强制倒叙或蒙太奇。

## 3. 理论来源与资料库方法

来源登记在 references/editing/sources.md；已核实 Columbia Film Language Glossary 的编辑/视线匹配、Living Handbook of Narratology 的电影叙事、University of West Georgia 术语、开放电影教材 Editing、Adobe 剪切/J-L/匹配剪辑，以及 Berkeley 的 Murch 六原则节选，Every Frame a Painting 教学视频作为学习参考（不声称已逐帧观看）。理论定义与本Skill AI适配建议明确分离。每技巧卡含ID、定义/目的、适用/禁忌、素材前提、H3拍摄表达、后期操作、失败回退、来源ID；独立编写而非复制教材，不承诺理论技巧H3已实测。九类：时间、蒙太奇、连续性、表演情绪、节奏、信息、插入覆盖、声音、转场适配（复用现有46条）。

## 4. 全流程与责任

Creative Engine（已确认/委托） → Narrative Architecture（故事事件/章节/信息） → Editing Auto（选择叙事组织与段落手法/节奏） → Footage Plan（镜头功能/素材需求/任务预算/覆盖） → T01–T04（摄影模式、15s局部时序、人物状态、转场授权、音频） → 预剪 EDL/回查覆盖与预算 → T05六字段装配 → T06+ED QC → 交付素材任务及必要后期清单。实际素材提供后可按EDL实际核对、修订、补镜，不能未执行却称已剪完。

连续叙事（不论时长）或简单顺序剪辑无特殊需求时轻量直通：原单/双段完整Prompt+必要交接，不强行展示冗长EDL。多章节、非线性、裁切/复用、额外补镜或音桥等需要明确剪辑表，否则无法实现叙事。仅要创意/剧本/剪辑建议时停在用户所求产物。纯剪辑已有素材路径：先登记真实文件/时长/内容证据，未知则可给条件计划，不编造可用帧。所有内部字段不进入六字段。

## 5. Narrative Architecture

StoryEvent {event_id, story_order, story_time_label, location_id, story_version, characters, state_before, action, state_after, cause_ids, knowledge_delta, event_role, required/optional}。故事真实时间可为相对标签（童年/五年后/现在），不伪装精确日期。state包含身份年龄形态、服装、手、道具、空间锚点、情绪；跨年龄用不同角色状态版本和参考素材，不能要求同一张成年图自动变成童年。真实人物仅用用户已知事实/明确虚构。

序列 Sequence {seq_id, theme, event_ids, narrative_function, emotion_in/out, viewer_question, reveal_ids, target_edit_s, optional_beats}；可多场景但一条中心命题/角色主线；节拍不是固定镜头时长。完整故事检验：人物欲望/处境、触发、选择/变化、结果/余韵；弱剧情与审美可用主题+母题+段落变化，不硬加冲突。章节预算建议15–30单节奏、60–120三至数段、180–300多章节；按情绪/叙事而非平均分配时间。每章有目的、必要信息、人物状态和可裁内容。故事跨年靠代表性事件，不需连续补拍每分钟。

叙事顺序可线性、先果后因、闪回、双线、环形、对比、片段拼贴；每次跳跃有可见/声音/造型等线索（不得强制字幕或模糊特效），记录观众知道的信息，与角色知道的信息区分。平行线标 simultaneous / thematic / uncertain，不把联想当同步事实；不同事件不能互相消费物理状态。信息隐藏不应隐藏必须理解的因果。

## 6. 三时间轴、ID与状态

Story 时间轴为真实事件顺序；GenTask {task_id, source_s=15, role:primary/coverage/alternate, event_ids, required_shots, state_versions, local_shots:[shot_id,in_ms,out_ms,camera_mode,entry,exit], asset_manifest, audio, status:planned/generated/rejected}。每段局部0..15000闭合；全局素材序号仅索引，不写进 H3。Shot ID全局 task_id/shot_id，事件可被多个任务覆盖。设素材版本 clip_id/attempt_id，重生成不是自动可用素材。实际时长/帧率来自视频，不猜24fps；计划用毫秒，实际剪辑按媒体帧/时间基。

EditItem {edit_id, clip_id/task_id, source_in_ms, source_out_ms, dest_in_ms, dest_out_ms, event_id, story_version, purpose, boundary_id, reuse_reason?, status:planned/verified, state_at_in/out}。一个任务可以有多个不重叠区间，非顺序使用，复用同一源区间须显式声明叙事理由并计入播放时长但不增加唯一素材；不得靠重复填充不足故事。默认单视频轨硬切，source与dest长度相等、dest无缺口/非法重叠，慢速/定格/叠加仅分别记录明确用户允许且实际后期可执行的方案（当前基础EDL不自动计支持）。独立AudioItem {asset_id/source_task, speaker/source_kind, source_range, dest_range, lip_policy, cut_relation, track, verified}，J/L可跨画面边界但不重复计入视频时长；真实跨任务声音后期拼接或重配，禁止跨模型声明同一音轨可继承。

Boundary {from_edit,to_edit, relation:same_moment/ellipsis/time_jump/location_jump/flashback/flashforward/parallel/associative/return, event_evidence, exit_snapshot, entry_snapshot, allowed_change, viewer_cue, transition_decision, audio_bridge, fallback}。same_moment比较实际保留剪点出入态；ellipsis有合法省略事件；jump可换时间/场景但关键持久身份和道具状态需与各自事件吻合；parallel/flashback/associative根据Story各自状态版本，不用前一屏状态强制覆盖；return由故事时间版本恢复。固定锚点留原场景。每个实际剪辑边界都有纪要；相邻任务编号本身不证明连续，但 CONTINUOUS 或 HYBRID 中标为连续的边界必须按T03真实承接。任务内部镜头仍T03对相邻镜头验证，若含合法故事跳跃记录具体event。素材截掉最后1秒时，交接取真实保留点而非名义最后帧。

## 7. 素材预算与净时长

T目标ms，素材总量gross=N×15000（计划）。单轨、无变速/重叠下每EDL行 length=src_out-src_in=dst_out-dst_in；净长=max(dst_out)，必须从0闭合连续。唯一源使用时长按每 clip 源区间并集算（复用不重复计）；未使用时长包括选材丢弃、handles和备选。复用增加播放时长，不能冒充新素材。音频不参与净长；若用户明确后期叠合/重叠，专门轨道记录并重新算实际视觉覆盖并集，不把J/L重叠误扣视频。默认不安排淡化、叠化或一键效果；旧T03B限制保留。

预算流程：无复用新素材最小ceil(T/15)；估计每任务保留u≤15（例如13秒，只是规划假设），初始 N=ceil(T/u)，按叙事覆盖与未使用尾/首余量调整。显式区分primary/coverage/alternate，给用户可审核预算；用户若限定最多N，不自动突破，提出简化、减少损耗、接受短片或授权额外任务。不能要求必须补镜或固定15%损耗；精确300s +20任务+损耗必冲突，增加一个或多个经预算的可用素材才可能补齐。示例：24×15=360s；每段计划留12.5s共300s，60s余量；并非保证素材质量或镜头真实可裁。120s旧8×15零余量冲突仍成立；额外素材是实际任务清单不是隐形填充。已有素材时可混入真实已登记clip，预算分开，任务数可以0。用户不指定成本时默认给明确有限方案并注明素材量与假设；长片按章节分批输出可选，但计划必须覆盖全部，标待交付任务数，不能说输出完整却省略。

## 8. Editing Auto 与决策引擎

输入：确认简案/剧本、NarrativeSequence、各角色/情绪、观众信息、素材可用性、拍法锁定和后期工具/预算。先选择整体组织（顺序/非线性/平行/蒙太奇/人物观察）和各序列叙事功能。再为局部连接选择最简单的手法：普通cut默认，若出现明确意义/动作/情绪/信息/时间问题才查技巧卡。过滤不满足前提、锁定/授权冲突、复杂动作和不可用音图；为必要素材给覆盖要求和回退。用户无需逐项选择；可一次性委托特殊转场但不能从“自动剪辑”擅自推断。

Decision {decision_id,scope:sequence/boundary/shot,audience_effect,technique_ids,rationale,required_coverage,placement:generation/post/both,activation, risk,fallback, evidence}。一处主技巧优先，辅技巧只有真正增益才使用；无需每章/每边界一种，避免技巧数量评分。没有理由则 straightforward。技巧类别重叠时只登记主用途，如反应既是insert又属于情绪。Murch优先考虑情绪、故事、节奏、注意力、画面平面、空间连贯；用定性取舍，不按51/23等机械算分。节奏由信息揭示、人物眼神/动作、停顿/呼吸、切点而非固定时长决定；可高潮变慢、留白，不强求快切。

## 9. 覆盖与 H3 适配

FootageRequirement {coverage_id,event_id,story_version,shot_function:establish/action/reaction/POV/insert/cutaway/bridge/hold,subject/action,entry/exit,axis/eyeline,duration_needed,handles, audio_focus, references,priority:required/optional,task_id/shot_id}。先主事件再覆盖关键反应/因果/空间；不无意义空镜堆叠。为动作匹配提供两视角同一动作相位，独立生成无法保证，首选可容错跳切/插镜。为闪回/时间跳跃拍不同角色年龄/服装版本；同一角色全局身份保持。为J/L准备有干净语音和环境声余量的独立音轨，预期后期做。剪辑手法的“定义”不能直接当模型标签；Prompt按局部镜头、动作、空间、声音描述，后期串联和时间线外置。A/B由T01选择、现代实际自拍右手、外部POV不等于自拍、古风无现代手机；不以剪法绕开用户限制。所有任务六字段自包含，真实局部Picture编号，Generation无BGM。

## 10. 交付协议

Standard（单任务/简单顺序）保持原可复制Prompt和必要资产/交接；Edited Film View（多段、非线性、补镜、声画拆分）先给成片目标/短故事纲要、任务素材表、播放顺序/EDL、每任务六字段及必要上传清单、后期音轨与剪点说明、预算风险。用户要求只计划可停在计划；任务多时允许明确分章节交付，当前输出范围和剩余清单可追踪，不能把未输出称完整；不承诺后台生成。Director Detail 可展开故事/素材/剪辑三表、技巧理由、状态和QC。实际视频不存在时所有时间点为proposed，裁切后需检查台词、完整动作、手与道具状态；真实素材只有经查看才能verified。后期音乐可选，模型无BGM；不提供未请求的音乐、特效或生成密码。

## 11. QC、回归与发布

ED-H01 目标/预算/任务及真实素材；H02 独立15s局部闭合和Classic锁；H03 三时间轴/ID引用；H04 源/目标区间及重复、净长；H05 故事事件和边界关系/状态；H06 用户约束/创意确认；H07 剪法前提/特殊转场授权/回退；H08 声画轨与口型/无BGM；H09 覆盖与必要信息/人物主体；H10 六字段与交付完整；H11 证据/规划实际状态；H12 跨章节任务预算与修改影响。软项：情绪、因果/清晰度、节奏、信息释放、眼动、人物表演、覆盖经济性、声音、技巧克制、画面风格。硬失败先修；需改核心创意回共创确认，重算所有相关EDL、音频和任务状态。原Creative QC、T06继续独立执行。

验收：保留原Classic完整代码块及VO；原脚本历史预算反例改为明确固定素材预算，扩容测试新增150/300成功、301失败，LF/CRLF相同；5分钟24素材×12.5s和非线性2分钟的可复算案例、至少一个完整多任务可复制样例，实际渲染未运行不宣称成功。至少45个新行为预期含自动选择/不炫技、非线性状态、重用、预算、跨任务声音、已存在素材、用户锁定、长片分批。测试脚本有限结构/算术规则，不是语言/视频判定器。正式版本仍待真实Skill/H3验收。

## 12. 可维护性

references/narrative 下管理故事/章节；references/editing 下管理决策、8类技巧与转场适配、素材、EDL、后期、QC、来源。稳定技巧ID；新增技巧必须完整卡片和来源，避免重复现有46转场。所有 active runtime 旧120/8限制迁移，旧设计文档标历史覆盖，120秒仍作兼容测试。源资料标访问日期、理论与AI适配区分。下一阶段如接NLE或实际视频分析是独立需求，不声称已实现。