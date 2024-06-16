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
    <div class="sideText">
        <div class="history">
            <p>A meteorite has hit your space ship! You should find your missing pieces to fix your LIGHT SPEED ENGINE.
            There's 3 missing pieces.</p>
            <p>You should explore the near by planets to find them.</p>
            <p>
            As your engine is 
            broken you don't have much fuel left. Also, one last thing you should be able to re fill your fuel
            by exploiting the petrol on a planet but be careful on the landing...
            </p>
        </div>
        <div class="command">
            <p>Rotate ship = <b>LEFT</b> or <b>RIGHT</b></p>
            <p>Fire power engine = <b>UP</b></p>
            <p>Zoom out = <b>W</b></p>
            <p>Zoom in = <b>S</b></p>
        </div>
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
                <div class="subText">
                    <p>Planet type: {{planetCreationType}}</p>
                </div>
                <button class="button" @click="changePlanetCreationType">Change planet type</button>
                <button class="button" @click="downloadMap">Download map</button>
            </div>
        </div>
    </div>
</template>
