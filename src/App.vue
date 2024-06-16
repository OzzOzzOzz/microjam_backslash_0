<script setup lang="ts">
import { ref, toRaw } from 'vue';
import type { MainMenu } from './game/scenes/MainMenu';
import PhaserGame from './game/PhaserGame.vue';
import {Space} from "./game/scenes/Space.ts";

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();
const isGodMod = ref(false);
const planetCreationType = ref(1);

const resetScene = () => {
    const scene = toRaw(phaserRef.value.scene) as MainMenu;
    if (scene) {
        scene.changeScene();
    }
}

const moveSprite = () => {

    if (phaserRef.value !== undefined) {
        const scene = toRaw(phaserRef.value.scene) as MainMenu;
        if (scene) {
            // Get the update logo position
            (scene as MainMenu).moveLogo(({ x, y }) => {
                spritePosition.value = { x, y };
            });
        }
    }
}

const toggleGodMod = () => {
    isGodMod.value = !isGodMod.value;
    const scene = toRaw(phaserRef.value.scene) as Space;
    (scene as Space).toggleGodMod();
}

const downloadMap = () => {
    const scene = toRaw(phaserRef.value.scene) as Space;
    (scene as Space).downloadMap();
}



const changePlanetCreationType = () => {
    planetCreationType.value += 1;
    if (planetCreationType.value > 3) {
        planetCreationType.value = 1;
    }
    const scene = toRaw(phaserRef.value.scene) as Space;
    (scene as Space).changePlanetCreationType(planetCreationType.value);
}

</script>

<template>
    <PhaserGame ref="phaserRef" />
    <div>
        <div class="bottom">
            <div v-if="isGodMod" class="godModText">
                <p>GOD MOD</p>
            </div>
            <button class="button" @click="toggleGodMod">Toggle god mod</button>
            <div v-if="isGodMod">
                <div class="subText">
                    <p>Scene: {{phaserRef?.scene?.scene?.key}}</p>
                </div>
                <div>
                    <button class="button" @click="resetScene">Reset Scene</button>
                </div>
                <div v-if="isGodMod" class="subText">
                    <p>Planet type: {{planetCreationType}}</p>
                </div>
                <button class="button" @click="changePlanetCreationType">Change planet type</button>
                <button v-if="isGodMod" class="button" @click="downloadMap">Download map</button>
            </div>
        </div>
    </div>
</template>
