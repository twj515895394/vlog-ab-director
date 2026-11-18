# Vlog AB Director · 电影感 Vlog 导演 Skill

面向 MiniMax H3 Ref2VA / T2VA 的提示词导演：按题材选择镜头策略、组织15秒独立任务、控制人物和道具状态、设计可选转场与声画，再交付完整六字段 Prompt。

**状态：v2 文本实现候选版，静态回归已通过；实际 Skill 行为与 H3 视频验收尚未完成。正式版本号暂保留 1.0.0。**

## 使用

在支持 Skill 的客户端中加载本仓库 SKILL.md（中文入口另见 SKILL.cn.md），保留 references、templates 和 docs 相对目录。客户端的实际导入/安装方式取决于所使用的工具。本仓库不是 H3 推理服务，也不会自动调用模型或剪辑视频。

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

最长计划成片120秒（1–8个独立15秒任务），不能承诺一次生成120秒或裁切后仍满120秒。非15秒倍数按素材和剪后净长分别核算。

转场三态：none（自然硬切）、suggest_only（建议在Prompt外，不改原稿）、planned_pair（用户选用或明确委托且可行才设计双端）。没有合适技巧时完全不使用。生成阶段始终无BGM，后期音乐卡点仅外置建议。中文闭嘴画外音不要求固定英文短语。

## 模板

- [15秒 Classic](templates/template_15s_single.md) / [30秒 Classic](templates/template_30s_twopart.md)
- [15秒 Adaptive](templates/template_15s_adaptive.md) / [30秒 Adaptive](templates/template_30s_adaptive_twopart.md)
- [15秒 Cinematic-led](templates/template_15s_cinematic.md)
- [3–8 Part 装配及完整八段样例](templates/template_multipart_15s_sequence.md)

参考图样例需按各任务清单实际上传；本仓库并未附送对应图像。无图走T2VA，不虚构Picture引用。模板是写作范例，不代表全部题材都使用同样故事。

## 检查与维护

Node.js 18+，无npm依赖：

```sh
node tests/qc-check.mjs
```

仓库脚本检查完整模板、冻结基线、可解析字段、局部时间轴、图编号、负向块、有限音乐指令检测及结构化正反例。不是任意自然语言理解器，也不能判断真实视频中的穿模或声画表现。运行 Skill 时必须按 [统一QC](references/quality_control.md) 自检。

[实施计划](docs/implementation-plan-v2.md) · [回归矩阵](tests/regression-matrix.md) · [真实 H3 验收协议](docs/h3-validation-protocol.md) · [实机记录](examples/h3-validation-results.md) · [变更记录](docs/changelog-v2.md)

## 能力边界

本 Skill 旨在降低提示词矛盾、提高连续性，并非保证 H3 不穿帮、精准切镜或跨任务自动共享音轨。实际效果需要使用具体 H3 部署版本实测。用户报告的一条中文闭嘴 VO 经验有单独记录，不能泛化为所有镜头实测成功。正式 v2 发布需通过 T07 实机验收。