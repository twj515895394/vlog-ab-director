# T04 声画/对白回归矩阵（语义正确性与无 BGM）

> **当前为静态文本验收案例**，不是自动视频音频检测程序，也不是声称 H3 已经按这些规则生成成功。  
> 规范：[audio_director.md](../references/audio_director.md) · [Classic 兼容节拍器](../references/metronome_dialogue_timings.md) · [用户实测中文 VO](../examples/voiceover-verified.md)。  
> **唯一直接成功的外部证据**：用户报告过其中一个明确的中文 VO 片段实机有效；其他场景均属规范级预期，需 T06/T07 检验。

## 1. 单镜说话、画外音与口型

| ID | 输入/情况 | 期望结果 | 静态判定 |
|---|---|---|---|
| A01 | S1 可见嘴部，对镜头说 `<d>[Chinese] 今天出来散步。</d>` | 画内直言、S1 `sync_lips` | PASS |
| A02 | B 镜外部机位里 S2 对 S1 说话 | **B 镜也允许画内直言**，S2 嘴型同步 | PASS |
| A03 | 用户实测原话 `此时她以画外音心声说道：<d>[Chinese] 果然如入深谷，甚是清净。</d> while her lips remain completely closed.` | 有画外声源 + 中文标签 + 闭嘴，**不用英文固定短语也通过** | PASS（用户单例经验） |
| A04 | A03 因缺少 `says in an off-screen voiceover:` 被拒绝 | **不得误拒**，改语义判定 | FAIL / HARD |
| A05 | 英文 `says in an off-screen voiceover: <d>[Chinese] ...</d> while her lips remain completely closed.` | 可兼容，不是唯一写法 | PASS（候选，未实测） |
| A06 | B 镜可见 S1 嘴唇，S1 同时要求同步张口与 `while her lips remain completely closed` | 同一时点嘴型矛盾，必须改为画内或画外之一 | FAIL / HARD |
| A07 | B 镜拍到 S1 背影，根本看不到嘴部，S1 画外音 | `lip_policy=not_visible`；不必谎称已看见嘴唇闭合 | PASS |
| A08 | S1 主角完全不入画，只有环境风景与 S1 心声 | 画外音合法、嘴部不可见 | PASS |
| A09 | 用户要求无口播，Skill 仍给每个 A 镜写开场问候 | 违反用户指令，必须删去强加台词 | FAIL / HARD |
| A10 | Cinematic-led 15 秒只要人物背影与环境，没有任何对白 | 允许 0 台词，保留环境与 Foley | PASS |
| A11 | S1 画外音，但没有任何线索说明是谁在说且画中有多人 | 声源歧义，补 speaker ID | FAIL / HARD |
| A12 | A 镜可见 S1 在说话，S2 明确只倾听却被写成同口型发声 | S2 不应同步 S1 台词 | FAIL / HARD |

## 2. 多人轮次及声线归属

| ID | 输入/情况 | 期望结果 | 静态判定 |
|---|---|---|---|
| A13 | S1 先讲一句，S2 反问一句，分轮并给出各自 ID | 台词与口型各归属明确 | PASS |
| A14 | S1 的台词硬切后突然标成 S2 继续且没有换人说明 | 发言者漂移，应修正 `audio_carry` | FAIL / HARD |
| A15 | 双人同一镜轮流讲话，但 2.5s 内塞 4 个长句 | 时间/轮次过载，建议分镜或删减 | REVIEW / SOFT |
| A16 | 双人明确要一起说「周末快乐」且两个角色都可见 | `(S1,S2)` 合法，两人各自同步口型 | PASS |
| A17 | 双人没有合说需求，Skill 却强制 `(S1,S2)` 齐声呼喊 | 删去无必要的合说 | REVIEW / SOFT |
| A18 | S1 说画外心声，S2 可见但只是看着远方 | S2 不能张口同步 S1 的画外音 | PASS，需 S2 安静 |

## 3. L-Cut、J-Cut 及跨 Part 声画范围

| ID | 输入/情况 | 期望结果 | 静态判定 |
|---|---|---|---|
| A19 | A1 中 S1 开口，切入 B1 仍由 S1 说完后半句 | L-Cut：视觉切点、S1 起止、B1 嘴型归属明确 | PASS（规划） |
| A20 | A19 没用 `<scenetrans>` 却被认作不合法 | **不得仅因缺此标签拒绝**，自然语言起止关系即可 | FAIL / HARD |
| A21 | A19 同镜写两个不同声源重复同一完整台词 | 避免重复发声，保留唯一声源 | FAIL / HARD |
| A22 | 前一镜城市画面还在，下一镜森林鸟声提前出现 | J-Cut，声源为新场景，明确声音先入时间 | PASS（规划） |
| A23 | 前镜画面 S1 闭嘴，后镜 S2 台词提前响起 | J-Cut 声源绑定 S2，S1 不应错误同步嘴型 | PASS（规划） |
| A24 | H3 Part 1 与 Part 2 独立生成，声称 `<scenetrans>` 保证无缝原声 | 不得承诺，跨 Part 音轨由后期混音/重配声 | FAIL / HARD |
| A25 | 2×15s 独立视频，需要 P2 的海浪声提前叠进 P1 尾部 | 后期 J-Cut：分别生成素材、剪辑师提前混入 P2 声轨 | PASS（后期建议） |
| A26 | 跨 Part 心声连续，方案不提供声源或后期拼接信息 | 缺关键 handoff 信息，不能称已完成 | FAIL / HARD |
| A27 | L/J-Cut 被包装成唯一「神转场」，强制改成甩镜/水面穿越 | 音频桥不是必需摄影技巧，T03B 仍可 none | FAIL / HARD |
| A28 | 无 L/J-Cut 的普通硬切，环境 Foley 自然接续 | 合法，不要求所有边界都有音频桥 | PASS |

## 4. 台词窗口、全局 D3 与 H3 字段

| ID | 输入/情况 | 期望结果 | 静态判定 |
|---|---|---|---|
| A29 | Classic 2.5 秒镜 1 句短口播，另有停顿 | 维持既有 6–12 字经验区间作为参考，核对动作是否可行 | PASS（预算） |
| A30 | Adaptive 2 秒镜，安排 18 汉字长口播且要同时脱鞋拿包 | 口播/动作超载，优先缩短台词或调镜头动作 | REVIEW / SOFT |
| A31 | 用户锁定逐字台词，但时间预算不足，Skill 未告知就删改 | 不能静默改用户原文，应提出时间调整 | FAIL / HARD |
| A32 | Classic/Adaptive/Cinematic-led 的生成 Prompt 都写 `non_diegetic_music: N/A` | 所有模式、每个 Part 均如此 | PASS |
| A33 | `overall_soundscape` 写「暖心钢琴 BGM + 温柔海浪」 | 生成阶段 BGM 禁令，必须去掉配乐，仅保留海浪 | FAIL / HARD |
| A34 | 用户要求音乐卡点 MV，Skill 把 EDM/BPM 写入 `non_diegetic_music` | 必须改为 `N/A`；卡点建议只放 Prompt 外 | FAIL / HARD |
| A35 | `detailed_description` 末尾无 `【强制声明】` 或缺少「无背景音乐」 | 违反已冻结的防字幕/无 BGM 约束 | FAIL / HARD |
| A36 | `<d>[Chinese] ...</d>` 被当成视频字幕写入画面 | 标签是声音文本，不得生成可见字幕或虚假 UI | FAIL / HARD |

## 5. 核心证据和静态验收步骤

1. **VOICE-CN-PROVEN**：逐字核对用户原句中的中文「此时她以画外音心声说道」+ `<d>[Chinese] ...</d>` + `while her lips remain completely closed.`。语义 QC **不可依赖固定英文句**。
2. **嘴型/声源**：对镜头逐项检查 S1/S2、画内/画外、visible/hidden、`sync_lips/closed_lips/not_visible`，不能出现同一时刻互斥。
3. **跨镜**：记录前/后镜的画面切点、音频事件 ID 与时间范围；旧 `<scenetrans>` 是候选，**不能作为强制通行证**。
4. **跨 Part**：两个 15s 生成任务不会自动共享音轨，L/J-Cut 需在后期处理；文字规则通过不等于已经得到连续声轨。
5. **D3 全局**：检查每个 Part 的 `detailed_description` 负向块、`overall_soundscape` 仅人声环境 Foley、`non_diegetic_music` 严格 `N/A`；后期音乐建议必须置于 Prompt 外。
6. **时间预算**：Classic 经验值保持，Adaptive 按实际可说话窗口规划，允许完全无对白。
7. **测试边界**：本文件的 PASS/FAIL 表达的是**预期规范的判定结果**，并非 36 次已加载 Skill 的语言模型执行或 36 次 H3 视频实测。
