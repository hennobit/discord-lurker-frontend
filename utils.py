import datetime
from enums import MicState


def get_mic_state(member) -> str:
    if member.voice is None:
        return ''

    if member.voice.self_deaf:
        return MicState.SOUND_MUTED.value

    if member.voice.self_mute:
        return MicState.MUTED.value

    return MicState.UNMUTED.value

def date_string_to_date(time_str: str) -> datetime.datetime:
    return datetime.datetime.strptime(
        time_str, '%Y-%m-%d %H:%M:%S.%f')