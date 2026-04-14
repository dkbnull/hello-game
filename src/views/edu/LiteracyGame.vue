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
  font-size: 64px;
  margin-bottom: 8px;
}

.question-hint {
  font-size: 16px;
  color: var(--text-secondary);
}

.option-char {
  font-size: 24px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .question-emoji {
    font-size: 48px;
  }

  .option-char {
    font-size: 20px;
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

  .option-char {
    font-size: 18px;
  }
}
</style>
