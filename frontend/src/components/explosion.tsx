"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const TokenExplosion = () => {
  const [tokens, setTokens] = useState<
    {
      id: string;
      x: number;
      y: number;
      rotation: number;
      opacity: number;
      tokenImage: string;
    }[]
  >([]);

  const tokenImages = ["/3D-tokens/orderly-logo.png"];

  const triggerExplosion = () => {
    const newTokens = Array.from({ length: 10 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 500;

      return {
        id: `token-${index}`,
        x: Math.cos(angle) * radius * 2,
        y: Math.sin(angle) * radius * 2,
        rotation: Math.random() * 360,
        opacity: 1,
        tokenImage: tokenImages[Math.floor(Math.random() * tokenImages.length)],
      };
    });

    setTokens(newTokens);

    // Réinitialiser après l'animation
    setTimeout(() => setTokens([]), 3000);
  };

  return (
    <>
      {tokens.map((token) => (
        <motion.div
          key={token.id}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "50px", // Ajustez selon la taille de vos images
            height: "50px",
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            x: token.x,
            y: token.y,
            opacity: [1, 0.7, 0],
            scale: [0.5, 2, 0],
            rotate: token.rotation,
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
        >
          <Image
            src={token.tokenImage}
            alt="Token"
            width={100} // Largeur de l'image
            height={100} // Hauteur de l'image
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
            }}
          />
        </motion.div>
      ))}

      <button
        onClick={triggerExplosion}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "10px 20px",
          background: "purple",
          color: "white",
          border: "none",
          borderRadius: "10px",
        }}
      >
        Déclencher Explosion
      </button>
    </>
  );
};

export default TokenExplosion;
