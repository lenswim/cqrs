import ForceGraph2D from "react-force-graph-2d";
import { useMemo } from "react";
import { useConversationList } from "../hooks";
import { useSocialWeb } from "../hooks";
import { useTheme } from "../contexts/ThemeContext";
import { lightTheme, darkTheme } from "../styles/theme";

export type Node = { id: string };
export type Link = { source: string; target: string; count: number };

export default function SocialGraph() {
  const { conversations } = useConversationList();
  const socialWeb = useSocialWeb(conversations);

  const nodes = socialWeb.nodes;
  const links = socialWeb.links;

  const { mode } = useTheme();
  const currentTheme = mode === "light" ? lightTheme : darkTheme;

  // Build a color map: assign each node a unique color
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    nodes.forEach((node, index) => {
      const hue = (index / nodes.length) * 360; // distribute across HSL hue
      map.set(node.id, `hsl(${hue}, 70%, 50%)`);
    });
    return map;
  }, [nodes]);

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <ForceGraph2D
        graphData={{ nodes, links }}
        backgroundColor={currentTheme.background.primary}
        linkColor={() => currentTheme.text.primary}
        linkWidth={(link: any) => (link.count ? Math.sqrt(link.count) : 1)}

        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 14 / globalScale;
          const size = 5;

          // Draw circle with color from colorMap
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
          ctx.fillStyle = colorMap.get(node.id) ?? currentTheme.accent.primary;
          ctx.fill();

          // Draw the text label
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = currentTheme.text.primary;
          ctx.fillText(label, node.x, node.y + size + fontSize * 0.5);
        }}
        nodeCanvasObjectMode={() => "replace"}
      />
    </div>
  );
}
