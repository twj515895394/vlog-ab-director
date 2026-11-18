# T05 H3 装配器静态回归用例与验收方法

范围：检查六字段实际成品文本、局部时间、素材映射及输出边界；不代表已加载 Skill 的行为测试或 H3 视频生成结果。正式语义 QC 留 T06，实机留 T07。

| ID | 输入或检查对象 | 预期 |
|---|---|---|
| H01 | 15s Classic | 一份完整六字段，六镜 2.5s，固定 AB |
| H02 | 30s Classic | 两份独立六字段，两个任务各自重置局部时间 |
| H03 | 15s Adaptive | 一份完整六字段，允许不同镜长及 B-B |
| H04 | 30s Adaptive | 两份独立完整文本，允许不同镜头比例 |
| H05 | Cinematic-led | 允许全 B、无手机、无台词 |
| H06 | 45/60/75/90/105/120s | 无损新素材下界3/4/5/6/7/8段，实际任务预算另计；全部独立输出 |
| H07 | 120s 八段示例 | 八份完整六字段，七次普通硬切合法 |
| H08 | 52s 成片 | 四份15s素材；给出净时长裁切账本 |
| H09 | 120s目标、固定8任务且无其他素材/复用，要求裁掉1s | 报告119s净长及冲突，不保证120s |
| H10 | 实际上传 A、C 两图 | 本任务 C 是 Picture 2，不是 Picture 3 |
| H11 | T2VA 无图 | 无 Picture 引用，无 reference generation 标记 |
| H12 | 多人素材 | 按实际 manifest 绑定角色；不能交换声线/道具 |
| H13 | 未替换的示例方括号 | 拒绝交付，保留合法 Shot、Chinese、reference generation |
| H14 | 缺某一字段或新增状态机顶层字段 | 拒绝，保持六字段顺序和各一次 |
| H15 | 第二段时间从15秒开始 | 拒绝，独立任务从0到15s |
| H16 | “其余同上”或后续任务省略（未明确分批交付） | 拒绝，所有任务必须自包含 |
| H17 | 用户仅建议转场 | 建议外置，不修改 Prompt |
| H18 | 用户采纳且可行 | 双端镜头进入各自 Prompt，剪辑点/回退外置 |
| H19 | 所有边界 none | 不要求任何特殊转场字段 |
| H20 | 任何模式要求音乐卡点 | 全部生成无 BGM；后期建议外置 |
| H21 | 用户要求真实招牌文字 | 只允许指定实体文字，禁字幕/浮层/UI，提示失真风险 |
| H22 | 默认无真实文字需求 | 使用冻结的原负向块与空行 |
| H23 | 中文已验证 VO | 保留声源和闭嘴语义，不强制英文短语 |
| H24 | L/J-Cut 跨独立任务 | 必要后期混音说明外置，不承诺自动衔接 |
| H25 | Standard / Multi-Part / Director Detail | 默认只提供可复制成品及必要清单，详细规划按需 |
| H26 | 全局风格或人物被样例场景覆盖 | 拒绝机械套样例，用户输入优先 |

## 实际样例检查对象

- templates/template_15s_single.md（1块）
- templates/template_30s_twopart.md（2块）
- templates/template_15s_adaptive.md（1块）
- templates/template_30s_adaptive_twopart.md（2块，已采纳 OC02）
- templates/template_15s_cinematic.md（1块，无图）
- templates/template_multipart_15s_sequence.md（8块，无图）

合计 15 份可复制 Prompt。对每块可解析核对六字段顺序、镜头编号及区间闭合、Classic 固定切点、方括号白名单、BGM 值及默认负向块、按该示例 manifest 的 Picture 引用范围。H08/H09/H12/H17/H21/H24/H25/H26 等是规范预期，不等同于已运行的完整语义或真实模型测试。
