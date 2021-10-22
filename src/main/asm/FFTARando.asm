/* 
// This file is included in the randomizer as a reference. 
// https://github.com/Kingcom/armips was used to assembler the instructions, which was then used as a diff to include in the randomizer.
*/

.open "FFTA_Randomized.gba","FFTA_Randomized_ASM.gba",0x08000000
.gba

freeSpace equ 0x08A39920

// Inject Animation AnimationHelpers 
// Start of Leonarth's animation fix Engine Hacks ASM at https://github.com/LeonarthCG/FFTA_Engine_Hacks
.org 0x080988B0
    helper1Inject:
        ldr r3,=WeaponRedirect+1
        bx r3
        .pool

.org 0x08021004
    helper2Inject:
        ldr r3,=AnimationHelper+1
        bx r3
        .pool


.org 0x0809767C
    helper3Inject:
        ldr r3,=SpecialHelper1+1
        bx r3
        .pool

.org 0x08097734
    helper4Inject:
        ldr r3,=SpecialHelper2+1
        bx r3
        .pool   
// End Animation Helper Inject

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
                    cmp r6,0x2F
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
        // Start of Leonarth's animation fix Engine Hacks ASM at https://github.com/LeonarthCG/FFTA_Engine_Hacks
        AnimationHelpers:
            WeaponRedirect:
                cmp r1,0x50
                blt weaponSkip
                cmp r1,0x78
                bhi weaponSkip
                push r4
                mov r4,0x1
                lsl r4,0xD
                orr r1,r4 // Animation ID | 0x2000
                pop r4
                
                weaponSkip:
                    ldr r3,=0x80975DC
                    mov lr,r3
                    mov r3,1
                    bl lr

                weaponRedirectEnd:
                    ldr r3,=0x80988B8
                    mov lr,r3
                    cmp r5,0x0
                    bl lr
            SpecialHelper1:
                cmp	r5,0xEC
                blo	special1Skip
                ldr	r3,=0x1FFF
                cmp	r5,r3
                bhi	special1Skip
                sub	r5,0xEC
                lsl	r5,0x2
                add	r5,0xEC

                special1Skip:
                    add	r2,r5,r2
                    str	r2,[sp,0x4]
                    mov	r2,0x0
                    str	r2,[sp,0x8]

                ldr	r3,=0x8097685
                bx	r3
                .pool
            SpecialHelper2:
                mov	r8,r0
                mov	r6,0x1
                lsl	r0,r4,0x18
                asr	r0,r0,0x18

                cmp	r7,0xEC
                blo	special2Skip
                ldr	r3,=0x1FFF
                cmp	r7,r3
                bhi	special2Skip
                sub	r7,0xEC
                lsl	r7,2
                add	r7,0xEC

                special2Skip:
                    add	r7,r0
                    mov	r4,r5
                    add	r4,0x4C
                    ldr	r0,[r5,0x40]

                ldr	r3,=0x8097745
                bx	r3
                .pool

            weaponAnimationTable equ 0x08a39c40
            specialAnimationTable equ 0x08a80aa0
            AnimationHelper:
                push lr
                push r4,r5
                mov	r5,r0
                mov	r2,r1
                ldr	r1,=0x8390E44
                lsl	r0,0x2
                add	r0,r1
                ldr	r3,[r0]
                mov	r0,0x3

                ldr	r4,=0x1FFF
                cmp	r2,r4
                bhi	custom
                cmp	r2,0xEC
                bhs	specialAnimation
                b	regular
                custom:
                    and	r2,r4
                    mov	r4,0x50
                    ldr	r3,=weaponAnimationTable
                    lsl	r5,0x2
                    ldr	r3,[r3,r5]
                    and	r0,r2
                    sub	r2,r4
                    b	aftercustom
                specialAnimation:
                    and	r0,r2
                    sub	r2,0xEC
                    ldr	r3,=specialAnimationTable
                    lsl	r5,0x2
                    ldr	r3,[r3,r5]
                    b	aftercustom
                regular:
                    and	r0,r2
                aftercustom:
                    cmp	r0,0x2
                    bhi	goto8021030
                    cmp	r0,0x1
                    blo	goto8021030

                mov	r1,0x4
                neg	r1,r1
                and	r1,r2
                lsl	r0,r1,0x1
                add	r0,r1
                lsl	r0,0x1
                add	r0,0xC
                mov	r2,0xC
                b	EndAnimationHelper

                goto8021030:
                    mov	r1,0x4
                    neg	r1,r1
                    and	r1,r2
                    lsl	r0,r1,0x1
                    add	r0,r1
                    lsl	r0,0x1
                    mov	r2,0x0

                EndAnimationHelper:
                    add	r0,r3
                    //if no animation, standing animation
                    ldr	r1,[r0]
                    cmp	r1,0x0
                    bne	hasAnimation
                    add	r0,r3,r2
                    hasAnimation:
                    pop	r4,r5
                    pop	r1
                    bx	r1
            .pool
             // End animation helpers


.close