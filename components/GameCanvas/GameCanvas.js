// components/GameCanvas.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { Engine, Render, World, Bodies, Body, Events } from "matter-js";
import styles from "./GameCanvas.module.scss";

const GameCanvas = () => {
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 100 });
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const stageRef = useRef(null);
  const playerRef = useRef(null);
  const engineRef = useRef(null);
  const player = useRef(null);
  const keys = useRef({});

  useEffect(() => {
    const engine = Engine.create();
    engineRef.current = engine;
    const { world } = engine;

    const updateStageSize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateStageSize);

    // Define the objects
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight - 20,
      window.innerWidth,
      40,
      { isStatic: true }
    );
    const platform1 = Bodies.rectangle(200, 450, 200, 20, { isStatic: true });
    const platform2 = Bodies.rectangle(600, 350, 200, 20, { isStatic: true });
    player.current = Bodies.circle(100, 100, 20, { restitution: 0.5 });

    // Add objects to the world
    World.add(world, [ground, platform1, platform2, player.current]);

    // Handle key events
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Update player position and controls
    const update = () => {
      if (
        keys.current["ArrowUp"] &&
        Math.abs(player.current.velocity.y) < 1e-1
      ) {
        Body.applyForce(player.current, player.current.position, {
          x: 0,
          y: -0.05,
        });
      }
      if (keys.current["ArrowLeft"]) {
        Body.applyForce(player.current, player.current.position, {
          x: -0.01,
          y: 0,
        });
      }
      if (keys.current["ArrowRight"]) {
        Body.applyForce(player.current, player.current.position, {
          x: 0.01,
          y: 0,
        });
      }

      // Boundary checks
      if (player.current.position.x - 20 < 0) {
        Body.setPosition(player.current, {
          x: 20,
          y: player.current.position.y,
        });
        Body.setVelocity(player.current, {
          x: 0,
          y: player.current.velocity.y,
        });
      } else if (player.current.position.x + 20 > stageSize.width) {
        Body.setPosition(player.current, {
          x: stageSize.width - 20,
          y: player.current.position.y,
        });
        Body.setVelocity(player.current, {
          x: 0,
          y: player.current.velocity.y,
        });
      }
      if (player.current.position.y - 20 < 0) {
        Body.setPosition(player.current, {
          x: player.current.position.x,
          y: 20,
        });
        Body.setVelocity(player.current, {
          x: player.current.velocity.x,
          y: 0,
        });
      } else if (player.current.position.y + 20 > stageSize.height) {
        Body.setPosition(player.current, {
          x: player.current.position.x,
          y: stageSize.height - 20,
        });
        Body.setVelocity(player.current, {
          x: player.current.velocity.x,
          y: 0,
        });
      }

      Engine.update(engine);
      setPlayerPos({
        x: player.current.position.x,
        y: player.current.position.y,
      });
      requestAnimationFrame(update);
    };

    update();

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", updateStageSize);
      World.clear(world);
      Engine.clear(engine);
    };
  }, [stageSize.width, stageSize.height]);

  return (
    <Stage
      className={styles.stage}
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
    >
      <Layer>
        <Rect
          x={0}
          y={stageSize.height - 40}
          width={stageSize.width}
          height={40}
          fill="#7f8c8d"
        />
        <Rect x={100} y={430} width={200} height={20} fill="#2c3e50" />
        <Rect x={500} y={330} width={200} height={20} fill="#2c3e50" />
        <Circle
          ref={playerRef}
          x={playerPos.x}
          y={playerPos.y}
          radius={20}
          fill="red"
        />
      </Layer>
    </Stage>
  );
};

export default GameCanvas;
