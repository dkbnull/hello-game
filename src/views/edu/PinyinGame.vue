<template>
  <EduQuizGame
      title="拼音学习"
      :icon="pinyinIcon"
      description="选择正确的拼音，打好拼音基础"
      :word-bank="WORD_BANK"
      answer-key="pinyin"
  >
    <template #question="{ question }">
      <div class="edu-question-primary">{{ question.char }}</div>
      <div class="edu-question-hint">{{ question.hint }}</div>
    </template>
    <template #option="{ option }">
      <span class="edu-option-content">{{ option }}</span>
    </template>
  </EduQuizGame>
</template>

<script setup>
import EduQuizGame from '@/components/EduQuizGame.vue'
import {GRADE1_CHARS} from '@/data/grade1Chars.js'
import pinyinIcon from '@/assets/icons/pinyin.svg'

const WORD_BANK = GRADE1_CHARS.map(c => ({
  char: c.char,
  pinyin: c.pinyin,
  hint: c.hint,
}))
</script>
