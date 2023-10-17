import logging

#  Bot Logger
bot_logger = logging.getLogger('Bot')
bot_handler = logging.FileHandler('bot.log')
bot_formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
bot_handler.setFormatter(bot_formatter)
bot_logger.addHandler(bot_handler)
bot_logger.setLevel(logging.DEBUG)

# Heartbeat Logger
heartbeat_logger = logging.getLogger('Heartbeat')
heartbeat_handler = logging.FileHandler('heartbeat.log')
heartbeat_formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
heartbeat_handler.setFormatter(heartbeat_formatter)
heartbeat_logger.addHandler(heartbeat_handler)
heartbeat_logger.setLevel(logging.INFO)
