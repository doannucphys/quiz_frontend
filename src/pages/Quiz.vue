<script setup lang="ts">
    import { socket } from '../socket'
    import Table from '../components/Table.vue';
    import { useQuizStore } from '../stores/quiz'
    import { ref } from 'vue';

    // get store
    const store = useQuizStore();

    // check socket connected
    if (!socket.id) {
        socket.connect()
    }

    // temporary variable
    const submitted = ref(false)
    const finalScore = ref(0)
    const started = ref(false)
    const currentChoice = ref(0)
    const currentQuestion = ref(0)

    // user click to go next question
    const goNextQuestionHandle = () => {
        store.updateResponse(currentQuestion.value + 1, currentChoice.value)
        currentQuestion.value += 1
        currentChoice.value = 0
    }

    // user submit result
    const submitResult = () => {
        submitted.value = true
        const questions = store.quizData.questions;
        store.response.forEach((res: any, idx: number) => {
            finalScore.value += res.choice == questions[idx]?.correctChoice ? questions[idx]?.score : 0;
        })
        socket.emit('finish_quiz', {quizId: store.quizId, username: store.username, status: "Finished", score: finalScore.value });
    }

    // user start quiz
    const startQuizHandle = () => {
        finalScore.value = 0
        socket.emit('start_quiz', { quizId: store.quizId, username: store.username })
        started.value = true
    }

    // listen event when an user start quiz
    socket.on('new_user_start_quiz', (data: SocketPayloadType) => {
        store.updateResultList(data)
    })

    // listen event when an user finish quiz 
    socket.on('user_finish_quiz', (data: SocketPayloadType) => {
        store.updateResultList(data)
    })
</script>

<template>
    <!-- leaderboar  -->
    <div class="flex justify-center w-full mt-5">
        <div class="w-6/12 border shadow-lg">
            <p class="text-lg w-full text-center bg-blue-200 font-bold p-2">Leaderboard - {{ store.quizData.quizId }}</p>
            <Table :data = "store.scores"/>
        </div>
    </div>

    <!-- general information about quiz -->
    <div class = "flex w-full p-5 shadow-md border mt-10">
        <div >
            <p>Welcome: <b>{{ store.username }}</b></p>
            <p>Current Quiz: <b>{{ store.quizData.quizId }}</b></p>
            <p>Time limit: {{ store.quizData.time}} miniutes</p>
            <p>Total score: {{ store.quizData.totalScore }}</p>
            <p>Total number of question: {{ store.quizData.questions?.length }}</p>
            <button 
                v-if = "!started" 
                class="mt-5 shadow-sm bg-blue-500 py-1 px-3 text-white hover:bg-red-700 rounded-lg" 
                @click="startQuizHandle">
                    Start
            </button>
        </div>
    </div>

    <div v-if="started" class="flex justify-center w-full mt-5">

        <!-- question -->
        <div class="w-6/12 border shadow-lg p-5" v-if="currentQuestion < store.quizData.questions.length">
            <p>Question: {{ currentQuestion + 1 }}</p>
            <hr class="mb-3">
            <p class="mb-2">{{store.quizData.questions[currentQuestion]?.question}}</p>

            <!-- list of options -->
            <div v-for="(choice, idx) in store.quizData.questions[currentQuestion]?.choices" class="flex space-x-5 cursor-pointer">
                <input class="cursor-pointer" type="radio" :id="`${idx}`" :value="idx + 1" v-model="currentChoice" />
                <label class="cursor-pointer" :for="`${idx}`">{{ choice }}</label>
            </div>

            <!-- next button -->
            <div class="w-full flex justify-end ">
                <button 
                :disabled = "currentChoice < 1 && currentQuestion >= 0" 
                :class="[' mt-5 shadow-sm  py-1 px-3 text-white rounded-lg', 
                    currentChoice < 1 && currentQuestion >= 0 ? 'bg-gray-500' : 'bg-blue-500 hover:bg-red-700'] " 
                @click="goNextQuestionHandle">
                    next
                </button>
            </div>
        </div>

        <!-- button submit after finish  -->
        <div v-else-if="currentQuestion >= store.quizData.questions.length && !submitted">
            <p>Please submit your result</p>
            <button 
            :class="['mt-5 shadow-sm  py-1 px-3 text-white rounded-lg bg-blue-500 hover:bg-red-700'] " @click="submitResult">
                Submit your result
            </button>
        </div>

        <!-- result  -->
        <div v-else-if="submitted">
            <p>Thank you, your score is: {{ finalScore }}</p>
        </div>

    </div>
</template>