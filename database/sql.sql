SELECT ui.user_id, ui.server_id, ui.username, ui.status, ui.unmuted_time,
                  ui.total_time_muted, ui.total_time_sound_muted, vci.voice_channel, vci.total_time,
                  ost.online_total, ost.offline_total, ost.idle_total, ost.dnd_total
           FROM user_info ui
           LEFT JOIN voice_channel_info vci ON ui.user_id = vci.user_id AND ui.server_id = vci.server_id
           LEFT JOIN online_status_time ost ON ui.user_id = ost.user_id AND ui.server_id = ost.server_id