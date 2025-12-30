import ForceGraph2D from "react-force-graph-2d";
import { useConversationList } from '../hooks';
import { useSocialWeb } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

export type Node = { id: string };
export type Link = { source: string; target: string, count: number };

export default function SocialGraph() {

    const { conversations } = useConversationList();
    const socialWeb = useSocialWeb(conversations);

    const nodes = socialWeb.nodes;
    const links = socialWeb.links;

    console.log("Links:", links);

    const { mode } = useTheme();
    const currentTheme = mode === 'light' ? lightTheme : darkTheme;

    return (
        <div style={{ height: "600px", width: "100%" }}>
            <ForceGraph2D
                graphData={{ nodes, links }}
                // 1. Change the background color of the canvas
                backgroundColor={currentTheme.background.primary}

                // 2. Change link colors based on theme
                linkColor={() => currentTheme.border.medium}
                linkWidth={(link: any) => (link.count ? Math.sqrt(link.count) : 1)}

                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 14 / globalScale; // Slightly larger for readability

                    // Draw a circle behind the text for a cleaner "node" look
                    const size = 5;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                    ctx.fillStyle = currentTheme.accent.primary;
                    ctx.fill();

                    // 3. Set text style based on your theme object
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = currentTheme.text.primary;

                    // Offset text slightly so it doesn't overlap the circle
                    ctx.fillText(label, node.x, node.y + size + (fontSize * 0.5));
                }}
                nodeCanvasObjectMode={() => "replace"}
            />
        </div>
    );
}
