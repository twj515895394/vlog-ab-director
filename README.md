# Vlog AB Director · 人物短视频创意与视听导演 Skill

从零点子和人物参考开始共同构思轻剧情/弱剧情/非剧情审美短视频，确认创意简案后进入 MiniMax H3 Ref2VA/T2VA 导演引擎：选择策略、安排15秒任务、处理连续性、可选转场及声画，交付完整六字段 Prompt。

**状态：v2.2 Creative + Editing Director 文本候选实现；实际 Skill 多轮行为与 H3 视频验收尚未完成。正式版本号暂保留 1.0.0。**

## 使用

在支持 Skill 的客户端中加载本仓库 SKILL.md（中文入口另见 SKILL.cn.md），保留 references、templates 和 docs 相对目录。客户端的实际导入/安装方式取决于所使用的工具。本仓库不是 H3 推理服务，也不会自动调用模型或剪辑视频。

没有点子时也可以直接使用：

- 「我想做以人为主的轻剧情短视频，没有点子，陪我一起发散。」
- 「只有一张古风角色图，希望是30秒柔光电影感，先给我几条具体创意。」
- 「喜欢A的偶遇和C的情绪，但不要咖啡和悲伤结局，再讨论两个版本。」
- 「这版简案定稿，直接生成H3 Prompt。」

创意阶段会给不同人物驱动力、核心情境及记忆点；可比较、融合和重构。只要灵感/简案时不会强制进入制作；已有明确剧本且要求成品则直接进入导演引擎，不重复走讨论。

给出题材、人物与参考素材、希望的成片时长、画幅、对白/留白、可选的导演模式或转场要求。例如：

- 「15秒雨后逛唱片店，Classic AB，六镜2.5秒，角色参考图一张，无BGM。」
- 「30秒旅行Vlog，自拍和风景交替但不机械等长，正常硬切，两段各上传同一角色和不同环境图。」
- 「15秒古风竹林人物，柔和自然光，无手机，闭嘴中文心声。」
- 「120秒山间旅行，Cinematic-led，全部自然剪接，无台词。」

默认 Auto 根据输入选择策略；用户明确锁定的镜头优先。输出完整可复制的六字段 text 文本；多段附当次参考图顺序和必要交接。详细状态/QC 按需展示。

| 策略 | 适用 | 时序 |
|---|---|---|
| Classic AB | 传统自拍+客观记录，固定六镜 | 6×2.5秒，ABABAB |
| Adaptive AB | 旅行、生活、情侣互动 | 不等长，A/B按叙事分工 |
| Cinematic-led | 氛围、人物/时装、风景 | B优先，可全B、可无对白 |

最长计划成片300秒，每个H3任务独立15秒；20任务仅是300秒无损新素材下界，补镜按有限显式预算。实际剪点、素材与净长待实机核验。

转场三态：none（自然硬切）、suggest_only（建议在Prompt外，不改原稿）、planned_pair（用户选用或明确委托且可行才设计双端）。没有合适技巧时完全不使用。生成阶段始终无BGM，后期音乐卡点仅外置建议。中文闭嘴画外音不要求固定英文短语。

## 连续叙事与剪辑导演

连续轻剧情Vlog、片段剪辑叙事、混合叙事都是一等路径；根据实际剧本AUTO选择，不按时长强制。连续链严格T03交接，时域跳跃按Story版本。Classic/Adaptive/Cinematic独立选择。59张新剪辑卡覆盖时间、蒙太奇、连续性、情绪、节奏、信息、插镜、声音；特殊46转场继续可选授权。[剪辑导演](references/editing/editing_director.md) / [叙事架构](references/narrative/narrative_architect.md) / [详细设计](docs/design-v2.2-editing-director.md) / [实施计划](docs/implementation-plan-v2.2-editing-director.md)。

## 创意资料库

[创意入口](references/creative/creative_director.md) · [题材库](references/creative/genre_library.md) · [共创协议](references/creative/collaborative_discussion.md) · [创意组合机制](references/creative/creative_combination_engine.md) · [简案契约](references/creative/creative_brief.md) · [创意QC](references/creative/creative_quality_control.md)

[详细设计](docs/design-v2.1-creative-engine.md) · [实施计划](docs/implementation-plan-v2.1-creative-engine.md) · [创意回归](tests/creative-cases.md)

## 模板

- [15秒 Classic](templates/template_15s_single.md) / [30秒 Classic](templates/template_30s_twopart.md)
- [15秒 Adaptive](templates/template_15s_adaptive.md) / [30秒 Adaptive](templates/template_30s_adaptive_twopart.md)
- [15秒 Cinematic-led](templates/template_15s_cinematic.md)
- [多任务装配及120秒八段兼容样例](templates/template_multipart_15s_sequence.md)

参考图样例需按各任务清单实际上传；本仓库并未附送对应图像。无图走T2VA，不虚构Picture引用。模板是写作范例，不代表全部题材都使用同样故事。

## 剪辑与连续叙事样例

- [30秒混合叙事完整三任务Prompt](examples/editing/hybrid-30s-complete.md)：现实出入状态中间插入回忆，返回仍严格接续。
- [120秒完整故事预剪计划](examples/editing/edited-120s-story-plan.md)：10任务、非线性播放、净120s预算。
- [300秒两种组织方式预算](examples/editing/300s-dual-path-budget.md)：连续20任务/剪辑24任务（示例，不是生成数上限）。
- [50条行为回归](tests/editing-cases.md) 与 [确定性脚本](tests/editing-check.mjs)；真实多轮Skill/H3仍未验证。

## 检查与维护

Node.js 18+，无npm依赖：

```sh
node tests/qc-check.mjs
node tests/creative-check.mjs
node tests/editing-check.mjs
```

仓库脚本检查完整模板、冻结基线、可解析字段、局部时间轴、图编号、负向块、有限音乐指令检测及结构化正反例。不是任意自然语言理解器，也不能判断真实视频中的穿模或声画表现。运行 Skill 时必须按 [统一QC](references/quality_control.md) 自检。

[实施计划](docs/implementation-plan-v2.md) · [回归矩阵](tests/regression-matrix.md) · [真实 H3 验收协议](docs/h3-validation-protocol.md) · [实机记录](examples/h3-validation-results.md) · [变更记录](docs/changelog-v2.md)

## 能力边界

本 Skill 旨在降低提示词矛盾、提高连续性，并非保证 H3 不穿帮、精准切镜或跨任务自动共享音轨。实际效果需要使用具体 H3 部署版本实测。用户报告的一条中文闭嘴 VO 经验有单独记录，不能泛化为所有镜头实测成功。正式 v2 发布需通过 T07 实机验收。