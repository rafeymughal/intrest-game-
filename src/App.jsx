import { useEffect, useState } from "react";
import "./App.css";

const questions = [
  {
    question: "Did you do your homework?",
    yes: "😎 Respect bro! You actually did it!",
    no: "💀 Bro... we are already in trouble!",
  },
  {
    question: "Did you attend yesterday's class?",
    yes: "🔥 Teacher knows your face!",
    no: "👻 Bro became invisible!",
  },
  {
    question: "Did you study before coming to class?",
    yes: "🧠 Big brain activated!",
    no: "💀 You came with pure confidence!",
  },
  {
    question: "Do you understand what the teacher is teaching?",
    yes: "🚀 Bro is becoming a developer!",
    no: "😭 Error 404: Understanding not found!",
  },
  {
    question: "Are you ready for the next test?",
    yes: "🏆 Future topper detected!",
    no: "💀 May Allah help you bro!",
  },
];

const shuffleQuestions = () => {
  return [...questions].sort(() => Math.random() - 0.5);
};

const getBadges = (score, combo, energy, timeUsed) => {
  const badges = [];

  if (score === 5) {
    badges.push({
      icon: "🏆",
      name: "PERFECT STUDENT",
      description: "You got every question correct!"
    });
  }

  if (combo >= 4) {
    badges.push({
      icon: "🔥",
      name: "COMBO KING",
      description: "You reached a 4+ answer combo!"
    });
  }

  if (score >= 4) {
    badges.push({
      icon: "🧠",
      name: "BIG BRAIN",
      description: "Your brain is officially activated."
    });
  }

  if (energy <= 2 && score >= 3) {
    badges.push({
      icon: "❤️",
      name: "SURVIVOR",
      description: "You survived with almost no energy!"
    });
  }

  if (timeUsed <= 20 && score >= 3) {
    badges.push({
      icon: "⚡",
      name: "SPEED DEMON",
      description: "Fast answers, bro!"
    });
  }

  return badges;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(
    shuffleQuestions()
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [energy, setEnergy] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [countdown, setCountdown] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [badges, setBadges] = useState([]);
  const [secretMode, setSecretMode] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem("highScore")) || 0;
  });

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (value) => {
    setAnswer(value);

    if (value === "yes") {
      setScore((prev) => prev + 1);

      setCombo((prev) => {
        const newCombo = prev + 1;

        setXp((currentXp) => {
          const newXp = currentXp + (10 + newCombo * 2);
          const newLevel = Math.floor(newXp / 30) + 1;

          setLevel(newLevel);
          return newXp;
        });

        return newCombo;
      });
    } else {
      setCombo(0);

      setEnergy((prev) => {
        const newEnergy = prev - 1;

        if (newEnergy === 0) {
          setGameOver(true);
        }

        return newEnergy;
      });
    }
  };

  useEffect(() => {
    if (!started || countdown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, countdown]);

  useEffect(() => {
    if (!started || countdown !== 0 || gameStarted) {
      return;
    }

    const timer = setTimeout(() => {
      setGameStarted(true);
      setTimeLeft(10);
    }, 0);

    return () => clearTimeout(timer);
  }, [started, countdown, gameStarted]);

  useEffect(() => {
    if (!started || !gameStarted || finished || gameOver || answer !== "") {
      return;
    }

    if (timeLeft === 0) {
      const timeout = setTimeout(() => {
        handleAnswer("no");
      }, 0);
      return () => clearTimeout(timeout);
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, gameStarted, finished, gameOver, answer, timeLeft]);

  useEffect(() => {
    if (answer === "") return;

    const timer = setTimeout(() => {
      setAnswer("");
      setTimeLeft(10);

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((question) => question + 1);
      } else {
        const finalScore = score + (answer === "yes" ? 1 : 0);
        const earnedBadges = getBadges(
          finalScore,
          combo,
          energy,
          20
        );

        setBadges(earnedBadges);
        setFinished(true);

        setHighScore((previousHighScore) => {
          if (finalScore > previousHighScore) {
            localStorage.setItem("highScore", finalScore);
            return finalScore;
          }
          return previousHighScore;
        });
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [answer, currentQuestion, quizQuestions.length, score, combo, energy]);

  useEffect(() => {
    if (finished && percentage >= 80) {
      const showTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 0);

      const hideTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [finished, percentage]);

  const restartQuiz = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setFinished(false);
    setAnswer("");
    setShowConfetti(false);
    setEnergy(5);
    setGameOver(false);
    setTimeLeft(10);
    setCombo(0);
    setXp(0);
    setLevel(1);
    setCountdown(0);
    setGameStarted(false);
    setBadges([]);
    setSecretMode(false);
    setLogoClicks(0);
    setQuizQuestions(shuffleQuestions());
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          🧠
        </div>

        <h1>AM I READY?</h1>

        <p>Preparing your academic disaster...</p>

        <div className="loading-bar">
          <div className="loading-fill"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      {!started ? (
        <div className="start-screen">
          <div
            className="hero-emoji secret-logo"
            onClick={() => {
              const clicks = logoClicks + 1;
              setLogoClicks(clicks);

              if (clicks === 5) {
                setSecretMode(true);
              }
            }}
          >
            🧠
          </div>

          {secretMode && (
            <div className="secret-message">
              🥚 SECRET MODE UNLOCKED!
              <br />
              <span>You found something you weren't supposed to find. 💀</span>
            </div>
          )}

          <p className="hero-tag">
            THE MOST UNNECESSARY TEST EVER
          </p>

          <h1>
            AM I READY<br />
            FOR CLASS?
          </h1>

          <p>
            5 questions.
            <br />
            1 brutally honest result.
            <br />
            Zero excuses. 💀
          </p>

          <div className="high-score">
            🏆 HIGH SCORE
            <span>{highScore} / 5</span>
          </div>

          <button
            onClick={() => {
              setStarted(true);
              setGameStarted(false);
              setCountdown(3);
            }}
          >
            🚀 START TEST
          </button>
        </div>
      ) : gameOver ? (
        <div className="game-over-screen">
          <div className="game-over-emoji">
            💀
          </div>

          <p className="result-label">
            ⚠️ ACADEMIC EMERGENCY
          </p>

          <h1>QUIZ OVER!</h1>

          <div className="game-over-card">
            <h2>💀 ACADEMIC ENERGY DEPLETED</h2>

            <p>
              Bro... your academic battery has officially
              reached 0%.
            </p>

            <div className="final-score">
              SCORE: {score} / {questions.length}
            </div>
          </div>

          <p className="game-over-message">
            📚 Maybe study first, then try again 😂
          </p>

          <button onClick={restartQuiz}>
            🔄 TRY AGAIN
          </button>
        </div>
      ) : finished ? (
        <div className="result-screen">
          {showConfetti && (
            <div className="confetti">
              🎉 🎊 ✨ 🎉 🎊 ✨ 🎉
            </div>
          )}

          <p className="result-label">🎯 YOUR FINAL ANALYSIS</p>

          <h1>🏁 TEST COMPLETE!</h1>

          <div
            className="score-circle"
            style={{
              "--score": `${percentage * 3.6}deg`
            }}
          >
            <div className="score-inner">
              <span>{percentage}%</span>
              <small>{score} / {questions.length}</small>
            </div>
          </div>

          <div className="personality-card">
            {score === 5 && (
              <>
                <div className="personality-icon">🧠</div>
                <h2>THE SECRET TOPPER</h2>
                <p>
                  Bro doesn't study for the test...
                  the test studies for bro. 💀
                </p>
              </>
            )}

            {score === 4 && (
              <>
                <div className="personality-icon">🔥</div>
                <h2>THE LAST-MINUTE GENIUS</h2>
                <p>
                  Somehow you remember everything exactly
                  5 minutes before the test.
                </p>
              </>
            )}

            {score === 3 && (
              <>
                <div className="personality-icon">😎</div>
                <h2>THE CLASS SURVIVOR</h2>
                <p>
                  You don't dominate the class...
                  but you definitely survive it.
                </p>
              </>
            )}

            {score === 2 && (
              <>
                <div className="personality-icon">😂</div>
                <h2>THE CONFIDENCE PLAYER</h2>
                <p>
                  Knowledge: questionable.
                  Confidence: unlimited.
                </p>
              </>
            )}

            {score <= 1 && (
              <>
                <div className="personality-icon">💀</div>
                <h2>THE PROFESSIONAL GUESSER</h2>
                <p>
                  Bro entered the quiz with absolutely
                  no preparation and maximum confidence.
                </p>
              </>
            )}
          </div>

          {badges.length > 0 && (
            <div className="badges-section">
              <h2>🏆 ACHIEVEMENTS UNLOCKED</h2>

              <div className="badges-grid">
                {badges.map((badge, index) => (
                  <div className="badge-card" key={`${badge.name}-${index}`}>
                    <div className="badge-icon">
                      {badge.icon}
                    </div>

                    <h3>{badge.name}</h3>
                    <p>{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {badges.length === 0 && (
            <p className="no-badge">
              😭 No achievements unlocked this time.
            </p>
          )}

          {score === 5 && (
            <>
              <div className="personality-badge topper">
                🏆 SECRET TOPPER
              </div>

              <h2>Bro... are you even a student? 😂</h2>

              <p>
                You completed everything. Homework, attendance,
                studying, understanding... everything!
              </p>

              <p>
                🚀 You might actually be ready to teach the teacher.
              </p>
            </>
          )}

          {score >= 3 && score < 5 && (
            <>
              <div className="personality-badge survivor">
                😎 THE SURVIVOR
              </div>

              <h2>You somehow survive every class 😂</h2>

              <p>
                You're not perfect, but somehow you always manage
                to escape academic disaster.
              </p>

              <p>
                📚 Keep going bro. You're doing alright!
              </p>
            </>
          )}

          {score < 3 && (
            <>
              <div className="personality-badge cooked">
                💀 ABSOLUTELY COOKED
              </div>

              <h2>Bro... we need to talk 💀</h2>

              <p>
                Your academic situation requires immediate attention.
              </p>

              <p>
                📖 Maybe open the book before opening Instagram 😂
              </p>
            </>
          )}

          <button onClick={restartQuiz}>
            🔄 ANALYZE AGAIN
          </button>
        </div>
      ) : (
        <div className="quiz-screen">
          {!gameStarted ? (
            <div className="countdown-screen">
              <div className="countdown-label">
                GET READY...
              </div>

              <div className="countdown-number">
                {countdown}
              </div>

              <p>
                Prepare yourself bro 💀
              </p>
            </div>
          ) : (
            <>
          <div className="game-hud">
            <div className="hud-item">
              <span>🔥</span>
              <small>COMBO</small>
              <strong>x{combo}</strong>
            </div>

            <div className="hud-item">
              <span>⭐</span>
              <small>XP</small>
              <strong>{xp}</strong>
            </div>

            <div className="hud-item">
              <span>🚀</span>
              <small>LEVEL</small>
              <strong>{level}</strong>
            </div>
          </div>

          <div className="xp-container">
            <div className="xp-info">
              <span>LEVEL {level}</span>
              <span>{xp % 30} / 30 XP</span>
            </div>

            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{
                  width: `${((xp % 30) / 30) * 100}%`
                }}
              ></div>
            </div>
          </div>

          {combo >= 2 && (
            <div className="combo-message">
              {combo === 2 && "🔥 NICE COMBO!"}

              {combo === 3 && "🔥🔥 ON FIRE!"}

              {combo >= 4 && "🚀🔥 UNSTOPPABLE!"}
            </div>
          )}

          <div className="energy-box">
            <div className="energy-title">
              ⚡ ACADEMIC ENERGY
            </div>

            <div className="hearts">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < energy ? "❤️" : "🖤"}
                </span>
              ))}
            </div>

            <div className="energy-text">
              {energy > 0
                ? `${energy} energy remaining`
                : "💀 ACADEMIC ENERGY DEPLETED"}
            </div>
          </div>

          <div className="timer-box">
            <span>⏱️</span>

            <strong>{timeLeft}</strong>

            <small>SECONDS</small>
          </div>

          <div className="question-number">
            QUESTION {currentQuestion + 1} / {quizQuestions.length}
          </div>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`
              }}
            ></div>
          </div>

          <h1>
            {quizQuestions[currentQuestion].question}
          </h1>

          <div className="answer-buttons">

            <button
              onClick={() => handleAnswer("yes")}
              disabled={answer !== ""}
            >
              ✅ YES
            </button>

            <button
              onClick={() => handleAnswer("no")}
              disabled={answer !== ""}
            >
              ❌ NO
            </button>

          </div>

          {answer === "yes" && (
            <div className="feedback">
              <h2>{quizQuestions[currentQuestion].yes}</h2>
            </div>
          )}

          {answer === "no" && (
            <div className="feedback">
              <h2>{quizQuestions[currentQuestion].no}</h2>
            </div>
          )}
            </>
          )}

        </div>
      )}

    </div>
  );
}

export default App;