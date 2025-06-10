'use client';

import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useGLTF, shaderMaterial } from '@react-three/drei';
import { Suspense, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { MeshBVH } from 'three-mesh-bvh';
import { createNoise4D } from 'simplex-noise';

const simplex = createNoise4D();

// Custom Shader Material for particle fading
const ParticleFlowMaterial = shaderMaterial(
  // Uniforms
  {
    uColor: new THREE.Color('#87CEEB'), // Blue for slow
    uColorFast: new THREE.Color('#8A2BE2'), // Purple for fast
    uFadeNear: 0.0,
    uFadeFar: 0.0,
  },
  // Vertex Shader
  `
    attribute vec2 aLifetime;
    attribute float aVelocity;
    varying float vLifetime;
    varying float vVelocity;
    varying float vDist;

    void main() {
      vLifetime = aLifetime.x / aLifetime.y;
      vVelocity = aVelocity;

      vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
      vDist = length(viewPos.xyz);

      gl_PointSize = (vLifetime * vLifetime) * 5.0 + 1.0;
      gl_Position = projectionMatrix * viewPos;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform vec3 uColorFast;
    uniform float uFadeNear;
    uniform float uFadeFar;
    varying float vLifetime;
    varying float vVelocity;
    varying float vDist;

    void main() {
      // Make particle circular
      float distToCenter = distance(gl_PointCoord, vec2(0.5));
      float circle = 1.0 - smoothstep(0.45, 0.5, distToCenter);

      if (circle < 0.01) discard;

      float lifeOpacity = smoothstep(0.0, 0.2, vLifetime) * (1.0 - smoothstep(0.8, 1.0, vLifetime));
      
      float depthFade = 1.0 - smoothstep(uFadeNear, uFadeFar, vDist);
      
      float finalOpacity = lifeOpacity * depthFade * circle;
      if (finalOpacity < 0.01) discard;
      
      float speedT = smoothstep(0.2, 1.5, vVelocity);
      vec3 baseColor = mix(uColor, uColorFast, speedT);
      
      // Add a glow towards the center of the particle
      float glowFalloff = smoothstep(0.4, 0.0, distToCenter);
      vec3 finalColor = baseColor + baseColor * glowFalloff * 0.5; // 0.5 is glow intensity
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `
);
extend({ ParticleFlowMaterial });

function SurfaceFlowParticles() {
  const { scene } = useGLTF('/handscentered.glb');
  const pointsRef = useRef<THREE.Points>(null);
  // @ts-ignore
    const shaderRef = useRef<any>();

  // 1. Prepare sampler and BVH
  const { sampler, bvh } = useMemo(() => {
    const mesh = scene.getObjectByProperty('isMesh', true) as THREE.Mesh;
    if (mesh) {
      const bvh = new MeshBVH(mesh.geometry);
      const sampler = new MeshSurfaceSampler(mesh).build();
      return { sampler, bvh };
    }
    return { sampler: null, bvh: null };
  }, [scene]);

  // 2. Initialize particle data with lifetime and velocity
  const { positions: particlePositions, lifetimes: particleLifetimes, velocities: particleVelocities } = useMemo(() => {
    if (!sampler) return { positions: null, lifetimes: null, velocities: null };
    const count = 10000;
    const positions = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count * 2);
    const velocities = new Float32Array(count);
    const tempPos = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      sampler.sample(tempPos);
      positions.set(tempPos.toArray(), i * 3);

      const totalLife = 2.0 + Math.random() * 2.0;
      const initialLife = Math.random() * totalLife;
      lifetimes.set([initialLife, totalLife], i * 2);
      velocities[i] = 0;
    }
    return { positions, lifetimes, velocities };
  }, [sampler]);

  // 3. Animation loop
  useFrame((state, delta) => {
    if (!pointsRef.current || !bvh || !sampler || !shaderRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const lifetimeAttr = pointsRef.current.geometry.attributes.aLifetime;
    const velocityAttr = pointsRef.current.geometry.attributes.aVelocity;
    const time = state.clock.getElapsedTime() * 0.5;

    const globalWind = new THREE.Vector3(0.1, 0.05, -0.2);
    const baseSpeed = 0.5;
    const curlStrength = 0.5;
    const noiseScale = 3.0;

    const tempPos = new THREE.Vector3();
    const targetPointInfo = { point: new THREE.Vector3(), distance: 0, faceIndex: 0 };
    const targetPoint = targetPointInfo.point;
    const newSamplePos = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      let remainingLife = lifetimeAttr.getX(i);
      const totalLife = lifetimeAttr.getY(i);

      remainingLife -= delta;

      if (remainingLife <= 0) {
        sampler.sample(newSamplePos);
        posAttr.setXYZ(i, newSamplePos.x, newSamplePos.y, newSamplePos.z);
        remainingLife = totalLife;
      }
      
      tempPos.fromBufferAttribute(posAttr, i);

      // Same velocity logic as before
      bvh.closestPointToPoint(tempPos, targetPointInfo);
      const normal = new THREE.Vector3();
       if(bvh.geometry.index) {
          const face = bvh.geometry.index.array.slice(targetPointInfo.faceIndex * 3, targetPointInfo.faceIndex * 3 + 3);
          const vA = new THREE.Vector3().fromBufferAttribute(bvh.geometry.attributes.position, face[0]);
          const vB = new THREE.Vector3().fromBufferAttribute(bvh.geometry.attributes.position, face[1]);
          const vC = new THREE.Vector3().fromBufferAttribute(bvh.geometry.attributes.position, face[2]);
          normal.crossVectors(vB.sub(vA), vC.sub(vA)).normalize();
      }
      const tangentVel = globalWind.clone().projectOnPlane(normal);
      const p = tempPos.clone().multiplyScalar(noiseScale);
      const noiseX = simplex(p.x, p.y, p.z, time);
      const noiseY = simplex(p.y, p.z + 23.0, p.x, time);
      const noiseZ = simplex(p.z, p.x - 17.0, p.y, time);
      const curl = new THREE.Vector3(noiseY - noiseZ, noiseZ - noiseX, noiseX - noiseY);
      
      // Don't normalize to get variable speed
      const finalVel = new THREE.Vector3().addVectors(tangentVel, curl.multiplyScalar(curlStrength));
      const speed = finalVel.length();
      
      tempPos.addScaledVector(finalVel, delta * baseSpeed);
      bvh.closestPointToPoint(tempPos, targetPointInfo);
      posAttr.setXYZ(i, targetPoint.x, targetPoint.y, targetPoint.z);

      lifetimeAttr.setX(i, remainingLife);
      velocityAttr.setX(i, speed);
    }
    posAttr.needsUpdate = true;
    lifetimeAttr.needsUpdate = true;
    velocityAttr.needsUpdate = true;
  });

  if (!particlePositions) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        <bufferAttribute attach="attributes-aLifetime" args={[particleLifetimes, 2]} />
        <bufferAttribute attach="attributes-aVelocity" args={[particleVelocities, 1]} />
      </bufferGeometry>
      {/* @ts-ignore */}
      <particleFlowMaterial
        ref={shaderRef}
        key={ParticleFlowMaterial.key}
        uFadeNear={6.0}
        uFadeFar={10.0}
        transparent
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Wrapper to handle rotation and scaling
function WindParticlesWrapper() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.order = 'YXZ';
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, .2, 0]} rotation={[1.80, 1.86, 0.07]} scale={[2, 2, 2]}>
        <SurfaceFlowParticles />
    </group>
  );
}

function ThreeBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ background: 'transparent', width: '100%', height: '100%' }}>
                {/*<ambientLight intensity={0.5} />*/}
                {/*<directionalLight position={[10, 10, 5]} intensity={1.5} />*/}
                <Suspense fallback={null}>
                    <WindParticlesWrapper />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default ThreeBackground; 