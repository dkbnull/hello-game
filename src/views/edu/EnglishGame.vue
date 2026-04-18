<template>
  <EduQuizGame
      title="英语启蒙"
      :icon="englishIcon"
      description="看图选单词，轻松学英语"
      :word-bank="WORD_BANK"
      answer-key="word"
  >
    <template #question="{ question }">
      <div class="edu-question-primary">{{ question.emoji }}</div>
      <div class="edu-question-hint">{{ question.chinese }}</div>
    </template>
    <template #option="{ option }">
      <span class="edu-option-content option-word">{{ option }}</span>
    </template>
  </EduQuizGame>
</template>

<script setup>
import EduQuizGame from '@/components/EduQuizGame.vue'
import {GRADE1_ENGLISH} from '@/data/grade1English'
import englishIcon from '@/assets/icons/english.svg'

const WORD_BANK = GRADE1_ENGLISH.map(w => ({
  word: w.word,
  emoji: w.emoji,
  chinese: w.chinese,
}))
</script>

<style scoped>
.option-word {
  text-transform: lowercase;
}
</style>
