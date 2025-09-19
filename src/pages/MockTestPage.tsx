import React, { useState } from 'react';
import { ChevronRight, Target, Clock, BookOpen, Trophy, Star, Zap, Crown, Lock, Check } from 'lucide-react';

interface TestLevel {
  id: string;
  name: string;
  description: string;
  duration: string;
  questions: number;
  difficulty: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  tests: MockTest[];
}

interface MockTest {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  topics: string[];
  popularity: 'high' | 'medium' | 'low';
}

const testLevels: TestLevel[] = [
  {
    id: 'easy',
    name: 'Easy Level',
    description: 'Perfect for beginners and basic concept understanding',
    duration: '30-45 mins',
    questions: 25,
    difficulty: 'Beginner Friendly',
    icon: <BookOpen className="h-8 w-8" />,
    gradient: 'from-green-400 to-emerald-500',
    borderColor: 'border-green-200',
    tests: [
      {
        id: 'easy-1',
        title: 'Basic Quantitative Aptitude',
        description: 'Fundamental math concepts for MBA entrance',
        duration: '30 mins',
        questions: 25,
        topics: ['Basic Math', 'Percentages', 'Simple Interest'],
        popularity: 'high'
      },
      {
        id: 'easy-2',
        title: 'English Fundamentals',
        description: 'Grammar, vocabulary, and reading comprehension basics',
        duration: '35 mins',
        questions: 30,
        topics: ['Grammar', 'Vocabulary', 'Reading'],
        popularity: 'high'
      },
      {
        id: 'easy-3',
        title: 'Logical Reasoning Basics',
        description: 'Introduction to logical thinking and problem solving',
        duration: '40 mins',
        questions: 25,
        topics: ['Patterns', 'Sequences', 'Basic Logic'],
        popularity: 'medium'
      },
      {
        id: 'easy-4',
        title: 'General Knowledge Starter',
        description: 'Current affairs and basic general knowledge',
        duration: '25 mins',
        questions: 20,
        topics: ['Current Affairs', 'History', 'Geography'],
        popularity: 'medium'
      }
    ]
  },
  {
    id: 'medium',
    name: 'Medium Level',
    description: 'Intermediate level tests for steady progress',
    duration: '45-60 mins',
    questions: 40,
    difficulty: 'Intermediate',
    icon: <Target className="h-8 w-8" />,
    gradient: 'from-blue-400 to-cyan-500',
    borderColor: 'border-blue-200',
    tests: [
      {
        id: 'medium-1',
        title: 'Advanced Quantitative Analysis',
        description: 'Complex mathematical problems and data interpretation',
        duration: '50 mins',
        questions: 40,
        topics: ['Data Interpretation', 'Algebra', 'Geometry'],
        popularity: 'high'
      },
      {
        id: 'medium-2',
        title: 'Critical Reasoning',
        description: 'Advanced logical reasoning and critical thinking',
        duration: '45 mins',
        questions: 35,
        topics: ['Critical Reasoning', 'Assumptions', 'Conclusions'],
        popularity: 'high'
      },
      {
        id: 'medium-3',
        title: 'Verbal Ability Plus',
        description: 'Advanced English comprehension and verbal skills',
        duration: '55 mins',
        questions: 45,
        topics: ['Para Jumbles', 'Reading Comp', 'Vocabulary'],
        popularity: 'medium'
      },
      {
        id: 'medium-4',
        title: 'Business Awareness',
        description: 'Business concepts and current market trends',
        duration: '40 mins',
        questions: 30,
        topics: ['Business News', 'Economics', 'Markets'],
        popularity: 'medium'
      }
    ]
  },
  {
    id: 'hard',
    name: 'Hard Level',
    description: 'Advanced level tests for serious aspirants',
    duration: '60-90 mins',
    questions: 60,
    difficulty: 'Advanced',
    icon: <Crown className="h-8 w-8" />,
    gradient: 'from-purple-400 to-pink-500',
    borderColor: 'border-purple-200',
    tests: [
      {
        id: 'hard-1',
        title: 'CAT Mock Test Series',
        description: 'Full-length CAT pattern mock test',
        duration: '180 mins',
        questions: 100,
        topics: ['QA', 'VARC', 'DILR'],
        popularity: 'high'
      },
      {
        id: 'hard-2',
        title: 'GMAT Preparation Test',
        description: 'International MBA entrance preparation',
        duration: '210 mins',
        questions: 80,
        topics: ['Analytical Writing', 'Integrated Reasoning', 'Quantitative'],
        popularity: 'high'
      },
      {
        id: 'hard-3',
        title: 'Advanced Problem Solving',
        description: 'Complex analytical and reasoning problems',
        duration: '90 mins',
        questions: 60,
        topics: ['Complex DI', 'Advanced LR', 'Problem Solving'],
        popularity: 'medium'
      },
      {
        id: 'hard-4',
        title: 'MBA Interview Prep',
        description: 'Case studies and interview preparation',
        duration: '120 mins',
        questions: 50,
        topics: ['Case Studies', 'Business Analysis', 'Current Affairs'],
        popularity: 'medium'
      }
    ]
  }
];

export function MockTestPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [completedTests, setCompletedTests] = useState<string[]>(['easy-1']); // Mock completed test
  
  // Check if level is unlocked
  const isLevelUnlocked = (levelId: string) => {
    if (levelId === 'easy') return true;
    if (levelId === 'medium') return completedTests.some(test => test.startsWith('easy'));
    if (levelId === 'hard') return completedTests.some(test => test.startsWith('medium'));
    return false;
  };

  // Check if individual test is unlocked
  const isTestUnlocked = (testId: string, level: TestLevel) => {
    const testIndex = level.tests.findIndex(test => test.id === testId);
    
    // First test in any level is unlocked if the level is unlocked
    if (testIndex === 0) return isLevelUnlocked(level.id);
    
    // For subsequent tests, check if previous test is completed
    const previousTest = level.tests[testIndex - 1];
    return completedTests.includes(previousTest.id);
  };

  const getPopularityBadge = (popularity: string) => {
    switch (popularity) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            🔥 Popular
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⭐ Trending
          </span>
        );
      default:
        return null;
    }
  };

  const handleStartTest = (test: MockTest) => {
    // For Easy level tests, open in new tab with exam interface
    if (selectedLevel === 'easy') {
      const examUrl = `/exam/${test.id}`;
      window.open(examUrl, '_blank', 'fullscreen=yes,scrollbars=no,resizable=no,toolbar=no,menubar=no,location=no');
    } else {
      alert(`Starting ${test.title}! This will open the test interface. 🚀`);
    }
  };

  if (selectedLevel) {
    const level = testLevels.find(l => l.id === selectedLevel);
    if (!level) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="flex items-center text-gray-600 hover:text-amber-600 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 rotate-180 mr-1" />
                  Back to Levels
                </button>
                <div className="h-6 border-l border-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${level.gradient} text-white`}>
                    {level.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{level.name} Tests</h1>
                    <p className="text-gray-600">{level.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Test Progression Chain - Simple Design */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              {level.tests.map((test, index) => {
                const isUnlocked = isTestUnlocked(test.id, level);
                const isCompleted = completedTests.includes(test.id);
                
                return (
                  <div key={test.id} className="flex items-center">
                    {/* Simple Test Icon */}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-400 text-white' 
                          : isUnlocked 
                            ? `bg-gradient-to-r ${level.gradient} border-white text-white`
                            : 'bg-gray-300 border-gray-400 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : isUnlocked ? (
                          <BookOpen className="h-5 w-5" />
                        ) : (
                          <Lock className="h-5 w-5" />
                        )}
                      </div>
                      
                      {/* Simple Number Badge */}
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isUnlocked
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Simple Chain Connector */}
                    {index < level.tests.length - 1 && (
                      <div className={`w-6 h-0.5 mx-2 ${
                        completedTests.includes(level.tests[index + 1].id)
                          ? 'bg-green-400'
                          : isTestUnlocked(level.tests[index + 1].id, level)
                            ? 'bg-blue-400'
                            : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {level.tests.map((test, index) => {
              const isUnlocked = isTestUnlocked(test.id, level);
              const isCompleted = completedTests.includes(test.id);
              
              return (
                <div
                  key={test.id}
                  className={`bg-white rounded-xl shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative ${
                    isUnlocked 
                      ? 'hover:shadow-xl transform hover:-translate-y-1 cursor-pointer' 
                      : 'opacity-75 cursor-not-allowed'
                  }`}
                >
                  {/* Lock Overlay for locked tests */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-20">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Lock className="h-8 w-8 text-gray-600" />
                      </div>
                    </div>
                  )}

                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Done
                    </div>
                  )}

                  {/* Test Number Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isUnlocked
                          ? `bg-gradient-to-r ${level.gradient} text-white`
                          : 'bg-gray-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`text-lg font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                            {test.title}
                          </h3>
                          {getPopularityBadge(test.popularity)}
                        </div>
                        <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {test.description}
                        </p>
                      </div>
                    </div>

                    {!isUnlocked && index > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <p className="text-amber-800 text-sm font-semibold">
                          🔒 Complete Test {index} first to unlock
                        </p>
                      </div>
                    )}

                    <div className={`flex items-center justify-between text-sm mb-4 ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{test.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{test.questions} questions</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className={`text-xs font-medium mb-2 ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                        Topics Covered:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {test.topics.map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              isUnlocked 
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-gray-50 text-gray-400'
                            }`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isUnlocked) {
                          handleStartTest(test);
                        } else {
                          alert(`🔒 This test is locked! Complete Test ${index} first to unlock this test.`);
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                        isUnlocked
                          ? `bg-gradient-to-r ${level.gradient} hover:opacity-90 text-white hover:scale-105`
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                      disabled={!isUnlocked}
                    >
                      {!isUnlocked ? (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>Locked</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>{selectedLevel === 'easy' ? 'Start Secure Exam' : 'Start Test'}</span>
                          {selectedLevel === 'easy' && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">🔒 Full Screen</span>}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-amber-600/20 to-orange-600/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mock Test Arena
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Choose your difficulty level and start your MBA preparation journey with our comprehensive mock tests
          </p>
          <div className="flex items-center justify-center space-x-2 text-white/80">
            <Star className="h-5 w-5 fill-current" />
            <span className="font-medium">Free for everyone • Instant results • Detailed analysis</span>
            <Star className="h-5 w-5 fill-current" />
          </div>
        </div>
      </div>

      {/* Level Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Test Level</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the difficulty level that matches your current preparation stage. Each level offers unique challenges to help you grow.
          </p>
        </div>

        {/* Chain Progression Visual */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {testLevels.map((level, index) => {
              const isUnlocked = isLevelUnlocked(level.id);
              const isCompleted = completedTests.some(test => test.startsWith(level.id));
              
              return (
                <div key={level.id} className="flex items-center">
                  {/* Level Icon */}
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-400 text-white shadow-lg' 
                        : isUnlocked 
                          ? `bg-gradient-to-r ${level.gradient} border-white text-white shadow-lg`
                          : 'bg-gray-300 border-gray-400 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-8 w-8" />
                      ) : isUnlocked ? (
                        level.icon
                      ) : (
                        <Lock className="h-8 w-8" />
                      )}
                    </div>
                    
                    {/* Level Number */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isUnlocked
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Chain Connector */}
                  {index < testLevels.length - 1 && (
                    <div className={`w-12 h-1 transition-all duration-300 ${
                      completedTests.some(test => test.startsWith(testLevels[index + 1].id))
                        ? 'bg-green-400'
                        : isLevelUnlocked(testLevels[index + 1].id)
                          ? 'bg-amber-400'
                          : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testLevels.map((level) => {
            const isUnlocked = isLevelUnlocked(level.id);
            const isCompleted = completedTests.some(test => test.startsWith(level.id));
            
            return (
              <div
                key={level.id}
                className={`relative bg-white rounded-2xl shadow-xl transition-all duration-500 border-2 ${level.borderColor} overflow-hidden group ${
                  isUnlocked 
                    ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer' 
                    : 'opacity-75 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isUnlocked) {
                    setSelectedLevel(level.id);
                  } else {
                    alert('🔒 This level is locked! Complete Easy level tests first to unlock.');
                  }
                }}
              >
                {/* Lock Overlay for locked levels */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-20">
                    <div className="bg-white rounded-full p-4 shadow-xl">
                      <Lock className="h-12 w-12 text-gray-600" />
                    </div>
                  </div>
                )}

                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Completed
                  </div>
                )}

                {/* Decorative gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
                {/* Special badge for Easy level */}
                {level.id === 'easy' && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    � Unlocked
                  </div>
                )}

                {/* Lock requirement for locked levels */}
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    🔒 Locked
                  </div>
                )}
              
                <div className="relative p-8 text-center">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${level.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 ${
                    !isUnlocked ? 'opacity-50' : ''
                  }`}>
                    {level.icon}
                  </div>
                
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{level.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{level.description}</p>
                
                  {level.id === 'easy' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-green-800 text-sm font-semibold">
                        🛡️ Full anti-cheating protection enabled
                      </p>
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-red-800 text-sm font-semibold">
                        🔒 Complete {level.id === 'medium' ? 'Easy' : 'Medium'} level first
                      </p>
                    </div>
                  )}
                
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium text-gray-700">{level.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Questions:</span>
                      <span className="font-medium text-gray-700">{level.questions}+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className="font-medium text-gray-700">{level.difficulty}</span>
                    </div>
                  </div>

                  <button 
                    className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                      isUnlocked
                        ? `bg-gradient-to-r ${level.gradient} hover:opacity-90 text-white group-hover:scale-105`
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={!isUnlocked}
                  >
                    {!isUnlocked ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <span>Explore Tests</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>

                {/* Test count badge */}
                <div className="absolute bottom-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isUnlocked 
                      ? `bg-gradient-to-r ${level.gradient} text-white`
                      : 'bg-gray-400 text-gray-600'
                  }`}>
                    {level.tests.length} Tests
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Mock Tests?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive testing platform is designed to give you the best preparation experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock className="h-8 w-8" />,
                title: 'Timed Tests',
                description: 'Practice under real exam conditions with time constraints'
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: 'Detailed Analysis',
                description: 'Get comprehensive performance analysis and improvement tips'
              },
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: 'Topic-wise Practice',
                description: 'Focus on specific topics and strengthen weak areas'
              },
              {
                icon: <Trophy className="h-8 w-8" />,
                title: 'Progress Tracking',
                description: 'Track your improvement over time with detailed metrics'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
