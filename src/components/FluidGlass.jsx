/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { memo, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  MeshTransmissionMaterial,
  Float,
  Sparkles,
} from "@react-three/drei";
import { easing } from "maath";

export default function FluidGlass({
  mode = "lens", // 'lens' | 'bar' | 'cube'
  lensProps = {},
  barProps = {},
  cubeProps = {},
}) {
  const modeProps = mode === "bar" ? barProps : mode === "cube" ? cubeProps : lensProps;

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 28 }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
      dpr={[1, 2]}
    >
      {/* Lighting + environment for realistic transmission */}
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 6, 6]} intensity={1.2} />
      <directionalLight position={[-6, -2, 4]} intensity={0.55} />

      <Environment preset="city" />

      {/* Subtle particles */}
      <Sparkles
        count={70}
        scale={[12, 6, 1]}
        size={1.6}
        speed={0.25}
        opacity={0.35}
        color={"#ffffff"}
      />

      {/* The glass object */}
      <Float speed={0.8} rotationIntensity={0.25} floatIntensity={0.35}>
        <GlassObject mode={mode} modeProps={modeProps} />
      </Float>

      {/* Soft glow plane (fake bloom-ish) */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[30, 16]} />
        <meshBasicMaterial
          transparent
          opacity={0.08}
          color={"#7c3aed"}
        />
      </mesh>
    </Canvas>
  );
}

const GlassObject = memo(function GlassObject({ mode, modeProps }) {
  const ref = useRef();

  // defaults that look premium in dark + glassmorphism
  const mat = {
    transmission: 1,
    roughness: 0.05,
    thickness: 8,
    ior: 1.18,
    chromaticAberration: 0.12,
    anisotropy: 0.02,
    distortion: 0.08,
    distortionScale: 0.35,
    temporalDistortion: 0.18,
    clearcoat: 1,
    attenuationDistance: 0.35,
    attenuationColor: "#ffffff",
    color: "#ffffff",
    ...modeProps,
  };

  const geometry = useMemo(() => {
    if (mode === "bar") {
      // rounded bar: long capsule-ish using cylinder
      const g = new THREE.CylinderGeometry(1.25, 1.25, 4.6, 64, 1, true);
      g.rotateX(Math.PI / 2);
      return g;
    }
    if (mode === "cube") {
      // rounded cube
      return new THREE.BoxGeometry(2.6, 2.6, 2.6, 8, 8, 8);
    }
    // lens: squashed sphere looks like lens
    const g = new THREE.SphereGeometry(1.8, 96, 96);
    return g;
  }, [mode]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const { pointer, viewport, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 0]);

    // follow pointer (cinematic subtle)
    const targetX = (pointer.x * v.width) / 6;
    const targetY = (pointer.y * v.height) / 6;

    easing.damp3(ref.current.position, [targetX, targetY, 0], 0.18, delta);

    // lens squash for extra “premium”
    if (mode === "lens") {
      easing.damp3(ref.current.scale, [1.25, 0.78, 1.0], 0.12, delta);
      ref.current.rotation.y += delta * 0.22;
      ref.current.rotation.x += delta * 0.08;
    } else if (mode === "bar") {
      easing.damp3(ref.current.scale, [1.2, 1.0, 1.0], 0.12, delta);
      ref.current.rotation.z += delta * 0.1;
    } else {
      easing.damp3(ref.current.scale, [1.0, 1.0, 1.0], 0.12, delta);
      ref.current.rotation.y += delta * 0.18;
      ref.current.rotation.x += delta * 0.12;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <MeshTransmissionMaterial {...mat} />
    </mesh>
  );
});
