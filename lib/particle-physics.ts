import * as THREE from 'three'

export class ParticlePhysics {
  particles: Array<{
    position: THREE.Vector3
    velocity: THREE.Vector3
    anchor: THREE.Vector3
    mass: number
  }> = []

  springConstant = 0.15
  damping = 0.92
  repelRadius = 300
  repelStrength = 1.2
  maxVelocity = 5

  constructor(numParticles: number, gridSize: THREE.Vector3) {
    const spacing = {
      x: gridSize.x / Math.ceil(Math.sqrt(numParticles)),
      y: gridSize.y / Math.ceil(Math.sqrt(numParticles)),
      z: 0
    }

    let index = 0
    for (let i = 0; i < Math.ceil(Math.sqrt(numParticles)); i++) {
      for (let j = 0; j < Math.ceil(Math.sqrt(numParticles)); j++) {
        if (index >= numParticles) break
        const x = i * spacing.x - gridSize.x / 2
        const y = j * spacing.y - gridSize.y / 2
        const z = (Math.random() - 0.5) * 200

        this.particles.push({
          position: new THREE.Vector3(x, y, z),
          velocity: new THREE.Vector3(0, 0, 0),
          anchor: new THREE.Vector3(x, y, z),
          mass: 1
        })
        index++
      }
    }
  }

  update(deltaTime: number, mousePos: { x: number; y: number }, windowSize: { width: number; height: number }) {
    const mouseWorld = new THREE.Vector3(
      (mousePos.x / windowSize.width) * 1000 - 500,
      -(mousePos.y / windowSize.height) * 1000 + 500,
      100
    )

    this.particles.forEach(particle => {
      // 1. CURSOR REPELLER
      const toMouse = particle.position.clone().sub(mouseWorld)
      const dist = toMouse.length()

      if (dist < this.repelRadius) {
        const repelForce = toMouse
          .normalize()
          .multiplyScalar((this.repelStrength / (dist * dist + 1)) * 100)
        particle.velocity.add(repelForce)
      }

      // 2. SPRING FORCE
      const toAnchor = particle.anchor.clone().sub(particle.position)
      const springForce = toAnchor.multiplyScalar(this.springConstant)
      particle.velocity.add(springForce)

      // 3. DAMPING
      particle.velocity.multiplyScalar(this.damping)

      // 4. LIMIT VELOCITY
      if (particle.velocity.length() > this.maxVelocity) {
        particle.velocity.normalize().multiplyScalar(this.maxVelocity)
      }

      // 5. UPDATE POSITION
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime))
    })
  }

  getPositions(): Float32Array {
    const positions = new Float32Array(this.particles.length * 3)
    this.particles.forEach((p, i) => {
      positions[i * 3] = p.position.x
      positions[i * 3 + 1] = p.position.y
      positions[i * 3 + 2] = p.position.z
    })
    return positions
  }
}
