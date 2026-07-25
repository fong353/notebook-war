# Notebook War

*The war I used to draw in the margins of my school notebooks — rebuilt so that it fights itself.*

**English** · [中文](README.zh-CN.md)

**[▶ Play it in your browser](https://fong353.github.io/notebook-war/)**
 · [Cold War version](https://fong353.github.io/notebook-war/cold-war.html)

![Battle](docs/battle.png)

## Why I built this

When I was a kid I drew wars in the margins of my exercise books. Tanks and planes on both sides,
pencil lines for tracer fire, a scribble over whatever got hit. There were never any rules — I just
wanted to watch the two sides go at each other, and I'd add another tank whenever one side started
losing.

This is that drawing, rebuilt as something that runs on its own. You don't command anyone. You draw
units onto the paper and they fight by themselves; if you never touch it again, the battle still
plays out. Everything I liked about the original is still here — it looks like ballpoint on graph
paper, every unit has a health bar, and ground and air shoot at each other.

Everything I *didn't* know how to draw back then is what the code is for: infantry that get pinned
down by machine-gun fire and crawl into a trench, tanks that throw a track and start smoking, dive
bombers that have to fly a real attack run instead of hovering over the target.

## What it is

A single HTML file. No build step, no dependencies, no network calls — open it and it runs.

- **Two eras.** `index.html` is 1944: Wehrmacht, US Army and Red Army, pick any two to fight.
  `cold-war.html` is the earlier version: US vs USSR, with helicopters, drones and cruise missiles.
- **Bilingual.** One button in the corner switches the whole interface between English and Chinese,
  designations included (`Pz.VI Tiger` ↔ `Pz.VI 虎式`).
- **16 unit types**, each with real equipment per nation — a Tiger, a Sherman and a T-34 are three
  different silhouettes, not three colours of the same box.
- **Weapons are separate things.** A unit carries one or two, each with its own range, reload and
  ammo, and picks between them by expected damage against the current target. A tank uses its coax
  machine gun on infantry and saves the main gun for armour. A fighter fires its wing guns in a
  turning fight because a missile has a minimum range.
- **Suppression drives the infantry fight.** Fire landing nearby pins men down whether or not it
  hits; pinned infantry crawl for the nearest trench or bunker and stop advancing.
- **Six commander orders** on cooldowns — air strike, barrage, reinforce, rally, smoke, airdrop —
  so you can lean on the battle without micromanaging it.

![Nations](docs/nations.png)

## Running it

[Play online](https://fong353.github.io/notebook-war/), or open `index.html` from a local copy —
it needs no server, no build step and makes no network calls.

- `?warmup=45` skips ahead 45 in-game seconds, so you land in the middle of a fight instead of at
  the opening deployment. `?units=38` raises each side's target strength from the default 17 —
  good for a wide screen and a proper mass engagement. `?lang=en|zh` forces a language.
- Drag on the field to draw units. Click an order, then click the field to aim it.
- Hover any unit to see its designation, weapons, remaining ammo and current state.
- `Space` pauses, number/letter keys pick a unit type, `Tab` switches which side your pen belongs to.
- Works on phones — there's a **Rotate** button, because a battlefield wants to be wide.

![Cold War](docs/coldwar.png)

## Notes on how it works

A few decisions that turned out to matter more than expected:

**Cheated perspective.** The ground is a real one-point-perspective grid, but unit scale is
deliberately *not*. True perspective shrinks the far rank to 47% and you can't read it any more;
no scaling at all and the depth disappears. It settles at about 62%.

**Fixed-wing aircraft can't use converging movement.** Steering a plane by `(target - self) / dist`
looks fine until you notice `dist` is three-dimensional: a plane at altitude 95 over a tank on the
ground still has 95 units of separation when it's directly overhead, so the numerator goes to zero
while the denominator doesn't, and the plane decelerates to a hover above its target. Attack runs
are driven by a leg counter instead — fly this far, break off, turn, come back — which never
deadlocks no matter how the target moves.

**Making the battle watchable was not about slowing the rate of fire.** Sparse fire just makes a
dull picture. What was needed was units that survive the first exchange, so both sides stay tangled
together: more health, assault units pushing to knife range, and minimum ranges on missiles so
close-in fighting falls back to guns.

**Craters fade by erasing the whole scar layer a little at a time**, rather than storing a lifetime
per crater and redrawing all of them each frame. Old craters have been erased more often, so they
disappear first.

## License

MIT — see [LICENSE](LICENSE).
