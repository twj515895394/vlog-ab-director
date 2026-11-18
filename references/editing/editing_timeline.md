# 三轴与预剪 EDL

Story event_id/story_order/时域/状态；Generation task_id/本地镜头及连续依赖；Edit观众播放区间。三轴独立表示，允许全部同序；CONTINUOUS默认严格剧情承接，EDITED/HYBRID依据实际边界。每个镜头全局task_id/shot_id。使用半开毫秒区间，实机以真实timebase校对，不默认24fps。

EditItem {edit_id,clip_id/task_id,source_in_ms,source_out_ms,dest_in_ms,dest_out_ms,event_id,story_version,purpose,boundary_id,reuse_reason?,status,state_at_in/out}。源时长计划15000，已有素材用真实范围。基础单视频轨、无重叠、无变速：源长度=目标长度，目标从0连续闭合，max(dest_out)=净长；同源区间复用须叙事理由，不当作新增素材，唯一使用时长按每clip区间并集。未知实际帧只proposed。

Boundary {from_edit,to_edit,relation:same_moment/ellipsis/time_jump/location_jump/flashback/flashforward/parallel/associative/return,event_evidence,exit_snapshot,entry_snapshot,allowed_change,viewer_cue,transition_decision,audio_bridge,fallback}。same_moment严格T03，包括人物手、道具位置、方向、衣装与场景，取实际保留出入点；ellipsis需合法事件；其他跳跃按目标Story状态和清楚线索；平行线分别维护内部连续性。不可用相邻任务号假设连续或断开。连续依赖若被裁切改变，更新下游或回退。

AudioItem {audio_id,asset_id/source_task,speaker/source_kind,source_in/out,dest_in/out,lip_policy,cut_relation,track,status}。J/L跨独立任务必须后期音轨/重配，不自动继承音频；声音重叠不扣画面净长。无实际音轨仅预案。变速/定格/视频叠合仅用户允许且实际可实现时建立额外轨道计算，基础EDL不自动支持这些效果。
