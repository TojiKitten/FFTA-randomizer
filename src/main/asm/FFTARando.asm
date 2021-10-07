/* 
// This file is included in the randomizer as a reference. 
// https://github.com/Kingcom/armips was used to assembler the instructions, which was then used as a diff to include in the randomizer.
*/

.open "FFTA_Randomized.gba","FFTA_Randomized_ASM.gba",0x08000000
.gba

freeSpace equ 0x08A39920

// Inject the unlock jobs hack where they're initialized
.org 0x080C9342
    jobInject:
        .align 8
        ldr r3,=UnlockJobs+1
        bx r3
        .pool

// Inject locations to all be written at the same time
.org 0x08030126
    locationInject:
        .align 8
        ldr r3,=PlaceLocations+1
        bx r3
        .pool

// Branch away from placing Sprohm in the beginning of the game
.org 0x080306D6
    PreventSprohmPlacement:
        mov r0,0

// Branch away from placing a city
.org 0x0804880C
    PreventLocationPlacement:
        mov r0,0

// Stop clan comparison from being made
.org 0x080CF802
    StopClans:
        nop

.org freeSpace
        .align 4
        // For every job, set it to be discovered
        UnlockJobs:
            discoveryStart:
                discoverJobMemory equ 0x080C9574
                mov r6,0x05
                jobLoop:
                    mov r0,r6
                    bl discoverJob
                    add r6,r6,1
                    cmp r6,0x2E
                    blt jobLoop
            discoverEnd:
                .align 8
                ldr r3,=0x080C93C2+1
                bx r3
            .func discoverJob
                mov r1,0x1
                .align 8
                ldr r4,=discoverJobMemory+1
                bx r4
                pop r15
            .endfunc
            .pool
        // For every location, look at its value in the randomized location block and place it at the value
        PlaceLocations:
            locationStart:
                placeLocationMemory equ 0x08030044
                mov r7,0x00
                locationLoop:
                    mov r0,r7
                    ldr r1,=mapLocations
                    ldrb r1,[r1,r7]
                    bl placeLocation
                    add r7,r7,1
                    cmp r7,0x1E
                    blt locationLoop
            locationEnd:
                .align 8
                unlockPaths:
                    ldr r3,=0x02002E58
                    mov r0, 0x0B
                    strb r0,[r3,0x00]
                unlockCutscenes:
                    ldr r3,=0x02001FF7
                    mov r0, 0xF8
                    strb r0,[r3, 0x00]
                    mov r0, 0x17
                    strb r0,[r3,0x1]
                    mov r0,0x40
                    strb r0,[r3, 0x05]
                mov r7, 0x03
                ldr r3,=0x0803013A+1
                bx r3
            .func placeLocation
                mov r2,0x1
                .align 8
                ldr r4,=placeLocationMemory+1
                bx r4
                pop r15
            .endfunc
            .pool
            // This is updated by the randomizer
            mapLocations:
                .area 30,0
                    .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20, 21, 22,23,24,25,26,27,28,29
                .endarea
                .align 4


.close