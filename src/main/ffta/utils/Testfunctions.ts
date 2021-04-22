// function changeRaceAbilities(
//     raceAbilities: Map<string, Array<FFTARaceAbility>>,
//     rng: NoiseGenerator,
//     shuffled: boolean
//   ): Map<string, Array<FFTARaceAbility>> {
//     // Get an array of all race abilities
//     // For randomized case, abilities that appear multiple times are more likely to appear
//     // Examples: Fire, Shield Bearer, Counter, Bow Combo
//     let abilityRecord = flattenRaceMapAbilities(raceAbilities);
  
//     // Set up a new map with new abilities to return
//     let newMap: Map<string, Array<FFTARaceAbility>> = new Map();
  
//     for (let [key, value] of raceAbilities) {
//       let abilityState = abilityReplace(value, abilityRecord, rng, shuffled);
//       newMap.set(key, abilityState.randomizedAbilities);
//       abilityRecord = abilityState.newSortedAbilities;
//     }
  
//       //Test Code
//         let abilityCountOld: Map<string, number> = new Map();
//         for(let abilies of raceAbilities.values()){
//           abilies.forEach((ability) =>{
//             if(abilityCountOld.has(ability.displayName!)){
//               abilityCountOld.set(ability.displayName!, abilityCountOld.get(ability.displayName!)! +1)
//             }else{
//               abilityCountOld.set(ability.displayName!, 1);
//             }
//           });
//         }
    
//         let abilityCountNew: Map<string, number> = new Map();
//         for(let abilies of newMap.values()){
//           abilies.forEach((ability) =>{
//             if(abilityCountNew.has(ability.displayName!)){
//               abilityCountNew.set(ability.displayName!, abilityCountNew.get(ability.displayName!)! +1)
//             }else{
//               abilityCountNew.set(ability.displayName!, 1);
//             }
//           });
//         }
  
//         console.log("start shuffle test")
//         for(let [key,value] of abilityCountNew){
//           if(value !== abilityCountOld.get(key)) console.log("shuffle didn't work")
//         }
//         console.log("end shuffle test")
        
//     //end test code
//     return newMap;
//   }