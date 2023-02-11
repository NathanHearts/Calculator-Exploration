import { useEffect, useCallback, useRef, useState } from "react"
import Tesseract from "tesseract.js"
import parseEval from "./calculator"

const { devicePixelRatio: ratio = 1 } = window

function App() {
  const [windowDim, setWindowDim] = useState<{h:number,w:number}>({h:0,w:0})
  const displayRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [recogText, setRecogText] = useState<string>('')
  const [evalText, setEvalText] = useState<string>('')
  const [canvasPng, setCanvasPng] = useState<string>('')


  /*
    Canvas Drawing Functions
  */

  // Helper function to get mouse location
  const getMousePos = (ctx:HTMLCanvasElement, event:React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent) : {x:number,y: number} => {
    const ctxRect = ctx.getBoundingClientRect()
    return({x:event.pageX-ctxRect.left,y:event.pageY-ctxRect.top})
  }

  // When mouse draws creates a line stroke to new line position
  const moveMouse = useCallback((event:MouseEvent) => {
    if (!ctxRef.current || !canvasRef.current) return
    const pos = getMousePos(canvasRef.current, event)
    ctxRef.current.lineTo(pos.x,pos.y)
    ctxRef.current.stroke()
  }, [ctxRef])

  // Stops drawing when mouse goes up
  const stopDraw = useCallback(()=> {
    document.removeEventListener('mousemove',moveMouse)
    document.removeEventListener('mouseup',stopDraw)
    if (canvasRef.current){
      setCanvasPng(canvasRef.current.toDataURL())
    }
  }, [moveMouse])

  // When mouse down start the draw callback function
  // This function gets the mouse position and begins drawing
  // It then listens for movement or mouse going up
  const startDraw = useCallback(
    (event:React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!ctxRef.current || !canvasRef.current) return

      const pos = getMousePos(canvasRef.current, event)
      ctxRef.current.beginPath()
      ctxRef.current.moveTo(pos.x, pos.y)
      document.addEventListener('mousemove',moveMouse)
      document.addEventListener('mouseup', stopDraw)
  },[ctxRef, stopDraw, moveMouse])

  // Function to clear based upon size
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
    context.canvas.width = windowDim.w * ratio
    context.canvas.height = windowDim.h * ratio

    // Drawing options 
    context.lineCap = 'round'
    context.lineWidth = 10
    ctxRef.current = context
  },[windowDim.h,windowDim.w])


  /*
    Window Resizing and dimension setting
  */

  // Initial Windows dimension setting
  useEffect(() => {
    displayRef.current && setWindowDim({
    h:displayRef.current.offsetHeight, 
    w:displayRef.current.offsetWidth
  })},[])

  // Windows resizing events
  useEffect(() => {
    const handleResize = () => displayRef.current && setWindowDim({
      h:displayRef.current.offsetHeight, 
      w:displayRef.current.offsetWidth
    })
    window.addEventListener('resize',handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })


  /*
    Optical Character recognition component
  */

  // Decode Canvas Png and set 
  // equation to state
  useEffect(()=> {
    if (canvasPng){
      Tesseract.recognize(
        canvasPng,
        'eng',
        ).then(({ data: { text } }) => 
          setRecogText(text)
      ).catch(() =>
        setRecogText('')
      )   
    }
  }, [canvasPng])

  // Button event to evaluate text
  const evalRecogText = () => setEvalText(parseEval(recogText))


  return (
    <div className="mx-32 my-8">
      <div ref={displayRef} className="w-full m-2 h-72">
        <canvas
          onMouseDown={startDraw}
          ref={canvasRef}
          className="border-2 border-solid rounded-lg border-slate-700"
        ></canvas>
        <div className="relative border-dotted pointer-events-none border-y-2 h-1/2 bottom-3/4 opacity-30 border-y-slate-700"></div>
        <div className="relative text-3xl italic text-slate-700 left-4 bottom-2/3">{recogText}</div>
      </div>
      <div className="flex justify-end">
        <button className="h-20 mr-1 text-2xl font-bold text-blue-500 border-2 border-blue-500 rounded-lg border-sold w-36 hover:opacity-25" onClick={clear}>
          Clear
        </button>
        <button className="h-20 pb-2 text-5xl font-bold bg-blue-500 rounded-lg text-slate-100 w-36 hover:opacity-25" onClick={evalRecogText}>
          &rarr;
        </button>
      </div>
      <div
         className="relative flex items-center w-1/3 h-20 px-4 pb-2 mx-2 text-5xl border-2 border-dashed rounded-lg border-slate-700 bottom-20">
          = {evalText}
      </div>
    </div>
  )
}

export default App
