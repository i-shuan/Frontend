import React, { useEffect, useRef } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
    const texture = useLoader(THREE.TextureLoader, '/earth.png');
    const lightBeamTexture = useLoader(THREE.TextureLoader, '/light.png'); // Make sure this path is correct
    const earthRef = useRef();
    const lightBeamRef = useRef();
    const taiwanLongitude = 120.9605; // East longitude
    const taiwanLatitude = 23.6978; // North latitude
    
    useEffect(() => {
        const earth = earthRef.current;
       

        if (earth) {
            earth.rotation.y = -THREE.MathUtils.degToRad(taiwanLongitude + 90);
        }
    }, []);

    const radius = 5; // same as the Earth sphere radius
  
    const latRadians = THREE.MathUtils.degToRad(taiwanLatitude);
    const lonRadians = -THREE.MathUtils.degToRad(taiwanLongitude);
    const x = radius * Math.cos(latRadians) * Math.cos(lonRadians);
    const y = radius * Math.sin(latRadians);
    const z = radius * Math.cos(latRadians) * Math.sin(lonRadians);

    return (
        <>
            <mesh ref={earthRef}>
                <sphereGeometry args={[5, 64, 64]} />
                <meshStandardMaterial map={texture} />
            </mesh>
            <mesh ref={lightBeamRef} position={[x, y, z]} rotation={[-Math.PI / 2 + latRadians, 0, lonRadians]}>
                <coneGeometry args={[0.1, 3, 32]} />
                <meshBasicMaterial map={lightBeamTexture} transparent={true} opacity={0.6} blending={THREE.AdditiveBlending} />
            </mesh>
        </>
    );
};
const WorldMap = () => {
    return (
        <Canvas style={{ height: '80vh', background: 'linear-gradient(to bottom, #ffffff, #cccccc)' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
            <ambientLight intensity={6} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <directionalLight position={[-10, 0, 10]} intensity={2} />
            <Earth />
            <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
    );
};

export default WorldMap;
