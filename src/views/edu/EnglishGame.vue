<template>
  <EduQuizGame
      title="英语启蒙"
      icon="🌍"
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
  font-size: 72px;
  margin-bottom: 12px;
}

.question-hint {
  font-size: 18px;
  color: var(--text-secondary);
  font-weight: 500;
}

.option-word {
  font-size: 18px;
  font-weight: 600;
  text-transform: lowercase;
}
</style>
