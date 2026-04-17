<template>
  <EduQuizGame
      title="英语启蒙"
      icon="/icons/english.svg"
      description="看图选单词，轻松学英语"
      :word-bank="WORD_BANK"
      answer-key="word"
  >
    <template #question="{ question }">
      <div class="question-emoji">{{ question.emoji }}</div>
      <div class="question-hint">{{ question.chinese }}</div>
    </template>
    <template #option="{ option }">
      <span class="option-word">{{ option }}</span>
    </template>
  </EduQuizGame>
</template>

<script setup>
import EduQuizGame from '../../components/EduQuizGame.vue'
import {GRADE1_ENGLISH} from '../../data/grade1English'

const WORD_BANK = GRADE1_ENGLISH.map(w => ({
  word: w.word,
  emoji: w.emoji,
  chinese: w.chinese,
}))
</script>

<style scoped>
.question-emoji {
  font-size: 64px;
  margin-bottom: 8px;
}

.question-hint {
  font-size: 18px;
  color: var(--text-secondary);
  font-weight: 500;
}

.option-word {
  font-size: 16px;
  font-weight: 600;
  text-transform: lowercase;
}

@media (max-width: 768px) {
  .question-emoji {
    font-size: 48px;
  }

  .option-word {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .question-emoji {
    font-size: 40px;
    margin-bottom: 4px;
  }

  .question-hint {
    font-size: 14px;
  }

  .option-word {
    font-size: 16px;
  }
}
</style>
