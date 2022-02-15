export class Zombie extends Entity {
  constructor(model: GLTFShape, transform: Transform) {
    super()
    this.addComponent(model)
    this.addComponent(transform)

    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(
      new AnimationState('Walking', { looping: true })
    )
    this.getComponent(Animator).addClip(
      new AnimationState('Attacking', { looping: true })
    )
    this.getComponent(Animator).getClip('Walking').play()
    engine.addEntity(this)
  }

  // Play attacking animation
  attack() {
    this.getComponent(Animator).getClip('Attacking').play(false)
  }

  // Play walking animation
  walk() {
    this.getComponent(Animator).getClip('Walking').play(false)
  }
}
