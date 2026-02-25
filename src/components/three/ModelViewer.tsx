"use client";

import { Suspense, useRef, useLayoutEffect, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { cn } from "@/lib/utils";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three";

type ModelViewerProps = {
  src?: string;
  className?: string;
};

function Model({
  src,
  modelRef,
}: {
  src: string;
  modelRef: React.RefObject<THREE.Group | null>;
}) {
  const { scene } = useGLTF(src);
  return <primitive ref={modelRef} object={scene} />;
}

// Easing function for smooth animation (ease-out cubic)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Load-in animation component
function LoadAnimation({
  modelGroupRef,
  onComplete,
}: {
  modelGroupRef: React.RefObject<THREE.Group | null>;
  onComplete: () => void;
}) {
  const startTimeRef = useRef<number | null>(null);
  const animationCompleteRef = useRef(false);
  const ANIMATION_DURATION = 750; // 750ms duration

  useFrame((state) => {
    if (!modelGroupRef.current || animationCompleteRef.current) return;

    // Initialize start time on first frame
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime * 1000;
      // Set initial values (0.70 scale for animation start)
      modelGroupRef.current.scale.setScalar(0.70);
      modelGroupRef.current.position.y = -0.05;
      return;
    }

    const elapsed = state.clock.elapsedTime * 1000 - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    const eased = easeOutCubic(progress);

    if (progress < 1) {
      // Animate from initial to final values (0.70 → 0.75)
      const scale = 0.70 + (0.75 - 0.70) * eased;
      const positionY = -0.05 + (0 - -0.05) * eased;

      modelGroupRef.current.scale.setScalar(scale);
      modelGroupRef.current.position.y = positionY;
    } else {
      // Animation complete - set final values (0.75 scale for significant breathing room)
      modelGroupRef.current.scale.setScalar(0.75);
      modelGroupRef.current.position.y = 0;
      animationCompleteRef.current = true;
      onComplete();
    }
  });

  return null;
}

function Scene({ src }: { src: string }) {
  const controlsRef = useRef<OrbitControlsType>(null);
  const modelRef = useRef<THREE.Group>(null);
  const modelGroupRef = useRef<THREE.Group>(null);
  const didFrame = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { camera, invalidate } = useThree();

  // One-time manual framing when model loads
  useLayoutEffect(() => {
    if (!modelRef.current || didFrame.current) return;

    // Wait for model to be fully loaded
    const timer = setTimeout(() => {
      if (!modelRef.current || didFrame.current) return;

      // Ensure camera is PerspectiveCamera
      if (!(camera instanceof THREE.PerspectiveCamera)) return;

      // Compute bounding box
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Compute framing distance based on camera FOV
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = (camera.fov * Math.PI) / 180;
      let distance = (maxDim / 2) / Math.tan(fov / 2);
      distance *= 1.7; // increased padding for smaller apparent size and guaranteed breathing room

      // Set camera position ONCE
      camera.position.set(center.x, center.y, center.z + distance);
      camera.near = distance / 100;
      camera.far = distance * 100;
      camera.updateProjectionMatrix();
      camera.lookAt(center);

      // Set OrbitControls target ONCE
      if (controlsRef.current) {
        controlsRef.current.target.copy(center);
        controlsRef.current.update();
      }

      // Mark as framed
      didFrame.current = true;
    }, 50);

    return () => clearTimeout(timer);
  }, [camera]);

  // Ensure model group maintains final scale (0.75) to prevent edge clipping
  useLayoutEffect(() => {
    if (modelGroupRef.current) {
      // Set initial scale if animation hasn't started, or ensure final scale after animation
      if (animationComplete) {
        modelGroupRef.current.scale.setScalar(0.75);
      }
    }
  }, [animationComplete]);

  // Ensure auto-rotate starts when animation completes
  useLayoutEffect(() => {
    if (animationComplete && !isInteracting && controlsRef.current) {
      controlsRef.current.autoRotate = true;
    }
  }, [animationComplete, isInteracting]);

  // Handle interaction start (pause auto-rotate)
  const handleStart = () => {
    setIsInteracting(true);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  };

  // Handle interaction end (resume auto-rotate)
  const handleEnd = () => {
    setIsInteracting(false);
    if (controlsRef.current && animationComplete) {
      controlsRef.current.autoRotate = true;
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />
      <group ref={modelGroupRef}>
        <Model src={src} modelRef={modelRef} />
        {!animationComplete && (
          <LoadAnimation
            modelGroupRef={modelGroupRef}
            onComplete={() => setAnimationComplete(true)}
          />
        )}
      </group>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={animationComplete && !isInteracting}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        onStart={handleStart}
        onEnd={handleEnd}
      />
    </>
  );
}

export default function ModelViewer({
  src = "/models/portfoliochair.glb",
  className,
}: ModelViewerProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div
      className={cn("w-full h-full overflow-hidden rounded-md", className)}
      style={{ 
        width: "100%", 
        height: "100%",
        cursor: isInteracting ? "grabbing" : "grab"
      }}
      onMouseDown={() => setIsInteracting(true)}
      onMouseUp={() => setIsInteracting(false)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      <Canvas
        frameloop="always"
        dpr={[1, 1]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <Scene src={src} />
        </Suspense>
      </Canvas>
    </div>
  );
}

