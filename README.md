# 2D-Platformer-Rougelike

> “Risk of Rain” game taken as reference

## Player:

- Player has 4 abilities (primary, secondary, utility, special). All abilities except primary have cooldowns.
- Player spawns at random location on the stage and has to find the teleporter (end of stage), which also spawns at random location.
- Players can kill enemies to get gold and exp and open chests to get items.
- Players have different stats which increase with the player's level.

## Chests:

- When stage loads, multiple chests spawn at different locations on the stage.
- Chests have items of different rarity which are randomly selected when stage loads.
- Chests require gold to buy which player gets by killing enemies.

## Items:

- Items have white, green and red rarity.
- Each item gives a different effect to the player making the player stronger.
- Examples of items’ effects: Increase movement speed, give extra jump, heal when enemy is killed, chance to deal critical damage (to deal double damage), increase attack speed, give extra life, etc.
- Items can stack with themselves. Example: 10% chance to crit becomes 20% chance to crit.

## Enemies:

- There are different types of enemies (at least 5 enemies).
- Each enemy has different stats and attacks.
- Enemies spawn is controlled by the director.
- The director has credits with which it can use to spawn enemies after certain intervals.
- The director can spawn multiple of the same type of enemy or spawn enemies of different types.
- Director’s credit increases with time (increasing game difficulty).
- Every enemy has a different credit value (cost).
- Enemies spawn near the player and start to attack the player.
- When an enemy is killed, its credit is returned to the director.

## Teleporter:

- Teleporter is the end of the stage.
- When the player activates the teleporter, a teleporter event begins.
- A boss (which can be one of at least two types) spawns during the teleporter event.
- The teleporter has a charging time of 90 secs.
- The teleporter event ends when the teleporter is fully charged and the boss is defeated.

## Additional Features:

- Multiple stages
- More enemies and bosses

## Reference:

[Risk of Rain Returns on Steam](https://store.steampowered.com/app/1337520/Risk_of_Rain_Returns/)
