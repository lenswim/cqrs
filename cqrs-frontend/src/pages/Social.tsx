import { useConversationList } from '../hooks';
import { useSocialWeb } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three'
import { useMemo, useRef } from 'react';

export type Node = { id: string };
export type Link = { source: string; target: string, count: number };

export default function SocialGraph3D() {
    const { conversations } = useConversationList();
    const socialWeb = useSocialWeb(conversations);

    const nodes = socialWeb.nodes;
    const links = socialWeb.links;

    const { mode } = useTheme();
    const theme = mode === 'light' ? lightTheme : darkTheme;


    const colorMap = useMemo(() => {
        const map = new Map<string, string>();
        nodes.forEach((n, index) => {
            // pick a color based on index or hash it
            const color = new THREE.Color().setHSL((index / nodes.length) % 1, 0.6, 0.5).getStyle();
            map.set(n.id, color);
        });
        return map;
    }, [nodes]);

    const fgRef = useRef<any>(null);
    return (
        <div style={{ width: "100%", height: "600px" }}>
            <ForceGraph3D<Node, Link>
                ref={fgRef}

                onNodeClick={(node) => {
                    const distance = 80; // how close the camera gets
                    const distRatio =
                        1 + distance / Math.hypot(node.x!, node.y!, node.z!);

                    fgRef.current?.cameraPosition(
                        {
                            x: node.x! * distRatio,
                            y: node.y! * distRatio,
                            z: node.z! * distRatio,
                        },
                        node, // lookAt
                        800   // ms transition
                    );
                }}

                graphData={{ nodes, links }}

                backgroundColor={theme.background.primary}
                linkColor={() => theme.text.primary}
                linkOpacity={0.9}
                linkWidth={(link: Link) => Math.max(1, Math.sqrt(link.count))}

                nodeThreeObject={(node: Node) => {
                    const color = colorMap.get(node.id) ?? theme.accent.primary;

                    // Sphere for the node
                    const sphere = new THREE.Mesh(
                        new THREE.SphereGeometry(6, 12, 12),
                        new THREE.MeshBasicMaterial({ color })
                    );

                    // Text label
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d")!;
                    ctx.font = "48px Sans-Serif";
                    const textWidth = ctx.measureText(node.id).width;
                    canvas.width = textWidth + 20;
                    canvas.height = 64;

                    ctx.font = "48px Sans-Serif";
                    ctx.fillStyle = theme.text.primary;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(node.id, canvas.width / 2, canvas.height / 2);

                    const sprite = new THREE.Sprite(
                        new THREE.SpriteMaterial({
                            map: new THREE.CanvasTexture(canvas),
                            depthTest: false,
                        })
                    );
                    sprite.scale.set(canvas.width / 8, canvas.height / 8, 1);
                    sprite.position.set(0, 10, 0);

                    const group = new THREE.Group();
                    group.add(sphere);
                    group.add(sprite);

                    return group;
                }}
            />
        </div>
    );
}
