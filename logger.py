import datetime

def log(message):
    print(f'{datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]} - {message}')