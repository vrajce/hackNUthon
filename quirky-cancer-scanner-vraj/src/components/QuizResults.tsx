import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RiskAssessment {
  risk_level: string;
  advice: string;
  foods_to_eat: string[];
  foods_to_avoid: string[];
  assessment_text?: string;
  recommendations?: string[];
}

interface QuizResultsProps {
  score: number;
  assessment: RiskAssessment | null;
  resetQuiz: () => void;
}

const QuizResults = ({ score, assessment: riskAssessment, resetQuiz }: QuizResultsProps) => {
  const [showAllFoods, setShowAllFoods] = useState<boolean>(false);
  const { t } = useTranslation();

  if (!riskAssessment) {
    return (
      <div className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ 
            rotate: 360,
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        >
          <div className="w-16 h-16 border-4 border-cancer-blue border-t-transparent rounded-full"></div>
        </motion.div>
        <p className="text-center text-gray-600 mt-4">
          {t('quiz.processingResults')}
        </p>
      </div>
    );
  }

  // Determine risk level color and icon
  const getRiskLevelInfo = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return {
          color: 'bg-green-100 text-green-700',
          icon: <ShieldCheck className="w-8 h-8 text-green-700" />,
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          shadowColor: 'shadow-green-100'
        };
      case 'moderate':
        return {
          color: 'bg-yellow-100 text-yellow-700',
          icon: <AlertTriangle className="w-8 h-8 text-yellow-700" />,
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          shadowColor: 'shadow-yellow-100'
        };
      case 'high':
        return {
          color: 'bg-red-100 text-red-700',
          icon: <AlertCircle className="w-8 h-8 text-red-700" />,
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          shadowColor: 'shadow-red-100'
        };
      default:
        return {
          color: 'bg-blue-100 text-blue-700',
          icon: <AlertCircle className="w-8 h-8 text-blue-700" />,
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          shadowColor: 'shadow-blue-100'
        };
    }
  };

  const riskInfo = getRiskLevelInfo(riskAssessment.risk_level);
  
  // Limit the number of foods shown initially
  const foodLimit = 4;
  const displayEatFoods = showAllFoods 
    ? riskAssessment.foods_to_eat 
    : riskAssessment.foods_to_eat.slice(0, foodLimit);
    
  const displayAvoidFoods = showAllFoods 
    ? riskAssessment.foods_to_avoid 
    : riskAssessment.foods_to_avoid.slice(0, foodLimit);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const foodItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white to-purple-50 rounded-xl border border-purple-200 shadow-lg p-8 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-200 rounded-full opacity-20"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20"></div>
      
      <motion.div variants={itemVariants} className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-bold mb-2 text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent">
          {t('quiz.riskAssessmentResult')}
        </h2>
        <p className="text-gray-600">
          {t('quiz.assessmentBasedOnResponses')}
        </p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className={`flex flex-col md:flex-row items-center justify-center mb-8 gap-6 p-6 rounded-2xl ${riskInfo.borderColor} ${riskInfo.shadowColor} border-2 bg-white/80 backdrop-blur-sm`}
      >
        <motion.div 
          className={`p-6 rounded-full ${riskInfo.color}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {riskInfo.icon}
        </motion.div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-semibold mb-2">{t('quiz.yourScore')}: {score}</h3>
          <div className={`text-xl font-medium ${riskInfo.textColor}`}>
            {t('quiz.riskLevel')}: {t(`quiz.riskLevels.${riskAssessment.risk_level.toLowerCase()}`)}
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-100 p-6"
      >
        <h3 className="text-xl font-semibold mb-3 text-cancer-purple">{t('quiz.personalizedAdvice')}</h3>
        <p className="text-gray-700 bg-gray-50 p-6 rounded-lg border border-gray-100 leading-relaxed">
          {riskAssessment.assessment_text || riskAssessment.advice}
        </p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="grid md:grid-cols-2 gap-6 mb-6"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-green-100 p-6">
          <h3 className="text-xl font-semibold mb-3 flex items-center text-green-700">
            <Check className="w-5 h-5 mr-2" />
            {t('quiz.foodsToInclude')}
          </h3>
          <ul className="bg-green-50 p-4 rounded-lg space-y-2">
            {displayEatFoods.map((food, index) => (
              <motion.li 
                key={index} 
                custom={index}
                variants={foodItemVariants}
                className="flex items-start p-2 hover:bg-white/60 rounded-md transition-colors"
              >
                <Check className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                <span>{food}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-red-100 p-6">
          <h3 className="text-xl font-semibold mb-3 flex items-center text-red-700">
            <X className="w-5 h-5 mr-2" />
            {t('quiz.foodsToAvoid')}
          </h3>
          <ul className="bg-red-50 p-4 rounded-lg space-y-2">
            {displayAvoidFoods.map((food, index) => (
              <motion.li 
                key={index}
                custom={index}
                variants={foodItemVariants}
                className="flex items-start p-2 hover:bg-white/60 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                <span>{food}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {(riskAssessment.foods_to_eat.length > foodLimit || riskAssessment.foods_to_avoid.length > foodLimit) && (
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <button 
            onClick={() => setShowAllFoods(!showAllFoods)}
            className="text-cancer-purple hover:text-cancer-blue flex items-center gap-2 transition-colors"
          >
            {showAllFoods ? t('quiz.showFewerRecommendations') : t('quiz.showAllRecommendations')}
            <ArrowRight className={`w-4 h-4 transition-transform ${showAllFoods ? 'rotate-90' : ''}`} />
          </button>
        </motion.div>
      )}

      <motion.div 
        variants={itemVariants}
        className="flex justify-center mt-8"
      >
        <Button 
          onClick={resetQuiz}
          className="bg-gradient-to-r from-cancer-blue to-cancer-purple hover:from-cancer-purple hover:to-cancer-blue transition-all duration-300 transform hover:scale-105 text-white px-6 py-2 rounded-full flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t('quiz.retakeQuiz')}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default QuizResults;
