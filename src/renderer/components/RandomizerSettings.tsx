import * as React from "react";

interface props {
  globalState: Array<{ setting: string; value: any }>;
  callback: Function;
}

export const RandomizerSettings = ({ globalState, callback }: props) => {
  let seed = globalState.find(
    (element) => element.setting === "randomizerSeed"
  )!.value;

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(event.target.elements.seed.value);
    callback("randomizerSeed", String(event.target.elements.seed.value));
    event.target.reset();
  };

  return (
    <div className="div-RandoSettings">
      <form onSubmit={handleSubmit}>
        <input name="seed" type="number" defaultValue={seed} />
        <input type="submit" value="set Seed" />
      </form>
    </div>
  );
};

export default RandomizerSettings;
