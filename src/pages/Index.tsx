import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  prize: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Какая планета является самой большой в Солнечной системе?",
    answers: ["Марс", "Юпитер", "Сатурн", "Нептун"],
    correctAnswer: 1,
    prize: "1 000 ₽"
  },
  {
    id: 2,
    question: "В каком году человек впервые высадился на Луну?",
    answers: ["1965", "1969", "1972", "1975"],
    correctAnswer: 1,
    prize: "5 000 ₽"
  },
  {
    id: 3,
    question: "Сколько континентов на Земле?",
    answers: ["5", "6", "7", "8"],
    correctAnswer: 2,
    prize: "10 000 ₽"
  },
  {
    id: 4,
    question: "Кто написал 'Войну и мир'?",
    answers: ["Достоевский", "Пушкин", "Толстой", "Чехов"],
    correctAnswer: 2,
    prize: "50 000 ₽"
  },
  {
    id: 5,
    question: "Какой элемент имеет химический символ 'Au'?",
    answers: ["Серебро", "Золото", "Алюминий", "Аргон"],
    correctAnswer: 1,
    prize: "100 000 ₽"
  },
  {
    id: 6,
    question: "Столица Австралии?",
    answers: ["Сидней", "Мельбурн", "Канберра", "Брисбен"],
    correctAnswer: 2,
    prize: "500 000 ₽"
  },
  {
    id: 7,
    question: "Сколько клавиш на стандартном пианино?",
    answers: ["76", "88", "96", "100"],
    correctAnswer: 1,
    prize: "1 000 000 ₽"
  }
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const correct = answerIndex === questions[currentQuestion].correctAnswer;

    setTimeout(() => {
      if (correct) {
        setScore(score + 1);
        setShowConfetti(true);
        
        toast({
          title: "🎉 Правильно!",
          description: `Вы выиграли ${questions[currentQuestion].prize}`,
          className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0",
        });

        setTimeout(() => {
          setShowConfetti(false);
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
          } else {
            setGameOver(true);
            setIsWinner(true);
          }
        }, 2000);
      } else {
        toast({
          title: "❌ Неправильно!",
          description: `Правильный ответ: ${questions[currentQuestion].answers[questions[currentQuestion].correctAnswer]}`,
          variant: "destructive",
        });

        setTimeout(() => {
          setGameOver(true);
        }, 2000);
      }
    }, 500);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setGameOver(false);
    setIsWinner(false);
    setShowConfetti(false);
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) {
      return "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105";
    }
    
    if (index === questions[currentQuestion].correctAnswer) {
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg";
    }
    
    if (index === selectedAnswer) {
      return "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-lg";
    }
    
    return "bg-gray-300 text-gray-600 border-0 opacity-50";
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 md:p-12 bg-white/95 backdrop-blur-sm shadow-2xl animate-scale-in">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              {isWinner ? "🏆" : "💔"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isWinner ? "Поздравляем!" : "Игра окончена"}
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-700">
              {isWinner 
                ? `Вы выиграли ${questions[questions.length - 1].prize}! 🎉` 
                : `Вы выиграли ${score > 0 ? questions[score - 1].prize : '0 ₽'}`
              }
            </p>
            <p className="text-xl text-gray-600">
              Правильных ответов: {score} из {questions.length}
            </p>
            <Button 
              onClick={resetGame}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl py-6 px-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Icon name="RotateCcw" className="mr-2" size={24} />
              Играть снова
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4 md:p-8">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {['🎉', '🎊', '⭐', '✨', '💫', '🌟'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
            Кто хочет стать миллионером?
          </h1>
          <div className="flex items-center justify-center gap-4 text-xl md:text-2xl">
            <div className="flex items-center gap-2 bg-white/90 px-6 py-3 rounded-full shadow-lg">
              <Icon name="Trophy" className="text-yellow-500" size={28} />
              <span className="font-bold text-purple-600">{questions[currentQuestion].prize}</span>
            </div>
          </div>
        </div>

        <Card className="p-6 md:p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="font-semibold">Вопрос {currentQuestion + 1} из {questions.length}</span>
                <span className="font-semibold">Правильных: {score}</span>
              </div>
              <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-3" />
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border-2 border-purple-200">
              <p className="text-xl md:text-2xl font-semibold text-center text-gray-800 leading-relaxed">
                {questions[currentQuestion].question}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {questions[currentQuestion].answers.map((answer, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  size="lg"
                  className={`h-auto min-h-[80px] text-lg md:text-xl font-semibold rounded-2xl transition-all duration-300 ${getButtonClass(index)}`}
                >
                  <span className="flex items-center justify-center gap-3 px-2">
                    <span className="text-2xl font-bold opacity-70">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-left">{answer}</span>
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-purple-600 mb-3 flex items-center gap-2">
            <Icon name="TrendingUp" size={24} />
            Призовая лестница
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`px-4 py-2 rounded-lg text-center font-semibold transition-all duration-300 ${
                  idx === currentQuestion
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : idx < currentQuestion
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {q.prize}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
