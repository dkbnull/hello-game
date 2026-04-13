<template>
  <EduQuizGame
      title="识字达人"
      icon="📝"
      description="看图选字，认识常见汉字"
      :word-bank="WORD_BANK"
      answer-key="word"
  >
    <template #question="{ question }">
      <div class="question-emoji">{{ question.emoji }}</div>
      <div class="question-hint">{{ question.hint }}</div>
    </template>
    <template #option="{ option }">
      <span class="option-char">{{ option }}</span>
    </template>
  </EduQuizGame>
</template>

<script setup>
import EduQuizGame from '../../components/EduQuizGame.vue'
import {GRADE1_CHARS} from '../../data/grade1Chars'

const WORD_BANK = GRADE1_CHARS.map(c => ({
  word: c.char,
  emoji: c.emoji,
  hint: c.hint,
}))
</script>

<style scoped>
.question-emoji {
  font-size: 72px;
  margin-bottom: 12px;
}

.question-hint {
  font-size: 16px;
  color: var(--text-secondary);
}

.option-char {
  font-size: 28px;
  font-weight: 700;
}
</style>
