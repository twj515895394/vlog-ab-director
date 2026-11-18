# T03B 转场边界规划示例：none / suggest_only / planned_pair

> **这是内部导演规划实例，不是完整 MiniMax H3 六段式 Prompt，更不是已渲染视频**。  
> 上游：T01 选择模式 → T02 15 秒时间轴/净时长 → T03 镜头状态/跨段 handoff → T03B 是否推荐特殊转场。  
> 下游：T05 才把选用后的两端镜头完整装配进各独立 Part 的 H3 Prompt，T07 需要实机检验。  
> 技巧来源：[46 种技巧库](../docs/transition-techniques-library-v2.md)；规则：[transition_director.md](../references/transition_director.md)。

## 案例 A：30 秒同场景对话 — none（正确且优先）

- 主题：两个人在客厅持续讨论旅行回忆，P1→P2 正处在一段重要对白附近；无需地理跳跃、隐藏剪辑或炫技动作。
- 规则判断：特殊转场会打断交流，**普通硬切足够**。
- `transition_decision: none`；`transition_id: null`；不要求 `outgoing_shot / incoming_shot` 的特殊转场定义。
- T03 状态交接仍必须记录人物、衣着、持有道具、位置与说话者。**none 不等于跳过 continuity handoff**。
- 默认 Prompt 不做任何转场相关的改写。

## 案例 B：60 秒从城市走到林间 — suggest_only（默认可推荐但不执行）

用户只提出「帮我做旅行 Vlog，看看有没有有意思的衔接」，没有明确授权修改镜头。

- P2 尾镜：人物沿人行道经过实际存在的路边树干；P3 首镜：下一处林间入口。
- 候选：`OC02` 树干/立柱遮挡（风险 L，前景位置与两镜运动方向需要进一步核对）。
- **在 Prompt 外的可选建议**：P2 摄影机沿树干移动、让树干最终占满画幅；P3 从相似树干背后同方向缓缓移出；满幅遮挡帧硬切。
- 决策：`transition_decision: suggest_only`，`transition_id: OC02`。
- **不允许**：把 P2 已有的最后一镜偷偷替换成树干遮挡镜；把 P3 第一镜偷偷改成「从树后穿出」；扣减任何本来没有确认的裁剪时长。
- 用户后来明确说「就用这个树干遮挡」且镜头/状态/时间可行，才重新检查并转为 `planned_pair`。

## 案例 C：45 秒旅拍，明确授权甩镜接力 — planned_pair / CM01

用户要求「P2 到 P3 就用同方向甩镜接海边」，且两端是可以调整的 Adaptive AB 客观镜头，不是固定 Classic 自拍首镜。

```text
boundary_id: P2_to_P3
decision: planned_pair
transition_id: CM01
story_reason: 通过一次高速摄影机摆动强调从城市到海岸的节奏跃迁
risk: M
from_part: P2
to_part: P3
outgoing_shot:
  shot_id: P2.last_B
  local_time: [11.000, 15.000)
  camera: B_external
  action: 前景人物走过画面；摄影机自左向右快速甩动
  final_visual: 最后可剪帧为真实右向运动模糊
incoming_shot:
  shot_id: P3.first_B
  local_time: [0.000, 3.500)
  camera: B_external
  initial_visual: 真实右向甩镜的运动模糊状态
  reveal: 摄影机沿同方向减速，露出海边空间
matching_constraints:
  movement_direction: both_screen_right
  camera_height: matched
  motion_speed: similar_whip_peak
cut_basis: both_rightward_motion_blur_peaks
physical_handoff:
  boundary_type: location_jump
  events: [travel_from_city_to_coast]
  persistent_lock: [subject_identity, attire, carried_prop_ids]
  old_spatial_anchors: remain_in_city
assets:
  P2: current_task_scene_city_and_character_upload_manifest
  P3: independently_uploaded_scene_coast_and_character_manifest
edit_plan:
  strategy: find_matching_motion_blur_frames_then_hard_cut
  actual_trim_seconds: unknown_until_render_and_edit
duration_budget:
  do_not_assume_free_extra_seconds: true
audio_bridge: natural_ambience_and_foley_only_no_BGM
fallback: normal_hard_cut_or_occlusion_if_a_real_foreground_occluder_exists
```

**验收**：两端均是 B 镜且同向甩镜；P3 必须是**新的独立 15 秒任务，本地从 0 秒计时**；实际可用模糊峰值待视频渲染后才能核实。未授权的外部素材不视为已经上传。

## 案例 D：120 秒的空间跳跃 — planned_pair / PT01 水池穿越

用户明确要求「其中一处就用穿越水池进入另一场景」，不是所有七处衔接都使用神转场。

```text
boundary_id: P4_to_P5
decision: planned_pair
transition_id: PT01
risk: H
story_reason: 从林间溪水过渡到陌生海岸，形成梦境般的章节跃迁
outgoing_shot:
  shot_id: P4.last_B
  local_time: [11.000, 15.000)
  camera: B_external
  safe_camera_movement: 摄影机贴近浅水水面，真实波纹/气泡逐渐占满画幅
  end_frame: 水纹和气泡的高覆盖状态
incoming_shot:
  shot_id: P5.first_B
  local_time: [0.000, 3.500)
  camera: B_external
  start_frame: 与上一段相近颜色/尺度/运动方向的水纹与气泡
  safe_camera_movement: 摄影机由水面向上移开，揭示另一处海岸
matching_constraints:
  color: pale_cool_blue_gray
  texture: water_ripple_and_bubbles
  direction: similar_camera_reveal
cut_basis: maximal_similar_water_coverage_frames
physical_handoff:
  boundary_type: location_jump
  events: [narrative_jump_from_forest_stream_to_coast]
  persistent_lock: [subject_identity, carried_prop_ids_unless_explicit_event]
  old_spatial_anchors: stay_at_forest
assets:
  P4: require_real_forest_stream_references_if_Ref2VA
  P5: require_real_coast_water_references_if_Ref2VA
edit_plan:
  hard_cut_at_matching_water_texture
  trimming: only_count_real_required_trim_after_visual_inspection
  optional_post: local_speed_adjust_or_mask_if_editor_confirms_possible
duration_budget:
  gross_8_parts_s: 120.000
  exact_target_s: 120.000
  if_confirmed_trim_s: 1.000
  net_after_trim_s: 119.000
  result: LENGTH_FEASIBILITY_CONFLICT
audio_bridge: water_foley_and_environment_only_no_BGM
fallback: GM03_water_texture_match_or_normal_hard_cut
```

这里**绝不能**宣称 P4 一次生成能跨世界延伸成 P5。摄影机接近水面是拍摄建议，**不要求角色冒险潜水**。如果最终净长必须精确 120 秒且需要剪掉 1 秒，那么现有 8×15 秒核心素材不够；应建议放弃损耗的转场、接受更短净长或另行评估额外素材方案。

## 案例 E：Classic AB 镜头锁定时 — 建议不等于强改

- 用户明确要求「六镜、每镜 2.5 秒、AB 交替」，且 P1 最后 B3 已经被锁定为人物背影情绪定格，P2 第一个 A4 已锁定为正面自拍口播。
- 如果建议的技巧需要两镜都改成高速甩镜，**不要通过新增第七镜或改时间码强行实现**。
- 只有可兼容已锁定镜头且用户明确授权时，才允许 `planned_pair`；当前场景选择 `none`，如用户希望，可在 Prompt 外单独说明不能实现该技巧的原因。
- **原有 Classic 时序为：0.000、2.500、5.000、7.500、10.000、12.500、15.000**，始终保持。

## 案例 F：90–120 秒治愈 Vlog — 全部 none 合法

- 8 个 Part、7 个相邻边界：`P1→P2 … P7→P8`，均为对话、平稳风景、动作自然延续或情绪留白。
- 七个决策都可以是 `none`，而且 T03 的七份连续性交接仍然成立。
- 不设置「至少出现 X 个神转场」的打分指标；不为了填满技巧库而引入水池、门洞、镜子或树干。
- 全部生成任务无 BGM；如果剪辑后长度有损耗，仍按 T02 账本核算，**none 不需要自动扣掉时间**。

## 静态案例与实机的区别

案例 C/D 是导演提示词**双端规划草图**。它们描述的两个镜头尚未被装配成每个 Part 的完整六字段 H3 Prompt，也未实际渲染、检查模糊、水纹、参考图或剪辑点。T05/T07 依次承担这些后续工作。
