import { defineStore } from 'pinia'
import { results, quiz } from '../pages/const';
import { ref } from 'vue';

export const useQuizStore = defineStore('quiz', () => {
    const scores = ref(results.scores)
    const quizData = ref(quiz)
    const quizId = ref('')
    const username = ref('')
    const response = ref<{questionId: number, choice: number}[]>([])

    const updateResultList = (score: SocketPayloadType) => {
      let currentUserIdx = scores.value.findIndex((e: SocketPayloadType) => e.username == score.username)
      if( currentUserIdx > -1) {
        Object.assign(scores.value[currentUserIdx], score)
      } else {
        scores.value.push(score as UserScoreType)
      }
    }

    const setQuizData = (inputQuizId: string, inputUsername: string) => {
      quizId.value = inputQuizId;
      username.value = inputUsername
    }

    const updateResponse = (questionId: number, choice: number) => {
      response.value.push({ questionId, choice })
    }
  
    return { scores, quizId, quizData, username, response, updateResultList, setQuizData, updateResponse}

})