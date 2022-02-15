import { Zombie } from './zombie'

// Base
const base = new Entity()
base.addComponent(new GLTFShape('models/baseLight.glb'))
base.addComponent(
  new Transform({
    scale: new Vector3(2, 1, 2),
  })
)
engine.addEntity(base)

let zombieCount: number = 8

let zombies: Zombie[] = []

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, () => {
  if (zombies.length > 1) {
    for (let zombie of zombies) {
      engine.removeEntity(zombie)
    }
  }

  addZombies()
})

function addZombies() {
  for (let i = 0; i < zombieCount; i++) {
    let posX = Math.random() * 32
    let posY = Math.random() * 32

    let zombie = new Zombie(
      new GLTFShape('models/zombie.glb'),
      new Transform({
        position: new Vector3(posX, 0.933, posY),
      })
    )
    zombies.push(zombie)
  }
}

addZombies()

// Zombie

// Configuration
const MOVE_SPEED = 1
const ROT_SPEED = 1

// Intermediate variables
const player = Camera.instance

class ZombieAttack implements ISystem {
  update(dt: number) {
    // Rotate to face the player

    for (let zombie of zombies) {
      const transform = zombie.getComponent(Transform)

      let lookAtTarget = new Vector3(
        player.position.x,
        transform.position.y,
        player.position.z
      )
      let direction = lookAtTarget.subtract(transform.position)
      transform.rotation = Quaternion.Slerp(
        transform.rotation,
        Quaternion.LookRotation(direction),
        dt * ROT_SPEED
      )

      // Continue to move towards the player until it is within 2m away
      let distance = Vector3.DistanceSquared(
        transform.position,
        player.position
      ) // Check distance squared as it's more optimized
      if (distance >= 4) {
        // Note: Distance is squared so a value of 4 is when the zombie is standing 2m away
        zombie.walk()
        let forwardVector = Vector3.Forward().rotate(transform.rotation)
        let increment = forwardVector.scale(dt * MOVE_SPEED)
        transform.translate(increment)
      } else {
        zombie.attack()
      }
    }
  }
}

engine.addSystem(new ZombieAttack())
