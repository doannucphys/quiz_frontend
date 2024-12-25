<script setup lang="ts">
    import { useQuizStore } from '../stores/quiz';

    defineProps<{ data:  UserScoreType[]}>()
    const store = useQuizStore();
</script>

<template>
    <!-- table head -->
    <div class="flex w-full justify-center px-5">
        <div class="flex w-3/12 py-1  font-bold text-blue-500" v-for="head in ['Rank', 'Student name', 'Status', 'Score']">
            {{ head }}
        </div>
    </div>
    <!-- table body -->
    <div :class="['flex w-full px-5 py-1 justify-center ', id%2 ? '' : 'bg-blue-100', store.username == item.username ? 'text-red-500 font-bold' : '' ]" v-for="(item, id) in data.sort((a,b) => b.score - a.score)">
        <p class="w-3/12">{{id + 1}}</p>
        <p class="w-3/12">{{item.username}}</p>
        <p class="w-3/12">{{item.status}}</p>
        <p class="w-3/12">{{ item.score }}</p>
    </div>
</template>