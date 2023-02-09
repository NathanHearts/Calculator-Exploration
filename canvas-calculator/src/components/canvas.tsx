import { useCallback, useEffect, useRef } from "react"


const { devicePixelRatio: ratio = 1 } = window;



function DrawCanvas (props:{canvasW:number, canvasH:number}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

    const getMousePos = (ctx:HTMLCanvasElement, event:React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent) : {x:number,y: number} => {
        const ctxRect = ctx.getBoundingClientRect()
        return({x:event.pageX-ctxRect.left,y:event.pageY-ctxRect.top})
    }

    const moveMouse = useCallback((event:MouseEvent) => {
        if (!ctxRef.current || !canvasRef.current) return
        const pos = getMousePos(canvasRef.current, event)
        ctxRef.current.lineTo(pos.x,pos.y)
        ctxRef.current.stroke()
    }, [ctxRef])

    const stopDraw = useCallback(()=> {
        document.removeEventListener('mousemove',moveMouse)
        document.removeEventListener('mouseup',stopDraw)
    }, [moveMouse])

    const startDraw = useCallback(
        (event:React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            if (!ctxRef.current || !canvasRef.current) return

            const pos = getMousePos(canvasRef.current, event)
            ctxRef.current.beginPath()
            ctxRef.current.moveTo(pos.x, pos.y)
            document.addEventListener('mousemove',moveMouse)
            document.addEventListener('mouseup', stopDraw)
    },[ctxRef, stopDraw, moveMouse])

    const clear = () => canvasRef.current && ctxRef.current?.clearRect(
        0,0,
        canvasRef.current.width,
        canvasRef.current.height
    )
    

    // Start up effects
    useEffect(() => {
        if (!canvasRef.current) return
        const context = canvasRef.current.getContext('2d')
        if (!context) return

        // Pixel Density Management
        context.canvas.width = props.canvasW * ratio
        context.canvas.height = props.canvasH * ratio

        // Drawing options 
        context.lineCap = 'round'
        context.lineWidth = 10
        ctxRef.current = context
    },[props.canvasH,props.canvasW])

    return (
        <canvas
            onMouseDown={startDraw}
            ref={canvasRef}
            className="border-solid border-2 border-slate-700"
        ></canvas>
    )
}

export default DrawCanvas