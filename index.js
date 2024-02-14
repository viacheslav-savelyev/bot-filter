const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
const token = '6959034898:AAH6vCTeh4z2Yv31eZ6dcHkzF7XnbrbPJlk'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, `Загадываю цифру от 1-9, отгадай`)
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}


const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветствие' },
		{ command: '/info', description: 'Получить инфу от пользователя' },
		{ command: '/game', description: 'Игра угадай цифру' },
	])

	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start') {
			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/49d/2a3/49d2a340-d08e-414c-b347-760b0e8ca3d9/4.webp')
			return bot.sendMessage(chatId, `Добро пожаловать в KatoInside`)
		}

		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
		}

		if (text === '/game') {
			return startGame(chatId);
		}

		return bot.sendMessage(chatId, 'Я тебя не понимаю')


	})

	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === '/again')
			return startGame(chatId);

		if (data === chats[chatId]) {
			return bot.sendMessage(chatId, `Ты угадал цифру - ${chats[chatId]}`, againOptions)
		} else {
			return bot.sendMessage(chatId, `Попробуй еще раз, бот загазал цифру ${chats[chatId]}`, againOptions)
		}
	})


}

start()