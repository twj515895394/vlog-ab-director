# Story Timeline — 真实事件与状态版本

事件结构：event_id（稳定E01...）、story_order、story_time_label（相对即可）、location_id、characters、story_version、state_before、action、state_after、cause_ids、knowledge_delta（角色知道的变化）、event_role、required/optional。记录相对时间和同一时段/不同时段，不假装日期精确。人物状态包含持续身份、年龄或时期版本、造型、衣服、手与道具、情绪以及场景固定锚点。过去/现在的状态分别由事件确定；跨年龄可使用独立参考资产，不虚构同图自动变龄。

示例：E01多年以前初学钢琴（少年版本，旧谱）、E02离开练琴室（成年早期，旧谱入箱）、E03成年现在找到谱（成年现在、箱内谱）、E04回琴房演奏（一致成年形态）。真实事件序E01→E02→E03→E04；播放可E03→E01→E02→E04。GenTask可按素材效率编号，实际编辑按EDL。回忆前后的成年服装/物件状态不可被童年版本覆盖。纯联想画面标associative，不伪造实际发生事件。

检查所有 cause_ids 均已定义且在真实事件序可发生；观众可以晚知道原因，但核心事件物理因果须成立。平行线明确 simultaneous / thematic / uncertain；主题相似不是事实同步。每段跳跃提供易读线索（角色形态、场景、同一物件、动作或声音），不强制字幕/特效。无故事时记录为视觉主题、时段、状态；不强加虚假情节。
## 连续叙事兼容

连续轻剧情Vlog的story_order、生成依赖和播放顺序通常一致；场景内动作链登记continuity_group_id、前序事件及手/道具/空间状态。非连续事件才允许按剧本使用不同时域版本。不要为了使用时间轴而改变已确认剧本。
