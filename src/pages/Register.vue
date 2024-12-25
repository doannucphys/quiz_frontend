<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { socket } from '../socket';
    import { useQuizStore } from '../stores/quiz';

    // get store
    const store = useQuizStore();

    // connect to socket 
    socket.connect()

    // router
    const router = useRouter();

    // temp style variable
    const inputClass = 'w-full min-h-3 border border-gray-500 rounded-md px-3 py-1';
    const inputContainerClass = 'flex flex-col space-y-1 md:flex-row md:space-x-4 md:items-center'

    // temporary varizable
    const quizId = ref('')
    const username = ref('')
    const errorMessage = ref('')

    // action register to quiz
    const register = () => {
        store.setQuizData(quizId.value, username.value)
        socket.emit('register', { quizId: quizId.value, username: username.value });
    }

    // listen event register success
    socket.on('register_success', () => {
        router.push({ name: 'Quiz' })
    })

    // listen event register error
    socket.on('register_error', () => {
        errorMessage.value = 'Registration error, please in put the right quiz id!'
    })
</script>


<template>
    <div class="min-h-screen flex flex-col justify-center">
        <div class="flex justify-center">

            <!-- register form -->
            <div class="w-11/12 md:w-5/12 lg:w-4/12 p-10 shadow-lg bg-blue-100 space-y-4">
                <!-- quiz id -->
                <div :class="inputContainerClass">
                    <p class="min-w-32">Quiz Id:</p>
                    <input v-model="quizId" placeholder="quiz id" :class="inputClass" @input=" errorMessage  = ''" />
                </div>

                <!-- username -->
                <div :class="inputContainerClass">
                    <p class="min-w-32">User's name:</p>
                    <input v-model="username" placeholder="your name" :class="inputClass" @input=" errorMessage  = ''" />
                </div>

                <!-- register -->
                <div class="flex justify-end">
                    <button @click="register"
                        class="shadow-sm bg-blue-500 py-1 px-3 text-white hover:bg-red-700 rounded-lg">Join</button>
                </div>

                <!-- error message -->
                <p class="text-red-500 font-sm absolute top-20" >{{ errorMessage }}</p>
            </div>

        </div>
    </div>
</template>

