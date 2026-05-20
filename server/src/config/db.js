const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Функция подключения к базе данных MongoDB
const connectDB = async () => {
  try {
    // Подключение к MongoDB с использованием строки подключения из переменных окружения
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Вывод ошибки подключения и завершение процесса
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;