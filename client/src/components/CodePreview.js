import React from 'react';
import { motion } from 'framer-motion';

const CodePreview = () => {
  const codeExamples = [
    {
      language: "JavaScript",
      code: `// Пример на JavaScript
function фибоначчи(n) {
  if (n <= 1) return n;
  return фибоначчи(n - 1) + фибоначчи(n - 2);
}

console.log(фибоначчи(10)); // 55`
    },
    {
      language: "Python",
      code: `# Пример на Python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

numbers = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(numbers)
print(numbers)`
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Интерактивный <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">опыт кодинга</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Практикуйтесь прямо в браузере и получайте обратную связь в реальном времени
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {codeExamples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden mb-8"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-gray-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-300 text-sm font-medium">{example.language}</span>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono">
                  <code>{example.code}</code>
                </pre>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Попробовать сейчас
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CodePreview;