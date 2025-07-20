import {useState, useRef} from "react";
import { Button } from "@/components/ui/button"

// eslint-disable-next-line react-refresh/only-export-components
export default function (){
    const [start, setStart] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    interface Vertice{
        x: number;
        y: number;
    }

    interface Vertices {
        verticeSuperior: Vertice;
        verticeInferiorEsquerdo: Vertice;
        verticeInferiorDireito: Vertice;
    }

    const verticesTriangulo: Vertices = {
        verticeSuperior: { x: 350, y: 50 },   // Vértice superior
        verticeInferiorEsquerdo: { x: 50, y: 650 },   // Vértice inferior esquerdo
        verticeInferiorDireito: { x: 650, y: 650 }   // Vértice inferior direito
    };

    const desenharTrianguloInicial = (verticesTriangulo: Vertices) => {
        setStart(true);
        const canvas = document.getElementById("triangulo") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        ctx?.beginPath();
        ctx?.moveTo(verticesTriangulo.verticeSuperior.x, verticesTriangulo.verticeSuperior.y);
        ctx?.lineTo(verticesTriangulo.verticeInferiorEsquerdo.x, verticesTriangulo.verticeInferiorEsquerdo.y);
        ctx?.lineTo(verticesTriangulo.verticeInferiorDireito.x, verticesTriangulo.verticeInferiorDireito.y);
        ctx?.closePath();
        
        ctx?.stroke();
    }

    const desenharPonto = (vertice: Vertice) => {
        const canvas = document.getElementById("triangulo") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "red";
        ctx.fillRect(vertice.x, vertice.y, 1, 1);
    }

    const desenharPontoMedio = (p1: Vertice, p2: Vertice) => {
        const canvas = document.getElementById("triangulo") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const pontoMedio: Vertice = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };

        desenharPonto(pontoMedio);
    }

    const escolherVerticeTrianguloAleatorio = (verticesTriangulo: Vertices): Vertice => {
        const pontos: Vertice[] = [
            verticesTriangulo.verticeSuperior,
            verticesTriangulo.verticeInferiorEsquerdo,
            verticesTriangulo.verticeInferiorDireito
        ];
        const indiceAleatorio = Math.floor(Math.random() * pontos.length);
        return pontos[indiceAleatorio];
    }


    const main = () => {
        desenharTrianguloInicial(verticesTriangulo);
    }

     return (
         
         <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-500">
           {!start && (
                <Button className="mb-2" onClick={main}>Start</Button>
           )}
                <canvas className="triangulo bg-white" id="triangulo" ref={canvasRef} width="700" height="700"/>
        </div>
     )
}