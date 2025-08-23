import { process } from "./src/process.ts";

const main = () =>  {
  console.log("Welcome to Dumb CLI!");
  process(Deno.args);
}

main();
