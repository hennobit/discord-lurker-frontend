export interface User {
    user_id: number;
    server_id: number;
    username: string;
    status: string;
    unmuted_time: number;
    total_time_muted: number;
    total_time_sound_muted: number;
    voice_channel: string;
    total_time: number;
    online_total: number;
    offline_total: number;
    idle_total: number;
    dnd_total: number;
    last_status_change: string;
    percentage_total: number;
    activity: string;
    avatar: string;
    roles: string; 
    premium_since: string; 
    joined_at: string; 
    created_at: string; 
}