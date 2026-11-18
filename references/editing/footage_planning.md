# Footage Plan — 素材池与连续链

Coverage {coverage_id,event_id,story_version,shot_function:establish/action/reaction/POV/insert/cutaway/bridge/hold,subject_action,entry/exit,axis/eyeline,duration_needed_ms,handles_ms,audio_focus,references,priority,task_id,shot_id}。
GenTask {task_id,role:primary/coverage/alternate,source_s:15,event_ids,required_shots,state_versions,local_shots,asset_manifest,audio,status,continuity_group_id?,depends_on_task_ids}。实际候选素材用clip_id/attempt_id/actual_duration_ms/timebase/verified_content区别，重生成不自动算可用。

CONTINUOUS的任务生成顺序按依赖，先计划前段exit与后段entry，实机按前段真正保留剪点核对后再生成/修订后段；技术任务独立不等于剧情解耦。EDITED可独立组织不同事件素材；HYBRID按连续组分别承接。所有边界必须按剧情决定，不靠编号强制连贯，也不默认断开。关键选择、反应、地点/时域线索按需覆盖，避免无意义补镜；Classic每任务6×2.5s固定。用户固定最终镜序时不改。所有任务局部0–15、真实局部图号，无图T2VA可行。

## 预算

按[现行时长契约](../timing_engine.md)，0<T≤300s；只用新素材且不复用时无损下界ceil(T/15)。按预计每任务实际可保留u≤15估计ceil(T/u)，再根据叙事覆盖调整有限N；明示假设/主素材/补镜/备选，gross=N×15。用户任务成本上限优先，不擅自超过；不需要强行补镜。300s连续Vlog可以20×15全部保留；若实际裁掉1s、20任务固定且无其他素材，则最多299s。300s片段剪辑可计划24×15=360s，每段预留12.5s共300s，60s余量而非质量保证。旧120s八段固定预算仍合法。已有素材以真实登记为准，可生成0任务。分批交付必须说明全部清单/已交付及剩余；不能省略后宣称完整。
