import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function App() {
    const [start, setStart] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [input, setInput] = useState<string>("50000");
    const [validationError, setValidationError] = useState<string>("");
    const [percent, setPercent] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const totalIterationsRef = useRef<number>(0);

    const ANIMATION_SPEED = 5; // speed in milliseconds


    const validateInput = (value: string): boolean => {
        const regex = /^[1-9]\d*$/;
        if (!value.trim()) {
            setValidationError("Campo obrigatório.");
            return false;
        }
        if (!regex.test(value)) {
            setValidationError("Digite um número inteiro positivo válido (ex: 10000).");
            return false;
        }
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue <= 0) {
            setValidationError("O número deve ser positivo.");
            return false;
        }
        setValidationError("");
        return true;
    };

    function handleDialog(){
        setOpenDialog(!openDialog);
        if (!openDialog) {
            setInput("50000");
            setValidationError("");
            setPercent(0);
        }
    }

    function handleForm(){
        if (validateInput(input)) {
            handleDialog();
            setStart(true);
            const numPoints = parseInt(input);
            totalIterationsRef.current = numPoints;
            main(numPoints);
        }
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
        verticeSuperior: { x: 350, y: 50 },
        verticeInferiorEsquerdo: { x: 50, y: 650 },
        verticeInferiorDireito: { x: 650, y: 650 }
    };

    const desenharTrianguloInicial = (vertices: Vertices) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(vertices.verticeSuperior.x, vertices.verticeSuperior.y);
        ctx.lineTo(vertices.verticeInferiorEsquerdo.x, vertices.verticeInferiorEsquerdo.y);
        ctx.lineTo(vertices.verticeInferiorDireito.x, vertices.verticeInferiorDireito.y);
        ctx.closePath();
        ctx.stroke();
    }

    const desenharPonto = (vertice: Vertice) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
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

        const x = s * verticesTriangulo.verticeSuperior.x + t * verticesTriangulo.verticeInferiorEsquerdo.x + (1 - s - t) * verticesTriangulo.verticeInferiorDireito.x;
        const y = s * verticesTriangulo.verticeSuperior.y + t * verticesTriangulo.verticeInferiorEsquerdo.y + (1 - s - t) * verticesTriangulo.verticeInferiorDireito.y;

        return { x: x, y: y };
    }

    function calcularPorcentagem(pontosConcluidos: number, total: number): number {
        if (total === 0) return 0;
        return Math.min(100, Math.floor((pontosConcluidos / total) * 100));
    }

    const sierpinski = (iteracoesRestantes: number, pontoAnterior?: Vertice) => {
        const totalIteracoes = totalIterationsRef.current;
        const pontoAtual: Vertice = pontoAnterior || escolherPontoInicial();
        const pontosJaDesenhados = totalIteracoes - iteracoesRestantes;
        setPercent(calcularPorcentagem(pontosJaDesenhados, totalIteracoes));

        desenharPonto(pontoAtual);

        if (iteracoesRestantes > 0) {
            const verticeAlvo = escolherVerticeTrianguloAleatorio();

            const novoPonto: Vertice = {
                x: (pontoAtual.x + verticeAlvo.x) / 2,
                y: (pontoAtual.y + verticeAlvo.y) / 2
            };

            setTimeout(() => {
                sierpinski(iteracoesRestantes - 1, novoPonto);
            }, ANIMATION_SPEED);
        } else {
            setPercent(100);
        }
    };

    const main = (n: number) => {
        desenharTrianguloInicial(verticesTriangulo);
        sierpinski(n);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 700;
            canvas.height = 700;
        }
    }, []);

    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex flex-col items-center justify-center">
            <div className="container mx-auto max-w-4xl flex flex-col items-center">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Triângulo de Sierpinski</h1>
                    <p className="text-slate-300">Visualização do fractal matemático</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
                    <div className="w-full md:w-1/2 max-w-md">
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
                            <h2 className="text-xl font-semibold text-white mb-4 text-center">Controles</h2>
                            <div className="flex flex-col gap-4 items-center justify-center">
                                {!start && (
                                    <Button
                                        onClick={handleDialog}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        🎯 Iniciar Simulação
                                    </Button>
                                )}

                                {start && percent < 100 && (
                                    <div className="w-full flex flex-col items-center mt-4">
                                        <p className="text-lg font-semibold mb-2 text-slate-200">Progresso: {percent}%</p>
                                        <Progress value={percent} className="w-full h-4 bg-gray-700 rounded-full [&>*]:bg-purple-500" />
                                    </div>
                                )}

                                {start && percent === 100 && (
                                    <div className="w-full flex flex-col items-center mt-4">
                                        <p className="text-lg font-semibold text-green-400">Geração Concluída!</p>
                                        <Button
                                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
                                            onClick={handleDialog}
                                        >
                                            Gerar Novamente
                                        </Button>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mt-4">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-slate-300 text-sm">Sistema Pronto</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 max-w-md">
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 flex justify-center items-center">
                            <div className="bg-white rounded-xl p-4 shadow-inner">
                                <canvas
                                    className="triangulo rounded-lg shadow-lg max-w-full h-auto border border-slate-200"
                                    id="triangulo"
                                    ref={canvasRef}
                                    width="700"
                                    height="700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={openDialog} onOpenChange={handleDialog}>
                <DialogContent className="bg-white/95 backdrop-blur-lg border border-purple-200 rounded-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-800 text-center">
                            ⚙️ Configuração da Simulação
                        </DialogTitle>
                        <p className="text-slate-600 text-center">Digite o número de pontos para gerar o fractal</p>
                    </DialogHeader>
                    <form className="flex flex-col gap-6 mt-4" onSubmit={(e) => {
                        e.preventDefault();
                        handleForm();
                    }}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="numPointsInput" className="text-sm font-medium text-slate-700">Quantidade de Pontos</label>
                            <Input
                                id="numPointsInput"
                                pattern='[1-9]\d*'
                                type="text"
                                placeholder="Ex: 50000"
                                value={input}
                                onChange={e => {
                                    setInput(e.target.value);
                                    if (validationError) {
                                        validateInput(e.target.value);
                                    }
                                }}
                                className={`h-12 text-lg rounded-xl border-2 transition-all duration-300 ${
                                    validationError
                                        ? "border-red-400 focus:border-red-500 bg-red-50"
                                        : "border-slate-300 focus:border-purple-500 bg-white"
                                }`}
                                title="Por favor, insira um número inteiro positivo (ex: 10000)."
                            />
                            {validationError && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                                    <span>⚠️</span>
                                    <span>{validationError}</span>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="gap-3">
                            <Button
                                type="button"
                                onClick={handleDialog}
                                className="px-6 py-3 rounded-xl border-2 border-slate-300 hover:border-slate-400 transition-all duration-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                🚀 Iniciar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
