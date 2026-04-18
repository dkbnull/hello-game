<template>
  <EduQuizGame
      title="识字达人"
      :icon="literacyIcon"
      description="看图选字，认识常见汉字"
      :word-bank="WORD_BANK"
      answer-key="word"
  >
    <template #question="{ question }">
      <div class="edu-question-primary">{{ question.emoji }}</div>
      <div class="edu-question-hint">{{ question.hint }}</div>
    </template>
    <template #option="{ option }">
      <span class="edu-option-content">{{ option }}</span>
    </template>
  </EduQuizGame>
</template>

<script setup>
import EduQuizGame from '@/components/EduQuizGame.vue'
import {GRADE1_CHARS} from '@/data/grade1Chars'
import literacyIcon from '@/assets/icons/literacy.svg'

const WORD_BANK = GRADE1_CHARS.map(c => ({
  word: c.char,
  emoji: c.emoji,
  hint: c.hint,
}))
</script>
