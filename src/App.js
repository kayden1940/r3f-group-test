import { useState, useEffect, useRef, forwardRef, createRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei'
import { useControls, button } from 'leva'
import create from 'zustand'

const useStore = create((set) => ({ target: null, setTarget: (target) => set({ target }) }))

const Box = forwardRef((props, ref) => {
  // useEffect(() => {
  //   console.log('scene', scene)

  //   return () => {
  //     // console.log('scene', scene)
  //     // scene.add(ref)
  //   }
  // }, [scene])

  // const boxRef = useRef()

  const setTarget = useStore((state) => state.setTarget)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      ref={ref}
      {...props}
      onClick={(e) => setTarget(e.object)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      attach={(parent, self) => {
        parent.add(self)
        console.log('parent, self', parent, self)
        return () => parent.remove(self)
      }}>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  )
})

const Group = forwardRef((props, ref) => {
  return <group ref={ref}></group>
})

const Edit = () => {
  const { scene } = useThree()
  const groupRef = useRef()
  const boxRefs = useRef([])
  const [Boxes, setBoxes] = useState([])
  const [Selected, setSelected] = useState([])
  const { mode } = useControls(
    {
      addBox: button((get) => {
        const boxRef = createRef()
        boxRefs.current.push(boxRef)
        setBoxes((prev) => [...prev, <Box ref={boxRef} />])
      }),
      attachAllBoxToGroup: button((get) => {
        setSelected([...Boxes])
        setBoxes([])
      }),
      detachAllBoxFromGroup: button((get) => {})
    },
    [Boxes, Selected]
  )
  
  useEffect(() => {
    console.log('Selected', Selected)
    console.log('scene', scene.children)
  }, [Selected])

  // useEffect(() => {
  //   console.log('Boxes', Boxes)
  // }, [Boxes])

  return (
    <>
      <Group ref={groupRef}>{Selected}</Group>
      {Boxes}
    </>
  )
}

export default function App() {
  // const { target, setTarget } = useStore()

  return (
    <Canvas dpr={[1, 2]} onPointerMissed={() => setTarget(null)}>
      <Edit />
      {/* {target && <TransformControls object={target} mode={mode} />} */}
      <OrbitControls makeDefault />
    </Canvas>
  )
}
