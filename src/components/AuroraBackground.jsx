import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AuroraBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: false,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 10;

    // Smooth Aurora Vertex Shader
    const auroraVertexShader = `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;
      
      // Smooth noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Flowing noise-based waves
        float noise1 = snoise(vec2(pos.x * 0.3 + uTime * 0.15, pos.y * 0.2));
        float noise2 = snoise(vec2(pos.x * 0.2 - uTime * 0.1, pos.y * 0.15 + uTime * 0.05));
        float noise3 = snoise(vec2(pos.x * 0.4 + uTime * 0.08, pos.y * 0.3 - uTime * 0.12));
        
        // Combine noise for organic movement
        float elevation = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2) * 1.2;
        
        pos.z += elevation;
        vElevation = elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // Smooth Aurora Fragment Shader
    const auroraFragmentShader = `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uOpacity;
      
      void main() {
        // Smooth vertical fade
        float verticalFade = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
        
        // Horizontal soft edges
        float horizontalFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
        
        // Flowing color patterns
        float flow1 = sin(vUv.x * 4.0 + uTime * 0.3 + vElevation) * 0.5 + 0.5;
        float flow2 = cos(vUv.x * 3.0 - uTime * 0.25 + vElevation * 0.5) * 0.5 + 0.5;
        
        // Smooth color transitions
        vec3 color = mix(uColor1, uColor2, flow1);
        color = mix(color, uColor3, flow2 * 0.6);
        
        // Add glow based on elevation
        float glow = (vElevation + 1.0) * 0.5;
        color *= (0.7 + glow * 0.5);
        
        // Smooth alpha with all fades
        float alpha = verticalFade * horizontalFade * (0.5 + flow1 * 0.5) * uOpacity;
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    // Aurora configurations for Pinterest Downloader theme
    const auroraConfigs = [
      { 
        color1: new THREE.Color(0.05, 0.2, 0.4),   // Deep blue
        color2: new THREE.Color(0.1, 0.4, 0.8),    // Medium blue
        color3: new THREE.Color(0.2, 0.6, 1.0),    // Bright blue
        position: [-4, 0.5, -3],
        rotation: 0.15,
        scale: 1.2,
        opacity: 0.4,
        speed: 1.0
      },
      { 
        color1: new THREE.Color(0.4, 0.1, 0.6),   // Deep purple
        color2: new THREE.Color(0.6, 0.2, 0.9),   // Medium purple
        color3: new THREE.Color(0.8, 0.4, 1.0),   // Bright purple
        position: [-1, 1, -4],
        rotation: -0.1,
        scale: 1.0,
        opacity: 0.35,
        speed: 0.8
      },
      { 
        color1: new THREE.Color(0.1, 0.3, 0.2),   // Deep teal
        color2: new THREE.Color(0.2, 0.6, 0.4),   // Medium teal
        color3: new THREE.Color(0.3, 0.8, 0.6),   // Bright teal
        position: [2, -0.5, -3.5],
        rotation: 0.08,
        scale: 1.1,
        opacity: 0.3,
        speed: 1.1
      },
      { 
        color1: new THREE.Color(0.3, 0.1, 0.4),   // Deep indigo
        color2: new THREE.Color(0.5, 0.2, 0.7),   // Medium indigo
        color3: new THREE.Color(0.7, 0.4, 0.9),   // Bright indigo
        position: [4.5, 0.8, -5],
        rotation: -0.12,
        scale: 0.9,
        opacity: 0.25,
        speed: 0.9
      },
      { 
        color1: new THREE.Color(0.2, 0.4, 0.6),   // Ocean blue
        color2: new THREE.Color(0.3, 0.6, 0.9),   // Sky blue
        color3: new THREE.Color(0.4, 0.8, 1.0),   // Light blue
        position: [0.5, -1, -4.5],
        rotation: 0.05,
        scale: 1.15,
        opacity: 0.28,
        speed: 0.85
      }
    ];

    const auroraMeshes = [];

    auroraConfigs.forEach((config, configIndex) => {
      const geometry = new THREE.PlaneGeometry(10, 15, 128, 128);
      const material = new THREE.ShaderMaterial({
        vertexShader: auroraVertexShader,
        fragmentShader: auroraFragmentShader,
        uniforms: {
          uTime: { value: Math.random() * 100 },
          uColor1: { value: config.color1 },
          uColor2: { value: config.color2 },
          uColor3: { value: config.color3 },
          uOpacity: { value: config.opacity }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...config.position);
      mesh.rotation.y = config.rotation;
      mesh.scale.set(config.scale, config.scale, config.scale);
      mesh.userData.speed = config.speed;
      mesh.userData.originalOpacity = config.opacity;
      scene.add(mesh);
      auroraMeshes.push(mesh);
    });

    // Enhanced stars system
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    const starSizes = [];
    const starColors = [];
    
    for (let i = 0; i < 2000; i++) {
      // Create stars in a sphere around camera
      const radius = 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      starPositions.push(x, y, z);
      
      // Random sizes with more variety
      starSizes.push(Math.random() * 2 + 0.5);
      
      // Subtle color variations (blue-white stars)
      const colorIntensity = Math.random() * 0.3 + 0.7;
      starColors.push(
        colorIntensity,                    // R
        colorIntensity * 0.9,             // G
        colorIntensity * 1.1              // B (slightly blue tint)
      );
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create twinkling stars effect
    const twinklingStarsGeometry = new THREE.BufferGeometry();
    const twinklingPositions = [];
    const twinklingSizes = [];
    
    for (let i = 0; i < 300; i++) {
      twinklingPositions.push(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40 - 10
      );
      twinklingSizes.push(Math.random() * 3 + 1);
    }
    
    twinklingStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(twinklingPositions, 3));
    twinklingStarsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(twinklingSizes, 1));
    
    const twinklingStarsMaterial = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.05,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const twinklingStars = new THREE.Points(twinklingStarsGeometry, twinklingStarsMaterial);
    scene.add(twinklingStars);

    // Smooth animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      auroraMeshes.forEach((mesh, index) => {
        const speed = mesh.userData.speed;
        mesh.material.uniforms.uTime.value += 0.008 * speed;
        
        // Very subtle swaying motion
        mesh.rotation.y += Math.sin(elapsedTime * 0.05 + index) * 0.00005;
        mesh.position.x += Math.sin(elapsedTime * 0.08 + index * 2) * 0.001;
        mesh.position.y += Math.cos(elapsedTime * 0.06 + index * 1.5) * 0.001;
        
        // Gentle pulsing opacity
        const originalOpacity = mesh.userData.originalOpacity;
        mesh.material.uniforms.uOpacity.value = originalOpacity * (0.9 + Math.sin(elapsedTime * 0.5 + index) * 0.1);
      });

      // Gentle star movement
      stars.rotation.y = Math.sin(elapsedTime * 0.01) * 0.03;
      stars.rotation.x = Math.cos(elapsedTime * 0.008) * 0.02;
      
      // Twinkling effect
      twinklingStars.material.opacity = 0.5 + Math.sin(elapsedTime * 2) * 0.3;
      twinklingStars.rotation.z = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      auroraMeshes.forEach(mesh => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      starsGeometry.dispose();
      starsMaterial.dispose();
      twinklingStarsGeometry.dispose();
      twinklingStarsMaterial.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />

      {/* Overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10" />
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 10, 20, 0.4) 100%)" />
    </div>
  );
}
