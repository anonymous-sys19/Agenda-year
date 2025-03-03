const THEME_COLORS = {
    // Fondos
    background: "#0f0f1e",
    glassOverlay: "bg-white/5",
    hoverOverlay: "bg-white/10",
  
    // Gradientes
    gradients: {
      background: "from-indigo-900/30 via-purple-900/20 to-blue-900/30",
      accent: "from-cyan-500 via-blue-500 to-purple-600",
      button: "from-blue-600 to-purple-600",
      buttonHover: "from-blue-700 to-purple-700",
      text: "from-cyan-400 to-blue-500",
    },
  
    // Bordes y Separadores
    borders: "border-white/10",
  
    // Textos
    text: {
      primary: "text-white",
      secondary: "text-gray-300",
      accent: "text-cyan-400",
      hover: "text-cyan-300",
    },
  
    // Efectos
    effects: {
      glow: "ring-cyan-500/50",
      shadow: "shadow-blue-500/20",
    }
  } as const
  
  export default THEME_COLORS
  