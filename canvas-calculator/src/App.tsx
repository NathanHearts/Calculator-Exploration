import { useEffect, useLayoutEffect, useRef, useState } from "react"
import DrawCanvas from "./components/canvas"

function App() {
  const [windowDim, setWindowDim] = useState<{h:number,w:number}>({h:0,w:0})
  const displayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    displayRef.current && setWindowDim({
    h:displayRef.current.offsetHeight, 
    w:displayRef.current.offsetWidth
  })},[])

  return (
    <div className="mx-32 my-8">
      <div ref={displayRef} className="w-full h-52">
        <DrawCanvas canvasH={windowDim.h} canvasW={windowDim.w}/>
        <div className="italic text-slate-500 relative left-4 bottom-6">text</div>
      </div>
      <button className="bg-blue-500 text-slate-100 font-bold flex justify-end">
        &rarr;
      </button>
    </div>
  )
}

export default App
