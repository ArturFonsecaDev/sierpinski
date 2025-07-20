import {useState, useRef} from "react";
import { Button } from "@/components/ui/button"

// eslint-disable-next-line react-refresh/only-export-components
export default function (){
    const [start, setStart] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    function handleDialog(){
        setOpenDialog(!openDialog);
    }

    function handleForm(){
        handleDialog();
        main(input);
    }

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

    const escolherVerticeTrianguloAleatorio = (): Vertice => {
        const pontos: Vertice[] = [
            verticesTriangulo.verticeSuperior,
            verticesTriangulo.verticeInferiorEsquerdo,
            verticesTriangulo.verticeInferiorDireito
        ];
        const indiceAleatorio = Math.floor(Math.random() * pontos.length);
        return pontos[indiceAleatorio];
    }

    const escolherPontoInicial = (): Vertice => {
        let s = Math.random();
        let t = Math.random();

        if (s + t > 1) {
            s = 1 - s;
            t = 1 - t;
        }

        // Calcule as coordenadas baricêntricas 'u', 'v' e 'w'
        // u = s
        // v = t
        // w = 1 - s - t

        const x = s * verticesTriangulo.verticeSuperior.x + t * verticesTriangulo.verticeInferiorEsquerdo.x + (1 - s - t) * verticesTriangulo.verticeInferiorDireito.x;
        const y = s *  verticesTriangulo.verticeSuperior.y + t * verticesTriangulo.verticeInferiorEsquerdo.y + (1 - s - t) * verticesTriangulo.verticeInferiorDireito.y;

        return { x: x, y: y };
    }

    const sierpinski = (iteracoesRestantes: number, pontoAnterior?: Vertice) => {
        const pontoAtual: Vertice = pontoAnterior || escolherPontoInicial();

        desenharPonto(pontoAtual);

        if (iteracoesRestantes > 0) {
            const verticeAlvo = escolherVerticeTrianguloAleatorio();

            const novoPonto: Vertice = {
                x: (pontoAtual.x + verticeAlvo.x) / 2,
                y: (pontoAtual.y + verticeAlvo.y) / 2
            };

            setTimeout(() => {
                sierpinski(iteracoesRestantes - 1, novoPonto);
            }, 1);
        }
    };

    const main = () => {
        desenharTrianguloInicial(verticesTriangulo);
        sierpinski(10000);
    }

     return (
         
         <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-500">
             <Progress value={percent} />
             <Button className="m-2" onClick={handleDialog}>
                 Start
             </Button>
             {!start && (
                 <Dialog open={openDialog} onOpenChange={handleDialog}>
                     <DialogContent>
                         <DialogHeader>
                             <DialogTitle>Quantos Pontos gostaria de Gerar?</DialogTitle>
                         </DialogHeader>
                         <Input pattern='/[1-9]\d*/' onChange={(e) => setInput(e.target.value)} type="number" placeholder="Quantidade de Pontos..."/>
                         <DialogFooter>
                             <Button onClick={handleForm}>
                                 Start
                             </Button>
                             <Button className="bg-destructive" onClick={handleDialog}>
                                 Cancel
                             </Button>
                         </DialogFooter>
                     </DialogContent>
                 </Dialog>
             )}
           { loading && (
               <canvas className="triangulo bg-white" id="triangulo" ref={canvasRef} width="700" height="700"/>
           )}


        </div>
     )
}