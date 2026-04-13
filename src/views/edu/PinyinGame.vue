<template>
  <EduQuizGame
      title="拼音学习"
      icon="🎵"
      description="选择正确的拼音，打好拼音基础"
      :word-bank="WORD_BANK"
      answer-key="pinyin"
  >
    <template #question="{ question }">
      <div class="question-char">{{ question.char }}</div>
      <div class="question-hint">{{ question.hint }}</div>
    </template>
    <template #option="{ option }">
      <span class="option-pinyin">{{ option }}</span>
    </template>
  </EduQuizGame>
</template>

<script setup>
import EduQuizGame from '../../components/EduQuizGame.vue'
import {GRADE1_CHARS} from '../../data/grade1Chars'

const WORD_BANK = GRADE1_CHARS.map(c => ({
  char: c.char,
  pinyin: c.pinyin,
  hint: c.hint,
}))
</script>

<style scoped>
.question-char {
  font-size: 80px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.question-hint {
  font-size: 16px;
  color: var(--text-secondary);
}

.option-pinyin {
  font-size: 24px;
  font-weight: 600;
}
</style>
